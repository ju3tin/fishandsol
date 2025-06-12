'use client';

import {
  Connection,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import idl from '../../idl/token_sale.json'; // replace with your actual IDL path
import { useState } from 'react';

const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID'); // Replace with actual program ID
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'); // SPL token program

export default function BuyTokenPage() {
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction, signAllTransactions } = useWallet();
  const [amount, setAmount] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const buyTokens = async () => {
    if (!publicKey || !wallet) {
      setMessage('Connect wallet first');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'processed',
      });

      const program = new Program(idl as any, PROGRAM_ID, provider);

      // ⚠️ Replace these with actual values from your app state or backend
      const seller = new PublicKey('SELLER_PUBLIC_KEY');
      const sellerTokenAccount = new PublicKey('SELLER_TOKEN_ACCOUNT');
      const buyerTokenAccount = new PublicKey('BUYER_TOKEN_ACCOUNT'); // create if not exists
      const buyerRequiredTokenAccount = new PublicKey('REQUIRED_TOKEN_ACCOUNT');
      const tokenMint = new PublicKey('TOKEN_MINT');
      const requiredTokenMint = new PublicKey('REQUIRED_TOKEN_MINT');

      const tx = await program.methods
        .buyTokens(new BN(amount))
        .accounts({
          buyer: publicKey,
          seller,
          sellerTokenAccount,
          buyerTokenAccount,
          buyerRequiredTokenAccount,
          tokenMint,
          requiredTokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setMessage(`✅ Transaction successful: ${tx}`);
    } catch (error: any) {
      console.error(error);
      setMessage(`❌ Transaction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Buy Tokens</h1>
      <WalletMultiButton />
      <br /><br />

      <label>
        Amount:
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          style={{ marginLeft: '1rem' }}
        />
      </label>
      <br />
      <button
        onClick={buyTokens}
        disabled={!publicKey || loading}
        style={{ marginTop: '1rem' }}
      >
        {loading ? 'Processing...' : 'Buy Tokens'}
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
