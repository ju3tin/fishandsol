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
    const gameState5 = useGameStore((gameState5: GameState) => gameState5);
    const [betAmount, setBetAmount] = useState("0.1")
    const [autoCashoutAt, setAutoCashoutAt] = useState("2")
    const audioRef = useRef<HTMLAudioElement>(null)
    const audioRef1 = useRef<HTMLAudioElement>(null)
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
              ) : gameState5.status === "Running" ? (
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