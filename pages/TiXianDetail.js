/*
* 提现详情页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View
} from 'react-native';
import pxToDp from '../util/pxToDp';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import ViewUtils from '../util/ViewUtils';
// 导入Dimensions库
var Dimensions = require('Dimensions');
import {I18n} from './../lang/index'
const {width,height} = Dimensions.get('window');
export default class TiXianDetail extends Component {

    constructor(props){
        super(props);
        this.state={
	        title:I18n.t('TiXianList.title1'),
	        id:props.navigation.state.params.id,
	        data:{},//详情信息
    }
    }
    componentWillMount() {
	    if(key){
		    this.getTiXianDetail();
	    }else{
		    ViewUtils.navDetailPage(this.props.navigation,'Login');
	    }
    }


		//获取提现详情
		getTiXianDetail = () => {
			RequestData.getSldData(AppSldUrl + "/index.php?app=cash&mod=getCashApplyLogInfo&key="+key+'&id='+this.state.id)
				.then(result => {
					if(result.state!=200){
						ViewUtils.sldToastTip(result.msg);
					}else {
						this.setState({
							data:result.data
						});
					}
				})
				.catch(error => {
					ViewUtils.sldErrorToastTip(error);
				})
		}


    render() {
	    const {title,data} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
	            <View style={{width:width,paddingLeft:pxToDp(30),paddingRight:pxToDp(30),paddingTop:pxToDp(18)}}>
		            {ViewUtils.sldText(I18n.t('TiXianList.pdc_sn')+'：'+data.pdc_sn,'#605F60',28,'300',0,15,0)}
		            {ViewUtils.sldText(I18n.t('TiXianList.pdc_amount')+'：'+data.pdc_amount*1,'#605F60',28,'300',0,15,0)}
		            {ViewUtils.sldText(I18n.t('TiXianList.pdc_payment_fee')+'：'+data.pdc_payment_fee*1,'#605F60',28,'300',0,15,0)}
		            {ViewUtils.sldText(I18n.t('TiXianList.paymentterm')+'：'+data.pdc_bank_name,'#605F60',28,'300',0,15,0)}
		            {ViewUtils.sldText(I18n.t('TiXianList.accountnumber')+'：'+data.pdc_bank_no,'#605F60',28,'300',0,15,0)}
		            {ViewUtils.sldText(I18n.t('TiXianList.name')+'：'+data.pdc_bank_user,'#605F60',28,'300',0,15,0)}
		            {ViewUtils.sldText(I18n.t('TiXianList.pdc_add_time_str')+'：'+data.pdc_add_time_str,'#605F60',28,'300',0,15,0)}
		            {data.pdc_payment_state==1&&(
			            ViewUtils.sldText(I18n.t('TiXianList.pdc_payment_time_str')+'：'+data.pdc_payment_time_str,'#605F60',28,'300',0,15,0)
		            )}
		            {ViewUtils.sldText(I18n.t('TiXianList.pdc_payment_state_desc')+'：'+data.pdc_payment_state_desc,'#605F60',28,'300',0,15,0)}
		            {data.pdc_payment_state==-1&&ViewUtils.sldText(I18n.t('TiXianList.pdc_refuse_desc')+'：'+data.pdc_refuse_desc,'#605F60',28,'300',0,15,0)}
	            </View>
            </View>
        )
    }
}
