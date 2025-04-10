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
  onStartGame: (betAmount: string, autoCashoutAt: string, CurrencyId: string) => void;
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
}: BetbuttonProps) => {
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
  const gameState5 = useGameStore((state: GameState) => state);

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
    if (gameState5.status === "Waiting") {
      setButtonClicked(false);
      setHasUserCashedOut(false);
      setCashon1(false);
    }
  }, [gameState5.status]);

  useEffect(() => {
    if (gameState5.status === "Crashed" && buttonPressCount === 1 && !buttonClicked) {
      loseout();
    }
  }, [gameState5, buttonPressCount, buttonClicked]);

  useEffect(() => {
    if (gameState5.status === "Crashed") {
      const timer = setTimeout(() => {
        setButtonPressCount(0);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState5.status]);

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
    onStartGame(betAmount, autoCashoutAt, currency);
    dude56(currency);
    console.log(`this is the checked ${currency}`);
  };

  return (
    <div className="lg:col-span-2 bg-black border-black">
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
  );
};

export default Betbutton;
