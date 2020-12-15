/*
 * 邀请好友页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View ,
	StyleSheet,
	Text,
	Image ,
	ImageBackground
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import RequestData from "../RequestData";
import {I18n, LANGUAGE_CHINESE} from './../lang/index'
import StorageUtil from "../util/StorageUtil";
import ShareUtil from "../util/ShareUtil";
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');

export default class InviteFriend extends Component {

	constructor(props){

		super(props);
		this.state={
			inviteImg:' ',
			is_show_share:0,//是否分享，0为否，1为是
			share_data:{},//分享的数据
			pushCode : typeof ( props.navigation.state.params.pushCode ) != 'undefined' ? props.navigation.state.params.pushCode : '' ,
			qrcode: '',
			language: 0
		}
	}
	componentDidMount() {
		console.warn(this.state.pushCode, 'InviteFriend-pushCode');

		StorageUtil.get('language', (error, object)=>{
			if(!error && object){
				this.setState({
					language: object
				});
			}else {
				this.setState({
					language: LANGUAGE_CHINESE
				});
			}
		});

		if(!key){
			this.props.navigation.navigate('Login');
		}else{
			this.getInviteImg(key);
		}
	}

	getInviteImg = (key) => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=tuiguang_qrcode&key='+key)
			.then(result => {
				let share_data = {};
				console.warn('ww:InviteFriend-getInviteImg', result);

				share_data.type = 'goods';
				share_data.text = I18n.t('InviteFriend.text1');
				share_data.img = result.datas.tgsrc;
				share_data.webUrl = 'https://md.mookee.net/cwap/cwap_register_tel.html?refe_code='+this.state.pushCode,
				share_data.title = I18n.t('InviteFriend.text2');
				console.warn('ww:share_data', share_data);
				this.setState({
					share_data:share_data,
					qrcode: result.datas.tgsrc
				});
			})
			.catch(error => {
				ViewUtils.sldToastTip(error);
			})
	}


	goShare = () =>{
		const {share_data} = this.state;
		let list = [2,3,7,8];//0:qq,1:新浪, 2:微信, 3:微信朋友圈,4:qq空间, 7:Facebook, 8:推特
		console.warn('ww:ShareUtil.shareboard:data', share_data);
		ShareUtil.shareboard(share_data.text, share_data.img, share_data.webUrl, share_data.title,list,(code,message) =>{
			console.warn(message, 'ww:ShareUtil.shareboard:resp');
		});
		// this.setState({
		// 	is_show_share:1,
		// });
	}
	cancleShare = () => {
		this.setState({
			is_show_share:0,
		});
	}

	render() {
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={I18n.t('InviteFriend.invitefriends')} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} right_type='icon' right_event={() => this.goShare()} right_icon={require('../assets/images/share.png')} />
				<View style={GlobalStyles.line}/>
				<ImageBackground resizeMode={'cover'} style={styles.shareImg} source={this.state.language === LANGUAGE_CHINESE?require('../assets/images/sld_invite_friend_c.png'):require('../assets/images/sld_invite_friend_e.png')}>
					<View style={styles.container}>
						<View style={styles.inner}>
							<View style={styles.inviteCode_wrap}>
								<Text style={styles.inviteCode}>{I18n.t('InviteFriend.inviteCode')}:{this.state.pushCode}</Text>
							</View>
							<Image style={styles.qrcode} source={{uri: this.state.qrcode}}/>
							<Text style={styles.desc}>{I18n.t('InviteFriend.desc')}</Text>
						</View>
					</View>
				</ImageBackground>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	shareImg:{
		width:width,
		height:height,
	},
	container:{
		width: width,
		position: 'absolute',
		bottom: pxToDp(220),
		left: 0,
	},
	inner: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	inviteCode_wrap: {
		backgroundColor: 'rgba(0,0,0,.6)',
		borderRadius: pxToDp(38),
		paddingLeft: pxToDp(44),
		paddingRight: pxToDp(44),
		height: pxToDp(76),
		textAlign: 'center',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
	},
	inviteCode:{
		backgroundColor: 'transparent',
		color: 'white',
		fontSize: pxToDp(44),
	},
	qrcode:{
		marginTop: pxToDp(34),
		width: pxToDp(212),
		height: pxToDp(212),
	},
	desc:{
		marginTop: pxToDp(18),
		fontSize: pxToDp(30),
		color: 'white',
	},
});
