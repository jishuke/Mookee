/*
* 充值支付方式
* @slodon
* */
import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	NativeEventEmitter,
	Image,
	Text,
    DeviceInfo
} from 'react-native';
import * as WeChat from "react-native-wechat";
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from "../RequestData";
import CountEmitter from '../util/CountEmitter';
import KBZPayModule from '../util/KBZPayModule'
var Dimensions = require('Dimensions');
var {
	height,
	width
} = Dimensions.get('window');
import {I18n} from './../lang/index'
const KBZPayModuleEmitter = new NativeEventEmitter(KBZPayModule);

export default class SelReChargeMethod extends Component {
    constructor(props){
        super(props);
        this.state={
        	title:I18n.t('SelReChargeMethod.title'),
	        recharge_method:[],//充值方式
	        pdr_sn:typeof props.navigation.state.params.pdr_sn !== 'undefined' ? props.navigation.state.params.pdr_sn : '',//充值单号
	        pdr_amount:typeof props.navigation.state.params.pdr_amount !== 'undefined' ? props.navigation.state.params.pdr_amount : '',//充值金额
	        flag:0,
			payType: null //1: kbz
        }
        this.kbzPay = this.kbzPay.bind(this)
    }
    componentWillMount(){
    	  if(key){
		      this.getCZMethod();
    	  }else{
		      ViewUtils.navDetailPage(this.props.navigation,'Login');
	      }
    }

		componentDidMount() {
			this.listener = KBZPayModuleEmitter.addListener(
				'kbzPayCallback',
				(data) => {
					console.warn('ww:kbzPayCallback', data);
					if (data.code == '0'){
						ViewUtils.sldToastTip(I18n.t('hud.payS'));
						this.props.navigation.navigate('PaySuccess', {viewType:2});
					} else {
						ViewUtils.sldToastTip(I18n.t('hud.payF'));
					}
				}
			);
		};

		componentWillUnmount(){
			this.listener && this.listener.remove(); //记得remove哦
			this.listener = null;
		};

    kbzPay(data) {
			KBZPayModule.startPay(data.order_str, data.sign_type, data.order_sign, 'Mookee');
    }

		//获取可用的提现方式
	getCZMethod = () => {
			RequestData.getSldData(AppSldUrl + '/index.php?app=common&mod=getPaymentList&key='+key+'&paytype=predeposit&client=app')
				.then(result => {
					this.setState({
						flag:1
					});
					console.warn('ww:getCZMethod', result);
					if(result.state=== 200){
						this.setState({
							recharge_method:result.data
						});
					}
				})
				.catch(error => {
					this.setState({
						flag:1
					});
					ViewUtils.sldErrorToastTip(error);
				})
    }



	//充值完成
	czComplete = (type) => {
		const {pdr_amount} = this.state;
		if(type == 'success'){
			//通知更新
			CountEmitter.emit('updateRechargeList');
		}
		if(pdr_amount>0){
			this.props.navigation.pop(2);
		}else{
			this.props.navigation.pop(1);
		}

	}

	//充值
	selePayType = (payment_code) => {
    	const {pdr_sn,pdr_amount} = this.state;
    	const _this = this;
    	if(pdr_sn !== '' && typeof pdr_sn !== 'undefined'){
		    RequestData.postSldData(AppSldUrl+'/index.php?app=pay&mod=pay_'+payment_code+'_app',{payment_code:payment_code,key:key,pay_sn:pdr_sn,type:'app'})
			    .then(result=>{
				    if(result.datas.status === 0){
					    ViewUtils.sldToastTip(result.datas.msg);
				    }else{
				    	  if(payment_code === 'weixin'){
						      WeChat.pay({
							      partnerId: result.datas.result.partnerid,
							      prepayId: result.datas.result.prepayid,
							      nonceStr: result.datas.result.noncestr,
							      timeStamp: result.datas.result.timestamp,
							      package: result.datas.result.package,
							      sign: result.datas.result.sign
						      }).then(function(data){
							      _this.czComplete('success');
						      }, function (err) {
							      _this.czComplete('fail');
						      });
					      }else if(payment_code === 'kbz'){
				    	      console.log(payment_code,'payment_code')
                              this.kbzPay(result.datas.result.Response)

						      // Alipay.pay(result.datas.result).then(function(data){
							  //     _this.czComplete('success');
						      // }, function (err) {
							  //     _this.czComplete('fail');
						      // });

					      }

				    }
			    })
			    .catch(error=>{
				    ViewUtils.sldErrorToastTip(error);
			    })
	    }else{
					//生成充值单号
		    RequestData.postSldData(AppSldUrl+'/index.php?app=cash&mod=rechargeAction&key='+key,{pdr_amount:pdr_amount})
			    .then(result=>{
				    if(result.state === 255){
					    ViewUtils.sldToastTip(result.msg);
				    }else{
				    	  this.setState({
						      pdr_sn:result.data.pdr_sn
					      },()=>{
						      _this.selePayType(payment_code)
					      });
				    }
			    })
			    .catch(error=>{
				    ViewUtils.sldErrorToastTip(error);
			    })
	    }
    }

    render() {
        const {recharge_method, title, flag, payType} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
                <View style={GlobalStyles.space_shi_separate} />
                {
                    recharge_method.map((item,index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                style={{
                                    flexDirection:'row',
									justifyContent:'flex-start',
									alignItems:'center',
									width,
									height:50,
									borderBottomWidth:0.5,
									borderColor:'#eee',
									backgroundColor:"#fff",
									paddingLeft:15
								}}
                                onPress={() => {
                                	this.setState({payType: item.payment_code})
								}}
							>
                                {
                                	item.payment_code == 'kbz' && ViewUtils.getSldImg(43, 43, require( '../assets/images/pushHand/KBZ_pay.png'))
                                }
                                {
                                	ViewUtils.sldText(item.payment_name,'#555555',32,'300',30,0,0,0)
                                }
								{
									payType && payType === item.payment_code &&
                                    <Image
                                        style={{position: 'absolute', top: 15, right: 15, width: 20, height: 20}}
                                        source={require('../assets/images/paysele.png')}
                                        resizeMode={'contain'}
                                    />
								}
                                <Image
                                    style={{position: 'absolute', top: 10, right: 15, width: 30, height: 30}}
                                    source={payType && payType === item.payment_code ? require('../assets/images/paysele.png') : require('../assets/images/paynosele.png')}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        )
                    })
                }
                {
                	flag == 1 && recharge_method.length == 0 && ViewUtils.SldEmptyTip(require('../assets/images/emptysldcollect.png'), I18n.t('SelReChargeMethod.text1'))
                }
				<TouchableOpacity
					style={[styles.nextBtn, {backgroundColor: payType ? '#F5410C' : '#666'}]}
					activeOpacity={1.0}
					onPress={() => {
                        payType && this.selePayType(payType)
					}}
				>
					<Text style={{fontSize: 15, color: '#fff', textAlign: 'center'}}>{I18n.t('SelReChargeMethod.next')}</Text>
				</TouchableOpacity>
            </View>
		)
    }
}

const styles = StyleSheet.create({
	nextBtn: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: DeviceInfo.isIPhoneX_deprecated ? 34 : 0,
		left: 0,
		right: 0,
		height: 44
	}
});
