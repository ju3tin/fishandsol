"use client"
import { useEffect, useState } from 'react';
import '../../../styles/fonts.css';
import '../../../styles/globals.css';
import JsonFetcher from "../components/JsonFetcher";
import { Line } from 'react-chartjs-2';
import {   Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,} from 'chart.js';
//import axios from 'axios';
// Axios Interceptor Instance
//const AxiosInstance = axios.create({
//  baseURL: process.env.BASE_URL
//});

// Register the necessary components for line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChatMessage = ({ timestamp, text }: { timestamp: string; text: string }) => (
  <div className="chat-message">
    <span className="timestamp">{timestamp}</span>
    <span className="message">{text}</span>
  </div>
);

export default function WebSocketExample() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const [message, setMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; timestamp: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLineGraphVisible, setIsLineGraphVisible] = useState(true);
  const [mongoMessages, setMongoMessages] = useState<Array<any>>([]);
  const [apiData, setApiData] = useState<any[]>([]);
  const [dude34, setDude34] = useState<any>(null);

  useEffect(() => {
    console.log('whats the coming to');
    // Fetch messages from MongoDB
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api');
        const data = await response.json();
        if (data.success) {
          setMongoMessages(data.data);
          setApiData(data.data);
          setChatMessages(data.chatMessages || []);
          console.log(data);
          console.log('what the fuck');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

   // let dude34

    // Only runs on the client

   // const socket1 = new WebSocket('/api');
   
   fetchMessages();
    const socket = new WebSocket('wss://crashserver.onrender.com');
    // ... existing code ...
 //   const socket1 = new WebSocket('ws://localhost:8080'); // Updated WebSocket URL
// ... existing code ...


    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      socket.send(JSON.stringify({ message: 'Hello Server!' }));
     
    };

    socket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
      setMessage(event.data);

      // Add message to chat
      const timestamp = new Date().toLocaleTimeString();
      setChatMessages(prev => [...prev, { text: event.data, timestamp }]);

      if (event.data.includes('CNT_MULTIPLY')) {
        setIsButtonDisabled(true);
        setIsLineGraphVisible(true);
      } else {
        setIsButtonDisabled(false);
        setIsLineGraphVisible(false);
      }

      // Store the value of dude34 in state
      const messageData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (messageData.action === 'ROUND_ENDS') {
        setDude34(messageData.totalMult); // Set only the totalMult value
      }
    };

   
    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    setWs(socket);

    // Cleanup on unmount
    return () => socket.close();
  }, []);

  const handleBetClick = () => {
    if (ws) {
      ws.send(JSON.stringify({
        action: 'BTN_BET_CLICKED',
        bet: betAmount
      }));
    }
  };

  const handleSendMessage = () => {
    if (ws && inputMessage.trim()) {
      ws.send(inputMessage);
      setInputMessage('');
    }
  };

  const chartData = {
   // labels: ['1s', '2s', '3s', '4s', '5s'],
    datasets: [{
      label: '', // Remove dataset label
      data:  [
      { x: 56, y: 0 },
      { x: 23, y: 15 },
      { x: Math.random() * 0.5 + 23.5, y: Math.random() * 0.5 + 23.5 },
      { x: Math.random() * 0.5 + 23.5, y: Math.random() * 0.5 + 23.5 },
      { x: Math.random() * 0.5 + 23.5, y: Math.random() * 0.5 + 23.5 },
      { x: Math.random() * 0.5 + 23.5, y: Math.random() * 0.5 + 23.5 },
      { x: Math.random() * 0.5 + 23.5, y: Math.random() * 0.5 + 23.5 },
      { x: Math.random() * 0.5 + 23.5, y: Math.random() * 0.5 + 23.5 }],
      borderColor: '#FF2D00',
      tension: 0.4,
      pointRadius: 0,
    }],
  };
  
  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem: { raw: unknown }) {
            return `Value: ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };
  return (
    <div>
      {/* Add MongoDB Messages Display */}
      

      {/* Full Width Table */}
      <table style={{ padding: '0 !important' }} className="full-width-table">
        <thead style={{display: 'none'}}>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> {/* Chat Component */}
      <div className="chat-container">
        <div className="chat-messages">
        <JsonFetcher url="/api" />
          {chatMessages.map((msg, index) => {
            
            // Check if the message is an object and has the action CNT_MULTIPLY
            const messageData = typeof msg.text === 'string' ? JSON.parse(msg.text) : msg.text;
            const displayText = messageData.action === 'CNT_MULTIPLY' ? messageData.data : null;
            let dude34 = messageData.data;
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
      </div></td>
            <td style={{ backgroundImage: 'url(/images/water.png)', textAlign: 'center' }}>
              <span id="linegraph" style={{ display: isLineGraphVisible ? 'block' : 'none' }}>
                <Line data={chartData} options={options} />
              </span>{/* Render the Line chart */}
              
              {typeof message === 'string' && message.includes("CNT_MULTIPLY") ? (
                    <p style={{color: 'black'}}>
                     
                      {JSON.parse(message).data}
                    </p>
                  ) : null}
              {/* Check if message is not an array with action CNT_MULTIPLY */}
              {typeof message === 'string' && message.includes("CNT_MULTIPLY") ? null : (
                <div>
                  {typeof message === 'string' && message.includes("SECOND_BEFORE_START") ? (
                    <p style={{color: 'black'}}>
                      BE READY FOR A ROUND:<br /> 
                      {JSON.parse(message).data}
                    </p>
                  ) : null}
                   

                   {typeof message === 'string' && message.includes("totalMult") ? (


                   <p style={{color: 'black'}}>
                   Round Crash At<br /> 
                   {dude34}
                 </p>
                   ) :null}
                </div>
              )}
            </td>
            <td> <input 
        type="number" 
        value={betAmount}  
        onChange={(e) => setBetAmount(Number(e.target.value))}
        min="0" 
        className="bet-input" 
      />
      <button 
        onClick={handleBetClick} 
        disabled={isButtonDisabled} 
        className={isButtonDisabled ? 'button-disabled' : 'button-active'}
      >
        Place Bet
      </button></td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>

     

      {/* margin: 20px;  Add some basic styles */}
      <style jsx>{`
        .chat-container {
          border: 1px solid #ccc;
          border-radius: 4px;
         
          max-width: 500px;
        }
        .chat-messages {
          height: 300px;
          overflow-y: auto;
          padding: 10px;
        }
        .chat-message {
          margin: 5px 0;
        }
        .timestamp {
          color: #666;
          font-size: 0.8em;
          margin-right: 8px;
        }
        .chat-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ccc;
        }
        .chat-input input {
          flex: 1;
          margin-right: 10px;
          padding: 5px;
        }
        .chat-input button {
          padding: 5px 15px;
        }
        .mongo-messages {
          margin: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .mongo-message {
          padding: 8px;
          border-bottom: 1px solid #eee;
        }
      `}</style>
    </div>
  );
}