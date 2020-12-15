/*
 * 充值列表页面
 * @slodon
 * */
import React , { Component } from 'react';
import {
	View , ImageBackground
} from 'react-native';
import pxToDp from '../util/pxToDp';
import SldHeader from '../component/SldHeader';
import SldFlatList from '../component/SldFlatList';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import ViewUtils from '../util/ViewUtils';
import CountEmitter from '../util/CountEmitter';
// 导入Dimensions库
var Dimensions = require ( 'Dimensions' );
const { width , height } = Dimensions.get ( 'window' );
const pageSize = 10;
import {I18n} from './../lang/index'

export default class RechargeList extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title : I18n.t('RechargeList.title') ,
			ava_predeposite : '' ,//用户可用余额
			refresh : false ,
			data : [] ,//充值列表
			pn : 1 ,//当前页面
			hasmore : true ,//是否还有数据
			show_gotop : false ,
			is_request : false ,
			flag : 0
		}
	}

	componentWillMount () {
		if ( key ) {
			this.getHeaderCon ();//获取头部组件事件
			this.getChongZhiList ();//获取列表数据
		} else {
			ViewUtils.navDetailPage ( this.props.navigation , 'Login' );
		}
		//监听更新历史缓存
		CountEmitter.addListener ( 'updateRechargeList' , () => {
			this.getHeaderCon ();//获取头部组件事件
			this.getChongZhiList ( 1 );//获取列表数据
		} );
	}


	componentWillUnmount () {
		//卸载监听
		CountEmitter.removeListener ( 'updateRechargeList' , () => {} );
	}

	//获取用户余额
	getHeaderCon = () => {
		RequestData.getSldData ( AppSldUrl + '/index.php?app=usercenter&mod=getMyAvailable&key=' + key )
			.then ( result => {
				this.setState ( {
					ava_predeposite : result.datas.predepoit
				} );
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}

	getChongZhiList = ( type = 0 ) => {
		let { pn , data , hasmore , refresh } = this.state;
		if ( type == 1 ) {
			pn = 1;
		}
		RequestData.getSldData ( AppSldUrl + "/index.php?app=cash&mod=rechargeLogList&key=" + key + '&currentPage=' + pn + "&pageSize=" + pageSize )
			.then ( result => {
				if ( result.state != 200 ) {
					this.setState ( {
						refresh : false ,
						flag : 1 ,
					} );
				} else {
					if ( refresh ) {
						refresh = false;
					}
					if ( pn == 1 ) {
						data = result.data.list;
					} else {
						data = data.concat ( result.data.list );
					}
					if ( pn * pageSize < result.data.pagination.total ) {
						pn = pn + 1;
						hasmore = true;
					} else {
						hasmore = false;
					}
					this.setState ( {
						pn : pn ,
						data : data ,
						hasmore : hasmore ,
						refresh : refresh ,
						flag : 1 ,
					} );
				}

			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
				this.setState ( {
					refresh : false ,
					flag : 1 ,
				} );
			} )
	}


	分割线组件
	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.space_shi_separate }/>
		);
	}

	//删除记录事件
	delItem = ( pdr_id ) => {
		const { data } = this.state;
		let new_data = new Array ();
		RequestData.postSldData ( AppSldUrl + '/index.php?app=cash&mod=delRechargeLog&key=' + key , { id : pdr_id } )
			.then ( result => {
				if ( result.state == 200 ) {
					ViewUtils.sldToastTip ( I18n.t('RechargeList.text1') );
					//移除数据
					let i;
					for ( i in data ) {
						if ( data[ i ].pdr_id != pdr_id ) {
							new_data.push ( data[ i ] );
						}
					}
					this.setState ( {
						data : new_data
					} );
				} else {
					ViewUtils.sldToastTip ( result.msg );
				}
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip ();
			} )
	}

	//充值  type为1表示首次充值，2从已有记录里充值
	goCZ = ( type , pdr_sn = '' ) => {
		if ( type == 1 ) {
			ViewUtils.navDetailPage ( this.props.navigation , 'Recharge' )
		} else {
			this.props.navigation.navigate ( 'SelReChargeMethod' , { pdr_sn : pdr_sn } );
		}
	}

	renderCell = ( item ) => {
		return (
			<View style={ { width : width , flexDirection : 'column' , alignItems : 'center' } }>
				<View style={ {
					width : pxToDp ( 710 ) ,
					backgroundColor : '#fff' ,
					borderRadius : pxToDp ( 8 ) ,
					padding : pxToDp ( 16 ) ,
					paddingBottom : 0
				} }>
					{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_sn')+'：' + item.pdr_sn , '#605F60' , 28 , '300' , 0 , 15 ) }
					{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_add_time_str')+'：' + item.pdr_add_time_str , '#605F60' , 28 , '300' , 0 , 15 ) }
					{ item.pdr_payment_state == 0 && <View>
						<View style={ { flexDirection : 'row' , justifyContent : 'space-between' } }>
							{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_amount')+'：' + item.pdr_amount * 1 , '#605F60' , 28 , '300' , 0 , 15 ) }
							{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_payment_name')+'：' + item.pdr_payment_name , '#605F60' , 28 , '300' , 0 , 15 ) }
						</View>
						<View style={ [ GlobalStyles.line , { marginTop : pxToDp ( 15 ) } ] }/>
						<View style={ {
							width : "100%" ,
							height : pxToDp ( 90 ) ,
							flexDirection : 'row' ,
							justifyContent : 'flex-end' ,
							alignItems : 'center'
						} }>
							{ ViewUtils.sldButton ( () => this.delItem ( item.pdr_id ) , 152 , 52 , '#C1C1C1' , 8 , 24 , '#fff' , I18n.t('PointsCart.delete') ) }
							{ ViewUtils.sldButton ( () => this.goCZ ( 2 , item.pdr_sn ) , 152 , 52 , '#FC496D' , 8 , 24 , '#fff' , I18n.t('MyScreen.RechargeList') , 20 ) }
						</View>
					</View> }
					{ item.pdr_payment_state == 1 && <View>
						{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_payment_time_str')+'：' + item.pdr_payment_time_str , '#605F60' , 28 , '300' , 0 , 15 ) }
						{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_sn')+'：' + item.pdr_sn , '#605F60' , 28 , '300' , 0 , 15 ) }
						{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_payment_name')+'：' + item.pdr_payment_name , '#605F60' , 28 , '300' , 0 , 15 ) }
						<View style={ { flexDirection : 'row' , justifyContent : 'space-between' } }>
							{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_amount')+'：' + item.pdr_amount * 1 , '#605F60' , 28 , '300' , 0 , 15 ) }
							{ ViewUtils.sldText ( I18n.t('RechargeList.pdr_amount') , '#605F60' , 28 , '300' , 0 , 15 , 0 , 31 ) }
						</View>
					</View> }

				</View>
			</View>
		);
	}
	//下拉重新加载
	refresh = () => {
		this.getHeaderCon ();//获取头部组件事件
		this.getChongZhiList ( 1 );//获取充值列表数据
	}

	分页
	getNewData = () => {
		const { hasmore } = this.state;
		if ( hasmore ) {
			this.getChongZhiList ();//获取充值列表数据
		}
	}

	handleScroll = ( event ) => {
		let offset_y = event.nativeEvent.contentOffset.y;
		let { show_gotop } = this.state;
		if ( !show_gotop && offset_y > 100 ) {
			show_gotop = true
		}
		if ( show_gotop && offset_y < 100 ) {
			show_gotop = false
		}
		this.setState ( {
			show_gotop : show_gotop ,
		} );

	}

	keyExtractor = ( item , index ) => {
		return index
	}

	onClick = ( type ) => {
		alert ( type );
	}

	render () {
		const { title , data , refresh , show_gotop , flag } = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>
				<ImageBackground style={ {
					width : width ,
					height : pxToDp ( 140 ) ,
					flexDirection : 'row' ,
					justifyContent : 'space-between' ,
					alignItems : 'center' ,
					marginBottom : pxToDp ( 20 )
				} } source={ require ( "../assets/images/sld_cz_list_bg.png" ) } resizeMode="stretch">
					<View style={ {
						width : '100%' ,
						paddingLeft : pxToDp ( 30 ) ,
						paddingRight : pxToDp ( 30 ) ,
						flexDirection : 'row' ,
						justifyContent : 'space-between' ,
						alignItems : 'flex-end'
					} }>
						{ ViewUtils.sldButton ( () => this.goCZ ( 1 ) , 116 , 46 , '#c7900d' , 8 , 27 , '#fff' , I18n.t('MyScreen.RechargeList') ) }
						<View style={ { flexDirection : 'column' , alignItems : 'flex-end' } }>
							{ ViewUtils.sldText ( I18n.t('AccountMoney.difference') , '#fff' , 27 ) }
							{ ViewUtils.sldText ( this.state.ava_predeposite , '#fff' , 42 , '500' , 0 , 13 ) }
						</View>
					</View>
				</ImageBackground>
				<SldFlatList
					data={ data }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh () }
					keyExtractor={ () => this.keyExtractor () }
					handleScroll={ ( event ) => this.handleScroll ( event ) }
					getNewData={ () => this.getNewData () }
					separatorComponent={ () => this.separatorComponent () }
					renderCell={ ( item ) => this.renderCell ( item ) }
				/>
				{ ( flag == 1 && data.length == 0 ) && ViewUtils.SldEmptyTip ( require ( '../assets/images/emptysldcollect.png' ) , I18n.t('RechargeList.text2') ) }
			</View>
		)
	}
}
