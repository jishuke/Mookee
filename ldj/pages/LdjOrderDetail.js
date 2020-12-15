import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Image,
	Alert,
	DeviceEventEmitter, Platform, ScrollView, Clipboard, Linking
} from 'react-native';
// import {Geolocation} from "react-native-amap-geolocation/lib/js/index";
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import SldFlatList from "../../component/SldFlatList";
import SldComStatusBar from '../../component/SldComStatusBar';
import store from '../styles/store';
import SldHeaderLdj from "../../component/SldHeaderLdj";
import styles from '../styles/order';
//import {MapView, Polyline, Marker} from 'react-native-amap3d'
import PriceUtil from '../../util/PriceUtil'

const {width, height} = Dimensions.get('window');

let pn = 1;
let hasmore = true;
let time = 0;

export default class LdjOrderDetail extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '订单详情',
			orderList: [],
			show_gotop: false,
			refresh: false,
			isLoading: 0,
			order_id: props.navigation.state.params.order_id,//订单id
			order_detail: {},//订单详情
			showMore: false,     // 显示更多商品
			time_out_txt: '',
			show_map: false,
			cur_location: {
				latitude: 39.906901,
				longitude: 116.397972,
			},
			distance: 0,//起始点距离
			showCall: false
		}
		ViewUtils.initLocationMust();
	}

	cur_location = {
		latitude: 39.906901,
		longitude: 116.397972,
	};
	destin_location = {
		latitude: 39.906901,
		longitude: 116.397972,
	};
	flag = false;

	componentDidMount(){
		if(key){
			this.getOrderDetail();
		}
		// Geolocation.addLocationListener(location => {
		// 	this.setState({
		// 		cur_location: location
		// 	});
		// 	Geolocation.stop()
		// })
		this.lis_network =
			DeviceEventEmitter.addListener('updateNetWork', () => {
				this.getOrderDetail();
			});
	}


	componentWillUnmount(){
		clearInterval(this.timer);
		this.lis_network.remove()
	}

	_logLocationEvent = ({nativeEvent}) => this._log('onLocation', nativeEvent)

	_log(event, data){
		let params = {};
		if(event == 'onLocation' && !this.flag){
			params.latitude = data.latitude;
			params.longitude = data.longitude;
			this.flag = true;
		}
		if(Object.getOwnPropertyNames(params).length != 0){
			this.cur_location = params;
			this.getRoute();
			this.setState({
				cur_location: params
			});
		}
	}

	// 获取订单详情
	getOrderDetail(){
		let {order_id, show_map} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=order_desc&sld_addons=ldj&key=' + key + '&order_id=' + order_id).then(res => {
			if(res.status == 200){
				if(res.data.order_state == 10 && res.data.surplus_time > 0){
					time = res.data.surplus_time;
					this.time_out()
					this.timer = setInterval(() => {
						this.time_out();
					}, 1000)
				}
				if(res.data.express_type == 1 && (res.data.order_state == 30 || res.data.order_state == 20 || res.data.order_state == 40)){
					show_map = true;
				}else{
					show_map = false;
				}
				this.destin_location = {
					latitude: res.data.dian_lat * 1,
					longitude: res.data.dian_lng * 1,
				};
				// this.getRoute();
				this.setState({
					order_detail: res.data,
					show_map: show_map
				})
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	//根据起终点坐标规划步行路线
	getRoute = () => {
		this.setState({
			distance: ViewUtils.getStoreDistance(this.cur_location.longitude + ',' + this.cur_location.latitude, this.destin_location.longitude + ',' + this.destin_location.latitude)
		});

	}

	time_out(){
		if(time == 0){
			clearInterval(this.timer);
			this.setState({
				time_out_txt: ''
			})
		}
		let h = parseInt(time / 60 / 60);
		let m = parseInt(time / 60 % 60);
		let s = parseInt(time % 60);
		if(time > 0){
			h = h > 9 ? h : '0' + h;
			m = m > 9 ? m : '0' + m;
			s = s > 9 ? s : '0' + s;
			let show_str = '去支付（还剩';
			if(h > 0){
				show_str += h + '时'
			}
			if(m > 0){
				show_str += m + '分'
			}
			if(s > 0){
				show_str += s + '秒）'
			}
			this.setState({
				time_out_txt: show_str
			})
			time--;
		}
	}

	refresh = () => {
		pn = 1;
		hasmore = true;
		this.getOrderList();
	}

	getNewData = () => {
		if(hasmore){
			this.getOrderList()
		}
	}


	// 取消订单
	cancelOrder = (id) => {
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
					RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=order_cancel&sld_addons=ldj&key=' + key + '&order_id=' + id).then(res => {
						if(res.status == 200){
							let {orderList} = this.state;
							for(let i = 0; i < orderList.length; i++){
								let item = orderList[ i ];
								item.order_state_str = '已取消';
								item.order_state = 0;
								break;
							}
							this.setState({
								orderList
							})
						}else{
							ViewUtils.sldToastTip(res.msg);
						}
					}).catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
				}
			}
		])
	}

	//复制单号
	sldCopy = (val) => {
		Clipboard.setString(val);
		ViewUtils.sldToastTip('复制成功');
	}

	buyAgain = (id) => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=buy_again&sld_addons=ldj&order_id=' + id + '&key=' + key).then(res => {
			if(res.status == 200){
				this.props.navigation.navigate('LdjCart')
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	showModal = () => {
		this.setState({
			showCall: true
		})
	}

	render(){
		const {order_detail, isLoading, title, time_out_txt, show_map, cur_location, distance} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition('#5EB319', pxToDp(0)) }
				<SldHeaderLdj
					left_icon_style={ {width: pxToDp(16), height: pxToDp(24), marginLeft: 15} }
					title={ title }
					title_color={ '#fff' }
					left_icon={ require('../images/back.png') }
					left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }
					right_event={ () => this.showModal() }
					right_type={ 'icon' }
					right_icon={ require('../images/sld_ldj_service.png') }
					bg_style={ {backgroundColor: '#5EB319'} }
				/>
				<ScrollView>
					{ show_map &&
					<View style={ styles.detail_map_view }>
						{/*<MapView
							zoomLevel={ 12 }
							showsLabels={ true }
							locationEnabled
							style={ styles.detail_map_view }
							showsLocationButton={ true }
							onLocation={ this._logLocationEvent }
							coordinate={ {
								latitude: order_detail.dian_lat * 1,
								longitude: order_detail.dian_lng * 1,
							} }
						>
							{ distance > 0 &&
							<Marker
								active
								coordinate={ {
									latitude: order_detail.dian_lat * 1,
									longitude: order_detail.dian_lng * 1,
								} }
							>
								<View style={ styles.map_maker_view }>
									<Text style={ styles.map_maker_text }>距离{ distance }km</Text>
								</View>
							</Marker>
							}
							<Polyline
								width={ 10 }
								gradient={ true }
								geodesic={ true }
								color={ main_ldj_color }
								coordinates={ [
									cur_location,
									{
										latitude: order_detail.dian_lat * 1,
										longitude: order_detail.dian_lng * 1,
									},
								] }
							/>
						</MapView>*/ }
					</View>
					}
					{ !show_map &&
					<View style={ styles.detail_top_bg }/>
					}

					<View style={ [ styles.detail_top_part, {top: show_map ? pxToDp(374) : 0} ] }>
						<View style={ styles.top_detial__title_View }>
							<Text style={ styles.top_detail_title }>{ order_detail.order_state_str }</Text>
						</View>

						{ order_detail.order_state == 0 &&
						<Fragment>
							<Text style={ styles.order_send_state }>您的订单已取消成功</Text>
							<TouchableOpacity
								onPress={ () => {
									this.buyAgain(order_detail.order_id)
								} }
								activeOpacity={ 1 }
								style={ styles.detail_ope_can_wrap }>
								<Text style={ styles.detail_ope_can_text }>再来一单</Text>
							</TouchableOpacity>
						</Fragment>
						}
						{ order_detail.order_state == 10 &&
						<View style={ styles.detail_opr_btn_view }>
							<TouchableOpacity
								onPress={ () => {
									this.cancelOrder(order_detail.order_id)
								} }
								activeOpacity={ 1 }
								style={ [ styles.detail_ope_can_wrap, {marginTop: pxToDp(50)} ] }>
								<Text style={ [ styles.detail_ope_can_text ] }>取消订单</Text>
							</TouchableOpacity>

							{ time_out_txt != '' && <TouchableOpacity
								onPress={ () => {
									this.props.navigation.navigate('LdjPay', {pay_sn: order_detail.pay_sn})
								} }
								activeOpacity={ 1 }
								style={ [ styles.detail_ope_can_wrap, {
									marginTop: pxToDp(50),
									marginLeft: pxToDp(40),
									backgroundColor: '#FF3D3D',
									borderColor: '#FF3D3D'
								} ] }>
								<Text style={ [ styles.detail_ope_can_text, {color: '#fff'} ] }>{ time_out_txt }</Text>
							</TouchableOpacity> }

						</View>
						}

						{ order_detail.order_state == 20 &&
						<Fragment>
							<Text
								style={ styles.order_send_state }>商品准备中，{ ViewUtils.initOrderSendTime(order_detail.start_time, order_detail.end_time) }</Text>
							<TouchableOpacity
								onPress={ () => {
									this.cancelOrder(order_detail.order_id)
								} }
								activeOpacity={ 1 }
								style={ styles.detail_ope_can_wrap }>
								<Text style={ styles.detail_ope_can_text }>取消订单</Text>
							</TouchableOpacity>
						</Fragment>
						}

						{ order_detail.order_state == 30 && <Fragment>
							{ order_detail.express_type == 1 &&
							<Fragment>
								<Text style={ styles.order_send_state }>等待您到店自取</Text>
								<Text>{ ViewUtils.initOrderSendTime(order_detail.start_time, order_detail.end_time) }</Text>
								<TouchableOpacity
									onPress={ () => {
										this.cancelOrder(order_detail.order_id)
									} }
									activeOpacity={ 1 }
									style={ styles.detail_ope_can_wrap }>
									<Text style={ styles.detail_ope_can_text }>取消订单</Text>
								</TouchableOpacity>
							</Fragment>
							}
							{ order_detail.express_type != 1 &&
							<Fragment>
								<Text
									style={ [ styles.order_send_state, {lineHeight: pxToDp(fontSize_26)} ] }>商家准备完毕，开始为您配送</Text>
								<Text
									style={ styles.order_text_greeen }>{ ViewUtils.initOrderSendTime(order_detail.start_time, order_detail.end_time) }</Text>
								<TouchableOpacity
									onPress={ () => {
										this.cancelOrder(order_detail.order_id)
									} }
									activeOpacity={ 1 }
									style={ styles.detail_ope_can_wrap }>
									<Text style={ styles.detail_ope_can_text }>取消订单</Text>
								</TouchableOpacity>
							</Fragment>
							}
						</Fragment> }
					</View>
					{ ViewUtils.getEmptyPosition('#fff', pxToDp(45)) }


					<View style={ styles.detail_goods_list }>

						{ order_detail.express_type == 1 && <View style={ styles.self_get }>
							<View style={ styles.self_get_lview }>
								<Text style={ styles.self_get_ltext }>到店自取</Text>
							</View>
							<View style={ styles.self_get_rview }>
								<Text style={ styles.self_get_rtext }>预留电话：</Text>
								<Text
									style={ [ styles.self_get_rtext, {color: "#333333"} ] }>{ order_detail.member_phone }</Text>
							</View>
						</View> }

						{ order_detail.express_type == 2 && <View style={ styles.detail_send_info }>
							<View style={ styles.send_info_lview }>
								{ ViewUtils.getSldImg(80, 80, {uri: order_detail.dian_logo}) }
								<View style={ styles.send_info_lview_text }>
									<Text style={ styles.send_info_l_text }>{ order_detail.store_name }</Text>
									<View
										style={ {borderWidth: 0.7, borderColor: '#03A9F3', borderRadius: pxToDp(4)} }
									>
										<Text style={ {
											color: '#03A9F3',
											fontSize: pxToDp(fontSize_16),
											fontWeight: '300',
											paddingHorizontal: pxToDp(8),
											paddingVertical: pxToDp(4)
										} }>{ '商家自送' }</Text>
									</View>
								</View>
							</View>
							<TouchableOpacity
								style={ styles.detial_store_r }
								activeOpacity={ 1 }
								onPress={ () => this.showModal() }
							>
								{ ViewUtils.getSldImg(24, 24, require('../images/sld_ldj_tel.png')) }
								<Text style={ styles.detial_store_r_text }>联系</Text>
							</TouchableOpacity>
						</View> }

						<View
							style={ styles.detail_store_info }>
							<TouchableOpacity
								style={ styles.detial_store_l }
								onPress={ () => {
									this.props.navigation.navigate('LdjStore', {vid: order_detail.vid})
								} }
								activeOpacity={ 1 }
							>
								<Text style={ styles.detial_store_l_text }>{ order_detail.store_name }</Text>
								{ ViewUtils.getSldImg(14, 24, require('../images/sld_arrow_right_black.png')) }
							</TouchableOpacity>

							<TouchableOpacity
								style={ styles.detial_store_r }
								activeOpacity={ 1 }
								onPress={ () => this.showModal() }
							>
								{ ViewUtils.getSldImg(24, 24, require('../images/sld_ldj_tel.png')) }
								<Text style={ styles.detial_store_r_text }>联系</Text>
							</TouchableOpacity>
						</View>

						<View style={ {paddingHorizontal: pxToDp(20), paddingTop: pxToDp(30)} }>

							{ order_detail.goods_list != undefined && order_detail.goods_list.length > 0 && order_detail.goods_list.map((el, index) => {
								if(this.state.showMore == false){
									if(index < 2){
										return (
											<TouchableOpacity
												style={ styles.goods_item }
												activeOpacity={ 1 }
												onPress={ () => {
													this.props.navigation.navigate('LdjGoodsDetail', {
														vid: this.state.dian_id,
														gid: el.gid
													})
												} }
											>
												<View style={ styles.img }>
													<Image
														style={ {width: pxToDp(103), height: pxToDp(103)} }
														resizeMode={ 'contain' }
														defaultSource={require('../../assets/images/default_icon_124.png')}
														source={ {uri: el.goods_image} }
													/>
												</View>
												<View style={ styles.goods_detail }>
													<Text
														ellipsizeMode={ 'tail' }
														numberOfLines={ 2 }
														style={ {
															color: '#333',
															fontSize: pxToDp(fontSize_26),
															lineHeight: pxToDp(fontSize_32),
															height: pxToDp(fontSize_32 * 2),
														} }
													>{ el.goods_name }</Text>
													<View style={ styles.price }>
														<Text style={ {
															color: '#333',
															fontSize: pxToDp(fontSize_26)
														} }>Ks{ PriceUtil.formatPrice(el.goods_price) }x{ PriceUtil.formatPrice(el.goods_num) }</Text>
														<Text style={ {
															color: '#333',
															fontSize: pxToDp(fontSize_26)
														} }>Ks{ PriceUtil.formatPrice(el.goods_price * el.goods_num) }</Text>
													</View>
												</View>
											</TouchableOpacity>
										)
									}
								}else{
									return (
										<TouchableOpacity
											style={ styles.goods_item }
											activeOpacity={ 1 }
											onPress={ () => {
												this.props.navigation.navigate('LdjGoodsDetail', {
													vid: this.state.dian_id,
													gid: el.gid
												})
											} }
										>
											<View style={ styles.img }>
												<Image
													style={ {width: pxToDp(103), height: pxToDp(103)} }
													resizeMode={ 'contain' }
													defaultSource={require('../../assets/images/default_icon_124.png')}
													source={ {uri: el.goods_image} }
												/>
											</View>
											<View style={ styles.goods_detail }>
												<Text
													ellipsizeMode={ 'tail' }
													numberOfLines={ 2 }
													style={ {
														color: '#333',
														fontSize: pxToDp(fontSize_26),
														lineHeight: pxToDp(fontSize_32),
														height: pxToDp(fontSize_32 * 2),
													} }
												>{ el.goods_name }</Text>
												<View style={ styles.price }>
													<Text style={ {
														color: '#333',
														fontSize: pxToDp(fontSize_26)
													} }>Ks{ PriceUtil.formatPrice(el.goods_price) }x{ PriceUtil.formatPrice(el.goods_num) }</Text>
													<Text style={ {
														color: '#333',
														fontSize: pxToDp(fontSize_26)
													} }>Ks{ PriceUtil.formatPrice(el.goods_price) * PriceUtil.formatPrice(el.goods_num) }</Text>
												</View>
											</View>
										</TouchableOpacity>
									)
								}

							}) }

							<TouchableOpacity
								style={ styles.more }
								activeOpacity={ 1 }
								onPress={ () => {
									let {showMore} = this.state;
									this.setState({
										showMore: !showMore
									})
								} }
							>
								<Text style={ {
									color: '#A4A4A4',
									fontSize: pxToDp(fontSize_24)
								} }>共{ (order_detail.goods_list != undefined && order_detail.goods_list.length) ? order_detail.goods_list.length : '-' }件</Text>
							</TouchableOpacity>

							<View style={ styles.order_detail_p }>
								<Text style={ styles.order_p_detail_txt }>商品金额</Text>
								<Text style={ styles.order_p_detail_txt }>ks{PriceUtil.formatPrice( order_detail.goods_amount )}</Text>
							</View>

							<View style={ styles.order_detail_p }>
								<Text style={ styles.order_p_detail_txt }>配送费</Text>
								<Text style={ styles.order_p_detail_txt }>ks{PriceUtil.formatPrice( order_detail.shipping_fee )}</Text>
							</View>
							<View style={ styles.order_detail_p_total }>
								<Text style={ styles.order_detail_p_total_l }>实际支付</Text>
								<Text style={ styles.order_detail_p_total_c }>Ks</Text>
								<Text style={ styles.order_detail_p_total_r }>{ PriceUtil.formatPrice(order_detail.order_amount) }</Text>
							</View>

						</View>
					</View>


					<View style={ GlobalStyles.space_shi_separate }/>

					{ ViewUtils.ldj_Order_dtail_item('配送信息', true) }
					{ ViewUtils.ldj_Order_dtail_item('送达时间：' + ViewUtils.initOrderSendTime(order_detail.start_time, order_detail.end_time), true) }
					{ order_detail.finnshed_time && ViewUtils.ldj_Order_dtail_item('实际送达时间：' + order_detail.finnshed_time, true) }
					{ order_detail.express_type != 1 && ViewUtils.ldj_Order_dtail_item_ltext_ltext_2('收货地址：', true, order_detail.reciver_info != undefined ? order_detail.reciver_info.phone : '', order_detail.reciver_info != undefined ? order_detail.reciver_info.address.replace(/&nbsp;/ig, "") : ' ') }
					{ ViewUtils.ldj_Order_dtail_item_ltext_lbtn('配送方式：', true, order_detail.express_type_str) }

					<View style={ GlobalStyles.space_shi_separate }/>
					{ ViewUtils.ldj_Order_dtail_item('订单信息', true) }
					{ ViewUtils.ldj_Order_dtail_item_ltext_tbtn('订单编号：' + order_detail.order_sn, true, () => this.sldCopy(order_detail.order_sn), '复制') }
					{ order_detail.express_type == 1 && ViewUtils.ldj_Order_dtail_item('核销码：' + order_detail.chain_code, true) }
					{ ViewUtils.ldj_Order_dtail_item('下单时间：' + order_detail.add_time_str, true) }
					{ ViewUtils.ldj_Order_dtail_item('支付方式：在线支付', true) }
					{ order_detail.order_message == '' ? ViewUtils.ldj_Order_dtail_item('订单备注：无', false) : ViewUtils.ldj_Order_dtail_item(order_detail.order_message, false) }
				</ScrollView>

				{ this.state.showCall == true && <TouchableOpacity
					style={ store.callwrap }
					activeOpacity={ 1 }
					onPress={ () => {
						this.setState({
							showCall: false
						})
					} }
				>
					<TouchableOpacity
						style={ store.callmain }
						activeOpacity={ 1 }
						onPress={ () => {} }
					>
						<View style={ store.callm }>
							<TouchableOpacity
								style={ [ store.call_item, {
									borderBottomColor: '#DADADA',
									borderBottomWidth: pxToDp(0.7),
									borderStyle: 'solid'
								} ] }
								activeOpacity={ 1 }
								onPress={ () => {
									Linking.openURL('tel:' + this.state.order_detail.dian_phone)
								} }
							>
								<Text style={ store.call_call_txt }>联系配送员</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={ store.call_item }
								activeOpacity={ 1 }
								onPress={ () => {
									Linking.openURL('tel:' + this.state.order_detail.site_phone)
								} }
							>
								<Text style={ store.call_call_txt }>联系平台电话客服（交易纠纷）</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							activeOpacity={ 1 }
							style={ store.callclose }
							onPress={ () => {
								this.setState({
									showCall: false
								})
							} }
						>
							<Text style={ store.call_title_txt }>取消</Text>
						</TouchableOpacity>
					</TouchableOpacity>
				</TouchableOpacity> }
			</View>
		)
	}
}
