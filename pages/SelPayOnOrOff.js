/*
 * 确定订单页面
 * @slodon
 * */
import React , { Component  } from 'react';
import {
	View , Text , TouchableOpacity,DeviceEventEmitter
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import ComStyle from "../assets/styles/ComStyle";
import {I18n} from './../lang/index'


export default class SelPayOnOrOff extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title : I18n.t('PreSalePay.Method') ,//页面标题
			sel_pay_code : props.navigation.state.params.sel_method ,
			offpay:props.navigation.state.params.allowOffPay
		}
	}

	pay_info = [ {
		pay_code : 'online' ,
		pay_name : '在线支付' ,
	}];

	componentWillMount () {

	}

	//选择支付方式
	sele_method = (pay_code) => {
		//通知上一页更新数据并返回
		DeviceEventEmitter.emit('updatePayMethod', {pay_code: pay_code,});
		this.props.navigation.goBack();

	}


	render () {
		const { title , sel_pay_code ,offpay} = this.state;
		if(offpay=='1')
		{
			this.pay_info.push({
				pay_code : 'offline' ,
				pay_name :  I18n.t('SelPayOnOrOff.cash_delivery'),
			})
		}
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>
				<View style={ComStyle.sele_pay_method_view}>
					<Text style={ { color : '#333333' , fontSize : pxToDp ( 26 ) , fontWeight : '400' } }>{I18n.t('SelPayOnOrOff.pattern_payment')}</Text>

				<View style={ { flexDirection : 'row' , width : '100%' , justifyContent : 'flex-start' } }>
					{
						this.pay_info.map(( item , index ) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={ 1 }
                                    style={ [ ComStyle.com_btn , { backgroundColor : sel_pay_code == item.pay_code ? '#F23030' : "#fff",marginRight:index==0?20:0 } ] }
                                    onPress={ () => this.sele_method(item.pay_code) }
                                >
                                    <Text
                                        style={ [ ComStyle.com_btn_text , { color : sel_pay_code == item.pay_code ? '#fff' : "#666" } ] }>{ item.pay_name }</Text>
                                </TouchableOpacity>
							)
                        })
					}
				</View>
				</View>
			</View>
		)
	}
}
