import React, { Component } from 'react';
import { Text, View, Dimensions, StatusBar, InteractionManager, ActionSheetIOS, LayoutAnimation, AsyncStorage } from 'react-native';


import dateFormat from 'dateformat';
import async from 'async';

import Toast from '../../component/Toast';
import ViewPager from '../../component/viewPager';
import getContextArr from '../../util/getContextArr';
import Navigat from '../../component/Navigat';
import { content } from '../../services/book';

import styles from './index.style';

/**
 * 下载模块
 - code by Czq
 */
let q = async.queue(function (url, callback) {
  fetchList(url, () => {
    callback(null);
  });
}, 5);

q.drain = function () {
  tht.refs.toast.show(`Task finished at ${finishTask}/${allTask}`);
  finishTask = 0;
  AsyncStorage.setItem(bookPlant,JSON.stringify(tht.chapterMap));
};

async function fetchList(nurl, callback) {
  let n = 100 * (finishTask / allTask) >> 0; //取整
  if (n % 15 === 0) {
    tht.refs.toast.show(`Task process:${n}%`);
  }
  try {
    if (tht.chapterMap[nurl] === undefined) {
      const { data } = await content(nurl);
      tht.chapterMap[nurl] = data;
    }
    finishTask++;
  } catch (err) {

  } finally {
    callback();
  }
}

let allTask = 0, finishTask = 0;

let tht, bookPlant, booklist;

const { height, width } = Dimensions.get('window');

class Readitems extends React.PureComponent {
  render() {
    return (
      <View style={[styles.container, this.props.SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>
        <Text style={[styles.title, this.props.SMode ? (styles.SunnyMode_Title) : (styles.MoonMode_Title)]}>{this.props.title}</Text>
        <Text style={[styles.textsize, this.props.SMode ? (styles.SunnyMode_text) : (styles.MoonMode_text)]} numberOfLines={21}>{this.props.data}</Text>
        <View style={styles.bottView}>
          <Text style={[styles.bottom1, this.props.SMode ? (false) : (styles.MoonMode_Bottom)]}>{dateFormat(new Date(), 'H:MM')}</Text>
          <Text style={[styles.bottom2, this.props.SMode ? (false) : (styles.MoonMode_Bottom)]} >{this.props.presPag}/{this.props.totalPage} </Text>
        </View>
      </View>
    );
  }
}

class ReadScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    tht = this;
    totalPage = 0;//总的页数
    this.chapterMap = new Map();
    this.currentBook;
    this.currentNum = props.navigation.state.params.bookNum;
    this.state = {
      loadFlag: true, //判断是出于加载状态还是显示状态
      currentItem: '', //作为章节内容的主要获取来源。
      isVisible: false, //判断导航栏是否应该隐藏
      goFlag: 0, //判断是前往上一章（-1）还是下一章（1）
      SMode: true,
    };

    this.initConf = this.initConf.bind(this);
    this.showAlertSelected = this.showAlertSelected.bind(this);
    this.download_Chapter = this.download_Chapter.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.getNet = this.getNet.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPrevPage = this.getPrevPage.bind(this);
    this.clickBoard = this.clickBoard.bind(this);
    this.SModeChange = this.SModeChange.bind(this);
    this.getChapterUrl = this.getChapterUrl.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);

