/*
 * 店铺页面
 * @slodon
 * */

import React, {Component} from 'react';
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	ImageBackground,
	ScrollView,
	FlatList,
	Linking,
	Alert
} from 'react-native';
import GlobalStyles from '../assets/styles/GlobalStyles';
import vendor from './stylejs/vendor';
import ViewUtils from '../util/ViewUtils';
import CountEmitter from "../util/CountEmitter";
import DiyPage from '../component/DiyPage'
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'
import SldFlatList from '../component/SldFlatList';
import LoadingWait from '../component/LoadingWait';
import SldComStatusBar from "../component/SldComStatusBar";
var Dimensions = require('Dimensions');
const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

export default class Vendor extends Component{

	constructor(props){
		super(props);
		this.apn = 1;
		this.ahasmore = true;
		this.npn = 1;
		this.nhasmore = true;
		this.spn = 1;
		this.shasmore = true;
		this.state = {
			vid: props.navigation.state.params.vid,
			datainfo: [],
			diy_data: [],   // 装修数据
			storeInfo: '',   // 店铺信息
			tuiGoods: [],   // 推荐商品
			is_favorites: false,   //是否收藏
			select: 0,
			allGoods: [],   // 所有商品
			newGoods: [],   // 新品
			storeList: [],   // 店铺列表
			show_gotop: false,
			refresh: false,
			isLoading: 0,
		}

		this.navData = [
			{
				name: I18n.t('Vendor.home'),
				imgSrc: require('../assets/images/store_r.png')
			},
			{
				name: I18n.t('Vendor.allgoods'),
				imgSrc: require('../assets/images/goods_r.png')
			},
			{
				name: I18n.t('Vendor.newgoods'),
				imgSrc: require('../assets/images/new_r.png')
			}
		]
	}

	componentWillMount(){
		this.getStoreInfo();
		this.getIndexData();
		this.isFavorites();
	}

