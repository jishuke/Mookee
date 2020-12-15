/*
* 收藏商品列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    FlatList,
    Alert,
    Image,
    TouchableOpacity,ScrollView
} from 'react-native';
import pxToDp from "../util/pxToDp";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

var Dimensions = require('Dimensions');
const rows = 10;
export default class FootPrint extends Component {
    constructor(props){
        super(props);
        this.state={
            foorprint:[],
            sldtoken:'',
            pn:1,
            ishasmore:false,
            refresh:false,
            showLikePart:false,
            showLikePartData: [],//猜你喜欢的数据
        }
    }
    componentWillMount() {
        if(key){
	        //获取收藏的数据
	        this.initPage(key,1);
	        this.getRecommnd();
        }else{
	        //没有找到的情况下应该跳转到登录页
	        this.props.navigation.navigate('Login');
        }

    }


    componentDidMount() {
        this.props.navigation.addListener("willFocus", payload => {
            if(key){
                this.initPage(key,1);
            }
        });
    }
    /*
     * 在组件销毁的时候要将其移除
     * */
    componentWillUnmount(){
        // DeviceEventEmitter.remove();
    };

	getRecommnd = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getRecGoodsList&key='+key)
			.then(result => {
				if(result.code==200){
					this.setState({
						showLikePartData:result.datas.goods_list
					});
				}
			})
			.catch(error => {
                ViewUtils.sldErrorToastTip(error);
			})
	}

    initPage = (key,curpage,type=0) => {
        RequestData.postSldData(AppSldUrl+'/index.php?app=usercenter&mod=getUserFootorList',{key:key,rows:rows,pn:curpage})
            .then(result=>{
                if(result.datas.error){
	                ViewUtils.sldToastTip(result.datas.error);
                }else{
                    let pn = this.state.pn;
                    let ishasmore = this.state.ishasmore;
                    if(result.hasmore){
                        pn = pn + 1;
                    }
                    ishasmore = result.hasmore;
                    if(result.datas.browse_history.length == 0){
                        this.setState({showLikePart:true});
                    }else{
                        let footprint = this.state.foorprint;
                        if(type == 'reset'||curpage ==1){
                            footprint = result.datas.browse_history;
                        }else{
                            footprint = footprint.concat(result.datas.browse_history);
                        }

                        this.setState({
                            foorprint:footprint,
                            pn:pn,
                            ishasmore:ishasmore,
                            showLikePart:false,
                        });
                    }

                }
            })
            .catch(error=>{
                ViewUtils.sldErrorToastTip(error);
            })
    }

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
    //进入商品详情页
    goGoodsDetail=(gid)=>{
        this.props.navigation.navigate('GoodsDetailNew',{'gid':gid});
    }
    //清空历史足迹操作
    sldClearFoorPrint=()=>{
        if(this.state.foorprint.length > 0){
            Alert.alert(
                '',
                I18n.t('FootPrint.text1'),
                [
                    {text:I18n.t('ok'),onPress:(()=>{this.clearFoot()})},
                    {text:I18n.t('cancel'),onPress:(()=>{}),style:'cancle'}
                ]
            );

        }else{
	        ViewUtils.sldToastTip(I18n.t('FootPrint.text2'));
        }
    }

    //清空用户足迹
    clearFoot = () => {
        RequestData.postSldData(AppSldUrl+'/index.php?app=usercenter&mod=delFooter',{key:key,gid:'all'})
            .then(result=>{
                if(result.datas.error){
	                ViewUtils.sldToastTip(error);
                }else{
	                ViewUtils.sldToastTip(I18n.t('FootPrint.text3'));
                    this.setState({
                        foorprint:[],
                        showLikePart:true,
                    });
                }
            })
            .catch(error=>{
                ViewUtils.sldErrorToastTip(error);
            })
    }

    renSldRightButton(image){
        return <TouchableOpacity
            activeOpacity={1}
            onPress={()=>{
                this.sldClearFoorPrint();
            }}>
            <Text style={styles.clear}>{I18n.t('Empty')}</Text>
        </TouchableOpacity>;
    }
    //头部组件
    headerComponet =()=>{
        return (
            <Image style={{width:100,height:100}} source={require('../assets/images/logo.png')}/>
        );
    }
    //flatlist分隔组件
    separatorComponent=()=>{
        return (
            <View style={GlobalStyles.newline}/>
        );
    }
    //下拉刷新
    onRefresh = () => {
        this.setState({
            refresh:true,
        });
        this.initPage(key,1,'reset');
        this.setState({
            refresh:false,
        });
    }
    //上拉加载
    getNewData = () => {
        const { pn,ishasmore} = this.state;
        if(ishasmore){
            this.initPage(key,pn);
        }
    }

	left_event = () => {
		this.props.navigation.goBack();
  }
	right_event = () => {
		this.sldClearFoorPrint();
	}

    render() {
	    const {showLikePartData} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader title={I18n.t('FootPrint.MyTracks')} left_icon={require('../assets/images/goback.png')} left_event={() =>this.left_event()} right_type='text' right_event={() =>this.right_event()} right_text={I18n.t('Empty')} right_style={styles.clear}/>
                <View style={GlobalStyles.line}/>

                <FlatList
                    style={{marginTop:10}}
                    onRefresh={()=>this.onRefresh()}
                    refreshing={this.state.refresh}
                    onEndReachedThreshold={0.3}
                    onEndReached={()=>this.getNewData()}
                    ItemSeparatorComponent={()=>this.separatorComponent()}
                    data={this.state.foorprint}
                    renderItem={({item}) =>
                        <View style={[styles.topic]}>
                            <TouchableOpacity activeOpacity={1}
                                onPress={()=>this.goGoodsDetail(item.gid)}>
                            <View style={styles.sld_like_part_list}>
                                    <Image style={styles.sld_like_part_img} source={{uri:item.goods_image}}/>

                                <View style={styles.sld_like_part_right}>
                                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.sld_like_part_title,GlobalStyles.sld_global_font]}>{item.goods_name}</Text>
                                    <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.sld_like_part_chuildtitle,GlobalStyles.sld_global_font]}></Text>
                                    <View style={styles.sldcanclepart}>
                                        <Text style={styles.sld_like_part_price}>ks{PriceUtil.formatPrice(item.show_price*1)}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                        </View>}
                />
	            <ScrollView style={{display:this.state.showLikePart?'flex':'none'}}>
		            <View style={[styles.emptypart,]}>
			            <Image style={{width:50,height:50,marginTop:50}} source={require('../assets/images/emptysldcollect.png')}/>
			            <Text style={[{color:'#999'},{marginTop:10},{marginBottom:50},GlobalStyles.sld_global_font]}>{I18n.t('FootPrint.text2')}</Text>
		            </View>
		            <View style={{height:pxToDp(80),flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#fff',paddingLeft:15,}}><Text style={{color:'#333',fontSize:pxToDp(30)}}>{I18n.t('CollectGoods.hot')}
</Text></View>
		            <View style={GlobalStyles.line}/>
		            <View style={{flexDirection:"row",flexWrap:'wrap',backgroundColor:'#fff',paddingBottom:pxToDp(140)}}>
			            {showLikePartData.map((item, index) => {
				            return (<TouchableOpacity key={index} activeOpacity={1} style={styles.sld_zero_part_list} onPress={() => this.goGoodsDetail(item.gid)}>
					            <Image style={styles.sld_zero_part_img} source={{uri: item.goods_img_url}}/>
					            <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.sld_zero_part_title,GlobalStyles.sld_global_font]}>{item.goods_name}</Text>

					            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"flex-end",}}>
						            <Text style={styles.sld_zero_part_price}>ks{PriceUtil.formatPrice(item.show_price)}</Text>
					            </View>
				            </TouchableOpacity>)
			            })}
		            </View>
	            </ScrollView>

	            <View style={GlobalStyles.iphoneXbottomheight} />
            </View>
        )
    }
}
const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
    newline:{
        height: 0.5,
        marginLeft:15,
        marginRight:15,
        width:Dimensions.get('window').width*1-30,
        borderColor:'#ebebeb',
    },
    clear:{
        marginRight:15,
        color:'#333',
        fontSize:14
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
        fontSize:15,
        color:'#333',
        height:21,
        lineHeight:21,
        paddingRight:15,
        marginTop:6
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
        paddingTop:15,
    },
    sld_like_part_img:{
        width:90,
        height:90,
        marginRight:10,
        marginLeft:10,
        borderColor:'#ebebeb',
        borderWidth:0.5,
        borderStyle:'solid',
    },


    item: {
        flexDirection:'row',
    },
    // topic: {
    //     width:Dimensions.get('window').width,
    //     alignItems:'center',
    // },
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
        color:'#181818',
        height:50,
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
	    fontSize:pxToDp(30),
	    height:pxToDp(110),
	    lineHeight:pxToDp(55),
	    color:'#333',
    },
    sld_zero_part_chuildtitle:{
        width:140,
        fontSize:13,
        color:'#967d56',
        overflow:'hidden',
        height:15,
        lineHeight:15,
        marginTop:5,
    },
    sld_zero_part_price:{
	    color:'#ba1418',
	    fontSize:pxToDp(36),
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
