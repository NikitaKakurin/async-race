import { IData, CarsType, ICar } from '../typescript/type';
import { brands, models } from '../utils/carsNames';
import getRandomHexColor from '../utils/getRandomHexColor';

interface ISpeedData {
  velocity: number;
  distance: number;
}
class Controller {
  readonly url: string;

  readonly garageUrl: string;

  readonly limitGarage: number;

  pageGarage: number;

  totalCount?: number;

  constructor() {
    this.url = 'http://127.0.0.1:3000';
    this.garageUrl = `${this.url}/garage`;
    this.limitGarage = 7;
    this.pageGarage = 1;
  }

  async getCars(page: number, cb: (data: IData) => void) {
    this.pageGarage = page;
    const currentPage = page;
    console.log('getGArage');
    const path = `${this.garageUrl}?_page=${page}&_limit=${this.limitGarage}`;
    const response = await fetch(path);
    const cars: CarsType = await response.json();
    const totalCountString = await response.headers.get('X-Total-Count');
    if (totalCountString === null || Number.isNaN(+totalCountString)) {
      throw new Error('X-Total-Count is null or not number');
    }
    debugger;
    const totalCount = +totalCountString;
    this.totalCount = totalCount;
    const totalPages = Math.ceil(totalCount / 7);
    if (this.pageGarage > totalPages) {
      this.getCars(totalPages, cb);
      return;
    }

    const result = {
      currentPage,
      totalCount,
      cars,
    };
    cb(result);
  }

  async getCar(id: number, cb: (car: ICar) => void) {
    const path = `${this.garageUrl}/${id}`;
    const response = await fetch(path);
    const car: ICar = await response.json();
    cb(car);
  }

  async removeCar(id: number, cb: (data: IData) => void) {
    const path = `${this.garageUrl}/${id}`;
    const response = await fetch(path, {
      method: 'DELETE',
    });
    await response.json();
    this.getCars(this.pageGarage, cb);
  }

  async createCar(name: string, color: string, cb?: (data: IData) => void) {
    const param = { name, color };
    const { pageGarage: page } = this;
    const response = await fetch(this.garageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    await response.json();
    if (cb) {
      this.getCars(page, cb);
    }
  }

  generateCars(cb: (data: IData) => void) {
    console.log('generate');

    const brandsLength = brands.length;
    const modelLength = brands.length;
    const createCarPromises = [];
    for (let i = 0; i < 100; i += 1) {
      const randomBrand = brands[Math.floor(Math.random() * brandsLength)];
      const randomModel = models[Math.floor(Math.random() * modelLength)];
      const name = `${randomBrand} ${randomModel}`;
      const color = getRandomHexColor();
      createCarPromises.push(this.createCar(name, color));
    }
    Promise.all(createCarPromises).then(() => {
      this.getCars(this.pageGarage, cb);
    });
  }

  async updateCar(id: number, name: string, color: string, cb: (data: IData) => void) {
    const param = { name, color };
    const { pageGarage: page } = this;
    const response = await fetch(`${this.garageUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    await response.json();
    this.getCars(page, cb);
  }

  async startCar(id: number, cb: (data: number) => void) {
    const response = await fetch(`${this.url}/engine?id=${id}&status=started`, {
      method: 'PATCH',
    });
    const getTransitionTime = (data: ISpeedData) => data.distance / data.velocity;
    const param = await response.json().then(getTransitionTime, null);
    cb(param);
  }

  async driveCar(id: number, cb: (data: boolean) => void) {
    const response = await fetch(`${this.url}/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    const res = await response.ok;
    cb(res);
  }

  async stopCar(id: number, cb: () => void) {
    const response = await fetch(`${this.url}/engine?id=${id}&status=stopped`, {
      method: 'PATCH',
    });
    const res = await response.ok;
    cb();
  }

  nextPage(cb: (data: IData) => void) {
    if (!this.totalCount) throw new Error('this.totalCount is not exist');
    if (this.pageGarage + 1 > this.totalCount) return;
    this.pageGarage += 1;
    this.getCars(this.pageGarage, cb);
  }

  prevPage(cb: (data: IData) => void) {
    if (!this.totalCount) throw new Error('this.totalCount is not exist');
    if (this.pageGarage === 1) return;
    this.pageGarage -= 1;
    this.getCars(this.pageGarage, cb);
  }
}

export default Controller;
