import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Clipboard,
    Linking
} from 'react-native';
import GlobalStyles from "../assets/styles/GlobalStyles";
import SldHeader from "../component/SldHeader";
import ViewUtils from "../util/ViewUtils";
import pxToDp from "../util/pxToDp";
import LinearGradient from "react-native-linear-gradient";
import {I18n} from "../lang";

const phone_one = '09894635599';
const phone_two = '09894635588';
const wechat = 'MOOKEE APP';
const facebook = 'MOOKEE';

export default class ChatScteen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.navigation.state.params.store_info.store_name,
            store_info: props.navigation.state.params.store_info,
        }
    }

    _callPhone(phoneNumber) {
        const url = "tel:" + phoneNumber
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }

    _copyTextToClipboard(text) {
        Clipboard.setString(text);
        ViewUtils.sldToastTip(I18n.t('Service.copied'));
    }

    render() {
        const {title, store_info} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() => {
                    this.props.navigation.pop(1)
                }} right_type={'icon'} right_icon={require('../assets/images/sld_chat_go_shop.png')}
                           right_event={() => ViewUtils.goDetailPageNew(this.props.navigation, {
                               type: 'Vendor',
                               value: store_info.vid
                           })} right_style={{width: pxToDp(40), height: pxToDp(40)}}/>
                <View style={GlobalStyles.line}/>

                <View style={styles.container}>
                    <Image source={require('../assets/images/logo_launcher.png')} style={styles.logo_img}/>
                    <View style={styles.service_info}>
                        <Text style={{flex: 1}}>{I18n.t('Service.contact_method')}</Text>
                        <View style={styles.service_row}>
                            <Text style={[styles.service_title, {width: 50}]}>{I18n.t('Service.tel')}：</Text>
                            <TouchableOpacity onPress={() => this._callPhone(phone_one)}>
                                <Text style={styles.service_link}>{phone_one}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{flex: 1, marginStart: 50}} onPress={() => this._callPhone(phone_two)}>
                            <Text style={styles.service_link}>{phone_two}</Text>
                        </TouchableOpacity>
                        <View style={styles.service_row}>
                            <Text style={styles.service_title}>WeChat：</Text>
                            <TouchableOpacity onPress={() => this._copyTextToClipboard(wechat)}>
                                <Text style={styles.service_link}>{wechat}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.service_row}>
                            <Text style={styles.service_title}>Facebook：</Text>
                            <TouchableOpacity onPress={() => this._copyTextToClipboard(facebook)}>
                                <Text style={styles.service_link}>{facebook}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.bottom_button_container} onPress={() => this._callPhone(phone_one)}>
                    <LinearGradient colors={['#FFDFCA', '#F9BF98', '#FFDFCA']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                                    style={styles.bottom_button_bg_container}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: '#62372A'}}>
                            {I18n.t('Service.contact')}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    logo_img: {
        width: 36,
        height: 36,
        borderRadius: 10,
        marginTop: 30,
        marginHorizontal: 15,
    },
    service_info: {
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#FFF',
        width: 240,
        height: 150,
        paddingLeft: 15,
        paddingVertical: 20,
        marginTop: 15,
    },
    service_row: {
        flexDirection: 'row',
        flex: 1,
    },
    service_title: {
        fontSize: 14,
        color: '#999999'
    },
    service_link: {
        fontSize: 14,
        color: '#442E20',
        textDecorationLine: 'underline',
    },
    bottom_button_container: {
        height: 50,
    },
    bottom_button_bg_container: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
