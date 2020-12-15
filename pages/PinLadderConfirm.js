import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image, DeviceEventEmitter, Platform, Alert, TextInput,KeyboardAvoidingView,
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import SldComStatusBar from '../component/SldComStatusBar';
import SldHeader from '../component/SldHeader';
import styles from './stylejs/presale'
import {I18n} from './../lang/index'

const scrWidth = Dimensions.get('window').width;
const psColor = '#111111';

export default class PinLadderConfirm extends Component{
	constructor(props){
		super(props);
		this.state = {
			title:I18n.t('PreSaleOrder.pay_advance'),
			gid: props.navigation.state.params.gid,
			num: props.navigation.state.params.num,
			id: props.navigation.state.params.id,
			address_id: '',  // 地址id
			address_info: '',
			goods_info: '',
			isLoading: false,
			select: false,    // 协议
			member_message: '',   // 留言
		}
	}

	componentDidMount(){
		this.initData();
		this.lis_network = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.initData();
		});
		this.lister = DeviceEventEmitter.addListener('updateAddAddress', () => {
			this.initData();
		});
		this.lister2 = DeviceEventEmitter.addListener('updateAddress', (e) => {
			this.setState({
				address_info: e.address_info,
				address_id: e.address_info.address_id,
			})
		});
	}

	componentWillUnmount(){
		this.lis_network.remove();
		this.lister.remove();
		this.lister2.remove();
	}

	initData(){
		const {gid, num, id} = this.state;
		this.setState({
			isLoading: true
		})
		let url = AppSldUrl + `/index.php?app=buy_ladder&mod=iwantpinladder&sld_addons=pin_ladder&key=${ key }&gid=${ gid }&number=${ num }&pin_id=${ id }`;
		RequestData.getSldData(url).then(res => {
			if(res.status == 200){
				let data = res.data;
				let address_id = '';
				if(Object.prototype.toString.call(data.address) == '[object Object]'){
					address_id = data.address.address_id;
				}
				this.setState({
					address_info: data.address,
					address_id: address_id,
					goods_info: data.goods_info
				})
			}else if(res.status == 255){
				Alert.alert(I18n.t('hint'), res.msg, [
					{
						text: I18n.t('SearchPage.cancel'),
						onPress: () => {
							this.props.navigation.pop();
						},
						style: 'cancel'
					},
					{
						text:I18n.t('ok') ,
						onPress: () => {
							this.props.navigation.pop();
						}
					}
				])
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
			this.setState({
				isLoading: false
			})
		}).catch(error => {
			this.setState({
				isLoading: false
			})
			ViewUtils.sldErrorToastTip(error);
		})
	}

	// 提交
	submit = () => {
		const {gid, num, id, select, member_message, address_id, goods_info} = this.state;
		if(!address_id){
			ViewUtils.sldToastTip(I18n.t('LdjConfirmOrder.text5'));
			return;
		}
		if(goods_info.is_tui == 0){
			if(!select){
				ViewUtils.sldToastTip(I18n.t('PresaleConfirm.agreement'));
				return;
			}
		}

		RequestData.postSldData(AppSldUrl + '/index.php?app=buy_ladder&mod=submitorder&sld_addons=pin_ladder', {
			key: key,
			gid: gid,
			number: num,
			pin_id: id,
			address_id: address_id,
			member_message: member_message
		}).then(res => {
			if(res.status == 200){
				const order_sn = res.data.order_sn;
				const p = goods_info.sld_deposit_money;
				this.props.navigation.navigate('PreSalePay', {order_sn: order_sn, p: p, type: 'pin_ladder'})
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}

	renderCon = () =>{
		const {title, address_id, address_info, goods_info, isLoading} = this.state;
		return  <ScrollView style={ {paddingBottom: pxToDp(30)} }>
			{/*地址*/ }
			{ address_id != '' && <TouchableOpacity
				style={ styles.addr }
				activeOpacity={ 1 }
				onPress={ () => {
					this.props.navigation.navigate('SeleAddress', {
						cur_address_id: address_id
					});
				} }
			>
				<View style={ styles.addr_l }>
					<View style={ styles.txt_w }>
						<Text
							style={ [ styles.txt, {marginRight: pxToDp(50)} ] }>{ address_info.true_name }</Text>
						<Text style={ styles.txt }>{ address_info.mob_phone }</Text>
					</View>
					<Text style={ styles.txt }>{ address_info.area_info + ' ' + address_info.address }</Text>
				</View>
				<View style={ styles.addr_r }>
					<Text style={ {color: '#A5A5A5', fontSize: pxToDp(24), marginRight: pxToDp(20)} }>{I18n.t('ConfirmOrder.change')}</Text>
					<Image
						style={ {width: pxToDp(9), height: pxToDp(18), tintColor: '#A5A5A5'} }
						source={ require('../assets/images/sld_jiantou.png') }
						resizeMode={ 'contain' }
					>
					</Image>
				</View>
			</TouchableOpacity> }

			{ address_id == '' && isLoading == false && <TouchableOpacity
				style={ styles.addr_empty }
				activeOpacity={ 1 }
				onPress={ () => {
					this.props.navigation.navigate('AddNewAddress', {source: 'confirm'});
				} }
			>
				<Text style={ styles.addAddr }>+{I18n.t('LdjConfirmOrder.addaddress')}</Text>
			</TouchableOpacity> }

			<View style={ styles.m20 }>
				<Text style={ styles.title }>{I18n.t('PresaleConfirm.product_list')}</Text>
				{/*商品*/ }
				{ goods_info != '' && <TouchableOpacity
					style={ styles.goods }
					activeOpacity={ 1 }
					onPress={ () => {
						this.props.navigation.navigate('GoodsDetailNew', {gid: this.state.gid})
					} }
				>
					<View style={ {width: pxToDp(220), height: pxToDp(220), marginRight: pxToDp(20)} }>
						<Image
							style={ {width: pxToDp(220), height: pxToDp(220)} }
							resizeMode={ 'contain' }
							source={ {uri: goods_info.goods_image} }
						>
						</Image>
					</View>
					<View style={ styles.goods_info }>
						<Text style={ styles.name }>{ goods_info.goods_name }</Text>
						<Text style={ {fontSize: pxToDp(30), color: '#363636'} }>{I18n.t('GoodsDetailNew.money')} <Text
							style={ styles.price }>Ks{ goods_info.sld_deposit_money } x { goods_info.goods_num }</Text></Text>
						<Text style={ styles.num }>{I18n.t('PinLadderOrderDetail.price')}：Ks{ goods_info.goods_price }</Text>
					</View>
				</TouchableOpacity> }
			</View>

			<View style={ styles.m20 }>
				<Text style={ styles.title }>{I18n.t('PresaleConfirm.Cost_details')}</Text>
				<View style={ styles.m_item }>
					<Text style={ styles.m_left }>{I18n.t('PresaleConfirm.BRT_Blue')}</Text>
					<View style={ styles.m_right }>
						<Text style={ {
							color: '#353535',
							fontSize: pxToDp(30),
							marginRight: pxToDp(20)
						} }>{I18n.t('PinLadderConfirm.money')}</Text>
						<Text style={ {
							color: '#FE011D',
							fontSize: pxToDp(30)
						} }>Ks{ goods_info.sld_deposit_money }</Text>
					</View>
				</View>
			</View>

			<View style={ styles.m20 }>
				<Text style={ styles.title }>{ I18n.t('PresaleConfirm.BBS') }</Text>
				<View>
					<TextInput
						placeholder={ I18n.t('PinLadderConfirm.text3') }
						style={ styles.input }
						multiline={ true }
						underlineColorAndroid={ 'transparent' }
						onChangeText={ text => {
							this.setState({
								member_message: text
							})
						} }
					/>
				</View>
			</View>

			{ goods_info != '' && goods_info.is_tui == 0 && <View style={ [ styles.m20, styles.xy ] }>
				<Text style={ {fontSize: pxToDp(fontSize_32), color: '#353535'} }>{I18n.t('PinLadderConfirm.No_message')}</Text>
				<TouchableOpacity
					activeOpacity={ 1 }
					onPress={ () => {
						let {select} = this.state;
						this.setState({
							select: !select
						})
					} }
				>
					<Image
						style={ {width: pxToDp(40), height: pxToDp(40), marginLeft: pxToDp(20)} }
						resizeMode={ 'contain' }
						source={ this.state.select ? require('../assets/images/preselect.png') : require('../assets/images/preunselect.png') }
					/>
				</TouchableOpacity>
			</View> }

		</ScrollView>;
	}

	render(){
		const {title, address_id, address_info, goods_info, isLoading} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } title_color={ '#fff' } bgColor={ psColor }
				           left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<SldComStatusBar nav={ this.props.navigation } color={ psColor }/>
				{Platform.OS == 'ios'
					?<KeyboardAvoidingView behavior="padding" style={{ flex: 1,
						justifyContent: 'center',flexDirection : 'column' , width : '100%' ,}}>
						{this.renderCon()}
					</KeyboardAvoidingView>
					:this.renderCon()
				}

				<View style={ styles.foot }>
					<Text style={ styles.foot_l }>{I18n.t('PresaleConfirm.with_deposit')}：Ks{ goods_info != '' ? ViewUtils.formatFloat(goods_info.sld_deposit_money,2) : '' }</Text>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ [styles.submit_btn,{backgroundColor: '#ED6307'}] }
						onPress={ ()=>this.submit() }
					>
						<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('OrderList.pay')}</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

