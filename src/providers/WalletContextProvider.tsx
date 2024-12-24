"use client";

import React, { createContext, FC, ReactNode, useContext, useState, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  MathWalletAdapter,
  TrustWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";

// Create the WalletContext
type WalletContextType = {
  wallet1a: string | null;
  setWallet1a: (wallet: string | null) => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletContextProvider");
  }
  return context;
};

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;

  // State to store wallet address
  const [wallet1a, setWallet1a] = useState<string | null>(null);

  // RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new MathWalletAdapter(),
      new TrustWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    [network]
  );

  // Listen for wallet connection and set the address
  const { publicKey } = useWallet();

  React.useEffect(() => {
    if (publicKey) {
      setWallet1a(publicKey.toBase58());
    }
  }, [publicKey]);

  return (
    <WalletContext.Provider value={{ wallet1a, setWallet1a }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;