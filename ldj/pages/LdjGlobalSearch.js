import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
	Image, Platform, DeviceEventEmitter
} from 'react-native';
import SldHeader from '../../component/SldHeader';
import SldComStatusBar from "../../component/SldComStatusBar";
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
// import {Geolocation} from "react-native-amap-geolocation";
import pxToDp from "../../util/pxToDp";
import SldFlatList from "../../component/SldFlatList";
import comSldStyle from "../styles/comSldStyle";
import store from "../styles/store";
import PriceUtil from '../../util/PriceUtil'

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');

let pn = 1;
let hasmore = true;

let express_color = [];
express_color[ '商家自送' ] = '#999999';
express_color[ '到店自取' ] = '#FF9600';
export default class LdjGlobalSearch extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '购物车',
			keyword: props.navigation.state.params.keyword | '',
			list: [],
			isLoading: 0,
			refresh: false,
			show_gotop: false,
		}
		ViewUtils.initLocationMust();
	}

	componentDidMount(){
		this.setState({
			keyword: this.props.navigation.state.params.keyword
		}, () => {
			// this.initData();
		});
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			// this.initData();
		});
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
		let {location, keyword} = this.state;
		let data = {
			type: 1,
			keyworld: keyword,
			latitude: location[ 0 ],
			longitude: location[ 1 ],
			page: 10,
			pn: pn,
		}
		if(key){
			data.key = key;
		}
		let url = '/index.php?app=goods&mod=goods_list&sld_addons=ldj';
		for(let i in data){
			url += `&${ i }=${ data[ i ] }`;
		}
		RequestData.getSldData(AppSldUrl + url).then(res => {
			if(res.status == 200){
				if(pn == 1){
					this.setState({
						list: res.data
					})
				}else{
					let {list} = this.state;
					this.setState({
						list: list.concat(res.data)
					})
				}
				if(res.ismore.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
			}else{
				ViewUtils.sldToastTip(res.msg);
				hasmore = false;
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

	componentWillUnmount(){
		this.emitter.remove();
	}


	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.line }/>
		);
	}

	renderCell = (item) => {
		return (<View style={ {
				borderBottomWidth: pxToDp(0.7),
				borderBottomColor: '#D7D7D7',
				borderStyle: 'solid'
			} }>
				<TouchableOpacity
					activeOpacity={ 1 }
					onPress={ () => {
						this.props.navigation.navigate('LdjStore', {vid: item.id});
					} }
					style={ comSldStyle.store_item_view }>
					{ item.cart_num > 0 &&
					<View style={ comSldStyle.sld_num_tip_view }>
						<Text style={ comSldStyle.sld_num_tip_text }>{ item.cart_num }</Text>
					</View>
					}
					<View style={ comSldStyle.sld_img_view }>
						<Image roundAsCircle={ true } style={ comSldStyle.sld_home_store_item_img }
						       resizeMode={ 'contain' }
						       source={ {uri: item.dian_logo} }/>
					</View>
					<View style={ comSldStyle.sld_store_item_con }>
						<Text style={ comSldStyle.store_name }>{ item.dian_name }</Text>
						<View style={ comSldStyle.com_flex_between }>
							<Text style={ comSldStyle.text_tip }>月销{ item.month_sales }</Text>
							<Text style={ comSldStyle.text_tip }>{ item.distance }</Text>
						</View>

						<View style={ comSldStyle.com_flex_between }>
							<View style={ comSldStyle.sld_express_con_view }>
								<Text
									style={ comSldStyle.text_tip }>起送ks{PriceUtil.formatPrice( item.ldj_delivery_order_MinPrice )}</Text>
								<Text
									style={ comSldStyle.text_tip }>基础运费ks{PriceUtil.formatPrice( item.ldj_delivery_order_Price )}</Text>
							</View>

							<View style={ comSldStyle.store_express_method }>
								{
									item.delivery_type.length > 0 && item.delivery_type.map((val, indexs) => {
										return <View key={ indexs } style={ [ comSldStyle.sld_express_view, {
											borderColor: express_color[ val ],
											marginLeft: indexs > 0 ? pxToDp(10) : 0,
										} ] }>
											<Text
												style={ [ comSldStyle.sld_express_text, {color: express_color[ val ]} ] }>{ val }</Text>
										</View>
									})
								}

							</View>
						</View>
					</View>
				</TouchableOpacity>
				<View style={ store.search_goods }>
					{ item.goods_list.length > 0 && item.goods_list.map((el, index) => {
						if(index < 2){
							return (
								<TouchableOpacity
									activeOpacity={ 1 }
									style={ store.search_item }
									onPress={ () => {
										this.props.navigation.navigate('LdjGoodsDetail', {vid: item.id, gid: el.gid})
									} }
								>
									<View style={ {
										width: pxToDp(120),
										height: pxToDp(120),
										borderRadius: pxToDp(8)
									} }>
										<Image
											style={ {width: pxToDp(120), height: pxToDp(120)} }
											resizeMode={ 'contain' }
											source={ {uri: el.goods_image} }
										/>
									</View>

									<View style={ {flex: 1, marginLeft: pxToDp(17)} }>
										<Text
											ellipsizeMode={ 'tail' }
											numberOfLines={ 1 }
											style={ {color: '#333', fontSize: pxToDp(fontSize_34)} }
										>{ el.goods_name }</Text>

										<Text style={ {
											color: '#999',
											fontSize: pxToDp(fontSize_22),
											marginVertical: pxToDp(5)
										} }>月销{ el.month_sales }件</Text>
										<Text style={ {
											color: '#FF0902',
											fontSize: pxToDp(fontSize_34)
										} }>ks{PriceUtil.formatPrice( el.goods_price )}</Text>
									</View>

								</TouchableOpacity>
							)
						}
					}) }
				</View>
			</View>
		);
	}
	//下拉重新加载
	refresh = () => {
		pn = 1;
		hasmore = true;
		this.getCartInfo();//获取门店列表
	}

	getNewData = () => {
		if(hasmore){
			this.getCartInfo();//获取门店列表
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

	keyExtractor = (item, index) => {
		return index
	}

	render(){
		const {isLoading, list, refresh, show_gotop} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition('#fff', pxToDp(0)) }
				<TouchableOpacity
					style={ store.ssearch }
					onPress={ () => {
						this.props.navigation.navigate('LdjSearch', {type: 1})
					} }
				>
					<Text style={ {
						color: '#333',
						fontSize: pxToDp(28)
					} }>{ this.state.keyword != '' ? this.state.keyword : '请输入商品名' }</Text>
					<Image
						style={ {
							width: pxToDp(27),
							height: pxToDp(27)
						} }
						resizeMode={ 'contain' }
						source={ require('../images/search.png') }
					/>
				</TouchableOpacity>

				{ list.length == 0 && isLoading == 1 && <View
					style={ {flex: 1, justifyContent: 'center', alignItems: 'center', width: deviceWidth} }
				>
					<Image
						style={ {width: pxToDp(163), height: pxToDp(99), marginBottom: 70} }
						source={ require('../images/searchnull.png') }
						resizeMode={ 'contain' }
					/>
					<Text style={ {color: '#999', fontSize: pxToDp(24)} }>没有找到该商品</Text>
				</View> }

				{ isLoading == 0 && list.length == 0 &&
				<View style={ {flex: 1, justifyContent: 'center', alignItems: 'center'} }>
					{ ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '加载中...') }
				</View> }

				{ list.length > 0 && <SldFlatList
					data={ list }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderCell(item) }
				/> }
			</View>
		)
	}
}
