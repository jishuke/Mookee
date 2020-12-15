/*
 *
 * 消息详情页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, DeviceEventEmitter, FlatList, StyleSheet
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp';
import SldMsg from '../component/SldMsg';
import {I18n} from './../lang/index'
const GetQueryStr = (str, param) => {
	let arr = str.split('?')[ 1 ];
	let result = '';
	if(arr.indexOf('&') > -1){
		let arr2 = arr.split('&');
		for(let i = 0; i < arr2.length; i++){
			let el = arr2[ i ].split('=');
			if(el[ 0 ] == param){
				result = el[ 1 ];
				break;
			}
		}
	}else{
		let el = arr.split('=');
		if(el[ 0 ] == param){
			result = el[ 1 ];
		}
	}
	return result;
}

export default class MyMessageDetail extends Component{

	constructor(props){

		super(props);
		this.state = {
			messagetip: props.navigation.state.params.messagetip,
			title: I18n.t('MyMessageDetail.title'),//页面标题
			list: [],
			isLoading: 0,
			pn: 1,
			hasmore: true,
		}
	}

	componentWillMount(){
		this.getSiteMsg();
	}

	// 获取系统消息
	getSiteMsg(){
		let {pn, messagetip} = this.state;
		RequestData.getSldData(AppSldUrl + `/index.php?app=usercenter&mod=mysystemmsg&pageSize=10&type=${ messagetip }&pn=${ pn }&key=${ key }`).then(res => {
			if(res.state == 200){
				let msgList = res.data.list;
				if(msgList.length){
					const typeList = {
						sys: I18n.t('MyMessageDetail.sys'),
						fahuo: I18n.t('MyMessageDetail.fahuo'),
						fukuan: I18n.t('MyMessageDetail.fukuan'),
						yue: I18n.t('MyMessageDetail.yue'),
						tui: I18n.t('MyMessageDetail.tui')
					}

					DeviceEventEmitter.emit('msgList');
					DeviceEventEmitter.emit('msgCountUpdate');
					msgList.forEach(el => {
						el.isShowMore = el.message_body.length > 75 ? true : false;
						el.message_title = el.message_title ? message_title : typeList[ messagetip ];
					})
					if(pn == 1){
						this.setState({
							list: msgList
						})
					}else{
						let {list} = this.state;
						this.setState({
							list: list.concat(msgList)
						})
					}
				}

				let pages = res.data.pagination;
				if(pn >= pages.total){
					this.setState({
						hasmore: false
					})
				}else{
					pn++;
					this.setState({
						pn: pn
					})
				}
			}
			this.setState({
				isLoading: 1
			})
		}).catch(() => {
			this.setState({
				isLoading: 1
			})
		})
	}

	getNewData = () => {
		let {hasmore} = this.state;
		if(hasmore){
			this.getSiteMsg();
		}
	}

	detail = (type, param) => {
		switch (type) {
			case 'fahuo':
				this.props.navigation.navigate('OrderDetail', {orderid: param});
				break;
			case 'fukuan':
				this.props.navigation.navigate('AccountMoney');
				break;
			case 'yue':
				this.props.navigation.navigate('AccountMoney');
				break;
			case 'tui':
				this.props.navigation.navigate('ReturnRefundDetail', {refund_id: param});
				break;
			default:
				break;
		}
	}

	render(){
		const {title, list, isLoading, messagetip} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>

				<View style={ GlobalStyles.line }/>

				{ list.length > 0 && <FlatList
					data={ list }
					extraData={ this.state }
					onEndReached={ () => this.getNewData() }
					renderItem={ ({item}) => <SldMsg
						dataSource={ item }
						detail={ (type, param) => this.detail(type, param) }
					/> }
				/> }

				{ list.length == 0 && isLoading == 1 &&
				<View style={ {flex: 1, justifyContent: 'center'} }>{ ViewUtils.noData(I18n.t('MyMessageDetail.information')) }</View> }
			</View>
		)
	}
}


const styles = StyleSheet.create({
	item: {
		marginTop: pxToDp(20),
		paddingHorizontal: pxToDp(30),
		marginHorizontal: pxToDp(20),
		backgroundColor: '#fff',
		borderRadius: pxToDp(10)
	},
	item_top: {
		paddingVertical: pxToDp(20)
	},
	item_bottom: {
		borderTopWidth: pxToDp(1),
		borderTopColor: '#E9E9E9',
		borderStyle: 'solid',
		height: pxToDp(90),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	}
})
