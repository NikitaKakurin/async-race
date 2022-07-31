import Controller from '../controller/controller';
import AppView from '../view/appView';

class App {
  private controller: Controller;

  private view: AppView;

  constructor() {
    this.controller = new Controller();
    this.view = new AppView();
  }

  start(): void {
    this.view.drawContainer();
    this.controller.getCars(1, (data) => this.view.drawGarage(data));
  }
}

export default App;
