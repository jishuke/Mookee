/*
 * 优惠套装详细页面
 * @slodon
 * */
import React, {Component, Fragment} from 'react';
import {
	Image , StyleSheet , Text , TouchableOpacity , View , ScrollView ,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import PriceUtil from '../util/PriceUtil'

var Dimensions = require ( 'Dimensions' );
const { width , height } = Dimensions.get ( 'window' );
import {I18n} from './../lang/index'


export default class GoodsSuit extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title : I18n.t('GoodsSuit.combination') ,
			gids:props.navigation.state.params.gids,
			gid:props.navigation.state.params.gid,
			suit_detail : {} ,//推荐组合详情
			suit_other_data : [] ,//其他组合
			total_price:0,//应付金额
		}
	}

	componentWillMount () {
		this.getSuitDetail();
		this.getOtherSuit();
	}

	//获取推荐组合详情
	getSuitDetail = () => {
		const { gids,gid } = this.state;
		RequestData.getSldData ( AppSldUrl + '/index.php?app=goods&mod=getSuiteData&key=' + key + '&gids=' + gids+ '&gid=' + gid )
			.then ( result => {
				if ( result.datas.error_flag == false ) {
					let data = result.datas;
					for(let i =0;i<data.goods_list.length;i++){
						data.goods_list[i]['is_sele'] = true;
						data.goods_list[i]['sele_num'] = 1;
					}
					data.base_data.sele_num = 1;
					this.setState ( {
						suit_detail : data
					},()=>{
						this.calTotalPrice();
					} );
				} else {
					ViewUtils.sldToastTip ( result.datas.error_msg );
					let _this = this;
					setTimeout ( function () {
						_this.props.navigation.goBack ();
					} , 2000 );
				}
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}

	//获取推荐组合套装
	getOtherSuit = () => {
		const { gids , gid } = this.state;
		RequestData.getSldData ( AppSldUrl + '/index.php?app=goods&mod=getSuiteOtherData&key=' + key + '&gids=' + gids + '&gid=' + gid )
			.then ( result => {
				if ( result.datas.error_flag == false ) {
					if (result.datas.goods_list.length > 0) {
						this.setState ( {
							suit_other_data : result.datas
						} );
					}

				} else {
					ViewUtils.sldToastTip ( I18n.t('GoodsSuit.text1') );
				}
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}

	//立即购买
	goBuy = () => {
		let {suit_detail,gid} = this.state;
		let t = [];
		t.push(gid+'|'+suit_detail.base_data.sele_num);
		for(let i=0;i<suit_detail.goods_list.length;i++){
			if(suit_detail.goods_list[i].is_sele){
				let sele_gid = suit_detail.goods_list[i].gid;
				let sele_num = suit_detail.goods_list[i].sele_num;
				t.push(sele_gid+'|'+sele_num);
			}
		}
		this.props.navigation.replace ( 'ConfirmOrder' , { 'suite' : this.state.gid ,'checked':t.join(',')} );
	}

	//商品的选中、反选事件
	handleSele = (index) => {
		let {suit_detail} = this.state;
		suit_detail.goods_list[index]['is_sele'] = !suit_detail.goods_list[index]['is_sele'];
		this.setState({
			suit_detail:suit_detail
		},()=>{
			this.calTotalPrice();
		});
	}

	//计算总价
	calTotalPrice = () => {
		let {suit_detail} = this.state;
		let price = 0;
		price = suit_detail.base_data.sele_num*suit_detail.base_data.show_price;
		for(let i=0;i<suit_detail.goods_list.length;i++){
			if(suit_detail.goods_list[i].is_sele){
				price = price + suit_detail.goods_list[i].sele_num*suit_detail.goods_list[i].show_price;
			}
		}
		this.setState({
			total_price:price
		});
	}

	//
	editNum = (type,index,operate) => {
		let {suit_detail} = this.state;
		if(type == 'base'){
			if(operate == 'plus'){
				if(suit_detail.base_data.sele_num>=suit_detail.base_data.goods_storage){
					ViewUtils.sldToastTip ( I18n.t('GoodsSuit.maxinstock')+suit_detail.base_data.goods_storage );
				}else{
					suit_detail.base_data.sele_num = suit_detail.base_data.sele_num +1
				}
			}else{
				if(suit_detail.base_data.sele_num<=1){
					ViewUtils.sldToastTip ( I18n.t('GoodsSuit.minPurchasequantity') );
				}else{
					suit_detail.base_data.sele_num = suit_detail.base_data.sele_num -1;
				}
			}
		}else{
			if(operate == 'plus'){
				if(suit_detail.goods_list[index].sele_num>=suit_detail.goods_list[index].goods_storage){
					ViewUtils.sldToastTip ( I18n.t('GoodsSuit.maxinstock')+suit_detail.goods_list[index].goods_storage );
				}else{
					suit_detail.goods_list[index].sele_num = suit_detail.goods_list[index].sele_num +1
				}
			}else{
				if(suit_detail.goods_list[index].sele_num<=1){
					ViewUtils.sldToastTip ( I18n.t('GoodsSuit.minPurchasequantity') );
				}else{
					suit_detail.goods_list[index].sele_num = suit_detail.goods_list[index].sele_num -1;
				}
			}
		}
		this.setState({
			suit_detail:suit_detail
		},()=>{
			this.calTotalPrice();
		});
	}


	render () {
		let { title , suit_detail , suit_other_data , gid,total_price} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>
				{ typeof ( suit_detail.base_data ) != 'undefined' &&
				<ScrollView>

					<View style={ { flexDirection : 'column' , width : width , } }>

						<View style={ {
							flexDirection : 'row' ,
							justifyContent : 'flex-start' ,
							alignItems : 'center' ,
							width : '100%' ,
							paddingLeft : 15 ,
							paddingRight : 15 ,
							backgroundColor : '#fff' ,
							height : pxToDp ( 240 )
						} }>
							<View
								style={ [ { height : pxToDp ( 180 ) } , GlobalStyles.flex_common_row ] }
							>
								<Image style={ {
									width : pxToDp ( 44 ) ,
									height : pxToDp ( 44 ) ,
									marginRight : pxToDp ( 38 )
								} }
								       source={  require ( "../assets/images/selted_cart.png" ) }/>
							</View>


							<View style={ {
								width : width , height : pxToDp ( 240 ) , flexDirection : 'row' ,
								justifyContent : 'flex-start' ,
								alignItems : 'center' , borderColor : '#e5e5e5' , borderBottomWidth : 0.5
							} }>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => ViewUtils.goGoodsDetail ( this.props.navigation , suit_detail.base_data.gid ) }
									style={ { width : pxToDp ( 180 ) , height : pxToDp ( 180 ) , } }>
									{ ViewUtils.getSldImg ( 180 , 180 , { uri : suit_detail.base_data.goods_image_url } ) }
								</TouchableOpacity>

								<View style={ {
									width : pxToDp ( 390 ) ,
									marginLeft : pxToDp ( 30 ) ,
									height : pxToDp ( 180 ) ,
									flexDirection : 'column' ,
									justifyContent : 'space-between' ,
									alignItems : 'flex-start'
								} }>
									<Text numberOfLines={ 1 } style={ {
										color : '#181818' ,
										fontSize : pxToDp ( 28 ) ,
										fontWeight : "400"
									} }>{suit_detail.base_data.goods_name}</Text>
									<Text numberOfLines={ 1 } style={ {
										color : "#747474" ,
										fontWeight : '300' ,
										fontSize : pxToDp ( 24 ) ,
										marginTop : pxToDp ( 16 )
									} }>{suit_detail.base_data.goods_jingle}</Text>
									<View style={ {
										flexDirection : 'row' ,
										justifyContent : 'space-between' ,
										alignItems : 'flex-end' ,
										marginTop : pxToDp ( 20 ) ,
										width : '100%'
									} }>
										<Text style={ { color : main_color , fontSize : pxToDp ( 32 ) , fontWeight : '300' } }>ks{PriceUtil.formatPrice(suit_detail.base_data.show_price)}</Text>

										<View style={ styles.spectitle }>
											<TouchableOpacity activeOpacity={ 1 }
											                  onPress={ () => this.editNum ( 'base',0,'minus' ) }>
												<View style={ [ styles.common_layout , { borderRightWidth : 0.5 , borderColor : '#666' } ] }>

													<Text
														style={ [ GlobalStyles.sld_global_font , { color : '#666' } ] }>-</Text>

												</View>
											</TouchableOpacity>

											<View style={ [ styles.common_layout , { borderRightWidth : 0.5 , borderColor : '#666' } ] }><Text
												style={ [ GlobalStyles.sld_global_font , { color : '#666' } ] }>{suit_detail.base_data.sele_num}</Text></View>
											<TouchableOpacity activeOpacity={ 1 }
											                  onPress={ () => this.editNum ( 'base',0,'plus' ) }>
												<View style={ styles.common_layout }>
													<Text
														style={ [ GlobalStyles.sld_global_font , { color : '#666' } ] }>+</Text>
												</View>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</View>

						{
							suit_detail.goods_list.map((item,index)=>{
								return (<View key={index} style={ {
									flexDirection : 'row' ,
									justifyContent : 'flex-start' ,
									alignItems : 'center' ,
									width : '100%' ,
									paddingLeft : 15 ,
									paddingRight : 15 ,
									backgroundColor : '#fff' ,
									height : pxToDp ( 240 )
								} }>
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => this.handleSele (index) }
										style={ [ { height : pxToDp ( 180 ) } , GlobalStyles.flex_common_row ] }
									>
										<Image style={ {
											width : pxToDp ( 44 ) ,
											height : pxToDp ( 44 ) ,
											marginRight : pxToDp ( 38 )
										} }
										       source={ item.is_sele == true ? require ( "../assets/images/selted_cart.png" ) : require ( "../assets/images/selt_cart.png" ) }/>
									</TouchableOpacity>


									<View style={ {
										width : width , height : pxToDp ( 240 ) , flexDirection : 'row' ,
										justifyContent : 'flex-start' ,
										alignItems : 'center' , borderColor : '#e5e5e5' , borderBottomWidth : 0.5
									} }>
										<TouchableOpacity
											activeOpacity={ 1 }
											onPress={ () => ViewUtils.goGoodsDetail ( this.props.navigation , item.gid ) }
											style={ { width : pxToDp ( 180 ) , height : pxToDp ( 180 ) , } }>
											{ ViewUtils.getSldImg ( 180 , 180 , { uri : item.goods_image_url } ) }
										</TouchableOpacity>

										<View style={ {
											width : pxToDp ( 390 ) ,
											marginLeft : pxToDp ( 30 ) ,
											height : pxToDp ( 180 ) ,
											flexDirection : 'column' ,
											justifyContent : 'space-between' ,
											alignItems : 'flex-start'
										} }>
											<Text numberOfLines={ 1 } style={ {
												color : '#181818' ,
												fontSize : pxToDp ( 28 ) ,
												fontWeight : "400"
											} }>{item.goods_name}</Text>
											<Text numberOfLines={ 1 } style={ {
												color : "#747474" ,
												fontWeight : '300' ,
												fontSize : pxToDp ( 24 ) ,
												marginTop : pxToDp ( 16 )
											} }>{item.goods_jingle}</Text>
											<View style={ {
												flexDirection : 'row' ,
												justifyContent : 'space-between' ,
												alignItems : 'flex-end' ,
												marginTop : pxToDp ( 20 ) ,
												width : '100%'
											} }>
												<Text style={ { color : main_color , fontSize : pxToDp ( 32 ) , fontWeight : '300' } }>ks{PriceUtil.formatPrice(item.show_price)}</Text>

												<View style={ styles.spectitle }>
													<TouchableOpacity activeOpacity={ 1 }
													                  onPress={ () => this.editNum ('goods',index, 'minus' ) }>
														<View style={ [ styles.common_layout , { borderRightWidth : 0.5 , borderColor : '#666' } ] }>

															<Text
																style={ [ GlobalStyles.sld_global_font , { color : '#666' } ] }>-</Text>

														</View>
													</TouchableOpacity>

													<View style={ [ styles.common_layout , { borderRightWidth : 0.5 , borderColor : '#666' } ] }><Text
														style={ [ GlobalStyles.sld_global_font , { color : '#666' } ] }>{item.sele_num}</Text></View>
													<TouchableOpacity activeOpacity={ 1 }
													                  onPress={ () => this.editNum ( 'goods',index,'plus' ) }>
														<View style={ styles.common_layout }>
															<Text
																style={ [ GlobalStyles.sld_global_font , { color : '#666' } ] }>+</Text>
														</View>
													</TouchableOpacity>
												</View>
											</View>
										</View>
									</View>
								</View>)
							})

						}
						{suit_other_data.goods_list!=undefined&&suit_other_data.goods_list.length>0&&
						<Fragment>
							<View style={ GlobalStyles.space_shi_separate }/>
							<View style={ {
								width : width ,
								flexDirection : 'column' ,
								backgroundColor : '#fff' ,
								paddingLeft : 15 ,
								paddingRight : 15
							} }>
								<View style={ {
									width : '100%' ,
									flexDirection : 'row' ,
									justifyContent : 'flex-start' ,
									alignItems : 'center' ,
									height : pxToDp ( 96 ) ,
									borderBottomWidth : 0.5 ,
									borderColor : '#DADADA' ,
									paddingLeft : 15
								} }><Text
									style={ { color : '#353535' , fontWeight : '300' , fontSize : pxToDp ( 32 ) } }>{I18n.t('GoodsSuit.othercombination')}</Text></View>

								<View style={ { marginTop : 15 , marginBottom : 15 } }>


									{
										suit_other_data.goods_list.map((item, index) => {
											return (
												<View key={index}>
													<View style={{width:'100%',height:pxToDp(130),flexDirection:'row',justifyContent:'flex-start'}}>
														<View style={{width:width-30-pxToDp(220)}}>
															<ScrollView horizontal={true}>
																<View style={{flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap'}}>
																	{
																		item.goods.map((items, indexs) => {
																			return (
																				<View key={indexs} style={{flexDirection:'row'}}>
																					<TouchableOpacity
																						activeOpacity={ 1 }
																						onPress={()=>ViewUtils.goGoodsDetail(this.props.navigation,items.id)}
																						style={{width:pxToDp(130),height:pxToDp(130),borderWidth:0.5,borderColor:'#F1F1F1'}}>
																						{ ViewUtils.getSldImg ( 130 , 130 , { uri : items.goods_image_url} ) }
																						<View style={{width:pxToDp(130),height:pxToDp(23),flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#999999',position:"absolute",bottom:0,left:0,right:0,}}>
																							<Text style={{color:'#fff',fontWeight:'300',fontSize:pxToDp(16)}}>ks{PriceUtil.formatPrice(items.show_price)}</Text>
																						</View>
																					</TouchableOpacity>
																					{indexs != (item.goods.length-1)&&(
																						<View style={{flexDirection:'row',height:pxToDp(130),width:pxToDp(36),justifyContent:'center',alignItems:'center'}}>
																							<Text style={{color:'#929292',fontSize:pxToDp(40)}}>+</Text>
																						</View>
																					)}
																				</View>
																			)
																		})
																	}
																</View>

															</ScrollView>
														</View>
														<TouchableOpacity
															activeOpacity={ 1 }
															onPress={()=>this.props.navigation.push('GoodsSuit',{gids:item.gids,gid:gid})}
															style={{width:pxToDp(220),position:'absolute',top:0,right:0,bottom:0,height:pxToDp(130),flexDirection:"column",justifyContent:"center",alignItems:'flex-end'}}>
															<View style={{flexDirection:'row',alignItems:'baseline'}}>
																<Text style={{color:'#353535',fontSize:pxToDp(24),fontWeight:'300'}}>{I18n.t('GoodsSuit.Combinationprice')}</Text>
																<Text style={{color:'#F41919',fontSize:pxToDp(24),fontWeight:'400',marginLeft:pxToDp(5)}}>ks{PriceUtil.formatPrice(item.total_price)}</Text>
															</View>
															<View style={{borderColor:'#F44A40',backgroundColor:'#fff',borderWidth:1,width:pxToDp(120),height:pxToDp(30),borderRadius:pxToDp(20),flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:pxToDp(20)}}>
																<Text style={{color:'#F44A40',fontSize:pxToDp(20),fontWeight:'300'}}>{I18n.t('GoodsSuit.Buynow')}</Text>
															</View>
														</TouchableOpacity>
													</View>
													{index!=(suit_other_data.goods_list.length-1)&&(
														<View style={GlobalStyles.leftline}/>
													)}
												</View>
											)
										})
									}

								</View>


							</View>
						</Fragment>
						}

					</View>
				</ScrollView>
				}
				<View style={ GlobalStyles.space_shi_separate }/>
				<View style={ {
					position : 'absolute' ,
					bottom : 0 ,
					left : 0 ,
					right : 0 ,
					height : pxToDp ( 100 ) ,
					width : width ,
					zIndex : 2 ,
					flexDirection : 'row' ,
					alignItems : 'center' ,
					backgroundColor : '#fff' ,
					borderTopWidth : 0.5 ,
					borderColor : '#e5e5e5'
				} }>
					<View style={ [ {
						width : width - pxToDp ( 293 ) ,
						justifyContent : 'flex-start' ,
						flexDirection : "row" ,
						alignItems : 'center' ,
						paddingLeft : 15
					} ] }>
						<Text style={ [ { color : '#181818' , fontSize : pxToDp ( 32 ) , } ] }>{I18n.t('GoodsSuit.Handle')}:</Text>
						<Text style={ { color : main_color , fontSize : pxToDp ( 32 ) , } }>ks{PriceUtil.formatPrice(ViewUtils.formatFloat(total_price,2))}</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={ () => this.goBuy () }
						style={ [ {
							width : pxToDp ( 293 ) ,
							height : pxToDp ( 100 ) ,
							backgroundColor : main_color
						} , GlobalStyles.flex_common_row ] }>
						<Text style={ { color : '#fff' , fontSize : pxToDp ( 34 ) , } }>{I18n.t('GoodsSuit.payimmediately')}</Text>
					</TouchableOpacity>
				</View>

			</View>
		)
	}
}
const styles = StyleSheet.create ( {
	spectitle : {
		flexDirection : 'row' ,
		height : pxToDp ( 60 ) ,
		borderWidth : 0.5 ,
		borderColor : '#666' ,
		borderRadius : pxToDp(8) ,
		width : pxToDp(222) ,
		marginTop : pxToDp(30),
	} ,
	common_layout_text : {
		color : '#666' ,
		fontSize : 17 ,
	} ,
	common_layout : {
		flexDirection : 'row' ,
		alignItems : 'center' ,
		justifyContent : 'center' ,
		width : pxToDp(74) ,
		height : pxToDp ( 59 )
	} ,
} );
