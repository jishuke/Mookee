import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter,
    Dimensions,
    StyleSheet, Platform, DeviceInfo, TextInput
} from 'react-native';
import StorageUtil from "../util/StorageUtil";
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import {I18n} from './../lang/index'

const {width, height} = Dimensions.get('window')
export default class City_Site extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('CitySite.title'),
            cityList: [],
            hotlist: [],
            is_allow_show_default: false,
            search_list: [],
        }
    }

    componentDidMount() {
        this.getCityData();
    }

    componentWillUnmount() {

    }

    getCityData() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=city_site_list').then(res => {
            if (res.code == 200) {
                if(res.datas.citylist!=undefined){
                    let list = [];
                    for (let i in res.datas.citylist) {
                        let arr = [];
                        for (let j = 0; j < res.datas.citylist[i].length; j++) {
                            arr.push(res.datas.citylist[i][j])
                        }
                        let item = {
                            name: i,
                            child: arr
                        };
                        list.push(item);
                    }
                    let hotlist = res.datas.hotlist;
                    let is_allow_show_default = res.datas.is_allow_show_default;
                    this.setState({
                        cityList: list,
                        hotlist: hotlist,
                        is_allow_show_default: is_allow_show_default,
                    });
                }
            }
        })
    }

    handleSldSearch = (text) => {
        if(text.trim().length>0){
            RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=city_site_list&term=' + text).then(res => {
                if(res.code==200){
                    let list = [];
                    for (let i in res.datas.citylist) {
                        let arr = [];
                        for (let j = 0; j < res.datas.citylist[i].length; j++) {
                            arr.push(res.datas.citylist[i][j])
                        }
                        let item = {
                            name: i,
                            child: arr
                        };
                        list.push(item);
                    }
                    this.setState({
                        search_list: list
                    })
                }
            }).catch(err => {
                ViewUtils.sldErrorToastTip(error);
            })
        }else{
            this.setState({
                search_list: []
            })
        }

    }

    select = (item) => {
        let bid = item.area_id*1 || item.city_id*1 || item.province_id*1;
        let info = {
            bid: bid,
            city_name: item.sld_city_site_name,
            site_id: item.id
        }
        StorageUtil.set('citysite', JSON.stringify(info),()=>{
            CitySite = info;
            DeviceEventEmitter.emit('updateCity', info);//通知首页数据更新
            this.props.navigation.pop();//关闭当前页

        });
    }

    render() {
        const {cityList, hotlist, is_allow_show_default,search_list} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <View style={styles.homeSldSearchWrap}>
                    <View>
                        <View style={styles.homesearchcons}>
                            <Image style={styles.homeSearchimg} source={require('../assets/images/search.png')}/>
                            <TextInput
                                style={[{
                                    color: '#666',
                                    fontSize: pxToDp(26),
                                    width: pxToDp(550),
                                    padding: 0,
                                    backgroundColor: '#ebebeb',
                                    height: pxToDp(60)
                                }, GlobalStyles.sld_global_font]}
                                underlineColorAndroid={'transparent'}
                                autoCapitalize='none'
                                returnKeyType='search'
                                keyboardType='default'
                                enablesReturnKeyAutomatically={true}
                                onChangeText={(text) => this.handleSldSearch(text)}
                                placeholder={I18n.t('CitySite.Search_the_city')}>
                            </TextInput>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        this.props.navigation.goBack();
                    }}>
                        <View style={styles.cancelBack}>
                            <Image
                                style={{width: pxToDp(30), height: pxToDp(30)}}
                                resizeMode={'contain'}
                                source={require('../assets/images/sld_cha.png')}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={GlobalStyles.line}/>

                <View style={styles.search_res}>
                    <ScrollView>
                        {search_list.length > 0 && search_list.map(el => <View style={styles.list_item_wrap}>
                            <View style={styles.list_left}><Text
                                style={{color: '#4b6add', fontSize: pxToDp(30)}}>{el.name}</Text></View>
                            <View style={styles.list_right}>
                                {el.child.length > 0 && el.child.map(el2 => <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.list_item}
                                    onPress={() => this.select({
                                        area_id: el2.area_id,
                                        city_id: el2.city_id,
                                        province_id: el2.province_id,
                                        sld_city_site_name: el2.sld_city_site_name,
                                        id: el2.id
                                    })}
                                >
                                    <Text style={{color: '#666', fontSize: pxToDp(28)}}>{el2.sld_city_site_name}</Text>
                                </TouchableOpacity>)}
                            </View>
                        </View>)}
                    </ScrollView>
                </View>

                <View style={styles.now}>
                    <Image
                        style={{width: pxToDp(20), height: pxToDp(25),tintColor: 'rgb(312,30,48)'}}
                        resizeMode={'contain'}
                        source={require('../assets/images/dw.png')}
                    />
                    <Text style={{marginHorizontal: pxToDp(15), color: '#8c8b8b', fontSize: pxToDp(28)}}>{I18n.t('CitySite.Current_Site')}</Text>
                    <Text style={{color: '#333', fontSize: pxToDp(32)}}>{CitySite.city_name}</Text>
                </View>

                <ScrollView>
                    <View style={styles.hot}>
                        <View style={styles.hot_title}>
                            <Text style={{color: '#999', fontSize: pxToDp(26)}}>{I18n.t('CitySite.hot')}</Text>
                        </View>
                        <View style={styles.hot_list}>
                            {is_allow_show_default == true && <TouchableOpacity
                                style={{
                                    width: pxToDp(150),
                                    height: pxToDp(60),
                                    borderStyle: 'solid',
                                    borderWidth: pxToDp(1),
                                    borderColor: '#bababa',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: pxToDp(20),
                                    marginHorizontal: pxToDp(10)
                                }}
                                activeOpacity={1}
                                onPress={() => this.select({
                                    area_id: 0,
                                    city_id: 0,
                                    province_id: 0,
                                    sld_city_site_name:I18n.t('HomeScreenNew.National') ,
                                    id: 0
                                })}
                            >
                                <Text style={{color: '#666', fontSize: pxToDp(28)}}>{I18n.t('HomeScreenNew.National')}</Text>
                            </TouchableOpacity>}
                            {hotlist.length > 0 && hotlist.map(el => <TouchableOpacity
                                style={{
                                    width: pxToDp(150),
                                    height: pxToDp(60),
                                    borderStyle: 'solid',
                                    borderWidth: pxToDp(1),
                                    borderColor: '#bababa',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: pxToDp(20),
                                    marginHorizontal: pxToDp(10)
                                }}
                                activeOpacity={1}
                                onPress={() => this.select({
                                    area_id: el.area_id,
                                    city_id: el.city_id,
                                    province_id: el.province_id,
                                    sld_city_site_name: el.sld_city_site_name,
                                    id: el.id
                                })}
                            >
                                <Text style={{color: '#666', fontSize: pxToDp(28)}}>{el.sld_city_site_name}</Text>
                            </TouchableOpacity>)}
                        </View>
                    </View>

                    <View style={styles.list}>
                        {cityList.length > 0 && cityList.map(el => <View style={styles.list_item_wrap}>
                            <View style={styles.list_left}><Text
                                style={{color: '#4b6add', fontSize: pxToDp(30)}}>{el.name}</Text></View>
                            <View style={styles.list_right}>
                                {el.child.length > 0 && el.child.map(el2 => <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.list_item}
                                    onPress={() => this.select({
                                        area_id: el2.area_id,
                                        city_id: el2.city_id,
                                        province_id: el2.province_id,
                                        sld_city_site_name: el2.sld_city_site_name,
                                        id: el2.id
                                    })}
                                >
                                    <Text style={{color: '#666', fontSize: pxToDp(28)}}>{el2.sld_city_site_name}</Text>
                                </TouchableOpacity>)}
                            </View>
                        </View>)}
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const STATUS_BAR_HEIGHT = 20;
const styles = StyleSheet.create({
    homeSldSearchWrap: {
        paddingTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? (STATUS_BAR_HEIGHT + 16) : STATUS_BAR_HEIGHT) : 10,
        height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? pxToDp(150) : pxToDp(120)) : pxToDp(80),
        flexDirection: 'row', paddingBottom: pxToDp(10),
        backgroundColor: '#fff',
        paddingHorizontal: pxToDp(30),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    homeSearchimg: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginLeft: pxToDp(15),
        marginRight: pxToDp(15)
    },
    homesearchcons: {
        flexDirection: 'row',
        backgroundColor: '#ebebeb',
        width: pxToDp(630),
        height: pxToDp(60),
        borderRadius: 4,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    now: {
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pxToDp(20),
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        borderBottomColor: '#F1F1F1',
        backgroundColor: '#fff'
    },
    hot: {
        paddingHorizontal: pxToDp(20)
    },
    hot_title: {
        height: pxToDp(60),
        justifyContent: 'center',
    },
    hot_list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    list: {
        backgroundColor: '#fff',
        padding: pxToDp(20)
    },
    list_item_wrap: {
        flexDirection: 'row',
        marginBottom: pxToDp(30)
    },
    list_left: {
        width: pxToDp(100),
        alignItems: 'center',
    },
    list_right: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    list_item: {
        marginHorizontal: pxToDp(10),
        marginBottom: pxToDp(20)
    },
    search_res:{
        position: 'relative',
        top: 0,
        left: 0,
        width: width,
        backgroundColor: '#fff',
        paddingTop: pxToDp(20),
        maxHeight: pxToDp(300),
        zIndex: 99
    }
})
