
import { AsyncStorage } from 'react-native'
import { list } from '../services/book';
export default class getNet {
  static async refreshChapter(booklist) {
    for (let i = 0, j = booklist.length; i < j; i++) {
      let bookChapterLst = `${booklist[i].bookName}_${booklist[i].plantformId}_list`;
      let latech = booklist[i].latestChapter;
      let latechap = await this.get(booklist[i].source[booklist[i].plantformId], bookChapterLst, latech);
      latechap && (booklist[i].latestChapter = latechap);
    }
  }

  static async refreshSingleChapter(book) {
    let bookChapterLstFlag = `${book.bookName}_${book.plantformId}_list`;
    let latechap = await this.get(book.source[book.plantformId], bookChapterLstFlag, book.latestChapter)
    book.latestChapter = latechap;
  }

  static async get(url, bookChapterLst, latech) {
    const data = await list(url);
    let tit = data[data.length - 1].title;
    if (tit === latech) {
      return;
    } else {
      AsyncStorage.setItem(bookChapterLst, JSON.stringify(data));
      return tit;
    }
  }
}