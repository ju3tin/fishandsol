import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    //SolletWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter styles (you can customize this in your CSS as well)
import '@solana/wallet-adapter-react-ui/styles.css';

function LoginButton() {
    // Set network to 'devnet', 'testnet', or 'mainnet-beta'
   // const network = WalletAdapterNetwork.Devnet;
    //const endpoint = useMemo(() => clusterApiUrl(network), [network]);


    const network = "https://rpc.test.honeycombprotocol.com";
    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => network, [network]);
  
    // Define wallet adapters you want to support
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
       //     new SolletWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* Your "Connect Wallet" button */}
                    <WalletMultiButton />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default LoginButton;