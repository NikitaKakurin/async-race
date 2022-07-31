import { IData } from '../typescript/type';
import container from '../utils/container';
import { garage } from '../utils/garage';

class AppView {
  garageWrapper: HTMLDivElement | null;

  winnersWrapper: HTMLDivElement | null;

  garage: HTMLDivElement | null;

  constructor() {
    this.garageWrapper = null;
    this.winnersWrapper = null;
    this.garage = null;
  }

  drawGarage(data: IData) {
    debugger;
    const { page, totalCount, cars } = data;
    if (this.garage === null) throw new Error('garage is not exist');
    this.garage = this.garage as HTMLDivElement;
    this.garage.insertAdjacentHTML('afterbegin', garage);
  }

  drawContainer() {
    document.body.insertAdjacentHTML('afterbegin', container);
    if (!document.getElementById('wrapper-garage')) throw new Error('wrapper-garage is not exist');
    this.garageWrapper = document.getElementById('wrapper-garage') as HTMLDivElement;

    if (!document.getElementById('wrapper-winners')) throw new Error('wrapper-winners is not exist');
    this.winnersWrapper = document.getElementById('wrapper-winners') as HTMLDivElement;

    if (!document.getElementById('garage')) throw new Error('garage is not exist');
    this.garage = document.getElementById('garage') as HTMLDivElement;
  }
}

export default AppView;
