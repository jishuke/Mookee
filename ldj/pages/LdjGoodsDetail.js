import LinearGradient from "react-native-linear-gradient";
import SldComStatusBar from "../../component/SldComStatusBar";
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Image,
	Alert, DeviceEventEmitter, Platform, Linking
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import store from '../styles/store';
import {Carousel} from 'react-native-ui-lib';
import LdjCart from '../../component/LdjCart';
import Modal from "react-native-modalbox";
import PriceUtil from '../../util/PriceUtil'

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class LdjGoodsDetail extends Component{
	constructor(props){
		super(props);
		this.state = {
			vid: props.navigation.state.params.vid,
			gid: props.navigation.state.params.gid,
			cart_list: '',
			goods_info: '',
			selectAll: true,    // 全选
			selectNum: 0,     // 选中的数量
			dian_info: '',
			goods_body: '',//商品详情
			dian_phone: '',
			showCall: false
		}
	}

	componentDidMount(){
		this.getStoreInfo();
		this.getGoodsDetail();
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.getStoreInfo();
			this.getGoodsDetail();
		});
		this.lister = DeviceEventEmitter.addListener('updateStoreCart', () => {
			this.getStoreInfo();
			this.getGoodsDetail();
		});
	}

	componentWillUnmount(){
		DeviceEventEmitter.emit('updateHomeDianCartNum');
		this.emitter.remove();
		this.lister.remove();
	}

	// 获取店铺详情
	getStoreInfo(){
		let {vid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=dian&mod=index&sld_addons=ldj&key=' + key + '&dian_id=' + vid).then(res => {
			if(res.status == 200){
				let selectNum = 0;
				res.cart_list.list.forEach(el => {
					if(el.error != 0){
						el.select = false
					}else{
						el.select = true;
						selectNum++;
					}
				})
				this.setState({
					dian_info: res.dian_info,
					cart_list: res.cart_list,
					selectNum: selectNum
				})
			}
		})
		RequestData.postSldData(AppSldUrl + '/index.php?app=dian&mod=dian_info_function&sld_addons=ldj', {
			dian_id: vid
		}).then(res => {
			if(res.status == 200){
				this.setState({
					dian_phone: res.data.dian_phone
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 获取商品详情
	getGoodsDetail(){
		let {vid, gid} = this.state;
		let url = AppSldUrl + '/index.php?app=goods&mod=goods_detail&sld_addons=ldj&gid=' + gid + '&vid=' + vid;
		if(key){
			url += '&key=' + key
		}
		RequestData.getSldData(url).then(res => {
			if(res.status == 200){
				let now = res.cart_info.list.filter(el => el.gid == res.goods_info.goods_id);
				if(now.length > 0){
					res.goods_info.goods_num = now[ 0 ].goods_num;
				}else{
					res.goods_info.goods_num = 0;
				}
				let reg = new RegExp('<img', "g")
				this.setState({
					goods_info: res.goods_info,
					goods_body: res.goods_info.body.replace(reg, "<img style=\"display:        ;width:100%;\"")
				})
			}
		})
	}

	// 商品增减
	change = (gid, num) => {
		if(!key){
			this.props.navigation.navigate('Login');
			return;
		}
		let {vid} = this.state;
		RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=editcart&sld_addons=ldj', {
			gid,
			dian_id: vid,
			quantity: num,
			key
		}).then(res => {
			if(res.status == 200){
				this.updateCart(res.cart_list)
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		})
	}

	// 更新购物车
	updateCart(res){
		let {cart_list, goods_info} = this.state;
		res.list.forEach(el => {
			if(el.error != 0){
				el.select = false
			}else{
				el.select = true
			}
		});
		let selectArr = [];
		cart_list.list.map(el => {
			if(!el.select){
				selectArr.push(el.gid);
			}
		});
		if(selectArr.length > 0){
			res.list.forEach(el => {
				if(selectArr.indexOf(el.gid) > -1){
					el.select = false
				}
			})
		}
		cart_list.list = res.list;
		goods_info.goods_num = 0;
		for(let i = 0; i < cart_list.list.length; i++){
			let item = cart_list.list[ i ];
			if(item.gid == goods_info.goods_id){
				goods_info.goods_num = item.goods_num;
				break;
			}
		}
		let selectNum = 0;
		cart_list.list.map(el => {
			if(el.select){
				selectNum++;
			}
		});

		if(cart_list.list.length == 0){
			this.setState({
				isShowModal: false
			})
		}
		this.setState({
			cart_list: cart_list,
			goods_info: goods_info,
			selectNum: selectNum
		}, () => {
			this.calcPrice()
		})
	}

	// 计算价格
	calcPrice(){
		let {cart_list} = this.state;
		let total = 0;
		cart_list.list.map(el => {
			if(el.error == 0 && el.goods_num > 0 && el.select){
				total = parseFloat(total) + el.goods_num * 1 * el.goods_price;
			}
		})
		cart_list.all_money = total.toFixed(2);
		this.setState({
			cart_list: cart_list
		})
	}

	// 购物选中商品
	select = (type, gid) => {
		let {selectAll, cart_list} = this.state;
		let newSelectAll;
		let selectNum = 0;
		if(type == 'cart'){
			cart_list.list.forEach(el => el.select = !selectAll);
			newSelectAll = !selectAll;
		}else{
			cart_list.list.forEach(el => {
				if(el.gid == gid){
					el.select = !el.select
				}
			})
			newSelectAll = this.checkSelectAll(cart_list);
		}
		cart_list.list.map(el => {
			if(el.select){
				selectNum++;
			}
		})
		this.setState({
			selectAll: newSelectAll,
			cart_list: cart_list,
			selectNum: selectNum
		}, () => {
			this.calcPrice()
		})
	}

	checkSelectAll(cart_list){
		let flag = true;
		for(let i = 0; i < cart_list.list.length; i++){
			if(!cart_list.list[ i ].select){
				flag = false;
				break;
			}
		}
		return flag;
	}

	//  选中的cart_id
	select_cart_id(){
		let {cart_list} = this.state;
		let arr = [];
		cart_list.list.map(el => {
			if(el.select){
				arr.push(el.cart_id)
			}
		})
		return arr;
	}

	// 删除购物车
	delCart = () => {
		Alert.alert('提示', '确定删除选中商品', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					let cart_ids = this.select_cart_id();
					if(cart_ids.length == 0){
						ViewUtils.sldToastTip('请选择要删除的商品');
						return;
					}
					RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=deletecart&sld_addons=ldj', {
						key,
						type: 1,
						cart_ids: cart_ids.join(',')
					}).then(res => {
						if(res.status == 200){
							this.updateCart(res.cart_list)
						}else{
							ViewUtils.sldToastTip(res.msg);
						}
					}).catch(err => {

					})
				}
			}
		])
	}

	// 删除失效商品
	delerrCart = () => {
		let {cart_list} = this.state;
		let arr= [];
		cart_list.list.map(el => {
			if(el.error==1){
				arr.push(el.cart_id)
			}
		})
		RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=deletecart&sld_addons=ldj', {
			key,
			type: 1,
			cart_ids: arr.join(',')
		}).then(res => {
			if(res.status == 200){
				this.updateCart(res.cart_list)
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}


	// 结算
	submit = () => {
		let {vid,cart_list} = this.state;
		let cart_ids = this.select_cart_id();
		let delivery_type = cart_list.list[0].delivery_type;
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
		this.props.navigation.navigate('LdjConfirmOrder', {
			cart_id: cart_ids.join(','),
			dian_id: vid,
			showType: showType
		});
	}

	render(){
		const {cart_list, dian_info, goods_info, goods_body} = this.state;
		const _w = width;
		const delivery = dian_info != '' ? dian_info.ldj_delivery_order_Price : 0;
		const error = dian_info != '' ? dian_info.error : 0;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition('#fff', pxToDp(0)) }
				<TouchableOpacity
					onPress={ () => {
						this.props.navigation.pop();
					} }
					style={ store.top_close }
				>
					<Image
						style={ {width: pxToDp(60), height: pxToDp(60)} }
						resizeMode={ 'contain' }
						source={ require('../images/close.png') }
					/>
				</TouchableOpacity>

				<ScrollView>
					<View style={ store.goods_swiper }>
						<Carousel>
							{ goods_info != '' && goods_info.goods_images.length > 0 && goods_info.goods_images.map((el, index) =>
								<View
									style={ {
										width: width,
										height: width,
										alignItems: 'center',
										justifyContent: 'center'
									} }
								>
									<Image
										style={ {width: width, height: width} }
										resizeMode={ 'contain' }
										source={ {uri: el} }
									/>
									<Text style={ store.dot }>{ index + 1 }/{ goods_info.goods_images.length }</Text>
								</View>) }
						</Carousel>
					</View>

					{ goods_info != '' && <View style={ store.detail }>
						<Text style={ {
							color: '#333',
							fontSize: pxToDp(32),
						} }>{ goods_info.goods_name }</Text>
						<View style={ store.goods_add }>
							<Text style={ {
								color: '#FF0902',
								fontSize: pxToDp(32),
							} }>ks{PriceUtil.formatPrice( goods_info.goods_price )}</Text>
							{ goods_info.goods_num == 0 && <TouchableOpacity
								style={ {
									width: pxToDp(190),
									height: pxToDp(60),
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: '#5EB318',
									borderRadius: pxToDp(8)
								} }
								onPress={ () => this.change(goods_info.goods_id, 1) }
							>
								<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>加入购物车</Text>
							</TouchableOpacity> }

							{ goods_info.goods_num > 0 && <View
								style={ {
									flexDirection: 'row',
									alignItems: 'center'
								} }
							>
								<TouchableOpacity
									onPress={ () => {
										this.change(goods_info.goods_id, goods_info.goods_num * 1 - 1)
									} }
								>
									<Image
										style={ store.img_btn }
										resizeMode={ 'contain' }
										source={ require('../images/reduce.png') }
									/>
								</TouchableOpacity>
								<Text style={ {
									width: pxToDp(55),
									fontSize: pxToDp(32),
									color: '#333',
									textAlign: 'center'
								} }>{ goods_info.goods_num }</Text>
								<TouchableOpacity
									onPress={ () => {
										this.change(goods_info.goods_id, goods_info.goods_num * 1 + 1)
									} }
								>
									<Image
										style={ store.img_btn }
										resizeMode={ 'contain' }
										source={ require('../images/add.png') }
									/>
								</TouchableOpacity>
							</View> }
						</View>
					</View> }

					<View style={ {
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginTop: pxToDp(20),
						height: pxToDp(90),
						backgroundColor: '#fff',
						paddingHorizontal: pxToDp(30)
					} }>
						<TouchableOpacity
							style={ store.row }
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('LdjStore', {vid: this.state.vid})
							} }
						>
							<Image
								style={ {width: pxToDp(30), height: pxToDp(30), marginRight: pxToDp(20)} }
								resizeMode={ 'contain' }
								source={ require('../images/store.png') }
							/>
							<Text style={ {
								color: '#333',
								fontSize: pxToDp(30),
							} }>{ goods_info != '' ? goods_info.dian_name : '' }</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={ store.row }
							activeOpacity={1}
							onPress={()=>{
								this.setState({
									showCall: true
								})
							}}
						>
							<Image
								style={ {width: pxToDp(30), height: pxToDp(30)} }
								resizeMode={ 'contain' }
								source={ require('../images/call.png') }
							/>
							<Text style={ {
								color: '#333',
								fontSize: pxToDp(30),
								marginLeft: pxToDp(20)
							} }>联系商家</Text>
						</TouchableOpacity>
					</View>

					<View style={ store.goods_detail }>
						<View style={ store.gtitle }>
							<Text style={ {color: '#A7A7A7', fontSize: pxToDp(30)} }>.....</Text>
							<Text style={ {
								color: '#333',
								fontSize: pxToDp(30),
								marginHorizontal: pxToDp(20)
							} }>商品详情</Text>
							<Text style={ {color: '#A7A7A7', fontSize: pxToDp(30)} }>.....</Text>
						</View>
					</View>
				</ScrollView>

				{/*底部购物车 start*/ }
				<View style={ {height: pxToDp(98)} }>
					{ cart_list != '' && <LdjCart
						list={ cart_list.list }
						total={ cart_list.all_money }
						error={ error }
						delivery={ delivery }
						submit={ () => this.submit() }
						showModal={ () => {
							if(cart_list.list.length > 0){
								this.setState({
									isShowModal: true
								})
							}
						} }
					/> }
				</View>
				{/*底部购物车 end*/ }

				{/*购物车弹出层 start*/ }
				{ cart_list != '' && this.state.isShowModal==true && <TouchableOpacity
					activeOpacity={1}
					style={ store.modalStyle }
					onPress={()=>{
						this.setState({
							isShowModal: false
						})
					}}
				>
					<View style={ store.modal_top }>
						<Image
							style={ {width: pxToDp(90), height: pxToDp(90)} }
							resizeMode={ 'contain' }
							source={ (error == 1) ? (require('../images/carterr.png')) :
								(cart_list.list.length > 0 ? (require('../images/cart.png')) : (require('../images/carterr.png'))) }
						/>
						<LinearGradient
							style={ {
								position: 'absolute',
								top: pxToDp(0),
								left: pxToDp(60),
								width: pxToDp(38),
								height: pxToDp(38),
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: pxToDp(19),
							} }
							colors={ [ '#FF2626', '#FF9D46' ] }
						>
							<Text style={ {
								color: '#fff',
								fontSize: pxToDp(22)
							} }>{ cart_list.list.length ? cart_list.list.length : 0 }</Text>
						</LinearGradient>
					</View>
					<TouchableOpacity
						style={ store.modal_bottom }
						activeOpacity={1}
						onPress={()=>{}}
					>
						<View style={ store.clearAll }>
							<View style={ store.row }>
								<TouchableOpacity
									onPress={ () => this.select('cart') }
								>
									<Image
										style={ {width: pxToDp(40), height: pxToDp(40)} }
										resizeMode={ 'contain' }
										source={ this.state.selectAll == true ? require('../images/select.png') : require('../images/noselect.png') }
									/>
								</TouchableOpacity>

								<Text style={ {
									marginLeft: pxToDp(20),
									fontSize: pxToDp(32),
									color: '#333'
								} }>
									全选
									<Text style={ {
										color: '#999',
										fontSize: pxToDp(22)
									} }>已选{ this.state.selectNum }件</Text>
								</Text>
							</View>
							<TouchableOpacity
								onPress={ () => this.delCart() }
							>
								<Text style={ {color: '#666', fontSize: pxToDp(22)} }>清空购物车</Text>
							</TouchableOpacity>
						</View>

						{/*正常商品*/ }
						<ScrollView
							style={ store.cart_scr }
						>
							{ cart_list != '' && cart_list.list.length > 0 && cart_list.list.map(el => {
								if(el.error == 0){
									return (<TouchableOpacity activeOpacity={1} style={ [ store.row, store.cart_goods ] }>
										<TouchableOpacity
											style={ {paddingHorizontal: pxToDp(20)} }
											onPress={ () => this.select('goods', el.gid) }
										>
											<Image
												style={ {width: pxToDp(40), height: pxToDp(40)} }
												resizeMode={ 'contain' }
												source={ el.select == true ? require('../images/select.png') : require('../images/noselect.png') }
											/>
										</TouchableOpacity>
										<View style={ [ store.row, {flex: 1,} ] }>
											<Image
												style={ {
													width: pxToDp(120),
													height: pxToDp(120),
													borderRadius: pxToDp(6)
												} }
												resizeMode={ 'contain' }
												source={ {uri: el.goods_image} }
											/>
											<View style={ {
												marginLeft: pxToDp(20),
												flex: 1
											} }>
												<Text
													ellipsizeMode={ 'tail' }
													numberOfLines={ 2 }
													style={ {
														color: '#333333',
														fontSize: pxToDp(28)
													} }
												>{ el.goods_name }</Text>

												<View style={ store.row_between }>
													<Text style={ {
														color: '#FF0902',
														fontSize: pxToDp(32)
													} }>ks{PriceUtil.formatPrice( el.goods_price )}</Text>

													<View
														style={ {
															flexDirection: 'row',
															alignItems: 'center'
														} }
													>
														<TouchableOpacity
															onPress={ () => {
																this.change(el.gid, el.goods_num * 1 - 1)
															} }
														>
															<Image
																style={ store.img_btn }
																resizeMode={ 'contain' }
																source={ require('../images/reduce.png') }
															/>
														</TouchableOpacity>
														<Text style={ {
															width: pxToDp(55),
															fontSize: pxToDp(32),
															color: '#333',
															textAlign: 'center'
														} }>{ el.goods_num }</Text>
														<TouchableOpacity
															onPress={ () => {
																this.change(el.gid, el.goods_num * 1 + 1)
															} }
														>
															<Image
																style={ store.img_btn }
																resizeMode={ 'contain' }
																source={ require('../images/add.png') }
															/>
														</TouchableOpacity>
													</View>
												</View>
											</View>
										</View>
									</TouchableOpacity>)
								}
							}) }
						</ScrollView>

						{cart_list != '' && cart_list.list.length > 0 && cart_list.list.filter(el=>el.error!=0).length>0 && <View style={ store.clearAll }>
							<View style={ store.row }>
								<Text style={ {
									marginLeft: pxToDp(20),
									fontSize: pxToDp(28),
									color: '#333'
								} }>
									全选
								</Text>
							</View>
							<TouchableOpacity
								onPress={ () => this.delerrCart() }
							>
								<Text style={ {color: '#666', fontSize: pxToDp(22)} }>清空失效商品</Text>
							</TouchableOpacity>
						</View>}

						{/*失效商品*/ }
						<ScrollView
							style={ store.cart_scr }
						>
							{ cart_list != '' && cart_list.list.length > 0 && cart_list.list.map(el => {
								if(el.error != 0){
									return (<TouchableOpacity activeOpacity={1} style={ [ store.row, store.cart_goods ] }>
										<TouchableOpacity
											style={ {paddingHorizontal: pxToDp(20)} }
										>
											<Image
												style={ {width: pxToDp(40), height: pxToDp(40)} }
												resizeMode={ 'contain' }
												source={ require('../images/unselect.png') }
											/>
										</TouchableOpacity>
										<View style={ [ store.row, {flex: 1} ] }>
											<Image
												style={ {
													width: pxToDp(120),
													height: pxToDp(120),
													borderRadius: pxToDp(6)
												} }
												resizeMode={ 'contain' }
												source={ {uri: el.goods_image} }
											/>
											<View style={ {
												position: 'relative',
												top: 0,
												left: 0,
												width: pxToDp(120),
												height: pxToDp(120),
												backgroundColor: 'rgba(0,0,0,0.5)',
												alignItems: 'center',
												justifyContent: 'center'
											} }>
												<Text
													style={ {
														color: '#fff',
														fontSize: pxToDp(32)
													} }>{ el.errorinfo }</Text>
											</View>
											<View style={ {
												marginLeft: pxToDp(20),
												flex: 1
											} }>
												<Text
													ellipsizeMode={ 'tail' }
													numberOfLines={ 2 }
													style={ {
														color: '#333333',
														fontSize: pxToDp(28)
													} }
												>{ el.goods_name }</Text>

												<View style={ store.row_between }>
													<Text style={ {
														color: '#FF0902',
														fontSize: pxToDp(32)
													} }>ks{PriceUtil.formatPrice( el.goods_price )}</Text>

													<View
														style={ {
															flexDirection: 'row',
															alignItems: 'center'
														} }
													>
														<TouchableOpacity
														>
															<Image
																style={ store.img_btn }
																resizeMode={ 'contain' }
																source={ require('../images/reduce.png') }
															/>
														</TouchableOpacity>
														<Text style={ {
															width: pxToDp(55),
															fontSize: pxToDp(32),
															color: '#333',
															textAlign: 'center'
														} }>{ el.goods_num }</Text>
														<TouchableOpacity
														>
															<Image
																style={ store.img_btn }
																resizeMode={ 'contain' }
																source={ require('../images/add.png') }
															/>
														</TouchableOpacity>
													</View>
												</View>
											</View>
										</View>
									</TouchableOpacity>)
								}
							}) }
						</ScrollView>

						{ cart_list != '' && <View style={ [ store.row_between, {height: pxToDp(98)} ] }>
							<Text style={ {
								color: '#FF2847',
								fontSize: pxToDp(36),
								paddingLeft: pxToDp(30)
							} }>ks{PriceUtil.formatPrice( cart_list.all_money )}</Text>

							{ error == 1 && <Text style={ [ store.cart_btn, {
								backgroundColor: '#B1B1B1'
							} ] }>
								休息中
							</Text> }

							{ error != 1 && cart_list.list.length == 0 && <Text style={ [ store.cart_btn, {
								backgroundColor: '#B1B1B1'
							} ] }>
								{ delivery }元起送
							</Text> }

							{ error != 1 && cart_list.list.length > 0 && delivery * 1 > cart_list.all_money * 1 &&
							<Text style={ [ store.cart_btn, {
								backgroundColor: '#B1B1B1'
							} ] }>
								差{ delivery - cart_list.all_money }元起送
							</Text> }

							{ error != 1 && cart_list.list.length > 0 && delivery * 1 <= cart_list.all_money * 1 &&
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.submit() }
							>
								<Text style={ [ store.cart_btn, {
									backgroundColor: '#5EB319'
								} ] }>
									去结算
								</Text>
							</TouchableOpacity> }

						</View> }
					</TouchableOpacity>
				</TouchableOpacity> }

				{/*联系商家*/ }
				{this.state.showCall==true && <TouchableOpacity
					style={ store.callwrap }
					activeOpacity={1}
					onPress={()=>{
						this.setState({
							showCall: false
						})
					}}
				>
					<TouchableOpacity
						style={ store.callmain }
						activeOpacity={1}
						onPress={()=>{}}
					>
						<View style={ store.callm }>
							<View style={[store.call_item,{
								borderBottomColor: '#DADADA',
								borderBottomWidth: pxToDp(0.7),
								borderStyle: 'solid'
							}]}>
								<Text style={ store.call_title_txt }>拨打电话</Text>
							</View>
							<TouchableOpacity
								style={ store.call_item }
								activeOpacity={ 1 }
								onPress={()=>{
									Linking.openURL('tel:'+this.state.dian_phone)
								}}
							>
								<Text style={ store.call_call_txt }>{ this.state.dian_phone }</Text>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							activeOpacity={ 1 }
							style={ store.callclose }
							onPress={()=>{
								this.setState({
									showCall: false
								})
							}}
						>
							<Text style={ store.call_title_txt }>取消</Text>
						</TouchableOpacity>
					</TouchableOpacity>
				</TouchableOpacity>}

			</View>
		)
	}
}
const injectedScript = function(){
	function waitForBridge(){
		if(window.postMessage.length !== 1){
			setTimeout(waitForBridge, 200);
		}else{
			let height = 0;
			if(document.documentElement.scrollHeight > document.body.scrollHeight){
				height = document.documentElement.scrollHeight
			}else{
				height = document.body.scrollHeight
			}
			let data = {'type': 'auto_height', 'height': height};
			postMessage(JSON.stringify(data))
		}
	}

	waitForBridge();
};
