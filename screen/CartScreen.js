/*
 * 购物车页面
 * @slodon
 * */

import React, {Component} from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    ScrollView,
    Alert, TextInput, Keyboard, DeviceEventEmitter
} from "react-native";
import NavigationBar from "../component/NavigationBar";
import GlobalStyles from "../assets/styles/GlobalStyles";
import ViewUtils from '../util/ViewUtils'
import PriceUtil from '../util/PriceUtil'
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'
import styles from '../pages/stylejs/cart'
import CountEmitter from "../util/CountEmitter";
import {I18n} from "../lang/index";

var Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

const selectImg = require('../assets/images/selted_cart.png');
const noseleImg = require('../assets/images/paynosele.png');

export default class CartScreen extends Component{
	constructor(props){
		super(props);
		this.state = {
			total: 0.00,  // 购物车总金额
			cartList: [],   // 购物车数据
			RecGoods: [],   // 推荐商品
			selectAll: true,   // 选中全部
			hasCheck: true,
			isLoading: 0,
			changedId: -1,	//修改购物车内商品的数量
			changeNum: "0",
            refresh: false,
			shareGoods: [], //加入的分享商品
		};
	}

	componentWillMount(){
		if(key){
			this.getCartData();
		}
		this.getRecGoodsList();
		CountEmitter.addListener('cart', () => {
			this.getCartData();
		});

		// console.log('购物车语言:', I18n.locale)
	}

	componentDidMount() {
		let { shareGoods } = this.state

        this.lister = DeviceEventEmitter.addListener('languageSettings', () => {
            this.setState({refresh:!this.state.refresh})
        })

		this.shareListner = DeviceEventEmitter.addListener('shareGoods', event => {
			if (event) {
				this.setState({
                    shareGoods: shareGoods.push(event)
				})
			}
		})
	}

	componentWillUnmount(){
		//卸载监听
		CountEmitter.removeListener('cart', () => {
		});

		this.lister.remove()
		this.shareListner.remove()
	}

