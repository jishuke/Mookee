import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	Dimensions, DeviceEventEmitter, Platform
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import SldComStatusBar from '../component/SldComStatusBar';
import SldHeader from '../component/SldHeader';
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import PinLadderItem from './PinLadderItem';
import {I18n} from './../lang/index'
const scrWidth = Dimensions.get('window').width;
const psColor = '#111111';

export default class PinLadder extends Component{
	constructor(props){
		super(props);
		this.state = {
			title:I18n.t('MyScreen.PinLadderOrder'),
			diy_data: [],//存放所有的装修改数据
			showWait: false,
			refresh: false,
			data: [],//
			pn: 1,//当前页面
			hasmore: true,//是否还有数据
			show_gotop: false,
			is_request: false,
			flag: 0,
			CatList: [ {
				class_name:I18n.t('home') ,
				id: "",
				is_show: "1",
				sort: "3"
			} ],    // 预售分类
			PresaleList: [],   // 预售列表
			class_id: '',    // 当前预售分类id
			curtab: 0
		}
	}
	extend_param_str = '';

	componentDidMount(){
		if(CitySite.bid!=undefined&&CitySite.bid>0){
			this.extend_param_str = '&bid='+CitySite.bid;
		}
		this.initData();
		this.lis_network = DeviceEventEmitter.addListener('updateNetWork', () => {
			this.initData();
		});
	}

	initData(){
		this.getDiyData();
		this.getPresaleCat();
	}

	componentWillUnmount(){
		this.lis_network.remove()
	}

	getDiyData = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=index_data&sld_addons=pin_ladder'+this.extend_param_str).then(res => {
			if(res.code == 200){
				this.handleData(res.datas.tmp_data);
			}
		}).catch(err => {

		})
	}

	// 获取预售分类
	getPresaleCat(){
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=index&sld_addons=pin_ladder').then(res => {
			if(res.status == 200){
				let {CatList} = this.state;
				this.setState({
					CatList: CatList.concat(res.data),
				})
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		})
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

	onChangeTab(obj){
		this.setState({
			curtab: obj.i
		})
	}

	render(){
		const {diy_data, title, CatList} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } color={ psColor }/>
				{ ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : psColor, pxToDp(40)) }
				<SldHeader title={ title } title_color={ '#fff' } bgColor={ psColor }
				           left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>

				{ CatList.length > 0 && <ScrollableTabView
					style={ {height: 0.5, backgroundColor: '#e5e5e5'} }
					tabBarPosition='top'
					page={ this.state.curtab }
					renderTabBar={ () => <ScrollableTabBar/> }
					tabBarBackgroundColor='#fff'
					tabBarActiveTextColor='#EE1B21'
					tabBarInactiveTextColor='#353535'
					tabBarTextStyle={ [ {fontSize: pxToDp(30)}, GlobalStyles.sld_global_font ] }
					tabBarUnderlineStyle={ styles.tabBarUnderline }
					onChangeTab={ (obj) => {
						this.onChangeTab(obj)
					} }
				>
					{
						CatList.map((item, index) => {
							return (<PinLadderItem
								tabLabel={ item.class_name }
								key={ index }
								navigation={ this.props.navigation }
								catid={ item.id }
								position={ index }
								diy_data={ item.id == '' ? diy_data : [] }
							/>)
						})
					}

				</ScrollableTabView> }
			</View>
		)
	}
}

const styles = StyleSheet.create({
	nav: {
		height: pxToDp(80),
		backgroundColor: psColor,
	},
	navItem: {
		width: scrWidth / 6,
		height: pxToDp(80)
	},
	nav_txt: {
		textAlign: 'center',
		lineHeight: pxToDp(60),
		color: 'rgba(255,255,255,0.8)',
		fontSize: pxToDp(24),
	},
	nav_on: {
		color: '#fff',
		fontSize: pxToDp(26),
		borderBottomColor: '#fff',
		borderBottomWidth: pxToDp(1),
		borderStyle: 'solid'
	},
	tabBarUnderline: {
		backgroundColor: '#EE1B21',
		height: 2,
	},
})
