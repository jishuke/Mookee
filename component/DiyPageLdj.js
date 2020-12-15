import React , { Component } from 'react';
import {
	Image ,
	ScrollView ,
	StyleSheet ,
	Text ,
	TouchableOpacity ,
	View ,
	WebView ,
	ImageBackground , Platform
} from 'react-native';
import GlobalStyles from "../assets/styles/GlobalStyles";
import pxToDp from "../util/pxToDp";
import TimeCountDown from "./TimeCountDown";
import ViewUtils from "../util/ViewUtils";
import Swiper from 'react-native-swiper';
import MarqueeLabel from 'react-native-lahk-marquee-label';
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

var Dimensions = require ( 'Dimensions' );
const { width , height } = Dimensions.get ( 'window' );
let thisWebView = null;
export default class DiyPageLdj extends Component {

	constructor ( props ) {
		super ( props )
		this.state = {
			diy_data : this.props.data ,
			webViewHeight : 0 ,
			webViewHeightIos : 0 ,
			flag : false ,
			state : false ,
		}
	}

	componentWillMount () {

	}

	_onMessage = ( e ) => {
		let message = e.nativeEvent.data;
		let defWebViewHeight = message * 1;
		if ( defWebViewHeight != this.state.webViewHeight ) this.setState ( { webViewHeight : defWebViewHeight } );
	};
	_onMessageIos = ( e ) => {
		let message = e.nativeEvent.data;
		let res = JSON.parse ( message );
		switch ( res.type ) {
			case "auto_height":
				this.setState ( {
					webViewHeightIos : parseInt ( res.height )
				} );
				break;
			case "open_img":
				break;
		}
	};

	_onLoadEnd = () => {
		const script = `window.postMessage(document.body.scrollHeight)`;
		thisWebView && thisWebView.injectJavaScript ( script );
	}


