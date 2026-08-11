'use client';

import React, { useState } from 'react';
import { X, BookOpen, Truck, Sprout, Heart, ShoppingBag, User, ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import Link from 'next/link';

export const InstructionsPageModal: React.FC<{ isStandalonePage?: boolean }> = ({ isStandalonePage = false }) => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const [activeTab, setActiveTab] = useState<'roger' | 'vehicles' | 'farming' | 'livestock' | 'economy'>('roger');

  if (!isStandalonePage && activeModal !== 'instructions') return null;

  const content = (
    <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-500 to-emerald-500 text-slate-950 font-extrabold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Roger's Farm Guide & Instructions</h2>
            <p className="text-xs text-slate-400">Master farming, driving the Tractor & Digger, and livestock care</p>
          </div>
        </div>

        {isStandalonePage ? (
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Farm
          </Link>
        ) : (
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roger')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'roger'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" /> Roger the Farmer
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'vehicles'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" /> Tractor & Digger
        </button>
        <button
          onClick={() => setActiveTab('farming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'farming'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Sprout className="w-4 h-4" /> Crop Farming
        </button>
        <button
          onClick={() => setActiveTab('livestock')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'livestock'
              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" /> Livestock
        </button>
        <button
          onClick={() => setActiveTab('economy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'economy'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Marketplace
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-300 text-sm">
        {/* ROGER THE FARMER */}
        {activeTab === 'roger' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <h3 className="text-base font-bold text-blue-400 mb-2 flex items-center gap-2">
                <User className="w-5 h-5" /> Controlling Roger the Farmer
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Roger is the hard-working owner of Roger's Field! When unmounted, you control Roger directly in third-person mode.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs">
                <li><strong>Walk / Run:</strong> Use <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">W</kbd> <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">S</kbd> <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">D</kbd> or Arrow keys (or on-screen mobile D-Pad).</li>
                <li><strong>Camera Follow:</strong> The camera automatically rotates and follows behind Roger as he walks around the farm.</li>
                <li><strong>Mounting Vehicles:</strong> Walk up to the red Tractor or yellow Digger and press <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">E</kbd> or tap the vehicle button to climb inside!</li>
              </ul>
            </div>
          </div>
        )}

        {/* VEHICLES */}
        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-amber-500/30">
              <h3 className="text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Red Tractor
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                Fast utility farm truck. Ideal for traveling quickly across the farm, checking on crops, and hauling harvest produce.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Drive:</strong> WASD or Arrow keys.</li>
                <li><strong>Dismount:</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">E</kbd> or tap Dismount.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-yellow-500/30">
              <h3 className="text-base font-bold text-yellow-400 mb-2 flex items-center gap-2">
                🚜 Yellow Digger / Excavator
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                Heavy duty excavating vehicle equipped with a front metal scoop bucket and heavy rubber tracks.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>3x3 Excavation:</strong> Driving over unplowed grass plots automatically tills a 3x3 surrounding soil area!</li>
                <li><strong>Drive:</strong> WASD or Arrow keys / Touch D-Pad.</li>
              </ul>
            </div>
          </div>
        )}

        {/* CROP FARMING */}
        {activeTab === 'farming' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-500/30">
              <h3 className="text-base font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <Sprout className="w-5 h-5" /> Farming Progression Cycle
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                <li><strong>Till Soil (Hotkey 2):</strong> Click unplowed grass plots to turn them into fertile soil furrows.</li>
                <li><strong>Plant Seeds (Hotkeys 3-5):</strong> Choose Wheat, Corn, Carrot, or Pumpkin seeds from your inventory.</li>
                <li><strong>Watering (Hotkey 6):</strong> Water plots manually, place automated Sprinklers, or wait for rain to double crop growth speed!</li>
                <li><strong>Harvesting (Hotkey 7):</strong> Click fully mature crops (indicated by floating golden rings) to collect harvested produce into your silo storage.</li>
              </ol>
            </div>
          </div>
        )}

        {/* LIVESTOCK */}
        {activeTab === 'livestock' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-teal-500/30">
              <h3 className="text-base font-bold text-teal-400 mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5" /> Animal Pasture Management
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Raise Cows, Sheep, and Chickens in the southern fenced pen. Well-fed animals generate high-value produce over time!
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li><strong>Feeding:</strong> Click on hungry animals (red indicator) when holding Animal Feed bags.</li>
                <li><strong>Yield Collection:</strong> When a glowing yellow badge appears over an animal, click to collect Milk, Wool, or Eggs into storage.</li>
              </ul>
            </div>
          </div>
        )}

        {/* MARKETPLACE ECONOMY */}
        {activeTab === 'economy' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-yellow-500/30">
              <h3 className="text-base font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Marketplace & Economy
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Click the <strong>Market</strong> button in the top HUD to open the marketplace modal.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li><strong>Buying Seeds:</strong> Purchase Wheat ($5), Corn ($12), Carrot ($15), and Pumpkin ($25) seeds.</li>
                <li><strong>Livestock & Equipment:</strong> Buy Cows ($120), Sheep ($90), Chickens ($40), Animal Feed ($8), and Sprinklers ($75).</li>
                <li><strong>Selling Harvest:</strong> Use the 1-Click "Sell All Harvest" button to turn your crops, milk, wool, and eggs into cash!</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isStandalonePage) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        {content}
      </main>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      {content}
    </div>
  );
};
