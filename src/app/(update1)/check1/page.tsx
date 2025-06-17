'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function CheckTokenPage() {
  const { publicKey } = useWallet();
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const tokenMint = 'YOUR_TOKEN_MINT_ADDRESS'; // Replace this with your SPL token mint

  useEffect(() => {
    const checkTokenOwnership = async () => {
      if (!publicKey) return;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/check-token?wallet=${publicKey.toBase58()}&tokenMint=${tokenMint}`
        );
        const data = await res.json();
        setHasToken(data.hasToken);
      } catch (err) {
        console.error('Failed to check token:', err);
        setHasToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkTokenOwnership();
  }, [publicKey]);

  return (
    <div className="p-6">
      <WalletMultiButton />
      <h1 className="text-2xl mt-4 font-semibold">Token Ownership Checker</h1>

      {!publicKey && <p className="mt-4">Please connect your wallet to continue.</p>}

      {publicKey && (
        <div className="mt-4">
          {loading ? (
            <p>Checking for token...</p>
          ) : hasToken === true ? (
            <p className="text-green-600">✅ You own the token!</p>
          ) : hasToken === false ? (
            <p className="text-red-600">❌ You do NOT own the token.</p>
          ) : (
            <p>Token ownership not determined.</p>
          )}
        </div>
      )}
    </div>
  );
}
