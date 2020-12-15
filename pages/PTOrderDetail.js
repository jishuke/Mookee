/*
* 拼团订单详情页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Image, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions,ScrollView
} from 'react-native';
import RequestData from "../RequestData";
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import SldShareCommon from "../component/SldShareCommon";
import pxToDp from "../util/pxToDp";
import PriceUtil from '../util/PriceUtil'

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');

let pn = 1;
let hasmore = true;
const page = 10;
import {I18n} from './../lang/index'

const activeArr = [
    {name: I18n.t('PTOrderDetail.Regiment'), imgSrc: require('../assets/images/team_detail_icon1.png')},
    {name: I18n.t('PTOrderDetail.invitation'), imgSrc: require('../assets/images/team_detail_icon2.png')},
    {name: I18n.t('PTOrderDetail.shipments'), imgSrc: require('../assets/images/team_detail_icon3.png')},
    {name: I18n.t('PTOrderDetail.refund'), imgSrc: require('../assets/images/team_detail_icon3.png')}];
let time;
let setTimer = null;

export default class PTOrderDetail extends Component {

    constructor(props) {

        super(props);
        this.state = {
            id: props.navigation.state.params.id,//拼团订单id
            title: I18n.t('PTOrderDetail.title'),
            is_show_share: 0,//是否分享，0为否，1为是
            share_data: {},//分享的数据
            pin_id: '',
            moreGoodsList: [],
            info: '',
            memberList: [],
            day: '',
            m: '',
            h: '',
            s: '',
            refresh: false,
        }
    }

    componentWillMount() {
        this.get_pin_detail();
    }

    //获取拼团详情
    get_pin_detail = () => {
        RequestData.postSldData(AppSldUrl + '/index.php?app=team&mod=detail&sld_addons=pin&team_id=' + this.state.id, {
            key: key,
        })
            .then(result => {
                if (result.code != '200') {
                    return;
                } else {
                    const data = result.datas;
                    let share_data = {};

                    share_data.type = 'goods';
                    share_data.text = data.info.goods_name;
                    share_data.img = data.info.sld_pic;
                    share_data.webUrl = ImgUrl + "/cwap_product_detail.html?gid=" + data.info.gid + "&team_id=" + data.info.sld_team_id,
                        share_data.title = I18n.t('PTOrderDetail.text1');
                    this.setState({
                        share_data: share_data,
                        memberList: result.datas.list,
                        info: result.datas.info,
                        pin_id: result.datas.info.sld_pin_id
                    });
                    this.getMorePinList();
                    let info = result.datas.info;
                    if (info.sld_tuan_status == 0 && info.order_state != 10) {
                        time = info.sld_end_datetime;
                        this.timer();
                        setTimer = setInterval(() => {
                            this.timer()
                        }, 1000)
                    }
                }
            })
            .catch(error => {
                ViewUtils.sldToastTip(error);
            })
    }

    // 倒计时
    timer() {
        let leftTime = (new Date(time)) - new Date(); //计算剩余的毫秒数

        if (leftTime <= 0) {
            clearInterval(setTimer);
            return;
        }
        let day = parseInt(leftTime / 1000 / 60 / 60 / 24);
        let hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算总小时
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

        function checkTime(num) {
            return (num > 9 ? num : '0' + num);
        }

        if (hours >= 0 || minutes >= 0 || seconds >= 0) {
            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);
            this.setState({
                day: day,
                h: hours,
                m: minutes,
                s: seconds
            })
        }
    }

    // 获取更多拼团
    getMorePinList() {
        let {pin_id} = this.state;
        RequestData.postSldData(AppSldUrl + '/index.php?app=team&mod=more&sld_addons=pin&pn=' + pn + '&pin_id=' + pin_id, {
            key
        }).then(res => {
            if (res.code != '200') {
                return;
            }
            if (pn == 1) {
                this.setState({
                    moreGoodsList: res.datas.goods
                })
            } else {
                let {moreGoodsList} = this.state;
                this.setState({
                    moreGoodsList: moreGoodsList.concat(res.datas.goods)
                })
            }

            if (res.hasmore) {
                pn++;
            } else {
                hasmore = false;
            }
        }).catch(err => {
        })
    }

    goShare = () => {
        this.setState({
            is_show_share: 1,
        });
    }
    cancleShare = () => {
        this.setState({
            is_show_share: 0,
        });
    }

    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refresh: true
        }, () => {
            pn = 1;
            hasmore = true;
            this.getMorePinList();
        })
    }

    // 上拉加载
    getNewData = () => {
        if (hasmore) {
            this.getMorePinList();
        }
    }

    renderItem = (item) => {
        return (
            <TouchableOpacity
                style={{
                    height: pxToDp(520),
                    width: pxToDp(345),
                    marginHorizontal: pxToDp(15),
                    backgroundColor: '#fff',
                    borderRadius: pxToDp(6),
                    overflow: 'hidden'
                }}
                onPress={() => {
                    this.props.navigation.navigate('GoodsDetailNew', {gid: item.gid})
                }}
            >
                <View>
                    <Image
                      style={{width: pxToDp(345),height: pxToDp(345)}} source={{uri: item.sld_pic}} resizeMode={'contain'}
                      defaultSource={require('../assets/images/default_icon_400.png')}
                    />
                    <Text ellipsizeMode={'tail'} numberOfLines={2} style={{color: '#333',fontSize: pxToDp(28),padding: pxToDp(20)}}>{item.goods_name}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: pxToDp(20)
                        }}
                    >
                        <Text style={{color: '#EF1B21',fontSize: pxToDp(22)}}>Ks <Text style={{fontSize: pxToDp(32),fontWeight: '600'}}>{PriceUtil.formatPrice(item.sld_pin_price)}</Text></Text>
                        <Text style={{fontSize: pxToDp(22),color: '#999'}}>{I18n.t('PinTuanOrder.province')}{item.sheng}{I18n.t('TuanGou.yuan')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const {title, info, memberList, refresh, moreGoodsList} = this.state;
        return (
            <ScrollView style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)} right_type='icon'
                           right_event={() => this.goShare()} right_icon={require('../assets/images/share.png')}/>

                <View style={GlobalStyles.line}/>
                <SldShareCommon
                    is_show_share={this.state.is_show_share}
                    data={this.state.share_data}
                    cancleShare={() => this.cancleShare()}
                />

                {info != '' && <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('GoodsDetailNew', {gid: info.gid, team_id: info.sld_team_id})
                    }}
                >
                    <View style={styles.goods}>
                        <View style={styles.goods_left}>
                            <Image style={{width: pxToDp(230), height: pxToDp(230)}} resizeMode={'contain'}
                                   source={{uri: info.sld_pic}}
                                   defaultSource={require('../assets/images/default_icon_400.png')}
                            />
                            <Image style={styles.status}
                                   source={info.sld_tuan_status == 0 ? require('../assets/images/team_status_0.png') : (info.sld_tuan_status == 1 ? require('../assets/images/team_status_1.png') : require('../assets/images/team_status_2.png'))}/>
                        </View>
                        <View style={styles.goods_info}>
                            <Text style={{color: '#222', fontSize: pxToDp(30),}}>{info.goods_name}</Text>
                            <Text style={{color: '#999', fontSize: pxToDp(24)}}>{info.sld_team_count}{I18n.t('PinTuanOrder.roll')}
                                <Text style={styles.line}/>{I18n.t('PinTuanOrder.spell')} {info.sales}{I18n.t('TuanGou.Piece')}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: pxToDp(20), color: '#EF1B21'}}>Ks <Text
                                    style={{fontWeight: '600', fontSize: pxToDp(40)}}>{PriceUtil.formatPrice(info.sld_pin_price)}</Text></Text>
                                <Text style={{
                                    fontSize: pxToDp(20),
                                    color: '#999',
                                    fontWeight: '300'
                                }}>{I18n.t('MyScreen.membershiplevel')}省{info.sheng}{I18n.t('TuanGou.yuan')}元</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>}

                {info != '' && <View style={{
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    paddingVertical: pxToDp(30),
                    marginBottom: pxToDp(30)
                }}>
                    {info.sld_tuan_status == 1 && <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('OrderDetail', {order_id: info.order_id})
                        }}
                    >
                        <Text style={styles.tuan_status}>{info.sld_team_count2}{I18n.t('PTOrderDetail.text2')}</Text>
                    </TouchableOpacity>}

                    {info.sld_tuan_status == 2 && <Text style={styles.tuan_status}>{I18n.t('PTOrderDetail.text3')}</Text>}

                    {info.sld_tuan_status != 1 && info.sld_tuan_status != 2 && info.has_join > 0 && info.order_state == 10 && (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('OrderList')
                            }}
                        >
                            <Text style={styles.tuan_status}>{I18n.t('PTOrderDetail.text4')}</Text>
                        </TouchableOpacity>)}

                    {info.sld_tuan_status != 1 && info.sld_tuan_status != 2 && info.has_join > 0 && info.order_state != 10 &&
                    <Text style={styles.tuan_status}>{I18n.t('PTOrderDetail.then')} <Text
                        style={{color: '#ee1821', fontWeight: '600'}}>{info.cha}</Text>{I18n.t('PTOrderDetail.text5')}</Text>}

                    {info.sld_tuan_status != 1 && info.sld_tuan_status != 2 && info.has_join == 0 &&
                    <Text style={styles.tuan_status}>{I18n.t('PTOrderDetail.then')} {info.cha}{I18n.t('PTOrderDetail.text6')}</Text>}

                    <View style={styles.swiper}>
                        {info.sld_team_count2 > 0 && memberList.map((el, index) => <View
                            style={{marginHorizontal: pxToDp(20)}}>
                            <Image
                              style={{
                                width: pxToDp(80),
                                height: pxToDp(80),
                                borderRadius: pxToDp(40),
                                overflow: 'hidden'
                            }}
                              resizeMode={'contain'}
                              source={{uri: el.avatar}}
                              defaultSource={require('../assets/images/default_icon_124.png')}
                            />
                            {index == 0 && <Text style={styles.tuanz}>{I18n.t('PTOrderDetail.colonel')}</Text>}
                        </View>)}
                    </View>

                    {info.sld_tuan_status == 0 && info.order_state == 10 &&
                    <View style={styles.time}><Text>{I18n.t('PTOrderDetail.text7')}</Text></View>}

                    {info.sld_tuan_status == 0 && info.order_state != 10 && <View style={styles.time}>
                        <Text style={{color: '#333', fontSize: pxToDp(28)}}>{I18n.t('PTOrderDetail.over')}：
                            <Text style={styles.con}>{this.state.day}</Text> {I18n.t('PTOrderDetail.sky')}
                            <Text style={styles.con}>{this.state.h}</Text> ：
                            <Text style={styles.con}>{this.state.m}</Text> ：
                            <Text style={styles.con}>{this.state.s}</Text>
                        </Text>
                    </View>}

                    {info.sld_tuan_status == 1 && <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('GoodsDetailNew', {gid: info.gid, team_id: info.sld_team_id})
                        }}
                    >
                        <View style={styles.btn}>
                            <Text style={{color: '#fff', fontSize: pxToDp(26)}}>{I18n.t('PTOrderDetail.buy')}</Text>
                        </View>
                    </TouchableOpacity>}

                    {info.sld_tuan_status == 2 && <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('GoodsDetailNew', {gid: info.gid, team_id: info.sld_team_id})
                        }}
                    >
                        <View style={styles.btn}>
                            <Text style={{color: '#fff', fontSize: pxToDp(26)}}>{I18n.t('PTOrderDetail.group')}</Text>
                        </View>
                    </TouchableOpacity>}

                    {info.has_join <= 0 && <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('GoodsDetailNew', {gid: info.gid, team_id: info.sld_team_id})
                        }}
                    >
                        <View style={styles.btn}>
                            <Text style={{color: '#fff', fontSize: pxToDp(26)}}>{I18n.t('PTOrderDetail.immediately')}</Text>
                        </View>
                    </TouchableOpacity>}
                </View>}

                <View style={styles.active}>
                    {activeArr.map(el => {
                        return (
                            <View style={styles.ac_item}>
                                <Image style={{width: pxToDp(56), height: pxToDp(56)}} source={el.imgSrc}/>
                                <Text
                                    style={{
                                        fontSize: pxToDp(22),
                                        color: '#333',
                                        marginTop: pxToDp(10)
                                    }}>{el.name}</Text>
                            </View>
                        )
                    })}
                </View>

                <View style={styles.more}>
                    <View style={styles.HLine}/>
                    <Text style={{color: '#333', fontSize: pxToDp(32)}}>{I18n.t('PTOrderDetail.more')}</Text>
                    <View style={styles.HLine}/>
                </View>

                {moreGoodsList.length > 0 && <FlatList
                    horizontal={false}
                    data={moreGoodsList}
                    extraData={this.state}
                    onRefresh={() => this.onRefresh()}
                    refreshing={refresh}
                    onEndReachedThreshold={0.3}
                    onEndReached={() => this.getNewData()}
                    renderItem={({item}) => this.renderItem(item)}
                />}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    more:{
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: pxToDp(30),
        backgroundColor: '#fff',
    },
    HLine:{
        width: pxToDp(110),
        height: pxToDp(1),
        backgroundColor: '#ccc',
        marginHorizontal: pxToDp(30)
    },
    goods: {
        flexDirection: 'row',
        height: pxToDp(270),
        paddingHorizontal: pxToDp(30),
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: pxToDp(10),
        marginBottom: pxToDp(30),
    },
    goods_left: {
        width: pxToDp(230),
        height: pxToDp(230),
        alignItems: 'center',
        justifyContent: 'center',
    },
    status: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: pxToDp(120),
        height: pxToDp(120),
        zIndex: 99,
    },
    goods_info: {
        flex: 1,
        minHeight: pxToDp(230),
        paddingLeft: pxToDp(30),
        justifyContent: 'space-around',
    },
    line: {
        width: pxToDp(1),
        height: pxToDp(36),
        backgroundColor: '#999',
        marginHorizontal: pxToDp(10)
    },
    active: {
        width: deviceWidth,
        height: pxToDp(160),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        marginBottom: pxToDp(30),
    },
    ac_item: {
        alignItems: 'center',
    },
    swiper: {
        paddingVertical: pxToDp(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tuanz: {
        position: 'absolute',
        bottom: pxToDp(-20),
        left: pxToDp(10),
        backgroundColor: '#FD4348',
        color: '#fff',
        fontSize: pxToDp(22),
        width: pxToDp(60),
        height: pxToDp(40),
        textAlign: 'center',
        lineHeight: pxToDp(40),
        borderRadius: pxToDp(6),
    },
    tuan_status: {
        textAlign: 'center',
        color: '#666',
        fontSize: pxToDp(26),
    },
    time: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    con: {
        display: 'flex',
        paddingHorizontal: pxToDp(10),
        paddingVertical: pxToDp(5),
        marginHorizontal: pxToDp(10),
        backgroundColor: '#e1e1e1',
        borderRadius: pxToDp(4),
    },
    btn: {
        width: pxToDp(600),
        height: pxToDp(80),
        borderRadius: pxToDp(40),
        backgroundColor: '#EE1B21',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(30),
    }
})
