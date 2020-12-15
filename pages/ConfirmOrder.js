/*
 * 确认订单页面
 * @slodon
 * */
import React , { Component , Fragment } from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	DeviceEventEmitter,
	TextInput,
	Alert,
	ScrollView,
    Platform,
    Dimensions
} from 'react-native';
import RequestData from "../RequestData";
import SldHeader from '../component/SldHeader';
import CountEmitter from "../util/CountEmitter";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import ComStyle from "../assets/styles/ComStyle";
import {I18n, LANGUAGE_CHINESE} from './../lang/index'
import PriceUtil from '../util/PriceUtil'
import {rechargeVIP} from '../api/pushHandApi'
import StorageUtil from "../util/StorageUtil";

export default class ConfirmOrder extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			is_use_point: false,//是否使用积分，默认不使用
			allow_submit_order: false,//是否允许提交订单
			offpay: 0,//是否支持货到付款，默认否
			zengzhi: 0,//是否支持增值税发票，默认否
			title: I18n.t('LdjConfirmOrder.title'),//页面标题
			pay_code: "online",//支付方式：online 在线付款，offline 货到付款
			type: typeof (props.navigation.state.params.type) != 'undefined' ? 1 : 0,//是否再次购买
			is_bundling: typeof (props.navigation.state.params.bl_id) != 'undefined' ? 1 : 0,//是否优惠套装
			bl_id: typeof (props.navigation.state.params.bl_id) != 'undefined' ? props.navigation.state.params.bl_id : '',//优惠套装id
			suite: typeof (props.navigation.state.params.suite) != 'undefined' ? props.navigation.state.params.suite : '',//推荐组合，推荐组合的主商品gid
			checked: typeof (props.navigation.state.params.checked) != 'undefined' ? props.navigation.state.params.checked : '',//选中的推荐组合的信息：sele_gid+'|'+sele_num，多个用逗号分割
			pin: typeof (props.navigation.state.params.pin) != 'undefined' ? props.navigation.state.params.pin : '',
			team_id: typeof (props.navigation.state.params.team_id) != 'undefined' ? props.navigation.state.params.team_id : '',
			if_cart: props.navigation.state.params.if_cart != undefined ? props.navigation.state.params.if_cart : 0,//是否来源于购物车
			cart_id: props.navigation.state.params.if_cart == 1 ? props.navigation.state.params.cart_id : props.navigation.state.params.gid + '|' + props.navigation.state.params.buy_num,//是否来源于购物车
			invoice_con: '',//展示的发票内容
			offpay_hash: '',
			offpay_hash_batch: '',
			voucher: '',//优惠券
			pd_pay: '',//预存款
			password: '',//支付密码
			fcode: "",
			rcb_pay: "",
			rpt: "",
			payment_code: "",//支付方式
			message: {},//留言
			show_area_info: {},//页面展示的地址
			gid: typeof (props.navigation.state.params.gid) != 'undefined' ? props.navigation.state.params.gid : '',
			change_address_str: '',
			pay_sn: '',
			heji: '',
			page: 10,
			pn: 1,
			hasmore: true,
			pt_bili: 0,//积分转换货币比例
			pt_max: 0, //积分转换货币 最大比例
			pt_point: 0, //用户当前积分
			old_heji: 0,
			store_goods_info: [],//店铺商品信息
			totalPrice: 0,//提交订单的总金额
			invoice_type: '',//不需要发票
			invoice_info: '',//发票内容
			invoice_id: '',//发票id，为空表示不需要发票
			mem_input_point: 0,//会用使用的积分数
			pt_diyong: 0,//积分抵扣的金额
			all_data: '',//下单页面的全部数据，主要用于红包
			vred:'',//使用的店铺优惠券id数组,
			language: 1
		}

	}

	freight_hash = '';
	heji = '';
	invoice_type = '';
	vat_hash = '';
	offpay_hash = '';
	offpay_hash_batch = '';
	store_cart_list = {};//店铺_商品信息
	cur_operate_vid='';//当前操作的店铺id
	canClick = true //防止请求时重复点击

	componentWillMount () {
		if ( !key ) {
			this.props.navigation.navigate ( 'Login' );
		}
		this.getConfirmInfo ();//获取下单信息

		this.emitter =
			DeviceEventEmitter.addListener ( 'updatePayMethod' , ( param ) => {
				this.setState ( param );
			} );

		//新增收货地址
		this.emitter_add_address =
			DeviceEventEmitter.addListener ( 'updateAddAddress' , ( ) => {
				this.heji == 0;
				this.getConfirmInfo();
			} );

		//更新发票信息
		this.emitter_invoice =
			DeviceEventEmitter.addListener ( 'updateInvoice' , ( param ) => {
				this.setState ( { invoice_id : param.inv_id,invoice_info:param.invoice_info} );
			} );

		//选择收货地址
		this.emitter_receive_address =
			DeviceEventEmitter.addListener ( 'updateAddress' , ( param ) => {
				this.setState ( {
					show_area_info : param.address_info
				},()=>{
					//更新运费
					this.getYunFeeByAddress (param.address_info);
				} );

			} );
		//更新优惠券信息
		this.emitter_voucher =
			DeviceEventEmitter.addListener ( 'updateVoucher' , ( param ) => {
				let sele_red_info = param.red_info;
				if(this.cur_operate_vid==''){
					//平台优惠券
					const {all_data} = this.state;
					let select_red_id = '';
					let select_red_info = '';
					if(sele_red_info != ''){
						select_red_id = sele_red_info.id;
						select_red_info = sele_red_info;
					}
					all_data.sele_red_id = select_red_id;
					all_data.sele_red_info = select_red_info;
					this.setState({
						all_data:all_data
					},()=>{
						this.calTotalHeji();
						this.getEndData();
					});

				}else{
					//店铺优惠券
					let vid = this.cur_operate_vid;
					let select_red_id = '';
					let select_red_info = '';
					if(sele_red_info != ''){
						select_red_id = sele_red_info.id;
						select_red_info = sele_red_info;
					}
					this.store_cart_list[vid].sele_red_id = select_red_id;
					this.store_cart_list[vid].sele_red_info = select_red_info;
					this.calTotalHeji();
					this.getEndData();
				}
			} );
	}

	componentDidMount () {
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
	}

	// 页面卸载时，删除事件监听
	componentWillUnmount () {
		this.emitter.remove ()
		this.emitter_receive_address.remove ()
		this.emitter_invoice.remove ()
		this.emitter_add_address.remove ()
		this.emitter_voucher.remove ()
	}

	//获取下单信息
	getConfirmInfo = () => {
		let { if_cart , cart_id , pin , is_bundling , bl_id , suite , checked , type , gid , offpay , zengzhi , store_goods_info , pt_bili , pt_max , pt_point , invoice_con ,show_area_info, language } = this.state
		RequestData.postSldData ( AppSldUrl + '/index.php?app=buy&mod=confirm' , {
			key : key ,
			cart_id : cart_id ,
			ifcart : if_cart ,
			pin : pin ,
			is_bundling : is_bundling ,
			bl_id : bl_id ,
			suite : suite ,
			checked : checked ,
			type : type==1?'buyagain':type ,
            lang_type: language
		} ).then ( result => {
            console.log('获取下单信息:', result)
				if ( result.datas.error ) {
					ViewUtils.sldToastTip ( result.datas.error );
					return false
				}

				if ( gid == '' ) {
					gid = [];
					let arr = result.datas.store_cart_list;
					let arrkey = Object.keys ( arr );
					arrkey = arrkey[ 0 ];
					arr = arr[ arrkey ].goods_list;
					for ( let i in arr ) {
						gid.push ( arr[ i ].gid );
					}
				}

				//是否支付货到付款
				offpay = result.datas.ifshow_offpay;

				//如果支持增值税发票的话  增加增值税发票的选项  多个商品 全部支持才显示增值税发票选项
				if ( result.datas.vat_deny != 1 ) {
					zengzhi = 1;
				}

				store_goods_info = result.datas.store_cart_list;

				//积分抵现
				if ( result.datas.points_max_use > 0 && result.datas.member_points > 0 ) {
					pt_bili = result.datas.points_purpose_rebate;//积分兑换比例
					pt_max = result.datas.points_max_use;//允许使用积分
					pt_point = result.datas.member_points;//用户积分
				}


				if ( typeof result.datas.inv_info.inv_id != "undefined" ) {
					this.setState({
						invoice_id:result.datas.inv_info.inv_id,
						invoice_info:result.datas.inv_info.content,
					});
				}

				invoice_con = result.datas.inv_info.content;//发票内容

				this.vat_hash = result.datas.vat_hash;
				this.freight_hash = result.datas.freight_hash;
				if (ViewUtils.isEmptyObject(show_area_info)&&result.datas.address_info.length!=0) {
					show_area_info = result.datas.address_info;
				}

				if(result.datas.red==null||!ViewUtils.isEmptyObject(result.datas.red)){
					let tmp_red = [];
					for(let i in result.datas.red){
						tmp_red.push(result.datas.red[i]);
					}
					result.datas.red = tmp_red;
				}
				this.setState ( {
					offpay : offpay ,
					gid : gid ,
					zengzhi : zengzhi ,
					pt_bili : pt_bili ,
					pt_max : pt_max ,
					pt_point : pt_point ,
					invoice_con : invoice_con ,
					show_area_info,
					all_data:result.datas,
				} );
				//活动优惠
				for ( let t in result.datas.store_cart_list ) {
					let storetotal_money = result.datas.store_cart_list[ t ].store_goods_total * 1;
					//如果有满送活动，如果满足了条件的话  就用商品总价减去满送的价格
					if ( result.datas.store_cart_list[ t ].store_mansong_rule_list != null ) {
						//满减信息
						result.datas.store_cart_list[ t ].tip = I18n.t('ConfirmOrder.Fullispresent') + result.datas.store_cart_list[ t ].store_mansong_rule_list.price + I18n.t('GoodsDetailNew.subtract') + result.datas.store_cart_list[ t ].store_mansong_rule_list.discount * 1
						storetotal_money = storetotal_money * 1 - parseFloat ( result.datas.store_cart_list[ t ].store_mansong_rule_list.discount );
					}
					result.datas.store_cart_list[ t ].storetotal_money = storetotal_money.toFixed ( 2 );//店铺总额
					result.datas.store_cart_list[ t ].end_total_amount = storetotal_money.toFixed ( 2 );//店铺总额
					if ( result.datas.store_cart_list[ t ].freight == 0 ) {
						// $("#yunfei_tip" + t).html(result.datas.store_cart_list[t].freight_message);//页面展示包邮信息
					}
					this.store_cart_list = result.datas.store_cart_list;//便于数据同步，以店铺id为键的数据
				}
				if(!ViewUtils.isEmptyObject(show_area_info)){
					this.getYunFeeByAddress(show_area_info);
				}else{
					this.calTotalHeji();
					this.getEndData()
				}

			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}

	//提交订单
	submitOrder = () => {
		let {pay_code,allow_submit_order} = this.state;
		if(allow_submit_order){
			if(pay_code == 'offline'){
				//货到付款
				Alert.alert(
					'',
					I18n.t('ConfirmOrder.text1'),
					[
						{
							text:I18n.t('ok'), onPress:(() => this.submit())
						},
						{
							text:I18n.t('cancel'),onPress:(()=>{}),style:'cancle'
						}
					]
				);
			} else {
				this.submit()
			}
		}
	}


	//处理店铺留言
	handlePayMessage = (vid,msg) => {
		let {message} = this.state;
		message[vid] = msg;
		this.setState({message});
	}

	//购买VIP
	buyVip = (key, refeCode, memberId) => {
		if (!this.canClick) {
			return
		}
		this.canClick = false
		const params = {
            member_id: memberId,
            refe_code: refeCode,
            key
		}
		// console.log('购买VIP参数:', params)
		rechargeVIP(params).then(res => {
			console.log('购买VIP成功:', JSON.stringify(res))
            this.canClick = true
			if (res.code === 200) {
                //提交赠送商品订单
                const pushOrderId = res.datas.pdr_id //id
				const pushOrderSn = res.datas.pdr_sn //单号
				this.submit(pushOrderId, pushOrderSn)
			}
		}).catch(err => {
            this.canClick = true
            console.log('购买VIP失败:', err)
		})
	}

	//提交订单接口
	submit = (pushOrderId, pushOrderSn) => {
		if (!this.canClick) {
			console.log('提交订单不能点')
			return
		}
		this.canClick = false

		const { params } = this.props.navigation.state
		let {if_cart,cart_id,pay_code,voucher,pd_pay,fcode,rcb_pay,rpt,pin,team_id,is_bundling,bl_id,suite,checked,type,message,invoice_id,show_area_info,all_data,vred,is_use_point,mem_input_point} = this.state;
		let message_info = '';
		let red = 0;//平台优惠券id，字符串格式
		if(all_data.sele_red_id!=undefined&&all_data.sele_red_id>0){
			red = all_data.sele_red_id;
		}
		//留言信息
		for(let i in message){
			message_info += i + "|" + message[i] + ","
		}

		// console.log('vip的id来了吗:', pushOrderId)

		let post_data = {
			key: key,
			ifcart: if_cart,
			cart_id: cart_id,
			address_id: show_area_info.address_id,
			vat_hash: this.vat_hash,
			offpay_hash: this.offpay_hash,
			offpay_hash_batch: this.offpay_hash_batch,
			pay_name: pay_code,
			invoice_id: '',
			voucher: voucher,
			pd_pay: pd_pay,
			password: '',
			fcode: fcode,
			rcb_pay: rcb_pay,
			rpt: rpt,
			pay_message: message_info,
			dian_id : '',
			pin : pin,
			team_id : team_id,
			points_pay : is_use_point?1:0,
			use_points : mem_input_point,
			red: red,
			vred: vred,
			spreader : '',
			is_bundling : is_bundling,
			bl_id : bl_id,
			suite:suite,
			checked:checked,
			markgid:'',
			type:type==1?'buyagain':type,
            push_order_id: pushOrderId || '', //vip
			refe_code: params && params.refeCode || ''
		};

		RequestData.postSldData(AppSldUrl + '/index.php?app=buy&mod=submitorder', post_data)
			.then(result => {
                this.canClick = true
				if (result.code === 200) {
					if (result.datas.error) {
                        ViewUtils.sldToastTip(result.datas.error)
						return
					}
                    //通知购物车刷新
                    !pushOrderId && CountEmitter.emit('cart');
                    //如果是参团的话，通知商品详情更新页面
                    if(pin!=''){
                        DeviceEventEmitter.emit('updateGoodsDetail',team_id);
                    }
                    if(result.datas.payment_code == "offline"){
                        DeviceEventEmitter.emit('updateOrderList');
                        this.props.navigation.replace('OrderList');//货到付款直接到订单列表
                        return
                    }else{
                        if(result.datas.total == 0){
                            DeviceEventEmitter.emit('updateOrderList');
                            this.props.navigation.replace('OrderList');//直接到订单列表
                        }else{
                            //去支付页面
                            if (pushOrderId) {
                                console.log('vip支付:', pushOrderSn)
                                this.props.navigation.replace('PaymentType',{order_sn: result.datas.pay_sn, push_order_sn:pushOrderSn, order_id:'', fromVip: true, vipPrice: params.vipPrice});
                            } else {
                            	console.log('普通商品支付:', result.datas.pay_sn)
                                this.props.navigation.replace('PaymentType',{order_sn: result.datas.pay_sn, order_id:''});
                            }
                        }
                    }
				} else {
                    ViewUtils.sldToastTip('Order failed')
				}

			})
			.catch(error => {
                this.canClick = true
                ViewUtils.sldToastTip('Order failed')
			})
	}

	//根据收货地址获取运费信息
	getYunFeeByAddress = (address) => {
		RequestData.postSldData ( AppSldUrl + '/index.php?app=buy&mod=change_address' , {
			key : key ,
			freight_hash : this.freight_hash ,
			city_id : address.city_id ,
			area_id : address.area_id ,
		} )
			.then ( result_address => {
				if ( result_address.datas.state == 'success' ) {
					this.insertHtmlAddress ( address , result_address.datas );
				}
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}

	//将运费计入店铺合集内
	insertHtmlAddress = ( e , a ) => {
		let { allow_submit_order } = this.state;
		if ( a.content ) {
			for ( let i in a.content ) {
				let tmp_yunfei = parseFloat ( a.content[ i ] ).toFixed ( 2 );
				//每个店铺的运费
				this.store_cart_list[ i ].yunfei = tmp_yunfei;//用于页面展示运费
				//如果运费大于0 则需要变动店铺的总价和合计的价格
				if (tmp_yunfei > 0 ) {
					this.store_cart_list[ i ].storetotal_money = ( this.store_cart_list[ i ].store_goods_total * 1 + tmp_yunfei * 1 ).toFixed ( 2 );//店铺合计
					this.store_cart_list[ i ].end_total_amount = this.store_cart_list[ i ].storetotal_money;//本店合计的价格
				}
			}
		}
		this.offpay_hash = a.offpay_hash;
		this.offpay_hash_batch = typeof (a.offpay_hash_batch)!='undefined'?a.offpay_hash_batch:'';

		if ( typeof (a.no_send_tpl_ids)!='undefined'&&( a.no_send_tpl_ids ).join ( ',' ) != '' ) {
			allow_submit_order = false;
			for ( let t = 0 ; t < a.no_send_tpl_ids.length ; t++ ) {
				this.store_cart_list[ i ].showNoFrightTip = I18n.t('ConfirmOrder.text2');
			}
		} else {
			allow_submit_order = true;
		}
		this.calTotalHeji();
		this.getEndData()
		this.setState ( {
			allow_submit_order,
			show_area_info:e,
		} );
	}

	calTotalHeji = () => {
		let vred = [];
		this.heji = 0;
		for ( let i in this.store_cart_list ) {
			let red_value = 0;
			if(this.store_cart_list[i].sele_red_id!=undefined&&this.store_cart_list[i].sele_red_id*1>0){
				red_value = this.store_cart_list[i].sele_red_info.redinfo_money;
				vred.push(this.store_cart_list[i].sele_red_id*1);
			}
			this.store_cart_list[i].end_total_amount = ViewUtils.formatFloat(this.store_cart_list[i].storetotal_money*1-red_value*1,2)<0?0:ViewUtils.formatFloat(this.store_cart_list[i].storetotal_money*1-red_value*1,2);
			this.heji += this.store_cart_list[i].end_total_amount*1;
		}
		this.setState({
			vred:vred.length>0?vred.join(','):''
		});
	}

	getEndData = () => {
		let {totalPrice,old_heji,pt_diyong,all_data} = this.state;
		//重新组装商品数据
		let store_info = [];//店铺商品列表，键值自增
		for ( let i in this.store_cart_list ) {
			store_info.push ( this.store_cart_list[ i ] );
		}
		let s1 = 0;
		if(all_data.sele_red_id!=undefined&&all_data.sele_red_id*1>0){
			s1 = parseFloat(all_data.sele_red_info.redinfo_money)
		}
		let r = this.heji - s1 -parseFloat(pt_diyong);//s1指的是平台优惠券金额
		if ( r <= 0 ) {
			r = 0
		}
		totalPrice = r.toFixed ( 2 );
		if(old_heji == 0){
			old_heji = r.toFixed ( 2 );
		}
		this.setState({
			heji : this.heji ,
			totalPrice : totalPrice ,
			store_goods_info : store_info ,
			old_heji : old_heji ,
		});
	}

	//选择支付方式（线上支付还是货到付款）
	selectMethod = () => {
		let { offpay , pay_code } = this.state;

		this.props.navigation.navigate('SelPayOnOrOff', {sel_method: pay_code, allowOffPay: offpay})

	}


	//选择地址
	sele_address = () => {
		const {show_area_info} = this.state;
		if ( show_area_info.address_id == '' ) {
			//新增地址
			this.props.navigation.navigate('AddNewAddress',{source:'confirm'})
		} else {
			//选择地址
			this.props.navigation.navigate ( 'SeleAddress' , {
				cur_address_id : show_area_info.address_id
			} );
		}
	}

	//发票管理
	seleInvoice = () => {
		this.props.navigation.navigate ( 'SelInvoice' , { invoice_id : this.state.invoice_id } );
	}

	//用户输入积分事件
	mem_inout_point = (text) => {
		if(ViewUtils.isRealNum(text)){
			const {pt_bili,pt_point,pt_max,old_heji} = this.state;
			let mem_max_use = parseInt(pt_point > old_heji/100*pt_max * pt_bili ? old_heji/100*pt_max * pt_bili : pt_point);
			let use_pt = text>mem_max_use?mem_max_use:text;
			this.setState({
				mem_input_point: use_pt+'',
				pt_diyong:Math.floor(use_pt/pt_bili*100)/100,
			},()=>{
				this.calTotalHeji();
				this.getEndData();
			})
		}else{
			this.refs.points_input.clear();
			this.setState({
				mem_input_point: 0,
				pt_diyong:0,
			});
		}

	}

	is_use_point = (val) => {
		let {mem_input_point,pt_diyong} = this.state
		this.setState({
			is_use_point:val,
			mem_input_point:val?mem_input_point:0,
			pt_diyong:val?pt_diyong:0,
		},()=>{
			if(!val){
				this.calTotalHeji();
				this.getEndData();
			}
		})
	}

	//选择优惠券
	seleVoucher = (type,item) => {
		if(type == 'ven'){
			this.cur_operate_vid = item.vid;//用于监听事件
		}else if(type == 'sys'){
			this.cur_operate_vid = '';
		}
		this.props.navigation.navigate('ConfirmVoucher',{red_list:item.red,sele_red_id:item.sele_red_id});
	}

	render () {
		const { height } = Dimensions.get('window')
		const { params } = this.props.navigation.state
		const {title, offpay, pay_code, show_area_info, store_goods_info, totalPrice, allow_submit_order, all_data } = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>
				<ScrollView style={ { flexDirection : 'column' , width : '100%' , flex : 1 } }>
					<TouchableOpacity activeOpacity={ 1 } onPress={ () => this.sele_address () } style={ {
						width : '100%' ,
						height : pxToDp ( 132 ) ,
						backgroundColor : '#fff' ,
						flexDirection : 'row' ,
						justifyContent : 'space-between' ,
						alignItems : 'center' ,
						paddingLeft : 10 ,
						paddingRight : 10
					} }>
						{
							!ViewUtils.isEmptyObject(show_area_info) &&
							<Fragment>
                                <View style={ { flexDirection : 'row' , alignItems : 'flex-end' , flex : 1 } }>
                                    <Image style={ { width : pxToDp ( 19 ) , height : pxToDp ( 27 ) } }
                                           source={ require ( '../assets/images/location_b.png' ) }/>
                                    <View style={ {
                                        flexDirection : 'column' ,
                                        alignItems : 'flex-start' ,
                                        justifyContent : 'center' ,
                                        marginLeft : pxToDp ( 19 ) ,
                                        flex : 1
                                    } }>
                                        <Text style={ {
                                            color : '#333333' ,
                                            fontSize : pxToDp ( 30 )
                                        } }>{ show_area_info.true_name } { show_area_info.mob_phone }</Text>
                                        <Text numberOfLines={ 1 } style={ {
                                            color : '#666666' ,
                                            fontSize : pxToDp ( 24 ) ,
                                            marginTop : pxToDp ( 19 )
                                        } }>{ show_area_info.area_info } { show_area_info.address }</Text>
                                    </View>
                                </View>

                                <View style={ { flexDirection : 'row' , width : pxToDp ( 60 ) } }>
                                    <Text style={ { color : '#B0B0B0' , fontSize : pxToDp ( 20 ) } }>{I18n.t('ConfirmOrder.edit')}</Text>
                                    <Image resizeMode={ 'contain' } tintColor={ '#B0B0B0' }
                                           style={ { width : pxToDp ( 20 ) , height : pxToDp ( 20 ) } }
                                           source={ require ( '../assets/images/arrow_right.png' ) }/>
                                </View>
							</Fragment>
						}
						{
                            ViewUtils.isEmptyObject(show_area_info) &&
                            <TouchableOpacity
                                activeOpacity={ 1 }
                                onPress={ () => this.props.navigation.navigate('AddNewAddress',{source:'confirm'}) }
                                style={ ComStyle.cfo_empty_view }>
                                <Text style={ ComStyle.cfo_empty_text }>{I18n.t('ConfirmOrder.tjdz')}</Text>
                            </TouchableOpacity>
						}

					</TouchableOpacity>
					<Image resizeMode={ 'stretch' } style={ { width : '100%' , height : pxToDp ( 2 ) } }
					       source={ require ( '../assets/images/select_address_bottom.png' ) }/>

					<View style={ GlobalStyles.space_shi_separate }/>
					{/*支付方式*/}
					{
						!(params && params.fromVip) ?
                            <TouchableOpacity
                                activeOpacity={ 1 }
                                onPress={ () => this.selectMethod () }
                                style={ ComStyle.invoice_view }>
                                <Text style={ ComStyle.inv_left_text }>{I18n.t('ConfirmOrder.zhifufangshi')}</Text>
                                <View style={ ComStyle.inv_left_view }>
                                    <Text style={ ComStyle.inv_left_text }>{ pay_code == 'online' ? I18n.t('ConfirmOrder.zaixianfukuan') : I18n.t('SelPayOnOrOff.cash_delivery') }</Text>
                                    {
                                        offpay == 1 &&
										<Image
											resizeMode={ 'contain' }
											tintColor={ '#B0B0B0' }
											style={ { width : pxToDp ( 24 ) , height : pxToDp ( 24 ) } }
											source={ require ( '../assets/images/arrow_right.png' ) }
										/>
                                    }
                                </View>
                            </TouchableOpacity> : null
					}
					{/*选择优惠券*/}
					{
						!(params && params.fromVip) && all_data.red != '' && all_data.red != null && all_data.red.length > 0 &&
                        <Fragment>
                            <View style={ GlobalStyles.space_shi_separate }/>
                            <TouchableOpacity
                                activeOpacity={ 1 } onPress={ () => this.seleVoucher ('sys',all_data) }
                                style={ ComStyle.invoice_view }>
                                <Text style={ ComStyle.inv_left_text }>{I18n.t('ConfirmOrder.Coupon')}</Text>
                                <View style={ ComStyle.inv_left_view }>
                                    <Text style={ ComStyle.inv_left_text }>{ all_data.sele_red_id!=undefined&&all_data.sele_red_id*1>0?all_data.sele_red_info.redinfo_money+I18n.t('ConfirmOrder.Yuancoupon') : I18n.t('ConfirmOrder.nonuse') }</Text>
                                    <Image resizeMode={ 'contain' } tintColor={ '#B0B0B0' }
                                           style={{ width : pxToDp ( 24 ) , height : pxToDp ( 24 ) } }s
                                           source={ require ( '../assets/images/arrow_right.png' ) }/>
                                </View>
                            </TouchableOpacity>
                        </Fragment>
					}

					<View style={ GlobalStyles.space_shi_separate }/>
					<View style={ GlobalStyles.space_shi_separate }/>
					<View style={ {
						flexDirection : 'column' ,
						justifyContent : 'flex-start' ,
						width : '100%' ,
						backgroundColor : '#fff' ,
						paddingLeft : 10 ,
						paddingRight : 10
					} }>
						{ store_goods_info.map ( ( item , index ) => {
							return <Fragment key={ index }>
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={ () => this.props.navigation.navigate('Vendor',{vid:item.vid}) }
									style={ {
										flexDirection : 'row' ,
										justifyContent : 'flex-start' ,
										width : '100%' ,
										height : pxToDp ( 77 ) ,
										alignItems : 'center' ,
										borderBottomWidth : 1 ,
										borderColor : '#E9E9E9'
									} }>
									<Image resizeMode={ 'contain' } style={ { width : pxToDp ( 28 ) , height : pxToDp ( 26 ) } }
									       source={ require ( '../assets/images/shop_icon.png' ) }/>
									<Text style={ {
										color : '#333333' ,
										fontSize : pxToDp ( 28 ) ,
										fontWeight : '400',
										marginLeft:5,
									} }>{ item.store_name }</Text>
								</TouchableOpacity>

								{/*VIP*/}
									{
										params && params.fromVip ?
                                            <View
                                                style={{
                                                    width : '100%' ,
                                                    height : pxToDp ( 178 ) ,
                                                    borderColor : '#E9E9E9' ,
                                                    borderBottomWidth : 1 ,
                                                    flexDirection : 'row' ,
                                                    justifyContent : 'space-between' ,
                                                    alignItems : 'center',
                                                }}
                                            >
                                                <View style={ { flexDirection : 'row' , flex : 1 , alignItems : 'center' } }>
                                                    <Image style={{width : pxToDp (140) , height : pxToDp (140)}}
                                                           resizeMode={'contain'}
                                                           source={require('../assets/images/pushHand/i-4.png')}
                                                    />
                                                    <Text
                                                        numberOfLines={ 2 }
                                                        ellipsizeMode={ 'tail' }
                                                        style={{color : '#333333' , fontSize : pxToDp ( 24 ) , fontWeight : '400' , marginLeft : pxToDp ( 20 ) , width : pxToDp ( 408 ) , lineHeight : pxToDp ( 45 )} }
                                                    >
                                                        Mookee VIP
                                                    </Text>
                                                </View>
                                                <View style={ {
                                                    flexDirection : 'column' ,
                                                    justifyContent : 'center' ,
                                                    alignItems : 'flex-end' ,
                                                    width : pxToDp ( 200 ) ,
                                                    paddingLeft : pxToDp ( 40 )
                                                } }>
                                                    <Text style={ { color : '#333333' , fontSize : pxToDp ( 26 ) , fontWeight : '400' } }>{`ks${params.vipPrice}`}</Text>
                                                    <Text style={ {color : '#999999' , fontSize : pxToDp ( 22 ) , fontWeight : '400' , marginTop : pxToDp ( 23 )} }>x 1</Text>
                                                </View>
                                            </View> : null
									}
								{/*已选择的商品*/}
								{ item.goods_list.map ( ( items , indexs ) => {
									return <TouchableOpacity
										activeOpacity={ 1 }
										onPress={() => {
											if (!(params && params.fromVip)) {
                                                this.props.navigation.navigate('GoodsDetailNew',{gid:items.gid})
                                            }
                                        }}
										key={ indexs }
										style={ {
											width : '100%' ,
											height : pxToDp ( 178 ) ,
											borderColor : '#E9E9E9' ,
											borderBottomWidth : 1 ,
											flexDirection : 'row' ,
											justifyContent : 'space-between' ,
											alignItems : 'center' ,
										} }>
										<View style={ { flexDirection : 'row' , flex : 1 , alignItems : 'center' } }>
											<Image style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) , } } resizeMode={ 'contain' }
											       source={ { uri : items.goods_image_url } }/>
											<Text numberOfLines={ 2 } ellipsizeMode={ 'tail' } style={ {
												color : '#333333' ,
												fontSize : pxToDp ( 24 ) ,
												fontWeight : '400' ,
												marginLeft : pxToDp ( 20 ) ,
												width : pxToDp ( 408 ) ,
												lineHeight : pxToDp ( 45 )
											} }>{items.goods_name}

											</Text>
										</View>
										<View style={ {
											flexDirection : 'column' ,
											justifyContent : 'center' ,
											alignItems : 'flex-end' ,
											width : pxToDp ( 200 ) ,
											paddingLeft : pxToDp ( 40 )
										} }>
											<Text style={ { color : '#333333' , fontSize : pxToDp ( 26 ) , fontWeight : '400' } }>
												{params &&params.fromVip ? 'ks0' : `ks${items.show_price!=undefined?PriceUtil.formatPrice(items.show_price*1):PriceUtil.formatPrice(items.goods_price*1)}`}
											</Text>
											<Text style={ {
												color : '#999999' ,
												fontSize : pxToDp ( 22 ) ,
												fontWeight : '400' ,
												marginTop : pxToDp ( 23 )
											} }>x {params &&params.fromVip ? '1' : items.goods_num}</Text>
										</View>

									</TouchableOpacity>
								} ) }
								{item.red!=null&&item.red.length>0&&
								<Fragment>
									<View style={ GlobalStyles.line }/>
									<TouchableOpacity
										activeOpacity={ 1 } onPress={ () => this.seleVoucher ('ven',item) }
										style={ ComStyle.invoice_view }>
										<Text style={ ComStyle.inv_left_text }>{I18n.t('ConfirmOrder.Coupon')}</Text>
										<View style={ ComStyle.inv_left_view }>
											<Text style={ ComStyle.inv_left_text }>{ item.sele_red_id!=undefined&&item.sele_red_id*1>0?item.sele_red_info.redinfo_money+I18n.t('ConfirmOrder.Yuancoupon') : I18n.t('ConfirmOrder.select') }</Text>
											<Image resizeMode={ 'contain' } tintColor={ '#B0B0B0' }
											       style={ { width : pxToDp ( 24 ) , height : pxToDp ( 24 ) } }
											       source={ require ( '../assets/images/arrow_right.png' ) }/>
										</View>
									</TouchableOpacity>
								</Fragment>
								}

								{/*会员优惠显示*/}
								{item.goods_list[0].grade_discount!=undefined&&
								<Fragment>
									<View style={{flexDirection: 'row', alignItems: 'center', height: pxToDp(89),paddingHorizontal: 10,}}>
										<View style={{
											alignItems: 'center',
											justifyContent: 'center'
										}}>
											<Text ellipsizeMode={'tail'} style={{
												color: '#333333',
												fontSize: pxToDp(24),
												alignItems: 'center',
											}}>
												{I18n.t('ConfirmOrder.specialdiscount')}
											</Text>
										</View>
										<View style={{
											borderColor: '#C9AF8E',
											backgroundColor: '#C9AF8E',
											borderWidth: 1,
											width: pxToDp(120),
											height: pxToDp(30),
											borderRadius: pxToDp(20),
											alignItems: 'center',
											justifyContent: 'center'
										}}>
											<Text style={{
												color: '#000000',
												fontSize: pxToDp(20),
												fontWeight: '300',
												alignItems: 'center',
											}}>{I18n.t('ConfirmOrder.member') + item.goods_list[0].grade_discount + I18n.t('ConfirmOrder.break')}</Text>
										</View>
									</View>
								</Fragment>
								}
								<View style={ GlobalStyles.line }/>
								<View style={ {
									width : '100%' ,
									height : pxToDp ( 89 ) ,
									flexDirection : 'row' ,
									justifyContent : 'flex-start' ,
									alignItems : 'center' ,
									borderBottomWidth : 1 ,
									borderColor : '#E9E9E9',
									paddingHorizontal: 10,
								} }>
									<Text style={ { color : '#333' , fontSize : pxToDp ( 26 ) , fontWeight : '400' } }>{I18n.t('ConfirmOrder.peisongfangshi')} {I18n.t('ConfirmOrder.putongkuaidi')}
										ks{ item.yunfei!=undefined&&item.yunfei!=''?PriceUtil.formatPrice(item.yunfei):0 } { item.freight_message } </Text>
								</View>
								<View style={ {
									width : '100%' ,
									backgroundColor : '#fff' ,
									marginTop : pxToDp ( 20 ) ,
									flexDirection : 'row' ,
									justifyContent : 'center'
								} }>
									<TextInput
										style={ {
											width : pxToDp ( 710 ) ,
											height : pxToDp ( 64 ) ,
											backgroundColor : '#F8F8F8' ,
											borderRadius : pxToDp ( 4 ) ,
											color : '#666' ,
											paddingLeft : pxToDp ( 20 ),
											paddingVertical:0,
										} }
										underlineColorAndroid={ 'transparent' }
										autoCapitalize='none'
										returnKeyType='default'
										keyboardType='default'
										enablesReturnKeyAutomatically={ true }
										onChangeText={ ( text ) => this.handlePayMessage (item.vid,text) }
										placeholder={I18n.t('ConfirmOrder.text3')}
									/>
								</View>
								{/*合计*/}
								<View style={ {
									width : '100%' ,
									backgroundColor : '#fff' ,
									marginTop : pxToDp ( 30 ) ,
									marginBottom : pxToDp ( 30 ) ,
									flexDirection : 'row' ,
									justifyContent : 'flex-end'
								} }>
									<Text style={ { color : '#333333' , fontSize : pxToDp ( 26 ) , fontWeight : '400' } }>{`${I18n.t('ConfirmOrder.Ourtotal')}:`}</Text>
									<Text style={{color : '#FF1919' , fontSize : pxToDp ( 26 ) , fontWeight : '400'}}>
										{params && params.fromVip ? `ks${params.vipPrice}` : `ks${PriceUtil.formatPrice(item.end_total_amount)}`}
									</Text>
									<Text style={ { color : '#333333' , fontSize : pxToDp ( 26 ) , fontWeight : '400' } }></Text>
								</View>
							</Fragment>
						} ) }
					</View>
					{/*VIP购买说明*/}
					{
						params && params.fromVip ?
						<View style={{marginTop: 20, paddingBottom: 30, backgroundColor: '#fff'}}>
							<View style={{height: 44, alignItems: 'center'}}>
								<Text style={{marginLeft:15, fontSize: 16, color: '#666'}}>{I18n.t('ConfirmOrder.text4')}</Text>
							</View>
                            <View style={{marginHorizontal: 0, height:0.5, backgroundColor: '#666'}}/>
							<Text style={{marginTop:10, marginHorizontal:15, fontSize: 14, color: '#666'}}>{I18n.t('ConfirmOrder.text5')}</Text>
                            <Text style={{marginHorizontal:15, fontSize: 14, color: '#666'}}>{I18n.t('ConfirmOrder.text6')}</Text>
						</View> : null
					}
					{
                        Platform.OS === 'ios' && (height === 812 || height === 896) ?
							<View style={{height: 34, backgroundColor: '#fff'}}/> : null
					}
				</ScrollView>
				<View
					style={{
						width: '100%' ,
						height: pxToDp ( 98 ) ,
						backgroundColor: '#fff' ,
						flexDirection: 'row' ,
						alignItems: 'center' ,
						borderTopWidth: 1 ,
						borderColor: '#DADADA'
					}}>
					<View style={{ flex: 1, flexDirection: 'row', justifyContent:'flex-end', alignItems:'center'}}>
						<Text style={{ color: '#333333', fontSize: 14, fontWeight: '400' }}>
                            {I18n.t('ConfirmOrder.Totalamount')}
						</Text>
						{/*总价*/}
						<Text style={{color:'#F5410C', fontSize:14, fontWeight:'400', paddingRight: 20}}>
							{params && params.fromVip ? `ks${PriceUtil.formatPrice(params.vipPrice)}` : `ks${PriceUtil.formatPrice(totalPrice)}`}
						</Text>
					</View>
					{/*提交订单*/}
					<TouchableOpacity
						activeOpacity={ 1 }
						onPress={() => params && params.fromVip ? this.buyVip(params.key, params.refeCode, params.memberId) : this.submitOrder()}
						style={{
							flexDirection: 'row',
							width: 111,
							height: '100%' ,
							backgroundColor: allow_submit_order ? '#F23030' : '#B1B1B1' ,
							justifyContent: 'center' ,
							alignItems: "center"
						}}
					>
						<Text style={{color:'#fff', fontSize:15 , fontWeight: '400'}}>{I18n.t('ConfirmOrder.submitorder')}</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}
