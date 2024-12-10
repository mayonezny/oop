import { Container, Sprite, Texture } from 'pixi.js';
import { CELL_SIZE } from '~/MainScene/MainScene';
import { UnifiedDirection } from '../Tiles/Road';
import { Cell, WaterCell } from '../Tiles/Cell';
import { Item } from '../Items/Item';

export type Control = 'Player' | 'AI';

export abstract class Hero {
  x: number;
  y: number;
  name: string;
  sprite: Sprite;
  map: Cell<UnifiedDirection, any>[][]
  type: string;
  private speed: number;
  initHealth: number;
  private currentHealth: number;
  initDamage: number;
  private currentDamage: number;
  startItem: string | null;
  inventory: string[] = [];
  private container: Container;
  control: Control;

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
    container: Container,
    control: Control,
    startItem?: string,
    
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
    this.currentDamage = initDamage;
    this.startItem = startItem || null;
    this.control = control
    this.container = container;

    if (this.startItem) {
      this.inventory.push(this.startItem); // Добавляем стартовый предмет в инвентарь
    }

    // Настройка спрайта
 // Центрируем спрайт
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  public getHealth = (): number => {
    return this.currentHealth;
  }
  
  public setHealth = (health: number): void => {
    this.currentHealth = health;
  }

  public getSpeed = (): number => {
    return this.speed;
  }
  
  public setSpeed = (speed: number): void => {
    this.speed = speed;
  }

  public getDamage = (): number => {
    return this.currentDamage;
  }
  
  public setDamage = (damage: number): void => {
    this.currentDamage = damage;
  }

  // Рендеринг героя на сцене
  render(container: Container): void {
    
    

    
    this.sprite.x = (this.x * CELL_SIZE);
    this.sprite.y = (this.y * CELL_SIZE);
    this.sprite.width = CELL_SIZE;
    this.sprite.height = CELL_SIZE * 2;
    container.addChild(this.sprite);
    if(this.map[this.x][this.y].object === 'empty' || this.map[this.x][this.y].object instanceof Item){
      this.map[this.x][this.y].object = this;
    }
    //this.map[this.x][this.y].object = this;
  
    
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
  
      // Если достигли целевой клетки
      if (Math.abs(distanceX) < this.speed && Math.abs(distanceY) < this.speed) {
        // Освобождаем текущую клетку
        if (this.map[this.x][this.y].object === this) {
          this.map[this.x][this.y].object = 'empty';
        }
  
        // Проверяем наличие врага в целевой клетке
        const targetCell = this.map[this.x + dx][this.y + dy];
        if (targetCell.object instanceof Hero && targetCell.object !== this) {
          console.log(`${this.name} атакует ${targetCell.object.name}!`);
          this.attack(targetCell.object);
        } else {
          // Перемещаем героя
          this.x += dx;
          this.y += dy;
  
          // Устанавливаем героя в новой клетке
          this.map[this.x][this.y].object = this;
        }
  
        // Обновляем координаты спрайта
        this.sprite.x = this.x * CELL_SIZE;
        this.sprite.y = this.y * CELL_SIZE;
  
        this.isMoving = false;
        return;
      }
  
      // Перемещаем спрайт на шаг
      this.sprite.x += Math.sign(distanceX) * Math.min(this.speed, Math.abs(distanceX));
      this.sprite.y += Math.sign(distanceY) * Math.min(this.speed, Math.abs(distanceY));
  
      requestAnimationFrame(animate);
    };
  
    animate();
  }
  
  
  

attack(enemy: any){
    
    if(enemy.dodge(this)){ console.log(`${enemy.name} задоджил атаку ${this.name}!`); }
    
    else{
      enemy.setHealth(enemy.getHealth() - this.getDamage());
      console.log(`${enemy.name} получает по шапке! Здоровье: ${enemy.getHealth()}`);
    }
    
    this.setHealth(this.getHealth() - enemy.getDamage());
    console.log(`${this.name} получает по шапке! Здоровье: ${this.getHealth()}`);
  
    if(enemy.getHealth() <= 0 || this.getHealth() <= 0){
      console.log('сосал? кто-то из вас сдох: Ты: ', this.getHealth(), " Иван: ", enemy.getHealth());
      if(enemy.getHealth() <= 0){ enemy.die(); }
      else{ this.die(); }
    }
  
}

