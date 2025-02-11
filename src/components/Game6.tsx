'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from '../styles/Game1.module.css';
import { toast } from 'react-toastify'; // Ensure you have the toast library


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


export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aspectRatio = 4000 / 1995; // Maintain this aspect ratio

  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ Create a Three.js scene
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 50);
    light.position.set(0.8, 1.4, 1.0);
    scene.add(light, new THREE.AmbientLight());

    // ✅ Setup Camera with Fixed Aspect Ratio
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0.8, 1.4, 1.0);

    // ✅ WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerWidth / aspectRatio);

    // ✅ Orbit Controls
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

    // ✅ Handle Window Resize
    function onWindowResize() {
      const newWidth = window.innerWidth;
      const newHeight = newWidth / aspectRatio;
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }
    window.addEventListener('resize', onWindowResize);
    onWindowResize(); // Set initial size

    // ✅ Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // ✅ Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
    };
  }, []);

  return (
    <canvas className={styles.Game} ref={canvasRef} />
  );
}