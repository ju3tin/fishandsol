"use client"

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import QRCode from "react-qr-code";
import {Tabs, Tab, CardBody} from "@nextui-org/react";
import { FaWallet } from 'react-icons/fa'; // Using FontAwesome for example

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
    gameState: "Waiting" | "Running" | "Crashed" | "Unknown" | "Stopped";
    currentMultiplier: number;
    onStartGame: (betAmount: string, autoCashoutAt: string) => void;
    onCashout: (multiplier: number) => void; // Update to accept a multiplier
    userCashedOut: boolean;
    cashouts: Array<{
      id: string;
      multiplier: number;
      amount: number;
    }>;
    multiplier: number;
  }

  const Betbutton = ({ 
    gameState, 
    currentMultiplier, 
    onStartGame, 
    onCashout,
    userCashedOut,
    cashouts,
    multiplier
  }: BetbuttonProps) => {
    const [betgreaterthan0, setBetgreaterthan0] = useState(false);
	
    const textRef = useRef();
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
	const [copied, setCopied] = useState(false);
	const textToCopy = "This is the text to copy!";
  
    const toggleOverlay = () => {
      setOverlayVisible(!overlayVisible);
      };
      const red1 = () => {
        setBetgreaterthan0(!betgreaterthan0);
      //	console.log("red1");
      };
      const red2 = () => {
      setDemoamountgreaterthan0(!demoamountgreaterthan0);
      //	console.log("red1");
      };
      const [demoamountgreaterthan0, setDemoamountgreaterthan0] = useState(false);
	
    const [overlayVisible, setOverlayVisible] = useState(false);
    const handleChangeDemoAmount = (amount: string) => {
      setDemoAmount(amount);
    }
    const [autoCashOut, setAutoCashOut] = useState<string>("0");
    const [isAutoCashOutDisabled, setIsAutoCashOutDisabled] = useState(true);
    const gameState5 = useGameStore((gameState5: GameState) => gameState5);
    const [betAmount, setBetAmount] = useState("0.1")
    const [autoCashoutAt, setAutoCashoutAt] = useState("2")
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioRef1 = useRef<HTMLAudioElement>(null)
    const [previousTimeRemaining, setPreviousTimeRemaining] = useState<number | null>(null);
    const [buttonPressCount, setButtonPressCount] = useState(0);
   // const [isButtonClicked, setIsButtonClicked] = useState(false);
   const [demoAmount, setDemoAmount] = useState<string>("0");
	
    const [buttonClicked, setButtonClicked] = useState(false);
    const balances = useGameStore((game: GameState) => game.balances);
    const [currency, setCurrency] = useState<string>(currencies[0].id);
    const handleCheckboxChange = (checked: boolean) => {
      setIsAutoCashOutDisabled(checked);
      if (checked) {
        setAutoCashOut("0"); // Optionally reset autoCashOut when disabling
      }
    };
	
    useEffect(() => {
      if (gameState5.status === "Waiting") {
        setButtonClicked(false);
      }
    }, [gameState5.status]);

    useEffect(() => {
      if (isNaN(gameState5.timeRemaining)) {
        // If timeRemaining is NaN, keep the previous value
        return;
      } else {
        // Otherwise, update previousTimeRemaining with the current timeRemaining
        setPreviousTimeRemaining(gameState5.timeRemaining);
      }
    }, [gameState5.timeRemaining]);

    useEffect(() => {
      // Check if game crashed and user didn't cash out
      if (gameState5.status === "Crashed" && buttonPressCount === 1 && !buttonClicked) {
        loseout();
      }
    }, [gameState5, userCashedOut, buttonPressCount, buttonClicked]);

    useEffect(() => {
      if (gameState5.status === "Crashed") {
        const timer = setTimeout(() => {
          setButtonPressCount(0);
        }, 1000); // Set buttonPressCount to 0 after 1 second

        return () => clearTimeout(timer); // Cleanup the timer on unmount
      }
    }, [gameState5.status]);

    const loseout = () => {
      if (audioRef1.current) {
        audioRef1.current.play()
      }

    }
    const handleCashout = () => {
      setButtonClicked(true);
      const current12 = multiplier;
      console.log(`dude34 Current Multiplier: ${current12}`);
      if (audioRef.current) {
        audioRef.current.play()
      }
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti({
        emojis: ['💰', '🎉', '✨'],
        emojiSize: 50,
        confettiNumber: 100,
      })
      

      onCashout(current12);
    }

    const handleButtonPress = () => {
      setButtonPressCount((prevCount) => prevCount + 1);
      onStartGame(betAmount, autoCashoutAt);
    };

    return (
      <div className="lg:col-span-2">
          <audio ref={audioRef} src="/sounds/cheering.mp3" /> {/* Add your MP3 file path here */}
          <audio ref={audioRef1} src="/sounds/losing.mp3" /> {/* Add your MP3 file path here */}
        <Card className="bg-black border-black">
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

{demoamountgreaterthan0 && (
		<div className="overlay">
		<div className="message-board-container">
		<div className="message-form">
		<p>Demo amount must be greater than 0.</p>
		</div>
		<button onClick={red2} className="close-overlay-btn">
			   Close
			 </button>
		</div>
		</div>
	)}


	   {betgreaterthan0 && (
		<div className="overlay">
			 <div className="message-board-container">
			 <div className="message-form">
		<p>Bet amount must be greater than 0.</p>
		</div>
		<button onClick={red1} className="close-overlay-btn">
			   Close
			 </button>
		</div>
		</div>
	   )}
          <CardContent className="p-6">
            <div className="space-y-4">
            <div className={styles.inputGroup}>
					<Label>Demo Amount</Label>
					<Input
						placeholder="Demo amount"
						type="number"
						min="0"
						value={demoAmount}
						disabled
					/>
				</div>
              <div>
                <Label htmlFor="bet-amount" className="text-white">
                  Bet Amount (SOL)
                </Label>
                <Input
                  id="bet-amount"
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={gameState5.status !== "Waiting"}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="0.01"
                  step="0.01"
                />
              </div>
  
              <div>
                <Label htmlFor="auto-cashout" className="text-white">
                  Auto Cashout
                </Label>
                <Checkbox
					isSelected={isAutoCashOutDisabled}
					onChange={(e) => handleCheckboxChange(e.target.checked)}
				>
					Disable Auto Cashout
				</Checkbox>
                <Input
                  id="auto-cashout"
                  type="number"
                  value={autoCashoutAt}
                  onChange={(e) => setAutoCashoutAt(e.target.value)}
                  disabled={gameState5.status !== "Waiting"}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="1.01"
                  step="0.01"
                />
              </div>
              <Label>Currency</Label>
				<CurrencyList 
					balances={balances} 
					onCurrencyChange={setCurrency}
				/>
              {gameState5.status === "Waiting" ? (
                <Button 
                  onClick={buttonPressCount > 0 ? undefined : handleButtonPress} 
                  className={`w-full ${buttonPressCount > 0 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={buttonPressCount > 0}
                >
                  {buttonPressCount > 0 ? (
                    <p className="text-black">Bet Placed</p>
                  ) : (
                    typeof gameState5.timeRemaining === 'number' && !isNaN(gameState5.timeRemaining) ? (
                      <p className="text-black">Place Bet {gameState5.timeRemaining}</p>
                    ) : (
                      <p className="text-black">Place Bet {previousTimeRemaining}</p>
                    )
                  )}
                </Button>
              ) : gameState5.status === "Running" ? (
                
                
                <Button
                  onClick={handleCashout}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                  disabled={userCashedOut || buttonClicked || buttonPressCount == 0}
                >
                  Cash Out ({currentMultiplier}x)
                </Button>
              ) : (
                <Button disabled className="w-full bg-red-600">
                  Crashed ({currentMultiplier}x)
                </Button>
              )}
            </div>
            <div>
				<Button  onClick={toggleOverlay} className={styles.BetButton}>
				<FaWallet className={styles.walletIcon} /> {/* Icon from FontAwesome */}
					Deposit Chippy</Button></div>
            {/* Active players */}
           {/*  {gameState5.status !== "Waiting" && (
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
            )} */}
          </CardContent>
        </Card>
      </div>
    )
  }
  
  export default Betbutton