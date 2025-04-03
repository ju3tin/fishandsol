"use client"

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
    const gameState5 = useGameStore((gameState5: GameState) => gameState5);
    const [betAmount, setBetAmount] = useState("0.1")
    const [autoCashoutAt, setAutoCashoutAt] = useState("2")
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioRef1 = useRef<HTMLAudioElement>(null)
    const [previousTimeRemaining, setPreviousTimeRemaining] = useState<number | null>(null);
    const [buttonPressCount, setButtonPressCount] = useState(0);
   // const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

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
      console.log(`Current Multiplier: ${multiplier}`);
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
                  disabled={gameState5.status !== "Waiting"}
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
                  disabled={gameState5.status !== "Waiting"}
                  className="bg-gray-700 border-gray-600 text-white"
                  min="1.01"
                  step="0.01"
                />
              </div>
  
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
  
            {/* Active players */}
            {gameState5.status !== "Waiting" && (
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