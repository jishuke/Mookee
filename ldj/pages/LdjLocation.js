import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	Image,
	TextInput, Alert, Platform, ScrollView, PermissionsAndroid,DeviceEventEmitter
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import pxToDp from "../../util/pxToDp";
import StorageUtil from "../../util/StorageUtil";
import RequestData from "../../RequestData";
import comSldStyle from '../styles/comSldStyle';
import SldHeader from '../../component/SldHeader';
import SldComStatusBar from '../../component/SldComStatusBar';
//import {MapView, Marker} from 'react-native-amap3d'
// import {Geolocation} from "react-native-amap-geolocation";
import SldFlatList from '../../component/SldFlatList';

const {width, height} = Dimensions.get('window');

const pageSize = 10;
export default class LdjLocation extends Component{
	constructor(props){
		super(props);
			this.state = {
			title: '选择收货地址',
			address_list: [],
			refresh: false,
			data: [],//充值列表
			pn: 1,//当前页面
			hasmore: true,//是否还有数据
			show_gotop: false,
			is_request: false,
			cur_location:{
				latitude: 39.90980,
				longitude: 116.37296,
			},
			flag: 0,
			source: props.navigation.state.params != undefined ? props.navigation.state.params.source : '',//页面来源，用于更新数据
		}
		ViewUtils.initLocationMust();
	}

	status = '';//如果为0,请求失败，1 请求成功
	type = 1;//默认为1，标示搜索周边（根据经纬度搜索，2为根据关键词搜索），
	cur_location = {};//当前位置信息
	keyword = '';//搜索关键词
	componentDidMount(){
		// this.initData()
		this.lis_network =
			DeviceEventEmitter.addListener ( 'updateNetWork' , ( ) => {
				// this.initData();
			} );

	}

	componentWillUnmount(){
		this.lis_network.remove ()
	}

	//初始化页面数据
	initData = () =>{
		// Geolocation.addLocationListener(location =>{
		// 	this.initLocation(location);
		// })
	}

	initLocation = async (params) => {
		//如果是ios，需要根据经纬度获取当前位置信息
		if(Platform.OS == 'ios'){
			await ViewUtils.sldGetLocationName(params.longitude,params.latitude)
			this.cur_location = ldj_location;
		}else{
			this.cur_location = params;
		}
		this.setState({
			cur_location:this.cur_location
		});
		this.getPoiInfo(1);
		// Geolocation.stop()
	}


	//获取POI地址
	handleGetPoiList = (e) =>{
		this.type = 2;
		this.keyword = (e.nativeEvent.text).replace(/^\s+|\s+$/g, "");
		if(this.keyword != ''){
			this.getPoiInfo(1);
		}else{
			ViewUtils.sldToastTip('请输入搜索内容');
		}

	}

