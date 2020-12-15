/*
* 积分明细页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, FlatList, Text, Image, StyleSheet, Dimensions
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import RequestData from '../RequestData';
import LoadingWait from '../component/LoadingWait'

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class FenXiaoIncome extends Component {

    constructor(props){

        super(props);
        this.state={
            title:I18n.t('FenXiaoIncome.commission'),
            pointer: 0,
            list: [],
            isLoading: 0
        }
    }

    componentWillMount() {
        this.getList();
    }

    // 获取分销列表
    getList() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=gerDisIncomeDetail&key=' + key + '&pn=1&page=10').then(res => {
            this.setState({
                list: res.datas.fenxiao_info,
                isLoading: 1,
                pointer: res.datas.total_get
            })
        }).catch(err => {
            ViewUtils.sldErrorToastTip(error);
            this.setState({
                isLoading: 1
            })
        })
    }

    //
    renderItem = (item) => {
        return (<View style={styles.item1}>
            <Text style={styles.item_left}>{item.contribution_member_name}</Text>
            <View style={styles.item_right}>
                <Text style={{textAlign: 'right',fontSize: pxToDp(26),color: (item.yongjin*1>0?'#f23030':'#6d6d6d')}}>{item.yongjin}</Text>
                <Text style={{textAlign: 'right',fontSize: pxToDp(22)}}>{item.wap_time}</Text>
            </View>
        </View>)
    }

    render() {
        const {title, list, isLoading} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>
                <View style={{height: deviceHeight - pxToDp(120)}}>
                    <View style={styles.header}>
                        <Image style={styles.img}
                               source={require('../assets/images/mcc_10_w.png')}/>
                        <View style={styles.txt}>
                            <Text style={{color: '#fff', fontSize: pxToDp(28)}}>{I18n.t('FenXiaoIncome.totalcommission')}</Text>
                            <Text style={{
                                color: '#fff',
                                fontSize: pxToDp(40),
                                marginTop: pxToDp(10)
                            }}>{this.state.pointer}</Text>
                        </View>
                    </View>

                    {list.length > 0 && <View
                        style={styles.main}
                    >
                        <FlatList
                            data={list}
                            extraData={this.state}
                            renderItem={({item}) => this.renderItem(item)}
                        />
                    </View>}

                    {
                        isLoading==0 ? (
                            <LoadingWait loadingText={I18n.t('com_PinTuan.Data_loading')} cancel={() => {}}/>
                        ) : (null)
                    }

                    {list.length == 0 && isLoading == 1 &&
                    <View style={{marginTop: pxToDp(200)}}>{ViewUtils.noData()}</View>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        width: deviceWidth,
        height: pxToDp(150),
        backgroundColor: '#F6BB43',
        alignItems: 'flex-end',
    },
    main: {
        width: deviceWidth,
        height: deviceHeight-300
    },
    img: {
        position: 'absolute',
        left: pxToDp(80),
        top: 0,
        width: pxToDp(150),
        height: pxToDp(150),
        transform: [{rotate: '25deg'}],
        opacity: 0.4,
    },
    txt: {
        width: '100%',
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: pxToDp(30),
    },
    item1: {
        width: deviceWidth,
        height: pxToDp(120),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pxToDp(30),
        borderStyle: 'solid',
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#e9e9e9',
    },
    item_left: {
        flex: 1,
        color: '#232326',
        fontSize: pxToDp(26)
    },
    item_right: {
        width: pxToDp(220),
        justifyContent: 'space-around',
    },
    pl_points: {
        color: '#f23030',
        fontSize: pxToDp(26),
        marginBottom: pxToDp(8)
    },
    wap_time: {
        color: '#848689',
        fontSize: pxToDp(22)
    }
})

