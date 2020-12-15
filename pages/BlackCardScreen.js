import React, {Component} from 'react';

import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from '../component/NavigationBar';
import pxToDp from "../util/pxToDp";
import GlobalStyles from "../assets/styles/GlobalStyles";
import RequestData from "../RequestData";
import ViewUtils from '../util/ViewUtils';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import {I18n} from './../lang/index'
const mydata = [
    {
        label: I18n.t('BlackCardScreen.purchasing'),
        icon: require("./blackicon/1.png")
    },
    {
        label: I18n.t('BlackCardScreen.BlackCard'),
        icon: require("./blackicon/2.png")
    },
    {
        label: I18n.t('BlackCardScreen.priority'),
        icon: require("./blackicon/3.png")
    },
    {
        label: I18n.t('BlackCardScreen.hifi'),
        icon: require("./blackicon/4.png")
    },
    {
        label: I18n.t('BlackCardScreen.Birthdaygiftbag'),
        icon: require("./blackicon/5.png")
    },
    {
        label: I18n.t('BlackCardScreen.yuancoupon'),
        icon: require("./blackicon/6.png")
    },
    {
        label: I18n.t('BlackCardScreen.Membersday'),
        icon: require("./blackicon/7.png")
    },
    {
        label: I18n.t('BlackCardScreen.integral'),
        icon: require("./blackicon/8.png")
    },
    {
        label: I18n.t('BlackCardScreen.rebate'),
        icon: require("./blackicon/9.png")
    },
    {
        label: I18n.t('BlackCardScreen.VIPspecialline'),
        icon: require("./blackicon/10.png")
    },
    {
        label: I18n.t('BlackCardScreen.Lightningrefund'),
        icon: require("./blackicon/11.png")
    },
    {
        label: I18n.t('BlackCardScreen.Affinitycard'),
        icon: require("./blackicon/12.png")
    },

];


export default class BlackCardScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            memberInfo: {},//用户信息
        }
    }

    componentWillMount() {
        if(key){
            this.getMemInfo(key);
        }
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", payload => {
            if(key){
                this.getMemInfo(key);
            }
        });
    };
    /*
    * 在组件销毁的时候要将其移除
    * */
    componentWillUnmount(){
        // DeviceEventEmitter.remove();
    };
    //获取用户的信息
    getMemInfo = (key) => {
        RequestData.postSldData(
            AppSldUrl + "/index.php?app=usercenter&mod=memberInfo",
            { key: key }
        )
            .then(result => {
                if (result.datas.error) {
	                ViewUtils.sldToastTip(result.datas.error);
                    this.props.navigation.navigate('Login');
                } else {
                    this.setState({
                        memberInfo: result.datas.member_info
                    });
                }
            })
            .catch(error => {
	            ViewUtils.sldToastTip(error);
            });
    }

    //点击立即购入或续费,购卡和续费使用同一个接口，购卡需做用户检测
    _pressbuy = (isBuyBlack) => {
        if(key){
            this.props.navigation.navigate('PaymentType', {type: 'buyheika'});
        }else{
            this.props.navigation.navigate('Login');
        }
    }
    //跳转黑卡会员详情
    _pressItem = (item, index) => {
        this.props.navigation.navigate('BlackDetail', {num: index});
    }

    renSldLeftButton(image) {
        return <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                this.props.navigation.goBack();
            }}>
            <View style={GlobalStyles.topBackBtn}>
                <Image style={GlobalStyles.topBackBtnImg} source={image}></Image>
            </View>
        </TouchableOpacity>;
    }

    _renderItem(item, index) {
        return (
            <TouchableWithoutFeedback onPress={() => this._pressItem(item, index)}>
                <View style={styles.smallItem}>
                    <Image source={item.icon} style={styles.smallIcon}/>
                    <Text style={styles.smallLabel}>{item.label}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {



        const {memberInfo} = this.state;
        const isBuyBlack = memberInfo.member_plus=='1' ? true : false;
        const endTime = memberInfo.plus_end_time_str?memberInfo.plus_end_time_str:null;
        return (
            <View>
                <NavigationBar
                    statusBar={{barStyle: 'default'}}
                    leftButton={this.renSldLeftButton(require('../assets/images/goback.png'))}
                    title={I18n.t('BlackCardScreen.Member')}
                    popEnabled={false}
                    style={{backgroundColor: '#fff'}}
                />
                <Image source={require('./black.jpg')}
                       style={{width: screenWidth, height: screenHeight, paddingTop: 64}}/>
                <FlatList
                    style={{
                        position: 'absolute',
                        left: 30,
                        top: 164,
                    }}
                    data={mydata}
                    renderItem={({item, index}) => this._renderItem(item, index)}
                    keyExtractor={item => item.label}
                    numColumns={3}
                />
                {isBuyBlack &&(<Text style={{color:'#fff2c5',fontSize:12,position:'absolute',left:(screenWidth/2-45),bottom:200}}>{I18n.t('BlackCardScreen.text1')}{endTime}</Text>)}

                <View style={{
                    position: 'absolute',
                    left: 25,
                    bottom: 74,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{flexDirection: 'column',}}>
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: '#9f9166',
                            height: 50,
                            width: screenWidth - 50,
                            borderRadius: 50,
                            justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: 7
                        }}>
                            {!isBuyBlack ? (
                                <Text style={{color: 'white', fontSize: 18, marginLeft: pxToDp(120),}}>{I18n.t('BlackCardScreen.Yuanyear')}</Text>
                            ) : (<View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'center'}}>
                                <Text style={{fontSize: 14, marginLeft: pxToDp(56)}}>{endTime}{I18n.t('BlackCardScreen.expire')}</Text>
                            </View>)}


                            <TouchableWithoutFeedback onPress={() => this._pressbuy(isBuyBlack)}>
                                <View style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#ffe7a5',
                                    height: 50,
                                    width: (screenWidth - 50) / 2,
                                    borderRadius: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        color: '#181818',
                                        fontSize: 18,
                                        marginRight: 10
                                    }}>{!isBuyBlack ? I18n.t('BlackCardScreen.purchase') : I18n.t('BlackCardScreen.renewal')}</Text>
                                    <Image source={require('./arrow_right.png')} style={{width: 10, height: 15}}/>

                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            this.props.navigation.navigate('BlackProtocol');
                        }}>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={[styles.agreement,]}>{I18n.t('BlackCardScreen.useragreement')}</Text>
                        </View>
                        </TouchableOpacity>
                    </View>

                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
        agreement: {
            color: '#7b7b7b',
            fontSize: 11,
        },
        smallIcon: {
            width: 30,
            height: 30

        },
        smallLabel: {
            fontSize: 12,
            color: '#fff2c5',
            marginTop: 10
        },
        smallItem: {
            justifyContent: 'center',
            alignItems: 'center',
            width: (screenWidth - 60) / 3,
            marginBottom: 25,

        }
    }
);
