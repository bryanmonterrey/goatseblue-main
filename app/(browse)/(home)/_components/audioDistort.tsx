import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import dynamic from 'next/dynamic';
import Script from 'next/script';

interface AudioReactive3DProps {
  audioUrl: string;
}

declare global {
  interface Window {
    p5: any;
    P5: {
      FFT: new () => any;
      Sound: any;
    };
  }
}

const AudioReactive3D = ({ audioUrl }: AudioReactive3DProps) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(true);
  const [loadState, setLoadState] = useState({
    p5Loaded: false,
    p5SoundLoaded: false
  });
  const [modelLoaded, setModelLoaded] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<any>(null);
  const p5Instance = useRef<any>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const fftRef = useRef<any>(null);
  const audioRef = useRef<any>(null);

  const handlePress = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (audioRef.current) {
        if (audioRef.current.isPlaying()) {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        } else {
          await audioContextRef.current?.resume();
          audioRef.current.loop();
          setIsAudioPlaying(true);
        }
        setNeedsUserInteraction(false);
      }
    } catch (error) {
      console.error('Error handling press:', error);
    }
  };

  useEffect(() => {
    if (!loadState.p5Loaded || !loadState.p5SoundLoaded || !mountRef.current) return;

    const initScene = () => {
      // Scene
      sceneRef.current = new THREE.Scene();

      // Camera
      cameraRef.current = new THREE.PerspectiveCamera(
        60,
        mountRef.current!.clientWidth / mountRef.current!.clientHeight,
        0.1,
        1000
      );
      cameraRef.current.position.set(0, 0, 5);

      // Renderer
      rendererRef.current = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      rendererRef.current.setSize(
        mountRef.current!.clientWidth,
        mountRef.current!.clientHeight
      );
      rendererRef.current.setClearColor(0x000000, 0);
      rendererRef.current.outputColorSpace = THREE.SRGBColorSpace;
      mountRef.current!.appendChild(rendererRef.current.domElement);

      // Lighting
      const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
      directionalLight.position.set(0, 1, 0);
      sceneRef.current.add(ambientLight);
      sceneRef.current.add(directionalLight);

      // Load model
      const loader = new GLTFLoader();
      loader.load(
        `${window.location.origin}/hornet.glb`,
        (gltf) => {
          modelRef.current = gltf.scene;
          
          // Center the model
          const box = new THREE.Box3().setFromObject(modelRef.current);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.75 / maxDim;
          
          modelRef.current.scale.multiplyScalar(scale);
          modelRef.current.position.x = -center.x * scale;
          modelRef.current.position.y = -center.y * scale;
          modelRef.current.position.z = -center.z * scale;

          sceneRef.current?.add(modelRef.current);
          setModelLoaded(true);
        },
        (progress) => {
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log(`Loading progress: ${percentComplete.toFixed(2)}%`);
        },
        (error) => console.error('Error loading model:', error)
      );
    };
    const initAudio = () => {
      console.log('Initializing audio...');
      const sketch = (p: any) => {
        p.preload = () => {
          audioRef.current = p.loadSound(audioUrl);
          console.log('Audio loaded');
        };

        p.setup = () => {
          fftRef.current = new window.p5.FFT();
          audioContextRef.current = p.getAudioContext();
          console.log('Audio context created');
        };
      };

      p5Instance.current = new window.p5(sketch);
    };

    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
        return;
      }

      if (modelRef.current) {
        // Base rotation
        modelRef.current.rotation.y += 0.005;

        // Audio reactive movements
        if (audioContextRef.current?.state === 'running' && fftRef.current) {
          fftRef.current.analyze();
          const bass = fftRef.current.getEnergy("bass");
          const treble = fftRef.current.getEnergy("treble");
          
          // Subtle audio reactions
          modelRef.current.rotation.x = THREE.MathUtils.mapLinear(bass, 0, 255, -0.05, 0.05);
          modelRef.current.rotation.z = THREE.MathUtils.mapLinear(treble, 0, 255, -0.025, 0.025);
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    initScene();
    initAudio();
    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [loadState, audioUrl]);

  return (
    <div className="relative flex items-center justify-center">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js"
        onLoad={() => setLoadState(prev => ({ ...prev, p5Loaded: true }))}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js"
        strategy="afterInteractive"
        onLoad={() => setLoadState(prev => ({ ...prev, p5SoundLoaded: true }))}
      />

      {needsUserInteraction && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <button 
            onClick={handlePress}
            onTouchStart={handlePress}
            className="hover:text-black text-black border hover:italic border-black px-4 py-1 rounded-none font-inter transition-all duration-300 flex items-center gap-2"
          >
            Press Play
          </button>
        </div>
      )}

      <div 
        ref={mountRef}
        style={{ 
          width: '1200px',
          height: '1200px',
          mixBlendMode: 'screen',
          margin: '0 auto',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          background: 'transparent'
        }}
        className="relative"
      />

      <button
        onClick={handlePress}
        onTouchStart={handlePress}
        className="absolute top-5 right-5 z-[1060] text-azul hover:text-white transition-colors"
      >
        {isAudioPlaying ? (
          <svg className="w-6 h-6" viewBox="0 0 32 31">
            <use xlinkHref="#icon-soundon" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 32 31">
            <use xlinkHref="#icon-soundoff" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(AudioReactive3D), {
  ssr: false
});
