"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGameStore, GameState } from "../store/gameStore2";

const CrashGraph: React.FC = () => {
  const [data, setData] = useState<{ time: number; multiplier: number }[]>([]);
  const gameState = useGameStore((state: GameState) => state);

  useEffect(() => {
    if (gameState.status === "Waiting" || gameState.status === "Crashed") {
      console.log("Game reset - clearing graph data");
      setData([]);
    }
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status !== "Running") return;

    console.log("Graph updating with:", {
      timeElapsed: gameState.timeElapsed,
      multiplier: gameState.multiplier,
      crashPoint: gameState.crashPoint,
    });

    const interval = setInterval(() => {
      setData((prevData) => {
        if (
          prevData.length > 0 &&
          prevData[prevData.length - 1].time === gameState.timeElapsed
        ) {
          return prevData; // Prevent duplicate time entries
        }
        return [
          ...prevData,
          { time: gameState.timeElapsed, multiplier: gameState.multiplier },
        ];
      });

      if (gameState.crashPoint !== undefined && gameState.multiplier >= gameState.crashPoint) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameState.status, gameState.timeElapsed, gameState.multiplier]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Crash Graph</h2>
      <ResponsiveContainer width={800} height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "white" }} />
          <YAxis domain={[1, (gameState.crashPoint || 2) + 1]} tick={{ fill: "white" }} />
          <Tooltip />
          <Line type="monotone" dataKey="multiplier" stroke="#00ff00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {gameState.status === "Crashed" && (
        <p className="text-red-500 mt-2">Crashed at {gameState.multiplier.toFixed(2)}x!</p>
      )}
      {gameState.status === "Waiting" && <p className="text-yellow-500 mt-2">Waiting for the next round...</p>}
    </div>
  );
};

export default CrashGraph;