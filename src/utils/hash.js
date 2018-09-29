function hashPlay(play) {
  return `${play.x.toString()},${play.y.toString()}`;
}

function hashState(state) {
  return JSON.stringify(state.playHistory);
}

export {
  hashPlay,
  hashState,
};
