/*
 * 欢迎页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    DeviceEventEmitter,
    StatusBar
} from 'react-native';
import pxToDp from "../util/pxToDp";
import LogUtil from "../util/LogUtil";
import StorageUtil from "../util/StorageUtil";
import RequestData from "../RequestData";
import {I18n, setLanguage, initLanguageFromCache, LANGUAGE_CHINESE} from './../lang/index'

import JPush from 'jpush-react-native';
import GuideScreen from "../pages/guide/GuideScreen";

var Dimensions = require('Dimensions');
const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;
let lp = 0;
let new_data = '';
let retrytime = 3;
let goHomeTimeout; //跳转页面的定时器
let isSecondInterval = null;

export default class Welcome extends Component {

    constructor(props) {

        super(props);
        this.state = {
            showPoster: true,//是否展示默认图片，默认展示，视频加载完成不展示
            showBtn: false,//是否显示跳转按钮，默认不显示，数据请求完成显示
            paused: false,//是否暂停播放视频
            upload_info: '',//用户上传的欢迎页信息
            collectLists: [],
            sldtoken: '',
            pn: 1,
            ishasmore: false,
            refresh: false,
            showLikePart: false,
            diy_data: [],//存放所有的装修改数据
            isShowGuideScreen: false,
            isSecond: 3,
            language: 1,
            imgUrl:''
        }
    }

    doSetLanguage(){
        let url = AppSldUrl + `/index.php?app=language&mod=index&lang_type=${language}`;
        RequestData.getSldData(url).then(res => {
            if (res.state === 200) {

            } else {

            }
            this.goHome(3000);
        })
    }

    componentDidMount() {
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                });
            }
        });

        //从缓存里判断是不是第一次安装app
        StorageUtil.get('isFirstInstalled', (error, object) => {
            console.warn('ww:error, object', error, object);
            if (!error && object) {
                initLanguageFromCache();
                this.setState({isShowGuideScreen: false}, () => {
                    this._batchPrepareData();
                });
            } else {
                //第一次登陆
                StorageUtil.set('isFirstInstalled', '1');
                this.setState({isShowGuideScreen: true}, () => {
                    this._batchPrepareData();
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.lis_network) {
            this.lis_network.remove()
        }
        if (isSecondInterval) {
            clearInterval(isSecondInterval)
        }
    }

    _batchPrepareData() {
        // SldNetWorkTool.checkNetWork((isConnected) => {
        //
        //     if (!isConnected) {
        //         this.props.navigation.navigate('SldMainNoNetWork');
        //         this.lis_network =
        //             DeviceEventEmitter.addListener('updateNetWork', () => {
        //                 this.initData();
        //             });
        //     } else {
        //         this.initData();
        //     }
        // });

        this.initData();


        // Platform.OS === 'ios' && this.JPushINit();
        // ImmediateCheckCodePush();
        // UpgradeUtil.updateApp();

    };


    initData = () => {
        this.getWelcomInfo();//获取app的默认欢迎页信息
    }

    goHome = (set_time = 0) => {
        this.setState({paused: true})
        if (set_time) {
            goHomeTimeout = setTimeout(() => {
                /*this.props.navigation.push("Tab")*/
                this.props.navigation.replace("Tab");
            }, set_time);

            if (isSecondInterval == null) {
                this.setState({
                    showBtn: true
                });
                let ii = 0;
                isSecondInterval = setInterval(() => {
                    this.setState({
                        isSecond: --this.state.isSecond
                    });
                    ii++;
                    if (ii * 1000 >= set_time) {
                        clearInterval(isSecondInterval);
                    }
                }, 1000)
            }

        } else {
            clearTimeout(goHomeTimeout);
            /*this.props.navigation.push("Tab")*/
            this.props.navigation.replace("Tab");
        }

    }


    //获取上传的欢迎页信息(非首次安装用户)
    getWelcomInfo = () => {

        let url = AppSldUrl + `/index.php?app=index&mod=getAppResources&lang_type=${language}&platform=${Platform.OS}`;
        RequestData.getSldData(url).then(res => {
            if (res.state == 200 && res.data.app_resources) {
                //上传了欢迎页
                if (!this.state.isShowGuideScreen) {
                    this.setState({upload_info: res.data}, () => {
                        if (res.data.app_resources_type != 'video') {
                            this.setState({imgUrl:res.data.app_resources});
                            this.doSetLanguage();
                        }
                    });
                }
            } else {
                //未上传欢迎页,用户不点击跳转的话默认5s之后自动进入首页
                if (!this.state.isShowGuideScreen) {
                    this.setState({upload_info: '', showBtn: true}, () => {
                        this.doSetLanguage();
                    });
                }
            }
        })
    }



    /// -------Video组件回调事件-------

    _onLoadStart = () => {
        LogUtil.log(I18n.t('Welcome.text2'));
    };

    _onBuffering = () => {
        LogUtil.log(I18n.t('Welcome.text3') + '...')
    };

    _onLoaded = (data) => {
        LogUtil.log(I18n.t('Welcome.text4'));
        this.setState({
            duration: data.duration,
            showPoster: false,
        });
    };

    _onProgressChanged = (data) => {
        LogUtil.log(I18n.t('Welcome.text5'));
    };

    _onPlayEnd = () => {
        LogUtil.log(I18n.t('Welcome.text6'));
        this.videoPlayer.seek(0);
        this.setState({
            currentTime: 0,
            isPlaying: false,
            playFromBeginning: true
        });
        this.goHome();
    };

    _onPlayError = () => {
        LogUtil.log(I18n.t('Welcome.text7'));
    };


    getRegistrationID = () => {
        JPush.getRegistrationID(registrationId => {
            StorageUtil.set('registrationId', registrationId);
        })
    }

    //极光推送初始化
    JPushINit() {
        StorageUtil.get('registrationId', (error, object) => {
            if (error || error == null) {
                this.getRegistrationID();//获取app的jpush设备id
            }
        })

        JPush.setLoggerEnable({"debug": true});
        JPush.init();
        //连接状态
        this.connectListener = result => {
            LogUtil.log("connectListener:" + JSON.stringify(result))
        };

        JPush.addConnectEventListener(this.connectListener);
        //通知回调
        this.notificationListener = result => {
            LogUtil.log("notificationListener:" + JSON.stringify(result))
            if (result.notificationEventType === 'notificationOpened') {
                this.handleJPMsg(result);
            }
        };
        JPush.addNotificationListener(this.notificationListener);
        //自定义消息回调
        this.customMessageListener = result => {
            LogUtil.log("customMessageListener:" + JSON.stringify(result))
        };
        JPush.addCustomMessagegListener(this.customMessageListener);
        //本地通知回调 todo
        this.localNotificationListener = result => {
            LogUtil.log("localNotificationListener:" + JSON.stringify(result))
        };
        JPush.addLocalNotificationListener(this.localNotificationListener);
        //tag alias事件回调
        this.tagAliasListener = result => {
            LogUtil.log("tagAliasListener:" + JSON.stringify(result))
        };
        JPush.addTagAliasListener(this.tagAliasListener);
        //手机号码事件回调
        this.mobileNumberListener = result => {
            LogUtil.log("mobileNumberListener:" + JSON.stringify(result))
        };
        JPush.addMobileNumberListener(this.mobileNumberListener);
    }

    handleJPMsg(res) {
        let url = JSON.parse(res.extras.url);
        const navigate = this.props.navigation.navigate;
        switch (url.type) {
            case 'cash_apply_notice':  // 预存款提现详情
                navigate('TiXianDetail', {id: url.id});
                break;
            case 'order_deliver_success':  // 订单发货，跳转查看物流页面
                navigate('ViewOrderExpress', {orderid: url.order_id});
                break;
            case 'order_payment_success':  // 订单付款成功
                navigate('OrderDetail', {orderid: url.order_id});
                break;
            case 'points_change_notice':  // 积分变动
                navigate('PointLog');
                break;
            case 'predeposit_change':  // 预存款变更
                navigate('AccountMoney');
                break;
            case 'refund_return_notice':  // 退货
                navigate('ReturnRefundDetail', {refund_id: url.refund_id});
                break;
            case 'refund_return_notice':  // 退款
                navigate('ReturnRefundDetail', {refund_id: url.refund_id});
                break;
            default:
                navigate('Tab');
                break;
        }
    }

    HandleJPushMessage(MsgResult) {
        let data = {};
        debugger
        if (Platform.OS == 'ios') {
            data = MsgResult.extras.url;
            //清除IOS角标
            // JPush.setBadge(0, () => {
            // })
        } else {
            data = JSON.parse(MsgResult.extras.url)
        }
        if (data.type) {
            this.props.navigation.navigate(data.type)
        }
    }

    _onclickGuideScreenStart(language) {
        setLanguage(language);
        global.language = language;
        // alert('欢迎页当前语言' + global.language)
        StorageUtil.set('language', language, () => {
            // this.getHomeData()
            this.goHome()
        });
        DeviceEventEmitter.emit('languageSettings');
    };

    render() {
        const { showBtn, isShowGuideScreen, language ,imgUrl} = this.state;
        const { height } = Dimensions.get('window')

        //欢迎页图片
        let bgImage = ''
        if (language === LANGUAGE_CHINESE) {
            bgImage = Platform.OS === 'ios' && (height === 812 || height === 896) ? require('../assets/images/welcome_1_cn.png') : require('../assets/images/welcome_2_cn.png')
        } else {
            bgImage = Platform.OS === 'ios' && (height === 812 || height === 896) ? require('../assets/images/welcome_2_mian.png') : require('../assets/images/welcome_2_mian.png')
        }

        return (
            <View style={styles.container}>
                {/*<HotUpdate />*/}
                {
                    Platform.OS === 'ios' ?
                        <StatusBar translucent={true} hidden/>
                        :
                        <StatusBar translucent={true} hidden={false} backgroundColor={'black'}/>
                }
                {
                    isShowGuideScreen ?
                        <GuideScreen
                            style={styles.guideScreen}
                            onclickGuideScreenStart={this._onclickGuideScreenStart.bind(this)}
                        />
                        :
                        <Image
                            resizeMode="stretch"
                            style={styles.welcome}
                            source={imgUrl?{uri:imgUrl}:bgImage}
                        />
                }
                {
                    showBtn &&
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            position: 'absolute',
                            zIndex: 99999999999,
                            top: pxToDp(84),
                            right: pxToDp(20)
                        }}
                        activeOpacity={1}
                        onPress={() => this.goHome()}
                    >
                        {
                            isShowGuideScreen ?
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: pxToDp(28)
                                }}>{I18n.t('Welcome.jump')}>></Text>
                                :
                                <Text style={{
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: pxToDp(28)
                                }}>{I18n.t('Welcome.jump')}{'(' + this.state.isSecond + ')'}>></Text>
                        }
                    </TouchableOpacity>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    welcome: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999998,
    },
    guideScreen: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999998,
    },
});
