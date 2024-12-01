import { Texture } from 'pixi.js';
import { Cell, Direction, GrassCell, WaterCell } from './Cell';
import { Seas } from './Sea';

export class Map {
  map: Cell<Direction, any>[][] = [];
  width: number;
  height: number;
  textures: Record<string, Texture>;

  constructor(width: number, height: number, textures: Record<string, Texture>) {
    this.width = width;
    this.height = height;
    this.textures = textures;
    this.resetMap();
  }

  // Метод для обнуления карты
  resetMap() {
    this.map = Array.from({ length: this.height }, (_, x) =>
      Array.from({ length: this.width }, (_, y) => new GrassCell(x,y, this.textures.grass, 'grass', 'none')) // null для пустых клеток
    );
  }

  // Генерация карты
  generateMap() {
    this.resetMap();

    // Генерация морей
    const seas = new Seas(
      { small: 1, medium: 1, large: 1, ocean: 1 },
      this.width,
      this.height,
      this.textures.water // Текстура воды
    );
    seas.generateSeas(this.map);

    // В дальнейшем сюда добавятся генерация травы, дорог и других объектов
  }
}
