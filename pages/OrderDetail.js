/*
* 订单详情页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, TouchableOpacity, ScrollView, Alert,DeviceEventEmitter
} from 'react-native';
import CountEmitter from "../util/CountEmitter";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'
import styles from './stylejs/order'
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

export default class OrderDetail extends Component {

    constructor(props) {

        super(props);
        this.state = {
            orderId: this.props.navigation.state.params.orderid,//订单id
            title: I18n.t('OrderDetail.title'),
            orderInfo: ''
        }
    }

    componentWillMount() {
        this.getOrderDetail();
        //更新页面
        CountEmitter.addListener('updateOrderDetailList', () => {
            const {refresh} = this.state;
            this.setState({
                refresh: refresh + 1,
            });
        });
    }

    componentWillUnmount() {
        //卸载监听
        CountEmitter.removeListener('updateOrderDetailList', () => {
        });
    }

    // 获取订单详情
    getOrderDetail() {
        let {orderId} = this.state;
        RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=order_info&key=' + key + '&order_id=' + orderId).then(res => {
            if (res.code == 200 && typeof res.datas.error == "undefined") {
                this.setState({
                    orderInfo: res.datas.order_info
                })
            }else{
                ViewUtils.sldToastTip(res.datas.error)
            }
        }).catch(err => {
        })
    }

    // 删除订单
    del = () => {
        let {orderList, orderId} = this.state;
        Alert.alert(I18n.t('hint'), I18n.t('OrderList.text1'), [
            {
                text: I18n.t('cancel'),
                onPress: () => {

                },
                style: 'cancel'
            },
            {
                text: I18n.t('ok'),
                onPress: () => {
                    RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=order_delete', {
                        order_id: orderId,
                        key
                    }).then(res => {
                        if (res.datas && res.datas == 1) {
                            this.getOrderDetail();
                            DeviceEventEmitter.emit('orderList');
                        } else {
                            ViewUtils.sldToastTip(res.datas.error)
                        }
                    }).catch(err => {
                    })
                }
            }
        ])
    }

    // 确认收货
    confirm = () => {
        let {orderList, sldOrderState, orderId} = this.state;
        Alert.alert(I18n.t('hint'), I18n.t('OrderList.text2'), [
            {
                text: I18n.t('cancel'),
                onPress: () => {

                },
                style: 'cancel'
            },
            {
                text: I18n.t('ok'),
                onPress: () => {
                    RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=order_receive', {
                        order_id: orderId,
                        key
                    }).then(res => {
                        if (res.datas && res.datas == 1) {
                            this.getOrderDetail();
                            DeviceEventEmitter.emit('orderList');
                        } else {
                            ViewUtils.sldToastTip(res.datas.error)
                        }
                    }).catch(err => {
                    })
                }
            }
        ])
    }

    // 取消订单
    cancel = () => {
        let {orderList, sldOrderState, orderId} = this.state;
        Alert.alert(I18n.t('hint'), I18n.t('OrderList.text3'), [
            {
                text: I18n.t('cancel'),
                onPress: () => {

                },
                style: 'cancel'
            },
            {
                text: I18n.t('ok'),
                onPress: () => {
                    RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=order_cancel', {
                        order_id: id,
                        key
                    }).then(res => {
                        if (res.datas && res.datas == 1) {
                            this.getOrderDetail();
                            DeviceEventEmitter.emit('orderList');
                        } else {
                            ViewUtils.sldToastTip(res.datas.error)
                        }
                    }).catch(err => {
                    })
                }
            }
        ])
    }


    render() {
        const {title, orderInfo,orderId} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                {
                    orderInfo != '' &&
                    <ScrollView>
                        <View style={styles.order_sn}>
                            <Text style={{color: '#252525', fontsize: pxToDp(26)}}>{I18n.t('PreSaleOrderDetail.order_number')}：{orderInfo.order_sn}</Text>
                            <Text style={{fontSize: pxToDp(26), color: '#f15353'}}>{orderInfo.state_desc}</Text>
                        </View>

                        <View style={styles.addr}>
                            <Image
                                style={{
                                    width: pxToDp(46),
                                    height: pxToDp(46),
                                }}
                                resizeMode={'contain'}
                                source={require('../assets/images/location_b.png')}
                            />
                            <View style={styles.addr_info}>
                                {
                                    orderInfo.ziti == 1 && orderInfo.dian_id > 0 ?
                                        <View>
                                            <Text style={styles.txt}>{I18n.t('OrderDetail.shop')}：{orderInfo.dian.dian_name}{orderInfo.dian.dian_phone[0]}</Text>
                                            <Text style={styles.txt}>{I18n.t('OrderDetail.address')}：{orderInfo.dian.dian_address}</Text>
                                            <Text style={styles.txt}>{I18n.t('LdjOrderDetail.verification_code')}：{orderInfo.hexiao_code}</Text>
                                        </View>
                                        :
                                        <View>
                                            <Text style={styles.txt}>{I18n.t('OrderDetail.consignee')}：{orderInfo.reciver_name}{orderInfo.reciver_phone}</Text>
                                            <Text style={styles.txt}>{I18n.t('OrderDetail.profile')}：{orderInfo.reciver_addr}</Text>
                                        </View>
                                }
                            </View>
                        </View>
                        <View style={styles.goods_list}>
                            <TouchableOpacity
                                style={styles.store_info}
                                onPress={() => {
                                    this.props.navigation.navigate('Vendor', {vid: orderInfo.vid})
                                }}
                            >
                                <Image source={require('../assets/images/sld_chat_go_shop.png')}
                                       style={{width: pxToDp(26), height: pxToDp(26), marginRight: pxToDp(15)}}/>
                                <Text style={{color: '#333', fontSize: pxToDp(28)}}>{orderInfo.store_name}</Text>
                                <Image source={require('../assets/images/arrow_right_b.png')}
                                       style={{
                                           width: pxToDp(20),
                                           height: pxToDp(20),
                                           marginLeft: pxToDp(15),
                                           tintColor: '#999'
                                       }}/>
                            </TouchableOpacity>
                            {
                                orderInfo.goods_list.map(el => {
                                    return (
                                        <View style={styles.goods_item}>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{width: pxToDp(128), height: pxToDp(128)}}
                                                onPress={() => {
                                                    this.props.navigation.navigate('GoodsDetailNew', {gid: el.gid})
                                                }}
                                            >
                                                <Image source={{uri: el.image_url}} style={{width: pxToDp(128), height: pxToDp(128)}}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{flex: 1, paddingLeft: pxToDp(20)}}
                                                activeOpacity={1}
                                                onPress={() => {
                                                    this.props.navigation.navigate('GoodsDetailNew', {gid: el.gid})
                                                }}
                                            >
                                                <Text
                                                    ellipsizeMode={'tail'}
                                                    numberOfLines={2}
                                                >
                                                    {el.goods_name}
                                                </Text>
                                            </TouchableOpacity>

                                            <View style={styles.num}>
                                                <Text style={{color: '#333', fontSize: pxToDp(24)}}>Ks{PriceUtil.formatPrice(el.goods_price)}</Text>
                                                <Text style={{color: '#555'}}>x{el.goods_num}</Text>
                                                {
                                                    el.refund == 1 &&
                                                    <View style={styles.btns}>
                                                        <TouchableOpacity
                                                            style={styles.btn}
                                                            activeOpacity={1}
                                                            onPress={() => {
                                                                this.props.navigation.navigate('OrderRefund', {
                                                                    order_id: orderInfo.order_id,
                                                                    gid: el.rec_id,
                                                                    type: 'refund'
                                                                })
                                                            }}
                                                        >
                                                            <Text style={styles.btn_t}>{I18n.t('OrderDetail.refund')}</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={styles.btn}
                                                            activeOpacity={1}
                                                            onPress={() => {
                                                                this.props.navigation.navigate('OrderRefund', {
                                                                    order_id: orderInfo.order_id,
                                                                    gid: el.rec_id,
                                                                    type: 'return'
                                                                })
                                                            }}
                                                        >
                                                            <Text style={styles.btn_t}>{I18n.t('OrderDetail.salesreturn')}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                                {/*失败全部退款*/}
                                                {
                                                    el.refund == 3 &&
                                                    <View style={styles.btns}>
                                                        <TouchableOpacity
                                                            style={styles.btn}
                                                            activeOpacity={1}
                                                            onPress={() => {
                                                                this.props.navigation.navigate('OrderRefund', {
                                                                    order_id: orderInfo.order_id,
                                                                    gid: el.rec_id,
                                                                    type: 'refund'
                                                                })
                                                            }}
                                                        >
                                                            <Text style={styles.btn_t}>{I18n.t('OrderDetail.refund')}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                                {/*退款退货中*/}
                                                {
                                                    orderInfo.order_state > 20 && orderInfo.order_state < 40 && el.refund == 0 &&
                                                    <View style={styles.btns}>
                                                        <TouchableOpacity
                                                            style={styles.btn}
                                                            activeOpacity={1}
                                                        >
                                                            <Text style={styles.btn_t}>{I18n.t('OrderDetail.Refundandreturn')}···</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>

                        <View style={{paddingVertical: pxToDp(20)}}>
                            {orderInfo.promotion.length > 0 && <View style={styles.info_item}>
                                <Text style={styles.info_name}>{I18n.t('OrderDetail.discounts')}</Text>
                                {orderInfo.promotion.map(el => <Text style={styles.order_txt}>{el}</Text>)}
                            </View>}

                            <View style={styles.info_item}>
                                <Text style={styles.info_name}>{I18n.t('OrderDetail.freight')}</Text>
                                <Text style={styles.order_txt}>Ks {PriceUtil.formatPrice(orderInfo.shipping_fee)}</Text>
                            </View>

                            {orderInfo.pd_points > 0 && <View style={styles.info_item}>
                                <Text style={styles.info_name}>{I18n.t('OrderDetail.integral')}</Text>
                                <Text style={styles.order_txt}>Ks{PriceUtil.formatPrice(orderInfo.bili)}</Text>
                            </View>}

                            <View style={styles.info_item}>
                                <Text style={styles.info_name}>{I18n.t('OrderDetail.actualpayment')}</Text>
                                <Text style={styles.order_txt}>Ks{PriceUtil.formatPrice(orderInfo.order_amount)}</Text>
                            </View>
                        </View>

                        <View>
                            {orderInfo.order_message != '' && <View
                                style={styles.line}
                            >
                                <View style={styles.i_title}>
                                    <Image
                                        style={{width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(20)}}
                                        resizeMode={'contain'}
                                        source={require('../assets/images/mcc_04.png')}
                                    />
                                    <Text style={{color: '#333', fontSize: pxToDp(28)}}>{I18n.t('OrderDetail.leavewords')}</Text>
                                </View>
                                <Text style={styles.i_con}>{orderInfo.order_message}</Text>
                            </View>}

                            {orderInfo.invoice != '' && <View
                                style={styles.line}
                            >
                                <View style={styles.i_title}>
                                    <Image
                                        style={{width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(20)}}
                                        resizeMode={'contain'}
                                        source={require('../assets/images/mcc_08_b.png')}
                                    />
                                    <Text style={{color: '#333', fontSize: pxToDp(28)}}>{I18n.t('OrderDetail.invoice')}</Text>
                                </View>
                                <Text style={styles.i_con}>{orderInfo.invoice}</Text>
                            </View>}

                            {orderInfo.payment_name != '' && <View
                                style={styles.line}
                            >
                                <View style={styles.i_title}>
                                    <Image
                                        style={{width: pxToDp(40), height: pxToDp(40), marginRight: pxToDp(20)}}
                                        resizeMode={'contain'}
                                        source={require('../assets/images/mcc_06_b.png')}
                                    />
                                    <Text style={{color: '#333', fontSize: pxToDp(28)}}>{I18n.t('OrderDetail.paymentmethod')}</Text>
                                </View>
                                <Text style={styles.i_con}>{orderInfo.payment_name}</Text>
                            </View>}
                        </View>

                        <View style={styles.time}>
                            <Text style={{
                                color: '#999',
                                fontSize: pxToDp(24),
                                lineHeight: pxToDp(40),
                                paddingHorizontal: pxToDp(20)
                            }}>{I18n.t('OrderDetail.creationtime')}：{orderInfo.add_time}</Text>

                            {orderInfo.payment_time != '' && orderInfo.payment_time != null && <Text style={{
                                color: '#999',
                                fontSize: pxToDp(24),
                                lineHeight: pxToDp(40),
                                paddingHorizontal: pxToDp(20)
                            }}>{I18n.t('RechargeList.pdr_payment_time_str')}：{orderInfo.payment_time}</Text>}

                            {orderInfo.shipping_time!='' && orderInfo.shipping_time!=null && <Text style={{
                                color: '#999',
                                fontSize: pxToDp(24),
                                lineHeight: pxToDp(40),
                                paddingHorizontal: pxToDp(20)
                            }}>{I18n.t('OrderDetail.deliverytime')}：{orderInfo.shipping_time}</Text>}

                            {orderInfo.finnshed_time!='' && orderInfo.finnshed_time!=null && <Text style={{
                                color: '#999',
                                fontSize: pxToDp(24),
                                lineHeight: pxToDp(40),
                                paddingHorizontal: pxToDp(20)
                            }}>{I18n.t('OrderDetail.finishtime')}：{orderInfo.finnshed_time}</Text>}

                        </View>
                    </ScrollView>
                }

                {orderInfo != '' && <View style={styles.footer}>
                    {orderInfo.if_lock == true && <TouchableOpacity
                        style={styles.e_btn}
                        activeOpacity={1}
                    >
                        <Text style={{color: '#686868', fontSize: pxToDp(26)}}>{I18n.t('OrderList.reimburse')}...</Text>
                    </TouchableOpacity>}

                    {orderInfo.if_delete == true && <TouchableOpacity
                        style={styles.e_btn}
                        activeOpacity={1}
                        onPress={() => this.del()}
                    >
                        <Text style={{color: '#686868', fontSize: pxToDp(26)}}>{I18n.t('OrderList.delete')}</Text>
                    </TouchableOpacity>}

                    {orderInfo.if_buyer_cancel == true && <TouchableOpacity
                        style={styles.e_btn}
                        activeOpacity={1}
                        onPress={() => this.cancel()}
                    >
                        <Text style={{color: '#686868', fontSize: pxToDp(26)}}>{I18n.t('OrderList.cancellationoforder')}</Text>
                    </TouchableOpacity>}

                    {orderInfo.if_refund_cancel == true && <TouchableOpacity
                        style={styles.e_btn}
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigation.navigate('OrderRefund', {
                                order_id: orderInfo.order_id,
                                type: 'all'
                            })
                        }}
                    >
                        <Text style={{color: '#686868', fontSize: pxToDp(26)}}>{I18n.t('OrderRefund.refund')}</Text>
                    </TouchableOpacity>}

                    {orderInfo.if_deliver == true && <TouchableOpacity
                        style={styles.e_btn}
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigation.navigate('ViewOrderExpress', {orderid: orderId})
                        }}
                    >
                        <Text style={{color: '#686868', fontSize: pxToDp(26)}}>{I18n.t('OrderList.logistics')}</Text>
                    </TouchableOpacity>}

                    {orderInfo.if_receive == true && <TouchableOpacity
                        style={styles.e_btn}
                        activeOpacity={1}
                        onPress={() => this.confirm()}
                    >
                        <Text style={{color: '#686868', fontSize: pxToDp(26)}}>{I18n.t('OrderList.confirmreceipt')}</Text>
                    </TouchableOpacity>}

                    {orderInfo.if_evaluation == true && <TouchableOpacity
                        style={styles.e_btn}
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigation.navigate('OrderEvaluate', {orderid: orderId})
                        }}
                    >
                        <Text style={{color: '#686868', fontSize: pxToDp(26)}}>{I18n.t('OrderList.evaluate')}</Text>
                    </TouchableOpacity>}
                </View>}
            </View>
        )
    }
}
