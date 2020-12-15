
import React, {Component} from 'react';
import {
    View, TouchableOpacity, Text, Image, StyleSheet, Dimensions
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

export default class MyTeam extends Component {

    constructor(props) {

        super(props);
        this.state = {
            title: I18n.t('MyTeam.team'),
            grade1: '',
            grade2: '',
            grade3: '',
            total: ''
        }
    }

    componentWillMount() {
        this.getList();
    }


    //
    getList() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=getTuigNum&key=' + key + '&pn=1&page=10').then(res => {
            this.setState({
                grade1: res.datas.grade1,
                grade2: res.datas.grade2,
                grade3: res.datas.grade3,
                total: res.datas.total,
            })
        }).catch(err => {
        })
    }


    render() {
        const {title} = this.state;
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
                            <Text style={{color: '#fff', fontSize: pxToDp(28)}}>{I18n.t('MyTeam.people')}</Text>
                            <Text style={{
                                color: '#fff',
                                fontSize: pxToDp(40),
                                marginTop: pxToDp(10)
                            }}>{this.state.total}</Text>
                        </View>
                    </View>

                    <View style={styles.item1}>
                        <Text style={styles.item_left}>{I18n.t('MyTeam.Primarymember')}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('TeamList', {type: 1})
                            }}
                        >
                            <View style={styles.item_right}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontSize: pxToDp(26),
                                    color: '#f23030'
                                }}>{this.state.grade1}</Text>
                                <Text style={{textAlign: 'right', fontSize: pxToDp(22), color: '#999'}}>{I18n.t('MyTeam.all')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.item1}>
                        <Text style={styles.item_left}>{I18n.t('MyTeam.secondarymembers')}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('TeamList', {type: 2})
                            }}
                        >
                            <View style={styles.item_right}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontSize: pxToDp(26),
                                    color: '#f23030'
                                }}>{this.state.grade2}</Text>
                                <Text style={{textAlign: 'right', fontSize: pxToDp(22), color: '#999'}}>{I18n.t('MyTeam.all')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/*<View style={styles.item1}>
                        <Text style={styles.item_left}>三级会员</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('TeamList', {type: 3})
                            }}
                        >
                            <View style={styles.item_right}>
                                <Text style={{
                                    textAlign: 'right',
                                    fontSize: pxToDp(26),
                                    color: '#f23030'
                                }}>{this.state.grade3}</Text>
                                <Text style={{textAlign: 'right', fontSize: pxToDp(22), color: '#999'}}>{I18n.t('MyTeam.all')}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>*/}
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
        height: deviceHeight - 300
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

