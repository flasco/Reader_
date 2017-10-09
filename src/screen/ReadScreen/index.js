import React, { Component } from 'react';
import { Text, View, Dimensions, StatusBar, InteractionManager,ActionSheetIOS, LayoutAnimation } from 'react-native';


import dateFormat from 'dateformat';
import async from 'async';

import Toast from '../../component/Toast';
import ViewPager from '../../component/viewPager';
import getContextArr from '../../util/getContextArr';
import Navigat from '../../component/Navigat';
import DeviceStorage from '../../util/DeviceStorage';

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
    DeviceStorage.save(bookPlant, tht.chapterMap);
};

function fetchList(nurl, callback) {
    let n = 100 * (finishTask / allTask) >> 0; //取整
    if (n % 15 === 0) {
        tht.refs.toast.show(`Task process:${n}%`);
    }
    if (tht.chapterMap[nurl] !== undefined) {
        finishTask++;
        callback();
    } else {
        let url = 'https://testdb.leanapp.cn/Analy_x?action=2&url=' + nurl;
        axios.get(url, { timeout: 5000 }).then(Response => {
            tht.chapterMap[nurl] = Response.data;
            finishTask++;
            callback();
        }).catch((Error) => {
            callback();
        }).done();
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
        chapterMap = new Map();
        this.state = {
            currentBook: '',
            currentNum: props.navigation.state.params.bookNum,
            loadFlag: true, //判断是出于加载状态还是显示状态
            currentItem: '', //作为章节内容的主要获取来源。
            isVisible: false, //判断导航栏是否应该隐藏
            goFlag: 0, //判断是前往上一章（-1）还是下一章（1）
            SMode: true,
        };
        this.initConf = this.initConf.bind(this);
        this.showAlertSelected = this.showAlertSelected.bind(this);
        this.download_Chapter = this.download_Chapter.bind(this);
        this._renderPage = this._renderPage.bind(this);
        this.getNet = this.getNet.bind(this);
        this._getNextPage = this._getNextPage.bind(this);
        this._getPrevPage = this._getPrevPage.bind(this);
        this._clickBoard = this._clickBoard.bind(this);
        this._SMode_Change = this._SMode_Change.bind(this);
        this._getChapterUrl = this._getChapterUrl.bind(this);
        this._getCurrentPage = this._getCurrentPage.bind(this);

        this.initConf();
    }
    initConf() {
        DeviceStorage.get('SMode').then(val => {
            if (val !== null) {
                this.setState({ SMode: val });
            }
        });
        bookPlant = this.state.currentBook.bookName + '_'
            + this.state.currentBook.plantformId;
        DeviceStorage.get('booklist').then(val => {
            booklist = val;
            this.setState({ currentBook: booklist[this.state.currentNum] });
        });

        DeviceStorage.get(bookPlant).then(val => {
            if (val === null) {
                // console.log('检测书籍本地记录为空，为第一次打开本书');
                DeviceStorage.save(bookPlant, new Map());
            } else {
                this.chapterMap = val;
            }
        }).then(() => {
            if (this.state.currentBook.recordChapter === '') {
                let bookChapterLst = `${this.state.currentBook.bookName}_${this.state.currentBook.plantformId}_list`;
                DeviceStorage.get(bookChapterLst).then(val => {
                    if (val === null) {//没有获取章节列表的情况
                        this.refs.toast.show('请获取一遍章节列表再重新进入。');
                    } else {
                        this.state.currentBook.recordChapter = val[val.length - 1].key;
                    }
                }).then(() => {
                    this.getNet(this.state.currentBook.recordChapter, 0);
                    booklist[this.state.currentNum].recordPage = 1;//修复进入章节后从目录进入新章节页数记录不正确的bug
                });
            } else {
                this.getNet(this.state.currentBook.recordChapter, 0);
                booklist[this.state.currentNum].recordPage = 1;//修复进入章节后从目录进入新章节页数记录不正确的bug
            }
        });
    }

    download_Chapter(size) {
        let bookChapterLst = `${this.state.currentBook.bookName}_${this.state.currentBook.plantformId}_list`;

        DeviceStorage.get(bookChapterLst).then(val => {
            let ChaptUrl = booklist[this.state.currentNum].recordChapter;
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
        });
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
            switch(buttonIndex){
                case 0:{//50章
                    this.download_Chapter(50);
                    break;
                }
                case 1:{//150章
                    this.download_Chapter(150);
                    break;
                }
            }
          });
    }

    _renderPage(data, pageID) {
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

    getNet(nurl, direct) {
        booklist[this.state.currentNum].recordChapter = nurl;
        DeviceStorage.save('booklist', booklist);
        if (this.chapterMap[nurl] === undefined) {
            let url = 'https://testdb.leanapp.cn/Analy_x?action=2&url=' + nurl;//this.state.test.next
            axios.get(url, {
                timeout: 8000,
            }).then(Response => {
                this.setState({
                    currentItem: Response.data,
                    loadFlag: false,
                    goFlag: direct,
                }, () => {
                    this.chapterMap[nurl] = Response.data;
                    DeviceStorage.save(bookPlant, this.chapterMap);
                });
            })
                .catch((Error) => {
                    let epp = { title: '网络连接超时啦啦啦啦啦', content: '网络连接超时.', prev: 'error', next: 'error' };
                    this.setState({
                        currentItem: epp,
                        loadFlag: false,
                        goFlag: direct,
                    });
                }).done();
        } else {
            this.setState({
                currentItem: this.chapterMap[nurl],
                loadFlag: false,
                goFlag: direct,
            });

        }
    }
    _getNextPage() {
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
    _getPrevPage() {
        if (tht.state.currentItem.prev.indexOf('.html') !== -1) {//防止翻页越界
            tht.setState({ loadFlag: true }, () => {
                tht.getNet(tht.state.currentItem.prev, -1);
            });
        } else {
            this.refs.toast.show('已经是第一章。');
        }
    }

    _clickBoard() {
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
            delete:{
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,// opacity
              }
        });
        this.setState({ isVisible: !flag });
    }

    _SMode_Change() {
        let s = tht.state.SMode;
        tht.setState({ SMode: !s }, () => {
            DeviceStorage.save('SMode', !s);
        });
    }
    _getChapterUrl(urln) {
        let url = urln;
        this.setState({
            loadFlag: true,
            isVisible: false
        }, () => {
            tht.getNet(url, 1);
        });
    }
    _getCurrentPage(pag) {
        pag = pag === 0 ? 1 : pag;
        booklist[this.state.currentNum].recordPage = pag;
        DeviceStorage.save('booklist', booklist);
    }

    render() {
      const ds = new ViewPager.DataSource({ pageHasChanged: (p1, p2) => p1 !== p2});
        return (
            <View style={[styles.container, this.state.SMode ? (styles.SunnyMode_container) : (styles.MoonMode_container)]}>
                <StatusBar
                    barStyle="light-content"
                    hidden={!this.state.isVisible}
                    animation={true}
                ></StatusBar>
                {this.state.isVisible&&
                    <Navigat
                        navigation={this.props.navigation}
                        choose={1}
                    />}
                {this.state.loadFlag ? (
                    <Text style={[styles.centr, this.state.SMode ? (false) : (styles.MoonMode_text)]}>
                        Loading...</Text>) :
                    (<ViewPager
                        dataSource={ds.cloneWithPages(getContextArr(this.state.currentItem.content, width))}
                        renderPage={this._renderPage}
                        getNextPage={this._getNextPage}
                        getPrevPage={this._getPrevPage}
                        getCurrentPage={this._getCurrentPage}
                        clickBoard={this._clickBoard}
                        initialPage={booklist[this.state.currentNum].recordPage - 1}
                        locked={this.state.isVisible}
                        Gpag={this.state.goFlag} />)}
                <Toast ref="toast" />
                {this.state.isVisible &&
                    <Navigat
                        urlx={this.state.currentBook.url}
                        currentChapter={this.state.currentBook.recordChapter}
                        bname={this.state.currentBook.bookName}
                        bookChapterLst={`${this.state.currentBook.bookName}_${this.state.currentBook.plantformId}_list`}
                        getChapterUrl={this._getChapterUrl}
                        navigation={this.props.navigation}
                        showAlertSelected={this.showAlertSelected}
                        SModeChange={this._SMode_Change}
                        choose={2}
                    />}
            </View>
        );
    }
}

export default ReadScreen;