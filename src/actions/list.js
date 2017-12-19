import {
  LIST_ADD,
  LIST_DELETE,
  LIST_UPDATE,
  LIST_READ,
  LIST_LOAD
} from './actionTypes';

import getNet from '../util/getNet'



export function listAdd(book) {
  return dispatch => {
    dispatch(requestFetch());
    return getNet.refreshSingleChapter(book)
      .then(latestBook => dispatch(receiveAddFetch(latestBook)))
  }
}

function requestFetch(type = 'NULL') {
  return { type }//LIST_LOAD
}

function receiveAddFetch(book) {
  return { type: LIST_ADD, book }
}

export function listDelete(bookId) {
  return { type: LIST_DELETE, bookId }
}

export function listUpdate(list) {
  return dispatch => {
    dispatch(requestFetch(LIST_LOAD));
    return getNet.refreshChapter(list)
      .then(latestInfo => dispatch(receiveUpdateFetch(latestInfo)))
  }
}

function receiveUpdateFetch(info) {
  return { type: LIST_UPDATE, info }
}

export function listRead(bookId) {
  return { type: LIST_READ, bookId }
}