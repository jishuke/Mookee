/*
 * 帮助中心详情页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, WebView, Dimensions
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';

var {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');
export default class HelpCenterDetasil extends Component{

	constructor(props){

		super(props);
		this.state = {
			id: props.navigation.state.params.id,
			title: props.navigation.state.params.name,//文章标题
			content: ''
		}
	}

	componentWillMount(){
		this.getDetail();
	}

	getDetail(){
		let {id} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=article_detail&id=' + id).then(res => {
			this.setState({
				content: res.datas.article_detail.article_content
			})
		}).catch(error => {
			ViewUtils.sldErrorToastTip(error);
		})
	}


	render(){
		const {title, content} = this.state;
		let imgStyle = "<style> img{ max-width:100%; height:auto;} </style>";
		const htmlContent = '<!DOCTYPE html><html><body>' +
			'<head>' +
			'<meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">' +
			'</head>' +
			`${ content }` +
			'<script>' +
			'window.οnlοad=function(){' +
			'var height = document.body.clientHeight;' +
			'window.location.hash = "#" + height;document["title"] = height;};' +
			'function _onclick(data) {WebViewBridge.send(data);}' +
			'</script>' +
			'</body></html>';

		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ GlobalStyles.line }/>
				<WebView
					style={ {flex: 1} }
					scalesPageToFit={ true }
					showsVerticalScrollIndicator={ false }
					source={ {html: imgStyle + htmlContent, baseUrl: ''} }
					automaticallyAdjustContentInsets={ true }
					javaScriptEnabled={ true }
				/>
			</View>
		)
	}
}
