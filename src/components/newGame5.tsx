"use client";
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGameStore, GameState } from "../store/gameStore2";

const CrashGraph: React.FC = () => {
  const [data, setData] = useState<{ time: number; multiplier: number }[]>([]);
  const [time, setTime] = useState(0);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [isCrashed, setIsCrashed] = useState(false);

  const gameState = useGameStore((state: GameState) => state);

  // Reset graph when game state changes
  useEffect(() => {
    if (gameState.status === "Crashed") {
      console.log("Game crashed - resetting chart");
      setData([]);
      setTime(0);
      setCrashPoint(gameState.crashPoint || 2); // Ensure a valid crashPoint is set
      setIsCrashed(true);
    } else if (gameState.status === "Waiting") {
      console.log("Game is waiting - clearing chart");
      setData([]);
      setTime(0);
      setIsCrashed(false);
      setCrashPoint(null);
    } else if (gameState.status === "Running") {
      console.log("Game started - initializing graph");
      setData([]);
      setTime(0);
      setIsCrashed(false);
      setCrashPoint(gameState.crashPoint || 2); // Ensure a valid crashPoint is set
    }
  }, [gameState.status]);

  // Run graph simulation only when Running
  useEffect(() => {
    if (gameState.status !== "Running" || isCrashed || crashPoint === null) return;

    const interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 0.1;
        const newMultiplier = Math.exp(newTime / 2); // Exponential curve

        if (newMultiplier >= crashPoint) {
          setIsCrashed(true);
          clearInterval(interval);
          return prevTime; // Stop updating time
        }

        setData((prevData) => [...prevData, { time: newTime, multiplier: newMultiplier }]);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status, isCrashed, crashPoint]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Crash Graph</h2>
      <ResponsiveContainer width={800} height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "white" }} />
          <YAxis domain={[1, (crashPoint || 2) + 1]} tick={{ fill: "white" }} />
          <Tooltip />
          <Line type="monotone" dataKey="multiplier" stroke="#00ff00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {isCrashed && crashPoint !== null && (
        <p className="text-red-500 mt-2">Crashed at {crashPoint.toFixed(2)}x!</p>
      )}
      {gameState.status === "Waiting" && <p className="text-yellow-500 mt-2">Waiting for the next round...</p>}
    </div>
  );
};

export default CrashGraph;