export type CropType = 'wheat' | 'corn' | 'carrot' | 'pumpkin';

export type ToolType = 
  | 'select' 
  | 'till' 
  | 'plant_wheat' 
  | 'plant_corn' 
  | 'plant_carrot' 
  | 'plant_pumpkin' 
  | 'water' 
  | 'harvest' 
  | 'feed' 
  | 'drive'
  | 'sprinkler';

export type SoilStatus = 'grass' | 'tilled' | 'moist';

export interface SoilPlot {
  id: string;
  x: number; // Grid index X (-6 to 5 for 12x12 grid)
  z: number; // Grid index Z (-6 to 5 for 12x12 grid)
  status: SoilStatus;
  hasSprinkler?: boolean;
  crop?: {
    type: CropType;
    stage: 0 | 1 | 2; // 0: Seed/Sprout, 1: Growing, 2: Mature/Harvestable
    progress: number; // 0 to 100
    plantedAtTime: number; // Game hours
  };
}

export type AnimalType = 'cow' | 'sheep' | 'chicken';

export interface LivestockAnimal {
  id: string;
  type: AnimalType;
  name: string;
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  hunger: number; // 0 (starving) to 100 (full)
  productProgress: number; // 0 to 100%
  hasProductReady: boolean;
}

export type InventoryItemKey = 
  | 'wheat_seed' 
  | 'corn_seed' 
  | 'carrot_seed' 
  | 'pumpkin_seed' 
  | 'wheat' 
  | 'corn' 
  | 'carrot' 
  | 'pumpkin' 
  | 'milk' 
  | 'wool' 
  | 'egg' 
  | 'animal_feed' 
  | 'sprinkler';

export interface InventoryItemInfo {
  key: InventoryItemKey;
  name: string;
  type: 'seed' | 'crop' | 'product' | 'supply' | 'equipment';
  buyPrice: number;
  sellPrice: number;
  icon: string; // Icon identifier or emoji fallback
  description: string;
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy';

export type CameraViewMode = 'third_person' | 'top_down' | 'vehicle_follow';

export interface MarketItem {
  id: InventoryItemKey;
  name: string;
  type: 'seed' | 'product' | 'equipment' | 'animal';
  price: number;
  description: string;
  itemKey?: InventoryItemKey;
  animalType?: AnimalType;
}
