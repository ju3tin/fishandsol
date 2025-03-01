"use client";

import { useRef, useEffect, useState, useCallback } from 'react';

import { useGameStore, GameState } from '../store/gameStore2';

import styles from '../styles/Game1.module.css';

const height = 2000;
const coeffB = 0.5;
const coeffA = height*0.16;

let rocketImage: HTMLImageElement;
let explodeImage: HTMLImageElement;
let parachuteImage: HTMLImageElement;
let backgroundImage: HTMLImageElement;
let svgImage: HTMLImageElement;


if (typeof window !== 'undefined') {
	rocketImage = new Image();
	rocketImage.src = 'fish.svg';

	explodeImage = new Image();
	explodeImage.src = 'explode.svg';

	parachuteImage = new Image();
	parachuteImage.src = 'parachute.svg';

	backgroundImage = new Image();
	backgroundImage.src = 'under3.png';


	svgImage = new Image();
	svgImage.src = '1.svg'; // Update with your SVG path
	svgImage.onload = () => {
		console.log('shit loaded');
		// Trigger a re-render or call a function to draw the SVG
	//	doRender();
	};
}



const rocketWidth = 440;
const rocketHeight = 440;

function curveFunction(t: number) {
	return coeffA * (Math.exp(coeffB * t) - 1);
}

// Function to preload multiple images
function preloadImages(imagePaths: string[]) {
	const images: Record<string, HTMLImageElement> = {};
	imagePaths.forEach((path) => {
	  const img = new Image();
	  img.src = path;
	  images[path] = img;
	});
	return images;
  }
  
  // Dynamic SVG paths
  const imagePaths = {
	rocket: 'fish.svg',
	explode: 'explode.svg',
	parachute: 'parachute.svg',
	background: 'under3.png',
	additional1: '1.svg',
	additional2: '2.svg', // Add more SVG paths here
  };
// Preload the specific image
const additionalImages = preloadImages([imagePaths.additional1]); // Preload only the additional1 image

function render(
	gameState: GameState,
	context: CanvasRenderingContext2D,
) {
	if (!context)
		return;

	const canvas = context.canvas;

	// Draw the background image first
	if (backgroundImage) {
		const aspectRatio = backgroundImage.width / backgroundImage.height;
		const canvasAspectRatio = canvas.width / canvas.height;

		let drawWidth, drawHeight;

		if (aspectRatio > canvasAspectRatio) {
			drawWidth = canvas.width;
			drawHeight = canvas.width / aspectRatio;
		} else {
			drawHeight = canvas.height;
			drawWidth = canvas.height * aspectRatio;
		}

		const xOffset = (canvas.width - drawWidth) / 2;
		const yOffset = (canvas.height - drawHeight) / 2;

	//	context.drawImage(backgroundImage, xOffset, yOffset, drawWidth, drawHeight);
	if (svgImage.complete) {
		context.drawImage(svgImage, 100, 100, 200, 200); // Adjust position and size as needed
	}

	}
	
	// Draw the additional image in the left corner
	//if (additionalImages.complete) {
	//	context.drawImage(additionalImages.rocket, 0, 0, 200, 200); // Adjust size as needed
	//}

	context.clearRect(0, 0, canvas.width, canvas.height);

	const maxX = canvas.width - rocketWidth;
	const minY = rocketHeight;

	const expectedX = gameState.timeElapsed;
	const expectedY = canvas.height - curveFunction(gameState.timeElapsed/1000);

	const rocketX = Math.min(expectedX, maxX);
	const rocketY = Math.max(expectedY, minY);

	context.save();

	drawRocketPath(context, gameState.timeElapsed);

	if (gameState.status == 'Crashed')
		drawCrashedRocket(context, rocketX, rocketY);
	else
		drawRocket(context, gameState.timeElapsed, rocketX, rocketY);

	context.restore();

	if (gameState.status == 'Waiting')
		drawCountdown(context, gameState.timeRemaining);
	else
		drawMultiplier(context, gameState.multiplier);
}

function drawMultiplier(
	context: CanvasRenderingContext2D,
	multiplier: number,
) {
	const canvas = context.canvas;

	const multiplierNumeric = typeof multiplier === 'string' ? Number.parseFloat(multiplier) : multiplier;

	if (multiplierNumeric > 5)
		context.fillStyle = 'red';
	else if (multiplierNumeric > 2)
		context.fillStyle = 'yellow';
	else
		context.fillStyle = 'white';

	context.font = '220px Arial';
	const text = `${multiplier}x`;
	const textWidth = context.measureText(text).width;
	context.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

function drawCountdown(
	context: CanvasRenderingContext2D,
	timeRemaining: number,
) {
	const canvas = context.canvas;

	context.fillStyle = 'rgba(255, 255, 255, 1.0)';
	context.font = '220px Arial';
	const text = `Launch in ${timeRemaining} secs`;
	const textWidth = context.measureText(text).width;
	context.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2);
}

function drawRocketPath(
	context: CanvasRenderingContext2D,
	timeElapsed: number,
) {
	const canvas = context.canvas;
	const gradient: CanvasGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
	gradient.addColorStop(0, 'red');
	gradient.addColorStop(1, 'yellow');

	context.strokeStyle = gradient;
	context.lineWidth = 20;
	context.beginPath();

	const originX = 0;
	const originY = context.canvas.height;

	context.moveTo(originX, originY);

	const step = 10;

	for (let t = 0; t <= timeElapsed/step; t += step) {
		const x = step * t;
		const y = canvas.height - curveFunction(x/1000);

		context.lineTo(x, y);
	}

	context.stroke();
}

function drawRocket(
	context: CanvasRenderingContext2D,
	timeElapsed: number,
	x: number,
	y: number,
) {
	// Obtain angle from the path derivative

	const d1 = curveFunction(timeElapsed/1000);
	const d2 = curveFunction((timeElapsed + 10)/1000);
	const slope = (d2 - d1)/10;
	const angle = -Math.atan(slope) + 2*Math.PI/4;

	context.translate(x - rocketWidth/2, y - rocketHeight/2);
	context.rotate(angle);

	context.drawImage(rocketImage, 0, 0, rocketWidth, rocketHeight);

	context.rotate(-angle);
}

function drawCrashedRocket(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
) {
	context.translate(x - rocketWidth/2, y - rocketWidth/2);
	context.drawImage(explodeImage, 0, 0, rocketWidth, rocketHeight);
	const text = `Launch in  secs`;
	
}

export default function Game() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [context, setContext] = useState<any>(null);

	const gameState = useGameStore((gameState: GameState) => gameState);

	useEffect(() => {
		const ctx = canvasRef.current?.getContext('2d');
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const aspectRatio = canvas.clientWidth / canvas.clientHeight;
			canvas.width = 4000;
			canvas.height = 1995;
		}
		setContext(ctx);
	}, []);

	const doRender = useCallback(() => {
		render(
			gameState,
			context
		);
	}, [gameState, context]);

	useEffect(() => {
		const frame = requestAnimationFrame(doRender);
		return () => cancelAnimationFrame(frame);
	}, [context, gameState, doRender]);

	return (
		<canvas className={styles.Game} ref={canvasRef}></canvas>
	);
}