	render () {
		const { diy_data } = this.state;
		const { navigation } = this.props;
		const _w = width;
		const _h = this.state.webViewHeight == 0 ? 1 : this.state.webViewHeight;
		const _h_ios = this.state.webViewHeightIos;
		return ( <View>
				{ /*团购活动模版--start*/ }
				{ diy_data.type == 'huodong' && diy_data.sele_style == 2 && diy_data.data.bottom.mid[ 2 ].goods_info != null && (
					<View style={ { flexDirection : 'column' } }>
						<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
							this.props.navigation.navigate ( 'TuanGou' );
						} }>
							<ImageBackground
								style={ {
									width : width ,
									height : pxToDp ( 77 ) ,
									justifyContent : "flex-start" ,
									alignItems : 'center' ,
									flexDirection : 'row'
								} } source={ require ( "../assets/images/sld_home_tuan_title.jpg" ) } resizeMode="stretch">
								<Text style={ {
									color : '#C88B54' ,
									fontSize : pxToDp ( 20 ) ,
									paddingLeft : pxToDp ( 179 )
								} }>{ diy_data.data.top.top[ 0 ].title }</Text>
							</ImageBackground>
						</TouchableOpacity>
						{ diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].extend_data == null && (
							<View style={ {
								flexDirection : 'row' ,
								alignItems : 'center' ,
								justifyContent : 'center' ,
								flexWrap : 'wrap' ,
								width : '100%' ,
								paddingLeft : pxToDp ( 30 ) ,
								paddingRight : pxToDp ( 30 ) ,
								borderRightWidth : 0.5 ,
								borderColor : '#D5D5D5' ,
							} }>
								<Text style={ { color : '#999' , fontSize : pxToDp ( 24 ) } }>{I18n.t('com_DiyPage.text1')}</Text></View>
						) }
						{ diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].extend_data != null && (
							<TouchableOpacity activeOpacity={ 1 }
							                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].gid ) }
							>
								<ImageBackground
									style={ {
										width : width ,
										height : pxToDp ( 337 ) ,
										padding : pxToDp ( 14 ) ,
										justifyContent : "center" ,
										alignItems : 'center' ,
										flexDirection : 'row'
									} } source={ require ( "../assets/images/sld_hoe_tuan_bg.jpg" ) } resizeMode="stretch">


									<View style={ { borderWidth : 0.5 , borderColor : '#EBEBEB' } }>
										{ ViewUtils.getSldImg ( 242 , 242 , { uri : diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].goods_image } ) }
									</View>
									<View style={ {
										width : pxToDp ( 353 ) ,
										flexDirection : 'column' ,
										justifyContent : 'flex-start' ,
										alignItems : 'center' ,
										marginLeft : pxToDp ( 22 )
									} }>
										<View style={ {
											width : '100%' ,
											flexDirection : 'row' ,
											justifyContent : "flex-start" ,
											alignItems : 'center'
										} }>
											<Text style={ {
												color : '#DF1858' ,
												fontSize : pxToDp ( 24 ) ,
												fontWeight : '400' ,
												marginRight : pxToDp ( 20 )
											} }>{I18n.t('com_DiyPage.From_the_end_of_the')}</Text>
											<TimeCountDown
												enddate={ ( diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].extend_data.end_time ) * 1000 }
												seg_color={ '#D94279' }/>


										</View>

										<Text numberOfLines={ 2 } style={ {
											color : "#4F4F4F" ,
											fontSize : pxToDp ( 20 ) ,
											fontWeight : '300' ,
											width : '100%' ,
											marginTop : pxToDp ( 22 ) ,
											lineHeight : pxToDp ( 30 )
										} }>{ diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].goods_name }</Text>

										<View style={ {
											width : '100%' ,
											flexDirection : 'row' ,
											justifyContent : 'flex-start' ,
											alignItems : 'flex-end' ,
											marginTop : pxToDp ( 22 )
										} }>
											<Text style={ { color : '#FF1717' , fontSize : pxToDp ( 20 ) } }>Ks</Text>
											<Text style={ {
												color : '#FF1717' ,
												fontSize : pxToDp ( 32 ) ,
												marginLeft : pxToDp ( 13 ) ,
												fontWeight : '700' ,
												marginBottom : -pxToDp ( 5 )
											} }>{ PriceUtil.formatPrice(diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].promotion_price) }</Text>
											<Text style={ {
												color : '#808080' ,
												fontSize : pxToDp ( 22 ) ,
												fontWeight : '300' ,
												marginLeft : pxToDp ( 17 ) ,
												textDecorationLine : 'line-through'
											} }>ks{PriceUtil.formatPrice( diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].goods_marketprice )}</Text>
										</View>
										<View style={ {
											width : '100%' ,
											flexDirection : 'row' ,
											justifyContent : 'space-between' ,
											marginTop : pxToDp ( 22 )
										} }>
											<Text style={ {
												color : '#808080' ,
												fontSize : pxToDp ( 20 )
											} }>{I18n.t('com_DiyPage.Have_group')}{ diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].extend_data.buyed_quantity }{I18n.t('com_DiyPage.piece')}</Text>
											<View style={ [ GlobalStyles.flex_common_row , {
												backgroundColor : '#F4206D' ,
												width : pxToDp ( 117 ) ,
												height : pxToDp ( 36 ) ,
												borderRadius : pxToDp ( 18 )
											} ] }>
												<Text style={ {
													color : '#fff' ,
													fontSize : pxToDp ( 20 ) ,
													marginRight : pxToDp ( 3 )
												} }>{I18n.t('com_DiyPage.Immediately_regiment')}</Text>
												{ ViewUtils.getSldImg ( 15 , 15 , require ( "../assets/images/sld_right_arrow_white.png" ) ) }
											</View>
										</View>
									</View>
								</ImageBackground>
							</TouchableOpacity>
						) }

					</View>
				) }
				{ /*团购活动模版--end*/ }


				{ /*限时活动模版--start*/ }
				{ ( diy_data.type == 'huodong' && diy_data.sele_style == 1 &&diy_data.data.bottom!=undefined&& diy_data.data.bottom.left[ 1 ].goods_info != null && diy_data.data.bottom.mid[ 2 ].goods_info != null && diy_data.data.bottom.right[ 3 ].goods_info != null ) && (
					<View style={ { flexDirection : 'column' } }>
						<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
							this.props.navigation.navigate ( 'XianShiZheKou' );

						} }>
							<ImageBackground
								style={ {
									width : width ,
									height : pxToDp ( 77 ) ,
									justifyContent : "flex-start" ,
									alignItems : 'center' ,
									flexDirection : 'row'
								} } source={ require ( "../assets/images/sld_home_xianshi_title.jpg" ) } resizeMode="stretch">
								<Text style={ {
									color : '#C88B54' ,
									fontSize : pxToDp ( 20 ) ,
									paddingLeft : pxToDp ( 248 )
								} }>{ diy_data.data.top.top[ 0 ].title }</Text>
							</ImageBackground>

						</TouchableOpacity>

						<View style={ GlobalStyles.line }/>
						<TouchableOpacity activeOpacity={ 1 }
						                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , diy_data.data.bottom.left[ 1 ].gid ) }
						>
							<View style={ { flexDirection : 'row' , width : width , height : pxToDp ( 390 ) } }>
								{ typeof ( diy_data.data.bottom.left[ 1 ].goods_info[ 0 ].end_time ) == 'undefined' && (
									<View style={ {
										flexDirection : 'row' ,
										alignItems : 'center' ,
										justifyContent : 'center' ,
										flexWrap : 'wrap' ,
										width : Math.floor ( ( width - 1 ) / 3 ) ,
										paddingLeft : pxToDp ( 30 ) ,
										paddingRight : pxToDp ( 30 ) ,
										borderRightWidth : 0.5 ,
										borderColor : '#D5D5D5' ,
									} }>
										<Text style={ { color : '#999' , fontSize : pxToDp ( 24 ) } }>未获取到商品的活动信息,请重新添加商品</Text></View>
								) }
								{ typeof ( diy_data.data.bottom.left[ 1 ].goods_info[ 0 ].end_time ) != 'undefined' && (
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => ViewUtils.goGoodsDetail ( navigation , diy_data.data.bottom.left[ 1 ].gid ) }
										style={ {
											width : Math.floor ( ( width - 1 ) / 3 ) ,
											flexDirection : 'column' ,
											borderRightWidth : 0.5 ,
											borderColor : '#D5D5D5' ,
											justifyContent : 'center' ,
											alignItems : 'center' ,
											padding : pxToDp ( 28 ) ,
											paddingTop : pxToDp ( 35 )
										} }>
										<Text style={ {
											color : '#4C50E2' ,
											fontSize : pxToDp ( 28 )
										} }>{ diy_data.data.bottom.left[ 1 ].title }</Text>
										<Text style={ {
											color : '#818181' ,
											fontSize : pxToDp ( 18 ) ,
											marginTop : pxToDp ( 8 )
										} }>{ diy_data.data.bottom.left[ 1 ].subtitle }</Text>
										<View
											style={ { flexDirection : 'row' , marginTop : pxToDp ( 10 ) , marginBottom : pxToDp ( 10 ) } }>
											<TimeCountDown
												bgColor={ '#656565' } time_color={ '#fff' } time_size={ 20 } bg_width={ 36 } bg_height={ 26 }
												seg_color={ '#656565' } seg_size={ 22 }
												enddate={ ( diy_data.data.bottom.left[ 1 ].goods_info[ 0 ].end_time ) * 1000 }/>

										</View>
										{ ViewUtils.getSldImg ( 189 , 189 , { uri : diy_data.data.bottom.left[ 1 ].goods_info[ 0 ].goods_image } ) }

										<View style={ {
											width : '100%' ,
											flexDirection : 'row' ,
											justifyContent : 'space-between' ,
											alignItems : 'center'
										} }>
											<View style={ {
												width : '100%' ,
												flexDirection : 'row' ,
												justifyContent : 'space-between' ,
												marginTop : pxToDp ( 5 )
											} }>
												<View
													style={ { flexDirection : 'row' , justifyContent : 'flex-start' , alignItems : 'center' } }>
													<Text style={ { color : '#FF1717' , fontSize : pxToDp ( 20 ) } }>Ks</Text>
													<Text style={ {
														color : '#FF1717' ,
														fontSize : pxToDp ( 32 ) ,
														fontWeight : '700' ,
														marginBottom : -pxToDp ( 5 )
													} }>{ PriceUtil.formatPrice(diy_data.data.bottom.left[ 1 ].goods_info[ 0 ].promotion_price) }</Text>
												</View>
												<View style={ [ GlobalStyles.flex_common_row , {
													backgroundColor : '#FF1717' ,
													width : pxToDp ( 36 ) ,
													height : pxToDp ( 36 ) ,
													borderRadius : pxToDp ( 18 )
												} ] }>
													<Text style={ { color : '#fff' , fontSize : pxToDp ( 20 ) } }>抢</Text>
												</View>
											</View>
										</View>
										<View
											style={ [ GlobalStyles.flex_common_row , { justifyContent : 'flex-start' , width : '100%' } ] }>
											<Text style={ {
												color : '#ADADAD' ,
												fontSize : pxToDp ( 18 ) ,
												textDecorationLine : 'line-through'
											} }>ks{PriceUtil.formatPrice( diy_data.data.bottom.left[ 1 ].goods_info[ 0 ].goods_marketprice )}</Text>
										</View>


									</TouchableOpacity>
								) }

								{ typeof ( diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].end_time ) == 'undefined' && (
									<View style={ {
										flexDirection : 'row' ,
										alignItems : 'center' ,
										justifyContent : 'center' ,
										flexWrap : 'wrap' ,
										width : Math.floor ( ( width - 1 ) / 3 ) ,
										paddingLeft : pxToDp ( 30 ) ,
										paddingRight : pxToDp ( 30 ) ,
										borderRightWidth : 0.5 ,
										borderColor : '#D5D5D5' ,
									} }>
										<Text style={ { color : '#999' , fontSize : pxToDp ( 24 ) } }>未获取到商品的活动信息,请重新添加商品</Text></View>
								) }
								{ typeof ( diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].end_time ) != 'undefined' && (
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => ViewUtils.goGoodsDetail ( navigation , diy_data.data.bottom.mid[ 2 ].gid ) }
										style={ {
											flex : 1 ,
											flexDirection : 'column' ,
											borderRightWidth : 0.5 ,
											borderColor : '#D5D5D5' ,
											justifyContent : 'center' ,
											alignItems : 'center' ,
											padding : pxToDp ( 28 ) ,
											paddingTop : pxToDp ( 35 )
										} }>
										<Text style={ {
											color : '#4C50E2' ,
											fontSize : pxToDp ( 28 )
										} }>{ diy_data.data.bottom.mid[ 2 ].title }</Text>
										<Text style={ {
											color : '#818181' ,
											fontSize : pxToDp ( 18 ) ,
											marginTop : pxToDp ( 8 )
										} }>{ diy_data.data.bottom.mid[ 2 ].subtitle }</Text>
										<View
											style={ { flexDirection : 'row' , marginTop : pxToDp ( 10 ) , marginBottom : pxToDp ( 10 ) } }>


											<TimeCountDown
												bgColor={ '#656565' } time_color={ '#fff' } time_size={ 20 } bg_width={ 36 } bg_height={ 26 }
												seg_color={ '#656565' } seg_size={ 22 }
												enddate={ ( diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].end_time ) * 1000 }/>
										</View>

										{ ViewUtils.getSldImg ( 189 , 189 , { uri : diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].goods_image } ) }

										<View style={ {
											width : '100%' ,
											flexDirection : 'row' ,
											justifyContent : 'space-between' ,
											alignItems : 'center'
										} }>
											<View style={ {
												width : '100%' ,
												flexDirection : 'row' ,
												justifyContent : 'space-between' ,
												marginTop : pxToDp ( 5 )
											} }>
												<View
													style={ { flexDirection : 'row' , justifyContent : 'flex-start' , alignItems : 'center' } }>
													<Text style={ { color : '#FF1717' , fontSize : pxToDp ( 20 ) } }>Ks</Text>
													<Text style={ {
														color : '#FF1717' ,
														fontSize : pxToDp ( 32 ) ,
														fontWeight : '700' ,
														marginBottom : -pxToDp ( 5 )
													} }>{ PriceUtil.formatPrice(diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].promotion_price) }</Text>
												</View>
												<View style={ [ GlobalStyles.flex_common_row , {
													backgroundColor : '#FF1717' ,
													width : pxToDp ( 36 ) ,
													height : pxToDp ( 36 ) ,
													borderRadius : pxToDp ( 18 )
												} ] }>
													<Text style={ { color : '#fff' , fontSize : pxToDp ( 20 ) } }>抢</Text>
												</View>
											</View>
										</View>
										<View
											style={ [ GlobalStyles.flex_common_row , { justifyContent : 'flex-start' , width : '100%' } ] }>
											<Text style={ {
												color : '#ADADAD' ,
												fontSize : pxToDp ( 18 ) ,
												textDecorationLine : 'line-through'
											} }>ks{PriceUtil.formatPrice( diy_data.data.bottom.mid[ 2 ].goods_info[ 0 ].goods_marketprice )}</Text>
										</View>


									</TouchableOpacity>
								) }
								{ typeof ( diy_data.data.bottom.right[ 3 ].goods_info[ 0 ].end_time ) == 'undefined' && (
									<View style={ {
										flexDirection : 'row' ,
										alignItems : 'center' ,
										justifyContent : 'center' ,
										flexWrap : 'wrap' ,
										width : Math.floor ( ( width - 1 ) / 3 ) ,
										paddingLeft : pxToDp ( 30 ) ,
										paddingRight : pxToDp ( 30 ) ,
										borderRightWidth : 0.5 ,
										borderColor : '#D5D5D5' ,
									} }>
										<Text style={ { color : '#999' , fontSize : pxToDp ( 24 ) } }>未获取到商品的活动信息,请重新添加商品</Text></View>
								) }
								{ typeof ( diy_data.data.bottom.right[ 3 ].goods_info[ 0 ].end_time ) != 'undefined' && (
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => ViewUtils.goGoodsDetail ( navigation , diy_data.data.bottom.right[ 3 ].gid ) }
										style={ {
											flex : 1 ,
											flexDirection : 'column' ,
											borderRightWidth : 0.5 ,
											borderColor : '#D5D5D5' ,
											justifyContent : 'center' ,
											alignItems : 'center' ,
											padding : pxToDp ( 28 ) ,
											paddingTop : pxToDp ( 35 )
										} }>
										<Text style={ {
											color : '#4C50E2' ,
											fontSize : pxToDp ( 28 )
										} }>{ diy_data.data.bottom.right[ 3 ].title }</Text>
										<Text style={ {
											color : '#818181' ,
											fontSize : pxToDp ( 18 ) ,
											marginTop : pxToDp ( 8 )
										} }>{ diy_data.data.bottom.right[ 3 ].subtitle }</Text>
										<View
											style={ { flexDirection : 'row' , marginTop : pxToDp ( 10 ) , marginBottom : pxToDp ( 10 ) } }>


											<TimeCountDown
												bgColor={ '#656565' } time_color={ '#fff' } time_size={ 20 } bg_width={ 36 } bg_height={ 26 }
												seg_color={ '#656565' } seg_size={ 22 }
												enddate={ diy_data.data.bottom.right[ 3 ].goods_info[ 0 ].end_time * 1000 }/>
										</View>

										{ ViewUtils.getSldImg ( 189 , 189 , { uri : diy_data.data.bottom.right[ 3 ].goods_info[ 0 ].goods_image } ) }

										<View style={ {
											width : '100%' ,
											flexDirection : 'row' ,
											justifyContent : 'space-between' ,
											alignItems : 'center'
										} }>
											<View style={ {
												width : '100%' ,
												flexDirection : 'row' ,
												justifyContent : 'space-between' ,
												marginTop : pxToDp ( 5 )
											} }>
												<View
													style={ { flexDirection : 'row' , justifyContent : 'flex-start' , alignItems : 'center' } }>
													<Text style={ { color : '#FF1717' , fontSize : pxToDp ( 20 ) } }>Ks</Text>
													<Text style={ {
														color : '#FF1717' ,
														fontSize : pxToDp ( 32 ) ,
														fontWeight : '700' ,
														marginBottom : -pxToDp ( 5 )
													} }>{ PriceUtil.formatPrice(diy_data.data.bottom.right[ 3 ].goods_info[ 0 ].promotion_price) }</Text>
												</View>
												<View style={ [ GlobalStyles.flex_common_row , {
													backgroundColor : '#FF1717' ,
													width : pxToDp ( 36 ) ,
													height : pxToDp ( 36 ) ,
													borderRadius : pxToDp ( 18 )
												} ] }>
													<Text style={ { color : '#fff' , fontSize : pxToDp ( 20 ) } }>抢</Text>
												</View>
											</View>
										</View>
										<View
											style={ [ GlobalStyles.flex_common_row , { justifyContent : 'flex-start' , width : '100%' } ] }>
											<Text style={ {
												color : '#ADADAD' ,
												fontSize : pxToDp ( 18 ) ,
												textDecorationLine : 'line-through'
											} }>ks{PriceUtil.formatPrice( diy_data.data.bottom.right[ 3 ].goods_info[ 0 ].goods_marketprice )}</Text>
										</View>


									</TouchableOpacity>
								) }

							</View>


						</TouchableOpacity>


						<View style={ GlobalStyles.line }/>

					</View>
				) }
				{ /*限时活动模版--end*/ }


				{ /*拼团活动模版--start*/ }
				{ diy_data.type == 'huodong' && diy_data.sele_style == 0 && diy_data.data.left.top[ 0 ].goods_info != null && diy_data.data.right.bottom[ 2 ].goods_info != null && diy_data.data.right.top[ 0 ].goods_info != null && (
					<View style={ { flexDirection : 'column' } }>
						<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
							this.props.navigation.navigate ( 'PinTuanHome' );

						} }>
							<ImageBackground
								style={ {
									width : width ,
									height : pxToDp ( 77 ) ,
									justifyContent : "flex-start" ,
									alignItems : 'center' ,
									flexDirection : 'row'
								} } source={ require ( "../assets/images/sld_home_pintuan_title.jpg" ) } resizeMode="stretch">
								<Text style={ {
									color : '#C88B54' ,
									fontSize : pxToDp ( 20 ) ,
									paddingLeft : pxToDp ( 179 )
								} }>{ diy_data.data.top.top[ 0 ].title }</Text>
							</ImageBackground>


						</TouchableOpacity>
						<View style={ { width : width , height : pxToDp ( 470 ) , flexDirection : 'row' } }>
							<TouchableOpacity activeOpacity={ 1 }
							                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , diy_data.data.left.top[ 0 ].goods_info.gid ) }>
								<ImageBackground
									style={ {
										width : pxToDp ( 298 ) ,
										height : pxToDp ( 470 ) ,
										padding : pxToDp ( 14 ) ,
										justifyContent : "center" ,
										alignItems : 'center' ,
										flexDirection : 'column'
									} } source={ require ( "../assets/images/sld_home_pintuan_bg.jpg" ) } resizeMode="stretch">
									{ diy_data.data.left.top[ 0 ].goods_info.extend_data == null && (
										<View style={ {
											flexDirection : 'row' ,
											alignItems : 'center' ,
											justifyContent : 'center' ,
											flexWrap : 'wrap' ,
											width : '100%' ,
											paddingLeft : pxToDp ( 30 ) ,
											paddingRight : pxToDp ( 30 ) ,
											borderRightWidth : 0.5 ,
											borderColor : '#D5D5D5' ,
										} }>
											<Text style={ { color : '#999' , fontSize : pxToDp ( 24 ) } }>未获取到商品的活动信息,请重新添加商品</Text></View>
									) }
									{ diy_data.data.left.top[ 0 ].goods_info.extend_data != null && (
										<View style={ { flexDirection : 'column' , alignItems : 'center' } }>
											<Text style={ {
												color : '#fff' ,
												fontWeight : '800' ,
												fontSize : pxToDp ( 30 ) ,
												marginTop : -pxToDp ( 10 )
											} }>{ diy_data.data.left.top[ 0 ].title }</Text>
											<Text style={ {
												color : '#fff' ,
												fontWeight : '400' ,
												fontSize : pxToDp ( 18 ) ,
												marginTop : pxToDp ( 12 )
											} }>{ diy_data.data.left.top[ 0 ].subtitle }</Text>
											<View
												style={ { flexDirection : 'row' , marginTop : pxToDp ( 15 ) , marginBottom : pxToDp ( 60 ) } }>
												<Text style={ {
													color : '#fff' ,
													fontSize : pxToDp ( 20 ) ,
													fontWeight : '400' ,
													marginRight : pxToDp ( 20 )
												} }>{I18n.t('com_DiyPage.From_the_end_of_the')}</Text>
												<TimeCountDown
													bgColor={ '#000' } time_color={ '#fff' } time_size={ 20 } bg_width={ 40 } bg_height={ 30 }
													seg_color={ '#fff' } seg_size={ 20 }
													enddate={ diy_data.data.left.top[ 0 ].goods_info.extend_data.end_time * 1000 }/>
											</View>

											{ ViewUtils.getSldImg ( 164 , 164 , { uri : diy_data.data.left.top[ 0 ].goods_info.goods_image } ) }

											<View style={ {
												flexDirection : 'row' ,
												justifyContent : 'flex-start' ,
												alignItems : 'flex-end' ,
												marginTop : pxToDp ( 12 )
											} }>
												<Text style={ { color : '#FF1717' , fontSize : pxToDp ( 20 ) } }>Ks</Text>
												<Text style={ {
													color : '#FF1717' ,
													fontSize : pxToDp ( 24 ) ,
													marginLeft : pxToDp ( 3 ) ,
													fontWeight : '700' ,
													marginBottom : -pxToDp ( 4 )
												} }>{ PriceUtil.formatPrice(diy_data.data.left.top[ 0 ].goods_info.goods_price) }</Text>
												<Text style={ {
													color : '#808080' ,
													fontSize : pxToDp ( 18 ) ,
													fontWeight : '300' ,
													marginLeft : pxToDp ( 17 ) ,
													textDecorationLine : 'line-through'
												} }>ks{PriceUtil.formatPrice( diy_data.data.left.top[ 0 ].goods_info.goods_marketprice )}</Text>
											</View>
											<View style={ [ {
												width : pxToDp ( 164 ) ,
												height : pxToDp ( 30 ) ,
												marginTop : pxToDp ( 10 ) ,
												backgroundColor : '#F3130E' ,
											} , GlobalStyles.flex_common_row ] }>
												<Text style={ {
													color : '#fff' ,
													fontSize : pxToDp ( 18 ) ,
													fontWeight : '400'
												} }>{ diy_data.data.left.top[ 0 ].goods_info.extend_data.sld_team_count }人团 | 去开团</Text>
											</View>
										</View>
									) }

								</ImageBackground>
							</TouchableOpacity>


							<View style={ { flexDirection : 'column' , width : width - pxToDp ( 298 ) } }>
								<View style={ {
									flexDirection : 'column' ,
									justifyContent : 'flex-start' ,
									width : '100%' ,
									paddingLeft : pxToDp ( 28 ) ,
									paddingRight : pxToDp ( 28 ) ,
									height : pxToDp ( 235 ) ,
									borderBottomWidth : 0.5 ,
									borderColor : '#D5D5D5'
								} }>
									<Text style={ {
										color : '#D62A29' ,
										fontSize : pxToDp ( 28 ) ,
										paddingTop : pxToDp ( 19 )
									} }>{ diy_data.data.right.top[ 0 ].title }</Text>
									<Text style={ {
										color : '#818181' ,
										fontSize : pxToDp ( 18 ) ,
										fontWeight : '300' ,
										marginTop : pxToDp ( 12 ) ,
									} }>{ diy_data.data.right.top[ 0 ].subtitle }</Text>
									<View style={ [ GlobalStyles.flex_common_row , {
										justifyContent : 'space-between' ,
										marginTop : pxToDp ( 17 )
									} ] }>

										{ diy_data.data.right.top[ 0 ].goods_info.map ( item => (
											<TouchableOpacity activeOpacity={ 1 } key={ item.gid }
											                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , item.gid ) }>
												{ ViewUtils.getSldImg ( 120 , 120 , {
													uri : item.goods_image
												} ) }

											</TouchableOpacity>
										) ) }

									</View>
								</View>

								<View style={ {
									flexDirection : 'row' ,
									width : '100%' ,
									height : pxToDp ( 233 ) ,
									borderBottomWidth : 0.5 ,
									borderColor : '#D5D5D5'
								} }>
									<TouchableOpacity
										activeOpacity={ 1 } onPress={ () => {
										ViewUtils.goDetailPage ( navigation , 'goods' , diy_data.data.right.bottom[ 1 ].goods_info[ 0 ].gid )
									} }
										style={ {
											flex : 1 ,
											height : '100%' ,
											paddingLeft : pxToDp ( 28 ) ,
											paddingRight : pxToDp ( 28 ) ,
											flexDirection : 'column' ,
											borderRightWidth : 0.5 ,
											borderColor : '#D5D5D5' ,
											justifyContent : 'flex-start'
										} }>
										<Text style={ {
											color : '#E37B14' ,
											fontSize : pxToDp ( 26 ) ,
											marginTop : pxToDp ( 22 )
										} }>{ diy_data.data.right.bottom[ 1 ].title }</Text>
										<Text style={ {
											color : '#818181' ,
											fontSize : pxToDp ( 16 ) ,
											marginTop : pxToDp ( 11 )
										} }>{ diy_data.data.right.bottom[ 1 ].subtitle }</Text>
										<View style={ [ GlobalStyles.flex_common_row , { marginTop : pxToDp ( 19 ) } ] }>
											{ ViewUtils.getSldImg ( 120 , 120 , { uri : diy_data.data.right.bottom[ 1 ].goods_info[ 0 ].goods_image } ) }
										</View>
									</TouchableOpacity>

									<TouchableOpacity
										activeOpacity={ 1 } onPress={ () => {
										ViewUtils.goDetailPage ( navigation , 'goods' , diy_data.data.right.bottom[ 2 ].goods_info[ 0 ].gid )

									} }
										style={ {
											flex : 1 ,
											height : '100%' ,
											paddingLeft : pxToDp ( 28 ) ,
											paddingRight : pxToDp ( 28 ) ,
											flexDirection : 'column' ,
											borderRightWidth : 0.5 ,
											borderColor : '#D5D5D5' ,
											justifyContent : 'flex-start'
										} }>
										<Text style={ {
											color : '#E37B14' ,
											fontSize : pxToDp ( 26 ) ,
											marginTop : pxToDp ( 22 )
										} }>{ diy_data.data.right.bottom[ 2 ].title }</Text>
										<Text style={ {
											color : '#818181' ,
											fontSize : pxToDp ( 16 ) ,
											marginTop : pxToDp ( 11 )
										} }>{ diy_data.data.right.bottom[ 2 ].subtitle }</Text>
										<View style={ [ GlobalStyles.flex_common_row , { marginTop : pxToDp ( 19 ) } ] }>
											{ ViewUtils.getSldImg ( 120 , 120 , { uri : diy_data.data.right.bottom[ 2 ].goods_info[ 0 ].goods_image } ) }
										</View>
									</TouchableOpacity>

								</View>
							</View>

						</View>

					</View>
				) }

				{ /*拼团活动模版--end*/ }


				{ /*轮播模版--start*/ }
				{ diy_data.type == 'lunbo' && (
					<Swiper
						showsPagination={ false }
						style={ [ GlobalStyles.swiper , { height : diy_data.height * 1 } ] }
						horizontal={ true }
						autoplay={ true }>

						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity key={ index } activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url );
							} }>
								<View>
									<Image resizeMode='contain' style={ { width : diy_data.width * 1 , height : diy_data.height * 1 } }
									       source={ { uri : val.img } }/>
								</View>
							</TouchableOpacity>
						) ) }
					</Swiper>
				) }
				{ /*轮播模版--end*/ }

				{ /*辅助线模版--实线--start*/ }
				{ diy_data.type == 'fzx' && diy_data.val == 'solid' && (
					<View style={ styles.fuZhuSolid }/>
				) }
				{ /*辅助线模版--实线--end*/ }


				{ /*辅助线模版--虚线---start*/ }
				{ diy_data.type == 'fzx' && diy_data.val == 'dashed' && (
					<View style={ styles.fuZhuDashed }/>
				) }
				{ /*辅助线模版--虚线---end*/ }


				{ /*公告模版--start*/ }
				{ diy_data.type == 'gonggao' && (
					<TouchableOpacity style={ styles.gongGaoWrap }  activeOpacity={ 1 } onPress={ () => {
						ViewUtils.goDetailPage ( navigation , diy_data.url_type == 'url' ? diy_data.url_type_new : diy_data.url_type , diy_data.url_type == 'url' ? diy_data.url_new : diy_data.url );
					} }>
						<Image resizeMode='contain' style={ styles.gongGaoIcon }
						       source={ require ( '../assets/images/home_gonggao.png' ) }/>
						<MarqueeLabel
							duration={ 16000 }
							textContainerHeight={pxToDp(76)}
							text={ diy_data.text }
							textStyle={ { fontSize : pxToDp ( 24 ) , color : '#333' , fontWeight : '300' } }
						/>
					</TouchableOpacity>
				) }
				{ /*公告模版--end*/ }

				{ /*辅助空白模版--start*/ }
				{ diy_data.type == 'fzkb' && (
					<View style={ { height : diy_data.text * 1 , width : width , backgroundColor : '#' + diy_data.color } }/>
				) }
				{ /*辅助空白模版--end*/ }


				{ /*富文本模版-android-start*/ }
				{ diy_data.type == 'fuwenben' && Platform.OS != 'ios' && (
					<View
						style={ { width : _w , height : _h , } }
					>
						<WebView
							ref={ webview => thisWebView = webview }
							style={ { flex : 1 } }
							scrollEnabled={ false }
							onMessage={ this._onMessage }
							scalesPageToFit={ true }
							showsVerticalScrollIndicator={ false }
							source={ { html : diy_data.text , baseUrl : '' } }
							automaticallyAdjustContentInsets={ true }
							javaScriptEnabled={ true }
							onLoadEnd={ () => this._onLoadEnd () }
						/>
					</View>
				) }
				{ /*富文本模版-android-end*/ }

				{ /*富文本模版-ios-start*/ }
				{ diy_data.type == 'fuwenben' && Platform.OS === 'ios' && (
					<View
						style={ { width : _w , height : _h_ios , } }
					>
						<WebView
							ref={ webview => thisWebView = webview }
							style={ { flex : 1 } }
							scrollEnabled={ false }
							onMessage={ this._onMessageIos }
							scalesPageToFit={ true }
							showsVerticalScrollIndicator={ false }
							source={ { html : diy_data.text , baseUrl : '' } }
							automaticallyAdjustContentInsets={ true }
							javaScriptEnabled={ true }
							injectedJavaScript={ '(' + String ( injectedScript ) + ')();' }
						/>
					</View>
				) }
				{ /*富文本模版-ios-end*/ }

				{ /*导航模版---start*/ }
				{ diy_data.type == 'nav' && diy_data.style_set == 'nav' && (

					<View style={ styles.nav_nav_wrap }>
						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity key={ index } activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url );
							} }>
								<View style={ {
									flexDirection : diy_data.icon_set == "up" ? 'column' : 'row' ,
									justifyContent : 'center' ,
									alignItems : 'center' ,
									height : diy_data.icon_set == "left" ? pxToDp ( 144 ) : 'auto' ,
									width : diy_data.icon_set == "up" ? ( width / diy_data.data.length ) : 'auto'
								} }>
									<Image resizeMode='cover'
									       style={ {
										       width : diy_data.slide * 1 ,
										       height : diy_data.slide * 1 ,
										       display : diy_data.icon_set == "no-icon" ? 'none' : 'flex' ,
										       marginRight : diy_data.icon_set == "left" ? pxToDp ( 10 ) : 0
									       } }
									       source={ { uri : val.img } }/>
									<Text style={ styles.nav_nav_text }>{ val.name }</Text>
								</View>
							</TouchableOpacity>
						) ) }
					</View>
				) }
				{ diy_data.type == 'nav' && diy_data.style_set == 'tag-nav' && (

					<View style={ styles.nav_tagnav_wrap }>
						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity key={ index } activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url );
							} }>
								<View style={ styles.nav_tagnav_whole }>
									<View style={ styles.nav_tagnav_part_view }>
										<Image resizeMode='cover'
										       style={ {
											       width : diy_data.slide * 1 ,
											       height : diy_data.slide * 1 ,
											       display : diy_data.icon_set == "no-icon" ? 'none' : 'flex'
										       } }
										       source={ { uri : val.img } }/>
										<Text style={ styles.nav_tagnav_part_text }>{ val.name }</Text>
									</View>
								</View>

							</TouchableOpacity>
						) ) }
					</View>

				) }
				{ /*导航模版----end*/ }


				{ /*推荐商品模版--矩阵--start*/ }
				{ diy_data.type == 'tuijianshangpin' && diy_data.show_style == 'small' && (
					<View style={ [ styles.tjsp_small_wrap ] }>
						{ diy_data.data.goods_info != null && diy_data.data.goods_info.map ( ( val , index ) => (
							<TouchableOpacity key={ index } activeOpacity={ 1 }
							                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , val.gid ) }
							                  key={ val.gid }>
								<View style={ styles.tjsp_small_part }>
									<Image resizeMode='contain' style={ styles.tjsp_small_part_img }
									       source={ { uri : val.goods_image } }/>

									{ diy_data.isshow_title == '1' &&
									<Text ellipsizeMode='tail' numberOfLines={ 1 }
									      style={ [ styles.tjsp_small_part_name , GlobalStyles.sld_global_font ] }>{ val.goods_name }</Text>
									}
									{ diy_data.isshow_price == '1' &&
									<View style={ styles.line_left_right }>
										<Text
											style={ styles.tjsp_big_part_price }>ks{PriceUtil.formatPrice( val.show_price )}</Text>
									</View>
									}
								</View>
							</TouchableOpacity> ) ) }
					</View>
				) }
				{ /*推荐商品模版--矩阵--end*/ }


				{ /*推荐商品模版--列表--start*/ }
				{ diy_data.type == 'tuijianshangpin' && diy_data.show_style == 'list' && (
					<View style={ styles.tjsp_list_wrap }>
						{ diy_data.data.goods_info != null && diy_data.data.goods_info.map ( item => (
							<TouchableOpacity activeOpacity={ 1 } key={ item.gid }
							                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , item.gid ) }>
								<View style={ [ styles.tjsp_list_part ] }>
									<Image resizeMode='contain' style={ styles.tjsp_list_part_img }
									       source={ { uri : item.goods_image } }/>
									<View style={ styles.tjsp_list_part_right }>
										{ diy_data.isshow_title == '1' &&
										<Text numberOfLines={ 2 }
										      style={ [ styles.tjsp_list_part_right_name , GlobalStyles.sld_global_font ] }>{ item.goods_name }</Text>
										}
										{ diy_data.isshow_price == '1' &&
										<Text
											style={ [ styles.tjsp_list_part_right_price , GlobalStyles.fontWeight ] }>ks{PriceUtil.formatPrice( item.show_price )}</Text>
										}
									</View>
								</View>
								<View style={ styles.line_separate }/>
							</TouchableOpacity>
						) ) }
					</View>
				) }
				{ /*推荐商品模版--列表--end*/ }

				{ /*推荐商品模版--大图--start*/ }
				{ diy_data.type == 'tuijianshangpin' && diy_data.show_style == 'big' && (
					<View style={ [ styles.tjsp_big_wrap ] }>
						{ diy_data.data.goods_info != null && diy_data.data.goods_info.map ( ( val , index ) => (
							<TouchableOpacity key={ index } activeOpacity={ 1 }
							                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , val.gid ) }
							                  key={ val.gid }>
								<View style={ [ styles.tjsp_big_part ] }>
									<Image resizeMode='contain' style={ [ styles.tjsp_big_part_img ] }
									       source={ { uri : val.goods_image } }/>

									{ diy_data.isshow_title == '1' &&
									<Text ellipsizeMode='tail' numberOfLines={ 1 }
									      style={ [ styles.tjsp_big_part_name , GlobalStyles.sld_global_font ] }>{ val.goods_name }</Text>
									}
									{ diy_data.isshow_price == '1' &&
									<View style={ styles.line_left_right }>
										<Text
											style={ styles.tjsp_big_part_price }>ks{PriceUtil.formatPrice( val.show_price )}</Text>
									</View>
									}

								</View>
							</TouchableOpacity> ) ) }
					</View>
				) }
				{ /*推荐商品模版--大图--end*/ }

				{ /*客服模版--start*/ }
				{ diy_data.type == 'kefu' && diy_data.tel != '' && (
					<TouchableOpacity style={ styles.kefu_wrap } activeOpacity={ 1 }
					                  onPress={ () => ViewUtils.callTel ( diy_data.tel * 1 ) }
					>
						<Image style={ styles.kefu_icon } source={ require ( '../assets/images/tel.png' ) }/>
						<Text style={ styles.keFuText }>{ diy_data.text }</Text>
						<Text>{ diy_data.tel }</Text>
					</TouchableOpacity>
				) }
				{ /*客服模版--end*/ }

				{ /*搭配模版----start*/ }
				{ diy_data.type == 'dapei' && (
					<View>
						{ diy_data.dapei_img &&
						<Image resizeMode='cover' style={ { width : diy_data.width , height : diy_data.height } }
						       source={ { uri : diy_data.dapei_img } }/>
						}
						<ScrollView horizontal={ true } style={ styles.dapei_scroller } showsHorizontalScrollIndicator={ false }>
							<View style={ styles.dapei_whole }>
								{ diy_data.data.goods_info.map ( ( item , index ) => (
									<TouchableOpacity activeOpacity={ 1 } key={ 'hw' + index } style={ styles.dapei_part }
									                  onPress={ () => ViewUtils.goGoodsDetail ( navigation , item.gid ) }>
										<Image resizeMode='contain' source={ { uri : item.goods_image } } style={ styles.dapei_part_img }/>
										<Text ellipsizeMode='tail' numberOfLines={ 1 }
										      style={ [ styles.dapei_part_name , GlobalStyles.sld_global_font ] }>{ item.goods_name }</Text>
										<Text
											style={ [ styles.dapei_part_price , GlobalStyles.sld_global_fontfamliy ] }>ks{PriceUtil.formatPrice( item.show_price )}</Text>
									</TouchableOpacity>
								) ) }
							</View>
						</ScrollView>
					</View>
				) }
				{ /*搭配模版----end*/ }


				{ /*图片组合模版0---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 0 && (
					<View style={ { flexDirection : 'column' , backgroundColor : "#fff" , width : width } }>
						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity activeOpacity={ 1 } key={ 'tpzh' + index }
							                  onPress={ () => ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url )
							                  }>
								<Image resizeMode='cover' style={ { width : val.width * 1 , height : val.height * 1 } }
								       source={ { uri : val.img } }/>
							</TouchableOpacity>
						) ) }
					</View>
				) }

				{ /*图片组合模版0---end*/ }


				{ /*图片组合模版1---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 1 && (
					<View style={ styles.tpzh_1_wrap }>
						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity activeOpacity={ 1 } key={ 'tpzh' + index }
							                  onPress={ () => ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url ) }>
								<Image resizeMode='cover'
								       style={ { marginLeft : 10 , width : val.width , height : val.height , marginBottom : 10 } }
								       source={ { uri : val.img } }/>
							</TouchableOpacity>
						) ) }
					</View>
				) }

				{ /*图片组合模版1---end*/ }

				{ /*图片组合模版2---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 2 && (
					<View style={ styles.tpzh_235_wrap }>
						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity activeOpacity={ 1 } key={ 'tpzh' + index }
							                  onPress={ () => ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url ) }>
								<Image resizeMode='cover' style={ {
									marginLeft : 10 ,
									width : val.width * 1 ,
									height : val.height * 1 ,
									marginBottom : 10
								} } source={ { uri : val.img } }/>
							</TouchableOpacity>
						) ) }
					</View>
				) }
				{ /*图片组合模版2---end*/ }

				{ /*图片组合模版3---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 3 && (
					<View style={ styles.tpzh_235_wrap }>
						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity key={ index } activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url );
							} }>

								<Image resizeMode='cover'
								       style={ {
									       width : val.width * 1 ,
									       height : val.height * 1 ,
									       marginLeft : 10 ,
									       marginBottom : 10
								       } }
								       source={ { uri : val.img } }/>

							</TouchableOpacity>
						) ) }
					</View>
				) }
				{ /*图片组合模版3---end*/ }

				{ /*图片组合模版4---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 4 && (
					<View style={ styles.tpzh_467_wrap }>
						<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
							ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 0 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 0 ][ 'url_type_new' ] : diy_data[ 'data' ][ 0 ][ 'url_type' ] , diy_data[ 'data' ][ 0 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 0 ][ 'url_new' ] : diy_data[ 'data' ][ 0 ][ 'url' ] );
						} }>
							<Image resizeMode='cover'
							       style={ {
								       width : diy_data[ 'data' ][ 0 ].width * 1 ,
								       height : diy_data[ 'data' ][ 0 ].height * 1 ,
								       marginLeft : 10 ,
								       marginBottom : 10
							       } }
							       source={ { uri : diy_data[ 'data' ][ 0 ].img } }/>

						</TouchableOpacity>
						<View style={ {
							width : diy_data[ 'data' ][ 0 ].width * 1 ,
							height : diy_data[ 'data' ][ 0 ].height * 1 ,
							marginLeft : 10 ,
							marginBottom : 10 ,
							flexDirection : 'column' ,
							justifyContent : 'space-between'
						} }>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 1 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 1 ][ 'url_type_new' ] : diy_data[ 'data' ][ 1 ][ 'url_type' ] , diy_data[ 'data' ][ 1 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 1 ][ 'url_new' ] : diy_data[ 'data' ][ 1 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 1 ].width * 1 ,
									       height : diy_data[ 'data' ][ 1 ].height * 1
								       } }
								       source={ { uri : diy_data[ 'data' ][ 1 ].img } }/>

							</TouchableOpacity>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 2 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 2 ][ 'url_type_new' ] : diy_data[ 'data' ][ 2 ][ 'url_type' ] , diy_data[ 'data' ][ 2 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 2 ][ 'url_new' ] : diy_data[ 'data' ][ 2 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 2 ].width * 1 ,
									       height : diy_data[ 'data' ][ 2 ].height * 1
								       } }
								       source={ { uri : diy_data[ 'data' ][ 2 ].img } }/>

							</TouchableOpacity>
						</View>

					</View>
				) }
				{ /*图片组合模版4---end*/ }

				{ /*图片组合模版5---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 5 && (
					<View style={ styles.tpzh_235_wrap }>
						{ diy_data.data.map ( ( val , index ) => (
							<TouchableOpacity activeOpacity={ 1 } key={ 'tpzh' + index }
							                  onPress={ () => ViewUtils.goDetailPage ( navigation , val.url_type == 'url' ? val.url_type_new : val.url_type , val.url_type == 'url' ? val.url_new : val.url ) }>
								<Image resizeMode='cover' style={ {
									marginLeft : 10 ,
									width : val.width * 1 ,
									height : val.height * 1 ,
									marginBottom : 10
								} } source={ { uri : val.img } }/>
							</TouchableOpacity>
						) ) }
					</View>
				) }
				{ /*图片组合模版5---end*/ }
				{ /*图片组合模版6---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 6 && (
					<View style={ styles.tpzh_467_wrap }>
						<View style={ {
							width : diy_data[ 'data' ][ 0 ].width * 1 ,
							marginLeft : 10 ,
							marginBottom : 10 ,
							flexDirection : 'column'
						} }>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 0 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 0 ][ 'url_type_new' ] : diy_data[ 'data' ][ 0 ][ 'url_type' ] , diy_data[ 'data' ][ 0 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 0 ][ 'url_new' ] : diy_data[ 'data' ][ 0 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 0 ].width * 1 ,
									       height : diy_data[ 'data' ][ 0 ].height * 1 ,
									       marginBottom : 10
								       } }
								       source={ { uri : diy_data[ 'data' ][ 0 ].img } }/>

							</TouchableOpacity>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 1 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 1 ][ 'url_type_new' ] : diy_data[ 'data' ][ 1 ][ 'url_type' ] , diy_data[ 'data' ][ 1 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 1 ][ 'url_new' ] : diy_data[ 'data' ][ 1 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 1 ].width * 1 ,
									       height : diy_data[ 'data' ][ 1 ].height * 1
								       } }
								       source={ { uri : diy_data[ 'data' ][ 1 ].img } }/>

							</TouchableOpacity>
						</View>

						<View style={ {
							width : diy_data[ 'data' ][ 0 ].width * 1 ,
							marginLeft : 10 ,
							marginBottom : 10 ,
							flexDirection : 'column'
						} }>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 2 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 2 ][ 'url_type_new' ] : diy_data[ 'data' ][ 2 ][ 'url_type' ] , diy_data[ 'data' ][ 2 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 2 ][ 'url_new' ] : diy_data[ 'data' ][ 2 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 2 ].width * 1 ,
									       height : diy_data[ 'data' ][ 2 ].height * 1 ,
									       marginBottom : 10
								       } }
								       source={ { uri : diy_data[ 'data' ][ 2 ].img } }/>

							</TouchableOpacity>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 3 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 3 ][ 'url_type_new' ] : diy_data[ 'data' ][ 3 ][ 'url_type' ] , diy_data[ 'data' ][ 3 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 3 ][ 'url_new' ] : diy_data[ 'data' ][ 3 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 3 ].width * 1 ,
									       height : diy_data[ 'data' ][ 3 ].height * 1
								       } }
								       source={ { uri : diy_data[ 'data' ][ 3 ].img } }/>

							</TouchableOpacity>
						</View>
					</View>
				) }
				{ /*图片组合模版6---end*/ }

				{ /*图片组合模版7---start*/ }
				{ diy_data.type == 'tupianzuhe' && diy_data.sele_style == 7 && (
					<View style={ styles.tpzh_467_wrap }>
						<View style={ {
							width : diy_data[ 'data' ][ 4 ].width ,
							marginLeft : 10 ,
							marginBottom : 10 ,
							flexDirection : 'column' ,
							justifyContent : 'space-between' ,
							height : diy_data[ 'data' ][ 4 ].height
						} }>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 0 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 0 ][ 'url_type_new' ] : diy_data[ 'data' ][ 0 ][ 'url_type' ] , diy_data[ 'data' ][ 0 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 0 ][ 'url_new' ] : diy_data[ 'data' ][ 0 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 0 ].width ,
									       height : diy_data[ 'data' ][ 0 ].height ,
									       marginBottom : diy_data[ 'data' ][ 4 ].height - diy_data[ 'data' ][ 4 ].width * 2
								       } }
								       source={ { uri : diy_data[ 'data' ][ 0 ].img } }/>

							</TouchableOpacity>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 1 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 1 ][ 'url_type_new' ] : diy_data[ 'data' ][ 1 ][ 'url_type' ] , diy_data[ 'data' ][ 1 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 1 ][ 'url_new' ] : diy_data[ 'data' ][ 1 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ { width : diy_data[ 'data' ][ 1 ].width , height : diy_data[ 'data' ][ 1 ].height } }
								       source={ { uri : diy_data[ 'data' ][ 1 ].img } }/>

							</TouchableOpacity>
						</View>

						<View style={ {
							width : diy_data[ 'data' ][ 4 ].width ,
							marginLeft : 10 ,
							marginBottom : 10 ,
							flexDirection : 'column'
						} }>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 2 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 2 ][ 'url_type_new' ] : diy_data[ 'data' ][ 2 ][ 'url_type' ] , diy_data[ 'data' ][ 2 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 2 ][ 'url_new' ] : diy_data[ 'data' ][ 2 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ {
									       width : diy_data[ 'data' ][ 2 ].width ,
									       height : diy_data[ 'data' ][ 2 ].height ,
									       marginBottom : diy_data[ 'data' ][ 4 ].height - diy_data[ 'data' ][ 4 ].width * 2
								       } }
								       source={ { uri : diy_data[ 'data' ][ 2 ].img } }/>

							</TouchableOpacity>
							<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
								ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 3 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 3 ][ 'url_type_new' ] : diy_data[ 'data' ][ 3 ][ 'url_type' ] , diy_data[ 'data' ][ 3 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 3 ][ 'url_new' ] : diy_data[ 'data' ][ 3 ][ 'url' ] )
							} }>
								<Image resizeMode='cover'
								       style={ { width : diy_data[ 'data' ][ 3 ].width , height : diy_data[ 'data' ][ 3 ].height } }
								       source={ { uri : diy_data[ 'data' ][ 3 ].img } }/>

							</TouchableOpacity>
						</View>
						<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
							ViewUtils.goDetailPage ( navigation , diy_data[ 'data' ][ 4 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 4 ][ 'url_type_new' ] : diy_data[ 'data' ][ 4 ][ 'url_type' ] , diy_data[ 'data' ][ 4 ][ 'url_type' ] == 'url' ? diy_data[ 'data' ][ 4 ][ 'url_new' ] : diy_data[ 'data' ][ 4 ][ 'url' ] )
						} }>
							<Image resizeMode='cover'
							       style={ {
								       width : diy_data[ 'data' ][ 4 ].width ,
								       height : diy_data[ 'data' ][ 4 ].height ,
								       marginBottom : 10 ,
								       marginLeft : 10
							       } }
							       source={ { uri : diy_data[ 'data' ][ 4 ].img } }/>

						</TouchableOpacity>
					</View>

				) }
				{ /*图片组合模版7---end*/ }

			</View>
		)
	}

}
const injectedScript = function () {
	function waitForBridge () {
		if ( window.postMessage.length !== 1 ) {
			setTimeout ( waitForBridge , 200 );
		}
		else {
			let height = 0;
			if ( document.documentElement.scrollHeight > document.body.scrollHeight ) {
				height = document.documentElement.scrollHeight
			}
			else {
				height = document.body.scrollHeight
			}
			let data = { 'type' : 'auto_height' , 'height' : height };
			postMessage ( JSON.stringify ( data ) )
		}
	}

	waitForBridge ();
};
const styles = StyleSheet.create ( {
	keFuText : {
		fontWeight : '300' ,
		color : '#666' ,
		fontSize : pxToDp ( 24 ) ,
		marginLeft : pxToDp ( 20 ) ,
	} ,

	editorCon : { padding : 30 , backgroundColor : '#fff' } ,
	lunBoPointB : {
		bottom : pxToDp ( 30 )
	} ,
	fuZhuSolid : {
		height : 0.5 , borderBottomWidth : 0.5 , borderColor : border_color , borderStyle : 'solid'
	} ,
	fuZhuDashed :
		{ height : 10 , borderBottomWidth : 0.5 , borderColor : border_color , marginBottom : 5 , borderStyle : 'dotted' } ,
	gongGaoWrap :
		{ flexDirection : 'row' , height : pxToDp ( 76 ) , backgroundColor : '#eee' , alignItems : 'center' } ,
	gongGaoIcon : { width : pxToDp ( 40 ) , marginLeft : 10 , marginRight : 10 } ,
	gongGaoText : { fontSize : pxToDp ( 24 ) , color : '#333' } ,
	nav_nav_wrap : { flexDirection : 'row' , justifyContent : 'space-around' , backgroundColor : "#fff" } ,
	nav_nav_text : {
		fontWeight : font_weight ,
		color : '#333' ,
		fontSize : pxToDp ( 26 ) ,
		marginTop : pxToDp ( 10 ) ,
		marginBottom : 8
	} ,
	nav_tagnav_wrap : {
		flexDirection : 'row' ,
		flexWrap : 'wrap' ,
		backgroundColor : "#fff" ,
		width : width ,
		paddingLeft : 15
	} ,
	nav_tagnav_whole : {
		flexDirection : 'row' ,
		justifyContent : 'flex-start' ,
		alignItems : 'flex-start' ,
		width : ( width - 30 ) / 2
	} ,
	nav_tagnav_part_view : {
		flexDirection : 'row' ,
		justifyContent : 'center' ,
		alignItems : 'center' ,
		paddingTop : pxToDp ( 30 )
	} ,
	nav_tagnav_part_text : {
		fontWeight : font_weight ,
		color : '#333' ,
		fontSize : pxToDp ( 26 ) ,
		marginLeft : pxToDp ( 40 )
	} ,
	kefu_wrap : {
		flexDirection : 'row' ,
		alignItems : 'center' ,
		backgroundColor : '#fff' ,
		width : width * 1 ,
		padding : 15
	} ,
	kefu_icon : { width : 20 , height : 20 } ,
	dapei_scroller : { flexDirection : 'row' , flexWrap : 'wrap' , backgroundColor : "#fff" , width : width } ,
	dapei_whole : {
		flexDirection : 'row' ,
		alignItems : 'center' ,
		backgroundColor : '#fff' ,
		marginBottom : 10 ,
		flexWrap : 'nowrap'
	} ,
	dapei_part : { flexDirection : 'column' , width : ( width - 40 ) / 3 , marginLeft : 10 , marginTop : 10 } ,
	dapei_part_img : { width : ( width - 40 ) / 3 , height : ( width - 40 ) / 3 } ,
	dapei_part_name : { fontSize : pxToDp ( 30 ) , color : '#141414' , marginTop : 15 } ,
	dapei_part_price : { fontSize : pxToDp ( 30 ) , color : '#ba1418' , marginTop : 12 } ,
	tpzh_1_wrap : { flexDirection : 'column' , backgroundColor : "#fff" , width : width } ,
	tpzh_235_wrap : {
		flexDirection : 'row' ,
		flexWrap : 'wrap' ,
		justifyContent : 'flex-start' ,
		backgroundColor : "#fff" ,
		width : width
	} ,
	tpzh_467_wrap : { flexDirection : 'row' , justifyContent : 'flex-start' , backgroundColor : "#fff" , width : width } ,


	line_left_right : {
		flexDirection : 'row' ,
		justifyContent : 'space-between'
	} ,
	tjsp_list_wrap : {
		flexDirection : 'column' ,
		width : width ,
		alignItems : 'center' ,
		backgroundColor : '#fff' ,
	} ,
	line_separate : { height : 0.5 , backgroundColor : '#e5e5e5' , marginLeft : 15 , width : width } ,
	tjsp_list_part : {
		flexDirection : 'row' ,
		width : width - 30 ,
		marginRight : 15 ,
		marginLeft : 15 ,
		marginBottom : 10 , paddingTop : 10
	} ,

	tjsp_list_part_img : {
		width : pxToDp ( 240 ) ,
		height : pxToDp ( 240 ) ,
		marginRight : 10 ,
	} ,
	tjsp_list_part_right : {
		flexDirection : 'column' ,
		height : pxToDp ( 240 ) ,
		width : width - pxToDp ( 240 ) - 45 ,
	} ,
	tjsp_list_part_right_name : {
		fontSize : pxToDp ( 26 ) ,
		height : pxToDp ( 80 ) ,
		flexDirection : 'row' ,
		flexWrap : 'wrap' ,
	} ,
	tjsp_list_part_right_price : {
		fontSize : pxToDp ( 26 ) ,
		color : '#ba1418' ,
		position : 'relative' ,
		bottom : 0 ,
	} ,
	tjsp_big_wrap : {
		width : width ,
		flexDirection : 'column' ,
		backgroundColor : '#fff' ,
	} ,
	tjsp_big_part : {
		width : ( width - 30 ) ,
		flexDirection : 'column' ,
		marginLeft : 15 ,
		marginBottom : 10 ,
	} ,
	tjsp_big_part_img : {
		width : width - 30 ,
		height : width - 30
	} ,
	tjsp_big_part_name : {
		width : width - 30 ,
		fontSize : pxToDp ( 26 ) ,
		color : '#333' ,
	} ,
	tjsp_big_part_price : {
		color : '#ba1418' ,
		fontSize : pxToDp ( 26 ) ,
		marginTop : 10 ,
	} ,
	tjsp_small_part_name : {
		width : ( width - 45 ) / 2 ,
		fontSize : pxToDp ( 26 ) ,
		color : main_title_color ,
		marginTop : 10 ,
	} ,
	tjsp_small_part_img : {
		width : ( width - 45 ) / 2 ,
		height : ( width - 45 ) / 2 ,
		borderColor : border_color ,
		borderWidth : 0.5 ,
	} ,
	tjsp_small_part : {
		width : ( width - 45 ) / 2 ,
		flexDirection : 'column' ,
		marginLeft : 15 ,
		marginBottom : 10 ,
	} ,
	tjsp_small_wrap : {
		flexDirection : 'row' ,
		flexWrap : 'wrap' ,
		backgroundColor : '#fff' ,
	} ,

} );
