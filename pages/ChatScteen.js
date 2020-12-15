/*
 * 聊天界面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View , Dimensions , Text , FlatList , Image , StyleSheet,TouchableOpacity,DeviceInfo,ScrollView,Alert
} from 'react-native';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import GlobalStyles from '../assets/styles/GlobalStyles';
import api from '../util/api'
import ViewUtils from '../util/ViewUtils';
import SldHeader from '../component/SldHeader';
import LoadingWait from '../component/LoadingWait';
import CountEmitter from '../util/CountEmitter';
import StorageUtil from '../util/StorageUtil';
import Modal from 'react-native-modalbox';
import Pusher from 'pusher-js/react-native';
import SldEmojiView from '../component/SldEmojiView';
import Smiley from "../util/Smiley";
import ImagePicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import SldTextInput from '../component/SldTextInput'
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil';

const {width,height} = Dimensions.get('window');
let imageBig = [];
const MSG_LINE_MAX_COUNT = 15;
let service_info = {};
service_info.state='online';//自己的账号在线
contype = 'text';//消息类型，text 文本，表情，goods:商品，order:订单，pic：图片,emoji 表情
contViewCon = [];// 存放表情和字符串的分割数组
conGoodsInfo = {};//商品信息/订单信息
isSendQuestion = false;//是否发送常见问题
qustionId = '';//常见问题id
let _this = '';
export default class ChatScteen extends Component {
	constructor(props) {
		super ( props );
		_this = this;
		chat_route = 'chatdetail';
		this.state = {
			title : props.navigation.state.params.store_info.store_name ,
			showProgress : false ,//是否限时等待加载页面
			isSessionStarted : false ,
			conversation : null ,
			is_show_bottom : false ,//是否显示聊天底部功能菜单
			chat_user_info : props.navigation.state.params.store_info ,//列表页传递的聊天双方的信息
			store_info : props.navigation.state.params.store_info ,//列表页传递的聊天双方的信息
			hid : '' ,//用于分页
			chat_list : [] ,//聊天历史记录数据
			hasmore : true ,//是否还有数据
			input_val : '' ,//发送的聊天内容
			is_switch : 0 ,//该访客是否被转走，0为无，1为转走
			refresh : 0 ,
			refreshflat : false ,
			service_list : [] ,//转接客服列表
			quick_list : [] ,//快捷回复列表
			service_info : service_info ,//客服信息
			is_delete : 0 ,//该访客是否被删除
			showEmojiView : false ,//是否展示表情
			showWait : false ,//loading
			showBigImg : false ,//是否显示大图
			goods_info : props.navigation.state.params.goods_info ,//商品的相关信息
			channel : '' ,//用户的channel
			paiDuiNum : 0 ,//当前排队人数
			showPaiDuiTip : false ,
			service_id : '' ,//客服id
			services_state : 'online' ,//客服的在线离线状态
			im_info : {} ,//客服的配置信息
			cur_kefu : '' ,//当前对话客服

		}
	}

		componentDidMount (){
			const navigation = this.props.navigation;
			if ( key ) {
				//取聊天的配置信息
				StorageUtil.get ( 'im_info' , ( error , object ) => {
					if ( !error ) {
						this.setState ( {
							im_info : JSON.parse ( object )
						} , () => {
							this.getBaseInfo ();
						} );

					}
				} )


			} else {
				ViewUtils.navDetailPage ( navigation , 'Login' );
			}
			//监听-刷新页面
			CountEmitter.addListener ( 'updateNewService' , () => {
				this.getBaseInfo ();
			} );
			//监听-更新快捷回复列表
			CountEmitter.addListener ( 'updateQuickList' , () => {
				this.getQuickList ();
			} );
			CountEmitter.addListener ( 'sendGoods' , () => {
				//关闭底部弹层
				this.setState ( {
					is_show_bottom : false
				} );
				//取商品信息缓存，发消息，清缓存
				StorageUtil.get ( 'sendGoodsInfo' , ( error , object ) => {
					if ( !error ) {
						this.sendMessage ( object );
					}
				} )
			} );

			CountEmitter.addListener ( 'sendOrder' , () => {
				//关闭底部弹层
				this.setState ( {
					is_show_bottom : false
				} );
				//取订单信息缓存，发消息，清缓存
				StorageUtil.get ( 'sendOrderInfo' , ( error , object ) => {
					if ( !error ) {
						this.sendMessage ( object );
					}
				} )
			} );
		}

	componentWillUnmount() {
		chat_route = 'chatlist';
		this.scrollTimeout && clearTimeout(this.scrollTimeout);
		//通知消息列表更新
		CountEmitter.emit('updateSldChatLists');
		//卸载监听
		CountEmitter.removeListener('updateQuickList', ()=>{});
		CountEmitter.removeListener('sendGoods', ()=>{});
		CountEmitter.removeListener('sendOrder', ()=>{});
	}


	//获取基本信息
	getBaseInfo = () => {
		const {store_info,goods_info} = this.state;
		RequestData.getSldData(api.sld_chat_client_base+'?business_id='+store_info.seller_name+'&visiter_id='+cur_user_info.member_id+'&product_id='+goods_info.gid+'&product='+goods_info.gid+'&visiter_name='+cur_user_info.username+'&from_url=&avatar='+cur_user_info.member_avatar+'&groupid=0')
			.then(res => {
				if (res.code == 0) {
					let channel = res.msg.channel;
					this.setState({
						channel:channel,
					},()=>{
						this.sldim_connect();
						this.noticeServices();
					});
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//获取排队人数
	getPaiDuinums = (business_id) => {
		RequestData.postSldData(api.sld_chat_client_paidui_num, {business_id: business_id})
			.then(result => {
				this.setState({
					paiDuiNum:result,
					showPaiDuiTip:true,
				});
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//转接客服
	zhuanJie = () => {
		const {store_info} = this.state;
		RequestData.postSldData(api.sld_chat_client_zhuanjie, {visiter_id:cur_user_info.member_id,business_id: store_info.seller_name})
			.then(result => {
				if (res.code == 0) {
					CountEmitter.emit('updateNewService');
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//通知客服
	noticeServices = () => {
		const {store_info,goods_info,chat_list} = this.state;
		RequestData.postSldData(api.sld_chat_client_notice_services, {
			visiter_id: cur_user_info.member_id,
			visiter_name: cur_user_info.username,
			business_id: store_info.seller_name,
			from_url: 'app_'+goods_info.gid,
			avatar: cur_user_info.member_avatar,
			groupid: 0,
		})
			.then(res => {
				if (res.code == 0) {
					//将问候语显示到屏幕
					//将新消息追加到数组里
					let new_chat_info = {};
					new_chat_info.content = res.data.content;
					//当前时间
					new_chat_info.timestamp = ViewUtils.formatChatTime(parseInt(new Date()/1000));
					new_chat_info.direction = 'to_visiter';
					_this.setState ( {
						chat_list:chat_list.concat(new_chat_info),
					} );
					_this.scroll();

					//存放连接的services_id
					this.setState({
						service_id:res.data.service_id,
						cur_kefu:res.data.user_name
					});
				} else if (res.code == 1) {
					ViewUtils.sldToastTip(res.msg);
				} else if (res.code == 2) {
					//获取排队人数
					this.getPaiDuinums(store_info.seller_name);
					//存放连接的services_id
					this.setState({
						service_id:res.data.service_id
					});

				} else if (res.code == 3) {
					ViewUtils.sldToastTip(res.msg);
					this.setState({
						service_id:''
					});

				} else if (res.code == 4) {
					Alert.alert(
						'',
						I18n.t('ChatScteen.text1'),
						[
							{text:I18n.t('ChatScteen.text11'),onPress:(()=>{this.zhuanJie()})},
							{text:I18n.t('ChatScteen.text12'),onPress:(()=>{}),style:'cancle'}
						]
					);
				}
				//获取聊天记录
				this.getChatHisLists();
				//滚动到页面底部
				this.scroll();
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//pusher-js 实时监听消息
	sldim_connect = () => {
		const {chat_user_info,channel,im_info} = this.state;
		var pusher = new Pusher(im_info.service_appid, {
			encrypted: false
			, enabledTransports: ['ws']
			, wsHost: im_info.service_domain
			, wsPort: im_info.service_port
			, authEndpoint: '/auth.php'
			,disableStats: true
		});
		//
		let channels = pusher.subscribe("cu" + channel);
		//接收客服发送过来的消息
		channels.bind("my-event", function (data) {
				let {chat_list} = _this.state;
				let receive_info = data.message;

				//将新消息追加到数组里
					let new_chat_info = {};
					new_chat_info.content = receive_info.content;
					new_chat_info.timestamp = receive_info.timestamp;
					new_chat_info.direction = 'to_visiter';
					_this.setState ( {
						chat_list:chat_list.concat(new_chat_info),
					} );
					_this.scroll();
		});
		channels.bind('first_word', function (data) {
			//移除排队提示
			_this.setState({
				showPaiDuiTip:false
			});
		});

		channels.bind('cu_notice', function (data) {
			//移除排队提示
			_this.setState({
				showPaiDuiTip:false,
				service_id:data.message.service_id,
				cur_kefu:data.message.user_name
			});
		});


		getlisten = (chas) => {
			let channel_ser = pusher.subscribe("se" + chas);
			//通知游客 客服离线,将客服的头像置灰色
			channel_ser.bind('logout', function (data) {
				_this.setState({
					services_state:'offline'
				});
			});
			//表示客服在线，将客服头像变亮
			channel_ser.bind("geton", function (data) {
				_this.setState({
					services_state:'online'
				});
			});
		}

		if (_this.state.service_id!='') {
			// this.getlisten(_this.state.service_id);
			let channel_ser = pusher.subscribe("se" + _this.state.service_id);
			//通知游客 客服离线,将客服的头像置灰色
			channel_ser.bind('logout', function (data) {
				_this.setState({
					services_state:'offline'
				});
			});
			//表示客服在线，将客服头像变亮
			channel_ser.bind("geton", function (data) {
				_this.setState({
					services_state:'online'
				});
			});
		}

		channels.bind('getswitch', function (data) {
			ViewUtils.sldToastTip(I18n.t('ChatScteen.text2')+ data.message.user_name);
			_this.setState({
				cur_kefu:data.message.user_name
			});
		});


		pusher.connection.bind('state_change', function(states) {
			//标示客服自己的状态是在线还是离线
			let {service_info} = _this.state;
			//未连接的话释放资源重新连接
			if(states.current == 'unavailable' || states.current == "disconnected" || states.current == "failed" ){
				if (_this.state.service_id!='') {
					pusher.unsubscribe("se" + _this.state.service_id);
				}
				pusher.unsubscribe("cu" + _this.state.channel);

				if (typeof (pusher.isdisconnect) == 'undefined') {
					pusher.isdisconnect = true;

					pusher.disconnect();
					// delete pusher;
					//重新连接
					setTimeout(function(){
						_this.sldim_connect();
					},1000);
				}
				//提示自己的离线状态，并将自己的头像置灰
				// service_info.state='offline';
				// _this.setState({
				// 	service_info:service_info
				// })
			}
		});

		pusher.connection.bind('connected', function() {
			//表示双方连接成功
			// console.info('connected');
		});


	}



	//跳转到当前被转接的客户页面
	goNewChatScteen = (data) => {
		this.props.navigation.push('ChatScteen',{data:data});
	}

	//将该访客的所有未读消息置为已读
	setNoread = () => {
		const {chat_user_info} = this.state;
		RequestData.postSldData(api.sld_chat_set_unread, {visiter_id: chat_user_info.visiter_id})
			.then(result => {
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//获取访客的在线离线状态
	getVisiterState = () => {
		let {chat_user_info} = this.state;
		RequestData.postSldData(api.sld_chat_get_visiter_state, {channel: chat_user_info.channel})
			.then(result => {
					if(result.code == 0){
						chat_user_info.state = result.data.state;
						this.setState({
							chat_user_info:chat_user_info
						});
					}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}
	//该访客是否已经被转走
	sldIsSwitch = () => {
		const {chat_user_info} = this.state;
		RequestData.postSldData(api.sld_chat_get_isswitch, {visiter_id: chat_user_info.visiter_id})
			.then(result => {
				if(result.code == 3&& result.msg == I18n.t('ChatScteen.text3')){
					ViewUtils.sldToastTip(I18n.t('ChatScteen.text10'));
					this.setState({
						is_switch:1
					});
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	// 当str长度超过某个限定值时，在str中插入换行符
	spliceStr(str) {
		var len = str.length;
		if (len > MSG_LINE_MAX_COUNT) {
			var pageSize = parseInt(len / MSG_LINE_MAX_COUNT) + 1;
			var result = '';
			var start, end;
			for (var i = 0; i < pageSize; i++) {
				start = i * MSG_LINE_MAX_COUNT;
				end = start + MSG_LINE_MAX_COUNT;
				if (end > len) {
					end = len;
				}
				result += str.substring(start, end);
				if(i+1!=pageSize){
					result += '\n';
				}
			}
			return result;
		} else {
			return str;
		}
	}

	renderItem = (item) => {
		if(item.item.direction == 'to_visiter'){
			return this.renderReceivedMsg(item);
		}else{
			return this.renderSendMsg(item);
		}
	}

	_keyExtractor = (item, index) => index

	//flatlist转接客服分隔组件
	separatorComponent = () => {
		return (
			<View style={{height: 0.5,backgroundColor: '#e5e5e5',width:width,marginLeft:pxToDp(140)}}/>
		);
	}
	//快捷回复分隔组件
	separatorComponentQuick = () => {
		return (
			<View style={{height: 0.5,backgroundColor: '#e5e5e5',width:width,marginLeft:pxToDp(20)}}/>
		);
	}

	//执行转接事件
	goZhuanJie = (item) => {
		const {chat_user_info} = this.state;
		RequestData.postSldData(api.sld_chat_switch_service, {visiter_id: chat_user_info.visiter_id,id:item.service_id,name:commonInfo.seller_name})
			.then(result => {
				ViewUtils.sldToastTip(result.msg);
				if(result.code == 0){
					this.setState({
						is_switch:1
					});
					setTimeout(()=>{
						this.refs.exchange.close();
					},2000);
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//转接客服渲染数据
	renderCell = ( item , index ) => {
		return (
			<TouchableOpacity
				key={ index }
				activeOpacity={ 1 } onPress={ () => {
					if(item.state=='online'){
						this.goZhuanJie(item);
					}else{
						ViewUtils.sldToastTip(I18n.t('ChatScteen.text4'));
					}
			} }
				style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',width:width,height:pxToDp(140),padding:pxToDp(30)}}>
					<Image source={require('../assets/images/chat_default_avatar.png')} style={{width: pxToDp(80), height: pxToDp(80),borderRadius:pxToDp(10)}}/>
				{item.state == 'offline'&&(
					<View style={{backgroundColor:'#000',width: pxToDp(80), height: pxToDp(80),borderRadius:pxToDp(10),position:'absolute',left:pxToDp(30),top:pxToDp(30),zIndex:5,opacity:0.8}}/>
				)}

					<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginLeft:pxToDp(30),flex:1}}>
						<View style={{flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
							<Text style={{color:'#121212',fontSize:pxToDp(30),fontWeight:'400'}}>{item.nick_name}[{item.user_name}]</Text>
							<Text style={{color:'#848484',fontSize:pxToDp(26),fontWeight:'300',marginTop:pxToDp(15)}}>[{item.state=='online'?I18n.t('ChatScteen.line'):I18n.t('ChatScteen.Offline')}]</Text>
						</View>
						{ ViewUtils.getSldImg ( 36 , 32 , require('../assets/images/sld_zhuangjie_no.png') ) }
					</View>
			</TouchableOpacity>
		);
	}


	//发送常见问题
	sendQustion = (item) => {
		isSendQuestion = true;
		qustionId = item.qid;
		this.sendMessage(item.question);
	}

	//发送常见问题的回复
	getAnswer = () => {
		 let {chat_list,store_info} = this.state;
		RequestData.postSldData(api.sld_chat_client_send_question, {qid: qustionId})
			.then(result => {
				if(result.code == 0){
					let new_chat_info = {};
					new_chat_info.content = result.data.answer_read;
					new_chat_info.timestamp = ( new Date () ).getTime () / 1000;
					new_chat_info.direction = 'to_visiter';
					new_chat_info.business_id = store_info.seller_name;

					this.setState ( {
						chat_list:chat_list.concat(new_chat_info),
					} );
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//快捷回复渲染数据
	renderCellQuick = ( item , index ) => {
		return (
			<TouchableOpacity
				key={ index }
				activeOpacity={ 1 } onPress={ () => {
					this.sendQustion(item);
			} }
				style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',width:width,padding:pxToDp(30)}}>
					<View style={{flex:1,marginRight:pxToDp(100),flexDirection:'row',justifyContent:'flex-start'}}>
					<Text style={{color:'#333',fontSize:pxToDp(24),fontWeight:'400',lineHeight:pxToDp(40)}}>{item.question}</Text>
					</View>
					{ ViewUtils.getSldImg ( 28 , 30 , require('../assets/images/sld_chat_question_send.png') ) }
			</TouchableOpacity>
		);
	}


	keyExtractor = ( item , index ) => {
		return index
	}

	//判断消息是什么类型（type为goods:商品，order：订单，pic：图片）
	set_contype = (val) => {
		try{
			let obj = eval('(' + val + ')');
			contype = obj.type;
			conGoodsInfo = obj;
			if(typeof (obj) == 'number'){
				contype = 'text';
			}else{
				contype = obj.type;
				conGoodsInfo = obj;
			}
		}catch(e){
			//为文本类型
			let reg = /<img src=['"][/]upload[/]emoji[/]emo[_]([^'"]+)[^>]*>/gi;
			if(reg.test(val)){
				contViewCon = [];
				//该条消息中包含表情，正则分割，处理多个表情和字符串的问题
				let split_array = val.split(reg);
				for(let i=0;i<split_array.length;i++){
					if(split_array[i]!='s'&&split_array[i]!=' '){
						contViewCon.push(split_array[i]);
					}
				}
				contype = 'emoji';
			}else{
				contype = 'text';//文本，直接展示
			}
		}
	}


	//预览图片
	getBigImg = (img) => {
		let obj = eval('(' + img + ')');
		imageBig = [];
		imageBig = imageBig.concat({url:obj.con_img_url});
		this.setState({
			showBigImg:true,
		});
	}

	//
	cancleBigImg = () => {
		this.setState({
			showBigImg:false,
		});
	}

	// 接收的文本消息
	renderReceivedMsg(item) {
		const {store_info,cur_kefu,title} = this.state;
		let contactAvatar = require('../assets/images/chat_default_avatar.png');
			if (!ViewUtils.isEmpty(store_info.avatar)) {
			contactAvatar = ((store_info.avatar).indexOf('http')!=-1)?{uri:store_info.avatar}:require('../assets/images/chat_default_avatar.png');
		}
		//处理消息内容
		this.set_contype(item.item.content);


		return (
			<View style={{flexDirection: 'column', alignItems: 'center'}}>
				{
						this.shouldShowTime(item) ? (<View style={listItemStyle.time_view}>
						<Text style={listItemStyle.times}>{ViewUtils.formatChatTime(parseInt(item.item.timestamp))}</Text>
						</View>) : (null)
				}
				<View style={listItemStyle.container}>
					<View>
						<Image style={listItemStyle.avatar} source={contactAvatar}/>
						{this.state.services_state == 'offline'&&(
							<View style={{backgroundColor:'#000',opacity:0.5,width:pxToDp(80),height:pxToDp(80),position:'absolute',zIndex:2,borderRadius:pxToDp(10)}}/>
						)}
					</View>


					<View style={{flexDirection:'column',alignItems:'flex-start',marginLeft:pxToDp(30)}}>
						<Text style={{color:'#999999',fontSize:pxToDp(22),fontWeight:'400',marginBottom:pxToDp(20)}}>{title+(cur_kefu==''?"":":")+cur_kefu}</Text>
						{ contype != 'pic' &&
						<View style={ listItemStyle.msgContainer }>

							{ contype == 'emoji' && (
								<View style={ { flexDirection : 'row' , flexWrap : 'wrap' , maxWidth : pxToDp ( 450 ) } }>
									{ contViewCon.length > 0 && (
										contViewCon.map ( ( item , index ) => {
											return (
												<View key={ index }>
													{ item.indexOf ( '.gif' ) == -1 && ( <Text>{ item }</Text> ) }
													{ item.indexOf ( '.gif' ) != -1 && (
														<Image source={ Smiley.data[ ( item.split ( '.' ) )[ 0 ] * 1 - 1 ] }
														       style={ styles.emojiIcon }/> ) }
												</View>
											)
										} )
									)
									}
								</View>
							) }
							{ contype == 'text' && (
								<Text style={ listItemStyle.msgText_right }>{ this.spliceStr ( item.item.content ) }</Text>
							) }

							{ contype == 'goods' && (
								<TouchableOpacity
									activeOpacity={1}
									onPress={() =>ViewUtils.goDetailPageNew(this.props.navigation,{type:'GoodsDetailNew',value:conGoodsInfo.gid})}
									style={ {
									width : pxToDp ( 450 ) ,
									height : pxToDp ( 160 ) ,
									flexDirection : 'row' ,
									justifyContent : 'flex-start' ,
									alignItems : 'center'
								} }>
									{ ViewUtils.getSldImg ( 120 , 120 , { uri : conGoodsInfo.img } ) }
									<View style={ {
										flex : 1 ,
										flexDirection : 'column' ,
										marginLeft : pxToDp ( 15 ) ,
										justifyContent : 'space-between' ,
									} }>
										<Text numberOfLines={ 2 } style={ {
											color : '#fff' ,
											fontSize : pxToDp ( 26 ) ,
											fontWeight : '400' ,
											lineHeight : pxToDp ( 32 ) ,
											marginRight : pxToDp ( 43 )
										} }>{ conGoodsInfo.goods_name }</Text>
										<Text style={ {
											color : '#fff' ,
											fontSize : pxToDp ( 26 ) ,
											fontWeight : '400' ,
											marginTop : pxToDp ( 20 )
										} }>ks{PriceUtil.formatPrice( conGoodsInfo.price )}</Text>
									</View>

								</TouchableOpacity>
							) }
							{contype == 'order'&&(
								<TouchableOpacity
									activeOpacity={1}
									onPress={() =>ViewUtils.goDetailPageNew(this.props.navigation,{type:'goOrderDetail',value:conGoodsInfo.order_id})}
									style={{width:pxToDp(450),flexDirection:'column',justifyContent:'center',alignItems:'flex-start',paddingTop:pxToDp(20),paddingBottom:pxToDp(20)}}>
									<Text style={{color:"#333333",fontSize:pxToDp(30),fontWeight:'600',marginBottom:pxToDp(30)}}>{I18n.t('ChatScteen.text5')}</Text>

									<ScrollView horizontal={true} style={{height:pxToDp(120),paddingRight:pxToDp(20)}}>
										{typeof (conGoodsInfo.order_goods)!='undefined'&&conGoodsInfo.order_goods.map((item, index) => {
											return (
												<Image
													key={'order_goods_pic'+index}
													source={{uri:item}}
													resizeMode={'contain'} style={{width:pxToDp(120),height:pxToDp(120),marginLeft:pxToDp(20)}}
													defaultSource={require('../assets/images/default_icon_124.png')}
												/>
											)
										})
										}
									</ScrollView>
									<View styl={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',height:pxToDp(56),width:'100%'}}>
										{ViewUtils.sldTextColor(I18n.t('GoodsDetailNew.common')+conGoodsInfo.total_num+I18n.t('GoodsDetailNew.text55')+I18n.t('ChatScteen.total')+' ：','Ks'+PriceUtil.formatPrice(conGoodsInfo.order_amount),'#666666','#FF2A2A',26,'400',0,20,20,20)}
									</View>
									<View style={{flexDirection:"column",justifyContent:"flex-start",alignItems:'flex-start',borderColor:'#E5E5E5',borderBottomWidth:0.5,borderTopWidth:0.5}}>
										{ViewUtils.sldTextColor(I18n.t('ChatScteen.ordernumber')+'：',conGoodsInfo.order_sn,'#666666','#666666',26,'400',0,20,20)}
										{ViewUtils.sldTextColor(I18n.t('ChatScteen.order_state')+'：',conGoodsInfo.order_state,'#666666','#666666',26,'400',0,20,20)}
										{ViewUtils.sldTextColor(I18n.t('ChatScteen.pay_time')+'：',conGoodsInfo.pay_time,'#666666','#666666',26,'400',0,20,20,20)}
									</View>
									{ViewUtils.sldTextColor(I18n.t('ChatScteen.buyer_name')+'：',conGoodsInfo.buyer_name,'#666666','#666666',26,'400',0,20,20)}
									{ViewUtils.sldTextColor(I18n.t('ChatScteen.buyer_phone')+'：',conGoodsInfo.buyer_phone,'#666666','#666666',26,'400',0,20,20)}

									<View style={{flexDirection:'column',width:"100%",paddingRight:pxToDp(40)}}>
										{ViewUtils.sldTextColor(I18n.t('MyScreen.AddressList')+'：',conGoodsInfo.buyer_address,'#666666','#666666',26,'400',0,20,20)}
										{conGoodsInfo.buyer_beizhu!=''&&
										ViewUtils.sldTextColor(I18n.t('ChatScteen.buyer_beizhu')+'：',conGoodsInfo.buyer_beizhu,'#666666','#666666',26,'400',0,20,20)
										}
									</View>
								</TouchableOpacity>
							)}

						</View>
						}
						{contype == 'pic'&&(
							<TouchableOpacity
								activeOpacity={1}
								onPress={() =>this.getBigImg(item.item.content)}
							>
								<Image
									source={{uri:conGoodsInfo.con_img_url}} resizeMode={'contain'} style={{width:pxToDp(225),height:pxToDp(225),borderRadius: pxToDp(10),}}
									defaultSource={require('../assets/images/default_icon_124.png')}
								/>
							</TouchableOpacity>
						)}

					</View>
				</View>

			</View>
		);
	}



	// 发送出去的消息  contype:'text'消息类型，text 文本，表情，goods:商品，order:订单，pic：图片，
	renderSendMsg(item) {
		let {service_info,store_info} = this.state;
		let avatar = require('../assets/images/chat_default_avatar.png');
		if (!ViewUtils.isEmpty(cur_user_info.member_avatar)) {
			avatar = {uri: cur_user_info.member_avatar};
		}

		//处理消息内容
		this.set_contype(item.item.content);
		// 发送出去的消息
		return (
			<View style={{flexDirection: 'column', alignItems: 'center'}}>
				{
					this.shouldShowTime(item) ? (
						<View style={listItemStyle.time_view}>
						<Text style={listItemStyle.times}>{ViewUtils.formatChatTime(parseInt(item.item.timestamp))}</Text>
						</View>) : (null)
				}

				<View style={listItemStyle.containerSend}>
					<View style={{flexDirection:'column',alignItems:'flex-end',marginRight:pxToDp(30)}}>
					<Text style={{color:'#999999',fontSize:pxToDp(22),fontWeight:'400',marginBottom:pxToDp(20)}}>{store_info.store_name}</Text>
						{contype != 'pic'&&
							<View style={listItemStyle.msgContainerSend}>
								{contype == 'emoji'&&(
									<View style={{flexDirection:'row',flexWrap:'wrap',maxWidth:pxToDp(450)}}>
										{contViewCon.length>0&&(
											contViewCon.map((item, index) => {
												return (
													<View key={index}>
														{item.indexOf('.gif')==-1&&(<Text >{item}</Text>)}
														{item.indexOf('.gif')!=-1&&(<Image source={Smiley.data[(item.split('.'))[0]*1-1]} style={styles.emojiIcon}/>)}
													</View>
												)
											})
										)
										}
									</View>
								)}
								{contype == 'text'&&(
									<Text style={listItemStyle.msgText_send}>{this.spliceStr(item.item.content)}</Text>
								)}
								{contype == 'goods'&&(
									<TouchableOpacity
										activeOpacity={1}
										onPress={() =>ViewUtils.goDetailPageNew(this.props.navigation,{type:'GoodsDetailNew',value:conGoodsInfo.gid})}
										style={{width:pxToDp(450),height:pxToDp(160),flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
										{ViewUtils.getSldImg(120,120,{uri:conGoodsInfo.img})}
										<View style={{flex:1,flexDirection:'column',marginLeft:pxToDp(15),justifyContent:'space-between',}}>
											<Text numberOfLines={2} style={{color:'#fff',fontSize:pxToDp(26),fontWeight:'400',lineHeight:pxToDp(32),marginRight:pxToDp(43)}}>{conGoodsInfo.goods_name}</Text>
											<Text style={{color:'#fff',fontSize:pxToDp(26),fontWeight:'400',marginTop:pxToDp(20)}}>ks{PriceUtil.formatPrice(conGoodsInfo.price)}</Text>
										</View>

									</TouchableOpacity>
								)}

								{contype == 'order'&&(
									<TouchableOpacity
										activeOpacity={1}
										onPress={() =>ViewUtils.goDetailPageNew(this.props.navigation,{type:'goOrderDetail',value:conGoodsInfo.order_id})}
										style={{width:pxToDp(450),flexDirection:'column',justifyContent:'center',alignItems:'flex-start',paddingTop:pxToDp(20),paddingBottom:pxToDp(20)}}>
										<Text style={{color:"#333333",fontSize:pxToDp(30),fontWeight:'600',marginBottom:pxToDp(30)}}>{I18n.t('ChatScteen.text5')}</Text>

											<ScrollView horizontal={true} style={{height:pxToDp(120),paddingRight:pxToDp(20)}}>
												{typeof (conGoodsInfo.order_goods)!='undefined'&&conGoodsInfo.order_goods.map((item, index) => {
														return (
															<Image key={'order_goods_pic'+index} source={{uri:item}} resizeMode={'contain'} style={{width:pxToDp(120),height:pxToDp(120),marginLeft:pxToDp(20)}}/>
														)
													})
												}
											</ScrollView>
										<View styl={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',height:pxToDp(56),width:'100%'}}>
											{ViewUtils.sldTextColor(I18n.t('GoodsDetailNew.common')+conGoodsInfo.total_num+I18n.t('GoodsDetailNew.piece')+I18n.t('CartScreen.TotalAmount')+'：','Ks'+PriceUtil.formatPrice(conGoodsInfo.order_amount),'#fff','#FF2A2A',26,'400',0,20,20,20)}
										</View>
										<View style={{flexDirection:"column",justifyContent:"flex-start",alignItems:'flex-start',borderColor:'#E5E5E5',borderBottomWidth:0.5,borderTopWidth:0.5}}>
											{ViewUtils.sldTextColor(I18n.t('ChatScteen.order_sn')+'：',conGoodsInfo.order_sn,'#fff','#fff',26,'400',0,20,20)}
											{ViewUtils.sldTextColor(I18n.t('ChatScteen.order_state')+'：',conGoodsInfo.order_state,'#fff','#fff',26,'400',0,20,20)}
											{ViewUtils.sldTextColor(I18n.t('ChatScteen.pay_time')+'：',conGoodsInfo.pay_time,'#fff','#fff',26,'400',0,20,20,20)}
										</View>
										{ViewUtils.sldTextColor(I18n.t('ChatScteen.buyer_name')+'：',conGoodsInfo.buyer_name,'#fff','#fff',26,'400',0,20,20)}
										{ViewUtils.sldTextColor(I18n.t('ChatScteen.buyer_phone')+'：',conGoodsInfo.buyer_phone,'#fff','#fff',26,'400',0,20,20)}

										<View style={{flexDirection:'column',width:"100%",paddingRight:pxToDp(40)}}>
										{/* {ViewUtils.sldTextColor(I18n.t('ChatScteen.buyer_address')+'：',I18n.t('BlackCardScreen.purchasing')'的积分 i 哦啊家筽 is 分父爱的积分 i 哦啊家筽分 i的积分 i 哦啊急哦地方','#fff','#fff',26,'400',0,20,20)} */}
										{conGoodsInfo.buyer_beizhu!=''&&
										ViewUtils.sldTextColor(I18n.t('ChatScteen.buyer_beizhu')+'：',conGoodsInfo.buyer_beizhu,'#fff','#fff',26,'400',0,20,20)
										}
										</View>
									</TouchableOpacity>
								)}


							</View>
						}
						{contype == 'pic'&&(
							<TouchableOpacity
								activeOpacity={1}
								onPress={() =>this.getBigImg(item.item.content)}
							>
							<Image
								source={{uri:conGoodsInfo.con_img_url}} resizeMode={'contain'} style={{width:pxToDp(225),height:pxToDp(225),borderRadius: pxToDp(10),}}
								defaultSource={require('../assets/images/default_icon_124.png')}
							/>
							</TouchableOpacity>
						)}
					</View>
					<View>
					<Image style={listItemStyle.avatar} source={avatar}/>
						{service_info.state == 'offline'&&(
							<View style={{backgroundColor:'#000',opacity:0.5,width:pxToDp(80),height:pxToDp(80),position:'absolute',zIndex:2,borderRadius:pxToDp(10)}}/>
						)}
					</View>
				</View>

			</View>
		);
	}

	// 该方法判断当前消息是否需要显示时间
	shouldShowTime(item) {
		let index = item.index;
		if (index == 0) {
			// 第一条消息，显示时间
			return true;
		}
		if (index > 0) {
			let messages = this.state.chat_list;
			if (!ViewUtils.isEmpty(messages) && messages.length > 0) {
				let preMsg = messages[index - 1];
				let delta = item.item.timestamp - preMsg.timestamp;
				if (delta > 3 * 60) {
					return true;
				}
			}
			return false;
		}
	}

	//从缓存获取hid
	getHid = () => {
		StorageUtil.get('hid', (error, object) => {
			if (!error) {
				this.setState({hid: object==null?'':object},()=>{
					this.getChatHisLists();
				});
			}
		})
	}



	getChatHisLists = () => {
		let {hid,hasmore,chat_list,store_info,service_id} = this.state;
		if(hasmore){
			RequestData.postSldData(api.sld_chat_client_history_lists, {
				vid: cur_user_info.member_id,
				hid:hid,
				service_id: service_id,
				business_id: store_info.seller_name
			})
				.then(result => {
						this.setState({
							refreshflat:false
						});
						if(result.code == 0){
							if(result.data.length==0){
								this.setState({
									hasmore:false
								});
							}else{
								chat_list = result.data.concat(chat_list);
								this.setState({
									chat_list:chat_list,
									hid:result.data[0].cid,
									hasmore:true,
								},()=>{
									_this.scroll();
								});
							}

						}
				})
				.catch(error => {
					this.setState({
						refreshflat:false
					});
					ViewUtils.sldErrorToastTip(error);
				})
		}
	}


	updateView = () => {
		const {showEmojiView} = this.state;
		this.setState({
			showEmojiView: !showEmojiView,
		})
		//
	}

	//聊天顶部菜单点击事件
	onClick = (type) => {
		const {goods_info,store_info} = this.state;
		const navigation = this.props.navigation;
		switch ( type ) {
			case "bottom_four":
				//是否显示底部菜单
				this.setState({
					is_show_bottom:!this.state.is_show_bottom
				});
				break;
				case "lianjie":
				//发送当前商品连接
					let goodsInfo = {};
					goodsInfo.type = 'goods';
					goodsInfo.goods_name = goods_info.goods_name;
					goodsInfo.img = goods_info.goods_image_new;//图片的绝对路径
					goodsInfo.price = goods_info.show_price;
					goodsInfo.gid = goods_info.gid,//商品id
					goodsInfo.salse_num = goods_info.goods_salenum;//销量
					goodsInfo.storage = goods_info.goods_storage;//库存
					StorageUtil.set('sendGoodsInfo', JSON.stringify(goodsInfo),()=>{
						CountEmitter.emit('sendGoods');
					});

				break;
				//常见问题
				case "question":
				this.getQuickList();
				this.refs.quickreplay.open();
					break;
				//表情按钮
				case "emojiBtn":
					this.updateView();
				break;
				//上传图片
				case "uploadPic":
					this.uploadPic();
					break;
				case "Footer":
					navigation.navigate('ChatRecGoods',{visiter_id:store_info.vid,title:I18n.t('ChatScteen.footprint'),sle_type:'foot'});
				break;
				case "RecGoods":
					navigation.navigate('ChatRecGoods',{visiter_id:store_info.vid,title:I18n.t('ChatScteen.commodities'),sle_type:'rec'});
				break;
			default:
				break;
		}
	}

	//上传图片
	uploadPic = () => {
		const {goods_info,store_info} = this.state;
		ImagePicker.openPicker({
			multiple:false
		}).then(image => {
			let path = image.path;
			let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
			if (!key) {
				this.props.navigation.navigate('Login');
			} else {
				let formData = new FormData();
				let file = {uri: image.path, type: 'multipart/form-data', name: filename,'size': image.size,tmp_name:image.filename};
				formData.append('upload', file);
				formData.append('visiter_id', cur_user_info.member_id);
				formData.append('business_id', store_info.seller_name);
				formData.append('avatar', cur_user_info.member_avatar);
				formData.append('record', 'app_'+goods_info.gid);
				this.setState({
					showWait:true,
				});
				fetch(api.sld_chat_client_upload_pic,{
					method:'POST',
					mode: 'no-cors',
					credentials: 'include',
					headers: {

					},
					body: formData
				})
					.then(response=>response.json())
					.then(result=>{
						this.setState({
							showWait:false,
						});
						//上传成功
						if(result.code == 0){
							let {chat_list} = this.state;
							let uploadInfo = {};
							uploadInfo.type = 'pic';
							uploadInfo.con_img_url = result.img_url;

							let new_chat_info = {};
							new_chat_info.content = JSON.stringify(uploadInfo);
							new_chat_info.timestamp = ( new Date () ).getTime () / 1000;
							new_chat_info.direction = 'to_service';

							this.setState ( {
								chat_list:chat_list.concat(new_chat_info),
								input_val:'',
								showEmojiView:false,
								is_show_bottom:false
							});
							this.scroll();
						}
					})
					.catch(error=>{
						this.setState({
							showWait:false,
						});
						//上传出错
						ViewUtils.sldToastTip(I18n.t('ChatScteen.text6'));
					})

			}
		});
	}



	//获取常见问题列表
	getQuickList = () => {
		RequestData.postSldData(api.sld_chat_client_question_list, {business_id: this.state.store_info.seller_name})
			.then(result => {
				if(result.code == 0){
					this.setState({
						quick_list:result.data
					});
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	handleSldVal = (val) => {
		this.setState({
			input_val:val
		});
	}

	//发送聊天消息
	sendMessage = (con='') => {
		let {input_val,chat_list,service_id,goods_info,store_info} = this.state;
		input_val = (con==''?input_val:con);
		 if(input_val!=''&&service_id!=''){
			 //发送消息
			 RequestData.postSldData(api.sld_chat_client_send_chat, {
			 	visiter_id: cur_user_info.member_id,
				 content: input_val,
				 business_id: store_info.seller_name,
				 avatar: cur_user_info.member_avatar,
				 record:'app_'+goods_info.gid
			 })
				 .then(result => {
					 this.setState({
						 showWait:false,
					 });
					 if(result.code == 0) {
							this.refs.quickreplay.close();
						 let new_chat_info = {};
						 new_chat_info.content = input_val;
						 new_chat_info.timestamp = ( new Date () ).getTime () / 1000;
						 new_chat_info.direction = 'to_service';

						 this.setState ( {
							 chat_list:chat_list.concat(new_chat_info),
							 input_val:'',
							 showEmojiView:false,
							 is_show_bottom:false
						 },()=>{
						 	if(isSendQuestion){
							  isSendQuestion = false;
						 		this.getAnswer();
						  }
						 } );
						 this.scroll();
						 //清缓存
						 StorageUtil.delete('sendGoodsInfo');
					 }else{
						 ViewUtils.sldToastTip(result.msg);
					 }
				 })
				 .catch(error => {
					 this.setState({
						 showWait:false,
					 });
					 ViewUtils.sldErrorToastTip(error);
				 })
		 }
	}

	//将页面滚动到最底部
	scroll = () =>{
		this.scrollTimeout = setTimeout(() => {
			this.refs.flatList.scrollToEnd()
		}, 0);
	}

	//下拉刷新
	onHisChatRefresh = () => {
		this.setState({
			refreshflat:true,
		},()=>{
			this.getChatHisLists();
		});

	}


	//点击表情事件
	click_emoji = (val) => {
		let new_val = val + 1;
		if(new_val<10){
			new_val = '0'+new_val;
		}
		let new_val_end = '<img src="/upload/emoji/emo_'+new_val+'.gif">';
		this.sendMessage(new_val_end);
	}

	moreView = 	[<SldEmojiView click_event={(val)=>this.click_emoji(val)}/>];
	render() {
		_this = this;
		const {title,showProgress,chat_list,is_show_bottom,chat_user_info,input_val,refreshflat,service_list,quick_list,service_info,is_delete,showEmojiView,showWait,showBigImg,paiDuiNum,showPaiDuiTip,store_info,cur_kefu} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				{
					showWait ? (
						<LoadingWait loadingText={I18n.t('ChatScteen.text7')} cancel={() => this.setState({showWait: false})}/>
					) : (null)
				}
				{
					showBigImg ? (
				<View style={{width:width,height:height}}>
					<ImageViewer
						imageUrls={imageBig} // 照片路径
						enableImageZoom={true} // 是否开启手势缩放
						index={0} // 初始显示第几张
						onChange={(index) => {}} // 图片切换时触发
						onClick={() => { // 图片单击事件
							this.cancleBigImg();
						}}
					/>
				</View>) : (null)
				}
				<SldHeader title={title+(cur_kefu==''?"":":")+cur_kefu} left_icon={require('../assets/images/goback.png')} left_event={() =>{this.props.navigation.pop(1)}} right_type={'icon'} right_icon={require('../assets/images/sld_chat_go_shop.png')} right_event={() =>ViewUtils.goDetailPageNew(this.props.navigation,{type:'Vendor',value:store_info.vid})}  right_style={{width:pxToDp(40),height:pxToDp(40)}}/>
				<View style={GlobalStyles.line}/>
				{
					showProgress ? (
						<LoadingView cancel={() => this.setState({showProgress: false})}/>
					) : (null)
				}
				{showPaiDuiTip&&(
					<View
						style={{flexDirection:'row',justifyContent:"flex-start",alignItems:'center',width:width,paddingLeft:pxToDp(30),height:pxToDp(60),backgroundColor:'#FFEACD'}}>

						{ViewUtils.getSldImg(30,30,require('../assets/images/sld_offline_tip.png'))}
						<Text style={{color:'#DAB684',fontWeight:'300',fontSize:pxToDp(26),marginLeft:pxToDp(10)}}>{I18n.t('ChatScteen.text8')}{paiDuiNum} {I18n.t('ChatScteen.textperson')}...</Text>
					</View>
				)}
					<View style={styles.chatContent}>
						<FlatList
							ref="flatList"
							data={chat_list}
							renderItem={this.renderItem}
							keyExtractor={this._keyExtractor}
							onRefresh={ () => this.onHisChatRefresh () }
							refreshing={ refreshflat }
						/>
					</View>


				<View style={GlobalStyles.line}/>
				<View style={{flexDirection:'column',height:is_show_bottom?pxToDp(290):(showEmojiView?pxToDp(400):pxToDp(100))}}>
				<View style={styles.bottomBar}>
					<TouchableOpacity
						activeOpacity={1}
						onPress={()=>{
							this.onClick("question")
						}}
						style={{marginLeft:pxToDp(29),marginRight:pxToDp(32)}}>
						{ViewUtils.getSldImg(50,50,require('../assets/images/sld_chat_bot_question.png'))}
					</TouchableOpacity>
					<SldTextInput
						style={[styles.wrapper_part_line_input, GlobalStyles.sld_global_font]}
						underlineColorAndroid={'transparent'}
						autoCapitalize='none'
						returnKeyType='send'
						keyboardType='default'
						enablesReturnKeyAutomatically={true}
						onChangeText={(text) =>this.handleSldVal(text)}
						placeholder={I18n.t('ChatScteen.text9')}
						onSubmitEditing={()=>this.sendMessage()}
						value={input_val}
					></SldTextInput>
					<TouchableOpacity
						activeOpacity={1}
						onPress={()=>{
							this.onClick("emojiBtn")
						}}
						style={{marginLeft:pxToDp(24),marginRight:pxToDp(19)}}>
						{ViewUtils.getSldImg(50,50,require('../assets/images/sld_chat_biaoqing.png'))}
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						onPress={()=>{
							this.onClick("bottom_four")
						}}
						style={{marginRight:pxToDp(27)}}>
						{ViewUtils.getSldImg(50,50,is_show_bottom?require('../assets/images/sld_chat_bottom_hide.png'):require('../assets/images/sld_chat_bottom_show.png'))}
					</TouchableOpacity>
				</View>

				{is_show_bottom&&(
					<View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',width:width,height:pxToDp(190)}}>
						<TouchableOpacity
							activeOpacity={1}
							onPress={()=>{
								this.onClick("uploadPic")
							}}
							style={styles.sld_bottom_common_part}>
							{ViewUtils.getSldImg(40,40,require('../assets/images/sld_chat_send_pic_icon.png'))}
							<Text style={styles.sld_bottom_common_part_text}>{I18n.t('ChatScteen.img')}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={1}
							onPress={()=>{
								this.onClick("lianjie")
							}}
							style={styles.sld_bottom_common_part}>
							{ViewUtils.getSldImg(40,40,require('../assets/images/sld_chat_send_url_icon.png'))}
							<Text style={styles.sld_bottom_common_part_text}>{I18n.t('ChatScteen.url')}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={1}
							onPress={()=>{
								this.onClick("Footer")
							}}
							style={styles.sld_bottom_common_part}>
							{ViewUtils.getSldImg(40,40,require('../assets/images/sld_chat_bot_foot.png'))}
							<Text style={styles.sld_bottom_common_part_text}>{I18n.t('ChatScteen.footprint')}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={1}
							onPress={()=>{
								this.onClick("RecGoods")
							}}
							style={styles.sld_bottom_common_part}>
							{ViewUtils.getSldImg(40,40,require('../assets/images/sld_chat_send_recommnd_icon.png'))}
							<Text style={styles.sld_bottom_common_part_text}>{I18n.t('ChatScteen.commodities')}</Text>
						</TouchableOpacity>

					</View>
				)}

					{showEmojiView&&
					<ScrollView showsHorizontalScrollIndicator={false} horizontal={true} keyboardDismissMode={'none'} style={{width:width,}}>
						{this.moreView}
					</ScrollView>
					}

				</View>


				<Modal
					backdropPressToClose={true}
					entry='bottom'
					position='bottom'
					coverScreen={true}
					swipeToClose={false}
					style={{
						backgroundColor: "#fff", height: DeviceInfo.isIPhoneX_deprecated?(width+30):width,
						position: "absolute", left: 0, right: 0,
						width: width,
						paddingBottom:DeviceInfo.isIPhoneX_deprecated?30:0,
					}}
					ref={"exchange"}>
					<View style={[{width:width,height:pxToDp(90)},GlobalStyles.flex_common_row]}>
						<Text style={{color:'#333333',fontSize:pxToDp(30)}}>{I18n.t('ChatScteen.Selecturl')}</Text>
						<TouchableOpacity
							activeOpacity={1}
							onPress={ ()=>{
								this.refs.exchange.close();
							} }
							style={[{width:pxToDp(66),height:pxToDp(90),position:'absolute',left:pxToDp(0),top:pxToDp(0)},GlobalStyles.flex_common_row]}>
						<Image style={{width:pxToDp(26),height:pxToDp(26)}} source={require('../assets/images/sld_close.png')}/>
						</TouchableOpacity>
					</View>
					<View style={GlobalStyles.line}/>
					<View>
						<FlatList
							ref="flatListSev"
							data={service_list}
							renderItem={ ( { item , index } ) => this.renderCell ( item , index ) }
							keyExtractor={ ( item , index ) => this.keyExtractor ( item , index ) }
							ItemSeparatorComponent={ () => this.separatorComponent () }
						/>
					</View>


				</Modal>

				<Modal
					backdropPressToClose={true}
					entry='bottom'
					position='bottom'
					coverScreen={true}
					swipeToClose={false}
					style={{
						backgroundColor: "#fff", height: DeviceInfo.isIPhoneX_deprecated?(width+30):width,
						position: "absolute", left: 0, right: 0,
						width: width,
						paddingBottom:DeviceInfo.isIPhoneX_deprecated?30:0,
					}}
					ref={"quickreplay"}>
					<View style={[{width:width,height:pxToDp(90)},GlobalStyles.flex_common_row]}>
						<Text style={{color:'#333333',fontSize:pxToDp(30)}}>{I18n.t('ChatScteen.FAQ')}</Text>
						<TouchableOpacity
							activeOpacity={1}
							onPress={ ()=>{
								this.refs.quickreplay.close();
							} }
							style={[{width:pxToDp(66),height:pxToDp(90),position:'absolute',left:pxToDp(0),top:pxToDp(0)},GlobalStyles.flex_common_row]}>
							<Image style={{width:pxToDp(26),height:pxToDp(26)}} source={require('../assets/images/sld_close.png')}/>
						</TouchableOpacity>
					</View>
					<View style={GlobalStyles.line}/>
					<View style={{flex:1}}>
						<FlatList
							ref="flatListQuick"
							data={quick_list}
							renderItem={ ( { item , index } ) => this.renderCellQuick ( item , index ) }
							keyExtractor={ ( item , index ) => this.keyExtractor ( item , index ) }
							ItemSeparatorComponent={ () => this.separatorComponentQuick () }
						/>
					</View>


				</Modal>

			</View>
		)
	}

}

const styles = StyleSheet.create({
	wrapper_part_line_input:{
		color:'#666',fontSize:pxToDp(26),height:pxToDp(70),paddingVertical:0,
		borderWidth:0.5,borderColor:'#DFDFDF',flex:1,borderRadius:pxToDp(35),flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:pxToDp(28)
	},
	sld_bottom_common_part:{flex:1,flexDirection:'column',justifyContent:'center',alignItems:'center'},
	sld_bottom_common_part_text:{fontSize:pxToDp(24),fontWeight:'400',color:'#999999',marginTop:pxToDp(28)},

	content: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		backgroundColor: '#EBEBEB',
	},
	bottomBar: {
		height: pxToDp(100),
		width:width,
		flexDirection:'row',
		alignItems:'center',
	},
	divider: {
		width: width,
		height: 1,
		backgroundColor: '#D3D3D3',
	},
	chatContent: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		backgroundColor: '#fafafa',
	},
});
const listItemStyle = StyleSheet.create({
	container: {
		flex: 1,
		width: width,
		flexDirection: 'row',
		padding: 5,
	},
	avatar: {
		width: pxToDp(80),
		height: pxToDp(80),
		borderRadius:pxToDp(10),
	},
	msgContainer: {
		backgroundColor: '#FFFFFF',
		borderRadius: pxToDp(10),
		paddingLeft: pxToDp(25),
		paddingRight: pxToDp(25),
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth:0.5,
		borderColor:'#E5E5E5',
		paddingTop:pxToDp(20),
		paddingBottom:pxToDp(20),
	},
	msgContainerSend: {
		backgroundColor: '#1BAFF9',
		borderRadius: pxToDp(10),
		paddingLeft: pxToDp(25),
		paddingRight: pxToDp(25),
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop:pxToDp(20),
		paddingBottom:pxToDp(20),

	},
	msgText_right: {
		fontSize: pxToDp(28),
		lineHeight: pxToDp(40),
		color:'#333',
		fontWeight:'400'
	},
	msgText_send: {
		fontSize: pxToDp(28),
		lineHeight: pxToDp(40),
		color:'#fff',
		fontWeight:'400'
	},
	containerSend: {
		flex: 1,
		width: width,
		flexDirection: 'row',
		padding: 10,
		justifyContent: 'flex-end',
	},
	time_view:{height:pxToDp(35),flexDirection:'row',justifyContent:'center',alignItems:'center',paddingLeft:pxToDp(25),paddingRight:pxToDp(25),borderRadius:pxToDp(4),backgroundColor:'#DBDBDB',marginTop:pxToDp(50),marginBottom:pxToDp(50)},
	times: {color:'#666666',fontWeight:'400',fontSize:pxToDp(18)},
	emojiIcon: {
		width: pxToDp(30),
		height: pxToDp(30),
	},
});
