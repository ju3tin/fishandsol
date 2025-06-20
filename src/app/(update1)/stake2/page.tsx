// File: app/stake/page.tsx (Next.js App Router)

'use client';

import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import idl from '../../../../idl/staking.json';
import { useWallet, ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

const programID = new PublicKey('2PU6KZmJEBmHYqgUX4KsjpbvigBwy4soaLNwzdv1zZ1k');
const network = 'https://api.devnet.solana.com';
const connection = new Connection(network, 'confirmed');

const wallets = [new PhantomWalletAdapter()];

export default function StakePage() {
  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen p-10 bg-gray-900 text-white">
            <WalletMultiButton className="mb-4" />
            <StakeComponent />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function StakeComponent() {
  const wallet = useWallet();
  const [amount, setAmount] = useState('');
  const [program, setProgram] = useState<Program | null>(null);

  useEffect(() => {
    if (wallet.publicKey && wallet.signTransaction) {
      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(idl as any, programID, provider);
      setProgram(program);
    }
  }, [wallet]);

  const handleStake = async () => {
    if (!wallet.publicKey || !program) return;

    const userTokenAccount = new PublicKey('4mk6bGbweUJUyYNdV7FeVGwcS3jzHY4s7Xs8pigP45K8');
    const stakingVault = new PublicKey('3zKUN5mtddcwidaKtRLtihK9qwZv29s9qS1B7iXFAjk9');

    try {
      const tx = await program.methods
        .stake(new BN(amount))
        .accounts({
          user: wallet.publicKey,
          userTokenAccount,
          stakingVault,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      console.log('Staked. Tx:', tx);
    } catch (err) {
      console.error('Stake failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-2xl shadow-xl">
      <h1 className="text-xl font-bold mb-4">Stake Tokens</h1>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 rounded mb-4 text-black"
      />
      <button
        onClick={handleStake}
        className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700"
      >
        Stake
      </button>
    </div>
  );
}
