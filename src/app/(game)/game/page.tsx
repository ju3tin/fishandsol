import styles from "./page.module.css";
import axios from "axios";

import Game from '../../../components/Game2';
import CrashList from '../../../components/CrashList2';
import GameControls from '../../../components/GameControls2';
import BetList from '../../../components/BetList2';
import axiosInstance from '../../../../lib/axiosInstance';

import GameLayout from '../../../components/GameLayout2';

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