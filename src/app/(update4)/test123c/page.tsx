"sue client"
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

import { useState, useEffect } from "react";
import idl from "./idl.json";

const programId = new PublicKey("YOUR_PROGRAM_ID_HERE");

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

    const getProvider = () => {
        if (!wallet || !publicKey || !signTransaction) return null;
        const connection = new web3.Connection(
            web3.clusterApiUrl("devnet"),
            "confirmed"
        );
        return new AnchorProvider(connection, wallet, {});
    };

    const depositToPool = async () => {
        const provider = getProvider();
        if (!provider || !gamePda) return;

        const program = new Program(idl, programId, provider);
        const amount = 0.1 * web3.LAMPORTS_PER_SOL;
        const [poolBalancePda] = await PublicKey.findProgramAddress(
            [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );

        await program.methods
            .depositToPool(new BN(amount))
            .accounts({
                pool_balance: poolBalancePda,
                pool: (await program.account.game.fetch(gamePda)).pool,
                player: publicKey,
                game: gamePda,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();

        setPoolBalance(poolBalance + amount);
        alert("Deposited to pool!");
    };

    const placeBet = async () => {
        const provider = getProvider();
        if (!provider || !gamePda || gameStatus !== "waiting") return;

        const program = new Program(idl, programId, provider);
        const amount = 0.01 * web3.LAMPORTS_PER_SOL;
        const [betPda] = await PublicKey.findProgramAddress(
            [Buffer.from("bet"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );
        const [poolBalancePda] = await PublicKey.findProgramAddress(
            [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );

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
    };

    const cashOut = async () => {
        const provider = getProvider();
        if (!provider || !gamePda || gameStatus !== "running") return;

        const program = new Program(idl, programId, provider);
        const [betPda] = await PublicKey.findProgramAddress(
            [Buffer.from("bet"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );
        const [poolBalancePda] = await PublicKey.findProgramAddress(
            [Buffer.from("pool_balance"), gamePda.toBuffer(), publicKey.toBuffer()],
            programId
        );

        await program.methods
            .cashOut(multiplier * 100)
            .accounts({
                game: gamePda,
                bet: betPda,
                pool_balance: poolBalancePda,
                player: publicKey,
                vault: (await program.account.game.fetch(gamePda)).pool, // Adjust if vault is separate
                pool: (await program.account.game.fetch(gamePda)).pool,
                systemProgram: web3.SystemProgram.programId,
            })
            .rpc();

        alert("Cashed out!");
    };

    return (
        <div>
            <WalletMultiButton />
            <p>Pool Balance: {poolBalance / web3.LAMPORTS_PER_SOL} SOL</p>
            <button onClick={depositToPool} disabled={!publicKey || !gamePda}>
                Deposit 0.1 SOL to Pool
            </button>
            <button onClick={placeBet} disabled={!publicKey || gameStatus !== "waiting" || poolBalance < 0.01 * web3.LAMPORTS_PER_SOL}>
                Place Bet (0.01 SOL)
            </button>
            <button onClick={cashOut} disabled={!publicKey || gameStatus !== "running" || multiplier >= crashPoint}>
                Cash Out at {multiplier}x
            </button>
            <p>Game Status: {gameStatus}</p>
            <p>Current Multiplier: {multiplier}x</p>
            <p>Crash Point: {crashPoint}x</p>
        </div>
    );
}