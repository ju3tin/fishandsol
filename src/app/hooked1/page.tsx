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

// Define roundStartTimestamp as a global variable
let roundStartTimestamp: Date | null = null; // Initialize as null

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
  const [chartData, setChartData] = useState({
    datasets: [{
      label: '', // Remove dataset label
      data:  [{x:0 , y:0}],
      borderColor: '#FF2D00',
      tension: 0.4,
      pointRadius: 0,
    }],
  });

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
      const messageData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      setMessage(event.data);

      // Add message to chat
      const timestamp = new Date().toLocaleTimeString();
      setChatMessages(prev => [...prev, { text: event.data, timestamp }]);
      const message1 = JSON.parse(event.data);
      switch (message1.action) {
        case 'CNT_MULTIPLY':
          // Handle CNT_MULTIPLY action
          roundStartTimestamp = new Date(); // Store the current timestamp globally
          console.log("this is good" + roundStartTimestamp);
          const numericData = (message1.data.slice(2), 10); // Remove first character and convert to integer
          const input = message1.data;
          const numericValue = parseFloat(input.replace("x", ""));
          console.log(`CNT_MULTIPLY action received with data: ${numericValue}`);
          const currentTimestamp = new Date(); // Get the current timestamp for each CNT_MULTIPLY
          const timeDiff = (currentTimestamp.getTime() - roundStartTimestamp.getTime()) / 1000; // Calculate difference in seconds
          console.log('Time since round started for CNT_MULTIPLY:', timeDiff, 'seconds');

          // Reset chart data with x as numericValue and y as timeDiff
          setChartData({
            datasets: [{
              label: '', // Remove dataset label
              data: [
               {x:0, y:0}, { x: numericValue, y: timeDiff }
              ], // Set x to input and y to timeDiff
              borderColor: '#FF2D00',
              tension: 0.4,
              pointRadius: 0,
            }],
          });
          break;
        case 'ROUND_ENDS':
        //  setDude34(message.totalMult);
        setDude34(messageData.totalMult); // Set only the totalMult value
   
          break
        case 'ROUND_STARTED':
          roundStartTimestamp = new Date(); // Store the current timestamp globally
          console.log('Round started at:', roundStartTimestamp.toLocaleTimeString()); // Log the timestamp
          
          // Reset chart data when the round starts
          setChartData({
            datasets: [{
              label: '', // Remove dataset label
              data: [{ x: 0, y: 0 }],
              borderColor: '#FF2D00',
              tension: 0.4,
              pointRadius: 0,
            }],
          });
          
          // Store the round start timestamp in state if needed
         // setRoundStartTimestamp(roundStartTimestamp); // Assuming you have a state for this
       
          break;
        case 'BTN_BET_CLICKED':
          // Handle BTN_BET_CLICKED action
          console.log(`BTN_BET_CLICKED action received with bet: ${message1.bet}`);
          break;
        default:
          console.log(`Unknown action received: ${message1.action}`);
      }

   

      // When you receive a new timestamp
      const newTimestamp = new Date(); // Get the new timestamp
      if (roundStartTimestamp) { // Check if roundStartTimestamp is not null
        const timeDifference = (newTimestamp.getTime() - roundStartTimestamp.getTime()) / 1000; // Calculate difference in seconds
        console.log('Time since round started:', timeDifference, 'seconds');
      } else {
        console.log('Round has not started yet.'); // Log if round has not started
      }

      if (messageData.action === 'CNT_MULTIPLY') {
        setIsButtonDisabled(true);
        setIsLineGraphVisible(true);
        
        // Update chart data here
        setChartData(prevChartData => ({
          ...prevChartData,
          datasets: [{
            ...prevChartData.datasets[0],
            data: [
              ...prevChartData.datasets[0].data,
              { x: Math.random() * 10, y: Math.random() * 10 } // Use timeDifference as x
            ]
          }]
        }));
      } else {
        setIsButtonDisabled(false);
        setIsLineGraphVisible(false);
      }

      // Store the value of dude34 in state
     if (messageData.action === 'ROUND_ENDS') {
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

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        grid: {
          display: false,
        },
        title: {
          display: false,
        },
      },
      
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        }
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

//

//
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
            <td style={{ backgroundImage: 'url(/images/water.png)', textAlign: 'center', minWidth: '408px', }}>
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