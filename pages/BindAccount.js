/*
* 绑定账号页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View, TouchableOpacity,TextInput,ImageBackground,Text,ScrollView,
	Platform,DeviceEventEmitter
} from "react-native";
import StorageUtil from "../util/StorageUtil";
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import GlobalStyles from "../assets/styles/GlobalStyles";
import pxToDp from "../util/pxToDp";
import ComStyle from "../assets/styles/ComStyle";
import SldHeader from '../component/SldHeader';

import {I18n} from './../lang/index'

// 导入Dimensions库
var Dimensions = require('Dimensions');
export default class BindAccount extends Component {

	constructor(props){
		super(props);
		this.state={
			result:{},
			username:'',
			password:'',
			login_logo:'',
		};
	}

	componentWillMount() {
	}


	//登录成功的操作
	goWay = (data) => {
	    console.log(data,'data')
		key = data.key;
		cur_user_info.username = data.username;
		cur_user_info.member_id = data.member_id;
		cur_user_info.member_avatar = data.logo;
		StorageUtil.set('cur_user_info', JSON.stringify(cur_user_info));
		StorageUtil.set('key', key, ()=>{
			if(typeof (this.props.navigation.state.params)!='undefined'&&typeof (this.props.navigation.state.params.tag) != 'undefined'&&this.props.navigation.state.params.tag == 'cart'){
				this.props.navigation.replace('CartScreen');
			}else{
				DeviceEventEmitter.emit('loginUpdate')
				this.props.navigation.popToTop();//跳转回去并且卸载掉当前场景
			}
		});
	}


	//输入事件
	handleSldPass (data){
		this.setState (data);
	}

	//登录事件
	handleSldLogin (){
		const {username,password} = this.state;
		if (username == '' || password == ''){
			ViewUtils.sldToastTip (I18n.t('BindAccount.text1'));
			return false;
		}else{
			let _this = this;
			RequestData.postSldData (AppSldUrl + '/index.php?app=login&mod=app_wechat_bind_account' , {
				username : username ,
				password : password ,
				client : Platform.OS,
				unionid:authInfo.unionid,
				openid:authInfo.openid,
				avator:Platform.OS=='ios'?authInfo.headimgurl:authInfo.iconurl,
				nickname:Platform.OS=='ios'?authInfo.nickname:authInfo.name,
			})
				.then (results =>{
					if(results.datas.state ==200){
						ViewUtils.sldToastTip(I18n.t('BindAccount.text2'));
						//获取聊天的配置信息
						this.getImInfo(results.datas);
					}else{
						ViewUtils.sldToastTip (results.datas.msg);
					}
				}).catch (error =>{
				ViewUtils.sldToastTip(error);
			})
		}
	}

	//获取聊天的配置信息
	getImInfo = (val) => {
		let _this = this;
		RequestData.getSldData(AppSldUrl + '/index.php?app=login&mod=get_service_config')
			.then(result => {
				StorageUtil.set('im_info', JSON.stringify(result), ()=>{
					_this.goWay(val);
				});
			})
			.catch(error => {
			})
	}

	render() {
		const {login_logo} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={I18n.t('BindAccount.title')} left_icon={require('../assets/images/goback.png')} left_event={() =>this.props.navigation.goBack()}/>
				<View style={GlobalStyles.line}/>
				<ScrollView keyboardShouldPersistTaps={'handled'}>
					<View style={{flexDirection:'column',alignItems:'center',marginTop:pxToDp(50),}}>
						<View style={[ComStyle.lg_item_view,{marginTop:pxToDp(50)}]}>
							{ViewUtils.getSldImg(30,31,require('../assets/images/sld_login_username_icon.png'))}
							<TextInput
								style={[ComStyle.lg_item_input, GlobalStyles.sld_global_font]}
								underlineColorAndroid={'transparent'}
								autoCapitalize='none'
								returnKeyType='next'
								onChangeText={(text) =>this.handleSldPass({'username':text})}
								placeholderTextColor={'#999'}
								placeholder={I18n.t('BindAccount.text3')}
								onSubmitEditing={()=>this.refs.sldpwd.focus()}
							/>
						</View>

						<View style={ComStyle.lg_item_view}>
							{ViewUtils.getSldImg(30,31,require('../assets/images/sld_login_pwd_icon.png'))}
							<TextInput
								ref={'sldpwd'}
								style={[ComStyle.lg_item_input, GlobalStyles.sld_global_font]}
								autoCapitalize='none'
								returnKeyType='done'
								underlineColorAndroid={'transparent'}
								placeholderTextColor={'#999'}
								secureTextEntry={true}
								onChangeText={(text) => this.handleSldPass({'password':text})}
								placeholder={I18n.t('BindAccount.text4')}
								onSubmitEditing={()=>this.handleSldLogin()}
							/>
						</View>

						<TouchableOpacity
							activeOpacity={1}
							onPress={ ()=>{
								this.handleSldLogin();
							} }
							style={[ComStyle.lg_btn_view,GlobalStyles.flex_common_row]}>
							<ImageBackground style={[ComStyle.lg_btn_bg,GlobalStyles.flex_common_row]} source={require('../assets/images/sld_login_btn_icon.png')}>
								<Text style={ComStyle.lg_btn_text}>{I18n.t('BindAccount.add')}</Text>
							</ImageBackground>
						</TouchableOpacity>

					</View>
				</ScrollView>
			</View>
		)
	}
}


