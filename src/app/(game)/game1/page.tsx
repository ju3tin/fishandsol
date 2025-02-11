import styles from "./page.module.css"; 

import Game from '../../../components/Game4';
import CrashList from '../../../components/CrashList2';
import GameControls from '../../../components/GameControls2';
import BetList from '../../../components/BetList2';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import GameLayout from '../../../components/GameLayout3';

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