	//获取POI数据
	getPoiInfo = (type = 0) =>{
		let {pn, data, hasmore, refresh} = this.state;
		if(type == 1){
			pn = 1;
		}
		if(this.type == 1){
			RequestData.getSldData("https://restapi.amap.com/v3/place/around?parameters&location=" + this.cur_location.longitude + ',' + this.cur_location.latitude + '&key='+sld_web_key+'&offset=' + pageSize + '&page=' + pn + '&extensions=all&citylimit=true')
				.then(result =>{
					if(result.status != 1){
						this.status = 0;
						this.setState({
							refresh: false,
							flag: 1,
						});
					}else{
						this.status = 1;
						if(refresh){
							refresh = false;
						}
						if(pn == 1){
							data = result.pois;
						}else{
							data = data.concat(result.pois);
						}
						if(data.length == pageSize){
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
					ViewUtils.sldErrorToastTip(error);
					this.setState({
						refresh: false,
						flag: 1,
					});
				})
		}else{
			RequestData.getSldData("https://restapi.amap.com/v3/place/text?parameters&city=" + this.cur_location.adCode + '&key='+sld_web_key+'&keywords=' + this.keyword + '&offset=' + pageSize + '&page=' + pn + '&extensions=all&citylimit=true')
				.then(result =>{
					if(result.status != 1){
						this.status = 0;
						this.setState({
							refresh: false,
							flag: 1,
						});
					}else{
						this.status = 1;
						if(refresh){
							refresh = false;
						}
						if(pn == 1){
							data = result.pois;
						}else{
							data = data.concat(result.pois);
						}
						if(data.length == pageSize){
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
					ViewUtils.sldErrorToastTip(error);
					this.setState({
						refresh: false,
						flag: 1,
					});
				})
		}


	}

	separatorComponent = () =>{
		return (
			<View style={ GlobalStyles.line }/>
		);
	}

	renderCell = (item) =>{
		return (
			<TouchableOpacity
				activeOpacity={ 1 }
				onPress={ () =>{
					this.seleAddress(item);
				} }
				style={ comSldStyle.poi_item_view }>
				{ ViewUtils.getSldImg(23, 27, require('../images/poi_location_icon.png')) }
				<View style={ comSldStyle.poi_item_right }>
					<Text numberOfLines={ 1 } style={ comSldStyle.poi_name }>{ item.name }</Text>
					<Text  numberOfLines={ 1 } style={ comSldStyle.poi_address }>{ item.address }</Text>
				</View>

			</TouchableOpacity>
		);
	}

	//地址选择事件
	seleAddress = (item) => {
		const {source} = this.state;
		if(source == 'home'){
			DeviceEventEmitter.emit('updateHomeLocation', {location_info: item,});
			this.props.navigation.pop(2);
		}else{
			DeviceEventEmitter.emit('selectaddress',{info: item});
			this.props.navigation.pop();
		}
	}

	//下拉重新加载
	refresh = () =>{
		this.getPoiInfo(1);//获取充值列表数据
	}

	getNewData = () =>{
		const {hasmore} = this.state;
		if(hasmore){
			this.getPoiInfo();//获取充值列表数据
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

	_logPressEvent = ({nativeEvent}) => this._log('onPress', nativeEvent)

	_log(event, data){
		this.cur_location = data;
		this.getPoiInfo(1);
		this.setState({
			cur_location:this.cur_location
		});
	}

	mapChangeCom = ({nativeEvent}) => {
		this.cur_location = nativeEvent;
		this.getPoiInfo(1);
		this.setState({
			cur_location:this.cur_location
		});

	}

	render(){
		const {data, refresh, show_gotop,cur_location} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition('#fff', pxToDp(0)) }
				<View style={ comSldStyle.location_top_search }>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ () => this.props.navigation.goBack() }
						style={ comSldStyle.sld_back_icon }>
						{ ViewUtils.getSldImg(45, 65, require('../../assets/images/goback.png')) }
					</TouchableOpacity>
					<View style={ comSldStyle.location_search_view }>
						{ ViewUtils.getSldImg(27, 27, require('../images/sld_com_search.png')) }
						<TextInput
							style={ comSldStyle.search_input }
							underlineColorAndroid={ 'transparent' }
							autoCapitalize='none'
							returnKeyType='default'
							keyboardType='default'
							enablesReturnKeyAutomatically={ true }
							onSubmitEditing={ (e) => this.handleGetPoiList(e) }
							placeholder='查找小区/大厦/学校等'
						></TextInput>
					</View>

				</View>
				<View style={ comSldStyle.location_map_veiw }>
					{/*<MapView
						onPress={ this._logPressEvent }
						locationEnabled
						zoomLevel={18}
						showsLocationButton={ true }
						onStatusChangeComplete={this.mapChangeCom}
						coordinate={ {
							latitude: cur_location.latitude,
							longitude: cur_location.longitude,
						} }
						style={ comSldStyle.location_map_veiw }
					>
						<Marker
							active
							color={main_ldj_color}
							title={'当前位置'}
							coordinate={{
								latitude: cur_location.latitude,
								longitude: cur_location.longitude,
							}}
						/>
					</MapView>*/ }
				</View>
				{ this.status == 1 && <SldFlatList
					data={ data }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderCell(item) }
				/> }
				{ this.status == 0 && this.status != '' &&
				ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '自动定位失败，请搜索关键词试试')
				}

				{ this.status == '' &&
				ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '加载中...')
				}
			</View>
		)
	}
}


