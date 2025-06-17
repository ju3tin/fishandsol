"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { useState, useEffect } from "react";
import WalletButton from "../../../components/Walletbutton";
import { checkTokenOwnership } from "../../../../lib/solana";

export default function CheckTokenPage() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [tokenStatus, setTokenStatus] = useState<{
    hasToken: boolean;
    balance: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with your token's mint address
  const TOKEN_MINT_ADDRESS = "YOUR_TOKEN_MINT_ADDRESS";

  useEffect(() => {
    async function fetchTokenStatus() {
      if (!connected || !publicKey) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await checkTokenOwnership(
          publicKey.toString(),
          TOKEN_MINT_ADDRESS,
          connection
        );
        setTokenStatus(result);
      } catch (err) {
        setError("Failed to check token ownership. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokenStatus();
  }, [connected, publicKey, connection]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Solana Token Checker
      </h1>
      <div className="mb-4">
        <WalletButton />
      </div>
      {connected && publicKey && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Wallet Address: {publicKey.toString()}
          </p>
        </div>
      )}
      {isLoading && <p className="text-center">Checking token status...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {tokenStatus && !isLoading && (
        <div className="text-center">
          {tokenStatus.hasToken ? (
            <p className="text-green-500">
              You hold {tokenStatus.balance} tokens of mint {TOKEN_MINT_ADDRESS}.
            </p>
          ) : (
            <p className="text-red-500">
              You do not hold any tokens of mint {TOKEN_MINT_ADDRESS}.
            </p>
          )}
        </div>
      )}
      {!connected && (
        <p className="text-center text-gray-600">
          Please connect your wallet to check token ownership.
        </p>
      )}
    </div>
  );
}
