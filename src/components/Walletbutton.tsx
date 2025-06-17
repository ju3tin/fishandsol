"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";

export default function WalletButton() {
  const { connected } = useWallet();

  return (
    <div>
      <WalletMultiButton
        style={{
          backgroundColor: "#9333ea",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "16px",
        }}
      />
      {connected && (
        <p className="text-sm text-gray-600 mt-2">
          Wallet connected successfully!
        </p>
      )}
    </div>
  );
}