import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
	DeviceEventEmitter
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import pxToDp from "../../util/pxToDp";
import StorageUtil from "../../util/StorageUtil";
import SldHeader from "../../component/SldHeader";
import SldComStatusBar from "../../component/SldComStatusBar";

export default class LdjSetting extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '设置',
		}
	}

	componentDidMount(){

	}

	clearStorage = () => {
		Alert.alert('提示', '清除本地缓存', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					StorageUtil.delete('LdjStoreSearch');
					ViewUtils.sldToastTip('清除成功')
				}
			}
		])
	}

	logout = () => {
		Alert.alert(
			'',
			'确定退出吗？',
			[
				{
					text: '取消', onPress: (() => {
					}), style: 'cancle'
				},
				{
					text: '确定', onPress: (() => {
						//清除用户缓存
						key = '';
						storage.remove({
							key: 'key'
						});
						storage.remove({
							key: 'sldlogininfo'
						});
						ViewUtils.sldToastTip('退出成功');
						const _this = this;
						DeviceEventEmitter.emit('loginUpdate');
						setTimeout(function(){
							_this.props.navigation.replace('SldLdjTab');
						}, 1000);
					})
				}
			]
		);
	}

	render(){
		const {title} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition('#fff', pxToDp(0)) }
				<SldHeader title={ title } left_icon={ require('../../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<TouchableOpacity
					activeOpacity={ 1 }
					style={ styles.item }
					onPress={ () => this.clearStorage() }
				>
					<Image
						style={ {width: pxToDp(43), height: pxToDp(43)} }
						resizeMode={ 'contain' }
						source={ require('../images/clearS.png') }
					/>
					<Text style={ {
						flex: 1,
						marginHorizontal: pxToDp(35),
						color: '#666',
						fontSize: pxToDp(fontSize_32)
					} }>清除本地缓存</Text>
					<Image
						style={ {width: pxToDp(16), height: pxToDp(24)} }
						resizeMode={ 'contain' }
						source={ require('../images/ltr.png') }
					/>
				</TouchableOpacity>

				{ key != '' && key != undefined && <TouchableOpacity
					style={ styles.logout }
					activeOpacity={ 1 }
					onPress={ () => this.logout() }
				>
					<Text style={ {color: '#333', fontSize: pxToDp(fontSize_32)} }>退出登录</Text>
				</TouchableOpacity> }

			</View>
		)
	}
}

const styles = StyleSheet.create({
	item: {
		height: pxToDp(110),
		backgroundColor: '#fff',
		marginTop: pxToDp(20),
		paddingHorizontal: pxToDp(30),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	logout: {
		height: pxToDp(80),
		marginTop: pxToDp(20),
		justifyContent: 'center',
		alignItems: 'center'
	}
})
