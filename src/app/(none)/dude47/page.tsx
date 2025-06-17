"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import WalletButton from "../../../components/Walletbutton";

export default function CheckTokenPage() {
  const { publicKey, connected } = useWallet();

  const connection = useMemo(() => new Connection(clusterApiUrl("devnet")), []);

  const [tokenStatus, setTokenStatus] = useState<{
    hasToken: boolean;
    balance: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Replace with a real devnet token mint address
  const TOKEN_MINT_ADDRESS = "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E";

  useEffect(() => {
    async function checkTokenOwnership() {
      if (!connected || !publicKey) return;

      setIsLoading(true);
      setError(null);

      try {
        const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: mintPublicKey,
        });

        const balance =
          tokenAccounts.value.length > 0
            ? tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount
            : 0;

        setTokenStatus({
          hasToken: balance > 0,
          balance,
        });
      } catch (err) {
        console.error("Error checking token ownership:", err);
        setError("Failed to check token ownership. Please try again.");
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
          Wallet: {publicKey.toString()}
        </p>
      )}

      {isLoading && <p className="text-center text-gray-500">Checking token status...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {tokenStatus && !isLoading && (
        <p className={`text-center ${tokenStatus.hasToken ? "text-green-600" : "text-red-600"}`}>
          {tokenStatus.hasToken
            ? `You hold ${tokenStatus.balance} token(s) of ${TOKEN_MINT_ADDRESS}.`
            : `You do not hold any tokens of ${TOKEN_MINT_ADDRESS}.`}
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
