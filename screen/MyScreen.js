/*
 * 个人中心页面
 * @slodon
 * */
import React, {Component, Fragment} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ScrollView,
    ImageBackground,
    Image,
    TouchableOpacity,
    Alert,
    DeviceInfo,
    DeviceEventEmitter,
    StatusBar,
    Dimensions,
    NativeModules
} from "react-native";
import StorageUtil from "../util/StorageUtil";
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils'
import RequestData from "../RequestData";
import AddressList from "../pages/AddressList";
import pxToDp from "../util/pxToDp";
import SldRedMoney from '../component/SldRedMoney';
import {getUserPushHandInfo} from "../api/pushHandApi"

import {I18n, LANGUAGE_CHINESE} from '../lang'
import LinearGradient from "react-native-linear-gradient";
import PriceUtil from "../util/PriceUtil";

let iOSToolModule = NativeModules.ToolModule;

// 导入Dimensions库
const {width, height} = Dimensions.get('window');
export default class MyScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            HWRecommendList: [],//好物推荐
            memberInfo: {},//用户信息
            tele: '',//投诉电话
            redMoneyRefresh: 1,  // 是否更新SldRedMoney组件
            msg_count: 0,//系统未读消息数量
            pushInfo: {}, //推手信息
            isCheck: '1', //是否审核
            language: 0

        }
    }

    componentWillMount() {
        let navigation = this.props.navigation;
        this.setState({
            navigation: navigation,
        });
    }

    componentDidMount() {
        StorageUtil.get('memberInfo', (error, res) => {
            if (!error && res) {
                this.setState({
                    pushInfo: res.pushInfo,
                    memberInfo: res.memberInfo
                });
            }
        });

        this.lister = DeviceEventEmitter.addListener('userCenter', () => {
            this.fetchData();
        });

        this.lister2 = DeviceEventEmitter.addListener('refreshUserCenter', () => {
            let {redMoneyRefresh} = this.state;
            let newR = redMoneyRefresh + 1;
            this.setState({
                redMoneyRefresh: newR
            })
            this.fetchData();
        });

        this.lister3 = DeviceEventEmitter.addListener('msgCountUpdate', () => {
            this.getMsgCount();
        });


        this.props.navigation.addListener("willFocus", payload => {
            console.warn('ww:MyScreen:willFocus');
            this.fetchData();
            // Platform.OS === 'android' && StatusBar.setBackgroundColor('#E95C5C');
        });

        this.leave = this.props.navigation.addListener('willBlur', () => {
            // Platform.OS === 'android' && StatusBar.setBackgroundColor('#fff')
        });
    };

    /*
     * 在组件销毁的时候要将其移除
     * */
    componentWillUnmount() {
        this.lister.remove();
        this.lister2.remove();
        this.lister3.remove();
        this.leave.remove();
    };

    fetchData() {
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

        this.getVersion()

        if (key) {
            getUserPushHandInfo({
                key: key
            }).then(res => {
                // console.log('用户信息成功:', JSON.stringify(res))
                if (res.code === 200) {
                    let pushHandInfo = {getInfo: true, ...res.datas.member_info};

                    StorageUtil.set('memberInfo', {pushInfo: pushHandInfo, memberInfo: res.datas.member_info})
                    StorageUtil.set('memberId', {memberId: res.datas.member_info.member_id})
                    StorageUtil.set('is_pay_pwd_set', {is_pay_pwd_set: res.datas.member_info.is_pay_pwd_set})

                    this.setState({
                        pushInfo: pushHandInfo,
                        memberInfo: res.datas.member_info
                    })
                } else {
                    this.props.navigation.navigate('Login');
                }
            }).catch(err => {
                this.props.navigation.navigate('Login');
            })

            //获取投诉电话
            RequestData.getSldData(AppSldUrl + "/index.php?app=index&mod=get_site_phone",)
                .then(result => {
                    this.setState({
                        tel: result.datas.site_phone
                    });
                })
                .catch(error => {
                    // ViewUtils.sldToastTip(error);
                });
            //获取系统未读消息数量
            this.getMsgCount();
        } else {
            this.setState({
                memberInfo: {},
                pushInfo: {}
            });
        }
    };

    //获取版本号
    getVersion() {
        if (Platform.OS === 'ios') {
            iOSToolModule.getAppVersion((error,event) => {
                if(error){
                    console.log(error)
                }else{
                    // console.log('当前版本号:', event)
                    //苹果审核  http://md.mookee.net/cmobile/index.php?app=login&mod=test
                    RequestData.postSldData(
                        AppSldUrl + `/index.php?app=login&mod=test&version=${event}`
                    ).then(result => {
                        if(result.code == 200) {
                            let isCheck =  result.datas ? result.datas : '0'
                            console.log('是否审核:', isCheck)
                            //关闭审核，可以打开这行代码
                            // isCheck = '1'
                            this.setState({
                                isCheck: isCheck
                            })
                        }
                    }).catch(error => {
                        // ViewUtils.sldToastTip(error);
                    })
                }
            })
        } else {

        }
    }

    //获取系统未读消息数量
    getMsgCount = () => {
        RequestData.getSldData(AppSldUrl + "/index.php?app=usercenter&mod=receivedSystemNewNum&key=" + key)
            .then(result => {
                if (result.datas.status == 1) {
                    this.setState({
                        msg_count: result.datas.countnum
                    });
                } else {
                    this.setState({
                        msg_count: 0
                    });
                }
            })
            .catch(error => {
                // ViewUtils.sldToastTip(error);
            });
    }

    //进入商品详情页
    goGoodsDetail = (gid) => {
        const {navigation} = this.state;
        navigation.navigate('GoodsDetailNew', {'gid': gid});
    }
    //slodon_点击事件
    onClick = (tab, params = 0) => {
        if (tab === 'LanguageSettings') {
            this.props.navigation.navigate('LanguageSettings');
        } else {
            if (key) {
                if (params != 0) {
                    this.props.navigation.navigate(tab, params);
                } else {
                    if (tab == 'TouSu') {
                        Alert.alert(
                            '',
                            I18n.t('MyScreen.text2'),
                            [
                                {
                                    text: I18n.t('PerfectInfo.confirm'), onPress: (() => {
                                        ViewUtils.callMe(this.state.tel)
                                    })
                                },
                                {
                                    text: I18n.t('export default.cancel'), onPress: (() => {
                                    }), style: 'cancle'
                                }
                            ]
                        );

                    } else if (tab == 'apply_spreader') {
                        this.apply_spreader();
                    } else if (tab == 'go_spreader') {
                        ViewUtils.sldToastTip(I18n.t('MyScreen.wxpt'));
                    } else if (tab == 'VenApply') {
                        //获取当前的入驻状态
                    } else if (tab == 'points_shop') {
                        //积分商城
                        ViewUtils.goDetailPage(this.props.navigation, tab)
                    } else if (tab == 'ldj') {
                        //联到家
                        ViewUtils.goDetailPage(this.props.navigation, tab)
                    } else if (tab == 'company_reg') {
                        //商户入驻
                        RequestData.getSldData(AppSldUrl + '/index.php?app=enterin&mod=checkApplyState&key=' + key + '&reapply=0&step=0&flag=0').then(res => {
                            console.info(777);
                            console.info(res);
                            console.info(AppSldUrl + '/index.php?app=enterin&mod=checkApplyState&key=' + key + '&reapply=0&step=0&flag=0');
                            if (res.code == 200) {
                                if (res.datas.state == 200) {
                                    this.props.navigation.navigate('CompanyReg');
                                } else if (res.datas.state == 311) {
                                    this.props.navigation.navigate('CompanyStep1');
                                } else if (res.datas.state == 301 || res.datas.state == 306 || res.datas.state == 305 || res.datas.state == 302 || res.datas.state == 303 || res.datas.state == 304) {
                                    StorageUtil.get('apply_info', (error, object) => {
                                        if (!error && object) {
                                            let tmp_data = JSON.parse(object);
                                            if (res.datas.state == 304) {
                                                //清空入驻信息缓存
                                                StorageUtil.delete('apply_info');
                                                StorageUtil.delete('company_reg2');
                                                StorageUtil.delete('company_reg3');
                                                StorageUtil.delete('company_reg4');
                                            }
                                        }
                                        this.props.navigation.navigate('CompanyStep5', {
                                            state: res.datas.state, tip_message: res.datas.msg,
                                            reapply: 1,
                                            is_supplier: res.datas.enterStatus.is_supplier,
                                            apply_t: res.datas.enterStatus.apply_t,
                                        })
                                    });
                                }
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else if (tab === 'InviteFriend') {
                        this.props.navigation.navigate(tab, {pushCode: this.state.pushInfo.push_info.push_code});
                    } else if (tab === 'JoinVip') {
                        const {memberInfo} = this.state
                        if (memberInfo) {
                            console.log('用户标识key:', key)
                            this.props.navigation.navigate('JoinVip', {
                                isFrom: 1,
                                refeCode: memberInfo.refe_code,
                                key,
                                memberId: memberInfo.member_id
                            });
                        }
                    } else {
                        this.props.navigation.navigate(tab);
                    }
                }
            } else {
                //没有找到的情况下应该跳转到登录页
                this.props.navigation.navigate('Login');
            }
        }
    };

    apply_spreader = () => {
        RequestData.postSldData(AppSldUrl + '/index.php?app=api&mod=become_spreader&sld_addons=spreader', {
            key: key,
        })
            .then(result => {
                if (result.state == 200) {
                    this.fetchData();
                    ViewUtils.sldToastTip(result.msg);
                } else if (result.state == 256) {
                    ViewUtils.sldToastTip(I18n.t('MyScreen.wxtext'));
                }
            })
            .catch(error => {
                ViewUtils.sldToastTip(error);
            })
    }

    // 我的服务
    renderServer = (cb, imgUrl, txt) => {
        return <TouchableOpacity
            activeOpacity={1}
            onPress={cb}
            style={styles.server_item}
        >
            <Image
                style={{width: pxToDp(50), height: pxToDp(50)}}
                resizeMode={'contain'}
                source={imgUrl}
            />
            <Text style={{fontSize: pxToDp(22), color: '#333333', marginTop: pxToDp(15)}}>{txt}</Text>
        </TouchableOpacity>
    }

    // 我的分销
    renderFx = (cb, imgUrl, txt) => {
        return <TouchableOpacity
            activeOpacity={1}
            onPress={cb}
            style={styles.fx_item}
        >
            <Image
                style={{width: pxToDp(60), height: pxToDp(60), marginBottom: pxToDp(16)}}
                resizeMode={'contain'}
                source={imgUrl}
            />
            <Text style={{fontSize: pxToDp(24), color: '#2D2D2D'}}>{txt}</Text>
        </TouchableOpacity>
    }

    // 我的订单
    renderOrder = (cb, imgUrl, txt, num) => {
        return <TouchableOpacity
            activeOpacity={1}
            onPress={cb}
            style={styles.order_item}
        >
            <Image
                style={{width: pxToDp(60), height: pxToDp(60)}}
                resizeMode={'contain'}
                source={imgUrl}
            />
            <Text style={{fontSize: pxToDp(24), color: '#333333', marginTop: pxToDp(8), textAlign: 'center'}}>{txt}</Text>
            {num > 0 && <Text style={styles.order_num}>{num}</Text>}

        </TouchableOpacity>
    }

    //消息视图
    renderMsgView(msg_count) {
        return <View style={[styles.msgCount, GlobalStyles.flex_common_row]}>
            <Text style={styles.msgText}>{msg_count > 9 ? '9+' : msg_count}</Text>
        </View>
    }

    //加入vip
    _addVIP() {
        const {memberInfo} = this.state;
        if (!memberInfo.member_id) {
            this.props.navigation.navigate('Login');
        } else {
            console.log('用户标识key:', key)
            this.props.navigation.navigate('JoinVip', {
                isFrom: 1,
                refeCode: memberInfo.refe_code,
                key,
                memberId: memberInfo.member_id
            });
        }
    }

    //查看我的收入
    _toMyReward() {
        const {memberInfo, pushInfo} = this.state;
        // console.log('推手id:', pushInfo.push_info.id)
        if (!memberInfo.member_id) {
            this.props.navigation.navigate('Login');
        } else {
            if (pushInfo.push_info.id) {
                this.props.navigation.navigate('MyReward');
            } else {
                console.log('用户标识key:', key)
                this.props.navigation.navigate('JoinVip', {
                    isFrom: 1,
                    refeCode: memberInfo.refe_code,
                    key,
                    memberId: memberInfo.member_id
                });
            }
        }
    }

    //新手教程,立即提现,我的团队,我要推广点击事件
    _itemsBtn(index) {
        const {memberInfo, pushInfo} = this.state;
        const {navigate} = this.props.navigation
        if (!memberInfo.member_id) {
            navigate('Login');
        } else {
            if (index === 0 || index === 1) {
                if (index === 0) {
                    //跳转到:学院
                    navigate('AcademyListScreen');
                } else {
                    navigate('TiXianList');
                }
            } else {
                console.log('推手id:', pushInfo)
                if (pushInfo && pushInfo.push_info.id) {
                    if (index === 2) {
                        navigate('PushHandTeam');
                    } else {
                        navigate('ShareJoinVip');
                    }
                } else {
                    // console.log('用户标识key:', key)
                    navigate('JoinVip', {
                        isFrom: 1,
                        refeCode: memberInfo.refe_code,
                        key,
                        memberId: memberInfo.member_id
                    });
                }
            }
        }
    }

    render() {
        const {memberInfo, msg_count, pushInfo} = this.state;
        const {width} = Dimensions.get('window')
        console.log('用户信息:', JSON.stringify(memberInfo))
        console.log('用户标识key:', key)

        const items = [
            {
                //新手教程
                title: I18n.t('MyScreen.Help'),
                logo: require('../assets/images/pushHand/my_new_learn.png')
            },
            {
                //立即提现
                title: I18n.t('MyScreen.CashOut'),
                logo: require('../assets/images/pushHand/my_withdraw.png')
            },
            {
                //我的团队
                title: I18n.t('MyScreen.MyTeam'),
                logo: require('../assets/images/pushHand/my_team.png')
            },
            {
                //我要推广
                title: I18n.t('MyScreen.PromoteNow'),
                logo: require('../assets/images/pushHand/my_promote.png')
            }
        ];

        return (
            <View style={styles.container}>
                <StatusBar translucent={true} hidden={false} barStyle={"dark-content"}/>
                <ScrollView style={{flex: 1}}>
                    {/*设置*/}
                    <View style={styles.ucenterTop}>
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            this.onClick('AccountSetting', {is_login_pwd_set: memberInfo.is_login_pwd_set});
                        }}>
                            <View style={styles.ucenterTopView}>
                                <Image style={styles.ucenterTopImg}
                                       source={require("../assets/images/set_w.png")}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            this.onClick('MyMessage');
                        }}>
                            <View style={styles.ucenterTopView}>
                                <Image style={styles.ucenterTopImg}
                                       source={require("../assets/images/msg_top.png")}/>
                                {msg_count > 0 ? this.renderMsgView(msg_count) : null}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <ImageBackground
                        style={styles.sld_mem_top_bg}
                        source={pushInfo && (pushInfo.member_dev === 'MEMBER' || pushInfo.member_dev === undefined) ? require("../assets/images/ownTop_m.png") : (pushInfo.member_dev === 'VIP_MEMBER' ? require("../assets/images/ownTop_vip_m.png") : require("../assets/images/ownTop_gold_vip_m.png"))}
                        resizeMode="cover"
                    >
                        <View style={[styles.member_detail, {top: 60}]}>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                {/*个人信息*/}
                                <View style={styles.member_info_top}>
                                    <View style={styles.member_info_base}>
                                        <View style={styles.member_avator}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={styles.member_avator_n}
                                                onPress={() => {
                                                    this.onClick('MemberInfo');
                                                }}
                                            >
                                                {
                                                    (typeof (memberInfo.avator) != 'undefined' && memberInfo.avator != '') &&
                                                    <Image style={styles.member_avator_img} source={{uri: this.state.memberInfo.avator}} defaultSource={require("../assets/images/sld_default_avator.png")}/>
                                                }
                                                {
                                                    (typeof (memberInfo.avator) == 'undefined' || memberInfo.avator == '' || !this.state.memberInfo.avator) &&
                                                    <Image style={styles.member_avator_img} source={require("../assets/images/sld_default_avator.png")}/>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.member_info_detail}>
                                            {
                                                key == '' &&
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    style={styles.go_login}
                                                    onPress={() => {
                                                        this.onClick('Login');
                                                    }}
                                                >
                                                    <Text style={[{
                                                        color: '#FFFFFF',
                                                        fontSize: pxToDp(30),
                                                        marginRight: pxToDp(6)
                                                    }]}>
                                                        {I18n.t('login')}/{I18n.t('signUp')}
                                                    </Text>
                                                    <Image
                                                        style={{width: pxToDp(15), height: pxToDp(26)}}
                                                        source={require('../assets/images/member_ltr.png')}
                                                        resizeMode={'contain'}/>
                                                </TouchableOpacity>
                                            }
                                            {
                                                key != '' &&
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text
                                                        style={[styles.member_name, {fontSize: pxToDp(30), fontWeight: '600'}]}>
                                                        {memberInfo.member_nickname || memberInfo.member_name}
                                                    </Text>
                                                </View>
                                            }
                                            {
                                                this.state.isCheck != '0' && key != '' && memberInfo.grade_info != undefined &&
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    // onPress={()=>{
                                                    // 	this.onClick('MemberGrade');
                                                    // }}
                                                    style={styles.grade_view}
                                                >
                                                    <Text style={styles.grade}>
                                                        {I18n.t('MyScreen.membershiplevel')}:{pushInfo ? pushInfo.member_dev : ''}
                                                    </Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                    {/*去签到*/}
                                    {/*{*/}
                                    {/*this.state.isCheck != '0' ?*/}
                                    {/*<TouchableOpacity*/}
                                    {/*activeOpacity={1}*/}
                                    {/*onPress={()=>{*/}
                                    {/*this.onClick('SignLogin');*/}
                                    {/*}}*/}
                                    {/*style={{*/}
                                    {/*flexDirection: 'row',*/}
                                    {/*marginRight: 15,*/}
                                    {/*width: pxToDp(220),*/}
                                    {/*height: pxToDp(48),*/}
                                    {/*backgroundColor: '#F6837D',*/}
                                    {/*alignItems: 'center',*/}
                                    {/*justifyContent: 'center',*/}
                                    {/*borderRadius: pxToDp(24),*/}
                                    {/*}}*/}
                                    {/*>*/}
                                    {/*<Image*/}
                                    {/*style={{width: pxToDp(21),height: pxToDp(23), marginRight: pxToDp(10)}}*/}
                                    {/*source={require('../assets/images/check_in_new.png')}*/}
                                    {/*resizeMode={'contain'}*/}
                                    {/*/>*/}
                                    {/*<Text style={{color: '#fff',fontSize: pxToDp(24)}}>{I18n.t('MyScreen.Gosignin')}</Text>*/}
                                    {/*</TouchableOpacity> :*/}
                                    {/*null*/}
                                    {/*}*/}
                                </View>
                            </View>
                        </View>
                        {/*加入vip*/}
                        {
                            key == '' || (key != '' && (!pushInfo.push_info || !pushInfo.push_info.id)) ?
                                <TouchableOpacity
                                    style={styles.addVipBtn}
                                    activeOpacity={1.0}
                                    onPress={() => this._addVIP()}
                                >
                                    <Text style={{marginLeft: 15, fontSize: 12, color: '#E6B28D'}}>{I18n.t('MyScreen.AddVIP')}</Text>
                                    <Image
                                        style={{marginLeft: 5, width: 34, height: 17}}
                                        source={require('../assets/images/pushHand/VIP_text.png')}
                                        resizeMode={'contain'}
                                    />
                                    <Text style={{flex: 1, marginLeft: 5, fontSize: 12, color: '#E6B28D'}} numberOfLines={1}>{I18n.t('MyScreen.AddVIPText')}</Text>
                                    <ImageBackground
                                        style={{justifyContent: 'center', alignItems: 'center', marginRight: 15, width: 32, height: 32}}
                                        source={require('../assets/images/pushHand/GO_text.png')}
                                        resizeMode={'contain'}
                                    >
                                        <Text style={{fontSize: 14, color: '#fff', textAlign: 'center'}}>Go</Text>
                                    </ImageBackground>
                                </TouchableOpacity> : null
                        }
                    </ImageBackground>
                    {/*我的收入*/}
                    <TouchableOpacity
                        style={styles.myIncome}
                        activeOpacity={1.0}
                        onPress={() => this._toMyReward()}
                    >
                        <LinearGradient
                            style={styles.myIncome_top}
                            start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
                            locations={[0, 1]}
                            colors={['#ffd9c1', '#fac099']}
                        >
                            <Text style={{
                                flex: 1,
                                marginLeft: 10,
                                fontSize: 13,
                                color: '#4D2828'
                            }}>{I18n.t('MyScreen.MyIncome')}</Text>
                            <Image style={{marginRight: 10, width: 9, height: 16}}
                                   source={require('../assets/images/pushHand/right_arrow.png')}/>
                        </LinearGradient>
                        <View style={styles.myIncome_center}>
                            <View style={{flex: 1, width: width * 0.57, height: width * 0.35}}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#FFF7F3',
                                    borderRadius: 3.0
                                }}>
                                    <Image style={{marginLeft: 10, width: 22, height: 25}}
                                           source={require('../assets/images/pushHand/my_income.png')}/>
                                    {/*今日收益*/}
                                    <View>
                                        <Text style={{
                                            marginLeft: 12,
                                            fontSize: 9,
                                            color: '#4D2828',
                                            marginTop: 2,
                                        }}>{I18n.t('MyScreen.IncomeToday')}</Text>
                                        <Text style={{marginLeft: 12, fontSize: 16, color: '#4D2828'}}>
                                            {memberInfo && memberInfo.today_yongjin ? PriceUtil.formatPrice(memberInfo.today_yongjin) + 'ks' : '-- ks'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 6,
                                    backgroundColor: '#FFF7F3',
                                    borderRadius: 3.0
                                }}>
                                    <Image style={{marginLeft: 10, width: 25, height: 25}}
                                           source={require('../assets/images/pushHand/team_number.png')}/>
                                    {/*团队人数*/}
                                    <View style={{flex: 1}}>
                                        <Text style={{
                                            marginLeft: 12,
                                            fontSize: 9,
                                            color: '#4D2828',
                                            marginTop: 2,
                                        }}>{I18n.t('MyScreen.TeamMember')}</Text>
                                        <Text style={{marginLeft: 12, fontSize: 16, color: '#4D2828'}}>
                                            {memberInfo && memberInfo.team_num ? `${memberInfo.team_num}` : '--'}
                                        </Text>
                                    </View>
                                    {/*距离GoldenVIP还剩*/}
                                    {
                                        pushInfo && pushInfo.push_info && pushInfo.push_info.id ? null :
                                            <View style={{flex: 1}}>
                                                <Text style={{
                                                    marginLeft: 12,
                                                    fontSize: 9,
                                                    color: '#4D2828'
                                                }}>{I18n.t('MyScreen.FromGoldenVIP')}</Text>
                                                <Text style={{marginLeft: 12, fontSize: 16, color: '#4D2828'}}>
                                                    {memberInfo && memberInfo.push_num && memberInfo.all_num ? `${memberInfo.push_num}/${memberInfo.all_num}` : '--'}
                                                </Text>
                                            </View>
                                    }
                                </View>
                            </View>
                            <View style={{
                                justifyContent: 'center',
                                marginLeft: 6,
                                paddingLeft: 11,
                                width: width * 0.3,
                                height: width * 0.35,
                                backgroundColor: '#FEF2EA',
                                borderRadius: 3.0
                            }}>
                                {/*累计收益*/}
                                <Text style={{
                                    marginTop: 18,
                                    fontSize: 9,
                                    color: '#4D2828',
                                    textAlign: 'left'
                                }}>
                                    {I18n.t('MyScreen.TotalIncome')}
                                </Text>
                                <Text style={{fontSize: 15, color: '#4D2828', textAlign: 'left', marginTop: 10}} numberOfLines={2}>
                                    {memberInfo && memberInfo.all_yongjin ? PriceUtil.formatPrice(memberInfo.all_yongjin) : '--'}
                                </Text>
                                <Image
                                    style={{marginTop: 9, marginLeft: width * 0.2, width: 19, height: 19}}
                                    source={require('../assets/images/pushHand/my_KS.png')}
                                    resizeMode={'contain'}
                                />
                            </View>
                        </View>
                        <View style={styles.myIncome_bottom}>
                            {
                                items.map((value, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                            onPress={() => this._itemsBtn(index)}
                                        >
                                            <Image style={{width: 33, height: 33}} source={value.logo}/>
                                            <Text style={{
                                                marginTop: 8,
                                                fontSize: 9,
                                                color: '#4D2828',
                                                textAlign: 'center'
                                            }}>{value.title}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={styles.order_lsit}>
                        <Text style={styles.title_txt}>{I18n.t('MyScreen.MyOrder')}</Text>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                this.onClick("OrderList");
                            }}
                        >
                            <Text style={{color: '#666666', fontSize: pxToDp(22)}}>{I18n.t('MyScreen.viewall')}</Text>
                            <Image
                                style={{
                                    width: pxToDp(10),
                                    height: pxToDp(17),
                                    tintColor: '#666666',
                                    marginLeft: pxToDp(15)
                                }}
                                resizeMode={'contain'}
                                source={require('../assets/images/sld_arrow_right.png')}
                            />
                        </TouchableOpacity>
                    </View>
                    {/*我的订单*/}
                    <View style={styles.sld_center_combine}>
                        {this.renderOrder(() => this.onClick("OrderList", 1), require("../assets/images/sld_wait_pay.png"), I18n.t('orderStatus.Pendingpayment'), memberInfo.dai_fu)}
                        {this.renderOrder(() => this.onClick("OrderList", 256), require("../assets/images/sld_wait_deliver.png"), I18n.t('orderStatus.tobedelivered'), memberInfo.dai_fahuo)}
                        {this.renderOrder(() => this.onClick("OrderList", 1024), require("../assets/images/sld_wait_shou.png"), I18n.t('orderStatus.Pendingreceipt'), memberInfo.dai_send)}
                        {this.renderOrder(() => this.onClick("OrderList", 'nocomment'), require("../assets/images/sld_wait_evalute.png"), I18n.t('orderStatus.comment'), memberInfo.dai_ping)}
                        {this.renderOrder(() => this.onClick("ReturnRefundList"), require("../assets/images/sld_shouhou.png"), I18n.t('orderStatus.Refundaftersale'), memberInfo.refund_count)}
                    </View>

                    <View style={styles.title_member}>
                        <Text style={styles.title_txt}>{I18n.t('MyScreen.MyService')}</Text>
                    </View>
                    {/*我的服务*/}
                    {
                        this.state.isCheck == '0' ?
                            <View style={styles.mem_ser_list}>
                                {this.renderServer(() => this.onClick("HelpCenter"), require("../assets/images/sld_icon8.png"), I18n.t('MyScreen.HelpCenter'))}
                                {this.renderServer(() => this.onClick("TouSu"), require("../assets/images/complain.png"), I18n.t('GoodsDetailNew.service'))}
                                {this.renderServer(() => this.pushToProtocol(), require("../assets/images/sld_pintuan_order.png"), I18n.t('MyScreen.Protocol'))}
                                {this.renderServer(() => this.onClick("LanguageSettings"), require("../assets/images/myscreen_lang.png"), I18n.t('MyScreen.LanguageSetting'))}
                            </View> :
                            <View style={styles.mem_ser_list}>
                                {this.renderServer(() => this.onClick("AccountMoney"), require("../assets/images/sld_predeposite.png"), I18n.t('MyScreen.AccountMoney'))}
                                {this.renderServer(() => this.onClick("MyVoucher"), require("../assets/images/sld_icon5.png"), I18n.t('MyScreen.MyVoucher'))}
                                {/*{ this.renderServer(() => this.onClick("PinTuanOrder"), require("../assets/images/sld_pintuan_order.png"), I18n.t('MyScreen.PinTuanOrder')) }*/}
                                {/*{this.renderServer(() => this.onClick("PointLog"), require("../assets/images/sld_point_icon.png"), I18n.t('MyScreen.PointLog'))}*/}
                                {this.renderServer(() => this.onClick("CollectGoods"), require("../assets/images/favourite.png"), I18n.t('MyScreen.favourite'))}
                                {this.renderServer(() => this.onClick("RechargeList"), require("../assets/images/sld_chongzhi_icon.png"), I18n.t('MyScreen.RechargeList'))}
                                {this.renderServer(() => this.onClick("AddressList"), require("../assets/images/sld_icon6.png"), I18n.t('MyScreen.AddressList'))}
                                {/*{ this.renderServer(() => this.onClick("SignLogin"), require("../assets/images/sign_login.png"), I18n.t('MyScreen.SignLogin')) }*/}
                                {/*{ this.renderServer(() => this.onClick("TouSu"), require("../assets/images/complain.png"), I18n.t('MyScreen.TouSu')) }*/}
                                {/*{this.renderServer(() => this.onClick("TiXianList"), require("../assets/images/pushHand/my_withdraw.png"), I18n.t('MyScreen.TiXianList'))}*/}
                                {/*{ this.renderServer(() => this.onClick("PinLadderOrder"), require("../assets/images/jtt.png"), I18n.t('MyScreen.PinLadderOrder')) }*/}
                                {/*{ this.renderServer(() => this.onClick("VipGoods"), require("../assets/images/presake.png"), I18n.t('lihaoran.vipshop')) }*/}
                                {this.renderServer(() => this.onClick("LanguageSettings"), require("../assets/images/myscreen_lang.png"), I18n.t('MyScreen.LanguageSetting'))}
                                {this.renderServer(() => this.onClick("FootPrint"), require("../assets/images/footprint.png"), I18n.t('MyScreen.footPrint'))}
                            </View>
                    }

                    {/*商户入驻*/}
                    {/*{ this.state.isCheck != '0' && (memberInfo.ban_enter_shop == 'undefined' || memberInfo.ban_enter_shop != 1) &&*/}
                    {/*<Fragment>*/}
                    {/*	<TouchableOpacity*/}
                    {/*		style={styles.mt20}*/}
                    {/*		activeOpacity={ 1 }*/}
                    {/*		onPress={ () => this.onClick("company_reg") }>*/}
                    {/*		<Image resizeMode={ 'cover' } style={ styles.sld_question_img }*/}
                    {/*			   source={ require("../assets/images/ven_apply.png") }/>*/}
                    {/*		<Text style={[styles.mt_txt,{top: pxToDp(54)}]}>{I18n.t('MyScreen.Immediatelysettled')}</Text>*/}
                    {/*	</TouchableOpacity>*/}
                    {/*</Fragment>*/}
                    {/*}*/}

                    {
                        this.state.isCheck != '0' && (key == '' || pushInfo.push_info === '') &&
                        <Fragment>
                            <TouchableOpacity
                                style={styles.mt20}
                                activeOpacity={1}
                                onPress={() => this.onClick("JoinVip")}>
                                <Image resizeMode={'cover'} style={styles.sld_question_img}
                                       source={this.state.language === LANGUAGE_CHINESE ? require("../assets/images/pushHand/pushHandBanner_c.png") : require("../assets/images/pushHand/pushHandBanner_e.png")}/>
                            </TouchableOpacity>
                        </Fragment>
                    }
                    {/*问卷调查*/}
                    {
                        this.state.isCheck == '0' ? null :
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.mt20, styles.mb20]}
                            onPress={() => this.onClick("FeedBack")}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.sld_question_img}
                                source={this.state.language === LANGUAGE_CHINESE ? require("../assets/images/sld_question_c.png") : require("../assets/images/sld_question_e.png")}
                            />
                        </TouchableOpacity>
                    }
                    {/*我的服务*/}
                    {/*{*/}
                    {/*    this.state.isCheck != '0' && key !== '' && pushInfo && pushInfo.push_info !== '' &&*/}
                    {/*    <Fragment>*/}
                    {/*        <View style={styles.title_member}>*/}
                    {/*            <Text style={styles.title_txt}>{I18n.t('MyScreen.Mydistribution')}</Text>*/}
                    {/*        </View>*/}
                    {/*        <View style={styles.fx_list}>*/}
                    {/*            {this.renderFx(() => this.onClick("InviteFriend"), require("../assets/images/sld_icon1.png"), I18n.t('MyScreen.InviteFriend'))}*/}
                    {/*            {this.renderFx(() => this.onClick("PushHandTeam"), require("../assets/images/sld_icon7.png"), I18n.t('MyScreen.MyTeam'))}*/}
                    {/*            {this.renderFx(() => this.onClick("MyReward"), require("../assets/images/sld_icon4.png"), I18n.t('MyScreen.FenXiaoIncome'))}*/}
                    {/*        </View>*/}
                    {/*    </Fragment>*/}
                    {/*}*/}


                    {/*<TouchableOpacity*/}
                    {/*    style={[fun.f_flex1, fun.f_center, {height: 50}]}*/}
                    {/*    onPress={() => this._inviteFriendAddVIP()}*/}
                    {/*>*/}
                    {/*    <Text>{I18n.t('MyScreen.inviteFrind')}</Text>*/}
                    {/*</TouchableOpacity>*/}

                </ScrollView>
                {/*<View style={{height: Platform.OS === 'ios' && (height === 812 || height === 896) ? 83 : 49, backgroundColor: '#fff'}}/>*/}
                {/*新人优惠券弹框*/}
                <SldRedMoney redMoneyRefresh={this.state.redMoneyRefresh} navigation={this.props.navigation}/>
            </View>
        )
    }

    pushToProtocol() {
        let url = AppSldDomain;
        url = url + 'appview/sld_register_protocol.html';
        this.props.navigation.navigate('WebviewPage', {'weburl': url, 'title': I18n.t('MyScreen.Protocol')});
    }

}

