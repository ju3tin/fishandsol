'use client';
import styles from "./page.module.css";
import axios from "axios";
import { useRef, useEffect, useState, useCallback } from 'react';

import Game from '../../../components/Game2';
import Game5 from '../../../components/Game6';
import CrashList from '../../../components/CrashList2';
import GameControls from '../../../components/GameControls2';
import BetList from '../../../components/BetList2';
import axiosInstance from '../../../../lib/axiosInstance';

import GameLayout from '../../../components/GameLayout3';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


export default function Home() {
	const [layoutWidth, setLayoutWidth] = useState(0);

	useEffect(() => {
		const handleResize = () => {
		  setLayoutWidth(window.innerWidth); // Get width dynamically
		};
	
		// Initial load
		handleResize();
	
		// Listen for resize events
		window.addEventListener('resize', handleResize);
	
		return () => {
		  window.removeEventListener('resize', handleResize); // Cleanup
		};
	  }, []);
	

	return (
		<main className={styles.main1}>
		<GameLayout> {/* Pass the layoutWidth as width prop */}
		  <CrashList />
		  <Game />
	  <GameControls />
		  <BetList />
		</GameLayout>
	  </main>
	);
}