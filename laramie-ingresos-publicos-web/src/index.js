import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import './styles/global.scss';

const { PUBLIC_URL } = process.env;

ReactDOM.render(
  <App 
    basename={PUBLIC_URL}
  />,
  document.getElementById('root')
);
