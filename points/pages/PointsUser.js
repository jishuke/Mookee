import React, {Component} from 'react'
import {
	Dimensions,
	View,
	ImageBackground,
	Image,
	Text,
	TouchableOpacity,
	StyleSheet,
	DeviceEventEmitter
} from 'react-native'
import GlobalStyles from "../../assets/styles/GlobalStyles";
import ViewUtils from '../../util/ViewUtils'
import SldHeader from '../../component/SldHeader';
import RequestData from '../../RequestData';
import pxToDp from '../../util/pxToDp'
import SldFlatList from "../../component/SldFlatList";
import SldComStatusBar from "../../component/SldComStatusBar";

const {width, height} = Dimensions.get('window');

let pn = 1;
let hasmore = true;

export default class PointsUser extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '积分中心',
			navItem: 'all',
			pointsList: [],
			isLoading: 0,
			userPoints: 0,
			refresh: false,
			show_gotop: false,
		}
	}

	componentDidMount(){
		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			this.lister = DeviceEventEmitter.addListener('UserPoints',()=>{
				this.initData();
			});
			this.emitter = DeviceEventEmitter.addListener('updateNetWork', () => {
				this.initData();
			});
			this.initData();
		}
	}

	componentWillUnmount() {
		this.lister.remove();
		this.emitter.remove();
	}

	initData(){
		this.getUserPoints();
		this.getPointsList();
	}


	// 获取个人积分
	getUserPoints(){
		let url = AppSldUrl + '/index.php?app=points_member_center&mod=getUserMemberInfo&&sld_addons=points&key=' + key;
		RequestData.getSldData(url).then(res => {
			if(res.status == 200){
				this.setState({
					userPoints: res.data
				})
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
		})
	}

	// 获取积分列表
	getPointsList(){
		const {navItem} = this.state;
		let url = AppSldUrl + '/index.php?app=points_member_center&mod=getUserPointsDesc&sld_addons=points&key=' + key + '&type=' + navItem + '&page=10&pn=' + pn;
		RequestData.getSldData(url).then(res => {
			if(res.status == 200){
				if(pn == 1){
					this.setState({
						pointsList: res.data.list?res.data.list:[],
						isLoading: 1,
					})
				}else{
					let {pointsList} = this.state;
					this.setState({
						pointsList: pointsList.concat(res.data.list),
					})
				}
				if(res.data.ishasmore.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
			}else{
				this.setState({
					isLoading: 1,
				})
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(err);
			this.setState({
				isLoading: 1,
			})
		})
	}

	// 切换分类
	changeNav = (nav) => {
		let {navItem} = this.state;
		if(navItem == nav) return;
		this.setState({
			navItem: nav,
			isLoading: 0,
			pointsList: []
		}, () => {
			pn = 1;
			hasmore = true;
			this.getPointsList();
		})
	}

	refresh = () => {
		pn = 1;
		hasmore = true;
		this.getPointsList();
		this.getUserPoints();
	}

	getNewData = () => {
		if(hasmore){
			this.getPointsList()
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

	separatorComponent = () => {
		return (
			<View style={ styles.line }/>
		);
	}

	renderItem = (item) => {
		return (<View style={ styles.p_item }>
			<Text style={ {color: '#EC9915', fontSize: pxToDp(32)} }>{ item.points }积分</Text>
			<Text style={ {marginVertical: pxToDp(20), color: '#616060', fontSize: pxToDp(24)} }>{ item.pl_desc }</Text>
			<Text style={ {color: '#616060', fontSize: pxToDp(24)} }>{ item.time }</Text>
		</View>)
	}


	render(){
		const {title, navItem, pointsList, isLoading, refresh, show_gotop} = this.state;
		return (<View style={ GlobalStyles.sld_container }>
			<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
			{/*{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : '#fff', pxToDp(40)) }*/}
			<SldHeader title={ title }
			           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
			<View style={ GlobalStyles.line }/>

			<ImageBackground
				style={ styles.user_top }
				source={ require('../images/pbg.png') }
			>
				<Text style={ {
					color: '#fff',
					fontSize: pxToDp(24),
					paddingVertical: pxToDp(20),
					paddingLeft: pxToDp(35)
				} }>积分规则</Text>
				<View style={ styles.points }>
					<Image
						resizeMode={ 'contain' }
						style={ {
							width: pxToDp(30),
							height: pxToDp(30),
							marginRight: pxToDp(15),
							marginTop: pxToDp(10)
						} }
						source={ require('../images/points.png') }
					/>
					<Text style={ {color: '#fff', fontSize: pxToDp(60)} }>{ this.state.userPoints }</Text>
				</View>
			</ImageBackground>

			<View style={ styles.logo }>
				<Image
					resizeMode={ 'contain' }
					style={ {width: pxToDp(710), height: pxToDp(170)} }
					source={ require('../images/logo.png') }
				/>
			</View>

			<View style={ styles.list }>
				<Text style={ styles.title }>积分明细</Text>
				<View style={ styles.nav }>
					<TouchableOpacity
						style={ [ styles.nav_item, (navItem == 'all' ? (styles.nav_on) : '') ] }
						activeOpacity={ 1 }
						onPress={ () => this.changeNav('all') }
					>
						<Text
							style={ {
								fontSize: pxToDp(28),
								color: navItem == 'all' ? '#F94B2E' : '#393939',
							} }
						>全部</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={ [ styles.nav_item, (navItem == 'add' ? (styles.nav_on) : '') ] }
						activeOpacity={ 1 }
						onPress={ () => this.changeNav('add') }
					>
						<Text
							style={ {
								fontSize: pxToDp(28),
								color: navItem == 'add' ? '#F94B2E' : '#393939',
							} }
						>收入</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={ [ styles.nav_item, (navItem == 'desc' ? (styles.nav_on) : '') ] }
						activeOpacity={ 1 }
						onPress={ () => this.changeNav('desc') }
					>
						<Text
							style={ {
								fontSize: pxToDp(28),
								color: navItem == 'desc' ? '#F94B2E' : '#393939',
							} }
						>支出</Text>
					</TouchableOpacity>
				</View>

				{ pointsList.length > 0 && <SldFlatList
					data={ pointsList }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderItem(item) }
				/> }

				{ pointsList.length == 0 && isLoading == 1 && <View style={ {flex: 1, justifyContent: 'center'} }>
					{ ViewUtils.noData() }
				</View> }

			</View>
		</View>)
	}
}

const styles = StyleSheet.create({
	user_top: {
		width: width,
		height: pxToDp(188),
	},
	points: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logo: {
		padding: pxToDp(20),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	list: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: pxToDp(20)
	},
	title: {
		fontSize: pxToDp(30),
		color: '#181818',
		paddingLeft: pxToDp(30),
		lineHeight: pxToDp(42)
	},
	nav: {
		height: pxToDp(80),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		borderBottomWidth: pxToDp(0.6),
		borderBottomColor: '#DADADA',
		borderStyle: 'solid'
	},
	nav_item: {
		height: pxToDp(80),
		justifyContent: 'center',
		paddingHorizontal: pxToDp(30),
		borderBottomColor: 'transparent',
		borderBottomWidth: pxToDp(4),
		borderStyle: 'solid',
	},
	nav_on: {
		borderBottomColor: '#F94B2E',
	},
	p_item: {
		paddingHorizontal: pxToDp(25),
		paddingVertical: pxToDp(30)
	},
	line: {
		height: pxToDp(0.6),
		backgroundColor: '#DADADA',
	}
})
