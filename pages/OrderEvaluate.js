/*
* 订单评价页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, DeviceEventEmitter
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from '../util/pxToDp';
import SldRate from '../component/SldRate';
import RequestData from '../RequestData';
import {I18n} from './../lang/index'

export default class OrderEvaluate extends Component {

    constructor(props) {

        super(props);
        this.state = {
            sldOrderId: 0,//订单id
            title: '订单评价',
            orderInfo: '',
            m_score: 5,   // 描述评分
            f_score: 5,   // 服务评分
            h_score: 5,   // 发货评分
            btnTxt: '提交评价'
        }
    }

    canClick = true

    componentWillMount() {
        let params = this.props.navigation.state;
        if (params.params != 'undefined') {
            this.setState({
                sldOrderId: params.params.orderid,
            }, () => {
                this.getOrderInfo();
            });
        }
        this.lis_update = DeviceEventEmitter.addListener('updateEvaluate', () => {
            this.getOrderInfo();
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.lis_update.remove()
    }


    // 获取订单信息
    getOrderInfo() {
        let {sldOrderId} = this.state;
        RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=order_info&key=' + key + '&order_id=' + sldOrderId).then(res => {
            if (res.code == 200) {
                let orderInfo = res.datas.order_info;
                if(orderInfo.commentStoreInfo){
                    this.setState({
                        m_score: orderInfo.commentStoreInfo.seval_desccredit,
                        f_score: orderInfo.commentStoreInfo.seval_servicecredit,
                        h_score: orderInfo.commentStoreInfo.seval_deliverycredit,
                    })
                }
                this.setState({
                    orderInfo: orderInfo
                })
            }
        })
    }


    // 提交评价
    submit = () => {
        if (!this.canClick) {
            return
        }
        this.canClick = false

        if (this.state.orderInfo.store_comment_status != 0) {
            return;
        }
        let {m_score, f_score, h_score, sldOrderId} = this.state;
        RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=StoreComment', {
            key,
            order_id: sldOrderId,
            store_deliverycredit: h_score,
            store_desccredit: m_score,
            store_servicecredit: f_score
        }).then(res => {
            this.canClick = true
            if (res.datas.state == "failuer") {
                ViewUtils.sldToastTip(res.datas.msg);
                return false
            }
            DeviceEventEmitter.emit('orderList');
            DeviceEventEmitter.emit('userCenter');
            ViewUtils.sldToastTip(res.datas.info);
            let {orderInfo} = this.state;
            orderInfo.store_comment_status = 1;
            this.setState({
                orderInfo: orderInfo
            })
            setTimeout(() => {
                this.props.navigation.goBack()
            }, 800)
        }).catch(err => {
            this.canClick = true
        })
    }

    render() {
        const {title, orderInfo} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                {orderInfo != '' && <ScrollView>
                    <View style={[styles.rate, {paddingTop: pxToDp(20)}]}>
                        <Text style={styles.rate_txt}>{I18n.t('VendorInstro.describe')}</Text>
                        <SldRate
                            score={this.state.m_score}
                            disable={orderInfo.commentStoreInfo!=''?true:false}
                            change={(score) => {
                                this.setState({
                                    m_score: score
                                })
                            }}
                        />
                    </View>

                    <View style={styles.rate}>
                        <Text style={styles.rate_txt}>{I18n.t('VendorInstro.serve')}</Text>
                        <SldRate
                            score={this.state.f_score}
                            disable={orderInfo.commentStoreInfo!=''?true:false}
                            change={(score) => {
                                this.setState({
                                    f_score: score
                                })
                            }}
                        />
                    </View>

                    <View style={[styles.rate, {paddingBottom: pxToDp(20)}]}>
                        <Text style={styles.rate_txt}>{I18n.t('VendorInstro.shipments')}</Text>
                        <SldRate
                            score={this.state.h_score}
                            disable={orderInfo.commentStoreInfo!=''?true:false}
                            change={(score) => {
                                this.setState({
                                    h_score: score
                                })
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.btn, {backgroundColor: (orderInfo.store_comment_status == 0 ? '#F23030' : '#b5b5b5')}]}
                        activeOpacity={1}
                        onPress={() => this.submit()}
                    >
                        <Text style={{
                            color: '#fff',
                            fontSize: pxToDp(26)
                        }}>{orderInfo.store_comment_status == 0 ? I18n.t('OrderEvaluate.btntext'):I18n.t('OrderEvaluate.Haveevaluation')}</Text>
                    </TouchableOpacity>

                    {orderInfo.goods_list.map((el, index) =>
                        <View
                            key={index}
                            style={styles.goods}
                        >
                        <Image
                            style={{width: pxToDp(120), height: pxToDp(120)}}
                            resizeMode={'contain'}
                            source={{uri: el.goods_image_url}}
                        />
                        <Text
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={{
                                color: '#232326',
                                fontSize: pxToDp(26),
                                flex: 1,
                                paddingLeft: pxToDp(20)
                            }}
                        >{el.goods_name}</Text>

                        <TouchableOpacity
                            style={styles.goods_btn}
                            activeOpacity={1}
                            onPress={(() => {
                                if(el.comment_status!=1){
                                    this.props.navigation.navigate('OrderGoodsEvaluate', {
                                        orderid: this.state.sldOrderId,
                                        gid: el.rec_id
                                    })
                                }
                            })}
                        >
                            <Text style={{color: '#686868'}}>{el.comment_status==1?I18n.t('OrderEvaluate.orderevaluate'):I18n.t('OrderEvaluate.Baskinasingle')}</Text>
                        </TouchableOpacity>
                    </View>)}
                </ScrollView>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    goods: {
        flexDirection: 'row',
        paddingHorizontal: pxToDp(20),
        paddingVertical: pxToDp(30),
        height: pxToDp(180),
        borderStyle: 'solid',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: pxToDp(1),
    },
    goods_btn: {
        position: 'absolute',
        bottom: pxToDp(15),
        right: pxToDp(20),
        width: pxToDp(190),
        height: pxToDp(60),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(6),
        borderColor: '#bfbfbf',
        borderStyle: 'solid',
        borderWidth: pxToDp(1),
    },
    rate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(80),
        backgroundColor: '#fff'
    },
    rate_txt: {
        color: '#232326',
        fontSize: pxToDp(26),
        marginRight: pxToDp(60)
    },
    btn: {
        marginHorizontal: pxToDp(30),
        height: pxToDp(80),
        borderRadius: pxToDp(10),
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: pxToDp(20),
    }
})
