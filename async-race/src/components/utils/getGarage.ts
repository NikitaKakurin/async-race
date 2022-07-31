import { IData, CarsType } from '../typescript/type';
import getCarSVG from './getCarSvg';

const getPageCars = (cars: CarsType) => {
  const allCars = cars.map((carObj) => {
    const car = `<div class="car" data-id="${carObj.id}">
        <div class="wrapper wrapper-buttons">
          <button class="car__btn-select">select</button>
          <button class="car__btn-remove">remove</button>
          <h3 class="car__model">${carObj.name}</h3>
        </div>
        <div class="wrapper wrapper-image">
          <button class="car__btn-start">A</button>
          <button class="car__btn-stop" disabled>B</button>
          ${getCarSVG(carObj.color, 64, 25)}
          <div class="car__flag">
          </div>
        </div>
      </div>`;
    return car;
  });
  return allCars.join('\n');
};

const getGarage = (data: IData): string => {
  const { page, totalCount, cars } = data;
  const garage = `<h2>garage(${totalCount})</h2>
  <h3>page #${page}</h3>
  ${getPageCars(cars)}`;
  return garage;
};

export default getGarage;
