import {StyleSheet} from "react-native";

var Dimensions = require('Dimensions');
const HomeSNewCommon = StyleSheet.create({
    listView: {
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    sld_promotion_bg:{borderRadius:2,backgroundColor:'#000',height:15,flexDirection:'column',justifyContent:'center',alignItems:'center',marginBottom:2,marginLeft:5},
    sld_promotion_view:{flexDirection:'row',alignItems:'flex-end'},
    sld_promotion_tag: {color:"#fff",fontSize:10,margin:2},
    tabBarUnderline:{
        backgroundColor: '#E67F11',
        height: 2,
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
        flexDirection:'row',
        justifyContent:'flex-start',
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
export default HomeSNewCommon;

// borderBottomLeftRadius?: number;
