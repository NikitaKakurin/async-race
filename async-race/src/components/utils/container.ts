const container = `<div class="container">
    <header class="header">
      <button id="toGarageBtn" class="btn header__btn">to garage</button>
      <button id="toWinnersBtn" class="btn header__btn">to winners</button>
    </header>
    <div class="wrapper-garage" id="wrapper-garage">
      <form action="#" method="#">
        <div class="wrapper wrapper-color">
          <input type="text"><input type="color" name="color-create" id="color-create"><button>create</button>
        </div>
        <div class="wrapper wrapper-color">
          <input type="text"><input type="color" name="color-update" id="color-update"><button>update</button>
        </div>
        <div class="wrapper wrapper-buttons">
          <button id="race">race</button><button id="reset">reset</button><button id="generate-cars">Generate cars</button>
        </div>
      </form>
      <div class="garage" id="garage"></div>
    </div>
    <div class="wrapper-winners" id="wrapper-winners"></div>
  </div>`;

export default container;
