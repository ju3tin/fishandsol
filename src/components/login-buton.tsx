"use client";
import React, { useMemo, FC } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'; // Update this import
import '@solana/wallet-adapter-react-ui/styles.css';
import { setWalletAddress } from '../store/walletStore';

function CustomWalletButton() {
    return (
        <WalletMultiButton className="custom-wallet-button">
            Select Wallet
        </WalletMultiButton>
    );
}

interface WalletButtonWrapperProps {
    onWalletConnect: (address: string) => void;
}

const WalletButtonWrapper: FC<WalletButtonWrapperProps> = ({ onWalletConnect }) => {
    const { connected, publicKey } = useWallet();

    React.useEffect(() => {
        if (connected && publicKey) {
            const address = publicKey.toString();
            onWalletConnect(address);
        }
    }, [connected, publicKey, onWalletConnect]);

    return connected ? <WalletMultiButton /> : <CustomWalletButton />;
};

const LoginButton: FC = () => {
    const endpoint = useMemo(() => "https://rpc.test.honeycombprotocol.com", []);

    const handleWalletConnect = (address: string) => {
        console.log("Connected wallet address:", address);
        setWalletAddress(address); // Store it globally
    };
    const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]; // Use SolflareWalletAdapter
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <WalletButtonWrapper onWalletConnect={handleWalletConnect} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};


// ... existing code ...

export default LoginButton;