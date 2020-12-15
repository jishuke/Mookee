/*
* 个人中心页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	Platform,
	TouchableOpacity,
	DeviceEventEmitter,
	NativeEventEmitter,
    Alert,
    Dimensions
} from 'react-native';
import pxToDp from "../util/pxToDp";
import GlobalStyles from '../assets/styles/GlobalStyles';
import NavigationBar from '../component/NavigationBar';
import ViewUtils from '../util/ViewUtils';
import Modal from 'react-native-modalbox';
import RequestData from "../RequestData";
import LoadingWait from '../component/LoadingWait';
import KBZPayModule from "../util/KBZPayModule";
import {I18n} from './../lang/index'
import PriceUtil from "../util/PriceUtil";
import {vipBalancePayment} from '../api/pushHandApi'
import PasswordInput from "../component/PasswordInput";
import StorageUtil from "../util/StorageUtil";

const KBZPayModuleEmitter = new NativeEventEmitter(KBZPayModule);
const {width} = Dimensions.get('window');

let _this;
export default class PaymentType extends Component {
    constructor(props){
        super(props);
        this.state={
            seleType:'alipay',//默认微信支付方式
            order_sn:'',//对应表里的pay_sn,支付单号
            // order_id:'',//订单id
            type:'',//支付类型,buyheika 为黑卡会员充值
            ava_predeposite:0,//可用余额
            order_info:'',//订单信息
            password:'',//支付密码
	        showWait:false,
	        flag:0,
	        recharge_method:[],//充值方式
            havePayPsd: 1 //是否设置支付密码
        }
        this.kbzPay = this.kbzPay.bind(this)
    }

    canClick = true; //防止重复点击

    componentWillMount(){
        let params = this.props.navigation.state;
        this.getPayMethodList();
        if(typeof(params.params) != 'undefined'){
            if(typeof (params.params.type)!='undefined'){
                this.setState({
                    type:params.params.type,
                });
            }else{
                this.setState({
                    order_sn:params.params.order_sn,
                    order_id:params.params.order_id,
                });
                //获取订单支付金额
                this.getOrderPayMount(params.params.order_sn);
            }
        }
        //获取用户的可用余额
        this.getMyAvailable();
    }

    componentDidMount() {
        const { params } = this.props.navigation.state
        //是否已设置支付密码
        StorageUtil.get('is_pay_pwd_set', (err, res) => {
            if (res) {
                console.log('是否已设置支付密码:', res)
                this.setState({
                    havePayPsd: res.is_pay_pwd_set
                })
            } else {
                console.log('是否已设置支付密码出错!!!', err)
            }
        })

        //kbz支付回调
        this.listener = KBZPayModuleEmitter.addListener(
            'kbzPayCallback',
            (data) => {
                // console.log('kbzPayCallback', data);
                if (data.code == '0'){
                    ViewUtils.sldToastTip(I18n.t('hud.payS'));
                    if (params && params.fromVip) {
                        //vip赠送商品的支付
                        this.endSubmit(true)
                    } else {
                        this.props.navigation.navigate('PaySuccess', {viewType:1});
                    }
                } else {
                    ViewUtils.sldToastTip(I18n.t('hud.payF'));
                }
            }
        );

		if('android' === Platform.OS){
			this.listenerAndroid = DeviceEventEmitter.addListener('kbzPayCallback', (data) => {
		        console.warn('ww:kbzPayCallback', data);
				if (data.code == '0'){
					ViewUtils.sldToastTip(I18n.t('hud.payS'));
					const { params } = this.props.navigation.state
                    if (params && params.fromVip) {
                        //vip赠送商品的支付
                        this.endSubmit(true)
                    } else {
                        this.props.navigation.navigate('PaySuccess', {viewType:1});
                    }
				} else {
					ViewUtils.sldToastTip(I18n.t('hud.payF'));
				}
		    });
		}

		this.listener2 = DeviceEventEmitter.addListener('isPayPsd', () => {
            this.setState({
                havePayPsd: 1
            })
        })
    }

    componentWillUnmount(){
        this.listener && this.listener.remove(); //记得remove哦
        this.listener2 && this.listener2.remove();

        if('android' === Platform.OS){
        		this.listenerAndroid && this.listenerAndroid.remove();
        		this.listenerAndroid = null;
        }
    };


	kbzPay(data) {
		console.log(data);
		KBZPayModule.startPay(data.order_str, data.sign_type, data.order_sign, 'Mookee');
	}

    paySuccess(){
         const { type } = this.state;
        if (type == "buyheika") {
            this.props.navigation.popToTop();
        } else {
	        DeviceEventEmitter.emit('updateOrderList');
            this.props.navigation.replace("OrderList");
        }
    }

    getMyAvailable = () => {
	    RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=getMyAvailable&key='+key)
		    .then(result => {

			      this.setState({
				      ava_predeposite:result.datas.predepoit===''?'0':result.datas.predepoit.replace(',','')
            });
		    })
		    .catch(error => {
			    ViewUtils.sldToastTip(error);
		    })
    }


    //获取可用的支付方式
	getPayMethodList = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=common&mod=getPaymentList&key='+key+'&paytype=product_buy&client=app')
			.then(result => {
				this.setState({
					flag:1
				});
				if(result.state=='200'){
					this.setState({
						recharge_method:result.data
					});
				}
			})
			.catch(error => {
				this.setState({
					flag:1
				});
				ViewUtils.sldErrorToastTip();
			})
    }

	getOrderPayMount = (pay_sn) => {
		RequestData.postSldData(AppSldUrl+'/index.php?app=userorder&mod=getOrderInfoByOrderSn',{key:key, pay_sn:pay_sn})
			.then(result=>{

				this.setState({
					order_info:result.datas.order_info
        });
			})
			.catch(error=>{
				ViewUtils.sldToastTip(error);
			})
  }

    payFail(){
	    DeviceEventEmitter.emit('updateOrderList');
        this.props.navigation.replace('OrderList');
    }
	handleSldVal = (val) => {
		this.setState({
			password:val
		});
	}
    //slodon_选择支付类型事件
    selePayType = (type) => {
	    console.log('选择支付类型事件：', type)
        this.setState({
            seleType:type,
        });
        if(type == 'yue'){
            this.refs.calendarstart.open();
        }
    }

	//关闭弹层，直接跳转到订单列表页面
	closeModal = () => {
		this.refs.calendarstart.close();
	}

    renSldLeftButton(image){
        return <TouchableOpacity
            activeOpacity={1}
            onPress={()=>{
                let navigat = this.props.navigation;
                if(typeof (navigat.state.params.tag) != 'undefined'&&navigat.state.params.tag == 'order'){
                    this.props.navigation.popToTop();
                }else{
                    this.props.navigation.goBack();
                }

            }}>
            <View style={GlobalStyles.topBackBtn}>
                <Image style={GlobalStyles.topBackBtnImg} source={image}></Image>
            </View>
        </TouchableOpacity>;
    }

    setShowWait = (flag) =>{
        this.setState({
            showWait:flag
        });
    }

	//vip余额支付
    endSubmitVIP = () => {
        if(!this.canClick) {
            return
        }
        this.canClick = false

        if(this.state.password == ''){
            this.canClick = true
            ViewUtils.sldToastTip(I18n.t('Login.text8'));
            return
        }

        this.refs.calendarstart.close();
        const { params } = this.props.navigation.state
        this.setShowWait(true);

        //支付vip
        vipBalancePayment({pay_sn: params.push_order_sn, key, pay_type: 'yue', password:this.state.password}).then(res => {
            //console.log('支付vip成功:', JSON.stringify(res))
            this.canClick = true
            this.setShowWait(false);
            if (res.state == '200') {

                //vip赠送商品的支付
                this.endSubmit(true)
            } else {
                ViewUtils.sldToastTip(res.msg);
            }
        }).catch(err => {
            this.canClick = true
            console.log('支付vip失败:', err)
            this.setShowWait(false);
            ViewUtils.sldToastTip(err);
        })
	}

	//商品余额支付
	endSubmit = (fromVip) => {
		if(!this.canClick) {
			return
		}
		this.canClick = false

    	if(!fromVip && this.state.password == ''){
            this.canClick = true
		    ViewUtils.sldToastTip(I18n.t('Login.text8'));
            return
	    }

        this.refs.calendarstart.close();
        this.setShowWait(true);

        //支付商品订单
        RequestData.postSldData(AppSldUrl+'/index.php?app=pay&mod=pay_new_app_predision',{key:key,pay_sn:this.state.order_sn,password:this.state.password,pd_pay:1,rcb_pay:0,payment_code:'predeposit',is_complimentary:fromVip ? 1 : 0})
            .then(result => {
                console.log('余额支付商品成功:', JSON.stringify(result))
                this.canClick = true
                this.setShowWait(false);
                ViewUtils.sldToastTip(result.msg);
                if(result.state == 200){

                    if (fromVip) {
                        DeviceEventEmitter.emit('userCenter');
                        this.props.navigation.pop(3)
                    } else {
                        DeviceEventEmitter.emit('updateOrderList');
                        this.props.navigation.replace("OrderList");
                    }
                }
            })
            .catch(error => {
                this.canClick = true
                console.log('余额支付商品失败:', JSON.stringify(result))
                this.setShowWait(false);
                ViewUtils.sldToastTip(error);
            })
	}

	//kbz支付
    _kbzBy() {
        const { params } = this.props.navigation.state
        const {seleType,order_sn} = this.state;
        this.setShowWait(true);
        let dataParams = {
            payment_code:'kbz',
            key,
            pay_sn: params && params.fromVip ? params.push_order_sn : order_sn,
            type: 'app'
        }
        RequestData.postSldData(AppSldUrl+'/index.php?app=pay&mod=pay_kbz_app', dataParams)
            .then(result => {
                this.setShowWait(false);
                if(result.datas.status == 0){
                    ViewUtils.sldToastTip(result.datas.msg);
                }else{
                    console.warn('ww:kbz:postSldData', result);
                    this.kbzPay(result.datas.result.Response)
                    console.log(seleType,'seleType')
                }
            }).catch(error => {
            this.setShowWait(false);
            ViewUtils.sldToastTip(error);
        })
    }

    //去支付事件
    goPay() {
	    const { params } = this.props.navigation.state
        const {seleType, havePayPsd} = this.state;

	    //余额支付
        if(seleType == 'predeposit'){
          //弹出输入密码框
            if (havePayPsd) {
                this.refs.calendarstart.open();
            } else {
                //去设置支付密码
                Alert.alert(
                    '',
                    I18n.t('PaymentType.text4'),
                    [
                        {text: I18n.t('PaymentType.text5'), onPress: () => {}, style: 'cancel'},
                        {text: I18n.t('PaymentType.text6'), onPress: () => {this.props.navigation.navigate('ChangePayPassword')}},
                    ],
                    { cancelable: false }
                )
            }
        }
        //kbz支付
        else if(seleType == 'kbz'){
            this._kbzBy()
        }
    }

    render() {
        _this = this;
        const { params } = this.props.navigation.state
        const { height } = Dimensions.get('window')
        const {seleType, order_info, ava_predeposite, recharge_method, flag, password} = this.state;
        console.warn('ww:recharge_method', recharge_method, ava_predeposite, order_info.order_amount, (parseInt(ava_predeposite)>= parseInt(order_info.order_amount)));

        //判断余额支付是否可用
        let canPredeposit = true
        if (params && params.fromVip) {
            if (parseFloat(ava_predeposite) < parseFloat(params.vipPrice)) {
                canPredeposit = false
            }
        } else {
            if (parseFloat(ava_predeposite) < parseFloat(order_info.order_amount)) {
                canPredeposit = false
            }
        }

        return (
            <View style={[styles.container]}>
                <NavigationBar statusBar={{ barStyle: "dark-content" }} leftButton={this.state.routeName != "NewScreen" ? this.renSldLeftButton(require("../assets/images/goback.png")) : ""} title={I18n.t('PaymentType.title')} popEnabled={false} style={{ backgroundColor: "#fff" }} />
                <View style={GlobalStyles.line} />
                {
                    this.state.showWait ? (
                        <LoadingWait loadingText={I18n.t('FeedBack.thesubmission')} cancel={() => this.setState({showWait: false})}/>
                    ) : (null)
                }
                <ScrollView>
                    <View style={GlobalStyles.space_shi_separate} />

                    {
                        recharge_method.map((item,index) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={1}
                                    key={item.payment_id}
                                    style={styles.sld_pay_list_item}
                                    onPress={() => {
                                        if (item.payment_code != 'predeposit' || canPredeposit) {
                                            this.selePayType(item.payment_code)
                                        }
                                    }}
                                >
                                    {
                                        ViewUtils.getSldImg(60, 60 , item.payment_code === 'kbz' ? require('../assets/images/pushHand/KBZ_pay.png') : item.payment_code === 'predeposit' && canPredeposit ? require('../assets/images/pushHand/ptb.png') : require('../assets/images/pushHand/ptb_n.png'))
                                    }
                                    {
                                        item.payment_code == 'predeposit' && !canPredeposit &&
                                        <View style={{flexDirection:'column',justifyContent:'center',alignItems:'flex-start',flex:1}}>
                                            <Text
                                                style={[
                                                    styles.sld_pay_item_center_up_text, GlobalStyles.sld_global_font
                                                ]}
                                            >
                                                {
                                                    I18n.t('PaymentType.balancepaid')
                                                }
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.sld_pay_item_center_down_text,
                                                    GlobalStyles.sld_global_font
                                                ]}
                                            >
                                                {
                                                    I18n.t('PaymentType.text2')}{PriceUtil.formatPrice(ava_predeposite)
                                            }
                                            </Text>
                                        </View>
                                    }
                                    {
                                        item.payment_code != 'predeposit' || canPredeposit ?
                                        <Text
                                            style={styles.sld_item_text}
                                        >
                                            {
                                                item.payment_code==='predeposit'?I18n.t('PaymentType.balancepaid'):item.payment_name
                                            }
                                        </Text> : null
                                    }
                                    {
                                        item.payment_code != 'predeposit' || canPredeposit ?
                                        <View style={styles.sld_item_sele_view}>
                                            {
                                                ViewUtils.getSldImg ( 40 , 40 , item.payment_code == seleType ? require("../assets/images/paysele.png") : require("../assets/images/paynosele.png") )
                                            }
                                        </View> : null
                                    }
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        (flag==1&&recharge_method.length==0)&&ViewUtils.SldEmptyTip(require('../assets/images/emptysldcollect.png'),I18n.t('PaymentType.text3'))
                    }
                </ScrollView>
                {/*确定*/}
                {
                    flag == 1 && recharge_method.length > 0 &&
                    <TouchableOpacity
                        style={[styles.sld_submit_button, {bottom: Platform.OS === 'ios' && (height === 812 || height === 896) ? 34 : 0}]}
                        activeOpacity={1}
                        onPress={() => this.goPay()}
                    >
                        <Text style={styles.sld_submit_button_text}>
                            {I18n.t('ok')}
                        </Text>
                    </TouchableOpacity>
                }
                {/*输入支付密码弹框*/}
                <Modal
                    style={styles.sld_yue_modal}
                    backdropPressToClose={false}
                    entry='bottom'
                    position='bottom'
                    coverScreen={true}
                    swipeToClose={false}
                    ref={"calendarstart"}>

                    <View style={styles.sld_yue_modal_main}>
                        <TouchableOpacity
                            style={styles.sld_yue_modal_close_wrap}
                            activeOpacity={1}
                            onPress={() => this.closeModal()}
                        >
                            <Image style={styles.sld_yue_modal_close_img} source={require("../assets/images/close_window.png")}/>
                        </TouchableOpacity>


                        <View style={styles.sld_yue_modal_pay_wrap}>
                            <Text style={[GlobalStyles.sld_global_font,styles.wrapper_part_text]}>{I18n.t('PreSalePay.payment_code')}：</Text>
                            {/*支付密码输入框*/}
                            <PasswordInput
                                style={{marginTop:35, marginHorizontal:20, height: width*0.12, borderColor: '#CCCBCE'}}
                                autoFocus={true}
                                value={password}
                                callBack={text => {
                                    this.handleSldVal(text)
                                }}
                            />
                        </View>
                    </View>
                    {/*提交*/}
                    <TouchableOpacity
                        style={[styles.sld_submit_button, {bottom: 0}]}
                        activeOpacity={1}
                        onPress={() => {
                            let reg = /^[0-9]*$/
                            if (!reg.test(password)) {
                                ViewUtils.sldToastTip(I18n.t('ChangePayPassword.text2'));
                                this.setState({password: ''})
                                return
                            }
                            if (params && params.fromVip) {
                                this.endSubmitVIP()
                            } else {
                                this.endSubmit()
                            }
                        }}
                    >
                        <Text style={styles.sld_submit_button_text}>{I18n.t('ok')}</Text>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
	sld_pay_list_item:{width:width,height:pxToDp(120),paddingLeft:15,paddingRight:15,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#fff',borderColor:'#e5e5e5',borderBottomWidth:0.5},
	sld_item_text:{fontWeight:'300',fontSize: pxToDp(28),color: "#333",marginLeft: pxToDp(50)},
	sld_item_sele_view:{flexDirection: "row", alignItems: "center", justifyContent: "flex-end",flex:1},

    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        flex: 1
    },
	wrapper_part_text:{
		fontSize:pxToDp(28),color:'#333',fontWeight:'400',marginRight:pxToDp(24)
	},
	wrapper_part_multi_input:{
		color:'#666',fontSize:pxToDp(24),width: pxToDp(410),height:pxToDp(80),
		borderWidth:0.5,borderColor:'#b5b5b5',
		flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:pxToDp(30),paddingTop:pxToDp(10),paddingRight:pxToDp(20)
	},
	sld_submit_button:{
	    position: "absolute",
        left: 0,
        right: 0,
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#e00c1a'
    },
    sld_submit_button_text:{
	    color: "#fff",
        fontSize: pxToDp(38)
    },
	sld_yue_modal:{
		backgroundColor: "#fff",
		position: "absolute",
        left: 0,
        right: 0,
		width: width,
        height: 180,
        zIndex:10,
	},
	sld_yue_modal_main:{flexDirection:'column',width:width,paddingLeft:15,paddingTop:15,paddingRight:15,position:'relative'},
	sld_yue_modal_close_wrap:{position:'absolute',zIndex:2,width:pxToDp(40),height:pxToDp(40),top:pxToDp(10),right:pxToDp(10)},
	sld_yue_modal_close_img:{width:pxToDp(40),height:pxToDp(40)},
	sld_pay_item_center_up_text:{ fontSize: pxToDp(28), color: "#989898", marginLeft: 25 },
	sld_pay_item_center_down_text:{ fontSize: pxToDp(24), color: "#a9a9a9", marginLeft: 25 },
});
