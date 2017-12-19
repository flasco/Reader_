/**
* 这里以news的为例，还有其他的reducer，具体的可以参考样例完整代码
*/
import {
  LIST_ADD,
  LIST_READ,
  LIST_DELETE,
  LIST_UPDATE,
  LIST_INIT,
  LOADING_CTL
} from '../actions/actionTypes';

import { AsyncStorage } from 'react-native';

export const listState = {
  loadingFlag: false,
  isInit: false,
  list: [{
    bookName: '天醒之路',
    author: '蝴蝶蓝',
    img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
    desc: '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
    latestChapter: '第七百二十二章 堂皇而入',
    plantformId: 1,
    latestRead: 0,
    source: {
      '1': 'http://www.xs.la/0_64/',
      '2': 'http://www.kanshuzhong.com/book/36456/',
    }
  }],
}

export default list = (state = listState, action) => {
  switch (action.type) {
    case LOADING_CTL:
      return Object.assign({}, state, { loadingFlag: action.flag })
    case LIST_INIT:
      action.list.filter(x => x.latestRead === undefined && (x.latestRead = 0));
      return Object.assign({}, state, { list: action.list, isInit: true });
    case LIST_ADD:
      state.list.push(action.book);
      return Object.assign({}, state, { list: [...state.list] });
    case LIST_READ:
      state.list[action.bookId].latestRead = new Date().getTime();
      state.list.sort((a, b) => a.latestRead < b.latestRead);
      console.log(state.list);
      return Object.assign({}, state, { list: [...state.list] });
    case LIST_DELETE:
      state.list.splice(action.bookId, 1);
      return Object.assign({}, state, { list: [...state.list] });
    case LIST_UPDATE:
      let sum = 0;
      action.info.filter((x, index) => {
        if (x !== undefined) {
          state.list[index].latestChapter = x;
          sum++;
        }
      });
      state.loadingFlag = false;
      return Object.assign({}, state);
    default:
      return state;
  }
}

