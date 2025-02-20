"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGameStore, GameState } from "../store/gameStore2"; // Import Zustand store

const CrashGraph: React.FC = () => {
  const { timeElapsed, multiplier, isCrashed } = useGameStore();
  const [data, setData] = useState<{ time: number; multiplier: number }[]>([]);

  useEffect(() => {
    if (isCrashed) return; // Stop updating if crashed

    const interval = setInterval(() => {
      setData((prevData) => [
        ...prevData,
        { time: timeElapsed, multiplier: Number(multiplier) }, // Ensure multiplier is a number
      ]);
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [timeElapsed, multiplier, isCrashed]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Crash Graph</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "white" }} />
          <YAxis domain={[1, Math.max(...data.map((d) => d.multiplier), 2)]} tick={{ fill: "white" }} />
          <Tooltip />
          <Line type="monotone" dataKey="multiplier" stroke="#00ff00" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {isCrashed && <p className="text-red-500 mt-2">Crashed at {Number(multiplier).toFixed(2)}x!</p>}
    </div>
  );
};

export default CrashGraph;