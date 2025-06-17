"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import WalletButton from "../../../components/Walletbutton";

export default function CheckTokenPage() {
  const { publicKey, connected } = useWallet();

  // Initialize connection with commitment level for consistency
  const connection = useMemo(
    () => new Connection(clusterApiUrl("devnet"), { commitment: "confirmed" }),
    []
  );

  const [tokenStatus, setTokenStatus] = useState<{
    hasToken: boolean;
    balance: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Replace with a real, valid devnet token mint address
  // Example: Use a known devnet token or create one via Solana CLI or a faucet
  const TOKEN_MINT_ADDRESS = "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E";

  useEffect(() => {
    async function checkTokenOwnership() {
      if (!connected || !publicKey) {
        setTokenStatus(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Validate token mint address format
        let mintPublicKey: PublicKey;
        try {
          mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
        } catch (err) {
          throw new Error("Invalid token mint address format.");
        }

        // Fetch token accounts owned by the wallet for the specified mint
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: mintPublicKey },
          "confirmed"
        );

        // Calculate balance from the first matching token account
        const balance =
          tokenAccounts.value.length > 0
            ? tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
            : 0;

        setTokenStatus({
          hasToken: balance > 0,
          balance,
        });
      } catch (err: any) {
        console.error("Error checking token ownership:", err);
        const errorMessage = err.message.includes("Invalid public key")
          ? "Invalid token mint address provided."
          : err.message.includes("Network")
          ? "Network error: Unable to connect to Solana devnet."
          : "Failed to check token ownership: " + (err.message || "Unknown error.");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    checkTokenOwnership();
  }, [connected, publicKey, connection]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Solana Token Checker</h1>

      <div className="mb-4 text-center">
        <WalletButton />
      </div>

      {connected && publicKey && (
        <p className="text-sm text-gray-700 text-center mb-2">
          Wallet: {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
        </p>
      )}

      {isLoading && <p className="text-center text-gray-500">Checking token status...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {tokenStatus && !isLoading && (
        <p className={`text-center ${tokenStatus.hasToken ? "text-green-600" : "text-red-600"}`}>
          {tokenStatus.hasToken
            ? `You hold ${tokenStatus.balance} token(s) of ${TOKEN_MINT_ADDRESS.slice(0, 8)}...`
            : `You do not hold any tokens of ${TOKEN_MINT_ADDRESS.slice(0, 8)}...`}
        </p>
      )}

      {!connected && (
        <p className="text-center text-gray-500">
          Please connect your wallet to check token ownership.
        </p>
      )}
    </div>
  );
}