/*
* 收藏商品列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View, Text, Image, Dimensions, Platform, ImageBackground, TouchableOpacity, StatusBar
} from 'react-native';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import RequestData from '../RequestData';
import SldFlatList from '../component/SldFlatList';
import LoadingWait from '../component/LoadingWait';
import SldComStatusBar from "../component/SldComStatusBar";
import styles from './stylejs/experience';

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');
import {I18n, LANGUAGE_ENGLISH} from './../lang/index'
import StorageUtil from "../util/StorageUtil";


export default class AccountMoney extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('AccountMoney.difference'),
            pointer: 0,
            list: [],
            isLoading: 0,
            pn: 1,
            hasmore: true,
            show_gotop: false,
            refresh: false,
        }
    }

    componentDidMount() {
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.getList(object);
            } else {
                this.getList(LANGUAGE_ENGLISH);
            }
        });

        this.yucunqian();
    }

    //  获取我的余额
    yucunqian() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=pointNum&key=' + key + '&fields=point').then(res => {
            this.setState({
                pointer: res.datas.yucunqian
            })
        }).catch(err => {
        })
    }

    // 获取余额列表
    getList(language) {
        let {pn,hasmore} = this.state;
        if(!hasmore) return;
        RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=useryue&key=' + key + '&pn='+ pn +'&page=10' + '&lang_type=' + language).then(res => {
            let data = res.datas.points_list;
            let newlist = [];
            if(pn==1){
                newlist = data;
            }else{
                let {list} = this.state;
                newlist = list.concat(data);
            }
            if(res.hasmore){
                pn++;
            }else{
                hasmore = false;
            }
            this.setState({
                list: newlist,
                isLoading: 1,
                pn,
                hasmore
            })
        }).catch(err => {
            this.setState({
                isLoading: 1
            })
        })
    }

    refresh = ()=>{
        this.setState({
            pn: 1,
            hasmore: true
        },()=>{
            this.getList();
        })
    }

    getNewData = () => {
        if(this.state.hasmore){
            this.getList()
        }
    }

    handleScroll = (event) => {
        let offset_y = event.nativeEvent.contentOffset.y;
        let {show_gotop} = this.state;
        if(!show_gotop && offset_y > 100){
            show_gotop = true
        }
        if(show_gotop && offset_y < 100){
            show_gotop = false
        }
        this.setState({
            show_gotop: show_gotop,
        });
    }

    keyExtractor = (item, index) => {
        return index
    }

    separatorComponent = () => {
        return (
            <View/>
        );
    }

    render() {
        const {title, list, isLoading,show_gotop,refresh} = this.state;
        const { height } = Dimensions.get('window')
        return (
            <View style={GlobalStyles.sld_container}>
                <SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
                {ViewUtils.getEmptyPosition(Platform.OS === 'ios'?'#fff':main_ldj_color,pxToDp(0))}
                <ImageBackground
                    style={styles.exp_top}
                    source={require('../assets/images/balance_bg.png')}
                    resizeMode={'cover'}
                >
                    <View style={{
                        flexDirection: 'row',
                        width: deviceWidth,
                        marginTop: Platform.OS === 'ios' ? (height === 812 || height === 896) ? 44 : 20 : StatusBar.currentHeight,
                        height: 44,
                        backgroundColor: 'rgba(0,0,0,0)'
                    }}>
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                marginLeft: 15,
                                width: 44,
                                height: 44
                            }}
                            activeOpacity={1}
                            onPress={()=>{
                                ViewUtils.sldHeaderLeftEvent(this.props.navigation)
                            }}
                        >
                            <Image
                                style={{
                                    width: 22,
                                    height:34,
                                    tintColor: '#fff'
                                }}
                                resizeMode={'contain'}
                                source={require('../assets/images/goback.png')}
                            />
                        </TouchableOpacity>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#fff',fontSize: 17,fontWeight: '600', textAlign: 'center'}}>{title}</Text>
                        </View>
                        <View style={{width: 59}}/>
                    </View>

                    <View style={styles.exp_top_num}>
                        <Image
                            style={styles.exp_top_img}
                            source={require('../assets/images/balance_bg2.png')}
                            resizeMode={'contain'}
                        />
                        <Text style={[styles.exp_top_txt,{color: '#fff',fontSize: pxToDp(44)}]}>{this.state.pointer}</Text>
                    </View>

                </ImageBackground>

                {list.length>0 && <SldFlatList
                    data={ list }
                    refresh_state={ refresh }
                    show_gotop={ show_gotop }
                    refresh={ () => this.refresh() }
                    keyExtractor={ () => this.keyExtractor() }
                    handleScroll={ (event) => this.handleScroll(event) }
                    getNewData={ () => this.getNewData() }
                    separatorComponent={ () => this.separatorComponent() }
                    renderCell={ (item) => <View key={item.pl_addtime} style={styles.item}>
                        <View style={styles.bw}>
                            <Text style={[styles.txt,{color: '#2D2D2D',width: pxToDp(400)}]}>{item.pl_desc}</Text>
                            {item.pl_points*1>0 ?
                                <Text style={styles.bw_r}>+{item.pl_points}</Text>
                                :
                                <Text style={[styles.bw_r,{color: '#949494'}]}>{item.pl_points}</Text>}
                        </View>
                        <Text style={styles.time}>{item.pl_addtime}</Text>
                    </View> }
                />}

                {
                    isLoading==0 ? (
                        <LoadingWait loadingText={I18n.t('loading')} cancel={() => {}}/>
                    ) : (null)
                }

                {list.length == 0 && isLoading == 1 &&
                <View style={{marginTop: pxToDp(200)}}>{ViewUtils.noData()}</View>}

            </View>
        )
    }
}


