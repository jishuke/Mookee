import SldHeaderLdj from "../../component/SldHeaderLdj";
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
	Image,
	Alert,
	DeviceEventEmitter, Platform, TextInput
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import SldComStatusBar from '../../component/SldComStatusBar'
import Alipay from 'react-native-yunpeng-alipay';
import * as WeChat from 'react-native-wechat';
import LoadingWait from '../../component/LoadingWait';
import PriceUtil from '../../util/PriceUtil'

const {width, height} = Dimensions.get('window');

let time = 0;

export default class LdjPay extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '支付收银台',
			pay_sn: props.navigation.state.params != undefined ? props.navigation.state.params.pay_sn : '',
			orderInfo: '',
			available_predeposit: 0,
			paymentlist: [],
			time_txt: '',
			pay_type: '',     // 支付方式
			isLoading: 0,
			password: ''
		}
	}

	componentDidMount(){
		this.initData();
	}

	componentWillUnmount(){
		clearInterval(this.timer);
	}

	initData(){
		let {pay_sn} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=pay_confirm&sld_addons=ldj&key=' + key + '&pay_sn=' + pay_sn + '&client=app').then(res => {
			if(res.status == 200){
				this.setState({
					orderInfo: res.data,
					available_predeposit: res.member_info.available_predeposit,
					paymentlist: res.paymentlist.data,
					pay_type: res.paymentlist.data[ 0 ].payment_code
				})
				if(res.data.surplus_time > 0){
					time = res.data.surplus_time;
					this.time_out();
					this.timer = setInterval(() => {
						this.time_out();
					}, 1000)
				}
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 倒计时
	time_out(){
		if(time == 0){
			clearInterval(this.timer);
			this.setState({
				time_txt: '超时已取消'
			})
		}
		let h = parseInt(time / 60 / 60);
		let m = parseInt(time / 60 % 60);
		let s = parseInt(time % 60);
		if(time > 0){
			h = h > 9 ? h : '0' + h;
			m = m > 9 ? m : '0' + m;
			s = s > 9 ? s : '0' + s;
			this.setState({
				time_txt: '剩余支付时间 ' + h + ':' + m + ':' + s
			})
			time--;
		}else{
			this.setState({
				time_txt: '超时已取消'
			})
		}
	}

	submit = () => {
		if(time <= 0){
			ViewUtils.sldToastTip('订单已失效');
			return;
		}
		const {pay_type} = this.state;
		if(pay_type == 'predeposit'){
			/*Alert.alert('提示', '确定使用余额支付', [
				{
					text: '取消',
					onPress: () => {

					},
					style: 'cancel'
				},
				{
					text: '确定',
					onPress: () => {
						this.setState({
							isLoading: 1
						});
						this.predepositPay();
					}
				}
			])*/
			this.setState({
				showModal: true
			})
		}else if(pay_type == 'alipay'){
			this.setState({
				isLoading: 1
			});
			this.alipayPay();
		}else if(pay_type == 'weixin'){
			this.setState({
				isLoading: 1
			});
			this.weixinPay();
		}
	}

	paySuccess(){
		this.setState({
			isLoading: 0
		}, () => {
			ViewUtils.sldToastTip('支付成功');
			DeviceEventEmitter.emit('orderlist');
			this.props.navigation.replace('LdjPaySuccess', {pay_sn: this.state.pay_sn});
		});
	}

	payfail(){
		this.setState({
			isLoading: 0
		}, () => {
			ViewUtils.sldToastTip('支付失败');
		});
	}

	// 余额支付
	predepositPay(){
		this.setState({
			isLoading: 1
		});
		let {pay_sn,password} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=pay&sld_addons=ldj&key=' + key + '&pay_sn=' + pay_sn + '&pay_type=predeposit&password='+password).then(res => {
			if(res.status = 200){
				this.paySuccess();
			}else{
				this.payfail();
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 支付宝
	alipayPay(){
		let {pay_sn} = this.state;
		let _this = this;
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=pay&sld_addons=ldj&key=' + key + '&pay_sn=' + pay_sn + '&pay_type=alipay&client=app').then(res => {
			if(res.status == 300){
				RequestData.getSldData(res.url).then(res2 => {
					if(res2.datas.status == 0){
						ViewUtils.sldToastTip(res2.datas.msg);
					}else{
						Alipay.pay(res2.datas.result).then(function(data){
							_this.paySuccess();
						}, function(err){
							_this.payfail();
						});
					}
				}).catch(error => {
					ViewUtils.sldErrorToastTip(error);
				})
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 微信
	weixinPay(){
		let {pay_sn} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=pay&sld_addons=ldj&key=' + key + '&pay_sn=' + pay_sn + '&pay_type=weixin&client=app').then(res => {
			if(res.status == 300){
				RequestData.getSldData(res.url).then(res2 => {
					if(res2.datas.status == 0){
						ViewUtils.sldToastTip(res2.datas.msg);
					}else{
						WeChat.pay({
							partnerId: res2.datas.result.partnerid,
							prepayId: res2.datas.result.prepayid,
							nonceStr: res2.datas.result.noncestr,
							timeStamp: res2.datas.result.timestamp,
							package: res2.datas.result.package,
							sign: res2.datas.result.sign
						}).then(function(data){
							this.paySuccess();
						}, function(err){
							this.payfail();
						});
					}
				}).catch(error => {
					ViewUtils.sldErrorToastTip(error);
				})
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	render(){
		const {title, orderInfo, paymentlist, pay_type, isLoading} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				<SldHeaderLdj
					left_icon_style={ {width: pxToDp(16), height: pxToDp(24), marginLeft: 15} }
					title={ title }
					title_color={ '#fff' }
					left_icon={ require('../images/back.png') }
					left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }
					bg_style={ {backgroundColor: '#5EB319'} }
				/>
				<View style={ styles.top }>
					<Text style={ {color: '#BFE3A2', fontSize: pxToDp(fontSize_24)} }>{ orderInfo.store_name }</Text>
					<Text style={ {color: '#fff', fontSize: pxToDp(fontSize_24), paddingVertical: pxToDp(20)} }>Ks<Text
						style={ {fontSize: pxToDp(42)} }>{ orderInfo.order_amount }</Text></Text>
					<Text style={ styles.status }>{ this.state.time_txt }</Text>
				</View>

				<View style={ styles.list }>
					{ paymentlist.length > 0 && paymentlist.map(el => <TouchableOpacity
						style={ styles.item }
						activeOpacity={ 1 }
						onPress={ () => {
							if((orderInfo.order_amount * 1 > this.state.available_predeposit * 1) && el.payment_code == 'predeposit') return;
							this.setState({
								pay_type: el.payment_code
							})
						} }
					>
						<View style={ styles.img }>
							<Image
								style={ {width: pxToDp(45), height: pxToDp(45)} }
								resizeMode={ 'contain' }
								source={ el.payment_code == 'alipay' ? require('../images/paymodezfb.png') : (el.payment_code == 'weixin' ? require('../images/paymodewx.png') : require('../images/paymodeye.png')) }
							/>
						</View>
						<View style={ styles.mode_info }>
							<Text style={ {
								color: ((orderInfo.order_amount * 1 > this.state.available_predeposit * 1) && el.payment_code == 'predeposit') ? '#999999' : '#333',
								fontSize: pxToDp(fontSize_32)
							} }>{ el.payment_name }</Text>
							{ el.payment_code == 'predeposit' && <View style={ styles.tip }>
								{ (orderInfo.order_amount * 1 > this.state.available_predeposit * 1) &&
								<Text>余额不足</Text> }
								<Text>可用余额ks{PriceUtil.formatPrice( this.state.available_predeposit )}</Text>
							</View> }
						</View>
						<Image
							style={ {width: pxToDp(40), height: pxToDp(40)} }
							resizeMode={ 'contain' }
							source={ pay_type == el.payment_code ? require('../images/select.png') : require('../images/noselect.png') }
						/>
					</TouchableOpacity>) }
				</View>

				<TouchableOpacity
					style={ styles.btn }
					activeOpacity={ 1 }
					onPress={ () => this.submit() }
				>
					<Text
						style={ {color: '#fff', fontSize: pxToDp(fontSize_32)} }>立即支付ks{PriceUtil.formatPrice( orderInfo.order_amount )}</Text>
				</TouchableOpacity>

				{ isLoading == 1 && <LoadingWait loadingText={ "提交中..." }/> }

				{this.state.showModal==true && <View style={styles.sld_yue_modal_main}>
					<View style={styles.modalheader}>
						<TouchableOpacity
							style={{padding: pxToDp(20)}}
							activeOpacity={1}
							onPress={()=>{
								this.setState({
									showModal: false
								})
							}}
						>
							<Image
								style={{width: pxToDp(16),height: pxToDp(20)}}
								resizeMode={'contain'}
								source={require('../images/back_b.png')}
							/>
						</TouchableOpacity>

						<Text style={{color: '#1C1C1C',fontSize: pxToDp(fontSize_30)}}>请输入密码</Text>
						<View/>
					</View>

					<View style={styles.modalMain}>
						<TextInput
							style={styles.input}
							underlineColorAndroid={'transparent'}
							autoCapitalize='none'
							autoFocus={true}
							secureTextEntry={true}
							returnKeyType='default'
							keyboardType='default'
							enablesReturnKeyAutomatically={true}
							onChangeText={(text) =>{
								this.setState({
									password: text
								})
							}}
							placeholder=''
						/>
					</View>

					<TouchableOpacity
						style={styles.modalBtn}
						activeOpacity={1}
						onPress={()=>this.predepositPay()}
					>
						<Text style={{color: '#fff',fontSize: pxToDp(fontSize_32)}}>确定</Text>
					</TouchableOpacity>
				</View>}

			</View>
		)
	}
}

const styles = StyleSheet.create({
	modal:{
		position: 'absolute',
		top: 0,
		left: 0,
		width: width,
		height: height,
		backgroundColor: 'rgba(0,0,0,0.5)',
		zIndex: 99,
		justifyContent: 'flex-end'
	},
	sld_yue_modal_main:{flexDirection:'column',backgroundColor: 'rgba(0,0,0,0.5)',width:width,paddingLeft:15,paddingTop:15,paddingRight:15,position:'relative'},

	modalheader:{
		height: pxToDp(90),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
	},
	modalMain:{
		backgroundColor: '#F2F2F2',
		padding: pxToDp(30),
	},
	input:{
		height: pxToDp(115),
		backgroundColor: '#fff',
		fontSize: pxToDp(30)
	},
	modalBtn:{
		height: pxToDp(80),
		backgroundColor: main_ldj_color,
		alignItems: 'center',
		justifyContent: 'center'
	},
	btn: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: pxToDp(28),
		height: pxToDp(76),
		backgroundColor: main_ldj_color,
		borderRadius: pxToDp(8),
		marginHorizontal: pxToDp(20),
		alignItems: 'center',
		justifyContent: 'center'
	},
	top: {
		height: pxToDp(200),
		width: width,
		backgroundColor: main_ldj_color,
		alignItems: 'center'
	},
	back: {
		position: 'absolute',
		top: 0,
		left: 0,
		padding: pxToDp(20),
	},
	status: {
		height: pxToDp(44),
		lineHeight: pxToDp(44),
		color: '#fff',
		fontSize: pxToDp(fontSize_24),
		paddingHorizontal: pxToDp(32),
		backgroundColor: '#53A015',
		borderRadius: pxToDp(22),
	},
	list: {
		backgroundColor: '#fff'
	},
	item: {
		height: pxToDp(120),
		paddingHorizontal: pxToDp(20),
		borderStyle: 'solid',
		borderBottomColor: '#EAEAEA',
		borderBottomWidth: pxToDp(1),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	img: {
		width: pxToDp(45),
		height: pxToDp(45),
		marginRight: pxToDp(30),
	},
	mode_info: {
		flex: 1,
	},
	tip: {
		flexDirection: 'row',
		alignItems: 'center',
		color: '#999',
		fontSize: pxToDp(fontSize_26),
		paddingTop: pxToDp(6),
	}
})
