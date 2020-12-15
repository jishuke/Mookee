import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import pxToDp from "../../util/pxToDp";
import Swiper from 'react-native-swiper';
import RequestData from "../../RequestData";
import ViewUtils from '../../util/ViewUtils';
import {I18n} from './../../lang/index'
import PriceUtil from '../../util/PriceUtil'

var Dimensions = require('Dimensions');
export default class HomeMainComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            swiperData: [],//存放除首页之外的所有商品列表
            homeTimeLimitData: [],//首页限时购的数据
            homeBuyBackData: [],//首页买就返的数据
            homeRecommendData: [],//好物推荐
            countDownTime: {},//倒计时
            singleImg: '',//首页单张图片
            quantitle:{},//券满减标题图片
            quangoogslist:[],//券满减商品列表
            topictitle:{},//专题标题图片
            topicdata:[],//专题数据
	        diy_data:[],//存放所有的装修改数据
        }
    }

    componentWillMount() {
        this.getHomeInfo();
    }

    //获取首页装修数据
    getHomeInfo = () => {

        RequestData.getSldData(AppSldUrl + '/index.php?app=index')
            .then(result => {
                if (result.datas.error) {
                } else {
                    let datainfo = result.datas;
                    this.setState({
                        diy_data:datainfo
                    });
                    let lunboflag = 0;
                    let titlepicflag = 0;
                    let tuijiangoods = 0;
                    for (let i = 0; i < datainfo.length; i++) {
                        if (datainfo[i]['type'] == 'lunbo') {

                            if(lunboflag==0){
                                lunboflag = 1;
                                this.setState({
                                    swiperData: datainfo[i]['data'],
                                });
                            }else if(lunboflag == 1){
                                lunboflag =2;
                                this.setState({
                                    topicdata: datainfo[i]['data'],
                                });
                            }
                        }else if(datainfo[i]['type'] == 'tupianzuhe' && datainfo[i]['sele_style'] == 0){
                            if(titlepicflag == 1){
                                this.setState({
                                    quantitle: datainfo[i]['data'][0],
                                });
                            }else if(titlepicflag == 2){
                                this.setState({
                                    topictitle: datainfo[i]['data'][0],
                                });
                            }
                            titlepicflag ++;

                        }else if(datainfo[i]['type'] == 'tuijianshangpin'){
                            if(tuijiangoods == 0){
                                tuijiangoods ++;
                                this.setState({
                                    quangoogslist: datainfo[i]['data']['goods_info'],
                                });
                            }
                        }







                    }

                }
            })
            .catch(error => {
            })

        //获取猜你喜欢的数据
        RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getRecGoodsOP')
            .then(result => {
                if (result.datas.error) {
                } else {
                    this.setState({
                        homeRecommendData: result.datas.goods_list,
                    });
                }
            })
            .catch(error => {
            })

        //获取首页限时购的数据
        RequestData.getSldData(AppSldUrl + '/index.php?app=fan_list&mod=q_list&pagesize=3')
            .then(result => {
                if (result.datas.error) {
	                ViewUtils.sldToastTip(result.datas.error);
                } else {
                    let endtime = result.datas.menu.default_end_time_str;
                    this.setState({
                        homeTimeLimitData: result.datas.goods,
                        countDownTime: endtime,
                    });

                }
            })
            .catch(error => {
	            ViewUtils.sldToastTip(error);
            })
        //获取首页买就返数据
        RequestData.getSldData(AppSldUrl + '/index.php?app=fan_list&mod=fan_list&pagesize=50&key=' + key)
            .then(result => {
                if (result.datas.error) {
	                ViewUtils.sldToastTip(result.datas.error);
                } else {
                    this.setState({
                        homeBuyBackData: result.datas.goods,
                    });
                }
            })
            .catch(error => {
	            ViewUtils.sldToastTip(error);
            })
    }

    //进入商品详情页
    goGoodsDetail = (gid) => {
        this.props.navigation.navigate('GoodsDetailNew', {'gid': gid});
    }
    //黑卡会员权益页面
    goPage = (type) => {
        this.props.navigation.navigate(type);
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
        const {quantitle,quangoogslist,topictitle,topicdata} = this.state;
        return (<ScrollView>
            {typeof(this.state.swiperData) != 'undefined' && this.state.swiperData.length > 0 && (
                <Swiper
                    dot={<View style={GlobalStyles.swiper_dot}/>}
                    activeDot={<View style={GlobalStyles.swiper_activeDot}/>}
                    paginationStyle={{bottom:pxToDp(30)}}
                    style={GlobalStyles.swiper}
                    horizontal={true}
                    autoplay={true}>

                    {this.state.swiperData.map((val,index) => (
                        <TouchableOpacity key={index} activeOpacity={1} onPress={() => {
                            this.goDetailPage(val.url_type,val.url,val.title);
                        }}>
                        <Image resizeMode='cover' style={GlobalStyles.sld_home_banner}
                               source={{uri: val.img}} />
                        </TouchableOpacity>
                    ))}

                </Swiper>
            )}


            <View style={[styles.topic]}>
                <View style={[styles.goods_recommond, {height: 67}]}><Text
                    style={[styles.sld_rec_style, GlobalStyles.sld_global_font]}>...</Text><Text
                    style={[styles.topicHead, GlobalStyles.sld_global_font, {
                        paddingLeft: 16,
                        // paddingBottom: 20,
                        paddingTop: 25,
                    }]}>{I18n.t('com_SecondCatLIstComponent.Buy_it_back')}</Text><Text
                    style={[styles.sld_rec_style, GlobalStyles.sld_global_font]}>...</Text></View>

                <View style={styles.sld_home_zero_list}>

                    {this.state.homeBuyBackData.map(val => (
                        <TouchableOpacity activeOpacity={1}
                                          onPress={() => this.goGoodsDetail(val.gid)}
                                          key={val.gid}>
                            <View style={styles.sld_zero_part_list}>
                                <Image style={styles.sld_zero_part_img}
                                       source={{uri: val.goods_image_url}}/>

                                <Text ellipsizeMode='tail' numberOfLines={1}
                                      style={[styles.sld_zero_part_title, GlobalStyles.sld_global_font, {marginTop: 10}]}>{val.goods_name}</Text>
                                <Text
                                    style={[styles.sld_zero_part_chuildtitle, GlobalStyles.sld_global_font, {color: '#967d56'}]}>{val.goods_jingle}</Text>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                    <View>
                                        <Text
                                            style={styles.sld_zero_part_price}>ks{PriceUtil.formatPrice(val.show_price)}</Text></View>
                                    <View style={styles.sld_promotion_view}>
                                        <View
                                            style={[styles.sld_promotion_bg, {backgroundColor: '#b2a484'}]}><Text
                                            style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.Buy_it_back')}</Text></View>

                                    </View>
                                </View>

                            </View>
                        </TouchableOpacity>
                    ))}

                </View>
            </View>

            <View>
                <TouchableOpacity activeOpacity={1}
                                  onPress={() => this.goPage('BlackCardScreen')}>
                    <Image style={styles.sld_home_heika_img}
                           source={require('../../assets/images/home_heika_single.png')}
                    />
                </TouchableOpacity>
                <View style={styles.sld_two_img}>
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.goPage('InviteFriendAdv')}>
                        <Image style={styles.sld_home_two_img}
                               source={require('../../assets/images/sld_home_yaoqing_img.jpg')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.goPage('GetVoucher')}>
                        <Image style={styles.sld_home_two_img}
                               source={require('../../assets/images/sld_home_fuli_img.jpg')}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={GlobalStyles.space_shi_separate}/>
            <View style={styles.commontitleview}>
                <Image style={styles.commontitlepic} source={{uri: quantitle.img}}/>
            </View>
            <View style={styles.sld_home_zero_list}>

                {quangoogslist.map(val => (
                    <TouchableOpacity activeOpacity={1}
                                      onPress={() => this.goGoodsDetail(val.gid)}
                                      key={val.gid}>
                        <View style={styles.sld_zero_part_list}>
                            <Image style={styles.sld_zero_part_img}
                                   source={{uri: val.goods_image}}/>

                            <Text ellipsizeMode='tail' numberOfLines={1}
                                  style={[styles.sld_zero_part_title, GlobalStyles.sld_global_font, {marginTop: 10}]}>{val.goods_name}</Text>
                            <Text
                                style={[styles.sld_zero_part_chuildtitle, GlobalStyles.sld_global_font, {color: '#967d56'}]}>{val.goods_jingle}</Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                <View>
                                    <Text
                                        style={styles.sld_zero_part_price}>ks{PriceUtil.formatPrice(val.show_price)}</Text></View>
                            </View>

                        </View>
                    </TouchableOpacity>
                ))}

            </View>

            <View style={GlobalStyles.space_shi_separate}/>
            <View style={[styles.commontitleview]}>
                <Image style={[styles.commontitlepic,{marginBottom:10}]} source={{uri: topictitle.img}}/>
            </View>
            <View style={styles.topicdata}>
                {typeof(topicdata) != 'undefined' && topicdata.length > 0 && (
                    <Swiper
                        dot={<View style={{backgroundColor: 'transport'}}/>}
                        activeDot={<View style={{backgroundColor: 'transport'}}/>}
                        style={GlobalStyles.swiper}
                        horizontal={true}
                        autoplay={true}>
                        {topicdata.map((val,index) => (
                            <TouchableOpacity key={index} activeOpacity={1} onPress={() => {
                                this.goDetailPage(val.url_type,val.url,val.title);
                            }}>
                                <Image resizeMode='cover' style={styles.topicimg}
                                       source={{uri: val.img}} />
                                <Text style={[GlobalStyles.sld_global_font,styles.topictitle]}>{val.title}</Text>
                                <Text style={[GlobalStyles.sld_global_font,styles.topicdesc]}>{val.desc}</Text>
                            </TouchableOpacity>
                        ))}

                    </Swiper>
                )}
            </View>

            <View style={GlobalStyles.space_shi_separate}/>
            <View style={[styles.topic]}>
                <View style={[styles.goods_recommond, {height: 67}]}><Text
                    style={[styles.sld_rec_style, GlobalStyles.sld_global_fontfamliy]}>...</Text><Text
                    style={[styles.topicHead, GlobalStyles.sld_global_fontfamliy, styles.sldliketitle]}>{I18n.t('lihaoran.youlike')}</Text><Text
                    style={[styles.sld_rec_style, GlobalStyles.sld_global_fontfamliy]}>...</Text></View>

                {this.state.homeRecommendData.map(item => (
                    <TouchableOpacity activeOpacity={1} key={item.gid}
                                      onPress={() => this.goGoodsDetail(item.gid)}>
                        <View style={styles.sld_like_part_list}>
                            <Image style={styles.sld_like_part_img}
                                   source={{uri: item.goods_image_url}}/>
                            <View style={styles.sld_like_part_right}>
                                <Text numberOfLines={2}
                                      style={[styles.sld_like_part_title, GlobalStyles.sld_global_font]}>{item.goods_name}</Text>
                                <Text numberOfLines={2}
                                      style={[styles.sld_like_part_chuildtitle, GlobalStyles.sld_global_font]}>{item.goods_jingle}</Text>
                                <Text
                                    style={styles.sld_like_part_price}>ks{PriceUtil.formatPrice(item.show_price)}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}


            </View>
        </ScrollView>)
    }

}

