import {StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


export default vendor = StyleSheet.create({
    store_top:{
        width: width,
        height: pxToDp(252),
    },
    store_info:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: pxToDp(15),
    },
    s_left:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    store_img:{
        width: pxToDp(110),
        height: pxToDp(110),
        borderRadius: pxToDp(10),
        overflow: 'hidden',
    },
    s_info:{
        marginLeft: pxToDp(20)
    },
    s_right:{
        width: pxToDp(120),
        height: pxToDp(60),
        borderRadius: pxToDp(8),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nav:{
        width: width,
        height: pxToDp(120),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    nav_item:{
        flex: 1,
        height: '100%',
        marginHorizontal: pxToDp(30),
        borderBottomWidth: pxToDp(4),
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center'
    },
    goods_item:{
        width: (width/2)-pxToDp(40),
        height: pxToDp(530),
        paddingHorizontal: pxToDp(15),
        marginVertical: pxToDp(15),
        backgroundColor: '#fff',
        paddingBottom: pxToDp(20),
        borderRadius: pxToDp(10),
        marginHorizontal: pxToDp(20),
    },
    store_js:{
        height: pxToDp(90),
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: pxToDp(1),
        borderStyle: 'solid',
        borderTopColor: '#E9E9E9'
    },
    price:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: pxToDp(15)
    },
    sale:{
        marginTop: pxToDp(15),
    },
    dian_item:{
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(200),
        marginBottom: pxToDp(10),
        paddingHorizontal: pxToDp(20),
        backgroundColor: '#fff',
    },
    img:{
        width: pxToDp(170),
        height: pxToDp(170)
    },
    dian_info:{
        flex: 1,
        paddingLeft: pxToDp(20),
        height: pxToDp(200),
        justifyContent: 'center'
    },
    dian_top:{
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        borderBottomColor: '#E9E9E9'
    },
    dian_cz:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    dian_cz_item:{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pxToDp(30),
        height: pxToDp(50),
    }
})

























