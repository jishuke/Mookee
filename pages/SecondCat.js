/*
* 二级分类页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from '../component/NavigationBar';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import ScrollableTabView , { ScrollableTabBar, DefaultTabBar } from "react-native-scrollable-tab-view";
import pxToDp from "../util/pxToDp";

import SecondCatLIstComponent from "../component/SecondCatLIstComponent";
var Dimensions = require('Dimensions');
export default class SecondCat extends Component {
    constructor(props) {
        super(props);
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
        }
    }
    componentWillMount() {
        let navigation = this.props.navigation;
        this.setState({
            navigation:navigation,
            routeName:navigation.state.routeName
        });
        if (navigation.state.params.catid) {
            this.setState({
                cattagid: navigation.state.params.catid
            });
            //获取分类信息
            this.getCatDetailInfo(navigation.state.params.catid);
        }
        this.getShowLikeList();
    }

    //获取猜你喜欢的数据
    getShowLikeList = () => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getRecGoodsOP')
            .then(result => {
                if (result.datas.error) {
	                ViewUtils.sldToastTip(result.datas.error);
                } else {
                    this.setState({
                        showLikePartData: result.datas.goods_list,
                    });
                }
            })
            .catch(error => {
                ViewUtils.sldErrorToastTip(error);
            })
    }
    //获取分类标签信息
    getCatDetailInfo = (catid,type='') => {
        RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=goods_tag_list&id='+catid+'&pn='+this.state.pn+'&page='+this.state.page)
            .then(result => {
                if (result.datas.error) {
	                ViewUtils.sldToastTip(result.datas.error);
                } else {
                    let pn = this.state.pn;
                    let initpage = 0;
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
                ViewUtils.sldErrorToastTip(error);
            })
    }
    //进入商品详情页
    goGoodsDetail=(gid)=>{
        this.props.navigation.navigate('GoodsDetailNew',{'gid':gid});
    }
    //flatlist分隔组件
    separatorComponent = () => {
        return (
            <View style={styles.newline}/>
        );
    }
    //下拉刷新
    onRefresh = () => {
        this.setState({
            refresh: true,
            pn:1,
        });
        this.getCatDetailInfo(this.state.cattagid,'reset');
        this.setState({
            refresh: false,
        });
    }
    //上拉加载
    // getNewData = () => {
    //     const {pn, ishasmore} = this.state;
    //     if (ishasmore) {
    //         this.getCatDetailInfo(this.state.cattagid, pn);
    //     }
    // }
    //导航左边图标
    renSldLeftButton(image){
        return <TouchableOpacity
            activeOpacity={1}
            onPress={()=>{
                this.props.navigation.goBack();
            }}>
            <View style={GlobalStyles.topBackBtn}>
                <Image style={GlobalStyles.topBackBtnImg} source={image}></Image>
            </View>
        </TouchableOpacity>;
    }
    //导航右边搜索图标
    renSldRightButton(image){
        return <TouchableOpacity
            activeOpacity={1}
            onPress={()=>{
                this.props.navigation.navigate('SearchPage');
            }}>
            <Image style={{width:22,height:22,marginRight:15}} source={image}></Image>
        </TouchableOpacity>;
    }
    render() {

        let {goods_list,types,initpage} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <NavigationBar
                    statusBar={{barStyle: 'default'}}
                    leftButton={this.renSldLeftButton(require('../assets/images/goback.png'))}
                    title={this.state.tag_info.tag_name}
                    popEnabled={false}
                    rightButton={this.renSldRightButton(require('../assets/images/searchbar.png'))}
                    style={{backgroundColor:'#fff'}}
                />


                <ScrollableTabView
                    style={{borderBottomWidth:0,borderColor:'#dadada',}}
                    page={initpage*1}
                    tabBarPosition='top'
                    renderTabBar={() => <ScrollableTabBar/>}
                    tabBarBackgroundColor='#fff'
                    tabBarActiveTextColor='#E67F11'
                    tabBarInactiveTextColor='#333'
                    tabBarTextStyle={[{fontSize: pxToDp(30)},GlobalStyles.sld_global_font]}
                    tabBarUnderlineStyle={styles.tabBarUnderline}
                    onChangeTab={(obj) => {
                        let tagid = types[obj.i].id;
                    }}
                >

                    {
                        types.map((item, index) => {
                            return (<SecondCatLIstComponent tabLabel={item.tag_name}  key={index}  navigation={this.props.navigation} id={item.id} position={index}/>)
                        })
                    }
                </ScrollableTabView>



            </View>
        )
    }
}
const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
    sld_promotion_bg:{borderRadius:2,backgroundColor:'#000',height:15,flexDirection:'column',justifyContent:'center',alignItems:'center',marginBottom:2,marginLeft:5},
    sld_promotion_view:{flexDirection:'row',alignItems:'flex-end'},
    sld_promotion_tag: {color:"#fff",fontSize:10,margin:2},
    tabBarUnderline:{
        backgroundColor: '#E67F11',
        height: 2,
    },
    sld_home_searchbar:{
        marginTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT:0,
    },
    sld_home_search:{
        width:200,
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
    },
    sldtabbartext:{
        fontSize:17,
        fontWeight:'200',
        color:'#181818',
    },
    sldlineStyle:{
        height: 1,
        backgroundColor: '#000',
    },
    sld_like_part_right:{
        flexDirection:'column',
        width:Dimensions.get('window').width*1-120,
    },
    sld_like_part_title:{
        fontSize:16,
        color:'#333',
        height:21,
        lineHeight:21,
        paddingRight:15,
        marginTop:10
    },
    sld_like_part_chuildtitle:{
        marginTop:5,
        fontSize:13,
        color:'#666',
        height:18,
        lineHeight:18,
        paddingRight:15,

    },
    sld_like_part_price:{
        fontSize:18,
        color:'#ba1418',
        position:'relative',
        bottom:-10,
    },
    sld_like_part_cancle_col:{
        borderRadius:4,
        borderWidth:0.5,
        borderColor:'#e5e5e5',
        color:'#666',
        width:70,
        textAlign:'center',
        marginTop:14,
        marginRight:10,
        fontSize:12,
    },
    sld_like_part_list:{
        flexDirection:'row',
        width:Dimensions.get('window').width,
        paddingRight:15,
        backgroundColor:'#fff',
        paddingTop:10,
        paddingBottom:10,
    },
    sld_like_part_img:{
        width:90,
        height:90,
        marginRight:10,
        marginLeft:10,
    },


    item: {
        flexDirection:'row',
    },
    sldcanclepart:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    emptypart:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    topic: {
        width:Dimensions.get('window').width,
        alignItems:'center',
        backgroundColor: '#fff',
        paddingBottom:10,
    },

    topicHead:{
        fontSize:17,
        color:'#181818',
        padding:16,
        paddingLeft:0,
    },
    topicItem: {
        width: 105,
        marginLeft:15,
    },
    topicImg: {
        width: 105,
        height: 105,
        borderColor:'red',
        borderRadius:2,
    },
    topicContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop:10,
    },
    topicTitle:{
        fontSize:15,
        color:'#141414',
        width:105,
        marginTop:17,
    },
    topicDesc:{
        fontSize:15,
        color:'#ba1418',
        marginTop:12,
    },
    goods_recommond:{
        flexDirection:'row',
        justifyContent:'center',
        fontSize:17,
        color:'#333',
        height:50,
        lineHeight:50,
    },
    sld_zero_part_img:{
        width: (Dimensions.get('window').width * 1 - 45)/2,
        height: (Dimensions.get('window').width * 1 - 45)/2,
    },
    sld_zero_part_last:{
        flexDirection:'row',
        justifyContent:'space-between',
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
    sld_two_img:{
        flexDirection:'row',
    },
    sld_home_zero_list:{
        flexDirection:'row',
        flexWrap:'wrap',

    },
    sld_home_two_img:{
        width:Dimensions.get('window').width/2,
        height:88,
    },
    sld_rec_style:{
        height:67,
        lineHeight:67,
        color:'#999',
    },
});
