/*
* 我要充值页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View , TextInput , Text , StyleSheet
} from 'react-native';
import pxToDp from '../util/pxToDp';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
// 导入Dimensions库
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');
import {I18n} from './../lang/index'
export default class Recharge extends Component {

    constructor(props){
        super(props);
        this.state={
	        title:I18n.t('Recharge.title'),
	        cz_amount:'',//充值金额
        }
    }
    componentWillMount() {
	    if(!key){
		    ViewUtils.navDetailPage(this.props.navigation,'Login');
	    }
    }


	handleSldVal = (val) => {
		this.setState({
			cz_amount:val
		});
	}

	//充值事件
	recharge = () => {
			const {cz_amount} = this.state;
			if(cz_amount == ''){
				ViewUtils.sldToastTip(I18n.t('Recharge.text1'));
			}else{
				this.props.navigation.navigate('SelReChargeMethod',{pdr_amount:cz_amount});
			}
	}

	render() {
	    const {title} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
	            <View style={GlobalStyles.space_shi_separate} />

	            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',height:pxToDp(100),backgroundColor:'#fff',paddingLeft:pxToDp(30)}}>
		            <Text style={{color:'#353535',fontSize:pxToDp(32),fontWeight:'300'}}>{I18n.t('Recharge.rechargeamount')}</Text>
		            <TextInput
			            style={[styles.wrapper_part_line_input, GlobalStyles.sld_global_font]}
			            underlineColorAndroid={'transparent'}
			            autoCapitalize='none'
			            autoFocus={true}
			            returnKeyType='default'
			            keyboardType='numeric'
			            enablesReturnKeyAutomatically={true}
			            onChangeText={(text) =>this.handleSldVal(text)}
			            placeholder=''
		            ></TextInput>
	            </View>
	            {ViewUtils.sldButton(()=>this.recharge(),710,100,'#ffb80f',8,32,'#fff',I18n.t('Recharge.recharge'),20,30)}

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
