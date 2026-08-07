'use client';

import React from 'react';
import { X, Package, Sprout, ShoppingBag, Layers } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { InventoryItemKey } from '@/types/game';

export const InventoryModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const inventory = useGameStore((state) => state.inventory);
  const sellItem = useGameStore((state) => state.sellItem);

  if (activeModal !== 'inventory') return null;

  const itemDetails: Record<InventoryItemKey, { name: string; category: 'seed' | 'produce' | 'equipment'; sellPrice: number; icon: string }> = {
    wheat_seed: { name: 'Wheat Seeds', category: 'seed', sellPrice: 3, icon: '🌾' },
    corn_seed: { name: 'Corn Seeds', category: 'seed', sellPrice: 7, icon: '🌽' },
    carrot_seed: { name: 'Carrot Seeds', category: 'seed', sellPrice: 9, icon: '🥕' },
    pumpkin_seed: { name: 'Pumpkin Seeds', category: 'seed', sellPrice: 15, icon: '🎃' },
    wheat: { name: 'Harvested Wheat', category: 'produce', sellPrice: 18, icon: '🌾' },
    corn: { name: 'Harvested Corn', category: 'produce', sellPrice: 25, icon: '🌽' },
    carrot: { name: 'Fresh Carrots', category: 'produce', sellPrice: 30, icon: '🥕' },
    pumpkin: { name: 'Giant Pumpkin', category: 'produce', sellPrice: 45, icon: '🎃' },
    milk: { name: 'Fresh Milk Bucket', category: 'produce', sellPrice: 35, icon: '🥛' },
    wool: { name: 'Soft Wool Bundle', category: 'produce', sellPrice: 50, icon: '🧶' },
    egg: { name: 'Fresh Farm Egg', category: 'produce', sellPrice: 20, icon: '🥚' },
    animal_feed: { name: 'Animal Feed Bag', category: 'equipment', sellPrice: 5, icon: '🌾' },
    sprinkler: { name: 'Water Sprinkler', category: 'equipment', sellPrice: 45, icon: '💦' },
  };

  const keys = Object.keys(itemDetails) as InventoryItemKey[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Barn & Silo Storage</h2>
              <p className="text-xs text-slate-400">Current inventory balances and stock levels</p>
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
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {keys.map((key) => {
            const item = itemDetails[key];
            const count = inventory[key] || 0;

            return (
              <div
                key={key}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                  count > 0
                    ? 'bg-slate-800/70 border-slate-700/80 text-white'
                    : 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    count > 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'bg-slate-950 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="font-bold text-sm block leading-tight">{item.name}</span>
                  <span className="text-[11px] text-slate-400 capitalize">{item.category}</span>
                </div>

                {count > 0 && item.category === 'produce' && (
                  <button
                    onClick={() => sellItem(key, 1, item.sellPrice)}
                    className="mt-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold rounded-xl text-xs transition-all w-full"
                  >
                    Sell 1 (${item.sellPrice})
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <span className="text-xs text-slate-400">Harvest crops to fill up your silo.</span>
          <button
            onClick={() => setActiveModal('shop')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Open Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
