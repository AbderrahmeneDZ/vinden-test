import { IPosition } from "./common.interface";

export interface IFurnitureItem {
  id?: string;
  space?: number;
  width: number;
  height: number;
  length: number;
}

export interface IFurnitureItemPosition {
  truckId: String;
  item: IFurnitureItem;
  level: number;
  position: IPosition;
}
