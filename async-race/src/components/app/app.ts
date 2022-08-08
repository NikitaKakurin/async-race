import Controller from '../controller/controller';
import { IData } from '../typescript/type';
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
    const { controller, view } = this;
    view.drawContainer();
    const drawGarage = (data: IData) => view.drawGarage(data);
    const drawWinners = (data: IData) => view.drawWinners(data);
    controller.getCars(1, drawGarage);

    const handleClick = (e: Event) => {
      if (e.target === null) throw new Error('target is null');
      const target = e.target as HTMLElement;

      if (target.closest('#toGarageBtn')) {
        controller.getCars(controller.pageGarage, drawGarage);
        return;
      }

      if (target.closest('#toWinnersBtn')) {
        controller.getWinners(controller.pageWinners, drawWinners, 'id', 'ASC');
        return;
      }

      if (target.closest('#winners__time')) {
        controller.getWinnersByTime(drawWinners);
        return;
      }

      if (target.closest('#winners__wins')) {
        controller.getWinnersByWins(drawWinners);
        return;
      }

      if (target.closest('#create-car')) {
        const color = view.createCarColor?.value;
        const name = view.createCarName?.value;
        if (name === undefined || color === undefined) {
          throw new Error('name or color is undefined');
        }
        controller.createCar(name, color, drawGarage);
        return;
      }

      if (target.closest('#update-car')) {
        const color = view.updateCarColor?.value;
        const name = view.updateCarName?.value;
        if (name === undefined || color === undefined || this.id === undefined) {
          throw new Error('name or color or id is undefined');
        }
        const { id } = this;
        controller.updateCar(id, name, color, drawGarage);
        view.disableUpdateInputs();
        return;
      }

      if (target.closest('.car__btn-select')) {
        const { numberId } = getCarElAndID(target);
        this.id = numberId;
        controller.getCar(numberId, (carObj) => {
          view.changeUpdateInputs(carObj);
        });
        return;
      }

      if (target.closest('.car__btn-remove')) {
        const { numberId } = getCarElAndID(target);
        this.id = numberId;
        controller.removeCar(numberId, drawGarage);
        return;
      }

      if (target.closest('.car__btn-start')) {
        (target.closest('.car__btn-start') as HTMLButtonElement).disabled = true;
        const { car, numberId } = getCarElAndID(target);
        this.id = numberId;
        controller.startCar(numberId, (timeTransition) => {
          view.startCar(timeTransition, car);

          controller.driveCar(numberId, (isOk: boolean) => {
            if (isOk) return;
            view.breakCar(car);
          });
        });
        return;
      }

      if (target.closest('#race')) {
        this.timeObj = {};
        let winnersId = 0;
        view.disableBtn('#race');
        controller.startRace((param) => {
          const { time, id } = param;
          this.timeObj[id] = time;
          const car = getCarByID(id);
          view.startCar(time, car);
          controller.driveCar(id, (isOk: boolean) => {
            if (!isOk) {
              view.breakCar(car);
              return;
            }
            if (winnersId) return;
            winnersId = id;
            controller.getCar(id, (data) => {
              view.enableBtn('#reset');
              view.showModal(data, this.timeObj[data.id]);
              controller.addWinner(id, time);
            });
          });
        });
      }

      if (target.closest('#reset')) {
        view.disableBtn('#reset');
        view.disableAllBtn('.car__btn-stop');
        controller.resetRace((id) => {
          const car = getCarByID(id);
          view.stopCar(car);
          view.enableBtn('#race');
        });
      }

      if (target.closest('.car__btn-stop')) {
        const { car, numberId } = getCarElAndID(target);
        this.id = numberId;
        controller.stopCar(numberId, () => {
          view.stopCar(car);
        });
        return;
      }

      if (target.closest('#generate-cars')) {
        controller.generateCars(drawGarage);
        return;
      }

      if (target.closest('#pagination__next')) {
        if (controller.isRenderGarage) {
          controller.nextPage(drawGarage);
          return;
        }
        controller.nextPage(drawWinners);
        return;
      }

      if (target.closest('#pagination__previous')) {
        if (controller.isRenderGarage) {
          controller.prevPage(drawGarage);
          return;
        }
        controller.prevPage(drawWinners);
      }
    };
    document.addEventListener('click', handleClick);
  }
}

export default App;
