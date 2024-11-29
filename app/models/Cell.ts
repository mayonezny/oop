// models/Cell.ts

import { Container, Sprite, Texture } from "pixi.js";


export type Direction = 'N' | 'E' | 'S' | 'W' | 'none';
export type CornerDirection = 'N-E' | 'N-W' | 'S-E' | 'S-W';

export type GrassTypes = 'grass' | 'lightgrass' | 'river_start' | 'river_start_lightgrass'; 
export type WaterTypes = 'ocean' | 'river';
export type RoadTypes = 'grassN' | 'grassW';
export type RoadCornerTypes = 'grassNE' | 'grassNW' | 'grassSE' | 'grassSW';

export abstract class Cell<FacingType, TileType> {
  x: number;
  y: number;
  sprite: Sprite;
  type: TileType;
  facing: FacingType;

  constructor(x: number, y: number, texture: Texture, type: TileType, facing: FacingType) {
    this.x = x;
    this.y = y;
    this.sprite = new Sprite(texture);
    this.sprite.x = x;
    this.sprite.y = y;
    this.type = type;
    this.facing = facing;
  }

  abstract render(container: Container): void;

  // Метод для установки текста типа клетки
  setType(type: TileType) {
    this.type = type;
  }

  // Метод для установки направления
  setFacing(facing: FacingType) {
    this.facing = facing;
  }

  getType(){
    return this.type;
  }
  
  getFacing(){
    return this.facing;
  }
}

export class GrassCell extends Cell<Direction, GrassTypes> {
  constructor(x: number, y: number, texture: Texture, type: GrassTypes, facing: Direction) {
    super(x, y, texture, type, facing);
  }

  render(container: Container): void {
    container.addChild(this.sprite);
  }
}

export class WaterCell extends Cell<Direction, WaterTypes> {
  constructor(x: number, y: number, texture: Texture, type: WaterTypes, facing: Direction) {
    super(x, y, texture, type, facing);
  }

  render(container: Container): void {
    container.addChild(this.sprite);
  }
}

export class RoadCell<Direction, RoadTypes> extends Cell<Direction, RoadTypes> {
    constructor(x: number, y: number, texture: Texture, type: RoadTypes, facing: Direction) {
      super(x, y, texture, type, facing);
    }
  
    render(container: Container): void {
      container.addChild(this.sprite);
    }
  }

export class RoadCornerCell extends RoadCell<CornerDirection, RoadCornerTypes> {

  constructor(x: number, y: number, texture: Texture, type: RoadCornerTypes, facing: CornerDirection) {
    super(x, y, texture, type, facing); // Временно указываем 'north', так как оно переопределяется
    this.facing = facing; // Переопределяем `facing` для углов
  }
}

// export class MountainCell extends Cell<Direction> {
//   constructor(x: number, y: number, texture: Texture, facing: Direction) {
//     super(x, y, texture, 'mountain', facing);
//   }

//   render(container: Container): void {
//     container.addChild(this.sprite);
//   }
// }

// export class RiverCell extends Cell<Direction> {
//   constructor(x: number, y: number, texture: Texture, facing: Direction) {
//     super(x, y, texture, 'river', facing);
//   }

//   render(container: Container): void {
//     container.addChild(this.sprite);
//   }
// }
