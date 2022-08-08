export interface ICar {
  name?: string;
  color?: string;
  time?: number;
  wins?: number;
  id: number;
}

export interface IWinner {
  time: number;
  wins: number;
  id: number;
}
export type CarsType = ICar[];

export type WinnersType = IWinner[];
export interface IData {
  limit: number;
  currentPage: number;
  totalCount: number;
  cars?: CarsType;
}

export interface IDataWinners {
  currentPage: number;
  totalCount: number;
  winners?: WinnersType;
}
