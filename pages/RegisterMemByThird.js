/*
* 登录页面
* @slodon
* */
import React, {Component} from 'react';
import {
  View,
} from "react-native";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from "../assets/styles/GlobalStyles";
import WebViewCon from '../component/WebViewCon';
import api from '../util/api';
import {I18n} from './../lang/index'
// 导入Dimensions库
var Dimensions = require('Dimensions');
export default class RegisterMemByThird extends Component {

    constructor(props){
        super(props);
	    this.state={
		    title:I18n.t('RegisterMemByThird.complement'),
	    };
    }

    componentWillMount() {
			this.getThirdInfo();
    }

	getThirdInfo = () => {
	}


	handleMessage = (datajson) => {
		if(datajson.type=='tip'){
			ViewUtils.sldToastTip(datajson.tipmsg);
		}else if(datajson.type=='regLogin'){
			storage.save({
				key: 'key',  // 注意:请不要在key中使用_下划线符号!
				data: datajson.key,
			});
			key = datajson.key;
			this.props.navigation.popToTop();
		}else{
			this.props.navigation.navigate('BindAccount');
			// ViewUtils.goDetailPageNew(this.props.navigation,datajson);
		}
	}



    render() {
	    const {title} = this.state;
	    return (
		    <View style={GlobalStyles.sld_container}>
			    <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
			    <View style={GlobalStyles.line}/>
			    <WebViewCon isinit={true} initData={authInfo} webUrl={api.sld_complete_account} handleMessage={this.handleMessage}/>
		    </View>
	    )
    }
}

