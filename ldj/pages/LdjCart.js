import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
	Image, Platform, DeviceEventEmitter, Alert
} from 'react-native';
import SldHeader from '../../component/SldHeader';
import SldComStatusBar from "../../component/SldComStatusBar";
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import comSldStyle from "../styles/comSldStyle";
import PriceUtil from '../../util/PriceUtil'

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class LdjCart extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '购物车',
			cartList: [],
			isLoading: 0,
			location: [],
		}
		ViewUtils.initLocationMust();
	}

	componentDidMount(){
		// this.initData();
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			// this.initData();
		});
		this.lister = DeviceEventEmitter.addListener('loginUpdate', () => {
			if(this.state.location){
				this.getCartInfo();
			}else{
				// this.initData();
			}
		});
		this.cartLister = DeviceEventEmitter.addListener('cartUpdate', () => {
			if(this.state.location){
				this.getCartInfo();
			}else{
				// this.initData();
			}
		});
	}

	componentWillUnmount(){
		this.emitter.remove();
		this.lister.remove();
		this.cartLister.remove();
	}

	initData(){
		// Geolocation.addLocationListener(location => {
		// 	this.setState({
		// 		location: [ location.longitude, location.latitude ]
		// 	}, () => {
		// 		this.getCartInfo();
		// 	});
		// 	Geolocation.stop()
		// })
	}

	getCartInfo(){
		let {location} = this.state;
		RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=getAllCartList&sld_addons=ldj', {
			key: key,
			latitude: location[ 0 ],
			longitude: location[ 1 ],
		}).then(res => {
			if(res.status == 200){
				this.setState({
					cartList: res.data
				})
			}else{
			}
			this.setState({
				isLoading: 1
			})
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
			this.setState({
				isLoading: 1
			})
		})
	}

	delCart = (id) => {
		Alert.alert('提示', '确认删除该购物车', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=deletecart&sld_addons=ldj', {
						key,
						type: 2,
						vid: id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip('删除成功');
							let {cartList} = this.state;
							for(let i = 0; i < cartList.length; i++){
								if(cartList[ i ].vid == id){
									cartList.splice(i, 1);
									break;
								}
							}
							this.setState({
								cartList
							})
						}else{
							ViewUtils.sldToastTip(res.msg);
						}
					}).catch(err => {
						ViewUtils.sldErrorToastTip(err);
					})
				}
			}
		])
	}

	// 结算
	submit = (id) => {
		let {cartList} = this.state;
		let cart = cartList.filter(el => el.vid == id)[ 0 ];
		if(cart.cart_list.list.some(el => el.error == 1)){
			ViewUtils.sldToastTip('当前店铺存在失效商品');
			return;
		}
		let delivery_type = cart.cart_list.list[ 0 ].delivery_type;
		let showType;
		if(delivery_type.length == 2){
			showType = 'all';
		}else if(delivery_type.length == 1 && delivery_type.indexOf('门店配送') > -1){
			showType = 'store';
		}else if(delivery_type.length == 1 && delivery_type.indexOf('上门自提') > -1){
			showType = 'self';
		}else{
			return;
		}
		let cart_id = [];
		cart.cart_list.list.map(el => {
			cart_id.push(el.cart_id);
		})
		this.props.navigation.navigate('LdjConfirmOrder', {
			cart_id: cart_id.join(','),
			dian_id: id,
			showType: showType
		});
	}

	render(){
		const {title, cartList, isLoading} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				<SldHeader title={ title }/>

				{ (key == '' || key == undefined) &&
				<View style={ comSldStyle.login_tip_view }>
					<Image style={ comSldStyle.login_tip_img }
					       source={ require('../images/empty_sld_com.png') }/>
					<Text
						style={ [ {color: '#999', marginTop: pxToDp(20)}, GlobalStyles.sld_global_font ] }>您还未登录</Text>
					<TouchableOpacity
						onPress={ () => this.props.navigation.navigate('Login') }
						activeOpacity={ 1 }
						style={ comSldStyle.com_login_tip_view }>
						<Text style={ comSldStyle.com_login_tip_text }>去登录</Text>
					</TouchableOpacity>

				</View> }

				{ key != '' && isLoading == 0 && cartList.length == 0 &&
				<View style={ {flex: 1, justifyContent: 'center', alignItems: 'center'} }>
					{ ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '加载中...') }
				</View> }

				{ key != '' && cartList.length == 0 && isLoading == 1 &&
				<View style={ {flex: 1, justifyContent: 'center', alignItems: 'center'} }>
					{ ViewUtils.noData('您的购物车还是空的') }
				</View> }

				{ key != '' && cartList.length > 0 && <ScrollView>

					{ cartList.some(el => {
						return el.error == 0
					}) == true && <View style={ [ styles.title, {backgroundColor: '#D4E5C6',} ] }>
						<View style={ [ styles.main, {backgroundColor: main_ldj_color,} ] }>
							<Image
								style={ {width: pxToDp(24), height: pxToDp(24)} }
								resizeMode={ 'contain' }
								source={ require('../images/cartdw.png') }
							/>
							<Text style={ {color: '#fff', fontSize: pxToDp(fontSize_24)} }>当前配送范围</Text>
						</View>
					</View> }

					{ cartList.map(el => {
						if(el.error == 0){
							return (<View style={ styles.item }>
								<View style={ [ styles.item_top, {backgroundColor: '#F9F9F9'} ] }>
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => {
											this.props.navigation.navigate('LdjStore', {vid: el.vid})
										} }
									>
										<Text style={ {
											color: '#333',
											fontSize: pxToDp(fontSize_30)
										} }>{ el.store_name }</Text>
									</TouchableOpacity>
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => this.delCart(el.vid) }
									>
										<Image
											style={ {width: pxToDp(27), height: pxToDp(27)} }
											resizeMode={ 'contain' }
											source={ require('../images/del.png') }
										/>
									</TouchableOpacity>
								</View>

								<View style={ styles.list }>
									<View style={ styles.goods }>
										{ el.cart_list.list.map((el2, index) => {
											if(index < 4){
												return <TouchableOpacity
													activeOpacity={ 1 }
													style={ styles.goods_item }
													onPress={ () => {
														this.props.navigation.navigate('LdjGoodsDetail', {
															vid: el.vid,
															gid: el2.gid
														})
													} }
												>
													<View style={ styles.img }>
														<Image
															style={ {width: pxToDp(103), height: pxToDp(103)} }
															resizeMode={ 'contain' }
															source={ {uri: el2.goods_image} }
														/>
														{ el2.error == 1 && <Text style={ {
															backgroundColor: 'rgba(0,0,0,0.5)',
															textAlign: 'center',
															lineHeight: pxToDp(103),
															color: '#fff',
															fontSize: pxToDp(fontSize_24)
														} }>
															{ el2.errorinfo }
														</Text> }
													</View>
													<Text style={ {
														color: '#666',
														fontSize: pxToDp(fontSize_20),
														marginTop: pxToDp(25)
													} }>ks{PriceUtil.formatPrice( el2.goods_price )}</Text>
													{ el2.goods_num > 1 &&
													<Text style={ styles.goods_num }>{ el2.goods_num }</Text> }
												</TouchableOpacity>
											}
										}) }
									</View>
									{ el.cart_list.list.length > 4 && <View style={ styles.more }>
										<View style={ styles.dot }/>
										<View style={ styles.dot }/>
										<View style={ styles.dot }/>
									</View> }

									<View style={ styles.cart_info }>
										<Text style={ {
											color: '#F71A1A',
											fontSize: pxToDp(fontSize_30)
										} }>ks{PriceUtil.formatPrice( el.cart_list.all_money )}</Text>
										<Text style={ {
											color: '#666666',
											fontSize: pxToDp(fontSize_24),
											marginTop: pxToDp(5)
										} }>共{ el.cart_list.list.length }件</Text>
										<TouchableOpacity
											activeOpacity={ 1 }
											style={ styles.confirm }
											onPress={ () => this.submit(el.vid) }
										>
											<Text style={ {color: '#fff', fontSize: pxToDp(fontSize_24)} }>结算</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>)
						}
					}) }

					{ cartList.some(el => {
						return el.error == 1
					}) == true && <View style={ [ styles.title, {backgroundColor: '#DADADA'} ] }>
						<View style={ [ styles.main, {backgroundColor: '#ACACAC'} ] }>
							<Image
								style={ {width: pxToDp(24), height: pxToDp(24)} }
								resizeMode={ 'contain' }
								source={ require('../images/cartdw.png') }
							/>
							<Text style={ {color: '#fff', fontSize: pxToDp(fontSize_24)} }>不在配送范围内</Text>
						</View>
					</View> }


					{ cartList.map(el => {
						if(el.error == 1){
							return (<View style={ styles.item }>
								<View style={ [ styles.item_top, {backgroundColor: '#E7E7E7'} ] }>
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => {
											this.props.navigation.navigate('LdjStore', {vid: el.vid})
										} }
									>
										<Text style={ {
											color: '#333',
											fontSize: pxToDp(fontSize_30)
										} }>{ el.store_name }</Text>
									</TouchableOpacity>
								</View>

								<View style={ styles.list }>
									<View style={ styles.goods }>
										{ el.cart_list.list.map((el2, index) => {
											if(index < 4){
												return <TouchableOpacity
													activeOpacity={ 1 }
													style={ styles.goods_item }
													onPress={ () => {
														this.props.navigation.navigate('LdjGoodsDetail', {
															vid: el.vid,
															gid: el2.gid
														})
													} }
												>
													<View style={ styles.img }>
														<Image
															style={ {width: pxToDp(103), height: pxToDp(103)} }
															resizeMode={ 'contain' }
															source={ {uri: el2.goods_image} }
														/>
														{ el2.error == 1 && <Text style={ {
															backgroundColor: 'rgba(0,0,0,0.5)',
															textAlign: 'center',
															lineHeight: pxToDp(103),
															color: '#fff',
															fontSize: pxToDp(fontSize_24)
														} }>
															{ el2.errorinfo }
														</Text> }
													</View>
													<Text style={ {
														color: '#666',
														fontSize: pxToDp(fontSize_20),
														marginTop: pxToDp(25)
													} }>ks{PriceUtil.formatPrice( el2.goods_price )}</Text>
													{ el2.goods_num > 1 &&
													<Text style={ styles.goods_num }>{ el2.goods_num }</Text> }
												</TouchableOpacity>
											}
										}) }
									</View>
									{ el.cart_list.list.length > 4 && <View style={ styles.more }>
										<View style={ styles.dot }/>
										<View style={ styles.dot }/>
										<View style={ styles.dot }/>
									</View> }

									<View style={ styles.cart_info }>
										<Text style={ {
											color: '#F71A1A',
											fontSize: pxToDp(fontSize_30)
										} }>ks{PriceUtil.formatPrice( el.cart_list.all_money )}</Text>
										<Text style={ {
											color: '#666666',
											fontSize: pxToDp(fontSize_24),
											marginTop: pxToDp(35)
										} }>共{ el.cart_list.list.length }件</Text>
									</View>
								</View>
							</View>)
						}
					}) }
				</ScrollView> }

			</View>
		)
	}
}

