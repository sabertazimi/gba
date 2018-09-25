import {
  EMPTY,
} from '../constants';

class AI {
  constructor(config) {
    this.config = config || {};
  }


  /**
   *
   *
   * @param {*} map current gobang board map
   * @param {number} rows board size
   * @param {number} cols board size
   * @param {number} x position last player setting
   * @param {number} y position last player setting
   * @param {number} color color of last player
   * @returns object of {x, y}
   * @memberof AI
   */
  process(map, rows, cols, x, y, color) {
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

    console.log(this.config);
    console.log(color);

    return {
      x: 0,
      y: 0,
    };
  }
}

export default AI;
