const MapVisitor = {
  /**
   * @param {object} currentState {map, rows, cols, x, y, color}
   */
  countOnDirection: (currentState, xdir, ydir, step, cb, ...args) => {
    const {
      rows,
      cols,
      x,
      y,
    } = currentState;

    let count = 0;

    for (let i = 1; i <= step; i += 1) {
      if (xdir !== 0 && ((x + xdir * i < 0) || x + xdir * i >= cols)) {
        break;
      }

      if (ydir !== 0 && ((y + ydir * i < 0) || y + ydir * i >= rows)) {
        break;
      }

      if (cb && cb(currentState, xdir, ydir, i, ...args)) {
        count += 1;
      }
    }

    return count;
  },
  /**
   * @param {function} cb1 outer callback function (currentState, axisCount, ...args)
   * @param {function} cb2 inner callback function (currentState, xdir, ydir, step, ...args)
   * @param  {...any} args arguments to cb1 and cb2 function
   */
  countOnDirections: function countOnDirections(currentState, directions, step, cb1, cb2, ...args) {
    let count = 0;

    for (let i = 0; i < directions.length; i += 1) {
      let axisCount = 0;
      const axis = directions[i];
      const xdir = axis[0];
      const ydir = axis[1];

      axisCount += this.countOnDirection(currentState, xdir, ydir, step, cb2, ...args);

      if (cb1 && cb1(currentState, axisCount, ...args)) {
        count += 1;
      }
    }

    return count;
  },
  /**
   * @param {function} cb1 outer callback function (currentState, axisCount, ...args)
   * @param {function} cb2 inner callback function (currentState, xdir, ydir, step, ...args)
   * @param  {...any} args arguments to cb1 and cb2 function
   */
  judgeOnDirections: function judgeOnDirections(currentState, directions, step, cb1, cb2, ...args) {
    for (let i = 0; i < directions.length; i += 1) {
      let axisCount = 0;
      const axis = directions[i];
      const xdir = axis[0];
      const ydir = axis[1];
      axisCount += this.countOnDirection(currentState, xdir, ydir, step, cb2, ...args);

      if (cb1 && cb1(currentState, axisCount, ...args)) {
        return true;
      }
    }

    return false;
  },
};

export default MapVisitor;
