/*
* 添加提现账号页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View , TextInput , Text , StyleSheet
} from 'react-native';
import pxToDp from '../util/pxToDp';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import ViewUtils from '../util/ViewUtils';
import StorageUtil from '../util/StorageUtil';
import CountEmitter from '../util/CountEmitter';

// 导入Dimensions库
var Dimensions = require('Dimensions');
import {I18n} from './../lang/index'
import Utils from "../util/Utils";
export default class AddTiXianAccount extends Component {

    constructor(props){
        super(props);
        this.state={
	        title:I18n.t('AddTiXianAccount.title'),
	        id:props.navigation.state.params.id,
	        name:'',
	        bank_name:'',
	        account:'',
        }
    }
    componentWillMount() {
	    if(!key){
		    ViewUtils.navDetailPage(this.props.navigation,'Login');
	    }
    }

	handleSldVal = (val,type) => {
    	if(type == 'name'){
		    this.setState({
			    name:val
		    });
	    }else if(type == 'bank_name'){
		    this.setState({
			    bank_name:val
		    });
	    }else if(type == 'account'){
			const newText = val.replace(/[^\d]+/, '');
		    this.setState({
			    account:newText
		    });
	    }
	}

	_checkBankAccount(account) {
    	if (Utils.isNum(account) && ((account.length === 11 && account.startsWith('09')) || account.length === 16)) {
			return true
		} else {
    		return false
		}
	}

	//添加账号
	addAccount = () => {
    	const {id,name,bank_name,account} = this.state;
    	if(name == '' || account=='' || (id == 2 && bank_name == '')){
    		ViewUtils.sldToastTip(I18n.t('AddTiXianAccount.text1'));
    		return
    	}

        let reg_eng = /^[a-zA-Z ]*$/
        if (!reg_eng.test(name)) {
            ViewUtils.sldToastTip(I18n.t('AddTiXianAccount.text3'));
            return
        }

        if (!reg_eng.test(bank_name)) {
            ViewUtils.sldToastTip(I18n.t('AddTiXianAccount.text6'));
            return
        }

        let reg_account = /^[0-9]*$/
        if (account.length !== 16 && !reg_account.test(account)) {
            ViewUtils.sldToastTip(I18n.t('AddTiXianAccount.text7'));
            return
        }

        RequestData.postSldData(AppSldUrl+'/index.php?app=cash&mod=addCashAccount&key='+key,{ac_name:name,ac_account: account,ac_type: id,ac_bank_name: bank_name})
            .then(result=>{
                if(result.state == 200){
                    ViewUtils.sldToastTip(I18n.t('AddTiXianAccount.text2'));
                    let seltxaccount = {};
                    seltxaccount.tixian_method = (id==1?I18n.t('SelTXMethod.Alipay'):(id==2?I18n.t('SelTXMethod.bank'):I18n.t('AddTiXianAccount.WeChat')));
                    seltxaccount.tixian_acount = account;
                    seltxaccount.tixian_id = result.data.account_id;
                    StorageUtil.set('seltxaccount', seltxaccount, () => {
                        //更新选中的历史账号
                        CountEmitter.emit('updateSelAccount');
                        this.props.navigation.pop(2);
                    });
                }else {
                    ViewUtils.sldToastTip(result.msg);
                }
            })
            .catch(error=>{
                ViewUtils.sldErrorToastTip(error);
            })
	}

	render() {
	    const {title,id} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
	            <View style={GlobalStyles.space_shi_separate} />

	            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:pxToDp(100),backgroundColor:'#fff',paddingLeft:pxToDp(30)}}>
	            <Text style={{color:'#353535',fontSize:pxToDp(32),fontWeight:'300'}}>{I18n.t('AddTiXianAccount.name')}</Text>
	            <TextInput
		            style={[styles.wrapper_part_line_input, GlobalStyles.sld_global_font]}
		            underlineColorAndroid={'transparent'}
		            autoCapitalize='none'
		            autoFocus={true}
		            returnKeyType='default'
		            keyboardType='default'
					maxLength={100}
		            enablesReturnKeyAutomatically={true}
		            onChangeText={(text) =>this.handleSldVal(text,'name')}
		            placeholder={I18n.t('AddTiXianAccount.text3')}
	            />
            </View>
	            {
                    id == 2 &&
                    <View>
                        <View style={GlobalStyles.line}/>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:pxToDp(100),backgroundColor:'#fff',paddingLeft:pxToDp(30)}}>
                            <Text style={{color:'#353535',fontSize:pxToDp(32),fontWeight:'300'}}>{I18n.t('AddTiXianAccount.bankname')}</Text>
                            <TextInput
                                style={[styles.wrapper_part_line_input, GlobalStyles.sld_global_font]}
                                underlineColorAndroid={'transparent'}
                                autoCapitalize='none'
                                autoFocus={true}
                                returnKeyType='default'
                                keyboardType='default'
                                enablesReturnKeyAutomatically={true}
                                onChangeText={(text) =>this.handleSldVal(text,'bank_name')}
                                placeholder={I18n.t('AddTiXianAccount.text4')}
                            />
                        </View>
					</View>
				}
	            <View style={GlobalStyles.line}/>
	            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:pxToDp(100),backgroundColor:'#fff',paddingLeft:pxToDp(30)}}>
		            <Text style={{color:'#353535',fontSize:pxToDp(32),fontWeight:'300'}}>{I18n.t('AddTiXianAccount.accountnumber')}</Text>
		            <TextInput
			            style={[styles.wrapper_part_line_input, GlobalStyles.sld_global_font]}
			            underlineColorAndroid={'transparent'}
						maxLength={16}
			            autoCapitalize='none'
			            autoFocus={true}
			            returnKeyType='default'
						keyboardType='numeric'
			            enablesReturnKeyAutomatically={true}
			            onChangeText={(text) =>this.handleSldVal(text,'account')}
			            placeholder={I18n.t('AddTiXianAccount.text5')}
		            />
	            </View>
	            {
                    ViewUtils.sldButton(() => this.addAccount(),710,100,'#ffb80f',8,32,'#fff',I18n.t('ok'),20,30)
				}
            </View>
        )
    }
}
const styles = StyleSheet.create({
	wrapper_part_line_input:{
		color:'#666',fontSize:pxToDp(28),width:pxToDp(500),padding:pxToDp(20),height:pxToDp(70),
		borderWidth:0,
	},
});
