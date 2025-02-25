import styles from "./page.module.css";

import Game from '../../../components/newGame5old';
import CrashList from '../../../components/CrashList';
import GameControls from '../../../components/GameControls';
import BetList from '../../../components/BetList';

import GameLayout from '../../../components/GameLayout';

export default function Home() {
	return (
		<main className={styles.main}>
			<GameLayout>
			
				<Game />
			
			</GameLayout>
		</main>
	);
}