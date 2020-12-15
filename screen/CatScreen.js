/*
* 分类页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    DeviceInfo,
    TouchableOpacity, Platform, Text, TouchableWithoutFeedback, StatusBar
} from 'react-native';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import {I18n, LANGUAGE_CHINESE} from './../lang/index'
import StorageUtil from "../util/StorageUtil";

var Dimensions = require('Dimensions');
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');
const rows = 10;

export default class HelpCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectLists: [],
            sldtoken: '',
            pn: 1,
            ishasmore: false,
            refresh: false,
            showLikePart: false,
            labela: [{type: 'maijiufan', tag_name: I18n.t('com_SecondCatLIstComponent.Buy_it_back')}],
            labelaappend: [],
            type: 'id',//默认选中当前分类的类型
            idvalue: '',//默认选中当前分类的id值
            catdatainfo: [],//分类数据
            maijiufandata: [],//买就返数据
            secondtaginfo: [],//二级标签信息
            firsttaginfo: {},//一级标签信息
            childCat: [],//二三级分类信息
            currentLanuage: 1  //当前语言
        }
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", payload => {
            this.fetchData();
            console.log("enter CatScreen");
        });
        this.fetchData();
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    fetchData() {
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.get_all_cat(object);//获取所有的一级分类
                this.getMJFInfo();
                this.setState({
                    currentLanuage: object
                })
            } else {
                this.get_all_cat(LANGUAGE_CHINESE);//获取所有的一级分类
                this.getMJFInfo();
                this.setState({
                    currentLanuage: LANGUAGE_CHINESE
                })
            }
        });
    };

    get_all_cat = (lang) => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=goods_cat&mod=index&lang=' + lang)
            .then(result => {
                // console.warn('ww:get_all_cat', this.state.idvalue);
                if (this.state.idvalue === '') {
                    this.setState({
                        labelaappend: result.datas.class_list,
                        idvalue: result.datas.class_list[0].gc_id,
                    }, () => {
                        //获取默认选中的分类下的子分类
                        this.get_child_cat(this.state.idvalue, lang);
                    });
                } else {
                    this.setState({
                        labelaappend: result.datas.class_list,
                    });
                    this.get_child_cat(this.state.idvalue, lang);
                }

            })
            .catch(error => {
                ViewUtils.sldToastTip(error);
            })
    }

    //获取一级分类下的子分类
    get_child_cat = (oneid, lang) => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=goods_cat&mod=category_23&gc_id=' + oneid + '&lang=' + lang)
            .then(result => {
                this.setState({
                    childCat: result.datas.class_list,
                });

            })
            .catch(error => {
                ViewUtils.sldToastTip(error);
            })
    };

    renSldLeftButton(image) {
        return <TouchableOpacity activeOpacity={1}
                                 onPress={() => {
                                     this.props.navigation.goBack();
                                 }}>
            <View style={GlobalStyles.topBackBtn}>
                <Image style={GlobalStyles.topBackBtnImg} source={image}></Image>
            </View>
        </TouchableOpacity>;
    }

    //分类选择事件
    seleCat = (idvalue) => {
        this._flatList.scrollToOffset({ offset: 0 }); // 滚动到顶部
        StorageUtil.get('language', (error, language) => {
            if (!error && language) {
                this.setState({
                    idvalue: idvalue,
                    refresh: !this.state.refresh,
                    currentLanuage: language
                });
                this.get_child_cat(idvalue, language);
            } else {
                this.setState({
                    idvalue: idvalue,
                    refresh: !this.state.refresh,
                    currentLanuage: LANGUAGE_CHINESE
                });
                this.get_child_cat(idvalue, 1);
            }
        });
    };

    //获取买就返数据
    getMJFInfo = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=topic&activity_type=maijiafan')
            .then(result => {
                if (result.datas.error) {
                    ViewUtils.sldToastTip(result.datas.error);
                } else {
                    let datainfo = result.datas;
                    let newdata = new Array();
                    for (let i = 0; i < datainfo.length; i++) {
                        if (datainfo[i]['type'] == 'tupianzuhe' && datainfo[i]['sele_style'] == 1) {
                            newdata = newdata.concat(datainfo[i]['data']);
                        }
                    }
                    this.setState({
                        maijiufandata: newdata,
                    });
                }
            })
            .catch(error => {
                ViewUtils.sldToastTip(error);
            })
    }

    //获取分类的数据
    getCatInfo = (catid) => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=fan_list&mod=getChildTags&gc_id=' + catid)
            .then(result => {
                if (result.datas.error) {
                    ViewUtils.sldToastTip(result.datas.error);
                } else {
                    let datainfo = result.datas;
                    this.setState({
                        firsttaginfo: datainfo.info,
                        secondtaginfo: datainfo.types,
                    });

                }
            })
            .catch(error => {
                ViewUtils.sldToastTip(error);
            })
    }

    //分类图片跳转具体页面
    goDetailPage = (type, value, title = '') => {
        let navigation = this.props.navigation;
        if (type && value) {
            switch (type) {
                case "keyword":
                    navigation.navigate('GoodsSearchList', {'keyword': value});
                    break;
                case "special":
                    navigation.navigate('Special', {'topicid': value, 'title': title});
                    break;
                case "goods":
                    navigation.navigate('GoodsDetailNew', {'gid': value});
                    break;
                default:
                    break;
            }
        }
    }

    goGoodsList = (catid) => {
        this.props.navigation.navigate('GoodsSearchList', {'catid': catid, source: 'CatScreen'});
    }

    //跳转二级分类页
    goSecondCat = (secondtagid) => {
        this.props.navigation.navigate('SecondCat', {'catid': secondtagid});
    };

    _renderCategory(item, index, idvalue) {
        return (
            <View>
                <TouchableOpacity key={item.gc_id} activeOpacity={1} onPress={() => this.seleCat(item.gc_id)}>
                    <View style={[styles.leftView, idvalue === item.gc_id ? styles.seleLeftView : '']}>
                        {idvalue === item.gc_id && <View style={styles.selectItemStyle}></View>}
                        <Text
                            style={[GlobalStyles.sld_global_font, idvalue === item.gc_id ? styles.seleLeftText : styles.leftText]}
                        >
                            {item.gc_name}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };

    _renderSubCategory(item, index) {
        const { width } = Dimensions.get('window')
        return (
            <View key={'child' + index}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        this.goGoodsList(item.gc_id);
                    }}
                >
                    <Text style={{
                        color: '#2D2D2D',
                        paddingTop: pxToDp(40),
                        paddingLeft: pxToDp(20),
                        paddingBottom: pxToDp(20),
                        fontSize: pxToDp(28)
                    }}>{item.gc_name}</Text>
                </TouchableOpacity>
                <View style={styles.rightCatView}>
                    {
                        item.third_class && item.third_class.map((items, indexs) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                        width: (width - 120)/3,
                                        height: (width - 120)/3 + 35,
                                    }}
                                    key={'third' + indexs}
                                    onPress={() => this.goGoodsList(items.gc_id)}
                                >
                                    <Image style={styles.rightCatImg}
                                           defaultSource={require('../assets/images/default_icon_124.png')}
                                           source={{uri: items.pic}}
                                           resizeMode={'contain'}
                                    />
                                    <View style={{flex: 1, paddingHorizontal: 5}}>
                                        <Text style={[styles.rightCatTitle, GlobalStyles.sld_global_font]}>{items.gc_name}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    }
                </View>
            </View>
        )
    };

    render() {
        const weburl = AppSldDomain + 'appview/cwap_pro_cat.html';
        const {idvalue, labelaappend} = this.state;
        const { width } = Dimensions.get('window')

        return (
            <View style={styles.container}>
                {/*搜索框*/}
                <View style={[styles.homeSldSearchWrap, {height: Platform.OS === 'ios' ? (ios_type != '' ? ios_type + 35 : pxToDp(130)) : 55}]}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.navigation.navigate('SearchPage');
                        }}>
                        <View style={styles.homesearchcons}>
                            <Image style={styles.homeSearchimg} source={require('../assets/images/search.png')}/><Text
                            style={{color: '#bababa', lineHeight: pxToDp(60)}}>{I18n.t('search_goods')}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={GlobalStyles.line}/>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={styles.catCommonLeft}>
                        {/*左侧分类*/}
                        <FlatList
                            style={{flex: 1}}
                            showsVerticalScrollIndicator={false}
                            data={labelaappend}
                            renderItem={({item, index}) => this._renderCategory(item, index, idvalue)}
                            keyExtractor={(item, index) => index.toString()}
                            extraData={this.state.refresh}
                        />
                    </View>
                    <View style={{
                        flex: 1,
                        width: width - 100,
                        paddingHorizontal: 10,
                        backgroundColor: '#fff'
                    }}>
                        {/*右侧商品*/}
                        <FlatList
                            ref={(flatList)=>this._flatList = flatList}
                            showsVerticalScrollIndicator={false}
                            style={styles.rightWrap}
                            data={this.state.childCat}
                            renderItem={({item, index}) => this._renderSubCategory(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{height: Platform.OS === 'ios' && (deviceHeight === 812 || deviceHeight === 896) ? 83 : 49, backgroundColor: '#fff'}}/>
                </View>
            </View>
        )
    }
}
const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
    commonrightcatpart: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    rightWrap: {
        paddingBottom: 15,
        flex: 1
    },
    rightCatTitle: {
        fontSize: pxToDp(24),
        color: '#333333',
        marginTop: pxToDp(19)
    },
    rightCatImg: {
        width: 66.5,
        height: 66.5
    },
    rightCatView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: pxToDp(6),
    },
    rightTopImg: {
        width: Dimensions.get('window').width / 5 * 4 - 35,
        marginLeft: 18,
        height: (Dimensions.get('window').width / 5 * 4 - 35) / 3,
        borderRadius: 6,
        marginTop: 13
    },
    seleLeftText: {
        fontSize: pxToDp(24),
        color: '#E1251B',
        fontWeight: '600',
        textAlign: 'center'
    },
    seleLeftView: {
        backgroundColor: '#fff'
    },
    selectItemStyle: {
        position: 'absolute',
        top: pxToDp(26),
        left: 0,
        width: pxToDp(6),
        height: pxToDp(36),
        backgroundColor: '#E1251B',
        borderRadius: pxToDp(3)
    },
    leftText: {
        fontSize: pxToDp(24),
        color: '#2D2D2D',
        textAlign: 'center'},
    leftView: {
        height: pxToDp(88),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: pxToDp(20)
    },
    catCommonLeft: {
        justifyContent: 'center',
        width: 100,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: StatusBar.currentHeight
    },
    webView: {
        marginTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
        borderBottomColor: '#fff',
        paddingBottom: 0,
    },

    homeSldSearchWrap: {
        paddingTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? (STATUS_BAR_HEIGHT + 8) : STATUS_BAR_HEIGHT) : 10,
        height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? pxToDp(150) : pxToDp(130)) : 55,
        flexDirection: 'row', paddingBottom: 5,
        backgroundColor: '#fff',
    },

    homelogoimg: {
        width: 30,
        height: 30,
    },
    homelogo: {
        width: 65,
        paddingLeft: 17,
    },
    homeSearchimg: {
        width: pxToDp(30),
        height: pxToDp(30),
        marginTop: pxToDp(15),
        marginRight: pxToDp(4),
    },
    homeSearchcon: {
        height: pxToDp(120),
        flexDirection: 'row',
    },
    homesearchcons: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        width: Dimensions.get('window').width * 1 - 30,
        height: pxToDp(60),
        borderRadius: pxToDp(30),
        justifyContent: 'center',
        marginLeft: 15
    },
});
