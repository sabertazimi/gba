import {
  EMPTY,
  DEATH,
} from '../constants';

const StateManger = {
  saveState: (state) => {
    localStorage.setItem('gobang-state', JSON.stringify(state));
  },
  loadState: () => (JSON.parse(localStorage.getItem('gobang-state'))),
  isDeadGame: (map, rows, cols) => {
    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        if (map[i][j] === EMPTY) {
          return false;
        }
      }
    }

    return true;
  },
  /**
   * @param {object} currentState {map, rows, cols, x, y, color}
   */
  countOnDirection: (currentState, xdir, ydir, step, cb, ...args) => {
    const {
      rows,
      cols,
      x,
      y,
    } = currentState;

    let count = 0;

    for (let i = 1; i <= step; i += 1) {
      if (xdir !== 0 && ((x + xdir * i < 0) || x + xdir * i >= cols)) {
        break;
      }

      if (ydir !== 0 && ((y + ydir * i < 0) || y + ydir * i >= rows)) {
        break;
      }

      if (cb && cb(currentState, xdir, ydir, i, ...args)) {
        count += 1;
      }
    }

    return count;
  },
  /**
   * @param {function} cb1 outer callback function (currentState, axisCount, ...args)
   * @param {function} cb2 inner callback function (currentState, xdir, ydir, step, ...args)
   * @param  {...any} args arguments to cb1 and cb2 function
   */
  countOnDirections: function countOnDirections(currentState, directions, step, cb1, cb2, ...args) {
    let count = 0;

    for (let i = 0; i < directions.length; i += 1) {
      let axisCount = 0;
      const axis = directions[i];
      const xdir = axis[0];
      const ydir = axis[1];

      axisCount += this.countOnDirection(currentState, xdir, ydir, step, cb2, ...args);

      if (cb1 && cb1(currentState, axisCount, ...args)) {
        count += 1;
      }
    }

    return count;
  },
  /**
   * @param {function} cb1 outer callback function (currentState, axisCount, ...args)
   * @param {function} cb2 inner callback function (currentState, xdir, ydir, step, ...args)
   * @param  {...any} args arguments to cb1 and cb2 function
   */
  judgeOnDirections: function judgeOnDirections(currentState, directions, step, cb1, cb2, ...args) {
    for (let i = 0; i < directions.length; i += 1) {
      let axisCount = 0;
      const axis = directions[i];
      const xdir = axis[0];
      const ydir = axis[1];
      axisCount += this.countOnDirection(currentState, xdir, ydir, step, cb2, ...args);

      if (cb1 && cb1(currentState, axisCount, ...args)) {
        return true;
      }
    }

    return false;
  },
  checkResult: function checkResult(currentState) {
    const {
      map,
      rows,
      cols,
      color,
    } = currentState;

    if (this.isDeadGame(map, rows, cols)) {
      return DEATH;
    }

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
      [1, 1],
    ];

    if (this.judgeOnDirections(currentState, directions, 4,
      (_, axisCount) => axisCount >= 4, (state, xdir, ydir, step) => {
        const {
          map: mapp,
          x: xx,
          y: yy,
          color: colorr,
        } = state;

        return mapp[yy + ydir * step][xx + xdir * step] === colorr;
      })) {
      return color;
    }

    return EMPTY;
  },
};

export default StateManger;