const styles = StyleSheet.create({
	title: {
		height: pxToDp(54),
		padding: pxToDp(6),
		borderRadius: pxToDp(8),
		marginVertical: pxToDp(24),
		marginHorizontal: pxToDp(259)
	},
	main: {
		height: pxToDp(42),
		borderRadius: pxToDp(8),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	item: {
		marginBottom: pxToDp(20),
		marginHorizontal: pxToDp(20),
		backgroundColor: '#fff',
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#ECECEC',
	},
	item_top: {
		height: pxToDp(70),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: pxToDp(20),
	},
	list: {
		paddingHorizontal: pxToDp(20),
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: pxToDp(20)
	},
	goods: {
		width: pxToDp(480),
		flexDirection: 'row',
		alignItems: 'center',
	},
	goods_item: {
		paddingRight: pxToDp(20),
		paddingTop: pxToDp(20)
	},
	more: {
		paddingHorizontal: pxToDp(20),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: pxToDp(-30)
	},
	dot: {
		width: pxToDp(10),
		height: pxToDp(10),
		borderRadius: pxToDp(5),
		marginHorizontal: pxToDp(4),
		backgroundColor: '#DCDCDC',
	},
	cart_info: {
		flex: 1,
		minWidth: pxToDp(100),
		paddingTop: pxToDp(45),
		alignItems: 'flex-end',
	},
	confirm: {
		marginTop: pxToDp(30),
		backgroundColor: '#FF3731',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: pxToDp(4),
		height: pxToDp(40),
		width: pxToDp(90)
	},
	img: {
		width: pxToDp(103),
		height: pxToDp(103),
		borderRadius: pxToDp(8),
		overflow: 'hidden'
	},
	goods_num: {
		position: 'absolute',
		top: pxToDp(10),
		right: pxToDp(10),
		backgroundColor: '#FF0902',
		width: pxToDp(38),
		height: pxToDp(38),
		borderRadius: pxToDp(19),
		textAlign: 'center',
		lineHeight: pxToDp(38),
		color: '#fff'
	}
})
