"use client";

import { useEffect, useState } from 'react';

interface GameHistoryProps {
  dude45: boolean;
  dude55: boolean;
  buttonPressCount: number;
  currentMultiplier: number;
  gameState: string;
  dude56a: boolean;
  dude56b: number;
  buttonPressCount2: number;
  isButtonPressed: boolean;
}

interface HistoryEntry {
  multiplier: number;
  isButtonPressed: boolean;
  buttonPressCount: number;
  dudeClicked: boolean;
  dude45: boolean;
  dude55: boolean;
  dude56a: boolean;
  buttonPressCount2: number;
  dude56b: number;
}

const GameHistory: React.FC<GameHistoryProps> = ({ buttonPressCount2, gameState, dude55, currentMultiplier, isButtonPressed, buttonPressCount, dude56b, dude56a, dude45 }) => {
  const [gameHistory, setGameHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (gameState === "Crashed") {
      const newEntry: HistoryEntry = {
        multiplier: currentMultiplier,
        dudeClicked: dude55,
        dude45: dude45,
        buttonPressCount2: buttonPressCount2,
        dude56a: dude56a,
        dude56b: dude56b,
        dude55: dude55,
        isButtonPressed: isButtonPressed,
        buttonPressCount: buttonPressCount,
      };
      console.log(buttonPressCount2, buttonPressCount, dude55, dude56b, dude56a +" dude 123");
      setGameHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep only the last 10 entries
    }
  }, [gameState, currentMultiplier, dude55, buttonPressCount, dude45,dude56b, dude55, dude56a, isButtonPressed, buttonPressCount2]);

  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {gameHistory.length > 0 ? (
        gameHistory.map((entry, index) => (
          <div
            key={index}
            className={`px-2 py-1 rounded text-xs font-mono ${
              entry.dudeClicked ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
            }`}
          >
            {entry.multiplier.toFixed(2)}x {/*- {entry.isButtonPressed ? "1" : "2"} */}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No game history yet</p>
      )}
    </div>
  );
};

export default GameHistory;
