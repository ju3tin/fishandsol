"use client";

import { useState } from "react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { buyTokens } from "../../../../utils/buyTokens";
import styles from "./page.module.css";

export default function Home() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const pricePerToken = 1; // 1 SOL per token (update based on your program)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value) || 0;
    setTokenAmount(amount);
    setTotalCost(amount * pricePerToken);
  };

  const handleBuyTokens = async () => {
    if (!wallet) {
      setStatus("Please connect your wallet");
      return;
    }
    if (tokenAmount <= 0) {
      setStatus("Please enter a valid token amount");
      return;
    }

    setStatus("Processing transaction...");
    try {
      const tx = await buyTokens(wallet, connection, tokenAmount);
      setStatus(`Transaction successful! Signature: ${tx}`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <main className={styles.main}>
      <h1>Token Purchase</h1>
      <div className={styles.wallet}>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      <div className={styles.form}>
        <label>
          Tokens to Buy:
          <input
            type="number"
            value={tokenAmount}
            onChange={handleInputChange}
            min="0"
            placeholder="Enter token amount"
          />
        </label>
        <p>Total Cost: {totalCost} SOL</p>
        <button onClick={handleBuyTokens} disabled={!wallet || tokenAmount <= 0}>
          Buy Tokens
        </button>
      </div>
      {status && <p className={styles.status}>{status}</p>}
    </main>
  );
}