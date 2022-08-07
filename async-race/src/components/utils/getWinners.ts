import { IData, CarsType } from '../typescript/type';
import getCarSVG from './getCarSvg';

const getPageWinners = (winners: CarsType, page: number) => {
  const allWinners = winners.map((winnerObj, index) => {
    console.log(winnerObj);
    // eslint-disable-next-line object-curly-newline
    const { color, name, time, wins } = winnerObj;
    const WinnersNumber = (page - 1) * 10 + index + 1;
    if (typeof color !== 'string') throw new Error('color is not string');
    if (typeof time !== 'number') throw new Error('time is not number');
    if (typeof wins !== 'number') throw new Error('wins is not number');
    const winner = `<div class="winners__tbody_tr winners__row">
        <div class="winners__td winners__number">${WinnersNumber}</div>
        <div class="winners__td winners__car">${getCarSVG(color, 64, 25, 'winner-image')}</div>
        <div class="winners__td winners__name">${name}</div>
        <div class="winners__td winners__wins">${wins}</div>
        <div class="winners__td winners__time">${time}</div>
      </div>`;
    return winner;
  });
  return allWinners.join('\n');
};

const getWinners = (data: IData) => {
  const { totalCount, currentPage, cars } = data;
  console.log(data);
  if (!cars) throw new Error('cars is not exist');
  const winners = `
  <h2> Winners(${totalCount})</h2>
  <h3> Page #${currentPage}</h3>
  <div class="winners__table">
    <div class="winners__th winners__row">
      <div class="winners__td winners__number">№</div>
      <div class="winners__td winners__car">Car</div>
      <div class="winners__td winners__name">Name</div>
      <div class="winners__td winners__wins">Wins</div>
      <div class="winners__td winners__time">Best Time, s</div>
    </div>
    <div class="winners__tbody">
      ${getPageWinners(cars, currentPage)}
    </div>
  </div>
  `;
  return winners;
};

export default getWinners;
