import {
  EMPTY,
} from '../constants';

class AI {
  constructor(config) {
    this.config = config || {};
  }

  process(map, rows, cols, x, y, turn) {
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        if (map[i][j] === EMPTY) {
          return {
            x: j,
            y: i,
          };
        }
      }
    }

    console.log(map);
    console.log(rows);
    console.log(cols);
    console.log(x);
    console.log(y);
    console.log(turn);
    console.log(this.config);

    return {
      x: 0,
      y: 0,
    };
  }
}

export default AI;
