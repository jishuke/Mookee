/*
 * 拼团首页
 * @slodon
 * */
import React, {Component} from 'react';
import { Platform, StyleSheet, View} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import PinTuan from "../component/PinTuan";
import ViewUtils from '../util/ViewUtils';
import SldHeader from '../component/SldHeader';

var Dimensions = require('Dimensions');
const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;

import {I18n} from './../lang/index'

export default class PinTuanHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title :I18n.t('MyScreen.PinTuanOrder') ,//页面标题
			diy_data:[],//存放所有的装修改数据
			curtab: 0,
			labela: [],
			is_show:false,
		}
	}

	onChangeTab(obj) {
		this.setState({
			curtab: obj.i
		})
	}

	componentDidMount() {
		//获取所有分类
		this.get_all_cat();
	}
	get_all_cat = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=index&sld_addons=pin')
			.then(result => {
				if(result.code == '200'){
					let datainfo = result.datas.types;
					let allcats = [{type: 'home',id:0, sld_typename:I18n.t('home') }]
					let allcat = allcats.concat(datainfo);
					this.setState({
						labela: allcat,
						is_show:true,
					});
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}



	render() {
		let {labela,title,is_show} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={GlobalStyles.line} />
				{is_show&&
				<ScrollableTabView
					style={{height: 0.5, backgroundColor: '#e5e5e5'}}
					tabBarPosition='top'
					page={this.state.curtab}
					renderTabBar={() => <ScrollableTabBar/>}
					tabBarBackgroundColor='#fff'
					tabBarActiveTextColor='#EE1B21'
					tabBarInactiveTextColor='#353535'
					tabBarTextStyle={[{fontSize: pxToDp(30)}, GlobalStyles.sld_global_font]}
					tabBarUnderlineStyle={styles.tabBarUnderline}
					onChangeTab={(obj) => {
						this.onChangeTab(obj)
					}}
				>
					{
						labela.map((item, index) => {
							return (<PinTuan onhangdle = {this.handleCurTab} tabLabel={item.sld_typename}  key={index}  navigation={this.props.navigation} catid={item.id}  position={index}/>)
						})
					}

				</ScrollableTabView>
				}
			</View>
		)
	}
}


const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
	homeSearchimg: {
		width: pxToDp(30),
		height: pxToDp(30),
		marginTop: pxToDp(15),
		marginRight: pxToDp(4),
	},
	homesearchcons: {
		flexDirection: 'row',
		backgroundColor: '#ebebeb',
		width: scrWidth * 1 - 30,
		height: pxToDp(60),
		borderRadius: pxToDp(8),
		justifyContent: 'center',
		marginLeft:15,
	},
	tabBarUnderline: {
		backgroundColor: '#EE1B21',
		height: 2,
	},
	container: {
		flex: 1,
		backgroundColor: '#fafafa',
	},
	homeSldSearchWrap: {
		paddingTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 10,
		height: Platform.OS === 'ios' ? pxToDp(130) : 55,
		flexDirection: 'row', paddingBottom: 5,
		backgroundColor: '#fff',
	},
	homelogoimg: {
		width: 30,
		height: 30,
	},
	homelogo: {
		width: 65,
		paddingLeft: 17,
	}

});
