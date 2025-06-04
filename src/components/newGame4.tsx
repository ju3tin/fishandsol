"use client";
import React, { useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore2"; // Import Zustand store

const CrashGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameStore((gameState: GameState) => gameState);
  //const  { timeElapsed, multiplier, timeRemaining, isCrashed } = useGameStore();
  const timeElapsed = gameState.timeElapsed;
  const multiplier = gameState.multiplier;
  const timeRemaining = gameState.timeRemaining;
  const isCrashed = gameState.isCrashed;


  useEffect(() => {
   
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 500; // Adjust canvas size
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;

    let prevX = 50;
    let prevY = canvas.height - 50;
    
    const numericMultiplier = Number(multiplier); // Convert to number if necessary

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);

      // Convert game timeElapsed into a graphable X coordinate
      const x = 50 + timeElapsed * 40;
      // Convert multiplier into a graphable Y coordinate
      const y = canvas.height - (numericMultiplier * 20) - 50;

      ctx.lineTo(x, y);
      ctx.stroke();

      prevX = x;
      prevY = y;
    };

    const interval = setInterval(() => {
      if (!isCrashed) {
        drawGraph();
      } else {
        ctx.fillStyle = "red";
        ctx.fillText(`Crashed at ${Number(multiplier).toFixed(2)}x!`, 200, 50);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeElapsed, multiplier, isCrashed]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Crash Graph</h2>
      <canvas ref={canvasRef} className="bg-black rounded-lg shadow-md" />
      {isCrashed && <p className="text-red-500 mt-2">Crashed at ${Number(multiplier).toFixed(2)}x!</p>}
    </div>
  );
};

export default CrashGraph;