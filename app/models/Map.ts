import { Texture } from 'pixi.js';
import { Cell, Direction, GrassCell, WaterCell } from './Cell';
import { Seas } from './Sea';
import { Road } from './Road';
import { MAP_HEIGHT, MAP_WIDTH } from '~/MainScene/MainScene';

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
      Array.from({ length: this.width }, (_, y) => new GrassCell(x,y, this.textures.grass, 'grass', 'none', 'empty')) // null для пустых клеток
    );
  }

  // Генерация карты
  generateMap() {
    this.resetMap();

    // Генерация морей
    const seas = new Seas(
      { small: 0, medium: 1, large: 3, ocean: 2 },
      this.width,
      this.height,
      this.textures.water // Текстура воды
    );
    seas.generateSeas(this.map);

    const road = new Road(this.width, 
        this.height, 
        this.textures.grassRoadNSOUTH, 
        this.textures.grassRoadWEAST,
        this.textures.grassRoadCornerF_N_T_E,
        this.textures.grassRoadCornerF_N_T_W,
        this.textures.grassRoadCornerF_S_T_E,
        this.textures.grassRoadCornerF_S_T_W
    );
    road.generateRoad(this.map, { x: 12, y: 5 }, { x: 5, y: 60 });
    // В дальнейшем сюда добавятся генерация травы, дорог и других объектов
  }
}
/*grassRoadNSOUTH: await Assets.load('/assets/img/darkgrass+road_NSOUTH.png'),
      grassRoadWEAST: await Assets.load('/assets/img/darkgrass+road_WEAST.png'),
      grassRoadCornerF_S_T_E: await Assets.load('/assets/img/darkgrass+road_F-SOUTH-T-EAST.png'),
      grassRoadCornerF_S_T_W: await Assets.load('/assets/img/darkgrass+road_F-SOUTH-T-WEST.png'),
      grassRoadCornerF_N_T_W: await Assets.load('/assets/img/darkgrass+road_F-NORTH-T-WEST.png'),
      grassRoadCornerF_N_T_E: await Assets.load('/assets/img/darkgrass+road_F-NORTH-T-EAST.png'),*/