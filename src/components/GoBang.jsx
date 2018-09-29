import React from 'react';
import PropTypes from 'prop-types';

import {
  EMPTY,
  BLACK,
  WHITE,
} from '../constants';

import {
  StateManager,
} from '../utils';

import Grid from './Grid';
import Cell from './Cell';

import AI from '../core';

import './GoBang.scss';

class GoBang extends React.Component {
  constructor(props) {
    super(props);
    const state = StateManager.loadState();

    if (state) {
      this.state = { ...state };
    } else {
      const {
        rows,
        cols,
      } = props;
      const map = [];

      for (let i = 0; i < rows; i += 1) {
        map[i] = new Array(cols);

        for (let j = 0; j < cols; j += 1) {
          map[i][j] = EMPTY;
        }
      }

      this.state = {
        playHistory: [],
        turn: BLACK,
        result: EMPTY,
        map,
      };
    }

    this.reset = this.reset.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  reset() {
    const {
      rows,
      cols,
    } = this.props;
    const {
      map,
    } = this.state;

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        map[i][j] = EMPTY;
      }
    }

    const state = {
      playHistory: [],
      turn: BLACK,
      result: EMPTY,
      map,
    };

    StateManager.storeState(state);
    this.setState(state);
    localStorage.clear();
  }

  handleClick(x, y) {
    const {
      rows,
      cols,
    } = this.props;
    const {
      playHistory,
      turn,
      map,
    } = this.state;

    const reverseTurn = (color) => {
      if (color === WHITE) {
        return BLACK;
      }

      return WHITE;
    };

    if (!map[y][x]) {
      // row y, column x
      map[y][x] = turn;
      playHistory.push({
        x,
        y,
      });
      let afterResult = StateManager.checkResult({
        map,
        rows,
        cols,
        x,
        y,
        color: turn,
      });
      let afterTurn = reverseTurn(turn);

      if (afterResult === EMPTY) {
        const aiPlay = AI.process({
          map,
          rows,
          cols,
          x,
          y,
          color: turn,
        });

        if (aiPlay.x !== -1 && aiPlay.y !== -1) {
          map[aiPlay.y][aiPlay.x] = afterTurn;
          playHistory.push(aiPlay);
          afterResult = StateManager.checkResult({
            map,
            rows,
            cols,
            x: aiPlay.x,
            y: aiPlay.y,
            color: afterTurn,
          });
          afterTurn = reverseTurn(afterTurn);
        }
      }

      const state = {
        turn: afterTurn,
        result: afterResult,
        map,
      };

      StateManager.storeState(state);
      this.setState(state);
    }
  }

  render() {
    const {
      rows,
      cols,
    } = this.props;
    const {
      result,
      map,
    } = this.state;
    const cellNodes = [];
    const resultText = [
      `vs ${AI.config.name} (AI)`,
      'Black Wins',
      'White Wins',
      'Dead Game',
    ];
    const enabled = (result !== BLACK && result !== WHITE);

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        cellNodes.push(
          <Cell
            key={i * rows + j}
            onClick={() => {
              if (enabled) {
                this.handleClick(j, i);
              }
            }}
            x={j}
            y={i}
            rows={rows}
            cols={cols}
            val={map[i][j]}
          />,
        );
      }
    }

    return (
      <div className="gobang">
        <div className="board">
          <div className="cells">
            {cellNodes}
          </div>
          <Grid rows={rows} cols={cols} />
        </div>

        <div className="info">
          <button type="button" className={`info__button ${enabled ? '' : 'info__button--wins'}`} onClick={() => { this.reset(); }}>
            <strong>
              {resultText[result]}
            </strong>
            <br />
            <em>
              (
              {`${AI.mode} mode`}
              )
            </em>
            <br />
            <br />
            (Click to reset)
          </button>
        </div>
      </div>
    );
  }
}

GoBang.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
};

export default GoBang;
