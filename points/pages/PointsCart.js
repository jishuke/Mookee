import React, {Component} from 'react'
import {
	Dimensions,
	View,
	Image,
	Text,
	TouchableOpacity,
	FlatList,
	StyleSheet,
	DeviceEventEmitter,
} from 'react-native'
import GlobalStyles from "../../assets/styles/GlobalStyles";
import ViewUtils from '../../util/ViewUtils'
import SldHeader from '../../component/SldHeader';
import RequestData from '../../RequestData';
import pxToDp from '../../util/pxToDp'
import SldComStatusBar from "../../component/SldComStatusBar";

const {width, height} = Dimensions.get('window');

const selectImg = require('../images/selted_cart.png');
const unselect = require('../images/paynosele.png');
let isChange = false;

export default class PointsCart extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '积分购物车',
			cartList: [],
			isLoading: 0,
			refresh: false,
			hasSelect: false,
			seleclAll: false,
			total: 0,
			isEdit: false,
		}
	}

	componentDidMount(){
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			this.getCartData();
			this.lister = DeviceEventEmitter.addListener('updateCart',()=>{
				this.getCartData();
			})
			this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
				this.getCartData();
			});
		}
	}

	componentWillUnmount(){
		this.lister.remove();
		this.emitter.remove();
	}

	getCartData(){
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=cartlist&sld_addons=points', {key}).then(res => {
			let list;
			if(res.status == 200){
				list = res.data;
				list.forEach(el => {
					el.select = true
				})
			}else{
				list = [];
			}
			this.setState({
				cartList: list,
				isLoading: 1,
			}, () => {
				this.calcTotal();
			})
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
			this.setState({
				isLoading: 1,
			})
		})
	}

	// 计算总价
	calcTotal(){
		const {cartList} = this.state;
		let total = 0;
		cartList.map(el => {
			if(el.select){
				total = total + el.pgoods_choosenum * 1 * el.pgoods_points;
			}
		});
		this.setState({
			total
		})
		this.checkSelectAll();
		this.checkHasCheck();
	}

	// 购物车变化
	cartNumChange = (type, id) => {
		let {cartList} = this.state;
		if(isChange) return;
		isChange = true;
		let item = null;
		for(let i = 0; i < cartList.length; i++){
			if(cartList[ i ].pcart_id == id){
				item = cartList[ i ];
				break;
			}
		}
		let num = item.pgoods_choosenum;
		if(type == 'desc' && num <= 1) return;
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=handlecart&sld_addons=points', {
			key,
			type,
			cartid: id
		}).then(res => {
			isChange = false;
			if(res.status == 200){
				if(type == 'desc'){
					item.pgoods_choosenum = num * 1 - 1;
				}else{
					item.pgoods_choosenum = num * 1 + 1;
				}
				this.setState({
					cartList
				}, () => {
					this.calcTotal();
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			isChange = false;
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 选择
	select = (id) => {
		let {cartList} = this.state;
		if(id){
			for(let i = 0; i < cartList.length; i++){
				if(cartList[ i ].pcart_id == id){
					cartList[ i ].select = !cartList[ i ].select;
					break;
				}
			}
		}else{
			let {seleclAll} = this.state;
			cartList.forEach(el => {
				el.select = !seleclAll
			})
		}
		this.setState({
			cartList
		}, () => {
			this.calcTotal();
		})
	}

	// 编辑
	edit = () => {
		let {isEdit} = this.state;
		this.setState({
			isEdit: !isEdit
		})
	}

	// 是否全选
	checkSelectAll(){
		const {cartList} = this.state;
		let seleclAll = true;
		cartList.map(el => {
			if(!el.select){
				seleclAll = false;
			}
		})
		this.setState({
			seleclAll
		})
	}

	// 是否有选中的
	checkHasCheck(){
		const {cartList} = this.state;
		let hasSelect = false;
		cartList.map(el => {
			if(el.select){
				hasSelect = true;
			}
		})
		this.setState({
			hasSelect
		})
	}

	renderItem = (item) => {
		return (<View style={ styles.cart_item }>
			<TouchableOpacity
				activeOpacity={ 1 }
				style={ styles.check }
				onPress={ () => this.select(item.pcart_id) }
			>
				<Image
					resizeMode={ 'contain' }
					style={ styles.check_img }
					source={ item.select ? selectImg : unselect }
				/>
			</TouchableOpacity>

			<TouchableOpacity
				activeOpacity={ 1 }
				style={ styles.goods_img }
				onPress={ () => {
					this.props.navigation.navigate('PointsGoodsDetail', {gid: item.pgid})
				} }
			>
				<Image
					resizeMode={ 'contain' }
					style={ {width: pxToDp(180), height: pxToDp(180)} }
					defaultSource={require('../../assets/images/default_icon_124.png')}
					source={ {uri: item.image} }
				/>
			</TouchableOpacity>

			<View style={ styles.goods_info }>
				<Text numberOfLines={ 1 } ellipsizeMode={ 'tail' }
				      style={ {width: pxToDp(380), fontSize: pxToDp(30), color: '#181818'} }>{ item.pgoods_name }</Text>

				<View style={ styles.bw }>
					<Text style={ {color: '#181818', fontSize: pxToDp(26)} }>{ item.pgoods_points }积分</Text>
					<View style={ styles.cart_num }>
						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.btn }
							onPress={ () => this.cartNumChange('desc', item.pcart_id) }
						>
							<Text style={ {fontSize: pxToDp(34), color: '#666666'} }>-</Text>
						</TouchableOpacity>
						<View style={ styles.num }>
							<Text style={ {color: '#181818', fontSize: pxToDp(32)} }>{ item.pgoods_choosenum }</Text>
						</View>
						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.btn }
							onPress={ () => this.cartNumChange('add', item.pcart_id) }
						>
							<Text style={ {fontSize: pxToDp(34), color: '#666666'} }>+</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

		</View>)
	}

	// 刷新
	refresh = () => {
		this.getCartData();
	}

	// 立即支付/删除
	submit = () => {
		const {hasSelect, cartList, isEdit} = this.state;
		if(!hasSelect) return;
		if(isEdit){    // 删除
			let data = {key};
			cartList.map((el,index) => {
				if(el.select){
					data[ `cartid[${index}]` ] = el.pcart_id;
				}
			});
			console.log(data)
			RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=delcart&sld_addons=points', data).then(res => {
				ViewUtils.sldToastTip(res.msg)
				if(res.status == 200){
					this.setState({
						isEdit: false,
						hasSelect: true,
						seleclAll: true,
					})
					this.getCartData();
				}
			}).catch(err => {
				ViewUtils.sldErrorToastTip(err);
			})
		}else{         // 立即支付
			let cart_id = [];
			cartList.map(el => {
				if(el.select){
					cart_id.push(`${ el.pcart_id }|${ el.pgoods_choosenum }`)
				}
			});
			this.props.navigation.navigate('PointsConfirmOrder', {ifcart: 1, cart_id: cart_id.join(',')});
		}
	}

	render(){
		const {title, cartList, isLoading, refresh, hasSelect, seleclAll, isEdit} = this.state;
		return (<View style={ GlobalStyles.sld_container }>
			<SldComStatusBar nav={ this.props.navigation }/>
			{/*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*/}
			<SldHeader title={ title }
			           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }
			           right_type='text'
			           right_event={ () => this.edit() }
			           right_text={isEdit?'确认':'编辑'}
			           right_style={ {
				           marginRight: pxToDp(40),
				           color: '#181818',
				           fontSize: pxToDp(26)
			           } }
			/>
			<View style={ GlobalStyles.line }/>

			<View style={ {flex: 1, marginBottom: pxToDp(20)} }>
				{ cartList.length > 0 && <FlatList
					data={ cartList }
					refreshing={ refresh }
					extraData={ this.state }
					onRefresh={ () => this.refresh() }
					renderItem={ ({item}) => this.renderItem(item) }
				/> }

				{ cartList.length == 0 && isLoading == 1 && <View style={ {flex: 1, justifyContent: 'center'} }>
					{ ViewUtils.noData('暂无数据', require('../../assets/images/cart_w.png')) }
				</View> }
			</View>

			<View style={ styles.footer }>
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.check }
					onPress={ () => this.select() }
				>
					<Image
						resizeMode={ 'contain' }
						style={ styles.check_img }
						source={ seleclAll ? selectImg : unselect }
					/>
				</TouchableOpacity>

				<View style={ styles.footer_info }>
					{ isEdit == false && <View style={ styles.total }>
						<Text style={ {color: '#181818', fontSize: pxToDp(30)} }>应付：
							<Text style={ {color: '#EE2328', fontSize: pxToDp(32)} }>{ this.state.total } <Text
								style={ {fontSize: pxToDp(28)} }>积分</Text></Text>
						</Text>
					</View> }

					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ () => this.submit() }
						style={ [ styles.submit, {backgroundColor: (hasSelect ? '#EE2328' : '#BBB')} ] }
					>
						<Text style={ {color: '#fff', fontSize: pxToDp(34)} }>{ isEdit ? '删除' : '立即支付' }</Text>
					</TouchableOpacity>
				</View>
			</View>

		</View>)
	}
}

