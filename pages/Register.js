/*
* 注册页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    DeviceEventEmitter,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ScrollView,
    Keyboard,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import StorageUtil from '../util/StorageUtil';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'

var Dimensions = require('Dimensions');
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const hide = require('../assets/images/login_pass_hide.png');
const show = require('../assets/images/login_pass_show.png');
import {I18n, LANGUAGE_CHINESE, LANGUAGE_ENGLISH, LANGUAGE_MIANWEN} from './../lang/index'
import PasswordInput from "../component/PasswordInput";
import { registerForThirdPart, bindAccount } from "../api/communityApi"

export default class Register extends Component {

    constructor(props) {
        super(props);
        const { params } = props.navigation.state
        this.state = {
            title: params && params.val ? I18n.t('Register.perfectInfo') : I18n.t('Register.title'),//页面标题
            username: '', //用户名
            phone: '',  // 手机号
            code: '',   // 图形验证码
            phoneCode: '',  // 手机验证码,
            password: '',   // 密码
            passwordImg: hide,
            refe_code: '',
            text: I18n.t('Register.code'),  //
            yzmSrc: AppSldUrl + "/index.php?app=randcode" + "&rand=" + Math.random(),   // 验证码图形
            argument: false,
            time_out: 60,
            showNoCodeAlert: false,
            language: 1
        }
    }

    canClick = true //防止重复点击
    canSendCode = true //防止频繁发送验证码

    componentDidMount() {
        this.setTimer = null
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
    }

    componentWillUnmount() {
        if (this.setTimer) {
            clearInterval(this.setTimer);
            this.setTimer = null
        }
    }

    // 获取手机验证码
    getCode = () => {
        if (!this.canSendCode) {
            return
        }
        this.canSendCode = false

        let {phone, time_out} = this.state;
        if (time_out !== 60) {
            this.canSendCode = true
            return
        }

        if (!phone) {
            this.canSendCode = true
            ViewUtils.sldToastTip('ForgetPwd.text1');
            return
        }

        RequestData.postSldData(AppSldUrl + '/index.php?app=login_mobile&mod=send_sms_mobile', {
            mobile: phone,
            type: 1,
            client: Platform.OS,
        }).then(res => {
            this.canSendCode = true
            // console.log('获取手机验证码:', res)
            if (res.datas.state == 'failuer') {
                ViewUtils.sldToastTip(res.datas.msg);
            } else {
                this.timer()
            }
        }).catch(err => {
            this.canSendCode = true
        })
    }

    // 倒计时
    timer() {
        if (this.setTimer) {
            return
        }

        let {time_out} = this.state
        this.setTimer = setInterval(() => {
            // console.log('倒计时时间：', time_out)
            if (time_out <= 0) {
                this.setState({
                    text: I18n.t('Register.text2'),
                    time_out: 60
                })
                clearInterval(this.setTimer)
                this.setTimer = null
            } else {
                time_out--
                this.setState({
                    text: `${time_out}` + I18n.t('ForgetPwd.second'),
                    time_out
                })
            }
        }, 1000)
    }

    //提交注册
    submit = () => {
        Keyboard.dismiss()
        const { params } = this.props.navigation.state
        let {phone, phoneCode, password, argument, username} = this.state;
        if (!argument) {
            ViewUtils.sldToastTip(I18n.t('Register.text3'));
            return;
        }
        if (!username || !phone || !phoneCode || !password) {
            ViewUtils.sldToastTip(I18n.t('Register.text4'));
            return;
        }

        //密码校验
        let reg_psd = /^[a-zA-Z0-9]{6,16}$/
        if (!reg_psd.test(password)) {
            ViewUtils.sldToastTip(I18n.t('Register.text15'));
            return
        }

        if (params && params.val) {
            //三方注册
            // this._submitTirdRegist(params.val)
        } else {
            //普通注册
            this._submitRegist()
        }
    };

    //三方注册(新账号)
    _submitTirdRegist(val) {
        if (!this.canClick) {
            return
        }
        this.canClick = false

        let {phone, phoneCode, password, username, refe_code} = this.state;
        const params = {
            username,
            phone_number: phone,
            password,
            openid: val.openid,
            unionid: val.unionid,
            facebook_id: val.facebook_id,
            sms_code: phoneCode,
            avator: val.iconurl,
            nickname: val.name,
            client: Platform.OS,
            push_code: refe_code || ''
        }
        registerForThirdPart(params).then(res => {
            // console.log('三方注册成功:', res)
            this.canClick = true
            if (res.state == '200') {
                key = res.data.key
                cur_user_info.username = res.data.username;
                cur_user_info.member_id = res.data.member_id;
                cur_user_info.member_avatar = res.data.member_avatar;

                if (res.data.red_money && res.data.red_money > 0) {
                    StorageUtil.set('red_money', res.data.red_money, () => {
                        DeviceEventEmitter.emit('refreshUserCenter');
                    });
                }
                if (res.data.red_img) {
                    StorageUtil.set('red_img', res.data.red_img, () => {
                        DeviceEventEmitter.emit('refreshUserCenter');
                    });
                }
                // console.log('三方注册---用户key:', key, '用户信息:', cur_user_info)
                StorageUtil.set('cur_user_info', JSON.stringify(cur_user_info));
                StorageUtil.set('key', key, () => {
                    DeviceEventEmitter.emit('refreshUserCenter');
                    this.props.navigation.popToTop();
                });
            } else {
                ViewUtils.sldToastTip(res.msg);
            }
        }).catch(err => {
            this.canClick = true
            // console.log('三方注册失败:', err)
            ViewUtils.sldToastTip(I18n.t('Register.text5'));
        })
    }

    //绑定三方账号
    _bindAccount() {
        Keyboard.dismiss()
        if (!this.canClick) {
            return
        }
        this.canClick = false

        let {phone, phoneCode, argument} = this.state;
        if (!argument) {
            this.canClick = true
            ViewUtils.sldToastTip(I18n.t('Register.text3'));
            return;
        }
        if(phone.length<11){
            this.canClick = true
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text2'));
            return;
        }

        if(phoneCode.length<6){
            this.canClick = true
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text7'));
            return;
        }

        const { val } = this.props.navigation.state.params

        // console.log("三方登陆信息222；" + JSON.stringify(val));

        bindAccount({
            phone_number: phone,
            sms_code: phoneCode,
            openid: val.uid,
            unionid: val.unionid || val.id,
            avator: val.iconurl,
            nickname: val.name,
            client: Platform.OS
        }).then(res => {
            this.canClick = true
            // console.log('绑定三方账号', res)
            if (res.state == '200') {
                key = res.data.key
                cur_user_info.username = res.data.username;
                cur_user_info.member_id = res.data.member_id;
                cur_user_info.member_avatar = res.data.member_avatar;

                if (res.data.red_money && res.data.red_money > 0) {
                    StorageUtil.set('red_money', res.data.red_money, () => {
                        DeviceEventEmitter.emit('refreshUserCenter');
                    });
                }
                if (res.data.red_img) {
                    StorageUtil.set('red_img', res.data.red_img, () => {
                        DeviceEventEmitter.emit('refreshUserCenter');
                    });
                }
                // console.log('三方注册---用户key:', key, '用户信息:', cur_user_info)
                StorageUtil.set('cur_user_info', JSON.stringify(cur_user_info));
                StorageUtil.set('key', key, () => {
                    DeviceEventEmitter.emit('refreshUserCenter');
                    this.props.navigation.popToTop();
                });
            } else {
                ViewUtils.sldToastTip(res.msg);
            }
        }).catch(err => {
            this.canClick = true
            ViewUtils.sldToastTip(I18n.t('Register.text5'));
        })
    }

    //普通注册
    _submitRegist() {
        Keyboard.dismiss()
        if (!this.canClick) {
            return
        }
        this.canClick = false

        let {phone, phoneCode, password, refe_code, username, argument} = this.state;

        if (!argument) {
            this.canClick = true
            ViewUtils.sldToastTip(I18n.t('Register.text3'));
            return;
        }

        RequestData.postSldData(AppSldUrl + '/index.php?app=login_mobile&mod=mobileregister', {
            username: username,
            mobile: phone,
            password: password,
            client: Platform.OS,
            vcode: phoneCode,
            refe_code: refe_code || ''
        }).then(res => {
            this.canClick = true
            console.log('注册:', res)
            if (res.datas.state == 'true') {
                if (!res.datas.key) {
                    ViewUtils.sldToastTip(res.datas.msg);
                    return false;
                } else {
                    key = res.datas.key;
                    cur_user_info.username = res.datas.username;
                    cur_user_info.member_id = res.datas.member_id;
                    cur_user_info.member_avatar = res.datas.member_avatar;

                    if (res.datas.red_money && res.datas.red_money > 0) {
                        StorageUtil.set('red_money', res.datas.red_money, () => {
                            DeviceEventEmitter.emit('refreshUserCenter');
                        });
                    }
                    if (res.datas.red_img) {
                        StorageUtil.set('red_img', res.datas.red_img, () => {
                            DeviceEventEmitter.emit('refreshUserCenter');
                        });
                    }
                    StorageUtil.set('cur_user_info', JSON.stringify(cur_user_info));
                    StorageUtil.set('key', key, () => {
                        if (this.props.navigation.state.params && this.props.navigation.state.params.tag && this.props.navigation.state.params.tag == 'cart') {
                            this.props.navigation.replace('CartScreen');
                        } else {
                            this.props.navigation.popToTop();
                        }
                    });
                }
            } else {
                this.canClick = true
                console.log('注册报错')
                ViewUtils.sldToastTip(res.datas.msg);
            }
        }).catch(err => {
            this.canClick = true
            ViewUtils.sldToastTip(I18n.t('Register.text5'));
        })
    }

    //没有邀请码
    _noInviteCode = () => {
        Keyboard.dismiss()
        const { showNoCodeAlert } = this.state
        !showNoCodeAlert && this.setState({
            showNoCodeAlert: true
        })
    };

    render() {
        const { params } = this.props.navigation.state
        const {title, argument, refe_code, showNoCodeAlert, language, password} = this.state;
        // console.log("refe_code" + refe_code);
        console.log("三方登陆信息；" + JSON.stringify(params));
        return (
            <View style={[GlobalStyles.sld_container, {backgroundColor: '#fff'}]}>
                <ScrollView
                    style={{flex: 1}}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode={'on-drag'}
                >
                    <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                               left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>

                    <View style={GlobalStyles.line}/>

                    <View style={styles.form}>
                        {
                            !(params && params.val) ?
                                <Text style={styles.form_item}>
                                    {I18n.t('Register.mook')}
                                </Text> : null
                        }
                        {
                            params && params.bindPhone ? null
                                :
                                //用户名
                                <View style={styles.form_item}>
                                    <Text style={styles.item_left}>{I18n.t('Register.username')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        underlineColorAndroid={'transparent'}
                                        placeholder={I18n.t('Register.username')}
                                        placeholderTextColor={'#999'}
                                        maxLength={20}
                                        onChangeText={text => {
                                            this.setState({
                                                username: text
                                            })
                                        }}
                                    />
                                </View>
                        }
                        {/*手机号*/}
                        <View style={styles.form_item}>
                            <View style={styles.phoneView}>
                                <Image
                                    source={require('../assets/images/phoneIcon.png')}
                                    style={styles.phoneIcon}
                                />
                                <Text>+95</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid={'transparent'}
                                placeholder={I18n.t('Register.phonenumber')}
                                placeholderTextColor={'#999'}
                                keyboardType="numeric"
                                maxLength={11}
                                onChangeText={text => {
                                    this.setState({
                                        phone: text
                                    })
                                }}
                            />
                        </View>
                        {/*手机验证码*/}
                        <View style={styles.form_item}>
                            <Text style={styles.item_left}>{I18n.t('Register.text10')}</Text>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid={'transparent'}
                                placeholder={I18n.t('Register.text6')}
                                placeholderTextColor={'#999'}
                                keyboardType="numeric"
                                maxLength={6}
                                onChangeText={text => {
                                    this.setState({
                                        phoneCode: text
                                    })
                                }}
                            />
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{width: pxToDp(180)}}
                                onPress={() => this.getCode()}
                            >
                                <Text style={{textAlign: 'right', color: '#119AE8'}}>{this.state.text}</Text>
                            </TouchableOpacity>
                        </View>
                        {/*设置登录密码*/}
                        {
                            params && params.bindPhone ? null
                                :
                                <View style={styles.form_item}>
                                    <Text style={styles.item_left}>{I18n.t('Register.text7')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={I18n.t('Register.text7')}
                                        placeholderTextColor={'#999'}
                                        maxLength={16}
                                        underlineColorAndroid={'transparent'}
                                        secureTextEntry={true}
                                        value={password}
                                        onChangeText={text => {
                                            this.setState({password: text})
                                        }}
                                    />
                                </View>
                        }
                        {/*推荐码*/}
                        {
                            params && params.bindPhone ? null
                                :
                                <View style={styles.form_item}>
                                    <Text style={styles.item_left}>{I18n.t('Register.text12')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        underlineColorAndroid={'transparent'}
                                        placeholder={I18n.t('Register.text12')}
                                        placeholderTextColor={'#999'}
                                        keyboardType="numeric"
                                        maxLength={6}
                                        value={refe_code}
                                        onChangeText={text => {
                                            let reg = /^[0-9]*$/
                                            if (reg.test(text)) {
                                                this.setState({
                                                    refe_code: text
                                                })
                                            }
                                        }}
                                    />
                                </View>
                        }
                        {
                            params && params.bindPhone ? null
                                :
                                <View style={styles.form_item2}>
                                    <View></View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => this._noInviteCode()}
                                    >
                                        <Text>{I18n.t('Register.text13')}</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                        {/*注册*/}
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.submit}
                            onPress={() => {
                                if (params && params.bindPhone) {
                                    this._bindAccount()
                                } else {
                                    this.submit()
                                }
                            }}
                        >
                            <Text style={{color: '#fff', fontSize: pxToDp(26)}}>{params && params.bindPhone ? 'OK' : I18n.t('Register.login')}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*用户注册协议*/}
                    <View
                        style={{
                            marginTop: 30,
                            width: width,
                            height: pxToDp(120),
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 30,
                                height: 30
                            }}
                            activeOpacity={1}
                            onPress={() => {
                                this.setState({
                                    argument: !argument
                                })
                            }}
                        >
                            <Image
                                style={{width: pxToDp(35), height: pxToDp(35)}}
                                source={argument == true ? require('../assets/images/selted_cart.png') : require('../assets/images/paynosele.png')}
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>
                        <Text style={{color: '#666', fontSize: language === LANGUAGE_MIANWEN ? 8 : 10, marginLeft: 5}}>{I18n.t('Register.consent')}</Text>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                this.props.navigation.navigate('SldRegisterProtocol');
                            }}
                        >
                            <Text style={{color: '#FF466B', fontSize: language === LANGUAGE_MIANWEN ? 8 : 10}}>{I18n.t('Register.agreement')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {/*点击没有邀请码弹框*/}
                {
                    showNoCodeAlert ? <BindInviteCode onClick={() => this.setState({showNoCodeAlert: false})}/> : null
                }
            </View>
        )
    }
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
                    <Image style={{marginLeft: 30, width: width*0.36, height: '100%'}} source={require('../assets/images/pushHand/vip_code.png')}/>
                    <View style={{marginLeft: 8, marginVertical: 0, height: '100%', backgroundColor: '#E6B28D'}}/>
                    <View style={{flex: 1, marginLeft: 10}}>
                        <View style={{flex: 1}}>
                            <Image style={{marginLeft: 30, width: 15, height: 16}} source={require('../assets/images/pushHand/vip_left_arrow.png')} resizeMode={'contain'}/>
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
    form: {
        paddingHorizontal: pxToDp(30),
        backgroundColor: '#fff',
        paddingTop: pxToDp(50)
    },
    form_item: {
        height: pxToDp(90),
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    form_item2: {
        height: pxToDp(90),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    phoneView: {
        flexDirection: 'row',
        width: pxToDp(200),
        height: pxToDp(90),
        alignItems: 'center',
    },
    phoneIcon: {
        width: pxToDp(40),
        height: pxToDp(40),
        marginRight: pxToDp(12)
    },
    input: {
        flex: 1,
    },
    submit: {
        marginHorizontal: pxToDp(30),
        height: pxToDp(90),
        backgroundColor: '#F74949',
        borderRadius: pxToDp(45),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(60)
    },
    item_left: {
        width: pxToDp(200),
        color: '#666',
    },
    textInputView: {
        height: pxToDp(60),
        width: pxToDp(60),
        borderWidth: 1,
        borderColor: '#c9c7c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    pwdInput: {
        width: 0,
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
    }
})
