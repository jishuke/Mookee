/*
* 地址列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    Dimensions,
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import pxToDp from "../util/pxToDp";
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import CountEmitter from "../util/CountEmitter";

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class AddressList extends Component {

    constructor(props) {

        super(props);
        this.state = {
            title: I18n.t('AddressList.title'),
            isLoading: 0,
            addressList: [],
        }
    }

    componentDidMount() {
        this.getAddressList();
        CountEmitter.addListener('address', () => {
            this.getAddressList();
        });
    }

    componentWillUnmount() {
        //卸载监听
        CountEmitter.removeListener('address', ()=>{});
    }

    // 获取地址列表
    getAddressList() {
        RequestData.postSldData(AppSldUrl + '/index.php?app=address&mod=address_list', {
            key
        }).then(res => {
            this.setState({
                isLoading: 1,
                addressList: res.datas.address_list
            })
        }).catch(error => {
            this.setState({
                isLoading: 1
            })
            ViewUtils.sldErrorToastTip(error);
        })
    }

    del = (id) => {
        let {addressList} = this.state;
        Alert.alert(I18n.t('hint'),I18n.t('AddressList.text1'),[
            {
                text: I18n.t('cancel'),
                onPress: ()=>{

                },
                style: 'cancel'
            },
            {
                text: I18n.t('PerfectInfo.confirm'),
                onPress: ()=>{
                    RequestData.postSldData(AppSldUrl+'/index.php?app=address&mod=address_del',{
                        address_id: id,
                        key
                    }).then(res=>{
                        ViewUtils.sldToastTip(I18n.t('AddressList.text2'));
                        let newAddressList = addressList.filter(el=>el.address_id!=id);
                        this.setState({
                            addressList: newAddressList
                        })
                    }).catch(error=>{
                        ViewUtils.sldErrorToastTip(error);
                    })
                }
            }
        ])

    }

    edit = (id) => {
        this.props.navigation.navigate('AddNewAddress',{name: I18n.t('AddressList.text3'),id: id})
    }

    render() {
        const {title, isLoading, addressList} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>
                <ScrollView style={{height: deviceHeight - 260}}>

                    {addressList.length > 0 && addressList.map(el => (<View key={el.address_id} style={styles.item}>
                        <View style={styles.addr_top}>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={{color: '#333', fontSize: pxToDp(26)}}>{el.true_name}</Text>
                                <Text style={{color: '#333',fontSize: pxToDp(22),paddingLeft: pxToDp(20)}}>{el.mob_phone}</Text>
                            </View>
                            <Text
                                style={{color: '#333333', fontSize: pxToDp(26)}}
                                numberOfLines={2}
                                ellipsizeMode={'tail'}
                            >{el.area_info.replace('/',' ').replace('/',' ')}{el.address}</Text>
                        </View>
                        <View style={styles.addr_bottom}>
                            <TouchableOpacity
                                onPress={() => this.edit(el.address_id)}
                            >
                                <View style={styles.way}>
                                    <Image style={{width: pxToDp(23), height: pxToDp(24), marginRight: pxToDp(12)}}
                                           source={require('../assets/images/edit.png')}/>
                                    <Text style={{color: '#333333', fontSize: pxToDp(24)}}>{I18n.t('AddressList.compile')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.del(el.address_id)}
                            >
                                <View style={styles.way}>
                                    <Image style={{width: pxToDp(23), height: pxToDp(23), marginRight: pxToDp(12)}}
                                           source={require('../assets/images/del.png')}/>
                                    <Text style={{color: '#333333', fontSize: pxToDp(24)}}>{I18n.t('AddressList.delete')}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>))}

                    {addressList.length == 0 && isLoading == 1 && <View style={styles.err}>
                        {ViewUtils.noData2({
                            title: I18n.t('AddressList.text4'),
                            tip: I18n.t('AddressList.text5'),
                            imgSrc: require('../assets/images/address_w.png'),
                            btnTxt: I18n.t('AddressList.addnewaddress'),
                            callback: ()=>{
                                this.props.navigation.navigate('AddNewAddress');
                            }
                        })}
                    </View>}
                </ScrollView>
                <View style={styles.btn}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('AddNewAddress')
                        }}
                    >
                        <Text style={styles.btn_txt}> <Text
                            style={{fontSize: pxToDp(22)}}>+</Text>{I18n.t('AddressList.Addaddress')} </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        marginTop: pxToDp(12),
        backgroundColor: '#FFFFFF',
    },
    addr_top: {
        height: pxToDp(131),
        justifyContent: 'space-around',
        paddingHorizontal: pxToDp(30),
        paddingVertical: pxToDp(15),
    },
    addr_bottom: {
        height: pxToDp(70),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderTopColor: '#E9E9E9',
        borderTopWidth: pxToDp(1),
        borderStyle: 'solid',
        paddingHorizontal: pxToDp(30)
    },
    way: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: pxToDp(30)
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: pxToDp(50),
    },
    btn_txt: {
        width: pxToDp(319),
        height: pxToDp(70),
        color: '#fff',
        backgroundColor: '#FF1A1A',
        fontSize: pxToDp(30),
        borderRadius: pxToDp(4),
        lineHeight: pxToDp(70),
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center'
    },
    err: {
        marginTop: pxToDp(260),
    },
})
