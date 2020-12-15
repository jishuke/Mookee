import React, {Component} from 'react'
import {
	Dimensions,
	View,
	Image,
	Text,
	TouchableOpacity,
	ScrollView,
	DeviceEventEmitter,
	StatusBar,
	WebView, Animated, Easing
} from 'react-native'
import SldShareCommon from "../../component/SldShareCommon";
import GlobalStyles from "../../assets/styles/GlobalStyles";
import {Carousel} from 'react-native-ui-lib';
import ViewUtils from '../../util/ViewUtils'
import RequestData from '../../RequestData';
import pxToDp from '../../util/pxToDp';
import styles from '../styles/goods';
import ShareUtil from '../../util/ShareUtil';
import SldComStatusBar from "../../component/SldComStatusBar";
import PriceUtil from '../../util/PriceUtil'

const {width, height} = Dimensions.get('window');

export default class PointsGoodsDetail extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '商品详情',
			gid: props.navigation.state.params.gid,
			currentBody: 1,
			goodsDetail: '',
			GoodsList: [],     // 推荐商品
			webViewHeight: 0,
			visible: true,
			addNum: 1,
			cartNum: 0,
			InitBottom: new Animated.Value(-pxToDp(667)),
			fadeInOpacity: new Animated.Value(0),
			InitWrapBottom: new Animated.Value(-height),
			is_show_share: 0,
			share_data: '',
		}
	}

	componentDidMount(){
		this.initData();
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.initData();
		});
	}
	componentWillUnmount(){
		this.emitter.remove();
	}

	initData(){
		this.getGoodsInfo();
		this.addUserBrowserGoods();
		this.getGoodsList();
		this.getCartNum();
	}

	// 获取商品详情
	getGoodsInfo(){
		const {gid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=points_goods&mod=goods_detail&sld_addons=points&gid=' + gid).then(res => {
			if(res.status == 200){
				let share_data = {};
				share_data.type = 'goods';
				share_data.text = res.data.pgoods_name;
				share_data.img = res.data.goods_image;
				share_data.webUrl = AppSldDomain + '/points/cwap_goods_datail.html?gid=' + res.data.gid;
				share_data.title = res.data.pgoods_name;
				let reg = new RegExp('<img', "g")
				res.data.pgoods_body = res.data.pgoods_body.replace(reg, "<img style=\"display:        ;width:100%;\"")
				this.setState({
					goodsDetail: res.data,
					share_data: share_data
				})

			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 更新积分商品浏览量
	addUserBrowserGoods(){
		const {gid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=points_goods&mod=addUserBrowserGoods&sld_addons=points&gid=' + gid).then(res => {
			if(res.status == 200){

			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 获取推荐商品
	getGoodsList(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=points_goods&mod=points_goods_tuijian&sld_addons=points').then(res => {
			if(res.status == 200){
				this.setState({
					GoodsList: res.data
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 获取购物车数量
	getCartNum(){
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=cartlist&sld_addons=points', {
			key
		}).then(res => {
			if(res.status == 200){
				this.setState({
					cartNum: res.data.length
				})
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	_onMessageIos = (e) => {
		let message = e.nativeEvent.data;
		let res = JSON.parse(message);
		switch(res.type){
			case "auto_height":
				this.setState({
					webViewHeight: parseInt(res.height)
				});
				break;
			case "open_img":
				break;
		}
	};

	changeNum = (type) => {
		let {addNum, goodsDetail} = this.state;
		let pgoods_limitnum = goodsDetail.pgoods_limitnum;
		if(type == 'desc' && addNum <= 1) return;
		if(type == 'add' && addNum >= pgoods_limitnum){
			ViewUtils.sldToastTip('最多可购买'+pgoods_limitnum+'件');
			return;
		}
		addNum = type == 'desc' ? addNum - 1 : addNum + 1;
		this.setState({
			addNum
		})
	}

	// 加入购物车
	addCart = () => {
		const {gid} = this.state;
		RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=addcart&sld_addons=points', {
			key,
			num: 1,
			gid
		}).then(res => {
			if(res.status == 200){
				ViewUtils.sldToastTip('加入购物车成功');
				DeviceEventEmitter.emit('updateCart');
				this.getCartNum();
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	//立即购买
	submit = () => {
		const {gid, addNum} = this.state;
		this.close();
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			this.props.navigation.navigate('PointsConfirmOrder', {ifcart: 0, cart_id: `${ gid }|${ addNum }`});
		}
	}

	// 分享
	goShare = (type) => {
		if(type == 'share'){
			this.setState({
				is_show_share: 1,
			});
		}else{
			this.refs.calendarshare.close();
		}
	}
	cancleShare = () => {
		this.setState({
			is_show_share: 0,
		});
	}

	share = (type) => {
		let this_new = this;
		this_new.refs.calendarshare.close();
		let {goodsDetail} = this.state;

		let text = goodsDetail.pgoods_name;
		let img = goodsDetail.goods_image;
		let webUrl = AppSldDomain + '/points/cwap_goods_datail.html?gid=' + goods_info.gid;
		let title = goodsDetail.pgoods_name;

		ShareUtil.share(text, img, webUrl, title, type, (code, message) => {
			this_new.refs.toast.show(message);
		});
	}

	changePage = (type) => {
		if(type == 1){
			this.refs.goods.scrollTo({x: 0, y: 0, animated: true});
		}else{
			let offsetTop = width + pxToDp(300);
			this.refs.goods.scrollTo({x: 0, y: offsetTop, animated: true});
		}
		this.setState({
			currentBody: type
		})
	}

	animateStart = () => {
		if(!this.state.goodsDetail){
			ViewUtils.sldToastTip('该商品已下架');
			return;
		}
		Animated.parallel([
			Animated.timing(this.state.fadeInOpacity, {
				toValue: 1,
				duration: 10,
				easing: Easing.linear,
			}),
			Animated.timing(this.state.InitWrapBottom, {
				toValue: 0,
				duration: 10,
				easing: Easing.linear,
			}),
			Animated.timing(this.state.InitBottom, {
				toValue: 0,
				duration: 300,
				easing: Easing.linear,
				delay: 10
			})
		]).start();
	}

	close = () => {
		Animated.parallel([
			Animated.timing(this.state.InitBottom, {
				toValue: -pxToDp(667),
				duration: 300,
				easing: Easing.linear,
			}),
			Animated.timing(this.state.fadeInOpacity, {
				toValue: 0,
				duration: 10,
				easing: Easing.linear,
				delay: 300
			}),
			Animated.timing(this.state.InitWrapBottom, {
				toValue: -height,
				duration: 10,
				easing: Easing.linear,
				delay: 300
			})
		]).start();
	}

	render(){
		const {currentBody, goodsDetail, GoodsList} = this.state;
		return (<View style={ GlobalStyles.sld_container }>
			<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
			{/*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*/}
			<View style={ [ {backgroundColor: '#fff'} ] }>
				<View style={ styles.statusBar }>
					<StatusBar style={ {barStyle: 'default'} }/>
				</View>
				<View style={ styles.navBar }>
					<View style={ styles.navBarButton }>

						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => {
								this.props.navigation.goBack();
							} }>
							<View style={ GlobalStyles.topBackBtn }>
								<Image
									style={ GlobalStyles.topBackBtnImg }
									source={ require('../../assets/images/goback.png') }/>
							</View>
						</TouchableOpacity>
					</View>
					<View style={ [ styles.navBarTitleContainer ] }>
						<View style={ styles.goods_title_wrap }>

							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => {
									this.changePage('1');
								} }>
								<View
									style={ [ styles.sld_goods_title_common, currentBody == '1' ? styles.goods_title_cur_goods : '' ] }>
									<Text
										style={ {color: currentBody == '1' ? '#fff' : '#333'} }>商品</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => {
									this.changePage('2');
								} }>
								<View
									style={ [ styles.sld_goods_title_common, currentBody == '2' ? styles.goods_title_cur_detail : '', ] }>
									<Text
										style={ {color: currentBody == '2' ? '#fff' : '#333'} }>详情</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<View style={ styles.navBarButton }>
						<View style={ {flexDirection: 'row'} }>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => {
									this.goShare('share')
								} }>
								<Image
									style={ {width: 22, height: 22, marginRight: 15} }
									resizeMode={ 'contain' }
									source={ require('../images/share.png') }
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
			<View style={ GlobalStyles.line }/>

			<ScrollView style={ {flex: 1} } ref={ 'goods' }>
				<View style={ styles.goods_swiper }>
					<Carousel>
						<View
							style={ {
								width: width,
								height: width,
								alignItems: 'center',
								justifyContent: 'center'
							} }
						>
							{ goodsDetail != '' && <Image
								style={ {width: width, height: width} }
								resizeMode={ 'contain' }
								source={ {uri: goodsDetail.goods_image} }
								defaultSource={require('../../assets/images/default_icon_400.png')}
							/> }
							<Text style={ styles.dot }>1/1</Text>
						</View>
					</Carousel>
				</View>
				<View style={ styles.goods_info }>
					<View style={ styles.storage }>
						<Text style={ styles.font30 }>库存{ goodsDetail != '' ? goodsDetail.pgoods_storage : '--' }</Text>
						<Text style={ styles.font30 }>已售{ goodsDetail != '' ? goodsDetail.pgoods_salenum : '--' }</Text>
					</View>
					<Text style={ styles.title }>{ goodsDetail != '' ? goodsDetail.pgoods_name : '' }</Text>
					<Text
						style={ styles.font30 }>{goodsDetail != '' && goodsDetail.pgoods_limitnum>0?'此礼品每单限兑数量'+goodsDetail.pgoods_limitnum:'此礼品兑换数量不限制'}</Text>
					<View style={ styles.price }>
						<Text style={ {
							color: '#BA1418',
							fontSize: pxToDp(38),
							marginRight: pxToDp(45)
						} }>{ goodsDetail != '' ? goodsDetail.pgoods_points : '--' }积分</Text>
						<Text style={ styles.font30 }>售价：Ks{ goodsDetail != '' ? PriceUtil.formatPrice(goodsDetail.pgoods_price) : '--' }</Text>
					</View>
				</View>

				<View style={ styles.body }>
					<View style={ styles.body_title }>
						<View style={ styles.center }>
							<View style={ styles.tdot }></View>
							<View style={ styles.tdot }></View>
							<View style={ styles.tdot }></View>
						</View>
						<Text
							style={ {marginHorizontal: pxToDp(30), fontSize: pxToDp(36), color: '#181818'} }>商品详情</Text>
						<View style={ styles.center }>
							<View style={ styles.tdot }></View>
							<View style={ styles.tdot }></View>
							<View style={ styles.tdot }></View>
						</View>
					</View>

					<View style={ {width: width, height: this.state.webViewHeight} }>
						<WebView
							ref={ webview => thisWebView = webview }
							style={ {flex: 1} }
							scrollEnabled={ false }
							onMessage={ this._onMessageIos }
							scalesPageToFit={ true }
							showsVerticalScrollIndicator={ false }
							source={ {html: goodsDetail.pgoods_body, baseUrl: ''} }
							automaticallyAdjustContentInsets={ true }
							javaScriptEnabled={ true }
							injectedJavaScript={ '(' + String(injectedScript) + ')();' }
						/>
					</View>
				</View>


				{ GoodsList.length > 0 && <View style={ styles.tuijian }>
					<Image
						style={ {width: width, height: pxToDp(58)} }
						resizeMode={ 'contain' }
						source={ require('../images/tuijian.png') }
					/>
					<View style={ styles.goods_wrap }>
						{ GoodsList.map((el, index) => {
							if(index < 4){
								return (<TouchableOpacity
									activeOpacity={ 1 }
									style={ styles.goods_item }
									onPress={ () => {
										this.props.navigation.push('PointsGoodsDetail', {gid: el.pgid})
									} }
								>
									<Image
										source={ {uri: el.pgoods_image} }
										resizeMode={ 'contain' }
										style={ {height: pxToDp(345), width: '100%'} }
										defaultSource={require('../../assets/images/default_icon_400.png')}
									/>
									<Text
										style={ styles.goods_name }
										numberOfLines={ 2 }
										ellipsizeMode={ 'tail' }
									>{ el.pgoods_name }</Text>
									<View style={ styles.bw }>
										<Text style={ {color: '#E62C2E', fontSize: pxToDp(28)} }>
											{ el.pgoods_points }积分
										</Text>
										<Text style={ {color: '#999999', fontSize: pxToDp(28)} }>
											售价：{ el.pgoods_points }
										</Text>
									</View>
								</TouchableOpacity>)
							}
						}) }
					</View>
				</View> }
			</ScrollView>

			<View style={ styles.footer }>
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ [ styles.footer_cart, {flex: 1} ] }
					onPress={ () => {
						this.props.navigation.navigate('PointsCart');
					} }
				>
					<Image
						resizeMode={ 'contain' }
						style={ {width: pxToDp(49), height: pxToDp(37)} }
						source={ require('../images/cart.png') }
					/>
					{ this.state.cartNum > 0 && <Text style={ styles.cart_num }>{ this.state.cartNum }</Text> }
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ [ styles.footer_cart, {width: pxToDp(280), backgroundColor: '#FFB629'} ] }
					onPress={ () => this.addCart() }
				>
					<Text style={ styles.footer_txt }>加入购物车</Text>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ [ styles.footer_cart, {width: pxToDp(280), backgroundColor: '#EE2328'} ] }
					onPress={ () => {
						this.animateStart();
					} }
				>
					<Text style={ styles.footer_txt }>立即兑换</Text>
				</TouchableOpacity>
			</View>

			{ goodsDetail != '' &&
			<Animated.View
				style={ [ styles.animate_pop_wrap, {
					bottom: this.state.InitWrapBottom,
					opacity: this.state.fadeInOpacity
				} ] }
			>
				<Animated.View
					style={ [ styles.pop_wrap, {
						bottom: this.state.InitBottom
					} ] }
				>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={{flex: 1}}
						onPress={ () => {} }
					>
						<View style={ styles.add_goods_info }>
							<View style={ styles.add_goods }>
								<View style={ styles.add_left }>
									<Image
										style={ {width: pxToDp(210), height: pxToDp(210)} }
										resizeMode={ 'contain' }
										source={ {uri: goodsDetail.goods_image} }
										defaultSource={require('../../assets/images/default_icon_400.png')}
									/>
								</View>
								<View style={ styles.add_info }>
									<Text
										style={ {color: '#181818', fontSize: pxToDp(30), marginBottom: pxToDp(30)} }
										ellipsizeMode={ 'tail' }
										numberOfLines={ 1 }>
										{ goodsDetail.pgoods_name }
									</Text>
									<Text style={ {
										color: '#BA1418',
										fontSize: pxToDp(32)
									} }>{ goodsDetail.pgoods_points }积分</Text>
								</View>
							</View>
							<TouchableOpacity
								style={ styles.close }
								activeOpacity={ 1 }
								onPress={ () => {
									this.close();
								} }
							>
								<Image
									style={ {width: pxToDp(30), height: pxToDp(30)} }
									resizeMode={ 'contain' }
									source={ require('../images/close.png') }
								/>
							</TouchableOpacity>

							<View style={ [ styles.bw, {marginTop: pxToDp(50)} ] }>
								<Text style={ {color: '#181818', fontSize: pxToDp(32)} }>数量</Text>
								<View style={ styles.btns }>
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => this.changeNum('desc') }
										style={ styles.btn }
									>
										<Image
											style={ {width: pxToDp(44), height: pxToDp(44)} }
											resizeMode={ 'contain' }
											source={ require('../images/reduce.png') }
										/>
									</TouchableOpacity>
									<Text
										style={ {
											width: pxToDp(76),
											textAlign: 'center',
											fontSize: pxToDp(34),
											color: '#333333'
										} }
									>{ this.state.addNum }</Text>
									<TouchableOpacity
										activeOpacity={ 1 }
										onPress={ () => this.changeNum('add') }
										style={ styles.btn }
									>
										<Image
											style={ {width: pxToDp(44), height: pxToDp(44)} }
											resizeMode={ 'contain' }
											source={ require('../images/add.png') }
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>

						<TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => this.submit() }
							style={ styles.submit_btn }
						>
							<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>立即购买</Text>
						</TouchableOpacity>
					</TouchableOpacity>
				</Animated.View>
			</Animated.View> }
			<SldShareCommon
				is_show_share={ this.state.is_show_share }
				data={ this.state.share_data }
				cancleShare={ () => this.cancleShare() }
			/>
		</View>)
	}
}

const injectedScript = function(){
	function waitForBridge(){
		if(window.postMessage.length !== 1){
			setTimeout(waitForBridge, 200);
		}else{
			document.body.style.overflowX = 'hidden';
			document.body.style.maxWidth = '100vw';
			let imgs = document.getElementsByName('img');
			for(let i = 0; i < imgs.length; i++){
				imgs[ i ].style.maxWidth = '100vh';
			}
			let height = 0;
			if(document.documentElement.scrollHeight > document.body.scrollHeight){
				height = document.documentElement.scrollHeight
			}else{
				height = document.body.scrollHeight
			}
			let data = {'type': 'auto_height', 'height': height};
			postMessage(JSON.stringify(data))
		}
	}

	waitForBridge();
};
