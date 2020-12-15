/*
 * 设置
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, Alert, Text, Image, TouchableOpacity, StyleSheet, Platform
} from 'react-native';
import UpgradeUtil from "../util/UpgradeUtil";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from '../util/pxToDp'
import RequestData from '../RequestData';
import StorageUtil from "../util/StorageUtil";

import {I18n} from './../lang/index'

export default class AccountSetting extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: I18n.t('AccountSetting.title'),
			iosNewVersion: '',
			iosCurrentVersion: '',
			androidNewVersion: '',
			androidCurrentVersion: '',
			iosDownloadUrl: '',
			androidDownloadUrl: '',
			registerId: '',
			cur_user_info: {},
		}
	}

	componentDidMount(){
		StorageUtil.get ( 'registrationId' , ( error , object ) => {
			if ( !error ) {
				this.setState({
					registerId:object,
				});
			}
		} )
		StorageUtil.get ( 'cur_user_info' , ( error , object ) => {
			if ( !error ) {
				this.setState({
					cur_user_info:object,
				});
			}
		} )
	}

	loginOut = () => {
		Alert.alert(
			'',
			I18n.t('AccountSetting.text1'),
			[
				{
					text: I18n.t('ok'), onPress: (() => {
						let params = {
							username:this.state.cur_user_info.username,
							key:key,
							client : Platform.OS,
							registerId:this.state.registerId
						};
						let url = AppSldUrl+'/index.php?app=logout&mod=index';
						for(let i in params){
							url+=`&${i}=${params[i]}`;
						}
						RequestData.getSldData(url).then(res=>{
							if(res){
								//清除用户缓存
								key = '';
								storage.remove({
									key: 'key'
								});
								storage.remove({
									key: 'sldlogininfo'
								});
								// 清空入驻信息
								StorageUtil.delete('apply_info');
								StorageUtil.delete('company_reg2');
								StorageUtil.delete('company_reg3');
								StorageUtil.delete('company_reg4');
                                StorageUtil.delete('memberInfo');
                                StorageUtil.delete('is_pay_pwd_set');
                                StorageUtil.delete('memberId');
								ViewUtils.sldToastTip(I18n.t('LdjSetting.text3'));
								const _this = this;
								setTimeout(function(){
									_this.props.navigation.replace('Tab');
								}, 1000);
							}
						})
					})
				},
				{
					text: I18n.t('cancel'), onPress: (() => {
					}), style: 'cancle'
				}
			]
		);
	}

	render(){
		const {title, cur_user_info} = this.state;
        const { params } = this.props.navigation.state
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ GlobalStyles.line }/>
				{/*登录密码*/}
                <TouchableOpacity
                    style={ styles.wrap }
                    activeOpacity={1.0}
                    onPress={() => {
                        this.props.navigation.navigate('SetLoginPassword', {is_login_pwd_set: params.is_login_pwd_set, username: cur_user_info.username})
                    }}
                >
                    <View>
                        <Text style={ styles.name }>{I18n.t('AccountSetting.loginpassword')}</Text>
                        <Text style={{color: '#999', fontSize: pxToDp(22), marginTop: pxToDp(10)}}>{I18n.t('AccountSetting.text2')}</Text>
                    </View>
                    <Image style={{width: pxToDp(26), height: pxToDp(26), opacity: 0.4}} source={require('../assets/images/arrow_right_b.png')}/>
                </TouchableOpacity>
				{/*支付密码*/}
                <TouchableOpacity
                    style={ styles.wrap }
					activeOpacity={1.0}
                    onPress={ () => {
                        this.props.navigation.navigate('ChangePayPassword')
                    } }
                >
                    <View>
                        <Text style={ styles.name }>{I18n.t('AccountSetting.paypassword')}</Text>
                        <Text
                            style={ {
                                color: '#999',
                                fontSize: pxToDp(22),
                                marginTop: pxToDp(10)
                            } }>{I18n.t('AccountSetting.text3')}</Text>
                    </View>
                    <Image source={ require('../assets/images/arrow_right_b.png') }
                           style={ {width: pxToDp(26), height: pxToDp(26), opacity: 0.4} }/>
                </TouchableOpacity>
				{/*清除成功*/}
				<TouchableOpacity
					style={ styles.wrap }
                    activeOpacity={1.0}
					onPress={ () => {
						ViewUtils.sldToastTip(I18n.t('AccountSetting.Clear'))
					} }
				>
					<View>
						<Text style={ styles.name }>{I18n.t('AccountSetting.cache')}</Text>
					</View>
					<Image source={ require('../assets/images/arrow_right_b.png') }
					       style={ {width: pxToDp(26), height: pxToDp(26), opacity: 0.4} }/>
				</TouchableOpacity>
				<TouchableOpacity
					style={ styles.wrap }
                    activeOpacity={1.0}
					onPress={ () => UpgradeUtil.updateApp(true) }
				>
					<View>
						<Text style={ styles.name }>{I18n.t('AccountSetting.update')}</Text>
					</View>
					<Image source={ require('../assets/images/arrow_right_b.png') }
					       style={ {width: pxToDp(26), height: pxToDp(26), opacity: 0.4} }/>
				</TouchableOpacity>
				{/*退出登录*/}
				<TouchableOpacity
					style={ {
						alignItems: 'center',
						justifyContent: 'center',
						height: pxToDp(90),
						backgroundColor: '#fff'
					} }
                    activeOpacity={1.0}
					onPress={() => this.loginOut()}
				>
					<Text style={ {color: '#333', fontSize: pxToDp(28)} }>{I18n.t('AccountSetting.logout')}</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrap: {
		marginBottom: pxToDp(20),
		paddingHorizontal: pxToDp(30),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: pxToDp(30),
		backgroundColor: '#fff'
	},
	name: {
		color: '#333',
		fontSize: pxToDp(26)
	}
})
