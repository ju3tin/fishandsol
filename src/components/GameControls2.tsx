"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import JSConfetti from 'js-confetti';
import { FaWallet } from 'react-icons/fa'; // Using FontAwesome for example
import {Tabs, Tab, CardBody} from "@nextui-org/react";
import copy from "copy-to-clipboard";
//import { toast } from "react-toastify";


import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/uis/card";
import { toast } from "sonner";
import { Checkbox } from "@nextui-org/checkbox";
import { useGameStore, GameState } from "../store/gameStore2";
import { useEffectEvent } from "../hooks/useEffectEvent";
import useWalletAuth from "../hooks/useWalletAuth";
import { Input } from "@/components/uis/input";
import { Button } from "@/components/uis/button";
import { Label } from "@/components/uis/label";
import { currencies } from "../lib/currencies";
import CurrencyList from "./CurrencyList";
import styles from "../styles/components/GameControls1.module.css";

export default function GameControls() {
	const textRef = useRef();
	
	const [copied, setCopied] = useState(false);
	const textToCopy = "This is the text to copy!";
  
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
	
	
	const walletAuth = useWalletAuth();
	const [overlayVisible, setOverlayVisible] = useState(false);
	const [demoAmount, setDemoAmount] = useState<string>("0");
	const [betAmount, setBetAmount] = useState<string>("0");
	const [autoCashOut, setAutoCashOut] = useState<string>("0");
	const [currency, setCurrency] = useState<string>(currencies[0].id);
	const [isAutoCashOutDisabled, setIsAutoCashOutDisabled] = useState(false);

	const isWaiting = useGameStore((game: GameState) => game.isWaiting);
	const isPlaying = useGameStore((game: GameState) => game.isPlaying);
	const isCashedOut = useGameStore((game: GameState) => game.isCashedOut);
	const gameStatus = useGameStore((game: GameState) => game.status);
	const isConnected = useGameStore((game: GameState) => game.isConnected);
	const isLoggedIn = useGameStore((game: GameState) => game.isLoggedIn);
	const balances = useGameStore((game: GameState) => game.balances);
	const errors = useGameStore((game: GameState) => game.errors);
	const errorCount = useGameStore((game: GameState) => game.errorCount);

	const { placeBet, cancelBet, cashOut } = useGameStore(
		(game: GameState) => game.actions
	);

	const haveValidBet =
		/^[0-9]+(\.?[0-9])*$/.test(betAmount) && parseFloat(betAmount);

	const handleChangeBetAmount = (amount: string) => {
		setBetAmount(amount);
	};
	
	const handleChangeDemoAmount = (amount: string) => {
		setDemoAmount(amount);
	}

	const handleChangeAutoCashOut = (amount: string) => {
		setAutoCashOut(amount);
	};

	const handleCheckboxChange = (checked: boolean) => {
		setIsAutoCashOutDisabled(checked);
		if (checked) {
			setAutoCashOut("0"); // Optionally reset autoCashOut when disabling
		}
	};

	const jsConfetti = useRef<JSConfetti>();

	useEffect(() => {
		jsConfetti.current = new JSConfetti();
	}, []);

	const handleButtonClick = () => {
		if (isWaiting) {
			cancelBet();
			return;
		}

		if (isPlaying && !isCashedOut) {
			cashOut();
		} else {
			placeBet(betAmount, autoCashOut, currency);
			jsConfetti.current?.addConfetti();
		}
	};

	const isButtonDisabled: boolean = !isConnected;

	const getButtonText = (): string => {
		if (!isConnected) return "Connecting...";
		if (isWaiting) return "Cancel bet";

		if (gameStatus == "Running") {
			if (isPlaying && !isCashedOut) {
				return "Cash out";
			} else {
				return "Place bet (next round)";
			}
		} else {
			return "Place bet";
		}
	};

	const showErrorToast = useEffectEvent(() => {
		if (errors.length > 0) toast("⚠️ " + errors[errors.length - 1]);
	});
	const toggleOverlay = () => {
		setOverlayVisible(!overlayVisible);
	  };
	  
	

	useEffect(() => {
		showErrorToast();
	}, [errorCount]);



	
	
	return (
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

			<CardFooter>
				<Button onClick={handleButtonClick} disabled={isButtonDisabled} className={styles.BetButton}>
					{getButtonText()}
				</Button>
				<div>
				<Button  onClick={toggleOverlay} className={styles.BetButton}>
				<FaWallet className={styles.walletIcon} /> {/* Icon from FontAwesome */}
					Deposit Chippy</Button></div>
			</CardFooter>
		</Card>
	);
}