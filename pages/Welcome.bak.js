/*
 * 欢迎页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	Image,
	StyleSheet,
	View,
	DeviceEventEmitter,
	Alert
} from 'react-native';
import UpgradeUtil from "../util/UpgradeUtil";
import ViewUtils from "../util/ViewUtils";
import RequestData from "../RequestData";
import SldNetWorkTool from '../component/SldNetWorkTool';

var Dimensions = require('Dimensions');
const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;
let lp = 0;
let new_data = '';
let retrytime=3;
import {I18n} from './../lang/index'

export default class Welcome extends Component {

	constructor(props){

		super(props);
		this.state={
			collectLists:[],
			sldtoken:'',
			pn:1,
			ishasmore:false,
			refresh:false,
			showLikePart:false,
			diy_data: [],//存放所有的装修改数据
		}
	}
	componentDidMount() {
		SldNetWorkTool.checkNetWork((isConnected) =>{
			if(!isConnected){
				this.props.navigation.navigate('SldMainNoNetWork');
			}else{
				this.initData();
			}
		});
		//this.initData();
		this.lis_network =
			DeviceEventEmitter.addListener ( 'updateNetWork' , ( ) => {
				this.initData();
			} );
		this.getHomeData()
	}

	componentWillUnmount () {
		if(this.lis_network){
			this.lis_network.remove ()
		}
	}



	initData = async () => {
        this.getHomeData();
	}

	getHomeData = (site) => {
		let url = AppSldUrl + '/index.php?app=index&mod=index_app';
		if (site) {
			url += `&bid=${site}`;
		}
		//获取商城首页装修数据
		RequestData.getSldData( url)
			.then ( result => {
				if ( result.datas.index_data.length ) {
					module_set = result.datas.addonsStatus;
					diy_data_info = result.datas.index_data;
					this.props.navigation.replace("Tab")
					UpgradeUtil.updateApp();
				}
			} )
			.catch ( error => {
				this.handlegetHomeDataFailed(site);
				ViewUtils.sldErrorToastTip(error);
			} )
	}


//装修数据请求失败后提示重试或退出
	handlegetHomeDataFailed(site){
		if(retrytime > 0){
			this.getHomeData(site);
			retrytime=retrytime-1;
		}else{
			retrytime=3;
			Alert.alert(
				'',
				I18n.t('Welcome.text1'),
				[
					{
						text: I18n.t('Welcome.quit'), onPress: (() => {
							 alert(I18n.t('Welcome.click_quit'));
						}), style: 'cancle'
					},
					{
						text: I18n.t('Welcome.tautology'), onPress: (() => {
							this.getHomeData(site);

						})
					}

				]
			);
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Image resizeMode='cover' style={styles.welcome} source={ios_type==''?require('../assets/images/welcomego.png'):(ios_type==44?require('../assets/images/welcomegox.png'):require('../assets/images/welcomegoxr.png'))}/>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:'#fff',
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
	},
	welcome:{
		width:'100%',
		height:'100%',
	},

});
