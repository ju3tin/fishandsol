"use client"

import {Tabs, Tab, CardBody} from "@nextui-org/react";
import QRCode from "react-qr-code";

import { address1a } from "./WalletConnection";
import { FaWallet } from 'react-icons/fa'; // Using FontAwesome for example
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
//import { useWalletContext } from "../../src/providers/WalletContextProvider";
import { Checkbox } from "@nextui-org/checkbox";
import { useGameStore, GameState } from "../store/gameStore";
import { useEffectEvent } from "../hooks/useEffectEvent";
import useWalletAuth from "../hooks/useWalletAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { currencies } from "../lib/currencies";
import CurrencyList from "./CurrencyList";
import styles from "../styles/components/GameControls.module.css";
import { useState, useEffect, useRef } from "react"
import JSConfetti from 'js-confetti';

type BetbuttonProps = {
    gameState: "idle" | "running" | "crashed";
    currentMultiplier: number;
    onStartGame: (betAmount: string, autoCashoutAt: string) => void;
    onCashout: () => void;
    userCashedOut: boolean;
    cashouts: Array<{
      id: string;
      multiplier: number;
      amount: number;
    }>;
  }
  
  const Betbutton = ({ 
    gameState, 
    currentMultiplier, 
    onStartGame, 
    onCashout,
    userCashedOut,
    cashouts 
  }: BetbuttonProps) => {
    const handleChangeBetAmount = (amount: string) => {
      setBetAmount(amount);
    };
    const handleCopy = () => {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        })
        .catch((err) => {
        console.error("Failed to copy text: ", err);
        });
      };
      const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
        };
        const gameState5 = useGameStore((state: GameState) => state);
        const isWaiting = useGameStore((game: GameState) => game.isWaiting);
	const isPlaying = useGameStore((game: GameState) => game.isPlaying);
	const isCashedOut = useGameStore((game: GameState) => game.isCashedOut);
        const isConnected = useGameStore((game: GameState) => game.isConnected);
        const [autoCashOut, setAutoCashOut] = useState<string>("0");
        const [isAutoCashOutDisabled, setIsAutoCashOutDisabled] = useState(false);
        const balances = useGameStore((game: GameState) => game.balances);
    const [demoAmount, setDemoAmount] = useState<string>("0");
    const [copied, setCopied] = useState(false);
    const textToCopy = "This is the text to copy!";
  	const [overlayVisible, setOverlayVisible] = useState(false);  
    const [betAmount, setBetAmount] = useState("0.1")
    const [autoCashoutAt, setAutoCashoutAt] = useState("2")
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioRef1 = useRef<HTMLAudioElement>(null)
    const jsConfetti = useRef<JSConfetti>();
    const isButtonDisabled: boolean = !isConnected;

    useEffect(() => {
      // Check if game crashed and user didn't cash out
      if (gameState === "crashed" && !userCashedOut) {
        loseout()
      }
    }, [gameState, userCashedOut])

    const loseout = () => {
      if (audioRef1.current) {
        audioRef1.current.play()
      }

    }
    const handleCheckboxChange = (checked: boolean) => {
      setIsAutoCashOutDisabled(checked);
      if (checked) {
        setAutoCashOut("0"); // Optionally reset autoCashOut when disabling
      }
    };
    const [currency, setCurrency] = useState<string>(currencies[0].id);
	
    const handleChangeAutoCashOut = (amount: string) => {
      setAutoCashOut(amount);
    };
    const handleChangeDemoAmount = (amount: string) => {
      setDemoAmount(amount);
    }
    const { placeBet, cancelBet, cashOut, setUserWalletAddress } = useGameStore(
      (game: GameState) => game.actions
    );


	const getButtonText = (): string => {
		if (!isConnected) return "Connecting...";
		if (isWaiting) return "Cancel bet";

		if (gameState5.status == "Running") {
			if (isPlaying && !isCashedOut) {
				return "Cash out";
			} else {
				return `Place bet (${currentMultiplier.toFixed(2)}x)`;
			}
		} else {
			return "Place bet";
		}
	};
    const handleButtonClick = () => {
      if (isWaiting) {
        cancelBet();
        return;
      }
  
      if (isPlaying && !isCashedOut) {
        cashOut();
      } else {
        console.log("address1a dude2", address1a);
        setUserWalletAddress(address1a);
        placeBet(betAmount, autoCashOut, currency);
       /* 
       make it work after must have the address1a
       */
        // placeBet(betAmount, autoCashOut, currency, address1a || '');
        jsConfetti.current?.addConfetti();
      }
    };

    const handleCashout = () => {
      if (audioRef.current) {
        audioRef.current.play()
      }
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti({
        emojis: ['💰', '🎉', '✨'],
        emojiSize: 50,
        confettiNumber: 100,
      })
      

      onCashout()
    }

    return (
      <div className="lg:col-span-2">
            <audio ref={audioRef} src="/sounds/cheering.mp3" /> {/* Add your MP3 file path here */}
          <audio ref={audioRef1} src="/sounds/losing.mp3" /> {/* Add your MP3 file path here */}
    
{/* new top */}

<Card>
		 {/* Button to trigger overlay
		 <Button onClick={toggleOverlay} className="show-overlay-btn">
		 Show Message Board
	   </Button> */}
 
	   {/* Overlay */}
	   {overlayVisible && (
		 <div className="overlay">
		   <div className="message-board-container">
			 <div className="message-form">
			   
			 <Tabs aria-label="Options">
        <Tab key="Sol" title="Sol">
		<Tabs aria-label="Options">
        <Tab key="Chippydeposit" title="Deposit">
		  <Card>
	  
<div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
  <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value='fuck you'
    viewBox={`0 0 256 256`}
  />
        <p>{textToCopy}</p>
      <a href="#" onClick={(e) => { e.preventDefault(); handleCopy(); }}>
        {copied ? "Copied!" : "Copy to Clipboard"}
      </a>
</div>

          </Card>
		  </Tab>
		  <Tab key="ChippyWithdraw" title="Withdraw">
		  <Card>
		  Enter a wallet address on the Solana network. Your withdrawal will be processed INSANTLY.
<div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
 <Label>Amount</Label>
 <input type="text" id="username" 
        placeholder="SOL" />
 <Label>Wallet Address for Withdrawal</Label>
 <input type="text" id="username" 
        placeholder="Wallet Address" />

<Button>Withdrawal</Button>
 
</div>
          </Card>
		  </Tab>
		  </Tabs>
        </Tab>
        <Tab key="Chippy" title="Chippy">
		<Tabs aria-label="Options">
        <Tab key="Chippydeposit" title="Deposit">
		  <Card>
		  
		  <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
  <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value='fuck you'
    viewBox={`0 0 256 256`}
  />
        <p>{textToCopy}</p>
      <a href="#" onClick={(e) => { e.preventDefault(); handleCopy(); }}>
        {copied ? "Copied!" : "Copy to Clipboard"}
      </a>
</div>
          </Card>
		  </Tab>
		  <Tab key="ChippyWithdraw" title="Withdraw">
		  <Card>
		  Enter a wallet address on the Solana network. Your withdrawal will be processed INSANTLY.
<div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
<Label>Amount</Label>
 <input type="text" id="username" 
        placeholder="SOL" />
 <Label>Wallet Address for Withdrawal</Label>
 <input type="text" id="username" 
        placeholder="Wallet Address" />

<Button>Withdrawal</Button>
</div>
          </Card>
		  </Tab>
		  </Tabs>
        </Tab>
        <Tab key="Demo" title="Demo">
<Card>
	<Label>Demo Amount {demoAmount}</Label>
	</Card>          
		  <Card>
Use demo currency to play our games without any risk. If you run out of demo credits, you can reset your demo balance anytime by clicking the button below. Have fun and enjoy your experience!
		  <Button
		  onClick={() => handleChangeDemoAmount('100')}
		  >
		  <FaWallet className={styles.walletIcon} /> {/* Icon from FontAwesome */}
			Reset Demo Balance		
		  </Button>
          </Card>
        </Tab>
      </Tabs>
			 
			 </div>
 
			
 
			 <button onClick={toggleOverlay} className="close-overlay-btn">
			   Close
			 </button>
		   </div>
		 </div>
	   )}
	
			<CardHeader>
				<CardTitle>Place your bets!</CardTitle>
			</CardHeader>

			<CardContent>
				<Label>Demo Amount</Label>
				<Input
					placeholder="Demo amount"
					type="number"
					min="0"
					value={demoAmount}
					disabled
				/>
				<Label>Bet Amount</Label>
				<Input
					placeholder="Bet amount"
					type="number"
					min="0"
					onChange={(e) => handleChangeBetAmount(e.target.value)}
					value={betAmount}
				/>
				<Label>Auto Cashout</Label>
				<Checkbox
					isSelected={isAutoCashOutDisabled}
					onChange={(e) => handleCheckboxChange(e.target.checked)}
				>
					Disable Auto Cashout
				</Checkbox>
				<Input
					placeholder="Auto cashout"
					type="number"
					min="0"
					step="0.01"
					onChange={(e) => handleChangeAutoCashOut(e.target.value)}
					value={autoCashOut}
					disabled={isAutoCashOutDisabled}
				/>
				<Label>Currency</Label>
				<CurrencyList 
					balances={balances} 
					onCurrencyChange={setCurrency}
				/>
			</CardContent>

			<CardFooter className="flex flex-col gap-4">
				<Button onClick={handleButtonClick} disabled={isButtonDisabled} className={styles.BetButton}>
					{getButtonText()}
				</Button>
				<Button onClick={toggleOverlay} className={styles.BetButton}>
					<FaWallet className={styles.walletIcon} />
					Deposit Chippy
				</Button>
			</CardFooter>
		</Card>

{/* new bottom */}

          <Card className="bg-black border-black">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bet-amount" className="text-white">
                  Bet Amount (SOL)
                </Label>
                <Input
                  id="bet-amount"
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={gameState !== "idle"}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="0.01"
                  step="0.01"
                />
              </div>
  
              <div>
                <Label htmlFor="auto-cashout" className="text-white">
                  Auto Cashout At
                </Label>
                <Input
                  id="auto-cashout"
                  type="number"
                  value={autoCashoutAt}
                  onChange={(e) => setAutoCashoutAt(e.target.value)}
                  disabled={gameState !== "idle"}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="1.01"
                  step="0.01"
                />
              </div>
  
              {gameState === "idle" ? (
                <Button 
                  onClick={() => onStartGame(betAmount, autoCashoutAt)} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Place Bet
                </Button>
              ) : gameState === "running" ? (
                <Button
                  onClick={handleCashout}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  disabled={userCashedOut}
                >
                  Cash Out ({currentMultiplier.toFixed(2)}x)
                </Button>
              ) : (
                <Button disabled className="w-full bg-red-600">
                  Crashed
                </Button>
              )}
            </div>
  
            {/* Active players */}
            {gameState !== "idle" && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Active Players</h3>
                <div className="space-y-2">
                  {cashouts.length === 0 && !userCashedOut && (
                    <div className="text-xs text-gray-500">Waiting for players to cash out...</div>
                  )}
                  {cashouts.map((cashout) => (
                    <div key={cashout.id} className="flex justify-between items-center text-xs">
                      <span className="font-medium text-white">{cashout.id === "you" ? "You" : cashout.id}</span>
                      <span className="text-yellow-400">
                        {cashout.amount.toFixed(2)} SOL @ {cashout.multiplier.toFixed(2)}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }
  
  export default Betbutton