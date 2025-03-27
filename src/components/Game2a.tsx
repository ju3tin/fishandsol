"use client";
import React, { useRef, useEffect, useState } from "react";
import { useGameStore, GameState } from "../store/gameStore2";

import styles from '../styles/Game1.module.css';

const RocketGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameStore((state: GameState) => state);
  const [elapsedTime, setElapsedTime] = useState(0);

  const rocketImage = new Image();
  rocketImage.src = "/fish.svg"; // Rocket image path

  const backgroundImage = new Image();
  backgroundImage.src = "/under3.png"; // Background image path

  const rocketWidth = 50;
  const rocketHeight = 50;

  // Base dimensions for scaling
  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    function resizeCanvas() {
      if (!canvas || !context) return;
      const parent = canvas.parentElement!;
      const scale = parent.clientWidth / BASE_WIDTH;
      canvas.width = BASE_WIDTH * scale;
      canvas.height = BASE_HEIGHT * scale;
      drawGame(context, elapsedTime);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial resize

    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeElapsed = currentTime - startTime;
      setElapsedTime(timeElapsed);

      if (timeElapsed >= duration) {
        clearInterval(interval);
      }

      drawGame(context, timeElapsed);
    }, 100);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gameState.status]);

  function getBezierPoint(
    t: number,
    startX: number,
    startY: number,
    cpX: number,
    cpY: number,
    endX: number,
    endY: number
  ) {
    const x =
      (1 - t) * (1 - t) * startX +
      2 * (1 - t) * t * cpX +
      t * t * endX;
    const y =
      (1 - t) * (1 - t) * startY +
      2 * (1 - t) * t * cpY +
      t * t * endY;
    return { x, y };
  }

  function drawGame(context: CanvasRenderingContext2D, timeElapsed: number) {
    const canvas = context.canvas;
    const scale = canvas.width / BASE_WIDTH; // Scale factor

    // Clear canvas and draw background
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Define Bézier curve control points
    const startX = 0;
    const startY = canvas.height;
    const controlPointX = timeElapsed >= 7500
      ? 200 * scale + ((timeElapsed - 7500) / 5000) * (1500 - 200) * scale
      : 200 * scale;
    const controlPointY = timeElapsed >= 7500
      ? 200 * scale + ((timeElapsed - 7500) / 5000) * (400 - 200) * scale
      : 200 * scale;
    const endX = Math.min(timeElapsed / 10, canvas.width);
    const endY = canvas.height - (endX >= canvas.width * 0.85 ? (canvas.height * 0.8) : 0);

    drawRocketPath(context, startX, startY, controlPointX, controlPointY, endX, endY);
    drawRocket(context, startX, startY, controlPointX, controlPointY, endX, endY, timeElapsed, scale);
  }

  function drawRocketPath(
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    cpX: number,
    cpY: number,
    endX: number,
    endY: number
  ) {
    context.strokeStyle = "yellow";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(startX, startY);
    context.quadraticCurveTo(cpX, cpY, endX, endY);
    context.stroke();
  }

  function drawRocket(
    context: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    cpX: number,
    cpY: number,
    endX: number,
    endY: number,
    timeElapsed: number,
    scale: number
  ) {
    const t = Math.min(timeElapsed / 10000, 1);
    const { x, y } = getBezierPoint(t, startX, startY, cpX, cpY, endX, endY);

    context.drawImage(
      rocketImage,
      x - (rocketWidth / 2) * scale,
      y - (rocketHeight / 2) * scale,
      rocketWidth * scale,
      rocketHeight * scale
    );
  }

  return (
    <canvas className={styles.Game} ref={canvasRef}>
			
    </canvas>
  );
};

export default RocketGame;
