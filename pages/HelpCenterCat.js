/*
* 帮助中心分类页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Image,
    Text, TouchableOpacity, Dimensions
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
import {I18n, LANGUAGE_CHINESE} from './../lang/index'
import StorageUtil from "../util/StorageUtil";


export default class HelpCenterCat extends Component {

    constructor(props) {

        super(props);
        this.state = {
            id: props.navigation.state.params.id,
            title: props.navigation.state.params.name,
            article_list: [],
            isLoading: 0,
            language:1
        }
    }

    componentDidMount() {
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                }, ()=>{
                    this.getDetail(object);
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                }, ()=>{
                    this.getDetail(LANGUAGE_CHINESE);
                });
            }
        });
    }

    getDetail(lang) {
        let {id} = this.state;
        RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=article_list&acid=' + id + '&type=' + lang).then(res => {
            this.setState({
                isLoading: 1
            })
            if (res.datas.status == 1) {
                this.setState({
                    article_list: res.datas.article_list
                })
            }
        }).catch(error => {
            this.setState({
                isLoading: 1
            })
            ViewUtils.sldErrorToastTip(error);
        })
    }

    handleMessage = (datajson) => {
        this.props.navigation.navigate('HelpCenterDetasil', {helpid: datajson.helpid, helptitle: datajson.helptitle});
    }

    render() {
        const {article_list, title, isLoading} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={I18n.t('HelpCenterCat.title')} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>
                <ScrollView style={{height: deviceHeight - 200, marginTop: pxToDp(30), backgroundColor: '#fff'}}>
                    {article_list.length > 0 && article_list.map(el => (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('HelpCenterDetasil', {
                                    id: el.id,
                                    name: el.article_title
                                });
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
                                <Text style={{fontSize: pxToDp(24)}}>{el.article_title}</Text>
                                <Image style={{width: pxToDp(16), height: pxToDp(29), opacity: 0.3}}
                                       source={require('../assets/images/sld_apply_ven_rarrow.png')}/>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {article_list.length == 0 && isLoading == 1 && (
                        <View style={{marginTop: pxToDp(200)}}>{ViewUtils.noData(I18n.t('HelpCenter.text2'))}</View>)}
                </ScrollView>
            </View>
        )
    }
}
