import pxToDp from "../../util/pxToDp";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default {
    item: {
        height: pxToDp(140),
        marginTop: pxToDp(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: pxToDp(30),
    },
    step_img: {
        width: pxToDp(80),
        height: pxToDp(80),
    },
    step_title: {
        flex: 1,
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(100),
    },
    more: {
        width: pxToDp(14),
        height: pxToDp(23),
    },
    step_title_name: {
        color: '#181818',
        fontSize: pxToDp(30),
        lineHeight: pxToDp(36),
        paddingBottom: pxToDp(10)
    },
    step_title_tip: {
        color: '#666666',
        fontSize: pxToDp(24),
        lineHeight: pxToDp(36),
    },
    tip: {
        paddingVertical: pxToDp(20),
        backgroundColor: '#FFF0C9',
        paddingHorizontal: pxToDp(40),
    },
    tip_txt: {
        color: '#887D5A',
        lineHeight: pxToDp(32)
    },
    form: {
        marginTop: pxToDp(20),
        backgroundColor: '#fff',
    },
    form_title: {
        height: pxToDp(120),
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#e9e9e9',
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: pxToDp(37)
    },
    form_title_txt: {
        fontSize: pxToDp(30),
        color: '#000',
    },
    form_item: {
        height: pxToDp(120),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#e9e9e9',
        borderStyle: 'solid',
        paddingRight: pxToDp(30)
    },
    label: {
        fontSize: pxToDp(28),
        color: '#333',
    },
    con: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        maxWidth: pxToDp(350)
    },
    con_txt: {
        color: '#666',
        fontSize: pxToDp(28),
        marginRight: pxToDp(15)
    },
    form_item_img: {
        height: pxToDp(180),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#e9e9e9',
        borderStyle: 'solid',
        paddingRight: pxToDp(30)
    },
    form_item_img_upload: {
        width: pxToDp(140),
        height: pxToDp(140),
        backgroundColor: '#eee',
        borderRadius: pxToDp(10),
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        position: 'absolute',
        bottom: pxToDp(30),
        left: 0,
        width: width - pxToDp(140),
        marginHorizontal: pxToDp(70),
        borderRadius: pxToDp(8),
        backgroundColor: '#F92938',
        height: pxToDp(100),
        alignItems: 'center',
        justifyContent: 'center'
    },
    status: {
        height: pxToDp(180),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      paddingLeft:15
    },
    status_txt: {
        fontSize: pxToDp(30),
        marginLeft: pxToDp(36)
    },
    cat: {
        marginTop: pxToDp(56),
    },
    table: {
        paddingHorizontal: pxToDp(20),
    },
    tr: {
        height: pxToDp(90),
        flexDirection: 'row',
        justifyContent: 'center',
    },
    td: {
        flex: 1,
        height: pxToDp(90),
        alignItems: 'center',
        justifyContent: 'center',
        margin: pxToDp(1),
    },
    td_s: {
        backgroundColor: '#F0EEEE'
    },
    td_q: {
        backgroundColor: '#F7F7F7'
    },
    td_s_txt: {
        color: '#515151',
        fontSize: pxToDp(24),
    },
    td_q_txt: {
        color: '#818181',
        fontSize: pxToDp(24),
    },
    status_btn: {
        backgroundColor: '#F92938',
        height: pxToDp(118),
        alignItems: 'center',
        justifyContent: 'center',
    },
    navigateBar: {
        marginTop:pxToDp(-80),
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    n_left: {
        paddingHorizontal: pxToDp(30),
    },
    inputWrap: {
        width: width,
        height: pxToDp(130),
        paddingLeft: pxToDp(37),
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: pxToDp(100),
        backgroundColor: '#fff',
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
    },
    nav_item: {
        flex: 1,
        marginHorizontal: pxToDp(10),
        height: pxToDp(100),
        borderStyle: 'solid',
        borderBottomWidth: pxToDp(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    addrList: {
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: pxToDp(30),
        borderBottomColor: '#e9e9e9',
        borderBottomWidth: pxToDp(1),
        borderStyle: 'solid',
        backgroundColor: '#fff',
    },
    up_item: {},
    up_title: {
        paddingHorizontal: pxToDp(30),
        height: pxToDp(90),
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#e9e9e9',
        borderStyle: 'solid',
    },
    up_item_a: {
        height: pxToDp(80),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#e9e9e9',
        borderStyle: 'solid',
        paddingHorizontal: pxToDp(30),
        backgroundColor: '#fff',
    },
    up_txt_left: {
        fontSize: pxToDp(28),
        color: '#1F1F1F'
    },
    up_txt_right: {
        fontSize: pxToDp(28),
        color: '#999999',
    },
    up_item_img: {
        width: pxToDp(140),
        height: pxToDp(140)
    },
    up_item_b: {
        paddingVertical: pxToDp(30),
        paddingHorizontal: pxToDp(30),
    },
    picker: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
    },
    cat_name: {
        height: pxToDp(100),
        justifyContent: 'center',
        paddingHorizontal: pxToDp(30),
    },
    add_btn: {
        width: pxToDp(100),
        height: pxToDp(60),
        borderRadius: pxToDp(6),
        borderStyle: 'solid',
        borderColor: '#ccc',
        borderWidth: pxToDp(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
	item_address: {
		height: pxToDp(108),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(30)
	}
}
























