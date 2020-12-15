/*
* 帮助中心详情页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,WebView,Dimensions
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
var {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n} from './../lang/index'
export default class SldRegisterProtocol extends Component {

    constructor(props){

        super(props);
        this.state={
            title:I18n.t('SldRegisterProtocol.title'),
            content: ''
        }
    }
    componentWillMount() {
        this.getDetail();
    }

    getDetail(){
        let {id} = this.state;
        RequestData.getSldData(AppSldUrl+'/index.php?app=login&mod=getSldRegProtocol').then(res=>{
            this.setState({
                content: res.doc_content
            })
        }).catch(error=>{
            ViewUtils.sldErrorToastTip(error);
        })
    }


    render() {
        const {title,content} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
                <WebView
                    style={ { flex : 1 } }
                    scalesPageToFit={ true }
                    showsVerticalScrollIndicator={ false }
                    source={ { html : content , baseUrl : '' } }
                    automaticallyAdjustContentInsets={ true }
                    javaScriptEnabled={ true }
                />
            </View>
        )
    }
}
