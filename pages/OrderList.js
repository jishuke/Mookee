/*
* 订单列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Image, Text, TouchableOpacity, Alert,DeviceEventEmitter
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import SldFlatList from '../component/SldFlatList'
import pxToDp from '../util/pxToDp'
import styles from './stylejs/order'
import LoadingWait from "../component/LoadingWait";
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

const navData = [
    {
        name: 'OrderList.all',
        type: ''
    },
    {
        name: 'OrderList.obligation',
        type: '1'
    },
    {
        name: 'OrderList.sendthegoods',
        type: '256'
    },
    {
        name: 'OrderList.waitforreceiving',
        type: '1024'
    },
    {
        name: 'OrderList.evaluated',
        type: 'nocomment'
    }
]

export default class OrderList extends Component {

    constructor(props) {

        super(props);
        this.state = {
            sldOrderState: props.navigation.state.params != undefined ? props.navigation.state.params : '',//订单状态
            title:I18n.t('MyScreen.MyOrder') ,
            orderList: [],
            refresh: false,
            show_gotop: false,
            isLoading: 0,
            pn: 1,
            hasmore: true
        }
    }

    componentWillMount() {
        if (!key) {
            this.props.navigation.navigate('Login');
            return;
        }
        this.getOrderList();
        this.lister = DeviceEventEmitter.addListener('orderList',()=>{
            let {hasmore,pn} = this.state;
            if(hasmore){
               pn = pn - 1;
            }
            hasmore = true;
            this.setState({
                pn,hasmore
            },()=>{
                this.getOrderList();
            })
        })
        this.lister2 = DeviceEventEmitter.addListener('updateOrderList',()=>{
            this.setState({
                pn: 1,
                hasmore: true
            },()=>{
                this.getOrderList();
            })
        })
    }

    componentWillUnmount() {
        this.lister.remove();
        this.lister2.remove();
    }

    // 获取订单列表
    getOrderList() {
        let {sldOrderState,pn,hasmore} = this.state;
        RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=order_list_state&page=10&pn=' + pn, {
            key,
            s: sldOrderState,
        }).then(res => {
            console.log('获取订单列表:', res)
            this.setState({
                isLoading: 1
            })
            if (res.code == 200) {
                if (pn == 1) {
                    this.setState({
                        orderList: res.datas.order_group_list,
                    })
                } else {
                    let {orderList} = this.state;
                    this.setState({
                        orderList: orderList.concat(res.datas.order_group_list)
                    })
                }
                if (res.hasmore) {
                    pn++;
                } else {
                    hasmore = false;
                }
                this.setState({
                    pn,hasmore
                })
            }
        }).catch(err => {
            this.setState({
                isLoading: 1
            })
        })
    }

    refresh = () => {
        this.setState({
            pn: 1,
            hasmore: true
        },()=>{
            this.getOrderList();
        })
    }

    keyExtractor = (item, index) => {
        return index
    }

    handleScroll = (event) => {
        let offset_y = event.nativeEvent.contentOffset.y;
        let {show_gotop} = this.state;
        if (!show_gotop && offset_y > 100) {
            show_gotop = true
        }
        if (show_gotop && offset_y < 100) {
            show_gotop = false
        }
        this.setState({
            show_gotop: show_gotop,
        });
    }

    getNewData = () => {
        if (this.state.hasmore) {
            this.getOrderList();
        }
    }
    separatorComponent = () => {
        return (
            <View style={GlobalStyles.space_shi_separate}/>
        );
    }

    total(list) {
        let res = 0;
        list.map(el => {
            res += el.goods_num * 1;
        })
        return res;
    }

    // 切换分类
    changeNav = (type) => {
        this.setState({
            sldOrderState: type,
            isLoading: 0,
            pn: 1,
            hasmore: true
        }, () => {
            this.getOrderList();
        })
    }

    // 删除订单
    del = (id) => {
        let {orderList} = this.state;
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
                        order_id: id,
                        key
                    }).then(res => {
                        if (res.datas && res.datas == 1) {
                            for (let i = 0; i < orderList.length; i++) {
                                if (orderList[i].order_list[0].order_id == id) {
                                    orderList.splice(i, 1);
                                    break;
                                }
                            }
                            this.setState({
                                orderList
                            })
                            DeviceEventEmitter.emit('userCenter');
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
    confirm = (id) => {
        let {orderList, sldOrderState} = this.state;
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
                        order_id: id,
                        key
                    }).then(res => {
                        if (res.datas && res.datas == 1) {
                            if (sldOrderState != '') {
                                for (let i = 0; i < orderList.length; i++) {
                                    if (orderList[i].order_list[0].order_id == id) {
                                        orderList.splice(i, 1);
                                        break;
                                    }
                                }

                            } else {
                                for (let i = 0; i < orderList.length; i++) {
                                    if (orderList[i].order_list[0].order_id == id) {
                                        orderList[i].order_list[0].state_desc = I18n.t('PinLadderOrder.Completed');
                                        orderList[i].order_list[0].order_state = 40;
                                        orderList[i].order_list[0].if_receive = false;
                                        orderList[i].order_list[0].if_delete = true;
                                        orderList[i].order_list[0].evaluation_state = 0;
                                        break;
                                    }
                                }
                            }
                            this.setState({
                                orderList
                            })
                            DeviceEventEmitter.emit('userCenter');
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
    cancel = (id) => {
        let {orderList, sldOrderState} = this.state;
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
                            ViewUtils.sldToastTip(I18n.t('OrderList.text4'));
                            if (sldOrderState != '') {
                                for (let i = 0; i < orderList.length; i++) {
                                    if (orderList[i].order_list[0].order_id == id) {
                                        orderList.splice(i, 1);
                                        break;
                                    }
                                }

                            } else {
                                for (let i = 0; i < orderList.length; i++) {
                                    if (orderList[i].order_list[0].order_id == id) {
                                        orderList[i].order_list[0].state_desc = I18n.t('OrderList.canceled');
                                        orderList[i].order_list[0].order_state = 0;
                                        orderList[i].pay_amount = 0;
                                        orderList[i].order_list[0].if_cancel = false;
                                        orderList[i].order_list[0].if_delete = true;
                                        break;
                                    }
                                }
                            }
                            this.setState({
                                orderList
                            })
                            DeviceEventEmitter.emit('userCenter');
                        } else {
                            ViewUtils.sldToastTip(res.datas.error)
                        }
                    }).catch(err => {
                    })
                }
            }
        ])
    }

    buyAgain = id => {
         RequestData.postSldData(AppSldUrl+'/index.php?app=buy&mod=buyagain',{
             order_id:id,key:key
         }).then(res=>{
             if(res.status==200){
                 this.props.navigation.navigate('ConfirmOrder',{type: 'buyagain',cart_id: res.data,if_cart: 1});
             }else{
                 ViewUtils.sldToastTip(res.msg);
             }
         }).catch(err=>{

         })
    }

    renderCell = item => {
        return (
            <View>
                {item.order_list.map(store => <View style={styles.goods_list}>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: pxToDp(20),
                        backgroundColor: '#fff'
                    }}>
                        <TouchableOpacity
                            style={styles.store_info}
                            onPress={() => {
                                this.props.navigation.navigate('Vendor', {vid: store.vid})
                            }}
                        >
                            <Image source={require('../assets/images/sld_chat_go_shop.png')}
                                   style={{width: pxToDp(26), height: pxToDp(26), marginRight: pxToDp(15)}}/>
                            <Text style={{color: '#333', fontSize: pxToDp(28)}}>{store.store_name}</Text>
                            <Image source={require('../assets/images/arrow_right_b.png')}
                                   style={{
                                       width: pxToDp(20),
                                       height: pxToDp(20),
                                       marginLeft: pxToDp(15),
                                       tintColor: '#999'
                                   }}/>
                        </TouchableOpacity>
                        <Text style={{color: '#f23030', fontSize: pxToDp(26)}}>{store.state_desc}</Text>
                    </View>

                    {store.extend_order_goods.map(el => <TouchableOpacity
                        style={styles.goods_item}
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigation.navigate('OrderDetail', {orderid: store.order_id})
                        }}
                    >
                        <View
                            style={{width: pxToDp(128), height: pxToDp(128)}}
                        >
                            <Image source={{uri: el.goods_image_url}}
                                   style={{width: pxToDp(128), height: pxToDp(128)}}/>
                        </View>

                        <View
                            style={{flex: 1, paddingLeft: pxToDp(20)}}
                        >
                            <Text
                                ellipsizeMode={'tail'}
                                numberOfLines={2}
                            >
                                {el.goods_name}
                            </Text>
                        </View>

                        <View style={styles.num}>
                            <Text style={{color: '#333', fontSize: pxToDp(24)}}>Ks{PriceUtil.formatPrice(el.goods_price)}</Text>
                            <Text style={{color: '#555'}}>x{el.goods_num}</Text>
                        </View>
                    </TouchableOpacity>)}

                    <View style={styles.total}>
                        <View>
                            {store.promotion_type_str != '' || store.store_promotion_type_str != '' && <View style={{
                                paddingHorizontal: pxToDp(15),
                                height: pxToDp(50),
                                borderRadius: pxToDp(6),
                                backgroundColor: '#f23030',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {store.promotion_type_str != '' &&
                                <Text style={{color: '#fff'}}>{store.promotion_type_str}</Text>}
                                {store.store_promotion_type_str != '' &&
                                <Text style={{color: '#fff'}}>{store.store_promotion_type_str}</Text>}
                            </View>}
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{
                                color: '#252525',
                                fontSize: pxToDp(24)
                            }}>{this.total(store.extend_order_goods)}{I18n.t('OrderList.total')}</Text>
                            <Text style={{color: '#f15353', fontSize: pxToDp(24)}}>Ks
                                <Text style={{fontSize: pxToDp(24)}}>{PriceUtil.formatPrice(store.order_amount)}</Text>
                            </Text>
                            <Text style={{color: '#999', fontSize: pxToDp(22)}}>({I18n.t('OrderList.freight')}Ks{store.shipping_fee})</Text>
                        </View>
                    </View>

                    <View style={styles.order_btns}>
                        {item.pay_amount != null && item.pay_amount > 0 && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => {
                                this.props.navigation.navigate('PaymentType', {order_sn: item.pay_sn,order_id: item.order_id})
                            }}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.pay')}</Text>
                        </TouchableOpacity>}

                        {store.if_lock == true && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.reimburse')}...</Text>
                        </TouchableOpacity>}

                        {store.if_delete == true && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => this.del(store.order_id)}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderDetail.delete')}</Text>
                        </TouchableOpacity>}

                        {store.if_cancel == true && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => this.cancel(store.order_id)}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.cancellationoforder')}</Text>
                        </TouchableOpacity>}

                        {store.if_refund_cancel == true && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => {
                                this.props.navigation.navigate('OrderDetail', {orderid: store.order_id})
                            }}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.refund')}</Text>
                        </TouchableOpacity>}

                        {store.if_deliver == true && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => {
                                this.props.navigation.navigate('ViewOrderExpress', {orderid: store.order_id})
                            }}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.logistics')}</Text>
                        </TouchableOpacity>}

                        {store.if_receive == true && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => this.confirm(store.order_id)}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.confirmreceipt')}</Text>
                        </TouchableOpacity>}

                        {store.order_state == 30 && store.if_refund_cancel == 1 && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => {
                                this.props.navigation.navigate('OrderDetail', {orderid: store.order_id})
                            }}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.salesreturn')}</Text>
                        </TouchableOpacity>}

                        {store.order_state == 40 && store.evaluation_state == 0 && <TouchableOpacity
                            style={styles.order_btn}
                            activeOpacity={1}
                            onPress={() => {
                                this.props.navigation.navigate('OrderEvaluate', {orderid: store.order_id})
                            }}
                        >
                            <Text style={styles.order_btn_txt}>{I18n.t('OrderList.comment')}</Text>
                        </TouchableOpacity>}
                        {/*再来一单*/}
                        {
                            (store.order_state != 10 && store.payment_code != 'offline') || (store.payment_code == 'offline' && store.order_state != 10 && store.order_state != 20) && store.push_order_id == '0' &&
                            <TouchableOpacity
                                style={styles.order_btn}
                                activeOpacity={1}
                                onPress={() => this.buyAgain(store.order_id)}
                            >
                                <Text style={styles.order_btn_txt}>{I18n.t('OrderList.Anotherlist')}</Text>
                            </TouchableOpacity>
                        }
                    </View>

                </View>)}
            </View>
        )
    }

    render() {
        const {title, orderList, refresh, show_gotop} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                <View style={styles.nav}>
                    {navData.map(el => <TouchableOpacity
                        style={[styles.nav_item, {
                            borderColor: (this.state.sldOrderState == el.type ? '#f23030' : 'transparent')
                        }]}
                        onPress={() => this.changeNav(el.type)}
                    >
                        <Text style={{
                            fontSize: pxToDp(22),
                            color: (this.state.sldOrderState == el.type ? '#f23030' : '#333'),
                            textAlign: 'center'
                        }}>{I18n.t(el.name)}</Text>
                    </TouchableOpacity>)}
                </View>

                {orderList.length > 0 && <SldFlatList
                    data={orderList}
                    refresh_state={refresh}
                    show_gotop={show_gotop}
                    refresh={() => this.refresh()}
                    keyExtractor={() => this.keyExtractor()}
                    handleScroll={(event) => this.handleScroll(event)}
                    getNewData={() => this.getNewData()}
                    separatorComponent={() => this.separatorComponent()}
                    renderCell={(item) => this.renderCell(item)}
                />}

                {orderList.length == 0 && this.state.isLoading == 1 &&
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {ViewUtils.noData2({
                        title: I18n.t('OrderList.text5'),
                        tip: I18n.t('OrderList.text6'),
                        imgSrc: require('../assets/images/order_w.png'),
                        btnTxt: I18n.t('OrderList.text7'),
                        callback: () => {
                            this.props.navigation.navigate('GoodsSearchList', {keyword: '', catid: ''})
                        }
                    })}
                </View>}

                {this.state.isLoading == 0 && <LoadingWait loadingText={I18n.t('loading')} cancel={() => {
                }}/>}
            </View>
        )
    }
}
