import {
  MENU_CTL,
  MENU_SWITCH,
  NIGHTMODE_SWITCH,
  LOADING_SWITCH
} from './actionTypes';

export function menuSwitch() {
  return { type: MENU_SWITCH }
}

export function menuCtl(flag) {
  return { type: MENU_CTL, flag }
}

export function nightModeSwitch() {
  return { type: NIGHTMODE_SWITCH }
}

export function LoadingSwitch() {
  return { type: LOADING_SWITCH }
}