'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '@/store/useGameStore';
import { soundFx } from '@/utils/sound';

export const VehicleMesh: React.FC = () => {
  const tractorRef = useRef<Group>(null);
  const frontWheelsRef = useRef<Group>(null);
  const rearWheelsRef = useRef<Group>(null);
  const smokeRef = useRef<Group>(null);

  const { camera } = useThree();

  const activeVehicle = useGameStore((state) => state.activeVehicle);
  const isMounted = activeVehicle === 'tractor';
  const updateVehiclePhysics = useGameStore((state) => state.updateVehiclePhysics);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const dismountVehicle = useGameStore((state) => state.dismountVehicle);

  // Vehicle kinematic physical variables stored in refs to avoid re-renders
  const phys = useRef({
    x: -12,
    y: 0.5,
    z: 5,
    heading: 0, // angle in radians
    speed: 0,
    maxSpeed: 8,
    acceleration: 6,
    friction: 4,
    steerAngle: 0,
    maxSteer: 0.6,
  });

  // Track keyboard inputs
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Input', 'Textarea'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = true;
      if ((e.key === 'e' || e.key === 'E') && isMounted) {
        dismountVehicle();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = false;
    };

    const handleVehicleControl = (e: Event) => {
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

  useFrame((_, delta) => {
    const p = phys.current;

    if (isMounted) {
      // 1. Acceleration & Braking
      if (keys.current.forward) {
        p.speed = Math.min(p.maxSpeed, p.speed + p.acceleration * delta);
        if (soundEnabled && Math.random() < 0.2) soundFx.playEngineHum();
      } else if (keys.current.backward) {
        p.speed = Math.max(-p.maxSpeed * 0.5, p.speed - p.acceleration * delta);
      } else {
        // Friction decay
        if (p.speed > 0) p.speed = Math.max(0, p.speed - p.friction * delta);
        if (p.speed < 0) p.speed = Math.min(0, p.speed + p.friction * delta);
      }

      // 2. Steering angle
      let targetSteer = 0;
      if (keys.current.left) targetSteer = p.maxSteer;
      if (keys.current.right) targetSteer = -p.maxSteer;
      p.steerAngle += (targetSteer - p.steerAngle) * 8 * delta;

      // Turn vehicle based on speed and steer angle
      if (Math.abs(p.speed) > 0.1) {
        const turnDir = p.speed > 0 ? 1 : -1;
        p.heading += p.steerAngle * turnDir * (p.speed / p.maxSpeed) * 2.5 * delta;
      }

      // 3. Movement displacement
      const nx = p.x + Math.sin(p.heading) * p.speed * delta;
      const nz = p.z + Math.cos(p.heading) * p.speed * delta;

      // Collision boundary constraints (-26 to 26 map size, avoid barn at [-18, -5])
      const distToBarn = Math.hypot(nx - (-18), nz - (-5));
      if (Math.abs(nx) < 27 && Math.abs(nz) < 27 && distToBarn > 6) {
        p.x = nx;
        p.z = nz;
      } else {
        p.speed = -p.speed * 0.4; // Bounce back softly on collision
      }

      // 4. Smooth Camera Follow Hook
      const camOffsetDist = 12;
      const camHeight = 7;
      const targetCamX = p.x - Math.sin(p.heading) * camOffsetDist;
      const targetCamZ = p.z - Math.cos(p.heading) * camOffsetDist;
      const targetCamY = p.y + camHeight;

      camera.position.x += (targetCamX - camera.position.x) * 4 * delta;
      camera.position.y += (targetCamY - camera.position.y) * 4 * delta;
      camera.position.z += (targetCamZ - camera.position.z) * 4 * delta;
      camera.lookAt(p.x, p.y + 1.2, p.z);

      // Sync state for UI/HUD periodically
      updateVehiclePhysics([p.x, p.y, p.z], p.heading, p.speed);
    }

    // 5. Update 3D Mesh Transform
    if (tractorRef.current) {
      tractorRef.current.position.set(p.x, p.y, p.z);
      tractorRef.current.rotation.y = p.heading;
    }

    // Spin wheels according to speed
    if (rearWheelsRef.current && frontWheelsRef.current) {
      const wheelRotationDelta = (p.speed / 1.0) * delta;
      rearWheelsRef.current.children.forEach((wheel) => {
        wheel.rotation.x += wheelRotationDelta;
      });
      frontWheelsRef.current.children.forEach((wheel) => {
        wheel.rotation.x += wheelRotationDelta;
      });
      frontWheelsRef.current.rotation.y = p.steerAngle;
    }

    // Smoke exhaust particles when moving
    if (smokeRef.current && Math.abs(p.speed) > 0.5) {
      smokeRef.current.position.y = 2.2 + Math.sin(Date.now() * 0.01) * 0.1;
      smokeRef.current.scale.setScalar(1.0 + Math.sin(Date.now() * 0.005) * 0.3);
    }
  });

  return (
    <group ref={tractorRef} position={[-12, 0.5, 5]}>
      {/* Driver Seat & Mounting Prompt when unmounted */}
      {!isMounted && (
        <group position={[0, 2.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshBasicMaterial color="#FFEB3B" transparent opacity={0.8} />
          </mesh>
        </group>
      )}

      {/* Main Red Tractor Chassis Body */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[1.6, 0.8, 3.2]} />
        <meshStandardMaterial color="#D32F2F" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Engine Hood Front */}
      <mesh castShadow position={[0, 0.9, 0.8]}>
        <boxGeometry args={[1.4, 0.7, 1.4]} />
        <meshStandardMaterial color="#B71C1C" roughness={0.3} />
      </mesh>

      {/* Yellow Grille */}
      <mesh position={[0, 0.85, 1.51]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshStandardMaterial color="#FBC02D" />
      </mesh>

      {/* Driver Cabin (Glass & Frame) */}
      <mesh castShadow position={[0, 1.6, -0.5]}>
        <boxGeometry args={[1.5, 1.2, 1.5]} />
        <meshStandardMaterial color="#90A4AE" transparent opacity={0.6} roughness={0.1} />
      </mesh>

      {/* Exhaust Pipe */}
      <group position={[0.6, 1.4, 0.9]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="#212121" metalness={0.8} />
        </mesh>
        {/* Exhaust Smoke Puff */}
        <group ref={smokeRef} position={[0, 0.7, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 6, 6]} />
            <meshBasicMaterial color="#B0BEC5" transparent opacity={0.4} />
          </mesh>
        </group>
      </group>

      {/* Headlights */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 1.52]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#FFF59D" emissive="#FFF59D" emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Front Wheels Assembly (Smaller) */}
      <group ref={frontWheelsRef} position={[0, 0, 1.1]}>
        {[-0.9, 0.9].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.35, 16]} />
            <meshStandardMaterial color="#212121" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Rear Wheels Assembly (Big Heavy Tread Tires) */}
      <group ref={rearWheelsRef} position={[0, 0.2, -0.8]}>
        {[-0.95, 0.95].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.7, 0.7, 0.45, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
