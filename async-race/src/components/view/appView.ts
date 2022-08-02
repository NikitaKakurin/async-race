import { ICar, IData } from '../typescript/type';
import container from '../utils/container';
import getGarage from '../utils/getGarage';

const getElById = (id: string) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`${id} is not exist`);
  return el as HTMLElement;
};

const getElBySelector = (selector: string, parent: HTMLDivElement) => {
  const el = parent.querySelector(selector);
  if (!el) throw new Error(`${selector} is not exist`);
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

  updateCarBtn?: HTMLButtonElement;

  previousPage?: HTMLButtonElement;

  nextPage?: HTMLButtonElement;

  drawGarage(data: IData) {
    if (this.garage === null) throw new Error('garage is not exist');
    this.garage = this.garage as HTMLDivElement;
    this.garage.innerHTML = '';
    this.garage.insertAdjacentHTML('afterbegin', getGarage(data));
    this.disablePagination(data);
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
    this.updateCarBtn = getElById('update-car') as HTMLButtonElement;
    this.nextPage = getElById('pagination__next') as HTMLButtonElement;
    this.previousPage = getElById('pagination__previous') as HTMLButtonElement;
  }

  changeUpdateInputs(carObj: ICar) {
    if (!this.updateCarColor || !this.updateCarName || !this.updateCarBtn) {
      throw new Error('update inputs is not exist');
    }
    const { updateCarColor, updateCarName, updateCarBtn } = this;
    updateCarColor.disabled = false;
    updateCarName.disabled = false;
    updateCarBtn.disabled = false;
    updateCarColor.value = carObj.color;
    updateCarName.value = carObj.name;
  }

  disableUpdateInputs() {
    if (!this.updateCarColor || !this.updateCarName || !this.updateCarBtn) {
      throw new Error('update inputs is not exist');
    }
    const { updateCarColor, updateCarName, updateCarBtn } = this;
    updateCarColor.disabled = true;
    updateCarName.disabled = true;
    updateCarBtn.disabled = true;
  }

  startCar(time: number, car: HTMLDivElement) {
    const carImage = getElBySelector('.car__image', car) as HTMLDivElement;
    const carWrapper = getElBySelector('.wrapper-image', car) as HTMLDivElement;
    const width = carWrapper.offsetWidth;
    console.log(width);
    carImage.style.transitionDuration = `${time}ms`;
    carImage.style.left = `${width - 120}px`;
    this.changeDisableBtn(car, '.car__btn-start', '.car__btn-stop');
  }

  stopCar(car: HTMLDivElement) {
    const carImage = getElBySelector('.car__image', car) as HTMLDivElement;
    carImage.style.transitionDuration = '';
    carImage.style.left = '70px';
    this.changeDisableBtn(car, '.car__btn-stop', '.car__btn-start');
  }

  breakCar(car: HTMLDivElement) {
    const carImage = getElBySelector('.car__image', car) as HTMLDivElement;
    const carWrapper = getElBySelector('.wrapper-image', car) as HTMLDivElement;
    const offsetLeft = carWrapper.getBoundingClientRect().left;
    const currentPosition = carImage.getBoundingClientRect().left;
    carImage.style.transitionDuration = '';
    carImage.style.left = `${currentPosition - offsetLeft}px`;
  }

  changeDisableBtn(car: HTMLDivElement, disabledClass: string, enabledClass: string) {
    const disabledEl = getElBySelector(disabledClass, car) as HTMLButtonElement;
    const enabledEL = getElBySelector(enabledClass, car) as HTMLButtonElement;
    disabledEl.disabled = true;
    enabledEL.disabled = false;
  }

  disablePagination(data: IData) {
    if (!this.previousPage || !this.nextPage) throw new Error('this.previousPage or this.nextPage is not exist');
    const prev = this.previousPage as HTMLButtonElement;
    const next = this.nextPage as HTMLButtonElement;
    if (data.currentPage === 1) {
      prev.disabled = true;
    } else {
      prev.disabled = false;
    }

    const totalPages = Math.ceil(data.totalCount / 7);
    if (totalPages === data.currentPage) {
      next.disabled = true;
    } else {
      next.disabled = false;
    }
  }
}

export default AppView;
