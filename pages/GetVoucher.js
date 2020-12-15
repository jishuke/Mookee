/*
* 优惠券列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Image, Text, StyleSheet
} from 'react-native';
import CountEmitter from "../util/CountEmitter";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import SldRed from '../component/SldRed'
import RequestData from '../RequestData';
import SldFlatList from '../component/SldFlatList'
import {I18n} from './../lang/index'
import StorageUtil from "../util/StorageUtil";

let pn = 1;
let hasmore = true;
export default class GetVoucher extends Component {

    constructor(props) {

        super(props);
        this.state = {
            title: I18n.t('GetVoucher.title'),
            redList: [],
            isLoading: 0,
            show_gotop: false,
            refresh: false,
            memberId: ''
        }
    }

    componentDidMount() {
        StorageUtil.get('memberId', (err, res) => {
            if (!err && res) {
                this.getRedList(res.memberId);
                this.setState({
                    memberId: res.memberId
                });
            }
        });
    }

    // 获取可领优惠券
    getRedList(memberId_param) {
        const { memberId } = this.state
        console.log('用户id:', memberId)
        const member_id = memberId_param || memberId
        RequestData.getSldData(AppSldUrl + `/index.php?app=red&mod=red_get_list&sld_addons=red&page=10&pn=${pn}&key=${key}&member_id=${member_id}`).then(res => {
            this.setState({
                isLoading: 1
            })
            if (res.code == 200) {
                if (pn == 1) {
                    this.setState({
                        redList: res.datas.red
                    })
                } else {
                    let redList = this.state.redList;
                    this.setState({
                        redList: redList.concat(res.datas.red)
                    })
                }
                if (res.hasmore == false) {
                    hasmore = false;
                } else {
                    pn++;
                }
            }
        }).catch(err => {
            ViewUtils.sldErrorToastTip(error);
            this.setState({
                isLoading: 1
            })
        })
    }

    refresh = () => {
        pn == 1;
        hasmore = true;
        this.getRedList();
    }

    getNewData = () => {
        if (hasmore) {
            this.getRedList();
        }
    }

    keyExtractor = (item, index) => {
        return index
    }

    handleScroll = (event) => {
        let offset_y = event.nativeEvent.contentOffset.y;
        let {show_gotop} = this.state;
        if (!show_gotop && offset_y > 100) {
            show_gotop = true
        }
        if (show_gotop && offset_y < 100) {
            show_gotop = false
        }
        this.setState({
            show_gotop: show_gotop,
        });

    }

    separatorComponent = () => {
        return (
            <View style={GlobalStyles.line}/>
        );
    }

    // 领券
    ling = (id) => {
        let {redList, memberId} = this.state;
        if(ViewUtils.checkLoginAndTip(this.props.navigation)){
            RequestData.getSldData(AppSldUrl + '/index.php?app=red&mod=send_red&sld_addons=red&key=' + key + '&red_id=' + id + '&member_id=' + memberId).then(res => {
                if (res.code != '200') {
                    return;
                }
                if (res.datas == 1) {
                    ViewUtils.sldToastTip(I18n.t('GetVoucher.text1'));
                    CountEmitter.emit('gainvoucher');
                    for (let i = 0; i < redList.length; i++) {
                        let item = redList[i];
                        if (item.red_id == id) {
                            item.hava = item.hava + 1;
                            item.prent = item.prent + 1;
                            break;
                        }
                    }
                    let newArr = [];
                    this.setState({
                        redList: newArr.concat(redList)
                    })
                } else {
                    ViewUtils.sldToastTip(res.data.msg)
                }
            })
        }
    }

    render() {
        const {title, redList, isLoading, show_gotop, refresh} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={[GlobalStyles.line, {marginBottom: pxToDp(30)}]}/>
                {
                    redList.length > 0 && <SldFlatList
                        data={redList}
                        refresh_state={refresh}
                        show_gotop={show_gotop}
                        refresh={() => this.refresh()}
                        keyExtractor={() => this.keyExtractor()}
                        handleScroll={(event) => this.handleScroll(event)}
                        getNewData={() => this.getNewData()}
                        separatorComponent={() => this.separatorComponent()}
                        renderCell={item =>
                            <SldRed
                                info={item}
                                status={1}
                                add={(id) => this.ling(id)}
                                use={ () => {
                                    this.props.navigation.navigate('GoodsSearchList', {keyword: '', catid: '',redID:item.redinfo_id})
                                } }
                            />
                        }
                    />
                }
                {
                    redList.length == 0 && isLoading == 1 && <View style={styles.err}>
                        <Image style={{width: pxToDp(200), height: pxToDp(200)}}
                               source={require('../assets/images/nothave.png')}/>
                        <Text style={{marginTop: pxToDp(30), fontSize: pxToDp(30), color: '#696969'}}>{I18n.t('GetVoucher.text2')}</Text>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    err: {
        marginTop: pxToDp(200),
        alignItems: 'center',
    },
})
