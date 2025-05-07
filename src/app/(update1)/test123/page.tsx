import { useCallback } from 'react';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import {
  useAnchorWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import {
  AnchorProvider,
  Program,
  web3,
} from '@coral-xyz/anchor';
import type { Idl } from '@coral-xyz/anchor';
import rawIdl from './idl.json';
const idl = rawIdl as unknown as Idl; // Ensure this JSON file exists
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const PROGRAM_ID = new PublicKey('4wJUM42cvcGsw6bgky4hcXG2pYAhMCY5u2khsNHp8XFr');
const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export default function Home() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const createMint = useCallback(async () => {
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: 'processed',
    });

    const program = new Program(idl as Idl, PROGRAM_ID, provider);

    const [mintPda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from('mint')],
      PROGRAM_ID
    );

    try {
      const tx = await program.methods
        .createMint()
        .accounts({
          signer: provider.wallet.publicKey,
          mint: mintPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      alert(`✅ Success! Transaction signature: ${tx}`);
      console.log('Transaction:', tx);
    } catch (error: any) {
      console.error('Error creating mint:', error);
      alert(`Error: ${error.message}`);
    }
  }, [wallet, connection]);

  return (
    <div style={{ padding: 32 }}>
      <h1>Create Mint on Solana Devnet</h1>
      <WalletMultiButton />
      <button
        onClick={createMint}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          backgroundColor: '#6366f1',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
        disabled={!wallet}
      >
        Create Mint
      </button>
    </div>
  );
}
