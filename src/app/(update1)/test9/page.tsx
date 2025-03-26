"use client"
import styles from "../page.module.css";

import { useEffect, useState, useRef } from 'react';
import Game from '../../../components/newGame5old';
import Game5 from '../../../components/Game2';
import CrashList from '../../../components/CrashList';
import GameControls from '../../../components/GameControls2';
import BetList from '../../../components/BetList';
//import JsonFetcher from "../../components/JsonFetcher";
import Chatroom from '../../../components/Chatroom1';
import GameLayout from '../../../components/GameLayout';
import Iframe3 from '../../../components/Iframe4';

  
export default function Home() {
const [isMobile, setIsMobile] = useState(false);


const [chatMessages, setChatMessages] = useState<Array<{ text: string; timestamp: string }>>([]);
const [inputMessage, setInputMessage] = useState('');

const ChatMessage = ({ timestamp, text }: { timestamp: string; text: string }) => (
  <div className="chat-message">
	<span className="timestamp">{timestamp}</span>
	<span className="message">{text}</span>
  </div>
);

	const [ws, setWs] = useState<WebSocket | null>(null);
 
	const handleSendMessage = () => {
		if (ws && inputMessage.trim()) {
		  ws.send(inputMessage);
		  setInputMessage('');
		}
	  };
      useEffect(() => {
		const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
	
		checkScreenSize(); // Initial check
		window.addEventListener("resize", checkScreenSize);
	
		return () => window.removeEventListener("resize", checkScreenSize);
	  }, []);

	return (
		<main className={styles.main}>
	  {!isMobile &&  <Chatroom />}
				<GameLayout> {/* Pass the layoutWidth as width prop */}
		 
		
	  <CrashList />
	  <div className="container1">
  <Game5 />
</div>
	  <GameControls />

      {!isMobile && <BetList />}
		</GameLayout>
		</main>
	);
}