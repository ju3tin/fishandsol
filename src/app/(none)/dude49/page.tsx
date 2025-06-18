'use client';

import { useState } from 'react';
import { connectWallet } from '../../../../util/connectWallet';
import { checkTokenInWallet } from '../../../../util/checkToken';

export default function CheckTokenPage() {
  const [status, setStatus] = useState<string>('');
  const [wallet, setWallet] = useState<string>('');

  const tokenMint = 'YOUR_TOKEN_MINT_ADDRESS_HERE'; // Replace with your token mint

  const handleCheck = async () => {
    try {
      setStatus('Connecting to wallet...');
      const walletAddress = await connectWallet();
      setWallet(walletAddress);

      setStatus('Checking for token...');
      const hasToken = await checkTokenInWallet(walletAddress, tokenMint);
      setStatus(hasToken ? '✅ Token found in wallet!' : '❌ Token not found.');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Check Token in Phantom Wallet</h1>
      <button
        onClick={handleCheck}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Connect Wallet & Check
      </button>
      {wallet && <p className="mt-4 text-sm text-gray-600">Wallet: {wallet}</p>}
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
