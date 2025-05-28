"use client"
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import { useState, useEffect, useMemo } from "react";
import { CrashGame, IDL } from "./idl";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Require CSS for wallet adapter UI
require("@solana/wallet-adapter-react-ui/styles.css");

const programId = new PublicKey("3YBVhgxgzCwHSTnzguWkqZgrooHigbi91n9ThZ7EMcjn");

export default function Home() {
    const { wallet, publicKey, signTransaction } = useWallet();
    const [gamePda, setGamePda] = useState<PublicKey | null>(null);
    const [poolBalance, setPoolBalance] = useState(0);
    const [multiplier, setMultiplier] = useState(1.0);
    const [gameStatus, setGameStatus] = useState("waiting");
    const [crashPoint, setCrashPoint] = useState(0);

    // WebSocket setup
    useEffect(() => {
        const ws = new WebSocket("wss://your-websocket-server");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMultiplier(data.multiplier / 100);
            setGameStatus(data.game_status);
            setCrashPoint(data.crash_point / 100);
        };
        return () => ws.close();
    }, []);

    // Set up provider
    const provider = useMemo(() => {
        const adapter = wallet?.adapter;

        if (
            !adapter ||
            typeof adapter.publicKey === "undefined" ||
            typeof adapter.signTransaction !== "function" ||
            typeof adapter.signAllTransactions !== "function"
        ) {
            return null;
        }

        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const anchorWallet = {
            publicKey: adapter.publicKey,
            signTransaction: adapter.signTransaction.bind(adapter),
            signAllTransactions: adapter.signAllTransactions.bind(adapter),
        };

        return new AnchorProvider(connection, anchorWallet, {
            preflightCommitment: "confirmed",
        });
    }, [wallet]);

    const initializeGame = async () => {
        if (!provider || !publicKey) {
            alert("Wallet not connected");
            return;
        }

        const program = new Program(IDL, programId, provider);
        const seed = Math.floor(Math.random() * 10000);
        const [pda, bump] = await PublicKey.findProgramAddress(
            [Buffer.from("game"), publicKey.toBuffer(), Buffer.from(seed.toString())],
            programId
        );

        console.log("initializeGame PDA:", pda.toBase58());

        const pool = web3.Keypair.generate();

        try {
            await program.methods
                .initializeGame(seed)
                .accounts({
                    game: pda,
                    pool: pool.publicKey,
                    authority: publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();
            setGamePda(pda);
            alert("Game initialized!");
        } catch (error) {
            console.error("Failed to initialize game:", error);
            alert("Failed to initialize game");
        }
    };

    const depositToPool = async () => {
        if (!provider || !publicKey || !gamePda) {
            alert("Wallet not connected or game not initialized");
            return;
        }

        const program = new Program(IDL, programId, provider);
        const amount = 0.1 * web3.LAMPORTS_PER_SOL;
        const [poolBalancePda] = await PublicKey.findProgramAddress(
            [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );

        console.log("depositToPool poolBalancePda:", poolBalancePda.toBase58());
        console.log("depositToPool gamePda:", gamePda.toBase58());

        try {
            const gameAccount = await (program.account as any).game.fetch(gamePda);
            const pool = gameAccount.pool;

            await program.methods
                .depositToPool(new BN(amount))
                .accounts({
                    pool_balance: poolBalancePda,
                    pool,
                    player: publicKey,
                    game: gamePda,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            setPoolBalance(poolBalance + amount);
            alert("Deposited to pool!");
        } catch (error) {
            console.error("Failed to deposit to pool:", error);
            alert("Failed to deposit to pool");
        }
    };

    const placeBet = async () => {
        if (!provider || !publicKey || !gamePda || gameStatus !== "waiting") {
            alert("Wallet not connected, game not initialized, or invalid game status");
            return;
        }

        const program = new Program(IDL, programId, provider);
        const amount = 0.01 * web3.LAMPORTS_PER_SOL;
        const [betPda] = await PublicKey.findProgramAddress(
            [Buffer.from("bet"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );
        const [poolBalancePda] = await PublicKey.findProgramAddress(
            [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );

        console.log("placeBet betPda:", betPda.toBase58());
        console.log("placeBet poolBalancePda:", poolBalancePda.toBase58());
        console.log("placeBet gamePda:", gamePda.toBase58());

        try {
            await program.methods
                .placeBet(new BN(amount))
                .accounts({
                    game: gamePda,
                    bet: betPda,
                    pool_balance: poolBalancePda,
                    player: publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            setPoolBalance(poolBalance - amount);
            alert("Bet placed!");
        } catch (error) {
            console.error("Failed to place bet:", error);
            alert("Failed to place bet");
        }
    };

    const cashOut = async () => {
        if (!provider || !publicKey || !gamePda || gameStatus !== "running") {
            alert("Wallet not connected, game not initialized, or invalid game status");
            return;
        }

        const program = new Program(IDL, programId, provider);
        const [betPda] = await PublicKey.findProgramAddress(
            [Buffer.from("bet"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );
        const [poolBalancePda] = await PublicKey.findProgramAddress(
            [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );

        console.log("cashOut betPda:", betPda.toBase58());
        console.log("cashOut poolBalancePda:", poolBalancePda.toBase58());
        console.log("cashOut gamePda:", gamePda.toBase58());

        try {
            const gameAccount = await program.account.game.fetch(gamePda);
            const vault = gameAccount.pool; // Note: Adjust if vault is separate

            await program.methods
                .cashOut(Math.floor(multiplier * 100))
                .accounts({
                    game: gamePda,
                    bet: betPda,
                    pool_balance: poolBalancePda,
                    player: publicKey,
                    vault,
                    pool: vault,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            alert("Cashed out!");
        } catch (error) {
            console.error("Failed to cash out:", error);
            alert("Failed to cash out");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <WalletMultiButton />
            <h2>Crash Game</h2>
            <p>Pool Balance: {(poolBalance / web3.LAMPORTS_PER_SOL).toFixed(4)} SOL</p>
            <p>Game Status: {gameStatus}</p>
            <p>Current Multiplier: {multiplier.toFixed(2)}x</p>
            <p>Crash Point: {crashPoint.toFixed(2)}x</p>
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={initializeGame}
                    disabled={!publicKey}
                    style={{ marginRight: "10px", padding: "10px" }}
                >
                    Initialize Game
                </button>
                <button
                    onClick={depositToPool}
                    disabled={!publicKey || !gamePda}
                    style={{ marginRight: "10px", padding: "10px" }}
                >
                    Deposit 0.1 SOL to Pool
                </button>
                <button
                    onClick={placeBet}
                    disabled={!publicKey || gameStatus !== "waiting" || poolBalance < 0.01 * web3.LAMPORTS_PER_SOL}
                    style={{ marginRight: "10px", padding: "10px" }}
                >
                    Place Bet (0.01 SOL)
                </button>
                <button
                    onClick={cashOut}
                    disabled={!publicKey || gameStatus !== "running" || multiplier >= crashPoint}
                    style={{ padding: "10px" }}
                >
                    Cash Out at {multiplier.toFixed(2)}x
                </button>
            </div>
        </div>
    );
}

// Wrap the Home component with wallet providers
export function WrappedHome() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <WalletModalProvider>
            <WalletMultiButton />
            <Home />
        </WalletModalProvider>
    );
}