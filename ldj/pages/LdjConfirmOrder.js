import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image, Animated, DeviceEventEmitter, TextInput, Platform
} from 'react-native';
//import {MapView, Marker} from 'react-native-amap3d'
import SldComStatusBar from "../../component/SldComStatusBar";
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import styles from '../styles/order';
import pxToDp from "../../util/pxToDp";
import Modal from 'react-native-root-modal';
import SldHeaderLdj from "../../component/SldHeaderLdj";
import PriceUtil from '../../util/PriceUtil'

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class LdjConfirmOrder extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '确认订单',
			cart_id: props.navigation.state.params != undefined ? props.navigation.state.params.cart_id : '',
			type: 2,         // 1购物车下单,2直接门店结算
			dian_id: props.navigation.state.params != undefined ? props.navigation.state.params.dian_id : '',
			showType: props.navigation.state.params != undefined ? props.navigation.state.params.showType : 'all',    // 显示类型
		                                                                                                              // all,self,store
			express_type: 1,    // 1 商家自送   2 到店自取
			address_id: '',
			address: '',
			cart_list: [],
			dian_info: '',
			estimatedTime: '',
			info: '',
			showMore: false,     // 显示更多商品
			order_message: '',    // 备注
			showBz: false,       // 是否显示备注框
			time_section: '',    //时间区间
			time_type: '',       // 1 今天  2 明天
			member_phone: '',    // 自取预留号码
			showPhone: false,
			distance: 0,
			showTimeModal: false,
			timeSelect: 1,
			selectTimesection: ''
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
		let {showType} = this.state;
		if(showType == 'all' || showType == 'store'){
			this.setState({
				express_type: 1
			})
		}else{
			this.setState({
				express_type: 2
			})
		}
		this.initData();
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.initData();
		});
		this.lister = DeviceEventEmitter.addListener('orderSelectAddr', (e) => {
			this.getFreightMoney(e);
		})
	}

	componentWillUnmount(){
		this.emitter.remove();
		this.lister.remove();
	}

	initData(){
		this.getOrderInfo();
	}

	// 获取订单信息
	getOrderInfo(){
		let {cart_id, type, dian_id} = this.state;
		let data = {
			key, type, cart_id
		};
		if(type == 2){
			data.dian_id = dian_id;
		}
		RequestData.postSldData(AppSldUrl + '/index.php?app=order&mod=confirm&sld_addons=ldj', data).then(res => {
			if(res.status == 200){
				let time_section = res.data.estimatedTime.first_day.length > 0 ? res.data.estimatedTime.first_day[ 0 ] : res.data.estimatedTime.sencond_day[ 0 ];
				let time_type = res.data.estimatedTime.first_day.length > 0 ? 1 : 2;
				let timeSelect = res.data.estimatedTime.first_day.length > 0 ? 1 : 2;
				if(res.data.error_area_state == 1){
					ViewUtils.sldToastTip(res.data.error_area_msg);
				}else{
					this.setState({
						address_id: res.data.address.address_id
					})
				}
				if(res.data.address){
					this.setState({
						member_phone: res.data.address.mob_phone,
					})
				}
				this.destin_location = {
					latitude: res.data.dian_info.dian_lat * 1,
					longitude: res.data.dian_info.dian_lng * 1,
				}
				this.setState({
					address: res.data.address!=undefined?res.data.address:'',
					cart_list: res.data.cart_list,
					dian_info: res.data.dian_info,
					estimatedTime: res.data.estimatedTime,
					info: res.data,
					time_section: time_section,
					time_type: time_type,
					timeSelect: timeSelect
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
				this.props.navigation.pop();
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 切换地址 更新运费
	getFreightMoney(e){
		let {dian_id} = this.state;
		RequestData.postSldData(AppSldUrl + '/index.php?app=order&mod=editAreaFreight&sld_addons=ldj', {
			key,
			dian_id,
			address_id: e.info.address_id
		}).then(res => {
			if(res.status == 200){
				let {info} = this.state;
				info.freight_money = res.freight_money;
				this.setState({
					info,
					address_id: e.info.address_id,
					address: e.info
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
				this.setState({
					address_id: ''
				})
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
			this.setState({
				address_id: ''
			})
		})
	}

	// 备注确定
	confirmBz = () => {
		let {order_message} = this.state;
		order_message = order_message.trim();
		if(order_message.length == 0){
			ViewUtils.sldToastTip('请输入备注内容');
			return;
		}
		if(order_message.length > 30){
			ViewUtils.sldToastTip('备注在30字以内');
			return;
		}
		this.setState({
			showBz: false
		})
	}

	// 备注取消
	cancelBz = () => {
		this.setState({
			order_message: '',
			showBz: false
		})
	}

	// 手机确定
	confirmPhone = () => {
		let {member_phone} = this.state;
		if(member_phone.length == 0){
			ViewUtils.sldToastTip('请输入预留号码');
			return;
		}
		if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(member_phone))){
			ViewUtils.sldToastTip('请输入正确的手机号');
			return;
		}
		this.setState({
			showPhone: false
		})
	}

	// 手机取消
	cancelPhone = () => {
		let m = this.state.address ? this.state.address.mob_phone : '';
		this.setState({
			member_phone: m,
			showPhone: false
		})
	}

	// 提交订单
	submit = () => {
		let {dian_id, cart_id, address_id, express_type, time_type, time_section, member_phone, order_message} = this.state;
		if(!address_id && express_type == 1){
			ViewUtils.sldToastTip('请选择收货地址');
			return;
		}
		if(!member_phone && express_type == 2){
			ViewUtils.sldToastTip('请输入预留电话');
			return;
		}
		let data = {
			key, dian_id, cart_id, address_id, express_type, time_type, time_section
		}
		if(express_type == 2){
			data.member_phone = member_phone;
		}
		if(order_message){
			data.order_message = order_message
		}
		RequestData.postSldData(AppSldUrl + '/index.php?app=order&mod=createorder&sld_addons=ldj', data).then(res => {
			if(res.status == 200){
				DeviceEventEmitter.emit('cartUpdate');
				DeviceEventEmitter.emit('updateStoreCart');
				this.props.navigation.replace('LdjPay', {pay_sn: res.pay_sn});
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 选择时间弹出
	showTimeModals = () => {
		this.setState({
			showTimeModal: true
		})
	}

	// 影藏时间弹出层
	hidetime = () => {
		this.setState({
			showTimeModal: false
		})
	}

	// 选择时间
	selectTime(){
		let {timeSelect,selectTimesection} = this.state;
		if(timeSelect && selectTimesection){
			this.setState({
				time_section: selectTimesection,
				time_type: timeSelect,
				showTimeModal: false
			})
		}else{
			ViewUtils.sldToastTip('请选择送达时间')
		}
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

	//根据起终点坐标规划步行路线
	getRoute = () => {
		this.setState({
			distance: ViewUtils.getStoreDistance(this.cur_location.longitude + ',' + this.cur_location.latitude, this.destin_location.longitude + ',' + this.destin_location.latitude)
		});

	}

	render(){
		const {title, express_type, address, cart_list, info, estimatedTime, timeSelect, distance, dian_info} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>

				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				<SldHeaderLdj
					left_icon_style={ {width: pxToDp(16), height: pxToDp(24), marginLeft: 15} }
					title={ title }
					title_color={ '#fff' }
					left_icon={ require('../images/back.png') }
					left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }
					bg_style={ {backgroundColor: '#5EB319'} }
				/>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>

				{ this.state.showType == 'all' && <View style={ styles.nav_wrap }>
					<View style={ styles.nav }>
						<TouchableOpacity
							style={ [ styles.nav_item, {
								left: 0,
								backgroundColor: (express_type == 1 ? '#70D021' : '#fff'),
								zIndex: (express_type == 1 ? 2 : 1)
							} ] }
							activeOpacity={ 1 }
							onPress={ () => {
								let {express_type} = this.state;
								if(express_type == 1) return;
								this.setState({
									express_type: 1
								})
							} }
						>
							<Text style={ {
								fontSize: pxToDp(fontSize_26),
								color: (express_type == 1 ? '#fff' : '#999')
							} }>商家自送</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={ [ styles.nav_item, {
								right: 0,
								backgroundColor: (express_type == 2 ? '#70D021' : '#fff'),
								zIndex: (express_type == 2 ? 2 : 1)
							} ] }
							activeOpacity={ 1 }
							onPress={ () => {
								let {express_type} = this.state;
								if(express_type == 2) return;
								this.setState({
									express_type: 2
								})
							} }
						>
							<Text style={ {
								fontSize: pxToDp(fontSize_26),
								color: (express_type == 2 ? '#fff' : '#999')
							} }>到店自取</Text>
						</TouchableOpacity>
					</View>
				</View> }

				<ScrollView>
					{ express_type == 1 && <View>
						{ this.state.address_id != '' && <TouchableOpacity
							style={ styles.addr }
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('LdjAddressList', {type: 'select'})
							} }
						>
							<Image
								style={ {width: pxToDp(24), height: pxToDp(27)} }
								resizeMode={ 'contain' }
								source={ require('../images/cartdw.png') }
							/>

							<View style={ styles.addr_info }>
								<Text
									style={ {
										color: '#fff',
										fontSize: pxToDp(fontSize_32),
										lineHeight: pxToDp(fontSize_34)
									} }
									ellipsizeMode={ 'tail' }
									numberOfLines={ 1 }
								>
									{ address != '' ? (address.area_info + ' ' + address.address + ' ' + address.address_precose) : '---' }
								</Text>
								<Text style={ {color: '#fff', fontSize: pxToDp(fontSize_22), marginTop: pxToDp(6)} }>
									{ address != '' ? (address.true_name + ' ' + address.mob_phone) : '---' }
								</Text>
							</View>

							<Image
								style={ {width: pxToDp(16), height: pxToDp(24)} }
								resizeMode={ 'contain' }
								source={ require('../images/ltr_w.png') }
							/>
						</TouchableOpacity> }

						{ this.state.address_id == '' && <TouchableOpacity
							style={ styles.addNewAddr }
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('LdjAddressList', {type: 'select'})
							} }
						>
							<Text style={ styles.add_btn }>+ 添加收货地址</Text>
						</TouchableOpacity> }
					</View> }

					{ express_type == 1 && <View style={ styles.time }>
						<Text style={ {
							height: pxToDp(34),
							paddingHorizontal: pxToDp(17),
							backgroundColor: '#FFAE00',
							fontSize: pxToDp(fontSize_22),
							color: '#fff',
							lineHeight: pxToDp(34),
							borderRadius: pxToDp(4)
						} }>商家自送</Text>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => this.showTimeModals() }
						>
							{ estimatedTime != '' && <Text style={ {color: '#FFAE00', fontSize: pxToDp(fontSize_26)} }>
								预计送达：{ (this.state.time_type == 1 ? '今天' : '明天') + ' ' + this.state.time_section }
							</Text> }
						</TouchableOpacity>
					</View> }

					{ express_type == 2 && dian_info != '' && <View style={ styles.confirm_order_map }>
						{/*自取地图*/ }
						<View style={ styles.confirm_order_dian_address_v }>
							<Text style={ styles.confirm_order_dian_address }>{ dian_info.dian_address }</Text>
						</View>
						{/*<MapView
							zoomLevel={ 12 }
							showsLabels={ true }
							locationEnabled
							style={ styles.confirm_order_map }
							showsLocationButton={ true }
							onLocation={ this._logLocationEvent }
							coordinate={ {
								latitude: dian_info.dian_lat * 1,
								longitude: dian_info.dian_lng * 1,
							} }
						>
							{ distance > 0 &&
							<Marker
								active
								coordinate={ {
									latitude: dian_info.dian_lat * 1,
									longitude: dian_info.dian_lng * 1,
								} }
							>
								<View style={ styles.map_maker_view }>
									<Text style={ styles.map_maker_text }>距离{ distance }km</Text>
								</View>
							</Marker>
							}
						</MapView>*/ }
					</View> }

					{ express_type == 2 && <TouchableOpacity
						style={ styles.aitem }
						activeOpacity={ 1 }
						onPress={ () => {
							this.showTimeModals()
						} }
					>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_30)} }>自取时间</Text>
						<Text style={ {
							color: '#333',
							fontSize: pxToDp(fontSize_28),
							marginLeft: pxToDp(30),
							flex: 1,
						} }>{ (this.state.time_type == 1 ? '今天' : '明天') + ' ' + this.state.time_section }</Text>
						<Image
							style={ {width: pxToDp(16), height: pxToDp(24)} }
							resizeMode={ 'contain' }
							source={ require('../images/ltr.png') }
						/>
					</TouchableOpacity> }
					{ express_type == 2 && <TouchableOpacity
						style={ [ styles.aitem, {marginBottom: pxToDp(20)} ] }
						activeOpacity={ 1 }
						onPress={ () => {
							this.setState({
								showPhone: true
							})
						} }
					>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_30)} }>预留电话</Text>
						<Text style={ {
							color: '#333',
							fontSize: pxToDp(fontSize_28),
							marginLeft: pxToDp(30),
							flex: 1,
						} }>{ this.state.member_phone }</Text>
						<Image
							style={ {width: pxToDp(16), height: pxToDp(24)} }
							resizeMode={ 'contain' }
							source={ require('../images/ltr.png') }
						/>
					</TouchableOpacity> }

					<View style={ styles.goods_list }>
						<Text
							style={ styles.store_name }>{ this.state.dian_info != '' ? this.state.dian_info.dian_name : '--' }</Text>
						<View style={ {paddingHorizontal: pxToDp(20), paddingTop: pxToDp(30)} }>

							{ cart_list.length > 0 && cart_list.map((el, index) => {
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
													} }>Ks{ PriceUtil.formatPrice(el.goods_price * el.goods_num) }</Text>
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
								} }>共{ cart_list.length ? cart_list.length : '-' }件</Text>
							</TouchableOpacity>

							<View style={ styles.order_p }>
								<Text style={ styles.order_p_txt }>商品金额</Text>
								<Text style={ styles.order_p_txt }>Ks{ info != '' ? PriceUtil.formatPrice(info.goods_all_price) : '--' }</Text>
							</View>

							{ express_type == 1 && <View style={ styles.order_p }>
								<Text style={ styles.order_p_txt }>配送费</Text>
								<Text style={ styles.order_p_txt }>Ks{ info != '' ? PriceUtil.formatPrice(info.freight_money) : '--' }</Text>
							</View> }

						</View>
					</View>

					{ express_type == 1 && <TouchableOpacity
						style={ styles.bz }
						activeOpacity={ 1 }
						onPress={ () => {
							this.setState({
								showBz: true
							})
						} }
					>
						<Text style={ styles.order_p_txt }>添加订单备注></Text>
					</TouchableOpacity> }

					{ express_type == 1 && <Text style={ styles.ps }>
						配送至：{ address != '' ? (address.address + ' ' + address.address_precose) : '' }
					</Text> }


				</ScrollView>

				<View style={ styles.footer }>
					<View style={ {paddingLeft: pxToDp(20), flexDirection: 'row'} }>
						<Text
							style={ {color: '#333', fontSize: pxToDp(fontSize_32), marginRight: pxToDp(20)} }>合计</Text>
						<Text style={ {color: '#FF2847', fontSize: pxToDp(38)} }>
							Ks{ info != '' ? (express_type == 1 ? PriceUtil.formatPrice((info.freight_money * 1 + info.goods_all_price * 1)) : PriceUtil.formatPrice(info.goods_all_price)) : '--' }
						</Text>
					</View>
					<TouchableOpacity
						style={ styles.confirm_btn }
						activeOpacity={ 1 }
						onPress={ () => this.submit() }
					>
						<Text style={ {color: '#fff', fontSize: pxToDp(fontSize_32)} }>提交订单</Text>
					</TouchableOpacity>
				</View>

				{ express_type == 1 && this.state.showBz == true && <View style={ styles.bzk_wrap }>
					<View style={ styles.bzk }>
						<View style={ styles.bz_title }>
							<TouchableOpacity
								style={ {padding: pxToDp(20)} }
								activeOpacity={ 1 }
								onPress={ () => this.cancelBz() }
							>
								<Text style={ {color: '#666666', fontSize: pxToDp(26)} }>取消</Text>
							</TouchableOpacity>

							<Text style={ {color: '#333', fontSize: pxToDp(fontSize_32)} }>写备注信息</Text>

							<TouchableOpacity
								style={ {padding: pxToDp(20)} }
								activeOpacity={ 1 }
								onPress={ () => this.confirmBz() }
							>
								<Text style={ {color: '#5EB318', fontSize: pxToDp(26)} }>确定</Text>
							</TouchableOpacity>
						</View>

						<TextInput
							placeholder={ '订单备注（30字以内）' }
							style={ styles.bzInput }
							multiline={ true }
							underlineColorAndroid={ 'transparent' }
							value={this.state.order_message}
							onChangeText={ text => {
								this.setState({
									order_message: text
								})
							} }
						/>
					</View>
				</View> }

				{ express_type == 2 && this.state.showPhone == true && <View style={ [ styles.bzk_wrap ] }>
					<View style={ [ styles.bzk, {height: pxToDp(208)} ] }>
						<View style={ styles.bz_title }>
							<TouchableOpacity
								style={ {padding: pxToDp(20)} }
								activeOpacity={ 1 }
								onPress={ () => this.cancelPhone() }
							>
								<Text style={ {color: '#666666', fontSize: pxToDp(26)} }>取消</Text>
							</TouchableOpacity>

							<Text style={ {color: '#333', fontSize: pxToDp(fontSize_32)} }>写预留号码</Text>

							<TouchableOpacity
								style={ {padding: pxToDp(20)} }
								activeOpacity={ 1 }
								onPress={ () => this.confirmPhone() }
							>
								<Text style={ {color: '#5EB318', fontSize: pxToDp(26)} }>确定</Text>
							</TouchableOpacity>
						</View>

						<TextInput
							placeholder={ '预留号码' }
							style={ styles.phoneInput }
							maxLength={ 11 }
							keyboardType={ 'numeric' }
							value={ this.state.member_phone }
							underlineColorAndroid={ 'transparent' }
							onChangeText={ text => {
								this.setState({
									member_phone: text
								})
							} }
						/>
					</View>
				</View> }

				{ this.state.showTimeModal == true && <TouchableOpacity
					style={ styles.time_modal }
					activeOpacity={ 1 }
					onPress={ () => this.hidetime() }
				>
					<TouchableOpacity
						style={{height: pxToDp(520),backgroundColor: '#fff'}}
						onPress={()=>{}}
						activeOpacity={1}
					>
						<View style={ styles.modalHeader }>
							<TouchableOpacity
								style={ {padding: pxToDp(20)} }
								activeOpacity={ 1 }
								onPress={ () => {
									this.setState({
										timeSelect: false
									})
								} }
							>
								<Image
									style={ {width: pxToDp(20), height: pxToDp(20)} }
									resizeMode={ 'contain' }
									source={ require('../images/close_x.png') }
								/>
							</TouchableOpacity>
							<Text style={ {color: '#333', fontSize: pxToDp(fontSize_32)} }>选择送达时间</Text>
							<TouchableOpacity
								style={ {padding: pxToDp(20)} }
								activeOpacity={ 1 }
								onPress={()=>this.selectTime()}
							>
								<Text style={ {color: '#333', fontSize: pxToDp(fontSize_24)} }>确定</Text>
							</TouchableOpacity>
						</View>
						<View style={ styles.time_main }>
							<View style={ styles.time_left }>
								<TouchableOpacity
									style={ [ styles.day, {backgroundColor: timeSelect == 1 ? '#fff' : '#F2F2F2'} ] }
									activeOpacity={ 1 }
									onPress={ () => {
										if(timeSelect == 1 || estimatedTime.first_day.length == 0) return;
										this.setState({
											timeSelect: 1,
											selectTimesection: ''
										})
									} }
								>
									<Text style={ styles.txt28 }>今天</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={ [ styles.day, {backgroundColor: timeSelect == 2 ? '#fff' : '#F2F2F2'} ] }
									activeOpacity={ 1 }
									onPress={ () => {
										if(timeSelect == 2 || estimatedTime.sencond_day.length == 0) return;
										this.setState({
											timeSelect: 2,
											selectTimesection: ''
										})
									} }
								>
									<Text style={ styles.txt28 }>明天</Text>
								</TouchableOpacity>
							</View>
							<View style={ styles.time_right }>
								{ estimatedTime != '' && <ScrollView>
									{ timeSelect == 1 ? estimatedTime.first_day.map(el => <TouchableOpacity
										style={ [ styles.day ] }
										activeOpacity={ 1 }
										onPress={()=>{
											this.setState({
												selectTimesection: el
											})
										}}
									>
										<Text
											style={[styles.txt28,{color: (this.state.selectTimesection==el?'#333':'#999')}]}
										>
											{ el }
										</Text>
									</TouchableOpacity>) : estimatedTime.sencond_day.map(el => <TouchableOpacity
										style={ [ styles.day ] }
										activeOpacity={ 1 }
										onPress={()=>{
											this.setState({
												selectTimesection: el
											})
										}}
									>
										<Text
											style={[styles.txt28,{color: (this.state.selectTimesection==el?'#333':'#999')}]}
										>
											{ el }
										</Text>
									</TouchableOpacity>) }
								</ScrollView> }
							</View>
						</View>
					</TouchableOpacity>
				</TouchableOpacity> }

			</View>
		)
	}
}
