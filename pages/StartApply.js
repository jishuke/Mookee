/*
 * 入驻申请页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View ,ImageBackground,
	StyleSheet ,TouchableOpacity,Text,
	Image ,WebView, Platform
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import Modal from 'react-native-modalbox';
import RequestData from "../RequestData";
import {I18n} from './../lang/index'
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');
export default class StartApply extends Component {

	constructor(props){

		super(props);
		this.state={
			title:I18n.t('StartApply.title'),
			webViewHeight : 0 ,
			agreement_con:'',//入驻协议内容
		}
	}
	componentWillMount() {
			this.getAgreeCon();
	}

	//获取协议内容
	getAgreeCon = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=enterin&mod=getDocOfEnterin&key=' + key)
			.then(result => {
				if (result.datas) {
					this.setState({
						agreement_con:result.datas.agreement
					});
				} else {
					ViewUtils.sldToastTip(I18n.t('StartApply.text1'));
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	_onMessage = ( e ) => {
		let message = e.nativeEvent.data;
		let res = JSON.parse ( message );
		switch ( res.type ) {
			case "auto_height":
				this.setState ( {
					webViewHeight : parseInt ( res.height )
				} );
				break;
			case "open_img":
				break;
		}
	};

	//查看入驻协议
	viewAgreement = () => {
		this.refs.calendarstart.open();
	}
	closeModal = () => {
		this.refs.calendarstart.close();
	}




	render() {
		const {title,agreement_con} = this.state;
		const _w = width;
		const _h = this.state.webViewHeight;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
				<View style={GlobalStyles.line}/>
				<ImageBackground style={{width:width,height:height_com_head}} source={require("../assets/images/sld_ven_apply_bg.png")} resizeMode="stretch">
					<View style={[{width:width,height:pxToDp(250),marginTop:pxToDp(80)},GlobalStyles.flex_common_row]}>
					{ ViewUtils.getSldImg ( 472 , 250 , require ( '../assets/images/sld_ven_apply_bg_desc.png' ) ) }
					</View>
					<View style={[{width:width,height:pxToDp(415),marginTop:pxToDp(80)},GlobalStyles.flex_common_row]}>
					{ ViewUtils.getSldImg ( 660 , 415 , require ( '../assets/images/sld_ven_apply_bg_progress.png' ) ) }
					</View>


					<View style={[{width:width,position:'absolute',left:0,right:0,bottom:0,height:pxToDp(244),flexDirection:'column',alignItems:'center'}]}>
						<TouchableOpacity
							activeOpacity={1} onPress={() => {
							this.onClick('MemberInfo');
						}}
							style={[{width:pxToDp(597),height:pxToDp(103),backgroundColor:'#FCF02A',borderRadius:pxToDp(8)},GlobalStyles.flex_common_row]}
						>
							<Text style={{color:'#C31C32',fontSize:pxToDp(38),fontWeight:'400'}}>{I18n.t('StartApply.Immediatelymove')}</Text>
						</TouchableOpacity>

						<View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:0,marginTop:pxToDp(50)}}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={()=>this.handleAgreement()}
							>
								<Image style={{width:14,height:14,marginRight:pxToDp(15)}} source={this.state.seleVal==1?require("../assets/images/selted.png"):require("../assets/images/selt.png")}/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={1}
								onPress={()=>this.viewAgreement()}
							>
								<Text style={{color:'#fff',fontSize:pxToDp(24),fontweight:'300'}}>{I18n.t('StartApply.haveread')}</Text>
							</TouchableOpacity>
						</View>
					</View>

				</ImageBackground>

				<Modal
					backdropPressToClose={true}
					entry='bottom'
					position='bottom'
					coverScreen={true}
					swipeToClose={false}
					style={{
						backgroundColor: "#fff", height: height,
						position: "absolute", left: 0, right: 0,
						width: width,
					}}
					ref={"calendarstart"}>
					<TouchableOpacity
						activeOpacity={1}
						style={{position:'absolute',top:Platform.OS === 'ios' ? 50 : 20,right:20,zIndex:100000}}
						onPress={()=>this.closeModal()}
					>
						<Image style={{width:20,height:20,marginRight:pxToDp(15)}} source={require("../assets/images/sld_close_modal.png")}/>
					</TouchableOpacity>

					<View style={{width:width,height:height}}>
						<View
							style={ { width : _w , height : _h ,padding:15} }
						>
							<WebView
								ref={ ( ref ) => {
									this.webview = ref;
								} }
								style={ { flex : 1 } }
								scrollEnabled={ false }
								domStorageEnabled={ true }
								onMessage={ this._onMessage }
								scalesPageToFit={ true }
								showsVerticalScrollIndicator={ false }
								source={ { html : agreement_con, baseUrl : '' } }
								automaticallyAdjustContentInsets={ true }
								javaScriptEnabled={ true }
								injectedJavaScript={ '(' + String ( injectedScript ) + ')();' }
							/>
						</View>
					</View>
				</Modal>

			</View>
		)
	}
}
const injectedScript = function () {
	function waitForBridge () {
		if ( window.postMessage.length !== 1 ) {
			setTimeout ( waitForBridge , 200 );
		}
		else {
			let height = 0;
			if ( document.documentElement.scrollHeight > document.body.scrollHeight ) {
				height = document.documentElement.scrollHeight
			}
			else {
				height = document.body.scrollHeight
			}
			let data = { 'type' : 'auto_height' , 'height' : height };

			postMessage ( JSON.stringify ( data ) )
		}
	}

	waitForBridge ();
};
const styles = StyleSheet.create({
		backgroud_image:{
		width:width,
		height:height_com_head,
	},
});
