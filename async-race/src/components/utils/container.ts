const container = `<div class="container">
    <header class="header">
      <button id="toGarageBtn" class="btn header__btn">to garage</button>
      <button id="toWinnersBtn" class="btn header__btn">to winners</button>
    </header>
    <div class="wrapper-garage" id="wrapper-garage">
      <form action="#" method="#">
        <div class="wrapper wrapper-color">
          <input type="text" id="name-create">
          <input type="color" name="color-create" id="color-create">
          <button id="create-car">create</button>
        </div>
        <div class="wrapper wrapper-color">
          <input type="text" id="name-update">
          <input type="color" name="color-update" id="color-update">
          <button id="update-car">update</button>
        </div>
        <div class="wrapper wrapper-buttons">
          <button id="race">race</button><button id="reset">reset</button><button id="generate-cars">Generate cars</button>
        </div>
      </form>
      <div class="garage" id="garage"></div>
    </div>
    <div class="wrapper-winners" id="wrapper-winners"></div>
    <div class="pagination">
      <button class="pagination__previous">previous page</button><button class="pagination__next">next page</button>
    </div>
  </div>`;

export default container;
