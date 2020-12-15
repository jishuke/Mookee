/*
* 修改密码页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
    Keyboard,
    DeviceEventEmitter
} from 'react-native';
import {I18n} from './../lang/index'
import NavigationBar from "../component/NavigationBar";
import PasswordInput from "../component/PasswordInput";
import { payPassword } from '../api/communityApi'
import ViewUtils from "../util/ViewUtils";
import StorageUtil from "../util/StorageUtil";

export default class ChangePayPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputText: '',
            psd: '',
        }
    }

    canClick = true

    componentWillUnmount() {
        Keyboard.dismiss()
    }

    leftButton() {
        return (
            <TouchableOpacity
                style={{flex: 1, marginLeft: 12, width: 40, justifyContent: 'center', alignItems: 'flex-start'}}
                activeOpacity={1.0}
                onPress={() => this.props.navigation.goBack()}
            >
                <Image style={{width: 28, height: 28}} source={require('../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    };

    _definePsd() {
        const { psd, inputText } = this.state
        if (inputText.length !== 6) {
            return
        }

        if (psd.length === 0) {
            let reg = /^[0-9]*$/
            if (!reg.test(inputText)) {
                ViewUtils.sldToastTip(I18n.t('ChangePayPassword.text2'));
                this.setState({
                    psd: '',
                    inputText: ''
                })
                return
            }

            this.setState({
                psd: inputText,
                inputText: ''
            })
            this.psdInput.showKeyboard()
        } else {
            if (psd === inputText) {
                if (!this.canClick) {
                    return
                }
                this.canClick = false

                payPassword({pay_password: parseInt(inputText)}).then(res => {
                    console.log('设置支付密码,', res)
                    this.canClick = true
                    if (res.code === 200 && res.datas.state === 'success') {
                        ViewUtils.sldToastTip(I18n.t('ChangePayPassword.text6'));
                        StorageUtil.set('is_pay_pwd_set', {is_pay_pwd_set: 1})
                        DeviceEventEmitter.emit('isPayPsd')
                        setTimeout(() => {
                            this.props.navigation.goBack()
                        }, 500)
                    } else {
                        ViewUtils.sldToastTip(res.datas.msg);
                    }
                }).catch(err => {
                    this.canClick = true
                    ViewUtils.sldToastTip(I18n.t('ChangePayPassword.text7'));
                })
            } else {
                this.setState({
                    psd: '',
                    psd_again: '',
                    inputText: ''
                })
                ViewUtils.sldToastTip(I18n.t('ChangePayPassword.text4'));
            }
        }
    }

    render() {
        const { width } = Dimensions.get('window')
        const { inputText, psd } = this.state
        return (
            <View style={styles.container}>
                {/*导航*/}
                <NavigationBar
                    ref={ref => this.nav = ref}
                    statusBar={{barStyle: "light-content"}}
                    leftButton={this.leftButton()}
                    title={I18n.t('ChangePayPassword.title2')}
                    title_color={'#333'}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <View style={{flex: 1}}>
                    <ScrollView
                        style={{flex: 1}}
                        showsVerticalScrollIndicator={false}
                        keyboardDismissMode={'on-drag'}
                    >
                        <Text style={{marginTop: 44, fontSize: 18, color: '#666666', fontWeight: '500', textAlign: 'center'}}>
                            {psd ? I18n.t('ChangePayPassword.text3') : I18n.t('ChangePayPassword.text1')}
                        </Text>
                        {/*密码输入框*/}
                        <PasswordInput
                            ref={ref => this.psdInput = ref}
                            style={{marginTop:69, marginHorizontal:20, height: width*0.13, borderColor: '#CCCBCE'}}
                            autoFocus={true}
                            value={inputText}
                            callBack={text => {
                                console.log('输入的密码11111111：', text)
                                this.setState({inputText: text})
                                if (text.length === 6) {
                                    Keyboard.dismiss()
                                }
                            }}
                        />
                        <Text style={{marginTop: 11, fontSize: 15, color: '#666666', textAlign: 'center'}}>{I18n.t('ChangePayPassword.text2')}</Text>
                        <TouchableOpacity
                            style={[styles.btn, {backgroundColor: inputText.length === 6 ? '#F70001' : '#CCCBCE'}]}
                            activeOpacity={1.0}
                            onPress={() => this._definePsd()}
                        >
                            <Text style={{
                                fontSize: 18,
                                color: inputText.length === 6 ? '#fff' : '#666666',
                                textAlign: 'center'
                            }}>
                                {I18n.t('ok')}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA'
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 19,
        marginHorizontal: 20,
        height: 48,
        borderRadius: 5.0
    }
})
