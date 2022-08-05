import { IData, CarsType, ICar } from '../typescript/type';
import { brands, models } from '../utils/carsNames';
import getRandomHexColor from '../utils/getRandomHexColor';

interface ISpeedData {
  velocity: number;
  distance: number;
}

interface IRaceParam {
  time: number;
  id: number;
}

interface IResetParam {
  isOk: boolean;
  id: number;
}

class Controller {
  readonly url: string;

  readonly garageUrl: string;

  readonly limitGarage: number;

  pageGarage: number;

  totalCount?: number;

  arrayRaceCars?: IRaceParam[];

  constructor() {
    this.url = 'http://127.0.0.1:3000';
    this.garageUrl = `${this.url}/garage`;
    this.limitGarage = 7;
    this.pageGarage = 1;
  }

  async getCars(page: number, cb: (data: IData) => void) {
    this.pageGarage = page;
    const currentPage = page;
    const path = `${this.garageUrl}?_page=${page}&_limit=${this.limitGarage}`;
    const response = await fetch(path);
    const cars: CarsType = await response.json();
    const totalCountString = await response.headers.get('X-Total-Count');
    if (totalCountString === null || Number.isNaN(+totalCountString)) {
      throw new Error('X-Total-Count is null or not number');
    }

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

  async sendStatusCar(id: number, status: string) {
    const response = await fetch(`${this.url}/engine?id=${id}&status=${status}`, {
      method: 'PATCH',
    });
    return response;
  }

  async startCar(id: number, cb: (time: number, id?: number) => void) {
    const getTransitionTime = (data: ISpeedData) => data.distance / data.velocity;
    const param = await (await this.sendStatusCar(id, 'started')).json().then(getTransitionTime, null);
    cb(param);
  }

  async driveCar(id: number, cb: (data: boolean) => void) {
    const res = (await this.sendStatusCar(id, 'drive')).ok;
    cb(res);
  }

  async stopCar(id: number, cb: () => void) {
    const res = (await this.sendStatusCar(id, 'stopped')).ok;
    cb();
  }

  async startRace(cb: (param: IRaceParam) => void) {
    const page = this.pageGarage;
    this.getCars(page, (data) => {
      const { cars } = data;
      const allStartCars = cars.map(async (car) => {
        const getTransitionTime = (param: ISpeedData) => {
          const time = param.distance / param.velocity;
          const { id } = car;
          return { time, id };
        };
        const response = await this.sendStatusCar(car.id, 'started');
        return response.json().then(getTransitionTime);
      });
      Promise.all(allStartCars).then((arr) => {
        this.arrayRaceCars = arr;
        arr.forEach(cb);
      });
    });
  }

  async resetRace(cb: (id: number) => void) {
    this.arrayRaceCars?.forEach(async (data) => {
      const { id } = data;
      const isOk = (await this.sendStatusCar(id, 'stopped')).ok;
      cb(id);
    });
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
