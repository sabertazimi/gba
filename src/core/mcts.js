/**
 * Monte-Carlo tree search algorithm implementation
 */

import {
  hashPlay,
} from '../utils';

/* eslint-disable */

class Node {
  constructor(parent, play, state, unexpandedPlays) {
    this.play = play;
    this.state = state;

    this.nPlays = 0;
    this.nWins = 0;

    this.parent = parent;
    this.children = new Map();

    for (let i = 0; i < unexpandedPlays.length; i += 1) {
      const curPlay = unexpandedPlays[i];
      this.children.set(hashPlay(curPlay), {
        play: curPlay,
        node: null,
      });
    }
  }
}

class MCTS {
  constructor() {
    this.name = 'MCTS';
  }

  runSearch(state, timeout) {
    // @TODO
    return state + timeout + this.game;
  }

  bestPlay(state) {
    // @TODO
    return state + this.game;
  }
}

const mcts = new MCTS();

export default mcts;
