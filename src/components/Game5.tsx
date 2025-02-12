'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { useGameStore, GameState } from '../store/gameStore2';
import styles from '../styles/Game1.module.css';

const canvasAspectRatio = 4000 / 1995;

const Game5 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusTextRef = useRef<THREE.Mesh | null>(null);
  const fontRef = useRef<Font | null>(null);
  const gameState = useGameStore((state: GameState) => state);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020); // Dark background

    // ✅ Lighting (For Objects, Not Needed for Text)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(ambientLight, directionalLight);

    // ✅ Create Camera
    const camera = new THREE.PerspectiveCamera(75, canvasAspectRatio, 0.1, 1000);
    camera.position.set(0, 10, 30); // 🔹 Move Camera Further
    camera.lookAt(0, 5, -5); // 🔹 Ensure Camera Faces Text

    // ✅ WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerWidth / canvasAspectRatio);
    renderer.shadowMap.enabled = true;

    // ✅ Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ✅ Load Font for Status Text
    const fontLoader = new FontLoader();
    fontLoader.load('/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      console.log('✅ Font Loaded:', font); // 🔹 Debugging

      fontRef.current = font;
      const textGeometry = new TextGeometry('Status: Waiting', {
        font: font,
        size: 15, // 🔹 Increased size
        depth: 5, // 🔹 Make text 3D
        curveSegments: 12,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 🔹 Bright Red for Visibility
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(0, 5, -5); // 🔹 Move Text Forward
      scene.add(textMesh);
      statusTextRef.current = textMesh;
    },
    undefined,
    (error) => {
        console.error('Error loading font:', error); // Log any loading errors
    });

    // ✅ Handle Window Resize
    function onWindowResize() {
      const width = window.innerWidth;
      const height = width / canvasAspectRatio;
      camera.aspect = canvasAspectRatio;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    // ✅ Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // ✅ Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      controls.dispose();
      if (statusTextRef.current) {
        scene.remove(statusTextRef.current);
        statusTextRef.current.geometry.dispose();
      }
    };
  }, []);

  return (
    <canvas
      className={styles.Game}
      ref={canvasRef}
      style={{
        border: '1px solid #000',
        width: '100%',
        aspectRatio: `${canvasAspectRatio}`,
      }}
    />
  );
};

export default Game5;