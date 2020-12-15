
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
    Dimensions,
    Alert, TextInput, NativeEventEmitter,
} from "react-native";
import fun from '../../assets/styles/FunctionStyle';
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import ViewUtils from '../../util/ViewUtils';
import {
    createPushHandOrder,
    getPushHandPrice,
    payPushHandOrder,
    getBalanceOfTheUser,
    kbzPay,

} from '../../api/pushHandApi';
import KBZPayModule from '../../util/KBZPayModule'
import {I18n} from './../../lang/index'
const KBZPayModuleEmitter = new NativeEventEmitter(KBZPayModule);

const Item = (props) => {
    return (
        <View style={[styles.info_item, fun.f_row_center]}>
            <Image style={[fun.f_icon84, styles.info_item_icon]} resizeMode="contain" source={props.icon} />
            <View>
                <Text style={[fun.f_fs30, fun.f_c_24]}>{props.title}</Text>
                <Text style={[fun.f_fs24, fun.f_c_90, {marginTop: pxToDp(10)}]}>{props.desc}</Text>
            </View>
        </View>
    );
}
export default class Settlement extends Component{
    constructor(props) {
        super(props);
        this.state= {
            payType: 1,  // 1, 2
            price: 0,
            inviteCode: '',
            userBalance: 0,
            isFrom: props.navigation.state.params.isFrom,//1来自用户中心，2来自商品详情
        };
        this.inviteCodeChane = this.inviteCodeChane.bind(this)
        this.kbzPay = this.kbzPay.bind(this)
    }
    componentDidMount() {
        this.getPrice();
        this.getUserBalance();
        this.listener = KBZPayModuleEmitter.addListener(
          'kbzPayCallback',
          (data) => {
              console.warn('ww:kbzPayCallback', data);
              if (data.code == '0'){
                  ViewUtils.sldToastTip(I18n.t('hud.payS'));
                  if (this.state.isFrom === 1){
                      this.props.navigation.navigate('PaySuccess', {viewType:2});
                  } else if (this.state.isFrom === 2){
                      setTimeout(()=>{
                          this.props.navigation.pop(2);
                      }, 800);
                  }

              } else {
                  ViewUtils.sldToastTip(I18n.t('hud.payF'));
              }
          }
        );
    }

    componentWillUnmount(){
        this.listener && this.listener.remove(); //记得remove哦
        this.listener = null;
    };

    kbzPay(data) {
        KBZPayModule.startPay(data.order_str, data.sign_type, data.order_sign, 'Mookee');
    }


    submit() {
        if(key){
            if (this.state.inviteCode === "") {
                ViewUtils.sldToastTip(I18n.t('FlashSaleScreen.text28'));
                return;
            }
            if(this.state.payType === 1){
                const {userBalance,price} = this.state
                if(Number(userBalance) >= Number(price)){
                    this.createOrder();
                } else {
                    ViewUtils.sldToastTip(I18n.t('LdjPay.notsufficientfunds'));
                }
            } else {
                this.createOrder();
            }


        }else {
            //没有找到的情况下应该跳转到登录页
            this.props.navigation.navigate('Login');
        }

    }
    getPrice () {
        getPushHandPrice({
            key:key
        }).then(res => {
            console.log(res)
            const pushHand = res.datas.money
                this.setState({
                    price:pushHand
                })

            })
    }
    getUserBalance () {
        getBalanceOfTheUser({
            key:key
        }).then(res => {
            console.log(res)
            this.setState({
                userBalance:res.datas.predepoit
            })

        })
    }
    getKbzData (info) {
        kbzPay({
            key:key,
            pay_sn:info.pdr_sn,
            payment_code:'kbz',
            type:'app'
        }).then(res =>{
            console.log(res,'res')
            if(res.code === 200){
                let result = res.datas.result
                console.log(result,'result')
                this.kbzPay(result.Response)
            }
        })
    }

