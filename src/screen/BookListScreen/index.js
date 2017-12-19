import React, { Component } from 'react';
import { Text, View, ListView, TouchableOpacity, StatusBar, AsyncStorage, RefreshControl } from 'react-native';

import Swipeout from 'react-native-swipeout';
import { Icon } from 'react-native-elements';
import SideMenu from 'react-native-side-menu';
import SplashScreen from 'react-native-splash-screen';

import { connect } from 'react-redux';

import { listAdd, listDelete, listUpdate, listInit, listRead } from '../../actions/list'
import { menuCtl, menuSwitch } from '../../actions/app';

import Menu from '../MenuScreen';
import styles from './index.style';
import getNet from '../../util/getNet';
import PullRefreshScrollView from '../../component/RefreshScollowView/index';

let tht;

class BookPackage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '古意流苏',
      headerBackTitle: ' ',
      headerStyle: {
        backgroundColor: '#000'
      },
      headerRight: (
        <TouchableOpacity onPress={() => {
          tht.props.dispatch(menuSwitch());
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

    this.state = {
      isOpen: false,
      dataSource: '',
    };

    this.addBook = this.addBook.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
    this.renderRow = this.renderRow.bind(this);

    props.dispatch(listInit());
  }

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
    this.onRefresh();
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  deleteBook(deleteId) {
    this.props.dispatch(listDelete(deleteId));
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
        }]}
        autoClose={true}
        sectionID={sectionID}
        close={!(this.state.sectionID === sectionID && this.state.rowID === rowID)}
        backgroundColor={styles.container.backgroundColor}>
        <TouchableOpacity
          onLongPress={() => {
            navigate('BookDet', { book: rowData });
          }}
          onPress={() => {
            navigate('Read', { book: rowData });
            setTimeout(() => {
              this.props.dispatch(listRead(rowID))
            }, 1000);
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

  onRefresh = () => {
    setTimeout(() => {
      this.props.isInit ? this.props.dispatch(listUpdate(this.props.list)) : this.onRefresh()
    }, 521);
  }

  async addBook(data) {
    this.props.dispatch(listAdd({
      ...data,
      latestChapter: '待检测',
    }));
  }

  render() {
    const menu = <Menu navigation={this.props.navigation} addBook={this.addBook} />;
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const { dispatch, list, loadingFlag, isInit } = this.props;
    if (!isInit) return null;
    return ((
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <SideMenu
          menu={menu}
          isOpen={this.props.menuFlag}
          onChange={openFlag => dispatch(menuCtl(openFlag))}
          menuPosition={'right'}
          disableGestures={true}>
          <View style={styles.container}>
            <ListView
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={loadingFlag}
                  onRefresh={this.onRefresh}
                  title="Loading..."
                  titleColor="#000" />}
              enableEmptySections={true}
              dataSource={ds.cloneWithRows(list)}
              renderSeparator={() => <View style={styles.solid} />}
              renderRow={this.renderRow} />
          </View>
        </SideMenu>
      </View>
    ));
  }
}

function select(state) {
  return {
    list: state.list.list,
    isInit: state.list.isInit,
    menuFlag: state.app.menuFlag,
    loadingFlag: state.list.loadingFlag
  }
}

export default connect(select)(BookPackage);