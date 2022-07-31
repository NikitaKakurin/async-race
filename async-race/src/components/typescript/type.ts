export interface ICar {
  name: string;
  color: string;
  id: number;
}
export type CarsType = ICar[];

export interface IData {
  page: number;
  totalCount: string | null;
  cars: CarsType;
}
