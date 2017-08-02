import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PBarChart from './BarChart';

const data = [
  {
    "category": "Cattle Protection",
    "count": 70
  },
  {
    "category": "Crime",
    "count": 84
  },
  {
    "category": "Honour Killing",
    "count": 127
  },
  {
    "category": "Other",
    "count": 19
  },
  {
    "category": "Sexual Harrassment",
    "count": 29
  },
  {
    "category": "Witch Craft",
    "count": 22
  }
];

ReactDOM.render(<PBarChart data={data}/>,document.getElementById('root'))