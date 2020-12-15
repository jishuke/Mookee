/*
* 选择优惠券
* @slodon
* */
import React, {Component} from 'react';
import {
    View, StyleSheet, Image, Text, TouchableOpacity, ImageBackground, Dimensions
} from 'react-native';
import ViewUtils from "../util/ViewUtils";
import pxToDp from "../util/pxToDp";
import LinearGradient from 'react-native-linear-gradient';

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');


const start = {x: 0.0, y: 0.5};
const end = {x: 1.0, y: 0.5};
const colorArr = [['#FF8781', '#EA5064'], ['#C1CBD8', '#A2ACBF']];

import {I18n} from './../lang/index'

export default class SldRed extends Component {

    constructor(props) {

        super(props);
        this.state = {
            info: props.info,
            type: props.type || 0,     // 颜色 0：红色  1：灰色
            status: props.status || 0,     // 1： 领券  0：使用券
            timeStr: I18n.t('com_SldRed.timeStr'),
            sele_red_id:props.sele_red_id,//已选择的优惠券
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }



    render() {
        const {info, type, sele_red_id} = this.state;
        return (
            <View style={styles.red}>
                <LinearGradient start={start} end={end} colors={colorArr[type]} style={styles.red_top}>
                    <View style={styles.red_left}>
                        <Text style={{color: '#fff', fontSize: pxToDp(80), fontWeight: '600'}}>{info.redinfo_money}<Text
                            style={{fontSize: pxToDp(30), fontweight: '300'}}>{I18n.t('com_SldRed.element')}</Text></Text>
                    </View>
                    <View style={styles.red_center_txt}>
                        <Text style={{
                            color: '#fff',
                            fontSize: pxToDp(30)
                        }}>{I18n.t('com_SldRed.full')}{info.redinfo_full}{I18n.t('com_SldRed.Ks_decrease')}{info.redinfo_money}</Text>
                        <Text style={{
                            color: '#fff',
                            fontSize: pxToDp(22),
                            marginTop: pxToDp(10)
                        }}>{info.redinfo_start_text}-{info.redinfo_end_text}</Text>
                    </View>
                    <View style={styles.red_right}>
                        <TouchableOpacity
                            style={styles.red_right_icon}
                            onPress={() => {
                                this.props.seleVoucher(info)
                            }}
                        >
                            {ViewUtils.getSldImg(34,34,sele_red_id ==info.id ?require('../assets/images/sld_sele_voucher_ok.png'):require('../assets/images/sld_sele_voucher_cancle.png'))}
                        </TouchableOpacity>
                    </View>

                    {/*新人专享 start*/}
                    {info.red_type == 2 && <ImageBackground style={styles.bg}
                                                            source={type == 0 ?require('../assets/images/redBg1.png') : require('../assets/images/redBg2.png')}>
                        <Text style={{fontSize: pxToDp(24), color: (type == 0 ? '#6B583B' : '#fff')}}>{I18n.t('com_SldRed.New_exclusive')}</Text>
                    </ImageBackground>}
                    {/*新人专享 end*/}
                </LinearGradient>
                <LinearGradient start={end} end={start} colors={colorArr[type]} style={styles.red_bottom}>
                    <Text style={{
                        flex: 1,
                        fontSize: pxToDp(24),
                        color: (type == 0 ? '#84292B' : '#fff')
                    }}>{info.str}</Text>
                    <Image style={{width: pxToDp(22), height: pxToDp(12)}}
                           source={require('../assets/images/more.png')}/>
                </LinearGradient>
                <View style={[styles.arc, {left: pxToDp(-15)}]}/>
                <View style={[styles.arc, {right: pxToDp(-15)}]}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    red: {
        width: deviceWidth - pxToDp(60),
        height: pxToDp(280),
        borderRadius: pxToDp(30),
        overflow: 'hidden',
        marginBottom: pxToDp(30),
        marginHorizontal: pxToDp(30),
    },
    red_top: {
        height: pxToDp(180),
        flexDirection: 'row',
        alignItems: 'center',
    },
    red_bottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pxToDp(35),
        borderTopWidth: pxToDp(4),
        borderTopColor: '#fff',
        borderStyle: 'dashed',
    },
    red_left: {
        width: pxToDp(250),
        alignItems: 'center'
    },
    red_center_txt: {
        flex: 1,
        justifyContent: 'center',
    },
    red_right: {
        width: pxToDp(210),
        height:pxToDp(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    red_right_icon:{
        position:'absolute',
        right:pxToDp(30),
        top:0,
        width:pxToDp(34),
        height:pxToDp(34),
        zIndex:2,
    },
    use_btn: {
        width: pxToDp(138),
        height: pxToDp(44),
        borderRadius: pxToDp(8),
        backgroundColor: '#F6F6F6',
        marginBottom: pxToDp(26),
        alignItems: 'center',
        justifyContent: 'center',
    },
    arc: {
        position: 'absolute',
        top: pxToDp(165),
        width: pxToDp(30),
        height: pxToDp(30),
        borderRadius: pxToDp(15),
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: pxToDp(26),
        height: pxToDp(49),
        width: pxToDp(215),
        alignItems: 'center',
        justifyContent: 'center',
    },
    ling_btn: {
        width: pxToDp(150),
        height: pxToDp(82),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(4),
        marginTop: pxToDp(14),
    },
    pro: {}
})
