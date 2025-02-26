"use client";
import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useGameStore, GameState } from "../store/gameStore2";

const getRandomCrashPoint = (): number => Math.random() * 5 + 1.5; // Random crash between 1.5x and 6.5x

const CrashGraph: React.FC = () => {
  const [data, setData] = useState<{ time: number; multiplier: number }[]>([]);
  const [time, setTime] = useState(0);
  const [crashPoint, setCrashPoint] = useState(getRandomCrashPoint());
  const [isCrashed, setIsCrashed] = useState(false);
  const gameState = useGameStore((state: GameState) => state);

  useEffect(() => {
    if (gameState.status === "Waiting" && gameState.timeRemaining === 1) {
      setData([]);
      setTime(0);
      setIsCrashed(false);
      setCrashPoint(getRandomCrashPoint());
    }
  }, [gameState.status, gameState.timeRemaining]);

  useEffect(() => {
    if (isCrashed) return;

    const interval = setInterval(() => {
      setTime((prevTime) => {
        const newTime = prevTime + 0.1;
        const newMultiplier = Math.exp(newTime / 2); // Exponential curve

        if (gameState.status === "Crashed") {
          setIsCrashed(true);
          clearInterval(interval);
        }

        setData((prevData) => [...prevData, { time: newTime, multiplier: newMultiplier }]);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCrashed, gameState.status]);

  const lastPoint = data.length > 0 ? data[data.length - 1] : { time: 0, multiplier: 1 };
    const overlayPath = data
    .map((point, index) => {
      const x = (point.time / (time + 1)) * 800; // Adjust X scaling
      const y = 300 - (point.multiplier / (crashPoint + 1)) * 300; // Adjust Y scaling
      return `${index === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");
  return (
    <div className="p-4 text-white rounded-lg shadow-md relative" style={{ backgroundImage: `url(/under3.png)` }}>
     
     
     
      <ResponsiveContainer width={800} height={300}>
        <LineChart data={data}>
          <XAxis hide dataKey="time" />
          <YAxis hide domain={[1, crashPoint + 1]} />
          <Line type="monotone" dataKey="multiplier" stroke="#00ff00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{}}>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <path d={overlayPath} stroke="blue" strokeWidth="3" fill="none" />
      </svg>
      {/* Floating SVG Circle */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
     
  <image
    href="/fish.svg" 
    width="40"
    height="40"
    x={`${(lastPoint.time / (crashPoint + 1)) * 100}%`}
    y={`${100 - (lastPoint.multiplier / (crashPoint + 1)) * 100}%`}
    transform="translate(-15, -15)" // Centers the image
  />
</svg>
</div>
      {gameState.status === "Crashed" && <p className="text-red-500 mt-2">Crashed at {gameState.multiplier}x!</p>}
    </div>
  );
};

export default CrashGraph;