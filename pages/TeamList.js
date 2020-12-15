/*
* 积分明细页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, FlatList, StyleSheet, Dimensions
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import RequestData from '../RequestData';
const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n} from './../lang/index'

let pn = 1;
export default class TeamList extends Component {

    constructor(props) {

        super(props);
        this.state = {
            title: I18n.t('TeamList.title'),
            type: props.navigation.state.params.type != undefined ? props.navigation.state.params.type : 1,
            isLoading: 0,
            list: []
        }
    }

    componentDidMount() {
        this.getList();
    }

    // getList
    getList() {
        let {type} = this.state;
        RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=childListInfo&key=' + key + '&type=' + type + '&pn=' + pn + '&page=10').then(res => {
            this.setState({
                list: res.datas.member_info,
                isLoading: 1
            })
        }).catch(error => {
            this.setState({
                isLoading: 1
            })
            ViewUtils.sldErrorToastTip(error);
        })
    }

    render() {
        const {title, list, isLoading} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                {list.length > 0 && <FlatList
                    data={list}
                    extraData={this.state}
                    renderItem={({item}) => <View style={styles.item1}>
                        <Text style={styles.item_left}>{item.contribution_member_name}</Text>
                        <View style={styles.item_right}>
                            <Text style={{
                                textAlign: 'right',
                                fontSize: pxToDp(26),
                                color: '#f23030'
                            }}>{item.grade_level}</Text>
                            <Text style={{
                                textAlign: 'right',
                                fontSize: pxToDp(22),
                                color: '#999',
                                paddingTop: pxToDp(10)
                            }}>{item.regester_time}</Text>
                        </View>
                    </View>}
                />}


                {list.length == 0 && isLoading == 1 && <View style={{
                    flex: 1,
                    justifyContent: 'center'
                }}>{ViewUtils.noData(I18n.t('TeamList.text1'), require('../assets/images/mcc_04_w.png'), I18n.t('TeamList.text2'))}</View>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
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


