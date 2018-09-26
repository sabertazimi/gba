import {
  EMPTY,
} from '../constants';

class AI {
  constructor(config) {
    this.config = config || {};
  }

  /**
   * @param {object} currentState
   */
  generateScoreMap(currentState) {
    const {
      rows,
      cols,
    } = currentState;

    if (!this.scoreMap) {
      this.scoreMap = [];

      for (let i = 0; i < rows; i += 1) {
        this.scoreMap[i] = new Array(cols);

        for (let j = 0; j < cols; j += 1) {
          this.scoreMap[i][j] = 0;
        }
      }
    }
  }

  /**
   * @param {matrix} map
   */
  getMaxPoint(currentState) {
    const {
      map,
      rows,
      cols,
    } = currentState;

    let maxScore = 0;
    const maxPoint = {
      x: -1,
      y: -1,
    };

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        if (map[i][j] === EMPTY && this.scoreMap[i][j] > maxScore) {
          maxScore = this.scoreMap[i][j];
          maxPoint.x = j;
          maxPoint.y = i;
        }
      }
    }

    return maxPoint;
  }

  /**
   * @param {array} map current gobang board map
   * @param {number} rows board size
   * @param {number} cols board size
   * @param {number} x position last player setting
   * @param {number} y position last player setting
   * @param {number} color color of last player
   * @returns object of {x, y} if x === -1 || y === -1, disable AI (PvP mode)
   * @memberof AI
   */
  process(currentState) {
    this.generateScoreMap(currentState);
    const maxPoint = this.getMaxPoint(currentState);
    return maxPoint;
  }
}

export default AI;
