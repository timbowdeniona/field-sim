'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useGameStore } from '@/store/useGameStore';

export const PlayerCharacterMesh: React.FC = () => {
  const characterRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);

  const { camera } = useThree();

  const activeVehicle = useGameStore((state) => state.activeVehicle);
  const updateCharacterTransform = useGameStore((state) => state.updateCharacterTransform);

  const charPhys = useRef({
    x: 0,
    y: 0.5,
    z: 3,
    heading: 0,
    speed: 5.5,
    isWalking: false,
  });

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
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = false;
    };

    const handleCharacterControl = (e: Event) => {
      const customEvent = e as CustomEvent<{ action: 'forward' | 'backward' | 'left' | 'right'; active: boolean }>;
      if (customEvent.detail && keys.current[customEvent.detail.action] !== undefined) {
        keys.current[customEvent.detail.action] = customEvent.detail.active;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('character_control', handleCharacterControl);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('character_control', handleCharacterControl);
    };
  }, []);

  useFrame((state, delta) => {
    const c = charPhys.current;

    // Only update movement if Roger is not inside a vehicle
    if (activeVehicle === null) {
      let moveX = 0;
      let moveZ = 0;

      if (keys.current.forward) moveZ -= 1;
      if (keys.current.backward) moveZ += 1;
      if (keys.current.left) moveX -= 1;
      if (keys.current.right) moveX += 1;

      const isMoving = moveX !== 0 || moveZ !== 0;
      c.isWalking = isMoving;

      if (isMoving) {
        // Calculate direction angle
        const targetHeading = Math.atan2(moveX, moveZ);
        c.heading += (targetHeading - c.heading) * 10 * delta;

        const nx = c.x + Math.sin(c.heading) * c.speed * delta;
        const nz = c.z + Math.cos(c.heading) * c.speed * delta;

        // Boundary checks (-27 to 27)
        if (Math.abs(nx) < 27 && Math.abs(nz) < 27) {
          c.x = nx;
          c.z = nz;
        }
      }

      // Smooth Camera Follow Hook for Roger
      const camOffsetDist = 10;
      const camHeight = 6;
      const targetCamX = c.x - Math.sin(c.heading) * camOffsetDist;
      const targetCamZ = c.z - Math.cos(c.heading) * camOffsetDist;
      const targetCamY = c.y + camHeight;

      camera.position.x += (targetCamX - camera.position.x) * 5 * delta;
      camera.position.y += (targetCamY - camera.position.y) * 5 * delta;
      camera.position.z += (targetCamZ - camera.position.z) * 5 * delta;
      camera.lookAt(c.x, c.y + 1.0, c.z);

      updateCharacterTransform([c.x, c.y, c.z], c.heading, c.isWalking);
    }

    // Update 3D Mesh Transform
    if (characterRef.current) {
      characterRef.current.position.set(c.x, c.y, c.z);
      characterRef.current.rotation.y = c.heading;
      characterRef.current.visible = activeVehicle === null; // Hide when inside vehicle
    }

    // Walking animation (swing legs & arms)
    if (leftLegRef.current && rightLegRef.current && leftArmRef.current && rightArmRef.current) {
      if (c.isWalking) {
        const time = state.clock.getElapsedTime() * 10;
        leftLegRef.current.rotation.x = Math.sin(time) * 0.6;
        rightLegRef.current.rotation.x = -Math.sin(time) * 0.6;
        leftArmRef.current.rotation.x = -Math.sin(time) * 0.6;
        rightArmRef.current.rotation.x = Math.sin(time) * 0.6;
      } else {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={characterRef} position={[0, 0.5, 3]}>
      {/* Nameplate Tag above Roger */}
      <group position={[0, 2.1, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#4CAF50" />
        </mesh>
      </group>

      {/* --- ROGER THE FARMER 3D MODEL --- */}
      {/* Straw Farmer Hat */}
      <group position={[0, 1.5, 0]}>
        {/* Hat Brim */}
        <mesh castShadow position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.55, 16]} />
          <meshStandardMaterial color="#D7CCC8" roughness={0.8} />
        </mesh>
        {/* Hat Crown */}
        <mesh castShadow position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.3, 12]} />
          <meshStandardMaterial color="#C8E6C9" roughness={0.8} />
        </mesh>
      </group>

      {/* Head & Face */}
      <mesh castShadow position={[0, 1.35, 0]}>
        <boxGeometry args={[0.38, 0.35, 0.35]} />
        <meshStandardMaterial color="#FFCC80" roughness={0.5} />
      </mesh>
      {/* Eyes */}
      {[-0.1, 0.1].map((ex, i) => (
        <mesh key={i} position={[ex, 1.38, 0.18]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#212121" />
        </mesh>
      ))}

      {/* Flannel Shirt & Overalls Torso */}
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.48, 0.65, 0.35]} />
        <meshStandardMaterial color="#1976D2" roughness={0.6} /> {/* Denim Blue Overalls */}
      </mesh>
      {/* Red Flannel Plaid Chest Accent */}
      <mesh position={[0, 0.95, 0.18]}>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshStandardMaterial color="#D32F2F" />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.32, 1.05, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color="#D32F2F" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color="#FFCC80" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.32, 1.05, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.14, 0.5, 0.14]} />
          <meshStandardMaterial color="#D32F2F" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color="#FFCC80" />
        </mesh>
      </group>

      {/* Left Leg & Boot */}
      <group ref={leftLegRef} position={[-0.14, 0.5, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.18, 0.5, 0.18]} />
          <meshStandardMaterial color="#1565C0" />
        </mesh>
        {/* Boot */}
        <mesh castShadow position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.2, 0.12, 0.28]} />
          <meshStandardMaterial color="#4E342E" />
        </mesh>
      </group>

      {/* Right Leg & Boot */}
      <group ref={rightLegRef} position={[0.14, 0.5, 0]}>
        <mesh castShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.18, 0.5, 0.18]} />
          <meshStandardMaterial color="#1565C0" />
        </mesh>
        {/* Boot */}
        <mesh castShadow position={[0, -0.52, 0.04]}>
          <boxGeometry args={[0.2, 0.12, 0.28]} />
          <meshStandardMaterial color="#4E342E" />
        </mesh>
      </group>
    </group>
  );
};
