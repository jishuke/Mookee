import React, {Component} from 'react';
import {Text, View, ScrollView, Image, TouchableWithoutFeedback, StyleSheet, Platform,TouchableOpacity} from 'react-native';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import pxToDp from "../../util/pxToDp";
import HomeSNew from "../../pages/stylejs/HomeSNew";
import Swiper from 'react-native-swiper';
import RequestData from "../../RequestData";
import PriceUtil from '../util/PriceUtil'

var Dimensions = require('Dimensions');
export default class HomeQuanComponent extends Component {


    constructor(props) {
        super(props)
        this.state = {
            goodsList: [],//存放除首页之外的所有商品列表
            swiperData: [],//首页轮播数据
        }
    }

    componentWillMount() {
        this.getXianShiData();
    }

    //获取券满减数据
    getXianShiData = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=topic&topic_id=8')
            .then(result => {
                if (!result.datas.error) {
                    for(let i=0;i<result.datas.length;i++){
                        if(result.datas[i]['type'] == 'tupianzuhe'&&result.datas[i]['sele_style'] == 0){
                            this.setState({
                                swiperData:result.datas[i]['data']
                            });
                        }
                        if(result.datas[i]['type'] == 'tuijianshangpin'){
                            this.setState({
                                goodsList:result.datas[i]['data']['goods_info']
                            });
                        }
                    }
                }
            })
            .catch(error => {
            })
    }


    //进入商品详情页
    goGoodsDetail = (gid) => {
        this.props.navigation.navigate('GoodsDetailNew', {'gid': gid});
    }

    //分类图片跳转具体页面
    goDetailPage = (type,value,title='') => {
        let navigation = this.props.navigation;
        if(type&&value){
            switch ( type ) {
                case "keyword":
                    navigation.navigate('GoodsSearchList', {'keyword': value});
                    break;
                case "special":
                    navigation.navigate('Special', {'topicid': value,'title':title});
                    break;
                case "goods":
                    navigation.navigate('GoodsDetailNew',{'gid':value});
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        return (
            <ScrollView>

                {this.state.swiperData != '' && typeof(this.state.swiperData) != 'undefined' && this.state.swiperData.length > 0 && (
                    <Swiper
                        style={GlobalStyles.swiper}
                        horizontal={true}
                        autoplay={true}>

                        {this.state.swiperData.map((val,index) => (
                            <TouchableOpacity key={index} activeOpacity={1} onPress={() => {
                                this.goDetailPage(val.url_type,val.url,val.title);
                            }}>
                            <Image resizeMode='cover'
                                   style={{
                                       height: pxToDp(300)
                                   }}
                                   source={{uri: val.img}}/>
                            </TouchableOpacity>
                        ))}

                    </Swiper>
                )}

                <View style={HomeSNew.listView}>

                    {this.state.goodsList.length > 0 && (

                        this.state.goodsList.map((item,index) => (
                            <View key={index} style={[styles.topic]}>
                                <View style={styles.sld_like_part_list}>
                                    <TouchableWithoutFeedback
                                        onPress={() => this.goGoodsDetail(item.gid)}>
                                        <Image style={styles.sld_like_part_img} source={{uri: item.goods_image}}/>
                                    </TouchableWithoutFeedback>
                                    <View style={styles.sld_like_part_right}>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.goGoodsDetail(item.gid)}>
                                            <Text ellipsizeMode='tail' numberOfLines={1}
                                                  style={[styles.sld_like_part_title, GlobalStyles.sld_global_font]}>{item.goods_name}</Text>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.goGoodsDetail(item.gid)}>
                                            <Text ellipsizeMode='tail' numberOfLines={1}
                                                  style={[styles.sld_like_part_chuildtitle, GlobalStyles.sld_global_font]}>{item.goods_jingle}</Text>
                                        </TouchableWithoutFeedback>

                                        <View style={styles.sldcanclepart}>
                                            <TouchableWithoutFeedback
                                                onPress={() => this.goGoodsDetail(item.gid)}>
                                                <Text style={styles.sld_like_part_price}>ks{PriceUtil.formatPrice(item.show_price * 1)}</Text>
                                            </TouchableWithoutFeedback>

                                        </View>
                                    </View>

                                </View>
                            </View>
                        ))


                    )}
                </View>
            </ScrollView>)
    }

}
const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
    newline: {
        height: 0.5,
        marginLeft: pxToDp(30),
        marginRight: pxToDp(30),
        width: Dimensions.get('window').width * 1 - pxToDp(60),
        borderColor: '#ebebeb',
    },
    sld_home_searchbar: {
        marginTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    },
    sld_home_search: {
        width: pxToDp(400),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sldtabbartext: {
        fontSize: pxToDp(34),
        fontWeight: '200',
        color: '#181818',
    },
    sldlineStyle: {
        height: 1,
        backgroundColor: '#000',
    },
    sld_like_part_right: {
        flexDirection: 'column',
        width: Dimensions.get('window').width * 1 - pxToDp(240),
    },
    sld_like_part_title: {
        fontSize: pxToDp(30),
        color: '#333',
        height: pxToDp(42),
        lineHeight: pxToDp(42),
        paddingRight: pxToDp(30),
    },
    sld_like_part_chuildtitle: {
        marginTop: pxToDp(10),
        fontSize: pxToDp(26),
        color: '#666',
        height: pxToDp(36),
        lineHeight: pxToDp(36),

    },
    sld_like_part_price: {
        fontSize: pxToDp(36),
        color: '#ba1418',
        position: 'relative',
        bottom: -pxToDp(30),
    },
    sld_like_part_cancle_col: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#707070',
        color: '#333',
        width: pxToDp(160),
        height: pxToDp(64),
        lineHeight: pxToDp(64),
        textAlign: 'center',
        marginRight: pxToDp(20),
        fontSize: pxToDp(28),
        marginTop: pxToDp(20),
    },
    sld_like_part_list: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        paddingRight: pxToDp(30),
        backgroundColor: '#fff',
        paddingTop: pxToDp(30),
    },
    sld_like_part_img: {
        width: pxToDp(180),
        height: pxToDp(180),
        marginRight: pxToDp(20),
        marginLeft: pxToDp(20),
    },

    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    item: {
        flexDirection: 'row',
    },
    sldcanclepart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emptypart: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topic: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: pxToDp(30),
    },

    topicHead: {
        fontSize: pxToDp(34),
        color: '#181818',
        padding: pxToDp(32),
        paddingLeft: 0,
    },
    topicItem: {
        width: pxToDp(210),
        marginLeft: pxToDp(30),
    },
    topicImg: {
        width: pxToDp(210),
        height: pxToDp(210),
        borderColor: 'red',
        borderRadius: 2,
    },
    topicContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: pxToDp(20),
    },
    topicTitle: {
        fontSize: pxToDp(30),
        color: '#141414',
        width: pxToDp(210),
        marginTop: pxToDp(34),
    },
    topicDesc: {
        fontSize: pxToDp(30),
        color: '#ba1418',
        marginTop: pxToDp(24),
    },
    goods_recommond: {
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: pxToDp(34),
        color: '#181818',
        height: pxToDp(100),
        lineHeight: pxToDp(100),
    },
    sld_zero_part_img: {
        width: pxToDp(330),
        height: pxToDp(330),
    },
    sld_zero_part_last: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sld_zero_part_title: {
        width: pxToDp(330),
        fontSize: pxToDp(32),
        color: '#181818',
    },
    sld_zero_part_chuildtitle: {
        width: pxToDp(280),
        fontSize: pxToDp(26),
        color: '#967d56',
        overflow: 'hidden',
        height: pxToDp(30),
        lineHeight: pxToDp(30),
        marginTop: pxToDp(10),
    },
    sld_zero_part_price: {
        color: '#ba1418',
        fontSize: pxToDp(34),
        marginTop: pxToDp(20),
    },
    sld_zero_part_list: {
        width: pxToDp(330),
        flexDirection: 'column',
        marginLeft: pxToDp(30),
    },
    sld_two_img: {
        flexDirection: 'row',
    },
    sld_home_zero_list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sld_home_two_img: {
        width: Dimensions.get('window').width / 2,
        height: pxToDp(176),
    },
    sld_rec_style: {
        height: pxToDp(134),
        lineHeight: pxToDp(134),
        color: '#999',
    },
});






