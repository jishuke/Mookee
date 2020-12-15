/*
* 商品详情页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Image,
    StatusBar,
    TouchableOpacity, DeviceInfo,
} from 'react-native';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from "../util/ViewUtils";
import pxToDp from "../util/pxToDp";
import RequestData from '../RequestData';
import SldFlatList from '../component/SldFlatList'
import CountEmitter from "../util/CountEmitter";
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;
var Dimensions = require('Dimensions');
var {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');

let rpn = 1;
let rhasmore = true;
let tpn = 1;
let thasmore = true;

export default class ReturnRefundList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentBody: props.navigation.state.params != null ? props.navigation.state.params.index : '1',
            refund_list: [],   // 退款列表
            return_list: [],  // 退货列表
            show_gotop: false,
            refresh: false,
            refresh_loading: 0,
            return_loading: 0
        }
    }

    componentWillMount() {
        this.initPage();
        CountEmitter.addListener('refund', () => {
            tpn = 1;
            thasmore = true;
            this.getReturnList();
        });
    }

    componentWillUnmount() {
        //卸载监听
        CountEmitter.removeListener('refund', () => {
        });
    }

    //初始化页面数据
    initPage = () => {
        if (this.state.currentBody == 1) {
            this.getRefundList();
        }else{
            this.getReturnList();
        }
    }

    // 获取退款列表
    getRefundList() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=refundList&key=' + key + '&pn=' + rpn + '&page=10').then(res => {
            if (res.code == 200) {
                if (rpn == 1) {
                    this.setState({
                        refund_list: res.datas.refund_list,
                        refresh_loading: 1
                    })
                } else {
                    let {refund_list} = this.state;
                    this.setState({
                        refund_list: refund_list.concat(res.datas.refund_list)
                    })
                }
                if (res.hasmore) {
                    rpn++;
                } else {
                    rhasmore = false;
                }
            }
        }).catch(err => {
            ViewUtils.sldErrorToastTip(error);
        })
    }

    // 获取退货列表
    getReturnList() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=returnList&key=' + key + '&pn=' + rpn + '&page=10').then(res => {
            if (res.code == 200) {
                if (tpn == 1) {
                    this.setState({
                        return_list: res.datas.refund_list,
                        return_loading: 1
                    })
                } else {
                    let {return_list} = this.state;
                    this.setState({
                        return_list: return_list.concat(res.datas.refund_list)
                    })
                }
                if (res.hasmore) {
                    tpn++;
                } else {
                    thasmore = false;
                }
            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
        })
    }

    //导航左边图标
    renSldLeftButton(image) {
        return <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                this.props.navigation.goBack();
            }}>
            <View style={GlobalStyles.topBackBtn}>
                <Image style={GlobalStyles.topBackBtnImg} source={image}></Image>
            </View>
        </TouchableOpacity>;
    }

    //切换事件
    changePage = (type) => {
        if (this.state.return_list.length == 0) {
            this.getReturnList();
        }
        this.setState({
            currentBody: type,
        });
    }

    getNewData() {
        let {currentBody} = this.state;
        if (currentBody == 1) {
            if (rhasmore) {
                this.getRefundList();
            }
        } else {
            if (thasmore) {
                this.getReturnList();
            }
        }
    }

    handleScroll = (event) => {
        let offset_y = event.nativeEvent.contentOffset.y;
        let {show_gotop} = this.state;
        if (!show_gotop && offset_y > 100) {
            show_gotop = true
        }
        if (show_gotop && offset_y < 100) {
            show_gotop = false
        }
        this.setState({
            show_gotop: show_gotop,
        });
    }

    refresh() {
        let {currentBody} = this.state;
        if (currentBody == 1) {
            rpn = 1;
            rhasmore = true;
            this.getRefundList();
        } else {
            tpn = 1;
            thasmore = true;
            this.getReturnList();
        }
    }

    keyExtractor = (item, index) => {
        return index
    }

    //分割线组件
    separatorComponent = () => {
        return (
            <View style={GlobalStyles.space_shi_separate}/>
        );
    }

    renderItem = el => {
        const {currentBody} = this.state;
        return (
            <View style={styles.r_item}>
                <TouchableOpacity
                    style={styles.store}
                    onPress={() => {
                        this.props.navigation.navigate('Vendor', {vid: el.vid})
                    }}
                >
                    <Image source={require('../assets/images/sld_chat_go_shop.png')}
                           style={{width: pxToDp(36), height: pxToDp(36), marginRight: pxToDp(15)}}/>
                    <Text style={{color: '#333', fontSize: pxToDp(28)}}>{el.store_name}</Text>
                </TouchableOpacity>

                <View style={styles.goods}>
                    {el.order_goods.map(item => <View style={styles.goods_item}>
                        <View style={styles.img}>
                            <Image source={{uri: item.goods_image}} style={{width: pxToDp(128), height: pxToDp(128)}}
                                   resizeMode={'contain'}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.name}
                            onPress={() => {
                                this.props.navigation.navigate('GoodsDetailNew', {gid: item.gid})
                            }}
                        >
                            <Text style={{color: '#333'}}>{item.goods_name}</Text>
                        </TouchableOpacity>
                    </View>)}
                </View>

                <View style={styles.order_info}>
                    <Text>{el.add_time_wap}</Text>
                    <View style={styles.money}>
                        <Text style={{color: '#000', fontSize: pxToDp(26)}}>{I18n.t('ReturnRefundList.refund')}：</Text>
                        <Text style={{color: '#f23030'}}>ks{PriceUtil.formatPrice(el.refund_amount)}</Text>
                    </View>
                </View>

                <View style={styles.detail}>

                    {currentBody == 2 && el.refund_type == 2 && el.seller_state == 2 && el.return_type == 2 && el.goods_state == 1 &&
                    <TouchableOpacity
                        style={[styles.detail_btn, {marginRight: pxToDp(30)}]}
                        onPress={() => {
                            this.props.navigation.navigate('ReturnRefundSend', {
                                refund_id: el.refund_id
                            })
                        }}
                    >
                        <Text style={{fontSize: pxToDp(24)}}>{I18n.t('ReturnRefundList.shipments')}</Text>
                    </TouchableOpacity>}

                    <TouchableOpacity
                        style={styles.detail_btn}
                        onPress={() => {
                            this.props.navigation.navigate('ReturnRefundDetail', {
                                refund_id: el.refund_id
                            })
                        }}
                    >
                        <Text style={{fontSize: pxToDp(24)}}>{currentBody == 1 ? I18n.t('ReturnRefundList.particulars') : I18n.t('ReturnRefundList.salesreturn')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        const {currentBody, refund_list, return_list} = this.state;
        return (
            <View style={[styles.container]}>
                <View style={[{backgroundColor: '#fff'}]}>

                    <View style={{height:Platform.OS == 'ios'?(ios_type==''?35:ios_type):0}}>
                        <StatusBar style={{barStyle: 'default'}}/>
                    </View>
                    <View style={styles.navBar}>
                        <View style={styles.navBarButton}>
                            {this.renSldLeftButton(require('../assets/images/goback.png'))}
                        </View>
                        <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>


                            <View style={styles.goods_title_wrap}>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        this.changePage('1');
                                    }}>
                                    <View
                                        style={[styles.sld_goods_title_common, currentBody == '1' ? styles.goods_title_cur_goods : '']}>
                                        <Text
                                            style={{color: currentBody == '1' ? '#fff' : '#333'}}>{I18n.t('ReturnRefundList.Therefundlist')}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        this.changePage('2');
                                    }}>
                                    <View
                                        style={[styles.sld_goods_title_common, currentBody == '2' ? styles.goods_title_cur_detail : '',]}>
                                        <Text
                                            style={{color: currentBody == '2' ? '#fff' : '#333'}}>{I18n.t('ReturnRefundList.Returnsalistof')}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={GlobalStyles.line}/>

                {currentBody == 1 && refund_list.length > 0 && <SldFlatList
                    data={refund_list}
                    refresh_state={this.state.refresh}
                    show_gotop={this.state.show_gotop}
                    refresh={() => this.refresh()}
                    keyExtractor={() => this.keyExtractor()}
                    handleScroll={(event) => this.handleScroll(event)}
                    getNewData={() => this.getNewData()}
                    separatorComponent={() => this.separatorComponent()}
                    renderCell={(item) => this.renderItem(item)}
                />}

                {currentBody == 1 && this.state.refresh_loading == 1 && refund_list.length == 0 && <View
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                >
                    {ViewUtils.noData(I18n.t('ReturnRefundList.text1'), require('../assets/images/order_w.png'), I18n.t('ReturnRefundList.text2'))}
                </View>}

                {currentBody == 2 && return_list.length > 0 && <SldFlatList
                    data={return_list}
                    refresh_state={this.state.refresh}
                    show_gotop={this.state.show_gotop}
                    refresh={() => this.refresh()}
                    keyExtractor={() => this.keyExtractor()}
                    handleScroll={(event) => this.handleScroll(event)}
                    getNewData={() => this.getNewData()}
                    separatorComponent={() => this.separatorComponent()}
                    renderCell={(item) => this.renderItem(item)}
                />}

                {currentBody == 2 && this.state.return_loading == 1 && return_list.length == 0 && <View
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                >
                    {ViewUtils.noData(I18n.t('ReturnRefundList.text3'), require('../assets/images/order_w.png'), I18n.t('ReturnRefundList.text4'))}
                </View>}

            </View>

        )
    }
}
const styles = StyleSheet.create({
    detail_btn: {
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderWidth: pxToDp(1),
        width: pxToDp(140),
        height: pxToDp(60),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(10),
    },
    detail: {
        flexDirection: 'row',
        height: pxToDp(100),
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: pxToDp(30)
    },
    order_info: {
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pxToDp(20),
        borderBottomColor: '#E9E9E9',
        borderStyle: 'solid',
        borderBottomWidth: pxToDp(1),
    },
    money: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        flex: 1,
        paddingLeft: pxToDp(20),
    },
    img: {
        width: pxToDp(128),
        height: pxToDp(128),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(8)
    },
    goods: {
        backgroundColor: '#f8f8f8',
    },
    goods_item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: pxToDp(15),
        paddingHorizontal: pxToDp(20),
        height: pxToDp(158),
        borderBottomColor: '#E9E9E9',
        borderStyle: 'solid',
        borderBottomWidth: pxToDp(1),
    },
    r_item: {
        marginBottom: pxToDp(20),
        backgroundColor: '#fff',
    },
    store: {
        flexDirection: 'row',
        paddingHorizontal: pxToDp(30),
        height: pxToDp(80),
        alignItems: 'center',
    },
    bottomCommon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        borderRightWidth: 0.5,
        borderColor: '#dbdbdb',
    },
    shareCancle: {height: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',},
    spec_detail_text: {paddingLeft: 13, paddingRight: 13, fontSize: 14,},
    spec_detail_nosele: {
        borderColor: '#666',
        borderWidth: 0.5,
    },
    spec_detail_sele: {
        borderColor: '#e58011',
        borderWidth: 1,
    },
    spec_detail: {
        height: 35,
        marginRight: 15,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    spec_common_title: {
        color: '#666',
        fontSize: 16,
        marginBottom: 15
    },
    modalSpec: {
        backgroundColor: "#fff", height: deviceWidth,
        position: "absolute", left: 0, right: 0,
        width: deviceWidth,
    },
    spectitle: {
        flexDirection: 'row',
        height: 32,
        borderWidth: 0.5,
        borderColor: '#666',
        borderRadius: 4,
        marginBottom: 25,
        width: 111
    },
    common_layout_text: {
        color: '#666',
        fontSize: 17,
    },
    common_layout: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 37, height: 31},
    titleText: {color: '#333'},
    currentTitleText: {color: '#fff'},
    goods_title_cur_goods: {backgroundColor: '#7f7f7f', borderBottomLeftRadius: 4, borderTopLeftRadius: 4},
    goods_title_cur_detail: {backgroundColor: '#7f7f7f', borderBottomRightRadius: 4, borderTopRightRadius: 4},
    goods_title_wrap: {
        width: pxToDp(360),
        height: pxToDp(58),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#7f7f7f',
        borderRadius: 4,
        borderWidth: 0.5
    },
    current_title_text: {color: '#fff', fontSize: 15},
    sld_goods_title_common: {
        width: pxToDp(180),
        height: pxToDp(58),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sld_yushou_tag_num: {
        color: "#666",
        fontSize: 12
    },
    sld_yushou_tag: {
        color: "#d56f44",
        fontSize: 12
    },
    sld_promotion_tag: {color: "#fff", fontSize: 12, marginTop: 2, marginBottom: 2, marginLeft: 5, marginRight: 5},
    sld_promotion_bg: {
        borderRadius: 2,
        backgroundColor: '#000',
        height: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginTop: 32
    },
    eva_xing: {flexDirection: 'row'},
    service_detail_con: {color: '#999', fontSize: 15, marginTop: 10, marginBottom: 20},
    service_detail_title: {color: '#333', fontSize: 17},
    service_title: {
        flex: 1,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    service_title_text: {
        fontSize: 20,
        color: '#333',
    },
    popup_list: {
        height: 210,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0, left: 0, right: 0
    },
    sld_goods_title_view: {
        backgroundColor: '#fff',
    },
    sld_goods_detail_title: {
        fontSize: 17,
        color: '#333',
        marginTop: 15,
        width: Dimensions.get('window').width * 1 - 30,
        marginLeft: 15,
        lineHeight: 20,
    },
    sld_goods_detail_jingletitle: {
        fontSize: 15,
        color: '#666',
        marginTop: 10,
        width: Dimensions.get('window').width * 1 - 30,
        marginLeft: 15,
        lineHeight: 20,
    },
    sld_mem_score: {
        width: 15,
        height: 15,
        marginRight: 8,
    },
    sld_mem_grade: {
        width: 20,
        height: 20,
        marginRight: 15,
        marginLeft: 11,
    },
    sld_mem_avator: {
        width: 35,
        height: 35,
        marginLeft: 15,
        marginRight: 10,
    },
    sld_mem_name: {
        fontSize: 14,
        color: '#1b1b1b',
    },
    sld_eva_time_time: {
        marginLeft: 8,
        marginRight: 10
    },
    sld_eva_time_date: {
        marginLeft: 15,
    },
    sld_eva_time: {
        color: '#747474',
        fontSize: 13,
    },
    sld_eva_content: {
        marginLeft: 15,
        fontSize: 14,
        color: '#333',
        width: Dimensions.get('window').width * 1 - 30,
        flexDirection: 'row',
        lineHeight: 20
    },
    sld_single_line_vertical_center: {
        flexDirection: 'row',
        marginLeft: 15,
        width: Dimensions.get('window').width * 1 - 30,
    },
    sld_eval_img: {
        width: 60,
        height: 60,
        marginLeft: 15,
        borderWidth: 0.5,
        borderColor: '#eee',
    },
    sld_reply_part: {
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: '#f6f6f6',
        width: Dimensions.get('window').width * 1 - 30,
        padding: 8,
        marginBottom: 10,
        marginTop: 15,

    },
    sld_reply_title: {
        fontSize: 12,
        color: '#333',
        lineHeight: 18,

    },
    sld_reply_content: {
        color: '#7e7e7e',
    },
    // sld_single_line_vertical_center: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    sld_goods_detial_evalute: {
        backgroundColor: '#fff',
    },
    sld_goods_detail_part: {
        backgroundColor: '#fff',
    },
    sld_home_searchbar: {
        marginTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,

    },
    sld_home_search: {
        width: 200,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sldtabbartext: {
        fontSize: 17,
        fontWeight: '200',
        color: '#181818',
    },
    sldlineStyle: {
        height: 1,
        backgroundColor: '#000',
    },
    sld_wrap_lunbo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    sld_home_banner: {
        height: '100%',
        width: '100%',
    },

    paginationStyle: {
        bottom: 6,
    },
    dotStyle: {
        width: 8,
        height: 8,
        backgroundColor: '#a0a0a0',
        borderRadius: 4,
        marginTop: 20,
        marginBottom: 10,
        marginRight: 5,
    },
    activeDotStyle: {
        width: 8,
        height: 8,
        backgroundColor: '#d57812',
        borderRadius: 4,
    },
    sld_zero_part_img: {
        width: 165,
        height: 165,
    },
    sld_zero_part_last: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sld_zero_part_title: {
        width: 165,
        fontSize: 16,
        color: '#181818',
    },
    sld_zero_part_chuildtitle: {
        width: 140,
        fontSize: 13,
        color: '#967d56',
        overflow: 'hidden',
        height: 15,
        lineHeight: 15,
        marginTop: 5,
    },
    sld_zero_part_price: {
        color: '#ba1418',
        fontSize: 17,
        marginTop: 10,
    },
    sld_zero_part_list: {
        width: 165,
        flexDirection: 'column',
        marginLeft: 15,
    },
    sld_two_img: {
        flexDirection: 'row',
    },
    sld_home_zero_list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sld_home_two_img: {
        width: Dimensions.get('window').width / 2,
        height: 88,
    },
    sld_like_part_right: {
        flexDirection: 'column',
        height: 120,
        width: Dimensions.get('window').width * 1 - 140,
    },
    sld_like_part_title: {
        fontSize: 16,
        color: '#181818',
        height: 42,
        lineHeight: 21,
        paddingRight: 15,
    },
    sld_like_part_chuildtitle: {
        marginTop: 5,
        fontSize: 13,
        color: '#747474',
        height: 36,
        lineHeight: 18,
        paddingRight: 15,

    },
    sld_like_part_price: {
        fontSize: 18,
        color: '#ba1418',
        position: 'relative',
        bottom: -10,
    },
    sld_like_part_list: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        marginRight: 15,
    },
    sld_like_part_img: {
        width: 120,
        height: 120,
        marginRight: 15,
    },
    sld_home_view_more: {
        fontSize: 12,
        color: '#787878',
        alignItems: 'center',
        paddingBottom: 25,
        paddingTop: 25,
    },
    sld_home_xianshi_time_bg: {
        width: 25,
        height: 25,
        lineHeight: 25,
        color: '#fff',
        fontSize: 12,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        textAlign: 'center',

    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        paddingTop: StatusBar.currentHeight,
    },
    item: {
        flexDirection: 'row',
    },
    leftimage: {
        width: 50,
        height: 50,
    },
    label_service_left: {
        fontSize: 14,
        color: '#333',
    },
    sld_mem_top_bg: {
        width: Dimensions.get('window').width,
        height: 180,
        backgroundColor: '#2c2c2c'
    },

    sld_center_combine: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        paddingBottom: 20,
    },
    sld_home_heika_img: {
        // 设置宽度
        width: Dimensions.get('window').width,
        // 设置高度
        height: 110,
        // 设置图片填充模式
        resizeMode: 'cover'
    },
    topic: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 10,
        marginBottom: 10,
    },

    topicHead: {
        fontSize: 17,
        color: '#333',
        padding: 15,
        marginTop: 10
    },
    topicItem: {
        width: pxToDp(210),
        marginLeft: pxToDp(30),
    },
    topicImg: {
        width: pxToDp(210),
        height: pxToDp(210),
    },
    topicContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    topicTitle: {
        fontSize: 15,
        color: '#333',
        width: 105,
        marginTop: 5
    },
    topicDesc: {
        fontSize: 18,
        color: '#ba1418',
        marginTop: 4,
        fontWeight: '400'
    },
    goods_recommond: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    sld_rec_stylesld_rec_style: {
        height: 49,
        lineHeight: 49,
        color: '#bfbfbf',
        letterSpacing: 2,
        fontWeight: '400',
        marginTop: 8
    },
    sld_xianshi_time_bg: {
        width: 25,
        height: 25,
    },
    sld_xianshi_wrap: {
        position: 'relative',
        marginBottom: 15,
        marginTop: 13,
    },
    sld_home_xianshi_tip: {
        paddingLeft: 4,
        paddingRight: 4,
        color: '#999',
        marginTop: 14,
    },
    sld_rec_style: {
        height: 49,
        lineHeight: 49,
        color: '#bfbfbf',
        letterSpacing: 2,
        fontWeight: '400',
        marginTop: 8
    },
    sld_single_left: {
        fontSize: 16,
        color: '#353535',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    sld_single_right: {
        color: '#a4a4a4',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sld_single_right_text: {
        fontSize: 12,
        color: '#848689',
    },
    sld_single_line: {
        width: Dimensions.get('window').width,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between',
    },
    sld_single_right_icon: {
        height: 11,
        width: 11,
        alignSelf: 'center',
        opacity: 0.5
    },
    sld_single_left_view: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    sld_single_left_text: {
        marginLeft: 15,
        width: Dimensions.get('window').width * 1 - 90,
        overflow: 'hidden',
        paddingTop: 15,
        paddingBottom: 6,
    },
    sld_single_left_text_detail: {
        fontSize: 16,
        color: '#333',
        marginRight: 40,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,
        top: 0,
        right: 40,
        bottom: 0,
    },
    title: {
        fontSize: 18,
        color: '#333',
    },
    navBarButton: {
        alignItems: 'center',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 30 : 20) : 0,
    },

    cart_count_text: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: 'white',
        fontSize: 10,
        backgroundColor: '#E67F11',
        width: 15,
        height: 15,
        borderRadius: 50,
        textAlign: 'center'

    },

});
