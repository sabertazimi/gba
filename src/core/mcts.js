/**
 * Monte-Carlo tree search algorithm implementation
 */

import {
  EMPTY,
} from '../constants';

import {
  Hash,
} from '../utils';

import SM from './stateMachine';

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

  childNode(play) {
    const child = this.children.get(Hash.play(play));

    if (child === undefined) {
      throw new Error('No such play!');
    } else if (child.node === null) {
      throw new Error('Child is not expanded!');
    }

    return child.node;
  }

  expand(play, childState, unexpandedPlays) {
    if (!this.children.has(Hash.play(play))) {
      throw new Error('No such play!');
    }

    const childNode = new Node(this, play, childState, unexpandedPlays);
    this.children.set(Hash.play(play), { play, node: childNode });

    return childNode;
  }

  allPlays() {
    const ret = [];

    this.children.forEach(child => ret.push(child.play));

    return ret;
  }

  unexpandedPlays() {
    const ret = [];

    this.children.forEach((child) => {
      if (child.node === null) {
        ret.push(child.play);
      }
    });

    return ret;
  }

  isFullyExpanded() {
    /* eslint-disable */
    for (let child of this.children.values()) {
      if (child.node === null) {
        return false;
      }
    }
    /* eslint-enable */

    return true;
  }

  isLeaf() {
    if (this.children.size === 0) {
      return true;
    }

    return false;
  }

  getUCB1(biasParam) {
    const exploitTerm = this.nWins / this.nPlays;
    const exploreTerm = Math.sqrt(biasParam * Math.log(this.parent.nPlays) / this.nPlays);
    return exploitTerm + exploreTerm;
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

  select(state) {
    let node = this.nodes.get(Hash.state(state));

    // search down to fully expanded node or leaf node
    // along with bestPlay path
    while (node.isFullyExpanded() && !node.isLeaf()) {
      const plays = node.allPlays();
      let bestPlay;
      let bestUCB1 = -Infinity;

      for (let i = 0; i < plays.length; i += 1) {
        const play = plays[i];
        const childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam);

        if (childUCB1 > bestUCB1) {
          bestPlay = play;
          bestUCB1 = childUCB1;
        }
      }

      node = node.childNode(bestPlay);
    }

    return node;
  }

  expand(node) {
    // get a random one unexpanded play
    const plays = node.unexpandedPlays();
    const play = plays[Math.floor(Math.random() * plays.length)];

    // expand child node with above play
    const childState = SM.nextState(node.state, play);
    const childUnexpandedPlays = SM.legalPlays(childState);
    const childNode = node.expand(play, childState, childUnexpandedPlays);
    this.nodes.set(Hash.state(childState), childNode);
    return childNode;
  }

  /* eslint-disable */
  simulate(node) {
  /* eslint-enable */
    let {
      state,
    } = node;
    let winner = SM.checkWinner(state, node.play);

    while (winner === EMPTY) {
      const plays = SM.legalPlays(state);
      const play = plays[Math.floor(Math.random() * plays.length)];
      state = SM.nextState(state, play);
      const {
        winner: newWinner,
      } = state;
      winner = newWinner;
    }

    return winner;
  }

  /* eslint-disable */
  backpropagate(node, winner) {
    while (node !== null) {
      node.nPlays += 1;

      // winner info for parent node
      if (node.parent.state.player === winner) {
        node.nWins += 1;
      }

      node = node.parent;
    }
  }
  /* eslint-enable */

  runSearch(state, timeout = 3) {
    this.makeNode(state);

    const end = Date.now() + timeout * 1000;

    while (Date.now() < end) {
      let node = this.select(state);
      let winner = SM.checkWinner(node.state, node.play);

      if (node.isLeaf() === false && winner === EMPTY) {
        node = this.expand(node);
        winner = this.simulate(node);
      }

      this.backpropagate(node, winner);
    }
  }

  bestPlay(state) {
    this.makeNode(state);

    // if not all children are expanded, not enough information
    if (this.nodes.get(Hash.state(state)).isFullyExpanded() === false) {
      throw new Error('Not enough information!');
    }

    const node = this.nodes.get(Hash.state(state));
    const allPlays = node.allPlays();
    let bestPlay;
    let max = -Infinity;

    for (let i = 0; i < allPlays.length; i += 1) {
      const play = allPlays[i];
      const childNode = node.childNode(play);

      if (childNode.nPlays > max) {
        bestPlay = play;
        max = childNode.nPlays;
        // max = childNode.nWins / childNode.nPlays;
      }
    }

    return bestPlay;
  }
}

const mcts = new MCTS();

export default mcts;
