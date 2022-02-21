import { IDimension, IPosition } from "./common.interface";

export interface ITruckCategory {
  id?: string;
  description: string;
  dimensions: IDimension;
  position: IPosition;
  volume: number;
  space: number;
}

/**
 * these categories was created base on this image
 * https://jojo-app.fr/wp-content/uploads/2019/07/les-volumes-des-camions-de-demenagements.jpg
 */
const categories: ITruckCategory[] = [
  {
    description: "A",
    dimensions: {
      height: 125,
      width: 165,
      length: 145,
    },
    position: {
      x0: 0,
      y0: 0,
      x1: 165,
      y1: 145,
    },
    volume: 3,
    space: 165 * 145,
  },
  {
    description: "B",
    dimensions: {
      height: 150,
      width: 160,
      length: 250,
    },
    position: {
      x0: 0,
      y0: 0,
      x1: 160,
      y1: 250,
    },
    volume: 6,
    space: 160 * 250,
  },
  {
    description: "C",
    dimensions: {
      height: 190,
      width: 180,
      length: 350,
    },
    position: {
      x0: 0,
      y0: 0,
      x1: 180,
      y1: 350,
    },
    volume: 12,
    space: 180 * 350,
  },
  {
    description: "D",
    dimensions: {
      height: 220,
      width: 210,
      length: 430,
    },
    position: {
      x0: 0,
      y0: 0,
      x1: 210,
      y1: 430,
    },
    volume: 20,
    space: 210 * 430,
  },
];

export { categories };
