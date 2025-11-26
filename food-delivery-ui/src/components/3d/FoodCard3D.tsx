"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

interface FoodCard3DProps {
  emoji: string;
  name: string;
  price: number;
  isHovered?: boolean;
}

function FoodMesh({ emoji, name, price, isHovered }: FoodCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = hovered || isHovered ? Math.sin(state.clock.elapsedTime) * 0.2 : 0;
      meshRef.current.position.y = hovered || isHovered ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered || isHovered ? 1.2 : 1}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={hovered || isHovered ? "#22c55e" : "#16a34a"}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {emoji}
      </Text>
    </>
  );
}

export function FoodCard3D({ emoji, name, price, isHovered }: FoodCard3DProps) {
  return (
    <div className="w-full h-64 relative rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
      <Canvas>
        <FoodMesh emoji={emoji} name={name} price={price} isHovered={isHovered} />
        <Environment preset="sunset" />
      </Canvas>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <p className="text-white font-semibold text-sm">{name}</p>
        <p className="text-white/80 text-xs">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}

