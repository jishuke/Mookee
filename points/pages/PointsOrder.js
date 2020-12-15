import React, {Component} from 'react'
import {
	Dimensions,
	View,
	TouchableOpacity,
	Image,
	Text,
	StyleSheet,
	Alert,
	DeviceEventEmitter,
} from 'react-native'
import GlobalStyles from "../../assets/styles/GlobalStyles";
import ViewUtils from '../../util/ViewUtils'
import SldHeader from '../../component/SldHeader';
import SldFlatList from '../../component/SldFlatList';
import RequestData from '../../RequestData';
import pxToDp from '../../util/pxToDp'
import SldComStatusBar from "../../component/SldComStatusBar";

const {width, height} = Dimensions.get('window');

let pn = 1;
let hasmore = true;

const nav = [
	{
		name: '全部',
		s: 1
	},
	{
		name: '待兑换',
		s: 10
	},
	{
		name: '待发货',
		s: 20
	},
	{
		name: '待收货',
		s: 30
	},
	{
		name: '兑换成功',
		s: 40
	}
]

export default class PointsOrder extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '我的订单',
			s: props.navigation.state.params != undefined ? props.navigation.state.params.s : 1,
			orderList: [],
			isLoading: 0,
			refresh: false,
			show_gotop: false,
		}
	}

	componentDidMount(){
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			this.getOrderList();
		}
		this.lister = DeviceEventEmitter.addListener('updateOrder', () => {
			this.getOrderList();
		});
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.getOrderList();
		});
	}

	componentWillUnmount(){
		this.lister.remove();
		this.emitter.remove();
	}

	getOrderList(){
		const {s} = this.state;
		let url = AppSldUrl + '/index.php?app=userorder&mod=getmemberlist&sld_addons=points&key=' + key + '&s=' + s + '&page=10&pn=' + pn;
		RequestData.getSldData(url).then(res => {
			if(res.status == 200){
				if(pn == 1){
					this.setState({
						orderList: res.data.list ? res.data.list : [],
						isLoading: 1,
					})
				}else{
					let {orderList} = this.state;
					this.setState({
						orderList: orderList.concat(res.data.list),
					})
				}
				if(res.data.ishasmore.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
			}else{
				ViewUtils.sldToastTip(res.msg);
				this.setState({
					isLoading: 1,
				})
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
			this.setState({
				isLoading: 1,
			})
		})
	}

	changeNav = (nav) => {
		const {s} = this.state;
		if(s == nav) return;
		this.setState({
			s: nav,
			isLoading: 0,
		}, () => {
			pn = 1;
			hasmore = true;
			this.getOrderList();
		})
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
			<View style={ styles.line }/>
		);
	}

	// 取消订单
	cancelOrder = (order_id) => {
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
					RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=rollbackorder&sld_addons=points', {
						key, order_id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip(res.msg);
							let {orderList} = this.state;
							for(let i = 0; i < orderList.length; i++){
								let item = orderList[ i ];
								if(item.point_orderid == order_id){
									item.order_state = '已取消';
									item.point_orderstate = 2;
									break;
								}
							}
							this.setState({
								orderList
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

	// 去兑换
	goPay = (order_id) => {
		Alert.alert('提示', '确认兑换', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=gotopayorder&sld_addons=points', {
						key, order_id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip(res.msg);
							DeviceEventEmitter.emit('UserPoints');
							let {orderList} = this.state;
							for(let i = 0; i < orderList.length; i++){
								let item = orderList[ i ];
								if(item.point_orderid == order_id){
									item.order_state = '待发货';
									item.point_orderstate = 20;
									break;
								}
							}
							this.setState({
								orderList
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

	// 再次兑换
	buyAgain = (order_id) => {
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=buyagainorder&sld_addons=points', {
			key, order_id
		}).then(res => {
			if(res.status == 200){
				DeviceEventEmitter.emit('updateCart');
				this.props.navigation.navigate('PointsCart');
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 确认收货
	confirmOrder = (order_id) => {
		Alert.alert('提示', '确认收货', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=confirmation&sld_addons=points', {
						key, order_id
					}).then(res => {
						if(res.status == 200){
							ViewUtils.sldToastTip(res.msg);
							let {orderList} = this.state;
							for(let i = 0; i < orderList.length; i++){
								let item = orderList[ i ];
								if(item.point_orderid == order_id){
									item.order_state = '已完成';
									item.point_orderstate = 40;
									break;
								}
							}
							this.setState({
								orderList
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

	renderItem = (item) => {
		return (<View style={ styles.p_item }>
			<View style={ styles.order_state }>
				<Text style={ {fontSize: pxToDp(28), color: '#E32222'} }>{ item.order_state }</Text>
			</View>
			<TouchableOpacity
				style={ styles.order_goods }
				activeOpacity={ 1 }
				onPress={ () => {
					this.props.navigation.navigate('PointsOrderDetail', {id: item.point_orderid})
				} }
			>
				{ item.order_goods.map(el => <View style={ styles.goods_item }>
					<View style={ styles.img }>
						<Image
							resizeMode={ 'contain' }
							style={ {width: pxToDp(140), height: pxToDp(140)} }
							defaultSource={require('../../assets/images/default_icon_124.png')}
							source={ {uri: el.image} }
						/>
					</View>
					<View style={ styles.goods_info }>
						<View style={ styles.bw }>
							<Text ellipsizeMode={ 'tail' } numberOfLines={ 1 } style={ {
								width: pxToDp(320),
								color: '#181818',
								fontSize: pxToDp(30)
							} }>{ el.point_goodsname }</Text>
							<Text style={ {fontSize: pxToDp(28), color: '#181818'} }>{ el.point_goodspoints }积分</Text>
						</View>
						<View style={ {alignItems: 'flex-end'} }>
							<Text style={ {
								color: '#5E5E5E',
								fontSize: pxToDp(26),
							} }>x{ el.point_goodsnum }</Text>
						</View>
					</View>
				</View>) }
			</TouchableOpacity>

			<View style={ styles.price }>
				<Text style={ {color: '#181818', fontSize: pxToDp(30)} }>共{ item.goods_number }件， 应付：<Text
					style={ {color: '#E32222'} }>{ item.point_allpoint }积分</Text></Text>
			</View>

			<View style={ styles.btns }>
				{ (item.point_orderstate == 10 || item.point_orderstate == 11 || item.point_orderstate == 20) &&
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.btn }
					onPress={ () => this.cancelOrder(item.point_orderid) }
				>
					<Text style={ styles.btn_txt }>取消订单</Text>
				</TouchableOpacity> }

				{ (item.point_orderstate == 10) && <TouchableOpacity
					activeOpacity={ 1 }
					style={ [ styles.btn, styles.red_btn ] }
					onPress={ () => this.goPay(item.point_orderid) }
				>
					<Text style={ [ styles.btn_txt, styles.red_btn_txt ] }>去兑换</Text>
				</TouchableOpacity> }

				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.btn }
					onPress={ () => this.buyAgain(item.point_orderid) }
				>
					<Text style={ styles.btn_txt }>再次兑换</Text>
				</TouchableOpacity>

				{ (item.point_orderstate == 30) && <TouchableOpacity
					activeOpacity={ 1 }
					style={ [ styles.btn, styles.red_btn ] }
					onPress={ () => this.confirmOrder(item.point_orderid) }
				>
					<Text style={ [ styles.btn_txt, styles.red_btn_txt ] }>确认收货</Text>
				</TouchableOpacity> }
			</View>
		</View>)
	}

	render(){
		const {title, s, orderList, isLoading, refresh, show_gotop} = this.state;
		return (<View style={ GlobalStyles.sld_container }>
			<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
			{/*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*/}
			<SldHeader title={ title }
			           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
			<View style={ GlobalStyles.line }/>

			<View style={ styles.nav }>
				{ nav.map(el => <TouchableOpacity
					activeOpacity={ 1 }
					onPress={ () => this.changeNav(el.s) }
					style={ [ styles.nav_item, (s == el.s ? (styles.nav_on) : '') ] }
				>
					<Text style={ [ styles.nav_txt, {color: (s == el.s ? '#EC3737' : '#181818')} ] }>{ el.name }</Text>
				</TouchableOpacity>) }
			</View>

			{ orderList.length > 0 && <SldFlatList
				data={ orderList }
				refresh_state={ refresh }
				show_gotop={ show_gotop }
				refresh={ () => this.refresh() }
				keyExtractor={ () => this.keyExtractor() }
				handleScroll={ (event) => this.handleScroll(event) }
				getNewData={ () => this.getNewData() }
				separatorComponent={ () => this.separatorComponent() }
				renderCell={ (item) => this.renderItem(item) }
			/> }

			{ orderList.length == 0 && isLoading == 1 && <View style={ {flex: 1, justifyContent: 'center'} }>
				{ ViewUtils.noData() }
			</View> }
		</View>)
	}
}

const styles = StyleSheet.create({
	nav: {
		height: pxToDp(80),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		borderBottomColor: '#E9E9E9',
		borderBottomWidth: pxToDp(0.6),
		borderStyle: 'solid',
		backgroundColor: '#fff'
	},
	nav_item: {
		height: pxToDp(80),
		paddingHorizontal: pxToDp(10),
		justifyContent: 'center',
		borderBottomWidth: pxToDp(4),
		borderBottomColor: 'transparent',
		borderStyle: 'solid'
	},
	nav_on: {
		borderBottomColor: '#EC3737',
	},
	nav_txt: {
		fontSize: pxToDp(30)
	},
	line: {
		height: pxToDp(0.6),
		backgroundColor: '#DADADA',
	},
	p_item: {
		backgroundColor: '#fff',
		paddingLeft: pxToDp(30),
		marginBottom: pxToDp(20)
	},
	order_state: {
		height: pxToDp(80),
		alignItems: 'flex-end',
		justifyContent: 'center',
		paddingRight: pxToDp(30)
	},
	order_goods: {
		borderTopWidth: pxToDp(0.6),
		borderTopColor: '#E9E9E9',
		borderStyle: 'solid'
	},
	goods_item: {
		height: pxToDp(180),
		flexDirection: 'row',
		padding: pxToDp(20),
		borderBottomColor: '#E9E9E9',
		borderStyle: 'solid',
		borderBottomWidth: pxToDp(0.6),
	},
	img: {
		width: pxToDp(140),
		height: pxToDp(140),
		borderColor: '#F6F6F6',
		borderWidth: pxToDp(0.6),
		borderStyle: 'solid',
		alignItems: 'center',
		justifyContent: 'center',
	},
	goods_info: {
		flex: 1,
		paddingHorizontal: pxToDp(30),
	},
	bw: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: pxToDp(30),
	},
	price: {
		alignItems: 'flex-end',
		paddingVertical: pxToDp(30),
		paddingHorizontal: pxToDp(30)
	},
	btns: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginBottom: pxToDp(30),
		paddingHorizontal: pxToDp(30)
	},
	btn: {
		width: pxToDp(190),
		height: pxToDp(72),
		backgroundColor: '#fff',
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#707070',
		borderRadius: pxToDp(4),
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: pxToDp(30)
	},
	red_btn: {
		borderColor: '#EC3737',
		backgroundColor: '#EC3737'
	},
	btn_txt: {
		fontSize: pxToDp(30),
		color: '#181818'
	},
	red_btn_txt: {
		color: '#fff'
	}
})
