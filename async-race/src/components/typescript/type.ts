export interface ICar {
  name: string;
  color: string;
  id: number;
}
export type CarsType = ICar[];

export interface IData {
  currentPage: number;
  totalCount: number;
  cars: CarsType;
}
