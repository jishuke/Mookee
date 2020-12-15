/*
 * 首页
 * @slodon
 * */

import React, {Component} from 'react';
import {
    DeviceInfo,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
    FlatList,
    ActivityIndicator,
    NativeModules,
    Linking, Alert
} from 'react-native';
import LogUtil from "../util/LogUtil";
import StorageUtil from "../util/StorageUtil";
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';

import {I18n, LANGUAGE_CHINESE, LANGUAGE_ENGLISH, LANGUAGE_MIANWEN} from '../lang'
import HomeNavigationBar from "../component/home/HomeNavigationBar";
import Swiper from "react-native-swiper";
import PriceUtil from "../util/PriceUtil";
import LinearGradient from "react-native-linear-gradient";
import {IOS_SAFE_TOP_HEIGHT} from "../util/DeviceUtil";
import {
    guessLikeCatgory,
    guessLikeAllCatgorylList,
    getshuffingmessage,
    getVersion
} from '../api/homeApi'
import Modal from "react-native-modalbox";
let iOSToolModule = NativeModules.ToolModule;

var Dimensions = require('Dimensions');
const scrWidth = Dimensions.get('window').width;
// 导入Dimensions库
const {width, height} = Dimensions.get('window');
let new_data = [];

export default class HomeScreenNew extends Component {
    constructor(props) {
        super(props);
        this._handleInfo(diy_data_info);

        this.state = {
            localeLang: null,
            diy_data: diy_data_info,//存放所有的装修改数据
            flag: true,
            num: 1,
            // showWait: false,
            top_info: {sousuo_color: '#e00c1a'},//顶部信息：颜色和标题
            huodong_goodsInfo: [], //活动商品信息
            hour: '00',
            minutes: '00',
            seconds: '00',
            enableOnLayout: true, //猜你喜欢模块是否计算onLayout
            showLikeNav: false,
            guessLikeCategory: [],
            guessLikeGoodsList: [],
            msgs: [], //轮播消息
            content:[], // app更新内容,
            refreshing: false,
            currentCategoryId: '',
            userKey: '',
            pn: 1,
            data: [],
            hasmore: true
        };
        this.timer = null;
        this.topColor = '#FFF';
        this.currLanguage = global.language;
    }

    viewDidAppear = ''

    componentDidMount() {
        const { userKey } = this.state
        this.viewDidAppear = this.props.navigation.addListener(
            'didFocus',
            () => {
                 // console.log('首页显示了;', this.userKey, ', ', key)
                // StatusBar.setBackgroundColor('transparent');
                if (this.currLanguage !== global.language) {
                    this.currLanguage = global.language;
                    this.InitData();
                    // this.loadGuessLikeData({lang_type: global.language})
                    this.loadGuessAllLikeListData({pn: 1, rows: 10, lang_type: global.language})

                    if (this.msgTimer) {
                        clearInterval(this.msgTimer)
                        this.msgTimer = null
                        this.shuffingmessage({lang_type: global.language, num: 10})
                        this.msgTimer = setInterval(() => {
                            this.shuffingmessage({lang_type: global.language, num: 10})
                        }, 300000)
                    }
                }

                if (userKey !== key) {
                    this.setState({userKey: key})
                    // console.log('首页刷新')
                    // this.loadGuessLikeData({lang_type: global.language})
                    this.loadGuessAllLikeListData({pn: 1, rows: 10, lang_type: global.language})
                }
            }
        )

        this.leave = this.props.navigation.addListener(
            'willBlur',
            () => {
                 //console.log('首页离开了')
                // console.log("topColor: willBlur");
                // StatusBar.setBackgroundColor('#fff');
            }
        )

        LogUtil.info(I18n.t('lihaoran.zhuangtailan') + StatusBar.currentHeight);


        this.InitData();
        this.loadGuessAllLikeListData({pn: 1, rows: 10, lang_type: global.language})
        this.handleData(this.state.diy_data);
        // this.loadGuessLikeData({lang_type: global.language})

        // this.city_exchange = DeviceEventEmitter.addListener('updateCity', (param) => {
        //     this.InitData(param);
        // })
        // this.getTitleInfo();
        //
        // if (CitySite.bid != 0 && this.state.diy_data.length == 0) {
        //     this.timer = setInterval(() => {
        //         this.siteTimeOut();
        //     }, 0)
        // }

        if (!this.msgTimer) {
            this.shuffingmessage({lang_type: global.language, num: 10})
            this.msgTimer = setInterval(() => {
                this.shuffingmessage({lang_type: global.language, num: 10})
            }, 300000)
        }

        // 获取app更新信息
        StorageUtil.get('isUpdated', (error, object) => {
            // console.warn('ww:error, object', error, object);
            if (!error && object) {

            }else{
                this.getUpdateInfo();
            }
        });
    }

    componentWillUnmount() {
        this.viewDidAppear.remove();
        this.loginListener.remove();
        // clearInterval(this.timer);
        // this.timer = null
        this.msgTimer = null
    }

    //猜你喜欢商品分类
    loadGuessLikeData(params) {
        let { guessLikeCategory } = this.state
        guessLikeCatgory(params).then(res => {
            // console.log('猜你喜欢分类:', res)
            if (res.state === 200) {
                guessLikeCategory = [{category_name: I18n.t('OrderList.all')}]
                guessLikeCategory = guessLikeCategory.concat(res.data)
                this.setState({guessLikeCategory})
            }
        }).catch(err => {

        })
    }

    //消息轮播
    shuffingmessage(params) {
        getshuffingmessage(params).then(res => {
            console.log('消息轮播：', res)
            if (res.state === 200) {
                this.setState({msgs: res.data.list})
            }
        }).catch(err => {

        })
    }

