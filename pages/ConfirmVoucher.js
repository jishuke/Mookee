/*
* 下单选择优惠券页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, ScrollView, Text, StyleSheet, DeviceEventEmitter, TouchableOpacity,Dimensions
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import SldRedSele from '../component/SldRedSele'
const {width,height} = Dimensions.get('window');
import {I18n} from './../lang/index'
export default class ConfirmVoucher extends Component {

    constructor(props) {
        super(props);
        console.info(3333,props);
        this.state = {
            title: I18n.t('ChooseCouponPage.title'),
            redList: props.navigation.state.params.red_list,
            sele_red_id: props.navigation.state.params.sele_red_id,
            isLoading: 0,
        }
    }

    componentDidMount() {
    }



    // 选择优惠券事件
    seleVoucher = (val) => {
        let {redList,sele_red_id} = this.state;
        let sele_val = ''
        if(val.red_id != sele_red_id){
            for(let i in redList){
                if(redList[i].id == val.id){
                    sele_val = val
                }
            }
        }
        DeviceEventEmitter.emit('updateVoucher', {red_info: sele_val});
        this.props.navigation.pop(1);
    }

    //不实用优惠券事件
    noSeleVoucher = () =>{
        DeviceEventEmitter.emit('updateVoucher', {red_info: {}});
        this.props.navigation.pop(1);
    }

    render() {
        const {title, redList, sele_red_id} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={[GlobalStyles.line, {marginBottom: pxToDp(30)}]}/>
                <ScrollView>
                    <View style={GlobalStyles.flex_common_row}>
                        <TouchableOpacity
                            style={[styles.noSeleWrap,GlobalStyles.flex_common_row]}
                            onPress={() => {
                                this.noSeleVoucher();
                            }}
                        >
                            <Text style={styles.noSeleWrapText}>暂不使用优惠券</Text>
                            <TouchableOpacity
                                style={[styles.noSeleWrapImg,GlobalStyles.flex_common_row]}
                                onPress={() => {
                                    this.noSeleVoucher();
                                }}
                            >
                                {ViewUtils.getSldImg(34,34,(sele_red_id==undefined||sele_red_id=='')?require('../assets/images/sld_no_sele_voucher_ok.png'):require('../assets/images/sld_no_sele_voucher.png'))}
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                {redList.length > 0 &&
                redList.map((item,index)=>{
                    return <SldRedSele
                        info={item}
                        key={index}
                        status={1}
                        sele_red_id = {sele_red_id}
                        seleVoucher={(val) => this.seleVoucher(val)}
                    />
                })
                }
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    err: {
        marginTop: pxToDp(200),
        alignItems: 'center',
    },
    noSeleWrap:{
        width:width-pxToDp(60),
        height:pxToDp(80),
        position:'relative',
        borderWidth:0.7,
        borderColor:'#c53b3b',
        borderStyle:'solid',
        marginBottom: 15,
    },
    noSeleWrapImg:{
        position: 'absolute',
        right:pxToDp(30),
        top:0,bottom:0,
        width:pxToDp(34),
        height:pxToDp(80),
    },
    noSeleWrapText:{
        color:"#c53b3b",
        fontSize:pxToDp(30),
    },
})