	// 获取购物车数据
	getCartData(){
		RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=cart_list_store', {
			key
		}).then(res => {
			this.setState({
				isLoading: 1,
			});
			console.log('购物车数据：', JSON.stringify(res))
			if(res.datas.cart_list.length > 0){
				let list = res.datas.cart_list;
				list.forEach(el => {
					el.push(true);
					el[ 2 ].forEach(el2 => {
						el2.select = true;
					})
				});
				this.setState({
					cartList: list,
					changedId: -1,
					total: res.datas.sum,
				})
			}else{
				this.setState({
					cartList: [],
					changedId: -1,
					total: 0,
				});
			}
		}).catch(err => {
			console.log(err);
			this.setState({
				isLoading: 1,
				changedId: -1,
			})
		})
	}

	// 获取推荐商品
	getRecGoodsList(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getRecGoodsList').then(res => {
			let list = res.datas.goods_list;
			this.setState({
				isLoading: 1,
				RecGoods: list
			})
		}).catch(err => {
			console.log(err);
			this.setState({
				isLoading: 1,
			})
		})
	}

	// 计算购物车价格
	cacelPrice(){
		let {cartList} = this.state;
		let total = 0;
		if(cartList.length == 0){
			this.setState({
				total
			})
			return;
		}
		cartList.map(store => {
			store[ 2 ].map(el => {
				if(el.select && el.goods_num > 0){
					total = parseFloat(total + parseFloat(parseFloat(el.goods_price) * parseInt(el.goods_num)));
				}
			})
		})
		this.setState({
			total: total.toFixed(2)
		})
	}

	// all: 全选，  store: 店铺 ，  cart: 单件
	changeCheck = (type, id) => {
		let {selectAll, cartList} = this.state;
		let hasCheck;
		switch(type){
			case 'all' :
				cartList.forEach(store => {
					store[ 3 ] = !selectAll;
					store[ 2 ].forEach(el => {
						el.select = !selectAll;
					})
				})
				this.setState({
					cartList,
					selectAll: !selectAll,
					hasCheck: !selectAll
				}, () => {
					this.cacelPrice()
				});
				break;
			case 'store':
				cartList.forEach(store => {
					if(store[ 0 ] == id){
						let isCheck = store[ 3 ];
						store[ 3 ] = !isCheck;
						store[ 2 ].forEach(el => {
							el.select = !isCheck;
						})
					}
				});
				let selectAll1 = this.checkSelectAll(cartList);
				hasCheck = this.checkHasSelect(cartList);
				this.setState({
					cartList,
					selectAll: selectAll1,
					hasCheck
				}, () => {
					this.cacelPrice()
				})
				break;
			case 'cart':
				cartList.forEach(store => {
					let storeSelectAll = true;
					store[ 2 ].forEach(el => {
						if(el.cart_id == id){
							let isCheck = el.select;
							el.select = !isCheck;
						}
						if(!el.select){
							storeSelectAll = false;
						}
					});
					store[ 3 ] = storeSelectAll;
				});
				let selectAll2 = this.checkSelectAll(cartList);
				hasCheck = this.checkHasSelect(cartList);
				this.setState({
					cartList,
					selectAll: selectAll2,
					hasCheck
				}, () => {
					this.cacelPrice()
				})
				break;
			default:
				break;
		}
	}

	// checkSelectAll
	checkSelectAll(cartList){
		let result = true;
		for(let i = 0; i < cartList.length; i++){
			let store = cartList[ i ];
			if(!store[ 3 ]){
				result = false;
				break;
			}
		}
		return result;
	}

	checkHasSelect(cartList){
		let result = false;
		for(let i = 0; i < cartList.length; i++){
			let store = cartList[ i ];
			for(let j = 0; j < store[ 2 ].length; j++){
				let el = store[ 2 ][ j ];
				if(el && el.select){
					result = true;
					break;
				}
			}
		}
		return result;
	}

	// 购物车加减
	changeGoodsNum = (type, id) => {
		let {cartList} = this.state;
		let item;
		for(let i = 0; i < cartList.length; i++){
			let store = cartList[ i ];
			for(let j = 0; j < store[ 2 ].length; j++){
				if(store[ 2 ][ j ].cart_id == id){
					item = store[ 2 ][ j ];
					break;
				}
			}
			if(item){
				break;
			}
		}
		let {storage, goods_num} = item;
		let quantity;
		if(type == 'add'){
			if(parseInt(storage) < parseInt(goods_num) + 1){
				ViewUtils.sldToastTip(I18n.t('CartScreen.Inventoryshortage'));
				return;
			}
			quantity = parseInt(goods_num) + 1;
		}else{
			if(goods_num == 1){
				return;
			}
			quantity = parseInt(goods_num) - 1;
		}

		RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=cart_edit_quantity', {
			key,
			cart_id: id,
			quantity
		}).then(res => {
			if(res.code == 200){
				for(let i = 0; i < cartList.length; i++){
					let store = cartList[ i ];
					for(let j = 0; j < store[ 2 ].length; j++){
						if(store[ 2 ][ j ].cart_id == id){
							store[ 2 ][ j ].goods_num = res.datas.quantity;
							break;
						}
					}
				}
				this.setState({
					cartList
				}, () => {
					this.cacelPrice();
				})
			}
		}).catch(err => {
			console.log(err)
		})
	}

	// 删除
	del = (id) => {
		let {cartList} = this.state;
		Alert.alert(I18n.t('CartScreen.hint'), I18n.t('CartScreen.text'), [
			{
				text:I18n.t('CartScreen.cancel'),
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: I18n.t('CartScreen.confirm'),
				onPress: () => {
					RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=cart_del', {
						key,
						cart_id: id
					}).then(res => {
						if(res.datas == 1){
							for(let i = 0; i < cartList.length; i++){
								let store = cartList[ i ];
								for(let j = 0; j < store[ 2 ].length; j++){
									let el = store[ 2 ][ j ];
									if(el.cart_id == id){
										store[ 2 ].splice(j, 1);
										break;
									}
								}
								if(store[ 2 ].length == 0){
									cartList.splice(i, 1);
									break;
								}
							}
							console.log(cartList)
							this.setState({
								cartList
							}, () => {
								this.cacelPrice();
							})
						}
					})
				}
			}
		])
	}

	submit = () => {
		let {cartList, hasCheck} = this.state;
		if(!hasCheck) return;

		let ifcart = 1;
		let cart = [];
		cartList.map(store => {
			store[ 2 ].map(el => {
				if(el.select){
					let str = el.cart_id + '|' + el.goods_num;
					cart.push(str);
				}
			})
		})

		this.props.navigation.navigate("ConfirmOrder", {
			if_cart: ifcart,
			cart_id: cart.join(','),
		});
	}

	renSldLeftButton(image){
		return (
			<TouchableOpacity
				activeOpacity={ 1 }
				onPress={ () => {
					this.props.navigation.goBack();
				} }
			>
				<Image
					style={ {width: 20, height: 20, marginLeft: 10} }
					source={ image }
				/>
			</TouchableOpacity>
		);
	}

	handleUpdateGoodNum(item, event){
		Keyboard.dismiss();
		let val = event.nativeEvent.text.replace(/(^\s*)|(\s*$)/g, "");
		if(val && val != ' '){
			// CountEmitter.emit('updateSearchCon');
			this.UpdateGoodNum(item, val);
		}else{
			ViewUtils.sldToastTip(I18n.t('CartScreen.goodserr'));
		}
	}

	UpdateGoodNum(item, newGoodsNum){
		if(ViewUtils.isRealNum(newGoodsNum)){
			let quantity;
			if(parseInt(item.storage) < parseInt(newGoodsNum)){
				ViewUtils.sldToastTip(I18n.t('CartScreen.Inventoryshortage'));
				return;
			}
			quantity = parseInt(newGoodsNum);

			RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=cart_edit_quantity', {
				key,
				cart_id: item.cart_id,
				quantity
			}).then(res => {
				if(res.code == 200){
					this.getCartData();
				}
			}).catch(err => {
				console.log(err)
			})

		}else{
			ViewUtils.sldToastTip(I18n.t('CartScreen.goodserr'));
		}

	}

	render(){
		const {cartList, RecGoods, total, isLoading, changedId, changeNum} = this.state;
		console.warn('ww:cartList', cartList);
		return (
			<View style={[GlobalStyles.sld_container]}>
				<NavigationBar
					statusBar={ {barStyle: "dark-content"} }
					leftButton={
						this.props.navigation.state.routeName != "CartScreen"
							? this.renSldLeftButton(require("../assets/images/goback.png")) : ""
					}
					title={I18n.t('GoodsDetailNew.shoppingcart')}
					popEnabled={ false }
					style={ {backgroundColor: "#fff"} }
				/>
                <Text style={{display: 'none'}}>{this.state.refresh}</Text>
				<View style={ GlobalStyles.line }/>
				{ cartList.length > 0 && <View style={ {flex: 1, paddingBottom: pxToDp(100)} }>
					<ScrollView style={ {height: height - pxToDp(200)} }>
						{ cartList.map(cart => <View style={ styles.store }>
							<View style={ styles.cart_top }>
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.check }
									onPress={ () => this.changeCheck('store', cart[ 0 ]) }
								>
									<Image source={ cart[ 3 ] == true ? selectImg : noseleImg }
									       style={ {width: pxToDp(35), height: pxToDp(35)} }/>
								</TouchableOpacity>
								{/*店铺*/ }
								<TouchableOpacity style={ styles.store_info } onPress={() => cart[2][0] ? this.props.navigation.navigate('Vendor', {'vid': cart[2][0].vid}) : 0}>
									<Image source={ require('../assets/images/sld_chat_go_shop.png') }
									       style={ {width: pxToDp(36), height: pxToDp(36), marginRight: pxToDp(15)} }/>
									<Text style={ {color: '#333', fontSize: pxToDp(28)} }>{ cart[ 1 ] }</Text>
								</TouchableOpacity>
							</View>
							{/*店铺商品*/ }
							<View style={ styles.goodsWrap }>
								{ cart[ 2 ].map(el => <View style={ styles.goods_item }>
									<TouchableOpacity
										activeOpacity={ 1 }
										style={ styles.check }
										onPress={ () => this.changeCheck('cart', el.cart_id) }
									>
										<Image source={ el.select == true ? selectImg : noseleImg }
										       style={ {width: pxToDp(35), height: pxToDp(35)} }/>
									</TouchableOpacity>
									<View style={ styles.img }>
										<Image source={ {uri: el.goods_image_url} }
										       style={ {width: pxToDp(140), height: pxToDp(140)} }
										       resizeMode={ 'contain' }
													 defaultSource={require('../assets/images/default_icon_124.png')}
										/>
									</View>
									<View style={ styles.goods_info }>
										<View style={ styles.info_top }>
											<TouchableOpacity
												style={ styles.goods_name_info }
												onPress={ () => {
													this.props.navigation.navigate('GoodsDetailNew', {
														gid: el.gid
													})
												} }
											>
												<Text ellipsizeMode={ 'tail' }
												      numberOfLines={ 2 }>{ el.goods_name }</Text>
											</TouchableOpacity>
											<TouchableOpacity
												onPress={ () => this.del(el.cart_id) }
											>
												<Image source={ require('../assets/images/sld_delete.png') }
												       style={ {
													       width: pxToDp(20),
													       height: pxToDp(20),
													       padding: pxToDp(20)
												       } }/>
											</TouchableOpacity>

										</View>
										<View style={ styles.info_bottom }>
											<Text style={ {
												color: '#f23030',
												fontSize: pxToDp(28)
											} }>Ks {PriceUtil.formatPrice(el.goods_price)}</Text>

											{/*购物车加减*/ }
											<View style={ styles.edit }>
												<TouchableOpacity
													style={ styles.cart_btn }
													onPress={ () => this.changeGoodsNum('reduce', el.cart_id) }
												>
													<Text style={ {color: '#999', fontSize: pxToDp(28)} }>-</Text>
												</TouchableOpacity>
												<View style={ styles.num }>
													<TextInput
														style={ styles.cart_num_input }
														autoCapitalize='none'
														returnKeyType='done'
														underlineColorAndroid={ 'transparent' }
														placeholderTextColor={ '#999' }
														keyboardType='numeric'
														maxLength={3}
                                                        textAlign={'center'}
														value={changedId === el.cart_id ? changeNum : el.goods_num + ""}
														onBlur={() => {
															if (changedId === el.cart_id) {
																this.setState({
																	changedId: -1,
																	changeNum: "0",
																})
															}
														}}
														onChangeText={(text) => {
															this.setState({
																changedId: el.cart_id,
																changeNum: text
															});
														}}
														onSubmitEditing={ (event) => this.handleUpdateGoodNum(el, event) }
													/>
												</View>
												<TouchableOpacity
													style={ styles.cart_btn }
													onPress={ () => this.changeGoodsNum('add', el.cart_id) }
												>
													<Text style={ {color: '#999', fontSize: pxToDp(28)} }>+</Text>
												</TouchableOpacity>
											</View>
										</View>
									</View>
								</View>) }
							</View>

						</View>) }
					</ScrollView>
					<View style={ styles.footer }>
						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.check }
							onPress={ () => this.changeCheck('all') }
						>
							<Image source={ this.state.selectAll == true ? selectImg : noseleImg }
							       style={ {width: pxToDp(35), height: pxToDp(35)} }/>
						</TouchableOpacity>
						<View style={ styles.foot_right }>
							<View style={ styles.cart_info }>
								<Text>{I18n.t('CartScreen.TotalAmount')}：</Text>
								<Text style={ {color: '#f23030', fontSize: pxToDp(20)} }>Ks <Text
									style={ {fontSize: pxToDp(30)} }>{PriceUtil.formatPrice(total)}</Text></Text>
							</View>
							{/*结算*/}
							<TouchableOpacity
								activeOpacity={ 1 }
								style={ [ styles.go_btn, {backgroundColor: (this.state.hasCheck == true ? '#f23030' : '#BBB')} ] }
								onPress={ () => this.submit() }
							>
								<Text style={ {color: '#fff', fontSize: pxToDp(28)} }>{I18n.t('CartScreen.checkout')}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View> }

				{ cartList.length == 0 && isLoading == 1 &&
				<ScrollView style={ {flex: 1} }>
					<View style={ {height: pxToDp(582), justifyContent: 'center', alignItems: 'center',backgroundColor:'#fff'} }>
						<Image
							style={ styles.cart_empty_img }
							source={ require('../assets/images/cart_empty.png') }
							resizeMode={ 'contain' }
						/>
						<Text style={ [ styles.empty_txt, {fontSize: pxToDp(28)} ] }>{I18n.t('CartScreen.cartempty')}~</Text>
						<Text style={ [ styles.empty_txt, {fontSize: pxToDp(24)} ] }>{I18n.t('CartScreen.lovegood')}</Text>
					</View>

					{/*推荐商品*/ }
					{ RecGoods.length > 0 && isLoading == 1 && <View style={ styles.recommend }>
						<View style={ styles.title_img }>
							<Image
								style={{
									marginHorizontal: 15,
									height: 30
								}}
								resizeMode={ 'contain' }
								source={ require('../assets/images/cart_comm.png') }
							/>
						</View>
						<View style={styles.goods_list}>
							{ RecGoods.map((el, index) =>
								<TouchableOpacity
									key={index}
                                    style={ styles.rec_item }
                                    onPress={() => {
                                    	this.props.navigation.navigate('GoodsDetailNew', {gid: el.gid})
                                    }}
                                    activeOpacity={ 1 }
								>
								<View style={ styles.goods_img }>
									<Image
										source={ {
											uri: el.goods_img_url
										} }
										resizeMode={ 'contain' }
										style={ {width: pxToDp(345), height: pxToDp(345)} }
									/>
								</View>

								<View style={ styles.goods_i }>

									<Text
										style={ styles.goods_name }
										numberOfLines={ 2 }
										ellipsizeMode={ 'tail' }
									>{ el.goods_name }</Text>

									<View style={ styles.wrap }>
										<Text style={{color: '#E1251B',fontSize: pxToDp(24)}}>Ks
											<Text style={ {fontSize: pxToDp(36),fontWeight: '600'} }>{PriceUtil.formatPrice(el.goods_price)}</Text>
										</Text>
									</View>

								</View>

							</TouchableOpacity>) }
						</View>

					</View> }
				</ScrollView> }
			</View>
		);
	}


}


