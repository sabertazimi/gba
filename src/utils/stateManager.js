import {
  EMPTY,
  DEATH,
} from '../constants';

import MapVisitor from './mapVisitor';

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

    let axisFlag = 0;
    let axisCount = 0;

    if (MapVisitor.countOnDirections(currentState, directions, 4,
      (state, xdir, ydir, step) => {
        const {
          map: mapp,
          x: xx,
          y: yy,
          color: colorr,
        } = state;

        return mapp[yy + ydir * step][xx + xdir * step] === colorr;
      }, (_, __, ___, curCount) => {
        if (axisFlag === 0) {
          axisFlag = 1;
          axisCount += curCount;
          return false;
        }

        const count = axisCount + curCount;
        axisFlag = 0;
        axisCount = 0;
        return count >= 4;
      })) {
      return color;
    }

    return EMPTY;
  },
};

export default StateManger;
