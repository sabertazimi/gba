/**
 * Monte-Carlo tree search algorithm implementation
 */
class MCTS {
  constructor(game) {
    this.game = game;
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

export default MCTS;
