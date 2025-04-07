"use client"
import CrashGame from "@/components/crash-game4"
import Visualization from "@/components/visual";
import Image from 'next/image'; // Import the Image component

import { useGameStore, GameState } from '../../../store/gameStore2';
export default function Home() {
  const gameState5 = useGameStore((gameState5: GameState) => gameState5);

  return (
    
    <main className="flex flex-col items-center justify-center p-4 bg-black">
      
      <Visualization currentMultiplier={gameState5.multiplier}/>
    </main>
  )
}
