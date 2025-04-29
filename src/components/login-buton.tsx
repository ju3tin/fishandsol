"use client"
import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Wallet } from 'lucide-react';
import { setWalletAddress } from '../store/walletStore';

function CustomWalletButton() {
    return (
        <WalletMultiButton className="custom-wallet-button">
            <Wallet className="w-5 h-5 mr-2" />
            Select Wallet
        </WalletMultiButton>
    );
}


const handleWalletConnect = (address: string) => {
    console.log("Connected wallet address:", address);
    setWalletAddress(address); // Store it globally
};


function WalletButtonWrapper() {
    const { connected, publicKey } = useWallet();

    React.useEffect(() => {
        if (connected && publicKey) {
            const address = publicKey.toBase58();
            handleWalletConnect(address);
        }
    }, [connected, publicKey]);

    return connected ? <WalletMultiButton /> : <CustomWalletButton />;
}
function LoginButton() {
    const network = "https://rpc.test.honeycombprotocol.com";
    const endpoint = useMemo(() => network, []);
  
    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
    ], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletButtonWrapper />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default LoginButton;