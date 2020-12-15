/*
 * 优惠套装详细页面
 * @slodon
 * */
import React, {Component, Fragment} from 'react';
import {
	StyleSheet , Text , TouchableOpacity , View ,ScrollView,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import PriceUtil from '../util/PriceUtil'

var Dimensions = require ( 'Dimensions' );
const {width,height} = Dimensions.get ( 'window' );
import {I18n} from './../lang/index'


export default class GoodsBundling extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title:props.navigation.state.params.title,
			bl_id:props.navigation.state.params.bl_id,
			gid:props.navigation.state.params.gid,
			bunding_detail:{},//优惠套装详情
			bunding_other_data:[],//其他套装
		}
	}

	componentWillMount () {
		this.getBundingDetail();
		this.getOtherBunding();
	}

	//获取优惠套装详情
	getBundingDetail = () => {
		const {bl_id} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getBundlingData&key=' + key+'&bl_id='+bl_id)
			.then(result => {
				if (result.datas.error_flag == false) {
					this.setState({
						bunding_detail:result.datas
					});
				} else {
					ViewUtils.sldToastTip(result.datas.error_msg);
					let _this = this;
					setTimeout(function(){
						_this.props.navigation.goBack();
					},2000);
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//获取其他优惠套装
	getOtherBunding = () => {
		const {bl_id,gid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getBundlingOtherData&key=' + key+'&bl_id='+bl_id+'&gid='+gid)
			.then(result => {
				if (result.datas) {
					this.setState({
						bunding_other_data:result.datas
					});
				} else {
					ViewUtils.sldToastTip(I18n.t('GoodsBundling.text1'));
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//立即购买
	goBuy = () => {
		this.props.navigation.navigate('ConfirmOrder',{'bl_id':this.state.bl_id});
	}

	render () {
		let { title,bunding_detail,bunding_other_data,gid } = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>
				{typeof (bunding_detail.base_data)!='undefined'&&typeof (bunding_other_data.b_goods_array)!='undefined'&&
				<ScrollView>

					<View style={{flexDirection:'column',width:width,}}>
						<View style={{width:'100%',height:pxToDp(98),flexDirection:"row",justifyContent:'flex-start',alignItems:'center',backgroundColor:'#fff',paddingLeft:15,paddingRight:15}}>
							<Text style={{color:'#353535',fontSize:pxToDp(32),fontWeight:'400'}}>{I18n.t('GoodsBundling.Offerset')}</Text>
							<Text style={{color:main_color,fontWeight:'400',fontSize:pxToDp(32),marginLeft:pxToDp(19)}}>ks {PriceUtil.formatPrice(bunding_detail.base_data.bl_discount_price)}</Text>
							<View style={{borderColor:main_color,borderWidth:1,marginLeft:pxToDp(30),borderRadius:pxToDp(6)}}><Text style={{color:main_color,fontWeight:'300',paddingLeft:pxToDp(13),paddingRight:pxToDp(13),paddingTop:pxToDp(4),paddingBottom:pxToDp(4),fontSize:pxToDp(20)}}>{I18n.t('GoodsBundling.Offerset')}:ks{PriceUtil.formatPrice(bunding_detail.base_data.sheng_price)}</Text></View>
						</View>
						<View style={GlobalStyles.line}/>

						{
							bunding_detail.goods_list.map((item,index)=>{
								return (
									<View>
										<View style={{width:'100%',backgroundColor:'#fff',height:pxToDp(220),flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:15,paddingRight:15,borderBottomWidth:index==(bunding_detail.goods_list.length-1)?0:0.5,borderColor:'#DADADA'}}>

											<TouchableOpacity
												activeOpacity={ 1 }
												onPress={()=>ViewUtils.goGoodsDetail(this.props.navigation,item.id)}
												style={{width:pxToDp(160),height:pxToDp(160),borderWidth:1,borderColor:'#e5e5e5'}}>
												{ ViewUtils.getSldImg ( 160 , 160 , { uri : item.goods_image_url} ) }
											</TouchableOpacity>


											<TouchableOpacity
												activeOpacity={ 1 }
												onPress={()=>ViewUtils.goGoodsDetail(this.props.navigation,item.gid)}
												style={{marginLeft:pxToDp(35),flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start',width:pxToDp(388),height:pxToDp(160),}}>

												<View style={{height:pxToDp(75),flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start',}}>
													<Text numberOfLines={1} style={{color:'#181818',fontSize:pxToDp(28),fontWeight:"400"}}>{item.goods_name}</Text>
													<Text numberOfLines={1} style={{color:"#747474",fontWeight:'300',fontSize:pxToDp(24)}}>{item.goods_jingle}</Text>
												</View>
												<View style={{flexDirection:"row",justifyContent:'flex-start',alignItems:'center'}}>
													<Text style={{color:'#747474',fontSize:pxToDp(24),fontWeight:'300'}}>ks{PriceUtil.formatPrice(item.bl_goods_price)}</Text>
													<Text style={{textDecorationLine:'line-through',color:'#747474',fontSize:pxToDp(24),fontWeight:'300',marginLeft:pxToDp(15)}}>ks{PriceUtil.formatPrice(item.goods_price)}</Text>
												</View>

											</TouchableOpacity>

											<View style={{height:pxToDp(160),flexDirection:'row',justifyContent:'flex-end',alignItems:'flex-start'}}>
												<Text style={{color:'#181818',fontWeight:'300',fontSize:pxToDp(28),marginLeft:pxToDp(70)}}>X1</Text>
											</View>

										</View>
									</View>
								)
							})
						}


						{bunding_other_data.bundling_array.length>0&&
						<Fragment>
							<View style={GlobalStyles.space_shi_separate} />
							<View style={{width:width,flexDirection:'column',backgroundColor:'#fff',paddingLeft:15,paddingRight:15}}>
								<View style={{width:'100%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:pxToDp(96),borderBottomWidth:0.5,borderColor:'#DADADA',paddingLeft:15}}><Text style={{color:'#353535',fontWeight:'300',fontSize:pxToDp(32)}}>{I18n.t('GoodsBundling.Othersuits')}</Text></View>

								<View style={{marginTop:15,marginBottom:15}}>
									{
										bunding_other_data.bundling_array.map((item, index) => {
											return (
												<View  key={index}>
													<View style={{width:'100%',height:pxToDp(130),flexDirection:'row',justifyContent:'flex-start'}}>
														<View style={{width:width-30-pxToDp(220)}}>
															<ScrollView horizontal={true}>
																<View style={{flexDirection:'row',justifyContent:'flex-start',flexWrap:'wrap'}}>
																	{
																		bunding_other_data.b_goods_array[item.id].map((items, indexs) => {
																			return (
																				<View key={indexs} style={{flexDirection:'row'}}>
																					<TouchableOpacity
																						activeOpacity={ 1 }
																						onPress={()=>ViewUtils.goGoodsDetail(this.props.navigation,items.id)}
																						style={{width:pxToDp(130),height:pxToDp(130),borderWidth:1,borderColor:'#e5e5e5'}}>
																						{ ViewUtils.getSldImg ( 130 , 130 , { uri : items.image} ) }
																					</TouchableOpacity>
																					{indexs != (bunding_other_data.b_goods_array[item.id].length-1)&&(
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
															onPress={()=>{
																this.props.navigation.push('GoodsBundling',{'bl_id':item.id,'gid':gid,'title':item.name})
															}}
															style={{width:pxToDp(220),position:'absolute',top:0,right:0,bottom:0,height:pxToDp(130),flexDirection:"column",justifyContent:"center",alignItems:'flex-end'}}>
															<View style={{flexDirection:'row',alignItems:'baseline'}}>
																<Text style={{color:'#353535',fontSize:pxToDp(24),fontWeight:'300'}}>{I18n.t('GoodsBundling.Packageprice')}</Text>
																<Text style={{color:'#F41919',fontSize:pxToDp(24),fontWeight:'400',marginLeft:pxToDp(5)}}>ks{PriceUtil.formatPrice(item.price)}</Text>
															</View>
															<View style={{borderColor:'#FF0000',borderWidth:0.5,paddingLeft:pxToDp(13),paddingRight:pxToDp(13),paddingTop:pxToDp(4),paddingBottom:pxToDp(4),borderRadius:pxToDp(6),marginTop:pxToDp(10)}}>
																<Text style={{color:'#F41919',fontSize:pxToDp(20),fontWeight:'300'}}>{I18n.t('GoodsBundling.Province')}:ks{PriceUtil.formatPrice(item.cost_price - item.price)}</Text>
															</View>
															<View style={{borderColor:'#F44A40',backgroundColor:'#F44A40',borderWidth:1,width:pxToDp(120),height:pxToDp(30),borderRadius:pxToDp(20),flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:pxToDp(10)}}>
																<Text style={{color:'#fff',fontSize:pxToDp(20),fontWeight:'300'}}>{I18n.t('GoodsBundling.Buynow')}</Text>
															</View>
														</TouchableOpacity>
													</View>
													{index!=(bunding_other_data.bundling_count-1)&&(
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
				<View style={GlobalStyles.space_shi_separate} />
				<View style={{position:'absolute',bottom:0,left:0,right:0,height:pxToDp(100),width:width,zIndex:2,flexDirection:'row',alignItems:'center',backgroundColor:'#fff',borderTopWidth:0.5,borderColor:'#e5e5e5'}}>
					<View style={[{width:width-pxToDp(293),justifyContent:'flex-start',flexDirection:"row",alignItems:'center',paddingLeft:15}]}>
						<Text style={[{color:'#181818',fontSize:pxToDp(32),}]}>{I18n.t('GoodsBundling.Handle')}:</Text>
						<Text style={{color:main_color,fontSize:pxToDp(32),}}>Ks{typeof (bunding_detail.base_data)!='undefined'?PriceUtil.formatPrice(ViewUtils.formatFloat(bunding_detail.base_data.bl_discount_price,2)):0}</Text>
					</View>
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={()=>this.goBuy()}
						style={[{width:pxToDp(293),height:pxToDp(100),backgroundColor:main_color},GlobalStyles.flex_common_row]}>
						<Text style={{color:'#fff',fontSize:pxToDp(34),}}>{I18n.t('GoodsBundling.payimmediately')}</Text>
					</TouchableOpacity>
				</View>

			</View>
		)
	}
}
const styles = StyleSheet.create ( {

} );
