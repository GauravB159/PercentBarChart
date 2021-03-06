import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import PBarChart from './BarChart';

const data = [
  {
    "category": "Cattle Protection",
    "count": 40
  },
  {
    "category": "Crime",
    "count": 34
  },
  {
    "category": "Honour Killing",
    "count": 27
  },
  {
    "category": "Other",
    "count": 10
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