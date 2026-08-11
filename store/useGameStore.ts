import { create } from 'zustand';
import { 
  SoilPlot, 
  CropType, 
  ToolType, 
  LivestockAnimal, 
  InventoryItemKey, 
  WeatherType, 
  CameraViewMode,
  VehicleType 
} from '@/types/game';
import { soundFx } from '@/utils/sound';

interface GameState {
  // Economy & Time
  money: number;
  day: number;
  timeOfDay: number; // 0 to 24
  timeSpeed: number; // 0 = paused, 1 = normal, 2 = fast, 5 = ultra
  weather: WeatherType;
  
  // Soil & Crops
  plots: SoilPlot[];
  
  // Inventory
  inventory: Record<InventoryItemKey, number>;
  
  // Livestock
  animals: LivestockAnimal[];
  
  // Controllable Player Character (Roger)
  characterPosition: [number, number, number];
  characterHeading: number;
  characterIsWalking: boolean;

  // Vehicles & Driving
  activeVehicle: VehicleType;
  isVehicleMounted: boolean;
  vehiclePosition: [number, number, number]; // Tractor pos
  vehicleHeading: number;
  vehicleSpeed: number;
  diggerPosition: [number, number, number];
  diggerHeading: number;
  diggerSpeed: number;
  
  // Tool & UI Navigation
  selectedTool: ToolType;
  cameraMode: CameraViewMode;
  activeModal: 'shop' | 'inventory' | 'controls' | 'instructions' | 'stats' | null;
  soundEnabled: boolean;

  // Actions
  setTimeSpeed: (speed: number) => void;
  setSelectedTool: (tool: ToolType) => void;
  setCameraMode: (mode: CameraViewMode) => void;
  setActiveModal: (modal: 'shop' | 'inventory' | 'controls' | 'instructions' | 'stats' | null) => void;
  toggleSound: () => void;
  
  // Character Actions
  updateCharacterTransform: (pos: [number, number, number], heading: number, isWalking: boolean) => void;

  // Vehicle Actions
  mountVehicle: (type: 'tractor' | 'digger') => void;
  dismountVehicle: () => void;
  toggleVehicleMount: () => void; // Toggle between character and tractor
  updateVehiclePhysics: (pos: [number, number, number], heading: number, speed: number) => void;
  updateDiggerPhysics: (pos: [number, number, number], heading: number, speed: number) => void;

  // Farming Actions
  interactPlot: (plotId: string) => void;
  tillPlot: (plotId: string) => void;
  till3x3Area: (centerX: number, centerZ: number) => void;
  plantCrop: (plotId: string, cropType: CropType) => void;
  waterPlot: (plotId: string) => void;
  harvestPlot: (plotId: string) => void;
  placeSprinkler: (plotId: string) => void;
  
  // Livestock Actions
  feedAnimal: (animalId: string) => void;
  collectAnimalProduct: (animalId: string) => void;
  
  // Economy Actions
  buyItem: (itemKey: InventoryItemKey, quantity?: number, price?: number) => boolean;
  sellItem: (itemKey: InventoryItemKey, quantity?: number, price?: number) => boolean;
  sellAllHarvest: () => void;
  buyAnimal: (type: 'cow' | 'sheep' | 'chicken') => boolean;
  
  // Game Loop Tick
  tick: (deltaSeconds: number) => void;
}

const createInitialGrid = (): SoilPlot[] => {
  const plots: SoilPlot[] = [];
  const size = 10;
  const half = Math.floor(size / 2);
  
  for (let x = -half; x < half; x++) {
    for (let z = -half; z < half; z++) {
      const id = `plot_${x}_${z}`;
      let status: SoilPlot['status'] = 'grass';
      let crop: SoilPlot['crop'] = undefined;
      
      if (Math.abs(x) <= 2 && Math.abs(z) <= 2) {
        status = 'tilled';
        if (x === 0 && z === 0) {
          status = 'moist';
          crop = { type: 'wheat', stage: 2, progress: 100, plantedAtTime: 6 };
        } else if (x === 1 && z === 0) {
          status = 'moist';
          crop = { type: 'corn', stage: 1, progress: 50, plantedAtTime: 7 };
        } else if (x === -1 && z === 0) {
          crop = { type: 'carrot', stage: 0, progress: 15, plantedAtTime: 8 };
        }
      }
      
      plots.push({ id, x, z, status, crop });
    }
  }
  return plots;
};

