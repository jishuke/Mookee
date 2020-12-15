/*
 * 推荐商品
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, Dimensions, Text, TouchableOpacity
} from 'react-native';
import CountEmitter from "../util/CountEmitter";
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import SldHeader from '../component/SldHeader';
import SldFlatList from '../component/SldFlatList';
import StorageUtil from "../util/StorageUtil";
import PriceUtil from '../util/PriceUtil'

const {width, height} = Dimensions.get ('window');
const pageSize = 10;
export default class ChatRecGoods extends Component{
	constructor (props){
		super (props);
		this.state = {
			title: props.navigation.state.params.title,
			sle_type: props.navigation.state.params.sle_type ? props.navigation.state.params.sle_type : 'rec',//rec为推荐商品，foot为足迹
			visiter_id: props.navigation.state.params.visiter_id,//店铺id
			data: [],//数据列表
			refresh: false,
			pn: 1,//当前页面
			hasmore: true,//是否还有数据
			show_gotop: false,
			flag: 0
		}
	}

	componentDidMount (){
		const navigation = this.props.navigation;
		const {sle_type} = this.state;
		if (key){
			if (sle_type == 'rec'){
				this.getRecGoods ();
			}else{
				this.getFootGoods ();
			}
		}else{
			ViewUtils.navDetailPage (navigation, 'Login');
		}
	};

	//获取推荐商品
	getRecGoods = (type = 0) =>{
		let {pn, data, hasmore, refresh, visiter_id} = this.state;
		if (type == 1){
			pn = 1;
		}
		RequestData.getSldData (AppSldUrl + "/index.php?app=usercenter&mod=goods_commend&key=" + key + '&pn=' + pn + "&page=" + pageSize + '&vid=' + visiter_id)
			.then (result =>{
				if (result.status != 200){
					this.setState ({
						refresh: false,
						flag: 1,
					});
				}else{
					if (refresh){
						refresh = false;
					}
					if (pn == 1){
						data = result.data;
					}else{
						data = data.concat (result.data);
					}
					if (pn < result.ismore.page_total){
						pn = pn + 1;
						hasmore = true;
					}else{
						hasmore = false;
					}
					this.setState ({
						pn: pn,
						data: data,
						hasmore: hasmore,
						refresh: refresh,
						flag: 1,
					});
				}

			})
			.catch (error =>{
				this.setState ({
					refresh: false,
					flag: 1,
				});
				ViewUtils.sldErrorToastTip(error);
			})
	}
	//获取会员在我店铺的足迹
	getFootGoods = (type = 0) =>{
		let {pn, data, hasmore, refresh, visiter_id} = this.state;
		if (type == 1){
			pn = 1;
		}
		RequestData.getSldData (AppSldUrl + "/index.php?app=usercenter&mod=footprint&key=" + key + '&pn=' + pn + "&page=" + pageSize + '&vid=' + visiter_id)
			.then (result =>{
				if (result.status != 200){
					this.setState ({
						refresh: false,
						flag: 1,
					});
				}else{
					if (refresh){
						refresh = false;
					}
					if (pn == 1){
						data = result.data;
					}else{
						data = data.concat (result.data);
					}
					if (pn < result.ismore.page_total){
						pn = pn + 1;
						hasmore = true;
					}else{
						hasmore = false;
					}
					this.setState ({
						pn: pn,
						data: data,
						hasmore: hasmore,
						refresh: refresh,
						flag: 1,
					});
				}

			})
			.catch(error => {
				this.setState({
					refresh:false,
					flag:1,
				});
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//下拉重新加载
	refresh = () => {
		const {sle_type} = this.state;
		if(sle_type=='rec'){
			this.getRecGoods(1);//获取推荐商品列表数据
		}else{
			this.getFootGoods(1);//获取足迹列表数据
		}
	}

	分页
	getNewData = () => {
		const {hasmore,sle_type} = this.state;
		if (hasmore) {
			if(sle_type=='rec'){
				this.getRecGoods();//获取推荐商品列表数据
			}else{
				this.getFootGoods();//获取足迹列表数据
			}

		}
	}

	handleScroll = (event) => {
		let offset_y = event.nativeEvent.contentOffset.y;
		let {show_gotop} = this.state;
		if(!show_gotop&&offset_y > 100){
			show_gotop = true
		}
		if(show_gotop&&offset_y < 100){
			show_gotop = false
		}
		this.setState({
			show_gotop:show_gotop,
		});

	}

	keyExtractor = (item,index) => {
		return index
	}

	//发送商品
	sendGoods = (item) => {
		//存缓存
		let goodsInfo = {};
		goodsInfo.type = 'goods';
		goodsInfo.goods_name = item.goods_name;
		goodsInfo.img = item.goods_image;//图片的绝对路径
		goodsInfo.price = item.show_price;
		goodsInfo.gid = item.gid,//商品id
		goodsInfo.salse_num = item.goods_salenum;//销量
		goodsInfo.storage = item.goods_storage;//库存
		StorageUtil.set('sendGoodsInfo', JSON.stringify(goodsInfo),()=>{
			CountEmitter.emit('sendGoods');
			this.props.navigation.pop(1);
		});

	}

	renderCell = (item) => {
		return (
			<View style={{
				width: width,
				height: pxToDp (180),
				padding: pxToDp (20),
				backgroundColor: '#fff',
				marginTop: 10,
				flexDirection: 'row',
				justifyContent: 'flex-start'
			}}>
				{ViewUtils.getSldImg (140, 140, {uri: item.goods_image})}
				<View style={{
					flex: 1,
					marginLeft: pxToDp (26),
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'flex-start'
				}}>
					<Text numberOfLines={2} style={{
						color: '#121212',
						fontSize: pxToDp (26),
						fontWeight: '400',
						lineHeight: pxToDp (32),
						marginRight: pxToDp (43),
						height: pxToDp (60)
					}}>{item.goods_name}</Text>


					<View style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
						width: '100%',
						marginTop: pxToDp (10)
					}}>
						<View style={{flexDirection: 'column', justifyContent: 'flex-start'}}>
							<Text style={{
								color: '#666666',
								fontSize: pxToDp (22),
								fontWeight: '400'
							}}>销量{item.goods_salenum} 库存{item.goods_storage}</Text>
							<Text style={{
								color: '#FF1F1F',
								fontSize: pxToDp (28),
								fontWeight: '400',
								marginTop: pxToDp (5)
							}}>ks{PriceUtil.formatPrice(item.show_price)}</Text>
						</View>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() =>{
								this.sendGoods (item);
							}}
							style={[{
								width: pxToDp (120),
								height: pxToDp (54),
								borderRadius: pxToDp (4),
								borderColor: '#C9C9C9',
								borderWidth: 0.5
							}, GlobalStyles.flex_common_row]}>
							<Text style={{color: '#333', fontWeight: '400', fontSize: pxToDp (22)}}>发送</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

		);
	}

	//分割线组件
	separatorComponent = () =>{
		return (
			<View style={{width:0}} />
		);
	}

	//选择推荐分类
	seleType = (type) => {
		this.setState({
			sle_type:type
		},()=>{
			if(type == 'rec'){
				this.getRecGoods(1);
			}else{
				this.getFootGoods(1);
			}
		});
	}

	render (){
		const {title, sle_type, visiter_id, data, refresh, show_gotop, flag} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={title} left_icon={require ('../assets/images/goback.png')}
				           left_event={() => ViewUtils.sldHeaderLeftEvent (this.props.navigation)}/>
				<View style={GlobalStyles.line}/>

				<View style={{
					width: width,
					height: pxToDp (100),
					backgroundColor: '#fff',
					padding: pxToDp (20),
					paddingBottom: 0,
					flexDirection: 'column',
					justifyContent: 'space-between'
				}}>
					<View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() =>{
								this.seleType ('rec')
							}}
							style={[{
								width: pxToDp (175),
								height: pxToDp (60),
								borderBottomWidth: pxToDp (3),
								borderColor: sle_type == 'rec' ? '#1789E6' : '#fff'
							}, GlobalStyles.flex_common_row]}>
							<Text style={{
								color: sle_type == 'rec' ? '#1789E6' : '#121212',
								fontSize: pxToDp (28),
								fontWeight: '400'
							}}>商品推荐</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() =>{
								this.seleType ('foot')
							}}
							style={[{
								width: pxToDp (175),
								height: pxToDp (60),
								borderBottomWidth: pxToDp (3),
								borderColor: sle_type == 'foot' ? '#1789E6' : '#fff'
							}, GlobalStyles.flex_common_row]}>

							<Text style={{
								color: sle_type == 'foot' ? '#1789E6' : '#121212',
								fontSize: pxToDp (28),
								fontWeight: '400'
							}}>我的足迹</Text>
						</TouchableOpacity>
					</View>
				</View>

				{(flag==1&&data.length==0)&&ViewUtils.SldEmptyTip(require('../assets/images/emptysldgoods.png'),"暂无数据")}
				<SldFlatList
					data={data}
					refresh_state={refresh}
					show_gotop={show_gotop}
					refressing={true}
					refresh={() =>this.refresh()}
					keyExtractor={() =>this.keyExtractor()}
					handleScroll={(event) =>this.handleScroll(event)}
					getNewData={() =>this.getNewData()}
					separatorComponent={() =>this.separatorComponent()}
					renderCell={(item) =>this.renderCell(item)}
				/>

			</View>
		)
	}
}
