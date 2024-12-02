import { Application, Texture, Container } from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';

import { generateMap } from '~/generation/MapGeneration';
import { loadTextures } from '~/AssetLoad/TexturesList';
import { RoadCell, RoadCornerCell } from '~/models/Tiles/Cell';

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

    setupMouseHandlers(mapContainer);
    setupKeyboardHandlers(mapContainer);
  };

  const setupMouseHandlers = (mapContainer: Container) => {
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
