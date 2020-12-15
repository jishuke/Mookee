import SldFlatList from "../component/SldFlatList";
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Image, DeviceEventEmitter, ImageBackground
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import SldComStatusBar from '../component/SldComStatusBar';
import SldHeader from '../component/SldHeader';
import styles from './stylejs/presale';
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import PreSaleOrderItem from "./PreSaleOrderItem";

const scrWidth = Dimensions.get('window').width;
const psColor = '#FF0A50';
import {I18n} from './../lang/index'

const NavData = [
	{
		name: I18n.t('OrderList.all'),
		type: 'all'
	},
	{
		name: I18n.t('PreSaleOrder.paid'),
		type: '1_20',
	},
	{
		name: I18n.t('GoodsDetailNew.text24'),
		type: '1_30'
	},
	{
		name: I18n.t('PreSaleOrder.Pay_overtime'),
		type: '1_0'
	}
]

export default class PreSaleOrder extends Component{
	constructor(props){
		super(props);
		this.state = {
			title:I18n.t('PreSaleOrder.title') ,
			currentTab: 'all',
			orderList: [],
			pn: 1,
			hasmore: true,
			show_gotop: false,
			refresh: false,
			isLoading: true
		}
	}


	componentDidMount(){
		this.initData();
		this.lis_network = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.initData();
		});
	}

	componentWillUnmount(){
		this.lis_network.remove();
	}

	initData(){
		this.getOrderList();
	}

	// 获取订单列表
	getOrderList(){
		let {active, pn} = this.state;
		RequestData.getSldData(AppSldUrl + `/index.php?app=order&mod=pre_order_list&sld_addons=presale&key=${ key }&type=${ active }&page=10&pn=${ pn }`).then(res => {
			if(res.status == 200){
				let list = res.data.list;
				let orderList = [];
				let hasmore = true;
				if(pn == 1){
					orderList = list;
				}else{
					orderList = this.state.orderList.concat(list);
				}

				if(res.data.ismore.hasmore){
					pn++;
				}else{
					hasmore = false;
				}

				this.setState({
					orderList: orderList,
					pn: pn,
					hasmore: hasmore
				})
			}else{
				ViewUtils.sldToastTip(res.msg)
			}
			this.setState({
				isLoading: false
			})
		}).catch(err => {
			this.setState({
				isLoading: false
			})
		})
	}

	separatorComponent = () => {
		return (
			<View/>
		);
	}

	renderCell = (item) => {
		return (
			<View style={ styles.preSaleOrder }>
				<View style={ styles.pre_top }>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.pre_vendor }
						onPress={ () => {
							this.props.navigation.navigate('Vendor', {vid: item.vid})
						} }
					>
						<Image
							source={ require('../assets/images/preVenodr.png') }
							style={ {width: pxToDp(24), height: pxToDp(24), marginRight: pxToDp(19)} }
							resizeMode={ 'contain' }
						/>
						<Text style={ {color: '#353535', fontSize: pxToDp(24)} }>{ item.store_name }</Text>
					</TouchableOpacity>
					<Text style={ {color: '#FF7713', fontSize: pxToDp(24)} }>{ item.order_state_str }</Text>
				</View>

				<View style={ [ styles.goods, {paddingHorizontal: pxToDp(20)} ] }>
					<TouchableOpacity
						style={ {width: pxToDp(220), height: pxToDp(220), marginRight: pxToDp(19)} }
						activeOpacity={ 1 }
						onPress={ () => this.detail(item.order_id) }
					>
						<Image
							source={ {uri: item.goods_image} }
							resizeMode={ 'contain' }
							style={ {width: pxToDp(220), height: pxToDp(220)} }
						/>
					</TouchableOpacity>
					<View style={ styles.goods_info }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => this.detail(item.order_id) }
						>
							<Text style={ styles.name }>{ item.goods_name }</Text>
						</TouchableOpacity>
						<Text style={ styles.num }>x { item.goods_num }</Text>
						<Text style={ styles.num }>Ks{ item.goods_price }</Text>
					</View>
				</View>

				<View style={ styles.pre_order_b }>
					<View style={ {
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-end',
						height: pxToDp(80)
					} }>
						<Text>{I18n.t('GoodsDetailNew.common')}{ item.goods_num }{I18n.t('PreSaleOrder.text1')}Ks{ item.ding_price }</Text>
						{ item.wei_price > 0 && item.finish == 1 && <Text>{I18n.t('PreSaleOrder.Pay_balance_payment')}：Ks{ item.wei_price }</Text> }
					</View>

					{item.ding == 1 && <ImageBackground
						style={ {width: pxToDp(200), height: pxToDp(65), marginBottom: pxToDp(50)} }
						source={ require('../assets/images/prePayBtn.png') }
					>
						<TouchableOpacity
							style={{
								height: pxToDp(65),
								alignItems: 'center',
								justifyContent: 'center'
							}}
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('PreSalePay', {
									order_sn: item.order_sn,
									type: 'presale',
									p: item.ding_price
								})
							} }
						>
							<Text style={ {color: '#FFFFFF', fontSize: pxToDp(28)} }>{I18n.t('PreSaleOrder.pay_advance')}</Text>
						</TouchableOpacity>
					</ImageBackground> }

					{item.finish == 1 && <ImageBackground
						style={ {width: pxToDp(200), height: pxToDp(65), marginBottom: pxToDp(30)} }
						source={ require('../assets/images/prePayBtn.png') }
					>
						<TouchableOpacity
							style={{
								alignItems: 'center',
								justifyContent: 'center'
							}}
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('PreSalePay', {
									order_sn: item.order_sn,
									type: 'presale',
									p: item.wei_price
								})
							} }
						>
							<Text>{I18n.t('PreSaleOrder.pay_balance')}</Text>
						</TouchableOpacity>
					</ImageBackground> }

				</View>
			</View>
		)
	}
	//下拉重新加载
	refresh = () => {
		this.setState({
			pn: 1,
			hasmore: true
		}, () => {
			this.getOrderList();
		})
	}

	getNewData = () => {
		const {hasmore} = this.state;
		if(hasmore){
			this.getOrderList();
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

	changeNav = (type) => {
		const {active} = this.state;
		if(active == type) return;
		this.setState({
			active: type,
			pn: 1,
			hasmore: true
		}, () => {
			this.getOrderList();
		})
	}
	onChangeTab(obj) {
		this.setState({
			currentTab: obj.i
		})
	}

	detail = (id) => {
		this.props.navigation.navigate('PreSaleOrderDetail', {order_id: id});
	}

	render(){
		const {title, orderList, refresh, show_gotop, isLoading, active} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } title_color={ '#fff' } bgColor={ psColor }
				           left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<SldComStatusBar nav={ this.props.navigation } color={ psColor } barStyle={'light-content'}/>
				<ScrollableTabView
					style={{height: 0.5, backgroundColor: '#e5e5e5'}}
					tabBarPosition='top'
					page={this.state.currentTab}
					renderTabBar={() => <ScrollableTabBar/>}
					tabBarBackgroundColor='#FF0A50'
					tabBarActiveTextColor='#EEEEEE'
					tabBarInactiveTextColor='#EEEEEE'
					tabBarTextStyle={[{fontSize: pxToDp(30)}, GlobalStyles.sld_global_font]}
					tabBarUnderlineStyle={styles.tabBarUnderline}
					onChangeTab={(obj) => {
						this.onChangeTab(obj)
					}}
				>
					{
						NavData.map((item, index) => {
							return (<PreSaleOrderItem
								tabLabel={item.name}
								key={index}
								navigation={this.props.navigation}
								catid={item.type}
								position={index}
							/>)
						})
					}

				</ScrollableTabView>

			</View>
		)
	}
}


