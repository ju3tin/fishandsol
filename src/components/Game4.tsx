"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGameStore, GameState } from "../store/gameStore2";
import styles from "../styles/Game1.module.css";

const height = 2000;
const coeffB = 0.5;
const coeffA = height * 0.16;

function curveFunction(t: number) {
    return coeffA * (Math.exp(coeffB * t) - 1);
}

export default function Game() {
    const threeCanvasRef = useRef<HTMLCanvasElement>(null);
    const gameState = useGameStore((state: GameState) => state);

    useEffect(() => {
        const loadFBXModel = async () => {
            // ✅ Dynamic import to prevent build errors
            const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader");
            const threeCanvas = threeCanvasRef.current;
            if (!threeCanvas) return;

            const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true });
            renderer.setSize(4000, 1995);
            renderer.setPixelRatio(window.devicePixelRatio);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(50, 4000 / 1995, 0.1, 1000);
            camera.position.set(0, 0, 10);

            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 1, 1);
            scene.add(light);

            const loader = new FBXLoader();
            loader.load("/rocket.fbx", (fbx: THREE.Group) => {
                fbx.scale.set(0.01, 0.01, 0.01);
                scene.add(fbx);

                const animate = () => {
                    requestAnimationFrame(animate);
                    const expectedX = gameState.timeElapsed / 100;
                    const expectedY = -curveFunction(gameState.timeElapsed / 1000) / 100;
                    fbx.position.set(expectedX, expectedY, 0);
                    fbx.rotation.y += 0.01;
                    renderer.render(scene, camera);
                };

                animate();
            });
        };

        loadFBXModel();
    }, [gameState]);

    return (
        <div className={styles.Game}>
            <canvas ref={threeCanvasRef} className={styles.canvas3D}></canvas>
        </div>
    );
}