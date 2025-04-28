"use client";

import * as THREE from 'three';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { controlPoints } from "./controlPoints";
import { useGameStore, GameState } from '../store/gameStore2';
import { toast } from 'react-toastify'; // Ensure you have the toast library


import styles from '../styles/Game1.module.css';

const height = 2000;
const coeffB = 0.5;
const coeffA = height*0.16;

let rocketImage: HTMLImageElement;
let explodeImage: HTMLImageElement;
let parachuteImage: HTMLImageElement;
let backgroundImage: HTMLImageElement;
let svgImage: HTMLImageElement;


const startx = -50;
const starty = 120;
interface GameVisualProps {
  currentMultiplier: number;
  onCashout: (multiplier: number) => void;
  dude55: boolean;
  dude56: string;
  betAmount: string;
  tValues: {
    number: number;
    color: string;
    svg: string;
  }[];
}
  

if (typeof window !== 'undefined') {
	rocketImage = new Image();
	rocketImage.src = '/images/chippy.svg';

	explodeImage = new Image();
	explodeImage.src = 'explode.svg';

	parachuteImage = new Image();
	parachuteImage.src = 'parachute.svg';

	backgroundImage = new Image();
	backgroundImage.src = 'under3.png';

	svgImage = new Image();
	svgImage.src = '1.svg'; // Update with your SVG path
	
}

const rocketWidth = 440;
const rocketHeight = 440;

function curveFunction(t: number, width: number, height: number) {
	const startX = 0;  // Start from the left edge of the canvas
	const startY = 50;  // Start from the bottom of the canvas
	
	const controlX = width * 0.85; // Control point X starts at 85% of canvas width
	const controlY = height - 1500; // Control point Y to curve upwards
	
	const endX = t * width; // End X based on time (t) and canvas width
	const endY = height - (500 * Math.min(1, t / 1000)); // Simulates incline & leveling
  
	let bezierY: number;
  
	// Normalize `t` to be between 0 and 1
	const normalizedT = Math.min(t, 1);
  
	// Use linear motion for the first 85% of the canvas width (0 <= t < 0.85)
	if (normalizedT < 0.85) {
	  bezierY = startY; // Stay at the bottom during linear movement
	} else {
	  // Quadratic Bezier curve formula after 85% width
	  bezierY =
		(1 - normalizedT) ** 2 * startY + 2 * (1 - normalizedT) * normalizedT * controlY + normalizedT ** 2 * endY;
	}
  
	return bezierY;
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

// Function to preload multiple images
function preloadImages(imagePaths: string[]) {
	const images1: Record<string, HTMLImageElement> = {};
	imagePaths.forEach((path) => {
	  const img = new Image();
	  img.src = path;
	  images1[path] = img;
	});
	return images1;
  }


// Preload the specific image


function render(
	gameState5: GameState,
	context: CanvasRenderingContext2D,
) {
	if (!context)
		return;

	const canvas = context.canvas;


	context.clearRect(0, 0, canvas.width, canvas.height);
	const additionalImages = preloadImages([imagePaths.rocket]); // Preload only the additional1 image

	const maxX = canvas.width - rocketWidth;
	const minY = rocketHeight;

	const expectedX = gameState5.timeElapsed;
	const expectedY = canvas.height - curveFunction(gameState5.timeElapsed/1000, canvas.width, canvas.height);

	const rocketX = Math.min(expectedX, maxX);
	const rocketY = Math.max(expectedY, minY);

	context.save();


	if (additionalImages && additionalImages.complete) {
		context.drawImage(additionalImages.rocket, 34, 0, 200, 200); // Adjust size as needed
	}
	
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
	

		context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
		
	}

	drawRocketPath(context, gameState5.timeElapsed);

	if (gameState5.status == 'Crashed')
		drawCrashedRocket(context, rocketX, rocketY);
	else
		drawRocket(context, gameState5.timeElapsed, rocketX, rocketY);

	context.restore();

	if (gameState5.status == 'Waiting')
		drawCountdown(context, gameState5.timeRemaining);
	else
		drawMultiplier(context, gameState5.multiplier);
		
	//	if (additionalImages.complete) {
		//	context.drawImage(additionalImages.rocket, 0, 0, 200, 200); // Adjust size as needed
		//	}
}

