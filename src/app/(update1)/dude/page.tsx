'use client';

import React, { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const HELIUS_API_KEY = env.local.HELIUS_API_KEY; // Replace with your Helius API key
const heliusDevnetRpcUrl = `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const connection = new Connection(heliusDevnetRpcUrl, 'confirmed');

export default function DevnetBalancePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async (walletAddress: string) => {
    try {
      setError(null);
      const pubkey = new PublicKey(walletAddress);
      const bal = await connection.getBalance(pubkey);
      setBalance(bal);
    } catch (err) {
      setError('Invalid address or failed to fetch balance.');
      setBalance(null);
    }
  };

  // Optional: fetch a default address on mount
  useEffect(() => {
    // Example Devnet wallet address (you can change this)
    const defaultAddress = '7dNxPZQqMqLtXsYiyzVe2vhF18k6hfMrJKkUYU9nt6Uu';
    setAddress(defaultAddress);
    fetchBalance(defaultAddress);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Helius Devnet Wallet Balance</h1>

      <input
        type="text"
        value={address}
        placeholder="Enter Devnet wallet address"
        onChange={(e) => setAddress(e.target.value)}
        className="border border-gray-400 rounded px-4 py-2 mb-4 w-full max-w-lg"
      />

      <button
        onClick={() => fetchBalance(address)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        Get Balance
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {balance !== null && !error && (
        <p className="text-lg">
          Balance for <code>{address}</code>: <strong>{balance}</strong> lamports
        </p>
      )}
    </div>
  );
}
