'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { useGameStore, GameState } from '../store/gameStore2';
import styles from '../styles/Game1.module.css';
import { toast } from 'react-toastify';

const canvasAspectRatio = 4000 / 1995;

const Game5 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusTextRef = useRef<THREE.Mesh | null>(null);
  const fontRef = useRef<THREE.Font | null>(null);
  const gameState = useGameStore((state: GameState) => state);

  const fontLoader = new FontLoader();

  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ Create a Three.js Scene
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 50);
    light.position.set(0.8, 1.4, 1.0);
    scene.add(light, new THREE.AmbientLight());

    // ✅ Create a Camera
    const camera = new THREE.PerspectiveCamera(75, canvasAspectRatio, 0.1, 1000);
    camera.position.set(0.8, 1.4, 1.0);

    // ✅ WebGL Renderer (Attach to Canvas)
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerWidth / canvasAspectRatio);

    // ✅ Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    // ✅ Load FBX Model (Rocket)
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

    // ✅ Load Font for Status Text
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      fontRef.current = font;

      const textGeometry = new TextGeometry('Status: Waiting', {
        font: fontRef.current,
        size: 1,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      });

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-2, 2, -5);
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
          size: 1,
          depth: 0.1,
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
  }, [gameState.status]); // ✅ Depend on game status updates

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