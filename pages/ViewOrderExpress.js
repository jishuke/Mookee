/*
 * 查看物流页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, ScrollView, Text, Image, StyleSheet, Dimensions
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp';
const {width, height} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class ViewOrderExpress extends Component{

	constructor(props){

		super(props);
		this.state = {
			sldOrderId: props.navigation.state.params.orderid,//订单id
			title: I18n.t('ViewOrderExpress.title'),
			expressInfo: '',
			deliver_info: []
		}
	}

	componentDidMount(){
		this.getDeliver();
	}

	// 物流信息
	getDeliver(){
		let {sldOrderId} = this.state;
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=search_deliver', {
			key,
			order_id: sldOrderId
		}).then(res => {
			if(res.code == 200){
				let deliver_info = res.datas.deliver_info;
				for(let i = 0;i<deliver_info.length;i++){
					deliver_info[i] = deliver_info[i].replace(new RegExp('&nbsp;','g'),' ');
				}
				this.setState({
					expressInfo: res.datas,
					deliver_info: deliver_info
				})
			}
		})
	}

	render(){
		const {expressInfo, title, deliver_info} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ GlobalStyles.line }/>

				{ expressInfo != '' && <View style={ styles.title }>
					<Image
						resizeMode={ 'contain' }
						style={ {width: pxToDp(46), height: pxToDp(46), marginRight: pxToDp(20)} }
						source={ require('../assets/images/mcc_03.png') }
					/>
					<View style={ {flex: 1,} }>
						<Text
							style={ {color: '#232326', fontSize: pxToDp(26)} }>{I18n.t('ViewOrderExpress.express_name')}：{ expressInfo.express_name }</Text>
						<Text
							style={ {color: '#848689', fontSize: pxToDp(22)} }>{I18n.t('ViewOrderExpress.shipping_code')}：{ expressInfo.shipping_code }</Text>
					</View>
				</View> }

				{ expressInfo != '' && <ScrollView>
					{ deliver_info.length > 0 && deliver_info.map((el, index) => <View
						style={ styles.list }
					>
						<View style={ [ styles.list_left, (index == 0 ? (styles.on) : (styles.ls)) ] }>
						</View>
						<View styles={ styles.list_right }>
							<Text style={ {color: '#333',lineHeight: pxToDp(30), fontSize: pxToDp(24),width: width-pxToDp(120)} }>{ el }</Text>
						</View>
					</View>) }

					<View style={ styles.tip }>
						<Text style={ {
							color: '#999',
							fontSize: pxToDp(24),
							lineHeight: pxToDp(40)
						} }>{I18n.t('ViewOrderExpress.text1')}</Text>
						<Text style={ {
							color: '#999',
							fontSize: pxToDp(24),
							lineHeight: pxToDp(40)
						} }>{I18n.t('ViewOrderExpress.text2')}</Text>
					</View>
				</ScrollView> }
			</View>
		)
	}
}

const styles = StyleSheet.create({
	list: {
		flexDirection: 'row',
		paddingHorizontal: pxToDp(20),
		paddingVertical: pxToDp(20),
	},
	list_left: {
		width: pxToDp(120),
		alignItems: 'center',
	},
	on: {
		width: pxToDp(30),
		height: pxToDp(30),
		borderRadius: pxToDp(25),
		backgroundColor: '#18be61',
		marginHorizontal: pxToDp(20),
	},
	ls: {
		width: pxToDp(10),
		height: pxToDp(10),
		marginTop: pxToDp(10),
		borderRadius: pxToDp(15),
		backgroundColor: '#ccc',
		marginHorizontal: pxToDp(30)
	},
	list_right: {
		width: width-pxToDp(120),
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#e9e9e9',
		borderStyle: 'solid',
	},
	title: {
		height: pxToDp(128),
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingHorizontal: pxToDp(20)
	},
	tip: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: pxToDp(30),
		backgroundColor: '#fff'
	}
})
