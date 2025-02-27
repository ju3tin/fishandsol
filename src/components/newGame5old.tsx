"use client";
import React, { useState, useEffect, useRef } from "react";
import { useGameStore, GameState } from "../store/gameStore2";

const CrashGraph: React.FC = () => {
  const [pointB, setPointB] = useState({ x: 0, y: 0 });
  const [isCrashed, setIsCrashed] = useState(false);
  const gameState = useGameStore((state: GameState) => state);
  const [elapsedTime, setElapsedTime] = useState(0); // State to track elapsed time
  const [elapsedTime1, setElapsedTime1] = useState(0); // State to track elapsed time
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Declare a ref for the interval

  const GRAPH_WIDTH = 750;
  const GRAPH_HEIGHT = 300;
  const START_X = 0;
  const START_Y = GRAPH_HEIGHT + 30;

  useEffect(() => {
    if (gameState.status === "Waiting" && gameState.timeRemaining === 1) {
      // Reset position when game is reset or waiting
   if (intervalRef.current) clearInterval(intervalRef.current); // Clear the interval using the ref
   const startTime1 = Date.now();   

   setInterval(() => { // Assign the interval to the ref
    const currentTime1 = Date.now();
    const timeElapsed1 = currentTime1 - startTime1;
    setElapsedTime1(timeElapsed1);

   
  }, 100);
   setPointB({ x: START_X, y: START_Y });
      setIsCrashed(false);
    }
  }, [gameState.status, gameState.timeRemaining]);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    intervalRef.current = setInterval(() => { // Assign the interval to the ref
      const currentTime = Date.now();
      const timeElapsed = currentTime - startTime;
      setElapsedTime(timeElapsed);

      if (timeElapsed >= duration) {
        clearInterval(intervalRef.current!);
      }
    }, 100);

    return () => clearInterval(intervalRef.current!); // Clear the interval on cleanup
  }, []);

  useEffect(() => {
    if (isCrashed) return;

    const interval = setInterval(() => {
      setPointB((prevPoint) => {
        let newX = prevPoint.x + 10; // Point B moves to the right by 10 units per interval
        let newY = START_Y;

        // **Move horizontally from 0 to 85% of graph width (horizontal part)**:
        if (newX <= GRAPH_WIDTH * 0.85) {
          newY = START_Y; // Point B stays at the same Y position during horizontal motion
        }

        // **After reaching 85%, move upwards (incline part)**:
        else if (newX > GRAPH_WIDTH * 0.85 && newX <= GRAPH_WIDTH) {
          const inclineProgress = (newX - GRAPH_WIDTH * 0.85) / (GRAPH_WIDTH * 0.15); // Transition to incline
          newY = START_Y - inclineProgress * (GRAPH_HEIGHT + 30); // Gradually incline upwards
        }

        // If the game crashes, stop updating
        if (gameState.status === "Crashed") {
          setIsCrashed(true);
          clearInterval(interval);
        }

        if (gameState.status === "Waiting" && gameState.timeRemaining == 1) {
         // setIsCrashed(true);
         if (intervalRef.current) clearInterval(intervalRef.current); // Clear the interval using the ref
       //  setPointB({ x: START_X, y: START_Y });
         setIsCrashed(false);
         setElapsedTime(0); // Reset elapsedTime to 0
       
         console.log('what the fuck dude '+ elapsedTime)

          
        }

        // Prevent point B from moving once it has reached 100% width
        if (newX >= GRAPH_WIDTH) {
          newX = GRAPH_WIDTH; // Point B stops at the top-right corner
          newY = START_Y - (GRAPH_HEIGHT + 30); // Ensure Y is set at the top-right
        }

        return { x: newX, y: newY };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCrashed, gameState.status]);

  // Gradually update the control point for a smoother curve
  const controlPointX = elapsedTime >= 7500 ? 200 + ((elapsedTime - 7500) / 5000) * (1500 - 200) : 200; // Transition from 200 to 800 after 7.5 seconds over 5 seconds
  const controlPointY = elapsedTime >= 7500 ? 200 + ((elapsedTime - 7500) / 5000) * (400 - 200) : 200; // Transition from 200 to 300 after 7.5 seconds over 5 seconds

  // Define the Bezier curve once the incline is finished and Point B stays in the same position
  const generatePath = () => {
    // After the incline part, keep drawing the curve continuously
    if (pointB.x === GRAPH_WIDTH && pointB.y === START_Y - (GRAPH_HEIGHT + 30)) {
      // Return the Bezier curve path to make the dip downward and rightward
      return `M ${START_X},${START_Y} Q ${controlPointX},${controlPointY} ${pointB.x},${pointB.y}`;
    }

    // If we are still in the horizontal part or incline part, just draw a straight line
    return `M ${START_X},${START_Y} L ${pointB.x},${pointB.y}`;
  };

  return (
    <div  className="p-4 text-white rounded-lg shadow-md relative overflow-hidden" style={{ backgroundSize: '100% auto', backgroundImage: `url(/under3.png)`, width: 800, height: 400}}>
   
    <div style={{ width: 800, height: 400, marginTop:'40px'  }}>
      
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <path
          d={generatePath()} // Use the generated path based on the current position of Point B
          stroke="#00ff00"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      <svg  className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <image
          href="/fish00.svg"
          width="90"
          height="90"
          x={pointB.x}
          y={pointB.y}
          transform="translate(-40, -45)"
        />
      </svg>

      {gameState.status === "Crashed" && (
        <p className="text-red-500 mt-2 absolute left-1/2 transform -translate-x-1/2" style={{ top: "50%" }}>
          Crashed at {gameState.multiplier}x!
        </p>
      )}
    </div>
    </div>
  );
};

export default CrashGraph;