    createOrder() {
        createPushHandOrder({
            member_id: cur_user_info.member_id,
            // pdr_amount: '100',
            refe_code: this.state.inviteCode ? this.state.inviteCode : '8888',
            key: key
        }).then(res => {
            console.log('--c--order-----', res)
            if(res.code === 200){
                if(this.state.payType === 1){
                    this.payOrder(res.datas)
                } else {
                    this.getKbzData(res.datas)
                }
            } else {
                ViewUtils.sldToastTip(res.datas.error)
            }


        })
    }

    payOrder (info) {
        payPushHandOrder({
            pay_sn: info.pdr_sn,
            order_id: info.pdr_id,
            password: '',
            pay_type:'yue',
            key : key
        }).then(
            res =>{
                console.log(res)
                if(res.state === 200){
                    Alert.alert(I18n.t('hint'),
                    I18n.t('FlashSaleScreen.text23'),
                        [{text:I18n.t('ok'),onPress:()=>{this.props.navigation.navigate('MyScreen')}, style:''}])
                } else {
                    ViewUtils.sldToastTip(res.datas.error)
                }

            }
        )
    }
    leftButton() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image style={{ width: pxToDp(36), height: pxToDp(36), marginLeft: pxToDp(40) }} source={require('../../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    }
    inviteCodeChane (val) {
        console.log(val)
        this.setState({
            inviteCode:val
        })
    }
    render() {
        const {price, inviteCode} = this.state
        return (
            <View style={[fun.f_flex1, {backgroundColor: '#f7f7f7'}]}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
                    title={I18n.t('FlashSaleScreen.text22')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <ScrollView>
                    <View >
                        <View style={[fun.f_bg_white, styles.pay_type]}>
                            {/*<View style={[styles.pay_hd, fun.f_row_center]}>*/}
                            {/*    <Text style={[fun.f_c_24, fun.f_fs32]}>{I18n.t('FlashSaleScreen.text21')}</Text>*/}
                            {/*</View>*/}
                            <View style={[fun.f_flex, fun.f_row, fun.f_row_center, styles.pay_item]}>
                                <Image style={[fun.f_icon50, fun.f_shrink0, styles.pay_icon]} resizeMode="contain" source={require('../../assets/images/pushHand/ptb.png')} />
                                <View style={[fun.f_between, fun.f_row_center, fun.f_flex1, styles.pay_item_right, {borderBottomColor: '#eee', borderBottomWidth: 1}]}>
                                    <View>
                                        <Text style={[fun.f_c_24, fun.f_fs30]}>{I18n.t('FlashSaleScreen.text20')}</Text>
                                        {/*<Text style={[fun.f_c_66, fun.f_fs24]}>{I18n.t('FlashSaleScreen.text19')}</Text>*/}
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            payType: 1
                                        });
                                    }}>
                                        <Image style={[fun.f_icon32, {marginRight: pxToDp(40)}]} resizeMode="contain" source={this.state.payType == 1 ? require('../../assets/images/communityPage/check_red.png'): require('../../assets/images/communityPage/check_gray.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[fun.f_flex, fun.f_row, fun.f_row_center, styles.pay_item]}>
                                <Image style={[fun.f_icon50, fun.f_shrink0, styles.pay_icon]} resizeMode="cover" source={require('../../assets/images/pushHand/KBZ_pay.png')} />
                                <View style={[fun.f_between, fun.f_row_center, fun.f_flex1, styles.pay_item_right]}>
                                    <View>
                                        <Text style={[fun.f_c_24, fun.f_fs30]}>{I18n.t('FlashSaleScreen.text18')}</Text>
                                        {/*<Text style={[fun.f_c_66, fun.f_fs24]}>{I18n.t('FlashSaleScreen.text17')}</Text>*/}
                                    </View>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                            payType: 2
                                        });
                                    }}>
                                        <Image style={[fun.f_icon32, {marginRight: pxToDp(40)}]} resizeMode="contain" source={this.state.payType == 2 ? require('../../assets/images/communityPage/check_red.png'): require('../../assets/images/communityPage/check_gray.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.invite_code, fun.f_bg_white]}>
                            <Text style={styles.invite_code_text}>{I18n.t('FlashSaleScreen.text16')}</Text>
                            <TextInput
                                ref
                                style={[fun.f_c_66, fun.f_fs26, styles.invite_code_input]}
                                onChangeText={this.inviteCodeChane}
                                value={inviteCode}
                                underlineColorAndroid={'#f5f5f5'}
                            >
                            </TextInput>
                        </View>

                        <View style={styles.title}>
                            <Text style={[fun.f_fs34, fun.f_c_24, {textAlign: 'center'}]}>{I18n.t('FlashSaleScreen.text15')}</Text>
                        </View>

                        <View style={styles.info_box}>
                            <Item icon={require('../../assets/images/pushHand/zgsq.png')} title={I18n.t('FlashSaleScreen.text14')}desc={I18n.t('FlashSaleScreen.text27')} />
                            <Item icon={require('../../assets/images/pushHand/cyhhr.png')} title={I18n.t('FlashSaleScreen.text13')} desc={I18n.t('FlashSaleScreen.text26')} />
                            <Item icon={require('../../assets/images/pushHand/i-3.png')} title={I18n.t('FlashSaleScreen.text12')} desc={I18n.t('FlashSaleScreen.text25')} />
                            <Item icon={require('../../assets/images/pushHand/i-4.png')} title={I18n.t('FlashSaleScreen.text11')} desc={I18n.t('FlashSaleScreen.text24')} />
                        </View>

                    </View>
                </ScrollView>
                <View style={[styles.ft, fun.f_flex, fun.f_row]}>
                    <View style={[styles.ft_left, fun.f_flex, fun.f_row, fun.f_flex1, {alignItems: 'center'}]}>
                        <Text style={[fun.f_c_red, fun.f_fs24]}>{I18n.t('FlashSaleScreen.text10')}：{'Ks' + price}</Text>
                    </View>
                    <TouchableOpacity onPress= {() => {
                        this.submit()
                    }} style={[styles.ft_right, fun.f_bg_red, fun.f_shrink0, fun.f_center]}>
                        <Text style={[fun.f_c_white, fun.f_fs28]}>{I18n.t('FlashSaleScreen.text9')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    pay_type: {
        paddingLeft: pxToDp(40),
        marginTop: pxToDp(20),
        borderRadius: pxToDp(10)
    },
    pay_hd: {
        height: pxToDp(85),
        paddingLeft: pxToDp(20),
    },
    pay_item: {
        height: pxToDp(120)
    },
    pay_item_right: {
        height: pxToDp(120)
    },
    pay_icon: {
        marginRight: pxToDp(40)
    },

    invite_code: {
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        height: pxToDp(120),
        marginTop: pxToDp(20),
        borderRadius: pxToDp(10),
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    invite_code_text: {
        // flexShrink: 2,
        color: '#242424',
        fontSize: pxToDp(30)
    },
    invite_code_input:{
        width: Dimensions.get('window').width - pxToDp(90),
        borderBottomColor: '#eee',
        borderBottomWidth: pxToDp(1),
        marginLeft: pxToDp(20),
    },

    title: {
        paddingTop: pxToDp(50),
        paddingBottom: pxToDp(50)
    },

    info_box: {
        backgroundColor: '#fff',
        borderRadius: pxToDp(10)
    },
    info_item: {
        paddingTop: pxToDp(24),
        paddingBottom: pxToDp(24)
    },
    info_item_icon: {
        marginLeft: pxToDp(40),
        marginRight: pxToDp(40)
    },

    ft: {
        height: pxToDp(100),
        backgroundColor: '#fff'
    },
    ft_left: {
        backgroundColor: '#fff',
        justifyContent: 'flex-end',
        paddingTop: pxToDp(10),
        paddingRight: pxToDp(40),
    },
    ft_right: {
        width: pxToDp(220)
    }
});
