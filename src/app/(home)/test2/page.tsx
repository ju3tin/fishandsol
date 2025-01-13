import styles from "./page.module.css";
import Game from '../../components/Game1';
import CrashList from '../../components/CrashList1';
import GameControls from '../../components/GameControls1';
import BetList from '../../components/BetList1';
import Test2Layout from './layout'; // Import the layout
import GameLayout from '../../components/GameLayout1';
import CustomLayout from '../../components/CustomPageLayout';
export default function CustomTest2Page() {
	return (
		<CustomLayout>
			<main className={styles.main}>
				<section>
					<h2>Welcome to the Custom Test2 Page</h2>
					<p>This page features a custom HTML structure and uses the Test2 layout.</p>
				</section>
				<section>
					<h3>Game Section</h3>
					<GameLayout>
						<CrashList />
						<Game />
						<GameControls />
						<BetList />
					</GameLayout>
				</section>
				<section>
					<h3>Additional Information</h3>
					<p>Here you can add more content, links, or any other elements you want.</p>
				</section>
			</main>
		</CustomLayout>
	);
}