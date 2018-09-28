# gba

[![Build Status](https://travis-ci.com/sabertazimi/gba.svg?token=q3rvCWEJVuEsNxEomDdy&branch=master)](https://travis-ci.com/sabertazimi/gba)

a simple GoBang Ai

## Monte Carlo tree search (MCTS)

### Benifits over Minimax Algorithm

- To determine which moves are good, depth-limited minimax needs a function that gives the estimated strength of any given game state. This heuristic function may be difficult to obtain, for example in the case of Go. MCTS does not need such a heuristic function, making it **aheuristic**
- MCTS efficiently deals with games with a high branching factor. As it gains information, MCTS increasingly favors moves that are more likely to be good, making its search **asymmetric**
- Minimax needs to run to completion to give the best move, which makes its runtime (and run-space) non-flexible. For games with large state spaces like chess and Go, this exhaustive search may even be intractable. MCTS does not need to run to completion; it outputs stronger plays the longer it runs, but its search can be stopped at any point. Having this flexible property, we say that MCTS is **anytime**

While minimax is an elegant algorithm for solving simple games, MCTS is a more powerful alternative for more complex games — even as it gives us approximate solutions instead of absolute ones. Being aheuristic, asymmetric, and anytime makes MCTS an attractive option for complex general game-playing

### Key Steps

- selection: Selection function applied recursively until a leaf node is reached
- expansion: one or more nodes might be created
- simulation: one simulated game is played
- backpropagation: result of this simulated game is backpropagated in the tree
