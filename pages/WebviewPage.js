/*
* webviewpage页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import WebViewCon from '../component/WebViewCon';
import {I18n} from './../lang/index'

export default class WebviewPage extends Component {

    constructor(props){

        super(props);
        this.state={
            collectLists:[],
            sldtoken:'',
            pn:1,
            ishasmore:false,
            refresh:false,
            showLikePart:false,
            title:'',
	          weburl:'',
        }
    }
    componentDidMount() {
	    let params = this.props.navigation.state;
	    if(params.params != 'undefined'){
		    this.setState({
			    title:params.params.title,
			    weburl:params.params.weburl,
		    });
	    }
    }


    //监听h5事件
    handleMessage = (datajson) => {
	    let type = datajson.type;
	    let navigation = this.props.navigation;
			let url = AppSldDomain;
	    switch ( type ) {
		    case "viewfenxiaoteam":
			    url = url+'appview/cwap_grade_detail.html?type='+datajson.value+'&key='+key;
			    navigation.navigate ( 'TeamDetail',{'weburl':url,'title':I18n.t('WebviewPage.team')});
			    break;
		    case "register_submit":
			    key = type;
			    storage.save ( {
				    key : 'key' ,  // 注意:请不要在key中使用_下划线符号!
				    data : type ,
			    } );
			    navigation.popToTop ();
			    break;
		    case "register_agreement":
		        url = url+'appview/sld_register_protocol.html';
			    navigation.navigate ( 'WebviewPage',{'weburl':url,'title':I18n.t('WebviewPage.userregistrationprotocol')});
			    break;
		    default:
			    break;
	    }
    }

    render() {
        const {title,weburl} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
	            <WebViewCon webUrl={weburl} handleMessage={this.handleMessage}/>
            </View>
        )
    }
}
