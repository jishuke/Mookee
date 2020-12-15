/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import GoodsPriceSearchComponent from "./components/GoodsPriceSearchComponent";
import GoodsTypeSearchComponent from './components/GoodsTypeSearchComponent';
import {I18n} from './../lang/index'
var Dimensions = require('Dimensions');
var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;

export default class Query extends Component<Props> {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            selected: 1,
            isPrice: true,
            isShowPrice: 'none',
            isShowType: 'none'
        }
    }

    //给子组件用来传price用的方法
    priceCallBack(isPrice) {
        this.setState({isPrice: isPrice})
    }

    submit() {
        this.setState({
            isShowPrice: 'none'
        })
    }

    typeCallBack() {
        this.setState({
            isShowType: 'none'
        })
    }

    returnColor(index) {
        return this.state.selected == index ? '#ff8f31' : '#181818';
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.navigationBar}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <Image style={{height: 20, width: 20, marginRight: 10}} source={require('../res/back.png')}/>
                    </TouchableOpacity>
                    <View style={styles.navigationBarBackground}>
                        <Image style={{height: 20, width: 20}} source={require('../res/searchs.png')}/>
                        <TextInput style={{flex: 1, marginLeft: 10, paddingTop: 3, paddingBottom: 3}}
                                   underlineColorAndroid='transparent' textAlignVertical={'center'} />
                    </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity activeOpacity={1} style={styles.tabViewItem} onPress={() => {
                        this.setState({
                            isShowType: 'none',
                            isShowPrice: 'none',
                            selected: 1
                        })
                    }}>
                        <Text style={[styles.tabTextItem, {color: this.returnColor(1)}]}>{I18n.t('GoodsSearchList.synthesize')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1} style={styles.tabViewItem} onPress={() => {
                        this.setState({
                            isShowType: 'none',
                            isShowPrice: 'flex',
                            selected: 2
                        })
                    }}>
                        <Text style={[styles.tabTextItem, {color: this.returnColor(2)}]}>{I18n.t('GoodsSearchList.price')}</Text>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Image style={{width: 8, height: 5, marginLeft: 2}}
                                   source={this.state.isPrice ? require('../res/up1.png') : require('../res/up2.png')}/>
                            <Image style={{width: 8, height: 5, marginLeft: 2, marginTop: 2}}
                                   source={this.state.isPrice ? require('../res/down1.png') : require('../res/down2.png')}/>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={1} style={styles.tabViewItem} onPress={() => {
                        this.setState({
                            isShowPrice: 'none',
                            isShowType: 'flex',
                            selected: 3
                        })
                    }}>
                        <Text style={[styles.tabTextItem, {color: this.returnColor(3)}]}>{I18n.t('NewScreen.category')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.splitLine}/>

                <View style={styles.flotation}>
                    <View style={{display: this.state.isShowPrice}}>
                        <GoodsPriceSearchComponent priceCallBack={this.priceCallBack.bind(this)} submit={this.submit.bind(this)}/>
                    </View>

                    <View style={{display: this.state.isShowType, backgroundColor: '#ffffff'}}>
                        <GoodsTypeSearchComponent typeCallBack={this.typeCallBack.bind(this)} numColumns={5} screenWidth={ScreenWidth}/>
                    </View>
                </View>

                <Text>sdfssfdsfsdfsdfsdfsdf
                    sdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdfsdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdf
                    sdfssfdsfsdfsdfsdfsdf
                    sdfsdffdf</Text>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        backgroundColor:'#ffffff'

    },
    navigationBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingLeft: 10,
        paddingRight: 10
    },
    navigationBarBackground: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        flex: 1,
        height: 30,
        paddingLeft: 10,
        alignItems: 'center',
        borderRadius: 3
    },
    containerTab: {
        flex: 1,
        height: 50
    },
    tabViewItem: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabTextItem: {
        color: '#181818',
        fontSize: 16
    },
    splitLine: {
        backgroundColor: '#333333',
        height: 0.5,
        position: 'absolute',
        width: ScreenWidth,
        top: 96,
        zIndex: 9999,
        left: 0
    },
    flotation: {
        flex: 1,
        position: 'absolute',
        width: ScreenWidth,
        height: ScreenHeight,
        top: 96,
        zIndex: 999,
        left: 0
    }
})