const styles = StyleSheet.create({
	cart_item: {
		height: pxToDp(220),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: pxToDp(20),
		backgroundColor: '#fff',
		padding: pxToDp(20)
	},
	check: {
		width: pxToDp(82),
		height: pxToDp(180),
		justifyContent: 'center'
	},
	check_img: {
		width: pxToDp(44),
		height: pxToDp(44),
	},
	goods_img: {
		width: pxToDp(180),
		height: pxToDp(180),
		marginRight: pxToDp(30)
	},
	goods_info: {
		flex: 1,
		height: pxToDp(180),
		justifyContent: 'space-between',
	},
	bw: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	cart_num: {
		width: pxToDp(230),
		height: pxToDp(65),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#C4C4C4',
		borderRadius: pxToDp(4)
	},
	btn: {
		width: pxToDp(77),
		height: pxToDp(63),
		justifyContent: 'center',
		alignItems: 'center',
	},
	num: {
		flex: 1,
		height: pxToDp(63),
		alignItems: 'center',
		justifyContent: 'center',
		borderStyle: 'solid',
		borderLeftWidth: pxToDp(1),
		borderRightWidth: pxToDp(1),
		borderLeftColor: '#C4C4C4',
		borderRightColor: '#C4C4C4',
	},
	footer: {
		height: pxToDp(98),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: pxToDp(30),
		borderTopWidth: pxToDp(0.6),
		borderTopColor: '#DADADA',
		borderStyle: 'solid',
		backgroundColor: '#fff'
	},
	footer_info: {
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(98),
		justifyContent: 'flex-end',
	},
	total: {
		marginRight: pxToDp(30)
	},
	submit: {
		width: pxToDp(293),
		height: pxToDp(98),
		justifyContent: 'center',
		alignItems: 'center',
	}
})
