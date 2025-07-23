use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use std::convert::TryInto;

declare_id!("547rLiMZJMFCFxqwox5BoTtSmwy5wuZuitQPDqgnutqi");

#[program]
pub mod staking_program {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, allowed_mints: Vec<Pubkey>) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.allowed_mints = allowed_mints;
        pool.total_staked = 0;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64, lockup_period: LockupPeriod) -> Result<()> {
        let pool = &ctx.accounts.pool;
        let stake_account = &mut ctx.accounts.stake_account;

        // Validate token mint
        require!(
            pool.allowed_mints.contains(&ctx.accounts.token_mint.key()),
            StakingError::InvalidTokenMint
        );

        // Validate amount
        require!(amount > 0, StakingError::InvalidAmount);

        // Transfer tokens to stake vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.stake_vault.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        // Initialize stake account
        stake_account.user = ctx.accounts.user.key();
        stake_account.pool = ctx.accounts.pool.key();
        stake_account.token_mint = ctx.accounts.token_mint.key();
        stake_account.amount = amount;
        stake_account.lockup_period = lockup_period;
        stake_account.stake_time = Clock::get()?.unix_timestamp;
        stake_account.reward_claimed = false;

        // Update pool total
        ctx.accounts.pool.total_staked = ctx.accounts.pool.total_staked.checked_add(amount).ok_or(StakingError::Overflow)?;

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        let pool = &ctx.accounts.pool;

        // Validate stake account
        require!(stake_account.user == ctx.accounts.user.key(), StakingError::InvalidUser);
        require!(!stake_account.reward_claimed, StakingError::RewardAlreadyClaimed);

        // Check if lockup period has passed
        let current_time = Clock::get()?.unix_timestamp;
        let lockup_duration = stake_account.lockup_period.get_duration();
        require!(
            current_time >= stake_account.stake_time + lockup_duration,
            StakingError::LockupNotEnded
        );

        // Calculate reward
        let reward = calculate_reward(
            stake_account.amount,
            stake_account.lockup_period.get_apy(),
            lockup_duration,
        )?;

        // Transfer staked amount + reward back to user
        let total_amount = stake_account.amount.checked_add(reward).ok_or(StakingError::Overflow)?;

        let seeds = &[b"pool", pool.authority.as_ref(), &[ctx.bumps.pool]];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.stake_vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.pool.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(
            CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
            total_amount,
        )?;

        // Update pool and stake account
        ctx.accounts.pool.total_staked = ctx.accounts.pool.total_staked.checked_sub(stake_account.amount).ok_or(StakingError::Underflow)?;
        stake_account.reward_claimed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 32 * 10 + 8, // Discriminator + authority + allowed_mints (vec) + total_staked
        seeds = [b"pool", authority.key().as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(
        mut,
        seeds = [b"pool", pool.authority.as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 32 + 8 + 1 + 8 + 1, // Discriminator + user + pool + token_mint + amount + lockup_period + stake_time + reward_claimed
        seeds = [b"stake", user.key().as_ref(), pool.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,
    #[account(mut)]
    pub stake_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [b"pool", pool.authority.as_ref()],
        bump
    )]
    pub pool: Account<'info, Pool>,
    #[account(
        mut,
        seeds = [b"stake", user.key().as_ref(), pool.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,
    #[account(mut)]
    pub stake_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Pool {
    pub authority: Pubkey,
    pub allowed_mints: Vec<Pubkey>,
    pub total_staked: u64,
}

#[account]
pub struct StakeAccount {
    pub user: Pubkey,
    pub pool: Pubkey,
    pub token_mint: Pubkey,
    pub amount: u64,
    pub lockup_period: LockupPeriod,
    pub stake_time: i64,
    pub reward_claimed: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum LockupPeriod {
    OneMonth,
    ThreeMonths,
    SixMonths,
    OneYear,
}

impl LockupPeriod {
    pub fn get_duration(&self) -> i64 {
        match self {
            LockupPeriod::OneMonth => 30 * 24 * 60 * 60, // 30 days in seconds
            LockupPeriod::ThreeMonths => 90 * 24 * 60 * 60,
            LockupPeriod::SixMonths => 180 * 24 * 60 * 60,
            LockupPeriod::OneYear => 365 * 24 * 60 * 60,
        }
    }

    pub fn get_apy(&self) -> f64 {
        match self {
            LockupPeriod::OneMonth => 0.05,
            LockupPeriod::ThreeMonths => 0.15,
            LockupPeriod::SixMonths => 0.20,
            LockupPeriod::OneYear => 0.30,
        }
    }
}

fn calculate_reward(amount: u64, apy: f64, duration: i64) -> Result<u64> {
    let seconds_in_year = 365.0 * 24.0 * 60.0 * 60.0;
    let time_fraction = duration as f64 / seconds_in_year;
    let reward = (amount as f64 * apy * time_fraction).round() as u64;
    Ok(reward)
}

#[error_code]
pub enum StakingError {
    #[msg("Invalid token mint")]
    InvalidTokenMint,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Invalid user")]
    InvalidUser,
    #[msg("Lockup period has not ended")]
    LockupNotEnded,
    #[msg("Reward already claimed")]
    RewardAlreadyClaimed,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
}