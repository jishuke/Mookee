/*
* 订单退款页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'

const Dimensions = require('Dimensions');
const {width} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class OrderRefund extends Component {

    constructor(props) {

        super(props);
        this.state = {
            title: props.navigation.state.params.type == 'refund' ? I18n.t('OrderRefund.refund') : I18n.t('OrderRefund.salesreturn'),
            order_id: props.navigation.state.params.order_id,
            type: props.navigation.state.params.type,
            orderInfo: '',
            gid: '',
            goods_pay_price: '',
            goods_num: 0,
            msg: '',
            isReturn: false, //是否已退货
        }
    }

    canSubmit = true //防止重复提交

    componentWillMount() {
        if (this.props.navigation.state.params.gid) {
            this.setState({
                gid: this.props.navigation.state.params.gid
            }, () => {
                this.getOrderDetail();
            })
        } else {
            this.getOrderDetail();
        }
    }

    // 获取订单详情
    getOrderDetail() {
        let {type} = this.state;
        RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=order_info&key=' + key + '&type=refund&order_id=' + this.state.order_id).then(res => {
            if (res.code == 200) {
                if (type != 'all') {
                    let list = res.datas.order_info.goods_list;
                    list = list.filter(el => el.rec_id == this.state.gid);
                    let goods_pay_price = parseFloat(list[0].goods_pay_price);
                    goods_pay_price = goods_pay_price <= 0 ? 0 : goods_pay_price;
                    if (res.datas.order_info.payment_code == 'offline' && res.datas.order_info.order_state < 40) {
                        goods_pay_price = 0;
                    }
                    let goods_num = list[0].goods_num;
                    this.setState({
                        orderInfo: res.datas.order_info,
                        goods_pay_price: goods_pay_price,
                        goods_num: goods_num,
                        list: list
                    })
                } else {
                    let goods_pay_price = res.datas.order_info.real_pay_amount;
                    this.setState({
                        orderInfo: res.datas.order_info,
                        goods_pay_price: goods_pay_price,
                    })
                }
            }
        })
    }

    submit = () => {
        let {type, goods_num, gid, order_id, msg, goods_pay_price, isReturn} = this.state;
        if (!this.canSubmit || isReturn) {
            return
        }
        this.canSubmit = false

        if (type == 'all') {
            RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=add_refund_all', {
                key,
                order_id,
                buyer_message: msg
            }).then(res => {
                this.canSubmit = true
                if (res.datas.state == 'failuer') {
                    this.setState({isReturn: true})
                    // console.log('全部订单退货:', res)
                    ViewUtils.sldToastTip(res.datas.msg);
                } else {
                    ViewUtils.sldToastTip(I18n.t('OrderRefund.text1'));
                    this.props.navigation.navigate('ReturnRefundList')
                }
            }).catch(err => {
                // console.log('全部订单退货失败:', err)
                this.canSubmit = true
            })
        } else {
            let refund_type = type == 'refund' ? 1 : 2;
            RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=add_refund', {
                key,
                goods_num,
                gid,
                order_id,
                refund_msg: msg,
                refund_type,
                refund_amount: goods_pay_price
            }).then(res => {
                this.canSubmit = true
                if (res.datas.state == "failuer") {
                    this.setState({isReturn: true})
                    ViewUtils.sldToastTip(res.datas.msg)
                } else {
                    ViewUtils.sldToastTip(I18n.t('OrderRefund.text2'));
                    this.props.navigation.navigate('ReturnRefundList', {index: refund_type})
                }
            }).catch(err => {
                // console.log('订单退货失败:', err)
                this.canSubmit = true
            })
        }
    }

    render() {
        const {orderInfo, title, type, isReturn} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                {orderInfo != '' && <ScrollView>

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

                        {type == 'all' && orderInfo.goods_list.map(el => <View
                            style={styles.goods_item}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{width: pxToDp(128), height: pxToDp(128)}}
                                onPress={() => {
                                    this.props.navigation.navigate('GoodsDetailNew', {gid: el.gid})
                                }}
                            >
                                <Image source={{uri: el.image_url}}
                                       defaultSource={require('../assets/images/default_icon_124.png')}
                                       style={{width: pxToDp(128), height: pxToDp(128)}}/>
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
                                <Text style={{color: '#333', fontSize: pxToDp(24)}}>Ks{el.goods_price}</Text>
                                <Text style={{color: '#555'}}>x{el.goods_num}</Text>
                            </View>
                        </View>)}

                        {type != 'all' && this.state.list.map(el => <View
                            style={styles.goods_item}
                        >
                            <TouchableOpacity
                                activeOpacity={1}
                                style={{width: pxToDp(128), height: pxToDp(128)}}
                                onPress={() => {
                                    this.props.navigation.navigate('GoodsDetailNew', {gid: el.gid})
                                }}
                            >
                                <Image source={{uri: el.image_url}}
                                       defaultSource={require('../assets/images/default_icon_124.png')}
                                       style={{width: pxToDp(128), height: pxToDp(128)}}/>
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
                                <Text style={{color: '#333', fontSize: pxToDp(24)}}>Ks{el.goods_price}</Text>
                                <Text style={{color: '#555'}}>x{el.goods_num}</Text>
                            </View>
                        </View>)}
                    </View>

                    {type != 'all' && <View style={styles.form}>
                        <View style={styles.form_item}>
                            <TextInput
                                placeholder={I18n.t('OrderRefund.text3')}
                                underlineColorAndroid={'transparent'}
                                style={styles.input}
                                onChangeText={text => {
                                    this.setState({
                                        msg: text
                                    })
                                }}
                            />
                        </View>

                        <View style={styles.form_item}>
                            <Text style={[styles.input, {lineHeight: pxToDp(70)}]}>{this.state.goods_pay_price}</Text>
                            <View style={styles.form_right}>
                                <Text style={{
                                    color: '#ffb03f',
                                    fontSize: pxToDp(24)
                                }}>Ks{this.state.goods_pay_price}</Text>
                                <Text style={{color: '#999', fontSize: pxToDp(22)}}>{I18n.t('OrderRefund.text4')}</Text>
                            </View>
                        </View>

                        <View style={styles.form_item}>
                            <Text style={[styles.input, {lineHeight: pxToDp(70)}]}>{this.state.goods_num}</Text>
                            <View style={styles.form_right}>
                                <Text style={{color: '#ffb03f', fontSize: pxToDp(24)}}>{this.state.goods_num}</Text>
                                <Text style={{color: '#999', fontSize: pxToDp(22)}}>{I18n.t('OrderRefund.text5')}</Text>
                            </View>
                        </View>
                    </View>}

                    {type == 'all' && <View style={styles.form}>

                        <View style={styles.form_item}>
                            <Text style={[styles.input, {lineHeight: pxToDp(70)}]}>{I18n.t('OrderRefund.text6')}</Text>
                        </View>

                        <View style={styles.form_item}>
                            <Text style={[styles.input, {lineHeight: pxToDp(70)}]}>{this.state.goods_pay_price}</Text>
                        </View>

                        <View style={styles.form_item}>
                            <TextInput
                                placeholder={I18n.t('OrderRefund.text7')}
                                underlineColorAndroid={'transparent'}
                                style={styles.input}
                                onChangeText={text => {
                                    this.setState({
                                        msg: text
                                    })
                                }}
                            />
                        </View>
                    </View>}
                    {/*提交*/}
                    <TouchableOpacity
                        style={[styles.submit, {backgroundColor: isReturn ? '#EBEBEB' : '#F23030'}]}
                        activeOpacity={1}
                        onPress={() => this.submit()}
                    >
                        <Text style={{color: isReturn ? '#333' : '#fff', fontSize: pxToDp(24)}}>
                            {I18n.t('CompanyStep6.submit')}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    submit: {
        marginHorizontal: pxToDp(35),
        height: pxToDp(80),
        borderRadius: pxToDp(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: pxToDp(45)
    },
    form: {
        backgroundColor: '#fff',
    },
    form_item: {
        paddingHorizontal: pxToDp(20),
        height: pxToDp(90),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#e9e9e9',
        borderStyle: 'solid',
    },
    input: {
        width: width / 2,
        height: pxToDp(70),
        borderRadius: pxToDp(10),
        backgroundColor: '#F5F5F5',
        paddingHorizontal: pxToDp(15),
        color: '#333',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: pxToDp(26),
        paddingVertical: 0
    },
    form_right: {
        alignItems: 'flex-end'
    },
    goods_list: {
        marginTop: pxToDp(20)
    },
    store_info: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(90),
        paddingHorizontal: pxToDp(30),
        backgroundColor: '#fff'
    },
    goods_item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pxToDp(20),
        height: pxToDp(158),
        paddingVertical: pxToDp(15),
        borderColor: '#e9e9e9',
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid'
    },
    num: {
        alignItems: 'flex-end',
        minWidth: pxToDp(150),
    },
})
