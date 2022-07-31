import Controller from '../controller/controller';
import AppView from '../view/appView';

class App {
  private controller: Controller;

  private view: AppView;

  garagePage: number;

  winnersPage: number;

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
      }
    };
    document.addEventListener('click', handleClick);
  }
}

export default App;
