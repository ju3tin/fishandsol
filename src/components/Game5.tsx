'use client' // Ensures this component runs only on the client side

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const canvasWidth = 800  // Change width here
  const canvasHeight = 600 // Change height here

  useEffect(() => {
    // ✅ Scene Setup
    const scene = new THREE.Scene()
    scene.add(new THREE.AxesHelper(5))

    const light = new THREE.PointLight(0xffffff, 50)
    light.position.set(0.8, 1.4, 1.0)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000)
    camera.position.set(0.8, 1.4, 1.0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvasWidth, canvasHeight)

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement)
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)

    // ✅ Load FBX Model
    const fbxLoader = new FBXLoader()
    fbxLoader.load(
      '/fish.fbx', // Ensure this path is correct
      (object) => {
        scene.add(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )

    // ✅ Handle Window Resize
    function onWindowResize() {
      camera.aspect = canvasWidth / canvasHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvasWidth, canvasHeight)
      render()
    }
    window.addEventListener('resize', onWindowResize)

    // ✅ Stats (Performance Monitoring)
    const stats = new Stats()
    document.body.appendChild(stats.dom)

    // ✅ Animation Loop
    function animate() {
      requestAnimationFrame(animate)
      controls.update()
      render()
      stats.update()
    }

    function render() {
      renderer.render(scene, camera)
    }

    animate()

    // ✅ Cleanup Function
    return () => {
      window.removeEventListener('resize', onWindowResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        border: '2px solid #000' // Optional: Adds border for visualization
      }}
    />
  )
}