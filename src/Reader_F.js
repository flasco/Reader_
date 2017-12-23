import { Provider } from 'react-redux'
import React from 'react';
import Reader_F from './routers';

import store from './store';


export default () => (
  <Provider store={store}>
    <Reader_F />
  </Provider>
);