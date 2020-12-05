import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import  {combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';

import messageReducer from './store/messageReducer';
import pageReducer from './store/pageReducer';

const store = createStore( combineReducers( {
    messageReducer,
    pageReducer,
    })
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

