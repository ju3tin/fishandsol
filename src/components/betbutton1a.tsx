"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import QRCode from "react-qr-code";
import { Tabs, Tab, CardBody } from "@nextui-org/react";
import { FaWallet } from "react-icons/fa";
import { toast } from "sonner";
import { Checkbox } from "@nextui-org/checkbox";
import { useGameStore, GameState } from "../store/gameStore";
import { useEffectEvent } from "../hooks/useEffectEvent";
import useWalletAuth from "../hooks/useWalletAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { currencies } from "../lib/currencies";
import CurrencyList from "./CurrencyList1";
import styles from "../styles/components/GameControls.module.css";
import { useState, useEffect, useRef } from "react";
import JSConfetti from "js-confetti";

type BetbuttonProps = {
  isButtonPressed: boolean;
  gametime: number;
  gameState: "Waiting" | "Running" | "Crashed" | "Unknown" | "Stopped";
  currentMultiplier: number;
  onStartGame: (betAmount: string, autoCashoutAt: string, CurrencyId: string, buttonPressCount: number) => void;
  onCashout: (multiplier: number) => void;
  userCashedOut: boolean;
  cashouts: Array<{
    id: string;
    multiplier: number;
    amount: number;
  }>;
  multiplier: number;
  dude56: (CurrencyId: string) => void;
  dude45: (hasUserCashedOut: boolean) => void;
  dude56a: (buttonClicked: boolean) => void;
  dude56b: (buttonPressCount: number) => void;
  sendToCrashGame3: (buttonPressCount: number) => void;
};

