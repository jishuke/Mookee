/*
* 消息中心页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,Text,Image,TouchableOpacity,DeviceEventEmitter
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from '../util/pxToDp';
import RequestData from '../RequestData';
import {I18n} from './../lang/index'
const MsgTypeList = [
    {
        name: 'MyMessage.money',
        imgSrc: require('../assets/images/fahuo.png'),
        type: 'fahuo'
    },
    {
        name: 'MyMessage.payment',
        imgSrc: require('../assets/images/fukuan.png'),
        type: 'fukuan'
    },
    {
        name: 'MyMessage.balance',
        imgSrc: require('../assets/images/yue2.png'),
        type: 'yue'
    },
    {
        name: 'MyMessage.salesreturn',
        imgSrc: require('../assets/images/tuikuan.png'),
        type: 'tui'
    },
    {
        name: 'MyMessage.news',
        imgSrc: require('../assets/images/siteMsg.png'),
        type: 'sys'
    }
]

export default class MyMessage extends Component {

    constructor(props){

        super(props);
	    this.state={
		    title:I18n.t('MyMessage.title'),
            readNum: {}
	    }
    }
    componentDidMount() {
        this.getEverySystemNewNum();
        this.lister = DeviceEventEmitter.addListener('msgList',()=>{
            this.getEverySystemNewNum();
        })
    }

    componentWillUnmount() {
        this.lister.remove();
    }

    // 获取未读消息数量
    getEverySystemNewNum(){
        RequestData.getSldData(AppSldUrl+'/index.php?app=usercenter&mod=getEverySystemNewNum&key='+key).then(res=>{
            if(res.state=='ok'){
                this.setState({
                    readNum: res.data
                })
            }
        })
    }


    render() {
	    const {title,readNum} = this.state;
	    console.warn('ww:MsgTypeList', MsgTypeList);
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>

                {MsgTypeList.map(el=><TouchableOpacity
                    style={{
                        marginTop: pxToDp(10),
                        backgroundColor: '#fff',
                        paddingHorizontal: pxToDp(30),
                        height: pxToDp(120),
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    onPress={()=>{
                        this.props.navigation.navigate('MyMessageDetail',{messagetip: el.type})
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Image style={{width: pxToDp(60),height: pxToDp(60),marginRight: pxToDp(40)}} source={el.imgSrc}/>
                        {readNum[el.type]*1>0 &&  <View
                            style={{
                                position: 'absolute',
                                top: pxToDp(-6),
                                left: pxToDp(30),
                                minWidth: pxToDp(30),
                                height: pxToDp(30),
                                backgroundColor: '#FF1515',
                                borderRadius: pxToDp(15),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{color: '#fff',fontSize: pxToDp(20)}}>{readNum[el.type]}</Text>
                        </View>}

                        <Text style={{color: '#333',fontSize: pxToDp(28)}}>{I18n.t(el.name)}</Text>
                    </View>

                    <Image source={require('../assets/images/arrow_right_b.png')} style={{width: pxToDp(26),height: pxToDp(26),opacity: 0.4}}/>
                </TouchableOpacity>)}
            </View>
        )
    }
}