const initialAnimals: LivestockAnimal[] = [
  {
    id: 'cow_1',
    type: 'cow',
    name: 'Bessie',
    x: 12,
    z: -8,
    targetX: 13,
    targetZ: -7,
    hunger: 80,
    productProgress: 75,
    hasProductReady: false
  },
  {
    id: 'cow_2',
    type: 'cow',
    name: 'Daisy',
    x: 15,
    z: -10,
    targetX: 14,
    targetZ: -11,
    hunger: 90,
    productProgress: 95,
    hasProductReady: true
  },
  {
    id: 'sheep_1',
    type: 'sheep',
    name: 'Fluffy',
    x: 10,
    z: -12,
    targetX: 11,
    targetZ: -14,
    hunger: 70,
    productProgress: 60,
    hasProductReady: false
  },
  {
    id: 'chicken_1',
    type: 'chicken',
    name: 'Henrietta',
    x: 14,
    z: -5,
    targetX: 15,
    targetZ: -6,
    hunger: 85,
    productProgress: 90,
    hasProductReady: true
  }
];

export const useGameStore = create<GameState>((set, get) => ({
  money: 250,
  day: 1,
  timeOfDay: 8.0,
  timeSpeed: 1,
  weather: 'sunny',
  
  plots: createInitialGrid(),
  
  inventory: {
    wheat_seed: 5,
    corn_seed: 3,
    carrot_seed: 4,
    pumpkin_seed: 2,
    wheat: 2,
    corn: 0,
    carrot: 0,
    pumpkin: 0,
    milk: 1,
    wool: 0,
    egg: 2,
    animal_feed: 8,
    sprinkler: 1,
  },
  
  animals: initialAnimals,
  
  characterPosition: [0, 0.5, 3],
  characterHeading: 0,
  characterIsWalking: false,

  activeVehicle: null,
  isVehicleMounted: false,
  vehiclePosition: [-12, 0.5, 5],
  vehicleHeading: 0,
  vehicleSpeed: 0,
  diggerPosition: [-8, 0.5, 8],
  diggerHeading: Math.PI / 4,
  diggerSpeed: 0,
  
  selectedTool: 'select',
  cameraMode: 'character_follow',
  activeModal: null,
  soundEnabled: true,

  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setActiveModal: (modal) => set({ activeModal: modal }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  updateCharacterTransform: (pos, heading, isWalking) => {
    set({
      characterPosition: pos,
      characterHeading: heading,
      characterIsWalking: isWalking
    });
  },

  mountVehicle: (type) => {
    set({
      activeVehicle: type,
      isVehicleMounted: true,
      cameraMode: 'vehicle_follow',
      selectedTool: 'drive'
    });
  },

  dismountVehicle: () => {
    const state = get();
    // Place Roger right beside the current vehicle
    let dropX = state.characterPosition[0];
    let dropZ = state.characterPosition[2];
    if (state.activeVehicle === 'tractor') {
      dropX = state.vehiclePosition[0] + 1.8;
      dropZ = state.vehiclePosition[2];
    } else if (state.activeVehicle === 'digger') {
      dropX = state.diggerPosition[0] + 2.0;
      dropZ = state.diggerPosition[2];
    }

    set({
      activeVehicle: null,
      isVehicleMounted: false,
      characterPosition: [dropX, 0.5, dropZ],
      cameraMode: 'character_follow',
      selectedTool: 'select'
    });
  },

  toggleVehicleMount: () => {
    const state = get();
    if (state.activeVehicle) {
      state.dismountVehicle();
    } else {
      // Check distance to tractor vs digger
      const distToTractor = Math.hypot(
        state.characterPosition[0] - state.vehiclePosition[0],
        state.characterPosition[2] - state.vehiclePosition[2]
      );
      const distToDigger = Math.hypot(
        state.characterPosition[0] - state.diggerPosition[0],
        state.characterPosition[2] - state.diggerPosition[2]
      );

      if (distToDigger < distToTractor && distToDigger < 6) {
        state.mountVehicle('digger');
      } else {
        state.mountVehicle('tractor');
      }
    }
  },

  updateVehiclePhysics: (pos, heading, speed) => {
    set({
      vehiclePosition: pos,
      vehicleHeading: heading,
      vehicleSpeed: speed
    });
  },

  updateDiggerPhysics: (pos, heading, speed) => {
    set({
      diggerPosition: pos,
      diggerHeading: heading,
      diggerSpeed: speed
    });
  },

  interactPlot: (plotId) => {
    const { selectedTool, tillPlot, plantCrop, waterPlot, harvestPlot, placeSprinkler } = get();
    switch (selectedTool) {
      case 'till':
        tillPlot(plotId);
        break;
      case 'plant_wheat':
        plantCrop(plotId, 'wheat');
        break;
      case 'plant_corn':
        plantCrop(plotId, 'corn');
        break;
      case 'plant_carrot':
        plantCrop(plotId, 'carrot');
        break;
      case 'plant_pumpkin':
        plantCrop(plotId, 'pumpkin');
        break;
      case 'water':
        waterPlot(plotId);
        break;
      case 'harvest':
        harvestPlot(plotId);
        break;
      case 'sprinkler':
        placeSprinkler(plotId);
        break;
      case 'select':
      default:
        const plot = get().plots.find(p => p.id === plotId);
        if (!plot) return;
        if (plot.crop && plot.crop.stage === 2) {
          harvestPlot(plotId);
        } else if (plot.status === 'grass') {
          tillPlot(plotId);
        } else if (plot.status === 'tilled' && !plot.crop) {
          plantCrop(plotId, 'wheat');
        } else if (plot.status === 'tilled' && plot.crop) {
          waterPlot(plotId);
        }
        break;
    }
  },

  tillPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || plot.status !== 'grass') return;

    if (state.soundEnabled) soundFx.playTill();
    set({
      plots: state.plots.map(p => p.id === plotId ? { ...p, status: 'tilled' } : p)
    });
  },

  till3x3Area: (centerX, centerZ) => {
    const state = get();
    if (state.soundEnabled) soundFx.playTill();

    set({
      plots: state.plots.map(p => {
        if (Math.abs(p.x - centerX) <= 1 && Math.abs(p.z - centerZ) <= 1 && p.status === 'grass') {
          return { ...p, status: 'tilled' };
        }
        return p;
      })
    });
  },

  plantCrop: (plotId, cropType) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || plot.status === 'grass' || plot.crop) return;

    const seedKey = `${cropType}_seed` as InventoryItemKey;
    const currentSeeds = state.inventory[seedKey] || 0;
    if (currentSeeds <= 0) return;

    if (state.soundEnabled) soundFx.playPlant();

    set({
      inventory: { ...state.inventory, [seedKey]: currentSeeds - 1 },
      plots: state.plots.map(p => p.id === plotId ? {
        ...p,
        crop: {
          type: cropType,
          stage: 0,
          progress: 0,
          plantedAtTime: state.timeOfDay
        }
      } : p)
    });
  },

  waterPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || plot.status === 'grass') return;

    if (state.soundEnabled) soundFx.playWater();

    set({
      plots: state.plots.map(p => p.id === plotId ? { ...p, status: 'moist' } : p)
    });
  },

  harvestPlot: (plotId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || !plot.crop || plot.crop.stage !== 2) return;

    const cropType = plot.crop.type;
    const cropKey = cropType as InventoryItemKey;
    const seedBonusKey = `${cropType}_seed` as InventoryItemKey;

    if (state.soundEnabled) soundFx.playHarvest();

    const gainedCropCount = 1 + (Math.random() > 0.6 ? 1 : 0);
    const gainedSeedCount = Math.random() > 0.5 ? 1 : 0;

    set({
      inventory: {
        ...state.inventory,
        [cropKey]: (state.inventory[cropKey] || 0) + gainedCropCount,
        [seedBonusKey]: (state.inventory[seedBonusKey] || 0) + gainedSeedCount,
      },
      plots: state.plots.map(p => p.id === plotId ? {
        ...p,
        status: 'tilled',
        crop: undefined
      } : p)
    });
  },

  placeSprinkler: (plotId) => {
    const state = get();
    const plot = state.plots.find(p => p.id === plotId);
    if (!plot || state.inventory.sprinkler <= 0 || plot.hasSprinkler) return;

    set({
      inventory: { ...state.inventory, sprinkler: state.inventory.sprinkler - 1 },
      plots: state.plots.map(p => p.id === plotId ? { ...p, hasSprinkler: true, status: 'moist' } : p)
    });
  },

  feedAnimal: (animalId) => {
    const state = get();
    if (state.inventory.animal_feed <= 0) return;
    const animal = state.animals.find(a => a.id === animalId);
    if (!animal || animal.hunger >= 100) return;

    if (state.soundEnabled) soundFx.playFeed();

    set({
      inventory: { ...state.inventory, animal_feed: state.inventory.animal_feed - 1 },
      animals: state.animals.map(a => a.id === animalId ? {
        ...a,
        hunger: Math.min(100, a.hunger + 40)
      } : a)
    });
  },

  collectAnimalProduct: (animalId) => {
    const state = get();
    const animal = state.animals.find(a => a.id === animalId);
    if (!animal || !animal.hasProductReady) return;

    let productKey: InventoryItemKey = 'milk';
    if (animal.type === 'sheep') productKey = 'wool';
    if (animal.type === 'chicken') productKey = 'egg';

    if (state.soundEnabled) soundFx.playHarvest();

    set({
      inventory: {
        ...state.inventory,
        [productKey]: (state.inventory[productKey] || 0) + 1
      },
      animals: state.animals.map(a => a.id === animalId ? {
        ...a,
        hasProductReady: false,
        productProgress: 0
      } : a)
    });
  },

  buyItem: (itemKey, quantity = 1, price = 10) => {
    const state = get();
    const totalCost = price * quantity;
    if (state.money < totalCost) return false;

    if (state.soundEnabled) soundFx.playCoin();

    set({
      money: state.money - totalCost,
      inventory: {
        ...state.inventory,
        [itemKey]: (state.inventory[itemKey] || 0) + quantity
      }
    });
    return true;
  },

  sellItem: (itemKey, quantity = 1, price = 15) => {
    const state = get();
    const currentQty = state.inventory[itemKey] || 0;
    if (currentQty < quantity) return false;

    if (state.soundEnabled) soundFx.playCoin();

    set({
      money: state.money + (price * quantity),
      inventory: {
        ...state.inventory,
        [itemKey]: currentQty - quantity
      }
    });
    return true;
  },

  sellAllHarvest: () => {
    const state = get();
    const prices: Record<string, number> = {
      wheat: 18,
      corn: 25,
      carrot: 30,
      pumpkin: 45,
      milk: 35,
      wool: 50,
      egg: 20
    };

    let earnings = 0;
    const newInventory = { ...state.inventory };

    (Object.keys(prices) as Array<keyof typeof prices>).forEach((key) => {
      const itemKey = key as InventoryItemKey;
      const qty = newInventory[itemKey] || 0;
      if (qty > 0) {
        earnings += qty * prices[key];
        newInventory[itemKey] = 0;
      }
    });

    if (earnings > 0) {
      if (state.soundEnabled) soundFx.playCoin();
      set({
        money: state.money + earnings,
        inventory: newInventory
      });
    }
  },

  buyAnimal: (type) => {
    const state = get();
    const animalCosts: Record<string, number> = { cow: 120, sheep: 90, chicken: 40 };
    const cost = animalCosts[type];
    if (state.money < cost) return false;

    const names: Record<string, string[]> = {
      cow: ['Clarabelle', 'Molly', 'Buttercup', 'Spot'],
      sheep: ['Woolly', 'Cotton', 'Dolly', 'Snowball'],
      chicken: ['Penny', 'Chirpy', 'Goldie', 'Feathers']
    };
    const randomName = names[type][Math.floor(Math.random() * names[type].length)];

    if (state.soundEnabled) soundFx.playCoin();

    const newAnimal: LivestockAnimal = {
      id: `${type}_${Date.now()}`,
      type,
      name: randomName,
      x: 10 + Math.random() * 5,
      z: -10 + Math.random() * 5,
      targetX: 10 + Math.random() * 5,
      targetZ: -10 + Math.random() * 5,
      hunger: 100,
      productProgress: 0,
      hasProductReady: false
    };

    set({
      money: state.money - cost,
      animals: [...state.animals, newAnimal]
    });
    return true;
  },

  tick: (deltaSeconds) => {
    const state = get();
    if (state.timeSpeed === 0) return;

    const gameMinutesPassed = deltaSeconds * state.timeSpeed * 10;
    const timeDeltaHours = gameMinutesPassed / 60;

    let newTimeOfDay = state.timeOfDay + timeDeltaHours;
    let newDay = state.day;

    if (newTimeOfDay >= 24) {
      newTimeOfDay -= 24;
      newDay += 1;
    }

    let newWeather = state.weather;
    if (Math.floor(newTimeOfDay) === 6 && Math.floor(state.timeOfDay) === 5) {
      const rand = Math.random();
      newWeather = rand < 0.6 ? 'sunny' : (rand < 0.85 ? 'cloudy' : 'rainy');
    }

    const isRaining = newWeather === 'rainy';

    const updatedPlots = state.plots.map((plot) => {
      let currentStatus = plot.status;
      if (isRaining || plot.hasSprinkler) {
        currentStatus = 'moist';
      }

      if (!plot.crop) {
        return { ...plot, status: currentStatus };
      }

      const growthMultiplier = (currentStatus === 'moist' ? 2.5 : 1.0) * state.timeSpeed;
      const addProgress = (deltaSeconds * 3.5) * growthMultiplier;
      
      const newProgress = Math.min(100, plot.crop.progress + addProgress);
      let newStage = plot.crop.stage;

      if (newProgress >= 100) {
        newStage = 2;
      } else if (newProgress >= 35) {
        newStage = 1;
      }

      return {
        ...plot,
        status: currentStatus,
        crop: {
          ...plot.crop,
          progress: newProgress,
          stage: newStage
        }
      };
    });

    const updatedAnimals = state.animals.map((animal) => {
      const newHunger = Math.max(0, animal.hunger - (deltaSeconds * 0.5 * state.timeSpeed));
      let newProductProgress = animal.productProgress;
      let productReady = animal.hasProductReady;

      if (newHunger > 30 && !productReady) {
        const prodSpeed = animal.type === 'chicken' ? 4 : (animal.type === 'sheep' ? 2.5 : 2);
        newProductProgress = Math.min(100, animal.productProgress + (deltaSeconds * prodSpeed * state.timeSpeed));
        if (newProductProgress >= 100) {
          productReady = true;
        }
      }

      let tX = animal.targetX;
      let tZ = animal.targetZ;
      if (Math.random() < 0.02) {
        tX = 8 + Math.random() * 10;
        tZ = -15 + Math.random() * 12;
      }

      const dx = tX - animal.x;
      const dz = tZ - animal.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      let nx = animal.x;
      let nz = animal.z;

      if (dist > 0.2) {
        const step = Math.min(dist, deltaSeconds * 1.2);
        nx += (dx / dist) * step;
        nz += (dz / dist) * step;
      }

      return {
        ...animal,
        x: nx,
        z: nz,
        targetX: tX,
        targetZ: tZ,
        hunger: newHunger,
        productProgress: newProductProgress,
        hasProductReady: productReady
      };
    });

    set({
      timeOfDay: newTimeOfDay,
      day: newDay,
      weather: newWeather,
      plots: updatedPlots,
      animals: updatedAnimals
    });
  }
}));
