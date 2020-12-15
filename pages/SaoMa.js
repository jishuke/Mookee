/*
* 扫码页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ViewUtils from "../util/ViewUtils";
import GlobalStyles from "../assets/styles/GlobalStyles";
import SldHeader from '../component/SldHeader';
import {I18n} from './../lang/index'
export default class SaoMa extends Component {

    constructor(props){

        super(props);
        this.state={
	        title:I18n.t('SaoMa.title'),
        }
    }
    componentDidMount() {

    }

	onSuccess(e) {
		// ViewUtils.match_saoma_url(e.data,this.props.navigation);
		// Linking.canOpenURL(e.data).then(supported => {
		// 	if(!supported) {
		// 		console.warn('can not handel url' + e.data)
		// 	}else {
		// 	   return Linking.openURL(e.data)
		// 	}
	   // })
		if (e && e.data) {
			const url = e.data
            const urlObj = {};
            const middleStr = url.split('?');
            const paramPairStr = middleStr[1].split('&');
            paramPairStr.forEach((element) => {
                const singleParamStr = element.split('=');
                urlObj[singleParamStr[0]] = singleParamStr[1];
            });
            // console.log('二维码信息：', urlObj)
			if (urlObj.gid) {
                this.props.navigation.navigate('GoodsDetailNew', urlObj)
			} else {
                //未能识别此二维码
                ViewUtils.sldToastTip(I18n.t('SaoMa.error'));
			}
		} else {
			//未能识别此二维码
            ViewUtils.sldToastTip(I18n.t('SaoMa.error'));
		}
	}

	render() {
		const {title} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
				<View style={GlobalStyles.line}/>
				<QRCodeScanner
					onRead={this.onSuccess.bind(this)}
				/>
			</View>

		)
	}
}
