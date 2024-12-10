import { Assets, Texture } from "pixi.js";

export const loadHeroAssets = async (): Promise<Record<string, Texture>> => {
    return {
      hachim: await Assets.load('/assets/img/hakimdzhoni.png'),
      lexKrivov: await Assets.load('/assets/img/LexKrivov.png'),
      main: await Assets.load('/assets/img/mainWarrior.png')
    };
  };

