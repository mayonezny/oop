import { Application, Assets, Container, Renderer, Texture } from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';

import { generateMap } from '~/generation/MapGeneration';
import { loadTextures } from '~/generation/TexturesList';

const MainScene: React.FC = () => {
  const pixiContainerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  const mapContainerRef = useRef<Container | null>(null);
  const isDragging = useRef(false);
  const isInitialized = useRef(false);
  const lastMousePosition = useRef<{ x: number; y: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number, height: number }>({
    width: 0,
    height: 0,
  });
  // Асинхронная функция загрузки текстур
  

  // Основная инициализация сцены
  
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
  
      const app = new Application<Renderer<HTMLCanvasElement>>();
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
  
      setupMouseHandlers(mapContainer);
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

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  };

//   useEffect(() => {
//     console.log('Pixi.js App:', appRef.current);
//     console.log('Pixi Container:', pixiContainerRef.current);
// }, []);

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
