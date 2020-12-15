/*
* 帮助中心列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,Text,Image,StyleSheet
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'
import {I18n} from './../lang/index'

export default class VendorInstro extends Component {

    constructor(props) {

        super(props);
        this.state = {
            title: I18n.t('VendorInstro.store'),
            vid: props.navigation.state.params.vid,
            info: ''
        }

    }

    componentDidMount() {
        this.getStoreInfo();
    }

    // 获取店铺详情
    getStoreInfo() {
        let {vid} = this.state;
        RequestData.getSldData(AppSldUrl + '/index.php?app=store&mod=store_detail&vid=' + vid).then(res => {
            if (res.code == 200) {
                this.setState({
                    info: res.datas
                })
            }
        }).catch(err => {
        })
    }


    render() {
        const {title, info} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>

                <View style={GlobalStyles.line}/>

                {info!='' && <View>
                    <View style={styles.store_top}>
                        <View style={styles.img}>
                            <Image source={{uri: info.store_label}} style={{width: pxToDp(140),height: pxToDp(140)}} resizeMode={'contain'}/>
                        </View>
                        <View style={styles.store_info}>
                            <Text style={{color: '#232323',fontSize: pxToDp(26)}}>{info.store_name}</Text>
                            <Text style={{color: '#555',fontSize: pxToDp(24),marginVertical: pxToDp(15)}}>{info.store_collect}{I18n.t('VendorInstro.fans')}</Text>
                            <View style={styles.btn}>
                                <Text style={{color: '#fff'}}>{info.is_own_shop==1?I18n.t('VendorInstro.autotrophy'):I18n.t('VendorInstro.common')}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{marginVertical: pxToDp(30),backgroundColor: '#fff'}}>
                        <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.shipments')}</Text>
                            <Text style={styles.con}>{info.store_credit.store_deliverycredit.credit}{I18n.t('GoodsDetailNew.minute')}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.describe')}</Text>
                            <Text style={styles.con}>{info.store_credit.store_desccredit.credit}{I18n.t('GoodsDetailNew.minute')}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.serve')}</Text>
                            <Text style={styles.con}>{info.store_credit.store_servicecredit.credit}{I18n.t('GoodsDetailNew.minute')}</Text>
                        </View>
                    </View>

                    <View style={{marginVertical: pxToDp(30),backgroundColor: '#fff'}}>
                        {info.store_company_name!=null && info.store_company_name!='' && <View style={styles.item}>
							<Text style={styles.title}>{I18n.t('VendorInstro.company')}</Text>
                            <Text style={styles.con}>{info.store_company_name}</Text>
                        </View>}

                        {info.store_address!=null && info.store_address!='' && <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.location')}</Text>
                            <Text style={styles.con}>{info.store_address}</Text>
                        </View>}

                        {info.store_time!=null && info.store_time!='' && <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.startTime')}</Text>
                            <Text style={styles.con}>{info.open_time}</Text>
                        </View>}

                        {info.store_zy!=null && info.store_zy!='' && <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.commodity')}</Text>
                            <Text style={styles.con}>{info.store_zy}</Text>
                        </View>}
                    </View>

                    <View style={{marginVertical: pxToDp(30),backgroundColor: '#fff'}}>
                        {info.store_phone!=null && info.store_phone!='' && <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.phone')}</Text>
                            <Text style={styles.con}>{info.store_phone}</Text>
                        </View>}

                        {info.store_workingtime!=null && info.store_workingtime!='' && <View style={styles.item}>
                            <Text style={styles.title}>{I18n.t('VendorInstro.workingtime')}</Text>
                            <Text style={styles.con}>{info.store_workingtime}</Text>
                        </View>}
                    </View>
                </View>}

            </View>
        )
    }
}


const styles = StyleSheet.create({
    store_top:{
        height: pxToDp(200),
        paddingHorizontal: pxToDp(30),
        flexDirection: 'row',
        alignItems: 'center',
    },
    img:{
        width: pxToDp(140),
        height: pxToDp(140),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(10),
        overflow: 'hidden'
    },
    store_info:{
        flex: 1,
        paddingLeft: pxToDp(30),
        minHeight: pxToDp(140),
    },
    btn:{
        width: pxToDp(160),
        height: pxToDp(50),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: pxToDp(10),
        backgroundColor: '#f23030'
    },
    item:{
        height: pxToDp(82),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pxToDp(30),
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        borderBottomWidth: pxToDp(1),
    },
    title:{
        width: pxToDp(160),
        color: '#232323',
        fontSize: pxToDp(26)
    },
    con:{
        color: '#555',
        fontSize: pxToDp(26)
    }
})
