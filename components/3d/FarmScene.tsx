'use client';

import React from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Html } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import { Lighting } from './Lighting';
import { Terrain } from './Terrain';
import { SoilGrid } from './SoilGrid';
import { VehicleMesh } from './VehicleMesh';
import { LivestockMesh } from './LivestockMesh';

export const FarmScene: React.FC = () => {
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const cameraMode = useGameStore((state) => state.cameraMode);
  const isVehicleMounted = useGameStore((state) => state.isVehicleMounted);

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

      {/* Floating 3D Farm Title Sign */}
      <group position={[0, 6.5, -6.5]}>
        <Html center distanceFactor={22} zIndexRange={[100, 0]}>
          <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-slate-900/90 border-2 border-amber-400/80 text-white shadow-2xl backdrop-blur-md pointer-events-none transform hover:scale-105 transition-all">
            <span className="text-xl">🌾</span>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-400 whitespace-nowrap drop-shadow-md">
              Roger's Field
            </span>
            <span className="text-xl">🚜</span>
          </div>
        </Html>
      </group>

      {/* Scene Content */}
      <Terrain />
      <SoilGrid />
      <VehicleMesh />
      <LivestockMesh />

      {/* Camera Controls when NOT driving vehicle */}
      {!isVehicleMounted && (
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
