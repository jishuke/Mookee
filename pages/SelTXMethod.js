/*
* 提现方式
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
	Text
} from 'react-native';
import pxToDp from "../util/pxToDp";
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from "../RequestData";

var Dimensions = require('Dimensions');
var {
    height,
    width
} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class SelTXMethod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('SelTXMethod.title'),
            tixian_method: [],//提现方式
            flag: 0
        }
    }

    componentWillMount() {
        if (key) {
            this.getTiXianMethod();
        } else {
            ViewUtils.navDetailPage(this.props.navigation, 'Login');
        }
    }

    //获取可用的提现方式
    getTiXianMethod = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=cash&mod=getCashTypeList&key=' + key)
            .then(result => {
                this.setState({
                    flag: 1
                });
                if (result.state == '200') {
                    this.setState({
                        tixian_method: result.data
                    });
                }
            })
            .catch(error => {
                this.setState({
                    flag: 1
                });
                ViewUtils.sldErrorToastTip(error);
            })
    }

    selePayType = (id) => {
        this.props.navigation.navigate('AddTiXianAccount', {id: id});
    }

    render() {
        const {tixian_method, title, flag} = this.state;
        return <View style={GlobalStyles.sld_container}>
            <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                       left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
            <View style={GlobalStyles.line}/>
            <View style={GlobalStyles.space_shi_separate}/>
            {
                tixian_method.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={1}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: width,
                                height: pxToDp(100),
                                borderBottomWidth: 0.5,
                                borderColor: '#eee',
                                backgroundColor: "#fff",
                                paddingLeft: pxToDp(30)
                            }}
                            onPress={() => this.selePayType(item.id)}>
                            {item.type_name == I18n.t('SelTXMethod.WeChat') && ViewUtils.getSldImg(43, 43, require('../assets/images/weixin.png'))}
                            {item.type_name == I18n.t('SelTXMethod.Alipay') && ViewUtils.getSldImg(43, 43, require('../assets/images/alipay.png'))}
                            {item.type_name == I18n.t('SelTXMethod.bank') && ViewUtils.getSldImg(43, 43, require('../assets/images/yinlian.png'))}
                            {ViewUtils.sldText(item.type_name, '#555555', 32, '300', 30, 0, 0, 0)}
                        </TouchableOpacity>
                    )
                })
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
            {(flag == 1 && tixian_method.length == 0) && ViewUtils.SldEmptyTip(require('../assets/images/emptysldcollect.png'), I18n.t('SelTXMethod.text1'))}
        </View>
    }
}

const styles = StyleSheet.create({
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
