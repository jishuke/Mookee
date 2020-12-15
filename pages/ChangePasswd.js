/*
* 修改密码页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Platform,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'

const hide = require('../assets/images/login_pass_hide.png');
const show = require('../assets/images/login_pass_show.png');
import {I18n} from './../lang/index'
import StorageUtil from "../util/StorageUtil";

export default class ChangePasswd extends Component {

    constructor(props) {
        super(props);
        const { params } = props.navigation.state
        this.state = {
            title: params && params.type === 2 ? I18n.t('ChangePasswd.title') : I18n.t('PaymentType.text6'),
            oldPassword: '',
            newPassword: '',
            psdAgain: '', //确认密码
            imgSrcNew: hide,
            imgSrcOld: hide,
            sendCodeText: I18n.t('Register.code'),
            phone: '',
            phoneCode: '',  // 手机验证码,
            time_out: 60,
        }
    }

    canSendCode = true //防止频繁发送验证码

    componentDidMount() {
        this.setTimer = null
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
        const { params } = this.props.navigation.state
        // console.log('倒计时时间：', time_out)
        if (time_out !== 60) {
            this.canSendCode = true
            return
        }
        if (!phone) {
            this.canSendCode = true
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text1'));
            return;
        }

        RequestData.postSldData(AppSldUrl + '/index.php?app=login_mobile&mod=send_sms_mobile', {
            mobile: phone,
            type: params && params.type === 2 ? 5 : 6,
            client: Platform.OS,
        }).then(res => {
            this.canSendCode = true
            if (res.datas.state == 'failuer') {
                ViewUtils.sldToastTip(res.datas.msg);
            } else {
                this.timer();
            }
        }).catch(err => {
            this.canSendCode = true
        })
    };

    // 倒计时
    timer() {
        if (this.setTimer) {
            return
        }

        let {time_out} = this.state
        this.setTimer = setInterval(() => {
            // console.log('倒计时时间111：', time_out)
            if (time_out <= 0) {
                this.setState({
                    sendCodeText: I18n.t('Register.text2'),
                    time_out: 60
                })
                clearInterval(this.setTimer)
                this.setTimer = null
            } else {
                time_out--
                this.setState({
                    sendCodeText: `${time_out}` + I18n.t('ForgetPwd.second'),
                    time_out
                })
            }
        }, 1000)
    }

    //设置密码
    setPsdsubmit = () => {
        let {newPassword, phone, phoneCode, psdAgain} = this.state;
        if(!newPassword || !psdAgain){
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text4'));
            return;
        }
        if (newPassword !== psdAgain) {
            ViewUtils.sldToastTip(I18n.t('ChangePayPassword.text4'));
            return;
        }
        if (!phone) {
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text1'));
            return;
        }
        if (!phoneCode) {
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text7'));
            return;
        }
        RequestData.postSldData(AppSldUrl + '/index.php?app=usercenter&mod=modifyLoginPassword', {
            password: newPassword,
            phone_number: phone,
            sms_code: phoneCode
        }).then(res=>{
            ViewUtils.sldToastTip(res.datas.data);
            if(res.datas.state != 'failuer'){
                this.loginOut()
            }
        }).catch(error=>{
            ViewUtils.sldErrorToastTip(error);
        })
    }

    //修改密码
    changePsdsubmit = () => {
        let {oldPassword, newPassword, phone, phoneCode} = this.state;
        if(!oldPassword || !newPassword){
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text4'));
            return;
        }
        if (!phone) {
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text1'));
            return;
        }
        if (!phoneCode) {
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text1'));
            return;
        }
        RequestData.postSldData(AppSldUrl + '/index.php?app=usercenter&mod=editPassword', {
            opassword: oldPassword,
            npassword: newPassword,
            mobile: phone,
            vcode: phoneCode,
            key
        }).then(res => {
            ViewUtils.sldToastTip(res.datas.data);
            if(res.datas.state == 'success'){
                this.loginOut()
            }
        }).catch(error=>{
            ViewUtils.sldErrorToastTip(error);
        })
    }

    //设置/修改密码成功后退出登录
    loginOut() {
        const { params } = this.props.navigation.state
        let urlParams = {
            username: params.username,
            key,
            client : Platform.OS,
            registerId: '' //极光推送设备id(暂时没用)
        };
        let url = AppSldUrl+'/index.php?app=logout&mod=index';
        for(let i in urlParams){
            url+=`&${i}=${urlParams[i]}`;
        }

        RequestData.getSldData(url).then(res => {
            if(res){
                //清除用户缓存
                key = '';
                storage.remove({
                    key: 'key'
                });
                storage.remove({
                    key: 'sldlogininfo'
                });
                // 清空入驻信息
                StorageUtil.delete('apply_info');
                StorageUtil.delete('company_reg2');
                StorageUtil.delete('company_reg3');
                StorageUtil.delete('company_reg4');
                StorageUtil.delete('memberInfo');
                StorageUtil.delete('is_pay_pwd_set');
                StorageUtil.delete('memberId');
                // ViewUtils.sldToastTip(I18n.t('LdjSetting.text3'));
                setTimeout(() => {
                    this.props.navigation.replace('Tab');
                }, 800)
            }
        })
    }

    render() {
        const {title, imgSrcNew, imgSrcOld, sendCodeText} = this.state;
        const { params } = this.props.navigation.state
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>
                <View style={styles.form}>
                    {/*旧密码*/}
                    {
                        params && params.type === 2 ?
                            <View style={styles.form_item}>
                                <Image source={require('../assets/images/login_pass.png')}
                                       style={{width: pxToDp(32), height: pxToDp(32)}}/>
                                <TextInput
                                    style={styles.input}
                                    placeholder={I18n.t('ChangePasswd.text2')}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={imgSrcOld == hide}
                                    onChangeText={text => {
                                        this.setState({
                                            oldPassword: text
                                        })
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        if (imgSrcOld == hide) {
                                            this.setState({
                                                imgSrcOld: show
                                            })
                                        } else {
                                            this.setState({
                                                imgSrcOld: hide
                                            })
                                        }
                                    }}
                                >
                                    <Image resizeMode={'contain'} style={{width: pxToDp(46), height: pxToDp(30)}}
                                           source={imgSrcOld}/>
                                </TouchableOpacity>
                            </View> : null
                    }
                    {/*新密码/输入密码*/}
                    <View style={styles.form_item}>
                        <Image source={require('../assets/images/login_pass.png')}
                               style={{width: pxToDp(32), height: pxToDp(32)}}/>
                        <TextInput
                            style={styles.input}
                            placeholder={params && params.type === 1 ? I18n.t('PaymentType.text1') : I18n.t('ChangePasswd.text3')}
                            underlineColorAndroid={'transparent'}
                            secureTextEntry={imgSrcNew == hide}
                            onChangeText={text => {
                                this.setState({
                                    newPassword: text
                                })
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                if (imgSrcNew == hide) {
                                    this.setState({
                                        imgSrcNew: show
                                    })
                                } else {
                                    this.setState({
                                        imgSrcNew: hide
                                    })
                                }
                            }}
                        >
                            <Image resizeMode={'contain'} style={{width: pxToDp(46), height: pxToDp(30)}}
                                   source={imgSrcNew}/>
                        </TouchableOpacity>
                    </View>
                    {/*确认密码*/}
                    {
                        params && params.type === 1 ?
                            <View style={styles.form_item}>
                                <Image source={require('../assets/images/login_pass.png')}
                                       style={{width: pxToDp(32), height: pxToDp(32)}}/>
                                <TextInput
                                    style={styles.input}
                                    placeholder={I18n.t('PaymentType.text7')}
                                    underlineColorAndroid={'transparent'}
                                    secureTextEntry={imgSrcNew == hide}
                                    onChangeText={text => {
                                        this.setState({
                                            psdAgain: text
                                        })
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        if (imgSrcNew == hide) {
                                            this.setState({
                                                imgSrcNew: show
                                            })
                                        } else {
                                            this.setState({
                                                imgSrcNew: hide
                                            })
                                        }
                                    }}
                                >
                                    <Image resizeMode={'contain'} style={{width: pxToDp(46), height: pxToDp(30)}}
                                           source={imgSrcNew}/>
                                </TouchableOpacity>
                            </View> : null
                    }
                    {/*手机号*/}
                    <View style={styles.form_item}>
                        <View style={styles.phoneView}>
                            <Image
                              source={require('../assets/images/phoneIcon.png')}
                              style={styles.phoneIcon}
                            />
                            <Text style={{marginTop:pxToDp(28)}}>+95</Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          underlineColorAndroid={'transparent'}
                          placeholder={I18n.t('Register.phonenumber')}
                          keyboardType={'numeric'}
                          maxLength={11}
                          onChangeText={text => {
                              this.setState({
                                  phone: text
                              })
                          }}
                        />
                    </View>
                    {/*验证码*/}
                    <View style={styles.form_item}>
                        <TextInput
                          style={{flex:1}}
                          underlineColorAndroid={'transparent'}
                          placeholder={I18n.t('Register.text6')}
                          maxLength={6}
                          keyboardType={'numeric'}
                          onChangeText={text => {
                              this.setState({
                                  phoneCode: text
                              })
                          }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                          style={{width: pxToDp(180)}}
                          onPress={() => {
                              this.getCode()
                          }}
                        >
                            <Text style={{textAlign: 'right', color: '#119AE8'}}>{sendCodeText}</Text>
                        </TouchableOpacity>
                    </View>
                    {/*ok*/}
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            if (params && params.type === 1) {
                                this.setPsdsubmit()
                            } else {
                                this.changePsdsubmit()
                            }
                        }}
                    >
                        <Text style={{color: '#fff', fontSize: pxToDp(28)}}>{I18n.t('ok')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    form: {
        paddingHorizontal: pxToDp(30),
        backgroundColor: '#fff',
    },
    form_item: {
        height: pxToDp(100),
        flexDirection: 'row',
        alignItems: 'center',
        // paddingBottom: pxToDp(10),
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#E9E9E9',
        borderStyle: 'solid',
    },
    btn: {
        height: pxToDp(90),
        backgroundColor: '#F70001',
        borderRadius: pxToDp(10),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(60),
    },
    input: {
        flex: 1,
        paddingLeft: pxToDp(20)
    },
    phoneView: {
        flexDirection: 'row',
        width: pxToDp(120),
        height: pxToDp(90),
    },
    phoneIcon: {
        width: pxToDp(40),
        height: pxToDp(26),
        marginTop: pxToDp(28),
        marginRight:pxToDp(12)

    },
})
