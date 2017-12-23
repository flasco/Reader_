import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight, FlatList, Button } from 'react-native';

import { LargeList } from "react-native-largelist";

import { list } from '../../services/book';
import { HeaderBackButton } from 'react-navigation';

import styles from './index.style';

class CatalogScreen extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.name}`,
      headerLeft: (
        <HeaderBackButton
          title='返回'
          tintColor={'#ddd'}
          onPress={() => {
            navigation.goBack();
          }} />
      ),
      headerStyle: {
        backgroundColor: '#000'
      },
      headerRight: (
        <Button
          title='gDwn'
          onPress={() => {
            that.list.scrollToEnd(false);
          }}
          color='#ddd'
        ></Button>
      ),
      headerTitleStyle: {
        color: '#ddd',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);
    that = this;
    this.lengt = 1;
    this._header = this._header.bind(this);

    this.state = {
      dataSource: '',
      loadFlag: true,
      currentChapterNum: props.navigation.state.params.chap,
    };
  }

  componentDidMount() {
    booklist = this.props.navigation.state.params.bookChapterLst;
    this.lengt = booklist.length - 1;
    this.setState({
      dataSource: booklist,
      loadFlag: false,
    }, () => {
      setTimeout(() => {
        this.list.scrollToIndexPath({ section: 0, row: this.state.currentChapterNum - 5 }, true);
      }, 100);
    });
  }

  componentWillUnmount() {
    //重写组件的setState方法，直接返回空
    this.setState = (state, callback) => {
      return;
    };
  }

  itemRender = (section, index) => {
    let item = this.state.dataSource[index];
    return (
      <View>
        <View style={[styles.solid]} />
        <TouchableHighlight style={{ height: 38 }}
          underlayColor='#e1e1e1'
          activeOpacity={0.7}
          onPress={() => {
            this.props.navigation.state.params.callback(index);
            this.props.navigation.goBack();
          }}>
          <Text style={[styles.rowStyle, this.state.currentChapterNum === index ? styles.red : false]}>{item.title}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  _header() {
    return (
      <View>
        <Text style={styles.LatestChapter}>[最新章节]</Text>
        {/* <View style={styles.solid} /> */}
      </View>
    );
  }

  render() {
    if (!this.state.loadFlag) {
      let data = this.state.dataSource;
      return (
        <View style={{ backgroundColor: '#d9d9d9', flex: 1 }}>
          <LargeList
            ref={(q) => this.list = q}
            style={{ flex: 1 }}
            numberOfRowsInSection={() => data.length}
            heightForCell={() => 38}
            renderCell={this.itemRender}
            renderHeader={this._header}
            getItemLayout={(data, index) => ({ length: 38, offset: 39 * index, index })}
          />
        </View>
      );
    } else {
      return (
        <Text style={styles.welcome}>Loading now.please wait.</Text>
      );
    }
  }
}

export default CatalogScreen;