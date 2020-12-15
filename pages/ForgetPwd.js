/*
* 忘记密码页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View  , Text , TextInput , Image , TouchableOpacity , StyleSheet , Platform
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'

var Dimensions = require('Dimensions');
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {I18n} from './../lang/index'

const time = 60;

export default class ForgetPwd extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('ForgetPwd.forgetthepassword'),
            phone: '',  // 手机号
            code: '',   // 图形验证码
            phoneCode: '',  // 手机验证码,
            password: '',   // 密码
            text: I18n.t('ForgetPwd.code'),  //
            yzmSrc: AppSldUrl + "/index.php?app=randcode" + "&rand=" + Math.random(),   // 验证码图形
            time_out: time
        }
    }

    canSendCode = true //防止频繁发送验证码

    componentDidMount() {
    }

    componentWillUnmount() {
        if (this.setTimer) {
            clearInterval(this.setTimer);
        }
    }

    getRandomImg() {
        this.setState({
            yzmSrc: AppSldUrl + "/index.php?app=randcode" + "&rand=" + Math.random()
        })
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
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text1'));
            return;
        }
        if (phone.length !== 11) {
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text2'));
            return;
        }
        RequestData.postSldData(AppSldUrl + '/index.php?app=login_mobile&mod=send_sms_mobile', {
            mobile: phone,
            type: 3,
	        client: Platform.OS,
        }).then(res => {
            this.canSendCode = true
            let statua = res.datas.state;
            if (statua == 'failuer') {
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
                    text: I18n.t('ForgetPwd.text3'),
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

    // 提交
    submit = () => {
        let {phone, code, phoneCode, password} = this.state;
        let {navigate} = this.props.navigation
        if (!phone || !phoneCode || !password) {
            ViewUtils.sldToastTip(I18n.t('ForgetPwd.text4'));
            return;
        }
        RequestData.postSldData(AppSldUrl+'/index.php?app=login_mobile&mod=cwapforgetPassword',{
            code: phoneCode,
            mobile: phone
        }).then(res=>{
            if(res==1){
                RequestData.postSldData(AppSldUrl+'/index.php?app=login_mobile&mod=editpass',{
                    password: password,
                    mobile: phone,
                    code: phoneCode
                }).then(res=>{
                    if(res.datas.state == 'failuer'){
                        ViewUtils.sldToastTip(res.datas.msg);
                    }else{
                        key = '';
                        storage.remove({
                            key: 'key'
                        });
                        storage.remove({
                            key: 'sldlogininfo'
                        });
                        ViewUtils.sldToastTip(I18n.t('ForgetPwd.text5'));
                        setTimeout(()=>{
                            navigate('Login')
                        },1000)
                    }
                })
            }else{
	            ViewUtils.sldToastTip(res.datas.msg);
            }
        })
    }

    handleMessage = (datajson) => {
        ViewUtils.goDetailPageNew(this.props.navigation, datajson);
    }


    render() {
        const {title, yzmSrc, passwordImg} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>

                <View style={GlobalStyles.line}/>

                <View style={styles.form}>
                    <View style={styles.form_item}>
                        <TextInput
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            placeholder={I18n.t('ForgetPwd.text6')}
                            maxLength={11}
                            onChangeText={text => {
                                this.setState({
                                    phone: text
                                })
                            }}
                        />
                    </View>

                    <View style={styles.form_item}>
                        <TextInput
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            placeholder={I18n.t('ForgetPwd.text7')}
                            onChangeText={text => {
                                this.setState({
                                    phoneCode: text
                                })
                            }}
                        />
                        <TouchableOpacity
                            style={{width: pxToDp(180)}}
                            onPress={() => this.getCode()}
                        >
                            <Text style={{textAlign: 'right', color: '#119AE8'}}>{this.state.text}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form_item}>
                        <TextInput
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            placeholder={I18n.t('ForgetPwd.text8')}
                            secureTextEntry={true}
                            onChangeText={text => {
                                this.setState({
                                    password: text
                                })
                            }}
                        />
                        <Image resizeMode={'contain'} style={{width: pxToDp(46), height: pxToDp(30)}}
                               source={require('../assets/images/login_pass_hide.png')}/>
                    </View>

                    <TouchableOpacity
                        style={styles.submit}
                        onPress={() => this.submit()}
                    >
                        <Text style={{color: '#fff', fontSize: pxToDp(26)}}>{I18n.t('ok')}</Text>
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
	    paddingTop:pxToDp(100)
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
    }
})
