
import { Texture } from 'pixi.js';
import { GrassCell, WaterCell, RoadCell, RoadCornerCell, Direction, GrassTypes, WaterTypes, RoadTypes, RoadCornerTypes, Cell, CornerDirection } from '../models/Cell';

// Типы для генерации карты
type CellTypes = 'grass' | 'water' | 'road' | 'roadCorner';
type Directions = Direction | CornerDirection;
export function generateMap(
    width: number,
    height: number,
    textures: Record<string, Texture>
): Cell<Directions, any>[][] {  // Мы используем Cell<Direction, any> для универсальности
    const map: Cell<Directions, any>[][] = [];
    const cellTypes: CellTypes[] = ['grass', 'water', 'road', 'roadCorner'];

    // Генерация карты
    for (let y = 0; y < height; y++) {
        const row: Cell<Directions, any>[] = [];
        for (let x = 0; x < width; x++) {
            // const randomType = cellTypes[Math.floor(Math.random() * cellTypes.length)];
            // const randomDirection = ['N', 'E', 'W', 'S'][Math.floor(Math.random() * 4)] as Direction;
            // const randomCornerDirection = ['N-E', 'N-W', 'S-E', 'S-W'][Math.floor(Math.random() * 4)] as CornerDirection;
            let cell: Cell<Directions, any>;

            // switch (randomType) {
            //     case 'grass':
            //         cell = new GrassCell(x, y, textures.grass, 'grass', randomDirection);
            //         break;
            //     case 'water':
            //         cell = new WaterCell(x, y, textures.water, 'ocean', randomDirection);
            //         break;
            //     case 'road':
            //         const roadType: RoadTypes = ['grassN', 'grassW'][Math.floor(Math.random() * 2)] as RoadTypes;
            //         cell = new RoadCell(x, y, textures.grass, roadType, randomDirection);
            //         break;
            //     case 'roadCorner':
            //         const roadCornerType: RoadCornerTypes = ['grassNE', 'grassNW', 'grassSE', 'grassSW'][Math.floor(Math.random() * 4)] as RoadCornerTypes;
            //         cell = new RoadCornerCell(x, y, textures.grass, roadCornerType, randomCornerDirection);
            //         break;
            //     default:
            //         throw new Error('Unknown cell type');
            // }
            cell = new GrassCell(x, y, textures.grass, 'grass', 'E');

            row.push(cell);
        }
        map.push(row);
    }

    return map;
}
