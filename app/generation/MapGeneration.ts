
import { Texture } from 'pixi.js';
import { GrassCell, WaterCell, RoadCell, RoadCornerCell, Direction, GrassTypes, WaterTypes, RoadTypes, RoadCornerTypes, Cell, CornerDirection } from '../models/Cell';
import { Map } from '../models/Map';
// Типы для генерации карты
type CellTypes = 'grass' | 'water' | 'road' | 'roadCorner';
type Directions = Direction | CornerDirection;


export function generateMap(width: number, height: number, textures: Record<string, Texture>) {
  const map = new Map(width, height, textures);
  map.generateMap();
  return map.map; // Возвращаем готовую карту
}

