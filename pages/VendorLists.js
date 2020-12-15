/*
 * 店铺列表页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	Dimensions,
	Keyboard,
	StyleSheet, TextInput
} from 'react-native';
import pxToDp from "../util/pxToDp";
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import SldHeader from '../component/SldHeader';
import RequestData from '../RequestData';
import SldFlatList from '../component/SldFlatList';
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

const {width, height} = Dimensions.get('window');

export default class VendorLists extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: I18n.t('VendorLists.title'),
			storeList: [],
			refresh: false,
			show_gotop: false,
			isLoading: 0,
			pn: 1,
			hasmore: true,
			keyword: ''
		}
	}

	componentWillMount(){
		this.getShopList();
	}


	//搜索按钮事件
	handleSldSearchEvent = (e) => {
		let val = e.nativeEvent.text.replace(/(^\s*)|(\s*$)/g, "");
		if(val && val != ' '){
			// CountEmitter.emit('updateSearchCon');
			this.search(val);
		}else{
			ViewUtils.sldToastTip(I18n.t('SearchPage.text1'));
		}
	}

	handleSldSearch = (e) => {
		Keyboard.dismiss();
		let val = e.replace(/(^\s*)|(\s*$)/g, "");
		if(val && val != ' '){
			// CountEmitter.emit('updateSearchCon');
			this.search(val);
		}else{
			ViewUtils.sldToastTip(I18n.t('SearchPage.text1'));
		}
	}

	getShopList(keyword){
		let {hasmore, pn} = this.state;
		let url = AppSldUrl + '/index.php?app=store&mod=lists&page=10&pn=' + pn;
		if(key){
			url += '&key=' + key;
		}
		if(CitySite.bid != undefined && CitySite.bid > 0){
			url += '&bid=' + CitySite.bid;
		}
		if(keyword){
			url += '&keyword=' + keyword;
		}
		RequestData.getSldData(url).then(res => {
			if(res.code == 200){
				if(pn == 1){
					this.setState({
						storeList: res.datas.store_list,
						isLoading: 1
					})
				}else{
					let {storeList} = this.state;
					this.setState({
						storeList: storeList.concat(res.datas.store_list)
					})
				}
				if(res.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
			}else{
				hasmore = false;
				this.setState({
					isLoading: 1
				})
			}
			this.setState({
				hasmore: hasmore,
				pn: pn
			})
		}).catch(err => {
			this.setState({
				isLoading: 1
			})
		})
	}

	//输入事件
	handleSldPass(data){
		this.setState(data);
	}

	refresh = () => {
		this.setState({
			pn: 1,
			hasmore: true
		}, () => {
			this.getShopList();
		})
	}

	search = (keyword) => {
		this.setState({
			pn: 1,
			hasmore: true
		}, () => {
			this.getShopList(keyword);
		})
	}

	keyExtractor = (item, index) => {
		return index
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

	getNewData = () => {
		if(this.state.hasmore){
			this.getShopList();
		}
	}
	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.space_shi_separate }/>
		);
	}


	// 收藏
	collect = (vid, isfav) => {
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			let url = (isfav == 0 ? AppSldUrl + '/index.php?app=vendorfollow&mod=fadd' : AppSldUrl + '/index.php?app=vendorfollow&mod=fdel');
			RequestData.postSldData(url, {key, vid}).then(res => {
				if(res.code == 200 && res.datas == 1){
					let {storeList} = this.state;
					for(let i = 0; i < storeList.length; i++){
						if(storeList[ i ].vid == vid){
							storeList[ i ].is_fav = isfav == 0 ? 1 : 0;
							storeList[ i ].store_collect = isfav == 0 ? storeList[ i ].store_collect * 1 + 1 : storeList[ i ].store_collect * 1 - 1;
							break;
						}
					}
					this.setState({
						storeList
					})
				}
			})
		}
	}

	renderCell = (item) => {
		return (<View style={ styles.store_item }>
			<View style={ styles.store_name }>
				<View style={ styles.name }>
					<TouchableOpacity
						style={ styles.store_logo }
						activeOpacity={ 1 }
						onPress={ () => {
							this.props.navigation.navigate('Vendor', {vid: item.vid})
						} }
					>
						<Image
							style={ {width: pxToDp(120), height: pxToDp(120)} }
							resizeMode={ 'contain' }
							source={ {uri: item.store_label} }
						/>
					</TouchableOpacity>
					<View style={ styles.store_info }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('Vendor', {vid: item.vid})
							} }
						>
							<Text style={ {
								color: '#000',
								fontSize: pxToDp(28),
								marginBottom: pxToDp(15)
							} }>{ item.store_name }</Text>
						</TouchableOpacity>
						<Text style={ {
							color: '#000',
							fontSize: pxToDp(28)
						} }>{I18n.t('GoodsDetailNew.common')}{ item.goods_count }{I18n.t('GoodsDetailNew.text55')}， { item.store_collect }{I18n.t('GoodsDetailNew.people1')}</Text>
					</View>
				</View>
				<View style={ styles.collect }>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.col_btn }
						onPress={ () => this.collect(item.vid, item.is_fav) }
					>
						<Text style={ {color: '#fff', fontSize: pxToDp(26)} }>{ item.is_fav == 0 ? I18n.t('Vendor.enshrine') : I18n.t('Vendor.havealreadycollected') }</Text>
					</TouchableOpacity>
				</View>
			</View>

			{ item.search_list_goods && item.search_list_goods.length != undefined && item.search_list_goods.length > 0 &&
			<View style={ styles.goods }>
				{ item.search_list_goods.map((el, index) => {
					if(index < 2){
						return (<TouchableOpacity
							onPress={ () => {
								this.props.navigation.navigate('GoodsDetailNew', {gid: el.gid});
							} }
							activeOpacity={ 1 }
							style={ styles.goods_item }
						>
							<View style={ styles.goods_img }>
								<Image
									resizeMode={ 'contain' }
									style={ {width: pxToDp(320), height: pxToDp(320)} }
									source={ {uri: el.goods_image_url} }
								/>
							</View>
							<View style={ styles.goods_info }>
								<Text
									style={ {
										color: '#000',
										fontSize: pxToDp(26),
										height: pxToDp(56),
										lineHeight: pxToDp(28),
										marginBottom: pxToDp(10)
									} }
									numberOfLines={ 2 }
									ellipsizeMode={ 'tail' }
								>
									{ el.goods_name }
								</Text>
								<View style={ styles.price }>
									<Text style={ {
										color: '#F23030',
										fontSize: pxToDp(22)
									} }>Ks<Text style={ {fontSize: pxToDp(28)} }>{ PriceUtil.formatPrice(el.show_price) }</Text></Text>
									<Text style={ {color: '#999', fontSize: pxToDp(26)} }>{I18n.t('Vendor.sale')}{ el.goods_salenum }{I18n.t('GoodsDetailNew.piece')}</Text>
								</View>
							</View>
						</TouchableOpacity>)
					}
				}) }
			</View> }
		</View>)
	}

	render(){
		const {title, storeList, refresh, show_gotop, isLoading} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ GlobalStyles.line }/>

				<View style={ {flexDirection: 'row',} }>
					<View style={ styles.homesearchcons }>
						<Image style={ styles.homeSearchimg } source={ require('../assets/images/search.png') }/>
						<TextInput
							style={ [ {
								color: '#666',
								fontSize: pxToDp(26),
								width: pxToDp(550),
								padding: 0,
								backgroundColor: '#ebebeb',
								height: pxToDp(60)
							}, GlobalStyles.sld_global_font ] }
							ref={ "searchInput" }
							underlineColorAndroid={ 'transparent' }
							autoCapitalize='none'
							autoFocus={ false }
							returnKeyType='search'
							keyboardType='default'
							enablesReturnKeyAutomatically={ true }
							onSubmitEditing={ (event) => this.handleSldSearchEvent(event) }
							placeholder={I18n.t('VendorInstro.search_store')}
							onChangeText={ (text) => this.handleSldPass({'keyword': text}) }>

						</TextInput>
					</View>

					<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
						this.handleSldSearch(this.state.keyword);
					} }>
						<View style={ styles.cancelBack }>
							<Text style={ [ GlobalStyles.sld_global_font, styles.cancelBackText ] }>{I18n.t('VendorInstro.search')}</Text>
						</View>
					</TouchableOpacity>
				</View>
				{ storeList.length > 0 && <SldFlatList
					data={ storeList }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderCell(item) }
				/> }

				{ isLoading == 1 && storeList.length == 0 && <View style={ {flex: 1, justifyContent: 'center'} }>
					{ ViewUtils.noData2({
						title: I18n.t('VendorInstro.no_search'),
						tip: I18n.t('VendorInstro.select_search'),
						btnTxt: I18n.t('VendorInstro.reselect'),
						imgSrc: require('../assets/images/search_w.png'),
						callback: () => {
							this.props.navigation.popToTop();
						}
					}) }
				</View> }

			</View>
		)
	}
}

const styles = StyleSheet.create({
	store_item: {
		backgroundColor: '#fff',
		marginBottom: pxToDp(20)
	},
	store_name: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20),
		paddingVertical: pxToDp(30),
		borderBottomWidth: pxToDp(0.6),
		borderBottomColor: '#efefef',
		borderStyle: 'solid',
	},
	name: {
		flexDirection: 'row'
	},
	store_logo: {
		width: pxToDp(120),
		height: pxToDp(120),
		borderColor: '#efefef',
		borderWidth: pxToDp(0.6),
		borderStyle: 'solid',
		justifyContent: 'center',
		alignItems: 'center',
	},
	store_info: {
		marginLeft: pxToDp(15),
	},
	col_btn: {
		width: pxToDp(100),
		height: pxToDp(54),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f23030',
		borderRadius: pxToDp(6)
	},
	goods: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20),
		backgroundColor: '#fafafa',
	},
	goods_item: {
		width: pxToDp(350),
		height: pxToDp(540),
		backgroundColor: '#fff',
		paddingHorizontal: pxToDp(15),
		paddingTop: pxToDp(20)
	},
	goods_img: {
		width: pxToDp(320),
		height: pxToDp(320),
		justifyContent: 'center',
		alignItems: 'center',
	},
	goods_info: {
		padding: pxToDp(20),
		marginTop: pxToDp(20),
		justifyContent: 'space-between',
	},
	price: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	homesearchcons: {
		flexDirection: 'row',
		backgroundColor: '#ebebeb',
		width: pxToDp(600),
		height: pxToDp(60),
		borderRadius: 4,
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginLeft: pxToDp(20)
	},

	homeSearchimg: {
		width: pxToDp(30),
		height: pxToDp(30),
		marginLeft: pxToDp(15),
		marginRight: pxToDp(15)
	},
	cancelBack: {
		width: pxToDp(110),
		flexDirection: 'row',
		justifyContent: 'center',
		height: pxToDp(60),
		alignItems: 'center',
	},
	cancelBackText: {
		color: '#666',
		fontSize: pxToDp(24),
	}
})
