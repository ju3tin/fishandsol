'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import styles from '../styles/Game1.module.css';

export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = 4000; // Change width here
  const canvasHeight = 1995; // Change height here

  useEffect(() => {
    // ✅ Create a Three.js scene
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5));

    const light = new THREE.PointLight(0xffffff, 50);
    light.position.set(0.8, 1.4, 1.0);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    camera.position.set(0.8, 1.4, 1.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current! });
    renderer.setSize(canvasWidth, canvasHeight);

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

    // ✅ Resize Handling
    function onWindowResize() {
      camera.aspect = canvasWidth / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasWidth, canvasHeight);
    }
    window.addEventListener('resize', onWindowResize);

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

  return <canvas className={styles.Game} ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
}