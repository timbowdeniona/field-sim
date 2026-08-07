'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export const SprinklerMesh: React.FC = () => {
  const headRef = useRef<Group>(null);
  const sprayRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (headRef.current) {
      headRef.current.rotation.y += delta * 6;
    }
    if (sprayRef.current) {
      sprayRef.current.rotation.y += delta * 6;
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Base Stand */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.3, 8]} />
        <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rotating Spray Nozzle */}
      <group ref={headRef} position={[0, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.25, 0.08, 0.08]} />
          <meshStandardMaterial color="#0288D1" metalness={0.9} />
        </mesh>
      </group>

      {/* Water Spray Particles (Semi-transparent cyan drops) */}
      <group ref={sprayRef} position={[0, 0.35, 0]}>
        {[0, 120, 240].map((angle, idx) => (
          <group key={idx} rotation={[0, (angle * Math.PI) / 180, 0]}>
            <mesh position={[0.4, 0.1, 0]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshBasicMaterial color="#80DEEA" transparent opacity={0.7} />
            </mesh>
            <mesh position={[0.7, 0.05, 0]}>
              <sphereGeometry args={[0.03, 6, 6]} />
              <meshBasicMaterial color="#B2EBF2" transparent opacity={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
