'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { CropMesh } from './CropMesh';
import { SprinklerMesh } from './SprinklerMesh';
import { SoilPlot } from '@/types/game';

const PlotTile: React.FC<{ plot: SoilPlot }> = ({ plot }) => {
  const [hovered, setHovered] = useState(false);
  const interactPlot = useGameStore((state) => state.interactPlot);
  const selectedTool = useGameStore((state) => state.selectedTool);

  const getSoilColor = () => {
    switch (plot.status) {
      case 'moist':
        return '#3E2723'; // Dark moist earth
      case 'tilled':
        return '#6D4C41'; // Tilled dry brown earth
      case 'grass':
      default:
        return '#66BB6A'; // Unplowed grass
    }
  };

  const getRoughness = () => {
    if (plot.status === 'moist') return 0.2; // Wet sheen
    if (plot.status === 'tilled') return 0.95; // Rough dirt
    return 0.9;
  };

  // Border hover ring color based on selected tool
  const getHoverColor = () => {
    if (selectedTool === 'till') return '#8D6E63';
    if (selectedTool.startsWith('plant')) return '#4CAF50';
    if (selectedTool === 'water') return '#2980B9';
    if (selectedTool === 'harvest') return '#FFD700';
    if (selectedTool === 'sprinkler') return '#00BCD4';
    return '#FFFFFF';
  };

  return (
    <group position={[plot.x * 1.1, 0, plot.z * 1.1]}>
      {/* Interactive Tile Mesh */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          interactPlot(plot.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1.0, 0.1, 1.0]} />
        <meshStandardMaterial
          color={getSoilColor()}
          roughness={getRoughness()}
          metalness={plot.status === 'moist' ? 0.3 : 0.05}
        />
      </mesh>

      {/* Tilled Ridges / Furrows */}
      {plot.status !== 'grass' && (
        <group position={[0, 0.06, 0]}>
          {[-0.3, 0, 0.3].map((zOffset, idx) => (
            <mesh key={idx} position={[0, 0, zOffset]}>
              <boxGeometry args={[0.95, 0.04, 0.15]} />
              <meshStandardMaterial
                color={plot.status === 'moist' ? '#271B17' : '#5D4037'}
                roughness={getRoughness()}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Sprinkler Node */}
      {plot.hasSprinkler && <SprinklerMesh />}

      {/* Crop Mesh */}
      {plot.crop && (
        <CropMesh
          type={plot.crop.type}
          stage={plot.crop.stage}
          progress={plot.crop.progress}
        />
      )}

      {/* Hover Selection Ring */}
      {hovered && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.08, 1.08]} />
          <meshBasicMaterial color={getHoverColor()} wireframe transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

export const SoilGrid: React.FC = () => {
  const plots = useGameStore((state) => state.plots);

  return (
    <group name="soil-grid" position={[0, 0, 0]}>
      {plots.map((plot) => (
        <PlotTile key={plot.id} plot={plot} />
      ))}
    </group>
  );
};
