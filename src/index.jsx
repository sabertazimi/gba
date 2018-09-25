import React from 'react';
import { render } from 'react-dom';

import App from './App';

import './index.scss';

render(<App rows={20} cols={20} />, document.getElementById('root'));
