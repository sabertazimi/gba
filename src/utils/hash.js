function hashPlay(play) {
  return `${play.row.toString()},${play.col.toString()}`;
}

function hashState(state) {
  return JSON.stringify(state.playHistory);
}

export {
  hashPlay,
  hashState,
};
