import { IData, CarsType } from '../typescript/type';
import getCarSVG from './getCarSvg';

export const form = `<form action="#" method="#" id="garage-form">
  <div class="wrapper wrapper-color">
    <input type="text"><input type="color" name="color-create" id="color-create"><button>create</button>
  </div>
  <div class="wrapper wrapper-color">
    <input type="text"><input type="color" name="color-update" id="color-update"><button>update</button>
  </div>
  <div class="wrapper wrapper-buttons">
    <button id="race">race</button><button id="reset">reset</button><button id="generate-cars">Generate cars</button>
  </div>
  </form>`;

const getPageCars = (cars: CarsType) => {
  const allCars = cars.map((carObj) => {
    const car = `<div class="car">
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

export const getGarage = (data: IData): string => {
  const { page, totalCount, cars } = data;
  const garage = `<h2>garage(${totalCount})</h2>
  <h3>page #${page}</h3>
  ${getPageCars(cars)}
`;
  return garage;
};