const styles = StyleSheet.create({
    heikamem: {
        color: '#c7b07e',
    },
    quanyishengji: {
        color: '#c7b07e',
    },
    mem_upgrade: {
        flexDirection: 'column',
        position: 'absolute',
        top: 70,
        right: 25,
    },
    sld_my_sperator: {
        borderRightWidth: 0.5,
        borderColor: '#ccc',
    },
    collectnum: {
        color: '#2D2D2D',
        fontSize: pxToDp(34),
        textAlign: 'center',
        fontWeight: '600'
    },
    collecttext: {
        fontSize: pxToDp(28),
        color: '#2D2D2D',
        fontWeight: '400',
        marginLeft: pxToDp(6)
    },
    sld_my_part: {
        alignItems: 'center',
        flex: 1,
    },
    member_grade: {
        width: 15,
        height: 15,
    },
    member_name: {
        fontSize: pxToDp(20),
        color: '#fff',
        width: pxToDp(200)
    },
    grade_wrap: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    grade_view: {
        width: 'auto',
        marginTop: pxToDp(20),
        borderRadius: pxToDp(13),
        height: pxToDp(26),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: pxToDp(1),
        paddingHorizontal: pxToDp(6)
    },
    grade: {
        color: '#fff',
        fontSize: pxToDp(20),
    },
    member_vip: {
        color: '#fff',
        margin: pxToDp(5),
        marginLeft: pxToDp(8),
        marginRight: pxToDp(8),
    },
    member_collect_wrap: {
        marginTop: pxToDp(20),
        width: width - pxToDp(140),
        height: pxToDp(190),
        marginHorizontal: pxToDp(70)
    },
    collect_bg: {
        position: 'absolute',
        top: pxToDp(0),
        left: pxToDp(12),
        backgroundColor: '#FA6C63',
        width: width - pxToDp(128),
        height: pxToDp(145),
        zIndex: 1,
        borderRadius: pxToDp(6)
    },
    collectwrap: {
        position: 'absolute',
        top: pxToDp(12),
        left: pxToDp(0),
        width: width - pxToDp(128),
        height: pxToDp(175),
        flexDirection: 'row',
        backgroundColor: '#fff',
        zIndex: 2,
        borderRadius: pxToDp(6)
    },
    collectwrapplus: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        position: 'relative',
    },
    member_detail: {
        position: 'absolute',
        width: width,
        top: pxToDp(120),
        left: pxToDp(0),
    },
    avator_info: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    member_avator: {
        width: pxToDp(115),
        height: pxToDp(115),
        borderRadius: pxToDp(115 / 2),
        borderWidth: pxToDp(10),
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,0.5)'
    },
    member_avator_n: {
        width: pxToDp(95),
        height: pxToDp(95),
        borderRadius: pxToDp(95 / 2),
        borderWidth: pxToDp(10),
        borderStyle: 'solid',
        borderColor: 'rgba(255,255,255,1)',
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    member_avator_img: {
        width: pxToDp(75),
        height: pxToDp(75),
    },
    member_info_detail: {
        height: pxToDp(115),
        justifyContent: 'center',
        marginLeft: pxToDp(20)
    },
    go_login: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    user_shenfen_bg: {
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 75 : 60) : 60,
        width: Dimensions.get('window').width * 1 - 30,
        height: pxToDp(300),
        marginLeft: 15,
    },
    item: {
        flexDirection: 'row',
    },
    leftimage: {
        width: 50,
        height: 50,
    },
    sld_mem_top_bg: {
        width: Dimensions.get('window').width,
        height: Platform.OS === 'ios' && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896) ? 225 : 210
    },

    sld_center_combine: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    sld_question_img: {
        marginHorizontal: pxToDp(20),
        width: width - pxToDp(40),
        height: (width - pxToDp(40)) * (137 / 710),
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
        width: 105,
        marginLeft: 15,
    },
    topicImg: {
        width: 105,
        height: 105,
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
        fontSize: 16,
        color: '#ba1418',
        marginTop: 4,
        fontWeight: '400'
    },
    goods_recommond: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    sld_rec_style: {
        height: 49,
        lineHeight: 49,
        color: '#bfbfbf',
        letterSpacing: 2,
        fontWeight: '400',
        marginTop: 8
    },
    sld_single_right_icon: {
        height: 11,
        width: 11,
        alignSelf: 'center',
        opacity: 0.5
    },
    ucenterTop: {
        position: 'absolute',
        zIndex: 10,
        left: 0,
        right: 0,
        top: Platform.OS === 'ios' && (Dimensions.get('window') === 812 || Dimensions.get('window') === 896) ? 45 : 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    ucenterTopView: {
        width: pxToDp(50),
        paddingTop: pxToDp(20),
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: pxToDp(20),
        position: 'relative',
    },
    msgCount: {
        position: 'absolute',
        right: pxToDp(2),
        top: pxToDp(8),
        width: pxToDp(21),
        height: pxToDp(21),
        backgroundColor: '#fff',
        borderRadius: pxToDp(21 / 2),
    },
    msgText: {
        color: main_color,
        fontSize: pxToDp(16),
    },
    ucenterTopImg: {
        width: pxToDp(32),
        height: pxToDp(32),
    },
    member_info_top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    member_info_base: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(115),
        paddingLeft: pxToDp(45)
    },
    member_collect_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(30),
        marginBottom: pxToDp(20)
    },
    collect_line: {
        width: pxToDp(1),
        height: pxToDp(30),
        backgroundColor: '#565656',
        marginTop: pxToDp(30)
    },
    mem_ser_list: {
        marginHorizontal: pxToDp(20),
        borderRadius: pxToDp(6),
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: pxToDp(20)
    },
    order_lsit: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: pxToDp(90),
        paddingHorizontal: pxToDp(20),
        backgroundColor: '#fff',
    },
    title_txt: {
        color: '#2D2D2D',
        fontWeight: '600',
        fontSize: pxToDp(30)
    },
    title_member: {
        paddingHorizontal: pxToDp(20),
        marginTop: pxToDp(30),
        marginBottom: pxToDp(20)
    },
    server_item: {
        width: (width - pxToDp(40)) / 4,
        alignItems: 'center',
        marginTop: pxToDp(30)
    },
    mt20: {
        marginTop: pxToDp(20)
    },
    mb20: {
        marginBottom: pxToDp(20)
    },
    fx_list: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: pxToDp(20),
        marginBottom: pxToDp(20),
        backgroundColor: '#fff'
    },
    fx_item: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: pxToDp(20)
    },
    order_item: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: pxToDp(20)
    },
    order_num: {
        position: 'absolute',
        top: pxToDp(8),
        left: pxToDp(90),
        minWidth: pxToDp(23),
        height: pxToDp(23),
        lineHeight: pxToDp(23),
        paddingHorizontal: pxToDp(6),
        backgroundColor: '#E1251B',
        color: '#fff',
        fontSize: pxToDp(20),
        borderRadius: pxToDp(23 / 2),
    },
    mt_txt: {
        position: 'absolute',
        top: pxToDp(56),
        right: pxToDp(55),
        color: '#2D2D2D',
        fontSize: pxToDp(24)
    },
    addVipBtn: {
        flex: 1,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        left: 21,
        right: 21,
        bottom: 38,
        height: 44,
        backgroundColor: 'rgb(17,17,17)',
        borderTopLeftRadius: 5.0,
        borderTopRightRadius: 5.0,
        borderWidth: 1.0,
        borderColor: '#E6B28D'
    },
    myIncome: {
        marginTop: -38,
        marginHorizontal: 10,
        height: Dimensions.get('window').width * 0.72,
        borderRadius: 5.0,
        overflow: 'hidden'
    },
    myIncome_top: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 0,
        height: 38,
        borderTopLeftRadius: 5.0,
        borderTopRightRadius: 5.0,
    },
    myIncome_center: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 6
    },
    myIncome_bottom: {
        flex: 1,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});
