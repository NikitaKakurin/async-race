import { IData, CarsType } from '../typescript/type';

class Controller {
  readonly url: string;

  readonly garageUrl: string;

  readonly limitGarage: number;

  constructor() {
    this.url = 'http://127.0.0.1:3000';
    this.garageUrl = `${this.url}/garage`;
    this.limitGarage = 7;
  }

  async getCars(page: number, cb: (data: IData) => void) {
    console.log('getGArage');
    const path = `${this.garageUrl}?_page=[${page}]&_limit=[${this.limitGarage}]`;
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
}

export default Controller;
