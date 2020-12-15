import React, {Component} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image, StyleSheet} from 'react-native';
import GlobalStyles from "../assets/styles/GlobalStyles";
import RequestData from "../RequestData";
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

var Dimensions = require('Dimensions');
export default class SecondCatLIstComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sldCardData: [],
            showLikePart: true,//当数据为空时展示
            showLikePartData: [],//猜你喜欢的数据
            navigation: '',
            cattagid: 0,//分类标签id
            page: 100,
            pn: 1,
            goods_list: [],//相应分类下的商品列表
            tag_info: {},//标签信息
            types: [],//顶部分类
            initpage:0,//初始化tab
            refresh: false,
            empty:false,//数据为空时展示
            catid:this.props.id,
        }
    }

    componentWillMount() {
        this.getCurrentIdInfo(this.state.catid);
    }

    //根据分类id获取当前id下的数据
    getCurrentIdInfo = (catid) => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=goods_tag_list&id='+catid+'&pn='+this.state.pn+'&page='+this.state.page)
            .then(result => {
                if (result.datas.error) {
                    this.refs.toast.show(result.datas.error);
                } else {
                    let pn = this.state.pn;
                    let initpage = this.state.initpage;
                    for(var i in result.datas.types){
                        if(result.datas.types[i].id == catid){
                            initpage = i;
                        }
                    }
                    if (result.hasmore) {
                        pn = pn + 1;
                    }
                    let goods_list = this.state.goods_list;
                    let empty='';
                    if(goods_list.length==0){
                        empty = true;
                    }else{
                        empty = false;
                    }
                    goods_list = result.datas.goods_list;
                    this.setState({
                        goods_list: goods_list,
                        tag_info: result.datas.tag_info,
                        types: result.datas.types,
                        initpage:initpage,
                        ishasmore:result.hasmore,
                        pn:pn,
                        empty:empty,
                    });
                }
            })
            .catch(error => {
                this.refs.toast.show(error);
            })
    }

    //进入商品详情页
    goGoodsDetail=(gid)=>{
        this.props.navigation.navigate('GoodsDetailNew',{'gid':gid});
    }

    render() {
        const {goods_list} = this.state;
        return (
            <View>
                {goods_list.length>0&&(
                    <ScrollView>
                        <View>
                            <View style={GlobalStyles.space_shi_separate}/>

                            <View style={[styles.topic]}>

                                <View style={styles.sld_home_zero_list}>
                                    {goods_list.map((item,index) => (
                                        <TouchableOpacity activeOpacity={1} key={index} onPress={() => this.goGoodsDetail(item.gid)}>
                                            <View style={styles.sld_zero_part_list}>
                                                <Image
                                                  style={styles.sld_zero_part_img} source={{uri: item.goods_image_url}}
                                                  defaultSource={require('../assets/images/default_icon_124.png')}
                                                />

                                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.sld_zero_part_title,GlobalStyles.sld_global_font]}>{item.goods_name}</Text>
                                                <Text  numberOfLines={1}  style={[styles.sld_zero_part_chuildtitle,GlobalStyles.sld_global_font]}>{item.goods_jingle}</Text>
                                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                    <View>
                                                        <Text style={styles.sld_zero_part_price}>ks{PriceUtil.formatPrice(item.show_price)}</Text></View>
                                                    <View style={styles.sld_promotion_view}>
                                                        {typeof (item.promotion_type)!='undefined'&&item.promotion_type=='tuan'&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#d56f44'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.group_purchase')}</Text></View>
                                                        )}

                                                        {typeof (item.promotion_type)!='undefined'&&item.promotion_type=='xianshi'&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#f4af5f'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.LIMITED')}</Text></View>
                                                        )}

                                                        {typeof (item.promotion_type)!='undefined'&&item.promotion_type=='pin_tuan'&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#e66a3d'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.group_booking')}</Text></View>
                                                        )}


                                                        {typeof (item.promotion_type)!='undefined'&&item.promotion_type=='pin_tuan'&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#77bdeb'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.Phone_Exclusive')}</Text></View>
                                                        )}

                                                        {typeof (item.promotion_type)!='undefined'&&item.promotion_type=='zero_area'&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#b2a484'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.Buy_it_back')}</Text></View>
                                                        )}

                                                        {typeof (item.promotion_type)!='undefined'&&item.promotion_type=='man_song'&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#f17573'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.consumption')}</Text></View>
                                                        )}

                                                        {item.plus_buy==1&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#191919'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.Exclusive_black_card')}</Text></View>
                                                        )}

                                                        {typeof (item.promotion_type)!='undefined'&&((item.promotion_type == 'zero_area' || item.promotion_type == '' || item.promotion_type == 'man_song') && item.plus_buy == 2)&&(
                                                            <View style={[styles.sld_promotion_bg,{backgroundColor:'#191919'}]}><Text style={styles.sld_promotion_tag}>{I18n.t('com_SecondCatLIstComponent.black_card_price')}</Text></View>
                                                        )}




                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>


                            </View></View>
                    </ScrollView>

                )}



            </View>
        )
    }

}

const styles = StyleSheet.create({
    sld_promotion_bg:{borderRadius:2,backgroundColor:'#000',height:15,flexDirection:'column',justifyContent:'center',alignItems:'center',marginBottom:2,marginLeft:5},
    sld_promotion_view:{flexDirection:'row',alignItems:'flex-end'},
    sld_promotion_tag: {color:"#fff",fontSize:10,margin:2},
    topic: {
        width:Dimensions.get('window').width,
        alignItems:'center',
        backgroundColor: '#fff',
        paddingBottom:10,
        flexDirection:'row',
        justifyContent:'flex-start'

    },
    sld_zero_part_img:{
        width: (Dimensions.get('window').width * 1 - 45)/2,
        height: (Dimensions.get('window').width * 1 - 45)/2,
    },
    sld_zero_part_title:{
        width: (Dimensions.get('window').width * 1 - 45)/2,
        fontSize:16,
        height:36,
        lineHeight:36,
        color:'#333',
    },
    sld_zero_part_chuildtitle:{
        width:(Dimensions.get('window').width * 1 - 45)/2-20,
        fontSize:13,
        color:'#E67F11',
        overflow:'hidden',
        height:28,
    },
    sld_zero_part_price:{
        color:'#ba1418',
        fontSize:18,
    },
    sld_zero_part_list:{
        width:(Dimensions.get('window').width * 1 - 45)/2,
        flexDirection:'column',
        marginLeft:15,
        marginTop:15,
        marginBottom:15,
    },
    sld_home_zero_list:{
        flexDirection:'row',
        flexWrap:'wrap',

    },
});