function drawMultiplier(
	context: CanvasRenderingContext2D,
	multiplier: number,
) {
	const canvas = context.canvas;

	const multiplierNumeric = Number.parseFloat(multiplier.toString());

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
	if (typeof timeRemaining === 'number' && !isNaN(timeRemaining)){

		const canvas = context.canvas;
		context.fillStyle = 'rgba(255, 255, 255, 1.0)';
		context.font = '220px Arial';
		const text = `Launch in ${timeRemaining} secs`;
		const textWidth = context.measureText(text).width;
		context.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2);

	}
	
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

	const t = timeElapsed / 1000;
	let currentCP1 = { x: startx, y: starty };
	let currentCP2 = { x: startx, y: starty };
	let currentPointB = { x: startx, y: starty };
	let targetCP1 = { x: canvas.width * 0.5, y: canvas.height * 0.5 };
	let targetCP2 = { x: canvas.width * 0.8, y: canvas.height * 0.2 };
	let targetPointB = { x: canvas.width, y: canvas.height * 0.5 };

	const originY = context.canvas.height;

	context.moveTo(startx, starty);


	const cp1x = currentCP1.x + (targetCP1.x - currentCP1.x) * t;
	const cp1y = currentCP1.y + (targetCP1.y - currentCP1.y) * t;
	const cp2x = currentCP2.x + (targetCP2.x - currentCP2.x) * t;
	const cp2y = currentCP2.y + (targetCP2.y - currentCP2.y) * t;
	const pointBx = currentPointB.x + (targetPointB.x - currentPointB.x) * t;
	const pointBy = currentPointB.y + (targetPointB.y - currentPointB.y) * t;
  
	context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pointBx, pointBy);

	const step = 10;



	
	

	context.stroke();
}

function drawRocket(
	context: CanvasRenderingContext2D,
	timeElapsed: number,
	x: number,
	y: number,
) {
	const canvas = context.canvas;
	// Obtain angle from the path derivative
	const d1 = curveFunction(timeElapsed/1000, canvas.width, canvas.height);
	const d2 = curveFunction((timeElapsed + 10)/1000, canvas.width, canvas.height);
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
	context.drawImage(explodeImage, 2000, -1200, 900, 900);
	const text = `Launch in  secs`;
	
}

