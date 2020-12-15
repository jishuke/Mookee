/*
* 拼团订单列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, FlatList
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import pxToDp from "../util/pxToDp";

let pn = 1;
let hasmore = true;
const page = 10;
import {I18n} from './../lang/index'
export default class PinTuanOrder extends Component {

    constructor(props) {

        super(props);
        this.state = {
            title: I18n.t('PinTuanOrder.booking'),
            tid: 0,
            pinList: [],
            isLoading: 0,
            refresh: false
        }
    }

    componentWillMount() {
        this.getList();
    }

    getList() {
        let {tid} = this.state;
        RequestData.postSldData(AppSldUrl + '/index.php?app=team&mod=data&sld_addons=pin&tid='+tid+'&pn='+pn, {
            key
        }).then(res => {
            if (res.code != '200') {
                return;
            }
            if (pn == 1) {
                this.setState({
                    pinList: res.datas.goods,
                    isLoading: 1,
                    refresh: false
                })
            } else {
                let pinList = this.state.pinList;
                this.setState({
                    pinList: pinList.concat(res.datas.goods)
                })
            }
            if (res.hasmore) {
                pn++;
            } else {
                hasmore = false
            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
            this.setState({
                isLoading: 1,
                refresh: false
            })
        })
    }

    // 切换分类
    change = (id) => {
        this.setState((prevState, p) => {
            return {
                tid: id
            }
        }, () => {
            pn = 1;
            hasmore = true;
            this.getList();
        })
    }

    // renderItem
    renderItem = (item) => {
        let imgSrc = item.sld_tuan_status == 0 ? require('../assets/images/team_status_0.png') : (item.sld_tuan_status == 1 ? require('../assets/images/team_status_1.png') : require('../assets/images/team_status_2.png'));
        return (
            <TouchableOpacity
                onPress={()=>{
                    this.props.navigation.navigate('PTOrderDetail',{id: item.sld_team_id});
                }}
                style={styles.item}>
                <View style={styles.item_left}>
                    <Image style={{width: pxToDp(230),height: pxToDp(230)}} source={{uri: item.sld_pic}} resizeMode={'contain'}/>
                    <Image source={imgSrc} style={styles.status}/>
                </View>
                <View style={styles.item_info}>
                    <Text style={{color: '#222',fontSize: pxToDp(30),}}>{item.goods_name}</Text>
                    <Text style={{color: '#999',fontSize: pxToDp(24)}}>{item.sld_team_count}{I18n.t('PinTuanOrder.roll') } <Text style={styles.line}></Text>{I18n.t('PinTuanOrder.spell') }{item.sales}{I18n.t('PinTuanOrder.Piece') }</Text>
                    <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                        <Text style={{fontSize: pxToDp(20),color: '#EF1B21'}}>Ks <Text style={{fontWeight: '600',fontSize: pxToDp(40)}}>{item.sld_pin_price}</Text></Text>
                        <Text style={{fontSize: pxToDp(20),color: '#999',fontWeight: '300'}}>{I18n.t('PinTuanOrder.province') }{item.sheng}{I18n.t('TuanGou.yuan') }</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    // 上拉加载
    getNewData = () => {
        if (hasmore) {
            this.getList();
        }
    }

    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refresh: true
        }, () => {
            pn = 1;
            hasmore = true;
            this.getList();
        })
    }

    render() {
        const {title, tid, pinList, isLoading, refresh} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                <View style={styles.nav}>
                    <TouchableOpacity
                        style={[styles.nav_item, {borderBottomColor: tid == 1 ? '#d91e17' : 'transparent'}]}
                        onPress={() => this.change(1)}
                    >
                        <View>
                            <Text style={{fontSize: pxToDp(26), color: tid == 1 ? '#d91e17' : '#222'}}>{I18n.t('PinTuanOrder.Iama') }</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.nav_item, {borderBottomColor: tid == 0 ? '#d91e17' : 'transparent'}]}
                        onPress={() => this.change(0)}
                    >
                        <View>
                            <Text style={{fontSize: pxToDp(26), color: tid == 0 ? '#d91e17' : '#222'}}>{I18n.t('PinTuanOrder.Participate') }</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {pinList.length > 0 && <FlatList
                    data={pinList}
                    extraData={this.state}
                    onRefresh={() => this.onRefresh()}
                    refreshing={refresh}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => this.getNewData()}
                    renderItem={({item}) => this.renderItem(item)}
                />}

                {pinList.length == 0 && isLoading == 1 && <View style={{flex: 1, justifyContent: 'center'}}>
                    {ViewUtils.noData2({
                        title: I18n.t('PinTuanOrder.activity'),
                        tip: I18n.t('PinTuanOrder.discounts'),
                        imgSrc: require('../assets/images/search_w.png'),
                        btnTxt:I18n.t('PinTuanOrder.look') ,
                        callback: () => {
                            this.props.navigation.navigate('GoodsSearchList', {keyword: '', catid: ''})
                        }
                    })}
                </View>}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    nav: {
        height: pxToDp(90),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff'
    },
    nav_item: {
        flex: 1,
        height: pxToDp(90),
        marginHorizontal: pxToDp(30),
        borderBottomWidth: pxToDp(3),
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item:{
        flexDirection: 'row',
        height: pxToDp(270),
        paddingHorizontal: pxToDp(30),
        marginTop: pxToDp(30),
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    item_left:{
        width: pxToDp(230),
        height: pxToDp(230),
        alignItems: 'center',
        justifyContent: 'center',
    },
    status:{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: pxToDp(120),
        height: pxToDp(120),
        zIndex: 99,
    },
    item_info:{
        flex: 1,
        minHeight: pxToDp(230),
        paddingLeft: pxToDp(30),
        justifyContent: 'space-around',
    },
    line:{
        width: pxToDp(1),
        height: pxToDp(36),
        backgroundColor: '#999',
        marginHorizontal: pxToDp(10)
    }
})
