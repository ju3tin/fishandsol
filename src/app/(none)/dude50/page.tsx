"use client"; // Required for client-side interactivity in Next.js

import { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Replace with the token mint address you want to check (e.g., USDC on Solana)
  const TOKEN_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC mint address
  const SOLANA_RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"; // Solana mainnet RPC

  // Function to connect to Phantom wallet
  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (!solana || !solana.isPhantom) {
        setError("Phantom wallet not found. Please install the Phantom extension.");
        return;
      }

      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      setWalletAddress(publicKey);
      setError(null);
    } catch (err) {
      setError("Failed to connect to Phantom wallet.");
      console.error(err);
    }
  };

  // Function to check token balance
  const checkTokenBalance = async () => {
    if (!walletAddress) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);

      // Get the associated token account address for the wallet
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMintPublicKey,
        walletPublicKey
      );

      // Fetch the token account info
      const tokenAccount = await getAccount(connection, associatedTokenAddress);
      const balance = Number(tokenAccount.amount) / Math.pow(10, 6); // Adjust decimals (e.g., USDC has 6 decimals)

      setTokenBalance(balance);
      setError(null);
    } catch (err) {
      setError("Token account not found or error fetching balance.");
      console.error(err);
      setTokenBalance(null);
    }
  };

  // Automatically check balance when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      checkTokenBalance();
    }
  }, [walletAddress]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Check Token in Phantom Wallet</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Phantom Wallet</button>
      ) : (
        <div>
          <p>Connected Wallet: {walletAddress}</p>
          {tokenBalance !== null ? (
            <p>Token Balance: {tokenBalance} tokens</p>
          ) : (
            <p>Checking token balance...</p>
          )}
          <button onClick={checkTokenBalance}>Refresh Balance</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}