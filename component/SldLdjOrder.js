import React, {Component, Fragment} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image, Dimensions
} from 'react-native';
import pxToDp from "../util/pxToDp";
import PriceUtil from '../util/PriceUtil'

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n} from './../lang/index'
let time = 0;

export default class SldLdjOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info || '',
            time_out_txt: I18n.t('com_SldLdjOrder.time_out_txt')
        }
    }

    componentDidMount() {
        const {info} = this.state;
        console.log(info)
        if (info.order_state == 10 && info.surplus_time > 0) {
            time = info.surplus_time;
            this.time_out()
            this.timer = setInterval(() => {
                this.time_out();
            }, 1000)
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            info: nextProps.info
        })
    }

    time_out() {
        if (time == 0) {
            clearInterval(this.timer);
            this.setState({
                time_out_txt: I18n.t('com_SldLdjOrder.time_out_txt')
            })
        }
        let h = parseInt(time / 60 / 60);
        let m = parseInt(time / 60 % 60);
        let s = parseInt(time % 60);
        if (time > 0) {
            h = h > 9 ? h : '0' + h;
            m = m > 9 ? m : '0' + m;
            s = s > 9 ? s : '0' + s;
            this.setState({
                time_out_txt: I18n.t('com_SldLdjOrder.text2') + h + ':' + m + ':' + s + '）'
            })
            time--;
        } else {
            this.setState({
                time_out_txt: I18n.t('com_SldLdjOrder.time_out_txt')
            })
        }
    }

    render() {
        const {info} = this.state;
        return (
            <TouchableOpacity
	            onPress={() => {
		            this.props.OrderDetail(info.order_id)
	            }}
	            activeOpacity={1}
                style={styles.wrap}>
                <View style={styles.store_name}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.StoreDetail(info.vid)
                        }}
                        activeOpacity={1}
                        style={{flexDirection: 'row', alignItems: 'center'}}
                    >
                        <Text style={{
                            color: '#333',
                            fontSize: pxToDp(28),
                            marginRight: pxToDp(10)
                        }}>{info.store_name}</Text>
                        <Image
                            style={{width: pxToDp(14), height: pxToDp(24)}}
                            resizeMode={'contain'}
                            source={require('../ldj/images/ltr.png')}
                        />
                    </TouchableOpacity>
                    <Text style={{color: '#FF3D3D', fontSize: pxToDp(24)}}>{info.order_state_str}</Text>
                </View>

                <Text style={styles.time}>{info.add_time}</Text>

                {info.order_state == 10 && <View style={styles.tip}>
                    <Text style={{color: '#333', fontSize: pxToDp(26)}}>{I18n.t('com_SldLdjOrder.unpaid')}</Text>
                    <Text style={{
                        color: '#999',
                        fontSize: pxToDp(22),
                    }}>{I18n.t('com_SldLdjOrder.text1')}</Text>
                </View>}

                <View style={styles.goods}>
                    <View style={styles.goods_list}>
                        {info.goods_list.map((el, index) => {
                            if (index < 4) {
                                return (
                                    <TouchableOpacity
                                        style={{marginRight: pxToDp(20), borderRadius: pxToDp(8), overflow: 'hidden'}}
                                        activeOpacity={1}
                                    >
                                        <Image
                                            style={{width: pxToDp(103), height: pxToDp(103)}}
                                            resizeMode={'contain'}
                                            source={{uri: el.goods_image}}
                                        />
                                        {el.goods_error == 1 && <Text
                                            style={styles.err_txt}
                                        >{el.goods_error_str}</Text>}
                                    </TouchableOpacity>
                                )
                            }
                        })}
                    </View>

                    <View style={styles.order_info}>
                        <Text style={{color: '#F71A1A', fontSize: pxToDp(28)}}>ks{PriceUtil.formatPrice(info.order_amount)}</Text>
                        <Text style={{
                            color: '#666',
                            fontSize: pxToDp(24),
                            marginTop: pxToDp(10)
                        }}>共{info.goods_num}件</Text>
                        <Text
                            style={{
                                height: pxToDp(30),
                                paddingHorizontal: pxToDp(15),
                                borderRadius: pxToDp(4),
                                borderColor: '#03A9F3',
                                borderStyle: 'solid',
                                color: '#03A9F3',
                                fontSize: pxToDp(20),
                                lineHeight: pxToDp(30),
                                textAlign: 'center',
                                borderWidth: pxToDp(1),
                                marginTop: pxToDp(10)
                            }}
                        >{info.express_type_str}</Text>
                    </View>
                </View>

                <View
                    style={{
                        marginVertical: pxToDp(30),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                >
                    {info.order_state == 10 && <Fragment>
                        <TouchableOpacity
                            style={styles.btn}
                            activeOpacity={1}
                            onPress={() => {
                                this.props.cancelOrder(info.order_id);
                            }}
                        >
                            <Text style={{color: '#333', fontSize: pxToDp(24)}}>{I18n.t('com_SldLdjOrder.cancel_order')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.time_btn]}
                            activeOpacity={1}
                            onPress={() => {
                                if (time > 0) {
                                    this.props.gotoPay(info.pay_sn)
                                }
                            }}
                        >
                            <Text style={{color: '#fff', fontSize: pxToDp(24)}}>{this.state.time_out_txt}</Text>
                        </TouchableOpacity>
                    </Fragment>}

                    {info.order_state != 10 && <TouchableOpacity
                        style={styles.btn}
                        activeOpacity={1}
                        onPress={()=>{
                            this.props.buyAgain(info.order_id)
                        }}
                    >
                        <Text style={{color: '#333', fontSize: pxToDp(24)}}>{I18n.t('com_SldLdjOrder.buy_again')}</Text>
                    </TouchableOpacity>}

                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        height: pxToDp(44),
        paddingHorizontal: pxToDp(23),
        borderRadius: pxToDp(4),
        borderStyle: 'solid',
        borderColor: '#999999',
        borderWidth: pxToDp(1),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: pxToDp(30)
    },
    time_btn: {
        backgroundColor: '#FF3D3D',
        borderColor: '#FF3D3D'
    },
    goods_list: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goods: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    err_txt: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: pxToDp(103),
        height: pxToDp(103),
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#fff',
        fontSize: pxToDp(24),
        textAlign: 'center',
        lineHeight: pxToDp(103)
    },
    store_name: {
        height: pxToDp(68),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrap: {
        paddingHorizontal: pxToDp(20),
        marginTop: pxToDp(20),
        backgroundColor: '#fff'
    },
    time: {
        color: '#999',
        fontSize: pxToDp(24),
        marginBottom: pxToDp(10)
    },
    tip: {
        height: pxToDp(80),
        backgroundColor: '#F1F1F1',
        paddingLeft: pxToDp(20),
        marginBottom: pxToDp(20),
    },
    order_info: {
        alignItems: 'flex-end',
    }
})
