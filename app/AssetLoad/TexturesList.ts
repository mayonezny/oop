import { Assets, Texture } from "pixi.js";

export const loadTextures = async (): Promise<Record<string, Texture>> => {
    return {
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
  };

