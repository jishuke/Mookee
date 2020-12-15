/*
* 设置密码---选择设置/修改
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';

const hide = require('../assets/images/login_pass_hide.png');
const show = require('../assets/images/login_pass_show.png');
import {I18n} from './../lang/index'

export default class SetLoginPassword extends Component {
    render () {
        const { params } = this.props.navigation.state
        return (
            <View style={styles.container}>
                <SldHeader title={I18n.t('choose')} left_icon={ require('../assets/images/goback.png') }
                           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
                <View style={ GlobalStyles.line }/>
                {/*设置密码*/}
                {
                    params && !params.is_login_pwd_set ?
                        <TouchableOpacity
                            style={styles.btn}
                            activeOpacity={1.0}
                            onPress={() => {
                                //1：设置密码 2：修改密码
                                this.props.navigation.navigate('ChangePasswd', {type: 1, username: params.username})
                            }}
                        >
                            <View style={{flex:1}}>
                                <Text style={styles.text}>{I18n.t('BindMyAccount.text1')}</Text>
                            </View>
                            <Image style={styles.img} source={ require('../assets/images/arrow_right_b.png')} resizeMode={'contain'}/>
                        </TouchableOpacity> : null
                }
                {/*修改密码*/}
                {
                    params && params.is_login_pwd_set ?
                        <TouchableOpacity
                            style={styles.btn}
                            activeOpacity={1.0}
                            onPress={() => {
                                //1：设置密码 2：修改密码
                                this.props.navigation.navigate('ChangePasswd', {type: 2, username: params.username})
                            }}
                        >
                            <View style={{flex:1}}>
                                <Text style={styles.text}>{I18n.t('BindMyAccount.text2')}</Text>
                            </View>
                            <Image style={styles.img} source={ require('../assets/images/arrow_right_b.png')} resizeMode={'contain'}/>
                        </TouchableOpacity> : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 0,
        height: 44,
        backgroundColor: '#fff',
    },
    img: {
        marginRight: 15,
        width: 13,
        height: 13
    },
    text: {
        marginLeft: 15,
        color: '#333',
        fontSize: 14,
    }
})
