import {
  EMPTY,
  Score,
  AIMode,
} from '../constants';

import {
  MapVisitor,
} from '../utils';

class AI {
  constructor(config) {
    this.config = config || {};
    this.mode = this.config.defaultMode || AIMode.EASY;
  }

  /**
   * @param {object} currentState
   */
  generateScoreMap(currentState) {
    const {
      map,
      rows,
      cols,
      color,
    } = currentState;

    if (!this.scoreMap) {
      this.scoreMap = [];

      for (let i = 0; i < rows; i += 1) {
        this.scoreMap[i] = new Array(cols);

        for (let j = 0; j < cols; j += 1) {
          this.scoreMap[i][j] = 0;
        }
      }
    } else {
      for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < cols; j += 1) {
          this.scoreMap[i][j] = 0;
        }
      }
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

    let humanColorCount = 0;
    let aiColorCount = 0;
    let emptyColorCount = 0;
    let axisFlag = 0;

    const humanCB1 = (state, xdir, ydir, step) => {
      const {
        map: mapp,
        x,
        y,
        color: hcolor,
      } = state;

      const currentColor = mapp[y + ydir * step][x + xdir * step];
      if (currentColor === hcolor) {
        humanColorCount += 1;
        return true;
      }

      if (currentColor === EMPTY) {
        emptyColorCount += 1;
      }

      return false;
    };

    const humanCB2 = (state) => {
      if (axisFlag === 0) {
        axisFlag += 1;
        return true;
      }

      const {
        x,
        y,
      } = state;

      switch (humanColorCount) {
        case 1:
          this.scoreMap[y][x] += Score.Kill2;
          break;
        case 2:
          if (emptyColorCount === 1) {
            this.scoreMap[y][x] += Score.Kill3_1;
          } else if (emptyColorCount === 2) {
            this.scoreMap[y][x] += Score.Kill3_2;
          }
          break;
        case 3:
          if (emptyColorCount === 1) {
            this.scoreMap[y][x] += Score.Kill4_1;
          } else if (emptyColorCount === 2) {
            this.scoreMap[y][x] += Score.Kill4_2;
          }
          break;
        case 4:
          this.scoreMap[y][x] += Score.Kill5;
          break;
        default:
          break;
      }

      humanColorCount = 0;
      emptyColorCount = 0;
      axisFlag = 0;

      return true;
    };

    const aiCB1 = (state, xdir, ydir, step) => {
      const {
        map: mapp,
        x,
        y,
        color: hcolor,
      } = state;

      const currentColor = mapp[y + ydir * step][x + xdir * step];

      if (currentColor === EMPTY) {
        emptyColorCount += 1;
        return false;
      }

      if (currentColor !== hcolor) {
        aiColorCount += 1;
        return true;
      }

      return false;
    };

    const aiCB2 = (state) => {
      if (axisFlag === 0) {
        axisFlag += 1;
        return true;
      }

      const {
        x,
        y,
      } = state;

      switch (aiColorCount) {
        case 0:
          this.scoreMap[y][x] += Score.Live1;
          break;
        case 1:
          this.scoreMap[y][x] += Score.Live2;
          break;
        case 2:
          if (emptyColorCount === 1) {
            this.scoreMap[y][x] += Score.Dead3;
          } else if (emptyColorCount === 2) {
            this.scoreMap[y][x] += Score.Live3;
          }
          break;
        case 3:
          if (emptyColorCount === 1) {
            this.scoreMap[y][x] += Score.Dead4;
          } else if (emptyColorCount === 2) {
            this.scoreMap[y][x] += Score.Live4;
          }
          break;
        case 4:
          this.scoreMap[y][x] += Score.Live5;
          break;
        default:
          break;
      }

      aiColorCount = 0;
      emptyColorCount = 0;
      axisFlag = 0;

      return true;
    };


    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        if (map[i][j] === EMPTY) {
          MapVisitor.countOnDirections({
            map,
            rows,
            cols,
            x: j,
            y: i,
            color,
          }, directions, 4, humanCB1, humanCB2);
          MapVisitor.countOnDirections({
            map,
            rows,
            cols,
            x: j,
            y: i,
            color,
          }, directions, 4, aiCB1, aiCB2);
        }
      }
    }
  }

  getMaxPointByScoreMap(currentState) {
    const {
      map,
      rows,
      cols,
    } = currentState;

    let maxScore = 0;
    const maxPoints = [];

    this.generateScoreMap(currentState);

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        if (map[i][j] === EMPTY) {
          if (this.scoreMap[i][j] > maxScore) {
            maxScore = this.scoreMap[i][j];
            maxPoints.splice(0);
            maxPoints.push({
              x: j,
              y: i,
            });
          } else if (this.scoreMap[i][j] === maxScore) {
            maxPoints.push({
              x: j,
              y: i,
            });
          }
        }
      }
    }

    if (maxPoints.length) {
      const randomNum = Math.floor(Math.random() * (maxPoints.length + 1));
      return maxPoints[randomNum];
    }

    return {
      x: -1,
      y: -1,
    };
  }

  /**
   * @param {matrix} map
   */
  getMaxPoint(currentState) {
    let maxPoint;

    switch (this.mode) {
      case AIMode.EASY:
        maxPoint = this.getMaxPointByScoreMap(currentState);
        break;
      case AIMode.HARD:
        maxPoint = this.getMaxPointByMCTS(currentState);
        break;
      default:
        maxPoint = {
          x: -1,
          y: -1,
        };
        break;
    }

    return maxPoint;
  }

  setMode(mode) {
    this.mode = mode || AIMode.EASY;
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
    const maxPoint = this.getMaxPoint(currentState);
    return maxPoint;
  }
}

export default AI;
