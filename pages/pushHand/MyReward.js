/**
 * 推手 --- 我的奖励
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
    ScrollView,
} from "react-native";
import fun from '../../assets/styles/FunctionStyle';
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import {getMyaward,accruedIncome,returnsDetailed} from '../../api/pushHandApi'
import ViewUtils from '../../util/ViewUtils';
import {I18n} from './../../lang/index'
const Item = (props) => {
    const {member_avatar,member_nickname,add_time,push_dev,yongjin} = props.item;
    console.warn(props.item,'props.item');
    return (
        <View style={[fun.f_row_center, {paddingTop: pxToDp(10), paddingBottom: pxToDp(10)}]}>
            <View style={[fun.f_flex1, fun.f_shrink0, fun.f_row_center]}>
                <Image style={[fun.f_icon84, {borderRadius: pxToDp(42), marginRight: pxToDp(10)}]}  source={{uri:member_avatar}} />
                <View>
                    <Text style={[fun.f_fs28, fun.f_c_24, fun.f_fwb, {marginBottom: pxToDp(10)}]}>{member_nickname ===''?'-':member_nickname}</Text>
                    <Text style={[fun.f_c_66, {fontSize: pxToDp(18)}]}>{push_dev}</Text>
                </View>
            </View>
            <View style={[fun.f_flex1, fun.f_center, fun.f_shrink0]}>
                <Text style={[fun.f_c_red, fun.f_fs28]}>{yongjin}</Text>
            </View>
            <View style={[fun.f_flex1, fun.f_center, fun.f_shrink0]}>
                <Text style={[fun.f_c_66, fun.f_fs38]}>{add_time}</Text>
            </View>
        </View>
    );
}
export default class MyReward extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 1,
            topInfo : null,
            list1:null,
            list2:null
        };
    }
    componentDidMount() {
        this.myAward()
        if(this.state.tabIndex === 1) {
            this.getReturnsDetailed()
        } else {
            this.getAccruedIncome()
        }
    }
    myAward () {
        getMyaward({
            key : key,
            member_id: cur_user_info.member_id
        }).then(res => {
            console.log(res)
            if(res.code === 200){
                this.setState({
                    topInfo : res.datas
                })
            } else {
                ViewUtils.sldToastTip(res.datas.error)
            }
        })
    }
    getAccruedIncome () {
        accruedIncome({
            pagesize : 1000,
            pn : 1,
            member_id: cur_user_info.member_id,
            key : key
        }).then(res =>{
            if(res.code === 200){
                this.setState({
                    list2: res.datas
                })
            } else {
                ViewUtils.sldToastTip(res.datas.error)
            }
        })
    }

    getReturnsDetailed () {
        returnsDetailed({
            pagesize : 1000,
            pn : 1,
            member_id: cur_user_info.member_id,
            key : key
        }).then(res =>{
            if(res.code === 200){
                this.setState({
                    list1: res.datas
                })
            } else {
                ViewUtils.sldToastTip(res.datas.error)
            }
        })
    }


    leftButton() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image style={{ width: pxToDp(36), height: pxToDp(36), marginLeft: pxToDp(40) }} source={require('../../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    }
    render() {
        const {topInfo} = this.state

        console.log('钱钱钱钱钱钱钱钱钱钱:', this.state.list2)

        return (
            <View style={[fun.f_flex1, fun.f_bg_white]}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
                    title={I18n.t('PinTuanOrder.text9')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                {
                    topInfo &&
                    <ScrollView>
                        <View style={[{paddingTop: pxToDp(20), paddingBottom: pxToDp(40)}]}>
                            <Text style={[{marginBottom: pxToDp(40)}, fun.f_tac]}>{I18n.t('PinTuanOrder.text13')}</Text>
                            <Text style={[fun.f_tac, fun.f_c_red, fun.f_fs40, fun.f_fwb]}>{topInfo.member_info[0].money}</Text>
                        </View>
                        <View style={[fun.f_row_center, {justifyContent: 'center', paddingBottom: pxToDp(80)}]}>
                            <View style={styles.pd18}>
                                <Text style={[fun.f_tac, fun.f_c_66, fun.f_fs24, {marginBottom: pxToDp(20)}]}>{I18n.t('PinTuanOrder.text10')}</Text>
                                <Text style={[fun.f_tac, fun.f_c_red, fun.f_fwb, fun.f_fs24]}>{topInfo.canuse}</Text>
                            </View>
                            <View style={styles.pd18}>
                                <Text style={[fun.f_tac, fun.f_c_66, fun.f_fs24, {marginBottom: pxToDp(20)}]}>{I18n.t('PinTuanOrder.text8')}</Text>
                                <Text style={[fun.f_tac, fun.f_c_red, fun.f_fwb, fun.f_fs24]}>{topInfo.notcanuse}</Text>
                            </View>
                            <View style={styles.pd18}>
                                <Text style={[fun.f_tac, fun.f_c_66, fun.f_fs24, {marginBottom: pxToDp(20)}]}>{I18n.t('PinTuanOrder.text7')}</Text>
                                <Text style={[fun.f_tac, fun.f_c_red, fun.f_fwb, fun.f_fs24]}>{topInfo.member_infotwo[0].money}</Text>
                            </View>
                        </View>
                        <View>
                            <View style={[fun.f_flex, fun.f_row, {paddingLeft: pxToDp(40), paddingRight: pxToDp(40)}]}>
                                <TouchableOpacity onPress={() => {
                                    this.getReturnsDetailed()
                                    this.setState({
                                        tabIndex: 1
                                    });
                                }} style={[fun.f_flex1, fun.f_center, this.state.tabIndex == 1 ? styles.tab_active : styles.tab]}>
                                    <Text style={[this.state.tabIndex == 1 ? fun.f_c_white : fun.f_c_24]}>{I18n.t('PinTuanOrder.text6')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.getAccruedIncome()
                                    this.setState({
                                        tabIndex: 2
                                    });
                                }} style={[fun.f_flex1, fun.f_center, this.state.tabIndex == 2 ? styles.tab_active : styles.tab]}>
                                    <Text style={[this.state.tabIndex == 2 ? fun.f_c_white : fun.f_c_24]}>{I18n.t('PinTuanOrder.text5')}</Text>
                                </TouchableOpacity>
                            </View>
                            {
                                this.state.tabIndex == 1 && (
                                    <View style={[{paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}]}>
                                        <View style={[fun.f_row_center, {paddingTop: pxToDp(40), paddingBottom: pxToDp(30)}]}>
                                            <View style={[fun.f_center, fun.f_flex1]}>
                                                <Text style={[fun.f_c_66, fun.f_fs28]}>{I18n.t('PinTuanOrder.text2')}</Text>
                                            </View>
                                            <View style={[fun.f_center, fun.f_flex1]}>
                                                <Text style={[fun.f_c_66, fun.f_fs28]}>{I18n.t('PinTuanOrder.text4')}</Text>
                                            </View>
                                            <View style={[fun.f_center, fun.f_flex1]}>
                                                <Text style={[fun.f_c_66, fun.f_fs28]}>{I18n.t('PinTuanOrder.text3')}</Text>
                                            </View>
                                        </View>

                                        <View>
                                            {
                                                this.state.list1 && this.state.list1.length > 0 && this.state.list1.map((item, index) => {
                                                    return <Item name={item.name} key={index} item={item} />;
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            }
                            {
                                this.state.tabIndex == 2 && (
                                    <View style={[{paddingLeft: pxToDp(20), paddingRight: pxToDp(40)}]}>
                                        <View style={[fun.f_row_center, {paddingTop: pxToDp(40), paddingBottom: pxToDp(30)}]}>
                                            <View style={[fun.f_center, fun.f_flex1]}>
                                                <Text style={[fun.f_c_66, fun.f_fs28]}>{I18n.t('PinTuanOrder.text2')}</Text>
                                            </View>
                                            <View style={[fun.f_center, fun.f_flex1]}>
                                                <Text style={[fun.f_c_66, fun.f_fs28]}>{I18n.t('PinTuanOrder.text13')}</Text>
                                            </View>
                                            <View style={[fun.f_center, fun.f_flex1]}>
                                                <Text style={[fun.f_c_66, fun.f_fs28]}>{I18n.t('PinTuanOrder.intime')}</Text>
                                            </View>
                                        </View>

                                        <View>
                                            {
                                                this.state.list2 && this.state.list2.length > 0 && this.state.list2.map((item, index) => {
                                                    return <Item key={index} item={item} />;
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            }
                        </View>
                    </ScrollView>

                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    pd18: {
        paddingLeft: pxToDp(28),
        paddingRight: pxToDp(28)
    },
    tab: {
        height: pxToDp(88),
        backgroundColor: '#E5E5E5'
    },
    tab_active: {
        height: pxToDp(88),
        backgroundColor: '#DE2C22'
    }
});
