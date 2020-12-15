import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Image, Dimensions
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import pxToDp from "../util/pxToDp";
import ViewUtils from "../util/ViewUtils";
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import DiyPage from "../component/DiyPage";
import SldFlatList from '../component/SldFlatList';
import {I18n} from './../lang/index'

const scrWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class PreSaleItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			diy_data: props.diy_data,//存放所有的装修改数据
			showWait: false,
			refresh: false,
			data: [],//
			pn: 1,//当前页面
			hasmore: true,//是否还有数据
			show_gotop: false,
			is_request: false,
			flag: 0,
			CatList: [],    // 预售分类
			PresaleList: [],   // 预售列表
			class_id: props.catid,    // 当前预售分类id
			isLoading: true
		}
	}


	componentDidMount(){
		this.initData();
	}

	initData(){
		this.getPresaleList();
	}

	// 获取预售列表
	getPresaleList(){
		let {class_id, pn} = this.state;
		RequestData.getSldData(AppSldUrl + `/index.php?app=goods&mod=index&sld_addons=presale&class_id=${ class_id }&page=10&pn=${ pn }`).then(res => {
			if(res.status == 200){
				let {hasmore, PresaleList} = this.state;
				if(pn == 1){
					PresaleList = res.data.list;
				}else{
					PresaleList = PresaleList.concat(res.data.list);
				}

				if(res.data.ismore.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
				this.setState({
					pn: pn,
					hasmore: hasmore,
					PresaleList: PresaleList
				})
			}
			this.setState({
				isLoading: false
			})
		}).catch(error => {
			this.setState({
				isLoading: false
			})
			ViewUtils.sldErrorToastTip(error);
		})
	}

	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.line }/>
		);
	}

	renderCell = (item) => {
		return (
			<TouchableOpacity
				style={ styles.goods_item }
				activeOpacity={ 1 }
			>
				<View style={ styles.imgWrap }>
					<Image
						style={ styles.img }
						source={ {uri: item.pre_pic} }
						resizeMode={ 'contain' }
						defaultSource={require('../assets/images/default_icon_124.png')}
					>
					</Image>
				</View>
				<View style={ styles.goods_info }>
					<Text
						style={ styles.name }
						ellipsizeMode={ 'tail' }
						numberOfLines={ 2 }
					>{ item.goods_name }</Text>
					<View style={ styles.info }>
						<View>
							<View>
								<Text style={ styles.price }>{I18n.t('GoodsDetailNew.PriceofPresell')}：Ks{ item.pre_sale_price }</Text>
							</View>
							<View style={ styles.old_price }>
								<Text style={ styles.old_price_txt }>{I18n.t('TuanGou.Originalprice')}：</Text>
								<Text
									style={ [ styles.old_price_txt, {textDecorationLine: 'line-through'} ] }>Ks{ item.goods_price }</Text>
							</View>
						</View>

						<LinearGradient colors={ [ '#F9132E', '#FF833F' ] } style={ styles.btn }>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={ () => {
									this.props.navigation.navigate('GoodsDetailNew', {gid: item.gid})
								} }
							>
								<Text style={ styles.btn_txt }>{I18n.t('LdjStore.text4')}</Text>
							</TouchableOpacity>
						</LinearGradient>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
	//下拉重新加载
	refresh = () => {
		this.setState({
			pn: 1,
			hasmore: true
		}, () => {
			this.getPresaleList();
		})
	}

	getNewData = () => {
		const {hasmore} = this.state;
		if(hasmore){
			this.getPresaleList();
		}
	}

	handleScroll = (event) => {
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

	keyExtractor = (item, index) => {
		return index
	}


	render(){
		const {PresaleList, refresh, show_gotop, diy_data} = this.state;
		return (
			<ScrollView>
				{
					diy_data.length > 0 &&
					diy_data.map((item, index) => {
						return (<DiyPage key={ index } navigation={ this.props.navigation } data={ item }/>)
					})
				}
				<SldFlatList
					data={ PresaleList }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderCell(item) }
				/>

				{!this.state.isLoading && PresaleList.length==0 && <View style={{height: height-pxToDp(200) ,alignItems: 'center',justifyContent: 'center'}}>
					<Image
						style={{width: pxToDp(243),height: pxToDp(243)}}
						resizeMode={'contain'}
						source={require('../assets/images/jttempty.png')}
					/>
					<Text style={{color:'#999999',fontSize: pxToDp(28),marginTop: pxToDp(40)}}>{I18n.t('LdjStore.text3')}</Text>
				</View>}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	goods_item: {
		flexDirection: 'row',
		height: pxToDp(240),
		backgroundColor: '#fff',
		padding: pxToDp(20),
		marginHorizontal: pxToDp(26),
		marginTop: pxToDp(10)
	},
	imgWrap: {
		width: pxToDp(200),
		height: pxToDp(200),
		marginRight: pxToDp(16),
	},
	img: {
		width: pxToDp(200),
		height: pxToDp(200),
	},
	goods_info: {
		width: pxToDp(450),
		justifyContent: 'space-between',
	},
	name: {
		color: '#000',
		fontSize: pxToDp(28),
		lineHeight: pxToDp(36)
	},
	info: {
		width: pxToDp(450),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	btn: {
		alignItems: 'center',
		justifyContent: 'center',
		width: pxToDp(142),
		height: pxToDp(50),
		borderRadius: pxToDp(25),
	},
	btn_txt: {
		color: '#fff',
		fontSize: pxToDp(24),
	},
	price: {
		color: '#FE011D',
		fontSize: pxToDp(26),
		marginBottom: pxToDp(5)
	},
	old_price_txt: {
		color: '#999999',
		fontSize: pxToDp(20)
	},
	old_price: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	info_r: {
		width: pxToDp(142),
		height: pxToDp(50),
	}
})
