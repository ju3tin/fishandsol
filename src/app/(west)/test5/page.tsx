"use client"
import styles from "./page.module.css";

import { useEffect, useState, useRef } from 'react';
import Game from '../../../components/newGame5';
import CrashList from '../../../components/CrashList';
import GameControls from '../../../components/GameControls';
import BetList from '../../../components/BetList';
import JsonFetcher from "../../components/JsonFetcher";
import Chatroom from '../../../components/Chatroom1';
import GameLayout from '../../../components/GameLayout';

  
export default function Home() {

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
	return (
		<main className={styles.main}>
	 <Chatroom />
				<GameLayout> {/* Pass the layoutWidth as width prop */}
		 
		
	  <CrashList />
	  <Game />
	  <GameControls />

		  <BetList />
		</GameLayout>
		</main>
	);
}