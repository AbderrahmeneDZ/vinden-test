import { IPosition } from "./common.interface";

export interface ISpace {
  id: string;
  space: number;
  level: number;
  height: number;
  position: IPosition;
}
