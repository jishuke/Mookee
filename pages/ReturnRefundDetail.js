/*
* 退款退货页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, StyleSheet,ScrollView
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData'
import pxToDp from "../util/pxToDp";
import {I18n} from './../lang/index'

export default class ReturnRefundDetail extends Component {

    constructor(props) {

        super(props);
        this.state = {
            refund_id: this.props.navigation.state.params.refund_id,
            title: I18n.t('ReturnRefundList.title'),
            info: ''
        }
    }

    componentDidMount() {
        this.getRefundDetail();
    }

    // 获取退款退货详情
    getRefundDetail() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=get_refund_info&key=' + key + '&refund_id=' + this.state.refund_id).then(res => {
            if (res.code == 200) {
                this.setState({
                    info: res.datas
                })
            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
        })
    }

    render() {
        const {title, info} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                {info != '' && <ScrollView>
                    <View style={styles.item}>
                        <View style={styles.title}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.my')}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.ordernumber')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.order_sn}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.refundnumber')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.refund_sn}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.cause')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.buyer_message}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.refundamount')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.refund_amount}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.title}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.dispose')}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.status')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.seller_state}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.remark')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.seller_message}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.title}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.audit')}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.Platformtoconfirm')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.admin_state}</Text>
                        </View>

                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.admin_message')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.admin_message}</Text>
                        </View>
                    </View>

                    {info.detail_array!=null && <View style={styles.item}>
                        <View style={styles.title}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.Refundindetail')}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.refund_code')}</Text>
                            <Text style={{color: '#848689'}}>{info.detail_array.refund_code}</Text>
                        </View>

                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.pay_amount')}</Text>
                            <Text style={{color: '#848689'}}>{info.detail_array.pay_amount}</Text>
                        </View>

                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.pd_amount')}</Text>
                            <Text style={{color: '#848689'}}>{info.detail_array.pd_amount}</Text>
                        </View>
                    </View>}

                    {info.refund.express_name!='' && info.refund.invoice_no!=null && <View style={styles.item}>
                        <View style={styles.title}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.deliveryinformation')}</Text>
                        </View>
                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.express_name')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.express_name}</Text>
                        </View>

                        <View style={styles.txt}>
                            <Text style={styles.name}>{I18n.t('ReturnRefundList.invoice_no')}</Text>
                            <Text style={{color: '#848689'}}>{info.refund.invoice_no}</Text>
                        </View>
                    </View>}

                </ScrollView>}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    item:{
        marginTop: pxToDp(20),
        backgroundColor: '#fff',
    },
    title:{
        height: pxToDp(90),
        justifyContent: 'center',
        paddingHorizontal: pxToDp(20),
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        borderColor: '#E9E9E9'
    },
    txt:{
        height: pxToDp(90),
        paddingHorizontal: pxToDp(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        borderColor: '#E9E9E9'
    },
    name:{
        fontSize: pxToDp(24),
        color: '#252525'
    }
})
