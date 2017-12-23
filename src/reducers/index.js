import { combineReducers } from 'redux';

import list, { listState } from './list';
import app, { appState } from './app';

export const initalState = {
  list: { ...listState },
  app: { ...appState },
}
//和导航相关的reducer通过从调用出传递进来
const rootReducer = combineReducers({
  list,
  app,
});

export default rootReducer;