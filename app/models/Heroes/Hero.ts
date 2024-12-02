import { Container, Sprite, Texture } from 'pixi.js';
import { CELL_SIZE } from '~/MainScene/MainScene';

export abstract class Hero {
  x: number;
  y: number;
  name: string;
  sprite: Sprite;
  type: string;
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
    type: string,
    initHealth: number,
    initDamage: number,
    startItem?: string
  ) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.sprite = new Sprite(texture);
    this.type = type;
    this.initHealth = initHealth;
    this.currentHealth = initHealth; // Текущее здоровье
    this.initDamage = initDamage;
    this.startItem = startItem || null;

    if (this.startItem) {
      this.inventory.push(this.startItem); // Добавляем стартовый предмет в инвентарь
    }

    // Настройка спрайта
    this.sprite.anchor.set(0.5); // Центрируем спрайт
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  // Рендеринг героя на сцене
  render(container: Container): void {
    this.sprite.x = (this.x * CELL_SIZE) / 2;
    this.sprite.y = (this.y * CELL_SIZE) / 2;
    this.sprite.width = CELL_SIZE;
    this.sprite.height = CELL_SIZE * 2;
    container.addChild(this.sprite);
  }

  updateSize(cellSize: number): void {
    this.sprite.x = (this.x * cellSize) / 2;
    this.sprite.y = (this.y * cellSize) / 2;
    this.sprite.width = cellSize;
    this.sprite.height = cellSize * 2;
  }

  // Перемещение героя 
  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
    this.sprite.x = (this.x * CELL_SIZE) / 2;
    this.sprite.y = (this.y * CELL_SIZE) / 2;
    console.log(`${this.name} переместился на (${this.x}, ${this.y})`);
  }
}

export class Tank extends Hero {
    constructor(x: number, y: number, name: string, texture: Texture) {
      super(x, y, name, texture, 'fatman', 200, 5, 'zhir');
    }
  
    // Добавим свои методы для воина (если нужно)
  }
  