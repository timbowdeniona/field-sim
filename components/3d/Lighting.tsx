'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DirectionalLight, Vector3 } from 'three';
import { useGameStore } from '@/store/useGameStore';

export const Lighting: React.FC = () => {
  const lightRef = useRef<DirectionalLight>(null);
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const weather = useGameStore((state) => state.weather);

  useFrame(() => {
    if (!lightRef.current) return;

    // Convert timeOfDay (0..24) into angle (0..2PI)
    // 6.0 AM = sunrise, 12.0 PM = noon, 18.0 PM = sunset, 24.0 = midnight
    const hourAngle = ((timeOfDay - 6) / 24) * Math.PI * 2;
    
    const sunRadius = 40;
    const sunX = Math.cos(hourAngle) * sunRadius;
    const sunY = Math.sin(hourAngle) * sunRadius;
    const sunZ = Math.sin(hourAngle * 0.5) * 15;

    lightRef.current.position.set(sunX, Math.max(-5, sunY), sunZ);
    lightRef.current.target.position.set(0, 0, 0);
    lightRef.current.target.updateMatrixWorld();

    // Light intensity & color transitions based on sun angle
    const isDay = sunY > 0;
    let intensity = isDay ? Math.min(1.2, (sunY / 10) * 1.2) : 0.15;
    if (weather === 'rainy' || weather === 'cloudy') {
      intensity *= 0.6;
    }

    lightRef.current.intensity = intensity;

    // Color shifting
    if (sunY < 4 && sunY > -2) {
      // Golden hour / sunrise / sunset
      lightRef.current.color.setHSL(0.08, 0.9, 0.65);
    } else if (isDay) {
      // Midday sun
      lightRef.current.color.setHSL(0.12, 0.4, 0.95);
    } else {
      // Moonlight
      lightRef.current.color.setHSL(0.65, 0.5, 0.4);
    }
  });

  // Calculate ambient sky light color based on timeOfDay
  const getAmbientColor = () => {
    if (timeOfDay >= 6 && timeOfDay <= 18) {
      return '#FFF8E7'; // Warm sunlight ambient
    }
    return '#1A2B4C'; // Cool night ambient
  };

  return (
    <>
      <ambientLight intensity={weather === 'rainy' ? 0.3 : (timeOfDay >= 6 && timeOfDay <= 18 ? 0.55 : 0.25)} color={getAmbientColor()} />
      <directionalLight
        ref={lightRef}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />
    </>
  );
};
