import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    View
} from 'react-native';
import pxToDp from "../../util/pxToDp";
import {I18n} from './../../lang/index'

export default class Price extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSortPrice: props.isSortPrice,
            minimumPrice: props.minimumPrice,
            highestPrice: props.highestPrice,
        }
    }


    render() {

        var colorValue = this.state.isSortPrice ? '#d5d5d5' : main_color;
        var colorValue1 = this.state.isSortPrice ? main_color : '#d5d5d5';

        return (
            <View style={styles.container}>

                <View style={styles.childContainer}>

                    <Text style={styles.textItem}>{I18n.t('GoodsSearchList.screen')}</Text>

                    <TextInput style={[styles.inputItem, {marginRight: pxToDp(16), color: main_color}]}
                               underlineColorAndroid='transparent' textAlignVertical={'center'}
                               keyboardType='numeric' maxLength={8} textAlign={'center'}
                               placeholder={I18n.t('GoodsFilter.minimum_price')} value={this.state.minimumPrice}
                               onChangeText={(text) => this.setState({minimumPrice: text})}/>

                    <Text style={{backgroundColor: '#d5d5d5', width:pxToDp(20), height: 0.5}}></Text>

                    <TextInput style={[styles.inputItem, {marginLeft: pxToDp(16), color: main_color}]}
                               underlineColorAndroid='transparent' textAlignVertical={'center'}
                               keyboardType='numeric' maxLength={8} textAlign={'center'}
                               placeholder={I18n.t('GoodsFilter.top_price')} value={this.state.highestPrice}
                               onChangeText={(text) => this.setState({highestPrice: text})}/>

                </View>

                <View style={[styles.childContainer, {marginTop: 30}]}>
                    <Text style={styles.textItem}>{I18n.t('GoodsSearchList.comprehensive')}</Text>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.sortItem, {borderColor: colorValue,marginRight:pxToDp(52)}]} onPress={() => {
                        if (!this.state.isSortPrice) {
                            return
                        }
                        this.setState({
                            isSortPrice: false
                        })
                        //这个值怎么传给父组件
                        //用传过来的changePrice属性(props)，是个函数，呼叫它把price交给父组件中的函数去处理
                        this.props.priceCallBack(this.state.isSortPrice)
                    }}>
                        <Text style={{color: colorValue}}>{I18n.t('GoodsSearchList.lowtohigh')}</Text>
                        <Image style={styles.image}
                               source={this.state.isSortPrice ? require('../../res/up2.png') : require('../../res/up1.png')}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={[styles.sortItem, {borderColor: colorValue1}]} onPress={() => {
                        if (this.state.isSortPrice) {
                            return
                        }
                        this.setState({
                            isSortPrice: true
                        })
                        this.props.priceCallBack(this.state.isSortPrice)
                    }}>
                        <Text style={{color: colorValue1}}>{I18n.t('GoodsSearchList.Hightolow·')}</Text>
                        <Image style={styles.image}
                               source={this.state.isSortPrice ? require('../../res/down2.png') : require('../../res/down1.png')}></Image>
                    </TouchableOpacity>

                </View>

                <View style={[styles.splitLine, {marginTop: pxToDp(50)}]}/>

                <View style={styles.containerButton}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.buttonStyle}
                        onPress={() => {
                            this.setState({
                                minimumPrice: '',
                                highestPrice: '',
                            })
	                        this.setState({
		                                      isSortPrice: false
	                                      })
	                        this.props.priceCallBack(this.state.isSortPrice)
                        }}>
                        <Text textAlign={'center'} style={{fontSize: pxToDp(30),fontWeight:'300',color:'#585858'}}>{I18n.t('export default.Empty·')}</Text>
                    </TouchableOpacity>

                    <Text style={{height: pxToDp(90),width:1,backgroundColor:'#e5e5e5'}}/>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.buttonStyle}
                        onPress={() => {
                            this.props.submit(this.state.isSortPrice,this.state.minimumPrice,this.state.highestPrice);
                        }}>
                        <Text textAlign={'center'} style={{fontSize: pxToDp(30), color: main_color,fontWeight:'300'}}>{I18n.t('export default.ok')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.splitLine}/>

            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        backgroundColor: '#ffffff'
    },
    childContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30
    },
    containerTab: {
        flex: 1,
        height: 50
    },
    containerButton: {
        height: pxToDp(90),
        flexDirection: 'row'
    },
    viewItem: {
        flex: 1,
        height: 50,
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textItem: {
        color: '#666',
        fontSize: pxToDp(28),
        marginRight: 18,
        fontWeight:'300',
    },
    inputItem: {
        width: pxToDp(210),
        borderWidth: 0.5,
        borderColor: '#d5d5d5',
        paddingTop:2,
        paddingBottom:2,
        height:pxToDp(50),
    },
    sortItem: {
        width: pxToDp(210),
        height: pxToDp(50),
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        flexDirection: 'row'
    },
    image: {
        width: 8,
        height: 5,
        marginLeft: 2
    },
    splitLine: {
        height: 0.5,
        backgroundColor: '#e5e5e5'
    },
    buttonStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
