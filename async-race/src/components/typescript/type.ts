export interface ICar {
  name: string;
  color: string;
  id: number;
}

export interface IWinner {
  time: number;
  wins: number;
  id: number;
}
export type CarsType = ICar[];

export type WinnersType = IWinner[];
export interface IDataGarage {
  currentPage: number;
  totalCount: number;
  cars: CarsType;
}

export interface IDataWinners {
  currentPage: number;
  totalCount: number;
  units: WinnersType;
}
