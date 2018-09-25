import React from 'react';
import { render } from 'react-dom';

import App from './App';

import './index.scss';

render(<App rows={15} cols={15} />, document.getElementById('root'));
