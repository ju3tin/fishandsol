import { useState, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, Wallet, web3, BN } from '@project-serum/anchor';
import idl from '../app/(update1)/test123/idl.json';

export default function MintCreatorForm() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [txSignature, setTxSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Program ID from your declare_id!
  const PROGRAM_ID = new PublicKey("4wJUM42cvcGsw6bgky4hcXG2pYAhMCY5u2khsNHp8XFr");
  
  // SPL Token program ID
  const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

  const createMint = useCallback(async () => {
    if (!wallet.publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError("");
    setTxSignature("");

    try {
      // Create provider
      const provider = new AnchorProvider(
        connection, 
        wallet as any,
        { preflightCommitment: 'confirmed' }
      );
      
      // Create program with the imported IDL
      const program = new Program(idl, PROGRAM_ID, provider);

      // Find PDA for mint
      const [mintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint")],
        PROGRAM_ID
      );

      console.log("Mint PDA:", mintPda.toString());

      // Execute the transaction
      const tx = await program.methods
        .createMint()
        .accounts({
          signer: wallet.publicKey,
          mint: mintPda,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      setTxSignature(tx);
      console.log("Transaction signature:", tx);
    } catch (err) {
      console.error("Error creating mint:", err);
      setError((err as any).message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [wallet, connection]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Solana Token Mint</h1>
      
      <div className="mb-6 flex justify-center">
        <WalletMultiButton />
      </div>
      
      {wallet.connected && (
        <div className="mb-4 text-center">
          <p className="text-gray-700">Connected: {wallet.publicKey?.toString().slice(0, 8)}...{wallet.publicKey?.toString().slice(-8)}</p>
        </div>
      )}
      
      <button
        onClick={createMint}
        disabled={loading || !wallet.connected}
        className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
          loading || !wallet.connected 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Processing...' : 'Create Mint'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {txSignature && (
        <div className="mt-4">
          <p className="font-semibold text-green-600">Transaction successful!</p>
          <p className="text-sm mt-2 break-all">
            Signature: {txSignature}
          </p>
          <a 
            href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-indigo-600 hover:underline"
          >
            View on Solana Explorer
          </a>
        </div>
      )}
    </div>
  );
}