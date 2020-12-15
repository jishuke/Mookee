import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Image, DeviceEventEmitter
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import SldComStatusBar from '../component/SldComStatusBar';
import SldHeader from '../component/SldHeader';
import styles from './stylejs/presale';
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import PinLadderOrderItem from "./PinLadderOrderItem";
import PriceUtil from '../util/PriceUtil'

const scrWidth = Dimensions.get('window').width;
const psColor = '#111111';
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
		name: I18n.t('PinLadderOrder.Tuxedo_failure'),
		type: '1_0'
	},
	{
		name: I18n.t('orderStatus.tobedelivered'),
		type: '2_20'
	},
	{
		name: I18n.t('PinLadderOrder.shipped'),
		type: '2_30'
	},
	{
		name: I18n.t('PinLadderOrder.Completed'),
		type: '2_40'
	}
]

export default class PinLadderOrder extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: I18n.t('PinLadderOrder.title'),
			active: 'all',
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
	}

	separatorComponent = () => {
		return (
			<View/>
		);
	}

	renderCell = (item) => {
		return (
			<View style={[ styles.preSaleOrder,{
				marginVertical: pxToDp(20),
				marginHorizontal: pxToDp(0),
				borderRadius: pxToDp(0)
			}]}>
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
					<Text style={ {color: '#EE1B21', fontSize: pxToDp(24)} }>{ item.order_state_str }</Text>
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
					<View style={ styles.goods_info2 }>
						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => this.detail(item.order_id) }
						>
							<Text style={ styles.name }>{ item.goods_name }</Text>
						</TouchableOpacity>
						<View style={ styles.pin_price }>
							<Text style={ {color: '#EE1B21', fontSize: pxToDp(28)} }>ks{PriceUtil.formatPrice( item.goods_price )}</Text>
							<Text style={ {color: '#353535', fontSize: pxToDp(28)} }>x{ item.goods_num }</Text>
						</View>
					</View>
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

	onChangeTab(obj) {
		this.setState({
			curtab: obj.i
		})
	}

	render(){
		const {title} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } title_color={ '#fff' } bgColor={ psColor }
				           left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<SldComStatusBar nav={ this.props.navigation } color={ psColor } barStyle={'light-content'}/>
				<ScrollableTabView
					style={{height: 0.5, backgroundColor: '#e5e5e5'}}
					tabBarPosition='top'
					page={this.state.curtab}
					renderTabBar={() => <ScrollableTabBar/>}
					tabBarBackgroundColor='#fff'
					tabBarActiveTextColor='#EE1B21'
					tabBarInactiveTextColor='#353535'
					tabBarTextStyle={[{fontSize: pxToDp(30)}, GlobalStyles.sld_global_font]}
					tabBarUnderlineStyle={styles.tabBarUnderline}
					onChangeTab={(obj) => {
						this.onChangeTab(obj)
					}}
				>
					{
						NavData.map((item, index) => {
							return (<PinLadderOrderItem
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



