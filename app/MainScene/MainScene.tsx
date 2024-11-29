import { Application, Assets, Container, Texture } from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';

import { generateMap } from '~/generation/MapGeneration';



const MainScene: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const mapContainerRef = useRef<Container | null>(null);
  const isDragging = useRef(false);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({
    width: 0,
    height: 0,
  });

  // Проверка, что код выполняется в браузере
  useEffect(() => {
    const start = async() => {

      
      if (typeof window !== 'undefined') {
        // Установим начальные размеры экрана с учетом хедера
        const headerHeight = window.innerWidth < 768 ? 50 : 90; // например, для мобильных 50px хедер, для десктопов - 60px
        setCanvasSize({
          width: window.innerWidth,
          height: window.innerHeight - headerHeight,
        });

        // Обработчик изменения размера окна
        const handleResize = () => {
          const headerHeight = window.innerWidth < 768 ? 50 : 90; // 50px на мобильных, 60px на десктопах
          setCanvasSize({
            width: window.innerWidth,
            height: window.innerHeight - headerHeight,
          });
        };

        // Добавляем обработчик изменения размера окна
        window.addEventListener('resize', handleResize);

        // Создаем приложение Pixi.js с динамическими размерами
        const app = new Application();
        await app.init({
          width: window.innerWidth,
          height: window.innerHeight - headerHeight, // Высота с учетом хедера
          backgroundColor: 0x1099bb,
          antialias: true,
        });
        appRef.current = app;

        const mapContainer = new Container();
          app.stage.addChild(mapContainer);
          mapContainerRef.current = mapContainer;

        // Добавляем canvas в DOM
        if (pixiContainerRef.current) {
          pixiContainerRef.current.appendChild(app.view as HTMLCanvasElement);
        }

        // Создаем контейнер и добавляем его в сцену
        // const container = new Container();
        // app.stage.addChild(container);
        
        const textures: Record<string, Texture> = {
          grass: await Assets.load('/assets/img/darkgrass.png'),
          water: await Assets.load('/assets/img/sea.png'),
          grassRoadNSOUTH: await Assets.load('/assets/img/darkgrass+road_NSOUTH.png'),
          grassRoadWEAST: await Assets.load('/assets/img/darkgrass+road_WEAST.png'),
          grassRoadCornerF_S_T_E: await Assets.load('/assets/img/darkgrass+road_F-SOUTH-T-EAST.png'),
          grassRoadCornerF_S_T_W: await Assets.load('/assets/img/darkgrass+road_F-SOUTH-T-WEST.png'),
          grassRoadCornerF_N_T_W: await Assets.load('/assets/img/darkgrass+road_F-NORTH-T-WEST.png'),
          grassRoadCornerF_N_T_E: await Assets.load('/assets/img/darkgrass+road_F-NORTH-T-EAST.png'),
          grassRiverE: await Assets.load('/assets/img/darkgrass+river_EAST.png'),
          grassRiverW: await Assets.load('/assets/img/darkgrass+river_WEST.png'),
      };

      // Генерируем карту
      const mapWidth = 64;
      const mapHeight = 64;
      const cellSize = 32;

      
    
    const map = generateMap(mapWidth, mapHeight, textures);
    
    map.forEach((row) => {
        row.forEach((cell) => {
            const sprite = cell.sprite;
            sprite.x = cell.x * cellSize;
            sprite.y = cell.y * cellSize;
            sprite.width = cellSize;
            sprite.height = cellSize;
            mapContainer.addChild(sprite);
        });
    });
    
    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 1) { // Средняя кнопка мыши (колесико)
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

  // Привязываем обработчики
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
        // Анимация: вращаем контейнер
        // Ticker.shared.add(() => {
        //   container.rotation += 0.01;
        // });

        // Очистка при размонтировании компонента
        return () => {
        
          window.removeEventListener('mousedown', onMouseDown);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          app.destroy(true, { children: true, texture: true });
          window.removeEventListener('resize', handleResize);
        };
      }
  }
  start();
  }, []); // Этот эффект сработает только один раз, при монтировании компонента

  return (
    <div
      ref={pixiContainerRef}
      className="flex justify-center items-center"
      style={{
        height: `${canvasSize.height}px`, // Высота с учетом хедера
      }}
    />
  );
};

export default MainScene;
