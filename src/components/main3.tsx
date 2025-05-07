// pages/index.tsx
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Constants
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
const TOKEN_PROGRAM_ID = new PublicKey('HjrH39SYEHmko6pXKtQGm6eSsY6xKRnbUitAYQsFWTMe');
const idl = {
  "version": "0.1.0",
  "name": "token_example",
  "instructions": [
    {
      "name": "createMint",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "mintTokens",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipient",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createCustomMint",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "string"
        },
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    }
  ]
};

export default function Home() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState<Program | null>(null);
  
  // Form states
  const [tokenSeed, setTokenSeed] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(6);
  const [mintAmount, setMintAmount] = useState(1000);
  const [recipient, setRecipient] = useState('');
  const [usingDefaultMint, setUsingDefaultMint] = useState(true);
  const [mintPubkey, setMintPubkey] = useState<PublicKey | null>(null);

  useEffect(() => {
    const conn = new Connection(SOLANA_RPC_URL, 'confirmed');
    setConnection(conn);
  }, []);

  useEffect(() => {
    if (publicKey && connection) {
      // Create AnchorProvider
      const provider = new AnchorProvider(
        connection,
        {
          publicKey,
          signTransaction,
          signAllTransactions,
        } as any,
        { commitment: 'confirmed' }
      );
      
      // Create Program
      const prog = new Program(idl as any, TOKEN_PROGRAM_ID, provider);
      setProgram(prog);

      // Initialize default recipient
      setRecipient(publicKey.toString());

      // Calculate and set the default mint PDA
      const [defaultMintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mint")],
        TOKEN_PROGRAM_ID
      );
      setMintPubkey(defaultMintPda);
    }
  }, [publicKey, connection, signTransaction, signAllTransactions]);

  const createDefaultMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !program || !connection || !mintPubkey) {
      toast.error('Please connect your wallet first!');
      return;
    }

    try {
      setLoading(true);
      
      const tx = await program.methods
        .createMint()
        .accounts({
          signer: publicKey,
          mint: mintPubkey,
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      // Send the transaction
      const provider = program?.provider;
      if (!provider) {
        toast.error('Program provider is not available.');
        return;
      }
      const signature = await provider.sendAndConfirm?.(tx);
      if (!signature) {
        toast.error('Transaction could not be confirmed.');
        return;
      }
      console.log('Transaction confirmed:', signature);
      toast.success(`Default token mint created successfully! PDA: ${mintPubkey?.toString()}`);
      setUsingDefaultMint(true);
    } catch (error) {
      console.error('Error creating token mint:', error);
      toast.error('Failed to create token mint: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createCustomMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !program || !connection || !tokenSeed) {
      toast.error('Please connect your wallet and provide a seed!');
      return;
    }

    try {
      setLoading(true);

      // Calculate custom mint PDA
      const [customMintPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(tokenSeed)],
        TOKEN_PROGRAM_ID
      );
      
      const tx = await program.methods
        .createCustomMint(tokenSeed, tokenDecimals)
        .accounts({
          signer: publicKey,
          mint: customMintPda,
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      // Send the transaction
      const provider = program?.provider;
      if (!provider) {
        toast.error('Program provider is not available.');
        return;
      }
      const signature = await provider.sendAndConfirm?.(tx);
      if (!signature) {
        toast.error('Transaction could not be confirmed.');
        return;
      }
      console.log('Transaction confirmed:', signature);
      toast.success(`Custom token mint created successfully! PDA: ${customMintPda.toString()}`);
      setMintPubkey(customMintPda);
      setUsingDefaultMint(false);
    } catch (error) {
      console.error('Error creating custom token mint:', error);
      toast.error('Failed to create custom token mint: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const mintTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey || !program || !connection || !mintPubkey) {
      toast.error('Please create a token mint first!');
      return;
    }

    try {
      setLoading(true);

      // Validate recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch (err) {
        toast.error('Invalid recipient address!');
        setLoading(false);
        return;
      }
      
      // Get associated token account for recipient
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        recipientPubkey
      );
      
      const tx = await program.methods
        .mintTokens(new BN(mintAmount * Math.pow(10, tokenDecimals)))
        .accounts({
          signer: publicKey,
          mint: mintPubkey,
          tokenAccount: associatedTokenAccount,
          recipient: recipientPubkey,
          tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      // Send the transaction
      const provider = program?.provider;
      if (!provider) {
        toast.error('Program provider is not available.');
        return;
      }
      const signature = await provider.sendAndConfirm?.(tx);
      if (!signature) {
        toast.error('Transaction could not be confirmed.');
        return;
      }
      
      console.log('Transaction confirmed:', signature);
      toast.success(`${mintAmount} tokens minted successfully to ${recipient}!`);
    } catch (error) {
      console.error('Error minting tokens:', error);
      toast.error('Failed to mint tokens: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Anchor Token Minter</h1>
              <WalletMultiButton />
            </div>
            
            {!publicKey ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Please connect your wallet to create and mint tokens.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <h2 className="text-xl font-medium text-gray-900">Create Token Mint</h2>
                  </div>
                  
                  <div className="mb-4">
                    <button
                      onClick={createDefaultMint}
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mb-2"
                    >
                      {loading ? 'Processing...' : 'Create Default Mint (seed="mint")'}
                    </button>
                  </div>
                  
                  <form onSubmit={createCustomMint} className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Custom Seed</label>
                      <input
                        type="text"
                        value={tokenSeed}
                        onChange={(e) => setTokenSeed(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="my-token-seed"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Decimals</label>
                      <input
                        type="number"
                        value={tokenDecimals}
                        onChange={(e) => setTokenDecimals(parseInt(e.target.value))}
                        min="0"
                        max="9"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Create Custom Mint'}
                      </button>
                    </div>
                  </form>
                </div>
                
                <form onSubmit={mintTokens} className="space-y-4 pt-6 border-t">
                  <div className="flex justify-between mb-2">
                    <h2 className="text-xl font-medium text-gray-900">Mint Tokens</h2>
                  </div>
                  
                  {mintPubkey && (
                    <p className="text-sm text-gray-600">Current Mint: {mintPubkey.toString()}</p>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount to Mint</label>
                    <input
                      type="number"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(parseInt(e.target.value))}
                      min="1"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Solana address"
                      required
                    />
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={loading || !mintPubkey}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Mint Tokens'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}