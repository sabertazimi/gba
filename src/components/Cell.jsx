import React from 'react';
import PropTypes from 'prop-types';

import {
  CELL_SIZE,
  BLACK,
  WHITE,
} from '../constants';

const Cell = (props) => {
  const {
    x,
    y,
    val,
  } = props;

  const styles = {
    width: CELL_SIZE,
    height: CELL_SIZE,
    top: y * CELL_SIZE,
    left: x * CELL_SIZE,
  };

  let innerClass = '';

  switch (val) {
    case BLACK:
      innerClass = 'black';
      break;
    case WHITE:
      innerClass = 'white';
      break;
    default:
      innerClass = '';
      break;
  }

  return (
    <div {...props} className="cell" style={styles}>
      <div className={innerClass} />
    </div>
  );
};

Cell.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
  val: PropTypes.number.isRequired,
};

export default Cell;
