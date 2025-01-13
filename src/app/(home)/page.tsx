// tester1/src/app/page.tsx
"use client";
import { useEffect, useRef, useState, useCallback, } from 'react';
import Image from 'next/image';
import '../../../styles/fonts.css';
import '../../../styles/globals.css';
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
            <div className="relative">
      
      <div className="bg-hero-section w-full bg-no-repeat h-full screen bg-center bg-cover overflow -hidden">
  
    
    
    
      <video autoPlay loop muted 
      className="absolute inset-0 object-cover h-screen rounded-xl ">
            <source
        src="/container07.mp4" 
        type="video/mp4"
            />
          </video>




<div className="bg-black w-full h-full">



          <div className="wrapper w-full sm:my-48 my-32 mx-auto " style={{top:'0', marginRight: 'auto', marginLeft: 'auto', position: 'absolute'}}>
        <div className="inner " style={{width:'25%', marginRight:'auto', marginLeft:'auto'}}>
          <div id="image05" className="image bg-black/30 p-2 rounded-xl " style={{ opacity: '1', filter: 'none' }}>
            <span className="frame deferred drop-shadow-2xl shadow-2xl" style={{}}>
              <Image src="/image15.png" width={80} height={80} data-src="done" alt="" style={{ width: '100% ' }} />
            </span>
            <span className="frame deferred w-10 drop-shadow-2xl shadow-2xl" style={{}}>
              <Image src="/image07.png" width={80} height={80} data-src="done" alt="" style={{ width: '100% ' }} />
            </span>
          </div>
       
          <br />

        </div>
      </div>










      <div className="absolute inset-0">
        <div className="xl:tex t-3xl text-2xl font-thin sm:my -56 xl:mt-20 -32 mx-10 text-center text-white bg-black/60 p-2 rounded-xl border border-white/30">
<h2 >
CHIPPY ON SOLANA IS THE FRIENDLY FISH AND CHIPS YOU ALWAYS NEEDED. IT IS THE BEST COMBO IN ALL THE SOL SEA. JOIN OUR COMMUNITY TO FIND OTHER FISHY FRIENDS!</h2>

        </div>
      </div>
    </div>
    </div>

    </div>
   
    </div>
  );
}