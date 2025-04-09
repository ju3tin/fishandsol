"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fish } from "lucide-react"
import GameChat from "./game-chat3a"
import Betbutton from "./betbutton1a"
import BetList from "./BetList1"
import GameVisual from './visualization';
import Tabs from './tabs3';
import useSound from 'use-sound';
import { useGameStore, GameState } from '../store/gameStore2';
import { toast } from 'react-toastify'; // Ensure you have the toast library
import { currencyById } from '@/lib/currencies';

interface GameHistoryProps {
  dude55: boolean;
  buttonPressCount: number;
  currentMultiplier: number;
  gameState: string
}

const GameHistory: React.FC<GameHistoryProps> = ({ gameState, dude55, buttonPressCount, currentMultiplier }) => {
const [gameHistory, setGameHistory] = useState<number[]>([])
    useEffect(() => {
        if (gameState == "Crashed") {
          setGameHistory(prev => [currentMultiplier, ...prev].slice(0, 10)) // Keep last 10 crashes
        }
      }, [gameState, currentMultiplier])
return (
<div className="flex gap-2 overflow-x-auto py-2">
{gameHistory.map((multiplier, index, handleUserCashedOut) => (
  <div
    key={index}
    className={`px-2 py-1 rounded text-xs font-mono ${
      multiplier < 2 ? "bg-red-900/50 text-red-400" : "bg-green-900/50 text-green-400"
    }`}
  >
    {multiplier.toFixed(2)}x{dude55 ? "Clicked" : "Not Clicked"} yt {buttonPressCount} tyz {handleUserCashedOut}
  </div>
))}
{gameHistory.length === 0 && <p className="text-gray-500 text-sm">No game history yet</p>}
</div>)
}
export default GameHistory