"use client";

import { useState, useEffect, useMemo } from "react";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { useWallet, WalletMultiButton } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import styles from "../styles/Home.module.css";
import { CrashGame } from "../../target/types/crash_game";
import IDL from "../../target/idl/crash_game.json";

const PROGRAM_ID = new PublicKey("EAbNs7LJmCajXU3cP7dhn5h2SQ4BRx4XgBgZPaKYaujy");
const SEED = 1234;

export default function CrashGame() {
  const { publicKey, wallet } = useWallet();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<Program<CrashGame> | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<string>("");
  const [lastOutcome, setLastOutcome] = useState<string>("");
  const [betNonce, setBetNonce] = useState<number>(0);

  useEffect(() => {
    if (publicKey && wallet) {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const newProvider = new AnchorProvider(connection, wallet, {});
      setProvider(newProvider);
      const newProgram = new Program<CrashGame>(IDL, PROGRAM_ID, newProvider);
      setProgram(newProgram);

      newProgram.addEventListener("DepositMade", (event) => {
        if (event.player.toString() === publicKey.toString()) {
          setBalance(event.poolBalance.toNumber() / 1_000_000_000);
        }
      });
      newProgram.addEventListener("GameOutcome", (event) => {
        if (event.player.toString() === publicKey.toString()) {
          setBalance(event.poolBalance.toNumber() / 1_000_000_000);
          setLastOutcome(
            `Bet: ${(event.betAmount / 1_000_000_000).toFixed(4)} SOL, Multiplier: ${
              event.multiplier / 100
            }x, Payout: ${(event.payout / 1_000_000_000).toFixed(4)} SOL, ${
              event.isWin ? "Win" : "Loss"
            }`
          );
        }
      });
      newProgram.addEventListener("Withdrawal", (event) => {
        if (event.player.toString() === publicKey.toString()) {
          setBalance(0);
        }
      });
    }
  }, [publicKey, wallet]);

  const [game, poolBalance, pool, vault] = useMemo(() => {
    const [gamePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("game"), publicKey?.toBuffer() || Buffer.alloc(32), new BN(SEED).toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID
    );
    const [poolBalancePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey?.toBuffer() || Buffer.alloc(32)],
      PROGRAM_ID
    );
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), gamePda.toBuffer()],
      PROGRAM_ID
    );
    const poolKey = Keypair.generate();
    return [gamePda, poolBalancePda, poolKey, vaultPda];
  }, [publicKey]);

  const initializeGame = async () => {
    if (!program || !publicKey || !provider) throw new WalletNotConnectedError();
    try {
      await program.methods
        .initializeGame(new BN(SEED))
        .accounts({
          game,
          pool: pool.publicKey,
          vault,
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
    if (!program || !publicKey || !provider) throw new WalletNotConnectedError();
    const amount = parseFloat(depositAmount) * 1_000_000_000;
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid deposit amount");
      return;
    }
    try {
      await program.methods
        .depositToPool(new BN(amount))
        .accounts({
          poolBalance,
          pool: pool.publicKey,
          player: publicKey,
          game,
          systemProgram: SystemProgram.programId,
          authority: publicKey,
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
    if (!program || !publicKey || !provider) throw new WalletNotConnectedError();
    try {
      await program.methods
        .getPoolBalance()
        .accounts({
          game,
          poolBalance,
          player: publicKey,
          authority: publicKey,
        })
        .rpc();
      const poolBalanceAccount = await program.account.poolBalance.fetch(poolBalance);
      setBalance(poolBalanceAccount.amount.toNumber() / 1_000_000_000);
    } catch (err) {
      console.error(err);
      setBalance(0);
    }
  };

  const withdraw = async () => {
    if (!program || !publicKey || !provider) throw new WalletNotConnectedError();
    try {
      await program.methods
        .withdraw()
        .accounts({
          game,
          poolBalance,
          player: publicKey,
          pool: pool.publicKey,
          systemProgram: SystemProgram.programId,
          authority: publicKey,
        })
        .rpc();
      setGameStatus("Withdrawal successful");
    } catch (err) {
      console.error(err);
      setGameStatus("Withdrawal failed");
    }
  };

  useEffect(() => {
    if (!program || !publicKey || !provider) return;
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = async (event) => {
      const multiplier = parseInt(event.data);
      const betAmount = 50_000;
      const [bet] = PublicKey.findProgramAddressSync(
        [Buffer.from("bet"), game.toBuffer(), publicKey.toBuffer(), new BN(betNonce).toArrayLike(Buffer, "le", 8)],
        PROGRAM_ID
      );
      try {
        await program.methods
          .startGame(new BN(betAmount), multiplier, new BN(betNonce))
          .accounts({
            game,
            bet,
            poolBalance,
            player: publicKey,
            vault,
            pool: pool.publicKey,
            systemProgram: SystemProgram.programId,
            authority: publicKey,
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
  }, [program, publicKey, provider, game, poolBalance, pool, vault, betNonce]);

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
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Deposit amount (SOL)"
              className={styles.input}
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