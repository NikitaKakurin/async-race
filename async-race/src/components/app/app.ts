import Controller from '../controller/controller';
import AppView from '../view/appView';

class App {
  private controller: Controller;

  private view: AppView;

  garagePage: number;

  winnersPage: number;

  id?: number;

  constructor() {
    this.controller = new Controller();
    this.view = new AppView();
    this.garagePage = 1;
    this.winnersPage = 1;
  }

  start(): void {
    this.view.drawContainer();
    this.controller.getCars(1, (data) => this.view.drawGarage(data));

    const handleClick = (e: Event) => {
      if (e.target === null) throw new Error('target is null');
      const target = e.target as HTMLElement;

      if (target.closest('#create-car')) {
        const color = this.view.createCarColor?.value;
        const name = this.view.createCarName?.value;
        if (name === undefined || color === undefined) throw new Error('name or color is undefined');
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
        const car = target.closest('.car') as HTMLElement | null;
        if (!car) throw new Error('selected car is not exist');
        const id = car.dataset?.id;
        if (!id) throw new Error("selected car don't have id");
        const numberId = +id;
        this.id = numberId;
        this.controller.getCar(numberId, (carObj) => {
          this.view.changeUpdateInputs(carObj);
        });
      }
      // if(){

      // }
    };
    document.addEventListener('click', handleClick);
  }
}

export default App;