const styles = StyleSheet.create({

    sld_zero_part_price_fanxian_cent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 7,
        flex: 1,
        alignItems: 'center',
    },
    sld_zero_part_price_fanxian_view: {
        flex: 1,
        height: 22,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d8d9c4',

    },
    sld_zero_part_price_fanxian: {
        color: '#786444',
        fontSize: 12,
    },
    sld_promotion_bg: {
        borderRadius: 2,
        backgroundColor: '#000',
        height: 15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
        marginLeft: 5
    },
    sld_promotion_view: {flexDirection: 'row', alignItems: 'flex-end'},
    sld_promotion_tag: {color: "#fff", fontSize: 10, margin: 2},
    sldliketitle: {
        paddingLeft: 16,
        paddingBottom: 20,
        paddingTop: 25,
        fontWeight: '400',
    },
    sld_zero_part_img: {
        width: (Dimensions.get('window').width * 1 - 45) / 2,
        height: (Dimensions.get('window').width * 1 - 45) / 2,
        borderColor: '#e5e5e5',
        borderWidth: 0.5,

    },
    sld_zero_part_last: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sld_zero_part_title: {
        width: (Dimensions.get('window').width * 1 - 45) / 2,
        fontSize: 16,
        color: '#333',
    },
    sld_zero_part_chuildtitle: {
        overflow: 'hidden',
        width: (Dimensions.get('window').width * 1 - 45) / 2 - 20,
        fontSize: 13,
        color: '#999',
        height: 18,
        marginTop: 5,
    },
    sld_zero_part_price: {
        color: '#ba1418',
        fontSize: 18,
        marginTop: 10,
    },
    sld_zero_part_list: {
        width: (Dimensions.get('window').width * 1 - 45) / 2,
        flexDirection: 'column',
        marginLeft: 15,
        marginBottom: 35,
    },
    sld_two_img: {
        flexDirection: 'row',
    },
    sld_home_zero_list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor:'#fff',
    },
    sld_home_two_img: {
        width: Dimensions.get('window').width / 2,
        height: 88,
    },
    sld_like_part_right: {
        flexDirection: 'column',
        height: 120,
        width: Dimensions.get('window').width * 1 - 165,

    },

    sld_like_part_title: {
        fontSize: 16,
        height: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1
    },
    sld_like_part_chuildtitle: {
        marginTop: 5,
        fontSize: 13,
        color: '#888',
        height: 36,
        paddingRight: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1

    },
    sld_like_part_price: {
        fontSize: 16,
        color: '#ba1418',
        position: 'relative',
        bottom: 0,
        fontWeight: '300',
    },
    sld_like_part_list: {
        flexDirection: 'row',
        width: Dimensions.get('window').width * 1 - 30,
        marginRight: 15,
        marginLeft: 15,
        marginBottom: 15,
    },
    sld_like_part_img: {
        width: 120,
        height: 120,
        marginRight: 15,
    },
    sld_home_view_more: {
        fontSize: 14,
        color: '#787878',
        alignItems: 'center',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    sld_home_xianshi_time_bg: {
        width: 25,
        height: 25,
        lineHeight: 25,
        color: '#fff',
        fontSize: 12,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        textAlign: 'center',

    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    item: {
        flexDirection: 'row',
    },
    leftimage: {
        width: 50,
        height: 50,
    },
    sld_mem_top_bg: {
        width: Dimensions.get('window').width,
        height: 180,
        backgroundColor: '#2c2c2c'
    },

    sld_center_combine: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        paddingBottom: 20,
    },
    sld_home_heika_img: {
        // 设置宽度
        width: Dimensions.get('window').width,
        // 设置高度
        height: 110,
        // 设置图片填充模式
        resizeMode: 'cover'
    },
    topic: {
        flexDirection: 'column',
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10,
    },

    topicHead: {
        fontSize: 17,
        color: '#333',
        padding: 16,
        paddingLeft: 0,
    },
    topicItem: {
        width: pxToDp(210),
    },
    topicImg: {
        width: pxToDp(210),
        height: pxToDp(210),
    },
    topicContainer: {
        flexDirection: 'column',
        marginTop: 10,
        width: pxToDp(210),
        height: pxToDp(210),
        marginLeft: pxToDp(30),
    },
    topicTitle: {
        fontSize: 15,
        color: '#141414',
        marginTop: 17,
    },
    topicDesc: {
        fontSize: 15,
        color: '#ba1418',
        marginTop: 12,
    },
    goods_recommond: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
    },
    sld_rec_style: {
        height: 67,
        lineHeight: 67,
        color: '#bfbfbf',
        letterSpacing: 2,
        fontWeight: '400',
    },
    sld_xianshi_time_bg: {
        width: 25,
        height: 25,
    },
    sld_xianshi_wrap: {
        position: 'relative',
        marginBottom: 15,
        marginTop: 13,
    },
    sld_home_xianshi_tip: {
        paddingLeft: 4,
        paddingRight: 4,
        color: '#999',
        marginTop: 16,
    },
    homeSldLogo: {
        width: 22,
        height: 22,
    },
    homelogoimg: {
        width: 30,
        height: 30,
    },
    homelogo: {
        width: 65,
        paddingLeft: 17,
    },
    /*通用分类样式*/
    commontitlepic:{
        width:Dimensions.get('window').width,
        height:pxToDp(60),
    },
    commontitleview:{
        flexDirection:'column',
        justifyContent:'center',
        backgroundColor:'#fff',
        height:pxToDp(100),
    },
    topicswiper:{
        flexDirection:'row',
        justifyContent:'center',
        width:Dimensions.get('window').width-pxToDp(60),
        height:191,
        backgroundColor:'#fff',

    },
    topicdata:{width:Dimensions.get('window').width * 1,paddingLeft:pxToDp(20),height:pxToDp(590),backgroundColor:'#fff',flexDirection:'row',},
    topicimg:{width:Dimensions.get('window').width * 1-pxToDp(40),height:pxToDp(452),marginBottom:10},
    topictitle:{color:'#333',fontSize:pxToDp(30),lineHeight:pxToDp(50)},
    topicdesc:{color:'#999',fontSize:pxToDp(26),lineHeight:pxToDp(50)},
});
