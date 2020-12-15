import {StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";


const HomeSNew = StyleSheet.create({
    listView: {
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'column',
        paddingLeft: pxToDp(30),
        backgroundColor: '#fff'
    },
    listViewItem: {flexDirection: 'row', justifyContent: 'space-between', marginRight: pxToDp(30)},
    listItemImg: {width: pxToDp(320), height: pxToDp(320)},
    listItemRight: {flexDirection: 'column', width: pxToDp(350)},
    listRightTitle: {color: '#333', fontSize: pxToDp(30),},
    listRightSubTitle: {color: '#888', fontSize: pxToDp(24),},
    listRightPrice: {fontSize: pxToDp(34), color: '#ba1418', marginTop: pxToDp(32)},
    listRightWrap: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    listRightBuy: {
        height: pxToDp(60),
        width: pxToDp(170),
        backgroundColor: '#e58011',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    listRightBuyText: {color: '#fff', fontSize: pxToDp(26)},
    listRightTag: {fontSize: pxToDp(24), color: '#b5a37d'},


});
export default HomeSNew;

// borderBottomLeftRadius?: number;
