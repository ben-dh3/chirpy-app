"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, useTexture, Decal } from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";
import * as THREE from "three";

function Model() {
  const { scene, animations } = useGLTF("/models/baby.glb");
  const groupRef = useRef<THREE.Group>(null);
  const faceMeshRef = useRef<THREE.Mesh>(null!);
  const { actions } = useAnimations(animations, groupRef);
  const [currentEmotion, setCurrentEmotion] = useState<"happy" | "sad">("happy");
  const [meshReady, setMeshReady] = useState(false);

  const textures = useTexture({
    happy: "/textures/happy.png",
    sad: "/textures/sad.png",
  });

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && ((child as THREE.Mesh).material as THREE.Material).name === "FaceMaterial") {
        faceMeshRef.current = child as THREE.Mesh;
        setMeshReady(true);
        console.log("Found face mesh:", child.name);
      }
    });
  }, [scene]);

  useEffect(() => {
    console.log("Textures loaded:", textures);
    Object.entries(textures).forEach(([key, texture]) => {
      console.log(`${key} texture:`, texture.image?.src, texture.image?.complete);
    });
  }, [textures]);

  const playEmotion = (emotion: "happy" | "sad") => {
    Object.values(actions).forEach(action => action?.stop());
    
    const action = actions[emotion];
    if (action) {
      action.reset().fadeIn(0.2).play();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }
    setCurrentEmotion(emotion);
  };

  const switchEmotion = () => {
    const newEmotion = currentEmotion === "happy" ? "sad" : "happy";
    console.log(`Switching from ${currentEmotion} to ${newEmotion}`);
    playEmotion(newEmotion);
  };

  return (
    <>
      <primitive
        ref={groupRef}
        object={scene}
        onClick={switchEmotion}
      />
      {meshReady && faceMeshRef.current && (
        <Decal
        mesh={faceMeshRef}
        position={[0, 0, 1.0]}
        rotation={[0, 0, 0]}
        scale={0.7}
        map={textures[currentEmotion]}
        depthTest={false}
        polygonOffsetFactor={0}
      />
      )}
    </>
  );
}

export default function PetModel() {
  return (
    <div style={{ width: "300px", height: "300px" }}>
      <Canvas 
      orthographic 
      camera={{ zoom: 100, position: [0, 0, 100] }}
      >
        <Suspense fallback={null}>
          <ambientLight />
          <directionalLight intensity={4.16} />
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
}