
import { AsyncStorage } from 'react-native'
import { list } from '../services/book';
export default class getNet {
  static refreshChapter(booklist, callback) {
    for (let i = 0, j = booklist.length; i < j; i++) {
      let bookChapterLst = `${booklist[i].bookName}_${booklist[i].plantformId}_list`;
      let latech = booklist[i].latestChapter;
      this.get(booklist[i].url, bookChapterLst, latech, (latechap) => {
        booklist[i].latestChapter = latechap;
        callback();
      });
    }
  }

  static refreshSingleChapter(book) {
    let bookChapterLst = `${book.bookName}_${book.plantformId}_list`;
    let latech = book.latestChapter;

    this.get(book.url, bookChapterLst, latech, (latechap) => {
      book.latestChapter = latechap;
    });
  }

  static async get(url, bookChapterLst, latech, callback) {
    const data = await list(url);
    let tit = data[0].title;
    callback(tit);
    if (tit === latech) {
      return;
    }
    AsyncStorage.setItem(bookChapterLst,JSON.stringify(data));
  }

}