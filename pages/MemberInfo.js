/*
* 个人信息页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import DatePicker from 'react-native-datepicker';
import RequestData from "../RequestData";
import ImagePicker from 'react-native-image-crop-picker';
import MemberSex from "../component/MemberSex";
import {I18n} from './../lang/index'
import {TextInput} from "./PerfectInfo";

var Dimensions = require('Dimensions');
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');
const rows = 10;

export default class MemberInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            memberInfo: [],//用户信息
            date: '',
            sex_val: '',
            avator_name: '',//头像名字,
            nickname: ''
        }
    }

    componentDidMount() {
        //获取用户信息
        this.getMemInfo();
    }

    getMemInfo = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=memberInfo&key=' + key)
            .then(result => {
                console.log('用户信息22222222：', result)
                if (!result.datas.error) {
                    this.setState({
                        memberInfo: result.datas.member_info,
                        date: result.datas.member_info.member_birthday,
                        sex_val: result.datas.member_info.member_sex,
                        nickname: result.datas.member_info.member_nickname
                    });
                } else {
                    ViewUtils.sldToastTip(result.datas.error);
                    if (result.state == 266) {
                        this.props.navigation.navigate('Login');
                    }
                }

            })
            .catch(error => {
            })
    }

    saveMemInfo = (type, val) => {
        let data = {};
        data.key = key;
        if (type == 'sex') {
            data.member_sex = val;
        }
        else if (type == 'birth') {
            data.birthday = val;
        }
        else if (type == 'avator') {
            data.member_avatar = val;
        }
        RequestData.postSldData(AppSldUrl + '/index.php?app=usercenter&mod=editUserInfo', data)
            .then(result => {
                if (result.datas.state == 'failuer') {
                    //用户信息修改失败
                    ViewUtils.sldToastTip(result.datas.error);
                } else {
                    //用户信息修改成功
                    ViewUtils.sldToastTip(I18n.t('MemberInfo.text1'));
                }
            })
            .catch(error => {
                ViewUtils.sldToastTip(error);
            })
    }

    handleMessage = (e) => {
        let type = e.nativeEvent.data;
        this.props.navigation.navigate(type);
    }

    onValueChange = (id) => {
        this.setState({
            sex_val: id
        });
        this.saveMemInfo('sex', id);
    }

    modifyAvatar() {
        // 修改头像
        ImagePicker.openPicker({
            width: pxToDp(200),
            height: pxToDp(200),
            cropping: true
        }).then(image => {
            console.log('选择的头像图片:', image)
            let path = image.path;
            let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
            if (!key) {
                console.log('选择的头像图片失败')
                this.props.navigation.navigate('Login');
            } else {
                let formData = new FormData();
                let file = {
                    uri: image.path,
                    type: 'multipart/form-data',
                    name: filename,
                    'size': image.size,
                    tmp_name: image.filename
                };
                formData.append('file', file);
                formData.append('key', key);
                console.log('上传头像图片:', formData)
                // let url = AppSldUrl+'/index.php?app=sns_album&mod=file_upload';
                let url = AppSldUrl + '/index.php?app=usercenter&mod=avatars';
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        // 'Access-Control-Allow-Origin':'*'
                        'TOKEN': key
                    },
                    body: formData,
                })
                    .then(response => response.json())
                    .then(result => {
                        console.log('上传头像图片res:', result)
                        //上传成功
                        if (result.code == '200') {
                            DeviceEventEmitter.emit('loginUpdate')
                            let member_info = this.state.memberInfo;
                            member_info.avator = result.datas.member_avatar;
                            this.setState({
                                memberInfo: member_info,
                            });
                        }
                    })
                    .catch(error => {
                        //上传出错
                        ViewUtils.sldToastTip(error);
                    })

            }
        });
    }

    render() {
        const {memberInfo, nickname} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={I18n.t('MemberInfo.title')} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>

                <View style={GlobalStyles.line}/>
                <TouchableOpacity activeOpacity={1}
                                  style={styles.meminfo_avatar}
                                  onPress={() => {
                                      this.modifyAvatar();
                                  }}>

                    {!memberInfo.avator && (
                        <Image style={styles.meminfo_avatar_img}
                               source={require("../assets/images/sld_default_avator.png")} resizeMode={'contain'}/>
                    )}

                    {memberInfo.avator && (
                        <Image defaultSource={require("../assets/images/sld_default_avator.png")}
                               style={styles.meminfo_avatar_img} source={{uri: memberInfo.avator}}
                               resizeMode={'contain'}/>
                    )}

                </TouchableOpacity>

                <View style={styles.member_info_wrap}>
                    <View style={styles.mi_single_line}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}><Text
                            style={styles.mi_single_line_left}>{I18n.t('MemberInfo.gender')}</Text></View>
                        <View style={styles.right}>
                            <MemberSex seleVal={this.state.sex_val} onhandle={this.onValueChange}/>
                        </View>
                    </View>
                    <View style={GlobalStyles.line}/>
                    <View style={styles.mi_single_line}>
                        <Text style={styles.mi_single_line_left}>{I18n.t('MemberInfo.birthday')}</Text>
                        <Text
                            style={styles.right}>{this.state.date ? this.state.date : I18n.t('MemberInfo.text2')}</Text>
                    </View>
                </View>
                <DatePicker
                    style={{width: '100%', marginTop: -50}}
                    date={this.state.date}
                    mode="date"
                    placeholder={I18n.t('MemberInfo.text2')}
                    format="YYYY-MM-DD"
                    confirmBtnText={I18n.t('ok')}
                    cancelBtnText={I18n.t('cancel')}
                    showIcon={false}
                    customStyles={{
                        dateText: {
                            marginLeft: 36,

                        }
                    }}
                    hideText={true}
                    onDateChange={(date) => {
                        this.setState({date: date});
                        this.saveMemInfo('birth', date);
                    }}
                />
                <View style={GlobalStyles.line}/>
                {/*修改昵称*/}
                <TouchableOpacity
                    style={ styles.wrap }
                    activeOpacity={1.0}
                    onPress={() => {
                        this.props.navigation.navigate(
                            'PerfectInfo',
                            {
                                nickname,
                                callBack: res => {
                                    console.log('昵称刷新：', res)
                                    this.setState({nickname: res})
                                    DeviceEventEmitter.emit('loginUpdate')
                                }
                            }
                        )
                    }}
                >
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.mi_single_line_left}>{I18n.t('PerfectInfo.nicheng')}</Text>
                        <Text style={{color: '#999', fontSize: 11, textAlign: 'right'}} numberOfLines={1}>{nickname || ''}</Text>
                    </View>
                    <Image
                        source={ require('../assets/images/arrow_right_b.png') }
                        style={ {width: pxToDp(26), marginLeft: 5, height: pxToDp(26), opacity: 0.4} }
                    />
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    right: {
        flex: 4,
        fontWeight: '300',
        color: '#333',
    },
    mi_single_line_left: {
        fontSize: pxToDp(30),
        color: '#333',
        flex: 1,
        fontWeight: '300'
    },
    mi_single_line: {
        flexDirection: 'row',
        height: pxToDp(122),
        alignItems: 'center',
    },
    member_info_wrap: {
        backgroundColor: '#fff',
        paddingLeft: 15,
        marginTop: 10
    },
    meminfo_avatar_img: {
        width: pxToDp(140),
        height: pxToDp(140),
        borderRadius: pxToDp(70),
    },
    meminfo_avatar: {
        height: pxToDp(180),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 10
    },
    wrap: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#fff'
    },
});
