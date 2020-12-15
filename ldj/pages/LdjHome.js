import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	ImageBackground,
	Dimensions,
	Image, StatusBar, Button, PermissionsAndroid, TextInput, DeviceEventEmitter, Platform, BackHandler
} from 'react-native';
import pxToDp from "../../util/pxToDp";
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import SldComStatusBar from '../../component/SldComStatusBar';
import comSldStyle from '../styles/comSldStyle';
//import {Geolocation} from "react-native-amap-geolocation";
import DiyPageLdj from "../../component/DiyPageLdj";
import SldFlatList from '../../component/SldFlatList';
import PriceUtil from '../../util/PriceUtil'

const scrWidth = Dimensions.get('window').width;
const pageSize = 10;
let express_color = [];
express_color[ '商家自送' ] = '#999999';
express_color[ '到店自取' ] = '#FF9600';
export default class LdjHome extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '首页',
			userInfo: '',
			location: {},
			diy_data: [],//存放所有的装修改数据
			num: 1,
			showWait: false,
			refresh: false,
			data: [],//
			pn: 1,//当前页面
			hasmore: true,//是否还有数据
			show_gotop: false,
			is_request: false,
			flag: 0
		}
		ViewUtils.initLocationMust();
	}


	componentDidMount(){
		this.initData();
		if(Platform.OS == 'android'){
			BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
		}
		this.lis_location =
			DeviceEventEmitter.addListener ( 'updateHomeLocation' , ( param ) => {
				let {location} = this.state;
				let data = param.location_info;
				let location_detail = data.location.split(',');
				location.street = data.name;
				location.longitude = location_detail[0];
				location.latitude = location_detail[1];
				this.setState({
					location: location
				}, () =>{
					this.getStoreList();
				});
			} );
		//监听门店信息（门店购物车数量变化）
		this.lis_dian_info = DeviceEventEmitter.addListener ( 'updateHomeDianCartNum' , ( ) => {
			this.getStoreList(1);
		} );
		this.lis_network =
			DeviceEventEmitter.addListener ( 'updateNetWork' , ( ) => {
				this.initData();
		} );

	}

	componentWillUnmount () {
		this.lis_location.remove ()
		this.lis_network.remove ()
		this.lis_dian_info.remove ()
		if(Platform.OS == 'android'){
			BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
		}
	}

	//安卓返回键关闭APP
	onBackAndroid = () => {
		if(this.props.navigation.isFocused()&&currentSceneTop=='LdjHome'){//判读是否处于聚焦状态
			this.props.navigation.replace('Tab')//返回首页
			return true;
		}
	};

	//初始化页面数据
	 initData = () => {
//		 Geolocation.addLocationListener(location =>{
//			this.initLocation(location);
//		})
		this.getDiyData();
	}


	initLocation = async (params) => {
		//如果是ios，需要根据经纬度获取当前位置信息
		if(Platform.OS == 'ios'){
			await ViewUtils.sldGetLocationName(params.longitude,params.latitude)
			this.setState({
				location: ldj_location
			}, () =>{
				this.getStoreList();
			});
		}else{
			this.setState({
				location: params
			}, () =>{
				this.getStoreList();
				// StorageUtil.set('location_info', JSON.stringify(location));//目前没有用到
			});
		}
//		Geolocation.stop()
	}


	getDiyData = () =>{
		this.handleData(diy_data_info_ldj);
	}

	handleData = (datainfo) =>{
		for(let i = 0; i < datainfo.length; i++){
			if(datainfo[ i ][ 'type' ] == 'lunbo'){
				let new_data = datainfo[ i ][ 'data' ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
			}else if(datainfo[ i ][ 'type' ] == 'dapei'){
				let new_data = datainfo[ i ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
			}else if(datainfo[ i ][ 'type' ] == 'tupianzuhe'){
				if(datainfo[ i ][ 'sele_style' ] == 0){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ]);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 1){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], scrWidth * 1 - 20);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 2){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 30) / 2));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 3){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 40) / 3));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
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
					}
				}
			}
		}
		this.setState({
			diy_data: datainfo
		});
	}


	componentWillUnmount(){
//		Geolocation.stop()
	}


	//获取门店列表
	getStoreList = (type = 0) =>{
		let {pn, data, hasmore, refresh, location} = this.state;
		if(type == 1){
			pn = 1;
		}
		RequestData.getSldData(AppSldUrl + "/index.php?app=index&mod=index&sld_addons=ldj&pn=" + pn + '&key=' + key + '&page=' + pageSize + '&latitude=' + location.longitude + '&longitude=' + location.latitude)
			.then(result =>{
				if(result.status != 200){
					this.setState({
						refresh: false,
						flag: 1,
						hasmore: false,
						data:[],
					});
				}else{
					if(refresh){
						refresh = false;
					}
					if(pn == 1){
						data = result.data;
					}else{
						data = data.concat(result.data);
					}
					if(pn < result.ismore.page_total){
						pn = pn + 1;
						hasmore = true;
					}else{
						hasmore = false;
					}
					this.setState({
						pn: pn,
						data: data,
						hasmore: hasmore,
						refresh: refresh,
						flag: 1,
					});
				}

			})
			.catch(error =>{
				this.setState({
					refresh: false,
					flag: 1,
				});
			})
	}


	separatorComponent = () =>{
		return (
			<View style={ GlobalStyles.line }/>
		);
	}

	renderCell = (item) =>{
		return (<TouchableOpacity
				activeOpacity={ 1 }
				onPress={ () =>{
					this.props.navigation.navigate('LdjStore', {vid: item.id});
				} }
				style={ comSldStyle.store_item_view }>
				{ item.cart_num > 0 &&
				<View style={ comSldStyle.sld_num_tip_view }>
					<Text style={ comSldStyle.sld_num_tip_text }>{ item.cart_num }</Text>
				</View>
				}
				<View style={comSldStyle.sld_img_view}>
					<Image roundAsCircle={true} style={ comSldStyle.sld_home_store_item_img } resizeMode={ 'contain' }
					       source={ {uri: item.dian_logo} }/>
				</View>
				<View style={ comSldStyle.sld_store_item_con }>
					<Text style={ comSldStyle.store_name }>{ item.dian_name }</Text>
					<View style={ comSldStyle.com_flex_between }>
						<Text style={ comSldStyle.text_tip }>月销{ item.month_sales }</Text>
						<Text style={ comSldStyle.text_tip }>{ item.distance }</Text>
					</View>

					<View style={ comSldStyle.com_flex_between }>
						<View style={comSldStyle.sld_express_con_view}>
							<Text
								style={ comSldStyle.text_tip }>起送ks{PriceUtil.formatPrice( item.freight_qisong )}</Text>
							<Text
								style={ comSldStyle.text_tip }>基础运费ks{PriceUtil.formatPrice( item.freight_jichu )}</Text>
						</View>

						<View style={ comSldStyle.store_express_method }>
							{
								item.delivery_type.length > 0 && item.delivery_type.map((val, indexs) =>{
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

		);
	}
	//下拉重新加载
	refresh = () =>{
		this.getStoreList(1);//获取门店列表
	}

	getNewData = () =>{
		const {hasmore} = this.state;
		if(hasmore){
			this.getStoreList();//获取门店列表
		}
	}

	handleScroll = (event) =>{
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

	keyExtractor = (item, index) =>{
		return index
	}


	render(){
		const {location, data, refresh, show_gotop, flag,diy_data} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation }/>
				<View style={ comSldStyle.home_top }>
					<View style={ comSldStyle.home_top_wrap }>
						<TouchableOpacity
							onPress={ () => this.props.navigation.replace('Tab') }
							activeOpacity={ 1 }
							style={comSldStyle.left_icon_wrap}
							>
							{ ViewUtils.getSldImg(16, 24, require('../images/sld_arrow_left.png')) }
						</TouchableOpacity>

						<TouchableOpacity
							onPress={ () => this.props.navigation.navigate('LdjSelAddress') }
							activeOpacity={ 1 }
							style={comSldStyle.home_top_location_view}
						>
						{ ViewUtils.getSldImg(28, 35, require('../images/sld_location_icon.png')) }
						<Text style={ comSldStyle.home_location }>
							{ ViewUtils.isEmptyObject(location) ? '定位获取中...' : ((location.street).length < 13 ? location.street : ((location.street).substr(0, 12) + '...')) }
						</Text>
						{ ViewUtils.getSldImg(22, 16, require('../images/sld_arrow_down.png')) }
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						onPress={ () => this.props.navigation.navigate('LdjSearch', {type: 1}) }
						activeOpacity={ 1 }
						style={ comSldStyle.search_view }>
						<Text style={ comSldStyle.home_search_text }>
							搜索附近商家、商品
						</Text>
						{ ViewUtils.getSldImg(27, 27, require('../images/sld_com_search.png')) }
					</TouchableOpacity>
				</View>

				<ScrollView>
					{
						diy_data.length > 0 &&
						diy_data.map((item, index) =>{
							return (<DiyPageLdj key={ index } navigation={ this.props.navigation } data={ item }/>)
						})
					}

					<View style={ comSldStyle.sld_home_stile_view }>
						<Text style={ comSldStyle.sld_home_store_title }>附近门店</Text>
					</View>

					<SldFlatList
						data={ data }
						refresh_state={ refresh }
						show_gotop={ show_gotop }
						refresh={ () => this.refresh() }
						keyExtractor={ () => this.keyExtractor() }
						handleScroll={ (event) => this.handleScroll(event) }
						getNewData={ () => this.getNewData() }
						separatorComponent={ () => this.separatorComponent() }
						renderCell={ (item) => this.renderCell(item) }
					/>
				</ScrollView>

			</View>
		)
	}
}

