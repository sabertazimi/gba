import React from 'react';
import PropTypes from 'prop-types';

import {
  CELL_SIZE,
} from '../constants';

const Grid = ({
  rows,
  cols,
}) => {
  const cellNodes = [];

  for (let i = 0; i < rows - 1; i += 1) {
    for (let j = 0; j < cols - 1; j += 1) {
      const styles = {
        width: CELL_SIZE,
        height: CELL_SIZE,
        top: i * CELL_SIZE,
        left: j * CELL_SIZE,
      };

      cellNodes.push(<div key={i * rows + j} className="cell" style={styles} />);
    }
  }

  const styles = {
    top: CELL_SIZE / 2,
    left: CELL_SIZE / 2,
    width: CELL_SIZE * (cols - 1),
    height: CELL_SIZE * (rows - 1),
  };

  return (
    <div className="grid" style={styles}>
      {cellNodes}
    </div>
  );
};

Grid.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
};

export default Grid;
