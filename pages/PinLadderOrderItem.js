import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Image
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import styles from './stylejs/presale';
import SldFlatList from "../component/SldFlatList";
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

const scrWidth = Dimensions.get('window').width;

export default class PinLadderOrderItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			active: props.catid,
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
	}

	initData(){
		this.getOrderList();
	}

	// 获取订单列表
	getOrderList(){
		let {active, pn} = this.state;
		RequestData.getSldData(AppSldUrl + `/index.php?app=buy_ladder&mod=pin_order_list&sld_addons=pin_ladder&key=${ key }&type=${ active }&page=10&pn=${ pn }`).then(res => {
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
			<View style={ [ styles.preSaleOrder, {
				marginVertical: pxToDp(20),
				marginHorizontal: pxToDp(0),
				borderRadius: pxToDp(0)
			} ] }>
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
							defaultSource={require('../assets/images/default_icon_124.png')}
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

	detail = (id) => {
		this.props.navigation.navigate('PinLadderOrderDetail', {order_id: id});
	}

	render(){
		const {orderList, refresh, show_gotop, isLoading} = this.state;
		return (
			<Fragment>
				{ !isLoading && orderList.length > 0 && <SldFlatList
					data={ orderList }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderCell(item) }
				/> }
				{ !isLoading && orderList.length == 0 &&
				<View style={ {flex: 1, alignItems: 'center', justifyContent: 'center'} }>
					{ ViewUtils.noData(I18n.t('HomeScreenNew.tapy_no'), require('../assets/images/order_w.png'), I18n.t('HomeScreenNew.tapy_say')) }
				</View> }
			</Fragment>
		)
	}
}


