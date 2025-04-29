import React, { useMemo, FC } from 'react';
// import { WalletAdapterNetwork, Wallet as WalletType } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

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
    const { connected, wallet } = useWallet();

    React.useEffect(() => {
        if (connected && wallet) {
            if ('publicKey' in wallet && wallet.publicKey) {
                onWalletConnect(wallet.publicKey.toString());
            }
        }
    }, [connected, wallet, onWalletConnect]);

    return connected ? <WalletMultiButton /> : <CustomWalletButton />;
};

interface LoginButtonProps {
    onWalletConnect: (address: string) => void;
}

const LoginButton: FC<LoginButtonProps> = ({ onWalletConnect }) => {
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
                    <WalletButtonWrapper onWalletConnect={onWalletConnect} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default LoginButton;