	// 获取店铺信息
	getStoreInfo(){
		let {vid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=store&mod=store_detail&key=' + key + '&vid=' + vid).then(res => {
			if(res.code == 200){
				this.setState({
					storeInfo: res.datas
				})
			}
		})
	}

	// 获取装修数据
	getIndexData(){
		let {vid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=index_app&shop_id=' + vid).then(res => {
			if(res.code == 200 && res.datas.index_data.length > 0){
				this.setState({
					datainfo: res.datas.index_data
				}, () => {
					this.handleData();
				})
			}
			this.setState({
				isLoading: 1
			})
			this.getStoreHotGoods();
		}).catch(error => {
			this.setState({
				isLoading: 1
			})
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 获取店铺推荐商品
	getStoreHotGoods(){
		let {vid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=store&mod=getStoreHotGoods&vid=' + vid + '&type=hot').then(res => {
			if(res.code == 200){
				this.setState({
					tuiGoods: res.datas.goods_list ? res.datas.goods_list : []
				})
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 如果登录，是否收藏该店铺
	isFavorites(){
		if(!key) return;
		RequestData.postSldData(AppSldUrl + '/index.php?app=vendorfollow&mod=is_favorites', {
			key,
			vid: this.state.vid
		}).then(res => {
			if(res.code == 200){
				this.setState({
					is_favorites: res.datas.is_favorites == 0 ? false : true
				})
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 处理装修数据
	handleData = () => {
		let datainfo = this.state.datainfo;
		for(let i = 0; i < datainfo.length; i++){
			if(datainfo[ i ][ 'type' ] == 'lunbo'){
				let new_data = datainfo[ i ][ 'data' ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
				this.setState({
					diy_data: datainfo
				});

			}else if(datainfo[ i ][ 'type' ] == 'dapei'){
				let new_data = datainfo[ i ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
				this.setState({
					diy_data: datainfo
				});
			}else if(datainfo[ i ][ 'type' ] == 'tupianzuhe'){
				if(datainfo[ i ][ 'sele_style' ] == 0){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ]);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 1){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], scrWidth * 1 - 20);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 2){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 30) / 2));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 3){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 40) / 3));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 4){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor(datainfo[ i ][ 'data' ][ j ][ 'width' ] * 16 / 15);
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 4);
						}

						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 5){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0 || j == 3){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = scrWidth * 1 - 30 - Math.floor((scrWidth * 1 - 30) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 3);
						}
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 6){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0 || j == 3){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 4);
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 7){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 4){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 40) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 40) / 10 * 7);
						}else{
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 40) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}
						this.setState({
							diy_data: datainfo
						});
					}
				}
			}else{
				this.setState({
					diy_data: datainfo
				});
			}

		}
	}

	// 获取所有商品
	getAllGoods = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=store&mod=goods_list&vid=' + this.state.vid + '&pn=' + this.apn + '&page=10').then(res => {
			if(res.code == 200){
				if(this.apn == 1){
					this.setState({
						allGoods: res.datas.goods_list
					})
				}else{
					let allGoods = this.state.allGoods;
					this.setState({
						allGoods: allGoods.concat(res.datas.goods_list)
					})
				}
				if(res.hasmore){
					this.apn++;
				}else{
					this.ahasmore = false;
				}
			}
			this.setState({
				isLoading: 1
			})
		}).catch(error => {
			this.setState({
				isLoading: 1
			})
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 获取新品
	getNewGoods = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=store&mod=getStoreHotGoods&vid=' + this.state.vid + '&type=new&pn=' + this.npn + '&page=10').then(res => {
			if(res.code == 200){
				if(this.npn == 1){
					let goods_list = res.datas.goods_list;
					this.setState({
						newGoods: goods_list ? goods_list : []
					})
				}else{
					let newGoods = this.state.newGoods;
					this.setState({
						newGoods: newGoods.concat(goods_list ? goods_list : [])
					})
				}
				if(res.hasmore){
					this.npn++;
				}else{
					this.nhasmore = false;
				}
			}
			this.setState({
				isLoading: 1
			})
		}).catch(err => {
			this.setState({
				isLoading: 1
			})
		})
	}

	// 获取店铺列表
	getStoreList(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=store&mod=getDians&vid=' + this.state.vid + '&type=new&pn=' + this.spn + '&page=10').then(res => {
			if(res.code == 200){
				if(this.spn == 1){
					this.setState({
						storeList: res.datas.dians
					})
				}else{
					let {storeList} = this.state;
					this.setState({
						storeList: storeList.concat(res.datas.dians)
					})
				}
			}
		}).catch(err => {
		})
	}

	getNewData(){
		let {select} = this.state;
		if(select == 1){
			if(this.ahasmore){
				this.getAllGoods();
			}
		}else if(select == 2){
			if(this.nhasmore){
				this.getNewGoods();
			}
		}else{
			if(this.shasmore){
				this.getStoreList();
			}
		}
	}

	handleScroll = (event) => {
		let offset_y = event.nativeEvent.contentOffset.y;
		let {show_gotop} = this.state;
		if(!show_gotop && offset_y > 100){
			show_gotop = true
		}
		if(show_gotop && offset_y < 100){
			show_gotop = false
		}
		this.setState({
			show_gotop: show_gotop,
		});
	}

	refresh(){
		let {select} = this.state;
		if(select == 1){
			this.apn = 1;
			this.ahasmore = true;
			this.getAllGoods();
		}else if(select == 2){
			this.npn = 1;
			this.nhasmore = true;
			this.getNewGoods();
		}else{
			this.spn = 1;
			this.shasmore = true;
			this.getStoreList();
		}
	}

	keyExtractor = (item, index) => {
		return index
	}

	//分割线组件
	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.space_shi_separate }/>
		);
	}

	// 切换分类
	changeNav = index => {
		let {allGoods, newGoods, storeList} = this.state;
		if(index == 1 && allGoods.length == 0){
			this.setState({
				isLoading: 0
			}, () => {
				this.getAllGoods()
			})
		}
		if(index == 2 && newGoods.length == 0){
			this.setState({
				isLoading: 0
			}, () => {
				this.getNewGoods();
			})
		}
		if(index == 3 && storeList.length == 0){
			this.setState({
				isLoading: 0
			}, () => {
				this.getStoreList();
			})
		}
		this.setState({
			select: index
		})
	}


	//收藏店铺
	collect = () => {
		let {vid, storeInfo} = this.state;
		if(key){
			if(this.state.is_favorites){
				//取消收藏
				RequestData.postSldData(AppSldUrl + '/index.php?app=vendorfollow&mod=fdel', {
					key: key,
					vid: vid
				})
					.then(result => {
						if(!result.datas.error){
							ViewUtils.sldToastTip(I18n.t('Vendor.nocollect'));
							CountEmitter.emit('updateOrderDetailList');
							storeInfo.store_collect = parseInt(storeInfo.store_collect) - 1;
							this.setState({
								is_favorites: false,
								storeInfo
							})
						}else{
							ViewUtils.sldToastTip(result.datas.error);
						}
					})
					.catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
			}else{
				//收藏
				RequestData.postSldData(AppSldUrl + '/index.php?app=vendorfollow&mod=fadd', {key: key, vid: vid})
					.then(result => {
						if(!result.datas.error){
							ViewUtils.sldToastTip(I18n.t('Vendor.Collectionsuccess'));
							CountEmitter.emit('updateOrderDetailList');
							storeInfo.store_collect = parseInt(storeInfo.store_collect) + 1;
							this.setState({
								is_favorites: true,
								storeInfo
							})
						}else{
							ViewUtils.sldToastTip(result.datas.error);
						}
					})
					.catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
			}
		}else{
			this.props.navigation.navigate('Login');
		}
	}

	// 商品渲染
	renderItem = el => {
		return (<TouchableOpacity
			style={ vendor.goods_item }
			onPress={ () => {
				this.props.navigation.navigate('GoodsDetailNew', {gid: el.gid})
			} }
		>
			<Image
				source={ {uri: el.goods_image_url} }
				style={ {width: pxToDp(350), height: pxToDp(350)} }
				resizeMode={ 'contain' }
			/>
			<Text
				style={ {color: '#000', fontSize: pxToDp(26)} }
				ellipsizeMode={ 'tail' }
				numberOfLines={ 2 }>{ el.goods_name }</Text>
			<View style={ vendor.price }>
				<Text style={ {color: '#EC5464', fontSize: pxToDp(24), marginRight: pxToDp(10)} }>Ks</Text>
				<Text style={ {color: '#EC5464', fontSize: pxToDp(26)} }>{ PriceUtil.formatPrice(el.goods_price) }</Text>
			</View>
			<View style={ vendor.sale }>
				<Text style={ {color: '#999', fontSize: pxToDp(26)} }>{I18n.t('GoodsSearchList.salesvolume')}：{ el.goods_salenum }</Text>
			</View>
		</TouchableOpacity>)
	}

	// 拨打电话
	call = phone => {
		if(phone[ 0 ] != ''){
			Alert.alert(I18n.t('PreSaleOrderDetail.hint'), I18n.t('Vendor.call'), [
				{
					text: I18n.t('SearchPage.cancel'),
					onPress: () => {

					},
					style: 'cancel'
				},
				{
					text: I18n.t('PerfectInfo.confirm'),
					onPress: () => {
						Linking.openURL('tel:' + phone[ 0 ])
					}
				}
			])
		}
	}

	// 店铺列表渲染
	renderStoreItem = el => {
		return (
			<View style={ vendor.dian_item }>
				<View style={ vendor.img }>
					<Image
						source={ {uri: el.dian_logo} }
						resizeMode={ 'contain' }
						style={ {width: pxToDp(170), height: pxToDp(170)} }
					/>
				</View>
				<View style={ vendor.dian_info }>
					<View style={ vendor.dian_top }>
						<Text
							style={ {color: '#000', fontSize: pxToDp(30), fontWeight: '600'} }
						>{ el.dian_name }</Text>
						<Text
							style={ {
								color: '#666',
								fontSize: pxToDp(24),
								marginTop: pxToDp(10)
							} }
							ellipsizeMode={ 'tail' }
							numberOfLines={ 2 }
						>{ el.dian_address }</Text>
					</View>
					<View style={ [ vendor.dian_cz, vendor.dian_top ] }>
						<TouchableOpacity
							style={ vendor.dian_cz_item }
							onPress={ () => this.call(el.dian_phone) }
						>
							<Image
								style={ {width: pxToDp(30), height: pxToDp(30)} }
								source={ require('../assets/images/tel_b.png') }
							/>
							<Text>电话</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={ vendor.dian_cz_item }
						>
							<Image
								style={ {width: pxToDp(30), height: pxToDp(30)} }
								source={ require('../assets/images/address_b.png') }
							/>
							<Text>导航{I18n.t('Vendor.home')}</Text>
						</TouchableOpacity>
					</View>
				</View>
				<Image
					source={ require('../assets/images/arrow_right_b.png') }
					style={ {
						width: pxToDp(30),
						height: pxToDp(30),
						opacity: 0.4,
						marginHorizontal: pxToDp(20),
					} }
				/>
			</View>
		)
	}

	render(){
		const {storeInfo, tuiGoods, is_favorites, select, diy_data, allGoods, newGoods, storeList, isLoading} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation }  barStyle={'dark-content'}/>
				<TouchableOpacity
					style={ {position: 'absolute', zIndex: 99999, top: 40, left: 0} }
					onPress={ () => {
						this.props.navigation.goBack();
					} }>
					<View style={ GlobalStyles.topBackBtn }>
						<Image style={ GlobalStyles.topBackBtnImg }
						       source={ require('../assets/images/goback.png') }/>
					</View>
				</TouchableOpacity>

				<ImageBackground source={ {uri: storeInfo.store_banner} } style={ vendor.store_top }>
					<View style={ vendor.store_info }>
						<View style={ vendor.s_left }>
							<Image style={ vendor.store_img } resizeMode={'contain'} source={ {uri: storeInfo.store_label} }/>
							<View style={ vendor.s_info }>
								<Text style={ {color: '#fff', fontSize: pxToDp(28)} }>{ storeInfo.store_name }</Text>
								<Text style={ {
									color: '#dfdfdf',
									fontSize: pxToDp(20),
									marginTop: pxToDp(10)
								} }>{ storeInfo.store_collect }{I18n.t('Vendor.collect')}</Text>
							</View>
						</View>
						<TouchableOpacity
							style={ [ vendor.s_right, {
								backgroundColor: (is_favorites == true ? '#fff' : '#f23030')
							} ] }
							onPress={ () => this.collect() }
						>
							<Text style={ {
								fontSize: pxToDp(24),
								color: (is_favorites == true ? '#686868' : '#fff')
							} }>{ is_favorites == true ? I18n.t('Vendor.havealreadycollected') : I18n.t('Vendor.enshrine') }</Text>
						</TouchableOpacity>
					</View>
				</ImageBackground>

				<View style={ vendor.nav }>
					{ this.navData.map((el, index) => <TouchableOpacity
						style={ [ vendor.nav_item, {
							borderBottomColor: (select == index ? '#F23030' : 'transparent')
						} ] }
						onPress={ () => this.changeNav(index) }
					>
						<Image source={ el.imgSrc }
						       style={ {width: pxToDp(40), height: pxToDp(40), tintColor: '#666'} }/>
						<Text style={ {
							color: (select == index ? '#F23030' : '#333'),
							fontSize: pxToDp(26),
							marginTop: pxToDp(10)
						} }>{ el.name }</Text>
					</TouchableOpacity>) }
				</View>

				<View style={ GlobalStyles.line }/>

				{/*店铺首页*/ }
				{ select == 0 && diy_data.length > 0 &&
				<ScrollView style={ {flex: 1} }>
					{ diy_data.length > 0 &&
					diy_data.map((item, index) => {
						return (<DiyPage key={ index } navigation={ this.props.navigation } data={ item }/>)
					})
					}
				</ScrollView> }

				{ select == 0 && diy_data.length == 0 && tuiGoods.length > 0 && <FlatList
					data={ tuiGoods }
					extraData={ this.state }
					horizontal={ false }
					numColumns={ 2 }
					renderItem={ ({item}) => this.renderItem(item) }
				/> }

				{ select == 0 && diy_data.length == 0 && tuiGoods.length == 0 && isLoading == 1 &&
				<View style={ {flex: 1, alignItems: 'center', justifyContent: 'center'} }>
					{ ViewUtils.noData() }
				</View> }

				{/*全部商品*/ }
				{ select == 1 && allGoods.length > 0 && <SldFlatList
					data={ allGoods }
					horizontal={ false }
					numColumns={ 2 }
					refresh_state={ this.state.refresh }
					show_gotop={ this.state.show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderItem(item) }
				/> }

				{ select == 1 && allGoods == 0 && isLoading == 1 &&
				<View style={ {flex: 1, alignItems: 'center', justifyContent: 'center'} }>
					{ ViewUtils.noData() }
				</View> }

				{/* 商品上新*/ }
				{ select == 2 && newGoods.length > 0 && <SldFlatList
					data={ newGoods }
					horizontal={ false }
					numColumns={ 2 }
					refresh_state={ this.state.refresh }
					show_gotop={ this.state.show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderItem(item) }
				/> }

				{ select == 2 && newGoods == 0 && isLoading == 1 &&
				<View style={ {flex: 1, alignItems: 'center', justifyContent: 'center'} }>
					{ ViewUtils.noData() }
				</View> }

				{/*门店列表*/ }
				{/*{select == 3 && storeList.length > 0 && <SldFlatList
				 data={storeList}
				 refresh_state={this.state.refresh}
				 show_gotop={this.state.show_gotop}
				 refresh={() => this.refresh()}
				 keyExtractor={() => this.keyExtractor()}
				 handleScroll={(event) => this.handleScroll(event)}
				 getNewData={() => this.getNewData()}
				 separatorComponent={() => this.separatorComponent()}
				 renderCell={(item) => this.renderStoreItem(item)}
				 />}*/ }

				{/*{select == 3 && storeList.length == 0 &&
				 <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				 {ViewUtils.noData()}
				 </View>}*/ }

				{/*店铺介绍*/ }
				<TouchableOpacity
					style={ vendor.store_js }
					onPress={ () => {
						this.props.navigation.navigate('VendorInstro', {vid: this.state.vid})
					} }
				>
					<Text style={ {color: '#666', fontSize: pxToDp(26)} }>{I18n.t('Vendor.store')}</Text>
				</TouchableOpacity>

				{ isLoading == 0 && <LoadingWait/> }
			</View>
		)
	}
}
