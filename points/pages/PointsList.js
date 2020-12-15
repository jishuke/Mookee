import React, {Component} from 'react'
import {
	View,
	DeviceEventEmitter,
	Platform,
	Text,
	DeviceInfo,
	Image,
	BackHandler,
	StyleSheet, TouchableOpacity,Dimensions
} from 'react-native'
import GlobalStyles from "../../assets/styles/GlobalStyles";
import ViewUtils from '../../util/ViewUtils'
import SldHeader from '../../component/SldHeader';
import RequestData from '../../RequestData';
import pxToDp from '../../util/pxToDp'
import LoadingWait from '../../component/LoadingWait';
import SldComStatusBar from "../../component/SldComStatusBar";
import SldFlatList from '../../component/SldFlatList';
import PriceUtil from '../../util/PriceUtil'

const {width:scrWidth,height} = Dimensions.get('window');

export default class PointsList extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '全部礼品',
			list: [],
			refresh: false,
			show_gotop: false,
		}
	}

	componentDidMount(){
		this.getHomeInfoNew();
		if(Platform.OS == 'android'){
			BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
		}
		this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.getHomeInfoNew();
		});
	}

	componentWillUnmount(){
		this.emitter.remove();
		if(Platform.OS == 'android'){
			BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
		}
	}

	//安卓返回键关闭APP
	onBackAndroid = () => {
		if(this.props.navigation.isFocused() && currentSceneTop == 'PointsHome'){//判读是否处于聚焦状态
			this.props.navigation.replace('Tab')//返回首页
			return true;
		}
	};

	getHomeInfoNew = () => {
		this.getCommend();
	}

	pn = 1;
	hasmore = true;
	getCommend = ()=>{
		RequestData.getSldData(AppSldUrl+'/index.php?app=index&mod=point_list&sld_addons=points&page=20&pn='+this.pn).then(res=>{
			if(res.state==200){
				let data = res.data.list;
				if(this.pn==1){
					this.setState({
						list: data
					})
				}else{
					let {list} = this.state;
					this.setState({
						list: list.concat(data)
					})
				}
			}
			if(res.hasmore){
				this.pn++;
			}else{
				this.hasmore = false;
			}
		})
	}

	addCart = (gid) => {
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			RequestData.postSldData(AppSldUrl + '/index.php?app=userorder&mod=addcart&sld_addons=points', {
				key, num: 1, gid
			}).then(res => {
				if(res.status == 200){
					ViewUtils.sldToastTip('加入购物车成功');
					DeviceEventEmitter.emit('updateCart');
				}else{
					ViewUtils.sldToastTip(res.msg);
				}
			}).catch(err => {
				ViewUtils.sldErrorToastTip(err);
			})
		}
	}

	goBuy = (gid) => {
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			this.props.navigation.navigate('PointsConfirmOrder', {ifcart: 0, cart_id: `${ gid }|1`});
		}
	}

	separatorComponent = () =>{
		return (
			<View style={ GlobalStyles.line }/>
		);
	}

	//下拉重新加载
	refresh = () =>{
		this.pn=1;
		this.hasmore=true;
		this.getCommend();//获取门店列表
	}

	getNewData = () =>{
		if(this.hasmore){
			this.getCommend();//获取门店列表
		}
	}

	handleScroll = (event) =>{
		let offset_y = event.nativeEvent.contentOffset.y;
		let {show_gotop} = this.state;
		if(!show_gotop && offset_y > 100){
			show_gotop = true
		}
		if(show_gotop && offset_y < 100){
			show_gotop = false
		}
		this.setState({
			show_gotop: show_gotop,
		});

	}

	keyExtractor = (item, index) =>{
		return index
	}

	render(){
		const {title,list,refresh, show_gotop} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation }/>
				{/*/!*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*!/*/}
				<SldHeader title={ title }
				           left_icon={ require('../../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ GlobalStyles.line }/>
				{
					this.state.showWait ? (
						<LoadingWait loadingText={ "加载中..." } cancel={ () => this.setState({showWait: false}) }/>
					) : (null)
				}
				<SldFlatList
					horizontal={false}
					numColumns={2}
					data={ list }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (val) => {
						return <TouchableOpacity activeOpacity={ 1 }
						                         onPress={ () => ViewUtils.goPointsGoodsDetail ( this.props.navigation , val.pgid ) }
						                         key={ val.pgid }>
							<View style={ styles.tjsp_small_part }>
								<Image resizeMode='contain' style={ styles.tjsp_small_part_img }
								       source={ { uri : val.pgoods_image } }/>

								<Text ellipsizeMode='tail' numberOfLines={ 1 }
								      style={ [ styles.tjsp_small_part_name , GlobalStyles.sld_global_font ] }>{ val.pgoods_name }</Text>
								<View style={styles.bw}>
									<Text
										style={ [ styles.dapei_part_price , GlobalStyles.sld_global_fontfamliy ] }>
										{ val.pgoods_points }积分
									</Text>
									<Text style={styles.dapei_money_txt}>售价：ks{PriceUtil.formatPrice(val.pgoods_price)}</Text>
								</View>

								<View style={styles.diy_cart_wrap}>
									<View style={styles.diy_cart}>
										<TouchableOpacity
											style={styles.diy_cart_left}
											activeOpacity={1}
											onPress={()=>this.addCart(val.pgid)}
										>
											<Image
												resizeMode={'contain'}
												style={{width: pxToDp(30),height: pxToDp(30)}}
												source={require('../images/cart_r.png')}
											/>
										</TouchableOpacity>
										<TouchableOpacity
											style={styles.diy_cart_right}
											activeOpacity={1}
											onPress={()=>this.goBuy(val.pgid)}
										>
											<Text style={{color: '#FEFEFE',fontSize: pxToDp(24)}}>立即兑换</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					} }
				/>

			</View>)
	}
}

