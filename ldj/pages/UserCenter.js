import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	ImageBackground,
	Dimensions,
	Image, Platform, DeviceEventEmitter
} from 'react-native';
import SldComStatusBar from "../../component/SldComStatusBar";
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class UserCenter extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '个人中心',
			userInfo: ''
		}
	}

	componentDidMount(){
		if(key){
			this.getUserInfo();
		}
		this.loginState = DeviceEventEmitter.addListener('loginUpdate', () => {
			this.getUserInfo();
		});
	}

	componentWillUnmount(){
		this.loginState.remove();
	}

	// 获取用户信息
	getUserInfo(){
		RequestData.postSldData(AppSldUrl + '/index.php?app=login&mod=usercenter&sld_addons=ldj', {
			key
		}).then(res => {
			if(res.status == 255){
				this.setState({
					userInfo: res.data
				})
			}else if(res.status == 266){
				this.props.navigation.navigate('Login');
				key = ''
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		}).catch(error=>{
			ViewUtils.sldErrorToastTip(error);
		})
	}

	render(){
		const {title, userInfo} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ViewUtils.getEmptyPosition(Platform.OS === 'ios'?'#fff':main_ldj_color,pxToDp(0))}
				<ImageBackground style={ styles.user } source={ require('../images/userBg.png') }>
					<View style={ styles.user_top }>
						<View/>
						<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{ title }</Text>
						<TouchableOpacity
							activeOpacity={1}
							onPress={()=>{
								this.props.navigation.navigate('LdjSetting')
							}}
						>
							<Image
								style={ {width: pxToDp(38), height: pxToDp(35)} }
								resizeMode={ 'contain' }
								source={ require('../images/setting.png') }/>
						</TouchableOpacity>
					</View>
					<View style={ styles.member_avator }>
						<TouchableOpacity
							style={ styles.avator }
							activeOpacity={1}
							onPress={()=>{
								if(key){
									this.props.navigation.navigate('MemberInfo');
								}
							}}
						>
							<Image
								style={ {width: pxToDp(100), height: pxToDp(100)} }
								resizeMode={ 'contain' }
								source={ userInfo != '' ? {uri: userInfo.member_avatar} : require('../images/default_avator.png') }/>
						</TouchableOpacity>
						{ key == '' && <View style={ styles.login }>
							<TouchableOpacity
								activeOpacity={1}
								onPress={()=>{
									this.props.navigation.navigate('Login');
								}}
							>
								<Text style={ {color: '#fff', fontSize: pxToDp(28),} }>登录</Text>
							</TouchableOpacity>
							<View style={ styles.line }></View>
							<TouchableOpacity
								activeOpacity={1}
								onPress={()=>{
									this.props.navigation.navigate('Register');
								}}
							>
								<Text style={ {color: '#fff', fontSize: pxToDp(28)} }>注册</Text>
							</TouchableOpacity>
						</View> }

						{ key != '' && userInfo != '' && <View style={ styles.mem_info }>
							<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{ userInfo.member_name }</Text>
							<Text
								style={ {
									color: '#fff',
									fontSize: pxToDp(26),
									marginTop: pxToDp(15)
								} }>{ userInfo.member_mobile == '' ? '暂未绑定手机号' : userInfo.member_mobile }</Text>
						</View> }
					</View>
				</ImageBackground>
				<ScrollView>
					<TouchableOpacity
						style={ styles.item }
						activeOpacity={ 1 }
						onPress={()=>{
							if(key){
								this.props.navigation.navigate('AccountMoney');
							}else{
								ViewUtils.sldToastTip('请登录后查看');
							}
						}}
					>
						<View style={ styles.item_left }>
							<Image
								resizeMode={ 'contain' }
								style={ {width: pxToDp(44), height: pxToDp(44)} }
								souce={ require('../images/qb.png') }
							/>
							<Text style={ {color: '#666666', fontSize: pxToDp(30)} }>钱包</Text>
						</View>
						<View>
							<Text style={ {
								color: '#FF2929',
								fontSize: pxToDp(28)
							} }>{ userInfo != '' ? userInfo.available_predeposit : '__' }</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={ styles.item }
						activeOpacity={ 1 }
						onPress={ () => {
							if(key){
								this.props.navigation.navigate('LdjAddressList');
							}else{
								ViewUtils.sldToastTip('请登录后查看');
							}
						} }
					>
						<View style={ styles.item_left }>
							<Image
								resizeMode={ 'contain' }
								style={ {width: pxToDp(44), height: pxToDp(44)} }
								souce={ require('../images/qb.png') }
							/>
							<Text style={ {color: '#666666', fontSize: pxToDp(30)} }>我的地址</Text>
						</View>
						<View>
							{ key != '' && <Image
								style={ {width: pxToDp(14), height: pxToDp(25)} }
								resizeMode={ 'contain' }
								source={ require('../images/ltr.png') }
							/> }
						</View>
					</TouchableOpacity>
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	user: {
		width: deviceWidth,
		height: pxToDp(347),
		paddingTop: pxToDp(40)
	},
	user_top: {
		height: pxToDp(80),
		paddingHorizontal: pxToDp(20),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	member_avator: {
		marginTop: pxToDp(40),
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: pxToDp(45)
	},
	avator: {
		width: pxToDp(100),
		height: pxToDp(100),
		borderRadius: pxToDp(50),
		overflow: 'hidden'
	},
	login: {
		paddingLeft: pxToDp(30),
		flexDirection: 'row',
		alignItems: 'center'
	},
	mem_info: {
		paddingLeft: pxToDp(20),
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(110),
		justifyContent: 'space-between',
		marginTop: pxToDp(20),
		paddingHorizontal: pxToDp(33),
		backgroundColor: '#fff'
	},
	line: {
		width: pxToDp(1),
		height: pxToDp(25),
		backgroundColor: '#fff',
		marginHorizontal: pxToDp(22)
	}
})
