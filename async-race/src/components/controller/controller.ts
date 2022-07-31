import { IData, CarsType, ICar } from '../typescript/type';

class Controller {
  readonly url: string;

  readonly garageUrl: string;

  readonly limitGarage: number;

  page: number;

  constructor() {
    this.url = 'http://127.0.0.1:3000';
    this.garageUrl = `${this.url}/garage`;
    this.limitGarage = 7;
    this.page = 1;
  }

  async getCars(page: number, cb: (data: IData) => void) {
    this.page = page;
    console.log('getGArage');
    const path = `${this.garageUrl}?_page=${page}&_limit=${this.limitGarage}`;
    const response = await fetch(path);
    const cars: CarsType = await response.json();
    const totalCount = await response.headers.get('X-Total-Count');
    const result = {
      page,
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

  async createCar(name: string, color: string, cb: (data: IData) => void) {
    const param = { name, color };
    const { page } = this;
    const response = await fetch(this.garageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    await response.json();
    this.getCars(page, cb);
  }

  async updateCar(id: number, name: string, color: string, cb: (data: IData) => void) {
    const param = { name, color };
    const { page } = this;
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
}

export default Controller;
