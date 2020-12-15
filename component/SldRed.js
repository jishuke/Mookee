/*
* 我的优惠券页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, StyleSheet, Image, Text, TouchableOpacity, ImageBackground, Dimensions
} from 'react-native';
import pxToDp from "../util/pxToDp";
import LinearGradient from 'react-native-linear-gradient';

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n} from './../lang/index'
import StorageUtil from "../util/StorageUtil";

const start = {x: 0.0, y: 0.5};
const end = {x: 1.0, y: 0.5};
const colorArr = [['#FF8781', '#EA5064'], ['#C1CBD8', '#A2ACBF']];

let time;   //倒计时时间
let setTimer = null;

export default class SldRed extends Component {

    constructor(props) {

        super(props);
        this.state = {
            info: props.info,
            type: props.type || 0,     // 颜色 0：红色  1：灰色
            status: props.status || 0,     // 1： 领券  0：使用券
            timeStr: I18n.t('com_SldRed.timeStr'),
            language: 1,
        }
    }

    componentDidMount() {
        StorageUtil.get('language', (error, object)=>{
            if(!error && object){
                this.setState({
                    language: object,
                })
            }
        });
        if (this.props.status == 1) {
            time = this.props.info.red_receive_end * 1000;
            this.timer();
            setTimer = setInterval(()=>{
                this.timer()
            },1000)
        }
    }

    componentWillUnmount() {
        //卸载监听
        if(setTimer){
            clearInterval(setTimer);
        }
    }

    timer() {
        let leftTime = (new Date(time)) - new Date(); //计算剩余的毫秒数

        if (leftTime <= 0) {
            this.setState({
                timeStr: I18n.t('com_SldRed.timeStr')
            });
            clearInterval(setTimer);
            return;
        }

        let hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算总小时
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

        function checkTime(num) {
            return (num > 9 ? num : '0' + num);
        }
        if (hours >= 0 || minutes >= 0 || seconds >= 0) {
            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);
            this.setState({
                timerStr: `${hours}:${minutes}:${seconds}`
            })
        }
    }

    render() {
        const {info, type, status, language} = this.state;
        return (
            <View style={styles.red}>
                <LinearGradient start={start} end={end} colors={colorArr[type]} style={styles.red_top}>
                    <View style={styles.red_left}>
                        <Text style={{color: '#fff', fontSize: pxToDp(80), fontWeight: '600'}}>{info.redinfo_money}<Text
                            style={{fontSize: pxToDp(30), fontweight: '300'}}>Ks</Text></Text>
                    </View>
                    <View style={styles.red_center_txt}>
                        <Text style={{
                            color: '#fff',
                            fontSize: pxToDp(30)
                        }}>{language === 3 ? info.redinfo_full + I18n.t('com_SldRed.full') + info.redinfo_money + I18n.t('com_SldRed.Ks_decrease'): I18n.t('com_SldRed.full') + info.redinfo_full + I18n.t('com_SldRed.Ks_decrease') + info.redinfo_money}</Text>
                        <Text style={{
                            color: '#fff',
                            fontSize: pxToDp(22),
                            marginTop: pxToDp(10)
                        }}>{info.redinfo_start_text}-{info.redinfo_end_text}</Text>
                    </View>
                    <View style={styles.red_right}>
                        <TouchableOpacity>
                            {
                                info.reduser_use == 0 && <TouchableOpacity
                                    onPress={() => {
                                        this.props.use()
                                    }}
                                >
                                    <View style={styles.use_btn}>
                                        <Text style={{color: '#C44555', fontSize: pxToDp(26)}}>{I18n.t('com_SldRed.To_use_the')}</Text>
                                    </View>
                                </TouchableOpacity>
                            }

                            {/*领券 start*/}
                            {
                                status == 1 && (<View style={{alignItems: 'center'}}>
                                    {info.have >= info.red_rach_max ? <View>
                                        <Text style={{color: '#fff', fontSize: pxToDp(28)}}>{I18n.t('com_SldRed.text1')}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.use()
                                            }}
                                        >
                                            <View style={[styles.ling_btn, {
                                                backgroundColor: '#fff'
                                            }]}>
                                                <Text style={{color: '#C44555', fontSize: pxToDp(26)}}>{I18n.t('com_SldRed.To_use_the')}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> : <View>
                                        {/*进度条*/}
                                        {info.prent >= 0 && <View style={styles.pro}>
                                            <Text style={{
                                                color: '#fff',
                                                fontSize: pxToDp(24)
                                            }}>{info.prent >= 100 ? I18n.t('com_SldRed.Has_gone') : I18n.t('com_SldRed.Has_been_robbed') + `${info.prent}%`}</Text>
                                            <View style={{
                                                width: pxToDp(150),
                                                height: pxToDp(20),
                                                borderRadius: pxToDp(10),
                                                backgroundColor: '#EEB277',
                                                overflow: 'hidden'
                                            }}>
                                                <View style={{
                                                    width: `${info.prent}%`,
                                                    height: pxToDp(20),
                                                    backgroundColor: '#E57F11',
                                                    borderRadius: pxToDp(10),
                                                    overflow: 'hidden'
                                                }}/>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => this.props.add(info.id)}
                                            >
                                                <View
                                                    style={[styles.ling_btn, {backgroundColor: (this.state.timer == I18n.t('com_SldRed.timeStr') ? '#9F9F9F' : '#E6CD10')}]}>
                                                    <Text style={{
                                                        fontSize: pxToDp(24),
                                                        color: (info.prent >= 100 ? '#5E5E5E' : '#4C440A')
                                                    }}>{I18n.t('com_SldRed.get')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>}
                                    </View>}

                                </View>)
                            }

                        </TouchableOpacity>
                    </View>

                    {/*新人专享 start*/}
                    {info.red_type == 2 && <ImageBackground style={styles.bg}
                                                            source={type == 0 ? require('../assets/images/redBg1.png') : require('../assets/images/redBg2.png')}>
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
        justifyContent: 'center',
        alignItems: 'center',
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
        height: pxToDp(60),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(4),
        marginTop: pxToDp(14),
    },
    pro: {}
})
