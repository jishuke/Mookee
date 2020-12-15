import {StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');


export default styles = StyleSheet.create({
    swper_item: {
        width: width / 3 - pxToDp(30),
        height: pxToDp(360),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: pxToDp(15)
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: pxToDp(100),
    },
    dian: {
        color: '#d0d0d0',
        fontSize: pxToDp(26)
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        height: pxToDp(100),
        backgroundColor: '#fff',
        zIndex: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    check: {
        width: pxToDp(70),
        height: pxToDp(70),
        marginHorizontal: pxToDp(20),
        alignItems: 'center',
        justifyContent: 'center'
    },
    foot_right: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    cart_info:{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pxToDp(20)
    },
    go_btn: {
        width: pxToDp(200),
        height: pxToDp(100),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cart_num_input: {
        color: '#666',
        flex: 1,
        // padding: 0,
        width: 30,
        paddingVertical: 0,
        marginHorizontal: 5,
        // marginLeft: pxToDp(32),
        fontFamily:'PingFangSC-Light',
        fontWeight:'300',
    },
    num: {
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        borderLeftWidth: pxToDp(1),
        borderRightWidth: pxToDp(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cart_btn: {
        width: pxToDp(56),
        alignItems: 'center',
        justifyContent: 'center',

    },
    edit: {
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderWidth: pxToDp(1),
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(60),
        borderRadius: pxToDp(6),
    },
    store: {
        backgroundColor: '#fff',
        marginBottom: pxToDp(30),
    },
    cart_top: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#E9E9E9',
        borderStyle: 'solid'
    },
    store_info: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    goodsWrap: {

    },
    goods_item: {
        height: pxToDp(200),
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        borderBottomWidth: pxToDp(1),
    },
    img: {
        width: pxToDp(150),
        height: pxToDp(150),
        borderRadius: pxToDp(6),
        borderStyle: 'solid',
        borderColor: '#E9E9E9',
        borderWidth: pxToDp(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    goods_info: {
        flex: 1,
        paddingLeft: pxToDp(15),
        height: pxToDp(160),
        justifyContent: 'space-around',
        paddingRight: pxToDp(20),
    },
    info_top: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    info_bottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    goods_name_info: {
        flex: 1,
        paddingRight: pxToDp(20),
    },
    cart_empty_img:{
        width: pxToDp(268),
        height: pxToDp(197)
    },
    empty_txt: {
        color: '#949494'
    },
    recommend:{
        flex: 1
    },
    title_img:{
        paddingTop: pxToDp(40),
        paddingBottom: pxToDp(23),
        alignItems: 'center'
    },
    goods_list:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    rec_item:{
        width: pxToDp(345),
        borderRadius: 8.0,
        backgroundColor: '#fff',
        marginLeft: (width-pxToDp(690))/3,
        marginBottom: pxToDp(20),
        overflow: 'hidden'
    },
    goods_img:{
        width: pxToDp(345),
        height: pxToDp(345),
    },
    goods_i:{
        paddingHorizontal: pxToDp(20),
        paddingBottom: pxToDp(20),
        paddingTop: pxToDp(10)
    },
    goods_name:{
        height: pxToDp(79),
        lineHeight: pxToDp(39),
        fontSize: pxToDp(26),
        color: '#2D2D2D'
    },
    wrap:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: pxToDp(20)
    },

})



























