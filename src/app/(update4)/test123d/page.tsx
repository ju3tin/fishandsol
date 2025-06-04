"use client";

import { useState, useEffect, useMemo } from "react";
import { AnchorProvider, Program, BN, Idl, Coder, Provider } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import styles from "./page.module.css";
import type { CrashGame, CrashGameProgram } from "../../../types/crashgame";
import { IDL } from "../../../types/crashgame";

const PROGRAM_ID = new PublicKey("EAbNs7LJmCajXU3cP7dhn5h2SQ4BRx4XgBgZPaKYaujy");
const SEED = 1234;

export default function CrashGame() {
  const { publicKey, wallet, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<CrashGameProgram | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<string>("");
  const [lastOutcome, setLastOutcome] = useState<string>("");
  const [betNonce, setBetNonce] = useState<number>(0);
  const [place1, setPlace1] = useState<string>("what the f");

  useEffect(() => {
    if (publicKey && wallet && signTransaction && signAllTransactions) {
      const anchorWallet = {
        publicKey,
        signTransaction,
        signAllTransactions,
      };
      const newProvider = new AnchorProvider(connection, anchorWallet, {});
      setProvider(newProvider);
      try {
        const newProgram = new Program(IDL as any, newProvider as any, PROGRAM_ID as any) as CrashGameProgram;
        setProgram(newProgram);

        const depositId = newProgram.addEventListener("DepositMade", (event: { player: PublicKey; poolBalance: BN }) => {
          if (event.player.toString() === publicKey.toString()) {
            setBalance(event.poolBalance.toNumber() / 1_000_000_000);
          }
        });
        const gameOutcomeId = newProgram.addEventListener(
          "GameOutcome",
          (event: { player: PublicKey; betAmount: BN; multiplier: number; payout: BN; isWin: boolean; poolBalance: BN }) => {
            if (event.player.toString() === publicKey.toString()) {
              setBalance(event.poolBalance.toNumber() / 1_000_000_000);
              setLastOutcome(
                `Bet: ${(event.betAmount.toNumber() / 1_000_000_000).toFixed(4)} SOL, Multiplier: ${
                  event.multiplier / 100
                }x, Payout: ${(event.payout.toNumber() / 1_000_000_000).toFixed(4)} SOL, ${
                  event.isWin ? "Win" : "Loss"
                }`
              );
            }
          }
        );
        const withdrawalId = newProgram.addEventListener("Withdrawal", (event: { player: PublicKey }) => {
          if (event.player.toString() === publicKey.toString()) {
            setBalance(0);
          }
        });

        return () => {
          newProgram.removeEventListener(depositId);
          newProgram.removeEventListener(gameOutcomeId);
          newProgram.removeEventListener(withdrawalId);
        };
      } catch (err) {
        console.error("Failed to initialize program:", err);
        setGameStatus("Failed to initialize program");
      }
    }
  }, [publicKey, wallet, signTransaction, signAllTransactions, connection]);

  const [game, poolBalance, pool, vault, bet] = useMemo(() => {
    if (!publicKey) {
      return [
        null,
        null,
        Keypair.generate().publicKey,
        null,
        null,
      ] as [PublicKey | null, PublicKey | null, PublicKey, PublicKey | null, PublicKey | null];
    }
    const [gamePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), publicKey.toBuffer(), new BN(SEED).toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );
    const [poolBalancePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey.toBuffer()],
      PROGRAM_ID
    );
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), gamePda.toBuffer()],
      PROGRAM_ID
    );
    const [betPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bet"), gamePda.toBuffer(), publicKey.toBuffer()],
      PROGRAM_ID
    );
    const poolKey = Keypair.generate().publicKey;
    return [gamePda, poolBalancePda, poolKey, vaultPda, betPda];
  }, [publicKey]);

  const initializeGame = async () => {
    if (!program || !publicKey || !provider || !game || !pool) {
      setGameStatus("Wallet not connected or accounts not initialized");
      return;
    }
    try {
      await program.methods
        .initializeGame(new BN(SEED))
        .accounts({
          game,
          pool,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setGameStatus("Game initialized");
    } catch (err) {
      console.error(err);
      setGameStatus("Failed to initialize game");
    }
  };

  const deposit = async () => {
    if (!program || !publicKey || !provider || !game || !pool || !poolBalance) {
      setGameStatus("Wallet not connected or accounts not initialized");
      return;
    }
    const amount = parseFloat(depositAmount) * 1_000_000_000;
    if (isNaN(amount) || amount <= 0) {
      setGameStatus("Invalid deposit amount");
      return;
    }
    try {
      await program.methods
        .depositToPool(new BN(amount))
        .accounts({
          pool_balance: poolBalance,
          pool,
          player: publicKey,
          game,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setGameStatus("Deposit successful");
      setDepositAmount("");
    } catch (err) {
      console.error(err);
      setGameStatus("Deposit failed");
    }
  };

  const queryBalance = async () => {
    if (!program || !publicKey || !provider || !poolBalance) {
      setGameStatus("Wallet not connected or accounts not initialized");
      return;
    }
    try {
      const poolBalanceAccount = await (program.account as any).PoolBalance.fetch(poolBalance);
      setBalance(poolBalanceAccount.amount.toNumber() / 1_000_000_000);
    } catch (err) {
      console.error(err);
      setGameStatus("Failed to query balance");
    }
  };

  const withdraw = async () => {
    if (!program || !publicKey || !provider || !game || !pool || !vault || !bet) {
      setGameStatus("Wallet not connected or accounts not initialized");
      return;
    }
    try {
      await program.methods
        .cashOut(new BN(0))
        .accounts({
          game,
          bet,
          pool_balance: poolBalance!,
          player: publicKey,
          vault,
          pool,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setGameStatus("Withdrawal successful");
    } catch (err) {
      console.error(err);
      setGameStatus("Withdrawal failed");
    }
  };

  useEffect(() => {
    if (!program || !publicKey || !provider || !game || !poolBalance) return;
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = async (event) => {
      const multiplier = parseInt(event.data);
      const betAmount = 50_000;
      const [betPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), publicKey.toBuffer(), new BN(betNonce).toArrayLike(Buffer, "le", 8)],
        PROGRAM_ID
      );
      try {
        await program.methods
          .placeBet(new BN(betAmount))
          .accounts({
            game,
            bet: betPda,
            pool_balance: poolBalance,
            player: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        setGameStatus(`Game started with multiplier: ${multiplier / 100}x`);
        setBetNonce(betNonce + 1);
      } catch (err) {
        console.error(err);
        setGameStatus("Game start failed");
      }
    };
    return () => ws.close();
  }, [program, publicKey, provider, game, poolBalance, betNonce]);

  return (
    <div className={styles.container}>
      <h1>Crash Game</h1>
      <WalletMultiButton />
      {publicKey && (
        <div className={styles.game}>
          <p>Connected: {publicKey.toString()}</p>
          <p>Balance: {balance.toFixed(4)} SOL</p>
          <p>Status: {gameStatus}</p>
          <p>Last Outcome: {lastOutcome}</p>
          <p>Place1: {place1}</p>
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Deposit amount (SOL)"
              className={styles.input}
              step="0.01"
            />
            <button onClick={deposit} className={styles.button}>
              Deposit
            </button>
          </div>
          <button onClick={initializeGame} className={styles.button}>
            Initialize Game
          </button>
          <button onClick={queryBalance} className={styles.button}>
            Query Balance
          </button>
          <button onClick={withdraw} className={styles.button}>
            Withdraw
          </button>
        </div>
      )}
    </div>
  );
}