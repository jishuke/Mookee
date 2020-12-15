/**
 * 全局样式
 * @flow
 */
import {
    Dimensions,
    StyleSheet
}from 'react-native'
import pxToDp from "../../util/pxToDp";
const {height, width} = Dimensions.get('window');

const fun = StyleSheet.create({
    f_row: {
        flexDirection: 'row',
    },
    f_flex1: {
        flex: 1
    },
    f_flex: {
        display: 'flex'
    },
    f_between: {
        justifyContent: 'space-between'
    },
    f_shrink0: {
        flexShrink: 0,
    },
    f_wrap: {
        flexWrap: 'wrap'
    },
    f_center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    f_row_center: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    f_row_between: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    f_bg_white: {
        backgroundColor: '#fff'
    },
    f_bg_red: {
        backgroundColor: '#DE2C22'
    },
    f_bg_e5: {

    },

    f_c_white: {
        color: '#fff'
    },
    f_c_red: {
        color: '#DE2C22'
    },
    f_c_24: {
        color: '#242424'
    },
    f_c_66: {
        color: '#666'
    },
    f_c_90: {
        color: '#909090'
    },
    f_c_ce: {
        color: '#CECECE'
    },
    f_c_e5: {
        color: '#E5E5E5'
    },

    f_fs20: {
        fontSize: pxToDp(20)
    },
    f_fs24: {
        fontSize: pxToDp(24)
    },
    f_fs26: {
        fontSize: pxToDp(26)
    },
    f_fs28: {
        fontSize: pxToDp(28)
    },
    f_fs30: {
        fontSize: pxToDp(30)
    },
    f_fs32: {
        fontSize: pxToDp(32)
    },
    f_fs34: {
        fontSize: pxToDp(34)
    },
    f_fs36: {
        fontSize: pxToDp(36)
    },
    f_fs40: {
        fontSize: pxToDp(40)
    },

    f_icon32: {
        width: pxToDp(32),
        height: pxToDp(32)
    },
    f_icon50: {
        width: pxToDp(50),
        height: pxToDp(50)
    },
    f_icon84: {
        width: pxToDp(84),
        height: pxToDp(84)
    },

    f_tac: {
        textAlign: 'center'
    },
    f_fwb: {
        fontWeight: 'bold'
    }


})

export default fun;
