use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("97wCxKPKifEEUqNV7LAUVqzmCsXzYR88eZjYuKqTk5BY");

#[program]
pub mod flwr_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let staking_config = &mut ctx.accounts.staking_config;
        staking_config.admin = *ctx.accounts.admin.key;

        staking_config.tiers = vec![
            StakingTier {
                duration: 4 * 30 * 24 * 60 * 60,
                reward_rate: 103,
                penalty_rate: 6,
            }, // 4 months
            StakingTier {
                duration: 6 * 30 * 24 * 60 * 60,
                reward_rate: 106,
                penalty_rate: 12,
            }, // 6 months
            StakingTier {
                duration: 12 * 30 * 24 * 60 * 60,
                reward_rate: 110,
                penalty_rate: 24,
            }, // 12 months
        ];

        Ok(())
    }

    pub fn stake_flwr(ctx: Context<StakeFLWR>, amount: u64, tier_index: u8) -> Result<()> {
        require!(
            tier_index < ctx.accounts.staking_config.tiers.len() as u8,
            StakingError::InvalidTier
        );

        let stake_account = &mut ctx.accounts.stake_account;
        let clock = Clock::get()?;

        stake_account.owner = *ctx.accounts.user.key;
        stake_account.amount = amount;
        stake_account.start_time = clock.unix_timestamp;
        stake_account.tier_index = tier_index;

        // Transfer staked tokens from user to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        let stake_account = &mut ctx.accounts.stake_account;
        let config = &ctx.accounts.staking_config;
        let clock = Clock::get()?;

        require!(
            stake_account.owner == *ctx.accounts.user.key,
            StakingError::Unauthorized
        );

        let tier = &config.tiers[stake_account.tier_index as usize];
        let staking_end = stake_account.start_time + tier.duration;

        let mut payout = stake_account.amount;

        if clock.unix_timestamp >= staking_end {
            // Apply reward
            payout = payout * tier.reward_rate as u64 / 100;
        } else {
            // Apply penalty for early unstaking
            let penalty = payout * tier.penalty_rate as u64 / 100;
            payout -= penalty;
        }

        // Transfer payout from vault to user
        let seeds: &[&[&[u8]]] = &[];
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            seeds,
        );
        token::transfer(cpi_ctx, payout)?;

        // Reset the stake account
        stake_account.amount = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 4 + (StakingTier::MAX_SIZE * 3))]
    pub staking_config: Account<'info, StakingConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeFLWR<'info> {
    #[account(init, payer = user, space = 8 + StakeAccount::MAX_SIZE)]
    pub stake_account: Account<'info, StakeAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_account: Account<'info, TokenAccount>,
    pub staking_config: Account<'info, StakingConfig>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub stake_account: Account<'info, StakeAccount>,
    #[account(mut, address = stake_account.owner)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_account: Account<'info, TokenAccount>,
    /// CHECK: This can be replaced with a PDA-based authority later
    pub vault_authority: UncheckedAccount<'info>,
    pub staking_config: Account<'info, StakingConfig>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct StakingConfig {
    pub admin: Pubkey,
    pub tiers: Vec<StakingTier>,
}

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub amount: u64,
    pub start_time: i64,
    pub tier_index: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct StakingTier {
    pub duration: i64,
    pub reward_rate: u8,
    pub penalty_rate: u8,
}

impl StakingTier {
    pub const MAX_SIZE: usize = 8 + 1 + 1;
}

impl StakeAccount {
    pub const MAX_SIZE: usize = 32 + 8 + 8 + 1;
}

#[error_code]
pub enum StakingError {
    #[msg("Invalid staking tier selected.")]
    InvalidTier,
    #[msg("Unauthorized action.")]
    Unauthorized,
}
