'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { useGameStore } from '@/store/useGameStore';

export const Terrain: React.FC = () => {
  const windmillBladesRef = useRef<Group>(null);
  const waterRef = useRef<Mesh>(null);
  const weather = useGameStore((state) => state.weather);

  useFrame((_, delta) => {
    // Spin windmill blades
    if (windmillBladesRef.current) {
      windmillBladesRef.current.rotation.z += delta * (weather === 'rainy' ? 2.5 : 1.2);
    }
    // Water subtle wave motion
    if (waterRef.current) {
      waterRef.current.position.y = -0.15 + Math.sin(Date.now() * 0.002) * 0.03;
    }
  });

  return (
    <group name="farm-terrain">
      {/* 1. Main Base Terrain Plane */}
      <mesh receiveShadow position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#558B2F" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Dirt path surround for soil plots (-6 to 6) */}
      <mesh receiveShadow position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 13]} />
        <meshStandardMaterial color="#8D6E63" roughness={1.0} />
      </mesh>

      {/* 2. Animated River Stream (East side) */}
      <mesh ref={waterRef} position={[20, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 60]} />
        <meshStandardMaterial
          color={weather === 'rainy' ? '#1A5276' : '#2980B9'}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Wooden River Footbridge */}
      <group position={[20, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
          <boxGeometry args={[7, 0.2, 3]} />
          <meshStandardMaterial color="#5D4037" roughness={0.8} />
        </mesh>
        {[-1.3, 1.3].map((zPos, idx) => (
          <mesh key={idx} castShadow position={[0, 0.6, zPos]}>
            <boxGeometry args={[7, 0.15, 0.15]} />
            <meshStandardMaterial color="#3E2723" />
          </mesh>
        ))}
      </group>

      {/* 3. Low-Poly Barn House (West side: X = -18, Z = -5) */}
      <group position={[-18, 0, -5]}>
        {/* Main Barn Body */}
        <mesh castShadow receiveShadow position={[0, 2.5, 0]}>
          <boxGeometry args={[8, 5, 10]} />
          <meshStandardMaterial color="#B71C1C" roughness={0.7} />
        </mesh>
        {/* Barn Roof */}
        <mesh castShadow position={[0, 5.8, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0, 6.2, 10.2, 4]} />
          <meshStandardMaterial color="#3E2723" roughness={0.5} />
        </mesh>
        {/* Barn Doors */}
        <mesh position={[4.01, 1.8, 0]}>
          <boxGeometry args={[0.1, 3.5, 3.5]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        {/* Silo Tower */}
        <group position={[-5, 0, -3]}>
          <mesh castShadow position={[0, 4, 0]}>
            <cylinderGeometry args={[2, 2, 8, 16]} />
            <meshStandardMaterial color="#90A4AE" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 8.8, 0]}>
            <sphereGeometry args={[2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#37474F" metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* 4. Windmill (North-West: X = -16, Z = 15) */}
      <group position={[-16, 0, 15]}>
        {/* Tower */}
        <mesh castShadow position={[0, 4.5, 0]}>
          <cylinderGeometry args={[1.2, 2.2, 9, 8]} />
          <meshStandardMaterial color="#D7CCC8" roughness={0.9} />
        </mesh>
        {/* Roof Cap */}
        <mesh position={[0, 9.4, 0]}>
          <coneGeometry args={[1.5, 1.5, 8]} />
          <meshStandardMaterial color="#49281A" />
        </mesh>
        {/* Spinning Blades Assembly */}
        <group position={[0, 8.5, 1.3]}>
          <group ref={windmillBladesRef}>
            {[0, 90, 180, 270].map((deg, i) => (
              <group key={i} rotation={[0, 0, (deg * Math.PI) / 180]}>
                <mesh position={[0, 2, 0]}>
                  <boxGeometry args={[0.4, 3.8, 0.05]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>

      {/* 5. Livestock Fence Enclosure (South-East: X = 13, Z = -9) */}
      <group position={[13, 0, -9]}>
        {/* Dirt Pen Ground */}
        <mesh receiveShadow position={[0, -0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 14]} />
          <meshStandardMaterial color="#6D4C41" roughness={0.95} />
        </mesh>

        {/* Fence Posts & Rails */}
        {[-6, 6].map((xPos) => (
          <group key={`x_${xPos}`}>
            <mesh castShadow position={[xPos, 0.6, 0]}>
              <boxGeometry args={[0.2, 1.2, 14]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
          </group>
        ))}
        {[-7, 7].map((zPos) => (
          <group key={`z_${zPos}`}>
            <mesh castShadow position={[0, 0.6, zPos]}>
              <boxGeometry args={[12, 1.2, 0.2]} />
              <meshStandardMaterial color="#8D6E63" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. Decorative Pine Trees & Oak Trees Around Perimeter */}
      {[
        [-24, -20], [-22, 22], [8, 22], [-8, -22], [24, 22], [24, -22],
        [-26, 0], [0, 26], [22, -18], [-22, -10]
      ].map(([x, z], index) => (
        <group key={`tree_${index}`} position={[x, 0, z]}>
          {/* Trunk */}
          <mesh castShadow position={[0, 1, 0]}>
            <cylinderGeometry args={[0.3, 0.45, 2, 6]} />
            <meshStandardMaterial color="#4E342E" roughness={0.9} />
          </mesh>
          {/* Leaves (Layered Cones) */}
          <mesh castShadow position={[0, 2.5, 0]}>
            <coneGeometry args={[1.8, 2.5, 6]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#2E7D32" : "#1B5E20"} roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 3.8, 0]}>
            <coneGeometry args={[1.3, 2.0, 6]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#388E3C" : "#2E7D32"} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
