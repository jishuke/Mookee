import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Image, DeviceEventEmitter,  Alert,
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import SldComStatusBar from '../component/SldComStatusBar';
import SldHeader from '../component/SldHeader';
import styles from './stylejs/presale'
import PriceUtil from '../util/PriceUtil'

const scrWidth = Dimensions.get('window').width;
const psColor = '#FF0A50';
import {I18n} from './../lang/index'

export default class PreSaleOrderDetail extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: I18n.t('OrderDetail.title'),
			order_id: props.navigation.state.params.order_id,
			address_info: '',
			goods_info: '',
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
		RequestData.getSldData(AppSldUrl + `/index.php?app=order&mod=order_desc&sld_addons=presale&key=${ key }&order_id=${ order_id }`).then(res => {
			if(res.status == 200){
				this.setState({
					goods_info: res.data,
					address_info: res.data.address
				})
			}else{
				Alert.alert(I18n.t('hint'), res.msg, [
					{
						text:I18n.t('cancel') ,
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

	render(){
		const {title, address_info, goods_info} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } title_color={ '#fff' } bgColor={ psColor }
				           left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<SldComStatusBar nav={ this.props.navigation } color={ psColor } barStyle={'light-content'}/>
				<ScrollView style={ {paddingBottom: pxToDp(30)} }>

					{ goods_info != '' && goods_info.order_state == 20 && <Image
						style={ {width: scrWidth, height: pxToDp(138)} }
						source={ require('../assets/images/prepaysuccess.png') }
					/> }

					{ goods_info != '' && goods_info.order_state == 0 && <Text
						style={ {
							width: scrWidth,
							height: pxToDp(70),
							lineHeight: pxToDp(70),
							textAlign: 'center',
							backgroundColor: '#FFF0BB',
							color: '#7A6D3F',
							fontSize: pxToDp(24)
						} }>{I18n.t('PreSaleOrderDetail.text1')}</Text> }

					{/*地址*/ }
					{ address_info != '' && <View
						style={ styles.addr2 }
					>
						<Image
							source={ require('../assets/images/predw.png') }
							style={ {width: pxToDp(34), height: pxToDp(42), marginRight: pxToDp(30)} }
							resizeMode={ 'contain' }
						/>
						<View style={ styles.addr_l }>
							<View style={ styles.txt_w }>
								<Text
									style={ [ styles.txt, {marginRight: pxToDp(50)} ] }>{ address_info.true_name }</Text>
								<Text style={ styles.txt }>{ address_info.mob_phone }</Text>
							</View>
							<Text style={ styles.txt }>{ address_info.area_info + ' ' + address_info.address }</Text>
						</View>
					</View> }


					<View style={ styles.m20 }>
						<Text style={ styles.title }>{I18n.t('PresaleConfirm.product_list')}</Text>
						{ goods_info != '' && <TouchableOpacity
							style={ styles.goods }
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.navigate('GoodsDetailNew', {gid: goods_info.gid})
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
								{ typeof (goods_info.goods_spec) != 'undefined' && goods_info.goods_spec != null &&
								<View style={ styles.spec }>
									{ Object.keys(goods_info.goods_spec).map(el => <Text style={ styles.num }>{ goods_info.goods_spec[el] }</Text>) }
								</View> }
								{ goods_info.send_str != '' &&
								<Text style={ styles.num }>{ goods_info.send_str }</Text> }

								{ goods_info.order_state == 20 && <Image
									style={ {
										position: 'absolute',
										right: pxToDp(15),
										top: pxToDp(100),
										width: pxToDp(170),
										height: pxToDp(133)
									} }
									source={ require('../assets/images/pres.png') }
								/> }
							</View>
						</TouchableOpacity> }
					</View>

					<View style={ styles.m20 }>
						<View style={ styles.jd_item }>
							<Text style={ styles.jd_title }>{I18n.t('PresaleConfirm.BRT_Blue')} { goods_info.state_1 }</Text>
							<View style={ styles.jd_price }>
								<Text style={ {
									color: '#999999',
									fontSize: pxToDp(24),
								} }>{ goods_info.state_str_1 }</Text>
								<Text style={ {
									color: '#FE011D',
									fontSize: pxToDp(30)
								} }>Ks{ goods_info != '' ? PriceUtil.formatPrice(goods_info.ding_price) : '' }</Text>
							</View>
						</View>

						<View style={ GlobalStyles.line }/>

						{ goods_info != '' && typeof (goods_info.state_2) != 'undefined' &&
						<View style={ styles.jd_item }>
							<Text style={ styles.jd_title }>{I18n.t('PreSaleOrderDetail.Phase_two')} { goods_info.state_2 }</Text>
							<Text style={ styles.jd_tip }>{ goods_info.state_str_2 }</Text>
							<View style={ styles.jd_price }>
								<Text style={ {
									color: '#999999',
									fontSize: pxToDp(24),
								} }>{I18n.t('PreSaleOrderDetail.Goods_payment')}{ (goods_info.order_state == 20 && goods_info.finish == 0) ?I18n.t('PreSaleOrderDetail.unpaid')  : '' }</Text>
								<Text style={ {
									color: '#FE011D',
									fontSize: pxToDp(30)
								} }>Ks{ PriceUtil.formatPrice(goods_info.wei_price) }</Text>
							</View>
						</View> }

					</View>

					<View style={ styles.m20 }>
						<Text style={[styles.num,{lineHeight: pxToDp(80)}]}>{I18n.t('PreSaleOrderDetail.order_number')}: {goods_info!=''?goods_info.order_sn:' '}</Text>
						<Text style={[styles.num,{lineHeight: pxToDp(80)}]}>{I18n.t('PreSaleOrderDetail.order_time')}: {goods_info!=''?goods_info.add_time:' '}</Text>
					</View>

				</ScrollView>

				{ goods_info!='' && (goods_info.finish == 1 || goods_info.ding==1)  && <View style={ styles.foot }>
					<Text style={{
						color: '#FE011D',
						fontSize: pxToDp(30),
						flex: 1,
						lineHeight: pxToDp(98),
						paddingLeft: pxToDp(50)
					}}>{goods_info.ding==1?I18n.t('PreSaleOrderDetail.with_deposit')+'：Ks'+ ViewUtils.formatFloat(goods_info.ding_price,2): I18n.t('PreSaleOrderDetail.final_payment')+'：Ks'+ ViewUtils.formatFloat(goods_info.wei_price,2)}</Text>
					<TouchableOpacity
						style={styles.order_btn}
						activeOpacity={1}
						onPress={()=>{
							this.props.navigation.navigate('PreSalePay',{
								order_sn: goods_info.order_sn,
								type: 'presale',
								p: goods_info.ding==1 ? goods_info.ding_price : goods_info.wei_price
							})
						}}
					>
						<Text style={{color: '#FFFFFF',fontSize: pxToDp(30)}}>{goods_info.ding==1? I18n.t('GoodsDetailNew.text23'):I18n.t('GoodsDetailNew.text25')}</Text>
					</TouchableOpacity>
				</View> }

			</View>
		)
	}
}

