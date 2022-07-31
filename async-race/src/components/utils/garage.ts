export const form = `<form action="#" method="#" id="garage-form">
  <div class="wrapper wrapper-color">
    <input type="text"><input type="color" name="color-create" id="color-create"><button>create</button>
  </div>
  <div class="wrapper wrapper-color">
    <input type="text"><input type="color" name="color-update" id="color-update"><button>update</button>
  </div>
  <div class="wrapper wrapper-buttons">
    <button id="race">race</button><button id="reset">reset</button><button id="generate-cars">Generate cars</button>
  </div>
  </form>`;

export const garage = `<h2>garage(7)</h2>
  <h3>page #1</h3>
  <div class="car">
    <div class="wrapper wrapper-buttons">
      <button class="car__btn-select">select</button>
      <button class="car__btn-remove">remove</button>
      <h3 class="car__model">tesla s100</h3>
    </div>
    <div class="wrapper wrapper-image">
      <button class="car__btn-start">A</button>
      <button class="car__btn-stop" disabled>B</button>
      <div class="car__image">
      <svg class="icon" width="85" height="32" fill="red">
        <use xlink:href="../assets/svg/sprite.svg#car"></use>
      </svg>
      </div>
      <div class="car__flag"> 
      </div>
    </div>
  </div>`;
