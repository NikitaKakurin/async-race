import { IData, CarsType } from '../typescript/type';

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

  async createCar(name: string, color: string, cb: (data: IData) => void) {
    const param = { name, color };
    const response = await fetch(this.garageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(param),
    });
    await response.json();
    this.getCars(this.page, cb);
  }
}

export default Controller;
