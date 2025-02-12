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
    scene.background = new THREE.Color(0x202020); // Dark background for visibility

    // ✅ Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(ambientLight, directionalLight);

    // ✅ Create Camera
    const camera = new THREE.PerspectiveCamera(75, canvasAspectRatio, 0.1, 1000);
    camera.position.set(0, 5, 20); // Move camera further to see text

    // ✅ WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerWidth / canvasAspectRatio);
    renderer.shadowMap.enabled = true;

    // ✅ Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ✅ Load FBX Model (Rocket)
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      '/fish.fbx',
      (object) => {
        object.scale.set(0.005, 0.005, 0.005);
        scene.add(object);
      },
      undefined,
      (error) => console.error('FBX Load Error:', error)
    );

    // ✅ Load Font for Status Text
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      fontRef.current = font;
      console.log('Font Loaded:', font); // ✅ Debugging

      const textGeometry = new TextGeometry('Status: Waiting', {
        font: fontRef.current,
        size: 10, // ✅ Increased size
        depth: 2, // ✅ Use depth instead of height for thickness
        curveSegments: 12,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 }); // ✅ Better lighting support
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-10, 5, -10); // ✅ Adjust position
      textMesh.castShadow = true;
      textMesh.receiveShadow = true;

      scene.add(textMesh);
      statusTextRef.current = textMesh;
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

      // ✅ Update Status Text Dynamically
      if (statusTextRef.current && fontRef.current) {
        statusTextRef.current.geometry.dispose();
        statusTextRef.current.geometry = new TextGeometry(`Status: ${gameState.status}`, {
          font: fontRef.current,
          size: 10, // ✅ Keep size large
          depth: 2,
          curveSegments: 12,
          bevelEnabled: false,
        });
      }
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
  }, [gameState.status]);

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