die() {
  console.log(`${this.name} погиб.`);
  this.map[this.x][this.y].object = 'empty';
  if (this.container.children.includes(this.sprite)) {
    this.container.removeChild(this.sprite);
  }
}

wander(mapWidth: number, mapHeight: number): void {
  if (this.getHealth() <= 0) {
      console.log(`${this.name} is dead and cannot move.`);
      return;
  }

  // Случайное направление: 0 - вверх, 1 - вниз, 2 - влево, 3 - вправо
  const direction = Math.floor(Math.random() * 4);

  let newX = this.x;
  let newY = this.y;

  switch (direction) {
      case 0: // Вверх
          newY--;
          break;
      case 1: // Вниз
          newY++;
          break;
      case 2: // Влево
          newX--;
          break;
      case 3: // Вправо
          newX++;
          break;
  }

  // Проверка на пределы карты
  if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight) {
      this.move(newX - this.x, newY - this.y); // Вычисляем смещение и перемещаем
      console.log(`${this.name} moved to (${this.x}, ${this.y}).`);
  } else {
      console.log(`${this.name} tried to move out of bounds.`);
  }
}

  
}

export class Tank extends Hero {
    constructor(x: number, y: number, name: string, type: string, texture: Texture, map: Cell<UnifiedDirection, any>[][], container: Container, control: Control, startItem?: string) {
      super(x, y, name, texture, map, type, 0.5, 300, 20, container, control, startItem);
    }
  
    // Добавим свои методы для воина (если нужно)
  }

export class Assasin extends Hero {
    constructor(x: number, y: number, name: string, type: string, texture: Texture, map: Cell<UnifiedDirection, any>[][], container: Container, control: Control, startItem?: string) {
      super(x, y, name, texture, map, type, 10, 100, 50, container, control, startItem);
    }
    override attack(enemy: any): void {
    
        enemy.setHealth(enemy.getHealth() - this.getDamage());
        console.log(`${enemy.name} получает по шапке! Здоровье: ${enemy.getHealth()}`);
        if(this.dodge(enemy)){ console.log(`${this.name} задоджил атаку ${enemy.name}!`); }
        else{
          this.setHealth(this.getHealth() - enemy.getDamage());
          console.log(`${this.name} получает по шапке! Здоровье: ${this.getHealth()}`);
        }

        if(enemy.getHealth() <= 0 || this.getHealth() <= 0){
          console.log('сосал? кто-то из вас сдох: Ты: ', this.getHealth(), " Иван: ", enemy.getHealth());
          if(enemy.getHealth() <= 0){ enemy.die(); }
          else{ this.die(); }
        }
      
    }
      dodge(enemy: any): boolean{
        let dodgeChance: number = 0.2;
        if(!(this instanceof Assasin)) return false;
        if(enemy instanceof Tank){
          dodgeChance = 0.7;
          return Math.random() < dodgeChance;
        }
        else if(enemy instanceof Warrior){
          dodgeChance = 0.4;
          return Math.random() < dodgeChance;
        }
        else{
          return Math.random() < dodgeChance;
        }

      }
    // Добавим свои методы для воина (если нужно)
  }

  export class Warrior extends Hero {
    constructor(x: number, y: number, name: string, type: string, texture: Texture, map: Cell<UnifiedDirection, any>[][], container: Container, control: Control, startItem?: string) {
      super(x, y, name, texture, map, type, 5, 170, 30, container, control, startItem);
    }
  
    // Добавим свои методы для воина (если нужно)
  }
  