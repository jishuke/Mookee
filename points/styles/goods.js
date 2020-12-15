import {DeviceInfo, Dimensions, Platform, StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
	navBarButton: {
		alignItems: 'center',
	},
	statusBar: {
		height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 30 : 20) : 0,
	},
	navBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
	},
	navBarTitleContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		left: 40,
		top: 0,
		right: 40,
		bottom: 0,
	},
	goods_title_wrap: {
		width: 140,
		height: 29,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#7f7f7f',
		borderRadius: 4,
		borderWidth: 0.5
	},
	current_title_text: {
		color: '#fff',
		fontSize: 15
	},
	sld_goods_title_common: {
		width: 70,
		height: 29,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	goods_title_cur_goods: {
		backgroundColor: '#7f7f7f',
		borderBottomLeftRadius: 4,
		borderTopLeftRadius: 4
	},
	goods_title_cur_detail: {
		backgroundColor: '#7f7f7f',
		borderBottomRightRadius: 4,
		borderTopRightRadius: 4
	},
	goods_swiper: {
		width: width,
		height: width,
		backgroundColor: '#fff'
	},
	dot: {
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
	goods_info: {
		backgroundColor: '#fff',
		paddingLeft: pxToDp(30)
	},
	storage: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(80),
		paddingRight: pxToDp(30),
		borderStyle: 'solid',
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#CDCDCD'
	},
	font30: {
		color: '#707070',
		fontSize: pxToDp(28)
	},
	title: {
		paddingVertical: pxToDp(25),
		fontSize: pxToDp(32),
		color: '#141414',
		paddingRight: pxToDp(30)
	},
	price: {
		paddingVertical: pxToDp(25),
		flexDirection: 'row',
		alignItems: 'center'
	},
	body: {
		marginTop: pxToDp(20),
		backgroundColor: '#fff'
	},
	body_title: {
		height: pxToDp(120),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: '#CDCDCD',
		borderBottomWidth: pxToDp(1),
		borderStyle: 'solid'
	},
	center: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	tdot: {
		width: pxToDp(4),
		height: pxToDp(4),
		backgroundColor: '#BFBFBF',
		borderRadius: pxToDp(2),
		overflow: 'hidden',
		marginHorizontal: pxToDp(4)
	},
	tuijian: {},
	goods_wrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		paddingHorizontal: pxToDp(20)
	},
	goods_item: {
		width: (width - pxToDp(60)) / 2,
		height: pxToDp(530),
		backgroundColor: '#fff',
		borderRadius: pxToDp(5),
		marginBottom: pxToDp(20)
	},
	goods_name: {
		color: '#6A6C78',
		fontSize: pxToDp(24),
		lineHeight: pxToDp(36),
		height: pxToDp(72),
		marginVertical: pxToDp(20),
		paddingHorizontal: pxToDp(15)
	},
	bw: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20)
	},
	footer: {
		height: pxToDp(98),
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	footer_cart: {
		height: pxToDp(98),
		alignItems: 'center',
		justifyContent: 'center'
	},
	footer_txt: {
		color: '#fff',
		fontSize: pxToDp(30)
	},
	cart_num: {
		position: 'relative',
		right: pxToDp(-30),
		top: pxToDp(-50),
		width: pxToDp(24),
		height: pxToDp(24),
		borderColor: '#F51818',
		borderWidth: pxToDp(2),
		borderStyle: 'solid',
		color: '#F51818',
		fontSize: pxToDp(18),
		overflow: 'hidden',
		borderRadius: pxToDp(12),
		textAlign: 'center',
		lineHeight: pxToDp(24)
	},
	animate_pop_wrap: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: width,
		height: height,
		backgroundColor: 'rgba(0,0,0,0.5)',
		zIndex: 99
	},
	pop_wrap: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: width,
		height: pxToDp(667),
		backgroundColor: '#fff',
		zIndex: 99
	},
	add_goods_info: {
		flex: 1,
		padding: pxToDp(30)
	},
	add_goods: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	add_left: {
		width: pxToDp(210),
		height: pxToDp(210),
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#ECECEC',
		marginRight: pxToDp(30)
	},
	add_info: {
		paddingRight: pxToDp(180)
	},
	close: {
		position: 'absolute',
		right: pxToDp(30),
		top: pxToDp(30),
		width: pxToDp(50),
		height: pxToDp(50),
		padding: pxToDp(10),
	},
	btns: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	btn: {
		width: pxToDp(44),
		height: pxToDp(44)
	},
	submit_btn: {
		height: pxToDp(98),
		backgroundColor: '#EE2327',
		alignItems: 'center',
		justifyContent: 'center',
	}
})