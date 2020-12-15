import React, {Component, Fragment} from 'react'
import {
	Dimensions,
	View,
	TouchableOpacity,
	Image,
	Text,
	Alert,
	ScrollView,
	DeviceEventEmitter,
} from 'react-native'
import GlobalStyles from "../../assets/styles/GlobalStyles";
import ViewUtils from '../../util/ViewUtils'
import SldHeader from '../../component/SldHeader';
import RequestData from '../../RequestData';
import pxToDp from '../../util/pxToDp'
import styles from '../styles/order'
import SldComStatusBar from "../../component/SldComStatusBar";

const {width, height} = Dimensions.get('window');

export default class PointsOrderDetail extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '订单详情',
			order_id: props.navigation.state.params.id,
			address_info: '',
			orderInfo: ''
		}
	}

	componentDidMount(){
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			this.getOrderDetail();
			this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
				this.getOrderDetail();
			});
		}
	}

	componentWillUnmount(){
		this.emitter.remove();
	}

	getOrderDetail(){
		const {order_id} = this.state;
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=order_desc&sld_addons=points', {
			key,
			order_id,
		}).then(res => {
			if(res.status == 200){
				this.setState({
					address_info: res.data.address,
					orderInfo: res.data.orderinfo
				})
			}else{
				ViewUtils.sldToastTip(res.msg)
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 提交
	submit = () => {
		const {info, ifcart, cart_id} = this.state;
		if(Array.isArray(info.address_info)){
			ViewUtils.sldToastTip('请选择收货地址');
			return;
		}
		Alert.alert('提示', '确认支付', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					const address_id = info.address_info.address_id;
					RequestData.postSldData(AppSldUrl + '/index.php?app=points_buy&mod=submitorder&sld_addons=points', {
						key, ifcart, cart_id, address_id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip('支付成功');
							this.props.navigation.navigate('PointsOrder');
						}else{
							ViewUtils.sldToastTip(res.msg);
							this.props.navigation.navigate('PointsOrder', {s: 10});
						}
						DeviceEventEmitter.emit('updateOrder');
						DeviceEventEmitter.emit('updateCart');
					}).catch(err => {
						ViewUtils.sldErrorToastTip(err);
					})
				}
			}
		])
	}

	// 取消订单
	cancelOrder = (order_id) => {
		Alert.alert('提示', '确定取消该订单', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=rollbackorder&sld_addons=points', {
						key, order_id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip(res.msg);
							DeviceEventEmitter.emit('updateOrder');
							this.getOrderDetail();
						}else{
							ViewUtils.sldToastTip(res.msg)
						}
					}).catch(err => {
						ViewUtils.sldErrorToastTip(err);
					})
				}
			}
		])
	}

	// 去兑换
	goPay = (order_id) => {
		Alert.alert('提示', '确认兑换', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=gotopayorder&sld_addons=points', {
						key, order_id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip(res.msg);
							DeviceEventEmitter.emit('updateOrder');
							this.getOrderDetail();
						}else{
							ViewUtils.sldToastTip(res.msg)
						}
					}).catch(err => {
						ViewUtils.sldErrorToastTip(err);
					})
				}
			}
		])
	}

	// 再次兑换
	buyAgain = (order_id) => {
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=buyagainorder&sld_addons=points', {
			key, order_id
		}).then(res => {
			if(res.status == 200){
				DeviceEventEmitter.emit('updateCart');
				this.props.navigation.navigate('PointsCart');
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 确认收货
	confirmOrder = (order_id) => {
		Alert.alert('提示', '确认收货', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=confirmation&sld_addons=points', {
						key, order_id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip(res.msg);
							DeviceEventEmitter.emit('updateOrder');
							this.getOrderDetail();
						}else{
							ViewUtils.sldToastTip(res.msg)
						}
					}).catch(err => {
						ViewUtils.sldErrorToastTip(err);
					})
				}
			}
		])
	}

	render(){
		const {title, address_info, orderInfo} = this.state;
		return (<View style={ GlobalStyles.sld_container }>
			<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
			{/*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*/}
			<SldHeader title={ title }
			           left_icon={ require('../../assets/images/goback.png') }
			           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
			<View style={ GlobalStyles.line }/>

			<ScrollView>
				<View style={ styles.order_state }>
					{ orderInfo != '' && <Fragment>
						<View style={ styles.state_img }>
							<Image
								style={ {width: pxToDp(49), height: pxToDp(60)} }
								resizeMode={ 'contain' }
								source={ require('../images/dai56.png') }
							/>
						</View>
						<View style={ styles.state_info }>
							<Text style={ {
								color: '#333333',
								fontSize: pxToDp(30),
								marginBottom: pxToDp(20)
							} }>{ orderInfo.order_state }</Text>
							{
								orderInfo.point_orderstate == 10 &&
								<Text style={ styles.state_txt }>您的订单已提交，请在{ orderInfo.point_invalidtime }内支付完成，超时订单自动取消
									...</Text>
							}
							{
								(orderInfo.point_orderstate == 20 || orderInfo.point_orderstate == 11) &&
								<Fragment>
									<Text style={ styles.state_txt }>您的订单已付款，我们会尽快为您安排发货</Text>
									<Text style={ styles.state_txt }>{ orderInfo.point_addtimes }</Text>
								</Fragment>
							}
							{
								(orderInfo.point_orderstate == 30) &&
								<Fragment>
									<Text style={ styles.state_txt }>您的订单已发货，请注意留意物流信息及时收货</Text>
									<Text style={ styles.state_txt }>{ orderInfo.point_addtimes }</Text>
								</Fragment>
							}
							{
								(orderInfo.point_orderstate == 40 || orderInfo.point_orderstate == 50) &&
								<Text style={ styles.state_txt }>您的订单完成!</Text>
							}
							{
								(orderInfo.point_orderstate == 2) &&
								<Text style={ styles.state_txt }>您的订单已取消!</Text>
							}
						</View>
					</Fragment> }
				</View>

				<View style={ styles.address }>
					<Image
						style={ {width: width, height: pxToDp(4)} }
						source={ require('../images/addr.png') }
					/>
					<View style={ styles.address_info }>
						<View style={ styles.addr_left }>
							<View style={ styles.name }>
								<Text style={ [ styles.font32, {
									marginRight: pxToDp(15)
								} ] }>{ address_info != '' ? address_info.point_truename : '' }</Text>
								<Text
									style={ styles.font32 }>{ address_info != '' ? address_info.point_mobphone : '' }</Text>
							</View>
							<Text style={ {
								color: '#666666',
								fontSize: pxToDp(28)
							} }>
								{ address_info != '' ? address_info.point_areainfo : '' }
								{ address_info != '' ? address_info.point_address : '' }
							</Text>
						</View>
					</View>
				</View>

				<View style={ styles.goods_list }>
					{ orderInfo != '' && orderInfo.order_goods.map(el => <TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.goods_item }
						onPress={ () => {
							this.props.navigation.navigate('PointsGoodsDetail', {gid: el.point_goodsid})
						} }
					>
						<View style={ styles.goods_img }>
							<Image
								resizeMode={ 'contain' }
								style={ {width: pxToDp(140), height: pxToDp(140)} }
								defaultSource={require('../../assets/images/default_icon_124.png')}
								source={ {uri: el.image} }
							/>
						</View>
						<View style={ styles.goods_info }>
							<View style={ styles.bw }>
								<Text
									ellipsizeMode={ 'tail' }
									numberOfLines={ 1 }
									style={ [ styles.font32, {
										width: pxToDp(300)
									} ] }
								>{ el.point_goodsname }</Text>
								<Text
									style={ {color: '#333333', fontSize: pxToDp(28)} }>{ el.point_goodspoints }积分</Text>
							</View>
							<View style={ {alignItems: 'flex-end', marginTop: pxToDp(15)} }>
								<Text style={ {color: '#666666', fontSize: pxToDp(28)} }>x{ el.point_goodsnum }</Text>
							</View>
						</View>
					</TouchableOpacity>) }
				</View>

				<View style={ styles.total }>
					<View style={ styles.order_info }>
						<View style={ [ styles.bw, {height: pxToDp(60)} ] }>
							<Text style={ styles.font32 }>商品总计</Text>
							<Text style={ styles.font32 }>{ orderInfo != '' ? orderInfo.point_allpoint : '--' }积分</Text>
						</View>
						<View style={ [ styles.bw, {height: pxToDp(60)} ] }>
							<Text style={ styles.font32 }>运费</Text>
							<Text style={ styles.font32 }>免运费</Text>
						</View>
					</View>
					<View style={ styles.price }>
						<Text
							style={ styles.price_txt }>合计应付：{ orderInfo != '' ? orderInfo.point_allpoint : '--' }积分</Text>
					</View>
				</View>
			</ScrollView>

			{
				orderInfo != '' && orderInfo.point_orderstate == 10 && <View style={ styles.footer }>
					<Text style={ styles.footer_txt }>共{ orderInfo != '' ? orderInfo.goods_number : '--' }件，应付：<Text
						style={ {color: '#C43D3A'} }>{ orderInfo != '' ? orderInfo.point_allpoint : '--' }积分</Text></Text>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.submit }
						onPress={ () => this.submit() }
					>
						<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>去兑换</Text>
					</TouchableOpacity>
				</View>
			}

			{ orderInfo != '' && <View style={ styles.btns }>
				{ (orderInfo.point_orderstate == 10 || orderInfo.point_orderstate == 11 || orderInfo.point_orderstate == 20) &&
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.btn }
					onPress={ () => this.cancelOrder(orderInfo.point_orderid) }
				>
					<Text style={ styles.btn_txt }>取消订单</Text>
				</TouchableOpacity> }

				{ (orderInfo.point_orderstate == 10) && <TouchableOpacity
					activeOpacity={ 1 }
					style={ [ styles.btn, styles.red_btn ] }
					onPress={ () => this.goPay(orderInfo.point_orderid) }
				>
					<Text style={ [ styles.btn_txt, styles.red_btn_txt ] }>去兑换</Text>
				</TouchableOpacity> }

				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.btn }
					onPress={ () => this.buyAgain(orderInfo.point_orderid) }
				>
					<Text style={ styles.btn_txt }>再次兑换</Text>
				</TouchableOpacity>

				{ (orderInfo.point_orderstate == 30) && <TouchableOpacity
					activeOpacity={ 1 }
					style={ [ styles.btn, styles.red_btn ] }
					onPress={ () => this.confirmOrder(orderInfo.point_orderid) }
				>
					<Text style={ [ styles.btn_txt, styles.red_btn_txt ] }>确认收货</Text>
				</TouchableOpacity> }
			</View> }

		</View>)
	}
}
