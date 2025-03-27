import React, { useRef, useEffect, useState } from 'react';
import { useGameStore, GameState } from '../store/gameStore2';
import styles from '../styles/Game1.module.css';

interface Point {
  x: number;
  y: number;
}

const CrashGraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pointB, setPointB] = useState<Point>({ x: 0, y: 0 });
  const [isCrashed, setIsCrashed] = useState(false);
  const gameState = useGameStore((state: GameState) => state);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Graph dimensions
  const GRAPH_WIDTH = 750;
  const GRAPH_HEIGHT = 300;
  const START_X = 0;
  const START_Y = GRAPH_HEIGHT + 30;

  // Load image
  const [fishImage, setFishImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/fish00.svg';
    img.onload = () => setFishImage(img);
  }, []);

  // Reset game state
  useEffect(() => {
    if (gameState.status === "Waiting" && gameState.timeRemaining === 1) {
      setPointB({ x: START_X, y: START_Y });
      setIsCrashed(false);
      setElapsedTime(0);
    }
  }, [gameState.status, gameState.timeRemaining]);

  // Elapsed time tracking
  useEffect(() => {
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - startTime;
      setElapsedTime(timeElapsed);

      if (timeElapsed >= duration) {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  // Point movement and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context || isCrashed) return;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Background image (assuming you have a method to load background)
    const backgroundImg = new Image();
    backgroundImg.src = '/under3.png';
    context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Update point position
    setPointB((prevPoint) => {
      let newX = prevPoint.x + 10;
      let newY = START_Y;

      // Horizontal movement
      if (newX <= GRAPH_WIDTH * 0.85) {
        newY = START_Y;
      }
      // Incline part
      else if (newX > GRAPH_WIDTH * 0.85 && newX <= GRAPH_WIDTH) {
        const inclineProgress = (newX - GRAPH_WIDTH * 0.85) / (GRAPH_WIDTH * 0.15);
        newY = START_Y - inclineProgress * (GRAPH_HEIGHT + 30);
      }

      // Game crash check
      if (gameState.status === "Crashed") {
        setIsCrashed(true);
      }

      // Limit point movement
      if (newX >= GRAPH_WIDTH) {
        newX = GRAPH_WIDTH;
        newY = START_Y - (GRAPH_HEIGHT + 30);
      }

      // Draw path
      context.beginPath();
      context.moveTo(START_X, START_Y);
      context.lineTo(newX, newY);
      context.strokeStyle = '#00ff00';
      context.lineWidth = 3;
      context.stroke();

      // Draw fish image
      if (fishImage) {
        context.drawImage(
          fishImage, 
          newX - 40, 
          newY - 45, 
          90, 
          90
        );
      }

      // Crash text
      if (gameState.status === "Crashed") {
        context.fillStyle = 'red';
        context.font = '20px Arial';
        context.fillText(`Crashed at ${gameState.multiplier}x!`, canvas.width / 2 - 100, canvas.height / 2);
      }

      return { x: newX, y: newY };
    });
  }, [elapsedTime, gameState.status, fishImage]);

  return (
    <canvas 
    className={styles.Game} ref={canvasRef}
    />
  );
};

export default CrashGraphCanvas;