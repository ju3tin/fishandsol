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

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Load background texture
        const textureLoader = new THREE.TextureLoader();
        const bgTexture = textureLoader.load('/under3.png'); // Replace with your image path
        scene.background = bgTexture;

        const fontLoader = new FontLoader();
        fontLoader.load('/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            fontRef.current = font;

            // Function to create and update text geometry
            const createTextMesh = (text: string) => {
                if (!fontRef.current) return null;

                const textGeometry = new TextGeometry(text, {
                    font: fontRef.current,
                    size: 10,
                    depth: 2,
                    curveSegments: 12,
                    bevelEnabled: false,
                });

                const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.set(0, 1, -5);

                return textMesh;
            };

            let textMesh: THREE.Mesh | null = createTextMesh(`Status: ${gameState.status}`);

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

            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };

            animate();

            const updateText = () => {
                if (textMesh) scene.remove(textMesh);
                const newTextMesh = createTextMesh(`${gameState.status}`);
                if (newTextMesh) {
                    scene.add(newTextMesh);
                    textMesh = newTextMesh;
                }
            };

            const unsubscribe = useGameStore.subscribe(updateText);

            return () => {
                unsubscribe();
                if (textMesh) scene.remove(textMesh);
            };
        });

        camera.position.set(0, 5, 20);
        camera.lookAt(0, 1, 0);

    }, [gameState.status]);

    return <canvas className={styles.Game} ref={canvasRef}></canvas>;
};

export default Game7;