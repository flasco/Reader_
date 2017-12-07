
import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import BookListScreen from './screen/BookListScreen';
import CatalogScreen from './screen/CatalogScreen';
import ReadScreen from './screen/ReadScreen';
import SearchScreen from './screen/SearchScreen';
import RankScreen from './screen/RankScreen'
import BookDetScreen from './screen/BookDetScreen';

import { StackNavigator } from 'react-navigation';

SearchScreen.navigationOptions = ({ navigation }) => {
  return {
    header: null,
  };
};

ReadScreen.navigationOptions = ({ navigation }) => {
  return { header: null };
};

const Reader_F = StackNavigator({
  Home: { screen: BookListScreen },
  ChaL: { screen: CatalogScreen },
  Read: { screen: ReadScreen },
  Sear: { screen: SearchScreen },
  RnkL: { screen: RankScreen },
  BookDet: { screen: BookDetScreen },
}, {
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false
    }
  });

export default Reader_F;

