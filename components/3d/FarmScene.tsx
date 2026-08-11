'use client';

import React from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Html } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import { Lighting } from './Lighting';
import { Terrain } from './Terrain';
import { SoilGrid } from './SoilGrid';
import { VehicleMesh } from './VehicleMesh';
import { DiggerMesh } from './DiggerMesh';
import { PlayerCharacterMesh } from './PlayerCharacterMesh';
import { LivestockMesh } from './LivestockMesh';

export const FarmScene: React.FC = () => {
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const activeVehicle = useGameStore((state) => state.activeVehicle);

  // Main game tick loop inside R3F canvas animation frame
  useFrame((_, delta) => {
    useGameStore.getState().tick(delta);
  });

  // Calculate sun elevation for sky shader
  const sunElevation = Math.sin(((timeOfDay - 6) / 24) * Math.PI * 2) * 50;
  const sunAzimuth = Math.cos(((timeOfDay - 6) / 24) * Math.PI * 2) * 180;

  return (
    <>
      {/* Sky Atmosphere */}
      <Sky
        distance={450000}
        sunPosition={[
          Math.cos(((timeOfDay - 6) / 24) * Math.PI * 2) * 100,
          sunElevation,
          sunAzimuth,
        ]}
        inclination={0.6}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={sunElevation > 0 ? 0.5 : 3.0}
        turbidity={10}
      />

      {/* Dynamic Directional Sunlight/Moonlight & Shadows */}
      <Lighting />

      {/* Scene Content */}
      <Terrain />
      <SoilGrid />
      <PlayerCharacterMesh />
      <VehicleMesh />
      <DiggerMesh />
      <LivestockMesh />

      {/* Camera Controls when NOT driving a vehicle */}
      {activeVehicle === null && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below ground plane
          minDistance={5}
          maxDistance={35}
          target={[0, 0, 0]}
        />
      )}
    </>
  );
};