    //加载数据
    InitData = () => {
        this.setState({refreshing: true}, () => {
            let url = AppSldUrl + `/index.php?app=index&mod=index_app&lang_type=${global.language}`;
            // console.log("首页接口url: " + url);
            //获取商城首页装修数据
            RequestData.getSldData(url)
                .then(result => {
                    // console.log('商城首页装修数据:', JSON.stringify(result));
                    if (!result.datas.error) {
                        let diy_data_info = result.datas.index_data;
                        this.setState({
                            // showWait: false,
                            diy_data: [],
                            huodong_goodsInfo: []
                        }, () => {
                            this.handleData(diy_data_info);
                        });

                        //限时活动数据
                        // this._activeInfo(diy_data_info)
                    }
                })
                .catch(error => {
                    ViewUtils.sldErrorToastTip(error);
                });
            this.getTitleInfo();
            // this.loadGuessLikeData({lang_type: global.language})
        })
    }

    //猜你喜欢全部商品列表
    loadGuessAllLikeListData(params) {
        let { data, refreshing, hasmore } = this.state
        if (refreshing || !hasmore) {
            return
        }

        this.setState({refreshing: true}, () => {
            guessLikeAllCatgorylList(params).then(result => {
                console.log('猜你喜欢全部商品列表:', result)
                if (result.state === 200 && result.data && result.data.res) {
                    if (params.pn > 1) {
                        data = data.concat(result.data.res)
                    } else {
                        data = result.data.res
                    }
                    this.setState({
                        data,
                        pn: params.pn+1,
                        hasmore: result.data.page_info.hasmore,
                        refreshing: false
                    })
                } else {
                    this.setState({refreshing: false})
                }
            }).catch(err => {
                this.setState({refreshing: false})
            })
        })
    }

    //版本更新
    getUpdateInfo() {
        if (Platform.OS === 'android') {
            NativeModules.BridgeManager.getAppVersion((event) => {
                this.getCurrentAppVersion(event)
            });
        } else {
            iOSToolModule.getAppVersion((error, event) => {
                if (!error) {
                    // console.log('iOS当前版本号:', event)
                    this.getCurrentAppVersion(event)
                }
            })
        }
    };

    getCurrentAppVersion(version) {
        getVersion({lang_type: global.language}).then(res => {
            // console.log('版本更新:', res)
            if(res.state === 200){
                this.setState({content:res.data.app_new_version_content});

                if((Platform.OS === 'android' && res.data.app_android_version > version) || (Platform.OS === 'ios' && res.data.app_ios_version > version)){
                    this.refs.redModal.open()
                }
            }
        }).catch(err => {

        })
    }

    goUpdate(i){
        StorageUtil.set('isUpdated', '1'); //  是否更新
        this.refs.redModal.close();
        if(i == 1){
            if(Platform.OS !== 'ios'){
                Linking.openURL('market://details?id=com.slodonapp.mookee_one_release')
            }else{
                //跳appStore
                Linking.openURL('http://itunes.apple.com/cn/app/id1495277472?mt=8')
            }
        }else{

        }
    }

    renderExpenseItem(item , i) {
        return  <Text style={{marginLeft: 5, lineHeight:30, fontSize: pxToDp(28),paddingHorizontal: 15}}>{i+1+".[ "+item+" ]"}</Text>;
    }

