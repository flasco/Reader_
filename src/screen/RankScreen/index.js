import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert ,ActivityIndicator} from 'react-native';
import React, { Component } from 'react';

import styles from './index.style';

let tht ;
class RankScreen extends React.PureComponent {
    constructor(props) {
        super(props);

        this.getNet = this.getNet.bind(this);
        this.JmpToBook = this.JmpToBook.bind(this);
        this._onEndReached = this._onEndReached.bind(this);

        tht = this;
        currentPag = 1;
        this.state = {
            dataSource: [],
            loadingFlag:true,
            fetchFlag:false,
            FooterText:'上拉加载',
        };
    }

    componentDidMount() {
        this.getNet(currentPag++);
    }

    getNet(page = 1) {
        let url = `https://testdb.leanapp.cn/rnklist?p=${page}`;
        axios.get(url, { timeout: 5000 }).then(Response => {
            let data = this.state.dataSource;
            data.push.apply( data, Response.data );
            if(page === 1){
                this.setState({
                    dataSource: data,
                    loadingFlag:false,
                });
            }else{
                this.setState({
                    dataSource: data,
                    fetchFlag:false,
                    FooterText:'上拉加载',
                });
            }
        });
    }

    JmpToBook(nam){
        const { navigate } = this.props.navigation;
        navigate('Sear', {
            bookNam:nam,
            addBook:this.props.navigation.state.params.addBook
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

    _renderSeparator() {
        return (<View style={styles.solid} />);
    }

    _keyExtractor = (item, index) => item.name;

    _onEndReached(){
        if(this.state.fetchFlag === true) return;
        console.log('End...reach, start fetch..');
        this.setState({
            FooterText:'正在加载中...',
            fetchFlag:true,
        },()=>{
            this.getNet(currentPag++);
        });
    }

    _footer = () => {
        return (
            <View style={styles.footerContainer} >
                {this.state.fetchFlag?<ActivityIndicator size="small" color="#888888" />:false}
                <Text style={[styles.footerText, this.state.fetchFlag? ({marginLeft: 7}) : (false) ]}>{this.state.FooterText}</Text>
            </View> 
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loadingFlag ? <Text style={{textAlign: 'center',marginTop:12,}}>Fetch RnkList...</Text> :
                <FlatList
                    style={{
                        flex: 1
                    }}
                    data={this.state.dataSource}
                    renderItem={this._renderRow}
                    ItemSeparatorComponent={this._renderSeparator}
                    getItemLayout={(data, index) => ({ length: 70, offset: 71 * index, index })}//行高38，分割线1，所以offset=39
                    keyExtractor={this._keyExtractor}
                    onEndReached={this._onEndReached}
                    ListFooterComponent={this._footer}
                    onEndReachedThreshold = {-0.1}
                    />}
            </View>
        );
    }
}

export default RankScreen;