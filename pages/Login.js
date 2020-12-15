
/*
* 登录页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    Alert, TouchableOpacity, Image, TextInput,Text, ScrollView,
    Platform, DeviceEventEmitter, DeviceInfo, Dimensions
} from "react-native";
import * as WeChat from "react-native-wechat";
import StorageUtil from "../util/StorageUtil";
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import GlobalStyles from "../assets/styles/GlobalStyles";
import pxToDp from "../util/pxToDp";
import ShareUtil from '../util/ShareUtil';
import ComStyle from "../assets/styles/ComStyle";
import {getUserPushHandInfo} from "../api/pushHandApi"
import { I18n } from '../lang'

const {width: deviceWidth,height:deviceHeight} = Dimensions.get('window');
const screenwidth = deviceWidth;
// 导入Dimensions库
// var Dimensions = require('Dimensions');
export default class Login extends Component {

	constructor(props){
		super(props);
		this.state={
			result:{},
			username:'',
			password:'',
			login_logo:'',
			registerId:'',
			iosIsInstallWeChat: false,
			showThirdLoginLoading: false
		};
	}

	canClick = true

    componentWillMount() {
        // this.getMobileLogo()
        StorageUtil.get ( 'registrationId' , ( error , object ) => {
            if ( !error ) {
                this.setState({
                    registerId:object,
                });
            }
        } )
    }

	componentDidMount() {
		this.getIosIsInstallWeChat();
	}

	componentWillUnmount() {
		this.setState({showThirdLoginLoading: false})
	}

	//登录成功的操作
	goWay = (data) => {
	    let isFirst = false
		// console.log('goway------', data);

		key = data.key;
        StorageUtil.set('key', key);
        cur_user_info.username = data.username;
        cur_user_info.member_id = data.member_id;
        cur_user_info.member_avatar = data.member_avatar;
        StorageUtil.set('cur_user_info', JSON.stringify(cur_user_info));

		getUserPushHandInfo({
                key:key
            }).then(res=>{
            	this.canClick = true
                // console.log(res,'res')
                if(res.code === 200){
                    let pushHandInfo = {getInfo:true,...res.datas.member_info}
                    if(res.datas.member_info.first_login === 1) {
                    	DeviceEventEmitter.emit('userCenter')
                        isFirst = true
						this.enter()
                    } else {
                        isFirst = false
                    }
                } else {
                    let pushHandInfo = {...pushHandInfo,getInfo: true}
                    isFirst = false
                }
            if(!isFirst){
                if(typeof (this.props.navigation.state.params)!='undefined'&&typeof (this.props.navigation.state.params.tag) != 'undefined'&&this.props.navigation.state.params.tag == 'cart'){
                    this.props.navigation.replace('CartScreen');
                }else{
                    DeviceEventEmitter.emit('loginUpdate')
                    this.props.navigation.pop();//跳转回去并且卸载掉当前场景
                }
            }
        }).catch(err => {
            this.canClick = true
		})


	}

	/**
	 * 根据unionid验证用户是否已经存在
	 * @param type 平台类型：1:微信 2:facebook
	 *
	 **/
	getSocialUserByUnionid = (val, type) => {
		RequestData.postSldData(AppSldUrl+'/index.php?app=login&mod=app_wechat_isexit_mem',{
			unionid: type === 1 ? val.unionid : val.id,
			openid: val.uid,
			avator: val.iconurl,
			nickname:val.name,
		}).then(result => {
            this.setState({showThirdLoginLoading: false})
            // console.log('三方登录绑定用户信息:', result)
            if(result.state == 200) {
                //已经绑定，直接登录
                // this.getImInfo(result.data);
                this.goWay(result.data);
            }
            else if(result.state == 100) {
                //注册新账号
                // this.registerMember(val);
                // this.props.navigation.navigate('BindMyAccount', {val})
                this.props.navigation.navigate('Register', {val, bindPhone: true})
            }
            else {
                ViewUtils.sldToastTip(I18n.t('Login.text2'));
            }
        }).catch(error => {
            this.setState({showThirdLoginLoading: false})
            ViewUtils.sldToastTip(I18n.t('Login.text2'));
        })
	}


	//输入事件
	handleSldPass (data){
		this.setState (data);
	}

	//登录事件
	handleSldLogin (){
		if (!this.canClick) {
			return
		}
		this.canClick = false

		const {registerId,username,password} = this.state;
		if (username == '' || password == ''){
            this.canClick = true
			ViewUtils.sldToastTip (I18n.t('Login.text3'));
			return
		}

        RequestData.postSldData (AppSldUrl + '/index.php?app=login&mod=index' , {
            username : username ,
            password : password ,
            client : Platform.OS,
            registerId:registerId
        }).then (results =>{
            if(!results.datas.error){
                ViewUtils.sldToastTip(I18n.t('Login.text4'));
                // this.getImInfo(results.datas);
                this.goWay(results.datas);
            }else{
                this.canClick = true
                ViewUtils.sldToastTip (results.datas.error);
            }
        }).catch (error =>{
            this.canClick = true
            ViewUtils.sldToastTip(error);
        })
	}

	//获取聊天的配置信息
	getImInfo = (val) => {
		let _this = this;
		RequestData.getSldData(AppSldUrl + '/index.php?app=login&mod=get_service_config')
			.then(result => {
				StorageUtil.set('im_info', JSON.stringify(result), ()=>{
					console.log('set--------------');
					// _this.goWay(val);
				});
				_this.goWay(val);
			})
			.catch(error => {

			})
	};

	//其他方式登陆
	loginByOtherMethod = (type) => {
		//微信登录
		if (type === 'wx'){
			this.setState({showThirdLoginLoading: true})
			WeChat.isWXAppInstalled().then((isInstalled)=>{
				console.warn('ww:wx:', isInstalled);
				if (isInstalled){
					ShareUtil.auth(2, (code,result,message)=>{
						// console.warn('ww:wx:', code,result,message);
						if (code === (Platform.OS === 'ios' ? 200 : 0)){
							// console.log('微信登录成功:', code, '---', result, '---', message)
							this.getSocialUserByUnionid(result, 1);
						}else {
                            this.setState({showThirdLoginLoading: false})
							ViewUtils.sldToastTip(I18n.t('Login.text5'));
						}
					});
				} else{
                    this.setState({showThirdLoginLoading: false})
					Alert.alert('登录失败', '您没有安装微信', [
						{text: '确定'}
					]);
				}
			});
		}
		//facebook登录
		else if (type === 'facebook'){
            this.setState({showThirdLoginLoading: true})
			ShareUtil.auth(7, (code,result,message)=>{
				// console.log('facebook登录:', code, ',', result, ',', message);
				if (code === (Platform.OS === 'ios' ? 200 : 0)){
					this.getSocialUserByUnionid(result, 2);
				}
				else {
                    this.setState({showThirdLoginLoading: false})
					ViewUtils.sldToastTip(I18n.t('Login.fb_error'));
				}
			});
		}
	};

	getIosIsInstallWeChat = () => {
		if(Platform.OS === 'ios') {
			WeChat.isWXAppInstalled().then(res => {
				this.setState({
					iosIsInstallWeChat: res
				})
			})
		}
	}

	// 第三方登录
	_renderOtherLogin = () => {
		if(Platform.OS === 'ios' && !this.state.iosIsInstallWeChat) {
			return null;
		}
		return (
			<View style={[GlobalStyles.flex_common_column,ComStyle.login_bot_view]}>
				<Text style={ComStyle.login_bot_tip}>{I18n.t('Login.text6')}</Text>
                <View style={GlobalStyles.flex_common_row}>
                    <TouchableOpacity
                        style={{}}
                        onPress={()=>{
                            this.loginByOtherMethod('wx');
                        }}>
                        {ViewUtils.getSldImg(68,68,require('../assets/images/login_by_weixin.png'))}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{marginLeft:pxToDp(40)}}
                        onPress={()=>{
                            this.loginByOtherMethod('facebook');
                        }}>
                        {ViewUtils.getSldImg(68,68,require('../assets/images/facebookIcon.png'))}
                    </TouchableOpacity>

                </View>

			</View>
		);
	}

	//登录成功跳转进app页面
    enter = () => {
        if(typeof (this.props.navigation.state.params)!='undefined'&&typeof (this.props.navigation.state.params.tag) != 'undefined'&&this.props.navigation.state.params.tag == 'cart'){
            this.props.navigation.replace('CartScreen');
        }else{
            DeviceEventEmitter.emit('loginUpdate')
            this.props.navigation.pop();//跳转回去并且卸载掉当前场景
        }
    }

	render() {
		const { showThirdLoginLoading } = this.state
		return (
			<View style={[GlobalStyles.sld_container,{backgroundColor:'#fff',flexDirection:'row',justifyContent:'center'}]}>
				<TouchableOpacity
					style={{position:'absolute',zIndex:99999,top:40,left:0}}
					onPress={()=>{
						this.props.navigation.goBack();
					}}>
					<View style={GlobalStyles.topBackBtn}>
						<Image style={GlobalStyles.topBackBtnImg} source={require('../assets/images/goback.png')}></Image>
					</View>
				</TouchableOpacity>
				<ScrollView
                    keyboardDismissMode={'on-drag'}
					keyboardShouldPersistTaps={'handled'}
				>
					<View style={{flexDirection:'column',alignItems:'center',paddingTop:pxToDp(118),}}>
						{/* { ViewUtils.getSldImg ( 135 , 151 , login_logo==''?require('../assets/images/sld_login_logo_icon.png'):{uri:login_logo} ) } */}
						{ ViewUtils.getSldImg ( 135 , 151 , require('../assets/images/sld_login_logo_icon.png')) }
						<View style={[ComStyle.lg_item_view,{marginTop:pxToDp(90)}]}>
							{ViewUtils.getSldImg(30,31,require('../assets/images/sld_login_username_icon.png'))}
							{/*用户名*/}
							<TextInput
								style={[ComStyle.lg_item_input, GlobalStyles.sld_global_font]}
								underlineColorAndroid={'transparent'}
								autoCapitalize='none'
								returnKeyType='next'
								onChangeText={(text) => this.handleSldPass({'username':text})}
								placeholderTextColor={'#999'}
								placeholder={I18n.t('Login.text7')}
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
								placeholder={I18n.t('Login.text8')}
								onSubmitEditing={()=>this.handleSldLogin()}
							/>
						</View>
						{/*登录*/}
						<TouchableOpacity
							activeOpacity={1}
							onPress={()=>{
								this.handleSldLogin();
							}}
							style={[ComStyle.lg_btn_view,GlobalStyles.flex_common_row]}>
							<View style={[ComStyle.lg_btn_bg,GlobalStyles.flex_common_row,GlobalStyles.sld_login_btn_bg]}>
								<Text style={ComStyle.lg_btn_text}>{I18n.t('Login.login')}</Text>
							</View>
						</TouchableOpacity>
						<View style={{flexDirection:'row',justifyContent:'center',alignItems:"center",marginTop:pxToDp(80)}}>
							{/*忘记密码*/}
							<TouchableOpacity
								activeOpacity={1}
								onPress={ ()=>{
									this.props.navigation.navigate('ForgetPwd');
								} }
							>
								<Text style={{color:'#929292',fontSize:pxToDp(24),fontWeight:'300',marginRight:pxToDp(50),}}>{I18n.t('Login.forgetpassword')}</Text>
							</TouchableOpacity>
							<Text  style={{color:'#929292',fontSize:pxToDp(24),fontWeight:'300'}}>|</Text>
							{/*注册*/}
							<TouchableOpacity
								activeOpacity={1}
								onPress={()=>{
									this.props.navigation.navigate('Register');
								} }
							>
								<Text style={{color:'#929292',fontSize:pxToDp(24),fontWeight:'300',marginLeft:pxToDp(50)}}>{I18n.t('Login.Signupnow')}</Text>

							</TouchableOpacity>
						</View>
						{/*三方登录*/}
						{
                            this._renderOtherLogin()
						}
					</View>
					{/*三方登录loading蒙层*/}
					{
						showThirdLoginLoading ?
							<View
								style={{
									justifyContent: 'center',
									alignItems: 'center',
									position: 'absolute',
									top: 0,
									bottom: 0,
									left: 0,
									right: 0,
									backgroundColor: 'rgba(0,0,0,0)'
								}}
							>
								<Image style={{width: 64, height: 64}} source={require('../assets/images/loading.gif')}/>
							</View> : null
					}
				</ScrollView>
			</View>
		)
	}
}


