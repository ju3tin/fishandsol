"use client";

/**
 * WalletContextProvider.tsx
 * 
 * This is a React functional component that provides a context for Solana wallets.
 * It uses various hooks and components from the @solana/wallet-adapter-react and @solana/wallet-adapter-react-ui libraries.
 * 
 * Props:
 * - children: ReactNode - The child components that will have access to the wallet context.
 * - onWalletChange?: (address: string | undefined) => void - A callback function to handle wallet changes.
 * 
 * State:
 * - network: WalletAdapterNetwork - The network to connect to, in this case, it's set to Devnet.
 * - autoConnect: boolean - A value from the useWallet hook that indicates whether to automatically connect to the wallet.
 * - endpoint: string - The RPC endpoint for the network, obtained using the clusterApiUrl function with the network as an argument.
 * - wallets: Wallet[] - An array of wallet adapters that the user can choose from.
 * 
 * Returns:
 * - A ConnectionProvider component that provides the RPC connection context.
 * - A WalletProvider component that provides the wallet context, with the wallets and autoConnect props.
 * - A WalletModalProvider component that provides the context for a modal that allows the user to select and connect to a wallet.
 * 
 * The child components passed to this component will have access to these contexts and can use them to interact with the user's Solana wallet.
 */

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

interface Props {
  children: ReactNode;
  onWalletChange?: (address: string | undefined) => void;
}

const WalletContextProvider: FC<Props> = ({ children, onWalletChange }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const { publicKey } = useWallet();

  useEffect(() => {
    if (onWalletChange) {
      onWalletChange(publicKey?.toBase58());
    }
  }, [publicKey, onWalletChange]);

  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com'}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;