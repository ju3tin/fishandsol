import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load font
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry('Hello, Three.js!', {
        font: font,
        size: 1,
        depth: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });

    textGeometry.computeBoundingBox(); // Compute bounding box

    // Check if bounding box is not null before accessing it
    if (textGeometry.boundingBox) {
        const centerOffset = (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) / 2;
        
        // Create material and mesh
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Center the text
        textMesh.position.x = -centerOffset;
        textMesh.position.y = 0;
        textMesh.position.z = 0;
        
        scene.add(textMesh);
    } else {
        // Handle the case where the bounding box is null, if necessary
        console.warn('Bounding box is null, cannot center the text.');
        // You can set a default value for centerOffset or skip centering
        const centerOffset = 0; // Default value
        // Create material and mesh
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Center the text
        textMesh.position.x = -centerOffset;
        textMesh.position.y = 0;
        textMesh.position.z = 0;
        
        scene.add(textMesh);
    }

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});