    //获取头部信息
    getTitleInfo = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=index_title')
            .then(result => {
                let topColor = "fff"
                console.log('getTitleInfo------', result);
                if (result.datas.sousuo_color != undefined) {
                    let color = result.datas.sousuo_color
                    topColor = '#' + (color ? color : 'fff')
                    this.setState({
                        top_info: {...result.datas, sousuo_color: topColor}
                    })
                }
            })
            .catch(error => {
                ViewUtils.sldErrorToastTip(error);
            })
    };

    _onclickNavScan() {
        this.props.navigation.navigate('SaoMa');
    };

    _onclickNavMessage() {
        if (key) {
            this.props.navigation.navigate('MyMessage');
        } else {
            this.props.navigation.navigate('Login');
        }
    };

    _onclickNavSearch() {
        this.props.navigation.navigate('SearchPage');
    };

    //倒计时
    _countDownTime(data) {
        if (this.timer) {
            return
        }

        // let h = Math.floor(Math.floor(leftTime / 60 / 60 / 1000 / 24)*24 + (leftTime / 60 / 1000 / 60 % 24))
        // let m = Math.floor(leftTime / 1000 / 60 % 60 )
        // let s = Math.floor(leftTime / 1000  % 60 )

        this.timer = setInterval(() => {
            let endDate = data.end_time.valueOf()*1000
            // let nowDate = parseInt(new Date().getTime());
            // let timeDiff = endDate - nowDate

            let leftTime = (new Date(endDate)) - new Date(); //计算剩余的毫秒数

            let hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算总小时
            let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
            let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

            // console.log('截止时间 :', endDate)
            // console.log('时间差：', leftTime);
            //
            // console.log('时分秒', hours, ', ', minutes, ', ', seconds);

            if(leftTime==0){
                hours = '00';
                minutes = '00';
                seconds = '00';
            }else if(leftTime < 0){
                hours = '';
                minutes = '';
                seconds = '';
            }else{
                hours = ViewUtils.checkTime(hours);
                minutes = ViewUtils.checkTime(minutes);
                seconds = ViewUtils.checkTime(seconds);
            }

            this.setState({
                hour: hours,
                minutes:minutes,
                seconds:seconds,
            });

        }, 1000)
    }

    //活动数据
    // _activeInfo(data) {
    //     data.forEach(item => {
    //         if (item['type'] === 'huodong' && item['sele_style'] == 2) {
    //             console.log('活动商品：', item)
    //             const style = item['sele_style']
    //             const huodong_data = item['data']['bottom']['mid'][style]['goods_info']
    //             let huodong_goodsInfoArr = []
    //             for (let i = 0; i < huodong_data.length; i++) {
    //                 if (huodong_data[i].extend_data) {
    //                     huodong_goodsInfoArr.push(huodong_data[i])
    //                 }
    //             }
    //
    //             this.setState({
    //                 huodong_goodsInfo: huodong_goodsInfoArr
    //             })
    //
    //             if (huodong_goodsInfoArr.length) {
    //                 this._countDownTime(huodong_goodsInfoArr[0])
    //             }
    //         }
    //     })
    // }

    _handleInfo(datainfo) {
        this.swiper = [];
        this.navList = []; //商品分类列表
        this.imgs_0 = [];
        this.imgs_1 = [];
        this.imgs_2 = [];
        this.imgs_3 = [];
        this.recommendGoodsSmall = [];
        datainfo.forEach(item => {
            if (item['type'] === 'lunbo') {
                this.swiper = item['data'];
            }
            else if (item['type'] === 'tuijianshangpin' && item['show_style'] === 'small') {
                item['data']['goods_info'].forEach(i => {
                    this.recommendGoodsSmall.push(i);
                })
            }
            else if (item['type'] === 'nav' && item['style_set'] === 'nav' && item['icon_set'] === 'up') {
                this.navList.push(item);
            }
                // else if (item['type'] === 'tupianzuhe' && item['sele_style'] == 0) {
                //     item['data'].forEach(i => {
                //         this.imgs_0.push(i);
                //     });
            // }
            else if (item['type'] === 'tupianzuhe' && item['sele_style'] == 1) {
                item['data'].forEach(i => {
                    this.imgs_1.push(i);
                });
            }
            else if (item['type'] === 'tupianzuhe' && item['sele_style'] == 2) {
                item['data'].forEach(i => {
                    this.imgs_2.push(i);
                });
            }
            else if (item['type'] === 'tupianzuhe' && item['sele_style'] == 3) {
                item['data'].forEach(i => {
                    this.imgs_3.push(i);
                });
            }
        });
    }

    handleData = (datainfo) => {
        console.log('dataInfo::------', datainfo);
        for (let i = 0; i < datainfo.length; i++) {
            if (datainfo[i]['type'] == 'lunbo') {
                let new_image_info = ViewUtils.handleIMage(datainfo[i]['width'], datainfo[i]['height']);
                console.log('new_image_info-------------::', new_image_info);
                datainfo[i]['width'] = new_image_info.width;
                datainfo[i]['height'] = new_image_info.height;
            }
            else if (datainfo[i]['type'] == 'dapei') {
                // let new_data = datainfo[i];
                let new_image_info = ViewUtils.handleIMage(datainfo[i]['width'], datainfo[i]['height']);
                datainfo[i]['width'] = new_image_info.width;
                datainfo[i]['height'] = new_image_info.height;
            }
            else if (datainfo[i]['type'] == 'tupianzuhe') {
                if (datainfo[i]['sele_style'] == 0) {
                    let new_data = datainfo[i]['data'];
                    for (let j = 0; j < new_data.length; j++) {
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'], datainfo[i]['data'][j]['height']);
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] = new_image_info.height;
                    }
                }
                else if (datainfo[i]['sele_style'] == 1) {
                    let new_data = datainfo[i]['data'];
                    for (let j = 0; j < new_data.length; j++) {
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'], datainfo[i]['data'][j]['height'], scrWidth * 1 - 20);
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] = new_image_info.height;
                    }
                }
                else if (datainfo[i]['sele_style'] == 2) {
                    for (let j = 0; j < new_data.length; j++) {
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'], datainfo[i]['data'][j]['height'], Math.floor((scrWidth * 1 - 30) / 2));
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] = new_image_info.height;
                    }
                }
                else if (datainfo[i]['sele_style'] == 3) {
                    let new_data = datainfo[i]['data'];
                    for (let j = 0; j < new_data.length; j++) {
                        let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'], datainfo[i]['data'][j]['height'], Math.floor((scrWidth * 1 - 40) / 3));
                        datainfo[i]['data'][j]['width'] = new_image_info.width;
                        datainfo[i]['data'][j]['height'] = new_image_info.height;
                    }
                }
                else if (datainfo[i]['sele_style'] == 4) {
                    let new_data = datainfo[i]['data'];
                    for (let j = 0; j < new_data.length; j++) {
                        if (j == 0) {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth * 1 - 30) / 2);
                            datainfo[i]['data'][j]['height'] = Math.floor(datainfo[i]['data'][j]['width'] * 16 / 15);
                        }
                        else if (j == 1 || j == 2) {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth * 1 - 30) / 2);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth * 1 - 30) / 4);
                        }
                    }
                }
                else if (datainfo[i]['sele_style'] == 5) {
                    let new_data = datainfo[i]['data'];
                    for (let j = 0; j < new_data.length; j++) {
                        if (j == 0 || j == 3) {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth * 1 - 30) / 3);
                            datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
                        }
                        else if (j == 1 || j == 2) {
                            datainfo[i]['data'][j]['width'] = scrWidth * 1 - 30 - Math.floor((scrWidth * 1 - 30) / 3);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth * 1 - 30) / 3);
                        }
                    }
                }
                else if (datainfo[i]['sele_style'] == 6) {
                    let new_data = datainfo[i]['data'];
                    for (let j = 0; j < new_data.length; j++) {
                        if (j == 0 || j == 3) {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth * 1 - 30) / 2);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth * 1 - 30) / 4);
                        }
                        else if (j == 1 || j == 2) {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth * 1 - 30) / 2);
                            datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
                        }
                    }
                }
                else if (datainfo[i]['sele_style'] == 7) {
                    let new_data = datainfo[i]['data'];
                    for (let j = 0; j < new_data.length; j++) {
                        if (j == 4) {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth * 1 - 40) / 3);
                            datainfo[i]['data'][j]['height'] = Math.floor((scrWidth * 1 - 40) / 10 * 7);
                        }
                        else {
                            datainfo[i]['data'][j]['width'] = Math.floor((scrWidth * 1 - 40) / 3);
                            datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
                        }
                    }
                }
            }
        }

        this._handleInfo(datainfo);

        this.setState({
            diy_data: datainfo,
        });
    }

    _renderNav(data, item, index) {
        return (
            <TouchableOpacity
                key={index}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: scrWidth / data.data.length
                }}
                activeOpacity={1}
                onPress={() => {
                    // console.warn('ww:导航模版', item);
                    ViewUtils.goDetailPage(this.props.navigation, item.url_type == 'url' ? item.url_type_new : item.url_type, item.url_type == 'url' ? item.url_new : item.url);
                }}
            >
                <Image resizeMode='cover'
                       style={{
                           display: 'flex',
                           width: scrWidth * (data.slide * 1) / 375,
                           height: scrWidth * (data.slide * 1) / 375,
                       }}
                       source={{uri: item.img}}/>
                <Text style={[styles.nav_nav_text, {fontSize: global.language === LANGUAGE_MIANWEN ? 9 : 13}]}>{item.name || ''}</Text>

            </TouchableOpacity>
        );
    }

    _renderBanner(val, index) {
        return (
            <TouchableOpacity key={index} activeOpacity={1} onPress={() => {
                console.warn('ww:val', val);
                ViewUtils.goDetailPage(this.props.navigation, val.url_type == 'url' ? val.url_type_new : val.url_type, val.url_type == 'url' ? val.url_new : val.url);
            }}>
                <View style={{marginHorizontal: pxToDp(26)}}>
                    <Image resizeMode='cover'
                           style={{
                               width: scrWidth - pxToDp(52),
                               height: pxToDp(235),
                               borderRadius: 5
                           }}
                           source={{uri: val.img}}/>
                </View>
            </TouchableOpacity>
        );
    }

    renderCell = (item, index) => {
        const { navigation, language } = this.props
        const { width, height } = Dimensions.get('window')

        // console.log('猜你喜欢--商品:', item)

        let activeType = ''
        let activeColor = ''
        if (item.group_flag) {
            //团购
            activeType = I18n.t('TuanGou.Groupbuy')
            activeColor = '#FF9702'
        }
        else if (item.xianshi_flag) {
            //限时
            activeType = I18n.t('HomeScreenNew.limitTime')
            activeColor = '#FE2C46'
        }
        else if (item.pin_flag) {
            //拼团
            activeType = I18n.t('GoodsSearchList.PinTuanOrder')
            activeColor = '#FF00FF'
        }

        return (
            <View style={{backgroundColor: '#fff'}}>
                <View style={{
                    width: width/2-pxToDp(28),
                    height: width*0.76,
                    marginLeft: index%2 ? pxToDp(8) :pxToDp(20),
                    marginRight: index%2 ? pxToDp(20) : pxToDp(8),
                    marginVertical: pxToDp(10),
                    backgroundColor: '#fff',
                    borderRadius: 9.0,
                    shadowColor: '#D9D9D9',
                    shadowOffset:{width:0,height:0},
                    shadowOpacity: 1.0,
                    shadowRadius: 3.0,
                    elevation: 3.0,
                }}>
                    <TouchableOpacity
                        style={{flex: 1, borderRadius: 9.0, overflow: 'hidden'}}
                        activeOpacity={0.8}
                        onPress={() => {
                            navigation.navigate('GoodsDetailNew', {gid: item.gid})
                        }}
                    >
                        {/*商品图片*/}
                        <Image style={{width: '100%', height: width*0.36}} source={item.goods_image_url ? {uri: item.goods_image_url} : require('../assets/images/default_icon_124.png')} resizeMode={'cover'}/>
                        <View style={{flex: 1, paddingHorizontal: pxToDp(16)}}>
                            {/*商品名称*/}
                            <Text style={{marginTop: pxToDp(24), fontSize: global.language === LANGUAGE_MIANWEN ? pxToDp(22) : pxToDp(28), color: '#333', fontWeight: '500'}} numberOfLines={2}>{item.goods_name || ''}</Text>
                            {/*商品描述*/}
                            <Text style={{marginTop: pxToDp(22), fontSize: global.language === LANGUAGE_MIANWEN ? pxToDp(20) : pxToDp(26), color: '#666', fontWeight: '500'}} numberOfLines={1}>{item.goods_jingle || ''}</Text>
                            {/*佣金*/}
                            <View style={{flexDirection: 'row'}}>
                                <View style={{marginTop: pxToDp(22), justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAEDDA', borderRadius: 2.0}}>
                                    <Text style={{marginHorizontal: pxToDp(10), fontSize: pxToDp(20), color: '#FAA500'}}>{`${I18n.t('HomeScreenNew.commission')}: ${PriceUtil.formatPrice(item.push_price || '')}Ks`}</Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </View>
                            {/*价格*/}
                            <View style={{flex: 1, marginTop: global.language === LANGUAGE_MIANWEN ? pxToDp(16) : pxToDp(20), marginBottom: pxToDp(8)}}>
                                <Text style={{fontSize: pxToDp(34), color: '#FF0A1B', fontWeight: 'bold'}}>{`Ks${PriceUtil.formatPrice(item.show_price || '')}`}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: pxToDp(28), color: '#999', fontWeight: 'bold', textDecorationLine: 'line-through'}}>{`Ks${PriceUtil.formatPrice(item.goods_marketprice || '')}`}</Text>
                            </View>
                        </View>
                        {
                            item.group_flag || item.xianshi_flag || item.pin_flag ?
                                <View style={{
                                    flexDirection: 'row',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0
                                }}>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: pxToDp(34),
                                        backgroundColor: activeColor,
                                        borderBottomRightRadius: 10.0
                                    }}>
                                        <Text style={{marginHorizontal: pxToDp(10), fontSize: language === LANGUAGE_MIANWEN ? pxToDp(18) : pxToDp(20), color: '#fff', textAlign: 'center'}}>{activeType}</Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View> : null
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    //下拉刷新
    _onRefresh() {
        const { data } = this.state
        if (data.length) {
            this.loadGuessAllLikeListData({pn: 1, rows: 10, lang_type: global.language})
        }
    }

    //上拉加载
    _onEndReached() {
        const { pn } = this.state
        this.loadGuessAllLikeListData({pn, rows: 10, lang_type: language})
    }

    render() {
        let { huodong_goodsInfo, hour, minutes, seconds, showLikeNav, guessLikeCategory, msgs, refreshing, userKey, data, hasmore } = this.state;

        // const h_str = hour + ''
        // const m_str = minutes + ''
        // const s_str = seconds + ''

        let active_1 = []
        let active_2 = []
        if (this.imgs_2 && this.imgs_2.length >= 8) {
            for (let i = 0; i < this.imgs_2.length; i++) {
                if (i < 4) {
                    active_1.push(this.imgs_2[i])
                }
                else if (i >= 4 && i < 8) {
                    active_2.push(this.imgs_2[i])
                }
            }
        }

        return (
            <View style={styles.container}>
                <StatusBar translucent={true} hidden={false} backgroundColor="transparent" barStyle={"light-content"}/>
                {/*导航栏*/}
                <HomeNavigationBar
                    topColor={'#E70D26'}
                    // onLayout={(event) => {
                    //     this.navOnLayout = event.nativeEvent.layout
                    //     console.log('导航布局：', event.nativeEvent.layout)
                    // }}
                    onclickNavScan={() => this._onclickNavScan()}
                    onclickNavMessage={() => this._onclickNavMessage()}
                    onclickNavSearch={() => this._onclickNavSearch()}
                />
                <View style={{
                    position: 'absolute',
                    top: pxToDp(IOS_SAFE_TOP_HEIGHT) + 60,
                    left: 0,
                    right: 0,
                    height: 300,
                    backgroundColor: '#E70D26'
                }}/>
                <FlatList
                    // listKey={'Home'}
                    style={styles.homeMainCon}
                    showsVerticalScrollIndicator={false}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={() => this._onRefresh()}
                    refreshing={refreshing}
                    onEndReached={() => this._onEndReached()}
                    onEndReachedThreshold={1}
                    numColumns={2}
                    data={data}
                    renderItem={({item, index}) => this.renderCell(item, index)}
                    ListHeaderComponent={
                        <View style={{backgroundColor: '#fff'}}>
                            {
                                <View style={styles.top_bg}>
                                    <ImageBackground style={{flex: 1}} source={require('../assets/images/home_nav_M.png')} resizeMode={'stretch'}>
                                        {
                                            this.swiper.length ?
                                                <View style={styles.swiper}>
                                                    {/*Banner*/}
                                                    <Swiper
                                                        showsPagination={false}
                                                        horizontal={true}
                                                        autoplay={true}
                                                        autoplayTimeout={6}
                                                        automaticallyAdjustContentInsets={true}
                                                        onIndexChanged={(index) => {
                                                            // console.log("轮播图：", this.swiper);
                                                        }}
                                                    >
                                                        {
                                                            this.swiper.map((data, index) => {
                                                                return this._renderBanner(data, index)
                                                            })
                                                        }
                                                    </Swiper>
                                                </View> : null
                                        }
                                        {/*精选商品， 质量保证，极速送达，无忧售后*/}
                                        <View style={{
                                            marginHorizontal: 10,
                                            height: 34
                                        }}>
                                            {
                                                this.imgs_1 && this.imgs_1.length ?
                                                    <Image style={{flex: 1}} source={{uri: this.imgs_1[0].img}} resizeMode={'contain'}/> : null
                                            }
                                        </View>
                                        {/*消息轮播*/}
                                        {
                                            msgs.length ?
                                                <View style={{
                                                    position: 'absolute',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    top: 5,
                                                    left: 15,
                                                    width: global.language === LANGUAGE_CHINESE ? scrWidth/3 + 20 : scrWidth/3*2,
                                                    height: 25,
                                                    borderRadius: 25/2.0,
                                                    backgroundColor: 'rgba(0,0,0,0.5)'
                                                }}>
                                                    <Swiper
                                                        showsPagination={false}
                                                        horizontal={false}
                                                        autoplay={true}
                                                        autoplayTimeout={6}
                                                        automaticallyAdjustContentInsets={true}
                                                        onIndexChanged={(index) => {
                                                            // console.log("轮播图：", this.swiper);
                                                        }}
                                                    >
                                                        {
                                                            msgs.map((item, index) => {
                                                                return (
                                                                    <View key={index} style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                                                        <Image style={{width: 21, height: 21, borderRadius: 21/2.0}} source={item.avatar ? {uri: item.avatar} : require('../assets/images/home_notice.png')}/>
                                                                        <Text style={{marginLeft: 5, fontSize: 10, color: '#fff'}}>{item.content || ''}</Text>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </Swiper>
                                                </View> : null
                                        }
                                    </ImageBackground>
                                </View>
                            }
                            <View style={{marginBottom:10, height: scrWidth*136/375}}>
                                {/*商品分类列表*/}
                                <View style={{
                                    position: 'absolute',
                                    left: 10,
                                    bottom: scrWidth*23/375,
                                    width: scrWidth - 20,
                                    height: scrWidth*179/375,
                                    backgroundColor: '#fff',
                                    borderRadius: 5.0,
                                    shadowColor: '#D9D9D9',
                                    shadowOffset:{width:0,height:5},
                                    shadowOpacity: 1.0,
                                    shadowRadius: 5.0,
                                    elevation: 10.0,
                                }}>
                                    {
                                        this.navList && this.navList.length > 0 ?
                                            this.navList.map((data, indexP) => {
                                                return (
                                                    <View key={indexP} style={styles.nav_nav_wrap}>
                                                        {
                                                            data.data.map((val, index) => {
                                                                return this._renderNav(data, val, index)
                                                            })
                                                        }
                                                    </View>
                                                )
                                            }) : null
                                    }
                                </View>
                            </View>
                            {/*新人专场*/}
                            {
                                this.imgs_1 && this.imgs_1.length > 1 ?
                                    <TouchableOpacity
                                        style={{width: '100%', height: scrWidth*0.29, paddingHorizontal: 10, backgroundColor: '#fff'}}
                                        activeOpacity={1.0}
                                        onPress={() => ViewUtils.goDetailPage(this.props.navigation, this.imgs_1[1].url_type == 'url' ? this.imgs_1[1].url_type_new : this.imgs_1[1].url_type, this.imgs_1[1].url_type == 'url' ? this.imgs_1[1].url_new : this.imgs_1[1].url)}
                                    >
                                        <Image style={{flex: 1}} source={{uri: this.imgs_1[1].img}} resizeMode={'stretch'}/>
                                    </TouchableOpacity> : null
                            }
                            {/*活动专区1*/}
                            {
                                active_1.length && this.imgs_3 && this.imgs_3.length ?
                                    <View style={{
                                        flex: 1,
                                        marginBottom: pxToDp(32),
                                        marginHorizontal: pxToDp(20),
                                        paddingVertical: pxToDp(14),
                                        backgroundColor: '#272622',
                                        borderWidth: pxToDp(3.0),
                                        borderColor: '#D8AA57',
                                        borderBottomRightRadius: pxToDp(6),
                                        borderBottomLeftRadius: pxToDp(6)
                                    }}>
                                        <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: pxToDp(3)}}>
                                            {
                                                active_1.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={{width: scrWidth*0.465, height: scrWidth*0.25, padding: pxToDp(3)}}
                                                            activeOpacity={0.8}
                                                            onPress={() => {
                                                                if (index === 0) {
                                                                    if (key) {
                                                                        StorageUtil.get('memberInfo', (error, res) => {
                                                                            if (!error && res) {
                                                                                if (res.pushInfo && res.pushInfo.push_info.id) {
                                                                                    Alert.alert(
                                                                                        '',
                                                                                        I18n.t('HomeScreenNew.isVIP'),
                                                                                        [
                                                                                            {text: I18n.t('ok')},
                                                                                        ],
                                                                                        { cancelable: false }
                                                                                    );
                                                                                } else {
                                                                                    this.props.navigation.navigate('JoinVip', {
                                                                                        isFrom: 1,
                                                                                        refeCode: res.memberInfo.refe_code,
                                                                                        key,
                                                                                        memberId: res.memberInfo.member_id
                                                                                    });
                                                                                }
                                                                            }
                                                                        });
                                                                    } else {
                                                                        this.props.navigation.navigate('Login');
                                                                    }
                                                                } else {
                                                                    ViewUtils.goDetailPage(this.props.navigation, item.url_type == 'url' ? item.url_type_new : item.url_type, item.url_type == 'url' ? item.url_new : item.url)
                                                                }
                                                            }}
                                                        >
                                                            <Image style={{flex: 1, borderRadius: 5.0}} source={{uri: item.img}} resizeMode={'stretch'}/>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: pxToDp(3)}}>
                                            {
                                                this.imgs_3.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={{width: scrWidth*0.31, height: scrWidth*0.336, padding: pxToDp(3)}}
                                                            activeOpacity={0.8}
                                                            onPress={() => ViewUtils.goDetailPage(this.props.navigation, item.url_type == 'url' ? item.url_type_new : item.url_type, item.url_type == 'url' ? item.url_new : item.url)}
                                                        >
                                                            <Image style={{flex: 1, borderRadius: 5.0}} source={{uri: item.img}} resizeMode={'stretch'}/>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View> : null
                            }
                            {/*活动专区2*/}
                            {
                                active_2.length ?
                                    <View style={{flex: 1, padding: pxToDp(10), marginHorizontal: pxToDp(20), marginBottom: pxToDp(32), flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems:'center', backgroundColor: '#F3EEED', borderRadius: pxToDp(6)}}>
                                            {
                                                active_2.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={{width: scrWidth*171/375, height: scrWidth*126/375, padding: pxToDp(0.5)}}
                                                            activeOpacity={0.8}
                                                            onPress={() => ViewUtils.goDetailPage(this.props.navigation, item.url_type == 'url' ? item.url_type_new : item.url_type, item.url_type == 'url' ? item.url_new : item.url)}
                                                        >
                                                            <Image style={{flex: 1}} source={{uri: item.img}} resizeMode={'stretch'}/>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                    </View> : null
                            }
                            {/*团购活动*/}
                            {/*{*/}
                            {/*huodong_goodsInfo.length > 0 && minutes != '' ?*/}
                            {/*<BuyGroup*/}
                            {/*language={global.language}*/}
                            {/*data={huodong_goodsInfo}*/}
                            {/*// hour={h_str.length === 1 ? '0' + h_str : h_str}*/}
                            {/*// min={m_str.length === 1 ? '0' + m_str : m_str}*/}
                            {/*// sec={s_str.length === 1 ? '0' + s_str : s_str}*/}
                            {/*hour={hour}*/}
                            {/*min={minutes}*/}
                            {/*sec={seconds}*/}
                            {/*onClick={(gid) => this.props.navigation.navigate('GoodsDetailNew', {gid})}*/}
                            {/*/> : null*/}
                            {/*}*/}
                            {/*{*/}
                            {/*this.imgs1 && this.imgs1.length > 1 &&  this._renderImageView(this.imgs1[1], 1)*/}
                            {/*}*/}
                            {/*{*/}
                            {/*this.imgs2 && this.imgs2.length > 0 ?*/}
                            {/*<View style={styles.special_container}>*/}
                            {/*<Text style={{fontSize: 18, color: '#FFF', marginBottom: 8}}>Special Preferential</Text>*/}
                            {/*<View style={styles.img_container}>*/}
                            {/*{*/}
                            {/*this.imgs2.map((val, index) => (*/}
                            {/*<TouchableOpacity*/}
                            {/*style={styles.tpzh_235_wrap}*/}
                            {/*activeOpacity={1} key={'tpzh' + index}*/}
                            {/*onPress={() => {*/}
                            {/*console.warn('ww:图片组合模版2', val);*/}
                            {/*ViewUtils.goDetailPage(this.props.navigation, val.url_type == 'url' ? val.url_type_new : val.url_type, val.url_type == 'url' ? val.url_new : val.url);*/}
                            {/*}}>*/}
                            {/*<Image resizeMode='cover' style={{*/}
                            {/*height: 102,*/}
                            {/*borderRadius: 5,*/}
                            {/*}} source={{uri: val.img}}/>*/}
                            {/*</TouchableOpacity>*/}
                            {/*))*/}
                            {/*}*/}
                            {/*</View>*/}
                            {/*</View> : null*/}
                            {/*}*/}
                            {/*猜你喜欢*/}
                            <View
                                style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, height: 35}}
                                // onLayout={(event) => {
                                //     this.navOnLayout = event.nativeEvent.layout
                                //     console.log('猜你喜欢布局：', event.nativeEvent.layout)
                                //     this.likeOnLayout = event.nativeEvent.layout
                                // }}
                            >
                                <View style={{width: 8, height: 8, backgroundColor: '#FE2C46', borderRadius: 4.0}}/>
                                <Text style={{marginLeft: 11, fontSize: 18, color: '#333', fontWeight: 'bold'}}>{I18n.t('HomeScreenNew.guessYouLike')}</Text>
                            </View>
                        </View>
                    }
                    ListFooterComponent={
                        <View>
                        {
                            refreshing && data.length ? <ActivityIndicator size={'small'} color={'#666'} /> : null
                        }
                        </View>
                    }
                >
                </FlatList>
                {/*App更新弹窗*/}
                <Modal
                    backdropPressToClose={ false }
                    entry='center'
                    position='center'
                    coverScreen={ true }
                    swipeToClose={ false }
                    onClosed={() => this.goUpdate(0)}
                    ref={ "redModal" }
                    style={ {
                        backgroundColor: "#fff",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        width: pxToDp(622),
                        height:  pxToDp(728),
                        borderRadius:10,
                        overflow: 'hidden'
                    } }>
                    <View style={ {alignItems: 'flex-start',flexDirection: 'row', paddingHorizontal: 15}} >
                        <Image
                            style={{width: pxToDp(77), height: pxToDp(54),marginTop:pxToDp(28)}}
                            source={require('../assets/images/icon_update_logo.png')}
                        />
                        <TouchableOpacity
                            style={{justifyContent:"center",alignItems:"center"}}
                            activeOpacity={1.0}
                            onPress={() => this.goUpdate(0) }
                        >
                            <Image
                                style={{width: pxToDp(34), height: pxToDp(34),marginTop:pxToDp(20),marginLeft:pxToDp(465)}}
                                source={require('../assets/images/upload_img_del.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            style={{width: pxToDp(356), height: pxToDp(234), marginTop:3}}
                            source={require('../assets/images/icon_update_bg.png')}
                        />
                        {/*发现新版本*/}
                        <Text style={{fontSize:22, textAlign: 'center'}}>{I18n.t('MyScreen.updateInfo')}</Text>
                    </View>
                    <ScrollView style={{flex: 1}}>
                        {
                            this.state.content ? this.state.content.map((item,i) => this.renderExpenseItem(item,i)) : null
                        }
                    </ScrollView>
                    <TouchableOpacity
                        style={{justifyContent: "center", alignItems: "center", height: 40, backgroundColor: '#E73548'}}
                        activeOpacity={0.8}
                        onPress={() => this.goUpdate(1)}
                    >
                        <Text style={{color:'#fff', fontSize: pxToDp(30), textAlign: 'center'}}>{I18n.t('MyScreen.updateNow')}</Text>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }
}

//团购活动
class BuyGroup extends Component {
    render () {
        const { width } = Dimensions.get('window')
        const { data, hour, min, sec, language, onClick } = this.props
        const goodsInfo = data[0]
        // console.log('团购活动', JSON.stringify(goodsInfo))
        return (
            <View style={{flex:1, height: width*0.48, marginBottom: 10}}>
                <ImageBackground
                    style={{flex: 1}}
                    source={require('../assets/images/home_tuan_bg.png')}
                    resizeMode={'cover'}
                >
                    <View style={{flex: 1, marginHorizontal: 15, marginVertical: 10, backgroundColor: '#fff', borderRadius: 5.0}}>
                        <ImageBackground
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: width*0.12
                            }}
                            source={require('../assets/images/home_tuan_1.png')}
                            resizeMode={'cover'}
                        >
                            <View style={{width: width*0.512}}>
                                <Text style={{marginLeft:15, fontSize: 18, color: '#fff', fontWeight: '600'}}>{I18n.t('HomeScreenNew.text1')}</Text>
                            </View>
                            {/*倒计时*/}
                            <View style={{flex: 1}}>
                                <View style={{flex: 1, justifyContent: 'center'}}>
                                    <Text style={{marginLeft:width*0.17, fontSize: 10, color: '#fff'}}>{I18n.t('HomeScreenNew.text2')}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: width*0.016, height: width*0.048}}>
                                    {/*时*/}
                                    <View style={{marginLeft: width*0.077, width: width*0.048, height: width*0.048, backgroundColor: '#fff', borderRadius: 2.0, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: parseInt(hour) > 99 ? 9 : 12, color: '#E73548', textAlign: 'center'}}>{hour}</Text>
                                    </View>
                                    <Text style={{marginHorizontal: width*0.016, fontSize: 11, color: '#fff'}}>{I18n.t('HomeScreenNew.hour')}</Text>
                                    {/*分*/}
                                    <View style={{width: width*0.048, height: width*0.048, backgroundColor: '#fff', borderRadius: 2.0, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 12, color: '#E73548', textAlign: 'center'}}>{min}</Text>
                                    </View>
                                    <Text style={{marginHorizontal: width*0.016, fontSize: 11, color: '#fff'}}>{I18n.t('HomeScreenNew.min')}</Text>
                                    {/*秒*/}
                                    <View style={{width: width*0.048, height: width*0.048, backgroundColor: '#fff', borderRadius: 2.0, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 12, color: '#E73548', textAlign: 'center'}}>{sec}</Text>
                                    </View>
                                    <Text style={{marginLeft: width*0.016, fontSize: 11, color: '#fff'}}>{I18n.t('HomeScreenNew.sec')}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        {/*商品*/}
                        <View style={{flexDirection: 'row', marginVertical: width*0.04}}>
                            {/*商品图片*/}
                            <Image
                                style={{marginLeft: 10, width: width*0.232, height: width*0.232}}
                                source={goodsInfo.goods_image ? {uri: goodsInfo.goods_image} : require('../assets/images/default_icon_124.png')}
                                resizeMode={'contain'}
                            />
                            <View style={{flex: 1, marginLeft: 15, marginRight: 10}}>
                                <View style={{height: 35}}>
                                    {/*商品名称*/}
                                    <Text style={{fontSize: 13, color: '#000'}} numberOfLines={2}>{goodsInfo.goods_name || ''}</Text>
                                </View>
                                <View style={{flex: 1}}/>
                                <View style={{flexDirection: 'row', alignItems: 'center', height: 18}}>
                                    <View>
                                        {/*价格*/}
                                        <Text style={{fontSize: 18, color: '#EF1A1A'}} numberOfLines={1}>
                                            {goodsInfo.show_price ? PriceUtil.formatPrice(goodsInfo.show_price) : '--'} Ks
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, marginLeft: 15}}>
                                        {/*原价*/}
                                        <Text style={{fontSize: 10, color: '#333', textDecorationLine: 'line-through'}} numberOfLines={1}>
                                            {goodsInfo.goods_marketprice ? PriceUtil.formatPrice(goodsInfo.goods_price) : '--'} Ks
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', height: 35}}>
                                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                        {/*已团*/}
                                        <Text style={{fontSize: 10, color: '#333'}}>
                                            {
                                                language === LANGUAGE_ENGLISH ?
                                                    `${goodsInfo.extend_data.buyed_quantity || '--'} ${I18n.t('HomeScreenNew.text3')}`
                                                    :
                                                    `${I18n.t('HomeScreenNew.text3')}${goodsInfo.extend_data.buyed_quantity || '--'}${I18n.t('HomeScreenNew.text4')}`
                                            }
                                        </Text>
                                    </View>
                                    {/*立即团购*/}
                                    <TouchableOpacity
                                        style={{height: '100%', borderRadius: 35/2.0, overflow: 'hidden'}}
                                        activeOpacity={1.0}
                                        onPress={() => onClick(goodsInfo.gid)}
                                    >
                                        <LinearGradient
                                            style={{flex: 1, justifyContent: 'center', alignItems:'center'}}
                                            start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
                                            locations={[0, 1]}
                                            colors={['#ED0019', '#FF5060']}
                                        >
                                            <Text style={{marginHorizontal: 10, fontSize: 12, color: '#fff', textAlign: 'center'}} numberOfLines={1}>{I18n.t('HomeScreenNew.text5')}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

class UpdateView extends Component {
    render() {
        return (
            <View>

            </View>
        )
    }
}

const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
    scan_icon_box: {
        marginLeft: pxToDp(20),
        width: pxToDp(80),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    msg_icon_box: {
        marginLeft: pxToDp(20),
        width: pxToDp(120),
        marginRight: pxToDp(30),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    city: {
        width: pxToDp(120),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeSearchimg: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginHorizontal: pxToDp(18),
    },
    homesearchcons: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: pxToDp(60),
        borderRadius: pxToDp(30),
        alignItems: 'center',
        marginLeft: 15,
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    homeSldSearchWrap: {
        paddingTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? (STATUS_BAR_HEIGHT + 8) : STATUS_BAR_HEIGHT) : 5,
        height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? pxToDp(150) : pxToDp(130)) : 55,
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: 'center',
        paddingBottom: 5,
        backgroundColor: '#0000',
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        width: scrWidth,
    },
    topBox: {
        paddingTop: 0,
        height: 0,
        // flexDirection: 'row',
        // justifyContent:"flex-start",
        alignItems: 'center',
        paddingBottom: 5,
        backgroundColor: '#0000',
        width: scrWidth,
    },
    homeMainCon: {
        flex: 1,
        marginTop: 0,
        // marginTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? (STATUS_BAR_HEIGHT + 8) : STATUS_BAR_HEIGHT) : 0,
        height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? pxToDp(150) : pxToDp(150)) : 55,
        // backgroundColor: '#fff'
    },
    img_container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    swiper: {
        width: scrWidth,
        height: scrWidth*0.31,
    },
    top_bg: {
        height: scrWidth*0.57,
        backgroundColor: '#fff',
    },
    swiper_bg: {
        height: pxToDp(170)
    },
    special_container: {
        paddingVertical: pxToDp(30),
        paddingHorizontal: pxToDp(22),
        backgroundColor: '#FF6D6D',
        marginHorizontal: pxToDp(30),
        borderRadius: pxToDp(8),
    },
    tpzh_235_wrap: {
        backgroundColor: "#fff",
        width: (scrWidth - 60) / 2,
        height: 102,
        borderRadius: 5,
        marginBottom: pxToDp(10),
    },
    tjsp_small_wrap: {
        flexDirection: 'row',
        // flexWrap: 'wrap',
    },
    tjsp_small_part: {
        width: (scrWidth - 45) / 2,
        marginBottom: 10,
    },
    tjsp_big_part_price: {
        color: '#ba1418',
        fontSize: pxToDp(30),
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
    },
    tjsp_small_part_price: {
        color: '#ba1418',
        fontSize: pxToDp(24),
        marginTop: 6,
        marginLeft: 10,
        marginBottom: 10
    },
    tjsp_small_part_name: {
        width: (scrWidth - 45) / 2 - 20,
        fontSize: 13,
        color: main_title_color,
        marginTop: 10,
        marginHorizontal: 10,
        lineHeight: Platform.OS === 'android' ? 18 : null
    },
    tjsp_small_part_img: {
        width: (scrWidth - 45) / 2,
        height: (scrWidth - 45) / 2,
        borderTopLeftRadius: 2.5,
        borderTopRightRadius: 2.5,
    },
    tpzh_1_wrap: {
        width: scrWidth
    },
    column_list: {
        width: (scrWidth - 45) / 2,
        marginLeft: 15,
        marginBottom: 10,
    },
    nav_nav_wrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // marginHorizontal: 10,
        height: scrWidth*179/375/2
    },
    nav_nav_text: {
        fontWeight: font_weight,
        color: '#333',
        marginTop: pxToDp(10),
        marginBottom: 8,
        textAlign: 'center',
    },
    goods_push_info: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 5,
    },
    goods_push_info_inner:{
        paddingHorizontal: pxToDp(16),
        borderRadius: pxToDp(6),
        backgroundColor: '#fbe9c8',
        height: pxToDp(32),
        flexDirection:'row',
        alignItems:'center',
    },
    goods_push_info_text: {
        backgroundColor: 'transparent',
        color: '#906433',
        fontSize: pxToDp(22),
    },
});
