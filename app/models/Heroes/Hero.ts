import { Container, Sprite, Texture } from 'pixi.js';
import { CELL_SIZE } from '~/MainScene/MainScene';
import { UnifiedDirection } from '../Tiles/Road';
import { Cell, WaterCell } from '../Tiles/Cell';

export abstract class Hero {
  x: number;
  y: number;
  name: string;
  sprite: Sprite;
  map: Cell<UnifiedDirection, any>[][]
  type: string;
  speed: number;
  initHealth: number;
  currentHealth: number;
  initDamage: number;
  startItem: string | null;
  inventory: string[] = [];

  constructor(
    x: number,
    y: number,
    name: string,
    texture: Texture,
    map: Cell<UnifiedDirection, any>[][],
    type: string,
    speed: number,
    initHealth: number,
    initDamage: number,
    startItem?: string
  ) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.sprite = new Sprite(texture);
    this.map = map;
    this.type = type;
    this.speed = speed;
    this.initHealth = initHealth;
    this.currentHealth = initHealth; // Текущее здоровье
    this.initDamage = initDamage;
    this.startItem = startItem || null;

    if (this.startItem) {
      this.inventory.push(this.startItem); // Добавляем стартовый предмет в инвентарь
    }

    // Настройка спрайта
 // Центрируем спрайт
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  // Рендеринг героя на сцене
  render(container: Container): void {
    this.sprite.x = (this.x * CELL_SIZE);
    this.sprite.y = (this.y * CELL_SIZE);
    this.sprite.width = CELL_SIZE;
    this.sprite.height = CELL_SIZE * 2;
    container.addChild(this.sprite);
  }

  updateSize(cellSize: number): void {
    this.sprite.x = (this.x * cellSize);
    this.sprite.y = (this.y * cellSize);
    this.sprite.width = cellSize;
    this.sprite.height = cellSize * 2;
  }

 

  private isMoving: boolean = false;

move(dx: number, dy: number): void {
  if (this.isMoving) return;

  this.isMoving = true;
  const targetX = (this.x + dx) * CELL_SIZE;
  const targetY = (this.y + dy) * CELL_SIZE;

  const animate = () => {
    const distanceX = targetX - this.sprite.x;
    const distanceY = targetY - this.sprite.y;

    if (Math.abs(distanceX) < this.speed && Math.abs(distanceY) < this.speed && !(this.map[this.x][this.y] instanceof WaterCell)) {
      this.sprite.x = targetX;
      this.sprite.y = targetY;
      this.x += dx;
      this.y += dy;

      setTimeout(() => {
        this.isMoving = false;
      }, 200); // Задержка перед следующей анимацией

      return;
    }

    this.sprite.x += Math.sign(distanceX) * Math.min(this.speed, Math.abs(distanceX));
    this.sprite.y += Math.sign(distanceY) * Math.min(this.speed, Math.abs(distanceY));

    requestAnimationFrame(animate);
  };

  animate();
}

  
}

export class Tank extends Hero {
    constructor(x: number, y: number, name: string, type: string, texture: Texture, map: Cell<UnifiedDirection, any>[][], startItem?: string) {
      super(x, y, name, texture, map, type, 0.5, 200, 5, startItem);
    }
  
    // Добавим свои методы для воина (если нужно)
  }

export class Assasin extends Hero {
    constructor(x: number, y: number, name: string, type: string, texture: Texture, map: Cell<UnifiedDirection, any>[][], startItem?: string) {
      super(x, y, name, texture, map, type, 10, 500, 20, startItem);
    }
  
    // Добавим свои методы для воина (если нужно)
  }
  