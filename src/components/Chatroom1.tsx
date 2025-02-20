"use client"
import styles from "./page.module.css";
import JsonFetcher from "../app/components/JsonFetcher";

import { useEffect, useState, useRef } from 'react';

export default function Chatroom(){

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
</div>)
}