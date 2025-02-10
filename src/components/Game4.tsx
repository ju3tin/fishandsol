"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFBX } from "@react-three/drei";
import { useGameStore, GameState } from "../store/gameStore2";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"; // ✅ Correct Import


import styles from "../styles/Game1.module.css";

const height = 2000;
const coeffB = 0.5;
const coeffA = height * 0.16;

function curveFunction(t: number) {
    return coeffA * (Math.exp(coeffB * t) - 1);
}

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const threeCanvasRef = useRef<HTMLCanvasElement>(null);
    const gameState = useGameStore((gameState: GameState) => gameState);

    useEffect(() => {
        // Initialize 2D Canvas for UI and Background
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 4000;
        canvas.height = 1995;

        const render2D = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(render2D);
        };

        render2D();
    }, []);

    useEffect(() => {
        // Initialize Three.js Renderer for 3D Rocket
        const threeCanvas = threeCanvasRef.current;
        if (!threeCanvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true });
        renderer.setSize(4000, 1995);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(50, 4000 / 1995, 0.1, 1000);
        camera.position.set(0, 0, 10);

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 1);
        scene.add(light);

        // Load FBX Rocket Model
        const loader = new THREE.FBXLoader();
        loader.load("/rocket.fbx", (fbx) => {
            fbx.scale.set(0.01, 0.01, 0.01); // Adjust scale to fit the scene
            scene.add(fbx);

            const animate = () => {
                requestAnimationFrame(animate);

                // Sync Rocket Position with 2D Trajectory
                const expectedX = gameState.timeElapsed / 100;
                const expectedY = -curveFunction(gameState.timeElapsed / 1000) / 100;

                fbx.position.set(expectedX, expectedY, 0);
                fbx.rotation.y += 0.01; // Rotate slightly for realism

                renderer.render(scene, camera);
            };

            animate();
        });

        return () => {
            renderer.dispose();
        };
    }, [gameState]);

    return (
        <div className={styles.Game}>
            <canvas ref={canvasRef} className={styles.canvas2D}></canvas>
            <canvas ref={threeCanvasRef} className={styles.canvas3D}></canvas>
        </div>
    );
}