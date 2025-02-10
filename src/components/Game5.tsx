'use client' // Ensures this component runs only on the client side

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
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

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const canvasWidth = 4000  // Change width here
  const canvasHeight = 1995 // Change height here
  const [context, setContext] = useState<any>(null);
  const [additionalImage, setAdditionalImage] = useState<HTMLImageElement | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const errors: string[] = []; // Explicitly define the type of errors

  const gameState = useGameStore((gameState: GameState) => gameState);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    // ✅ Scene Setup
    const scene = new THREE.Scene()
    scene.add()

    const light = new THREE.PointLight(0xffffff, 50)
    light.position.set(0.8, 1.4, 1.0)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000)
    camera.position.set(0.8, 1.4, 1.0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvasWidth, canvasHeight)

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement)
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)

    // ✅ Load FBX Model
    const fbxLoader = new FBXLoader()
    fbxLoader.load(
      '/fish.fbx', // Ensure this path is correct
      (object) => {
        scene.add(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )

    // ✅ Handle Window Resize
    function onWindowResize() {
      camera.aspect = canvasWidth / canvasHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvasWidth, canvasHeight)
      render()
    }
    window.addEventListener('resize', onWindowResize)

    // ✅ Stats (Performance Monitoring)
   // const stats = new Stats()
   // document.body.appendChild(stats.dom)

    // ✅ Animation Loop
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      render()
     // stats.update()
    }

    function render() {
      renderer.render(scene, camera)
    }

    animate()

    // ✅ Cleanup Function
    return () => {
      window.removeEventListener('resize', onWindowResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        border: '2px solid #000' // Optional: Adds border for visualization
      }}
    />
  )
}