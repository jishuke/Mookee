/*
 * 断网页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, Text,Dimensions,TouchableOpacity,DeviceEventEmitter
} from 'react-native';
import ViewUtils from '../util/ViewUtils'
import ComStyle from "../assets/styles/ComStyle";
import GlobalStyles from "../assets/styles/GlobalStyles";
import SldNetWorkTool from '../component/SldNetWorkTool';
import {I18n} from './../lang/index'

const {width,height} = Dimensions.get('window');
export default class SldNoNetWork extends Component {
	constructor(props){
		super(props);
	}
	componentDidMount() {

	}

	//检测网络状态，没有网的情况不操作，有网的情况返回上一页，并通知网络更新
	checkNetWork = () => {
		let _this = this;
		SldNetWorkTool.checkNetworkState((isConnected)=>{
			if(isConnected){
				DeviceEventEmitter.emit('updateNetWork');
				_this.props.navigation.pop(1);
			}
		});
	}

	render() {

		return (
			<View style={[GlobalStyles.flex_common_column,ComStyle.net_container]}>
				{ViewUtils.setSldAndroidStatusBar(false,'transparent','dark-content',true,true)}
					{ViewUtils.getSldImg(211,121,require('../assets/images/sld_no_network.png'))}
					<Text style={ComStyle.net_text}>{I18n.t('SldNoNetWork.text1')}</Text>
					<TouchableOpacity
						activeOpacity={1}
						onPress={ ()=>{
							this.checkNetWork();
						} }
						style={[ComStyle.net_refresh_view,GlobalStyles.flex_common_row]}>
						<Text style={ComStyle.net_refresh_text}>{I18n.t('SldNoNetWork.renovation')}</Text>
					</TouchableOpacity>
			</View>
		)
	}
}