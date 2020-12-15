/*
 * 商品详情页面
 * @slodon
 * */
import React, {Component, Fragment} from 'react';
import RN, {
	View,
	Text,
	StyleSheet,
	Platform,
	ScrollView,
	Image,
	CameraRoll,
	StatusBar,
	TextInput,
	FlatList,
	PermissionsAndroid,
	TouchableOpacity,
	ImageBackground,
	DeviceInfo,
	Alert,
	Keyboard,
	Dimensions,
    DeviceEventEmitter,
    WebView
} from 'react-native';

import * as WeChat from "react-native-wechat";
import LogUtil from "../util/LogUtil";
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from "../util/ViewUtils";
import SldShareCommon from "../component/SldShareCommon";
import SldVideoPlay from "../component/SldVideoPlay";
import CommissionShare from "../component/CommissionShare";
import CommissionWelcome from "../component/CommissionWelcome";
import TimeCountDown from "../component/TimeCountDown";
import RequestData from "../RequestData";
import Modal from 'react-native-modalbox';
import {Constants, Carousel} from 'react-native-ui-lib';
import pxToDp from "../util/pxToDp";
import ShareUtil from '../util/ShareUtil';
import WebViewCon from '../component/WebViewCon';
import api from '../util/api';
import {styles, NAV_BAR_HEIGHT_IOS, NAV_BAR_HEIGHT_ANDROID, STATUS_BAR_HEIGHT} from './stylejs/goods';
import CountEmitter from "../util/CountEmitter";
import SldRed from "../component/SldRed";
import ComStyle from "../assets/styles/ComStyle";
import SldTextInput from "../component/SldTextInput";
import RNFS from 'react-native-fs';
import ImageViewer from 'react-native-image-zoom-viewer';
import {I18n, LANGUAGE_CHINESE, LANGUAGE_ENGLISH} from './../lang/index'
import PriceUtil from '../util/PriceUtil'
import {getUserPushHandInfo} from "../api/pushHandApi";
import StorageUtil from "../util/StorageUtil";

const RNModal = RN.Modal;

const {width: deviceWidth,height:deviceHeight} = Dimensions.get('window');
const screenwidth = deviceWidth;
let thisWebView = null;

const gifViewStyles = StyleSheet.create({
	container:{
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: Platform.OS === 'ios' ? (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896) ? pxToDp(176) : pxToDp(128) : pxToDp(100),
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 3,
		backgroundColor: 'rgba(0,0,0,0.2)',
	},
	img:{
		width: Dimensions.get('window').width*0.3,
		height: Dimensions.get('window').width*0.3,
	},
});

//loading
class GoodsDetailGifView extends Component {
	render() {
		return(
			<View style={gifViewStyles.container}>
                <Image style={gifViewStyles.img} source={require('../assets/images/product_detail_loading.gif')} resizeMode={'contain'}/>
			</View>
		)
	}
}

export default class GoodsDetailNew extends Component {
	constructor(props){
		super(props);
		this.state = {
			modal2: false,
			HWRecommendList: [],//好物推荐
			gid: props.navigation.state.params.gid,//商品id
			team_id: typeof (props.navigation.state.params.teamid) != 'undefined' ? props.navigation.state.params.teamid : '',//团id
			goods_detail: {},//商品基本信息
			goods_body: '',
			goods_body_detail: {},//商品详情
			lunbo_array: [],//轮播图片
			goods_info: {},//商品信息
			evaluatedata: [],//商品详情页展示的评价
			currentBody: '1',//顶部title默认值，商品
			scrollHeight: 0,//页面滚动的距离
			sele_gid: 0,//要加车或者立即购买的商品ID
			sele_spec: '默认',//选择的规格
			buy_num: 1,//购买数量，初始为1
			goods_map_spec: [],//商品的多规格
			spec_list: [],//规格，商品id关联数据
			seleSpecing: 0,//选择规格的弹层是否展示
			is_collect: false,//用户是否收藏商品
			cart_count: 0,//在商品详情购物车数量
			store_info: {},
			seleTitle: '',//选择规格数量的标题
			flag: 0,
			showGoodsBody: false,//是否显示商品详情
			goodsinfotip: '上拉查看更多详情',
			goodsdetailtip: '下拉返回底部',
			is_show_share: 0,//是否分享，0为否，1为是
			share_data: {},//分享的数据
			miaoshu: '',
			taidu: '',
			fahuospeed: '',
			goods_state: true,//商品状态
			sale_end_time: '',
			goods_suit_flag: false,//推荐组合的收起展开表示
			goods_bulding_flag: false,//优惠套装的收起展开表示
			bulding_data: [],
			bulding_data_goods: [],
			showMorePinList: false,//是否展示更多拼团列表
			sele_pintuan_team_id: 0,
			showManSong: false,//满即送展示单行，true为展示多行
			promotion_type: '',   // 活动类型
			presaleInfo: '',  //预售详情
			pinladder: '',   // 阶梯团阶梯详情
			pin_info: '',     // 阶梯团信息
			pin_time_out: '00:00:00',
			is_show_default_btn: true,
			pay_status: '1', // 阶梯团付款状态
			video_url: '',  //视频链接
			grade_info: '', //会员折扣数据
			redList: '', //优惠券数据
			shareImg: '',
			showShareImg: false,
			createHbshow: false,
			currentIndex: 0,
			modalVisible: false,
			images: [],
			showLoading: true,
			showJoinVipModal: false,
			isVip: false,
			pushInfo:{},
			refeCode: props.navigation.state.params.refeCode || '',//别人分享给当前用户的推广码
            language: LANGUAGE_CHINESE
		}
	}

	seleSpecing = 0;//是否展示

