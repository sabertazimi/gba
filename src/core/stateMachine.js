import {
  EMPTY,
  BLACK,
  DEATH,
  ROWS,
  COLS,
} from '../constants';

import {
  BoardVisitor,
} from '../utils';

const StateMachine = {
  getInitState() {
    const board = [];

    for (let i = 0; i < ROWS; i += 1) {
      board[i] = new Array(COLS);

      for (let j = 0; j < COLS; j += 1) {
        board[i][j] = EMPTY;
      }
    }

    const state = {
      playHistory: [],
      player: BLACK,
      winner: EMPTY,
      board,
    };

    return state;
  },

  loadState() {
    const state = localStorage.getItem('gobang-state');

    if (state) {
      return JSON.parse(state);
    }

    return this.getInitState();
  },

  storeState(state) {
    localStorage.setItem('gobang-state', JSON.stringify(state));
  },

  nextState(state, play) {
    const newHistory = state.playHistory.slice();
    newHistory.push(play);
    const newBoard = state.board.map(row => row.slice());
    newBoard[play.row][play.col] = state.player;
    const newPlayer = -state.player;
    const winner = this.checkWinner(state, play);

    return {
      playHistory: newHistory,
      player: newPlayer,
      winner,
      board: newBoard,
    };
  },

  isDeadGame(state) {
    const {
      board,
    } = state;

    for (let i = 1; i < ROWS; i += 1) {
      for (let j = 1; j < COLS; j += 1) {
        if (board[i][j] === EMPTY) {
          return false;
        }
      }
    }

    return true;
  },

  checkWinner(state, play) {
    if (!play) {
      console.log('play is undefined, return EMPTY');
      return EMPTY;
    }

    if (this.isDeadGame(state)) {
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

    if (BoardVisitor.countOnDirections(state, play, directions, 4,
      (curstate, playy, xdir, ydir, step) => {
        const {
          board,
          player,
        } = curstate;
        const {
          row,
          col,
        } = playy;

        return board[row + ydir * step][col + xdir * step] === player;
      }, (_, __, ___, ____, curCount) => {
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
      return state.player;
    }

    return EMPTY;
  },

  legalPlays(state) {
    const legalPlays = [];

    for (let j = 0; j < COLS; j += 1) {
      for (let i = ROWS - 1; i >= 0; i -= 1) {
        if (state.board[i][j] === EMPTY) {
          legalPlays.push({
            i,
            j,
          });
          break;
        }
      }
    }

    return legalPlays;
  },
};

export default StateMachine;
