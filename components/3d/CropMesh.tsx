'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { CropType } from '@/types/game';

interface CropMeshProps {
  type: CropType;
  stage: 0 | 1 | 2;
  progress: number;
}

export const CropMesh: React.FC<CropMeshProps> = ({ type, stage, progress }) => {
  const cropGroupRef = useRef<Group>(null);
  const scaleRatio = 0.3 + (progress / 100) * 0.7;

  useFrame((state) => {
    if (stage === 2 && cropGroupRef.current) {
      // Gentle swaying animation for mature crops
      cropGroupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
    }
  });

  return (
    <group ref={cropGroupRef} scale={[scaleRatio, scaleRatio, scaleRatio]} position={[0, 0.05, 0]}>
      {/* STAGE 0: Seeds & Small Sprouts */}
      {stage === 0 && (
        <group>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#8BC34A" />
          </mesh>
          <mesh position={[0.05, 0.15, 0]} rotation={[0, 0, -0.3]}>
            <coneGeometry args={[0.04, 0.2, 4]} />
            <meshStandardMaterial color="#4CAF50" />
          </mesh>
        </group>
      )}

      {/* STAGE 1 & 2: Growing & Mature Crops */}
      {stage > 0 && type === 'wheat' && (
        <group>
          {/* Wheat Stalks */}
          {[-0.1, 0, 0.1].map((xOffset, i) => (
            <group key={i} position={[xOffset, 0, (i % 2 === 0 ? 0.05 : -0.05)]}>
              {/* Stem */}
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.02, 0.03, 0.8, 6]} />
                <meshStandardMaterial color={stage === 2 ? "#F4C430" : "#7CB342"} />
              </mesh>
              {/* Head / Grain ears */}
              <mesh position={[0, 0.85, 0]}>
                <coneGeometry args={[0.09, 0.35, 6]} />
                <meshStandardMaterial color={stage === 2 ? "#DAA520" : "#9CCC65"} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {stage > 0 && type === 'corn' && (
        <group>
          {/* Main Corn Stalk */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 1.2, 8]} />
            <meshStandardMaterial color={stage === 2 ? "#33691E" : "#558B2F"} />
          </mesh>
          {/* Leaves */}
          <mesh position={[0.15, 0.5, 0]} rotation={[0, 0, -0.6]}>
            <boxGeometry args={[0.3, 0.02, 0.12]} />
            <meshStandardMaterial color="#689F38" />
          </mesh>
          <mesh position={[-0.15, 0.7, 0]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[0.3, 0.02, 0.12]} />
            <meshStandardMaterial color="#689F38" />
          </mesh>
          {/* Mature Corn Ear */}
          {stage === 2 && (
            <group position={[0.08, 0.6, 0.05]} rotation={[0.2, 0, -0.3]}>
              <mesh>
                <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
                <meshStandardMaterial color="#FFD54F" />
              </mesh>
              {/* Husk */}
              <mesh position={[0, -0.05, 0]}>
                <coneGeometry args={[0.1, 0.25, 6]} />
                <meshStandardMaterial color="#7CB342" />
              </mesh>
            </group>
          )}
        </group>
      )}

      {stage > 0 && type === 'carrot' && (
        <group>
          {/* Leafy Green Tops */}
          {[0, 120, 240].map((deg, i) => (
            <mesh key={i} position={[0, 0.35, 0]} rotation={[0.3, (deg * Math.PI) / 180, 0]}>
              <coneGeometry args={[0.15, 0.5, 5]} />
              <meshStandardMaterial color="#2E7D32" />
            </mesh>
          ))}
          {/* Orange Carrot Root */}
          {stage === 2 && (
            <mesh position={[0, 0.05, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.12, 0.35, 8]} />
              <meshStandardMaterial color="#FF6F00" roughness={0.4} />
            </mesh>
          )}
        </group>
      )}

      {stage > 0 && type === 'pumpkin' && (
        <group>
          {/* Green Vines */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.25, 0.04, 6, 12]} />
            <meshStandardMaterial color="#1B5E20" />
          </mesh>
          {/* Pumpkin Body */}
          {stage === 2 && (
            <group position={[0, 0.22, 0]}>
              <mesh>
                <sphereGeometry args={[0.32, 12, 12]} />
                <meshStandardMaterial color="#E65100" roughness={0.5} />
              </mesh>
              {/* Stem */}
              <mesh position={[0, 0.32, 0]}>
                <cylinderGeometry args={[0.04, 0.05, 0.12, 6]} />
                <meshStandardMaterial color="#33691E" />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* Floating Harvest Ring Glow when Mature */}
      {stage === 2 && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 16]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};
