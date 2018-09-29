import React from 'react';

import {
  BLACK,
  WHITE,
  DEATH,
  ROWS,
  COLS,
} from '../constants';

import Grid from './Grid';
import Cell from './Cell';

import {
  AI,
  Game,
} from '../core';

import './GoBang.scss';

class GoBang extends React.Component {
  constructor(props) {
    super(props);
    this.state = Game.getInitState();
    this.reset = this.reset.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  reset() {
    this.setState(Game.getInitState());
  }

  handleClick(row, col) {
    const newState = Game.handleHumanPlay(this.state, {
      row,
      col,
    });

    this.setState(newState);
  }

  render() {
    const {
      winner,
      board,
    } = this.state;
    const cellNodes = [];
    let infoText = '';
    switch (winner) {
      case BLACK:
        infoText = 'Black Wins';
        break;
      case WHITE:
        infoText = 'White Wins';
        break;
      case DEATH:
        infoText = 'Dead Game';
        break;
      default:
        infoText = `vs ${AI.config.name} (AI)`;
        break;
    }

    const enabled = (winner !== BLACK && winner !== WHITE);

    for (let i = 0; i < ROWS; i += 1) {
      for (let j = 0; j < COLS; j += 1) {
        cellNodes.push(
          <Cell
            key={i * ROWS + j}
            onClick={() => {
              if (enabled) {
                this.handleClick(i, j);
              }
            }}
            row={i}
            col={j}
            rows={ROWS}
            cols={COLS}
            val={board[i][j]}
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
          <Grid rows={ROWS} cols={COLS} />
        </div>

        <div className="info">
          <button type="button" className={`info__button ${enabled ? '' : 'info__button--wins'}`} onClick={() => { this.reset(); }}>
            <strong>
              {infoText}
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

export default GoBang;
