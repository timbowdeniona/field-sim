'use client';

import React from 'react';
import { 
  Coins, 
  Clock, 
  Sun, 
  CloudRain, 
  Cloud, 
  ShoppingBag, 
  Package, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  FastForward, 
  Truck, 
  Sprout, 
  Droplets, 
  Scissors, 
  Hand,
  Sparkles,
  Layers
} from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { ToolType } from '@/types/game';

export const HUDOverlay: React.FC = () => {
  const money = useGameStore((state) => state.money);
  const day = useGameStore((state) => state.day);
  const timeOfDay = useGameStore((state) => state.timeOfDay);
  const timeSpeed = useGameStore((state) => state.timeSpeed);
  const weather = useGameStore((state) => state.weather);
  const selectedTool = useGameStore((state) => state.selectedTool);
  const inventory = useGameStore((state) => state.inventory);
  const isVehicleMounted = useGameStore((state) => state.isVehicleMounted);
  const soundEnabled = useGameStore((state) => state.soundEnabled);

  const setTimeSpeed = useGameStore((state) => state.setTimeSpeed);
  const setSelectedTool = useGameStore((state) => state.setSelectedTool);
  const setActiveModal = useGameStore((state) => state.setActiveModal);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const toggleVehicleMount = useGameStore((state) => state.toggleVehicleMount);

  // Format 24-hour time to HH:MM string
  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const mins = Math.floor((time - hours) * 60);
    const hStr = hours.toString().padStart(2, '0');
    const mStr = mins.toString().padStart(2, '0');
    return `${hStr}:${mStr}`;
  };

  const totalCropsCount = (inventory.wheat || 0) + (inventory.corn || 0) + (inventory.carrot || 0) + (inventory.pumpkin || 0);

  const tools: { id: ToolType; label: string; icon: React.ReactNode; count?: number; key: string }[] = [
    { id: 'select', label: 'Inspect', icon: <Hand className="w-5 h-5" />, key: '1' },
    { id: 'till', label: 'Till Soil', icon: <Layers className="w-5 h-5" />, key: '2' },
    { id: 'plant_wheat', label: 'Wheat', icon: <Sprout className="w-5 h-5" />, count: inventory.wheat_seed, key: '3' },
    { id: 'plant_corn', label: 'Corn', icon: <Sprout className="w-5 h-5 text-yellow-400" />, count: inventory.corn_seed, key: '4' },
    { id: 'plant_carrot', label: 'Carrot', icon: <Sprout className="w-5 h-5 text-orange-400" />, count: inventory.carrot_seed, key: '5' },
    { id: 'water', label: 'Water Can', icon: <Droplets className="w-5 h-5 text-blue-400" />, key: '6' },
    { id: 'harvest', label: 'Harvest', icon: <Scissors className="w-5 h-5 text-amber-400" />, key: '7' },
    { id: 'sprinkler', label: 'Sprinkler', icon: <Sparkles className="w-5 h-5 text-cyan-400" />, count: inventory.sprinkler, key: '8' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4 md:p-6 font-sans">
      {/* --- TOP BAR --- */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        {/* Left Side: Stats Badges (Money, Day, Time, Weather) */}
        <div className="flex items-center gap-2 md:gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl px-4 py-2.5 text-white shadow-xl pointer-events-auto">
          {/* Money */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Balance</span>
              <span className="text-base font-bold text-amber-400">${money}</span>
            </div>
          </div>

          {/* Time & Day */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Day {day}</span>
              <span className="text-base font-semibold">{formatTime(timeOfDay)}</span>
            </div>
          </div>

          {/* Weather Indicator */}
          <div className="flex items-center gap-1.5 pl-1">
            {weather === 'sunny' && <Sun className="w-5 h-5 text-yellow-400 animate-spin-slow" />}
            {weather === 'cloudy' && <Cloud className="w-5 h-5 text-slate-300" />}
            {weather === 'rainy' && <CloudRain className="w-5 h-5 text-blue-400" />}
            <span className="text-xs font-semibold capitalize hidden sm:inline text-slate-200">{weather}</span>
          </div>
        </div>

        {/* Top-Center Floating Title: Roger's Field */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 backdrop-blur-md border border-emerald-500/40 rounded-2xl px-4 py-2 shadow-2xl pointer-events-auto">
          <Sprout className="w-5 h-5 text-emerald-400 animate-bounce" />
          <h1 className="text-base sm:text-lg font-black tracking-wide bg-gradient-to-r from-amber-300 via-emerald-300 to-yellow-400 bg-clip-text text-transparent">
            Roger's Field
          </h1>
        </div>

        {/* Right Side: Game Controls & Navigation */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Time Speed Controls */}
          <div className="flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-1 text-white shadow-xl">
            <button
              onClick={() => setTimeSpeed(timeSpeed === 0 ? 1 : 0)}
              className={`p-2 rounded-xl transition-all ${timeSpeed === 0 ? 'bg-amber-500/30 text-amber-400' : 'hover:bg-slate-800 text-slate-300'}`}
              title={timeSpeed === 0 ? "Resume" : "Pause"}
            >
              {timeSpeed === 0 ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setTimeSpeed(1)}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${timeSpeed === 1 ? 'bg-emerald-500/30 text-emerald-400' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              1x
            </button>
            <button
              onClick={() => setTimeSpeed(2)}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${timeSpeed === 2 ? 'bg-emerald-500/30 text-emerald-400' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              2x
            </button>
            <button
              onClick={() => setTimeSpeed(5)}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${timeSpeed === 5 ? 'bg-emerald-500/30 text-emerald-400' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              <FastForward className="w-4 h-4 inline" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-xl"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
          </button>

          {/* Inventory Button */}
          <button
            onClick={() => setActiveModal('inventory')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl text-white hover:bg-slate-800 transition-all shadow-xl relative"
          >
            <Package className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold hidden md:inline">Storage</span>
            {totalCropsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                {totalCropsCount}
              </span>
            )}
          </button>

          {/* Shop Button */}
          <button
            onClick={() => setActiveModal('shop')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm">Market</span>
          </button>

          {/* Controls Help */}
          <button
            onClick={() => setActiveModal('controls')}
            className="p-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-xl"
            title="Keyboard Controls"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- VEHICLE DRIVING OVERLAY & TOUCH CONTROLS --- */}
      {isVehicleMounted && (
        <div className="self-center flex flex-col items-center gap-3 pointer-events-auto">
          {/* On-screen Touch D-Pad for Mobile & Tablet */}
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-amber-500/50 shadow-2xl">
            {/* Accelerate Forward */}
            <button
              onTouchStart={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'forward', active: true } }))}
              onTouchEnd={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'forward', active: false } }))}
              onMouseDown={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'forward', active: true } }))}
              onMouseUp={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'forward', active: false } }))}
              className="p-3 bg-emerald-600 active:bg-emerald-400 text-slate-950 rounded-2xl font-bold shadow-lg touch-none"
            >
              ▲ FORWARD
            </button>

            <div className="flex items-center gap-2">
              {/* Steer Left */}
              <button
                onTouchStart={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'left', active: true } }))}
                onTouchEnd={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'left', active: false } }))}
                onMouseDown={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'left', active: true } }))}
                onMouseUp={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'left', active: false } }))}
                className="p-3 bg-slate-800 active:bg-slate-700 text-amber-400 rounded-2xl font-bold shadow-lg touch-none"
              >
                ◀ LEFT
              </button>

              {/* Dismount Button */}
              <button
                onClick={toggleVehicleMount}
                className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-2xl transition-all shadow-lg"
              >
                DISMOUNT
              </button>

              {/* Steer Right */}
              <button
                onTouchStart={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'right', active: true } }))}
                onTouchEnd={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'right', active: false } }))}
                onMouseDown={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'right', active: true } }))}
                onMouseUp={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'right', active: false } }))}
                className="p-3 bg-slate-800 active:bg-slate-700 text-amber-400 rounded-2xl font-bold shadow-lg touch-none"
              >
                RIGHT ▶
              </button>
            </div>

            {/* Reverse / Brake */}
            <button
              onTouchStart={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'backward', active: true } }))}
              onTouchEnd={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'backward', active: false } }))}
              onMouseDown={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'backward', active: true } }))}
              onMouseUp={() => window.dispatchEvent(new CustomEvent('vehicle_control', { detail: { action: 'backward', active: false } }))}
              className="p-3 bg-red-700 active:bg-red-500 text-white rounded-2xl font-bold shadow-lg touch-none"
            >
              ▼ REVERSE
            </button>
          </div>
        </div>
      )}

      {/* --- BOTTOM TOOLBAR --- */}
      {!isVehicleMounted && (
        <div className="self-center pointer-events-auto max-w-full overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 md:gap-2 bg-slate-900/85 backdrop-blur-lg border border-slate-700/70 p-2 rounded-2xl shadow-2xl">
            {tools.map((t) => {
              const isSelected = selectedTool === t.id;
              const isDisabled = t.count !== undefined && t.count <= 0;

              return (
                <button
                  key={t.id}
                  disabled={isDisabled}
                  onClick={() => setSelectedTool(t.id)}
                  className={`relative flex flex-col items-center justify-center p-2.5 md:p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-emerald-500/30 to-emerald-600/20 border-2 border-emerald-400 text-emerald-300 shadow-lg scale-105'
                      : isDisabled
                      ? 'opacity-40 cursor-not-allowed text-slate-500'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  {/* Hotkey Badge */}
                  <span className="absolute top-1 left-1.5 text-[9px] font-mono font-bold text-slate-400 bg-slate-950/60 px-1 rounded">
                    {t.key}
                  </span>

                  <div className="mt-1">{t.icon}</div>
                  <span className="text-[10px] font-bold mt-1 whitespace-nowrap">{t.label}</span>

                  {/* Quantity Count Badge */}
                  {t.count !== undefined && (
                    <span className={`text-[10px] font-extrabold px-1.5 rounded-full mt-0.5 ${
                      t.count > 0 ? 'bg-slate-800 text-emerald-400' : 'bg-red-950 text-red-400'
                    }`}>
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Mount Tractor Button */}
            <button
              onClick={toggleVehicleMount}
              className="flex flex-col items-center justify-center p-2.5 md:p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition-all ml-1"
            >
              <span className="text-[9px] font-mono font-bold bg-amber-950/60 px-1 rounded text-amber-300">E</span>
              <Truck className="w-5 h-5 mt-1" />
              <span className="text-[10px] font-bold mt-1">Tractor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
