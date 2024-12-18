import CustomPageLayout from '../components/CustomPageLayout';
import styles from "./page.module.css";

import Game from '../../components/Game';
import CrashList from '../../components/CrashList';
import GameControls from '../../components/GameControls';
import BetList from '../../components/BetList';
import GameLayout from '../../components/GameLayout';
export default function CustomSectionHome() {
	return (
		<CustomPageLayout>
			<main className={styles.main}>
			<GameLayout>
			<CrashList />
				<Game />
			<GameControls />
				<BetList />
			</GameLayout>
		</main>
		</CustomPageLayout>
	);
}