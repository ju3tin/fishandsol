'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from '../styles/Game1.module.css';

interface ThreeSceneProps {
  width: number; // Accept width as a prop
}

export default function ThreeScene({ width }: ThreeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const aspectRatio = 4000 / 1995;

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

    const fbxLoader = new FBXLoader();
    fbxLoader.load('/fish.fbx', (object) => {
      object.scale.set(0.005, 0.005, 0.005);
      scene.add(object);
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