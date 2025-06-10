"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture, Decal } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";

type Emotion = "happy" | "sad" | "shock" | "angry" | "egg";

interface ModelProps {
  stage: string;
  mood: Emotion;
}

function Model({ stage, mood }: ModelProps) {
  const { scene } = useGLTF(`/models/${stage}.glb`);
  const groupRef = useRef<THREE.Group>(null);
  const faceMeshRef = useRef<THREE.Mesh>(null!);
  // const { actions } = useAnimations(animations, groupRef);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(mood);
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0);
  const [meshReady, setMeshReady] = useState(false);
  const [isPlayingShock, setIsPlayingShock] = useState(false);

  const texturePaths: Record<Emotion, string[]> = {
    happy: ["/textures/happy_1.png", "/textures/happy_2.png", "/textures/happy_3.png", "/textures/happy_4.png", "/textures/happy_5.png", "/textures/happy_6.png", "/textures/happy_7.png", "/textures/happy_8.png", "/textures/happy_9.png"],
    sad: ["/textures/sad_1.png", "/textures/sad_2.png", "/textures/sad_3.png", "/textures/sad_4.png", "/textures/sad_5.png", "/textures/sad_6.png"],
    shock: ["/textures/shock_1.png", "/textures/shock_2.png", "/textures/shock_3.png", "/textures/shock_4.png", "/textures/shock_5.png"],
    angry: ["/textures/angry_1.png", "/textures/angry_2.png", "/textures/angry_3.png"],
    egg: ["/textures/egg_1.png", "/textures/egg_2.png"],
};

  const happyTextures = useTexture(texturePaths.happy);
  const sadTextures = useTexture(texturePaths.sad);
  const shockTextures = useTexture(texturePaths.shock);
  const angryTextures = useTexture(texturePaths.angry);
  const eggTextures = useTexture(texturePaths.egg);

  const textures = useMemo(() => ({
    happy: happyTextures,
    sad: sadTextures,
    shock: shockTextures,
    angry: angryTextures,
    egg: eggTextures,
  }), [happyTextures, sadTextures, shockTextures, angryTextures, eggTextures]);

  useEffect(() => {
    Object.values(textures).forEach((textureArray) => {
      textureArray.forEach((texture) => {
        texture.flipY = true;
        texture.needsUpdate = true;
      });
    });
  }, [textures]);

  // find face mesh
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && ((child as THREE.Mesh).material as THREE.Material).name === "FaceMaterial") {
        faceMeshRef.current = child as THREE.Mesh;
        setMeshReady(true);
      }
    });
  }, [scene]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playEmotion = useCallback((emotion: Emotion, isTemporary: boolean = false) => { 
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const textureArray = textures[emotion];
    const randomIndex = Math.floor(Math.random() * textureArray.length);
    setCurrentTextureIndex(randomIndex);
    setCurrentEmotion(emotion);

    if (!isTemporary) {
      const duration = Math.random() * (10 - 5) + 5;
      timeoutRef.current = setTimeout(() => {
        playEmotion(emotion);
      }, duration * 1000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    } 
  }, [textures]);

  // handle mood changes
  useEffect(() => {
    if (!isPlayingShock) {
      const cleanup = playEmotion(mood);
      return cleanup;
    }
  }, [mood, isPlayingShock, playEmotion]);

  const handleClick = () => {
    if (isPlayingShock) return;

    setIsPlayingShock(true);
    playEmotion("shock", true);

    setTimeout(() => {
      setIsPlayingShock(false);
    }, 3000);
  };

  return (
    <>
      <primitive
        ref={groupRef}
        object={scene}
        onClick={handleClick}
      />
      {meshReady && faceMeshRef.current && (
        <Decal
        mesh={faceMeshRef}
        position={[0, 0, 0.5]}
        rotation={[0, 0, 0]}
        scale={0.8}
        map={textures[currentEmotion][currentTextureIndex]}
      />
      )}
    </>
  );
}

export default function PetModel({ stage, mood }: ModelProps) {
  return (
    <div style={{ width: "300px", height: "300px", cursor: "pointer" }}>
      <Canvas 
      orthographic 
      camera={{ zoom: 100, position: [0, 0, 100] }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={2.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Model stage={stage} mood={mood} />
        </Suspense>
      </Canvas>
    </div>
  );
}