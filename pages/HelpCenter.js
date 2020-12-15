/*
* 帮助中心列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity, Dimensions
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'

var {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n} from './../lang/index'
export default class HelpCenter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('HelpCenter.help'),
            helpList: [],
            isloading: 0
        }

    }

    componentDidMount() {
        this.getHelpList();
    }

    getHelpList() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=article_help').then(res => {
            this.setState({
                isloading: 1
            })
            if (res.datas.status == 1) {
                this.setState({
                    helpList: res.datas.article_list_class
                })
            } else {

            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
            this.setState({
                isloading: 1
            })
        })
    }

    handleMessage = (datajson) => {
        this.props.navigation.navigate('HelpCenterCat', {i: datajson.i, n: datajson.n});
    }

    render() {
        const {title, helpList, isloading} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>
                {/*<WebViewCon webUrl={api.sld_help_list} handleMessage={this.handleMessage}/>*/}
                <ScrollView style={{height: deviceHeight - 200, marginTop: pxToDp(30), backgroundColor: '#fff'}}>
                    {helpList.length > 0 && (helpList.map(el => (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('HelpCenterCat', {id: el.acid, name: el.ac_name});
                            }}
                        >
                            <View style={{
                                paddingHorizontal: pxToDp(30),
                                borderBottomColor: '#efefef',
                                borderBottomWidth: pxToDp(0.5),
                                borderStyle: 'solid',
                                height: pxToDp(90),
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{fontSize: pxToDp(24)}}>{el.ac_name==='帮助中心'?I18n.t('HelpCenter.help'):el.ac_name}</Text>
                                <Image style={{width: pxToDp(16), height: pxToDp(29), opacity: 0.3}}
                                       source={require('../assets/images/sld_apply_ven_rarrow.png')}/>
                            </View>
                        </TouchableOpacity>
                    )))}
                    {isloading == 1 && helpList.length == 0 && (
                        <View style={{marginTop: pxToDp(200)}}>{ViewUtils.noData(I18n.t('HelpCenter.text2'))}</View>)}
                </ScrollView>
            </View>
        )
    }
}
