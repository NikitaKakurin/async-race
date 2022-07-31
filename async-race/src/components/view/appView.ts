import { IData } from '../typescript/type';
import container from '../utils/container';
import { getGarage } from '../utils/garage';

const getElById = (id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`${id} is not exist`);
  return el as HTMLElement;
};
class AppView {
  garageWrapper?: HTMLDivElement;

  winnersWrapper?: HTMLDivElement;

  garage?: HTMLDivElement;

  createCarColor?: HTMLInputElement;

  createCarName?: HTMLInputElement;

  updateCarColor?: HTMLInputElement;

  updateCarName?: HTMLInputElement;

  drawGarage(data: IData) {
    const { page, totalCount, cars } = data;
    if (this.garage === null) throw new Error('garage is not exist');
    this.garage = this.garage as HTMLDivElement;
    this.garage.innerHTML = '';
    this.garage.insertAdjacentHTML('afterbegin', getGarage(data));
  }

  drawContainer() {
    document.body.insertAdjacentHTML('afterbegin', container);
    this.getElements();
  }

  getElements() {
    this.garageWrapper = getElById('wrapper-garage') as HTMLDivElement;
    this.winnersWrapper = getElById('wrapper-winners') as HTMLDivElement;
    this.garage = getElById('garage') as HTMLDivElement;
    this.createCarColor = getElById('color-create') as HTMLInputElement;
    this.createCarName = getElById('name-create') as HTMLInputElement;
    this.updateCarColor = getElById('color-update') as HTMLInputElement;
    this.updateCarName = getElById('name-update') as HTMLInputElement;
  }
}

export default AppView;
