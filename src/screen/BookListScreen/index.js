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

let booklist, tht, tha, RefreshCount = 0;

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
          tht._OpenMenu();
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
    this._OpenMenu = this._OpenMenu.bind(this);
    this._addBook = this._addBook.bind(this);

    this.state = {
      load: true,
      isOpen: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }

  _OpenMenu() {
    const flag = this.state.isOpen;
    this.setState({ isOpen: !flag });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen: isOpen });
  }

  _addBook(data) {
    let book = {
      bookName: data.bookName,
      author: data.author,
      url: data.url,
      img: data.img,
      desc: data.desc,
      latestChapter: '待检测',
      plantformId: data.plantformId,
    };
    console.log(data);
    booklist.push(book);
    getNet.refreshSingleChapter(book);
    tha.setState({
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !==
          r2
      }).cloneWithRows(booklist),
    });
    AsyncStorage.setItem('booklist', JSON.stringify(booklist));
  }

  render() {
    const menu = <Menu navigation={this.props.navigation} addBook={this._addBook} />;
    return ((
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
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
    this.renderSeparator = this.renderSeparator.bind(this);
    this.initx = this.initx.bind(this);

    this.state = {
      dataSource: '',
      load: true
    };
    this.initx();
  }

  async initx() {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    const val = JSON.parse(await AsyncStorage.getItem('booklist'));
    if (val === null || val.length === 0) {
      booklist = [
        {
          bookName: '天醒之路',
          author: '蝴蝶蓝',
          url: 'http://www.xs.la/0_64/',
          latestChapter: '待检测',
          img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
          desc: '“路平，起床上课。” “再睡五分钟。” “给我起来！” 哗！阳光洒下，照遍路平全身。 “啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！” ......',
          plantformId: 5
        }, {
          bookName: '飞剑问道',
          author: '我吃西红柿',
          url: 'http://www.xs.la/34_34495/',
          latestChapter: '待检测',
          img: 'http://www.xs.la/BookFiles/BookImages/feijianwendao.jpg',
          desc: '这是一个关于飞剑的故事。',
          plantformId: 8
        }
      ];
      alert('发现书架为空，自动添加书籍。');
      AsyncStorage.setItem('booklist', JSON.stringify(booklist))
      this.setState({
        dataSource: ds.cloneWithRows(booklist),
        load: false
      });
    } else {
      booklist = val;
      this.setState({
        dataSource: ds.cloneWithRows(val),
        load: false
      });
    }
  }

  deleteBook(deleteId) {
    booklist.splice(deleteId, 1);
    this.setState({
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(booklist)
    }, () => {
      AsyncStorage.setItem('booklist', JSON.stringify(booklist));
    });
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
  renderSeparator() {
    return (<View style={styles.solid} />);
  }
  onRefresh(PullRefresh) {
    getNet.refreshChapter(booklist, () => {
      RefreshCount++;
      if (RefreshCount != booklist.length)
        return;
      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        }).cloneWithRows(booklist)
      }, () => {
        RefreshCount = 0;
        AsyncStorage.setItem('booklist', JSON.stringify(booklist));
        PullRefresh.onRefreshEnd();
      });
    });
  }

  render() {
    return (this.state.load ? (false) : (
      <View style={styles.container}>
        <ListView
          style={{
            flex: 1
          }}
          renderScrollComponent={(props) => <PullRefreshScrollView    
            onRefresh={(PullRefresh) => this.onRefresh(PullRefresh)}
            color={styles.container.backgroundColor}
            {...props} />}
          dataSource={this.state.dataSource}
          renderSeparator={this.renderSeparator}
          renderRow={this.renderRow} />
      </View>
    ));
  }
}

export default BookPackage;