import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';

import { HeaderBackButton } from 'react-navigation'

import { rnk } from '../../services/book';

import styles from './index.style';

let tht;
class RankScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '起点排行',
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
      headerTitleStyle: {
        color: '#fff',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);

    this.getNet = this.getNet.bind(this);
    this.JmpToBook = this.JmpToBook.bind(this);
    this._onEndReached = this._onEndReached.bind(this);

    tht = this;
    currentPag = 1;
    this.state = {
      dataSource: [],
      loadingFlag: true,
      fetchFlag: false,
      FooterText: '上拉加载',
    };
  }

  componentDidMount() {
    this.getNet(currentPag++);
  }

  async getNet(page = 1) {
    const { data } = await rnk(page);
    let source = this.state.dataSource;
    source.push(...data);
    if (page === 1) {
      this.setState({
        dataSource: source,
        loadingFlag: false,
      });
    } else {
      this.setState({
        dataSource: source,
        fetchFlag: false,
        FooterText: '上拉加载',
      });
    }
  }

  JmpToBook(nam) {
    const { navigate } = this.props.navigation;
    navigate('Sear', {
      bookNam: nam,
      addBook: this.props.navigation.state.params.addBook
    });
  }

  _renderRow(item) {
    let rowData = item.item;
    return (
      <TouchableOpacity
        onPress={() => { tht.JmpToBook(rowData.name); }}>
        <View style={{
          height: 70
        }}>
          <Text style={styles.rowStyle}>
            {`[${rowData.type}]  ${rowData.name} - ${rowData.author}\n${rowData.latestChapter}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  _keyExtractor = (item, index) => item.name;

  _onEndReached() {
    if (this.state.fetchFlag === true) return;
    this.setState({
      FooterText: '正在加载中...',
      fetchFlag: true,
    }, () => {
      this.getNet(currentPag++);
    });
  }

  _footer = () => {
    return (
      <View style={styles.footerContainer} >
        {this.state.fetchFlag ? <ActivityIndicator size="small" color="#888888" /> : false}
        <Text style={[styles.footerText, this.state.fetchFlag ? ({ marginLeft: 7 }) : (false)]}>{this.state.FooterText}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loadingFlag ? <Text style={{ textAlign: 'center', marginTop: 12, }}>Fetch RnkList...</Text> :
          <FlatList
            style={{
              flex: 1
            }}
            data={this.state.dataSource}
            renderItem={this._renderRow}
            ItemSeparatorComponent={() => <View style={styles.solid} />}
            getItemLayout={(data, index) => ({ length: 70, offset: 71 * index, index })}//行高38，分割线1，所以offset=39
            keyExtractor={this._keyExtractor}
            onEndReached={this._onEndReached}
            ListFooterComponent={this._footer}
            onEndReachedThreshold={-0.1}
          />}
      </View>
    );
  }
}

export default RankScreen;