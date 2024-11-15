import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import dynamic from 'next/dynamic';

const ModelViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x000000);

    // Camera setup
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current.position.z = 5;

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 2);
    sceneRef.current.add(ambientLight, directionalLight);

    // Debug cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    sceneRef.current.add(cube);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      '/goatse.glb',
      (gltf) => {
        console.log('Model loaded:', gltf);
        
        modelRef.current = gltf.scene;
        
        // Center the model
        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = box.getCenter(new THREE.Vector3());
        modelRef.current.position.sub(center);
        
        // Scale the model
        const size = new THREE.Vector3();
        box.getSize(size);
        const scale = 2 / Math.max(size.x, size.y, size.z);
        modelRef.current.scale.multiplyScalar(scale);

        // Add to scene
        sceneRef.current?.add(modelRef.current);
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animation
    const animate = () => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.01;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '800px', 
        height: '800px',
        margin: '0 auto',
        background: '#000'
      }} 
    />
  );
};

export default dynamic(() => Promise.resolve(ModelViewer), {
  ssr: false
});