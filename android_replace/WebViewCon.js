/*
* 封装的webview页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View , Image ,
	StyleSheet , WebView , Dimensions , DeviceInfo , Platform
} from "react-native";
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
const {width,height} = Dimensions.get('window');
export default class WebViewCon extends Component {

    constructor(props){
      super(props);
	    this.state = {
		    webUrl:this.props.webUrl,//url
		    loadImg: typeof (this.props.loadImg)!='undefined'?this.props.loadImg:require('../assets/images/loading.gif'),//加载的loading图
		    refName:typeof (this.props.refName)!='undefined'?this.props.refName:'webView',//webview 属性名
		    refresh:0,
		    routeName:typeof(this.props.routeName)!='undefined'?this.props.routeName:''
	    }
    }

    componentDidMount() {

    }

	componentWillReceiveProps(props){
		if(props.refresh>this.state.refresh){
			this.setState({
				webUrl:props.webUrl
			});
			this.refs.webView.reload();
		}
		if(typeof (this.props.isinit)!='undefined'&&this.props.isinit){
			this.refs.webView.postMessage(123254546);
		}

	}

	//json数据
	handleMessage = (e) => {

		let datajson = JSON.parse(e.nativeEvent.data);
      this.props.handleMessage(datajson);
  }

    render() {
		let {webUrl,loadImg,refName,routeName} = this.state;

		//上面webUrl传值会为空 
		let url = this.props.webUrl
        return (
	        <View  style={{width:width,height:routeName=='Vendor'?height-(Platform.OS === 'ios' ?0:25):(height-(Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated?79:64): 75)),backgroundColor:'#fff'}}>
	        <WebView
		        ref={refName}
		        onMessage={(e)=>this.handleMessage(e)}
		        style={[styles.webView,{bottom: routeName=='CartScreen'?50:0,marginTop:routeName=='CartScreen'?50:0,}]}
		        source={{uri:url}}
		        startInLoadingState={true}
		        renderLoading={() => {
			        return <View style={styles.webviewLoading}>
				        <Image resizeMode='contain' style={styles.webviewLoadingImg} source={loadImg}/>
			        </View>
		        }}
	        />
		        <View style={GlobalStyles.iphoneXbottomheight} />
	        </View>
        )
    }
}
const styles = StyleSheet.create({
	webView:{
		backgroundColor:"#0000",
		left: 0,
		right: 0,
	},
	webviewLoading:{flexDirection:'column',justifyContent:'center',alignItems:'center',height:height-80},
	webviewLoadingImg:{width:pxToDp(60),height:pxToDp(60)},
});
