// tester1/src/app/page.tsx
"use client";
import { useEffect, useRef, useState, useCallback, } from 'react';
import Image from 'next/image';
import '../../styles/fonts.css';
import '../../styles/globals.css';
import io from 'socket.io-client';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
//import "./App.css";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

const socket = io('wss://crashserver.onrender.com'); // Replace with your server URL

import Head from 'next/head';



export default function Home() {
//Public API that will echo messages sent to it back to the client
const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

useEffect(() => {
  if (lastMessage !== null) {
    setMessageHistory((prev) => prev.concat(lastMessage));
  }
}, [lastMessage]);

const handleClickChangeSocketUrl = useCallback(
  () => setSocketUrl('wss://demos.kaazing.com/echo'),
  []
);

const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

const connectionStatus = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
}[readyState];

  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = "https://rpc.test.honeycombprotocol.com";
    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => network, [network]);
  
    const wallets = useMemo(
      () => [
        // Manually define specific/custom wallets here
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ],
      [network]
    );
  
  useEffect(() => {
    // Play the video when the component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }

    // Optional: Pause the video when the component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    
    <div>
      <Head>
                <title>My Awesome Website</title>
                <meta name="description" content="Welcome to my awesome website!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="My Awesome Website" />
                <meta property="og:description" content="Discover amazing content on my website." />
                <meta property="og:image" content="https://example.com/image.jpg" />
                <meta property="og:url" content="https://example.com" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="My Awesome Website" />
                <meta name="twitter:description" content="Explore the wonders of my site!" />
                <meta name="twitter:image" content="https://example.com/image.jpg" />
            </Head>
    <div style={{ position: 'relative',width:'120%', height: '100vh', top: '-40px', right: '10px', zIndex: '-20' }}>
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          marginTop: -40,
          marginLeft: -20,
          marginRight: 30,
          width: '250%',
          height: '150%',
          objectFit: 'cover',
          zIndex: -2,
        }} 
        className="shadow-lg w-full h-auto" 
        src="/container07.mp4" // Path to the video file in the public folder
        autoPlay 
        loop 
        muted
        playsInline // Added for mobile compatibility
      >
        Your browser does not support the video tag.
      </video>
     {/*  <h1 className='text-3xl font-semibold' style={{ position: 'relative', zIndex: 1 }}>Home Page</h1>
*/}
 </div>
      <div className="wrapper" style={{top:'0', width: '100%', marginRight: 'auto', marginLeft: 'auto', position: 'absolute'}}>
        <div className="inner" style={{width:'40%', marginRight:'auto', marginLeft:'auto'}}>
          <div id="image05" className="image" style={{ opacity: '1', filter: 'none' }}>
            <span className="frame deferred" style={{}}>
              <Image src="/image05.png" width={100} height={100} data-src="done" alt="" style={{ width: '100%' }} />
            </span>
          </div>
          <div id="image07" className="image" style={{}}>
            <span className="frame deferred" style={{}}>
              <Image src="/image07.png" width={300} height={300} data-src="done" alt="" style={{}} />
            </span>
          </div>
          <br />

          <ul id="buttons04" className="buttons" style={{minWidth: '70px',display:'block',marginLeft:'auto',marginRight:'auto',width:'50%', zIndex: 30 }}>
            <li>
            <a className="btn btn-primary shadow" href="/hooked">ENTER SITE</a>
          
            </li>
          </ul>
        </div>
      </div>
   
    </div>
  );
}