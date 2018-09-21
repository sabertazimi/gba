import React, { Component } from 'react';

import './index.scss';

// const EMPTY = 0;
// const BLACK = 1;
// const WHITE = 2;
// const GAME_STATUS_STOP = 0;
// const GAME_STATUS_START = 1;
const GAME_STATUS_FINISH = 2;
const CELL_SIZE = 30;

const Board = ({
  rows,
  cols,
}) => {
  const boxNodes = [];

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < cols; j += 1) {
      const styles = {
        width: CELL_SIZE,
        height: CELL_SIZE,
        top: i * CELL_SIZE,
        left: j * CELL_SIZE,
      };

      boxNodes.push(<div className="board" style={styles} />);
    }
  }
};

class GoBang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: GAME_STATUS_FINISH,
    };
  }

  render() {
    const { status } = this.state;

    return (
      <div>
        <Board rows={20} cols={20} status={status} />
      </div>
    );
  }
}

const App = () => (
  <div>
    <GoBang />
  </div>
);

export default App;
