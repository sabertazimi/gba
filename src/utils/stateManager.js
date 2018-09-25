import {
  EMPTY,
} from '../constants';

/**
 * @param {object} currentState {map, rows, cols, x, y, color}
 */
const countOnDirection = (xdir, ydir, currentState, cb, ...args) => {
  const {
    rows,
    cols,
    x,
    y,
  } = currentState;

  let count = 0;

  for (let step = 1; step <= 5; step += 1) {
    if (xdir !== 0 && ((x + xdir * step < 0) || x + xdir * step >= cols)) {
      break;
    }

    if (ydir !== 0 && ((y + ydir * step < 0) || y + ydir * step >= rows)) {
      break;
    }

    if (cb && cb(step, xdir, ydir, currentState, ...args)) {
      count += 1;
    } else {
      break;
    }
  }

  return count;
};

/**
 * @param {function} cb1 outer callback function (axisCount, currentState, ...args)
 * @param {function} cb2 inner callback function (step, xdir, ydir, currentState, ...args)
 * @param  {...any} args arguments to cb1 and cb2 function
 */
const countOnDirections = (directions, currentState, cb1, cb2, ...args) => {
  for (let i = 0; i < directions.length; i += 1) {
    let axisCount = 1;
    const axis = directions[i];

    for (let j = 0; j < axis.length; j += 1) {
      const xdir = axis[j][0];
      const ydir = axis[j][1];
      axisCount += countOnDirection(xdir, ydir, currentState, cb2, ...args);

      if (cb1 && cb1(axisCount, currentState, ...args)) {
        return true;
      }
    }
  }

  return false;
};

const StateManger = {
  saveState: (state) => {
    localStorage.setItem('gobang-state', JSON.stringify(state));
  },
  loadState: () => (JSON.parse(localStorage.getItem('gobang-state'))),
  checkResult: (map, rows, cols, x, y) => {
    const color = map[y][x];
    const directions = [
      [
        [-1, 0],
        [1, 0],
      ],
      [
        [0, -1],
        [0, 1],
      ],
      [
        [-1, 1],
        [1, -1],
      ],
      [
        [-1, -1],
        [1, 1],
      ],
    ];

    if (countOnDirections(directions, {
      map,
      rows,
      cols,
      x,
      y,
      color,
    }, axisCount => axisCount >= 5, (step, xdir, ydir, currentState) => {
      const {
        map: mapp,
        x: xx,
        y: yy,
        color: colorr,
      } = currentState;

      return mapp[yy + ydir * step][xx + xdir * step] === colorr;
    })) {
      return color;
    }

    return EMPTY;
  },
};

export default StateManger;
