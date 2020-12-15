import React, {Component, Fragment} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image, DeviceEventEmitter, Alert
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import SldComStatusBar from '../component/SldComStatusBar';
import SldHeader from '../component/SldHeader';
import styles from './stylejs/presale'

const scrWidth = Dimensions.get('window').width;
const psColor = '#111111';
import {I18n} from './../lang/index'

export default class PinLadderOrderDetail extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: I18n.t('OrderDetail.title'),
			order_id: props.navigation.state.params.order_id,
			change: '',
			guding: '',
			ladder_price: '',
			time_h: '00',
			time_m: '00',
			time_s: '00',
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
		const {order_id} = this.state;
		RequestData.getSldData(AppSldUrl + `/index.php?app=buy_ladder&mod=order_desc&sld_addons=pin_ladder&key=${ key }&order_id=${ order_id }`).then(res => {
			if(res.status == 200){
				let change = res.data.change;
				let ladder_price = res.data.ladder_price;
				let guding = res.data.guding;
				let already_num = change.yijing_pin_num * 1;

				let jt = 0;   // 进行到的阶梯
				for(let i = 0;i<ladder_price.length;i++){
					let el = ladder_price[i];
					if(already_num>=el.people_num){
						jt=i+1;
					}else{
						break;
					}
				}
				guding.jt = jt;
				let prev = 0;
				ladder_price.forEach((el,i)=>{
					let now = parseInt(el.people_num);
					el.left_pro = (jt >= i + (jt == 0 ? 0 : 1)) ? (already_num >= now ? 100 : ((already_num - prev) / now) * 100) : 0;
					el.right_pro = jt >= i + 1 ? (already_num > now ? 100 : 0) : 0;
					prev = now;
				})

				this.setState({
					change: change,
					guding: guding,
					ladder_price: ladder_price
				})

				this.time = change.dao_ji_shi * 1;
				if(this.time > 0){
					this.time_out();
					this.timer = setInterval(() => {
						this.time_out();
					}, 1000)
				}
			}else{
				Alert.alert(I18n.t('hint'), res.msg, [
					{
						text: I18n.t('cancel'),
						onPress: () => {
							this.props.navigation.pop();
						},
						style: 'cancel'
					},
					{
						text: I18n.t('ok'),
						onPress: () => {
							this.props.navigation.pop();
						}
					}
				])
			}
		})
	}

	// 阶梯团倒计时
	time_out(){
		if(this.time == 0){
			clearInterval(this.timer);
			this.setState({
				time_h: '00',
				time_m: '00',
				time_s: '00',
			})
		}
		let h = parseInt(this.time / 60 / 60);
		let m = parseInt(this.time / 60 % 60);
		let s = parseInt(this.time % 60);
		if(this.time > 0){
			h = h > 9 ? h : '0' + h;
			m = m > 9 ? m : '0' + m;
			s = s > 9 ? s : '0' + s;
			this.setState({
				time_h: h,
				time_m: m,
				time_s: s,
			})
			this.time--;
		}else{
			this.setState({
				time_h: '00',
				time_m: '00',
				time_s: '00',
			})
		}
	}

	render(){
		const {title, change, guding, ladder_price} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } title_color={ '#fff' } bgColor={ psColor }
				           left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<SldComStatusBar nav={ this.props.navigation } color={ psColor } barStyle={'light-content'}/>
				<ScrollView style={ {paddingBottom: pxToDp(30)} }>

					{/*地址*/ }
					{ guding != '' && <View
						style={ styles.addr2 }
					>
						<View style={ styles.addr_l }>
							<View style={ styles.txt_w }>
								<Text
									style={ [ styles.txt, {marginRight: pxToDp(50)} ] }>{ guding.true_name }</Text>
								<Text style={ styles.txt }>{ guding.address_info.phone }</Text>
							</View>
							<Text style={ styles.txt }>{ guding.address_info.address }</Text>
						</View>
					</View> }

					<View style={ styles.m20 }>
						<Text
							style={ [ styles.pinnum, {lineHeight: pxToDp(80)} ] }>{I18n.t('PinLadderOrderDetail.order_number')}: { guding != '' ? guding.order_sn : ' ' }</Text>
						<Text
							style={ [ styles.pinnum, {lineHeight: pxToDp(80)} ] }>{I18n.t('PinLadderOrderDetail.order_time')}: { guding != '' ? guding.add_time : ' ' }</Text>
					</View>

					<View style={ styles.m20 }>
						<View style={ styles.pre_top }>
							<TouchableOpacity
								activeOpacity={ 1 }
								style={ styles.pre_vendor }
								onPress={ () => {
									this.props.navigation.navigate('Vendor', {vid: guding.vid})
								} }
							>
								<Image
									source={ require('../assets/images/preVenodr.png') }
									style={ {width: pxToDp(24), height: pxToDp(24), marginRight: pxToDp(19)} }
									resizeMode={ 'contain' }
								/>
								<Text style={ {color: '#353535', fontSize: pxToDp(24)} }>{ guding.store_name }</Text>
							</TouchableOpacity>
							<Text style={ {color: '#EE1B21', fontSize: pxToDp(24)} }>{ change.order_state_str }</Text>
						</View>
						{ guding != '' && <TouchableOpacity
							style={ styles.goods }
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('GoodsDetailNew', {gid: guding.gid})
							} }
						>
							<View style={ {width: pxToDp(220), height: pxToDp(220), marginRight: pxToDp(20)} }>
								<Image
									style={ {width: pxToDp(220), height: pxToDp(220)} }
									resizeMode={ 'contain' }
									source={ {uri: guding.goods_image} }
								>
								</Image>
							</View>
							<View style={ styles.goods_info }>
								<Text style={ styles.name }>{ guding.goods_name }</Text>
								{ typeof (guding.goods_spec) != 'undefined' && guding.goods_spec != null &&
								<View style={ styles.spec }>
									{ Object.keys(guding.goods_spec).map(el => <Text
										style={ [ styles.num, {marginRight: pxToDp(10)} ] }>{ guding.goods_spec[ el ] }</Text>) }
								</View> }
								<Text style={ styles.num }>{I18n.t('PinLadderOrderDetail.price')}： Ks{ guding.goods_danmai_price }</Text>
							</View>
						</TouchableOpacity> }
					</View>

					{ladder_price!=''&& <View style={styles.pin_jt}>
						{ this.state.time_h != '00' || this.state.time_m != '00' || this.state.time_s != '00' &&
						<View style={ styles.jtt_time }>
							<View style={ styles.jtt_time_line }></View>
							<Text style={ {color: '#353535', fontSize: pxToDp(24), marginHorizontal: pxToDp(18)} }>
							{I18n.t('PTOrderDetail.over')}：
								<Text style={ styles.jtt_time_txt }>{ this.state.time_h }</Text>:
								<Text style={ styles.jtt_time_txt }>{ this.state.time_m }</Text>:
								<Text style={ styles.jtt_time_txt }>{ this.state.time_s }</Text>
							</Text>
							<View style={ styles.jtt_time_line }></View>
						</View> }
						<View style={styles.pin_ladder_pro}>
							<Image
								style={styles.jtt_img}
								resizeMode={'contain'}
								source={require('../assets/images/jtt_l.png')}
							/>

							<ScrollView
								horizontal={true}
								showsHorizontalScrollIndicator={false}
							>
								{ladder_price.map((item,i)=><View style={styles.jtt_item}>
									<View style={[styles.jtt_item_top,guding.jt==i+1?styles.jtt_on:'']}>
										<Text style={[styles.jtt_txt,{color: guding.jt>=i+1?'#ED6307':''}]}>Ks{item.pay_money}</Text>
										<Text style={[styles.jtt_txt,{color: guding.jt>=i+1?'#ED6307':''}]}>{I18n.t('MyScreen.membershiplevel')}满{item.people_num}{I18n.t('GoodsDetailNew.Mentuxedo')}</Text>
									</View>
									<View style={[styles.jtt_item_b]}>
										<View style={styles.jtt_line}>
											<Text style={[styles.jtt_dot,{backgroundColor:guding.jt>=i+1?'#ED6307':'#D1D1D1'}]}>{i+1}</Text>
											<View style={styles.jtt_pro_l}>
												<View style={[styles.jtt_pro,{width: `${item.left_pro}%`}]}></View>
											</View>
											<View style={styles.jtt_pro_r}>
												<View style={[styles.jtt_pro,{width: `${item.right_pro}%`}]}></View>
											</View>
										</View>
										<Text style={[styles.jtt_txt,{marginTop: pxToDp(6),color: guding.jt>=i+1?'#ED6307':''}]}>{I18n.t('GoodsDetailNew.ladder')}{i+1}</Text>
									</View>
								</View>)}
							</ScrollView>

							<Image
								style={styles.jtt_img}
								resizeMode={'contain'}
								source={require('../assets/images/jtt_r.png')}
							/>
						</View>
					</View>}


					<View style={ styles.m20 }>
						<Text style={ styles.title }>{I18n.t('PresaleConfirm.Cost_details')}</Text>
						<View style={ styles.pin_item }>
							<View style={ styles.flex }>
								<Text style={ styles.pin_jd_title }>{I18n.t('PresaleConfirm.BRT_Blue')}</Text>
								<Text style={ styles.pin_jd_tip }>{ change != '' ? change.jieduan_1_str : '' }</Text>
							</View>
							<View style={ styles.flex }>
								<Text style={ styles.pin_jd_title }>{I18n.t('PresaleConfirm.money')}</Text>
								<Text style={ {
									color: '#F01313',
									fontSize: pxToDp(30)
								} }>Ks{ change != '' ? change.jieduan_1_price : '' }</Text>
							</View>
						</View>
						{ change.order_state_str!=I18n.t('OrderList.canceled')&&
						<View style={ styles.pin_item }>
							<View style={ styles.flex }>
								<Text style={ styles.pin_jd_title }>{I18n.t('PreSaleOrderDetail.Phase_two')}</Text>
								<Text
									style={ [ styles.pin_jd_tip, {fontSize: pxToDp(20)} ] }>{ change != '' ? change.jieduan_2_str : '' }</Text>
							</View>
							<View style={ styles.flex }>
								<Text style={ styles.pin_jd_title }>{I18n.t('PinLadderOrderDetail.final_payment')}</Text>
								<Text style={ {
									color: '#F01313',
									fontSize: pxToDp(30)
								} }>Ks{ change != '' ? change.jieduan_2_price : '' }</Text>
							</View>
						</View>}
						{ change.order_state_str!=I18n.t('OrderList.canceled')&&
						<View style={ styles.pin_item }>
							<View style={ styles.flex }>
								<Text style={ styles.pin_jd_title }>{I18n.t('OrderDetail.freight')}</Text>
							</View>
							<View style={ styles.flex }>
								<Text style={ [ styles.pin_jd_title, {marginRight: 0} ] }>{I18n.t('PinLadderOrderDetail.freight_free')}</Text>
							</View>
						</View>}
					</View>

					<View style={ styles.m20 }>
						<Text style={ styles.title }>{I18n.t('OrderDetail.leavewords')}</Text>
						{ guding != '' &&
						<Text style={ {
							color: '#ADADAD',
							fontSize: pxToDp(26),
							lineHeight: pxToDp(50),
							padding: pxToDp(20)
						} }>
							{ guding.member_message ? guding.member_message : I18n.t('PinLadderOrderDetail.No_message') }
						</Text> }

					</View>

				</ScrollView>

				{ guding != '' && guding.order_state * 1 < 30 && guding.order_state * 1 > 0 &&
				<View style={ styles.foot }>
					<Text style={styles.pin_foot_txt}>应付尾款：Ks{ViewUtils.formatFloat(change.jieduan_2_price,2)}</Text>
					<TouchableOpacity
						style={[styles.order_btn,change.shi_fou_ke_yi_fu_wei_kuan=='0'?styles.disable_btn: '']}
						activeOpacity={1}
						onPress={()=>{
							if(change.shi_fou_ke_yi_fu_wei_kuan=='0') return;
							this.props.navigation.navigate('PreSalePay',{
								order_sn: guding.order_sn,
								type: 'pin_ladder',
								p: change.jieduan_2_price
							})
						}}
					>
						<Text style={{color: '#FFFFFF',fontSize: pxToDp(30)}}>{I18n.t('PinLadderOrderDetail.pay_final_payment')}</Text>
					</TouchableOpacity>
				</View> }
			</View>
		)
	}
}

