import styles from "./page.module.css";
import axios from "axios";

import Game from '../../../components/Game2';
import Game5 from '../../../components/Game6';
import CrashList from '../../../components/CrashList2';
import GameControls from '../../../components/GameControls2';
import BetList from '../../../components/BetList2';
import axiosInstance from '../../../../lib/axiosInstance';

import GameLayout from '../../../components/GameLayout2';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


export default function Home() {
	return (
		<main className={styles.main1}>
			<GameLayout>
			<CrashList />
				<Game />
        <Game5 />
			<GameControls />
				<BetList />
			</GameLayout>
		</main>
	);
}