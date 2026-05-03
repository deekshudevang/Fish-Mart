import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Golden Arowana ── */
function GoldenArowana({ position, speed = 1, scale = 1 }) {
  const groupRef = useRef();
  const tailRef = useRef();
  const pectoralLeftRef = useRef();
  const pectoralRightRef = useRef();
  
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    
    // Smooth majestic swimming path
    groupRef.current.position.x = initialPos.x + Math.sin(t * 0.4) * 4.0;
    groupRef.current.position.y = initialPos.y + Math.sin(t * 0.5) * 0.5;
    groupRef.current.position.z = initialPos.z + Math.cos(t * 0.3) * 2.0;
    
    // Face direction of movement
    groupRef.current.rotation.y = Math.cos(t * 0.4) * 0.4;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    
    // Tail wag
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 3) * 0.3;
    }
    
    // Pectoral fins flutter
    if (pectoralLeftRef.current && pectoralRightRef.current) {
      pectoralLeftRef.current.rotation.z = Math.sin(t * 4) * 0.2 + 0.3;
      pectoralRightRef.current.rotation.z = -Math.sin(t * 4) * 0.2 - 0.3;
    }
  });

  const goldMaterial = (
    <meshPhysicalMaterial
      color="#FFD700" // Vibrant Gold
      emissive="#b8860b" // Dark goldenrod glow
      emissiveIntensity={0.2}
      metalness={0.9}
      roughness={0.1}
      clearcoat={1}
      clearcoatRoughness={0.05}
      envMapIntensity={2.5}
    />
  );

  return (
    <group ref={groupRef} scale={scale}>
      {/* Elongated Body */}
      <mesh scale={[2.5, 0.5, 0.2]}>
        <sphereGeometry args={[0.4, 32, 16]} />
        {goldMaterial}
      </mesh>
      
      {/* Head/Mouth curve */}
      <mesh position={[0.8, 0, 0]} scale={[0.6, 0.4, 0.15]}>
        <sphereGeometry args={[0.3, 24, 16]} />
        {goldMaterial}
      </mesh>

      {/* Barbels (Whiskers) */}
      <mesh position={[1.0, -0.1, 0.05]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.01, 0.005, 0.2, 8]} />
        {goldMaterial}
      </mesh>
      <mesh position={[1.0, -0.1, -0.05]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.01, 0.005, 0.2, 8]} />
        {goldMaterial}
      </mesh>

      {/* Eyes */}
      <mesh position={[0.7, 0.08, 0.1]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.72, 0.08, 0.12]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      <mesh position={[0.7, 0.08, -0.1]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.72, 0.08, -0.12]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Pectoral Fins */}
      <group ref={pectoralLeftRef} position={[0.4, -0.1, 0.1]}>
        <mesh position={[-0.2, -0.1, 0.1]} rotation={[0.4, 0.2, 0]}>
          <coneGeometry args={[0.15, 0.5, 3]} />
          {goldMaterial}
        </mesh>
      </group>
      <group ref={pectoralRightRef} position={[0.4, -0.1, -0.1]}>
        <mesh position={[-0.2, -0.1, -0.1]} rotation={[-0.4, -0.2, 0]}>
          <coneGeometry args={[0.15, 0.5, 3]} />
          {goldMaterial}
        </mesh>
      </group>

      {/* Tail fin */}
      <group ref={tailRef} position={[-0.9, 0, 0]}>
        <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.3, 0.6, 4]} />
          {goldMaterial}
        </mesh>
      </group>

      {/* Dorsal fin (long along the back) */}
      <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, -1.2]} scale={[1, 0.2, 0.05]}>
        <boxGeometry args={[0.8, 0.5, 1]} />
        {goldMaterial}
      </mesh>
    </group>
  );
}

/* ── Main Scene ── */
export default function AquariumScene() {
  return (
    <div className="canvas-container absolute inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 1, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }} // Transparent background to remove blue
      >
        {/* Crisp Lighting to make gold shine */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <pointLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-5, 5, -5]} intensity={1.5} color="#FFD700" />
        <directionalLight
          position={[0, 10, 5]}
          intensity={1.0}
          color="#ffffff"
        />

        {/* Single Majestic Golden Arowana */}
        <GoldenArowana position={[0, 0, 0]} speed={0.8} scale={1.8} />

      </Canvas>
    </div>
  );
}
