import { useState, useEffect } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import { io, Socket } from 'socket.io-client';
import Head from 'next/head';

// Define IDL type (manually extracted from crash_game.rs or fetched at runtime)
interface CrashGameIdl extends Idl {
  instructions: any[];
  accounts: any[];
  errors: any[];
}

// Type for WebSocket game state updates
interface GameState {
  multiplier: number;
  isActive: boolean;
  crashed: boolean;
}

export default function CrashGame() {
  const [wallet, setWallet] = useState<any>(null);
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<Program<CrashGameIdl> | null>(null);
  const [status, setStatus] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');
  const [multiplier, setMultiplier] = useState<number>(1_000);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [crashed, setCrashed] = useState<boolean>(false);
  const [potentialPayout, setPotentialPayout] = useState<number>(0);
  const [hasBet, setHasBet] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    socketInstance.on('multiplierUpdate', ({ multiplier, isActive, crashed }: GameState) => {
      setMultiplier(multiplier);
      setIsGameActive(isActive);
      setCrashed(crashed);
      if (hasBet && betAmount) {
        setPotentialPayout(parseFloat(betAmount) * (multiplier / 1000));
      }
      if (crashed) {
        setStatus('Game crashed!');
        setHasBet(false);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [hasBet, betAmount]);

  const connectWallet = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        await window.solana.connect();
        const wallet = window.solana;
        setWallet(wallet);
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
        const idl = await Program.fetchIdl<CrashGameIdl>(PROGRAM_ID, provider);
        if (!idl) {
          setStatus('Failed to fetch program IDL');
          return;
        }
        const program = new Program<CrashGameIdl>(idl, PROGRAM_ID, provider);
        setProvider(provider);
        setProgram(program);
        setStatus('Wallet connected!');
      } catch (err: any) {
        setStatus('Error connecting wallet: ' + err.message);
      }
    } else {
      setStatus('Please install Phantom Wallet');
    }
  };

  const placeBet = async () => {
    if (!program || !wallet) {
      setStatus('Connect wallet first!');
      return;
    }
    const amount = parseFloat(betAmount) * 1_000_000_000; // SOL to lamports
    if (amount < 10_000_000) {
      setStatus('Minimum bet is 0.01 SOL');
      return;
    }

    const gamePda = PublicKey.findProgramAddressSync(
      [Buffer.from('game'), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    )[0];
    const betPda = PublicKey.findProgramAddressSync(
      [Buffer.from('bet'), gamePda.toBuffer(), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    )[0];
    const escrowPda = PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), gamePda.toBuffer()],
      PROGRAM_ID
    )[0];

    try {
      await program.methods
        .placeBet(new anchor.BN(amount))
        .accounts({
          game: gamePda,
          bet: betPda,
          player: wallet.publicKey,
          escrow: escrowPda,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      setStatus('Bet placed successfully!');
      setHasBet(true);
    } catch (err: any) {
      setStatus('Error placing bet: ' + err.message);
    }
  };

  const cashOut = async () => {
    if (!program || !wallet) {
      setStatus('Connect wallet first!');
      return;
    }
    if (!hasBet) {
      setStatus('Place a bet first!');
      return;
    }

    const response = await fetch('http://localhost:3000/current-multiplier');
    const { multiplier, isActive, crashed }: GameState = await response.json();
    if (!isActive || crashed) {
      setStatus('Cannot cash out: Game is not active or has crashed');
      return;
    }

    const gamePda = PublicKey.findProgramAddressSync(
      [Buffer.from('game'), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    )[0];
    const betPda = PublicKey.findProgramAddressSync(
      [Buffer.from('bet'), gamePda.toBuffer(), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    )[0];
    const escrowPda = PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), gamePda.toBuffer()],
      PROGRAM_ID
    )[0];

    try {
      await program.methods
        .cashOut(new anchor.BN(multiplier))
        .accounts({
          game: gamePda,
          bet: betPda,
          player: wallet.publicKey,
          escrow: escrowPda,
          authority: wallet.publicKey,
        })
        .rpc();
      setStatus(`Cashed out at ${(multiplier / 1000).toFixed(2)}x!`);
      setHasBet(false);
    } catch (err: any) {
      setStatus('Error cashing out: ' + err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Solana Crash Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-6">Solana Crash Game</h1>
        <button
          onClick={connectWallet}
          disabled={!!wallet}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600 disabled:bg-gray-400"
        >
          {wallet ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
        <div className="flex items-center mb-4">
          <input
            type="number"
            placeholder="Bet Amount (SOL)"
            step="0.01"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            className="border p-2 mr-2 rounded"
            disabled={hasBet}
          />
          <button
            onClick={placeBet}
            disabled={hasBet || !wallet}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Place Bet
          </button>
        </div>
        <div className="text-3xl font-semibold mb-4">
          Multiplier: {(multiplier / 1000).toFixed(2)}x
        </div>
        {hasBet && (
          <div className="text-2xl text-green-600 mb-4">
            Potential Payout: {potentialPayout.toFixed(2)} SOL
          </div>
        )}
        <button
          onClick={cashOut}
          disabled={!hasBet || !isGameActive || crashed || !wallet}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          Cash Out
        </button>
        <p className="text-red-500 mt-4">{status}</p>
      </div>
    </>
  );
}
