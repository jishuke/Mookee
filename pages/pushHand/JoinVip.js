/**
 * 推手 --- vip
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
    ScrollView,
    ImageBackground,
    Dimensions,
    Platform,
	Alert,
    TextInput,
    DeviceEventEmitter
} from "react-native";
import fun from '../../assets/styles/FunctionStyle';
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import StorageUtil from "../../util/StorageUtil";
import {I18n, LANGUAGE_CHINESE, LANGUAGE_MIANWEN, LANGUAGE_ENGLISH} from '.././../lang/index'
import LinearGradient from "react-native-linear-gradient";
import {getVIPInfo, getVIPCoupon, getVIPPrice, verifyInviteCode} from "../../api/pushHandApi"

export default class JoinVip extends Component{
    constructor(props) {
        super(props);

        this.state = {
            imgHeight: 0,
            imgH: 0,
            language: 0,
            isFrom: props.navigation.state.params.isFrom,
            selectedIndex: null, //选择商品的index
            showVIPDetailAlert: false,
            showCouponAlert: false,
            data: [], //商品列表,
            coupons: [], //优惠券
            showCodeAlert: false, //绑定邀请码弹框
            pushCode: props.refeCode ? props.refeCode+'' : '', //邀请码
            vipPrice: ''
        };
    }

    canClick = true

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

        this.listener = DeviceEventEmitter.addListener('goodsDetail', res => {
            if (res) {
                let { data } = this.state;

                let have = false
                data.slice(11)
                const newData = data;
                for (let i = 0; i<newData.length; i++) {
                    if (res.gid === newData[i].gid) {
                        have = true
                        const addFirst = newData[i];
                        data.splice(i, 1)
                        data.unshift(addFirst)
                        break
                    }
                }
                if (!have) {
                    data.unshift(res)
                }

                this.setState({
                    data,
                    selectedIndex: 0
                })
            }
        });

        this._loadData();
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    leftButton() {
        return (
            <TouchableOpacity
                style={{flex: 1, marginLeft: 12, width: 40, justifyContent: 'center', alignItems: 'flex-start'}}
                activeOpacity={1.0}
                onPress={() => this.props.navigation.goBack()}
            >
                <Image style={{width: 28, height: 28}} source={require('../../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    };

    //加载数据
    _loadData() {
        //vip商品列表
        getVIPInfo().then(res => {
            if (res.code === 200) {
                console.log('vip商品赠送:', JSON.stringify(res))
                this.setState({
                    data: res.datas.goods_list
                })
            }
        }).catch(err => {
            console.log('vip商品赠送请求失败:', err)
        })

        //获取vip价格
        const { key } = this.props.navigation.state.params
        getVIPPrice({key}).then(res => {
            if (res.code === 200) {
                console.log('vip价格:', res)
                this.setState({vipPrice: res.datas.money})
            }
        }).catch(err => {

        })

        getVIPCoupon().then(res => {
            console.log('vip优惠券:', res)
            if (res.code === 200) {
                this.setState({
                    coupons: res.datas || []
                })
            }
        }).catch(err => {

        })
    }

    //验证邀请码是否正确
    _verifyInviteCode(callBack) {
        if (!this.canClick) {
            return
        }
        const { key } = this.props.navigation.state.params
        const { pushCode } = this.state
        this.canClick = false
        verifyInviteCode({key, code: pushCode}).then(res => {
            console.log('验证邀请码是否正确:', res)
            this.canClick = true

            if (res.code == 200 && res.datas.member_id) {
                callBack(true)
            } else {
                callBack(false)
            }
        }).catch(err => {
            callBack(false)
            this.canClick = true
            // console.log('验证邀请码是否正确请求失败:', err)
        })
    }

    checkLoginKey (){
        if(key){
            this.props.navigation.navigate('Settlement', {isFrom:this.state.isFrom});
        }else {
            this.props.navigation.navigate('Login');
        }
    }

    //了解详情
    _viewDetail() {
        const { showVIPDetailAlert } = this.state
        this.setState({
            showVIPDetailAlert: !showVIPDetailAlert
        })
    };

    //查看更多
    _lookMore() {
        let { data } = this.state
        this.props.navigation.navigate(
            'VIPSelectGoods',
            {
                refreshCallBack: (res) => {
                    console.log('商品选择页CallBack:', res)

                    let have = false
                    data.slice(11)
                    const newData = data;
                    for (let i = 0; i<newData.length; i++) {
                        if (res.gid === newData[i].gid) {
                            have = true
                            const addFirst = newData[i]
                            data.splice(i, 1)
                            data.unshift(addFirst)
                            break
                        }
                    }

                    if (!have) {
                        data.unshift({
                            goods_image_url: res.image,
                            goods_name: res.title,
                            gid: res.gid
                        })
                    }

                    this.setState({
                        data,
                        selectedIndex: 0
                    })
                }
            }
        );
    };

    //点击商品进入商品详情
    _selectCommodity(gid) {
        this.props.navigation.navigate('GoodsDetailNew', {gid: gid, fromVip: true, fromBanner: true})
    };

    //查看优惠券
    _lookCoupon() {
        const { showCouponAlert } = this.state;
        this.setState({
            showCouponAlert: !showCouponAlert
        })
    };

    //立即加入
    _joinNow(gid) {
        const { pushCode, vipPrice } = this.state;
        const { params } = this.props.navigation.state

        //是否绑定邀请码
        if (!pushCode) {
            Alert.alert('', I18n.t('PinTuanOrder.text37'))
            return
        }
        if (pushCode.length !== 6) {
            Alert.alert('', I18n.t('PinTuanOrder.text35'))
            return
        }

        //验证邀请码是否正确
        this._verifyInviteCode(res => {
            if (res) {
                //跳转到确认下单页面
                this.props.navigation.navigate('ConfirmOrder', {
                    fromVip: true,
                    gid,
                    refeCode: pushCode,
                    key: params.key,
                    memberId: params.memberId,
                    vipPrice,
                    buy_num: 1,
                    if_cart: 0,
                    pin: "",
                    team_id: ''
                });
            } else {
                Alert.alert('', I18n.t('PinTuanOrder.text36'))
            }
        })
    };

    render() {
        const { width } = Dimensions.get('window');
        const { params } = this.props.navigation.state
        const { selectedIndex, showVIPDetailAlert, showCouponAlert, showCodeAlert, data, pushCode, coupons, language } = this.state;

        // console.log('Banner数据:', JSON.stringify(data))

        const explanations = [
            {
                icon: require('../../assets/images/pushHand/VIP_discrib_0000.png'),
                title: I18n.t('PinTuanOrder.text14'), //自购省钱
                content: I18n.t('PinTuanOrder.text15'), //自购商品享受VIP折扣
            },
            {
                icon: require('../../assets/images/pushHand/VIP_discrib_0001.png'),
                title: I18n.t('PinTuanOrder.text16'), //创业合伙人
                content: I18n.t('PinTuanOrder.text17'), //建立自己的创业团队
            },
            {
                icon: require('../../assets/images/pushHand/VIP_discrib_0002.png'),
                title: I18n.t('PinTuanOrder.text18'), //推广商品返佣
                content: I18n.t('PinTuanOrder.text19'), //推广商品最高获得60%的商品推广佣金
            },
            {
                icon: require('../../assets/images/pushHand/VIP_discrib_0003.png'),
                title: I18n.t('PinTuanOrder.text20'), //VIP推广返佣
                content: I18n.t('PinTuanOrder.text21'), //每成功推1人成为VIP用户，即可获得返佣
            }
        ];

        return (
            <View style={[fun.f_flex1, fun.f_flex, {backgroundColor: '#141217', justifyContent: 'center'}]}>
                {/*导航*/}
                <NavigationBar
                    ref={ref => this.nav = ref}
                    statusBar={{barStyle: "light-content"}}
                    leftButton={this.leftButton()}
                    title={I18n.t('PinTuanOrder.vip')}
                    title_color={'#E6B28D'}
                    popEnabled={false}
                    style={{backgroundColor: "rgba(1,1,1,0)"}}
                />
                <ScrollView
                    style={{backgroundColor: '#141217', flex: 1}}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode={'on-drag'}
                >
                    <View>
                        {/*头部背景图*/}
                        <Image
                            style={{width: width, height: width*0.628, backgroundColor: '#141217'}}
                            resizeMode="contain"
                            source={require('../../assets/images/pushHand/vip_background.png')}
                        />
                    </View>
                    {/*了解详情*/}
                    <LinearGradient
                        style={styles.detail}
                        start={{x: 0.5, y: 0.0}} end={{x: 0.5, y: 1.0}}
                        locations={[0, 1]}
                        colors={['#000', '#000']}
                    >
                        <View style={{
                            marginTop: 0,
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 43
                        }}>
                            <Text style={{flex: 1, marginLeft: 15, fontSize: 14, color: '#E6B28D'}} numberOfLines={1}>{I18n.t('PinTuanOrder.whatIsVip')}</Text>
                            <TouchableOpacity
                                style={{
                                    marginRight: 19,
                                    height: 20,
                                    borderRadius: 10.0,
                                    overflow: 'hidden'
                                }}
                                activeOpacity={1.0}
                                onPress={() => this._viewDetail()}
                            >
                                <LinearGradient
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                    start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
                                    locations={[0, 1]}
                                    colors={['rgb(213,143,97)', 'rgb(223,163,122)']}
                                >
                                    <Text style={{marginHorizontal: 9, fontSize: 11, color: '#442E20'}}>{I18n.t('PinTuanOrder.detail')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line}/>
                        {/*什么是vip文字内容*/}
                        <View style={{flex: 1, paddingHorizontal: 15, paddingVertical: 15}}>
                            <Text style={{fontSize: 13, color: '#E6B28D'}}>{I18n.t('PinTuanOrder.vip_content')}</Text>
                        </View>
                    </LinearGradient>
                    {/*查看更多*/}
                    <View style={styles.detail}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 43
                        }}>
                            <Text style={{flex: 1, marginLeft: 15, fontSize: 14, color: '#E6B28D'}} numberOfLines={1}>{I18n.t('PinTuanOrder.beVipTitle')}</Text>
                            <TouchableOpacity
                                style={{
                                    marginRight: 19,
                                    height: 20,
                                    borderRadius: 10.0,
                                    overflow: 'hidden'
                                }}
                                activeOpacity={1.0}
                                onPress={() => this._lookMore()}
                            >
                                <LinearGradient
                                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                    start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
                                    locations={[0, 1]}
                                    colors={['rgb(213,143,97)', 'rgb(223,163,122)']}
                                >
                                    <Text style={{marginHorizontal: 9, fontSize: 11, color: '#442E20'}}>{I18n.t('PinTuanOrder.more')}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line}/>
                        {/*商品图片轮播*/}
                        <Banner
                            data={data}
                            selectedIndex={selectedIndex}
                            select={(gid) => this._selectCommodity(gid)}
                        />
                    </View>
                    {/*优惠券*/}
                    <ImageBackground
                        style={{
                            marginTop: 21,
                            marginHorizontal: 10,
                            height: width*0.27,
                            borderRadius: 6.0
                        }}
                        source={require('../../assets/images/pushHand/vip_hongbao.png')}
                    >
                        <TouchableOpacity
                            style={{flex: 1, alignItems: 'center'}}
                            activeOpacity={1.0}
                            onPress={() => this._lookCoupon()}
                        >
                            {/*VIP专享*/}
                            <Text style={{marginTop: width*0.05, fontSize: language === LANGUAGE_MIANWEN ? 11 : 15, color: '#442E20', textAlign: 'center'}}>{I18n.t('PinTuanOrder.text11')}</Text>
                            {/*礼包优惠券*/}
                            <Text style={{marginTop: width*0.012, fontSize: language === LANGUAGE_MIANWEN ? 13 : 17, color: '#CB7571', textAlign: 'center'}}>{I18n.t('PinTuanOrder.text12')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                    {/*填写邀请码*/}
                    <View
                        style={{
                            marginTop: 20,
                            marginHorizontal: 15,
                            height: 94,
                            borderRadius: 8.0,
                            borderWidth: 0.5,
                            borderColor: '#E6B28D'
                        }}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 44}}>
                            <Text style={{flex: 1, fontSize: 18, color: '#E6B28D'}}>{I18n.t('PinTuanOrder.text28')}</Text>
                            <TouchableOpacity
                                style={{width: 25, height: 25}}
                                activeOpacity={1.0}
                                onPress={() => {
                                    this.setState({showCodeAlert: true})
                                }}
                            >
                                <Image style={{width: 25, height: 25}} resizeMode={'contain'} source={require('../../assets/images/pushHand/my_new_learn.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line}/>
                        <TextInput
                            style={{flex: 1, marginHorizontal: 15, color: '#E6B28D'}}
                            placeholder={I18n.t('PinTuanOrder.text33')}
                            placeholderTextColor={'#fff'}
                            keyboardType={'numeric'}
                            maxLength={6}
                            value={pushCode}
                            onChangeText={text => {
                                let reg = /^[0-9]*$/
                                if (reg.test(text)) {
                                    this.setState({pushCode: text})
                                }
                            }}
                        />
                    </View>
                    {/*VIP介绍*/}
                    <Image style={{marginTop: 20, alignSelf: 'center'}} source={require('../../assets/images/joinVIP_VIP.png')} resizeMode={'contain'}/>
                    <View
                        style={{
                            marginTop: 23,
                            marginHorizontal: 10,
                            paddingTop: 5,
                            paddingBottom: 20,
                            borderRadius: 7,
                            borderWidth: 0.5,
                            borderColor: '#E6B28D'
                        }}
                    >
                        {
                            explanations.map((item, index) => {
                                return (
                                    <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                                        <Image style={{marginLeft: 10, width: 37, height: 37}} source={item.icon} resizeMode={'contain'}/>
                                        <View style={{flex: 1, marginLeft: 10}}>
                                            <Text style={{flex: 1, fontSize: 15, color: '#E6B28D'}}>{item.title}</Text>
                                            <Text style={{flex: 1, fontSize: 15, color: '#E6B28D'}}>{item.content}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={{height: 78}}/>
                </ScrollView>
                {/*立即加入*/}
                <TouchableOpacity
                    style={styles.footer}
                    activeOpacity={1.0}
                    onPress={() => {
                        if (selectedIndex === null) {
                            Alert.alert('', I18n.t('PinTuanOrder.text34'))
                            return
                        }
                        this._joinNow(data[selectedIndex].gid)
                    }}
                >
                    <Text style={{fontSize: 18, color: '#4D2828', textAlign: 'center'}}>{I18n.t('PinTuanOrder.text32')}</Text>
                </TouchableOpacity>
                {/*vip说明弹框*/}
                {
                    showVIPDetailAlert && <VIPDetailAlert onClick={() => this.setState({showVIPDetailAlert: false})}/>
                }
                {/*优惠券弹框*/}
                {
                    showCouponAlert && <CouponAlert data={coupons} language={language} onClick={() => this.setState({showCouponAlert: false})}/>
                }
                {/*绑定推广码弹框*/}
                {
                    showCodeAlert && <BindInviteCode onClick={() => this.setState({showCodeAlert: false})}/>
                }
            </View>
        );
    }
}

//商品Banner
class Banner extends Component {
    render () {
        let { data, select, selectedIndex } = this.props;
        data.slice(11);
        return (
            <View>
                <ScrollView
                    style={{marginHorizontal: 0, paddingLeft: 3, paddingTop: 11, paddingBottom: 15, height: 184}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        data && data.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        marginLeft: 10,
                                        width: 109,
                                        height: 159,
                                        backgroundColor: '#fff',
                                        borderRadius: 5.0,
                                    }}
                                    activeOpacity={1.0}
                                    onPress={() => select(item.gid)}
                                >
                                    <Image style={{width: 109, height: 110}}
                                           source={item.goods_image_url ? {uri: item.goods_image_url} : require('../../assets/images/default_icon_124.png')}
                                           resizeMode={'contain'}
                                    />
                                    <Text style={{flex: 1, fontSize: 14, color: '#442E20', textAlign: 'center'}} numberOfLines={2}>{item.goods_name || ''}</Text>
                                    {/*商品选择按钮*/}
                                    {
                                        selectedIndex !== null && selectedIndex === index ?
                                            <Image
                                                style={{
                                                    position: 'absolute',
                                                    top: 9,
                                                    right: 9,
                                                    width: 25,
                                                    height: 25,
                                                }}
                                                source={require('../../assets/images/pushHand/check.png')}
                                                resizeMode={'contain'}
                                            /> : null
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

//VIP说明弹框
const VIPDetailAlert = (props) => {
    const { width } = Dimensions.get('window');
    const { onClick } = props;
    return (
        <View style={styles.popView}>
            <View style={{
                width: width*0.8,
                height: width*1.3,
                backgroundColor: '#1E1E1E',
                borderRadius: 5.0
            }}>
                <Text style={{marginHorizontal: 40, marginTop: 14, color: '#E6B28D', fontSize: 18, textAlign:'center'}} numberOfLines={1}>{I18n.t('share_join_Vip.text2')}</Text>
                <View style={[styles.line, {marginTop: 14}]}/>
                <ScrollView style={{flex: 1, paddingHorizontal: 10, paddingVertical: 10}}>
                    <Text style={{fontSize: 13, color: '#E6B28D'}}>{I18n.t('share_join_Vip.about')}</Text>
                </ScrollView>
                {/*退出按钮*/}
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => onClick()}
                >
                    <Image style={{width: 24, height: 24}} source={require('../../assets/images/pushHand/vip_back.png')} resizeMode={'contain'}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

//优惠券弹框
const CouponAlert = (props) => {
    const { width } = Dimensions.get('window');
    const { data, language, onClick } = props;
    return (
        <View style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255,255,255,0.3)'
        }}>
            <View style={styles.couponAlert}>
                {/*优惠券明细*/}
                <Text style={{marginTop: 16, fontSize: 18, color: '#E6B28D', textAlign: 'center'}}>{I18n.t('PinTuanOrder.text22')}</Text>
                <View style={[styles.line, {marginTop: 12}]}/>
                <TouchableOpacity
                    style={{position: 'absolute', top: 12, right:12, width: 25, height: 25, justifyContent: 'center', alignItems: 'center'}}
                    activeOpacity={1.0}
                    onPress={() => onClick()}
                >
                    <Image style={{width: 25, height: 25}} source={require('../../assets/images/pushHand/vip_back.png')} resizeMode={'contain'}/>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                    <ScrollView style={{flex: 1, paddingTop: 7, paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
                        {
                            data && data.map((item, index) => {
                                return (
                                    <ImageBackground
                                        key={index}
                                        style={{marginTop: 13, flex: 1, height: width*0.17}}
                                        source={require('../../assets/images/vip_coupon_bg.png')}
                                        resizeMode={'stretch'}
                                    >
                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                            <View style={{width: width*0.44, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{fontSize: 13, color: '#FCFAF8', textAlign: 'center'}}>
                                                    {I18n.t('GoodsDetailNew.discountcoupon')}
                                                </Text>
                                                {/*满减*/}
                                                <Text style={{marginTop: 6, fontSize: language !== LANGUAGE_CHINESE ? 12 : 15, color: '#FCFAF8', textAlign: 'center'}}>
                                                    {`${I18n.t('GoodsDetailNew.full')}${item.redinfo_full}${I18n.t('GoodsDetailNew.subtract')}${item.redinfo_money}`}
                                                </Text>
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{fontSize: 25, color: '#FCFAF8', textAlign: 'center', fontWeight: '500'}}>
                                                    {`X${item.red_rach_max}`}
                                                </Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

//绑定邀请码
const BindInviteCode = (props) => {
    const { width } = Dimensions.get('window');
    const { onClick } = props;
    return (
        <View style={styles.popView}>
            <View style={{
                width: width*0.76,
                height: width*0.85,
                backgroundColor: '#141217',
                borderRadius: 10.0,
                borderWidth: 0.5,
                borderColor: '#E6B28D'
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 32, height: width*0.168}}>
                    <Image style={{marginLeft: 30, width: width*0.36, height: '100%'}} source={require('../../assets/images/pushHand/vip_code.png')}/>
                    <View style={{marginLeft: 8, marginVertical: 0, height: '100%', backgroundColor: '#E6B28D'}}/>
                    <View style={{flex: 1, marginLeft: 10}}>
                        <View style={{flex: 1}}>
                            <Image style={{marginLeft: 30, width: 15, height: 16}} source={require('../../assets/images/pushHand/vip_left_arrow.png')} resizeMode={'contain'}/>
                        </View>
                        {/*我长这样*/}
                        <Text style={{flex: 1, fontSize: 14, color: '#E6B28D'}}>{I18n.t('PinTuanOrder.text29')}</Text>
                    </View>
                </View>
                <Text style={{alignSelf: 'center', marginTop: width*0.09, fontSize: 13, color: '#E6B28D'}}>{I18n.t('PinTuanOrder.text30')}</Text>
                <View style={{flex: 1}}/>
                <View style={{marginHorizontal: 0, height: 0.5, backgroundColor: '#E6B28D'}}/>
                <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center', height: width*0.128}}
                    activeOpacity={1.0}
                    onPress={() => onClick()}
                >
                    <Text style={{fontSize: 14, color: '#E6B28D', textAlign: 'center', fontWeight: '500'}}>{I18n.t('PinTuanOrder.text31')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896) ? 34 : 0,
        height: 48,
        backgroundColor: 'rgb(222,158,118)'
    },
    open: {
        width: pxToDp(260),
        height: pxToDp(105),
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1000
    },
    detail: {
        marginTop: 21,
        marginHorizontal: 10,
        borderRadius: 7.0,
        borderWidth: 0.5,
        borderColor: '#E6B28D'
    },
    line: {
        marginHorizontal: 0,
        height: 0.5,
        backgroundColor: '#E6B28D'
    },
    couponAlert: {
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height*0.2,
        marginHorizontal: Dimensions.get('window').width*0.12,
        height: Dimensions.get('window').width*1.04,
        backgroundColor: '#353436',
        borderRadius: 10.0,
        borderWidth: 0.5,
        borderColor: '#E6B28D'
    },
    popView: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    backBtn: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 15,
        right: 15,
        width: 24,
        height: 24
    }
});
