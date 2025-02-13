'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from '../styles/Game1.module.css';
import { useGameStore, GameState } from '../store/gameStore2';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

interface ThreeSceneProps {
  width: number; // Accept width as a prop
}

export default function ThreeScene({ width }: ThreeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aspectRatio = 4000 / 1995;
  const fontRef = useRef<Font | null>(null);
  const gameState = useGameStore((state: GameState) => state);
  const [errorCount, setErrorCount] = useState(0);
  const errors: string[] = []; // Explicitly define the type of errors

  let textMesh: THREE.Mesh | null = null; // Declare textMesh outside


  useEffect(() => {
    if (!canvasRef.current) return;

    // Create Three.js Scene
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 50);
    light.position.set(0.8, 1.4, 1.0);
    scene.add(light, new THREE.AmbientLight());

    // Create Camera
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.set(0.8, 1.4, 1.0);

    // WebGL Renderer (Attach to Canvas)
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current });

    // Function to Resize Canvas
    function resizeCanvas() {
      const canvasHeight = width / aspectRatio;
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
      renderer.setSize(width, canvasHeight);
    }

    // Initialize Canvas Size & Listen for Resizing
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);
    const fontLoader = new FontLoader();
    const fbxLoader = new FBXLoader();
    fbxLoader.load('/fish.fbx', (object) => {
      object.scale.set(0.005, 0.005, 0.005);
      scene.add(object);
    });

    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('/under3.png'); // Replace with your image path
    scene.background = bgTexture;

    fontLoader.load('/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            fontRef.current = font;

            const createTextMesh = (text: string) => {
                if (!fontRef.current) return null;

                const textGeometry = new TextGeometry(text, {
                    font: fontRef.current,
                    size: 10,
                    depth: 2,
                    curveSegments: 12,
                    bevelEnabled: false,
                });

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.set(0, 1, -5);

                return textMesh;
            };

            // Create initial text mesh
            const initialText = gameState.status === 'Waiting' ? `${gameState.timeRemaining}` : `${gameState.status}`;
            textMesh = createTextMesh(initialText); // Assign to outer variable

            if (textMesh) {
                scene.add(textMesh);
            } else {
                console.error('Failed to create text mesh: Font may not be loaded.');
            }

            const updateText = () => {
                if (textMesh) {
                    scene.remove(textMesh);
                }
                textMesh = createTextMesh(`Status: ${gameState.status}`); // Update textMesh
                if (textMesh) {
                    scene.add(textMesh);
                } else {
                    console.error('Failed to create new text mesh: Font may not be loaded.');
                }
            };

            const unsubscribe = useGameStore.subscribe(updateText);

            return () => {
                unsubscribe();
                if (textMesh) scene.remove(textMesh); // Ensure cleanup
            };
        });


    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup Function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      controls.dispose();
    };
  }, [width]);

  return <canvas className={styles.Game} ref={canvasRef} />;
}