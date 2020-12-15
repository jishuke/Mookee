/*
* 封装的webview页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View , TouchableOpacity ,
	StyleSheet , Text , Dimensions , Platform,DeviceInfo
} from "react-native";
import Modal from 'react-native-modalbox';
import ViewUtils from "../util/ViewUtils";
import pxToDp from "../util/pxToDp";
import ShareUtil from '../util/ShareUtil';
import * as WeChat from 'react-native-wechat'
const {width} = Dimensions.get('window');
import {I18n} from './../lang/index'
export default class SldShareCommon extends Component {

    constructor(props){
        super(props);
	    this.state = {
		    is_show_share:props.is_show_share,
	    }
    }

    componentDidMount() {

    }

	componentWillReceiveProps(props){
    	if(props.is_show_share != this.state.is_show_share){
    		  if(props.is_show_share == 1){
			      this.refs.calendarshare.open();
		      }else{
    		  	    this.closeModal();
		      }
	    }
	}


	share = (type) => {
		this.refs.calendarshare.close ();
		const { data } = this.props;
		if (  type == 2  && Platform.OS === 'ios' ) {
			this.wechatShareImage(2);
		} else if (type == 3  && Platform.OS === 'ios'){
			//如果是ios微信分享的话，走原生分享
			this.wechatShareImage(3);
		}else {
			ShareUtil.share ( data.text , data.img , data.webUrl , data.title , type , ( code , message ) => {
				if(message=='success'){
					ViewUtils.sldToastTip(I18n.t('com_SldShareCommon.text1'));
				}else if(message=='cancel'){
					ViewUtils.sldToastTip(I18n.t('com_SldShareCommon.text2'));
				}else{
					ViewUtils.sldToastTip(I18n.t('com_SldShareCommon.text3'));
				}
			} );
		}
	}


	wechatShareImage = async(type) => {
			const { data } = this.props;
			let shareData = {};
			shareData.type = 'news';
			shareData.title = data.title;
			shareData.descrption = data.text;
			shareData.thumbImage = data.img;
			shareData.webpageUrl = data.webUrl;
			try{
				let result='';
				if(type == 2){
					result = await WeChat.shareToSession(shareData)
				}else{
					result = await WeChat.shareToTimeline(shareData)
				}
				ViewUtils.sldToastTip(I18n.t('com_SldShareCommon.text1'));
			}catch(error){
				ViewUtils.sldToastTip(I18n.t('com_SldShareCommon.text2'));
			}
		}
	cancleShare = () => {
    	this.closeModal();
	}

	closeModal = () => {
		this.props.cancleShare();
	}

    render() {
        return (
	        <Modal
		        backdropPressToClose={true}
		        entry='bottom'
		        position='bottom'
		        coverScreen={true}
		        onClosed = {() => this.closeModal()}
		        style={styles.shareModal}
		        ref={"calendarshare"}>
		        <View style={styles.shareTitleView}>
			        <Text style={styles.shareTitleText}>{I18n.t('com_SldShareCommon.text4')}</Text>
		        </View>
		        <View style={styles.shareView}>
			        {ViewUtils.getSldCombineIconShare(() => this.share(2), require('../assets/images/wechat.png'), I18n.t('GoodsDetailNew.Wechatfriends'))}
			        {ViewUtils.getSldCombineIconShare(() => this.share(3), require('../assets/images/friend.png'), I18n.t('GoodsDetailNew.WeChatMoments'))}
			        {/*{ViewUtils.getSldCombineIconShare(() => this.share(0), require('../assets/images/qq.png'), 'QQ好友')}*/}
			        {/*{ViewUtils.getSldCombineIconShare(() => this.share(4), require('../assets/images/qzone.png'), 'QQ空间')}*/}
			        {/*{ViewUtils.getSldCombineIconShare(() => this.share(1), require('../assets/images/blog.png'), '新浪微博')}*/}
		        </View>
		        <TouchableOpacity activeOpacity={1} style={styles.topicItem}
		                                  onPress={() => this.cancleShare()}>
				        <Text style={styles.cancleText}>取&nbsp;&nbsp;&nbsp;消</Text>
		        </TouchableOpacity>


	        </Modal>
        )
    }
}

const styles = StyleSheet.create({
	topicItem: {
		width: width,
		height: pxToDp(100), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'
	},
	cancleText:{
		fontWeight: '400',
		fontSize: pxToDp(32),
		color: '#333',
		textAlign: 'center'
	},
	shareView:{
		flexDirection: 'row',
		justifyContent: 'space-around',
		backgroundColor: '#f7f7f7',
		paddingBottom: pxToDp(40)
	},
	shareTitleView:{
		height: pxToDp(100),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f7f7f7',
	},
	shareTitleText:{
		color: '#333', fontSize: pxToDp(30)
	},
	shareModal:{
		backgroundColor: "#fff", height: DeviceInfo.isIPhoneX_deprecated?(pxToDp(350)+30):pxToDp(350),
		position: "absolute", left: 0, right: 0,
		width: width,
	},
});
