import {
  LIST_ADD,
  LIST_DELETE,
  LIST_UPDATE,
  LIST_READ,
  LIST_INIT,
  LOADING_CTL
} from './actionTypes';

import getNet from '../util/getNet'
import { AsyncStorage } from 'react-native';

export function listInit() {
  return dispatch => {
    dispatch(requestFetch());
    return AsyncStorage.getItem('booklist')
      .then(booklist => JSON.parse(booklist))
      .then(list => {
        list.filter(x => x.latestChapter = '没有');
        dispatch(receivelistInit(list))
      })
  }
}

function receivelistInit(list) {
  return { type: LIST_INIT, list }
}

export function listAdd(book) {
  return dispatch => {
    dispatch(requestFetch());
    return getNet.refreshSingleChapter(book)
      .then(latestBook => dispatch(receiveAddFetch(latestBook)))
  }
}

function requestFetch(type = 'NULL') {
  return { type }
}

function receiveAddFetch(book) {
  return { type: LIST_ADD, book }
}

export function listDelete(bookId) {
  return { type: LIST_DELETE, bookId }
}

export function loadingCrl(flag) {
  return { type: LOADING_CTL, flag }
}

export function listUpdate(list) {
  return dispatch => {
    dispatch(loadingCrl(true));
    return getNet.refreshChapter(list)
      .then(latestInfo => {
        dispatch(receiveUpdateFetch(latestInfo))
      })
  }
}

function receiveUpdateFetch(info) {
  return { type: LIST_UPDATE, info }
}

export function listRead(bookId) {
  return { type: LIST_READ, bookId }
}