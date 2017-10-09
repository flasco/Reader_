import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';


import styles from './index.style';

const window = Dimensions.get('window');

class Menu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.leanMore = this.leanMore.bind(this);
        this.CleanData = this.CleanData.bind(this);
    }
    leanMore() {
        const sturl = 'https://testdb.leanapp.cn/start?h=6';//运转6小时
        fetch(sturl).then(res => {
            alert('Server will run for 6 hours');
        }).catch((Error) => {
            // console.warn(Error);
        }).done();
    }

    CleanData() {
        alert('除书架记录之外的数据已经全部清空');
        let booklist;
        DeviceStorage.get('booklist').then(val => {
            booklist = val;
        })
            .then(() => {
                DeviceStorage.cleanAll()
                    .then(() => {
                        DeviceStorage.save('booklist', booklist);
                    });
            });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.menu}>
                <TouchableOpacity onPress={() =>
                    navigate('Sear', { addBook: this.props.addBook })
                }>
                    <Text style={styles.item} >Search</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigate('RnkL',{ addBook: this.props.addBook }); }}>
                    <Text style={styles.item} >RankList</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.leanMore}>
                    <Text style={styles.item} >Learn More</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.CleanData}>
                    <Text style={styles.item} >CleanAllData</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default Menu;