import { Texture } from "pixi.js";
import { Cell, CornerDirection, Direction, RoadCell, RoadCornerCell, RoadCornerTypes, RoadTypes, WaterCell } from "./Cell";

export type UnifiedRoadType = RoadTypes | RoadCornerTypes;
export type UnifiedDirection = Direction | CornerDirection;

export class Road {
    textureN: Texture;
    textureW: Texture;
    textureNE: Texture;
    textureNW: Texture;
    textureSE: Texture;
    textureSW: Texture;
  
    constructor(width: number, height: number, textureN: Texture, textureW: Texture, textureNE: Texture, textureNW: Texture, textureSE: Texture, textureSW: Texture) {
      this.textureN = textureN;
      this.textureW = textureW;
      this.textureNE = textureNE;
      this.textureNW = textureNW;
      this.textureSE = textureSE;
      this.textureSW = textureSW;
    }
  
    private generatePath(start: { x: number; y: number }, end: { x: number; y: number }, map: Cell<UnifiedDirection, any>[][]): { x: number; y: number }[] {
        const queue: { x: number; y: number }[] = [start];
        const visited = new Set<string>();
        const parent = new Map<string, { x: number; y: number } | null>();
      
        visited.add(`${start.x}-${start.y}`);
        parent.set(`${start.x}-${start.y}`, null);
      
        while (queue.length > 0) {
          const current = queue.shift()!;
          if (current.x === end.x && current.y === end.y) break;
      
          const neighbors = this.getAdjacentCells(current, map).filter(
            cell => !visited.has(`${cell.x}-${cell.y}`) && map[cell.y][cell.x].object === 'empty'
          );
      
          for (const neighbor of neighbors) {  
            visited.add(`${neighbor.x}-${neighbor.y}`);
            parent.set(`${neighbor.x}-${neighbor.y}`, current);
            queue.push(neighbor);
          }
        }
      
        // Восстановление пути:
        const path: { x: number; y: number }[] = [];
        let step: { x: number; y: number } | null = end;
        while (step) {
          path.unshift(step);
          step = parent.get(`${step.x}-${step.y}`) || null;
        }
      
        return path;
      }
      
      generateRoad(map: Cell<UnifiedDirection, any>[][], start: { x: number; y: number }, end: { x: number; y: number }) {
        const path = this.generatePath(start, end, map);
        for (let i = 0; i < path.length; i++) {
          const current = path[i];
          const prev = path[i - 1] || null;
          const next = path[i + 1] || null;
      
          const directions = this.getDirections(prev, current, next);
          const roadCell = this.createRoadCell(current.x, current.y, directions);
          if (roadCell) {
            map[current.x][current.y] = roadCell;
          } else {
            console.warn(`Failed to create road cell at (${current.x}, ${current.y})`);
          }
          
        }
      }
      
      private getDirections(
        prev: { x: number; y: number } | null,
        current: { x: number; y: number },
        next: { x: number; y: number } | null
      ): UnifiedDirection {
        if (!prev || !next) return 'W'; // Если это начало или конец, выбираем прямую дорогу.
      
        if (prev.x === current.x && next.x === current.x) return 'N'; // Вертикальная дорога.
        if (prev.y === current.y && next.y === current.y) return 'W'; // Горизонтальная дорога.
      
        if (prev.y < current.y && prev.x === current.x && next.y === current.y && next.x > current.x) return 'N-E';
        if (prev.y < current.y && prev.x === current.x && next.y === current.y && next.x < current.x) return 'N-W';
        if (prev.y === current.y && prev.x > current.x && next.y > current.y && next.x === current.x) return 'S-E';
        if (prev.y === current.y && prev.x < current.x && next.y > current.y && next.x === current.x) return 'S-W';
        
        return 'W'; // Дефолтное значение (на случай ошибки).
      }

      private createRoadCell(x: number, y: number, direction: UnifiedDirection): RoadCell<UnifiedDirection, UnifiedRoadType> | RoadCornerCell {
        //console.log(`Creating road cell at (${x}, ${y}) with direction: ${direction}`);
        const returnable: RoadCell<UnifiedDirection, UnifiedRoadType> | RoadCornerCell = 
            direction === 'N' ? 
                new RoadCell(x, y, this.textureN, 'grassN', 'N', 'empty') :
            direction === 'S' ? 
                new RoadCell(x, y, this.textureN, 'grassN', 'S', 'empty') :
            direction === 'W' ? 
                new RoadCell(x, y, this.textureW, 'grassW', 'W', 'empty') :
            direction === 'N-E' ? 
                new RoadCornerCell(x, y, this.textureNE, 'grassNE', 'N-E', 'empty') :
            direction === 'N-W' ? 
                new RoadCornerCell(x, y, this.textureNW, 'grassNW', 'N-W', 'empty') :
            direction === 'S-E' ? 
                new RoadCornerCell(x, y, this.textureSE, 'grassSE', 'S-E', 'empty') :
                new RoadCornerCell(x, y, this.textureSW, 'grassSW', 'S-W', 'empty');

        return returnable;
      }
      
      
  
    private getAdjacentCells(
        current: { x: number; y: number },
        map: Cell<UnifiedDirection, any>[][]
      ) {
        if (!current || !map) return []; // Если входные данные некорректны, возвращаем пустой массив.
        const adjacentCells: { x: number; y: number }[] = [];
        const directions = [
          { x: 0, y: -1 }, // вверх
          { x: 0, y: 1 },  // вниз
          { x: -1, y: 0 }, // влево
          { x: 1, y: 0 },  // вправо
        ];
      
        for (const dir of directions) {
          const x = current.x + dir.x;
          const y = current.y + dir.y;
      
          if (x >= 0 && y >= 0 && x < map[0]?.length && y < map.length && !(map[x][y] instanceof WaterCell)) { //сюда вписываются объекты которые нужно обходить
            adjacentCells.push({ x, y });                                                           //т.е. !(map[x][y] instanceof WaterCell) указывает, что клетки класса WaterCell нужно обходить
          }
        }
        return adjacentCells;
      }
  }

// export class Roads {
//     roads: Road[];
  
//     constructor() {
//       this.roads = [];
//       // Массив дорог будет создан на основе текстур
//     }
  
//     addRoad(road: Road) {
//       this.roads.push(road);
//     }
//   }
  
  