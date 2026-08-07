'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Sprout, Heart, Sparkles, DollarSign, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { InventoryItemKey } from '@/types/game';

export const ShopModal: React.FC = () => {
  const activeModal = useGameStore((state) => state.activeModal);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const money = useGameStore((state) => state.money);
  const inventory = useGameStore((state) => state.inventory);
  const buyItem = useGameStore((state) => state.buyItem);
  const sellItem = useGameStore((state) => state.sellItem);
  const sellAllHarvest = useGameStore((state) => state.sellAllHarvest);
  const buyAnimal = useGameStore((state) => state.buyAnimal);

  const [activeTab, setActiveTab] = useState<'seeds' | 'animals' | 'supplies' | 'sell'>('seeds');

  if (activeModal !== 'shop') return null;

  const seedCatalog: { key: InventoryItemKey; name: string; cost: number; desc: string }[] = [
    { key: 'wheat_seed', name: 'Wheat Seed', cost: 5, desc: 'Fast growing staple crop. Yields golden wheat.' },
    { key: 'corn_seed', name: 'Corn Seed', cost: 12, desc: 'Tall crop with high yield value.' },
    { key: 'carrot_seed', name: 'Carrot Seed', cost: 15, desc: 'Sweet root vegetable. Premium market price.' },
    { key: 'pumpkin_seed', name: 'Pumpkin Seed', cost: 25, desc: 'Heavy crop. Takes longer to mature, sells for top dollar.' },
  ];

  const supplyCatalog: { key: InventoryItemKey; name: string; cost: number; desc: string }[] = [
    { key: 'animal_feed', name: 'Animal Feed Bag', cost: 8, desc: 'Nutritious feed to keep livestock happy and producing.' },
    { key: 'sprinkler', name: 'Irrigation Sprinkler', cost: 75, desc: 'Automated water sprinkler that keeps 3x3 surrounding soil moist.' },
  ];

  const animalCatalog: { type: 'cow' | 'sheep' | 'chicken'; name: string; cost: number; product: string; desc: string }[] = [
    { type: 'cow', name: 'Dairy Cow', cost: 120, product: 'Milk ($35)', desc: 'Produces fresh milk buckets every cycle.' },
    { type: 'sheep', name: 'Merino Sheep', cost: 90, product: 'Wool ($50)', desc: 'Generates high value wool bundles.' },
    { type: 'chicken', name: 'Hen Chicken', cost: 40, product: 'Eggs ($20)', desc: 'Fast egg production.' },
  ];

  const harvestableSellItems: { key: InventoryItemKey; name: string; price: number }[] = [
    { key: 'wheat', name: 'Harvested Wheat', price: 18 },
    { key: 'corn', name: 'Harvested Corn', price: 25 },
    { key: 'carrot', name: 'Harvested Carrot', price: 30 },
    { key: 'pumpkin', name: 'Harvested Pumpkin', price: 45 },
    { key: 'milk', name: 'Fresh Milk Bucket', price: 35 },
    { key: 'wool', name: 'Soft Wool Bundle', price: 50 },
    { key: 'egg', name: 'Fresh Farm Egg', price: 20 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-slate-950">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Farmer's Marketplace</h2>
              <p className="text-xs text-slate-400">Buy seeds, livestock, tools & sell your harvest</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-2xl bg-slate-800 border border-amber-500/30 text-amber-400 font-extrabold text-sm">
              ${money}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('seeds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'seeds'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sprout className="w-4 h-4" /> Seeds
          </button>
          <button
            onClick={() => setActiveTab('animals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'animals'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" /> Livestock
          </button>
          <button
            onClick={() => setActiveTab('supplies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'supplies'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Equipment
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sell'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Sell Produce
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* SEEDS TAB */}
          {activeTab === 'seeds' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {seedCatalog.map((item) => (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-base">{item.name}</span>
                      <span className="text-amber-400 font-extrabold text-sm">${item.cost}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-700/40 pt-3">
                    <span className="text-xs text-slate-300">Owned: <strong className="text-emerald-400">{inventory[item.key] || 0}</strong></span>
                    <button
                      disabled={money < item.cost}
                      onClick={() => buyItem(item.key, 1, item.cost)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-all"
                    >
                      Buy 1 Seed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIVESTOCK TAB */}
          {activeTab === 'animals' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {animalCatalog.map((animal) => (
                <div key={animal.type} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <span className="font-bold text-white text-base block mb-1">{animal.name}</span>
                    <span className="text-amber-400 font-extrabold text-sm block mb-2">${animal.cost}</span>
                    <p className="text-xs text-slate-400 mb-2">{animal.desc}</p>
                    <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 inline-block mb-3">
                      Yield: {animal.product}
                    </span>
                  </div>
                  <button
                    disabled={money < animal.cost}
                    onClick={() => buyAnimal(animal.type)}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-extrabold rounded-xl text-xs transition-all"
                  >
                    Buy Livestock
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUPPLIES TAB */}
          {activeTab === 'supplies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplyCatalog.map((item) => (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-base">{item.name}</span>
                      <span className="text-amber-400 font-extrabold text-sm">${item.cost}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-700/40 pt-3">
                    <span className="text-xs text-slate-300">Owned: <strong className="text-emerald-400">{inventory[item.key] || 0}</strong></span>
                    <button
                      disabled={money < item.cost}
                      onClick={() => buyItem(item.key, 1, item.cost)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs transition-all"
                    >
                      Buy Equipment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SELL TAB */}
          {activeTab === 'sell' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40">
                <div>
                  <h3 className="font-bold text-white text-base">Bulk Wholesale Export</h3>
                  <p className="text-xs text-slate-300">Sell all harvested crops and animal products at full market value in 1-click.</p>
                </div>
                <button
                  onClick={sellAllHarvest}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg"
                >
                  Sell All Harvest <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {harvestableSellItems.map((item) => {
                  const qty = inventory[item.key] || 0;
                  return (
                    <div key={item.key} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-sm block">{item.name}</span>
                        <span className="text-xs text-slate-400">Qty: <strong className="text-amber-400">{qty}</strong> (${item.price} each)</span>
                      </div>
                      <button
                        disabled={qty <= 0}
                        onClick={() => sellItem(item.key, 1, item.price)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-amber-400 font-bold rounded-lg text-xs transition-all"
                      >
                        Sell 1
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
