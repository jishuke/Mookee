import LoadingWait from "../../component/LoadingWait";
import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	DeviceEventEmitter,
	TouchableOpacity,
	Image,
	TextInput, Platform, Switch
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import SldComStatusBar from '../../component/SldComStatusBar'
import SldHeader from "../../component/SldHeader";
import RPicker from 'react-native-picker';

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class LdjAddNewAddress extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '新增地址',
			area_info: '',
			address: '',    // 详细地址信息
			type: (props.navigation.state.params != undefined && props.navigation.state.params.type) ? props.navigation.state.params.type : 'add',
			address_id: props.navigation.state.params != undefined ? props.navigation.state.params.address_id : '',
			select: props.navigation.state.params != undefined ? props.navigation.state.params.select : '',
			isLoading: 0
		}
	}

	componentDidMount(){
		this.InitData();
	}

	componentWillUnmount(){
		RPicker.hide();
		this.lister.remove();
		this.emitter.remove();

	}

	InitData(){
		let {type} = this.state;
		this.lister = DeviceEventEmitter.addListener('selectaddress', (e) => {
			let location = (e.info.location).split(',');
			this.setState({
				address: e.info.address,
				lat: location[ 1 ],
				lng: location[ 0 ]
			})
		})
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			if(type == 'edit'){
				this.getAddrInfo();
			}
		});
		if(type == 'edit'){
			this.getAddrInfo();
		}
		this.getAddress();
	}

	// 编辑地址
	getAddrInfo(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=address&mod=getmemberaddressinfo&sld_addons=ldj&key=' + key + '&address_id=' + this.state.address_id).then(res => {
			if(res.status == 200){
				this.setState({
					address: res.data.address,
					lat: res.data.lat,
					lng: res.data.lng,
					true_name: res.data.true_name,
					province: res.data.province_id,
					city: res.data.city_id,
					area: res.data.area_id,
					area_info: res.data.area_info,
					address_precose: res.data.address_precose,
					mob_phone: res.data.mob_phone,
					is_default: res.data.is_default
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 获取地址
	getAddress(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=area_list').then(res => {
			this.setState({
				addrInfo: res
			})
			this.addrInit(res);
		}).catch(err => {
		})
	}

	addrInit(addr){
		let p = [];
		let len = addr.length;
		for(let i = 0; i < len; i++){
			let city = [];
			for(let j = 0; j < addr[ i ][ 'city' ].length; j++){
				let area = [];
				for(let k = 0; k < addr[ i ][ 'city' ][ j ][ 'area' ].length; k++){
					area.push(addr[ i ][ 'city' ][ j ][ 'area' ][ k ][ 'area_name' ])
				}
				let data_area = {};
				data_area[ addr[ i ][ 'city' ][ j ][ 'area_name' ] ] = area;
				city.push(data_area);
			}
			let data = {};
			data[ addr[ i ][ 'area_name' ] ] = city;
			p.push(data)
		}
		this.setState({
			initAddrInfo: p
		})
	}

	showArea = () => {
		let {initAddrInfo, addrInfo} = this.state;
		RPicker.init({
			pickerData: initAddrInfo,
			pickerConfirmBtnText: '确定',
			pickerCancelBtnText: '取消',
			pickerTitleText: '选择地址',
			pickerBg: [ 255, 255, 255, 1 ],
			onPickerConfirm: data => {
				let province, city, area;
				for(let i = 0; i < addrInfo.length; i++){
					if(addrInfo[ i ][ 'area_name' ] == data[ 0 ]){
						province = addrInfo[ i ].area_id;
						let cityinfo = addrInfo[ i ].city;
						for(let j = 0; j < cityinfo.length; j++){
							if(cityinfo[ j ][ 'area_name' ] == data[ 1 ]){
								city = cityinfo[ j ].area_id;
								let earainfo = cityinfo[ j ].area;
								for(let k = 0; k < earainfo.length; k++){
									if(earainfo[ k ][ 'area_name' ] == data[ 2 ]){
										area = earainfo[ k ].area_id;
										break;
									}
								}
								break;
							}
						}
						break;
					}
				}
				this.setState({
					province, city, area, area_info: data.join(' ')
				})
			},
			onPickerCancel: data => {
			}
		});
		RPicker.show();
	}

	change = (e) => {
		this.setState({
			is_default: (e == true ? 1 : 0)
		})
	}

	// 提交
	submit = () => {
		const {type, address, lat, lng, true_name, province, city, area, area_info, address_precose, mob_phone, is_default} = this.state;
		if(!address || !lat || !lng || !true_name || !province || !city || !area || !area_info || !address_precose || !mob_phone){
			ViewUtils.sldToastTip('请完善地址信息');
			return;
		}
		if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(mob_phone))){
			ViewUtils.sldToastTip('请输入正确的手机号');
			return;
		}
		this.setState({
			isLoading: 1
		});
		let data;
		let url = (type == 'add') ? '/index.php?app=address&mod=insertaddress&sld_addons=ldj' : '/index.php?app=address&mod=editaddress&sld_addons=ldj';
		if(type == 'add'){
			data = {
				key: key,
				true_name: true_name,
				province_id: province,
				city_id: city,
				area_id: area,
				area_info: area_info,
				address: address,
				address_precose: address_precose,
				mob_phone: mob_phone,
				lng: lng,
				lat: lat
			};
			for(let i in data){
				url += `&${ i }=${ data[ i ] }`;
			}
		}else{
			data = {
				key: key,
				true_name: true_name,
				province_id: province,
				city_id: city,
				area_id: area,
				area_info: area_info,
				address: address,
				address_precose: address_precose,
				mob_phone: mob_phone,
				lng: lng,
				lat: lat,
				is_default: is_default,
				address_id: this.state.address_id
			};
			for(let i in data){
				url += `&${ i }=${ data[ i ] }`;
			}
		}
		RequestData.getSldData(AppSldUrl + url).then(res => {
			if(res.status == 200){
				RPicker.hide();
				ViewUtils.sldToastTip(type == 'add' ? '添加成功' : '编辑成功');
				if(this.state.select == 'select'){
					let addid = (type == 'add' ? res.data : this.state.address_id);
					this.selectAddr(addid);
				}else{
					DeviceEventEmitter.emit('updateList');
					this.props.navigation.pop();
				}
			}else{
				ViewUtils.sldToastTip(res.msg)
			}
			this.setState({
				isLoading: 0
			});
		}).catch(err => {
			this.setState({
				isLoading: 0
			});
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 选择地址
	selectAddr(id){
		RequestData.getSldData(AppSldUrl + '/index.php?app=address&mod=getmemberaddressinfo&sld_addons=ldj&key=' + key + '&address_id=' + id).then(res => {
			if(res.status == 200){
				DeviceEventEmitter.emit('orderSelectAddr', {info: res.data});
				this.props.navigation.pop(2);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	render(){
		const {title, area_info, address, isLoading} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				<SldHeader title={ title } left_icon={ require('../../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>

				<View style={ styles.form }>
					<TouchableOpacity
						style={ styles.item }
						activeOpacity={ 1 }
						onPress={ () => this.showArea() }
					>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_28)} }>所在城市：</Text>
						<Text style={ {
							flex: 1,
							color: (area_info == '' ? '#999' : '#333'),
							fontSize: pxToDp(fontSize_28)
						} }>{ area_info == '' ? '选择城市' : area_info }</Text>
						<Image
							style={ {width: pxToDp(16), height: pxToDp(25)} }
							resizeMode={ 'contain' }
							source={ require('../images/ltr.png') }
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={ styles.item }
						activeOpacity={ 1 }
						onPress={ () => {
							this.props.navigation.navigate('LdjLocation')
						} }
					>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_28)} }>小区/大厦/学校：</Text>
						<Text
							numberOfLines={ 2 }
							ellipsizeMode={ 'tail' }
							style={ {
								flex: 1,
								color: (address == '' ? '#999' : '#333'),
								fontSize: pxToDp(fontSize_28)
							} }>{ address == '' ? '选择详细信息' : address }</Text>
						<Image
							style={ {width: pxToDp(16), height: pxToDp(25)} }
							resizeMode={ 'contain' }
							source={ require('../images/ltr.png') }
						/>
					</TouchableOpacity>
					<View style={ styles.item }>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_28)} }>楼号-门牌号：</Text>
						<TextInput
							placeholder={ '例如A座507' }
							underlineColorAndroid={ 'transparent' }
							style={ {flex: 1, fontSize: pxToDp(fontSize_28)} }
							value={ this.state.address_precose }
							onChangeText={ text => {
								this.setState({
									address_precose: text
								})
							} }
						/>
					</View>

					<View style={ styles.item }>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_28)} }>收货人：</Text>
						<TextInput
							placeholder={ '请填写收件人姓名' }
							underlineColorAndroid={ 'transparent' }
							value={ this.state.true_name }
							style={ {flex: 1, fontSize: pxToDp(fontSize_28)} }
							onChangeText={ text => {
								this.setState({
									true_name: text
								})
							} }
						/>
					</View>
					<View style={ styles.item }>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_28)} }>联系电话：</Text>
						<TextInput
							placeholder={ '请填写收件人电话' }
							maxLength={ 11 }
							keyboardType={ 'numeric' }
							underlineColorAndroid={ 'transparent' }
							value={ this.state.mob_phone }
							style={ {flex: 1, fontSize: pxToDp(fontSize_28)} }
							onChangeText={ text => {
								this.setState({
									mob_phone: text
								})
							} }
						/>
					</View>

					{ this.state.type == 'edit' && <View style={ styles.item }>
						<Text style={ {color: '#999', fontSize: pxToDp(fontSize_28)} }>设为默认地址</Text>
						<Switch
							value={ this.state.is_default == 0 ? false : true }
							onValueChange={ e => this.change(e) }
						/>
					</View> }

				</View>

				<TouchableOpacity
					style={ styles.btn }
					activeOpacity={ 1 }
					onPress={ () => this.submit() }
				>
					<Text style={ {color: '#fff', fontSize: pxToDp(28)} }>保存地址</Text>
				</TouchableOpacity>

				{ isLoading == 1 && <LoadingWait loadingText={ "保存中..." }/> }

			</View>
		)
	}
}

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		justifyContent: 'center',
		height: pxToDp(85),
		backgroundColor: '#fff',
	},
	btn: {
		marginHorizontal: pxToDp(20),
		height: pxToDp(76),
		backgroundColor: main_ldj_color,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: pxToDp(8),
		marginTop: pxToDp(30)
	},
	form: {
		backgroundColor: '#fff',
		marginTop: pxToDp(20)
	},
	item: {
		height: pxToDp(108),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(30)
	}
})