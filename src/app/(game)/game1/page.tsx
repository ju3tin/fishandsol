import styles from "./page.module.css";

import Game from '../../../components/Game2';
import CrashList from '../../../components/CrashList2';
import GameControls from '../../../components/GameControls2';
import BetList from '../../../components/BetList2';

import GameLayout from '../../../components/GameLayout2';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';


export default function Home() {
	const endpoint = clusterApiUrl('devnet');
	const wallets = [new PhantomWalletAdapter()];

	return (
		<main className={styles.main}>
			<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets}>
			<GameLayout>
			<CrashList />
				<Game />
			<GameControls />
				<BetList />
				</GameLayout>
				</WalletProvider>
				</ConnectionProvider>
		</main>
	);
}