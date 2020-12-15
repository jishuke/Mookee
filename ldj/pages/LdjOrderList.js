import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Image,
	Alert,
	DeviceEventEmitter, Platform
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import SldFlatList from "../../component/SldFlatList";
import SldLdjOrder from "../../component/SldLdjOrder";
import SldComStatusBar from '../../component/SldComStatusBar';
import comSldStyle from '../styles/comSldStyle';
import SldHeader from "../../component/SldHeader";

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');

let pn = 1;
let hasmore = true;

export default class LdjOrderList extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '我的订单',
			orderList: [],
			show_gotop: false,
			refresh: false,
			isLoading: 0,
		}
	}

	componentDidMount(){
		if(key){
			this.getOrderList();
			this.lister = DeviceEventEmitter.addListener('orderlist', () => {
				pn = 1;
				hasmore = true;
				this.getOrderList();
			})
			this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
				this.getOrderList();
			});
		}
		this.loginState = DeviceEventEmitter.addListener('loginUpdate', () => {
			this.getOrderList();
		});
	}

	componentWillUnmount(){
		this.lister.remove();
		this.emitter.remove();
		this.loginState.remove();
	}

	// 获取订单列表
	getOrderList(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=order_list&sld_addons=ldj&key=' + key + '&page=10&pn=' + pn).then(res => {
			if(res.status == 200){
				res.data.forEach(el => {
					el.add_time = this.time(el.add_time)
				})
				if(pn == 1){
					this.setState({
						orderList: res.data
					})
				}else{
					let {orderList} = this.state;
					this.setState({
						orderList: orderList.concat(res.data)
					})
				}
				if(res.ismore.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
			}
			this.setState({
				isLoading: 1
			})
		}).catch(err => {
			this.setState({
				isLoading: 1
			})
			ViewUtils.sldErrorToastTip(err);
		})
	}

	time(time){
		let now = new Date(),
			year = now.getFullYear(),
			month = now.getMonth() + 1,
			data = now.getDate(),
			addtime = new Date(time * 1000),
			addy = addtime.getFullYear(),
			addm = addtime.getMonth() + 1,
			addd = addtime.getDate(),
			h = addtime.getHours(),
			m = addtime.getMinutes(),
			result;
		addm = addm > 9 ? addm : '0' + addm;
		addd = addd > 9 ? addd : '0' + addd;
		h = h > 9 ? h : '0' + h;
		m = m > 9 ? m : '0' + m;
		if(year == addy && month == addm && data == addd){
			result = '今天' + h + ':' + m;
		}else{
			result = addm + '-' + addd + ' ' + h + ':' + m;
		}
		return result
	}

	refresh = () => {
		pn = 1;
		hasmore = true;
		this.getOrderList();
	}

	getNewData = () => {
		if(hasmore){
			this.getOrderList()
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

	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.space_shi_separate }/>
		);
	}

	// 取消订单
	cancelOrder = (id) => {
		Alert.alert('提示', '确定取消该订单', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=order_cancel&sld_addons=ldj&key=' + key + '&order_id=' + id).then(res => {
						if(res.status == 200){
							let {orderList} = this.state;
							for(let i = 0; i < orderList.length; i++){
								let item = orderList[ i ];
								item.order_state_str = '已取消';
								item.order_state = 0;
								break;
							}
							this.setState({
								orderList
							})
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

	buyAgain = (id) => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=order&mod=buy_again&sld_addons=ldj&order_id=' + id + '&key=' + key).then(res => {
			if(res.status == 200){
				DeviceEventEmitter.emit('cartUpdate');
				this.props.navigation.navigate('LdjCart')
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	render(){
		const {orderList, refresh, show_gotop, isLoading, title} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
				<SldHeader title={ title }/>
				{ key != '' && orderList.length > 0 && <SldFlatList
					data={ orderList }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => <SldLdjOrder
						info={ item }
						cancelOrder={ (id) => this.cancelOrder(id) }
						buyAgain={ (id) => this.buyAgain(id) }
						gotoPay={ pay_sn => {
							this.props.navigation.navigate('LdjPay', {pay_sn: pay_sn})
						} }
						StoreDetail={ vid => {
							this.props.navigation.navigate('LdjStore', {vid: vid})
						} }
						OrderDetail={ order_id => {
							this.props.navigation.navigate('LdjOrderDetail', {order_id: order_id})
						} }
					/> }
				/> }

				{ key != '' && isLoading == 1 && orderList.length == 0 && <View
					style={ {flex: 1, alignItems: 'center', justifyContent: 'center'} }
				>
					{ ViewUtils.noData() }
				</View> }

				{ key != '' && isLoading == 0 && orderList.length == 0 &&
				<View style={ {flex: 1, justifyContent: 'center', alignItems: 'center'} }>
					{ ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '加载中...') }
				</View> }

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
			</View>
		)
	}
}
