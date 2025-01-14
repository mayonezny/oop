import { Assets, Texture } from "pixi.js";

export const loadItems = async (): Promise<Record<string, Texture>> => {
    return {
      heal: await Assets.load('/assets/img/klubnichka.png'),
    };
  };

