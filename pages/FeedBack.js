/*
* 意见反馈页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,Text,TextInput,Dimensions,TouchableOpacity
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from '../util/pxToDp'
import RequestData from '../RequestData'
import LoadingWait from "../component/LoadingWait";
const {width,height} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class FeedBack extends Component {

    constructor(props){

        super(props);
        this.state={
            title:I18n.t('FeedBack.title'),
            content: '',
            isLoading: 0
        }
    }
    componentDidMount() {
    }

    submit = ()=>{
        let {content} = this.state;
        if(content ==''){
            ViewUtils.sldToastTip(I18n.t('FeedBack.text1'));
            return;
        }
        this.setState({
            isLoading: 1
        })
        RequestData.postSldData(AppSldUrl+'/index.php?app=usercenter&mod=user_feedback',{
            key: key,
            content: content
        }).then(res=>{
            if (res.code == 200) {
                ViewUtils.sldToastTip(res.datas.msg)
                this.setState({
                    content: ''
                })
            } else {
                ViewUtils.sldToastTip(I18n.t('FeedBack.text2'))
            }
            this.setState({
                isLoading: 0
            })
        }).catch(err=>{
            this.setState({
                isLoading: 0
            })
        })
    }

    render() {
        const {title,isLoading,content} = this.state;
        return (
            <View style={[GlobalStyles.sld_container,{backgroundColor: '#f6f6f6'}]}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
	            <View style={{padding: pxToDp(30)}}>
                    <Text style={{color: '#181818',fontSize: pxToDp(28),fontWeight: '300',lineHeight: pxToDp(40)}}>
                        {I18n.t('FeedBack.text3')}...
                    </Text>
                </View>
                <View style={{width: width,height: pxToDp(320),backgroundColor: '#fff'}}>
                    <TextInput
                        style={{fontSize: pxToDp(24),textAlignVertical: 'top',padding: pxToDp(20),height: pxToDp(320),lineHeight: pxToDp(50)}}
                        placeholder={I18n.t('FeedBack.text1')}
                        underlineColorAndroid={'transparent'}
                        multiline={true}
                        onChangeText={text=>{
                            this.setState({
                                content: text
                            })
                        }}
                        value={content}
                    />
                </View>

                <TouchableOpacity
                    onPress={()=>this.submit()}
                >
                    <View style={{marginTop: pxToDp(20),marginHorizontal: pxToDp(20),height: pxToDp(80),alignItems: 'center',justifyContent: 'center',backgroundColor:'#fff'}}>
                        <Text style={{color: '#000',fontSize: pxToDp(26)}}>{I18n.t('FeedBack.submit')}</Text>
                    </View>
                </TouchableOpacity>

                {
                    isLoading==1 ? (
                        <LoadingWait loadingText={I18n.t('FeedBack.thesubmission')} cancel={() => {}}/>
                    ) : (null)
                }

            </View>
        )
    }
}
