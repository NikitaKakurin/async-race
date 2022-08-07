import { IData, CarsType, ICar, IDataWinners, IWinner, WinnersType } from '../typescript/type';
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

type UnitType = ICar | IWinner;
type IDataUnits = IData | IDataWinners;
type UnitsType = UnitType[];

class Controller {
  readonly url: string;

  readonly garageUrl: string;

  readonly garageLimit: number;

  readonly winnersLimit: number;

  pageGarage: number;

  pageWinners: number;

  totalCount?: number;

  arrayRaceCars?: IRaceParam[];

  winnersUrl: string;

  constructor() {
    this.url = 'http://127.0.0.1:3000';
    this.garageUrl = `${this.url}/garage`;
    this.winnersUrl = `${this.url}/winners`;
    this.garageLimit = 7;
    this.winnersLimit = 10;
    this.pageGarage = 1;
    this.pageWinners = 1;
  }

  async getUnits(page: number, cb: (data: IData) => void, pathUrl: string, limit: number) {
    const currentPage = page;
    const path = `${pathUrl}?_page=${page}&_limit=${limit}`;
    const response = await fetch(path);
    const cars: CarsType = await response.json();
    const totalCountString = await response.headers.get('X-Total-Count');
    if (totalCountString === null || Number.isNaN(+totalCountString)) {
      throw new Error('X-Total-Count is null or not number');
    }

    const totalCount = +totalCountString;
    this.totalCount = totalCount;
    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages) {
      this.getUnits(totalPages, cb, pathUrl, limit);
    }
    const result = {
      currentPage,
      totalCount,
      cars,
    };
    if (pathUrl !== this.winnersUrl) {
      return cb(result);
    }
    const arr = result.cars.map(async (car) => {
      const pathCar = `${this.garageUrl}/${car.id}`;
      const responseCar = await fetch(pathCar);
      const res: ICar = await responseCar.json();
      return res;
    });
    Promise.all(arr)
      .then((carsArr) => {
        debugger;
        carsArr.forEach((car, index) => {
          const res = result.cars[index];
          res.color = car.color;
          res.name = car.name;
        });
      })
      .then(() => cb(result));
  }

  // async getWinnerParam(arr: CarsType) {
  //   const promArr = arr.reduce(async (acc, car): CarsType => {
  //     const pathCar = `${this.garageUrl}/${car.id}`;
  //     const responseCar = await fetch(pathCar);
  //     const res: ICar = await responseCar.json();
  //     acc.push(res);
  //     return acc;
  //   }, []);
  // }

  async getCars(page: number, cb: (data: IData) => void) {
    this.pageGarage = page;
    this.getUnits(page, cb, this.garageUrl, this.garageLimit);
  }

  async getWinners(page: number, cb: (data: IData) => void) {
    this.pageWinners = page;
    this.getUnits(page, cb, this.winnersUrl, this.winnersLimit);
  }
  // async getCars(page: number, cb: (data: IData) => void) {
  //   this.pageGarage = page;
  //   const currentPage = page;
  //   const path = `${this.garageUrl}?_page=${page}&_limit=${this.limitGarage}`;
  //   const response = await fetch(path);
  //   const cars: CarsType = await response.json();
  //   const totalCountString = await response.headers.get('X-Total-Count');
  //   if (totalCountString === null || Number.isNaN(+totalCountString)) {
  //     throw new Error('X-Total-Count is null or not number');
  //   }

  //   const totalCount = +totalCountString;
  //   this.totalCount = totalCount;
  //   const totalPages = Math.ceil(totalCount / 7);
  //   if (this.pageGarage > totalPages) {
  //     this.getCars(totalPages, cb);
  //     return;
  //   }

  //   const result = {
  //     currentPage,
  //     totalCount,
  //     cars,
  //   };
  //   cb(result);
  // }

  async getWinner(id: number, cb: (car: UnitType) => void) {
    this.getUnit(this.winnersUrl, id, cb);
  }

  async getCar(id: number, cb: (car: ICar) => void) {
    this.getUnit(this.garageUrl, id, cb);
  }

  async getUnit(pathUrl: string, id: number, cb: (car: UnitType) => void) {
    const path = `${pathUrl}/${id}`;
    const response = await fetch(path);
    const res: UnitType = await response.json();
    if (pathUrl === this.garageUrl) {
      const result = res as ICar;
      cb(result);
      return;
    }
    cb(res as IWinner);
  }

  // async getCar(id: number, cb: (car: ICar) => void) {
  //   const path = `${this.garageUrl}/${id}`;
  //   const response = await fetch(path);
  //   const car: ICar = await response.json();
  //   cb(car);
  // }

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
    const res = await response.json();
    if (cb) {
      this.getCars(page, cb);
    }
    return res;
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
    const param = await (await this.sendStatusCar(id, 'started'))
      .json()
      .then(getTransitionTime, null);
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
      if (!cars) throw new Error('cars is not exist');
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
