import { Application, Texture, Container } from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';

import { generateMap } from '~/generation/MapGeneration';
import { loadTextures } from '~/AssetLoad/TexturesList';
import { Cell, RoadCell, RoadCornerCell, WaterCell } from '~/models/Tiles/Cell';
import { loadHeroAssets } from '~/AssetLoad/HeroesList';
import { Assasin, Hero, Tank, Warrior } from '~/models/Heroes/Hero';
import { UnifiedDirection } from '~/models/Tiles/Road';

export let MAP_WIDTH = 128;
export let MAP_HEIGHT = 128;
export let CELL_SIZE = 32;

const MainScene: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const mapContainerRef = useRef<Container | null>(null);
  const mapRef = useRef<any[][]>([]); // Ссылка на карту
  const isDragging = useRef(false);
  const isInitialized = useRef(false);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({
    width: 0,
    height: 0,
  });

  // Асинхронная функция загрузки текстур
  const initializeScene = async () => {
    if (isInitialized.current) {
      console.log('Инициализация пропущена');
      return;
    }
    isInitialized.current = true;

    const textures = await loadTextures();

    const heroAssets = await loadHeroAssets();

    const headerHeight = window.innerWidth < 768 ? 50 : 90;
    setCanvasSize({
      width: window.innerWidth,
      height: window.innerHeight - headerHeight,
    });

    const app = new Application();
    await app.init({
      width: window.innerWidth,
      height: window.innerHeight - headerHeight,
      backgroundColor: 0x1099bb,
      antialias: true,
    });
    appRef.current = app;

    if (pixiContainerRef.current && app.renderer.view.canvas) {
      pixiContainerRef.current.appendChild(app.renderer.view.canvas as HTMLCanvasElement);
    } else {
      console.error('Failed to append PIXI canvas: view is undefined.');
    }

    const mapContainer = new Container();
    app.stage.addChild(mapContainer);
    mapContainerRef.current = mapContainer;

    const map = generateMap(MAP_WIDTH, MAP_HEIGHT, textures);
    mapRef.current = map; // Сохраняем ссылку на карту

    map.forEach((row) => {
      row.forEach((cell) => {
        
        const sprite = cell.sprite;

        sprite.x = cell.x * CELL_SIZE;
        sprite.y = cell.y * CELL_SIZE;
        sprite.width = CELL_SIZE;
        sprite.height = CELL_SIZE;
        cell.render(mapContainer);
        
      });
    });
    const heroesContainer: Hero[] = [
      new Tank(0, 0, 'Hachim the Solaris', 'VeryFatTank', heroAssets.hachim, map, mapContainer, 'AI'),
      new Assasin(0, 0, 'Lex Krivov the Dark Assasin', 'DaggerMaster', heroAssets.lexKrivov, map, mapContainer, 'Player'),
      new Warrior(0, 0, 'Boris Mayonezny, the defender of Provansal', 'MilitaryMan', heroAssets.main, map, mapContainer, 'AI')
    ];
    // const hachim = new Tank(10, 10, 'Hachim the Solaris', 'VeryFatTank', heroAssets.hachim, map, mapContainer, 'AI');
    // const lexanKrivo = new Assasin(1, 1, 'Lex Krivov the Dark Assasin', 'DaggerMaster', heroAssets.lexKrivov, map, mapContainer, 'Player');
    spawnHeroesRandomly(heroesContainer, map, MAP_WIDTH, MAP_HEIGHT);
    setupMouseHandlers(mapContainer, heroesContainer);
    setupKeyboardHandlers(mapContainer);
    heroesContainer.forEach((ivan: Hero) => {
      if(ivan.control === 'Player'){
        setupKeyboardControls(ivan);
      }
      else{
        
        setInterval(() => {ivan.wander(MAP_WIDTH, MAP_HEIGHT);}, 1000);
      }
    })
    //setupKeyboardControls(heroesContainer.forEach());
  };

  function spawnHeroesRandomly(
    heroes: Hero[], 
    map: Cell<UnifiedDirection, any>[][], 
    widthSize: number, 
    heightSize: number
  ): void {
    // Собираем список всех клеток
    const availableCells: { x: number; y: number }[] = [];
    for (let x = 0; x < widthSize; x++) {
      for (let y = 0; y < heightSize; y++) {
        if (map[x][y].object === 'empty' && !(map[x][y] instanceof WaterCell)) {
          availableCells.push({ x, y });
        }
      }
    }
  
    // Перемешиваем список
    availableCells.sort(() => Math.random() - 0.5);
  
    // Спавним героев
    heroes.forEach((hero) => {
      if (availableCells.length > 0) {
        const spawnCell = availableCells.pop(); // Берём последнюю свободную клетку
        if (spawnCell) {
          hero.x = spawnCell.x;
          hero.y = spawnCell.y;
          hero.render(hero['container']); // Рендерим героя на сцене
          console.log(`${hero.name} заспавнен на (${hero.x}, ${hero.y})`);
        }
      } else {
        console.warn(`Не удалось заспавнить ${hero.name}: нет свободных клеток`);
      }
    });
  }
  

  const setupMouseHandlers = (mapContainer: Container, heroes: Hero[]) => {
    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 1) {
        event.preventDefault();
        isDragging.current = true;
        lastMousePosition.current = { x: event.clientX, y: event.clientY };
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDragging.current && lastMousePosition.current) {
        const dx = event.clientX - lastMousePosition.current.x;
        const dy = event.clientY - lastMousePosition.current.y;

        mapContainer.x += dx;
        mapContainer.y += dy;

        lastMousePosition.current = { x: event.clientX, y: event.clientY };
      }
    };

    const onMouseUp = (event: MouseEvent) => {
      if (event.button === 1) {
        isDragging.current = false;
        lastMousePosition.current = null;
      }
    };

    const onWheelChange = (event: WheelEvent) => {
      event.preventDefault();
      let newCellSize = CELL_SIZE;
      heroes.forEach((ivan) => {
        ivan.updateSize(CELL_SIZE);
      });
      // Получаем позицию курсора относительно карты
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const mouseWorldX = (mouseX - mapContainer.x) / CELL_SIZE;
      const mouseWorldY = (mouseY - mapContainer.y) / CELL_SIZE;

      if (event.deltaY < 0) {
        if (newCellSize < 64) {
          newCellSize += 8;
        }
      } else if (event.deltaY > 0) {
        if (newCellSize > 16) {
          newCellSize -= 8;
        }
      }

      if (newCellSize !== CELL_SIZE) {
        // Обновляем CELL_SIZE
        const scaleRatio = newCellSize / CELL_SIZE; // Коэффициент масштабирования

        // Обновляем размер клетки
        CELL_SIZE = newCellSize;

        // Обновляем размеры и положение всех спрайтов
        mapRef.current.forEach((row) => {
          row.forEach((cell) => {
            const sprite = cell.sprite;
            sprite.x = cell.x * CELL_SIZE;
            sprite.y = cell.y * CELL_SIZE;
            sprite.width = CELL_SIZE;
            sprite.height = CELL_SIZE;
          });
        });
        heroes.forEach((hero: Hero) => {
          resizeHero(hero);
        });
        
        
        // Перемещаем карту так, чтобы курсор остался в центре
        mapContainer.x -= (mouseX - mapContainer.x) * (scaleRatio - 1);
        mapContainer.y -= (mouseY - mapContainer.y) * (scaleRatio - 1); 
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onWheelChange, { passive: false });

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('wheel', onWheelChange);
    };
  };

  const setupKeyboardHandlers = (mapContainer: Container) => {
    const onKeyDown = (event: KeyboardEvent) => {

      const moveSpeed = 1; // Скорость перемещения камеры
      const scaleFactor = CELL_SIZE;
      event.preventDefault();
      switch (event.key) {
        case 'ArrowUp':
          mapContainer.y += moveSpeed * scaleFactor;
          break;
        case 'ArrowDown':
          mapContainer.y -= moveSpeed * scaleFactor;
          break;
        case 'ArrowLeft':
          mapContainer.x += moveSpeed * scaleFactor;
          break;
        case 'ArrowRight':
          mapContainer.x -= moveSpeed * scaleFactor;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  };

  const setupKeyboardControls = (hero: Hero) => {
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if(hero.getHealth() <= 0){ console.log('алееееееее, ты умер'); }
      else{

      
        switch (event.key.toLowerCase()) {
          case 'w': // Вверх
            hero.move(0, -1);
            break;
          case 'a': // Влево
            hero.move(-1, 0);
            break;
          case 's': // Вниз
            hero.move(0, 1);
            break;
          case 'd': // Вправо
            hero.move(1, 0);
            break;
        }
      }
    };
  
    // Добавляем обработчик событий
    window.addEventListener('keydown', handleKeyDown);
  };
  const resizeHero = (hero: Hero) => {
    hero.updateSize(CELL_SIZE);
  }

  useEffect(() => {
    initializeScene();
    
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
      }
    };
  }, []);


  return (
    <div
      ref={pixiContainerRef}
      className="flex justify-center items-center"
      style={{
        height: `${canvasSize.height}px`,
      }}
    />
  );
};

export default MainScene;
