'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from '../styles/Game1.module.css';

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