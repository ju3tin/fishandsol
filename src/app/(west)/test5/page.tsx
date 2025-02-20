"use client"
import styles from "./page.module.css";

import { useEffect, useState, useRef } from 'react';
import Game from '../../../components/newGame5';
import CrashList from '../../../components/CrashList';
import GameControls from '../../../components/GameControls';
import BetList from '../../../components/BetList';
import JsonFetcher from "../../components/JsonFetcher";

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
	  <div className="chat-container p-4 bg-gray-900 text-white rounded-lg shadow-md" style={{ maxHeight: '500px' }}>
        <div className="chat-messages">
        <JsonFetcher url="/api" />
          {chatMessages.map((msg, index) => {
            
            // Check if the message is an object and has the action CNT_MULTIPLY
            const messageData = typeof msg.text === 'string' ? JSON.parse(msg.text) : msg.text;
            const displayText = messageData.action === 'CNT_MULTIPLY' ? messageData.data : null;
           
             return displayText ? (
              <ChatMessage key={index} timestamp={msg.timestamp} text={displayText} />
            ) : null; // Return null for messages that do not match
          })}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
				<GameLayout> {/* Pass the layoutWidth as width prop */}
		 
		
	  <CrashList />
	  <Game />
	  <GameControls />

		  <BetList />
		</GameLayout>
		</main>
	);
}