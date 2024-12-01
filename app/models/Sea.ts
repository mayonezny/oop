import { Texture } from 'pixi.js';
import { WaterCell, Direction, Cell } from '../models/Cell';

type SeaSize = 'small' | 'medium' | 'large' | 'ocean';

export class Seas {
  sizes: Record<SeaSize, number>; // Количество морей каждого размера
  width: number;
  height: number;
  waterTexture: Texture;

  constructor(sizes: Record<SeaSize, number>, width: number, height: number, waterTexture: Texture) {
    this.sizes = sizes;
    this.width = width;
    this.height = height;
    this.waterTexture = waterTexture;
  }

  // Метод для генерации всех морей
  generateSeas(map: Cell<Direction, any>[][]) {
    for (const size in this.sizes) {
        
      const count = this.sizes[size as SeaSize];
      for (let i = 0; i < count; i++) {
        const sea = new Sea(size as SeaSize, this.width, this.height, this.waterTexture);
        sea.generateSeas(map);
      }
    }
  }
}

export class Sea {
  size: SeaSize;
  centerX: number;
  centerY: number;
  waterTexture: Texture;

  constructor(size: SeaSize, mapWidth: number, mapHeight: number, waterTexture: Texture) {
    this.size = size;
    this.waterTexture = waterTexture;

    // Выбираем случайную центральную точку для моря
    const margin = this.getMargin();
    this.centerX = Math.floor(Math.random() * (mapWidth - 2 * margin)) + margin;
    this.centerY = Math.floor(Math.random() * (mapHeight - 2 * margin)) + margin;
  }

  // Возвращает минимальный отступ от края карты в зависимости от размера моря
  getMargin() {
    switch (this.size) {
      case 'small': return 1;
      case 'medium': return 2;
      case 'large': return 4;
      case 'ocean': return 6;
      default: return 0;
    }
  }
  generateSeas(map: Cell<Direction, any>[][]) {
    
    // Создаем ядро моря
    const seaCells = this.generateSeaCore(map, this.centerX, this.centerY, this.getRadius() + 3, this.getRadius());
    console.log(this.waterTexture);
    // Расширяем море
    this.expandSea(map, seaCells, 1); // Увеличить море с "расширением" 10 шагов
  }
  
  generateSeaCore(map: Cell<Direction, any>[][], centerX: number, centerY: number, radiusX: number, radiusY: number): { x: number, y: number }[] {
    const seaCells: { x: number, y: number }[] = [];
  
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        // Условие для эллиптического моря
        const distanceX = Math.abs(x - centerX) / radiusX; // Нормализуем по горизонтали
        const distanceY = Math.abs(y - centerY) / radiusY; // Нормализуем по вертикали
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  
        // Проверка, попадает ли клетка в эллипс
        if (distance <= 1 && !(map[x][y] instanceof WaterCell)) {
          map[x][y] = new WaterCell(x, y, this.waterTexture, "ocean", "none", "empty");
          seaCells.push({ x, y });
        }
      }
    }
  
    return seaCells;
  }

  expandSea(map: Cell<Direction, any>[][], seaCells: { x: number, y: number }[], expansionRate: number): void {
    const directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];
    const visited = new Set<string>(); // Храним координаты уже обработанных клеток
  
    for (const cell of seaCells) {
      visited.add(`${cell.x},${cell.y}`); // Помечаем стартовые клетки
    }
  
    for (let i = 0; i < expansionRate; i++) {
      const newSeaCells: { x: number, y: number }[] = [];
  
      for (const { x, y } of seaCells) {
        for (const { dx, dy } of directions) {
          const nx = x + dx;
          const ny = y + dy;
  
          // Проверка координат и исключение повторных добавлений
          if (nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length && !(map[ny][nx] instanceof WaterCell) && !visited.has(`${nx},${ny}`)) {
            if (Math.random() < 0.5) {
              // Создаем новую клетку моря
              map[nx][ny] = new WaterCell(nx, ny, this.waterTexture, "ocean", "none", "empty");
              newSeaCells.push({ x: nx, y: ny });
              visited.add(`${nx},${ny}`); // Добавляем в обработанные
            }
          }
        }
      }
  
      // Если больше нечего расширять, выходим из цикла
      if (newSeaCells.length === 0) break;
      seaCells = newSeaCells; // Перезаписываем seaCells для следующей итерации
    }
  }
  // Возвращает радиус моря в зависимости от его размера
  getRadius() {
    switch (this.size) {
      case 'small': return 1;
      case 'medium': return 2;
      case 'large': return 4;
      case 'ocean': return 6;
      default: return 0;
    }
  }
}
