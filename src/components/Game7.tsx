'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { useGameStore, GameState } from '../store/gameStore2';
import styles from '../styles/Game1.module.css';


const Game7 = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const statusTextRef = useRef<THREE.Mesh | null>(null);
    const fontRef = useRef<Font | null>(null);
    const gameState = useGameStore((state: GameState) => state);


    const fontLoader = new FontLoader();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);


        const fbxLoader = new FBXLoader();
            fbxLoader.load(
              '/fish.fbx',
              (object) => {
                object.scale.set(0.5, 0.5, 0.5);
                scene.add(object);
              },
              undefined,
              (error) => console.error('FBX Load Error:', error)
            );

        const fontLoader = new FontLoader();
        fontLoader.load('/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            fontRef.current = font;

            // Function to create and update text geometry
            const createTextMesh = (text: string) => {
                if (!fontRef.current) {
                    console.error('Font is not loaded yet'); // Log an error if the font is not loaded
                    return null; // Return null if the font is not available
                }

                const textGeometry = new TextGeometry(text, {
                    font: fontRef.current,
                    size: 10,
                    depth: 2,
                    curveSegments: 12,
                    bevelEnabled: false,
                });

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.set(0, 1, -5); // Position in front of the camera

                return textMesh; // Return the created text mesh
            };

            // Create initial text mesh
            let textMesh: THREE.Mesh | null = createTextMesh(`Status: ${gameState.status}`);

            
        
           
            // Animation loop
            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera); // Render the scene
            };

            animate(); // Start the animation loop

            // Update text mesh when game state changes
            const updateText = () => {
                if (textMesh) { // Check if textMesh is not null
                    scene.remove(textMesh); // Remove the old text mesh
                }
                const newTextMesh = createTextMesh(`${gameState.status}`); // Create new text mesh
                if (newTextMesh) { // Check if newTextMesh is not null
                    scene.add(newTextMesh); // Add new text mesh to the scene
                    textMesh = newTextMesh; // Update the reference to the current text mesh
                }
            };

            // Subscribe to game state changes (adjust based on your store)
            const unsubscribe = useGameStore.subscribe(updateText);

            return () => {
                unsubscribe(); // Cleanup subscription on unmount
                if (textMesh) { // Check if textMesh is not null
                    scene.remove(textMesh); // Remove text mesh on unmount
                }
            };
        });

    
        camera.position.set(0, 5, 20); // Position the camera
        camera.lookAt(0, 1, 0); // Look at the text

        return () => {
            // Cleanup if necessary
        };
    }, [gameState]); // Add specific property as a dependency

    return <canvas ref={canvasRef} style={{ width: '100%'}} />;
};

export default Game7;