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

### Selection

- explore new paths to gain information
- use existing information to exploit paths known to be good
- select child nodes using a selection function that balances exploration and exploitation

MCTS + UCB1 (Upper Confidence Bound 1) = UCT (Upper Confidence Bound 1 applied to trees)

UCT selection function = `(wᵢ / sᵢ) + (c * sqrt(ln sₚ / sᵢ))` (exploitation term + exploration term) (c = sqrt(2))

### Expansion

add a new node as a child to the last selected node in the selection phase, expanding the search tree. The statistics information in the node is initialized with 0 wins out of 0 simulations (wᵢ = 0, sᵢ = 0)

### Simulation
