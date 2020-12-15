import React, {Component} from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import pxToDp from "../../util/pxToDp";
import HomeSNew from "../../pages/stylejs/HomeSNew";
import Swiper from 'react-native-swiper';
import RequestData from "../../RequestData";
import {I18n} from './../../lang/index'
import PriceUtil from '../../util/PriceUtil'

var Dimensions = require('Dimensions');
export default class HomeTimeLimitComponent extends Component {


    constructor(props) {
        super(props)
        this.state = {
            goodsList: [],//存放除首页之外的所有商品列表
            swiperData: [],//首页轮播数据
            xianshimenu: {},//限时折扣menu
        }
    }

    componentDidMount() {
        //获取买就返列表数据
        this.getXianShiData();
        this.getZhuangXiuLunBo('maijiafan')
    }

    //获取限时购数据
    getXianShiData = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=fan_list&mod=load_page&t=f&pagesize=100&pn=1')
            .then(result => {
                if (result.datas.error) {
                } else {
                    this.setState({
                        goodsList: result.datas.goods,
                        xianshimenu: result.datas.menu,
                    });
                }
            })
            .catch(error => {
            })
    }

    //获取装修轮播
    getZhuangXiuLunBo = (type) => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=topic&activity_type=' + type)
            .then(result => {
                if (result.datas.error) {
                } else {
                    let datainfo = result.datas;
                    for (let i = 0; i < datainfo.length; i++) {
                        if (datainfo[i]['type'] == 'lunbo') {
                            this.setState({
                                swiperData: datainfo[i]['data'],
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

                        this.state.goodsList.map((val,index) => (
                            <View key={val.gid}>
                                <View style={HomeSNew.listViewItem}>
                                    <Image style={HomeSNew.listItemImg} source={{uri: val.goods_image_url}}/>

                                    <View style={HomeSNew.listItemRight}>
                                        <Text numberOfLines={2}
                                              style={[HomeSNew.listRightTitle, GlobalStyles.sld_global_font]}>{val.goods_name}</Text>
                                        <View style={{marginTop: pxToDp(10)}}>
                                            <Text numberOfLines={2}
                                                  style={[HomeSNew.listRightSubTitle, GlobalStyles.sld_global_font]}>{val.goods_jingle}</Text>
                                        </View>
                                        <Text
                                            style={[HomeSNew.listRightPrice, GlobalStyles.sld_global_font]}>ks{PriceUtil.formatPrice(val.show_price)}</Text>
                                        <View style={HomeSNew.listRightWrap}>
                                            <Text
                                                style={[HomeSNew.listRightTag, GlobalStyles.sld_global_font]}>{I18n.t('com_SecondCatLIstComponent.Buy_it_back')}&nbsp;ks{PriceUtil.formatPrice(val.show_price)}</Text>

                                            <TouchableOpacity activeOpacity={1}
                                                              onPress={() => this.goGoodsDetail(val.gid)}>
                                                <View style={HomeSNew.listRightBuy}>
                                                    <Text style={HomeSNew.listRightBuyText}>{I18n.t('GoodsBundling.Buynow')}</Text>
                                                </View>
                                            </TouchableOpacity>


                                        </View>
                                    </View>
                                </View>
                                <View style={GlobalStyles.leftline}/>
                            </View>
                        ))


                    )}
                </View>
            </ScrollView>)
    }

}






