import React, { Component } from 'react';
import { Text, View, TouchableOpacity, AsyncStorage, Image } from 'react-native';

import { HeaderBackButton } from 'react-navigation';
import { Button } from 'react-native-elements';

import Toast from '../../component/Toast';
import { search } from '../../services/book';

import styles from './index.style';

let selecter = [
  'xs.la',
  'kanshuz',
];

class BookDetScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `书籍详情`,
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
      headerTitleStyle: {
        color: '#ddd',
        alignSelf: 'center'
      }
    };
  };
  constructor(props) {
    super(props);

    this.book = props.navigation.state.params.book;

    this.state = {
      isLoading: this.book === undefined,
    }
    this.initx = this.initx.bind(this);

    this.initx();
  }

  async initx() {
    if (this.state.isLoading) {
      let name = this.props.navigation.state.params.bookNam,
        author = this.props.navigation.state.params.bookAut;
      const { data } = await search(name, author, 1);
      this.book = data[0];
      this.setState({
        isLoading: false,
      })
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Text style={{textAlign:'center',marginTop:12,}}>Loading...</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.firstView.container}>
            <Image
              style={styles.firstView.left.imgSize}
              source={{ uri: this.book.img }}
              defaultSource={require('../../assert/noImg.jpg')} />
            <View style={styles.firstView.right.container}>
              <Text style={styles.firstView.right.tit}>{this.book.bookName}</Text>
              <Text style={styles.firstView.right.subDes}>{this.book.author}</Text>
              <Text style={styles.firstView.right.subDes}>{selecter[this.book.plantformId - 1]}</Text>
            </View>
          </View>
          <View style={styles.secondView.container}>
            <Button title='追书'
              onPress={() => {
                this.props.navigation.state.params.addBook(this.book);
                this.refs.toast.show('书籍添加成功..');
              }}
              textStyle={styles.secondView.firstButton.text}
              buttonStyle={styles.secondView.firstButton.buttonStyle} />
            <Button title='开始阅读'
              onPress={() => {
                navigate('Read', {
                  book: this.book
                });
              }}
              textStyle={styles.secondView.secondButton.text}
              buttonStyle={styles.secondView.secondButton.buttonStyle} />
          </View>
          <View style={styles.solid} />
          <Text style={styles.Desc}>{this.book.desc}</Text>
          <View style={styles.solid} />
          <Text style={[styles.Desc, { textAlign: 'center' }]}>To be continued...</Text>
          <Toast ref="toast" />
        </View>
      );
    }
  }
}

export default BookDetScreen;