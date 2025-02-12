'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from '../styles/Game1.module.css';
import { useGameStore, GameState } from '../store/gameStore2';
import { toast } from 'react-toastify'; // Ensure you have the toast library
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
//import { preloadImages, rocketWidth, rocketHeight, curveFunction, backgroundImage, drawRocketPath, drawCrashedRocket, drawRocket, drawCountdown, drawMultiplier } from './Game2';
//import { render } from './Game2';

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
	
}

const rocketWidth = 440;
const rocketHeight = 440;

function curveFunction(t: number) {
	return coeffA * (Math.exp(coeffB * t) - 1);
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


function drawMultiplier(
	context: CanvasRenderingContext2D,
	multiplier: string,
) {
	const canvas = context.canvas;

	const multiplierNumeric = Number.parseFloat(multiplier);

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
//after 2.0x immulate curve
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
	context.drawImage(explodeImage, 2000, -1200, 900, 900);
	const text = `Launch in  secs`;
	
}

function drawGameStatus(context: CanvasRenderingContext2D, status: string) {
	context.fillStyle = 'white'; // Set text color
	context.font = '40px Arial'; // Set font size and family
	const text = `Status: ${status}`; // Create the status text
	const textWidth = context.measureText(text).width; // Measure text width
	context.fillText(text, (context.canvas.width - textWidth) / 2, 50); // Center the text horizontally
}

function render(
	gameState: GameState,
	context: CanvasRenderingContext2D,
) {
	if (!context)
		return;

	const canvas = context.canvas;


	context.clearRect(0, 0, canvas.width, canvas.height);
	const additionalImages = preloadImages([imagePaths.rocket]); // Preload only the additional1 image

	const maxX = canvas.width - rocketWidth;
	const minY = rocketHeight;

	const expectedX = gameState.timeElapsed;
	const expectedY = canvas.height - curveFunction(gameState.timeElapsed/1000);

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

	drawRocketPath(context, gameState.timeElapsed);

	if (gameState.status == 'Crashed')
		drawCrashedRocket(context, rocketX, rocketY);
	else
		drawRocket(context, gameState.timeElapsed, rocketX, rocketY);

	// Draw the game status
	drawGameStatus(context, gameState.status);

	context.restore();

	if (gameState.status == 'Waiting')
		drawCountdown(context, gameState.timeRemaining);
	else
		drawMultiplier(context, gameState.multiplier);
		
	//	if (additionalImages.complete) {
		//	context.drawImage(additionalImages.rocket, 0, 0, 200, 200); // Adjust size as needed
		//	}
}

const Game5 = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const statusTextRef = useRef<THREE.Mesh | null>(null); // Reference for the status text
    const canvasWidth = 4000; // Update this to match Game2.tsx width
    const canvasHeight = 1995; // Update this to match Game2.tsx height
    const [context, setContext] = useState<any>(null);
	const [additionalImage, setAdditionalImage] = useState<HTMLImageElement | null>(null);
	const [errorCount, setErrorCount] = useState(0);
	const errors: string[] = []; // Explicitly define the type of errors

	const gameState = useGameStore((gameState: GameState) => gameState);

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

  useEffect(() => {
    // ✅ Create a Three.js scene
    const scene = new THREE.Scene();
    scene.add(/*new THREE.AxesHelper(5)*/);

    const light = new THREE.PointLight(0xffffff, 50);
    light.position.set(0.8, 1.4, 1.0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    camera.position.set(0.8, 1.4, 1.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! });
    renderer.setSize(canvasWidth, canvasHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    // ✅ Load FBX Model
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      '/fish.fbx',
      (object) => {
        object.scale.set(0.005, 0.005, 0.005);
        scene.add(object);
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
      (error) => console.log(error)
    );

    // ✅ Resize Handling
    function onWindowResize() {
      camera.aspect = canvasWidth / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasWidth, canvasHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // Load font and create status text
    const fontLoader = new FontLoader();
    fontLoader.load('/path/to/font.json', (font) => {
        const textGeometry = new TextGeometry('Status: Waiting', {
            font: font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 1, -5); // Position in front of the model
        scene.add(textMesh);
        statusTextRef.current = textMesh; // Store reference
    });

    // ✅ Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      // Update status text based on game state
      if (statusTextRef.current) {
        statusTextRef.current.geometry.dispose(); // Dispose of old geometry
        const newTextGeometry = new TextGeometry(`Status: ${gameState.status}`, {
            font: fontLoader.loader.paths[0].generator.parameters.font,
            size: 1,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false,
        });
        statusTextRef.current.geometry = newTextGeometry; // Update geometry
      }
    }
    animate();

    // ✅ Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
      // Dispose of the text mesh if it exists
      if (statusTextRef.current) {
        scene.remove(statusTextRef.current);
        statusTextRef.current.geometry.dispose();
      }
    };
  }, [gameState]);


	useEffect(() => {
		const doRender = () => { // Move doRender inside useEffect
			render(
				gameState,
				context
			);
		}; // Wrap doRender in useCallback if needed

		const frame = requestAnimationFrame(doRender);
		return () => cancelAnimationFrame(frame);
	}, [gameState, context]); // Add dependencies

	useEffect(() => {
		showErrorToast();
	}, [errorCount, showErrorToast]);


  return (
        <canvas className={styles.Game} ref={canvasRef}  style={{border: '1px solid #000',width: '100%', aspectRatio: '4000 / 1995'}}></canvas>
    
    );
}

export default Game5;