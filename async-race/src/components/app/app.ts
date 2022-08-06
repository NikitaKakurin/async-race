import Controller from '../controller/controller';
import { IDataGarage } from '../typescript/type';
import AppView from '../view/appView';

const getCarElAndID = (target: HTMLElement) => {
  const car = target.closest('.car') as HTMLDivElement | null;
  if (!car) throw new Error('selected car is not exist');
  const id = car.dataset?.id;
  if (!id) throw new Error("selected car don't have id");
  const numberId = +id;
  return { car, numberId };
};

const getCarByID = (id: number) => {
  const car = document.querySelector(`.car[data-id="${id}"]`);
  if (!car) throw new Error('selected car is not exist');
  return car as HTMLDivElement;
};

interface IRaceTimeById {
  [x: number]: number;
}

class App {
  private controller: Controller;

  private view: AppView;

  garagePage: number;

  winnersPage: number;

  id?: number;

  timeObj: IRaceTimeById;

  constructor() {
    this.controller = new Controller();
    this.view = new AppView();
    this.garagePage = 1;
    this.winnersPage = 1;
    this.timeObj = {};
  }

  start(): void {
    this.view.drawContainer();
    this.controller.getCars(1, (data) => this.view.drawGarage(data));

    const handleClick = (e: Event) => {
      if (e.target === null) throw new Error('target is null');
      const target = e.target as HTMLElement;

      if (target.closest('#toGarageBtn')) {
        this.controller.getCars(this.controller.pageGarage, (data) => this.view.drawGarage(data));
        return;
      }

      if (target.closest('#toWinnersBtn')) {
        this.controller.getWinners(this.controller.pageWinners, (data) =>
          this.view.drawWinners(data)
        );
        return;
      }

      if (target.closest('#create-car')) {
        const color = this.view.createCarColor?.value;
        const name = this.view.createCarName?.value;
        if (name === undefined || color === undefined)
          throw new Error('name or color is undefined');
        this.controller.createCar(name, color, (data) => this.view.drawGarage(data));
        return;
      }

      if (target.closest('#update-car')) {
        const color = this.view.updateCarColor?.value;
        const name = this.view.updateCarName?.value;
        if (name === undefined || color === undefined || this.id === undefined) {
          throw new Error('name or color or this.id is undefined');
        }
        const { id } = this;
        this.controller.updateCar(id, name, color, (data) => this.view.drawGarage(data));
        this.view.disableUpdateInputs();
        return;
      }

      if (target.closest('.car__btn-select')) {
        const { numberId } = getCarElAndID(target);
        this.id = numberId;
        this.controller.getCar(numberId, (carObj) => {
          this.view.changeUpdateInputs(carObj);
        });
        return;
      }

      if (target.closest('.car__btn-remove')) {
        const { numberId } = getCarElAndID(target);
        this.id = numberId;
        this.controller.removeCar(numberId, (data) => this.view.drawGarage(data));
        return;
      }

      if (target.closest('.car__btn-start')) {
        (target.closest('.car__btn-start') as HTMLButtonElement).disabled = true;
        const { car, numberId } = getCarElAndID(target);
        this.id = numberId;
        this.controller.startCar(numberId, (timeTransition) => {
          this.view.startCar(timeTransition, car);

          this.controller.driveCar(numberId, (isOk: boolean) => {
            if (isOk) return;
            this.view.breakCar(car);
          });
        });
        return;
      }

      if (target.closest('#race')) {
        this.timeObj = {};
        let winnersId = 0;
        this.view.disableBtn('#race');
        this.controller.startRace((param) => {
          const { time, id } = param;
          this.timeObj[id] = time;
          const car = getCarByID(id);
          this.view.startCar(time, car);
          this.controller.driveCar(id, (isOk: boolean) => {
            if (!isOk) {
              this.view.breakCar(car);
              return;
            }
            if (winnersId) return;
            winnersId = id;
            this.controller.getCar(id, (data) => {
              this.view.enableBtn('#reset');
              this.view.showModal(data, this.timeObj[data.id]);
            });
          });
        });
      }

      if (target.closest('#reset')) {
        this.view.disableBtn('#reset');
        this.view.disableAllBtn('.car__btn-stop');
        this.controller.resetRace((id) => {
          const car = getCarByID(id);
          this.view.stopCar(car);
          this.view.enableBtn('#race');
        });
      }

      if (target.closest('.car__btn-stop')) {
        const { car, numberId } = getCarElAndID(target);
        this.id = numberId;
        this.controller.stopCar(numberId, () => {
          this.view.stopCar(car);
        });
        return;
      }

      if (target.closest('#generate-cars')) {
        this.controller.generateCars((data) => this.view.drawGarage(data));
        return;
      }

      if (target.closest('#pagination__next')) {
        this.controller.nextPage((data) => this.view.drawGarage(data));
        return;
      }

      if (target.closest('#pagination__previous')) {
        this.controller.prevPage((data) => this.view.drawGarage(data));
      }
    };
    document.addEventListener('click', handleClick);
  }
}

export default App;
