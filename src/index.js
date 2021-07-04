import React from 'react';
import ReactDOM from 'react-dom';
import './css/article.css';
import Launcher from './launcher';

const axios = require('axios');
const globals = require('./globals');

// Specify global settings for Axios.
axios.defaults.baseURL = globals.requestPrefix;

ReactDOM.render(<Launcher />,
    document.getElementById('root')
);