"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useGameStore, GameState } from '../store/gameStore2';
import { toast } from 'react-toastify';
import styles from '../styles/Game1.module.css';

const height = 2000;
const coeffB = 0.5;
const coeffA = height * 0.16;

const rocketWidth = 440;
const rocketHeight = 440;

const imagePaths = {
  rocket: 'fish.svg',
  explode: 'explode.svg',
  parachute: 'parachute.svg',
  background: 'under.png',
  additional1: '1.svg',
  additional2: '2.svg',
};

// Function to preload images
const preloadImages = (paths: Record<string, string>) => {
  const images: Record<string, HTMLImageElement> = {};
  Object.entries(paths).forEach(([key, path]) => {
    const img = new Image();
    img.src = path;
    images[key] = img;
  });
  return images;
};

function curveFunction(t: number) {
  return coeffA * (Math.exp(coeffB * t) - 1);
}

function render(gameState: GameState, context: CanvasRenderingContext2D, images: Record<string, HTMLImageElement>) {
  if (!context) return;

  const canvas = context.canvas;
  context.clearRect(0, 0, canvas.width, canvas.height);

  const maxX = canvas.width - rocketWidth;
  const minY = rocketHeight;

  const expectedX = gameState.timeElapsed;
  const expectedY = canvas.height - curveFunction(gameState.timeElapsed / 1000);

  const rocketX = Math.min(expectedX, maxX);
  const rocketY = Math.max(expectedY, minY);

  context.save();

  if (images.background.complete) {
    context.drawImage(images.background, 0, 0, canvas.width, canvas.height);
  }

  drawRocketPath(context, gameState.timeElapsed);

  if (gameState.status === 'Crashed') {
    drawCrashedRocket(context, rocketX, rocketY, images.explode);
  } else {
    drawRocket(context, gameState.timeElapsed, rocketX, rocketY, images.rocket);
  }

  context.restore();

  if (gameState.status === 'Waiting') {
    drawCountdown(context, gameState.timeRemaining);
  } else {
    drawMultiplier(context, gameState.multiplier);
  }
}

function drawMultiplier(context: CanvasRenderingContext2D, multiplier: string) {
  const canvas = context.canvas;
  const multiplierNumeric = parseFloat(multiplier);

  context.fillStyle = multiplierNumeric > 5 ? 'red' : multiplierNumeric > 2 ? 'yellow' : 'white';
  context.font = '220px Arial';
  const text = `${multiplier}x`;
  const textWidth = context.measureText(text).width;
  context.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

function drawCountdown(context: CanvasRenderingContext2D, timeRemaining: number) {
  const canvas = context.canvas;
  context.fillStyle = 'rgba(255, 255, 255, 1.0)';
  context.font = '220px Arial';
  const text = `Launch in ${timeRemaining} secs`;
  const textWidth = context.measureText(text).width;
  context.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

function drawRocketPath(context: CanvasRenderingContext2D, timeElapsed: number) {
  const canvas = context.canvas;
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, 'red');
  gradient.addColorStop(1, 'yellow');

  context.strokeStyle = gradient;
  context.lineWidth = 20;
  context.beginPath();
  context.moveTo(0, canvas.height);

  const step = 10;
  for (let t = 0; t <= timeElapsed / step; t += step) {
    const x = step * t;
    const y = canvas.height - curveFunction(x / 1000);
    context.lineTo(x, y);
  }
  context.stroke();
}

function drawRocket(context: CanvasRenderingContext2D, timeElapsed: number, x: number, y: number, rocketImage: HTMLImageElement) {
  const d1 = curveFunction(timeElapsed / 1000);
  const d2 = curveFunction((timeElapsed + 10) / 1000);
  const slope = (d2 - d1) / 10;
  const angle = -Math.atan(slope) + (2 * Math.PI) / 4;

  context.translate(x - rocketWidth / 2, y - rocketHeight / 2);
  context.rotate(angle);
  context.drawImage(rocketImage, 0, 0, rocketWidth, rocketHeight);
  context.rotate(-angle);
}

function drawCrashedRocket(context: CanvasRenderingContext2D, x: number, y: number, explodeImage: HTMLImageElement) {
  context.translate(x - rocketWidth / 2, y - rocketHeight / 2);
  context.drawImage(explodeImage, 2000, -1200, 900, 900);
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  
  const gameState = useGameStore((state: GameState) => state);

  // Preload images only once
  const images = useMemo(() => preloadImages(imagePaths), []);

  // Memoize errors array
  const errors = useMemo(() => errorMessages, [errorMessages]);

  const showErrorToast = useCallback(() => {
    if (errors.length > 0) {
      toast("⚠️ " + errors[errors.length - 1]);
    }
  }, [errors]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 4000;
      canvas.height = 1995;
    }
    setContext(ctx);
  }, []);

  useEffect(() => {
    if (!context) return;

    const doRender = () => render(gameState, context, images);
    const frame = requestAnimationFrame(doRender);
    return () => cancelAnimationFrame(frame);
  }, [gameState, context, images]);

  useEffect(() => {
    showErrorToast();
  }, [errorMessages, showErrorToast]);

  return <canvas className={styles.Game} ref={canvasRef}></canvas>;
}