	componentDidMount(){
		console.log('唤醒商品详情页:', this.props.navigation)
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                });
            }
        });
		// setTimeout(() => {
		// 	this.setState({
		// 		showLoading:true
		// 	})
		// }, 100);
		this.props.navigation.addListener("willFocus", payload => {
            StorageUtil.get('language', (error, object) => {
                if (!error && object) {
                    this.setState({
                        language: object
                    });
                    this.initPage(object);
                } else {
                    this.setState({
                        language: LANGUAGE_CHINESE
                    });
                    this.initPage(LANGUAGE_CHINESE);
                }
            });
		});
	}

	componentWillUnmount(){
		if(typeof (this.timer) != 'undefined'){
			clearInterval(this.timer)
		}
        this.refs.seleSpec && this.refs.seleSpec.close();
        this.refs.redModal && this.refs.redModal.close();
        this.refs.joinVipModal && this.refs.joinVipModal.close();
	}

	shouldComponentUpdate(nextProps, nextState){
		const state = this.state;
		let isRender = false;
		for(let i in nextState){
			if(nextState[ i ] != state[ i ]){
				isRender = true;
				break;
			}
		}
		return isRender;
	}


	//初始化页面数据
	initPage = () => {
		let navigation = this.props.navigation;
		this.setState({
			navigation: navigation,
			gid: navigation.state.params.gid
		});

        this.fetchGoodsData(language);

		this.getUserInfo(language);
		//添加足迹事件
		if(key){
			this.addFootPrint(navigation.state.params.gid);
		}
	};

	fetchGoodsData(){
		let navigation = this.props.navigation;
        this.getSldGoodsDetail(navigation.state.params.gid, '', language);
		//获取商品详情
		this.getSldGoodsBody(navigation.state.params.gid)
			.then(result=>{
				setTimeout(() => {
					this.setState({
						showLoading:false
					})
				}, 600)
			})
			.catch(error=>{
				setTimeout(() => {
					this.setState({
						showLoading:false
					})
				}, 600)
			});
	};

	getUserInfo(){
		if (key){
			getUserPushHandInfo({
				key:key
			}).then(res=>{
				console.warn('ww:getUserPushHandInfo', res.datas.member_info.member_dev);
				if(res.code === 200){
					this.setState({
						isVip:res.datas.member_info.member_dev !== 'MEMBER',
						pushInfo:res.datas.member_info.push_info?res.datas.member_info.push_info:{}
					})
				}
			});
		}
	};

	getShareImg(cb){
		let that = this;
		RequestData.getSldData(AppSldUrl+`/index.php?app=goods&mod=shareimg&gid=${this.state.gid}&client=app_android`).then(res=>{
			if(res.status==200){
				let shareImgWH = {};
				Image.getSize(res.img,function(w,h){
					let bili = deviceWidth*0.72/w;
					let height = h*bili;
					shareImgWH.height = height;
					that.setState({
						shareImg: res.img,
						shareImgWH
					},()=>{
						cb&&cb()
					})
				})
			}
		})
	}

	//点击预览大图事件
	previewImg = (imgs,index) => {
		let {images} = this.state;
		images = [];
		imgs.map((val)=>{
			images.push({
				url:val
			});
		})
		this.setState({
			modalVisible: true,
			images: images,
			currentIndex:index,
		})
	};

	//去分享/去升级
	_onclickEarn(){
		if(key){
			if (this.state.isVip){
				this.share();
			} else{
				this.setState({
					showJoinVipModal: true
				})
			}
		}else{
			this.props.navigation.navigate('Login');
		}
	};
	_onclickQuitVip(){
		this.refs.joinVipModal.close();
		this.share();
	};
	_onclickJoinVip(){
		this.refs.joinVipModal.close();
		this.props.navigation.navigate('JoinVip', {isFrom:2});
	};

	goPageWithData = (type, data) => {
		if(this.refs.SldVideoPlay != undefined){
			this.refs.SldVideoPlay.pauseVideo();
		}
		this.refs.seleSpec.close();
		this.refs.redModal.close();
		this.seleSpecing = 0;
		this.props.navigation.navigate(type, data);
	}

	goPage = (type) => {
		if(this.refs.SldVideoPlay != undefined){
			this.refs.SldVideoPlay.pauseVideo();
		}
		this.refs.seleSpec.close();
		this.refs.redModal.close();
		this.seleSpecing = 0;
		this.props.navigation.navigate(type);
	}

	keFu = () => {
		if(key){
			this.props.navigation.navigate('KeFu', {
				gid: this.state.gid,
				t_id: this.state.store_info.vid,
				t_name: I18n.t('GoodsDetailNew.service')
			})
		}else{
			this.props.navigation.navigate('Login');
		}
		this.refs.seleSpec.close();
		this.seleSpecing = 0;
	};

	//根据商品id获取商品的信息
    getSldGoodsDetail = (gid, team_id, language) => {
        const url = `/index.php?app=goods&mod=goods_detail&key=${key}&gid=${gid}&team_id=${team_id}&lang_type=${language}`
		RequestData.getSldData(AppSldUrl + url)
			.then(result => {
				if(result.datas.error){
					this.setState({
						goods_state: false,
					});
					ViewUtils.sldToastTip(result.datas.error);
				}else{
					console.log(result,'goodsDetail')
					let sele_gid = result.datas.goods_info.gid;
					let sele_spec = I18n.t('GoodsDetailNew.default');
					let buy_num = 1;
					let goods_map_spec = [];
					let spec_list = [];
					let seleTitle = I18n.t('GoodsDetailNew.selected');
					let flag = this.state.flag;
					if(result.datas.goods_info.goods_spec){
						//有规格的情况下 ，获取所有规格展示
						let goods_info = result.datas.goods_info.goods_spec;
						goods_map_spec = result.datas.goods_map_spec ? result.datas.goods_map_spec : [];
						sele_spec = '';
						// if(flag){
						//     for (let i in goods_info) {
						//         sele_spec += ' ' + goods_info[i];
						//     }
						//     seleTitle = '已选';
						// }else{
						//     flag = 1;
						//     seleTitle = '规格数量选择';
						// }
						for(let i in goods_info){
							sele_spec += ' ' + goods_info[ i ];
						}
						spec_list = result.datas.spec_list;

					}

					let share_data = {};
					//如果是限时折扣，计算倒计时,未开始，按照开始时间计算，已开始，按结束时间来计算，已结束，不计算
					if(result.datas.goods_info.promotion_type == 'xianshi' || result.datas.goods_info.promotion_type == 'tuan'){
						let time = '';
						if(result.datas.goods_info.promotion_run_flag == 1){
							time = result.datas.goods_info.promotion_end_time_stamp
						}else if(result.datas.goods_info.promotion_run_flag == 0){
							time = result.datas.goods_info.promotion_end_time_stamp
						}
						this.setState({
							sale_end_time: time * 1000
						});

					}

					share_data.type = 'goods';
					share_data.text = result.datas.goods_info.goods_jingle;
					share_data.img = result.datas.new_goods_imgs[ 0 ];
					share_data.webUrl = AppSldDomain + '/appview/app_share.html?gid=' + result.datas.goods_info.gid;
					share_data.title = result.datas.goods_info.goods_name;

					let promotion_type = result.datas.goods_info.promotion_type;

					//  预售
					if(promotion_type == 'sld_presale'){
						this.getPresaleData();
					}

					// 阶梯团
					if(promotion_type == 'pin_ladder_tuan'){
						this.getLadderInfo();
					}

					// 拼团
					if(promotion_type == 'pin_tuan'){
						let pin_start_time = result.datas.pin.sld_start_time;
						let is_show_default_btn = true;   // 活动未开始为 true 已开始为 false
						is_show_default_btn = is_start(pin_start_time);
						this.setState({
							is_show_default_btn: is_show_default_btn
						})
					}


					this.setState({
						bulding_data: result.datas.has_bundling_data == 1 ? result.datas.bundling_data.bundling_array : [],
						bulding_data_goods: result.datas.has_bundling_data == 1 ? result.datas.bundling_data.b_goods_array : [],
						goods_detail: result.datas,
						lunbo_array: result.datas.new_goods_imgs,
						goods_info: result.datas.goods_info,
						evaluatedata: result.datas.comment.length > 0 ? result.datas.comment : [],
						evaluateinfo: result.datas.total_comment,
						sele_gid: sele_gid,
						sele_spec: sele_spec,
						buy_num: buy_num,
						goods_map_spec: goods_map_spec,
						spec_list: spec_list,
						is_collect: result.datas.is_favorate,
						store_info: result.datas.store_info,
						cart_count: result.datas.cart_count,
						seleTitle: seleTitle,
						flag: flag,
						share_data: share_data,
						HWRecommendList: result.datas.goods_commend_list,
						miaoshu: result.datas.store_comment.store_credit.store_desccredit.credit,
						taidu: result.datas.store_comment.store_credit.store_servicecredit.credit,
						fahuospeed: result.datas.store_comment.store_credit.store_deliverycredit.credit,
						video_url: result.datas.goods_info.video_url,
						grade_info: result.datas.grade_info,
						redList: result.datas.red,
					});

				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	};

	// 获取预售详情
	getPresaleData(){
		const {gid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=goods_detail&sld_addons=presale&gid=' + gid).then(res => {
			if(res.status === 200){
				let is_show_default_btn = true;
				let start_time = res.data.pre_start_time;
				is_show_default_btn = is_start(start_time);
				this.setState({
					presaleInfo: res.data,
					promotion_type: 'sld_presale',
					is_show_default_btn: is_show_default_btn
				})
			}else{
				// ViewUtils.sldToastTip(res.msg)
			}
		})
	}

	// 预售购买
	preSaleBuy = () => {
		if(key){
			if(!this.seleSpecing){
				this.refs.seleSpec.open();
				this.seleSpecing = 1;
			}
		}else{
			this.refs.seleSpec.close();
			this.seleSpecing = 0;
			if(this.refs.SldVideoPlay != undefined){
				this.refs.SldVideoPlay.pauseVideo();
			}
			this.props.navigation.navigate('Login');
		}
	}

//阶梯团 购买
	ladderBuy = () => {
		if(key){
			if(!this.seleSpecing){
				this.refs.seleSpec.open();
				this.seleSpecing = 1;
			}else{
				this.refs.seleSpec.close();
				if(this.refs.SldVideoPlay != undefined){
					this.refs.SldVideoPlay.pauseVideo();
				}
				this.props.navigation.navigate('PinLadderConfirm', {
					gid: this.state.gid,
					id: this.state.pin_info.id,
					num: this.state.buy_num
				});
			}
		}else{
			this.refs.seleSpec.close();
			this.seleSpecing = 0;
			if(this.refs.SldVideoPlay != undefined){
				this.refs.SldVideoPlay.pauseVideo();
			}
			this.props.navigation.navigate('Login');
		}
	}

	// 获取阶梯团详情
	getLadderInfo(){
		const {gid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=goods_detail&sld_addons=pin_ladder&gid=' + gid + '&key=' + key).then(res => {
			if(res.status == 200){
				let pin_info = res.data.pin_info;
				let pinladder = res.data.ladder_info;
				let all_num = pin_info.sld_all_num * 1;
				let already_num = pin_info.sld_already_num * 1;
				pin_info.pro = all_num > already_num ? (already_num / all_num) * 100 : 100;  // 阶梯进度

				let jt = 0;   // 进行到的阶梯
				for(let i = 0; i < pinladder.length; i++){
					let el = pinladder[ i ];
					if(already_num >= el.people_num){
						jt = i + 1;
					}else{
						break;
					}
				}
				pin_info.jt = jt;
				let prev = 0;
				pinladder.forEach((el, i) => {
					let now = parseInt(el.people_num);
					el.left_pro = (jt >= i + (jt == 0 ? 0 : 1)) ? (already_num >= now ? 100 : ((already_num - prev) / now) * 100) : 0;
					el.right_pro = jt >= i + 1 ? (already_num > now ? 100 : 0) : 0;
					prev = now;
				})

				let is_show_default_btn = true;   // 活动未开始为 true 已开始为 false
				let start_time = res.data.pin_info.start_time;
				is_show_default_btn = is_start(start_time);

				this.setState({
					pinladder: pinladder,
					pin_info: pin_info,
					promotion_type: 'pin_ladder_tuan',
					is_show_default_btn: is_show_default_btn
				})

				//停止已经打开的倒计时
				if(typeof (this.timer) != 'undefined'){
					//console.info("停止倒计时");
					clearInterval(this.timer)
				}

				if(is_show_default_btn){
					let s = start_time * 1000;
					this.start_time_out(s);
					//console.info("开始倒计时is_show_default_btn");
					this.timer = setInterval(() => {
						this.start_time_out(s);
					}, 1000)
				}else{
					this.time = res.data.pin_info.sld_sheng_time * 1;
					if(this.time > 0){
						this.time_out();
						//console.info("开始倒计时is_show_default_btnelse");
						this.timer = setInterval(() => {
							this.time_out();
						}, 1000)
					}
				}
			}else{
				ViewUtils.sldToastTip(res.msg);
			}
		})
	}

	// 阶梯团 开始倒计时
	start_time_out(time){
		let now = new Date().getTime();
		if(now < time){
			let diff = Math.floor((time - now) / 1000);
			let h = parseInt(diff / 60 / 60);
			let m = parseInt(diff / 60 % 60);
			let s = parseInt(diff % 60);
			h = h > 9 ? h : '0' + h;
			m = m > 9 ? m : '0' + m;
			s = s > 9 ? s : '0' + s;
			this.setState({
				pin_time_out: h + ':' + m + ':' + s
			})
		}else{
			clearInterval(this.timer);
			this.getLadderInfo();
		}
	}

	// 阶梯团倒计时
	time_out(){
		if(this.time == 0){
			clearInterval(this.timer);
			this.setState({
				pin_time_out: I18n.t('GoodsDetailNew.finished')
			})
		}
		let h = parseInt(this.time / 60 / 60);
		let m = parseInt(this.time / 60 % 60);
		let s = parseInt(this.time % 60);
		if(this.time > 0){
			h = h > 9 ? h : '0' + h;
			m = m > 9 ? m : '0' + m;
			s = s > 9 ? s : '0' + s;
			this.setState({
				pin_time_out: h + ':' + m + ':' + s
			})
			this.time--;
		}else{
			this.setState({
				pin_time_out: I18n.t('GoodsDetailNew.finished')
			})
		}
	}

	//获取商品详情
	getSldGoodsBody = (gid) => {
		return new Promise((resolve, reject)=>{
			RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=goods_body_xcx&gid=' + gid)
				.then(result => {
					if(result.state == 200){
						console.log(result,'body')
						let body = result.goods_detail.goods_body;
						let reg = new RegExp('<img', "g")
						this.setState({
							goods_body_detail: result.goods_detail,
							goods_body: body.replace(reg, "<img style=\"display: block;width:100%;\"")
						},()=>{
							console.log(this.state,'this.state')
						});
						resolve(result);
					}else{
						reject(I18n.t('GoodsDetailNew.text1'));
						ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text1'));
					}
				})
				.catch(error => {
					ViewUtils.sldErrorToastTip(error);
					reject(error);
				})
		});
	};

	goCart = () => {
		if(this.refs.SldVideoPlay != undefined){
			this.refs.SldVideoPlay.pauseVideo();
		}
		this.state.navigation.navigate("CartScreenPage");
		this.refs.seleSpec.close();
		this.seleSpecing = 0;
	}

	serviceDetail(){
		this.refs.calendarstart.open();
	}

	goShare = (type) => {
		if(type == 'share'){
			this.setState({
				is_show_share: 1,
			});
		}else{
			this.refs.calendarshare.close();
		}
	}
	cancleShare = () => {
		this.setState({
			is_show_share: 0,
		});
	}

	//去商品分享页
	share = (type) => {
	    if(key){
			console.log('商品详情:', this.state.goods_detail);
			// let this_new = this;
            // this_new.refs.calendarshare.close();
            let goods_info = this.state.goods_info;
            let goods_detail = this.state.goods_detail;

            let img = goods_detail.new_goods_imgs ? goods_detail.new_goods_imgs[0] : null;
            console.log(cur_user_info,'cur_user_info')
            let pushCode = this.state.pushInfo.push_code !== undefined ? this.state.pushInfo.push_code : '';
            console.warn('ww:push_code', pushCode);
            // let webUrl = AppSldDomain + '/cwap/cwap_product_detail.html?gid=' + goods_info.gid + '&pushCode=' + pushCode;
            let title = goods_info.goods_name;

			this.props.navigation.navigate('GoodShareScreen', {title: title, key, gid: goods_info.gid, price: PriceUtil.formatPrice(goods_info.show_price), img: img, pushCode: pushCode, market_price: PriceUtil.formatPrice(goods_info.goods_marketprice)});

            // let list = [2,3,7,8];//0:qq,1:新浪, 2:微信, 3:微信朋友圈,4:qq空间, 7:Facebook, 8:推特
			// 			console.warn('ww:ShareUtil.shareboard:data', text,img,webUrl,title,list);
            // ShareUtil.shareboard(text,img,webUrl,title,list,(code,message) =>{
            //     console.warn(message, 'ww:ShareUtil.shareboard:resp');
            // });

        } else {
            this.goPage('Login')
        }
	}


	seleSpec(){
		this.refs.seleSpec.open();
		this.seleSpecing = 1;
		// this.setState({
		//     seleSpecing: 1
		// });
	}

	toggleShowManSong = () => {
		this.setState({
			showManSong: !this.state.showManSong
		});
	}

	onClick(tab, type){
		let navigation = this.props.navigation;
		switch(type){
			case "evaluate":
				if(this.refs.SldVideoPlay != undefined){
					this.refs.SldVideoPlay.pauseVideo();
				}
				navigation.navigate(tab, {gid: this.state.gid});
				break;
			case "seleSpec":
				this.refs.seleSpec.open();
				this.seleSpecing = 1;
				break;
			case "Vendor":
				if(this.refs.SldVideoPlay != undefined){
					this.refs.SldVideoPlay.pauseVideo();
				}
				navigation.navigate('Vendor', {'vid': tab});
				break;
			default:
				break;
		}
	}

	// 领券
	ling = (id) => {
		if(key){
			RequestData.getSldData(AppSldUrl + '/index.php?app=red&mod=send_red&sld_addons=red&key=' + key + '&red_id=' + id).then(res => {
				if(res.code != '200'){
					return;
				}
				if(res.datas == 1){
					ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text2'));
					this.refs.redModal.close();
					CountEmitter.emit('gainvoucher');
					this.getSldGoodsDetail(navigation.state.params.gid);
					// this.getSldGoodsDetail(1284);
					this.getSldGoodsBody(navigation.state.params.gid);
				}else{
					ViewUtils.sldToastTip(res.datas);
				}
			})
		}else{
			this.goPage('Login')


		}
	}

	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.line }/>
		);
	}

	keyExtractor = (item, index) => {
		return index
	}
	getNewData = () => {

	}

	//优惠券item
	renderRedItem = ({item}) => {
		return (
            <SldRed
                info={item}
                status={1}
                add={ (id) => this.ling(id) }
                use={ () => {
                    this.goPageWithData('GoodsSearchList', {keyword: '', catid: ''})
                }}/>
		)
	}

	//优惠券领取弹窗
	renderRedModel = () => {
		return (<Modal
			backdropPressToClose={ true }
			entry='bottom'
			position='bottom'
			coverScreen={ true }
			swipeToClose={ false }
			ref={ "redModal" }
			style={ {
				backgroundColor: "#fff",
				height: DeviceInfo.isIPhoneX_deprecated ? (screenwidth + 30) : screenwidth,
				position: "absolute",
				left: 0,
				right: 0,
				width: deviceWidth,
				paddingBottom: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
			} }>
			<View style={ {
				height: 60,
				flexDirection: 'row',
				alignItems: 'center',
				paddingHorizontal: 15,
			} }>
				<Text style={ [ styles.service_title_text, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsDetailNew.getcoupon')}</Text>
			</View>
			<View style={ GlobalStyles.line }/>
			<View style={ GlobalStyles.line }/>
			{ this.state.redList.length > 0 &&

			<ScrollView showsVerticalScrollIndicator={ false }
			            style={ {maxHeight: screenwidth} }>
				{ this.state.redList.map(item => <SldRed
					info={ item }
					status={ 1 }
					add={ (id) => this.ling(id) }
					use={ () => {
						this.goPageWithData('GoodsSearchList', {keyword: '', catid: ''})
					} }/>) }
			</ScrollView>
			}
		</Modal>)
	}


	//优惠券领取入口
	renderRed = () => {
		if(this.state.redList && this.state.redList.length > 0){
			let len = this.state.redList.length>3 ? 3 : this.state.redList.length;
			return (
				<View style={ [ styles.sld_goods_title_view, {marginTop: 5} ] }>
					<TouchableOpacity activeOpacity={ 1 }
					                  onPress={ () => this.refs.redModal.open() }>
						<View style={ [ styles.sld_single_line, {height: 50} ] }>
							<View style={ [ styles.sld_single_left_view, {flexWrap: 'wrap'} ] }>
								<Text
									style={ [ styles.sld_single_left, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsDetailNew.discountcoupon')}</Text>
								<View style={styles.sld_red_show}>
									{this.state.redList.map((el,index)=>{
										if(index<len){
											return <ImageBackground
												source={require('../assets/images/goods_detail_red.png')}
												style={styles.red_bg}
												resizeMode={'contain'}
											>
												<Text style={{color: '#E1251B',fontSize: pxToDp(24)}}>{I18n.t('GoodsDetailNew.full')}{el.redinfo_full}{I18n.t('GoodsDetailNew.subtract')}{el.redinfo_money}</Text>
											</ImageBackground>
										}else{
											return <View></View>
										}
									})}
								</View>
							</View>
							<View style={ styles.sld_single_right }>
								<Image source={ require('../assets/images/sld_arrow_right.png') }
								       style={ styles.sld_single_right_icon }/>
							</View>
						</View>
					</TouchableOpacity>
				</View>)
		}else{
			return null;
		}
	}


	//会员等级优惠
	renderGradeItem = ({item}) => {
		return (
			<View style={ styles.topicContainer }>
				<Text
					style={ [ {
						color: '#000000',
						fontSize: pxToDp(30),
					}, GlobalStyles.sld_global_fontfamliy ] }>Ks{PriceUtil.formatPrice(item.goods_price)}</Text>
				<Image
					source={ {uri: item.grade_img} }
					style={ styles.gradeImg }
					defaultSource={require('../assets/images/default_icon_124.png')}
				/>

			</View>

		)
	}

	renderGrade = () => {
		if(this.state.grade_info){
			return (<View style={ [ styles.sld_goods_title_view, {marginLeft: pxToDp(20)} ] }>
				<View style={ {
					borderColor: '#C9AF8E',
					backgroundColor: '#C9AF8E',
					borderWidth: 1,
					width: pxToDp(120),
					height: pxToDp(30),
					borderRadius: pxToDp(20),
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: pxToDp(10)
				} }>
					{/*会员专享*/}
					<Text style={ {
						color: '#000000',
						fontSize: pxToDp(20),
						fontWeight: '300'
					} }>{I18n.t('GoodsDetailNew.vip')}</Text>
				</View>
				<FlatList
					data={ this.state.grade_info }
					keyExtractor={ (item, index) => index }
					renderItem={ this.renderGradeItem }
					horizontal={ true }
					showsHorizontalScrollIndicator={ false }
				/>
			</View>)
		}else{
			return null
		}
	}


	//好物推荐模块
	renderTopicItem = ({item}) => {
		return (
			<TouchableOpacity activeOpacity={ 1 } style={ styles.topicItem }
			                  onPress={ () => this.goGoodsDetail(item.gid) }>
				<Image source={ {uri: item.goods_image_url} } style={ styles.topicImg } defaultSource={require('../assets/images/default_icon_124.png')}/>
				<View style={ styles.topicContainer }>
					<View style={ [ GlobalStyles.sld_global_font ] }>
						<Text ellipsizeMode='tail' numberOfLines={ 1 }
						      style={ [ styles.topicTitle, GlobalStyles.sld_global_font ] }>{ item.goods_name }</Text>
						<Text
							style={ [ styles.topicDesc, GlobalStyles.sld_global_fontfamliy ] }>Ks{PriceUtil.formatPrice(item.show_price)}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	goGoodsDetail = (gid) => {
		const {navigation} = this.state;
		if(this.refs.SldVideoPlay != undefined){
			this.refs.SldVideoPlay.pauseVideo();
		}
		navigation.push('GoodsDetailNew', {'gid': gid});
	}
	//获取用户等级图片
	/*getGradeImg = (gradeid) => {
		switch(gradeid){
			case 0:
				return (<Image style={ styles.sld_mem_grade } source={ require('../assets/images/V1.jpg') }/>);
				break;
			case 1:
				return (<Image style={ styles.sld_mem_grade } source={ require('../assets/images/V2.jpg') }/>);
				break;
			case 2:
				return (<Image style={ styles.sld_mem_grade } source={ require('../assets/images/V3.jpg') }/>);
				break;
			case 3:
				return (<Image style={ styles.sld_mem_grade } source={ require('../assets/images/v4.png') }/>);
				break;
			default:
				return (<Image style={ styles.sld_mem_grade } source={ require('../assets/images/V0.jpg') }/>);
		}
	}*/


	//监听h5事件
	handleMessage = (datajson) => {
		let type = datajson.type;
		switch(type){
			case "goTop":
				this.setState({
					currentBody: '1',
				});
				break;
			default:
				break;
		}
	}


	//导航左边图标
	renSldLeftButton(image){
		return <TouchableOpacity
			activeOpacity={ 1 }
			onPress={ () => {
				if(this.refs.SldVideoPlay != undefined){
					this.refs.SldVideoPlay.pauseVideo();
				}
				this.props.navigation.goBack();
			} }>
			<View style={ GlobalStyles.topBackBtn }>
				<Image style={ GlobalStyles.topBackBtnImg } source={ image }></Image>
			</View>
		</TouchableOpacity>;
	}

	//收藏商品
	collectGoods = (gid) => {
		if(key){
			if(this.state.is_collect){
				//取消收藏
				RequestData.postSldData(AppSldUrl + '/index.php?app=userfollow&mod=favorites_del', {
					key: key,
					fav_id: gid
				})
					.then(result => {
						if(!result.datas.error){
							ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text3'));
							this.setState({
								is_collect: false
							});
						}else{
							ViewUtils.sldToastTip(result.datas.error);
						}
					})
					.catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
			}else{
				//收藏
				RequestData.postSldData(AppSldUrl + '/index.php?app=userfollow&mod=favorites_add', {key: key, gid: gid})
					.then(result => {
						if(!result.datas.error){
							ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text4'));
							this.setState({
								is_collect: true
							});
						}else{
							ViewUtils.sldToastTip(result.datas.error);
						}
					})
					.catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
			}
		}else{
			this.props.navigation.navigate('Login');
		}
	}

	//处理输入商品数量⌚️
	handleUpdateGoodNum(val){
	    // console.log(val)
        let bugNum = this.state.buy_num

		// let val = event.nativeEvent.text.replace(/(^\s*)|(\s*$)/g, "");
		if(bugNum && bugNum != ''){
			this.UpdateGoodNum(bugNum);
		}else{
			ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text5'));
		}
	}

//处理输入商品数量
	UpdateGoodNum(newGoodsNum){
	    console.log(newGoodsNum)
		let {goods_info, buy_num, goods_detail} = this.state;
		let quantity = buy_num;
		if(ViewUtils.isRealNum(newGoodsNum)){
			if(parseInt(newGoodsNum) <= 0){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text6'));
				quantity = 1;
			}else if(parseInt(newGoodsNum) > goods_info.goods_storage){ //大于库存的话提示
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text7') + goods_info.goods_storage);
				quantity = goods_info.goods_storage;
			}else if(goods_info.promotion_type == 'xianshi' && newGoodsNum <= goods_info.lower_limit * 1 - 1){
				//限时抢购不可以小于最低限购数量
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text8') + `${ goods_info.lower_limit }` + I18n.t('GoodsDetailNew.piece'));
				quantity = goods_info.lower_limit;
			}else if(goods_info.promotion_type == 'tuan' && newGoodsNum >= goods_info.upper_limit * 1 - 1){
				//团购是否超过限购数量
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.purchaselimitation') + `${ goods_info.upper_limit }` + I18n.t('GoodsDetailNew.piece'));
				quantity = goods_info.upper_limit;
			}else if(typeof (goods_detail.pin) != 'undefined' && goods_detail.pin.sld_max_buy != undefined && goods_detail.pin.sld_max_buy * 1 > 0 && this.state.buy_num * 1 > goods_detail.pin.sld_max_buy * 1){
				//拼团购买数量不能超过限购数量
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.purchaselimitation') + `${ goods_detail.pin.sld_max_buy }` + I18n.t('GoodsDetailNew.piece'));
				quantity = goods_detail.sld_max_buy;
			}else{
				quantity = parseInt(newGoodsNum);
			}
		}else{
			ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text5'));
			quantity = 1;
		}

		this.setState({
			buy_num: quantity,
		});
	}

	//导航右边分享和收藏图标
	renSldRightButton(){
		return (
            <View style={ {flexDirection: 'row'} }><TouchableOpacity
                activeOpacity={ 1 }
                onPress={ () => {
                    this.collectGoods(this.state.gid)
                } }>
                <Image
                    style={ {width: 22, height: 22, marginRight: 15} }
                    source={ this.state.is_collect ? require('../assets/images/favorite_r_red.png') : require('../assets/images/favorite_r_black.png') }
                />
            </TouchableOpacity>
            </View>
		)
	}

	//商品和详情切换
	changePage = (type) => {
		this.setState({
			currentBody: type,
		});
		// if (type == '2') {
		//     this.refs.goods_detail_scroll.scrollTo({x: 0, y: this.state.scrollHeight, animated: true});
		// } else {
		//     this.refs.goods_detail_scroll.scrollTo({x: 0, y: 0, animated: true});
		// }

	}

	getGoodsBody = (e) => {
		// if (e.nativeEvent.contentOffset.y + e.nativeEvent.layoutMeasurement.height >=
		// (e.nativeEvent.contentSize.height*1-11)){ let that = this; setTimeout(function(){ that.setState({
		// currentBody: '2', goodsinfotip:'释放查看更多详情', }); },2000); }
	}


	/*
	 * 规格选择事件，重新组装goods_map_spec和sele_spec数据，根据新规格获取商品id，从而获取新的商品信息
	 *
	 *
	 * */
	seSpecDetail = (titleindex, specid) => {
		let goods_map_spec = this.state.goods_map_spec;
		var data = goods_map_spec[ titleindex ].goods_spec_value;
		let sele_spec = '';
		for(let i = 0; i < data.length; i++){
			if(data[ i ][ 'specs_value_id' ] == specid){
				data[ i ].default = 1;
			}else{
				data[ i ].default = 0;
			}
		}
		goods_map_spec[ titleindex ].goods_spec_value = data;
		this.setState({
			goods_map_spec: goods_map_spec,
			sele_spec: sele_spec
		});
		//对规格id进行排序
		//排序获取gid
		let a = [];
		for(let i = 0; i < goods_map_spec.length; i++){
			for(let j = 0; j < goods_map_spec[ i ].goods_spec_value.length; j++){
				if(goods_map_spec[ i ].goods_spec_value[ j ].default == 1){
					a.push(goods_map_spec[ i ].goods_spec_value[ j ].specs_value_id);
				}
			}
		}
		let i = a.sort(function(e, t){
			return e - t
		}).join("|");
		//根据gid获取商品信息
		let gid = this.state.spec_list[ i ];
		this.setState({
			gid: gid
		});
		this.getSldGoodsDetail(gid);
	}

	_onLayout = (e) => {
		this.setState({
			scrollHeight: e.nativeEvent.layout.y,
		});

	}
	//添加足迹
	addFootPrint = (gid) => {
		RequestData.postSldData(AppSldUrl + '/index.php?app=usercenter&mod=addUserBrowserGoods', {key: key, gid: gid})
			.then(result => {

			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}
	//购物车数量
	editNum = (type) => {
		let num = this.state.buy_num;
		const {goods_info, goods_detail} = this.state;
		if(type == 'minus'){
			//库存不能小于1
			if(num <= 1){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text6'));
				return false;
			}
			//限时抢购不可以小于最低限购数量
			if(goods_info.promotion_type == 'xianshi' && num <= goods_info.lower_limit * 1 - 1){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text8') + `${ goods_info.lower_limit }` + I18n.t('GoodsDetailNew.piece'));
				return false;
			}
			num = num - 1;
		}else if(type == 'plus'){

			//大于库存的话提示
			if(num >= goods_info.goods_storage * 1 - 1){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text7') + goods_info.goods_storage);
				return false;
			}
			//团购是否超过限购数量
			if(goods_info.promotion_type == 'tuan' && num >= goods_info.upper_limit * 1 - 1){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.purchaselimitation') + `${ goods_info.upper_limit }` + I18n.t('GoodsDetailNew.piece'));
				return false
			}
			//拼团购买数量不能超过限购数量
			if(typeof (goods_detail.pin) != 'undefined' && goods_detail.pin.sld_max_buy != undefined && goods_detail.pin.sld_max_buy > 0 && this.state.buy_num >= goods_detail.pin.sld_max_buy){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.purchaselimitation') + goods_detail.pin.sld_max_buy + I18n.t('GoodsDetailNew.piece'));
				return false;
			}
			num = num + 1;
		}
		console.warn('ww:buy_num', num);
		this.setState({
			buy_num: num,
		});
	}

	//关闭所有弹层
	closeAllModal = () => {
		const {goods_info, goods_detail} = this.state;
		this.refs.seleSpec.close();//选择规格弹层
		this.seleSpecing = 0;
		this.refs.redModal.close()
		if(this.state.goods_info.goods_label != ''){
			this.refs.calendarstart.close();//服务弹层
		}
		if(goods_info.promotion_type == 'pin_tuan' && goods_detail.pin.team.length > 0){
			this.refs.pinTuanList.close();//拼团列表弹层
		}
	}

	//查看更多事件
	viewMorePintuan = () => {
		this.refs.pinTuanList.open();
	}

	//加入购物车事件,无key的话存本地缓存
	addCart = () => {
		if(key){
			if(!this.seleSpecing){
				this.refs.seleSpec.open();
				this.seleSpecing = 1;
				// this.setState({
				//     seleSpecing: 1
				// });
				// ViewUtils.sldToastTip('请选择相应的规格');
			}else{
				if(this.state.buy_num > this.state.goods_info.goods_storage){
					ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.understock'));
					// this.refs.seleSpec.close();
					// this.seleSpecing = 0;
					return;
				}
				const _this = this;
				//加入购物车同时删掉本地购物车缓存
				RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=cart_add', {
					key: key,
					gid: this.state.gid,
					quantity: this.state.buy_num,
					refe_code: this.state.refeCode
				})
					.then(result => {
						if(result.datas.status){
							//删除本地购物车缓存
							ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.addCartToast'));
							CountEmitter.emit('cart');
							setTimeout(function(){
								_this.refs.seleSpec.close();
								_this.seleSpecing = 0;
							}, 500);
							//获取购物车数量
							RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=cart_list', {key: key})
								.then(result => {
									if(!result.datas.error){
										console.log('获取购物车列表:', result.datas.cart_list)
                                        //获取购物车数量
										this.setState({
											cart_count: result.datas.cart_list.length,
										});
									}else{
										ViewUtils.sldToastTip(result.datas.error);
									}
								})
								.catch(error => {
									ViewUtils.sldErrorToastTip(error);
								})

						}else{
							ViewUtils.sldToastTip(result.datas.msg);
						}
					})
					.catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
			}

		}else{
			//添加到本地缓存
			this.refs.seleSpec.close();
			this.seleSpecing = 0;
			if(this.refs.SldVideoPlay != undefined){
				this.refs.SldVideoPlay.pauseVideo();
			}
			this.props.navigation.navigate('Login');
		}
	}

	//查看拼团详情
	viewPinTuanDetail = (pin_id, type = '') => {
		this.closeAllModal();
		const {sele_pintuan_team_id, goods_detail} = this.state;
		if(type == 'sele_pintuan'){
			if(goods_detail.pin.pinging > 0){
				Alert.alert(
					'',
					I18n.t('GoodsDetailNew.text10'),
					[
						{
							text: I18n.t('GoodsDetailNew.examine'), onPress: (() => {
								if(this.refs.SldVideoPlay != undefined){
									this.refs.SldVideoPlay.pauseVideo();
								}
								ViewUtils.goDetailPageNew(this.props.navigation, {
									'type': 'PTOrderDetail',
									'value': goods_detail.pin.pinging
								})
							})
						},
						{text: I18n.t('cancle'), onPress: (() => {}), style: 'cancle'}
					]
				);
			}else{
				if(pin_id != sele_pintuan_team_id){
					this.refs.seleSpec.open();
				}
				//选团参加团
				this.setState({
					sele_pintuan_team_id: pin_id == sele_pintuan_team_id ? '' : pin_id
				});
			}
		}else{
			this.closeAllModal();
			if(this.refs.SldVideoPlay != undefined){
				this.refs.SldVideoPlay.pauseVideo();
			}
			ViewUtils.goDetailPageNew(this.props.navigation, {'type': 'PTOrderDetail', 'value': pin_id});
		}
	}

	//立即购买事件
	goBuy = (type = '', is_join = '') => {
	    // if(this.seleSpecing === 0){
        //     this.refs.seleSpec.open();
        //     this.seleSpecing = 1;
        //     console.log(this.refs.seleSpec)
        // } else {
        //     this.refs.seleSpec.close();
        //     this.seleSpecing = 0;
        //     console.log(this.refs.seleSpec)
        // }
        // return false
		const {team_id, goods_detail, sele_pintuan_team_id, refeCode, language} = this.state;
		if(key){
			if(!this.seleSpecing){
				this.refs.seleSpec.open();
				this.seleSpecing = 1;
				// this.setState({
				//     seleSpecing: 1
				// });
				// ViewUtils.sldToastTip('请选择相应的规格');
			}else{
				if(this.state.buy_num > this.state.goods_info.goods_storage){
					ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.understock'));
					// this.refs.seleSpec.close();
					// this.seleSpecing = 0;
					return false;
				}
				//拼团购买数量不能超过限购数量
				if(typeof (goods_detail.pin) != 'undefined' && goods_detail.pin.sld_max_buy != undefined && goods_detail.pin.sld_max_buy > 0 && this.state.buy_num > goods_detail.pin.sld_max_buy){
					ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.purchaselimitation') + goods_detail.pin.sld_max_buy + I18n.t('GoodsDetailNew.piece'));
					return false;
				}
				if(type == 'pinging'){
					this.viewPinTuanDetail(goods_detail.pin.pinging);
					return false;
				}

				let cart_id = this.state.gid + "|" + this.state.buy_num;
				RequestData.postSldData(AppSldUrl + '/index.php?app=buy&mod=confirm', {key: key, cart_id: cart_id, lang_type: language})
					.then(result => {
						if(!result.datas.error){
							if(this.refs.SldVideoPlay != undefined){
								this.refs.SldVideoPlay.pauseVideo();
							}
							this.props.navigation.navigate('ConfirmOrder', {
								gid: this.state.gid,
								buy_num: this.state.buy_num,
								if_cart: 0,
								pin: type == 'pin' ? (goods_detail.pin.id) : "",
								team_id: (is_join == 'join_pin_tuan' && sele_pintuan_team_id > 0) ? sele_pintuan_team_id : '',
								refeCode: refeCode
							});
							this.refs.seleSpec.close();
							this.seleSpecing = 0;
						}else{
							ViewUtils.sldToastTip(result.datas.error);
							// if (this.state.seleSpecing == 1) {
							//     ViewUtils.sldToastTip(result.datas.error);
							// } else {
							//     ViewUtils.sldToastTip(result.datas.error);
							// }
						}
					})
					.catch(error => {
						ViewUtils.sldErrorToastTip(error);
					})
			}
		}else{
			//没有key的情况下跳登录页
			this.refs.seleSpec.close();
			this.seleSpecing = 0;
			if(this.refs.SldVideoPlay != undefined){
				this.refs.SldVideoPlay.pauseVideo();
			}
			this.props.navigation.navigate('Login');
		}
	}

	_contentViewScroll = (e) => {
		// var offsetY = e.nativeEvent.contentOffset.y; //滑动距离
		// var contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
		// var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
		// if (offsetY + oriageScrollHeight >= contentSizeHeight){
		// 	console.log('上传滑动到底部事件')
		// }

	}

	//查看更多，收起的点击事件
	viewMore = (type) => {
		if(type == 'suit'){
			this.setState({
				goods_suit_flag: !this.state.goods_suit_flag
			});
		}else{
			this.setState({
				goods_bulding_flag: !this.state.goods_bulding_flag
			});
		}
	}

	//进入聊天界面
	goChat = () => {
		let {store_info, goods_info, lunbo_array} = this.state;
		if(this.refs.SldVideoPlay != undefined){
			this.refs.SldVideoPlay.pauseVideo();
		}
		if(key){
			this.refs.seleSpec.close();
			goods_info.goods_image_new = lunbo_array[ 0 ];
			this.props.navigation.navigate('ServiceScreen', {store_info: store_info, goods_info: goods_info});
		}else{
			this.refs.seleSpec.close();
			this.seleSpecing = 0;
			this.props.navigation.navigate('Login');
		}
	}

	_onMessage = (e) => {
		let message = e.nativeEvent.data;
		let res = JSON.parse(message);
		console.log(res,'set')
		switch(res.type){
			case "height":
				this.setState({
					webViewHeight: parseInt(res.height)
				});
				break;
			case "preview":
				console.log(res.img)
				this.previewImg([res.img],0);
				break;
			default:
				break;
		}
	};

	_onLoadEnd = () => {
		const script = `window.postMessage(JSON.stringify({type: 'height',height: document.body.scrollHeight}))`;
		thisWebView && thisWebView.injectJavaScript(script);
	}

	closeShareModal = ()=>{
		this.setState({
			showShareImg: false,
			createHbshow: false
		})
	}


	// 申请权限
	checkPermission = () => {
		return new Promise ( ( resolve , reject ) => {
			const ischeck = PermissionsAndroid.check ( PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE );
			ischeck.then ( res => {
				const granted = PermissionsAndroid.request (
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
					{
						title : I18n.t('GoodsDetailNew.text11') ,
						message :
							I18n.t('GoodsDetailNew.text12') ,
					} ,
				);
				granted.then ( res => {
					resolve ();
				} ).catch ( err => {
					reject ();
					ViewUtils.sldToastTip ( I18n.t('GoodsDetailNew.text13') );
				} )
			} ).catch ( err => {
				resolve ();
			} )
		} )
	}


	/**
	 * 下载网页图片
	 * @param uri  图片地址
	 * @returns {*}
	 */
	DownloadImage() {
		const {shareImg } = this.state;
		return new Promise((resolve, reject) => {
			let timestamp = (new Date()).getTime();//获取当前时间错
			let random = String(((Math.random() * 1000000) | 0))//六位随机数
			let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
			const downloadDest = `${dirs}/${timestamp+random}.jpg`;
			const formUrl = shareImg;
			const options = {
				fromUrl: formUrl,
				toFile: downloadDest,
				background: true,
				begin: (res) => {
					// console.log('begin', res);
					// console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
				},
			};
			try {
				const ret = RNFS.downloadFile(options);
				ret.promise.then(res => {
					 console.log('success', res);
					 console.log('file://' + downloadDest)
					var promise = CameraRoll.saveToCameraRoll(downloadDest);
					promise.then(function(result) {
						ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text14'));
					}).catch(function(error) {
						LogUtil.log('error', error);
						ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text13'));
					});
					this.closeShareModal()
					resolve(res);
				}).catch(err => {
					this.closeShareModal()
					reject(new Error(err))
				});
			} catch (e) {
				this.closeShareModal()
				reject(new Error(e))
			}

		})

	}

	createHb = ()=>{
		this.getShareImg(()=>{
			this.setState({
				showShareImg: true,
				createHbshow: false
			})
		});
	}
    windowClose = ()=>{
        this.seleSpecing = 0;
	    // console.log('close')
    }

	shareHb = (type)=>{
		const { goods_info,shareImg,share_data } = this.state;
		if(type==1){
			if(Platform.OS === 'ios'){
				this.DownloadImage();
			}else{
				this.checkPermission ().then ( () => {
					 this.DownloadImage();
				} ).catch ( err => {
				} )
			}
		}else{
			if(Platform.OS === 'ios'){
				let shareData = {
					type: 'imageUrl',
					title: goods_info.goods_name,
					description: goods_info.goods_jingle,
					mediaTagName: '',
					messageAction: undefined,
					messageExt: undefined,
					imageUrl: shareImg
				};
				this.wechatShareImage(type,shareData);
			}else{
				let shareData = {
					name: '',
					shareImg: shareImg,
					webUrl: '',
					des: ''
				};
				this.shareHbImg(type,shareData)
			}
		}
	}

	shareGoods = type=>{
		const {share_data} = this.state;
		if(Platform.OS === 'ios'){
			let shareData = {
				type: 'news',
				title: share_data.title,
				descrption: share_data.text,
				thumbImage: share_data.img,
				webpageUrl: share_data.webUrl
			};
			this.wechatShareImage(type,shareData);
		}else{
			let shareData = {
				name: share_data.text,
				shareImg: share_data.img,
				webUrl: share_data.webUrl,
				des: share_data.title
			};
			this.shareHbImg(type,shareData)
		}
	}
    carouselChange (e){
	    if(this.state.video_url){
	        if(e>0){
                this.refs.SldVideoPlay.pauseVideo();
            }
        }
    }

	wechatShareImage = async(type,shareData) => {
		try{
			let result='';
			if(type == 2){
				result = await WeChat.shareToSession(shareData)
			}else{
				result = await WeChat.shareToTimeline(shareData)
			}
			console.log(result)
			ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text15'));
		}catch(error){
			ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text13'));
		}
		this.closeShareModal();
	}

	shareHbImg(type,shareData){
		ShareUtil.share ( shareData.name , shareData.shareImg,shareData.webUrl , shareData.des , type , ( code , message ) => {
			if(message=='success'){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text15'));
			}else if(message=='cancel'){
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text16'));
			}else{
				ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.text17'));
			}
		} );
		this.closeShareModal();
	}

	render(){
		const { height } = Dimensions.get('window')
		const { params } = this.props.navigation.state
		const _w = deviceWidth;
		const _h = this.state.webViewHeight == 0 ? 1 : this.state.webViewHeight;
        console.log(_h,'_h')

		const _h_ios = this.state.webViewHeightIos;
		const goods_body = this.state.goods_body;
        // const goods_body = '<p>kaishishiashdasido</p>'
		console.warn(this.state.goods_info.show_price, 'goods_info.show_price');
		const {
			lunbo_array, goods_info, evaluatedata, evaluateinfo, sele_gid, sele_spec, buy_num, goods_map_spec, currentBody, goods_detail,
			store_info, goods_state, sale_end_time, goods_suit_flag, goods_bulding_flag, bulding_data, bulding_data_goods, gid, sele_pintuan_team_id,
			showManSong, promotion_type, presaleInfo, pinladder, pin_info, is_show_default_btn, video_url,currentIndex,modalVisible,images
		} = this.state;


		let higtest_point = 0;
		if(typeof (this.state.goods_detail.goods_info) !== 'undefined' && typeof (this.state.goods_detail.goods_info.max_point) !== 'undefined'){
			higtest_point = this.state.goods_detail.goods_info.max_point;
		}else{
			higtest_point = 0;
		}
		let service = [];
		if(typeof (this.state.goods_detail.goods_info) !== 'undefined' && this.state.goods_detail.goods_info.goods_label != ''){
			service = this.state.goods_detail.goods_info.goods_label;
		}


		return (
			<View style={ [ styles.container, {paddingBottom: pxToDp(100), paddingTop: Platform.OS === 'ios' ? (height === 812 || height === 896) ? pxToDp(88) : pxToDp(40) : StatusBar.currentHeight} ] }>
				{/* header */}
				<View style={{backgroundColor: '#fff'}}>
                    <StatusBar style={{barStyle: 'default'}}/>
					<View style={ styles.navBar }>
						<View style={ styles.navBarButton }>
							{ this.renSldLeftButton(require('../assets/images/goback.png')) }
						</View>
						<View style={ [ styles.navBarTitleContainer, this.props.titleLayoutStyle ] }>
							<Text
								style={ {color: '#333', fontSize: pxToDp(34), fontWeight: '300'} }>{I18n.t('GoodsDetailNew.title')}</Text>
						</View>
						{
							!(params && params.fromVip) &&
                            <View style={ styles.navBarButton }>
                                {
                                    this.renSldRightButton()
                                }
                            </View>
						}
					</View>
				</View>
				<View style={{flex: 1}}>
                    <ScrollView
                        style={{flex: 1}}
                        showsVerticalScrollIndicator={ false }
                        ref='goods_detail_scroll'
                        scrollEventThrottle={ 10 }
                        onScroll={ (e) => this._contentViewScroll }
                        onMomentumScrollEnd={ (e) => {this.getGoodsBody(e)} }
                    >
                        <Carousel onChangePage={(e)=>{this.carouselChange(e)}}>
                            { video_url ? <View>
                                <SldVideoPlay ref={ "SldVideoPlay" } videoUrl={ video_url } videoCover={ lunbo_array[ 0 ] }
                                              navigation={ this.props.navigation }

                                />
                                <View style={ styles.carouselTip }>
                                    <Text
                                        style={ styles.carouselText }>{ 1 }/{ lunbo_array.length + 1 }</Text></View>
                            </View> : null
                            }

                            { lunbo_array.map((val, index) => {
                                return (<View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={()=>this.previewImg(lunbo_array,index)}
                                    >
                                        <Image key={ index } style={ styles.sld_wrap_lunbo }
                                               source={ {uri: val} }
                                               defaultSource={require('../assets/images/default_icon_124.png')}
                                               onLoad={ () => {
                                                   this.setState({imgHeight: 'auto'});
                                               } }
                                        />
                                    </TouchableOpacity>
                                    <View style={ styles.carouselTip }>
                                        <Text style={ styles.carouselText }>{ index * 1 + 1 + (video_url ? 1 : 0) }/{ lunbo_array.length + (video_url ? 1 : 0) }</Text></View>
                                </View>);
                            }) }

                        </Carousel>

                        {/*vip专属礼品*/}
                        {
                            params && params.fromVip ?
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 0,
                                        height: 50,
                                        backgroundColor: 'rgb(239,239,239)'
                                    }}
                                >
                                    <Image style={{marginLeft: 5, width: 34, height:17}}
                                           source={require('../assets/images/pushHand/VIP_text.png')}
                                           resizeMode={'contain'}
                                    />
                                    <Text style={{marginLeft: 3, fontSize: 18, fontWeight: '500'}}>{I18n.t('GoodsDetailNew.text28')}</Text>
                                </View> : null
                        }

                        {/*限时折扣活动标示-start*/ }
                        { goods_info.promotion_type == 'xianshi' && (
                            <View style={ {width: screenwidth, height: pxToDp(100), flexDirection: "row"} }>
                                <View style={ {
                                    width: pxToDp(441),
                                    height: '100%',
                                    backgroundColor: '#AC1FE0',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    paddingLeft: pxToDp(20)
                                } }>
                                    <View style={[GlobalStyles.flex_common_row, {justifyContent: 'flex-start', alignItems: 'flex-end'}]}>
                                        <Text style={{color: '#fff', fontSize: pxToDp(34), marginBottom: pxToDp(4)}}>Ks</Text>
                                        <Text style={{color: '#fff', fontSize: pxToDp(46)}}>
                                            { goods_info.promotion_run_flag == 1 ? PriceUtil.formatPrice(goods_info.show_price) : PriceUtil.formatPrice(goods_info.goods_price)}
                                        </Text>
                                    </View>
                                    <View style={ {flexDirection: 'row', justifyContent: 'flex-start'} }>
                                        <View style={ {
                                            height: pxToDp(30),
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                            flexDirection: 'row'
                                        } }>
                                            <View style={[{width: pxToDp(88), height: '100%', backgroundColor: '#fff'}, GlobalStyles.flex_common_row]}>
                                                <Text style={ {color: '#AC1FE0', fontSize: pxToDp(18),} }>限时折扣</Text>
                                            </View>
                                            <Text style={ {color: '#fff', fontSize: pxToDp(18), paddingLeft: pxToDp(10), paddingRight: pxToDp(10)} }>
                                                { goods_info.xianshi_discount }
                                            </Text>
                                        </View>
                                        <Text style={{color: "#fff", fontSize: pxToDp(24), marginLeft: pxToDp(20), textDecorationLine: 'line-through'}}>
                                            Ks&nbsp;{ goods_info.promotion_run_flag == 0 ? PriceUtil.formatPrice(goods_info.show_price) : PriceUtil.formatPrice(goods_info.goods_price)}
                                        </Text>
                                    </View>
                                </View>

                                { goods_info.promotion_run_flag != 0 && goods_info.promotion_run_flag != 1 && (
                                    <View style={ {
                                        width: pxToDp(309),
                                        height: '100%',
                                        backgroundColor: '#F3D8FF',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    } }>
                                        <Text>{I18n.t('GoodsDetailNew.finished')}</Text>
                                    </View>
                                ) }


                                { (goods_info.promotion_run_flag == 0 || goods_info.promotion_run_flag == 1) && (
                                    <View style={ {
                                        width: pxToDp(309),
                                        height: '100%',
                                        backgroundColor: '#F3D8FF',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    } }>
                                        <Text style={ {
                                            color: "#9011BF",
                                            fontSize: pxToDp(26)
                                        } }>{I18n.t('GoodsDetailNew.minimum')} { goods_info.lower_limit }{I18n.t('GoodsDetailNew.person')}</Text>
                                        <View style={ [ GlobalStyles.flex_common_row, {marginTop: pxToDp(6)} ] }>
                                            { ViewUtils.getSldImg(26, 26, require("../assets/images/xianshitime.png")) }
                                            <View style={ [ GlobalStyles.flex_common_row, {marginLeft: pxToDp(8)} ] }>
                                                <Text style={ {
                                                    color: '#9011BF',
                                                    fontSize: pxToDp(20)
                                                } }>{ goods_info.promotion_run_flag == 1 ? I18n.t('GoodsDetailNew.endtiem') : (goods_info.promotion_run_flag == 0 ? I18n.t('GoodsDetailNew.starttime') : I18n.t('GoodsDetailNew.finished')) }</Text>

                                                <TimeCountDown
                                                    bgColor={ '#E1B0F4' } time_color={ '#9011BF' } time_size={ 20 }
                                                    bg_width={ 35 } bg_height={ 25 } seg_color={ '#9011BF' } seg_size={ 22 }
                                                    enddate={ (new Date(goods_info.promotion_start_time_stamp * 1000) - new Date() > 0 ? goods_info.promotion_start_time_stamp : goods_info.promotion_end_time_stamp) * 1000 }/>
                                            </View>
                                        </View>
                                    </View>
                                ) }
                            </View>
                        ) }

                        {/*限时折扣活动标示-end*/ }


                        {/*团购活动标示-start*/ }
                        { goods_info.promotion_type == 'tuan' && (
                            <ImageBackground source={ require("../assets/images/sld_gdetail_tuan.png") }
                                             resizeMode="stretch"
                                             style={ {width: screenwidth, height: pxToDp(100), flexDirection: "row"} }>
                                <View style={ {
                                    flex: 1,
                                    height: '100%',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    paddingLeft: pxToDp(20)
                                } }>
                                    <View style={ [ GlobalStyles.flex_common_row, {
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-end'
                                    } ] }><Text style={ {
                                        color: '#fff',
                                        fontSize: pxToDp(34),
                                        marginBottom: pxToDp(4)
                                    } }>Ks</Text><Text style={ {
                                        color: '#fff',
                                        fontSize: pxToDp(46)
                                    } }>{PriceUtil.formatPrice(goods_info.show_price)}</Text></View>
                                    <View style={ {flexDirection: 'row', justifyContent: 'flex-start'} }>
                                        <View style={ {
                                            height: pxToDp(30),
                                            borderWidth: 1,
                                            borderColor: '#C20F52',
                                            flexDirection: 'row',
                                            borderRadius: pxToDp(13)
                                        } }>
                                            <View style={ [ {
                                                paddingHorizontal: 10,
                                                height: '100%',
                                                backgroundColor: '#C20F52'
                                            }, GlobalStyles.flex_common_row ] }><Text style={ {
                                                color: '#fff',
                                                fontSize: pxToDp(18),
                                            } }>{`${I18n.t('GoodsDetailNew.save')}`}{goods_info.show_price && goods_info.goods_price ? goods_info.goods_price-goods_info.show_price: ''}</Text></View>
                                        </View>
                                        <Text style={ {
                                            color: "#fff",
                                            fontSize: pxToDp(24),
                                            marginLeft: pxToDp(20),
                                            textDecorationLine: 'line-through'
                                        } }>Ks&nbsp;{ PriceUtil.formatPrice(goods_info.goods_price) }</Text>
                                    </View>
                                </View>

                                <View style={ {
                                    width: deviceWidth*0.344,
                                    height: '100%',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                } }>
                                    <Text style={ {
                                        color: "#F31367",
                                        fontSize: pxToDp(26)
                                    } }>{I18n.t('GoodsDetailNew.dumpling')} { goods_info.saled_num }{I18n.t('GoodsDetailNew.piece')}</Text>
                                    <View style={ [ GlobalStyles.flex_common_row, {marginTop: pxToDp(6)} ] }>

                                        <View style={ [ GlobalStyles.flex_common_row, {marginLeft: pxToDp(8)} ] }>
                                            <Text style={ {
                                                color: '#F31367',
                                                fontSize: pxToDp(20)
                                            } }>{ (new Date(goods_info.promotion_start_time_stamp * 1000)) - new Date() > 0 ? I18n.t('GoodsDetailNew.starttime') : ((new Date(goods_info.promotion_end_time_stamp * 1000)) - new Date() > 0 ? I18n.t('GoodsDetailNew.endtiem') : I18n.t('GoodsDetailNew.finished')) }</Text>


                                            <TimeCountDown
                                                bgColor={ '#FDC0D5' } time_color={ '#F31367' } time_size={ 20 }
                                                bg_width={ 35 } bg_height={ 25 } seg_color={ '#F31367' } seg_size={ 22 }
                                                enddate={ (new Date(goods_info.promotion_start_time_stamp * 1000) - new Date() > 0 ? goods_info.promotion_start_time_stamp : goods_info.promotion_end_time_stamp) * 1000 }/>
                                        </View>
                                    </View>
                                </View>

                            </ImageBackground>
                        ) }
                        {/*团购活动标示-end*/ }


                        {/*拼团活动标示-start*/ }
                        { goods_info.promotion_type == 'pin_tuan' && typeof (goods_detail.pin) != 'undefined' && (
                            <ImageBackground source={ require("../assets/images/sld_gdetail_pintuan.jpg") }
                                             resizeMode="stretch"
                                             style={ {width: screenwidth, height: pxToDp(100), flexDirection: "row"} }>
                                <View style={ {
                                    width: pxToDp(441),
                                    height: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    paddingLeft: pxToDp(20)
                                } }>
                                    <View style={ [ GlobalStyles.flex_common_row, {
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-end'
                                    } ] }><Text style={ {
                                        color: '#fff',
                                        fontSize: pxToDp(40),
                                        marginBottom: pxToDp(4)
                                    } }>Ks</Text><Text style={ {
                                        color: '#fff',
                                        fontSize: pxToDp(62)
                                    } }>{ PriceUtil.formatPrice(goods_info.show_price) }</Text></View>

                                    <View style={ {
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        paddingLeft: pxToDp(40)
                                    } }>
                                        <Text style={ {
                                            color: '#fff',
                                            fontSize: pxToDp(22)
                                        } }>{I18n.t('GoodsDetailNew.colonel')}Ks{ PriceUtil.formatPrice(goods_detail.pin.sld_return_leader) }</Text>
                                        <View style={ [ {
                                            height: pxToDp(31),
                                            borderRadius: pxToDp(16),
                                            backgroundColor: '#B20A10',
                                            paddingLeft: pxToDp(15),
                                            paddingRight: pxToDp(15),
                                            marginTop: pxToDp(10)
                                        }, GlobalStyles.flex_common_row ] }>
                                            <Image style={ {width: pxToDp(23), height: pxToDp(19)} }
                                                   resizeMode={ 'contain' } tintColor={ '#FFEEAB' }
                                                   source={ require("../assets/images/sld_tuan_list_icon.png") }/>
                                            <Text style={ {
                                                color: '#FFEEAB',
                                                fontSize: pxToDp(20),
                                                marginLeft: pxToDp(8)
                                            } }>{ goods_detail.pin.sld_team_count }人团</Text>
                                        </View>


                                    </View>
                                </View>

                                <View style={ {
                                    width: pxToDp(309),
                                    height: '100%',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                } }>
                                    <Text style={ {
                                        color: "#5F4A08",
                                        fontSize: pxToDp(26)
                                    } }>{I18n.t('GoodsDetailNew.Haveyouspell')} { goods_detail.pin.sales }{I18n.t('GoodsDetailNew.piece')}</Text>
                                    <View style={ [ GlobalStyles.flex_common_row, {marginTop: pxToDp(6)} ] }>

                                        <View style={ [ GlobalStyles.flex_common_row, {marginLeft: pxToDp(8)} ] }>
                                            <Text style={ {
                                                color: '#65540F',
                                                fontSize: pxToDp(20)
                                            } }>{ (new Date(goods_info.start_time * 1000)) - new Date() > 0 ? I18n.t('GoodsDetailNew.starttime') : ((new Date(goods_info.end_time * 1000)) - new Date() >= 0) ? I18n.t('GoodsDetailNew.endtiem') : I18n.t('GoodsDetailNew.finished') }</Text>

                                            <TimeCountDown
                                                bgColor={ '#D0B340' } time_color={ '#65540F' } time_size={ 20 }
                                                bg_width={ 35 } bg_height={ 25 } seg_color={ '#65540F' } seg_size={ 22 }
                                                enddate={ (new Date(goods_info.start_time * 1000) - new Date() > 0 ? goods_info.start_time : goods_info.end_time) * 1000 }/>
                                        </View>
                                    </View>
                                </View>

                            </ImageBackground>
                        ) }
                        {/*拼团活动标示-end*/ }

                        {/*预售活动标示start*/ }
                        { goods_info.promotion_type == 'sld_presale' && presaleInfo != '' &&
                        <ImageBackground source={ require('../assets/images/presaleBg.png') } style={ styles.presale }>
                            <View>
                                <Text style={ {color: '#fff', fontSize: pxToDp(30)} }>Ks<Text
                                    style={ {color: '#fff', fontSize: pxToDp(50)} }>{PriceUtil.formatPrice(presaleInfo.pre_sale_price)}</Text>
                                    <Text style={ {color: 'rgba(255，255，255，0.6)', fontSize: pxToDp(20)} }>预售价</Text></Text>
                                <Text style={ {color: '#fff', fontSize: pxToDp(24), marginTop: pxToDp(5)} }>原价 <Text
                                    style={ {textDecorationLine: 'line-through'} }>Ks{PriceUtil.formatPrice(presaleInfo.goods_price)}</Text></Text>
                            </View>
                            <View>
                                <Text
                                    style={ {color: '#fff', fontSize: pxToDp(28)} }>{ presaleInfo.pre_end_time_str }</Text>
                            </View>
                        </ImageBackground> }
                        {/*预售活动标示end*/ }

                        {/*阶梯团活动标示start*/ }
                        { goods_info.promotion_type == 'pin_ladder_tuan' && pin_info != '' && <ImageBackground
                            style={ {width: screenwidth, height: pxToDp(110)} }
                            source={ require('../assets/images/jttbg.png') }
                        >
                            <View style={ [ styles.pin_ladder, styles.bw ] }>
                                <View style={ styles.center }>
                                    <Text
                                        style={ {
                                            marginRight: pxToDp(20),
                                            color: '#FFFFFF',
                                            fontSize: pxToDp(30)
                                        } }
                                    >{I18n.t('GoodsDetailNew.money')}Ks<Text style={ {fontSize: pxToDp(40)} }>{ pin_info.sld_ding_price }</Text></Text>
                                    <View>
                                        <Text style={ [ styles.pin_txt, {marginBottom: pxToDp(10)} ] }>{I18n.t('GoodsDetailNew.currentprice')}
                                            Ks{PriceUtil.formatPrice(pin_info.sld_now_price)}</Text>
                                        <Text style={ styles.pin_txt }>{I18n.t('GoodsDetailNew.originalprice')} Ks{PriceUtil.formatPrice(pin_info.goods_price)}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text
                                        style={ styles.pin_r_txt }>{ is_show_default_btn ? I18n.t('GoodsDetailNew.starttime') : I18n.t('GoodsDetailNew.endtiem') }：{ this.state.pin_time_out }</Text>
                                    <View style={ styles.pin_pro_w }>
                                        <View style={ [ styles.pin_pro, {width: `${ pin_info.pro }%`} ] }></View>
                                    </View>
                                    <Text style={ styles.pin_r_txt }>{I18n.t('GoodsDetailNew.Offered')}{ pin_info.sld_already_num }人</Text>
                                </View>
                            </View>
                        </ImageBackground> }
                        {/*阶梯团活动标示end*/ }

                        {/*商品名称*/}
                        <View style={ styles.sld_goods_title_view }>
                            <Text numberOfLines={ 2 }
                                  style={ [ styles.sld_goods_detail_title, GlobalStyles.sld_global_fontfamliy ] }>{ goods_info.goods_name }</Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: 15,
                                marginTop: 10
                            }}>
                                <Text numberOfLines={ 2 } style={ [ styles.sld_goods_detail_jingletitle, GlobalStyles.sld_global_fontfamliy ] }>
                                    { goods_info.goods_jingle }
                                </Text>
                                {/*<TouchableOpacity*/}
                                {/*	activeOpacity={1}*/}
                                {/*	onPress={()=>{*/}
                                {/*		this.share()*/}
                                {/*	}}*/}
                                {/*	style={{width: pxToDp(54),height: pxToDp(54),marginLeft: pxToDp(30)}}*/}
                                {/*>*/}
                                {/*	<Image source={require('../assets/images/goods_share.png')} resizeMode={'contain'} style={{width: pxToDp(54),height: pxToDp(54)}}/>*/}
                                {/*</TouchableOpacity>*/}
                            </View>

                            {
                                !((params && params.fromVip) || goods_info.promotion_type == 'pin_tuan' || goods_info.promotion_type == 'tuan' || goods_info.promotion_type == 'xianshi') && (
                                    <View style={ {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: "flex-end",
                                        paddingBottom: 10,
                                        paddingTop: 10,
                                    } }>
                                        {/*商品价格*/}
                                        <Text style={ {
                                            color: '#ba1418',
                                            fontSize: 25,
                                            marginRight: 20,
                                            marginLeft: 15,
                                        } }>
                                            {goods_info.show_price === undefined?'':'Ks'+PriceUtil.formatPrice(goods_info.show_price)}
                                            {/*原价*/}
                                            <Text style={{
                                                color: '#707070',
                                                fontWeight: '300',
                                                fontSize: pxToDp(20),
                                                textDecorationLine: 'line-through'
                                            }}>
                                                {goods_info.goods_marketprice=== undefined?'':'Ks'+PriceUtil.formatPrice(goods_info.goods_marketprice)}
                                            </Text>
                                        </Text>


                                        {/*手机专享活动标示-start*/ }
                                        { goods_info.promotion_type == 'p_mbuy' && (
                                            <View style={ [ GlobalStyles.flex_common_row, {
                                                paddingLeft: pxToDp(10),
                                                paddingRight: pxToDp(10),
                                                paddingTop: pxToDp(0),
                                                paddingBottom: pxToDp(0),
                                                borderColor: '#EE262C',
                                                borderWidth: 1,
                                                marginRight: pxToDp(20),
                                                height: pxToDp(36),
                                                marginBottom: pxToDp(8)
                                            } ] }><Text style={ {
                                                color: '#EE262C',
                                                fontSize: pxToDp(22),
                                                fontWeight: '300'
                                            } }>{I18n.t('GoodsDetailNew.Premiumprice')}</Text></View>
                                        ) }

                                        {/*手机专享活动标示-end*/ }
                                    </View>
                                ) }
                        </View>
                        {/*去分享/去升级*/}
                        {goods_info.is_push_goods =='1' &&
                        <CommissionShare
                            isVIP={this.state.isVip}
                            onclickEarn={this._onclickEarn.bind(this)}
                            pushPrice={goods_info.push_price}
                        />
                        }

                        { goods_info.promotion_type == 'pin_ladder_tuan' && pinladder != '' &&
                        <View style={ styles.pin_jt }>
                            <View style={ styles.pin_ladder_pro }>
                                <Image
                                    style={ styles.jtt_img }
                                    resizeMode={ 'contain' }
                                    source={ require('../assets/images/jtt_l.png') }
                                />

                                <ScrollView
                                    horizontal={ true }
                                    showsHorizontalScrollIndicator={ false }
                                >
                                    { pinladder.map((item, i) => <View style={ styles.jtt_item }>
                                        <View style={ [ styles.jtt_item_top, pin_info.jt == i + 1 ? styles.jtt_on : '' ] }>
                                            <Text
                                                style={ [ styles.jtt_txt, {color: pin_info.jt >= i + 1 ? '#ED6307' : '#9C9C9C'} ] }>Ks{PriceUtil.formatPrice(item.pay_money)}</Text>
                                            <Text
                                                style={ [ styles.jtt_txt, {color: pin_info.jt >= i + 1 ? '#ED6307' : '#9C9C9C'} ] }>{I18n.t('GoodsDetailNew.full')}{ item.people_num }{I18n.t('GoodsDetailNew.Mentuxedo')}</Text>
                                        </View>
                                        <View style={ [ styles.jtt_item_b ] }>
                                            <View style={ styles.jtt_line }>
                                                <Text
                                                    style={ [ styles.jtt_dot, {backgroundColor: pin_info.jt >= i + 1 ? '#ED6307' : '#D1D1D1'} ] }>{ i + 1 }</Text>
                                                <View style={ styles.jtt_pro_l }>
                                                    <View
                                                        style={ [ styles.jtt_pro, {width: `${ item.left_pro }%`} ] }></View>
                                                </View>
                                                <View style={ styles.jtt_pro_r }>
                                                    <View
                                                        style={ [ styles.jtt_pro, {width: `${ item.right_pro }%`} ] }></View>
                                                </View>
                                            </View>
                                            <Text style={ [ styles.jtt_txt, {
                                                marginTop: pxToDp(6),
                                                color: pin_info.jt >= i + 1 ? '#ED6307' : '#9C9C9C'
                                            } ] }>{I18n.t('GoodsDetailNew.ladder')}{ i + 1 }</Text>
                                        </View>
                                    </View>) }
                                </ScrollView>

                                <Image
                                    style={ styles.jtt_img }
                                    resizeMode={ 'contain' }
                                    source={ require('../assets/images/jtt_r.png') }
                                />
                            </View>
                        </View> }

                        {/*会员等级优惠价格显示-begain*/ }
                        {/*{*/}
                        {/*this.renderGrade()*/}
                        {/*}*/}
                        {/*会员等级优惠价格显示-end*/ }

                        {/*满即送活动-start*/ }
                        { goods_detail.mansong_info != null && goods_detail.mansong_info.rules.length > 0 && (
                            <View style={ {
                                width: screenwidth,
                                backgroundColor: '#fff',
                                paddingLeft: 15,
                                paddingRight: 15,
                                marginTop: 10,
                                paddingTop: 8,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                height: (showManSong ? 'auto' : pxToDp(92)),
                                overflow: 'hidden'
                            } }>
                                <View style={ [ {
                                    width: pxToDp(60),
                                    height: pxToDp(40),
                                    borderWidth: 1,
                                    borderColor: main_color,
                                    borderRadius: pxToDp(4),
                                }, GlobalStyles.flex_common_row ] }>
                                    <Text style={ {color: main_color, fontSize: pxToDp(20), fontWeight: '300'} }>{I18n.t('GoodsDetailNew.promotion')}</Text>
                                </View>

                                <View style={ {
                                    marginLeft: pxToDp(30),
                                    width: screenwidth - 15 - pxToDp(80),
                                    flexDirection: 'column'
                                } }>

                                    { goods_detail.mansong_info.rules.map((item, index) => {
                                        return (
                                            <View key={ 'mansong' + index } style={ {
                                                flexDirection: 'row',
                                                justifyContent: 'flex-start',
                                            } }>

                                                <View style={ {
                                                    width: screenwidth - 30 - pxToDp(135),
                                                    flexDirection: "column",
                                                    justifyContent: 'flex-start',
                                                    paddingBottom: pxToDp(25)
                                                } }>
                                                    <View style={ [ GlobalStyles.flex_com_row_start, {
                                                        width: '100%',
                                                        height: pxToDp(66),
                                                        marginBottom: pxToDp(10),
                                                    } ] }>
                                                        <Text
                                                            numberOfLines={ 2 }
                                                            style={ {
                                                                color: "#333333",
                                                                fontSize: pxToDp(26),
                                                                lineHeight: pxToDp(33),
                                                                fontWeight: '400'
                                                            } }>{I18n.t('GoodsDetailNew.full')}{ item.price }{I18n.t('GoodsDetailNew.subtract')}{ item.discount }元{ (typeof (item.gid) != 'undefined' && item.gid > 0) ? (',赠' + (item.mansong_goods_name.length > 30 ? (item.mansong_goods_name.substr(0, 30) + '...') : item.mansong_goods_name) + '一个') : '' }</Text>
                                                    </View>
                                                    { typeof (item.gid) != 'undefined' && item.gid > 0 && (
                                                        <TouchableOpacity
                                                            activeOpacity={ 1 }
                                                            onPress={ () => this.goGoodsDetail(item.gid) }
                                                            style={ [ GlobalStyles.flex_com_row_start ] }>
                                                            { ViewUtils.getSldImg(90, 90, {uri: item.goods_image_url}) }
                                                            <View style={ [ {
                                                                width: screenwidth - 30 - pxToDp(240),
                                                                height: pxToDp(90),
                                                                marginLeft: pxToDp(15),
                                                                flexDirection: 'column',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'flex-start'
                                                            } ] }>
                                                                <Text numberOfLines={ 2 } style={ {
                                                                    color: '#999999',
                                                                    fontWeight: '300',
                                                                    fontSize: pxToDp(22)
                                                                } }>{ item.mansong_goods_name }</Text>
                                                                <Text style={ {
                                                                    color: main_color,
                                                                    fontSize: pxToDp(22),
                                                                    fontWeight: '400'
                                                                } }>Ks { PriceUtil.formatPrice(item.goods_price) }</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) }

                                                </View>
                                                { index == 0 && (
                                                    <TouchableOpacity
                                                        activeOpacity={ 1 }
                                                        onPress={ () => this.toggleShowManSong() }
                                                        style={ [ {
                                                            width: pxToDp(60),
                                                            height: pxToDp(66),
                                                            flexDirection: 'row',
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center'
                                                        } ] }>
                                                        <Image resizeMode={ 'contain' }
                                                               style={ {width: pxToDp(30), height: pxToDp(23)} }
                                                               source={ showManSong ? require('../assets/images/sld_arrow_up.png') : require('../assets/images/sld_arrow_down.png') }/>
                                                    </TouchableOpacity>
                                                ) }


                                            </View>
                                        )
                                    }) }

                                </View>

                            </View>
                        ) }
                        {/*满即送活动-end*/ }


                        <View style={ GlobalStyles.space_shi_separate }/>
                        {/*商品规格选择模块start*/ }
                        <TouchableOpacity activeOpacity={ 1 }
                                          onPress={ () => this.seleSpec() }>
                            <View style={ [ styles.sld_single_line, {height: 50} ] }>
                                <View style={[styles.sld_single_left_view, {paddingRight: 5}]}>
                                    <View>
                                        <Text style={[GlobalStyles.sld_global_font]}>{ this.state.seleTitle }</Text>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text
                                            style={[GlobalStyles.sld_global_font, {marginLeft: 15, marginRight: 1, color: '#999'}]}
                                            numberOfLines={2}
                                        >
                                            {sele_spec} {sele_spec != '' ? 'x' : '' }{ sele_spec != '' ? buy_num : ''}
                                        </Text>
                                    </View>
                                </View>
                                <Image style={styles.sld_single_right_icon} source={require('../assets/images/sld_arrow_right.png')}/>
                            </View>
                        </TouchableOpacity>
                        {/*商品规格选择模块end*/ }


                        {/*优惠券领取-begain*/ }
                        {
                            !(params && params.fromVip) && this.renderRed()
                        }
                        {/*优惠券领取-end*/ }

                        {/*优惠券弹窗-begain*/ }
                        {
                            !(params && params.fromVip) && this.renderRedModel()
                        }
                        {/*优惠券弹窗-end*/ }

                        <View style={ GlobalStyles.line }/>
                        {/*商品积分模块start*/ }
                        {/*{*/}
                            {/*!(params && params.fromVip) && higtest_point > 0 &&*/}
                            {/*ViewUtils.getSldSingleLeftItem('', I18n.t('GoodsDetailNew.integral'), I18n.t('GoodsDetailNew.text18') + higtest_point + I18n.t('GoodsDetailNew.integral'), '', 50)*/}
                        {/*}*/}
                        <View style={ GlobalStyles.line }/>

                        {/*商品积分模块end*/ }

                        {/*商品服务模块start*/ }
                        { service.length > 0 && (
                            <TouchableOpacity activeOpacity={ 1 }
                                              onPress={ () => this.serviceDetail() }>
                                <View style={ [ styles.sld_single_line, ] }>
                                    <View style={ styles.sld_single_left_view }>
                                        <Text style={ [ styles.sld_single_left, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsDetailNew.serve')}</Text>
                                        <View style={ [ styles.sld_single_left_text, GlobalStyles.sld_global_font ] }>

                                            { service.map((item, index) => {
                                                return (
                                                    <Text key={ index }
                                                          style={ [ styles.label_service_left, GlobalStyles.sld_global_font ] }>{ item.label_name }</Text>
                                                );
                                            }) }

                                            <Text
                                                style={ [ styles.sld_single_left_text_detail, GlobalStyles.sld_global_font ] }></Text>


                                        </View>
                                    </View>
                                    <View style={ styles.sld_single_right }>
                                        <Image source={ require('../assets/images/sld_arrow_right.png') }
                                               style={ styles.sld_single_right_icon }/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ) }

                        {/*商品服务模块end*/ }


                        {/*拼团列表模块start*/ }
                        { goods_info.promotion_type == 'pin_tuan' && typeof (goods_detail.pin) != 'undefined' && goods_detail.pin.team.length > 0 && (
                            <View style={ {
                                marginTop: 10,
                                backgroundColor: '#fff',
                                width: screenwidth,
                                paddingLeft: 15,
                                paddingRight: 15,
                                flexDirection: "column",
                            } }>
                                <Text style={ {
                                    color: '#3A3A3A',
                                    fontSize: pxToDp(28),
                                    paddingTop: pxToDp(30),
                                    paddingBottom: pxToDp(30)
                                } }>{I18n.t('GoodsDetailNew.text19')}</Text>
                                { (goods_detail.pin.team).map((item, index) => {
                                    return (
                                        index < 2 && <View key={ index } style={ {
                                            flexDirection: "row",
                                            width: '100%',
                                            height: pxToDp(90),
                                            backgroundColor: main_color,
                                            borderRadius: pxToDp(45),
                                            borderColor: main_color,
                                            borderWidth: 1,
                                            marginBottom: pxToDp(30)
                                        } }>
                                            <TouchableOpacity
                                                activeOpacity={ 1 }
                                                onPress={ () => this.viewPinTuanDetail(item.id) }
                                                style={ {
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: pxToDp(530),
                                                    backgroundColor: '#fff',
                                                    borderBottomLeftRadius: pxToDp(45),
                                                    borderTopLeftRadius: pxToDp(45)
                                                } }>
                                                <View style={ {
                                                    flexDirection: 'row',
                                                    justifyContent: "flex-start",
                                                    alignItems: 'center'
                                                } }>
                                                    <Image style={ {
                                                        width: pxToDp(82),
                                                        height: pxToDp(82),
                                                        borderRadius: pxToDp(41),
                                                        marginLeft: pxToDp(3)
                                                    } }
                                                           source={ (item.avatar).indexOf('http') != -1 ? {uri: item.avatar} : require("../assets/images/sld_default_avator.png") }
                                                           defaultSource={require('../assets/images/default_icon_124.png')}
                                                    />
                                                    <View style={ {
                                                        flexDirection: 'column',
                                                        justifyContent: 'flex-start',
                                                        alignItems: 'center',
                                                        marginLeft: pxToDp(19)
                                                    } }>
                                                        <Text style={ {
                                                            color: '#3A3A3A',
                                                            fontSize: pxToDp(24)
                                                        } }>{ item.member_name }</Text>
                                                        <Text style={ {
                                                            color: '#3A3A3A',
                                                            fontSize: pxToDp(18),
                                                            marginTop: pxToDp(10)
                                                        } }>{ item.member_areainfo }</Text>
                                                    </View>
                                                </View>
                                                <View style={ {
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-end',
                                                    paddingRight: pxToDp(25)
                                                } }>
                                                    <Text style={ {
                                                        color: main_color,
                                                        fontSize: pxToDp(24)
                                                    } }>{I18n.t('GoodsDetailNew.difference')}{ item.sheng }{I18n.t('GoodsDetailNew.clustering')}</Text>
                                                    <View style={ {
                                                        flexDirection: 'row',
                                                        marginTop: pxToDp(10)
                                                    } }><TimeCountDown
                                                        bgColor={ '#fff' } time_color={ '#3A3A3A' } time_size={ 20 }
                                                        bg_width={ 25 } bg_height={ 20 } seg_color={ '#3A3A3A' }
                                                        seg_size={ 22 }
                                                        seg_width={ 0 }
                                                        enddate={ (item.sld_end_time) * 1000 }/><Text
                                                        style={ {
                                                            color: '#3A3A3A',
                                                            fontSize: pxToDp(20)
                                                        } }> {I18n.t('GoodsDetailNew.over')}</Text></View>

                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={ 1 }
                                                onPress={ () => this.viewPinTuanDetail(item.id, item.id == goods_detail.pin.pinging ? '' : 'sele_pintuan') }
                                                style={ [ GlobalStyles.flex_common_row, {width: pxToDp(180)} ] }>
                                                <Text style={ {
                                                    color: '#fff',
                                                    fontSize: pxToDp(28),
                                                    marginRight: pxToDp(10),
                                                    marginLeft: -pxToDp(15)
                                                } }>{ goods_detail.pin.pinging > 0 ? (item.id == goods_detail.pin.pinging ? I18n.t('GoodsDetailNew.Mygroup') : I18n.t('GoodsDetailNew.othergroup')) : (item.id == sele_pintuan_team_id ? I18n.t('GoodsDetailNew.selected') : I18n.t('GoodsDetailNew.gotuxedo')) }</Text>
                                                <Image tintColor={ '#fff' }
                                                       style={ {width: pxToDp(12), height: pxToDp(24)} }
                                                       resizeMode={ 'contain' }
                                                       source={ require("../assets/images/sld_arrow_right.png") }/>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }) }

                                { goods_detail.pin.team.length > 2 && (
                                    <TouchableOpacity
                                        activeOpacity={ 1 }
                                        onPress={ () => this.viewMorePintuan() }
                                        style={ GlobalStyles.flex_common_row }><Text style={ {
                                        color: '#808080',
                                        fontSize: pxToDp(20),
                                        paddingTop: pxToDp(20),
                                        paddingBottom: pxToDp(20)
                                    } }>{I18n.t('GoodsDetailNew.seemore')}</Text></TouchableOpacity>
                                ) }
                            </View>) }

                        {/*拼团列表模块end*/ }

                        <View style={ GlobalStyles.space_shi_separate }/>


                        {/* 用户评价模块start*/ }
                        {
                            !(params && params.fromVip) && evaluatedata.length == 0 &&
                            <View style={ [ styles.sld_goods_detial_evalute ] }>
                                { ViewUtils.getSldSingleItem(() => this.onClick('EvaluateList', 'evaluate'), I18n.t('GoodsDetailNew.userevaluation'), I18n.t('GoodsDetailNew.available'), require('../assets/images/sld_arrow_right.png'), 50) }
                                <View style={ GlobalStyles.line }/>
                            </View>
                        }
                        { !(params && params.fromVip) && evaluatedata.length > 0 && (
                            <View style={ [ styles.sld_goods_detial_evalute ] }>
                                { ViewUtils.getSldSingleItem(() => this.onClick('EvaluateList', 'evaluate'), I18n.t('GoodsDetailNew.userevaluation') + ' (' + evaluateinfo.all + ')', evaluateinfo.good_percent + '%' + I18n.t('GoodsDetailNew.goodreputation'), require('../assets/images/sld_arrow_right.png'), 50) }
                                <View style={ GlobalStyles.line }/>
                                <View
                                    style={ [ styles.sld_single_line_vertical_center, {marginTop: 12, marginBottom: 12} ] }>
                                    <Image style={ styles.sld_mem_avator }
                                           source={ {uri: evaluatedata[ 0 ].member_avatar} }
                                           defaultSource={require('../assets/images/default_icon_124.png')}
                                    />
                                    <Text
                                        style={ [ styles.sld_mem_name, GlobalStyles.sld_global_font ] }>{ evaluatedata[ 0 ].geval_frommembername }</Text>


                                    { evaluatedata[ 0 ].geval_scores == 1 && (
                                        <Image style={ styles.sld_mem_score }
                                               source={ require('../assets/images/sld_rate.png') }/>
                                    ) }
                                    { evaluatedata[ 0 ].geval_scores == 2 && (
                                        <View style={ styles.eva_xing }><Image style={ styles.sld_mem_score }
                                                                               source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/></View>
                                    ) }
                                    { evaluatedata[ 0 ].geval_scores == 3 && (
                                        <View style={ styles.eva_xing }><Image style={ styles.sld_mem_score }
                                                                               source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/></View>
                                    ) }
                                    { evaluatedata[ 0 ].geval_scores == 4 && (
                                        <View style={ styles.eva_xing }><Image style={ styles.sld_mem_score }
                                                                               source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/></View>
                                    ) }
                                    { evaluatedata[ 0 ].geval_scores == 5 && (
                                        <View style={ styles.eva_xing }><Image style={ styles.sld_mem_score }
                                                                               source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/><Image
                                            style={ styles.sld_mem_score }
                                            source={ require('../assets/images/sld_rate.png') }/></View>
                                    ) }

                                </View>
                                <View style={ styles.sld_single_line_vertical_center }><Text
                                    style={ [ styles.sld_eva_time, styles.sld_eva_time_date, GlobalStyles.sld_global_font ] }>{ evaluatedata[ 0 ].addtimestr }</Text>
                                    <Text
                                        style={ [ styles.sld_eva_time, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsDetailNew.specification')}</Text>
                                </View>
                                <View style={ {marginTop: 15, marginBottom: 15} }><Text
                                    style={ [ styles.sld_eva_content, GlobalStyles.sld_global_font ] }
                                    numberOfLines={ 2 }>{ evaluatedata[ 0 ].geval_content }</Text></View>
                                <View style={ styles.sld_single_line_vertical_center }>
                                    { (typeof (evaluatedata[ 0 ].geval_image_list) != 'undefined' && evaluatedata[ 0 ].geval_image_list.length > 0) && (
                                        evaluatedata[ 0 ].geval_image_list.map((item, index) => {
                                                return (
                                                    <Image key={ index } style={ styles.sld_eval_img } source={ {uri: item} } defaultSource={require('../assets/images/default_icon_124.png')}/>
                                                )
                                            }
                                        )) }
                                </View>
                            </View>
                        ) }
                        {/*用户评价模块end*/ }

                        <View style={ GlobalStyles.space_shi_separate }/>
                        {
                            !(params && params.fromVip) &&
                            ViewUtils.getSldSingleItemGoodsToVen(() => this.onClick(store_info.vid, 'Vendor'), store_info.avatar != '' ? {uri: store_info.avatar} : require('../assets/images/sld_default_ven_logo.png'), store_info.store_name, I18n.t('GoodsDetailNew.Intotheshop'), require('../assets/images/sld_arrow_right.png'), 50)
                        }

                        {
                            !(params && params.fromVip) && <View style={ GlobalStyles.line }/>
                        }


                        {/*优惠套装模块start*/ }
                        { !(params && params.fromVip) && goods_detail.has_bundling_data == 1 && (
                            <View style={ {
                                width: screenwidth,
                                paddingLeft: 15,
                                paddingRight: 15,
                                paddingBottom: 10,
                                backgroundColor: '#fff',
                                marginTop: 10
                            } }>

                                <View style={ {
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: pxToDp(92)
                                } }>
                                    <Text style={ {color: "#353535", fontSize: pxToDp(28), fontWeight: '300'} }>{I18n.t('GoodsDetailNew.suit')}</Text>
                                    <Text style={ {
                                        color: "#353535",
                                        fontSize: pxToDp(28),
                                        fontWeight: '300'
                                    } }>{I18n.t('GoodsDetailNew.common')}{ goods_detail.bundling_data.bundling_count }{I18n.t('GoodsDetailNew.cover')}</Text>
                                </View>

                                {
                                    bulding_data.map((item, index) => {
                                        return (
                                            <View
                                                style={ {display: index == 0 ? 'flex' : (goods_bulding_flag ? 'flex' : 'none')} }
                                                key={ index }>
                                                <View style={ {
                                                    width: '100%',
                                                    height: pxToDp(130),
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start'
                                                } }>
                                                    <View style={ {width: screenwidth - 30 - pxToDp(220)} }>
                                                        <ScrollView showsHorizontalScrollIndicator={ false }
                                                                    horizontal={ true }>
                                                            <View style={ {
                                                                flexDirection: 'row',
                                                                justifyContent: 'flex-start',
                                                                flexWrap: 'wrap'
                                                            } }>
                                                                {
                                                                    bulding_data_goods[ item.id ].map((items, indexs) => {
                                                                        return (
                                                                            <View key={ indexs }
                                                                                  style={ {flexDirection: 'row'} }>
                                                                                <TouchableOpacity
                                                                                    activeOpacity={ 1 }
                                                                                    onPress={ () => this.goGoodsDetail(items.id) }
                                                                                    style={ {
                                                                                        width: pxToDp(130),
                                                                                        height: pxToDp(130),
                                                                                        borderWidth: 0.5,
                                                                                        borderColor: '#F1F1F1'
                                                                                    } }>
                                                                                    { ViewUtils.getSldImg(130, 130, {uri: items.image}) }
                                                                                </TouchableOpacity>
                                                                                { indexs != (bulding_data_goods[ item.id ].length - 1) && (
                                                                                    <View style={ {
                                                                                        flexDirection: 'row',
                                                                                        height: pxToDp(130),
                                                                                        width: pxToDp(36),
                                                                                        justifyContent: 'center',
                                                                                        alignItems: 'center'
                                                                                    } }>
                                                                                        <Text style={ {
                                                                                            color: '#929292',
                                                                                            fontSize: pxToDp(40)
                                                                                        } }>+</Text>
                                                                                    </View>
                                                                                ) }
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>

                                                        </ScrollView>
                                                    </View>
                                                    <TouchableOpacity
                                                        activeOpacity={ 1 }
                                                        onPress={ () => {
                                                            if(this.refs.SldVideoPlay != undefined){
                                                                this.refs.SldVideoPlay.pauseVideo();
                                                            }
                                                            this.props.navigation.navigate('GoodsBundling', {
                                                                'bl_id': item.id,
                                                                'gid': gid,
                                                                'title': item.name
                                                            })
                                                        } }
                                                        style={ {
                                                            width: pxToDp(220),
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            height: pxToDp(130),
                                                            flexDirection: "column",
                                                            justifyContent: "center",
                                                            alignItems: 'flex-end'
                                                        } }>
                                                        <View style={ {flexDirection: 'row', alignItems: 'baseline'} }>
                                                            <Text style={ {
                                                                color: '#353535',
                                                                fontSize: pxToDp(24),
                                                                fontWeight: '300'
                                                            } }>{I18n.t('GoodsDetailNew.Packageprice')}</Text>
                                                            <Text style={ {
                                                                color: '#F41919',
                                                                fontSize: pxToDp(24),
                                                                fontWeight: '400',
                                                                marginLeft: pxToDp(5)
                                                            } }>Ks{ PriceUtil.formatPrice(item.price) }</Text>
                                                        </View>
                                                        <View style={ {
                                                            borderColor: '#FF0000',
                                                            borderWidth: 0.5,
                                                            paddingLeft: pxToDp(13),
                                                            paddingRight: pxToDp(13),
                                                            paddingTop: pxToDp(4),
                                                            paddingBottom: pxToDp(4),
                                                            borderRadius: pxToDp(6),
                                                            marginTop: pxToDp(10)
                                                        } }>
                                                            <Text style={ {
                                                                color: '#F41919',
                                                                fontSize: pxToDp(20),
                                                                fontWeight: '300'
                                                            } }>{I18n.t('GoodsDetailNew.province')}:Ks{ PriceUtil.formatPrice(item.cost_price - item.price) }</Text>
                                                        </View>
                                                        <View style={ {
                                                            borderColor: '#F44A40',
                                                            backgroundColor: '#F44A40',
                                                            borderWidth: 1,
                                                            width: pxToDp(120),
                                                            height: pxToDp(30),
                                                            borderRadius: pxToDp(20),
                                                            flexDirection: 'row',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginTop: pxToDp(10)
                                                        } }>
                                                            <Text style={ {
                                                                color: '#fff',
                                                                fontSize: pxToDp(20),
                                                                fontWeight: '300'
                                                            } }>{I18n.t('GoodsDetailNew.purchase')}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                { (index != (goods_detail.bundling_data.bundling_count - 1) && index != 0 || (index == 0 && goods_bulding_flag)) && (
                                                    <View style={ GlobalStyles.leftline }/>
                                                ) }
                                            </View>
                                        )
                                    })
                                }
                                { goods_detail.bundling_data.bundling_count > 1 &&
                                <TouchableOpacity
                                    activeOpacity={ 1 }
                                    onPress={ () => this.viewMore('bundling') }
                                    style={ {
                                        width: screenwidth,
                                        height: pxToDp(92),
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#fff'
                                    } }>
                                    <Text style={ {
                                        color: '#353535',
                                        fontSize: pxToDp(22),
                                        fontWeight: '300'
                                    } }>{ goods_bulding_flag ? I18n.t('GoodsDetailNew.packup') : I18n.t('GoodsDetailNew.seemore') }</Text>

                                </TouchableOpacity>
                                }

                            </View>
                        ) }
                        {/*优惠套装模块start*/ }
                        {/*推荐组合模块start*/ }
                        { !(params && params.fromVip) && goods_detail.has_suite_data == 1 && (
                            <View style={ {
                                width: screenwidth,
                                paddingLeft: 15,
                                paddingRight: 15,
                                paddingBottom: 10,
                                backgroundColor: '#fff',
                                marginTop: 10
                            } }>

                                <View style={ {
                                    width: '100%',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: pxToDp(92)
                                } }>
                                    <Text style={ {color: "#353535", fontSize: pxToDp(28), fontWeight: '300'} }>{I18n.t('GoodsDetailNew.combination')}</Text>
                                    <Text style={ {
                                        color: "#353535",
                                        fontSize: pxToDp(28),
                                        fontWeight: '300'
                                    } }>{I18n.t('GoodsDetailNew.common')}{ goods_detail.suite_data.length }{I18n.t('GoodsDetailNew.cover')}</Text>
                                </View>

                                {
                                    goods_detail.suite_data.map((item, index) => {
                                        return (
                                            <View
                                                style={ {display: index == 0 ? 'flex' : (goods_suit_flag ? 'flex' : 'none')} }
                                                key={ index }>
                                                <View style={ {
                                                    width: '100%',
                                                    height: pxToDp(130),
                                                    flexDirection: 'row',
                                                    justifyContent: 'flex-start'
                                                } }>
                                                    <View style={ {width: screenwidth - 30 - pxToDp(220)} }>
                                                        <ScrollView horizontal={ true }
                                                                    showsHorizontalScrollIndicator={ false }>
                                                            <View style={ {
                                                                flexDirection: 'row',
                                                                justifyContent: 'flex-start',
                                                                flexWrap: 'wrap'
                                                            } }>
                                                                {
                                                                    item.goods.map((items, indexs) => {
                                                                        return (
                                                                            <View key={ indexs }
                                                                                  style={ {flexDirection: 'row'} }>
                                                                                <TouchableOpacity
                                                                                    activeOpacity={ 1 }
                                                                                    onPress={ () => this.goGoodsDetail(items.gid) }
                                                                                    style={ {
                                                                                        width: pxToDp(130),
                                                                                        height: pxToDp(130),
                                                                                        borderWidth: 0.5,
                                                                                        borderColor: '#F1F1F1'
                                                                                    } }>
                                                                                    { ViewUtils.getSldImg(130, 130, {uri: items.goods_image_url}) }
                                                                                    <View style={ {
                                                                                        width: pxToDp(130),
                                                                                        height: pxToDp(23),
                                                                                        flexDirection: 'row',
                                                                                        justifyContent: 'center',
                                                                                        alignItems: 'center',
                                                                                        backgroundColor: '#999999',
                                                                                        position: "absolute",
                                                                                        bottom: 0,
                                                                                        left: 0,
                                                                                        right: 0,
                                                                                    } }>
                                                                                        <Text style={ {
                                                                                            color: '#fff',
                                                                                            fontWeight: '300',
                                                                                            fontSize: pxToDp(16)
                                                                                        } }>Ks{ PriceUtil.formatPrice(items.show_price) }</Text>
                                                                                    </View>
                                                                                </TouchableOpacity>
                                                                                { indexs != (item.goods.length - 1) && (
                                                                                    <View style={ {
                                                                                        flexDirection: 'row',
                                                                                        height: pxToDp(130),
                                                                                        width: pxToDp(36),
                                                                                        justifyContent: 'center',
                                                                                        alignItems: 'center'
                                                                                    } }>
                                                                                        <Text style={ {
                                                                                            color: '#929292',
                                                                                            fontSize: pxToDp(40)
                                                                                        } }>+</Text>
                                                                                    </View>
                                                                                ) }
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>

                                                        </ScrollView>
                                                    </View>
                                                    <TouchableOpacity
                                                        activeOpacity={ 1 }
                                                        onPress={ () => {
                                                            if(this.refs.SldVideoPlay != undefined){
                                                                this.refs.SldVideoPlay.pauseVideo();
                                                            }
                                                            this.props.navigation.navigate('GoodsSuit', {
                                                                gids: item.gids,
                                                                gid: gid
                                                            })
                                                        } }
                                                        style={ {
                                                            width: pxToDp(220),
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            height: pxToDp(130),
                                                            flexDirection: "column",
                                                            justifyContent: "center",
                                                            alignItems: 'flex-end'
                                                        } }>
                                                        <View style={ {flexDirection: 'row', alignItems: 'baseline'} }>
                                                            <Text style={ {
                                                                color: '#353535',
                                                                fontSize: pxToDp(24),
                                                                fontWeight: '300'
                                                            } }>{I18n.t('GoodsDetailNew.Combinationprice')}</Text>
                                                            <Text style={ {
                                                                color: '#F41919',
                                                                fontSize: pxToDp(24),
                                                                fontWeight: '400',
                                                                marginLeft: pxToDp(5)
                                                            } }>Ks{ PriceUtil.formatPrice(item.total_price) }</Text>
                                                        </View>
                                                        <View style={ {
                                                            borderColor: '#F44A40',
                                                            backgroundColor: '#fff',
                                                            borderWidth: 1,
                                                            width: pxToDp(120),
                                                            height: pxToDp(30),
                                                            borderRadius: pxToDp(20),
                                                            flexDirection: 'row',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginTop: pxToDp(20)
                                                        } }>
                                                            <Text style={ {
                                                                color: '#F44A40',
                                                                fontSize: pxToDp(20),
                                                                fontWeight: '300'
                                                            } }>{I18n.t('GoodsDetailNew.purchase')}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                { (index != (goods_detail.suite_data.length - 1) && index != 0 || (index == 0 && goods_suit_flag)) && (
                                                    <View style={ GlobalStyles.leftline }/>
                                                ) }
                                            </View>
                                        )
                                    })
                                }
                                { goods_detail.suite_data.length > 1 &&
                                <TouchableOpacity
                                    activeOpacity={ 1 }
                                    onPress={ () => this.viewMore('suit') }
                                    style={ {
                                        width: screenwidth,
                                        height: pxToDp(92),
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#fff'
                                    } }>
                                    <Text style={ {
                                        color: '#353535',
                                        fontSize: pxToDp(22),
                                        fontWeight: '300'
                                    } }>{ goods_suit_flag ? I18n.t('GoodsDetailNew.packup') : I18n.t('GoodsDetailNew.seemore') }</Text>

                                </TouchableOpacity>
                                }

                            </View>
                        ) }

                        {/*好物推荐模块start*/ }
                        {
                            !(params && params.fromVip) &&
                            <View style={ styles.topic }>
                                <View style={ styles.goods_recommond }><Text
                                    style={ [ styles.sld_rec_style, GlobalStyles.sld_global_fontfamliy ] }>...</Text><Text
                                    style={ [ styles.topicHead, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsDetailNew.shoprecommend')}</Text><Text
                                    style={ [ styles.sld_rec_style, GlobalStyles.sld_global_fontfamliy ] }>...</Text></View>
                                <FlatList
                                    data={ this.state.HWRecommendList }
                                    keyExtractor={ (item, index) => index }
                                    renderItem={ this.renderTopicItem }
                                    horizontal={ true }
                                    showsHorizontalScrollIndicator={ false }
                                />
                            </View>
                        }
                        <View style={ GlobalStyles.space_shi_separate }/>
                        {/*好物推荐模块end*/ }

                        {/*商品详情模块start*/ }
                        <View style={{justifyContent: 'center', alignItems: 'center', height: 44, backgroundColor: '#fff'}}>
                            <Text style={{fontSize: 18, color: '#333333', textAlign: 'center', fontWeight: '500'}}>{I18n.t('GoodsDetailNew.title')}</Text>
                        </View>
                        <View
                            style={ {width: _w, height: _h, flexDirection: 'row'} }
                        >
                            <WebView
                                ref={ webview => thisWebView = webview }
                                style={ {flex: 1, height: this.state.webViewHeight} }
                                scrollEnabled={ false }
                                onMessage={ this._onMessage }
                                scalesPageToFit={ true }
                                SupportZoom={false}
                                showsVerticalScrollIndicator={ false }
                                source={ {html: goods_body, baseUrl: ''} }
                                automaticallyAdjustContentInsets={ true }
                                javaScriptEnabled={ true }
                                onLoadEnd={ () => this._onLoadEnd() }
                                injectedJavaScript={ '(' + String(injectedScript) + ')();' }
                            />
                        </View>
                    </ScrollView>
				</View>
				{
					Platform.OS === 'ios' && (height === 812 || height === 896) ? <View style={{height:34, backgroundColor: '#fff'}}/> : null
				}
				{
                    !goods_state &&
                    <View style={ {
                        position: 'absolute',
                        bottom: (DeviceInfo.isIPhoneX_deprecated ? 35 : 0) + pxToDp(98),
                        left: 0,
                        right: 0,
                        height: pxToDp(70),
                        flexDirection: 'row',
                        backgroundColor: '#fdf4f5',
                        zIndex: 2,
                        alignItems: 'center',
                        justifyContent: 'center'
                    } }>
                        <Text style={ {color: '#e00c1a', fontSize: pxToDp(26), fontWeight: '400'} }>{I18n.t('GoodsDetailNew.text20')}</Text>
                    </View>
				}
				{/*底部栏*/}
				{goods_info.goods_state!=undefined && goods_info.goods_state!=1 &&
                <View style={{
                    position: 'absolute',
                    bottom: DeviceInfo.isIPhoneX_deprecated ? 35+pxToDp(98) : pxToDp(98),
                    left: 0,
                    right: 0,
                    height: pxToDp(80),
                    flexDirection: 'row',
                    backgroundColor: '#949494',
                    zIndex: 2,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{color: '#fff',fontSize: pxToDp(30)}}>{goods_info.goods_state_str}</Text>
                </View>
				}


				<View style={ {
					position: 'absolute',
					bottom: Platform.OS === 'ios' && (height === 812 || height === 896) ? 34 : 0,
					left: 0,
					right: 0,
					height: pxToDp(98),
					flexDirection: 'row',
					backgroundColor: '#fff',
					zIndex: 2,
					borderTopWidth: 0.5,
					borderColor: '#dbdbdb'
				} }>

					{/*客服按钮*/}
					<TouchableOpacity
						style={ styles.bottomCommon }
						activeOpacity={ 1 }
						onPress={() => this.goChat()}
					>
						<Image
							style={ {width: pxToDp(36), height: pxToDp(36)} }
							source={ require('../assets/images/kefu_b.png') }
							resizeMode={'contain'}
						/>
						<Text style={{color: '#2D2D2D',fontSize: pxToDp(20),marginTop: pxToDp(8)}}>{I18n.t('GoodsDetailNew.service')}</Text>
					</TouchableOpacity>
					{/*跳转到购物车*/}
					{
						!(params && params.fromVip) ?
                            <TouchableOpacity style={ styles.bottomCommon } ctiveOpacity={ 1 } onPress={ () => this.goCart() }>
                                <Image
                                    style={ {width: pxToDp(36), height: pxToDp(36),} }
                                    source={ require('../assets/images/cart_b.png') }
                                    resizeMode={'contain'}
                                />
                                <Text style={{color: '#2D2D2D',fontSize: pxToDp(20),marginTop: pxToDp(8)}}>{I18n.t('GoodsDetailNew.shoppingcart')}</Text>
                                { this.state.cart_count > 0 && (
                                    <View style={ styles.cart_count_view }>
                                        <Text style={ styles.cart_count_text }>{ this.state.cart_count*1>99?'99+': this.state.cart_count }</Text>
                                    </View>) }
                            </TouchableOpacity> : null
					}

					{goods_info.promotion_type != 'pin_tuan' && (goods_info.promotion_type == 'tuan' || goods_info.promotion_type == 'xianshi' || goods_info.promotion_type == 'p_mbuy') && (
						<TouchableOpacity style={ {
							flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
							backgroundColor: main_color
						} } activeOpacity={ 1 }
						                  onPress={ () => this.goBuy() }>
							<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.purchase')}</Text>
						</TouchableOpacity>
					) }

					{/*预售 购买按钮 start*/ }
					{ goods_info.promotion_type == 'sld_presale' && presaleInfo != '' && !is_show_default_btn &&
					<TouchableOpacity
						style={ styles.pre_btn }
						activeOpacity={ 1 }
						onPress={ () => this.preSaleBuy() }
					>
						<Text style={ {color: '#fff', fontSize: pxToDp(22)} }>{I18n.t('GoodsDetailNew.text21')}</Text>
						<View>
							<Text style={ {color: '#fff', fontSize: pxToDp(24)} }>{I18n.t('GoodsDetailNew.text22')}</Text>
							<Text style={ {
								color: '#fff',
								fontSize: pxToDp(36),
								marginTop: pxToDp(5)
							} }>Ks{PriceUtil.formatPrice(presaleInfo.pre_deposit_price)}</Text>
						</View>
					</TouchableOpacity> }
					{/*预售 购买按钮 end*/ }

					{/*阶梯团 购买按钮 start*/ }
					{/*ToDo caowanli*/ }
					{/*//pay_status:1可以付定金2待付尾款但是不能付3可以付尾款4已付尾款*/ }
					{ goods_info.promotion_type == 'pin_ladder_tuan' && pin_info != '' && !is_show_default_btn &&
					pin_info.pay_status == '1' && (
						<TouchableOpacity
							style={ styles.pin_btn }
							activeOpacity={ 1 }
							onPress={ () => this.ladderBuy() }
						>
							<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.text23')}</Text>
							{/*<Text style={{color: '#FFFFFF',fontSize: pxToDp(30)}}>{goods_info.ding==1? I18n.t('GoodsDetailNew.text23'):I18n.t('GoodsDetailNew.text25')}</Text>*/ }
						</TouchableOpacity>
					) }

					{ goods_info.promotion_type == 'pin_ladder_tuan' && pin_info != '' && !is_show_default_btn &&
					pin_info.pay_status == '2' && (
						<TouchableOpacity
							style={ styles.disable_btn }
							activeOpacity={ 1 }
						>
							<Text style={ {color: '#FFFFFF', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.text24')}</Text>
							{/*<Text style={{color: '#FFFFFF',fontSize: pxToDp(30)}}>{goods_info.ding==1? I18n.t('GoodsDetailNew.text23'):I18n.t('GoodsDetailNew.text25')}</Text>*/ }
						</TouchableOpacity>
					) }

					{ goods_info.promotion_type == 'pin_ladder_tuan' && pin_info != '' && !is_show_default_btn &&
					pin_info.pay_status == '3' && (
						<TouchableOpacity
							style={ styles.pin_btn }
							activeOpacity={ 1 }
							onPress={ () => {
								if(this.refs.SldVideoPlay != 'undefined'){
									this.refs.SldVideoPlay.pauseVideo();
								}
								this.props.navigation.navigate('OrderList')
							}
							}
						>
							<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.text25')}</Text>
							{/*<Text style={{color: '#FFFFFF',fontSize: pxToDp(30)}}>{goods_info.ding==1? I18n.t('GoodsDetailNew.text23'):I18n.t('GoodsDetailNew.text25')}</Text>*/ }
						</TouchableOpacity>
					) }

					{ goods_info.promotion_type == 'pin_ladder_tuan' && pin_info != '' && !is_show_default_btn &&
					pin_info.pay_status == '4' && (
						<TouchableOpacity
							style={ styles.disable_btn }
							activeOpacity={ 1 }
						>
							<Text style={ {color: '#FFFFFF', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.text26')}</Text>

						</TouchableOpacity>
					) }


					{/*阶梯团 购买按钮 end*/ }

					{
						goods_info.promotion_type != 'tuan' && goods_info.promotion_type != 'xianshi' && goods_info.promotion_type != 'p_mbuy' && is_show_default_btn ?
                            !(params && params.fromVip) ?
								//正常情况:加入购物车/立即购买
                                <View style={{flex: 4, flexDirection: 'row'}}>
                                    <TouchableOpacity style={ {
                                        flex: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#ffb03f'
                                    } } activeOpacity={ 1 }
                                                      onPress={ () => this.addCart() }>
                                        <Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.text27')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={ {
                                        flex: 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: main_color
                                    } } activeOpacity={ 1 }
                                                      onPress={ () => this.goBuy() }>
                                        <Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.purchase')}</Text>
                                    </TouchableOpacity>
                                </View>
                                :
								//vip礼品详情:确认礼品
                                <View style={ {flex: 4, flexDirection: 'row'} }>
									<TouchableOpacity
										style={{
											flex: 4,
                                            justifyContent: 'center',
                                            alignItems: 'center',
											backgroundColor: main_color
										}}
										activeOpacity={1.0}
										onPress={() => {
                                            this.windowClose();
                                            this.setState({
                                                showJoinVipModal:false
                                            });


                                            if(this.refs.SldVideoPlay != undefined){
                                                this.refs.SldVideoPlay.pauseVideo();
                                            }

                                            const img = lunbo_array && lunbo_array.length ? lunbo_array[0] : null
											console.log('图片:', lunbo_array)
                                            const sku = {
                                                goods_image_url: img,
                                                goods_name: goods_info.goods_name,
                                                gid: gid
											}
                                            DeviceEventEmitter.emit('goodsDetail', sku)

											if (params && params.fromBanner) {
                                                this.props.navigation.goBack()
                                            } else {
                                                this.props.navigation.pop(2)
                                            }
										}}
									>
										{/*确认礼品*/}
										<Text style={{fontSize: 18, color: '#fff', textAlign: 'center'}}>{I18n.t('GoodsDetailNew.confirmGift')}</Text>
									</TouchableOpacity>
								</View>
							: null
                    }

					{ goods_info.promotion_type == 'pin_tuan' && !is_show_default_btn && (
						<View style={ {flex: 4, flexDirection: 'row'} }>
							<TouchableOpacity style={ {
								flex: 2,
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: '#978282',
								flexDirection: 'column'
							} } activeOpacity={ 1 }
							                  onPress={ () => this.goBuy() }>
								<View style={ {flexDirection: 'row', alignItems: 'baseline'} }><Text
									style={ {color: '#fff', fontSize: pxToDp(22)} }>Ks</Text><Text style={ {
									color: '#fff',
									fontSize: pxToDp(30),
									marginBottom: pxToDp(8)
								} }>{ PriceUtil.formatPrice(goods_info.goods_price) }</Text></View>
								<Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.Buyalone')}</Text>
							</TouchableOpacity>

							<TouchableOpacity style={ {
								flex: 2,
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: main_color,
								flexDirection: 'column'
							} } activeOpacity={ 1 }
							                  onPress={ () => this.goBuy((typeof (goods_detail.pin) != 'undefined' && goods_detail.pin.pinging > 0) ? 'pinging' : 'pin', sele_pintuan_team_id > 0 ? 'join_pin_tuan' : '') }>
								<View style={ {flexDirection: 'row', alignItems: 'baseline'} }><Text
									style={ {color: '#fff', fontSize: pxToDp(22)} }>Ks</Text><Text style={ {
									color: '#fff',
									fontSize: pxToDp(30),
									marginBottom: pxToDp(8)
								} }>{ typeof (goods_detail.pin) != 'undefined' ? PriceUtil.formatPrice(goods_detail.pin.sld_pin_price) : '' }</Text></View>
								<Text style={ {
									color: '#fff',
									fontSize: pxToDp(30)
								} }>{ (typeof (goods_detail.pin) != 'undefined' && goods_detail.pin.pinging > 0) ? I18n.t('GoodsDetailNew.Inspelling') : (sele_pintuan_team_id > 0 ? I18n.t('GoodsDetailNew.Tuxedopurchase') : I18n.t('GoodsDetailNew.startgroup')) }</Text>
							</TouchableOpacity>

						</View>
					) }

				</View>

				{ service.length > 0 && (
					<Modal
						backdropPressToClose={ true }
						entry='bottom'
						position='bottom'
						coverScreen={ true }
						swipeToClose={ false }
						style={ {
							backgroundColor: "#fff",
							height: DeviceInfo.isIPhoneX_deprecated ? (deviceWidth + 30) : deviceWidth,
							position: "absolute",
							left: 0,
							right: 0,
							width: deviceWidth,
							paddingBottom: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
						} }
						ref={ "calendarstart" }>
						<View style={ styles.service_title }>
							<Text style={ [ styles.service_title_text, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsDetailNew.serve')}</Text>
						</View>
						<View style={ GlobalStyles.line }/>
						<View>
							<ScrollView style={ {height: 300} } showsVerticalScrollIndicator={ false }>
								<View style={ {padding: 30} }>
									{ service.map((item, index) => {
										return (
											<View key={ index }>
												<Text
													style={ [ styles.service_detail_title, GlobalStyles.sld_global_font ] }>{ item.label_name }</Text>
												<Text
													style={ [ styles.service_detail_con, GlobalStyles.sld_global_font ] }>{ item.label_desc }</Text>
											</View>
										);
									}) }
								</View>
							</ScrollView>
						</View>


					</Modal>
				) }
				{/*更多拼团列表--start*/ }
				{ goods_info.promotion_type == 'pin_tuan' && typeof (goods_detail.pin) != 'undefined' && goods_detail.pin.team.length > 0 && (
					<Modal
						backdropPressToClose={ true }
						entry='bottom'
						position='bottom'
						coverScreen={ true }
						swipeToClose={ false }
						style={ {
							backgroundColor: "#fff",
							height: DeviceInfo.isIPhoneX_deprecated ? (deviceWidth + 30) : deviceWidth,
							position: "absolute",
							left: 0,
							right: 0,
							width: deviceWidth,
							paddingBottom: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
						} }
						ref={ "pinTuanList" }>
						<View style={ styles.service_title }>
							<Text style={ [ styles.service_title_text, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsDetailNew.Haslaunched')}</Text>
						</View>
						<View style={ GlobalStyles.line }/>
						<View style={ {
							backgroundColor: '#fff',
							width: screenwidth,
							paddingLeft: 15,
							paddingRight: 15,
							flexDirection: "column",
							marginBottom: pxToDp(30)
						} }>


							{ (goods_detail.pin.team).map((item, index) => {
								return (
									<View key={ index } style={ {
										flexDirection: "row",
										width: '100%',
										height: pxToDp(90),
										backgroundColor: main_color,
										borderRadius: pxToDp(45),
										borderColor: main_color,
										borderWidth: 1,
										marginBottom: pxToDp(30)
									} }>
										<TouchableOpacity
											activeOpacity={ 1 }
											onPress={ () => this.viewPinTuanDetail(item.id) }
											style={ {
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center',
												width: pxToDp(530),
												backgroundColor: '#fff',
												borderBottomLeftRadius: pxToDp(45),
												borderTopLeftRadius: pxToDp(45)
											} }>
											<View style={ {
												flexDirection: 'row',
												justifyContent: "flex-start",
												alignItems: 'center'
											} }>
												<Image resizeMode={ 'cover' } tintColor={ '#fff' } style={ {
													width: pxToDp(82),
													height: pxToDp(82),
													borderRadius: pxToDp(41),
													marginLeft: pxToDp(3)
												} } resizeMode={ 'contain' }
												       source={ (item.avatar).indexOf('http') != -1 ? {uri: item.avatar} : require("../assets/images/sld_default_avator.png") }/>
												<View style={ {
													flexDirection: 'column',
													justifyContent: 'flex-start',
													alignItems: 'center',
													marginLeft: pxToDp(19)
												} }>
													<Text style={ {
														color: '#3A3A3A',
														fontSize: pxToDp(24)
													} }>{ item.member_name }</Text>
													<Text style={ {
														color: '#3A3A3A',
														fontSize: pxToDp(18),
														marginTop: pxToDp(10)
													} }>{ item.member_areainfo }</Text>
												</View>
											</View>
											<View style={ {
												flexDirection: 'column',
												justifyContent: 'center',
												alignItems: 'flex-end',
												paddingRight: pxToDp(25)
											} }>
												<Text style={ {
													color: main_color,
													fontSize: pxToDp(24)
												} }>{I18n.t('GoodsDetailNew.difference')}{ item.sheng }{I18n.t('GoodsDetailNew.clustering')}</Text>
												<View style={ {
													flexDirection: 'row',
													marginTop: pxToDp(10)
												} }><TimeCountDown
													bgColor={ '#fff' } time_color={ '#3A3A3A' } time_size={ 20 }
													bg_width={ 25 } bg_height={ 20 } seg_color={ '#3A3A3A' }
													seg_size={ 22 } seg_width={ 0 }
													enddate={ (item.sld_end_time) * 1000 }/><Text style={ {
													color: '#3A3A3A',
													fontSize: pxToDp(20)
												} }> {I18n.t('GoodsDetailNew.over')}</Text></View>

											</View>
										</TouchableOpacity>
										<TouchableOpacity
											activeOpacity={ 1 }
											onPress={ () => this.viewPinTuanDetail(item.id, item.id == goods_detail.pin.pinging ? '' : 'sele_pintuan') }
											style={ [ GlobalStyles.flex_common_row, {width: pxToDp(180)} ] }>
											<Text style={ {
												color: '#fff',
												fontSize: pxToDp(28),
												marginRight: pxToDp(10),
												marginLeft: -pxToDp(15)
											} }>{ goods_detail.pin.pinging > 0 ? (item.id == goods_detail.pin.pinging ? I18n.t('GoodsDetailNew.Mygroup') : I18n.t('GoodsDetailNew.othergroup')) : (item.id == sele_pintuan_team_id ? I18n.t('GoodsDetailNew.selected') : I18n.t('GoodsDetailNew.gotuxedo')) }</Text>
											<Image tintColor={ '#fff' }
											       style={ {width: pxToDp(12), height: pxToDp(24)} }
											       resizeMode={ 'contain' }
											       source={ require("../assets/images/sld_arrow_right.png") }/>
										</TouchableOpacity>
									</View>
								);
							}) }

						</View>


					</Modal>
				) }
				{/*更多拼团列表--end*/ }

				<Modal
					isOpen={this.state.showJoinVipModal}
					backdropPressToClose={ true }
					entry='bottom'
					onClosed={()=>{
						this.windowClose();
						this.setState({
							showJoinVipModal:false
						});
					}}
					position='bottom'
					coverScreen={ true }
					swipeToClose={ false }
					style={ styles.modalJoinVip }
					onOpened={()=>{
					}}
					ref={ "joinVipModal" }>
						<CommissionWelcome
							onclickQuitVip={this._onclickQuitVip.bind(this)}
							onclickJoinVip={this._onclickJoinVip.bind(this)}
						/>
				</Modal>

				<Modal
					backdropPressToClose={ true }
					entry='bottom'
					onClosed={()=>{this.windowClose()}}
					position='bottom'
					coverScreen={ true }
					swipeToClose={ false }
					style={ styles.modalSpec }
					ref={ "seleSpec" }>

					<View style={ {flex: 1, padding: 15, paddingBottom: DeviceInfo.isIPhoneX_deprecated ? 90 : 55} }>
						<View style={ {flexDirection: 'row', marginBottom: 30} }>
							<View><Image style={ {width: 105, height: 105, borderColor: '#bdbdbd', borderWidth: 0.5} }
							             source={ {uri: lunbo_array[ 0 ]} }
													 defaultSource={require('../assets/images/default_icon_124.png')}
							/></View>
							<View style={ {
								flexDirection: 'column',
								paddingLeft: 15,
								marginTop: 25,
								width: Dimensions.get('window').width * 1 - 150
							} }>

								{ goods_info.promotion_type == 'xianshi' && (
									<Text numberOfLines={ 1 } style={ [ {
										color: '#ba1418',
										fontSize: 25,
									}, GlobalStyles.sld_global_font ] }>Ks&nbsp;{ goods_info.promotion_run_flag == 1 ? PriceUtil.formatPrice(goods_info.show_price) : PriceUtil.formatPrice(goods_info.goods_price) }</Text>
								)
								}
								{ goods_info.promotion_type == 'tuan' && (
									<Text numberOfLines={ 1 } style={ [ {
										color: '#ba1418',
										fontSize: 25,
									}, GlobalStyles.sld_global_font ] }>Ks&nbsp;{PriceUtil.formatPrice(goods_info.goods_price)}</Text>
								)
								}

								{ goods_info.promotion_type == 'sld_presale' && presaleInfo != '' && (
									<Text numberOfLines={ 1 } style={ [ {
										color: '#ba1418',
										fontSize: 25,
									}, GlobalStyles.sld_global_font ] }>Ks&nbsp;{PriceUtil.formatPrice(presaleInfo.pre_sale_price)}</Text>
								)
								}

								{ (goods_info.promotion_type == 'pin_tuan' && typeof (goods_detail.pin) != 'undefined') && (
									<Text numberOfLines={ 1 } style={ [ {
										color: '#ba1418',
										fontSize: 25,
									}, GlobalStyles.sld_global_font ] }>Ks&nbsp;{PriceUtil.formatPrice(goods_info.show_price)}</Text>
								)
								}


								{ (goods_info.promotion_type == 'pin_ladder_tuan' && pin_info != '') && (
									<Text numberOfLines={ 1 } style={ [ {
										color: '#ba1418',
										fontSize: 25,
									}, GlobalStyles.sld_global_font ] }>Ks&nbsp;{PriceUtil.formatPrice(pin_info.sld_now_price)}</Text>
								)
								}
								{ (goods_info.promotion_type == '' || goods_info.promotion_type == 'undefined') && (
									<Text numberOfLines={ 1 } style={ [ {
										color: '#ba1418',
										fontSize: 25,
									}, GlobalStyles.sld_global_font ] }>Ks&nbsp;{PriceUtil.formatPrice(goods_info.show_price)}</Text>
								)
								}
								<Text numberOfLines={ 1 } style={ [ {
									fontSize: 16,
									color: '#333'
								}, GlobalStyles.sld_global_font ] }>{ goods_info.goods_name }</Text>

							</View>
						</View>

						<ScrollView showsVerticalScrollIndicator={ false } style={ {maxHeight: deviceHeight - 150} }>

							{ typeof (goods_map_spec.length) != 'undefined' && goods_map_spec.map((items, index) => {
								return (
									<View key={ index }>
										<View>
											<Text
											style={ [ styles.spec_common_title, GlobalStyles.sld_global_font ] }>{ items.goods_spec_name }
											</Text>
										</View>
										<View style={ {flexDirection: 'row', marginBottom: 25, flexWrap: 'wrap',} }>
											{ items.goods_spec_value.map((val, indexchild) => (
												<TouchableOpacity key={ indexchild } activeOpacity={ 1 }
												                  onPress={ () => this.seSpecDetail(index, val.specs_value_id) }>
													<View
														style={ [ styles.spec_detail, val.default == 1 ? styles.spec_detail_sele : styles.spec_detail_nosele ] }>

														<Text
															style={ [ GlobalStyles.sld_global_font, styles.spec_detail_text, {color: val.default == 1 ? '#e58011' : '#666',} ] }>{ val.specs_value_name }</Text>

													</View>
												</TouchableOpacity>
											)) }

										</View>


									</View>
								);
							}) }
							<View style={ {flexDirection: 'row', alignItems: "baseline"} }>
								<Text
									style={ [ styles.spec_common_title, GlobalStyles.sld_global_font ] }>
									{I18n.t('GoodsDetailNew.quantity')}
								</Text>
								{ typeof (goods_detail.pin) != 'undefined' &&
									<Text style={ [ {
										marginLeft: pxToDp(10),
										fontSize: pxToDp(24)
									} ] }>[{I18n.t('GoodsDetailNew.Spellgrouppurchase')}{ goods_detail.pin.sld_max_buy }{I18n.t('GoodsDetailNew.piece')}]
									</Text>
								}
							</View>
							{/*计步器*/}
							<View style={[styles.spectitle, {marginBottom: 120}]}>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={() => {
										if (!(params && params.fromVip)) {
                                            this.editNum('minus')
										}
									}}
								>
									<View style={ [ styles.common_layout, {borderRightWidth: 0.5, borderColor: '#666'} ] }>
										<Text style={ [ GlobalStyles.sld_global_font, {color: '#666'} ] }>-</Text>
									</View>
								</TouchableOpacity>

								<View style={ [ styles.common_layout, {
									borderRightWidth: 0.5,
									borderColor: '#333',
									width: 50
								} ] }>

									<TextInput
										style={ [ ComStyle.lg_item_input, GlobalStyles.sld_global_font ] }
                                        editable={!(params && params.fromVip)}
										autoCapitalize='none'
										returnKeyType='done'
										underlineColorAndroid={ 'transparent' }
										placeholderTextColor={ '#666' }
										keyboardType='numeric'
										maxLength={3}
										value={this.state.buy_num+''}
										onChange={(event) => {
											let val = event.nativeEvent.text.replace(/(^\s*)|(\s*$)/g, "");
											console.warn('ww:TextInput', parseInt(val.replace('.', '').substring(0,3)));
											this.setState({
												buy_num:val
											})
										}}
										onBlur={ (event) => {this.handleUpdateGoodNum(event)} }/>
								</View>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={() => {
										if (!(params && params.fromVip)) {
                                            this.editNum('plus')
										}
									}}
								>
									<View style={ styles.common_layout }>
										<Text style={ [ GlobalStyles.sld_global_font, {color: '#666'} ] }>+</Text>
									</View>
								</TouchableOpacity>
							</View>
						</ScrollView>

						<View style={ {
							position: 'absolute',
							bottom: DeviceInfo.isIPhoneX_deprecated ? 35 : 0,
							left: 0,
							right: 0,
							height: pxToDp(98),
							flexDirection: 'row',
							backgroundColor: '#fff',
							zIndex: 2,
							borderTopWidth: 0.5,
							borderColor: '#dbdbdb',
						} }>

							{/*预售 */ }
							{ goods_info.promotion_type == 'sld_presale' && presaleInfo != '' && !is_show_default_btn &&
							<TouchableOpacity
								activeOpacity={ 1 }
								style={ styles.preBuy }
								onPress={ () => {
									if(this.refs.SldVideoPlay != undefined){
										this.refs.SldVideoPlay.pauseVideo();
									}
									this.refs.seleSpec.close();
									this.props.navigation.navigate('PresaleConfirm', {
										gid: this.state.gid,
										id: presaleInfo.pre_id,
										num: this.state.buy_num
									});
								} }
							>
								<Text
									style={ {color: '#fff', fontSize: pxToDp(34), letterSpacing: pxToDp(15)} }>{I18n.t('ok')}</Text>
							</TouchableOpacity> }

							{/*阶梯团*/ }
							{
								goods_info.promotion_type == 'pin_ladder_tuan' && pin_info != '' && !is_show_default_btn &&
                                <TouchableOpacity
                                    activeOpacity={ 1 }
                                    style={ styles.preBuy }
                                    onPress={ () => {
                                        if(pin_info.sld_max_buy > 0&&this.state.buy_num > pin_info.sld_max_buy){
                                            ViewUtils.sldToastTip(I18n.t('GoodsDetailNew.Mostpurchases') + pin_info.sld_max_buy + I18n.t('GoodsDetailNew.piece'));
                                            return;
                                        }
                                        this.refs.seleSpec.close();
                                        if(this.refs.SldVideoPlay != undefined){
                                            this.refs.SldVideoPlay.pauseVideo();
                                        }
                                        this.props.navigation.navigate('PinLadderConfirm', {
                                            gid: this.state.gid,
                                            id: pin_info.id,
                                            num: this.state.buy_num
                                        });

                                    } }
                                >
                                    <Text
                                        style={ {color: '#fff', fontSize: pxToDp(34), letterSpacing: pxToDp(15)} }>{I18n.t('ok')}</Text>
                                </TouchableOpacity>

                            }

							{
								(is_show_default_btn || (goods_info.promotion_type != 'sld_presale' && goods_info.promotion_type != 'pin_ladder_tuan')) &&
                                <Fragment>
                                    <TouchableOpacity style={ styles.bottomCommon } activeOpacity={ 1 }
                                                      onPress={ () => this.goChat() }>
                                        <Image
                                            style={ {width: pxToDp(36), height: pxToDp(36)} }
                                            source={ require('../assets/images/kefu_b.png') }
                                            resizeMode={'contain'}
                                        />
                                        <Text style={{color: '#2D2D2D',fontSize: pxToDp(20),marginTop: pxToDp(8)}}>{I18n.t('GoodsDetailNew.service')}</Text>
                                    </TouchableOpacity>

									{
                                        !(params && params.fromVip) ?
                                            <TouchableOpacity style={ styles.bottomCommon } ctiveOpacity={ 1 } onPress={ () => this.goCart() }>
                                                <Image
                                                    style={ {width: pxToDp(36), height: pxToDp(36),} }
                                                    source={ require('../assets/images/cart_b.png') }
                                                    resizeMode={'contain'}
                                                />
                                                <Text style={{color: '#2D2D2D',fontSize: pxToDp(20),marginTop: pxToDp(8)}}>{I18n.t('GoodsDetailNew.shoppingcart')}</Text>
                                                { this.state.cart_count > 0 && (
                                                    <View style={ styles.cart_count_view }>
                                                        <Text style={ styles.cart_count_text }>{ this.state.cart_count*1>99?'99+': this.state.cart_count}</Text>
                                                    </View>) }
                                            </TouchableOpacity> : null
                                    }

                                    {!(params && params.fromVip) && goods_info.promotion_type != 'pin_tuan' && (goods_info.promotion_type == 'tuan' || goods_info.promotion_type == 'xianshi' || goods_info.promotion_type == 'p_mbuy') && (
                                        <TouchableOpacity style={ {
                                            flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                            backgroundColor: main_color
                                        } } activeOpacity={ 1 }
                                                          onPress={ () => this.goBuy() }>
                                            <Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.purchase')}</Text>
                                        </TouchableOpacity>
                                    ) }


                                    {
                                    	goods_info.promotion_type != 'pin_tuan' && !(goods_info.promotion_type == 'tuan' || goods_info.promotion_type == 'xianshi' || goods_info.promotion_type == 'p_mbuy') ?
											!(params && params.fromVip) ?
                                                 <View style={ {flex: 4, flexDirection: 'row'} }>
                                                     <TouchableOpacity style={ {
                                                         flex: 2,
                                                         justifyContent: 'center',
                                                         alignItems: 'center',
                                                         backgroundColor: '#ffb03f'
                                                     } } activeOpacity={ 1 }
                                                                       onPress={ () => this.addCart() }>
                                                         <Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.text27')}</Text>
                                                     </TouchableOpacity>
                                                     <TouchableOpacity style={ {
                                                         flex: 2,
                                                         justifyContent: 'center',
                                                         alignItems: 'center',
                                                         backgroundColor: main_color
                                                     } } activeOpacity={ 1 }
                                                                       onPress={ () => this.goBuy() }>
                                                         <Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.purchase')}</Text>
                                                     </TouchableOpacity>

                                                 </View>
												:
                                                //vip礼品详情:确认礼品
                                                <View style={ {flex: 4, flexDirection: 'row'} }>
                                                    <TouchableOpacity
                                                        style={{
                                                            flex: 4,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            backgroundColor: main_color
                                                        }}
                                                        activeOpacity={1.0}
                                                        onPress={() => {
                                                            this.windowClose();
                                                            this.setState({
                                                                showJoinVipModal:false
                                                            });

                                                            if(this.refs.SldVideoPlay != undefined){
                                                                this.refs.SldVideoPlay.pauseVideo();
                                                            }

                                                            const img = lunbo_array && lunbo_array.length ? lunbo_array[0] : null
                                                            console.log('图片:', lunbo_array)
                                                            const sku = {
                                                                goods_image_url: img,
                                                                goods_name: goods_info.goods_name,
                                                                gid: gid
                                                            }
                                                            DeviceEventEmitter.emit('goodsDetail', sku)

                                                            if (params && params.fromBanner) {
                                                                this.props.navigation.goBack()
                                                            } else {
                                                                this.props.navigation.pop(2)
                                                            }
                                                        }}
                                                    >
                                                        {/*确认礼品*/}
                                                        <Text style={{fontSize: 18, color: '#fff', textAlign: 'center'}}>{I18n.t('GoodsDetailNew.confirmGift')}</Text>
                                                    </TouchableOpacity>
                                                </View>
												: null
                                    }

                                    { goods_info.promotion_type == 'pin_tuan' && typeof (goods_detail.pin) != 'undefined' && (
                                        <View style={ {flex: 4, flexDirection: 'row'} }>
                                            <TouchableOpacity style={ {
                                                flex: 2,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: '#978282',
                                                flexDirection: 'column'
                                            } } activeOpacity={ 1 }
                                                              onPress={ () => this.goBuy() }>
                                                <View style={ {flexDirection: 'row', alignItems: 'baseline'} }><Text
                                                    style={ {color: '#fff', fontSize: pxToDp(22)} }>Ks</Text><Text style={ {
                                                    color: '#fff',
                                                    fontSize: pxToDp(30),
                                                    marginBottom: pxToDp(8)
                                                } }>{PriceUtil.formatPrice( goods_info.goods_price )}</Text></View>
                                                <Text style={ {color: '#fff', fontSize: pxToDp(30)} }>{I18n.t('GoodsDetailNew.Buyalone')}</Text>
                                            </TouchableOpacity>
                                            { (new Date(goods_info.promotion_start_time_stamp * 1000)) - new Date() < 0 && (
                                                <TouchableOpacity style={ {
                                                    flex: 2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: main_color,
                                                    flexDirection: 'column'
                                                } } activeOpacity={ 1 }
                                                                  onPress={ () => this.goBuy(goods_detail.pin.pinging > 0 ? 'pinging' : 'pin', sele_pintuan_team_id > 0 ? 'join_pin_tuan' : '') }>
                                                    <View style={ {flexDirection: 'row', alignItems: 'baseline'} }><Text
                                                        style={ {color: '#fff', fontSize: pxToDp(22)} }>Ks</Text><Text
                                                        style={ {
                                                            color: '#fff',
                                                            fontSize: pxToDp(30),
                                                            marginBottom: pxToDp(8)
                                                        } }>{PriceUtil.formatPrice(goods_detail.pin.sld_pin_price)}</Text></View>
                                                    <Text style={ {
                                                        color: '#fff',
                                                        fontSize: pxToDp(30)
                                                    } }>{ goods_detail.pin.pinging > 0 ? I18n.t('GoodsDetailNew.Inspelling') : (sele_pintuan_team_id > 0 ? I18n.t('GoodsDetailNew.Tuxedopurchase') : I18n.t('GoodsDetailNew.startgroup')) }</Text>
                                                </TouchableOpacity>
                                            ) }
                                        </View>
                                    ) }
                                </Fragment>
							}
						</View>
					</View>

					<View style={ [ GlobalStyles.iphoneXbottomheight, {
						position: 'absolute',
						bottom: 0,
						left: 0,
						right: 0,
						zIndex: 2
					} ] }/>

				</Modal>
				<SldShareCommon
					is_show_share={ this.state.is_show_share }
					data={ this.state.share_data }
					cancleShare={ () => this.cancleShare() }
				/>

				{this.state.createHbshow==true && <View style={styles.share_hb}>
					<View style={styles.img_show}></View>
					<View style={styles.pb}>
						<View style={styles.share_mode}>
							<TouchableOpacity
								style={styles.share_item}
								activeOpacity={1}
								onPress={()=>this.shareGoods(2)}
							>
								<Image source={require('../assets/images/wx_share.png')} resizeMode={'contain'} style={styles.share_item_img}/>
								<Text style={styles.share_item_txt}>{I18n.t('GoodsDetailNew.Wechatfriends')}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.share_item}
								activeOpacity={1}
								onPress={()=>this.shareGoods(3)}
							>
								<Image source={require('../assets/images/pyq_share.png')} resizeMode={'contain'} style={styles.share_item_img}/>
								<Text style={styles.share_item_txt}>{I18n.t('GoodsDetailNew.WeChatMoments')}</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.share_item}
								activeOpacity={1}
								onPress={()=>this.createHb()}
							>
								<Image source={require('../assets/images/createhb.png')} resizeMode={'contain'} style={styles.share_item_img}/>
								<Text style={styles.share_item_txt}>{I18n.t('GoodsDetailNew.Generateaposter')}</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.share_close}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.share_close_w}
								onPress={()=>this.closeShareModal()}
							>
								<Image style={styles.share_close_img} source={require('../assets/images/share_close.png')} resizeMode={'contain'}></Image>
							</TouchableOpacity>
						</View>
					</View>

				</View>}


				{this.state.showShareImg==true && <View style={styles.share_hb}>

					{this.state.shareImg!='' && <View style={styles.img_show}>
								<View style={[styles.hb,{height: this.state.shareImgWH.height}]}>
									<Image
										style={[styles.hb_img,{height: this.state.shareImgWH.height}]}
										resizeMode={'contain'}
										source={{uri: this.state.shareImg}}
										defaultSource={require('../assets/images/default_icon_124.png')}
									/>
								</View>
					</View>}

					<View style={styles.pb}>
						<View style={styles.share_mode}>
							<TouchableOpacity
								style={styles.share_item}
								activeOpacity={1}
								onPress={()=>this.shareHb(1)}
							>
								<Image source={require('../assets/images/zahb.png')} resizeMode={'contain'} style={styles.share_item_img}/>
								<Text style={styles.share_item_txt}>{I18n.t('GoodsDetailNew.Savetheposters')}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.share_item}
								activeOpacity={1}
								onPress={()=>this.shareHb(2)}
							>
								<Image source={require('../assets/images/wx_share.png')} resizeMode={'contain'} style={styles.share_item_img}/>
								<Text style={styles.share_item_txt}>{I18n.t('GoodsDetailNew.Wechatfriends')}</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.share_item}
								activeOpacity={1}
								onPress={()=>this.shareHb(3)}
							>
								<Image source={require('../assets/images/pyq_share.png')} resizeMode={'contain'} style={styles.share_item_img}/>
								<Text style={styles.share_item_txt}>{I18n.t('GoodsDetailNew.WeChatMoments')}</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.share_close}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.share_close_w}
								onPress={()=>this.closeShareModal()}
							>
								<Image style={styles.share_close_img} source={require('../assets/images/share_close.png')} resizeMode={'contain'}></Image>
							</TouchableOpacity>
						</View>
					</View>

				</View>}

				<RNModal
					visible={modalVisible}
					transparent={true}
					onRequestClose={() => this.setState({modalVisible: false})}>
					<ImageViewer
						imageUrls={images}
						index={currentIndex}
						onClick={()=>this.setState({modalVisible: false})}
						onSwipeDown={()=>this.setState({modalVisible: false})}
						backgroundColor={'rgba(0,0,0,0.6)'}
					/>
				</RNModal>

				<View style={ [ GlobalStyles.iphoneXbottomheight, {
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 2
				} ] }/>
				{
					this.state.showLoading && <GoodsDetailGifView/>
				}
			</View>
		)
	}
}
const injectedScript = function(){
	function waitForBridge(){
		if(window.postMessage.length !== 1){
			setTimeout(waitForBridge, 200);
		}else{
			let height = 0;
			if(document.documentElement.scrollHeight > document.body.scrollHeight){
				height = document.documentElement.scrollHeight
			}else{
				height = document.body.scrollHeight
			}
			let data = {'type': 'auto_height', 'height': height};
			postMessage(JSON.stringify(data))
		}
	}

	window.onload = function(){
		var imgs = document.getElementsByTagName('img');
		for(var index = 0;index<imgs.length;index++){
			if(imgs[index].src){
				(function(index){
					imgs[index].onclick = function(){
						var data = {
							type: 'preview',
							img: imgs[index].src
						};
						window.postMessage(JSON.stringify(data))
					}
				})(index);
			}
		}
	}

	waitForBridge();
};

function is_start(time){
	let now = new Date().getTime();
	let start_time = new Date(time * 1000).getTime();
	return start_time > now;
}
