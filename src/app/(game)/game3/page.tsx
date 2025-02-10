'use client' // Ensure this page only runs on the client-side

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export default function GamePage(): JSX.Element {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    scene.add(
      /*new THREE.AxesHelper(5)*/
      )

    const light = new THREE.PointLight(0xffffff, 10)
    light.position.set(0.8, 1.4, 1.0)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight()
    scene.add(ambientLight)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0.8, 1.4, 1.0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement)
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 1, 0)

    const fbxLoader = new FBXLoader()
    fbxLoader.load(
      '/fish.fbx', // Ensure this path is correct for your project
      (object) => {
         object.scale.set(.005, .005, .005)
        scene.add(object)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    )

    window.addEventListener('resize', onWindowResize, false)

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      render()
    }

  //  const stats = new Stats()
  //  document.body.appendChild(stats.dom)

    function animate() {
      requestAnimationFrame(animate)

      controls.update()

      render()

  //    stats.update()
    }

    function render() {
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      // Cleanup event listener when the component is unmounted
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  return (
    <div ref={mountRef} style={{ height: '100vh' }} />
  )
}