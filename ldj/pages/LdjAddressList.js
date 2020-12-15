import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	DeviceEventEmitter,
	TouchableOpacity,
	Image,
	ScrollView, Alert, Platform
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import SldComStatusBar from '../../component/SldComStatusBar'
import SldHeader from "../../component/SldHeader";

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class LdjAddressList extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: props.navigation.state.params != undefined ? '选择地址' : '地址管理',
			addrList: [],
			isLoading: 0,
			type: props.navigation.state.params != undefined ? props.navigation.state.params.type : ''
		}
	}

	componentDidMount(){
		this.InitData();
		this.lister = DeviceEventEmitter.addListener('updateList', () => {
			this.InitData();
		})
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.InitData();
		})
	}

	componentWillUnmount(){
		this.lister.remove();
		this.emitter.remove();
	}

	// 获取订单信息
	InitData(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=address&mod=getmemberaddresslist&sld_addons=ldj&key=' + key).then(res => {
			if(res.status == 200){
				this.setState({
					addrList: res.data
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
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

	// 编辑地址
	editAddr = (id) => {
		this.props.navigation.navigate('LdjAddNewAddress', {address_id: id, type: 'edit',select: 'select'})
	}

	// 删除地址
	delAddr = (id) => {
		Alert.alert('提示', '确认删除该收货地址', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.getSldData(AppSldUrl + '/index.php?app=address&mod=deladdress&sld_addons=ldj&key=' + key + '&address_id=' + id).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip('删除成功');
							let {addrList} = this.state;
							for(let i = 0; i < addrList.length; i++){
								if(addrList[ i ].address_id == id){
									addrList.splice(i, 1);
									break;
								}
							}
							this.setState({
								addrList
							})
						}else{
							ViewUtils.sldToastTip(res.msg)
						}
					}).catch(err => {
						ViewUtils.sldErrorToastTip(err);
					})
				}
			}
		])
	}

	render(){
		const {isLoading, addrList, title} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				<SldHeader title={ title } left_icon={ require('../../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>

				{ addrList.length == 0 && isLoading == 1 && <View style={ styles.err }>
					<Image
						style={ {width: pxToDp(78), height: pxToDp(78)} }
						resizeMode={ 'contain' }
						source={ require('../images/noddr.png') }
					/>
					<Text
						style={ {color: '#666', fontSize: pxToDp(fontSize_26), marginTop: pxToDp(55)} }>您还未添加收货地址</Text>
				</View> }

				{ key != '' && isLoading == 0 && addrList.length == 0 &&
				<View style={ {flex: 1, justifyContent: 'center', alignItems: 'center'} }>
					{ ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '加载中...') }
				</View> }

				{ addrList.length > 0 && <ScrollView style={ {flex: 1} }>
					{ addrList.map(el => <View key={ el.address_id } style={ styles.item }>
						<View style={ styles.item_left }>
							<Text numberOfLines={ 1 } ellipsizeMode={ 'tail' }
							      style={ styles.addr_name }>{ el.true_name }</Text>
							{ el.is_default == 1 && <Text style={ styles.default }>默认</Text> }
						</View>
						<TouchableOpacity
							style={ styles.addr_info }
							activeOpacity={ 1 }
							onPress={ () => {
								if(this.state.type == 'select'){
									DeviceEventEmitter.emit('orderSelectAddr', {info: el});
									this.props.navigation.pop();
								}
							} }
						>
							<Text style={ {
								color: '#666',
								fontSize: pxToDp(fontSize_28),
								marginBottom: pxToDp(10)
							} }>{ el.mob_phone }</Text>
							<Text style={ {
								color: '#333',
								fontSize: pxToDp(fontSize_28)
							} }>{ el.area_info + ' ' + el.address }</Text>
						</TouchableOpacity>
						<View>
							<TouchableOpacity
								style={ {padding: pxToDp(20)} }
								activeOpacity={ 1 }
								onPress={ () => this.editAddr(el.address_id) }
							>
								<Image
									style={ {width: pxToDp(30), height: pxToDp(30)} }
									resizeMode={ 'contain' }
									source={ require('../images/edit.png') }
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={ {padding: pxToDp(20), marginTop: pxToDp(10)} }
								activeOpacity={ 1 }
								onPress={ () => this.delAddr(el.address_id) }
							>
								<Image
									style={ {width: pxToDp(30), height: pxToDp(30)} }
									resizeMode={ 'contain' }
									source={ require('../images/del.png') }
								/>
							</TouchableOpacity>
						</View>
					</View>) }
				</ScrollView> }

				<TouchableOpacity
					style={ styles.btn }
					activeOpacity={ 1 }
					onPress={ () => {
						let {type} = this.state;
						if(type == 'select'){
							this.props.navigation.navigate('LdjAddNewAddress',{select: 'select'})
						}else{
							this.props.navigation.navigate('LdjAddNewAddress')
						}
					} }
				>
					<Text style={ {color: '#fff', fontSize: pxToDp(fontSize_32)} }>新增地址</Text>
				</TouchableOpacity>
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
	err: {
		flex: 1,
		paddingTop: pxToDp(210),
		alignItems: 'center',
	},
	item: {
		marginTop: pxToDp(10),
		backgroundColor: '#fff',
		padding: pxToDp(30),
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	item_left: {
		width: pxToDp(100),
	},
	addr_name: {
		color: '#666',
		fontSize: pxToDp(fontSize_26)
	},
	default: {
		width: pxToDp(65),
		height: pxToDp(30),
		textAlign: 'center',
		lineHeight: pxToDp(30),
		backgroundColor: main_ldj_color,
		color: '#fff',
		borderRadius: pxToDp(2),
		fontSize: pxToDp(fontSize_20),
		marginTop: pxToDp(20),
	},
	addr_info: {
		flex: 1,
		marginHorizontal: pxToDp(20)
	},
	btn: {
		width: deviceWidth,
		height: pxToDp(98),
		backgroundColor: main_ldj_color,
		alignItems: 'center',
		justifyContent: 'center'
	}
})