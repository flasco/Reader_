import React, { Component } from 'react';
import { Text, View, TouchableOpacity, AsyncStorage, Image } from 'react-native';

import { HeaderBackButton } from 'react-navigation';
import { Button } from 'react-native-elements';

import Toast from '../../component/Toast';

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
    this.book = props.navigation.state.params.book;

  }

  render() {
    const { navigate } = this.props.navigation;
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
            buttonStyle={styles.secondView.secondButton.buttonStyle} />
        </View>
        <View style={styles.solid} />
        <Text style={styles.Desc}>{this.book.desc}</Text>
        <View style={styles.solid} />
        <Text style={styles.Desc}>内容待续。</Text>
        <Toast ref="toast" />
      </View>
    );
  }
}

export default BookDetScreen;