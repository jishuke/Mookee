import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Image, DeviceEventEmitter, TextInput
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import SldComStatusBar from '../component/SldComStatusBar';
import SldHeader from '../component/SldHeader';
import Modal from 'react-native-modalbox';
import styles from './stylejs/presale';
import LoadingWait from '../component/LoadingWait';
import Alipay from 'react-native-yunpeng-alipay';
import * as WeChat from 'react-native-wechat';
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

const scrWidth = Dimensions.get('window').width;
const psColor = '#FF0A50';


export default class PreSalePay extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: I18n.t('PointsConfirmOrder.confirm_payment'),
			order_sn: props.navigation.state.params.order_sn,
			p: props.navigation.state.params.p,
			type: props.navigation.state.params.type,
			paymentList: [],   // 支付方式,
			payment: '',      // 选中的支付方式
			predepoit: '',     // 余额
			disable: false,     // 余额支付是否可用,
			showWait: false,
			password: ''
		}
	}


	componentDidMount(){
		this.initData();
		this.lis_network = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.initData();
		});
	}

	componentWillUnmount(){
		this.lis_network.remove();
	}

	initData(){
		this.getPayMode();
		this.getAviailable();
	}

	// 获取支付方式
	getPayMode(){
		const {type, order_sn} = this.state;
		let url = type == 'presale' ? AppSldUrl + `/index.php?app=buy&mod=payment&sld_addons=presale&key=${ key }&order_sn=${ order_sn }&client_type=app`
			:
			AppSldUrl + `/index.php?app=buy_ladder&mod=payment&sld_addons=pin_ladder&key=${ key }&order_sn=${ order_sn }&client_type=app`;
		RequestData.getSldData(url).then(res => {
			if(res.status == 200){
				let list = res.data.payment;
				const imgs = {
					alipay: require('../assets/images/alipay.png'),
					predeposit: require('../assets/images/yue.png'),
					weixin: require('../assets/images/wechat.png')
				}
				list.forEach(el => {
					el.img = imgs[ el.payment_code ];
				})

				for(let i = 0; i < list.length; i++){
					if(list[ i ].payment_code == 'predeposit'){
						let el = list[ i ];
						list.splice(i, 1);
						list.push(el);
						break;
					}
				}
				this.setState({
					paymentList: list,
					payment: list[ 0 ].payment_code
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		})
	}

	// 获取余额
	getAviailable(){
		const {p} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=getMyAvailable&key=' + key).then(res => {
			this.setState({
				predepoit: res.datas.predepoit,
				disable: p * 1 <= res.datas.predepoit * 1 ? false : true
			})
		})
	}

	submit = () => {
		const {payment} = this.state;
		if(payment == 'predeposit'){
			this.refs.calendarstart.open();
		}else{
			this.pay();
		}
	}

	//余额支付
	endSubmit = () => {
		if(!this.state.password){
			ViewUtils.sldToastTip(I18n.t('Login.text8'));
		}else{
			this.pay();
		}
	}

	pay = ()=>{
		const {payment, order_sn, type,password} = this.state;
		this.setState({
			showWait: true
		})
		let params = {
			key: key,
			order_sn: order_sn,
			payment: payment,
			client: 'app'
		}
		if(payment == 'predeposit'){
			params.password = password;
		}
		let url = type == 'presale' ? AppSldUrl + '/index.php?app=buy&mod=topay&sld_addons=presale'
			:
			AppSldUrl + '/index.php?app=buy_ladder&mod=topay&sld_addons=pin_ladder';
		RequestData.postSldData(url, params).then(res => {
			if(res.status == 200){
				this.paySuccess();
			}else if(res.status == 255){
				this.payfail();
			}else if(res.status == 300){
				let payUrl = AppSldUrl + '/index.php';
				let url_param = res.url_param;
				for(let i in url_param){
					if(payUrl.indexOf('?') > -1){
						payUrl += `&${ i }=${ url_param[ i ] }`;
					}else{
						payUrl += `?${ i }=${ url_param[ i ] }`;
					}
				}
				if(payment == 'alipay'){
					this.aliPay(payUrl);
				}
				if(payment == 'weixin'){
					this.WeiXinPay(payUrl);
				}
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
			this.setState({
				showWait: false
			})
		})
	}

	aliPay(payUrl){
		let that = this;
		RequestData.getSldData(payUrl).then(res => {
			if(res.datas.status == 0){
				ViewUtils.sldToastTip(res.datas.msg);
			}else{
				Alipay.pay(res.datas.result).then(function(data){
					that.paySuccess();
				}, function(err){
					that.payfail()
				});
			}
		}).catch(error => {
			that.payfail();
			ViewUtils.sldErrorToastTip(error);
		})
	}

	WeiXinPay(payUrl){
		let that = this;
		RequestData.getSldData(payUrl).then(res => {
			if(res.datas.status == 0){
				ViewUtils.sldToastTip(res.datas.msg);
			}else{
				WeChat.pay({
					partnerId: res.datas.result.partnerid,
					prepayId: res.datas.result.prepayid,
					nonceStr: res.datas.result.noncestr,
					timeStamp: res.datas.result.timestamp,
					package: res.datas.result.package,
					sign: res.datas.result.sign
				}).then(function(data){
					that.paySuccess();
				}, function(err){
					that.payfail()
				});
			}
		}).catch(error => {
			that.payfail();
			ViewUtils.sldErrorToastTip(error);
		})
	}

	paySuccess(){
		const {type} = this.state;
		this.setState({
			showWait: false
		});
		ViewUtils.sldToastTip(I18n.t('LdjPay.text5'));
		let currentUrl = type=='presale'? 'PreSaleOrder' : 'PinLadderOrder';
		this.props.navigation.replace(currentUrl);
	}

	payfail(){
		this.setState({
			showWait: false
		}, () => {
			ViewUtils.sldToastTip(I18n.t('LdjPay.text6'));
		});
	}

	closeModal = () => {
		this.refs.calendarstart.close();
	}

	handleSldVal = (val) => {
		this.setState({
			password:val
		});
	}

	render(){
		const {title, paymentList, payment} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } title_color={ '#fff' } bgColor={ psColor }
				           left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<SldComStatusBar nav={ this.props.navigation } color={ psColor }/>
				<Text style={ styles.title }>{I18n.t('PreSalePay.Method')}</Text>
				<View style={ {flex: 1} }>
					{ paymentList.length > 0 && paymentList.map(el => <TouchableOpacity
						onPress={ () => {
							let mode = el.payment_code;
							const {disable} = this.state;
							if(mode == 'predeposit' && disable) return;
							this.setState({
								payment: mode
							})
						} }
						activeOpacity={ 1 }
						style={ styles.payList }
					>
						<View style={ styles.pay_l }>
							<Image
								resizeMode={ 'contain' }
								style={ {width: pxToDp(52), height: pxToDp(52), marginRight: pxToDp(45)} }
								source={ el.img }
							/>
							<View>
								<Text style={ {color: '#353535', fontSize: pxToDp(28), marginBottom: pxToDp(15)} }>{I18n.t('PreSalePay.amount_goods')}:
									ks{PriceUtil.formatPrice( this.state.p )}</Text>
								<View style={ {
									flexDirection: 'row',
									alignItems: 'center'
								} }>
									<Text style={ styles.pay_txt }>{ el.payment_name }</Text>
									{ el.payment_code == 'predeposit' && this.state.disable && <Text
										style={ [ styles.pay_txt, {marginLeft: pxToDp(30)} ] }>{I18n.t('PreSalePay.text5')}{ this.state.predepoit }</Text> }
								</View>
							</View>
						</View>

						{ !(el.payment_code == 'predeposit' && this.state.disable) && <View>
							<Image
								style={ {width: pxToDp(40), height: pxToDp(40)} }
								resizeMode={ 'contain' }
								source={ payment == el.payment_code ? require('../assets/images/preselect.png') : require('../assets/images/preunselect.png') }
							/>
						</View> }
					</TouchableOpacity>) }
				</View>

				<TouchableOpacity
					activeOpacity={ 1 }
					onPress={ this.submit }
					style={ styles.pay_btn }
				>
					<Text style={ {color: '#fff', fontSize: pxToDp(32), letterSpacing: pxToDp(10)} }>{I18n.t('ok')}</Text>
				</TouchableOpacity>

				<Modal
					backdropPressToClose={false}
					entry='bottom'
					position='bottom'
					coverScreen={true}
					swipeToClose={false}
					style={styles.sld_yue_modal}
					ref={"calendarstart"}>

					<View style={styles.sld_yue_modal_main}>
						<TouchableOpacity style={styles.sld_yue_modal_close_wrap}
						                  activeOpacity={1} onPress={() => this.closeModal()}>
							<Image style={styles.sld_yue_modal_close_img} source={require("../assets/images/close_window.png")}/>
						</TouchableOpacity>


						<View style={styles.sld_yue_modal_pay_wrap}>
							<Text style={[GlobalStyles.sld_global_font,styles.wrapper_part_text]}>{I18n.t('PreSalePay.payment_code')}：</Text>
							<TextInput
								style={[styles.wrapper_part_multi_input, GlobalStyles.sld_global_font]}
								underlineColorAndroid={'transparent'}
								autoCapitalize='none'
								autoFocus={true}
								secureTextEntry={true}
								returnKeyType='default'
								keyboardType='default'
								enablesReturnKeyAutomatically={true}
								onChangeText={(text) =>this.handleSldVal(text)}
								placeholder=''
							/>
						</View>
					</View>

					<TouchableOpacity activeOpacity={1} onPress={() => this.endSubmit()} style={styles.sld_submit_button}>
						<Text style={styles.sld_submit_button_text}>
						{I18n.t('ok')}
						</Text>
					</TouchableOpacity>
				</Modal>

				{
					this.state.showWait ? (
						<LoadingWait loadingText={ I18n.t('PaymentType.submit') } cancel={ () => this.setState({showWait: false}) }/>
					) : (null)
				}
			</View>
		)
	}
}


