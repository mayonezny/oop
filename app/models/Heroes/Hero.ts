import { Container, Sprite, Texture } from 'pixi.js';

abstract class Hero {
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
    container.addChild(this.sprite);
  }

  // Перемещение героя
  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    console.log(`${this.name} переместился на (${this.x}, ${this.y})`);
  }
}

class Tank extends Hero {
    constructor(x: number, y: number, name: string, texture: Texture) {
      super(x, y, name, texture, 'fatman', 200, 5, 'zhir');
    }
  
    // Добавим свои методы для воина (если нужно)
  }
  