const Game: React.FC<GameVisualProps> = ({ currentMultiplier, dude55, dude56, betAmount, tValues }) => {
	const [pointB, setPointB] = useState({ x: startx, y: starty });
//	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [context, setContext] = useState<any>(null);
	const [additionalImage, setAdditionalImage] = useState<HTMLImageElement | null>(null);
	const [errorCount, setErrorCount] = useState(0);
	const errors: string[] = []; // Explicitly define the type of errors

//	const gameState5 = useGameStore((gameState5: GameState) => gameState5);

	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const showErrorToast = useCallback(() => {
		if (errorMessages.length > 0) {
			toast("⚠️ " + errorMessages[errorMessages.length - 1]);
		}
	}, [errorMessages]); // ✅ Now errorMessages is a stable state

	//const showErrorToast = useCallback(() => {
	//	const currentErrors = errors; // Move errors inside the callback
	//	if (currentErrors.length > 0) {
	//		toast("⚠️ " + currentErrors[currentErrors.length - 1]);
	//	}
//	}, []); // Removed errors from dependencies


const gameState5 = useGameStore((gameState5: GameState) => gameState5);

const canvasRef = useRef<HTMLCanvasElement | null>(null);
const fishRef = useRef<HTMLDivElement | null>(null);
const curveAnimationRef = useRef<number | null>(null);
const backgroundImage = useRef<HTMLDivElement | null>(null);

const pointBRef = useRef<{ x: number; y: number }>({ x: startx, y: starty });

const [paused, setPaused] = useState(false);

useEffect(() => {
  const canvas = canvasRef.current;
  const fish = fishRef.current;
  if (!canvas || !fish) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let t = 0;
  let transitionIndex = 0;

  let currentCP1 = { x: startx, y: starty };
  let currentCP2 = { x: startx, y: starty };
  let currentPointB = { x: startx, y: starty };
  let targetCP1 = controlPoints[0].cp1;
  let targetCP2 = controlPoints[0].cp2;
  let targetPointB = controlPoints[0].pointB;

  function getBezierPoint(t: number, p0: any, p1: any, p2: any, p3: any) {
	const u = 1 - t;
	const tt = t * t;
	const uu = u * u;
	const uuu = uu * u;
	const ttt = tt * t;

	const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
	const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
	return { x, y };
  }

  function getBezierTangent(t: number, p0: any, p1: any, p2: any, p3: any) {
	const u = 1 - t;
	const tt = t * t;
	const uu = u * u;

	const dx = -3 * uu * p0.x + 3 * (uu - 2 * u * t) * p1.x + 3 * (2 * t * u - tt) * p2.x + 3 * tt * p3.x;
	const dy = -3 * uu * p0.y + 3 * (uu - 2 * u * t) * p1.y + 3 * (2 * t * u - tt) * p2.y + 3 * tt * p3.y;
	return Math.atan2(dy, dx);
  }

  let logged = false;

  let loggednum = 0;

const fish1 = new Image();
fish1.src = "/images/chippy.svg"; // Use your actual path
fish1.onload = () => {
requestAnimationFrame(animate);
};

let animationFrameId;
let startTime: number | null = null;
let elapsed = 0;
function animate(timestamp: number) {
if (!canvas || !ctx || !fish1.complete) return;
if (paused) return; // 🔵 Check paused immediately

ctx.clearRect(0, 0, canvas.width, canvas.height);
const deltaTime = timestamp - (curveAnimationRef.current || 0);
curveAnimationRef.current = timestamp;

ctx.beginPath();
ctx.moveTo(startx, starty);

const cp1x = currentCP1.x + (targetCP1.x - currentCP1.x) * t;
const cp1y = currentCP1.y + (targetCP1.y - currentCP1.y) * t;
const cp2x = currentCP2.x + (targetCP2.x - currentCP2.x) * t;
const cp2y = currentCP2.y + (targetCP2.y - currentCP2.y) * t;
const pointBx = currentPointB.x + (targetPointB.x - currentPointB.x) * t;
const pointBy = currentPointB.y + (targetPointB.y - currentPointB.y) * t;

ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pointBx, pointBy);
ctx.strokeStyle = "white";
ctx.lineWidth = 2;
ctx.stroke();

// 🟠 Draw dots
tValues.forEach((dotT) => {
  const { x, y } = getBezierPoint(
	dotT.number,
	{ x: startx, y: starty },
	{ x: cp1x, y: cp1y },
	{ x: cp2x, y: cp2y },
	{ x: pointBx, y: pointBy }
  );

  const img = new Image();
  img.src = dotT.svg;

  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fillStyle = dotT.color;
  ctx.fill();

  img.onload = () => {
	ctx.drawImage(img, x - 8, y - 8, 20, 20);
  };
});

// 🐟 Draw fish1 at the end of the curve (pointB)
ctx.save();
ctx.translate(pointBx, pointBy);
ctx.drawImage(fish1, -25, -25, 50, 50); // Adjust size/offsets
ctx.restore();

pointBRef.current = { x: pointBx, y: pointBy };

t += 0.01;

// 🔥 Check again if paused before animating next frame
if (paused) return;

if (t <= 1) {
  curveAnimationRef.current = requestAnimationFrame(animate);
} else {
  transitionIndex = (transitionIndex + 1) % controlPoints.length;
  t = 0;
  currentCP1 = targetCP1;
  currentCP2 = targetCP2;
  currentPointB = targetPointB;
  targetCP1 = controlPoints[transitionIndex].cp1;
  targetCP2 = controlPoints[transitionIndex].cp2;
  targetPointB = controlPoints[transitionIndex].pointB;
  curveAnimationRef.current = requestAnimationFrame(animate);
}
}

function pauseAnimation() {
setPaused(true); // react state or just paused = true
if (curveAnimationRef.current) {
  cancelAnimationFrame(curveAnimationRef.current);
  curveAnimationRef.current = null; // very important
}
}

  if (dude55 && !logged) {
	console.log("Recording t because dude55 is true:", t.toFixed(4));
	logged = true;
	loggednum = t;
  }

  if (gameState5.status === "Running") {
	setPaused(false);
	animate(0);
  } else if (gameState5.status === "Crashed") {
	pauseAnimation();
  } else {
	if (curveAnimationRef.current) {
	  cancelAnimationFrame(curveAnimationRef.current);
	}
  }

  return () => {
	if (curveAnimationRef.current) {
	  cancelAnimationFrame(curveAnimationRef.current);
	}
  };
}, [gameState5.status]);


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

	useEffect(() => {
		const doRender = () => { // Move doRender inside useEffect
			render(
				gameState5,
				context
			);
		}; // Wrap doRender in useCallback if needed

		const frame = requestAnimationFrame(doRender);
		return () => cancelAnimationFrame(frame);
	}, [gameState5, context]); // Add dependencies

	useEffect(() => {
		showErrorToast();
	}, [errorCount, showErrorToast]);

	return (
		<canvas className={styles.Game} ref={canvasRef}>
			
		</canvas>
	);
}


export default Game;