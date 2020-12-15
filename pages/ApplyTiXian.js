/*
* 申请提现页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View,
	TextInput,
	Text,
	StyleSheet,
	ScrollView,
} from 'react-native';
import pxToDp from '../util/pxToDp';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import ViewUtils from '../util/ViewUtils';
import StorageUtil from '../util/StorageUtil';
import CountEmitter from '../util/CountEmitter';
import {I18n, LANGUAGE_CHINESE} from './../lang/index'
import Utils from "../util/Utils";

export default class ApplyTiXian extends Component {

    constructor(props){
        super(props);
        this.state={
	        title:I18n.t('ApplyTiXian.title'),
	        ava_predeposite:'',
	        his_account:{},//历史账号数据
	        low_limit:0,//最低提现金额
	        tixian_amount: '',
	        tx_fee_rate: 0,//提现手续费比例
	        tx_fee: 0.00,//提现手续费,保留两位小数
	        canClick: true,//立即提现按钮是否可以点击
			language: 1
        }

        this.rate = '';
        this.deposite = '';
    }

    canClick = true

    componentDidMount() {
		if(key){
			this.getMemAvaPre();
			this.getHistoryAccount();
			this.getTXFee();
		}else{
			ViewUtils.navDetailPage(this.props.navigation,'Login');
		}
		//监听更新历史缓存
		CountEmitter.addListener('updateSelAccount', () => {
			//获取缓存中的提现账号
			StorageUtil.get('seltxaccount', (error, object) => {
				if (!error && object && object.tixian_id) {
					this.setState({
						his_account:object
					});
				}
			});
		});

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


	componentWillUnmount() {
		//卸载监听
		CountEmitter.removeListener('updateSelAccount', ()=>{});
	}

	//获取用户余额
	getMemAvaPre = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=getMyAvailable&key='+key)
			.then(result => {
                this.deposite = result.datas.predepoit;

                if (this.rate === '') {
					this.setState({
						ava_predeposite: this.deposite,
                        low_limit: result.datas.cash_min_money_num //获取系统设置的最低提现金额
					});
				} else {
                    this.setState({
                        ava_predeposite: (this.deposite / (1 + this.rate * 1.0 / 100)).toFixed(2),
                        low_limit: result.datas.cash_min_money_num //获取系统设置的最低提现金额
                    });
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//获取历史提现账号
	getHistoryAccount = () => {
    	const {his_account} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=cash&mod=getCashAccountList&key='+key)
			.then(result => {
				if(result.state=='200'&&result.data.list.length>0){
					//缓存不存在，去第一个历史账号，否则取缓存
					if(!(his_account.tixian_id>0)){
						let data = {};
						let data_info = result.data.list[0];
						data.tixian_method = data_info.account_type==2?data_info.account_bank_name:data_info.account_type_name;
						data.tixian_acount = data_info.account_user;
						data.tixian_id = data_info.id;
						this.setState({
							his_account:data
						});
					}
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//获取系统设置的提现手续费比例
	getTXFee = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=getCashoutPaymentFeePercentagean')
			.then(result => {
				if(result.state == 200){
				    this.rate = result.data.cashout_payment_fee_percentage ? result.data.cashout_payment_fee_percentage : 0

                    if (this.deposite === '') {
                        this.setState({
                            tx_fee_rate: parseFloat(this.rate).toFixed(2)
                        });
                    } else {
                        this.setState({
                            tx_fee_rate: this.rate,
                            ava_predeposite: (this.deposite / (1 + parseFloat(this.rate) / 100)).toFixed(2)
                        });
                    }
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	handleSldVal = (val) => {
    	let {low_limit,tixian_amount,ava_predeposite} = this.state;

    	// console.log('最低提现金额:', low_limit)
		if (val) {
            if (!ViewUtils.isRealNum(val)) {
                return
            }

            if (parseFloat(ava_predeposite) < parseFloat(low_limit)) {
                return
            }
		}

        this.setState({
            tixian_amount: val ? parseInt(val) + '' : val
        });

        this.calTxFee(val);
	}

	//计算提现手续费  val提现金额
	calTxFee = (val) => {
    	let {tx_fee,tx_fee_rate} = this.state;
    	// console.log('计算提现手续费', tx_fee, ', ', tx_fee_rate, ', ', val)
		tx_fee = ((Math.round(parseFloat(val) > 0 ? (parseFloat(val) * tx_fee_rate) : 0))/100).toFixed(2);
		this.setState({tx_fee});
	}

	//提现
	applyTiXian = () => {
    	if(this.state.canClick){
    		this.setState({canClick:false});
		    const {tixian_amount, low_limit, ava_predeposite, his_account, tx_fee, language} = this.state;
		    if(tixian_amount == ''){
			    ViewUtils.sldToastTip(I18n.t('ApplyTiXian.text1'));
			    this.setState({canClick:true});
		    }
		    else if(low_limit*1 > tixian_amount*1){
			    ViewUtils.sldToastTip(I18n.t('ApplyTiXian.text2') + low_limit);
			    this.setState({canClick:true});
		    }
		    else if(tixian_amount*1 > ava_predeposite*1){
			    ViewUtils.sldToastTip(I18n.t('ApplyTiXian.text3'));
			    this.setState({canClick:true});
		    }
		    else if(!(his_account.tixian_id > 0)){
			    ViewUtils.sldToastTip(I18n.t('ApplyTiXian.text4'));
			    this.setState({canClick:true});
		    }
		    else{
			    RequestData.postSldData(AppSldUrl + '/index.php?app=cash&mod=cashApply&lang_type=' + language + '&key=' + key, {
				    pdc_amount: tixian_amount,
				    account_id: his_account.tixian_id,
				    pdc_payment_fee: tx_fee
			    }).then(result => {
                    this.setState({canClick:true});
			        // console.log('提现res:', JSON.stringify(result))
                    ViewUtils.sldToastTip(result.msg);
                    if(result.state == 200){
                        CountEmitter.emit('updateTiXianList');
                        this.props.navigation.pop(1);
                    }
			    }).catch(error => {
                    ViewUtils.sldErrorToastTip(error);
                    this.setState({canClick:true});
			    })
		    }
	    }
  }

	render() {
	    const {title,ava_predeposite,tixian_amount,his_account,tx_fee_rate,tx_fee,canClick} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
				<ScrollView style={{flex: 1}} keyboardDismissMode={'on-drag'}>
					<View style={[styles.tx_tip,GlobalStyles.flex_com_row_start]}>
						<Text style={styles.tx_tip_text}>{I18n.t('ApplyTiXian.text5')}{tx_fee_rate}%</Text>
					</View>
					{
					    ViewUtils.sldTextColorBetween(I18n.t('ApplyTiXian.text6'),'Ks'+ava_predeposite,'#353535','#FC496D',32,'300',30,0,30,0,'#fff',1,100)
					}
					<View style={GlobalStyles.line}/>
					<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:pxToDp(100),backgroundColor:'#fff',paddingLeft:pxToDp(30)}}>
						<Text style={{color:'#353535',fontSize:pxToDp(32),fontWeight:'300'}}>{I18n.t('ApplyTiXian.withdrawal2')}</Text>
						{/*输入提现金额*/}
						<TextInput
							ref={'tx_amount'}
							style={[styles.wrapper_part_line_input, GlobalStyles.sld_global_font]}
							underlineColorAndroid={'transparent'}
							autoCapitalize='none'
							autoFocus={true}
							returnKeyType='default'
							keyboardType='numeric'
							enablesReturnKeyAutomatically={true}
							value={tixian_amount}
							onChangeText={(text) => this.handleSldVal(text)}
							placeholder={I18n.t('ApplyTiXian.text1')}
						/>
					</View>

					<View style={[styles.tx_tip,GlobalStyles.flex_com_row_end,{backgroundColor:'#F5F5F5',paddingRight: 15}]}>
						<Text style={[styles.tx_tip_text,{color:'#999'}]}>{I18n.t('ApplyTiXian.text9')}：</Text>
						<Text style={[styles.tx_tip_text,{color:'#FC496D'}]}>{tx_fee}Ks</Text>
					</View>
					<View style={[styles.tx_tip,GlobalStyles.flex_com_row_start,{backgroundColor:'#fff'}]}>
						<Text style={[styles.tx_tip_text,{color:'#999'}]}>{I18n.t('ApplyTiXian.Cashaccount')}</Text>
					</View>
					{
					    his_account.tixian_id > 0 &&
                        <View>
                            {ViewUtils.getSldSingleItem(()=>ViewUtils.navDetailPage(this.props.navigation,'TiXianHistoryAccount'), his_account.tixian_method, Utils.formatAccount(his_account.tixian_acount), require("../assets/images/sld_arrow_right.png"), 50)}
                            <View style={GlobalStyles.line}/>
                        </View>
					}
					{/*添加提现账号*/}
					{
						ViewUtils.getSldSingleItem(()=>ViewUtils.navDetailPage(this.props.navigation,'SelTXMethod'), I18n.t('ApplyTiXian.text8'), "", require("../assets/images/sld_arrow_right.png"), 50)
					}
					{/*本次提现*/}
					{
						ViewUtils.sldButtonSetClick(()=>this.applyTiXian(),710,100,'#ffb80f',8,32,'#fff',I18n.t('ApplyTiXian.withdrawal'),canClick,20,30)
					}
					<View style={styles.title}>
						<Text style={{color: '#666'}}>{I18n.t('SelTXMethod.helpTitle')}</Text>
					</View>

					<View style={styles.msgContainer}>
						<Text style={styles.msgTitle}>{I18n.t('SelTXMethod.helpMsg1')}</Text>
						<Text style={styles.msgTitle}>{I18n.t('SelTXMethod.helpMsg2')}</Text>
						<Text style={styles.msgTitle}>{I18n.t('SelTXMethod.helpMsg3')}</Text>
						<Text style={styles.msgTitle}>{I18n.t('SelTXMethod.helpMsg4')}</Text>
					</View>
					<View style={GlobalStyles.line}/>
				</ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
	wrapper_part_line_input:{
		color:'#666',
		fontSize:pxToDp(28),
		width:pxToDp(240),
		padding:pxToDp(20),
		height:pxToDp(70),
		borderWidth:0,
		paddingVertical: 0,
		justifyContent: 'flex-end',
	},
	tx_tip:{
		width:'100%',
		height:pxToDp(60),
		backgroundColor: '#FFE9E9',
		paddingLeft:15,
	},
	tx_tip_text:{
		color:'#E0A2A2',
		fontSize:pxToDp(22),
	},
	title: {
		height: 50,
		backgroundColor: '#fff',
		justifyContent: 'center',
		paddingStart: 20,
		marginTop: 30,
		borderTopWidth: 1,
		borderBottomWidth: 2,
		borderColor: '#EEE'
	},
	msgContainer: {
		backgroundColor: '#FFF',
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	msgTitle: {
		color: '#666',
		paddingBottom: 10,
	}
});
