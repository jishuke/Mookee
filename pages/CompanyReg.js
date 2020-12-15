/*
* 入驻申请
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    ImageBackground,
    Modal,
    WebView
} from 'react-native';
import pxToDp from "../util/pxToDp";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";

var Dimensions = require('Dimensions');
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

const no_agree = require('../assets/images/sld_agree_agreement.png');
const has_agree = require('../assets/images/sld_agreed_agreement.png');
import {I18n} from './../lang/index'


export default class CompanyReg extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('StartApply.title'),
            flag: true,
            modalVisible: false,
            content: '',
        }
    }

    componentDidMount() {
        // this.enterinFlag();
    }

    // 是否同意协议
    enterinFlag() {
        storage.load({
            key: 'enterinflag',
            autoSync: false,
            syncInBackground: true,
        }).then(res => {
            this.setState({
                flag: res
            })
        }).catch(err => {
            this.setState({
                flag: false
            })
        })
    }

    // 同意协议
    argument() {
        let {flag} = this.state;
        this.setState({
            flag: !flag
        });
    }

    //同意协议
    next = () => {
        let {flag} = this.state;
        if (!flag) {
	        ViewUtils.sldToastTip(I18n.t('CompanyReg.text1'));
	        return;
        }
        storage.save({
            key: 'enterinflag',
            data: flag
        })
        this.props.navigation.navigate('CompanyStep1')
    }

    //获取协议
    show = () => {
        if(this.state.content==''){
            RequestData.getSldData(AppSldUrl+'/index.php?app=enterin&mod=getDocOfEnterin&key='+ key +'&reapply=0').then(res=>{
                if(res.code==200){
                    this.setState({
                        content: res.datas.agreement
                    })
                }
            })
        }
        this.setState({
            modalVisible: true
        })
    }

    render() {
        const {title, flag,content} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            {/*{ViewUtils.setSldAndroidStatusBar(true,'#fff','default',true,true)}*/}
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                <ImageBackground
                    style={{width: deviceWidth, flex: 1}}
                    source={require('../assets/images/sld_bg.png')}
                >
                    <TouchableOpacity
                        style={[styles.btn, {
                            backgroundColor: flag == true ? '#FCF02A' : '#f0f0f0',
                        }]}
                        activeOpacity={1}
                        onPress={() => this.next()}
                    >
                        <Text style={{fontSize: pxToDp(40), color: flag == true ? '#C31C32' : '#666'}}>{I18n.t('MyScreen.Immediatelysettled')}</Text>
                    </TouchableOpacity>

                    <View
                        style={styles.xy}
                    >
                        <TouchableOpacity
                            style={styles.check}
                            activeOpacity={1}
                            onPress={() => this.argument()}
                        >
                            <Image style={{width:pxToDp(22),height:pxToDp(22)}} source={flag == true ?has_agree:no_agree}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{color: '#fff', fontSize: pxToDp(28)}}
                            activeOpacity={1}
                            onPress={() => this.show()}
                        >
                            <Text style={{color:'#fff'}}>{I18n.t('CompanyReg.the_agreement')}</Text>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>

                <Modal
                    style={styles.modalStyle}
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <WebView
                        style={ { flex : 1 ,padding: pxToDp(60),} }
                        scalesPageToFit={ true }
                        showsVerticalScrollIndicator={ false }
                        source={ { html : content , baseUrl : '' } }
                        automaticallyAdjustContentInsets={ true }
                        javaScriptEnabled={ true }
                    />
                    <TouchableOpacity
                        style={styles.close}
                        activeOpacity={1}
                        onPress={()=>{
                            this.setState({
                                modalVisible: false
                            })
                        }}
                    >
                        <Image
                            style={{width: pxToDp(30),height: pxToDp(30)}}
                            resizeMode={'contain'}
                            source={require('../assets/images/close_window.png')}
                        />
                    </TouchableOpacity>
                    <Image/>
                </Modal>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    close:{
        position: 'absolute',
        top: pxToDp(30),
        right: pxToDp(30),
        width: pxToDp(60),
        height: pxToDp(60),
        padding: pxToDp(15),
    },
    modalStyle:{
        position: 'absolute',
        top: pxToDp(30),
        left: pxToDp(30),
        width: deviceWidth-pxToDp(60),
        height: deviceHeight-pxToDp(150),
        backgroundColor: '#fff',
        borderRadius: pxToDp(30),
        padding:pxToDp(50)
    },
    btn: {
        position: 'absolute',
        left: pxToDp(77),
        bottom: pxToDp(140),
        width: deviceWidth - pxToDp(154),
        height: pxToDp(103),
        borderRadius: pxToDp(8),
        alignItems: 'center',
        justifyContent: 'center'
    },
    xy: {
        position: 'absolute',
        left: 0,
        bottom: pxToDp(60),
        flexDirection: 'row',
        width: deviceWidth,
        alignItems: 'center',
        justifyContent: 'center',
    },
    check: {
        width: pxToDp(28),
        height: pxToDp(28),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight:pxToDp(15)
    }
})
