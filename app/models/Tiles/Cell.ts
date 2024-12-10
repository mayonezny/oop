// models/Cell.ts

import { Container, Sprite, Texture } from "pixi.js";
import { Hero } from "../Heroes/Hero";
import { Item } from "../Items/Item";
import { CheeseMadness } from "../Items/CheeseMadness";


export type Direction = 'N' | 'E' | 'S' | 'W' | 'none';
export type CornerDirection = 'N-E' | 'N-W' | 'S-E' | 'S-W';

export type GrassTypes = 'grass' | 'lightgrass' | 'river_start' | 'river_start_lightgrass'; 
export type WaterTypes = 'ocean' | 'river';
export type RoadTypes = 'grassN' | 'grassW';
export type RoadCornerTypes = 'grassNE' | 'grassNW' | 'grassSE' | 'grassSW';

export type ObjectTypes = 'empty' | Hero | Item | CheeseMadness;

export abstract class Cell<FacingType, TileType> {
  x: number;
  y: number;
  sprite: Sprite;
  type: TileType;
  facing: FacingType;
  object: ObjectTypes;

  constructor(x: number, y: number, texture: Texture, type: TileType, facing: FacingType, object: ObjectTypes) {
    this.x = x;
    this.y = y;
    this.sprite = new Sprite(texture);
    this.sprite.x = x;
    this.sprite.y = y;
    this.type = type;
    this.facing = facing;
    this.object = object;
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
  constructor(x: number, y: number, texture: Texture, type: GrassTypes, facing: Direction, object: ObjectTypes) {
    super(x, y, texture, type, facing, object);
  }

  render(container: Container): void {
    container.addChild(this.sprite);
  }
}

export class WaterCell extends Cell<Direction, WaterTypes> {
  constructor(x: number, y: number, texture: Texture, type: WaterTypes, facing: Direction, object: ObjectTypes) {
    super(x, y, texture, type, facing, object);
  }

  render(container: Container): void {
    container.addChild(this.sprite);
  }
}

export class RoadCell<Direction, RoadTypes> extends Cell<Direction, RoadTypes> {
    constructor(x: number, y: number, texture: Texture, type: RoadTypes, facing: Direction, object: ObjectTypes) {
      super(x, y, texture, type, facing, object);
    }
  
    render(container: Container): void {
      container.addChild(this.sprite);

    }
  }

export class RoadCornerCell extends RoadCell<CornerDirection, RoadCornerTypes> {

  constructor(x: number, y: number, texture: Texture, type: RoadCornerTypes, facing: CornerDirection, object: ObjectTypes) {
    super(x, y, texture, type, facing, object); // Временно указываем 'north', так как оно переопределяется
     // Переопределяем `facing` для углов
    this.facing = facing;
  }
  render(container: Container): void {
    container.addChild(this.sprite);
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
