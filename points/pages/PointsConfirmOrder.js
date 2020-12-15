import React, {Component} from 'react'
import {
	Dimensions,
	View,
	TouchableOpacity,
	Image,
	Text,
	Alert,
	ScrollView,
	DeviceEventEmitter,
} from 'react-native'
import GlobalStyles from "../../assets/styles/GlobalStyles";
import ViewUtils from '../../util/ViewUtils'
import SldHeader from '../../component/SldHeader';
import RequestData from '../../RequestData';
import pxToDp from '../../util/pxToDp'
import styles from '../styles/order'
import SldComStatusBar from "../../component/SldComStatusBar";

const {width, height} = Dimensions.get('window');

export default class PointsConfirmOrder extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '确认订单',
			ifcart: props.navigation.state.params.ifcart,
			cart_id: props.navigation.state.params.cart_id,
			info: ''
		}
	}

	componentDidMount(){
		if(!key){
			this.props.navigation.replace('Login');
		}else{
			this.getOrderDetail();
			this.lister = DeviceEventEmitter.addListener('updateAddAddress', () => {
				this.getOrderDetail();
			});
			this.lister2 = DeviceEventEmitter.addListener('updateAddress', (e) => {
				let {info} = this.state;
				info.address_info = e.address_info;
				this.setState({
					info
				})
			});
			this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
				this.getOrderDetail();
			});
		}
	}

	componentWillUnmount(){
		if(this.lister)this.lister.remove();
		if(this.lister2)this.lister2.remove();
		if(this.emitter)this.emitter.remove();
	}

	getOrderDetail(){
		const {ifcart, cart_id} = this.state;

		RequestData.postSldData(AppSldUrl + '/index.php?app=points_buy&mod=confirm&sld_addons=points', {
			key,
			cart_id,
			ifcart
		}).then(res => {

			if(res.status == 200){
				this.setState({
					info: res.datas
				})
			}else{
				ViewUtils.sldToastTip(res.msg)
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 切换地址
	changeAddr = () => {
		const {info} = this.state;
		if(Array.isArray(info.address_info)){
			this.props.navigation.navigate('AddNewAddress', {source: 'confirm'});
		}else{
			this.props.navigation.navigate('SeleAddress', {
				cur_address_id: info.address_info.address_id
			});
		}
	}

	// 提交
	submit = () => {
		const {info,ifcart,cart_id} = this.state;
		if(Array.isArray(info.address_info)){
			ViewUtils.sldToastTip('请选择收货地址');
			return;
		}
		Alert.alert('提示', '确认支付', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					const address_id = info.address_info.address_id;
					RequestData.postSldData(AppSldUrl+'/index.php?app=points_buy&mod=submitorder&sld_addons=points',{
						key,ifcart,cart_id,address_id
					}).then(res=>{
						if(res.status == 200){
							ViewUtils.sldToastTip('支付成功');
							DeviceEventEmitter.emit('UserPoints');
							this.props.navigation.navigate('PointsOrder');
						}else{
							ViewUtils.sldToastTip(res.msg);
							this.props.navigation.navigate('PointsOrder',{s: 10});
						}
						DeviceEventEmitter.emit('updateOrder');
						DeviceEventEmitter.emit('updateCart');
					}).catch(err=>{
						ViewUtils.sldErrorToastTip(err);
					})
				}
			}
		])
	}

	render(){
		const {title, info} = this.state;
		return (<View style={ GlobalStyles.sld_container }>
			<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
			{/*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*/}
			<SldHeader title={ title }
			           left_icon={require('../../assets/images/goback.png')}
			           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
			<View style={ GlobalStyles.line }/>

			<ScrollView>
				<View style={ styles.address }>
					<Image
						style={ {width: width, height: pxToDp(4)} }
						source={ require('../images/addr.png') }
					/>
					<TouchableOpacity
						style={ styles.address_info }
						activeOpacity={ 1 }
						onPress={ () => this.changeAddr() }
					>
						{ info != '' && (Array.isArray(info.address_info) == true ?
							<View style={ styles.add_address }>
								<Text style={ styles.add_btn }>+ 添加地址</Text>
							</View>
							:
							<View style={[styles.bw,{height: pxToDp(142)}]}>
								<View style={ styles.addr_left }>
									<View style={ styles.name }>
										<Text style={ [ styles.font32, {
											marginRight: pxToDp(15)
										} ] }>{ info.address_info.true_name }</Text>
										<Text style={ styles.font32 }>{ info.address_info.mob_phone }</Text>
									</View>
									<Text style={ {
										color: '#666666',
										fontSize: pxToDp(28)
									} }>{ info.address_info.area_info }{ info.address_info.address }</Text>
								</View>
								<View style={ styles.addr_right }>
									<Image
										style={ {width: pxToDp(16), height: pxToDp(27)} }
										resizeMode={ 'contain' }
										source={ require('../images/ltr.png') }
									/>
								</View>
							</View>) }

					</TouchableOpacity>
				</View>

				<View style={ styles.goods_list }>
					{ info != '' && info.store_cart_list.map(el => <TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.goods_item }
						onPress={ () => {
							this.props.navigation.navigate('PointsGoodsDetail', {gid: el.pgid})
						} }
					>
						<View style={ styles.goods_img }>
							<Image
								resizeMode={ 'contain' }
								style={ {width: pxToDp(140), height: pxToDp(140)} }
								defaultSource={require('../../assets/images/default_icon_124.png')}
								source={ {uri: el.goods_image_url} }
							/>
						</View>
						<View style={ styles.goods_info }>
							<View style={ styles.bw }>
								<Text
									ellipsizeMode={ 'tail' }
									numberOfLines={ 1 }
									style={ [ styles.font32, {
										width: pxToDp(300)
									} ] }
								>{ el.pgoods_name }</Text>
								<Text style={ {color: '#333333', fontSize: pxToDp(28)} }>{ el.pgoods_points }积分</Text>
							</View>
							<View style={ {alignItems: 'flex-end', marginTop: pxToDp(15)} }>
								<Text style={ {color: '#666666', fontSize: pxToDp(28)} }>x{ el.number }</Text>
							</View>
						</View>
					</TouchableOpacity>) }
				</View>

				<View style={ styles.total }>
					<View style={ styles.order_info }>
						<View style={ [ styles.bw, {height: pxToDp(60)} ] }>
							<Text style={ styles.font32 }>商品总计</Text>
							<Text style={ styles.font32 }>{ info ? info.all_money : '--' }积分</Text>
						</View>
						<View style={ [ styles.bw, {height: pxToDp(60)} ] }>
							<Text style={ styles.font32 }>运费</Text>
							<Text style={ styles.font32 }>免运费</Text>
						</View>
					</View>
					<View style={ styles.price }>
						<Text style={ styles.price_txt }>合计应付：{ info ? info.all_money : '--' }积分</Text>
					</View>
				</View>
			</ScrollView>

			<View style={ styles.footer }>
				<Text style={ styles.footer_txt }>共{ info ? info.all_num : '--' }件，应付：<Text
					style={ {color: '#C43D3A'} }>{ info ? info.all_money : '--' }积分</Text></Text>
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.submit }
					onPress={ () => this.submit() }
				>
					<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>去付款</Text>
				</TouchableOpacity>
			</View>
		</View>)
	}
}
