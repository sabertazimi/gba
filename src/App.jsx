import React from 'react';
import PropTypes from 'prop-types';

import {
  GoBang,
} from './components';

const App = ({
  rows,
  cols,
}) => (
  <GoBang rows={rows} cols={cols} />
);

App.propTypes = {
  rows: PropTypes.number.isRequired,
  cols: PropTypes.number.isRequired,
};

export default App;