    this.initConf();
  }
  async initConf() {
    const tm = await AsyncStorage.multiGet(['SMode', 'booklist']);
    booklist = JSON.parse(tm[1][1]);
    this.currentBook = booklist[this.currentNum];
    this.setState({
      SMode: tm[0][1] ? JSON.parse(tm[0][1]) : true,
    });
    bookPlant = `${this.currentBook.bookName}_${this.currentBook.plantformId}`;
    const val_1 = JSON.parse(await AsyncStorage.getItem(bookPlant));
    if (val_1 === null) {
      await AsyncStorage.setItem(bookPlant, JSON.stringify(new Map()));
    } else {
      this.chapterMap = val_1;
    }
    if (this.currentBook.recordChapter === '') {
      let bookChapterLst = `${this.currentBook.bookName}_${this.currentBook.plantformId}_list`;
      const val_2 = JSON.parse(await AsyncStorage.getItem(bookChapterLst));
      if (val_2 === null) {//没有获取章节列表的情况
        this.refs.toast.show('请获取一遍章节列表再重新进入。');
      } else {
        this.currentBook.recordChapter = val_2[val_2.length - 1].key;
      }
    }
    this.getNet(this.currentBook.recordChapter, 0);
    booklist[this.currentNum].recordPage = 1;//修复进入章节后从目录进入新章节页数记录不正确的bug
  }

  async download_Chapter(size) {
    let bookChapterLst = `${this.currentBook.bookName}_${this.currentBook.plantformId}_list`;
    const val = JSON.parse(await AsyncStorage.getItem(bookChapterLst));
    let ChaptUrl = booklist[this.currentNum].recordChapter;
    let i = 0, j = val.length;
    while (i < j) {
      if (val[i].key === ChaptUrl) {
        break;
      }
      i++;
    }
    let End = i >= size ? i - size : 0;
    allTask = i - End;
    for (let n = End; n < i; n++) {
      q.push(val[n].key);
    }
  }

  showAlertSelected() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        '缓存50章',
        '缓存150章',
        'Cancel',
      ],
      cancelButtonIndex: 2,
    },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0: {//50章
            this.download_Chapter(50); break;
          }
          case 1: {//150章
            this.download_Chapter(150); break;
          }
        }
      });
  }

  renderPage(data, pageID) {
    return (
      <Readitems
        title={this.state.currentItem.title}
        SMode={this.state.SMode}
        data={data}
        presPag={Number(pageID) + 1}
        totalPage={totalPage}
      ></Readitems>
    );
  }

  async getNet(nurl, direct) {
    booklist[this.currentNum].recordChapter = nurl;
    AsyncStorage.setItem('booklist', JSON.stringify(booklist))
    if (this.chapterMap[nurl] === undefined) {
      try {
        const { data } = await content(nurl);
        this.setState({
          currentItem: data,
          loadFlag: false,
          goFlag: direct,
        }, () => {
          this.chapterMap[nurl] = data;
          AsyncStorage.setItem(bookPlant, JSON.stringify(this.chapterMap))
        });
      } catch (err) {
        let epp = { title: '网络连接超时啦啦啦啦啦', content: '网络连接超时.', prev: 'error', next: 'error' };
        this.setState({
          currentItem: epp,
          loadFlag: false,
          goFlag: direct,
        });
      }
    } else {
      this.setState({
        currentItem: this.chapterMap[nurl],
        loadFlag: false,
        goFlag: direct,
      });
    }
  }
  getNextPage() {
    if (tht.state.currentItem.next.indexOf('.html') !== -1) {//防止翻页越界
      tht.setState({ loadFlag: true }, () => {
        tht.getNet(tht.state.currentItem.next, 1);
      });
    } else {
      this.refs.toast.show('已经是最后一章。');
      return -1;
    }
    return 0;
  }
  getPrevPage() {
    if (tht.state.currentItem.prev.indexOf('.html') !== -1) {//防止翻页越界
      tht.setState({ loadFlag: true }, () => {
        tht.getNet(tht.state.currentItem.prev, -1);
      });
    } else {
      this.refs.toast.show('已经是第一章。');
    }
  }

  clickBoard() {
    let flag = this.state.isVisible;
    LayoutAnimation.configureNext({
      duration: 200, //持续时间
      create: { // 视图创建
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,// opacity
      },
      update: { // 视图更新
        type: LayoutAnimation.Types.linear,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,// opacity
      }
    });
    this.setState({ isVisible: !flag });
  }

  SModeChange() {
    let s = tht.state.SMode;
    tht.setState({ SMode: !s }, () => {
      AsyncStorage.setItem('SMode', JSON.stringify(!s));
    });
  }
  getChapterUrl(urln) {
    let url = urln;
    this.setState({
      loadFlag: true,
      isVisible: false
    }, () => {
      tht.getNet(url, 1);
    });
  }
  getCurrentPage(pag) {
    pag = pag === 0 ? 1 : pag;
    booklist[this.currentNum].recordPage = pag;
    AsyncStorage.setItem('booklist', JSON.stringify(booklist));
  }

  render() {
    const ds = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2 });
    return (
      <View style={[styles.container, this.state.SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>
        <StatusBar
          barStyle="light-content"
          hidden={!this.state.isVisible}
          animation={true}
        ></StatusBar>
        {this.state.isVisible &&
          <Navigat
            navigation={this.props.navigation}
            choose={1}
          />}
        {this.state.loadFlag ? (
          <Text style={[styles.centr, this.state.SMode ? (false) : (styles.MoonMode_text)]}>
            Loading...</Text>) :
          (<ViewPager
            dataSource={ds.cloneWithPages(getContextArr(this.state.currentItem.content, width))}
            renderPage={this.renderPage}
            getNextPage={this.getNextPage}
            getPrevPage={this.getPrevPage}
            getCurrentPage={this.getCurrentPage}
            clickBoard={this.clickBoard}
            initialPage={booklist[this.currentNum].recordPage - 1}
            locked={this.state.isVisible}
            Gpag={this.state.goFlag} />)}
        <Toast ref="toast" />
        {this.state.isVisible &&
          <Navigat
            urlx={this.currentBook.url}
            currentChapter={this.currentBook.recordChapter}
            bname={this.currentBook.bookName}
            bookChapterLst={`${this.currentBook.bookName}_${this.currentBook.plantformId}_list`}
            getChapterUrl={this.getChapterUrl}
            navigation={this.props.navigation}
            showAlertSelected={this.showAlertSelected}
            SModeChange={this.SModeChange}
            choose={2}
          />}
      </View>
    );
  }
}

export default ReadScreen;