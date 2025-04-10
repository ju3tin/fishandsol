"use client";

import { useEffect, useState } from 'react';

interface GameHistoryProps {
  dude55: boolean;
  buttonPressCount: number;
  currentMultiplier: number;
  gameState: string;
  isButtonPressed: boolean;
}

interface HistoryEntry {
  multiplier: number;
  isButtonPressed: boolean;
 
  dudeClicked: boolean;
}

const GameHistory: React.FC<GameHistoryProps> = ({ gameState, dude55, currentMultiplier, isButtonPressed }) => {
  const [gameHistory, setGameHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (gameState === "Crashed") {
      const newEntry: HistoryEntry = {
        multiplier: currentMultiplier,
        dudeClicked: dude55,
        isButtonPressed: isButtonPressed,
      };
      setGameHistory(prev => [newEntry, ...prev].slice(0, 10)); // Keep only the last 10 entries
    }
  }, [gameState, currentMultiplier, dude55, isButtonPressed]);

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
