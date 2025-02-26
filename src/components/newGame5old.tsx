"use client"
import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGameStore, GameState } from '../store/gameStore2';

const getRandomCrashPoint = (): number => Math.random() * 5 + 1.5; // Random crash between 1.5x and 6.5x

const CrashGraph: React.FC = () => {
  const [data, setData] = useState<{ time: number; multiplier: number }[]>([]);
  const [time, setTime] = useState(0);
  const [crashPoint, setCrashPoint] = useState(getRandomCrashPoint());
  const [isCrashed, setIsCrashed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
const gameState = useGameStore((state: GameState) => state);

useEffect(() => {
  if (gameState.status === "Waiting" && gameState.timeRemaining == 1) {
    console.log("Game reset - clearing graph data");
    setData([]);
    setTime(0);
    setIsCrashed(false);
    setCrashPoint(getRandomCrashPoint());
  }
}, [gameState.status, gameState.timeRemaining]);


useEffect(() => {
  if (gameState.status == "Running") return;

  console.log("Graph updating with:", {
    //timeElapsed: gameState.timeElapsed,
    multiplier: gameState.multiplier,
    //crashPoint: gameState.crashPoint,
  });
/*
  intervalRef.current = setInterval(() => {
    setData((prevData) => {
      if (
        prevData.length > 0 &&
        prevData[prevData.length - 1].time === gameState.timeElapsed
      ) {
        return prevData; // Prevent duplicate entries
      }
      return [
        ...prevData,
        { time: gameState.timeElapsed, multiplier: gameState.multiplier },
      ];
    });

    if (gameState.crashPoint !== undefined && gameState.multiplier >= gameState.crashPoint) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, 100);
*/
/*
  return () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  */
}, [gameState.status]);


useEffect(() => {
   
  
    if (isCrashed) return;

    const interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 0.1;
        const newMultiplier = Math.exp(newTime / 2); // Exponential curve

        if (gameState.status == 'Crashed') {
          setIsCrashed(true);
          clearInterval(interval);
        }

        setData((prevData) => [...prevData, { time: gameState.multiplier, multiplier: newMultiplier }]);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCrashed, gameState.status]);

  return (
    <div style={{backgroundImage: `url(/under3.png)`}} className="p-4 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4"></h2>
      <ResponsiveContainer width={800} height={300}>
        <LineChart data={data}>
          <XAxis hide={true} dataKey="time" tick={{ fill: "black" }} />
          <YAxis hide={true} domain={[1, crashPoint + 1]} tick={{ fill: "black" }} />
          {/*<Tooltip />*/}
          <Line type="monotone" dataKey="multiplier" stroke="#00ff00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {gameState.status == 'Crashed' && <p className="text-red-500 mt-2">Crashed at {gameState.multiplier}x!</p>}
    </div>
  );
};

export default CrashGraph;