import {
  EMPTY,
} from '../constants';

const StateManger = {
  saveState: (state) => {
    localStorage.setItem('gobang-state', JSON.stringify(state));
  },
  loadState: () => (JSON.parse(localStorage.getItem('gobang-state'))),
  checkResult: (map, rows, cols, x, y) => {
    const cur = map[y][x];

    let s1 = Math.max(y - 5, 0);
    let s2 = Math.min(y, rows - 5);

    const everyValue = (cells, value) => (cells.every(cell => cell === value));

    for (let i = s1; i <= s2; i += 1) {
      const cells = [
        map[i][x],
        map[i + 1][x],
        map[i + 2][x],
        map[i + 3][x],
        map[i + 4][x],
      ];

      if (everyValue(cells, cur)) {
        return cur;
      }
    }

    s1 = Math.max(x - 5, 0);
    s2 = Math.min(x, cols - 5);

    for (let i = s1; i <= s2; i += 1) {
      const cells = [
        map[y][i],
        map[y][i + 1],
        map[y][i + 2],
        map[y][i + 3],
        map[y][i + 4],
      ];

      if (everyValue(cells, cur)) {
        return cur;
      }
    }

    for (let i = 0; i < rows; i += 1) {
      if (y - i > 0 && y - i + 4 < rows && x - i > 0 && x - i + 4 < cols) {
        const cells = [
          map[y - i][x - i],
          map[y - i + 1][x - i + 1],
          map[y - i + 2][x - i + 2],
          map[y - i + 3][x - i + 3],
          map[y - i + 4][x - i + 4],
        ];

        if (everyValue(cells, cur)) {
          return cur;
        }
      }
    }

    for (let i = 0; i < rows; i += 1) {
      if (y - i > 0 && y - i + 4 < rows && x + i < cols && x + i - 4 > 0) {
        const cells = [
          map[y - i][x + i],
          map[y - i + 1][x + i - 1],
          map[y - i + 2][x + i - 2],
          map[y - i + 3][x + i - 3],
          map[y - i + 4][x + i - 4],
        ];

        if (everyValue(cells, cur)) {
          return cur;
        }
      }
    }

    return EMPTY;
  },
};

export default StateManger;
