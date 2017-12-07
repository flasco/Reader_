import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StatusBar, AsyncStorage } from 'react-native';

import Swipeout from 'react-native-swipeout';
import { Icon } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen';

import Menu from '../MenuScreen';
import styles from './index.style';
import getNet from '../../util/getNet';
import PullRefreshScrollView from '../../component/RefreshScollowView/index';

let booklist, tht, tha, refreshComp;
/**
 * 包装层，为了保证能使用侧滑的菜单
 - code by Czq
 */
class BookPackage extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '古意流苏',
      headerBackTitle: ' ',
      headerStyle: {
        backgroundColor: '#000'
      },
      headerRight: (
        <TouchableOpacity onPress={() => {
          tht.openMenu();
        }}>
          <Icon
            name='ios-add'
            type='ionicon'
            color='#ddd'
            size={42}
            iconStyle={{
              marginRight: 15
            }} />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        color: '#ddd',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);
    tht = this;
    this.openMenu = this.openMenu.bind(this);
    this.addBook = this.addBook.bind(this);

    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  openMenu() {
    const flag = this.state.isOpen;
    this.setState({ isOpen: !flag });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  async addBook(data) {
    let book = {
      ...data,
      latestChapter: '待检测',
    };
    booklist.push(book);
    tha.setState({
      dataSource: booklist,
    });
    AsyncStorage.setItem('booklist', JSON.stringify(booklist));
    await getNet.refreshSingleChapter(book);//异步更新章节。
    // console.log('forceUpdate')
    tha.forceUpdate();//强制刷新
  }

  render() {
    const menu = <Menu navigation={this.props.navigation} addBook={this.addBook} />;
    return ((
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <SideMenu
          menu={menu}
          isOpen={this.state.isOpen}
          onChange={isOpen => this.updateMenuState(isOpen)}
          menuPosition={'right'}
          disableGestures={true}>
          <BookList navigation={this.props.navigation} />
        </SideMenu>
      </View>
    ));
  }
}

class BookList extends React.PureComponent {
  constructor(props) {
    super(props);

    tha = this;

    this.deleteBook = this.deleteBook.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.initx = this.initx.bind(this);
    this.setRefreshComp = this.setRefreshComp.bind(this);

    this.state = {
      dataSource: '',
    };
    this.initx();
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  async initx() {
    const val = JSON.parse(await AsyncStorage.getItem('booklist'));
    if (val === null || val.length === 0) {
      booklist = [
        {
          bookName: '天醒之路',
          author: '蝴蝶蓝',
          img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
          desc: '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
          latestChapter: '待检测',
          plantformId: 1,
          source: {
            '1': 'http://www.xs.la/0_64/',
            '2': 'http://www.kanshuzhong.com/book/36456/',
          }
        }, {
          bookName: '飞剑问道',
          author: '我吃西红柿',
          img: 'http://www.xs.la/BookFiles/BookImages/feijianwendao.jpg',
          desc: '修仙觅长生，热血任逍遥，踏莲曳波涤剑骨，凭虚御风塑圣魂！在这个世界，有狐仙、河神、水怪、大妖，也有求长生的修行者。修行者们，开法眼，可看妖魔鬼怪。炼一口飞剑，可千里杀敌。千里眼、顺风耳，更可探查四方。……秦府二公子‘秦云’，便是一位修行者……',
          latestChapter: '待检测',
          plantformId: 1,
          source: {
            '1': 'http://www.xs.la/34_34495/',
            '2': 'http://www.kanshuzhong.com/book/118096/',
          }
        }
      ];
      alert('发现书架为空，自动添加书籍。');
      AsyncStorage.setItem('booklist', JSON.stringify(booklist))
    } else {
      booklist = val;
    }
    refreshComp.refreshAuto();
    this.setState({
      dataSource: booklist,
    });
  }

  deleteBook(deleteId) {
    booklist.splice(deleteId, 1);
    this.setState({
      dataSource: booklist
    }, () => {
      AsyncStorage.setItem('booklist', JSON.stringify(booklist));
    });
    this.forceUpdate();
  }

  renderRow(rowData, sectionID, rowID) {
    const { navigate } = this.props.navigation;
    return (
      <Swipeout
        right={[{
          text: '删除',
          onPress: () => {
            this.deleteBook(rowID);
          },
          backgroundColor: 'red'
        }
        ]}
        autoClose={true}
        sectionID={sectionID}
        close={!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
        backgroundColor={styles.container.backgroundColor}>
        <TouchableOpacity
          onLongPress={() => {
            navigate('BookDet', {
              book: rowData
            });
          }}
          onPress={() => {
            navigate('Read', {
              book: rowData
            });
          }}>
          <View style={{ height: 52 }}>
            <Text style={styles.rowStyle}>
              <Text style={{ fontSize: 15 }}>{rowData.bookName}</Text>
              <Text style={styles.latestChapter}>{`    ${rowData.latestChapter.length > 15 ? (rowData.latestChapter.substr(0, 15) + '...') : rowData.latestChapter}`}</Text>
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeout >
    );
  }

  async onRefresh(PullRefresh) {
    await getNet.refreshChapter(booklist);
    this.setState({
      dataSource: booklist
    }, () => {
      AsyncStorage.setItem('booklist', JSON.stringify(booklist));
      PullRefresh.onRefreshEnd();
    });
  }

  setRefreshComp(that) {
    refreshComp === undefined && (refreshComp = that);
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <View style={styles.container}>
        <ListView
          ref="list"
          style={{ flex: 1 }}
          renderScrollComponent={(props) => <PullRefreshScrollView
            onRefresh={(PullRefresh) => this.onRefresh(PullRefresh)}
            setRefreshComp={this.setRefreshComp}
            color={styles.container.backgroundColor}
            {...props} />}
          enableEmptySections={true}
          dataSource={ds.cloneWithRows(this.state.dataSource)}
          renderSeparator={() => <View style={styles.solid} />}
          renderRow={this.renderRow} />
      </View>
    );
  }
}

export default BookPackage;