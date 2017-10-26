
import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import BookListScreen from './screen/BookListScreen';

import CatalogScreen from './screen/CatalogScreen';
import ReadScreen from './screen/ReadScreen';

import SearchScreen from './screen/SearchScreen';
import RankScreen from './screen/RankScreen'

import { StackNavigator } from 'react-navigation';

// import DeviceStorage from './util/DeviceStorage';
import axios from 'axios';

global.axios = axios;
// global.DeviceStorage = DeviceStorage;

SearchScreen.navigationOptions = ({navigation}) => {
  return {
    header:null,
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
}, {
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false
    }
  });

  export default Reader_F;

