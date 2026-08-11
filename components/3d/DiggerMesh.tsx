'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '@/store/useGameStore';
import { soundFx } from '@/utils/sound';

export const DiggerMesh: React.FC = () => {
  const diggerRef = useRef<Group>(null);
  const armRef = useRef<Group>(null);
  const tracksRef = useRef<Group>(null);

  const { camera } = useThree();

  const activeVehicle = useGameStore((state) => state.activeVehicle);
  const isMounted = activeVehicle === 'digger';
  const updateDiggerPhysics = useGameStore((state) => state.updateDiggerPhysics);
  const till3x3Area = useGameStore((state) => state.till3x3Area);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const dismountVehicle = useGameStore((state) => state.dismountVehicle);

  const phys = useRef({
    x: -8,
    y: 0.5,
    z: 8,
    heading: Math.PI / 4,
    speed: 0,
    maxSpeed: 6,
    acceleration: 5,
    friction: 3.5,
    steerAngle: 0,
    maxSteer: 0.5,
  });

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMounted) return;
      if (['Input', 'Textarea'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'e' || e.key === 'E') dismountVehicle();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = false;
    };

    const handleVehicleControl = (e: Event) => {
      if (!isMounted) return;
      const customEvent = e as CustomEvent<{ action: 'forward' | 'backward' | 'left' | 'right'; active: boolean }>;
      if (customEvent.detail && keys.current[customEvent.detail.action] !== undefined) {
        keys.current[customEvent.detail.action] = customEvent.detail.active;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('vehicle_control', handleVehicleControl);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('vehicle_control', handleVehicleControl);
    };
  }, [isMounted, dismountVehicle]);

  useFrame((state, delta) => {
    const p = phys.current;

    if (isMounted) {
      if (keys.current.forward) {
        p.speed = Math.min(p.maxSpeed, p.speed + p.acceleration * delta);
        if (soundEnabled && Math.random() < 0.2) soundFx.playEngineHum();
      } else if (keys.current.backward) {
        p.speed = Math.max(-p.maxSpeed * 0.5, p.speed - p.acceleration * delta);
      } else {
        if (p.speed > 0) p.speed = Math.max(0, p.speed - p.friction * delta);
        if (p.speed < 0) p.speed = Math.min(0, p.speed + p.friction * delta);
      }

      let targetSteer = 0;
      if (keys.current.left) targetSteer = p.maxSteer;
      if (keys.current.right) targetSteer = -p.maxSteer;
      p.steerAngle += (targetSteer - p.steerAngle) * 8 * delta;

      if (Math.abs(p.speed) > 0.1) {
        const turnDir = p.speed > 0 ? 1 : -1;
        p.heading += p.steerAngle * turnDir * (p.speed / p.maxSpeed) * 2.2 * delta;
      }

      const nx = p.x + Math.sin(p.heading) * p.speed * delta;
      const nz = p.z + Math.cos(p.heading) * p.speed * delta;

      if (Math.abs(nx) < 27 && Math.abs(nz) < 27) {
        p.x = nx;
        p.z = nz;
      } else {
        p.speed = -p.speed * 0.4;
      }

      // Digger Excavator Action: Auto-tills 3x3 soil area as it drives over soil plots!
      const gridX = Math.round(p.x / 1.1);
      const gridZ = Math.round(p.z / 1.1);
      if (Math.abs(gridX) <= 5 && Math.abs(gridZ) <= 5 && Math.abs(p.speed) > 0.5) {
        till3x3Area(gridX, gridZ);
      }

      // Smooth Camera Follow Hook for Digger
      const camOffsetDist = 13;
      const camHeight = 8;
      const targetCamX = p.x - Math.sin(p.heading) * camOffsetDist;
      const targetCamZ = p.z - Math.cos(p.heading) * camOffsetDist;
      const targetCamY = p.y + camHeight;

      camera.position.x += (targetCamX - camera.position.x) * 4 * delta;
      camera.position.y += (targetCamY - camera.position.y) * 4 * delta;
      camera.position.z += (targetCamZ - camera.position.z) * 4 * delta;
      camera.lookAt(p.x, p.y + 1.4, p.z);

      updateDiggerPhysics([p.x, p.y, p.z], p.heading, p.speed);
    }

    // Update 3D Mesh Transform
    if (diggerRef.current) {
      diggerRef.current.position.set(p.x, p.y, p.z);
      diggerRef.current.rotation.y = p.heading;
    }

    // Bucket hydraulic arm animation when moving
    if (armRef.current) {
      armRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 4) * 0.1;
    }
  });

  return (
    <group ref={diggerRef} position={[-8, 0.5, 8]}>
      {/* Mounting prompt when unmounted */}
      {!isMounted && (
        <group position={[0, 2.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#FF9800" transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {/* --- DIGGER / EXCAVATOR 3D MODEL --- */}
      {/* Main Yellow Cabin & Chassis Body */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[1.8, 1.0, 2.8]} />
        <meshStandardMaterial color="#FBC02D" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Glass Cabin */}
      <mesh castShadow position={[0, 1.8, -0.3]}>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial color="#90A4AE" transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Heavy Duty Black Tracks (Left & Right) */}
      <group ref={tracksRef}>
        {[-1.05, 1.05].map((tx, i) => (
          <mesh key={i} castShadow position={[tx, 0.35, 0]}>
            <boxGeometry args={[0.4, 0.7, 3.2]} />
            <meshStandardMaterial color="#212121" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Hydraulic Boom Arm & Excavator Bucket */}
      <group ref={armRef} position={[0, 1.0, 1.4]}>
        {/* Main Boom Arm */}
        <mesh castShadow position={[0, 0.6, 0.8]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 1.8]} />
          <meshStandardMaterial color="#F57F17" metalness={0.5} />
        </mesh>

        {/* Dipper Arm */}
        <mesh castShadow position={[0, 0.2, 2.0]} rotation={[-0.6, 0, 0]}>
          <boxGeometry args={[0.35, 0.35, 1.4]} />
          <meshStandardMaterial color="#37474F" metalness={0.7} />
        </mesh>

        {/* Front Metal Scoop Bucket */}
        <mesh castShadow position={[0, -0.4, 2.5]} rotation={[0.8, 0, 0]}>
          <boxGeometry args={[1.2, 0.6, 0.8]} />
          <meshStandardMaterial color="#263238" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Headlights */}
      {[-0.6, 0.6].map((hx, i) => (
        <mesh key={i} position={[hx, 0.9, 1.42]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#FFF59D" emissive="#FFF59D" emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
};
