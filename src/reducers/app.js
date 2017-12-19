import {
  MENU_CTL,
  MENU_SWITCH,
  NIGHTMODE_SWITCH,
} from '../actions/actionTypes';


export const appState = {
  menuFlag: false,
  nightMode: false,
}


export default app = (state = appState, action) => {
  switch (action.type) {
    case MENU_CTL:
      return Object.assign({}, state, { menuFlag: action.flag })
    case MENU_SWITCH:
      let flag1 = !state.menuFlag;
      console.log(flag1);
      return Object.assign({}, state, { menuFlag: flag1 })
    case NIGHTMODE_SWITCH:
      let flag2 = !state.nightMode;
      return Object.assign({}, state, { nightMode: flag2 })
    default:
      return state;
  }
}
