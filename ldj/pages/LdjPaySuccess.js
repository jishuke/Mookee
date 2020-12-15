import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	DeviceEventEmitter,
	TouchableOpacity,
	Image
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";
import SldComStatusBar from '../../component/SldComStatusBar'
import PriceUtil from '../../util/PriceUtil'

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class LdjPaySuccess extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '支付收银台',
			pay_sn: props.navigation.state.params.pay_sn,
			info: ''
		}
	}

	componentDidMount(){
		this.InitData();
	}

	// 获取订单信息
	InitData(){
		let {pay_sn} = this.state;
		RequestData.getSldData(AppSldUrl+'/index.php?app=order&mod=pay_ok&sld_addons=ldj&key='+key+'&pay_sn='+pay_sn).then(res=>{
			if(res.status==200){
				this.setState({
					info: res.data
				})
			}
		}).catch(error=>{
			ViewUtils.sldErrorToastTip(error);
		})
	}

	render(){
		const {info} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition('#fff', pxToDp(0)) }
				<View style={styles.header}>
					<TouchableOpacity
						style={{padding: pxToDp(20)}}
						activeOpacity={1}
						onPress={()=>{
							this.props.navigation.pop();
						}}
					>
						<Image
							style={{width: pxToDp(16),height: pxToDp(24)}}
							source={require('../images/back_b.png')}
							resizeMode={'contain'}
						/>
					</TouchableOpacity>
					<Text style={{color: '#333',fontSize: pxToDp(fontSize_34)}}>{this.state.title}</Text>
					<TouchableOpacity
						style={{padding: pxToDp(20)}}
						activeOpacity={1}
						onPress={()=>{
							this.props.navigation.replace("SldLdjTab")
						}}
					>
						<Text style={{color: '#333',fontSize: pxToDp(fontSize_24)}}>完成</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.main}>
					<View style={styles.main_title}>
						<Text style={{color: '#999',fontSize: pxToDp(fontSize_32)}}>支付成功</Text>
						<Text style={{color: '#333',fontSize: pxToDp(fontSize_24),marginTop: pxToDp(40)}}>Ks<Text style={{fontSize: pxToDp(fontSize_34)}}>{info!=''?PriceUtil.formatPrice(info.order_amount):'--'}</Text></Text>
					</View>

					<View style={styles.info}>
						<View style={styles.item}>
							<Text style={{width: pxToDp(180),fontSize: pxToDp(fontSize_32)}}>收款方</Text>
							<Text style={{marginLeft: pxToDp(60),flex: 1,fontSize: pxToDp(fontSize_32)}}>{info!=''?info.dian_id:'--'}</Text>
						</View>
						<View style={styles.item}>
							<Text style={{width: pxToDp(180),fontSize: pxToDp(fontSize_32)}}>下单时间</Text>
							<Text style={{marginLeft: pxToDp(60),flex: 1,fontSize: pxToDp(fontSize_32)}}>{info!=''?info.add_time:'--'}</Text>
						</View>
						<View style={styles.item}>
							<Text style={{width: pxToDp(180),fontSize: pxToDp(fontSize_32)}}>支付方式</Text>
							<Text style={{marginLeft: pxToDp(60),flex: 1,fontSize: pxToDp(fontSize_32)}}>{info!=''?info.payment_name:'--'}</Text>
						</View>
						<View style={styles.item}>
							<Text style={{width: pxToDp(180),fontSize: pxToDp(fontSize_32)}}>订单编号</Text>
							<Text style={{marginLeft: pxToDp(60),flex: 1,fontSize: pxToDp(fontSize_32)}}>{info!=''?info.order_sn:'--'}</Text>
						</View>
					</View>
				</View>

				<TouchableOpacity
					style={styles.btn}
					activeOpacity={1}
					onPress={()=>{
						this.props.navigation.replace("SldLdjTab")
					}}
				>
					<Text style={{color: '#fff',fontSize: pxToDp(fontSize_32)}}>完成</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	header:{
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		height: pxToDp(85),
		justifyContent: 'space-between',
	},
	main:{
		marginTop: pxToDp(20),
		backgroundColor: '#fff',
	},
	main_title:{
		height: pxToDp(248),
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#EAEAEA',
		borderStyle: 'solid'
	},
	info:{
		paddingVertical: pxToDp(60),
		paddingLeft: pxToDp(40),
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#EAEAEA',
		borderStyle: 'solid'
	},
	item:{
		flexDirection: 'row',
		marginBottom: pxToDp(45)
	},
	btn:{
		height: pxToDp(76),
		marginHorizontal: pxToDp(155),
		marginTop: pxToDp(87),
		backgroundColor: main_ldj_color,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: pxToDp(8),
	}
})
