import {StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";

const Dimensions = require('Dimensions');
const {width} = Dimensions.get('window');


export default styles = StyleSheet.create({
    order_sn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: pxToDp(80),
        paddingHorizontal: pxToDp(20),
        backgroundColor: '#fff'
    },
    addr: {
        marginTop: pxToDp(20),
        flexDirection: 'row',
        paddingHorizontal: pxToDp(20),
        paddingVertical: pxToDp(15),
        backgroundColor: '#fff'
    },
    addr_info: {
        flex: 1,
        paddingLeft: pxToDp(20),
    },
    txt: {
        color: '#848689',
        fontSize: pxToDp(26),
        lineHeight: pxToDp(36),
    },
    goods_list: {
        marginTop: pxToDp(20)
    },
    store_info: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(90),
        paddingHorizontal: pxToDp(30),
        backgroundColor: '#fff'
    },
    goods_item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pxToDp(20),
        height: pxToDp(158),
        paddingVertical: pxToDp(15),
        borderColor: '#e9e9e9',
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid'
    },
    num: {
        alignItems: 'flex-end',
        minWidth: pxToDp(150),
    },
    btns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    btn: {
        height: pxToDp(50),
        paddingHorizontal: pxToDp(15),
        borderRadius: pxToDp(8),
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderWidth: pxToDp(1),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: pxToDp(15)
    },
    btn_t: {
        color: '#f15353',
        fontSize: pxToDp(26)
    },
    info_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: pxToDp(60),
        paddingHorizontal: pxToDp(20)
    },
    info_name: {
        color: '#555',
        fontSize: pxToDp(26)
    },
    order_txt: {
        color: '#000',
        fontSize: pxToDp(26)
    },
    line: {
        borderStyle: 'solid',
        borderColor: '#e9e9e9',
        borderBottomWidth: pxToDp(1),
        backgroundColor: '#fff',
        paddingVertical: pxToDp(15),
    },
    i_title: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(80),
        paddingHorizontal: pxToDp(20)
    },
    i_con: {
        color: '#999',
        fontSize: pxToDp(26),
        paddingHorizontal: pxToDp(30),
        lineHeight: pxToDp(40)
    },
    time: {
        marginTop: pxToDp(20),
        backgroundColor: '#fff',
        paddingVertical: pxToDp(15),
    },
    footer: {
        width: width,
        height: pxToDp(110),
        backgroundColor: '#eaedf1',
        borderTopWidth: pxToDp(1),
        borderTopColor: '#EEE',
        borderStyle: 'solid',
        paddingHorizontal: pxToDp(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    e_btn: {
        height: pxToDp(70),
        paddingHorizontal: pxToDp(15),
        backgroundColor: '#fff',
        borderRadius: pxToDp(6),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: pxToDp(20),
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderWidth: pxToDp(1),
    },
    total: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: pxToDp(90),
        paddingHorizontal: pxToDp(20),
        borderBottomWidth: pxToDp(1),
        borderColor: '#e9e9e9',
        borderStyle: 'solid',
        backgroundColor: '#fff',
    },
    order_btns: {
        height: pxToDp(100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        paddingHorizontal: pxToDp(20)
    },
    order_btn: {
        height: pxToDp(55),
        paddingHorizontal: pxToDp(15),
        borderRadius: pxToDp(6),
        borderStyle: 'solid',
        borderWidth: pxToDp(1),
        borderColor: '#f23030',
        marginLeft: pxToDp(15),
        alignItems: 'center',
        justifyContent: 'center'
    },
    order_btn_txt: {
        color: '#f23030',
        fontSize: pxToDp(26)
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: pxToDp(100),
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        borderColor: '#e9e9e9',
    },
    nav_item: {
        flex: 1,
        marginHorizontal: pxToDp(10),
        height: pxToDp(100),
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        alignItems: 'center',
        justifyContent: 'center'
    }
})



























