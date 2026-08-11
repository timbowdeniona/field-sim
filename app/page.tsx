'use client';

import dynamic from 'next/dynamic';
import { HUDOverlay } from '@/components/ui/HUDOverlay';
import { ShopModal } from '@/components/ui/ShopModal';
import { InventoryModal } from '@/components/ui/InventoryModal';
import { ControlsModal } from '@/components/ui/ControlsModal';
import { InstructionsPageModal } from '@/components/ui/InstructionsPageModal';

// Dynamically import 3D Canvas component with ssr: false
const FarmCanvasContainer = dynamic(
  () => import('@/components/3d/FarmCanvasContainer'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wider text-emerald-400">Loading 3D Farm Environment...</p>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* 3D R3F Viewport Canvas */}
      <FarmCanvasContainer />

      {/* 2D UI Layer Overlays */}
      <HUDOverlay />
      <ShopModal />
      <InventoryModal />
      <ControlsModal />
      <InstructionsPageModal />
    </main>
  );
}
