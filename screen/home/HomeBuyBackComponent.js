import React, {Component} from 'react';
import {Text, View, ScrollView, Image, TouchableOpacity, Dimensions} from 'react-native';
import GlobalStyles from "../../assets/styles/GlobalStyles";
import pxToDp from "../../util/pxToDp";
import HomeSNew from "../../pages/stylejs/HomeSNew";
import Swiper from 'react-native-swiper';
import RequestData from "../../RequestData";
import ViewUtils from '../../util/ViewUtils';
import PriceUtil from '../../util/PriceUtil'
import {I18n} from './../../lang/index'

export default class HomeBuyBackComponent extends Component {


    constructor(props) {
        super(props)
        this.state = {
            goodsLists: [],//存放除首页之外的所有商品列表
            swiperData: [],//首页轮播数据
        }
    }

    componentDidMount() {
        //获取买就返轮播数据
        this.getZhuangXiuLunBo('maijiafan')
        //获取买就返列表数据
        this.getMaijiuFanData();
    }

    //进入商品详情页
    goGoodsDetail = (gid) => {
        this.props.navigation.navigate('GoodsDetailNew', {'gid': gid});
    }

    //获取买就返选项卡的数据（商品列表）
    getMaijiuFanData = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=fan_list&mod=load_page&t=f&pagesize=100&pn=1')
            .then(result => {
                if (result.datas.error) {
                } else {
                    this.setState({
                        goodsLists: result.datas.goods,
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
	                ViewUtils.sldToastTip(result.datas.error);
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


    render() {
        return (<ScrollView>
            {this.state.swiperData != '' && typeof(this.state.swiperData) != 'undefined' && this.state.swiperData.length > 0 && (
                <Swiper
                    dot={<View style={GlobalStyles.swiper_dot}/>}
                    activeDot={<View style={GlobalStyles.swiper_activeDot}/>}
                    style={GlobalStyles.swiper}
                    horizontal={true}
                    autoplay={true}>

                    {this.state.swiperData.map((val,index) => (

                        <Image resizeMode='cover' key={index}
                               style={{
                                   height: pxToDp(300),
                                   width: Dimensions.get('window').width - pxToDp(80),
                                   marginLeft: pxToDp(40),
                                   paddingTop: pxToDp(40),
                                   paddingBottom: pxToDp(90),
                               }}
                               source={{uri: val.img}}/>
                    ))}

                </Swiper>
            )}

            <View style={HomeSNew.listView}>
                {this.state.goodsLists.length > 0 && (

                    this.state.goodsLists.map((val,index) => (
                        <View style={HomeSNew.listViewItem} key={val.gid}>
                            <Image style={HomeSNew.listItemImg}
                                   source={{uri: val.goods_image_url}}/>

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
                                            <Text
                                                style={HomeSNew.listRightBuyText}>{I18n.t('GoodsBundling.Buynow')}</Text>
                                        </View>
                                    </TouchableOpacity>


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