const styles = StyleSheet.create({
	homeMainCon:{
		marginTop: Platform.OS === 'ios' ? (0) : 0,
		height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated?pxToDp(150):pxToDp(150)) : 55,
	},

	tjsp_small_part_name : {
		width : ( scrWidth - 45 ) / 2 ,
		fontSize : pxToDp ( 32 ) ,
		color : main_title_color ,
		marginTop : 10 ,
	} ,
	tjsp_small_part_img : {
		width : ( scrWidth - 45 ) / 2 ,
		height : ( scrWidth - 45 ) / 2 ,
		borderColor : border_color ,
		borderWidth : 0.5 ,
	} ,
	tjsp_small_part : {
		width : ( scrWidth - 45 ) / 2 ,
		flexDirection : 'column' ,
		marginLeft : 15 ,
		marginBottom : 10 ,
	} ,
	tjsp_small_wrap : {
		flexDirection : 'row' ,
		flexWrap : 'wrap' ,
		backgroundColor : '#fff' ,
	} ,
	dapei_money_txt:{
		fontSize: pxToDp(20),
		color: '#726F6F'
	},
	bw:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: pxToDp(20)
	},
	diy_cart_wrap:{
		paddingHorizontal: pxToDp(15),
		marginTop: pxToDp(20),
		paddingBottom: pxToDp(15)
	},
	diy_cart:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(50),
		borderRadius: pxToDp(25),
		overflow: 'hidden',
		borderStyle: 'solid',
		borderColor: '#EE2328',
		borderWidth: pxToDp(1),
	},
	diy_cart_left:{
		flex: 1,
		height: pxToDp(50),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	diy_cart_right: {
		flex: 1,
		height: pxToDp(50),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#EE2328'
	},
	goods_title:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(88),
		backgroundColor: '#fff',
		paddingHorizontal: pxToDp(20)
	},
	title:{
		flexDirection: 'row',
		alignItems: 'center',
	},
	line:{
		width: pxToDp(6),
		height: pxToDp(20),
		backgroundColor: '#F14347',
		marginRight: pxToDp(20)
	},
	navigate:{
		flexDirection: 'row',
		alignItems: 'center'
	},
	img:{
		width: pxToDp(10),
		height: pxToDp(15),
		marginLeft: pxToDp(10)
	}
});
