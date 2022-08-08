import { ICar, IData } from '../typescript/type';
import container from '../utils/container';
import getGarage from '../utils/getGarage';
import getWinners from '../utils/getWinners';

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

  winners?: HTMLDivElement;

  createCarColor?: HTMLInputElement;

  createCarName?: HTMLInputElement;

  updateCarColor?: HTMLInputElement;

  updateCarName?: HTMLInputElement;

  updateCarBtn?: HTMLButtonElement;

  previousPage?: HTMLButtonElement;

  nextPage?: HTMLButtonElement;

  clearGarageAndWinners() {
    if (this.garage === null) throw new Error('garage is not exist');
    this.garage = this.garage as HTMLDivElement;
    this.garage.innerHTML = '';
    if (this.winners === null) throw new Error('winners is not exist');
    this.winners = this.winners as HTMLDivElement;
    this.winners.innerHTML = '';
  }

  drawGarage(data: IData) {
    this.clearGarageAndWinners();
    (this.garage as HTMLDivElement).insertAdjacentHTML('afterbegin', getGarage(data));
    this.getElementsGarage();
    this.disablePagination(data);
  }

  drawWinners(data: IData) {
    this.clearGarageAndWinners();
    (this.winners as HTMLDivElement).insertAdjacentHTML('afterbegin', getWinners(data));
    this.disablePagination(data);
  }

  drawContainer() {
    document.body.insertAdjacentHTML('afterbegin', container);
    this.getElementsContainer();
  }

  getElementsContainer() {
    this.garageWrapper = getElById('wrapper-garage') as HTMLDivElement;
    this.winnersWrapper = getElById('wrapper-winners') as HTMLDivElement;
    this.garage = getElById('garage') as HTMLDivElement;
    this.winners = getElById('winners') as HTMLDivElement;
    this.nextPage = getElById('pagination__next') as HTMLButtonElement;
    this.previousPage = getElById('pagination__previous') as HTMLButtonElement;
  }

  getElementsGarage() {
    this.createCarColor = getElById('color-create') as HTMLInputElement;
    this.createCarName = getElById('name-create') as HTMLInputElement;
    this.updateCarColor = getElById('color-update') as HTMLInputElement;
    this.updateCarName = getElById('name-update') as HTMLInputElement;
    this.updateCarBtn = getElById('update-car') as HTMLButtonElement;
  }

  changeUpdateInputs(carObj: ICar) {
    if (!this.updateCarColor || !this.updateCarName || !this.updateCarBtn) {
      throw new Error('update inputs is not exist');
    }
    if (typeof carObj.color !== 'string') throw new Error('color is not string');
    if (typeof carObj.name !== 'string') throw new Error('name is not string');
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

  changeDisableBtn(car: HTMLDivElement, disabledSelector: string, enabledSelector: string) {
    const disabledEl = getElBySelector(disabledSelector, car) as HTMLButtonElement;
    const enabledEL = getElBySelector(enabledSelector, car) as HTMLButtonElement;
    disabledEl.disabled = true;
    enabledEL.disabled = false;
  }

  showModal(data: ICar, time: number) {
    const { name, id } = data;
    const fixedTime = (time / 1000).toFixed(2);
    const modal = getElById('modal') as HTMLDivElement;
    const modalText = getElById('modal__text') as HTMLDivElement;
    const modalClose = getElById('modal__close') as HTMLDivElement;
    modalText.textContent = `${name} #${id} ${fixedTime}s`;
    modal.classList.add('modal-show');
    modalClose.addEventListener(
      'click',
      () => {
        modal.classList.remove('modal-show');
      },
      { once: true }
    );
  }

  disableAllBtn(className: string) {
    const allStopButtons = Array.from(document.querySelectorAll(className));
    allStopButtons.forEach((el) => {
      if (el.tagName !== 'BUTTON') throw new Error(`stop button is not button (${el.tagName})`);
      const elem = el as HTMLButtonElement;
      elem.disabled = true;
    });
  }

  disableBtn(disabledSelector: string) {
    const el = document.querySelector(disabledSelector);
    if (!el) throw new Error('button is not exist');
    (el as HTMLButtonElement).disabled = true;
  }

  enableBtn(enableSelector: string) {
    const el = document.querySelector(enableSelector);
    if (!el) throw new Error('button is not exist');
    (el as HTMLButtonElement).disabled = false;
  }

  disablePagination(data: IData) {
    if (!this.previousPage || !this.nextPage) {
      throw new Error('this.previousPage or this.nextPage is not exist');
    }
    const { currentPage, totalCount, limit } = data;
    const prev = this.previousPage as HTMLButtonElement;
    const next = this.nextPage as HTMLButtonElement;
    if (currentPage === 1) {
      prev.disabled = true;
    } else {
      prev.disabled = false;
    }

    const totalPages = Math.ceil(totalCount / limit);
    if (totalPages === currentPage) {
      next.disabled = true;
    } else {
      next.disabled = false;
    }
  }
}

export default AppView;
