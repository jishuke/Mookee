import React, {Component} from 'react'
import {
	ScrollView,
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
import DiyPage from "./PointsDiyPage";
import LoadingWait from '../../component/LoadingWait';
import SldComStatusBar from "../../component/SldComStatusBar";
import SldFlatList from '../../component/SldFlatList';
import PriceUtil from '../../util/PriceUtil'

const {width:scrWidth,height} = Dimensions.get('window');
var mainPage = {};//界面数组
let lp = 0;
let all_data = [];
let new_data = [];
let page_size = 10;
let hasmore = true;
let cur_pn = 0;
let total_page = 0;
let num_more = 0;//取余，多出来的数据
let update = false;
const STATUS_BAR_HEIGHT = 30;
export default class PointsHome extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '积分商城',
			diy_data: [],//存放所有的装修改数据
			flag: true,
			num: 1,
			showWait: false,
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
		if(diy_data_info_points.length > 0){
			all_data = diy_data_info_points;
			total_page = diy_data_info_points.length / page_size;
			num_more = diy_data_info_points.length % page_size;
			if(diy_data_info.length > page_size){
				hasmore = true;
			}else{
				hasmore = false;
			}
			this.combineData();
		}
		this.getCommend();
	}

	pn = 1;
	hasmore = true;
	getCommend = ()=>{
		RequestData.getSldData(AppSldUrl+'/index.php?app=index&mod=point_list&sld_addons=points&is_commend=1&page=20&pn='+this.pn).then(res=>{
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

	//组装数据
	combineData = () => {
		update = true;
		for(let j = cur_pn * page_size; (j < (cur_pn + 1) * page_size) && (j < all_data.length); j++){
			new_data = new_data.concat(all_data[ j ])
		}
		this.handleData(new_data);
	}

	handleData = (datainfo) => {
		for(let i = 0; i < datainfo.length; i++){
			if(datainfo[ i ][ 'type' ] == 'lunbo'){
				let new_data = datainfo[ i ][ 'data' ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
			}else if(datainfo[ i ][ 'type' ] == 'dapei'){
				let new_data = datainfo[ i ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
			}else if(datainfo[ i ][ 'type' ] == 'tupianzuhe'){
				if(datainfo[ i ][ 'sele_style' ] == 0){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ]);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 1){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], scrWidth * 1 - 20);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 2){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 30) / 2));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 3){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 40) / 3));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 4){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor(datainfo[ i ][ 'data' ][ j ][ 'width' ] * 16 / 15);
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 4);
						}
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 5){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0 || j == 3){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = scrWidth * 1 - 30 - Math.floor((scrWidth * 1 - 30) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 3);
						}
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 6){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0 || j == 3){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 4);
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 7){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 4){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 40) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 40) / 10 * 7);
						}else{
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 40) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}
					}
				}
			}
		}
		this.setState({
			diy_data: datainfo
		});
	}


	onHandleTouchMove = () => {
		//获取数据
		if(hasmore){
			cur_pn = cur_pn + 1;
			this.combineData();
			if(cur_pn >= total_page){
				hasmore = false;
			}else{
				hasmore = true;
			}
		}
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
					this.props.navigation.navigate('PointsCart');
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
				alert(1)
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
		const {title, diy_data,list,refresh, show_gotop} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation }/>
				{/*/!*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*!/*/}
				<SldHeader title={ title } left_icon={ require('../images/gohome.png') }
				           left_event={ () => {
					           this.props.navigation.navigate('Tab');
				           } }/>
				<View style={ GlobalStyles.line }/>
				{
					this.state.showWait ? (
						<LoadingWait loadingText={ "加载中..." } cancel={ () => this.setState({showWait: false}) }/>
					) : (null)
				}
				<ScrollView
					style={ [{
						flex: 1
					}] }
					onTouchStart={ () => this.onHandleTouchMove() }
				>
					{ diy_data.length > 0 &&
					diy_data.map((item, index) => {
						return (<DiyPage
							key={ index }
							navigation={ this.props.navigation }
							data={ item }
							addCart={ gid => this.addCart(gid) }
							goBuy={ gid => this.goBuy(gid) }
						/>)
					})
					}

					<View style={styles.goods_title}>
						<View style={styles.title}>
							<View style={styles.line}></View>
							<Text style={{color: '#333333',fontweight: '600',fontSize: pxToDp(30)}}>推荐礼品</Text>
						</View>

						<TouchableOpacity
							style={styles.navigate}
							activeOpacity={1}
							onPress={()=>{
								this.props.navigation.navigate('PointsList')
							}}
						>
							<Text style={{color: '#949494',fontSize: pxToDp(22)}}>查看全部礼品</Text>
							<Image style={styles.img} source={require('../../assets/images/jtt_r.png')} resizeMode={'contain'}/>
						</TouchableOpacity>
					</View>

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

					{/*{ diy_data.length == 0 && <View style={ {flex: 1, justifyContent: 'center', alignItems: 'center'} }>
						<Image
							style={ {
								width: pxToDp(243),
								height: pxToDp(243),
								marginTop: pxToDp((scrHeight - 200) / 2)
							} }
							resizeMode={ 'contain' }
							source={ require('../images/diydata.png') }
						/>
						<Text style={ {fontSize: pxToDp(28), marginTop: pxToDp(30)} }>首页还未装修</Text>
					</View> }*/}
				</ScrollView>

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