const Betbutton = ({
  isButtonPressed,
  gametime,
  currentMultiplier,
  onStartGame,
  onCashout,
  userCashedOut,
  cashouts,
  gameState,
  multiplier,
  dude45,
  dude56,
  dude56a,
  dude56b,
  sendToCrashGame3,
}: BetbuttonProps) => {
  const [setisButtonPressed] = useState(false);
  const [betgreaterthan0, setBetgreaterthan0] = useState(false);
  const [demoamountgreaterthan0, setDemoamountgreaterthan0] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [betAmount, setBetAmount] = useState("0.1");
  const [autoCashoutAt, setAutoCashoutAt] = useState("2");
  const [autoCashOut, setAutoCashOut] = useState<string>("0");
  const [isAutoCashOutDisabled, setIsAutoCashOutDisabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [demoAmount, setDemoAmount] = useState<string>("0");
  const [hasUserCashedOut, setHasUserCashedOut] = useState(false);
  const [cashon1, setCashon1] = useState(false);
  const [buttonPressCount, setButtonPressCount] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [currency, setCurrency] = useState<string>(currencies[0].id);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRef1 = useRef<HTMLAudioElement>(null);
  const textToCopy = "This is the text to copy!";
  //const gameState5 = useGameStore((state: GameState) => state);
  const [previousTimeRemaining, setPreviousTimeRemaining] = useState<number | null>(null);
    
  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  const handleChangeDemoAmount = (amount: string) => {
    setDemoAmount(amount);
  }
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  const red1 = () => {
    setBetgreaterthan0(!betgreaterthan0);
  };

  const red2 = () => {
    setDemoamountgreaterthan0(!demoamountgreaterthan0);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsAutoCashOutDisabled(checked);
    if (checked) {
      setAutoCashOut("0");
    }
  };

 useEffect(() => {
      if (isNaN(gametime)) {
        // If timeRemaining is NaN, keep the previous value
        return;
      } else {
        // Otherwise, update previousTimeRemaining with the current timeRemaining
        setPreviousTimeRemaining(gametime);
      }
    }, [gametime]);

  useEffect(() => {
    if (gameState === "Waiting") {
      setButtonClicked(false);
      setHasUserCashedOut(false);
      setCashon1(false);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "Crashed" && buttonPressCount === 1 && !buttonClicked) {
      loseout();
    }
  }, [gameState, buttonPressCount, buttonClicked]);

  useEffect(() => {
    
    if (gameState === "Crashed") {
      const timer = setTimeout(() => {
        setButtonPressCount(0);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const loseout = () => {
    if (audioRef1.current) {
      audioRef1.current.play();
    }
  };

  const handleCashout = () => {
    setButtonClicked(true);
    setHasUserCashedOut(true);
    setCashon1(true);

    const current12 = multiplier;
    console.log(`dude34 Current Multiplier: ${current12} using this 1235 ${currency}`);

    if (audioRef.current) {
      audioRef.current.play();
    }

    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ["💰", "🎉", "✨"],
      emojiSize: 50,
      confettiNumber: 100,
    });

    onCashout(current12);
    dude56(currency);
  };

  const handleButtonPress = () => {
    setButtonPressCount((prevCount) => prevCount + 1);
    const newCount = buttonPressCount + 1;
    console.log(`Place Bet button pressed at ${new Date().toISOString()} - count: ${newCount}`);
    onStartGame(betAmount, autoCashoutAt, currency, newCount);
    dude56(currency);
    dude56a(buttonClicked);
    dude56b(newCount);

    // Send newCount to crash-game3 if it's greater than 1
    if (newCount === 1) {
      dude56b(1)
      sendToCrashGame3(1);
      console.log(`the button is bigger ytrewq 0 and === ${newCount} where is the crack34 ${dude56b(0)}`)
    }

    if (buttonPressCount === 0) {
      // Already logged above, so this block is probably redundant, but preserved for logic
      dude56b(0)
      sendToCrashGame3(0);
      console.log(`hjkl the button is smaller than 1 and === ${buttonPressCount} where is the crack34 ${dude56b(3)}`)
    }

    console.log(`this is the checked ${currency} the button is if it is 1 ${buttonPressCount}`);
  };
  const balances = useGameStore((game: GameState) => game.balances);
  return (
    <>
    <div className="card1 lg:col-span-2 bg-black border-black">
      <audio ref={audioRef} src="/sounds/cheering.mp3" />
      <audio ref={audioRef1} src="/sounds/losing.mp3" />

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
                            value="Deposit Address Here"
                            viewBox="0 0 256 256"
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
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                          <Label>Amount</Label>
                          <Input type="text" placeholder="SOL" />
                          <Label>Wallet Address for Withdrawal</Label>
                          <Input type="text" placeholder="Wallet Address" />
                          <Button>Withdraw</Button>
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
                            value="Deposit Address Here"
                            viewBox="0 0 256 256"
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
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                          <Label>Amount</Label>
                          <Input type="text" placeholder="CHIPPY" />
                          <Label>Wallet Address for Withdrawal</Label>
                          <Input type="text" placeholder="Wallet Address" />
                          <Button>Withdraw</Button>
                        </div>
                      </Card>
                    </Tab>
                  </Tabs>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* You can put your BET button or controls here */}
      <div className="p-4 flex flex-col gap-4">
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          placeholder="Enter bet amount"
        />
        <Input
          type="number"
          value={autoCashoutAt}
          onChange={(e) => setAutoCashoutAt(e.target.value)}
          placeholder="Auto cashout at"
          disabled={isAutoCashOutDisabled}
        />
        <Button onClick={handleButtonPress} disabled={buttonPressCount > 0}>
          Place Bet
        </Button>
        <Button onClick={handleCashout} disabled={!buttonPressCount || hasUserCashedOut}>
          Cash Out
        </Button>
        <Button onClick={toggleOverlay}>
          Open Wallet Options
        </Button>
      </div>
    </div>
    <div className="card lg:col-span-2 bg-black border-black">
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
                  Bet Amount (SOL1)
                </Label>
                <Input
                  id="bet-amount"
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  disabled={gameState !== "Waiting" || buttonClicked || buttonPressCount === 1}
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
          disabled={gameState !== "Waiting" || buttonClicked || buttonPressCount === 1}
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
                  disabled={gameState !== "Waiting" || buttonClicked || buttonPressCount === 1}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="1.01"
                  step="0.01"
                />
              </div>
              <Label>Currency</Label>
				<CurrencyList
          buttonPressCount={buttonPressCount}
          buttonClicked={buttonClicked}
          gameState={gameState}
					balances={balances} 
					onCurrencyChange={setCurrency}
				/>
              {gameState === "Waiting" ? (
                <Button 
                  onClick={buttonPressCount > 0 ? undefined : handleButtonPress} 
                  className={`w-full ${buttonPressCount > 0 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'}`}
                  disabled={buttonPressCount > 0}
                >
                  {buttonPressCount > 0 ? (
                    <p className="text-black">Bet Placed</p>
                  ) : (
                    typeof gametime === 'number' && !isNaN(gametime) ? (
                      <p className="text-black">Place Bet {gametime}</p>
                    ) : (
                      <p className="text-black">Place Bet {previousTimeRemaining}</p>
                    )
                  )}
                </Button>
              ) : gameState === "Running" ? (
                
                
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
         
        </Card>
      </div>
</>
  );
};

export default Betbutton;
