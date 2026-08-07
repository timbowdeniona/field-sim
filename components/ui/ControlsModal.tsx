'use client';

import React from 'react';
import { X, HelpCircle, Truck, MousePointer, Sprout, Heart } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export const ControlsModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);

  if (activeModal !== 'controls') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">How to Play & Controls</h2>
              <p className="text-xs text-slate-400">Master your 3D farm simulation</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-slate-300 text-sm">
          {/* Section 1: Mouse & Camera */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <MousePointer className="w-4 h-4" /> 3D View & Camera
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li><strong>Left Click + Drag:</strong> Rotate Orbit Camera angle.</li>
              <li><strong>Right Click + Drag:</strong> Pan camera across the farm.</li>
              <li><strong>Scroll Wheel:</strong> Zoom in / zoom out.</li>
              <li><strong>Click Soil Plots:</strong> Perform active tool action (Till, Plant, Water, Harvest).</li>
            </ul>
          </div>

          {/* Section 2: Tractor Driving */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Truck className="w-4 h-4" /> Tractor Driving
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li><strong>E Key:</strong> Mount or Dismount Tractor.</li>
              <li><strong>W / Up Arrow:</strong> Drive Forward & Accelerate.</li>
              <li><strong>S / Down Arrow:</strong> Drive Reverse / Brake.</li>
              <li><strong>A / D or Left / Right Arrows:</strong> Steer wheels left / right.</li>
            </ul>
          </div>

          {/* Section 3: Farming & Irrigation */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sprout className="w-4 h-4" /> Farming Cycle
            </div>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
              <li><strong>Till (Hotkey 2):</strong> Convert grass tiles into fertile tilled soil.</li>
              <li><strong>Plant (Hotkeys 3-5):</strong> Plant Wheat, Corn, Carrot, or Pumpkin seeds.</li>
              <li><strong>Water (Hotkey 6):</strong> Water plots to double growth speed (Rain or Sprinklers auto-water).</li>
              <li><strong>Harvest (Hotkey 7):</strong> Harvest mature crops into inventory.</li>
            </ol>
          </div>

          {/* Section 4: Livestock */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <Heart className="w-4 h-4" /> Livestock Care
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              <li>Click on Cows, Sheep, or Chickens when hungry to feed them animal feed.</li>
              <li>When the yellow glowing product badge appears over an animal, click it to collect Milk, Wool, or Eggs!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
