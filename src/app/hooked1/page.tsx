"use client"
import { useEffect, useState } from 'react';
import '../../../styles/fonts.css';
import '../../../styles/globals.css';
import { Line } from 'react-chartjs-2';
import {   Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,} from 'chart.js';

// Register the necessary components for line chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



export default function WebSocketExample() {
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; timestamp: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLineGraphVisible, setIsLineGraphVisible] = useState(true);

  useEffect(() => {
    // Only runs on the client
    const socket = new WebSocket('wss://crashserver.onrender.com');
    // ... existing code ...
    const socket1 = new WebSocket('ws://localhost:8080'); // Updated WebSocket URL
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
    labels: ['1s', '2s', '3s', '4s', '5s'],
    datasets: [{
      label: '', // Remove dataset label
      data:  [{ x: 344423, y: 456456546456},
      { x: 23, y: 34},
      { x: 56, y: Math.random() * 0.5 + 23.5 },
      { x: 200, y: Math.random() * 0.5 + 23.5 },
      { x: 2450, y: Math.random() * 0.5 + 23.5 },
      { x: new Date(2019, 0, 1, 14, 1, 23, 0), y: Math.random() * 0.5 + 23.5 },
      { x: new Date(2019, 0, 1, 14, 1, 24, 0), y: Math.random() * 0.5 + 23.5 },
      { x: new Date(2019, 0, 1, 14, 1, 25, 0), y: Math.random() * 0.5 + 23.5 }],
      borderColor: '#FF2D00',
      tension: 0.4,
      pointRadius: 0,
    }],
  };
  
  const options = {
    responsive: true,
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
      {/* Full Width Table */}
      <table style={{ padding: '0 !important' }} className="full-width-table">
        <thead>
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
          {chatMessages.map((msg, index) => (
            <div key={index} className="chat-message">
              <span className="timestamp">{msg.timestamp}</span>
              <span className="message">{msg.text}</span>
            </div>
          ))}
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
            <td><span id="linegraph" style={{ display: isLineGraphVisible ? 'block' : 'none' }}> <Line data={chartData} options={options} /> </span>{/* Render the Line chart */}
            
            
      <h1>WebSocket Client</h1>
      <p>Message from server: {message}</p>
     

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
      `}</style>
    </div>
  );
}