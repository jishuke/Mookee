import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	Image,
	TextInput, Alert, Platform, ScrollView, DeviceEventEmitter
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import pxToDp from "../../util/pxToDp";
import StorageUtil from "../../util/StorageUtil";
import RequestData from "../../RequestData";
import comSldStyle from '../styles/comSldStyle';
import SldHeader from '../../component/SldHeader';
import SldComStatusBar from '../../component/SldComStatusBar';

const {width, height} = Dimensions.get('window');


export default class LdjSelAddress extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '选择收货地址',
			address_list: [],
		}
	}

	componentDidMount(){
		if(key){
			this.getSldAddress();
			this.lister = DeviceEventEmitter.addListener('updateList', () => {
				this.getSldAddress();
			})
		}
		this.lis_network =
			DeviceEventEmitter.addListener ( 'updateNetWork' , ( ) => {
				this.getSldAddress();
			});

	}

	componentWillUnmount(){
		if(this.lister){
			this.lister.remove();
		}
		this.lis_network.remove ()
	}


	//获取收货地址
	getSldAddress = () => {
		let {address_list} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=address&mod=getmemberaddresslist&sld_addons=ldj&key=' + key).then(res => {
			if(res.status == 200){
				address_list = res.data;
			}else{
				address_list = [];
			}
			this.setState({
				address_list: address_list,
			})
		}).catch(err => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	//选择地址
	seleAddress = (item) => {
		item.name = item.address;
		item.location = item.lat + ',' + item.lng;
		DeviceEventEmitter.emit('updateHomeLocation', {location_info: item,});
		this.props.navigation.pop();
	}

	render(){
		const {title, address_list} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				<SldHeader title={ title } left_icon={ require('../../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ comSldStyle.sele_search_view }>
					<TouchableOpacity
						onPress={ () => {
							this.props.navigation.navigate('LdjLocation', {source: 'home'})
						} }
						activeOpacity={ 1 }
						style={ comSldStyle.sele_search_wrap }
					>
						{ ViewUtils.getSldImg(27, 27, require('../images/sld_com_search.png')) }
						<Text style={ [ comSldStyle.home_search_text, {marginLeft: pxToDp(20)} ] }>
							选择城市、小区、写字楼、学校
						</Text>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					onPress={ () => this.props.navigation.navigate('LdjLocation', {source: 'home'}) }
					activeOpacity={ 1 }
					style={ comSldStyle.sele_location_view }
				>
					<View style={ comSldStyle.sele_location_left }>
						{ ViewUtils.getSldImg(30, 30, require('../images/sld_location_green.png')) }
						<Text style={ comSldStyle.sele_location_text }>点击定位当前地点</Text>
					</View>
					{ ViewUtils.getSldImg(12, 22, require('../images/sld_arrow_right_green.png')) }

				</TouchableOpacity>
				<Text style={ comSldStyle.address_title }>我的收货地址</Text>

				{ key != '' && address_list.length > 0 &&
				<ScrollView>
					{ address_list.map((item) => {
						return <View key={ item.address_id }>
							<View style={ comSldStyle.address_item }>
								<Text
									style={ comSldStyle.sele_address_name }>{ item.true_name.length > 4 ? item.true_name.substr(0, 4) : item.true_name }</Text>
								<TouchableOpacity
									style={ comSldStyle.address_item_center }
									activeOpacity={1}
									onPress={ () => this.seleAddress(item) }
								>
									<Text style={ comSldStyle.address_tel }>{ item.mob_phone }</Text>
									<Text style={ comSldStyle.address }>{ item.address }{ item.address_precose }</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={ () => {
										this.props.navigation.navigate('LdjAddNewAddress', {address_id: item.address_id, type: 'edit'})
									} }
									activeOpacity={ 1 }
									style={ comSldStyle.sld_del_view }>
									{ ViewUtils.getSldImg(30, 30, require('../images/sld_del_address.png')) }
								</TouchableOpacity>
							</View>
							<View style={ GlobalStyles.left_15_line }/>
						</View>
					}) }
					<View style={ GlobalStyles.left_15_line }/>
				</ScrollView>
				}

				{ key != '' && address_list.length == 0 &&
				ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '您还未添加收货地址')
				}

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

				</View>
				}

				{ (key != '' && key != undefined) && <TouchableOpacity
					onPress={ () => this.props.navigation.navigate('LdjAddNewAddress') }
					activeOpacity={ 1 }
					style={ comSldStyle.sel_add_address_view }>
					<Text style={ comSldStyle.sel_add_address_text }>新增地址</Text>
				</TouchableOpacity> }
			</View>
		)
	}
}


