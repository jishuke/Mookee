/**
 * 全局样式
 * @flow
 */
import {
    Dimensions,DeviceInfo
}from 'react-native'
import pxToDp from "../../util/pxToDp";
const {height, width} = Dimensions.get('window');
module.exports ={
    sld_container:{
	    flex: 1,
	    backgroundColor:'#fafafa',
    },
    line: {
        height: 0.5,
        backgroundColor: '#e5e5e5',
    },
	ldj_line: {
        height: 0.7,
        backgroundColor: '#DADADA',
    },
	left_10_line: {
        height: 0.7,
        backgroundColor: '#F1F1F1',
        width:'100%',
        marginLeft:pxToDp(20),
    },
    iphoneXbottomheight:{
        backgroundColor:'#fff',
        width:width,
        height:DeviceInfo.isIPhoneX_deprecated?35:0,
    },
    leftline: {
        height: 0.5,
        backgroundColor: '#e5e5e5',
        paddingLeft:pxToDp(30),
        marginTop:15,
        marginBottom:15,
    },
    left_15_line:{
	    width:width,
        marginLeft:pxToDp(30),
        height:0.7,
	    backgroundColor: '#DADADA',
    },
    root_container:{
        flex: 1,
        backgroundColor: '#f3f3f4',
    },
    space_shi_separate:{
        height:10,
        opacity:0,
    },
    space_shi:{
       marginTop:10,
    },
    space_shiwu:{
        marginTop:15,
    },
    space_ba:{
        marginTop:15,
    },
    sld_global_font:{
        fontWeight:'300',
    },
    sld_global_fontfamliy:{
        fontFamily:'PingFangSC-Light',
    },
    backgroundColor: '#f3f3f4',
    nav_bar_height_ios:44,
    nav_bar_height_android:50,
    window_height:height,
    sldFirstTitleColor:'#333',  //标题文字
    sldChildTitleColor:'#666',  //内文文字
    sldTipColor:'#999',  //注释文字
    sldHelpColor:'#ccc',  //辅助性文字
    sldLineColor:'#e5e5e5' , //辅助线颜色
    sldScreenBgColor:'#fafafa',  //背景色
    sldFontSize12:12,
    sldFontSize13:13,
    sldFontSize14:14,
    sldFontSize15:15,
    sldFontSize16:16,
    sldFontSize17:17,
    sldFontSize18:18,
    sldFontSize19:19,
    sldFontSize20:20,
    swiper_dot: {
        backgroundColor: '#9f9f9f',
        width: pxToDp(15),
        height: pxToDp(15),
        borderRadius: pxToDp(15),
        marginLeft: pxToDp(8),
        marginRight: pxToDp(8),
    },
    swiper_activeDot:{
        backgroundColor: '#f02c51',
        width: pxToDp(15),
        height: pxToDp(15),
        borderRadius: pxToDp(15),
        marginLeft: pxToDp(8),
        marginRight: pxToDp(8),
    },
    swiper:{
        backgroundColor: '#fff',
        height:pxToDp(360),
    },
    sld_home_banner: {
        width: Dimensions.get('window').width,
        height:pxToDp(360),
    },
    topBackBtn:{width:pxToDp(80),height:pxToDp(80),flexDirection:'row',alignItems:'center'},
    topBackBtnImg:{width:pxToDp(44),height:pxToDp(44),marginLeft:15},
    topBackRightBtnImg:{width:pxToDp(34),height:pxToDp(34),marginRight:15},
    sld_main_color:{color:'#f02c51'},
    sld_main_navtitle:{color:'#242424'},
    sld_main_title:{color:'#242424'},
    sld_main_sec_title:{color:'#999'},
    sld_main_border_color:{color:'#ebebeb'},
    sld_login_btn_bg:{backgroundColor:'#F44A40',borderRadius:30},
    flex_common_row:{flexDirection:'row',justifyContent:'center',alignItems:'center'},
    flex_com_row_start:{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'},
    flex_com_row_end:{flexDirection:'row',justifyContent:'flex-end',alignItems:'center'},
    flex_common_column:{flexDirection:'column',justifyContent:'center',alignItems:'center'},
    flex_com_column_start:{flexDirection:'column',justifyContent:'flex-start',alignItems:'center'},
    flex_com_column_end:{flexDirection:'column',justifyContent:'flex-end',alignItems:'center'},

};
