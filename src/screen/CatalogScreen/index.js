import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Button, AsyncStorage } from 'react-native';
import urlTool from 'url';

import { list } from '../../services/book';
import { HeaderBackButton } from 'react-navigation'

import styles from './index.style';

export default class NovelList extends React.PureComponent {

  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.name}`,
      headerLeft: (
        <HeaderBackButton
          title='返回'
          tintColor={'#fff'}
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
            that._FlatList.scrollToIndex({ viewPosition: 0.5, index: this.lengt });
          }}
          color='#fff'
        ></Button>
      ),
      headerTitleStyle: {
        color: '#fff',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);
    that = this;
    this._FlatList;
    this.lengt = 1;
    this._header = this._header.bind(this);
    this._renderItem = this._renderItem.bind(this);

    this.state = {
      dataSource: '',
      currentChapterNum: props.navigation.state.params.chap,
    };
  }

  componentDidMount() {
    booklist = this.props.navigation.state.params.bookChapterLst;
    this.lengt = booklist.length - 1;
    this.setState({
      dataSource: booklist,
    }, () => {
      setTimeout(() => {
        that._FlatList.scrollToIndex({ viewPosition: 0.5, index: this.state.currentChapterNum });
      }, 100);
    });
  }

  _renderItem(item) {
    let txt = item.item.title;
    return (
      <TouchableOpacity style={{ height: 38 }}
        onPress={() => {
          this.props.navigation.state.params.callback(item.index);
          this.props.navigation.goBack();
        }}>
        <Text style={[styles.rowStyle, this.state.currentChapterNum === item.index ? styles.red : false]}>{txt}</Text>
      </TouchableOpacity>
    );
  }

  _header() {
    return (
      <View>
        <Text style={styles.LatestChapter}>[最新章节]</Text>
        <View style={styles.solid} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ backgroundColor: '#D8D8D8', flex: 1 }}>
        <FlatList
          initialNumToRender={20}
          ref={(c) => this._FlatList = c}
          data={this.state.dataSource}
          renderItem={this._renderItem}
          ListHeaderComponent={this._header}
          ItemSeparatorComponent={() => <View style={styles.solid} />}
          getItemLayout={(data, index) => ({ length: 38, offset: 39 * index, index })}//行高38，分割线1，所以offset=39
        />
      </View>
    );
  }
}
