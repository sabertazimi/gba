/**
 * Monte-Carlo tree search algorithm implementation
 */

import {
  Hash,
} from '../utils';

import SM from './stateMachine';

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
      this.children.set(Hash.play(curPlay), {
        play: curPlay,
        node: null,
      });
    }
  }
}

class MCTS {
  constructor(UCB1ExploreParam = 2) {
    this.UCB1ExploreParam = UCB1ExploreParam;
    this.nodes = new Map();
  }

  makeNode(state) {
    if (!this.nodes.has(Hash.state(state))) {
      const unexpandedPlays = SM.legalPlays(state).slice();
      const node = new Node(null, null, state, unexpandedPlays);
      this.nodes.set(Hash.state(state), node);
    }
  }

  runSearch(state, timeout = 3) {
    this.makeNode(state);

    const end = Date.now() + timeout * 1000;

    while (Date.now() < end) {
      let node = this.select(state);
      let winner = GM.checkWinner(node.state, node.play);

      if (node.isLeaf() === false && winner === EMPTY) {
        node = this.expand(node);
        winner = this.simulate(node);
      }

      this.backpropagate(node, winner);
    }
  }

  bestPlay(state) {
    // @TODO
    return state + this.game;
  }
}

const mcts = new MCTS();

export default mcts;
