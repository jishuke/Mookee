import {StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    store_name: {
        height: pxToDp(145),
        backgroundColor: '#5EB319',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pxToDp(15)
    },
    store_logo: {
        width: pxToDp(120),
        height: pxToDp(120),
        borderRadius: pxToDp(12),
        overflow: 'hidden',
        borderColor: '#fff',
        borderWidth: pxToDp(1),
        borderStyle: 'solid'
    },
    store_info: {
        flex: 1,
        marginLeft: pxToDp(33),
    },
    search: {
        height: pxToDp(60),
        marginTop: pxToDp(10),
        marginHorizontal: pxToDp(20),
        marginBottom: pxToDp(40),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: pxToDp(6)
    },
    goods_left:{
        width: pxToDp(180)
    },
    cat:{
        width: pxToDp(179),
        height: pxToDp(100),
        borderStyle: 'solid',
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: pxToDp(1),
        borderRightColor: '#EAEAEA',
        borderRightWidth: pxToDp(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    cat_txt:{
        fontSize: pxToDp(24),
        color: '#333'
    },
    cat_on:{
        borderRightColor: 'transparent',
        borderLeftWidth: pxToDp(6),
        borderLeftColor: '#5EB319',
        width: pxToDp(173)
    },
    cat_on_txt:{
        color: '#333333',
        fontWeight: '600'
    },
    goods_right:{
        width: width-pxToDp(180),
        paddingHorizontal: pxToDp(20)
    },
    sort:{
        width: '100%',
        height: pxToDp(56),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sort_left:{

    },
    sort_right:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    err:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goods_swiper:{
        width: width,
        height: width,
    },
    dot:{
        height: pxToDp(40),
        position: 'absolute',
        bottom: pxToDp(30),
        right: pxToDp(30),
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: pxToDp(8),
        paddingHorizontal: pxToDp(15),
        textAlign: 'center',
        lineHeight: pxToDp(40),
        color: '#fff',
    },
    close:{
        position: 'absolute',
        top: pxToDp(50),
        left: pxToDp(30),
        padding: pxToDp(20),
        width: pxToDp(100),
        height: pxToDp(100)
    },
    detail:{
        padding: pxToDp(30),
        backgroundColor: '#fff'
    },
    goods_add:{
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: pxToDp(20)
    },
    img_btn:{
        width: pxToDp(44),
        height: pxToDp(44)
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    row_between:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    clearAll:{
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        paddingHorizontal: pxToDp(30)
    },
    cart_goods:{
        paddingVertical: pxToDp(20),
        paddingRight: pxToDp(20),
        borderBottomColor: '#EAEAEA',
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
    },
    cart_scr:{
        minHeight: pxToDp(30),
        maxHeight: pxToDp(320)
    },
    cart_btn: {
        width: pxToDp(250),
        height: pxToDp(98),
        textAlign: 'center',
        lineHeight: pxToDp(98),
        color: '#fff',
        fontSize: pxToDp(32)
    },
    goods_detail:{

    },
    gtitle:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(100),
        backgroundColor: '#fff'
    },
    ssearch:{
        flexDirection: 'row',
        marginHorizontal: pxToDp(30),
        height: pxToDp(56),
        marginVertical: pxToDp(10),
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F4F4F4',
        borderRadius: pxToDp(6),
        paddingHorizontal: pxToDp(20)
    },
    search_goods:{
        paddingLeft: pxToDp(190),
        paddingTop: pxToDp(30),
        backgroundColor: '#fff',
    },
    search_item:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: pxToDp(20)
    },
	top_close:{
        position:'absolute',
        top:pxToDp(73),
        left:pxToDp(30),
        zIndex:2
    },
    storeHeader:{
        height: pxToDp(60),
        backgroundColor: main_ldj_color
    },
    callwrap:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: width,
        height: height,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
        zIndex: 9999,
    },
    callmain:{
        paddingHorizontal: pxToDp(20),
        paddingBottom: pxToDp(20)
    },
    callm:{
        backgroundColor: '#fff',
        borderRadius: pxToDp(28),
    },
    call_item:{
        height: pxToDp(110),
        alignItems: 'center',
        justifyContent: 'center',
    },
    call_title_txt:{
        color: '#666',
        fontSize: pxToDp(fontSize_34),
    },
    call_call_txt:{
        color: '#2BBCFF',
        fontSize: pxToDp(fontSize_34),
    },
    callclose:{
        marginTop: pxToDp(20),
        height: pxToDp(110),
        borderRadius: pxToDp(28),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    modalStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modal_bottom:{
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    modal_top:{
        paddingBottom: pxToDp(15)
    }
})