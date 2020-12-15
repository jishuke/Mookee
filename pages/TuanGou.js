/*
 * 专题页面
 * @slodon
 * */
import React , { Component } from 'react';
import {
	Image , StyleSheet , Text , TouchableOpacity , View , FlatList ,
	DeviceInfo
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import DiyPage from "../component/DiyPage";
import ViewUtils from '../util/ViewUtils';
import PriceUtil from '../util/PriceUtil'

var Dimensions = require ( 'Dimensions' );
const scrWidth = Dimensions.get ( 'window' ).width;
const scrHeight = Dimensions.get ( 'window' ).height;

import {I18n} from './../lang/index'
export default class TuanGou extends Component {

	constructor ( props ) {

		super ( props );
		this.state = {
			diy_data : [] ,//存放所有的装修改数据
			title : I18n.t('com_SecondCatLIstComponent.group_purchase') ,//页面标题
			data : [] ,//存放数据
			pn : 1 ,//当前页
			hasmore : true ,//是否还有数据
			refresh : false ,//是否刷新
			show_gotop : false ,
			is_request : false ,
			flag : 0 ,
		}
	}
	extend_param_str = '';

	componentWillMount () {
		if(CitySite.bid!=undefined&&CitySite.bid>0){
			this.extend_param_str = '&bid='+CitySite.bid;
		}
		this.getGoodsInfo ();
		this.getInitData();//获取团购装修数据
	}

	getInitData = () => {
		this.getDiyData ();
	}


	//获取装修数据
	getDiyData = () => {
		RequestData.getSldData ( AppSldUrl + '/index.php?app=index&mod=topic&activity_type=tuan'+this.extend_param_str)
			.then ( result => {
				if ( result.datas.error ) {
				} else {
					let datainfo = result.datas;
					if(datainfo.length > 0){

						for(let i=0;i<datainfo.length;i++){
							if(datainfo[i]['type'] == 'lunbo'){
								datainfo[i] = ViewUtils.build_lunbpo_dapei(datainfo[i]);
							}else if(datainfo[i]['type'] == 'dapei'){
								datainfo[i] = ViewUtils.build_lunbpo_dapei(datainfo[i]);
							}else if(datainfo[i]['type'] == 'tupianzuhe'){
								if(datainfo[i]['sele_style'] == 0){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										Image.getSize(new_data[j].img,(width,height) =>{
											let new_image_info = ViewUtils.handleIMage(width,height);
											datainfo[i]['data'][j]['width'] = new_image_info.width;
											datainfo[i]['data'][j]['height'] = new_image_info.height;
										});
									}
								}else if(datainfo[i]['sele_style'] == 1){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										Image.getSize(new_data[j].img,(width,height) =>{
											let new_image_info = ViewUtils.handleIMage(width,height,scrWidth*1-20);
											datainfo[i]['data'][j]['width'] = new_image_info.width;
											datainfo[i]['data'][j]['height'] = new_image_info.height;
										});
									}
								}else if(datainfo[i]['sele_style'] == 2){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										Image.getSize(new_data[j].img,(width,height) =>{
											let new_image_info = ViewUtils.handleIMage(width,height,Math.floor((scrWidth*1-30)/2));
											datainfo[i]['data'][j]['width'] = new_image_info.width;
											datainfo[i]['data'][j]['height'] =  new_image_info.height;
										});
									}
								}else if(datainfo[i]['sele_style'] == 3){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										Image.getSize(new_data[j].img,(width,height) =>{
											let new_image_info = ViewUtils.handleIMage(width,height,Math.floor((scrWidth*1-40)/3));
											datainfo[i]['data'][j]['width'] = new_image_info.width;
											datainfo[i]['data'][j]['height'] = new_image_info.height;
										});
									}
								}else if(datainfo[i]['sele_style'] == 4){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										if(j==0){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
											datainfo[i]['data'][j]['height'] = Math.floor(datainfo[i]['data'][j]['width']*16/15);
										}else if(j==1||j==2){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
											datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/4);
										}
									}
								}else if(datainfo[i]['sele_style'] == 5){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										Image.getSize(new_data[j].img,(width,height) =>{
											if(j==0||j==3){
												datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/3);
												datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
											}else if(j==1||j==2){
												datainfo[i]['data'][j]['width'] = scrWidth*1-30-Math.floor((scrWidth*1-30)/3);
												datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/3);
											}
										});
									}
								}else if(datainfo[i]['sele_style'] == 6){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										Image.getSize(new_data[j].img,(width,height) =>{
											if(j==0||j==3){
												datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
												datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/4);
											}else if(j==1||j==2){
												datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
												datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
											}
										});
									}
								}else if(datainfo[i]['sele_style'] == 7){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										Image.getSize(new_data[j].img,(width,height) =>{
											if(j==4){
												datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-40)/3);
												datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-40)/10*7);
											}else {
												datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-40)/3);
												datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
											}
										});
									}
								}
							}
						}
						this.setState ( {
							diy_data : datainfo
						} );
					}
				}
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}


	//获取限时折扣商品列表
	getGoodsInfo = ( type = 0 ) => {
		let { pn , data , hasmore , refresh , } = this.state;
		pn = type == 1 ? 1 : pn;
		RequestData.getSldData ( AppSldUrl + '/index.php?app=discount&mod=tuan_goods_list&key=' + key + '&currentPage=' + pn+this.extend_param_str )
			.then ( result => {
				if ( result.code == 200 ) {
					if ( refresh ) {
						refresh = false;
					}
					if ( pn == 1 ) {
						data = result.datas.goods;
					} else {
						data = data.concat ( result.datas.goods );
					}
					if ( pn < result.page_total ) {
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


				} else {
					this.setState ( {
						refresh : false ,
						flag : 1 ,
					} );
				}
			} )
			.catch ( error => {
				this.setState ( {
					refresh : false ,
					flag : 1 ,
				} );
				ViewUtils.sldErrorToastTip(error);
			} )
	}

//flatlist分隔组件
	separatorComponent = () => {
		return (
			<View style={GlobalStyles.space_shi_separate} />
		);
	}
	//下拉刷新
	onRefresh = () => {
		this.setState ( {
			refresh : true ,
		} );
		this.getGoodsInfo ( 1 );

	}
	//上拉加载
	getNewData = () => {
		const { hasmore } = this.state;
		if ( hasmore ) {
			this.getGoodsInfo ();
		}
	}


	//头部组件
	renderHeader = () => {
		const {diy_data} = this.state;
		// return ( <Text></Text>)
		if(diy_data.length>0){
			return (
				diy_data.map((item, index) => {
					return (<DiyPage  key={index}  navigation={this.props.navigation} data={item} />)
				})
			)
		}else{
			return ( <Text></Text>)
		}
	}

	//尾部组件
	footerView = () => {
		const { data , pn , hasmore } = this.state;
		let content = <View><Text></Text></View>;
		if ( data.length > 0 || pn > 1 ) {
			content = <View style={ styles.flatlist_footer_view }><Text
				style={ styles.flatlist_footer_text }>{ hasmore ? I18n.t('com_PinTuan.Data_loading') : I18n.t('com_PinTuan.data_loaded') }</Text></View>
		}
		return content;
	}


	//渲染数据
	renderCell = ( item , index ) => {
		return (
			<TouchableOpacity
				key={ item.gid }
				activeOpacity={ 1 } onPress={ () => {
				ViewUtils.goGoodsDetail ( this.props.navigation , item.gid )
			} }
				style={{flexDirection:'column',width:scrWidth,alignItems:'center',backgroundColor:'#fff'}}>
				<View style={{width:pxToDp(730),height:pxToDp(340),borderWidth:1,borderColor:"#eee",marginTop:pxToDp(10)}}>
					{ ViewUtils.getSldImg ( 730 , 340 , { uri : item.sld_pic} ) }
				</View>
				<View style={{width:'100%',padding:pxToDp(20),paddingBottom:pxToDp(10)}}>
						<Text style={{color:'#353535',fontSize:pxToDp(32),fontWeight:'400',lineHeight:pxToDp(50)}} numberOfLines={ 2 }>
							{ ViewUtils.getSldImg ( 308 , 90 , require ( '../assets/images/sld_tuangou_list.png' ) ) }&nbsp;&nbsp;{item.goods_name}</Text>
				</View>

				<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',paddingLeft:pxToDp(20),paddingRight:pxToDp(20),paddingBottom:pxToDp(36)}}>
					<View>
						<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-end'}}>
							<Text style={{color:'#EE1B21',fontSize:pxToDp(46),}}>ks{PriceUtil.formatPrice(item.promotion_price)}</Text>
							<Text style={{color:'#808080',fontSize:pxToDp(24),marginBottom:pxToDp(4),marginLeft:pxToDp(22)}}>{I18n.t('TuanGou.save')}{item.sheng_money}{I18n.t('TuanGou.yuan')}</Text>
						</View>
						<View style={{flexDirection:'row',justifyContent:'flex-start'}}>
							<Text style={{color:'#808080',fontSize:pxToDp(24)}}>{I18n.t('TuanGou.Originalprice')}:Ks{PriceUtil.formatPrice(item.goods_price)}&nbsp;&nbsp;|&nbsp;&nbsp;{I18n.t('TuanGou.Group')} {item.buyed_quantity}{I18n.t('TuanGou.Piece')}</Text>

						</View>
					</View>
					<View style={[{backgroundColor:'#EE1B21',width:pxToDp(172),height:pxToDp(64),borderRadius:pxToDp(32)},GlobalStyles.flex_common_row]}>
						<Text style={{color:'#fff',fontSize:pxToDp(26)}}>{I18n.t('TuanGou.Buynow')}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}


	keyExtractor = ( item , index ) => {
		return index
	}

	handleScroll = (event) => {
		let offset_y = event.nativeEvent.contentOffset.y;
		let {show_gotop} = this.state;
		if(!show_gotop && offset_y > 100){
			show_gotop = true
			this.setState({
				show_gotop: show_gotop,
			});
		}
		if(show_gotop && offset_y < 100){
			show_gotop = false
			this.setState({
				show_gotop: show_gotop,
			});
		}
	}

	render () {
		let { title , diy_data , data , flag , show_gotop , refresh } = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ I18n.t('TuanGou.Groupbuy') } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>

				{ flag == 1 && (
					<FlatList
						ref={ 'flatlist' }
						ListEmptyComponent={ ViewUtils.renSldFlatEmpty ( scrHeight - 80 , require ( '../assets/images/sld_search_goodslist.png' ) , I18n.t('com_PinTuan.No_data_obtained') ) }
						ListHeaderComponent={ () => this.renderHeader () }
						onRefresh={ () => this.onRefresh () }
						refreshing={ refresh }
						keyExtractor={ ( item , index ) => this.keyExtractor ( item , index ) }
						onEndReachedThreshold={ 0.3 }
						onScroll={ ( event ) => this.handleScroll ( event ) }
						onEndReached={ () => this.getNewData () }
						ItemSeparatorComponent={ () => this.separatorComponent () }
						data={ data }
						renderItem={ ( { item , index } ) => this.renderCell ( item , index ) }
					/>
				) }

				{ show_gotop && (
					<TouchableOpacity
						activeOpacity={ 1 } onPress={ () => {
						this.refs.flatlist.scrollToIndex ( { animated : true , index : 0 } );
					} }
						style={ {
							position : 'absolute' ,
							zIndex : 2 ,
							right : pxToDp ( 40 ) ,
							bottom : DeviceInfo.isIPhoneX_deprecated ? ( pxToDp ( 60 ) + 35 ) : pxToDp ( 60 )
						} }>
						<Image style={ { width : pxToDp ( 60 ) , height : pxToDp ( 60 ) } } resizeMode={ 'contain' }
						       source={ require ( '../assets/images/sld_gotop.png' ) }/>
					</TouchableOpacity>
				) }
			</View>
		)
	}
}
const styles = StyleSheet.create ( {
	sld_xs_item_view : { flexDirection : 'row' , width : scrWidth , padding : pxToDp ( 20 ) , backgroundColor : '#fff' } ,
	sld_xs_rpart_view : {
		flexDirection : 'column' ,
		alignItems : 'flex-start' ,
		justifyContent : 'space-between' ,
		marginLeft : pxToDp ( 30 ) ,
		width : scrWidth - pxToDp ( 322 )
	} ,
	sld_xs_rpart_gname : {
		color : "#353535" ,
		fontSize : pxToDp ( 30 ) ,
		lineHeight : pxToDp ( 50 ) ,
		fontWeight : '400'
	} ,
	sld_xc_rpartb_view : {
		height : pxToDp ( 40 ) ,
		borderWidth : 1 ,
		borderColor : '#AC1FE0' ,
		flexDirection : 'row' ,
		width : pxToDp ( 211 ) ,
		borderTopLeftRadius : pxToDp ( 4 ) ,
		alignItems : 'center' ,
	} ,
	sld_xs_tip : { width : pxToDp ( 114 ) , height : '100%' , backgroundColor : '#AC1FE0' } ,
	sld_xs_tip_text : { color : '#fff' , fontSize : pxToDp ( 20 ) , } ,
	sld_xs_discount : { color : '#AC1FE0' , fontSize : pxToDp ( 20 ) , } ,
	sld_xs_rbpart_bottom : {
		flexDirection : 'row' ,
		justifyContent : 'space-between' ,
		alignItems : 'center' ,
		width : '100%'
	} ,

	sld_xs_rbpart_wrap : { flexDirection : 'row' , justifyContent : 'flex-start' , alignItems : 'flex-end' } ,

	sld_xs_gshow_price : { color : '#AC1FE0' , fontSize : pxToDp ( 32 ) , fontWeight : '600' } ,
	sld_xs_gmarket_price : {
		color : '#aaa' ,
		fontSize : pxToDp ( 20 ) ,
		fontWeight : '400' ,
		textDecorationLine : 'line-through' ,
		marginBottom : pxToDp ( 4 ) ,
		marginLeft : pxToDp ( 9 )
	} ,
	sld_xs_qiang_view : {
		paddingLeft : pxToDp ( 26 ) ,
		paddingTop : pxToDp ( 14 ) ,
		paddingRight : pxToDp ( 26 ) ,
		paddingBottom : pxToDp ( 14 ) ,
		backgroundColor : '#AC1FE0' ,
		borderRadius : pxToDp ( 28 )
	} ,
	sld_xs_qiang_text : { fontSize : pxToDp ( 28 ) , color : '#fff' , fontWeight : '700' } ,
	flatlist_footer_view:{width:scrWidth,flexDirection:'row',justifyContent:'center',alignItems:'center',height:pxToDp(50)},
	flatlist_footer_text:{fontSize:pxToDp(20),fontWeight:'300',color:'#999'},
} );
