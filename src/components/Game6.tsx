'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from '../styles/Game1.module.css';
import { useGameStore, GameState } from '../store/gameStore2';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

interface ThreeSceneProps {
  width: number;
}

export default function ThreeScene({ width }: ThreeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aspectRatio = 4000 / 1995;
  const fontRef = useRef<Font | null>(null);
  const gameState = useGameStore((state: GameState) => state);
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null); // Store animation mixer reference


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

    // Resize Handler
    function resizeCanvas() {
      const canvasHeight = width / aspectRatio;
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
      renderer.setSize(width, canvasHeight);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    // Load Fish Model
    const fbxLoader = new FBXLoader();
    fbxLoader.load('/fish1.fbx', (object) => {
      object.scale.set(0.05, 0.05, 0.05);
      object.position.set(0, 1, -5);
      scene.add(object);

      const mixer = new THREE.AnimationMixer(object);
      mixerRef.current = mixer;

      if (object.animations.length > 0) {
        const action = mixer.clipAction(object.animations[0]); // Play the first animation
    action.setEffectiveTimeScale(0.005); // Slows animation to 50% speed
    action.play();
      }

    });

    // Load Background Texture
    const textureLoader = new THREE.TextureLoader();
    scene.background = textureLoader.load('/under3.png');

    // Load Font
    const fontLoader = new FontLoader();
    fontLoader.load('/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      fontRef.current = font;
      updateText(gameState.status, 
                 Number(gameState.timeRemaining), // Convert to number
                 Number(gameState.multiplier)); // Convert to number
    });

    function updateText(status: string, timeRemaining: number, multiplier: number) {
      if (!fontRef.current) return;

      // Remove existing text
      if (textMeshRef.current) {
        scene.remove(textMeshRef.current);
      }

      // Determine text content
      let text = status;
      if (status === 'Waiting') {
        text = `Time: ${timeRemaining}`;
      } else if (status === 'Running') {
        text = `Multiplier: ${multiplier}`;
      }
      // Create new text mesh
      const textGeometry = new TextGeometry(text, {
        font: fontRef.current,
        size: 10,
        depth: 2,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      textMeshRef.current = new THREE.Mesh(textGeometry, textMaterial);
      textMeshRef.current.position.set(0, 1, -5);
      textMeshRef.current.scale.set(0.05, 0.05, 0.05);
      scene.add(textMeshRef.current);
    }

    // Subscribe to game state updates
    const unsubscribe = useGameStore.subscribe((state) => {
      updateText(state.status, 
                 Number(state.timeRemaining), // Convert to number
                 Number(state.multiplier)); // Convert to number
    });

    // Animation Loop
    let clock = new THREE.Clock();
    const targetFPS = 60; // Set this to match Blender's FPS
    const frameDuration = 1 / targetFPS; // Time per frame

    function animate() {
      requestAnimationFrame(animate);
    
      const deltaTime = clock.getDelta(); // Time since last frame
      const timeElapsed = clock.elapsedTime;
    
      if (mixerRef.current) {
        mixerRef.current.update(frameDuration); // Update at fixed FPS
      }
    
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

/*
    function animate(deltaTime: number) {
      requestAnimationFrame(animate);
      controls.update();
      
      if (mixerRef.current) {
        mixerRef.current.update(deltaTime); 
    
      }

      renderer.render(scene, camera);
    }
    animate(0);
*/

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      controls.dispose();
      unsubscribe();
    };
  }, [width]);

  return <canvas className={styles.Game} ref={canvasRef} />;
}