'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { FarmScene } from './FarmScene';

export default function FarmCanvasContainer() {
  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [0, 15, 20], fov: 50, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0F172A']} />
        <FarmScene />
      </Canvas>
    </div>
  );
}
