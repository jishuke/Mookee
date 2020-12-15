import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image,
	FlatList,
	Alert, DeviceEventEmitter, Platform, Animated,
	Easing,
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import store from '../styles/store'
import LdjGoods from '../../component/LdjGoods'
import LdjCart from '../../component/LdjCart'
import Modal from 'react-native-root-modal';
import {Manager as ModalManager} from 'react-native-root-modal';
import SldComStatusBar from "../../component/SldComStatusBar";
import PriceUtil from '../../util/PriceUtil'

const {width, height} = Dimensions.get('window');

const hiddenMarginTop = height;
const showMarginTop = height / 2;
const modalHeight = showMarginTop;
const leftSpace = 100;

let page = 10;
let pn = 1;
let hasmore = true;

export default class LdjStore extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '',
			vid: props.navigation.state.params.vid,
			stcids_list: [],   // 商品分类
			dian_info: '',  // 店铺详情
			cart_list: '',   // 店铺购物车
			stcid: 'all',    // 分类id
			goods_list: [],   // 商品列表
			isLoading: 0,
			stc_name: '全部',
			refresh: false,
			order: '',         // p: 价格   s:销量
			ordertype: '',     //'asc'升序 'desc'降序
			selectAll: true,    // 全选
			selectNum: 0,     // 选中的数量
			visible: true,
			allcount: 0,
			isShowModal: false
		}
		this.marginLeftValue = new Animated.Value(0); // 左侧向右动画初始值，默认为0
		this.fadeInAnimated = new Animated.Value(0); // 渐隐动画初始值，默认为0，透明
	}

	componentDidMount(){
		this.getStoreInfo();
		this.getCatGoods();
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.getStoreInfo();
			this.getCatGoods();
		});
		this.lister = DeviceEventEmitter.addListener('updateStoreCart', () => {
			this.getStoreInfo();
			this.getCatGoods();
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
					stcids_list: res.stcids_list,
					selectNum: selectNum
				})
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 获取分类商品
	getCatGoods(){
		let {stcid, vid, order, ordertype} = this.state;
		let url = AppSldUrl + '/index.php?app=dian&mod=search_goods&sld_addons=ldj&key=' + key + '&dian_id=' + vid + '&pn=' + pn + '&page=' + page + '&stcid=' + stcid;
		if(order){
			url += '&order=' + order;
		}
		if(ordertype){
			url += '&ordertype=' + ordertype;
		}
		RequestData.getSldData(url).then(res => {
			if(res.status == 200){
				if(pn == 1){
					this.setState({
						goods_list: res.goods_list.list,
						allcount: res.goods_list.count_list
					})
				}else{
					let {goods_list} = this.state;
					this.setState({
						goods_list: goods_list.concat(res.goods_list.list)
					})
				}
				if(res.goods_list.ismore.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
			}else{
				hasmore = false;
			}
			this.setState({
				isLoading: 1,
				refresh: false
			})
		}).catch(err => {
			this.setState({
				isLoading: 1,
				refresh: false
			})
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 切换分类
	changeCat = (id, name) => {
		const stcid = this.state.stcid;
		if(stcid == id) return;
		pn = 1;
		hasmore = true;
		this.setState({
			stcid: id,
			stc_name: name
		}, () => {
			this.getCatGoods();
		})
	}

	// 加载更多
	getMore = () => {
		if(hasmore){
			this.getCatGoods();
		}
	}

	// 刷新
	refresh = () => {
		pn = 1;
		hasmore = true;
		this.setState({
			refresh: true
		}, () => {
			this.getCatGoods();
		})
	}

	// 排序  s: 销量   p: 价格
	sort = (type) => {
		pn = 1;
		hasmore = true;
		let {order, ordertype} = this.state;
		let newOrdertype = ordertype == 'asc' ? 'desc' : 'asc';
		this.setState({
			order: type,
			ordertype: newOrdertype
		}, () => {
			this.getCatGoods();
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
				DeviceEventEmitter.emit('cartUpdate');
				this.updateCart(res.cart_list)
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 更新购物车
	updateCart(res){
		let {cart_list, goods_list} = this.state;
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
		goods_list.forEach(el => el.cart_num = 0);
		for(let i = 0; i < cart_list.list.length; i++){
			let item = cart_list.list[ i ];
			for(let j = 0; j < goods_list.length; j++){
				if(goods_list[ j ].gid == item.gid){
					goods_list[ j ].cart_num = item.goods_num;
					break;
				}
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
			goods_list: goods_list,
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
					}).catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
				}
			}
		])
	}

	// 删除失效商品
	delerrCart = () => {
		let {cart_list} = this.state;
		let arr = [];
		cart_list.list.map(el => {
			if(el.error == 1){
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
		let {vid, cart_list} = this.state;
		let cart_ids = this.select_cart_id();
		let delivery_type = cart_list.list[ 0 ].delivery_type;
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
		const {dian_info, stcids_list, goods_list, isLoading, stcid, cart_list} = this.state;
		const delivery = dian_info.ldj_delivery_order_Price;
		const error = dian_info.error;
		const movingMargin = this.marginLeftValue.interpolate({
			inputRange: [ 0, 1 ],
			outputRange: [ hiddenMarginTop, showMarginTop ]
		});
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				{/*头部 start*/ }
				<View style={ store.storeHeader }>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ {padding: pxToDp(20)} }
						onPress={ () => {
							this.props.navigation.pop()
						} }
					>
						<Image
							style={ {width: pxToDp(16), height: pxToDp(24)} }
							resizeMode={ 'contain' }
							source={ require('../images/back.png') }
						/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					style={ store.store_name }
					activeOpacity={ 1 }
					onPress={ () => {
						this.props.navigation.navigate('LdjStoreDetail', {vid: this.state.vid})
					} }
				>
					<View style={ styles.store_logo }>
						{ dian_info != '' && <Image
							resizeMode={ 'contain' }
							source={ {uri: dian_info.dian_logo} }
							style={ {width: pxToDp(120), height: pxToDp(120)} }
						/> }

					</View>
					{ dian_info != '' && <View style={ store.store_info }>
						<Text style={ {color: '#fff', fontSize: pxToDp(32)} }>{ dian_info.dian_name }</Text>
						<Text style={ {
							color: '#fff',
							fontSize: pxToDp(20),
							marginTop: pxToDp(10)
						} }>{ dian_info.freight }</Text>
						<View style={ {
							backgroundColor: '#519C15',
							borderRadius: pxToDp(4),
							paddingLeft: pxToDp(6),
							height: pxToDp(26),
							justifyContent: 'center',
							marginTop: pxToDp(14)
						} }>
							<Text
								style={ {
									color: '#fff',
									fontSize: pxToDp(20),
								} }
							>
								{ dian_info.ldj_notice ? dian_info.ldj_notice : '暂无公告' }
							</Text>
						</View>
					</View> }
				</TouchableOpacity>
				{/*头部 end*/ }

				{/*搜索 start*/ }
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ store.search }
					onPress={ () => {
						this.props.navigation.navigate('LdjSearch', {type: 2, vid: this.state.vid})
					} }
				>
					<Image
						style={ {width: pxToDp(27), height: pxToDp(27), marginRight: pxToDp(20)} }
						resizeMode={ 'contain' }
						source={ require('../images/search.png') }
					/>
					<Text style={ {color: '#BABABA', fontSize: pxToDp(28)} }>搜索本店商品</Text>
				</TouchableOpacity>
				{/*搜索 end*/ }

				{/*商品 start*/ }
				<View style={ {flexDirection: 'row', flex: 1} }>
					{/*左侧分类 start*/ }
					<View style={ store.goods_left }>
						<ScrollView
							style={ {width: pxToDp(180)} }
						>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.changeCat('all', '全部') }
								style={ [ store.cat,
									{borderTopWidth: pxToDp(1), borderTopColor: '#EAEAEA'},
									(stcid == 'all' ? store.cat_on : '')
								] }
							>
								<Text style={ [ store.cat_txt, (stcid == 'all' ? store.cat_on_txt : '') ] }>全部</Text>
							</TouchableOpacity>

							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.changeCat('recommend', '推荐') }
								style={ [ store.cat, (stcid == 'recommend' ? store.cat_on : '') ] }
							>
								<Text
									style={ [ store.cat_txt, (stcid == 'recommend' ? store.cat_on_txt : '') ] }>推荐</Text>
							</TouchableOpacity>

							{ stcids_list.length > 0 && stcids_list.map(el => <TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => this.changeCat(el.stc_id, el.stc_name) }
								style={ [ store.cat, (stcid == el.stc_id ? store.cat_on : '') ] }
							>
								<Text
									style={ [ store.cat_txt, (stcid == el.stc_id ? store.cat_on_txt : '') ] }>{ el.stc_name }</Text>
							</TouchableOpacity>) }
						</ScrollView>
					</View>
					{/*左侧分类 end*/ }

					{/*右侧商品列表 start*/ }
					<View
						style={ store.goods_right }
					>
						<View style={ store.sort }>
							<View style={ store.sort_left }>
								<Text style={ {
									color: '#999999',
									fontSize: pxToDp(22)
								} }>{ this.state.stc_name }({ this.state.allcount })</Text>
							</View>
							<View style={ store.sort_right }>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.sort('s') }
								>
									<Text style={ {
										color: (this.state.order == 's' && this.state.ordertype == 'dasc') ? '#5EB319' : '#999999',
										fontSize: pxToDp(22)
									} }>销量</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={ {
										flexDirection: 'row',
										alignItems: 'center',
										marginLeft: pxToDp(30)
									} }
									onPress={ () => this.sort('p') }
								>
									<Text
										style={ {
											marginRight: pxToDp(6),
											color: '#999',
											fontSize: pxToDp(22)
										} }>价格</Text>
									<View>
										<Image
											style={ {
												width: pxToDp(20),
												height: pxToDp(10),
												tintColor: (this.state.order == 'p' && this.state.ordertype == 'asc') ? '#5EB319' : '#999999'
											} }
											resizeMode={ 'contain' }
											source={ require('../images/sjup.png') }
										/>
										<Image
											style={ {
												width: pxToDp(20),
												height: pxToDp(10),
												marginTop: pxToDp(6),
												tintColor: (this.state.order == 'p' && this.state.ordertype == 'desc') ? '#5EB319' : '#999999'
											} }
											resizeMode={ 'contain' }
											source={ require('../images/sjdown.png') }
										/>
									</View>
								</TouchableOpacity>
							</View>
						</View>

						{ goods_list.length > 0 && isLoading == 1 && <FlatList
							data={ goods_list }
							extraData={ this.state }
							refreshing={ this.state.refresh }
							onRefresh={ () => this.refresh() }
							onEndReached={ () => this.getMore() }
							renderItem={ ({item}) => {
								return <View key={ item.gid }>
									<LdjGoods
										info={ item }
										goodsDetail={ (gid) => {
											const {vid} = this.state;
											this.props.navigation.navigate('LdjGoodsDetail', {gid: gid, vid: vid})
										} }
										onChange={ (gid, num) => this.change(gid, num) }
									/>
								</View>
							} }
						/> }

						{ goods_list.length == 0 && isLoading == 1 && <View style={ store.err }>
							<Image
								style={ {width: pxToDp(106), height: pxToDp(106)} }
								resizeMode={ 'contain' }
								source={ require('../images/ngoods.png') }
							/>
							<Text
								style={ {color: '#666', fontSize: pxToDp(26), marginTop: pxToDp(50)} }>该分类暂无商品</Text>
						</View> }

					</View>
					{/*右侧商品列表 end*/ }
				</View>
				{/*商品 start*/ }

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

				{/*店铺休息提示*/}
				{ error == 1 && this.state.visible == true && <View
					style={ {
						position: 'absolute',
						top: 0,
						left: 0,
						width: width,
						height: height,
						backgroundColor: 'rgba(0,0,0,0.5)',
						zIndex: 99999,
						alignItems: 'center',
						justifyContent: 'center'
					} }
				>
					<View
						style={ {
							alignItems: 'center'
						} }
					>
						<View style={ {
							width: pxToDp(415),
							height: pxToDp(492),
							backgroundColor: '#fff',
							alignItems: 'center',
							justifyContent: 'center',
						} }>
							<Image
								style={ {width: pxToDp(203), height: pxToDp(204)} }
								resizeMode={ 'contain' }
								source={ require('../images/store_err.png') }
							/>
							<Text style={ {
								marginTop: pxToDp(70),
								color: '#333',
								fontSize: pxToDp(30)
							} }>本店休息啦</Text>
						</View>
						<TouchableOpacity
							onPress={ () => {
								this.setState({
									visible: false
								})
							} }
						>
							<Image
								style={ {width: pxToDp(58), height: pxToDp(114)} }
								resizeMode={ 'contain' }
								source={ require('../images/store_close.png') }
							/>
						</TouchableOpacity>
					</View>
				</View> }

				{/*购物车弹出层 start*/ }
				{ cart_list != '' && this.state.isShowModal == true && <TouchableOpacity
					activeOpacity={ 1 }
					style={ store.modalStyle }
					onPress={ () => {
						this.setState({
							isShowModal: false
						})
					} }
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
						activeOpacity={ 1 }
						onPress={ () => {} }
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
							onScroll={e=>{
							}}
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


			</View>
		)
	}
}

