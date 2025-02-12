import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const Game7 = () => {
    const fontRef = useRef<Font | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const fontLoader = new FontLoader();

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x202020); // Set a dark background color
        document.body.appendChild(renderer.domElement);

        fontLoader.load('/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            fontRef.current = font;

            const textGeometry = new TextGeometry('Status: Waiting', {
                font: fontRef.current,
                size: 10,
                depth: 2,
                curveSegments: 12,
                bevelEnabled: false,
            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(0, 1, -5); // Position in front of the camera
            scene.add(textMesh);
            console.log('Text mesh added to the scene:', textMesh);
        },
        undefined,
        (error) => {
            console.error('Error loading font:', error);
        });
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


        // Add a simple cube for testing
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube); // Add the cube to the scene

        camera.position.set(0, 5, 20); // Position the camera
        camera.lookAt(0, 1, 0); // Look at the text

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera); // Render the scene
        };

        animate(); // Start the animation loop

        return () => {
            // Cleanup if necessary
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default Game7;