'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '@/store/useGameStore';
import { LivestockAnimal } from '@/types/game';

const AnimalItem: React.FC<{ animal: LivestockAnimal }> = ({ animal }) => {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const selectedTool = useGameStore((state) => state.selectedTool);
  const feedAnimal = useGameStore((state) => state.feedAnimal);
  const collectAnimalProduct = useGameStore((state) => state.collectAnimalProduct);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.set(animal.x, 0.2, animal.z);
      // Face target direction angle
      const dx = animal.targetX - animal.x;
      const dz = animal.targetZ - animal.z;
      if (Math.abs(dx) > 0.1 || Math.abs(dz) > 0.1) {
        groupRef.current.rotation.y = Math.atan2(dx, dz);
      }
    }

    // Head bobbing / eating animation
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 3 + (animal.x * 2)) * 0.15;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (animal.hasProductReady) {
      collectAnimalProduct(animal.id);
    } else if (selectedTool === 'feed' || animal.hunger < 50) {
      feedAnimal(animal.id);
    }
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Ready Product Badge Overlay */}
      {animal.hasProductReady && (
        <group position={[0, 1.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshBasicMaterial color="#FFEB3B" transparent opacity={0.9} />
          </mesh>
          {/* Inner Product Symbol */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.18, 0.22, 0.18]} />
            <meshStandardMaterial
              color={animal.type === 'cow' ? '#FFFFFF' : (animal.type === 'sheep' ? '#ECEFF1' : '#FFF9C4')}
            />
          </mesh>
        </group>
      )}

      {/* Hungry Badge Overlay */}
      {animal.hunger < 40 && !animal.hasProductReady && (
        <group position={[0, 1.6, 0]}>
          <mesh>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#FF5252" />
          </mesh>
        </group>
      )}

      {/* Hover Ring */}
      {hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 16]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.8} />
        </mesh>
      )}

      {/* --- COW MESH --- */}
      {animal.type === 'cow' && (
        <group scale={[0.8, 0.8, 0.8]}>
          {/* Cow Body */}
          <mesh castShadow position={[0, 0.7, 0]}>
            <boxGeometry args={[0.9, 0.8, 1.6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
          </mesh>
          {/* Black Spots */}
          <mesh position={[0.46, 0.7, 0.2]}>
            <boxGeometry args={[0.02, 0.4, 0.5]} />
            <meshStandardMaterial color="#212121" />
          </mesh>
          <mesh position={[-0.46, 0.8, -0.3]}>
            <boxGeometry args={[0.02, 0.5, 0.4]} />
            <meshStandardMaterial color="#212121" />
          </mesh>
          {/* Head & Snout */}
          <group ref={headRef} position={[0, 1.1, 0.9]}>
            <mesh castShadow>
              <boxGeometry args={[0.6, 0.5, 0.6]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Snout */}
            <mesh position={[0, -0.1, 0.35]}>
              <boxGeometry args={[0.45, 0.25, 0.2]} />
              <meshStandardMaterial color="#F8BBD0" />
            </mesh>
            {/* Horns */}
            {[-0.22, 0.22].map((hx, i) => (
              <mesh key={i} position={[hx, 0.3, 0]}>
                <coneGeometry args={[0.05, 0.2, 6]} />
                <meshStandardMaterial color="#FFF9C4" />
              </mesh>
            ))}
          </group>
          {/* Legs */}
          {[-0.35, 0.35].map((lx) =>
            [-0.5, 0.5].map((lz, idx) => (
              <mesh key={`${lx}_${lz}_${idx}`} castShadow position={[lx, 0.25, lz]}>
                <cylinderGeometry args={[0.09, 0.08, 0.5, 8]} />
                <meshStandardMaterial color="#212121" />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* --- SHEEP MESH --- */}
      {animal.type === 'sheep' && (
        <group scale={[0.75, 0.75, 0.75]}>
          {/* Wool Body */}
          <mesh castShadow position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.7, 12, 12]} />
            <meshStandardMaterial color="#F5F5F5" roughness={0.9} />
          </mesh>
          {/* Dark Head */}
          <group ref={headRef} position={[0, 0.8, 0.75]}>
            <mesh castShadow>
              <boxGeometry args={[0.45, 0.4, 0.5]} />
              <meshStandardMaterial color="#3E2723" roughness={0.8} />
            </mesh>
          </group>
          {/* Black Legs */}
          {[-0.25, 0.25].map((lx) =>
            [-0.35, 0.35].map((lz, idx) => (
              <mesh key={`${lx}_${lz}_${idx}`} castShadow position={[lx, 0.2, lz]}>
                <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
                <meshStandardMaterial color="#212121" />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* --- CHICKEN MESH --- */}
      {animal.type === 'chicken' && (
        <group scale={[0.5, 0.5, 0.5]}>
          {/* Body */}
          <mesh castShadow position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.35, 10, 10]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Red Comb & Beak Head */}
          <group ref={headRef} position={[0, 0.6, 0.25]}>
            <mesh castShadow>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Beak */}
            <mesh position={[0, 0, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.06, 0.12, 4]} />
              <meshStandardMaterial color="#FF9800" />
            </mesh>
            {/* Red Comb */}
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.05, 0.12, 0.15]} />
              <meshStandardMaterial color="#D32F2F" />
            </mesh>
          </group>
          {/* Yellow Legs */}
          {[-0.12, 0.12].map((lx, i) => (
            <mesh key={i} position={[lx, 0.1, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
              <meshStandardMaterial color="#FFB300" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

export const LivestockMesh: React.FC = () => {
  const animals = useGameStore((state) => state.animals);

  return (
    <group name="livestock-pen">
      {animals.map((animal) => (
        <AnimalItem key={animal.id} animal={animal} />
      ))}
    </group>
  );
};
