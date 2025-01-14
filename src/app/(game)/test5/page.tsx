import styles from "./page.module.css";

import Game from '../../../components/Game1';
import CrashList from '../../../components/CrashList1';
import GameControls from '../../../components/GameControls1';
import BetList from '../../../components/BetList1';

import GameLayout from '../../../components/GameLayout1';

export default function Home() {
	return (
		<main className={styles.main}>
			<GameLayout>
			<CrashList />
				<Game />
			<GameControls />
				<BetList />
			</GameLayout>
		</main>
	);
}