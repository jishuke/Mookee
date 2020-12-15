/*
* 退款退货发货页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData'
import pxToDp from "../util/pxToDp";
import CountEmitter from "../util/CountEmitter";
import Modal from "react-native-modalbox";
var Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
import {I18n} from './../lang/index'
export default class ReturnRefundSend extends Component {

    constructor(props) {

        super(props);
        this.state = {
            refund_id: 0,
            title: I18n.t('ReturnRefundSend.title'),
            expressList: [],
            info: '',
            detail: '',
            express: I18n.t('ReturnRefundSend.selectcompany'),
            ex_id: '',
            express_sn: ''
        }
    }

    componentDidMount() {
        let params = this.props.navigation.state;
        if (params.params != 'undefined') {
            this.setState({
                refund_id: params.params.refund_id,
            }, () => {
                this.getSendInfo();
            });
        }
    }

    // 获取发货信息
    getSendInfo() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=get_refund_info&key=' + key + '&refund_id=' + this.state.refund_id).then(res => {
            if (res.code == 200) {
                this.setState({
                    expressList: res.datas.express_list,
                    info: res.datas.refund,
                    detail: res.datas
                })
            }
        })
    }

    submit = () => {
        let {ex_id,refund_id,express_sn} = this.state;
        if(!ex_id){
            ViewUtils.sldToastTip(I18n.t('ReturnRefundSend.text1'));
            return;
        }

        if(!express_sn){
            ViewUtils.sldToastTip(I18n.t('ReturnRefundSend.text2'));
            return;
        }
        RequestData.postSldData(AppSldUrl+'/index.php?app=userorder&mod=update_fahuo',{
            wuliu_company: ex_id,
            key,
            id: refund_id,
            refund_wuliu_order: express_sn
        }).then(res=>{
            if (res.datas.state == "failuer") {
                ViewUtils.sldToastTip(res.datas.error)
            }else{
                ViewUtils.sldToastTip(I18n.t('ReturnRefundSend.text3'));
                CountEmitter.emit('refund');
                this.props.navigation.pop();
            }
        }).catch(error=>{
            ViewUtils.sldErrorToastTip(error);
        })
    }
//选择物流公司
    selectExpress(itemValue){
        this.refs.exchange.close();
        this.setState({
            express: itemValue.value,
            ex_id: itemValue.id,
        })


    }

    render() {
        const {title, detail, expressList} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                <View>
                    <View style={ styles.item }>
                        <TouchableOpacity
                            activeOpacity={ 1 }
                            onPress={ () => this.refs.exchange.open() }
                        >
                            <Text
                                placeholder={ I18n.t('ReturnRefundSend.selectcompany') }
                                style={ [ styles.input, {
                                    color: (this.state.ex_id == '' ? '#999' : '#333'),
                                    lineHeight: pxToDp(70)
                                } ] }
                            >{ this.state.express }</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal
                        backdropPressToClose={true}
                        entry='bottom'
                        position='bottom'
                        coverScreen={true}
                        swipeToClose={false}
                        style={styles.modal}
                        ref={"exchange"}
                    >
                        {/*选择物流公司*/}
                        <ScrollView style={styles.modal_list}>
                            {expressList.length > 0 && expressList.map((el, id)=>
                                <View key={id}  style={styles.list_item_wrap}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.list_item}
                                        onPress={() => this.selectExpress(el)}
                                    >
                                        <Text style={{color: '#666', fontSize: pxToDp(28),marginLeft:pxToDp(10)}}>{el.value}</Text>
                                    </TouchableOpacity>
                                </View>)}
                        </ScrollView>
                    </Modal>

                    <View style={GlobalStyles.line}/>

                    <View style={styles.item}>
                        <TextInput
                            placeholder={I18n.t('ReturnRefundSend.text4')}
                            style={styles.input}
                            underlineColorAndroid={'transparent'}
                            onChangeText={text=>{
                                this.setState({
                                    express_sn: text
                                })
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => this.submit()}
                    >
                        <Text style={{color: '#fff', fontSize: pxToDp(28)}}>{I18n.t('ReturnRefundSend.submit')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        height: pxToDp(90),
        justifyContent: 'center',
        borderColor: '#e9e9e9',
        paddingHorizontal: pxToDp(30)
    },
    input: {
        height: pxToDp(70),
        backgroundColor: '#F5F5F5',
        fontSize: pxToDp(26),
        width: pxToDp(360),
        borderRadius: pxToDp(10),
        paddingHorizontal: pxToDp(15),
        justifyContent: 'center',
        paddingVertical: 0
    },
    picker: {
        position: 'absolute',
        top: pxToDp(10),
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
    },
    btn: {
        height: pxToDp(90),
        marginHorizontal: pxToDp(45),
        backgroundColor: '#F23030',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(10),
        marginTop: pxToDp(50),
    },
    modal_list:{
        paddingHorizontal: pxToDp(15)
    },
    list_item_wrap: {
        flexDirection: 'row',
        marginBottom: pxToDp(80)
    },
    modal:{
        backgroundColor: "#fff",
        position: "absolute",
        left: 0,
        right: 0,
        width: width,
        height:height/2,
    },
})
