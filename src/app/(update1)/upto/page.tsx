"use client" 
import { useEffect, useState } from 'react';
import { Program, AnchorProvider, web3, BN, Wallet } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import idl from '../../../../lib/west2.json'; // Import the IDL file


const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID_HERE');
const network = 'https://api.devnet.solana.com';
const connection = new Connection(network, 'confirmed');


type Game = {
  authority: PublicKey;
  maxPlayers: number;
  currentPlayers: number;
  multiplier: BN;
  isActive: boolean;
  crashPoint: BN;
};

export default function CrashGamePage() {
  const wallet = useWallet();
  const [provider, setProvider] = useState<AnchorProvider | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [status, setStatus] = useState('Disconnected');

  useEffect(() => {
    if (!wallet?.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return;

    // Wrap wallet object to satisfy Wallet interface
    const walletObj: Wallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      payer: {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      },
    };

    const provider = new AnchorProvider(connection, walletObj, { commitment: 'confirmed' });
    const loadedProgram = new Program(idl as any, PROGRAM_ID, provider);

    setProvider(provider);
    setProgram(loadedProgram);
    setStatus('Wallet connected!');
  }, [wallet]);

  const placeBet = async (amount: number, game: PublicKey, escrow: PublicKey, bet: PublicKey) => {
    if (!program || !wallet.publicKey) return;

    try {
      await program.methods
        .placeBet(new BN(amount))
        .accounts({
          game,
          bet,
          player: wallet.publicKey,
          escrow,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      setStatus('Bet placed!');
    } catch (err) {
      console.error('Error placing bet:', err);
      setStatus('Error placing bet');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Crash Game</h1>
      <p>Status: {status}</p>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          const dummyGame = new PublicKey('...'); // replace with actual
          const dummyEscrow = new PublicKey('...');
          const dummyBet = new PublicKey('...');
          placeBet(1000, dummyGame, dummyEscrow, dummyBet);
        }}
      >
        Place Bet
      </button>
    </div>
  );
}

