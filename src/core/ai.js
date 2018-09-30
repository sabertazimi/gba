import {
  EMPTY,
  ROWS,
  COLS,
  Score,
  AIMode,
} from '../constants';

import {
  BoardVisitor,
} from '../utils';

import MCTS from './mcts';

import config from '../ai.json';

class AI {
  constructor(_config) {
    this.config = _config || {};
    this.config.mode = this.config.defaultMode || AIMode.EASY;
  }

  /**
   * @param {object} currentState
   */
  generateScoreBoard(currentState) {
    if (!this.scoreBoard) {
      this.scoreBoard = [];

      for (let i = 0; i < ROWS; i += 1) {
        this.scoreBoard[i] = new Array(COLS);

        for (let j = 0; j < COLS; j += 1) {
          this.scoreBoard[i][j] = 0;
        }
      }
    } else {
      for (let i = 0; i < ROWS; i += 1) {
        for (let j = 0; j < COLS; j += 1) {
          this.scoreBoard[i][j] = 0;
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

    let humanCount = 0;
    let aiCount = 0;
    let emptyCount = 0;
    let axisFlag = 0;

    const humanCB1 = (state, play, xdir, ydir, step) => {
      const {
        board,
        player,
      } = state;
      const {
        row,
        col,
      } = play;

      const currentplayer = board[row + ydir * step][col + xdir * step];
      if (currentplayer === -player) {
        humanCount += 1;
        return true;
      }

      if (currentplayer === EMPTY) {
        emptyCount += 1;
      }

      return false;
    };

    const humanCB2 = (state, play) => {
      if (axisFlag === 0) {
        axisFlag += 1;
        return true;
      }

      const {
        row,
        col,
      } = play;

      switch (humanCount) {
        case 1:
          this.scoreBoard[row][col] += Score.Kill2;
          break;
        case 2:
          if (emptyCount === 1) {
            this.scoreBoard[row][col] += Score.Kill3_1;
          } else if (emptyCount === 2) {
            this.scoreBoard[row][col] += Score.Kill3_2;
          }
          break;
        case 3:
          if (emptyCount === 1) {
            this.scoreBoard[row][col] += Score.Kill4_1;
          } else if (emptyCount === 2) {
            this.scoreBoard[row][col] += Score.Kill4_2;
          }
          break;
        case 4:
          this.scoreBoard[row][col] += Score.Kill5;
          break;
        default:
          break;
      }

      humanCount = 0;
      emptyCount = 0;
      axisFlag = 0;

      return true;
    };

    const aiCB1 = (state, play, xdir, ydir, step) => {
      const {
        board,
        player,
      } = state;
      const {
        row,
        col,
      } = play;

      const currentplayer = board[row + ydir * step][col + xdir * step];

      if (currentplayer === EMPTY) {
        emptyCount += 1;
        return false;
      }

      if (currentplayer !== -player) {
        aiCount += 1;
        return true;
      }

      return false;
    };

    const aiCB2 = (state, play) => {
      if (axisFlag === 0) {
        axisFlag += 1;
        return true;
      }

      const {
        row,
        col,
      } = play;

      switch (aiCount) {
        case 0:
          this.scoreBoard[row][col] += Score.Live1;
          break;
        case 1:
          this.scoreBoard[row][col] += Score.Live2;
          break;
        case 2:
          if (emptyCount === 1) {
            this.scoreBoard[row][col] += Score.Dead3;
          } else if (emptyCount === 2) {
            this.scoreBoard[row][col] += Score.Live3;
          }
          break;
        case 3:
          if (emptyCount === 1) {
            this.scoreBoard[row][col] += Score.Dead4;
          } else if (emptyCount === 2) {
            this.scoreBoard[row][col] += Score.Live4;
          }
          break;
        case 4:
          this.scoreBoard[row][col] += Score.Live5;
          break;
        default:
          break;
      }

      aiCount = 0;
      emptyCount = 0;
      axisFlag = 0;

      return true;
    };

    for (let i = 0; i < ROWS; i += 1) {
      for (let j = 0; j < COLS; j += 1) {
        if (currentState.board[i][j] === EMPTY) {
          BoardVisitor.countOnDirections(currentState, {
            row: i,
            col: j,
          }, directions, 4, humanCB1, humanCB2);
          BoardVisitor.countOnDirections(currentState, {
            row: i,
            col: j,
          }, directions, 4, aiCB1, aiCB2);
        }
      }
    }
  }

  getBestPlayByScoreBoard(currentState) {
    let maxScore = 0;
    const bestPlays = [];

    this.generateScoreBoard(currentState);

    for (let i = 0; i < ROWS; i += 1) {
      for (let j = 0; j < COLS; j += 1) {
        if (currentState.board[i][j] === EMPTY) {
          if (this.scoreBoard[i][j] > maxScore) {
            maxScore = this.scoreBoard[i][j];
            bestPlays.splice(0);
            bestPlays.push({
              row: i,
              col: j,
            });
          } else if (this.scoreBoard[i][j] === maxScore) {
            bestPlays.push({
              row: i,
              col: j,
            });
          }
        }
      }
    }

    if (bestPlays.length) {
      const randomNum = Math.floor(Math.random() * bestPlays.length);
      return bestPlays[randomNum];
    }

    return {
      row: -1,
      col: -1,
    };
  }

  getBestPlayByMCTS(currentState) {
    if (this.config.mode === AIMode.MEDIUM) {
      MCTS.runSearch(currentState, 3);
    } else {
      MCTS.runSearch(currentState, 6);
    }

    const bestPlay = MCTS.bestPlay(currentState);
    return bestPlay;
  }

  /**
   * @param {matrix} board
   */
  getBestPlay(currentState) {
    let bestPlay;

    switch (this.config.mode) {
      case AIMode.EASY:
        bestPlay = this.getBestPlayByScoreBoard(currentState);
        break;
      case AIMode.MEDIUM:
      case AIMode.HARD:
        bestPlay = this.getBestPlayByMCTS(currentState);
        break;
      default:
        bestPlay = {
          row: -1,
          col: -1,
        };
        break;
    }

    return bestPlay;
  }

  setMode(mode) {
    this.config.mode = mode || AIMode.EASY;
  }

  process(currentState) {
    const bestPlay = this.getBestPlay(currentState);
    return bestPlay;
  }
}

const ai = new AI(config);

export default ai;
