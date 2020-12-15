import {Platform, StyleSheet,Dimensions} from "react-native";
import pxToDp from "../../util/pxToDp";
const {width,height} = Dimensions.get('window');
const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = 20;

const styles = StyleSheet.create({
	carouselText: {fontSize: pxToDp(26), color: '#666'},
	carouselTip: {
		position: 'absolute',
		bottom: pxToDp(100),
		right: pxToDp(36),
		borderColor: '#b0b0b0',
		borderRadius: pxToDp(5),
		borderWidth: 0.5,
		zIndex: 2,
		paddingTop: pxToDp(5),
		paddingBottom: pxToDp(5),
		paddingLeft: pxToDp(10),
		paddingRight: pxToDp(10),
		backgroundColor: '#fff'
	},
	bottomCommon: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: pxToDp(98),
		borderRightWidth: 0.5,
		borderColor: '#dbdbdb',
	},
	shareCancle: {height: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',},
	spec_detail_text: {paddingLeft: 13, paddingRight: 13, fontSize: 14,},
	spec_detail_nosele: {
		borderColor: '#666',
		borderWidth: 0.5,
	},
	spec_detail_sele: {
		borderColor: '#e58011',
		borderWidth: 1,
	},
	spec_detail: {
		height: 35,
		marginRight: 15,
		borderRadius: 4,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 15

	},
	spec_common_title: {
		color: '#666',
		fontSize: 16,
		marginBottom: 0
	},
	modalSpec: {
		backgroundColor: "#fff", height: height-0.20*height,
		position: "absolute", left: 0, right: 0,
		width: width,
	},
	modalJoinVip: {
		height: '60%'
	},
	spectitle: {
		flexDirection: 'row',
		height: 32,
		borderWidth: 0.5,
		borderColor: '#666',
		borderRadius: 4,
		marginBottom: 25,
		width: 110,
		marginTop: 15
	},
	common_layout_text: {
		color: '#666',
		fontSize: 17,
	},
	common_layout: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 30, height: 31},
	titleText: {color: '#333'},
	currentTitleText: {color: '#fff'},
	goods_title_cur_goods: {backgroundColor: '#7f7f7f', borderBottomLeftRadius: 4, borderTopLeftRadius: 4},
	goods_title_cur_detail: {backgroundColor: '#7f7f7f', borderBottomRightRadius: 4, borderTopRightRadius: 4},
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
	current_title_text: {color: '#fff', fontSize: 15},
	sld_goods_title_common: {
		width: 70,
		height: 29,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sld_yushou_tag_num: {
		color: "#666",
		fontSize: 12
	},
	sld_yushou_tag: {
		color: "#d56f44",
		fontSize: 12
	},
	sld_promotion_tag: {color: "#fff", fontSize: 12, marginTop: 2, marginBottom: 2, marginLeft: 5, marginRight: 5},
	sld_promotion_bg: {
		borderRadius: 2,
		backgroundColor: '#000',
		height: 17,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 5,
		marginTop: 32
	},
	eva_xing: {flexDirection: 'row'},
	service_detail_con: {color: '#999', fontSize: 15, marginTop: 10, marginBottom: 20},
	service_detail_title: {color: '#333', fontSize: 17},
	service_title: {
		flex: 1,
		height: 60,
		alignItems: 'center',
		justifyContent: 'center',
	},
	service_title_text: {
		fontSize: pxToDp(26),
		color: '#333',
	},
	popup_list: {
		height: 210,
		overflow: 'hidden',
		position: 'absolute',
		bottom: 0, left: 0, right: 0
	},
	sld_goods_title_view: {
		backgroundColor: '#fff',
	},
	sld_goods_detail_title: {
		fontSize: pxToDp(28),
		color: '#333',
		marginTop: 15,
		width: Dimensions.get('window').width * 1 - 30,
		marginLeft: 15,
		lineHeight: 20,
	},
	sld_goods_detail_jingletitle: {
		fontSize: 15,
		color: '#666',
		// width: Dimensions.get('window').width * 1 - 150,
		lineHeight: 20,
	},
	sld_mem_score: {
		width: 15,
		height: 15,
		marginRight: 8,
	},
	sld_mem_grade: {
		width: 20,
		height: 20,
		marginRight: 15,
		marginLeft: 11,
	},
	sld_mem_avator: {
		width: 35,
		height: 35,
		marginLeft: 15,
		marginRight: 10,
	},
	sld_mem_name: {
		fontSize: 14,
		color: '#1b1b1b',
	},
	sld_eva_time_time: {
		marginLeft: 8,
		marginRight: 10
	},
	sld_eva_time_date: {
		marginLeft: 15,
	},
	sld_eva_time: {
		color: '#747474',
		fontSize: 13,
	},
	sld_eva_content: {
		marginLeft: 15,
		fontSize: 14,
		color: '#333',
		width: Dimensions.get('window').width * 1 - 30,
		flexDirection: 'row',
		lineHeight: 20
	},
	sld_single_line_vertical_center: {
		flexDirection: 'row',
		marginLeft: 15,
		alignItems: 'center',
		width: Dimensions.get('window').width * 1 - 30,
	},
	sld_eval_img: {
		width: 60,
		height: 60,
		marginLeft: 15,
		borderWidth: 0.5,
		borderColor: '#eee',
	},
	sld_reply_part: {
		flexDirection: 'row',
		marginLeft: 15,
		marginRight: 15,
		backgroundColor: '#f6f6f6',
		width: Dimensions.get('window').width * 1 - 30,
		padding: 8,
		marginBottom: 10,
		marginTop: 15,

	},
	sld_reply_title: {
		fontSize: 12,
		color: '#333',
		lineHeight: 18,

	},
	sld_reply_content: {
		color: '#7e7e7e',
	},
	sld_goods_detial_evalute: {
		backgroundColor: '#fff',
	},
	sld_goods_detail_part: {
		backgroundColor: '#fff',
	},
	sld_home_searchbar: {
		marginTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,

	},
	sld_home_search: {
		width: 200,
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sldtabbartext: {
		fontSize: 17,
		fontWeight: '200',
		color: '#181818',
	},
	sldlineStyle: {
		height: 1,
		backgroundColor: '#000',
	},
	sld_wrap_lunbo: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').width,
		backgroundColor: '#fff',
		paddingTop: 20,
	},
	sld_home_banner: {
		height: '100%',
		width: '100%',
	},

	paginationStyle: {
		bottom: 6,
	},
	dotStyle: {
		width: 8,
		height: 8,
		backgroundColor: '#a0a0a0',
		borderRadius: 4,
		marginTop: 20,
		marginBottom: 10,
		marginRight: 5,
	},
	activeDotStyle: {
		width: 8,
		height: 8,
		backgroundColor: '#d57812',
		borderRadius: 4,
	},
	sld_zero_part_img: {
		width: 165,
		height: 165,
	},
	sld_zero_part_last: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	sld_zero_part_title: {
		width: 165,
		fontSize: 16,
		color: '#181818',
	},
	sld_zero_part_chuildtitle: {
		width: 140,
		fontSize: 13,
		color: '#967d56',
		overflow: 'hidden',
		height: 15,
		lineHeight: 15,
		marginTop: 5,
	},
	sld_zero_part_price: {
		color: '#ba1418',
		fontSize: 17,
		marginTop: 10,
	},
	sld_zero_part_list: {
		width: 165,
		flexDirection: 'column',
		marginLeft: 15,
	},
	sld_two_img: {
		flexDirection: 'row',
	},
	sld_home_zero_list: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	sld_home_two_img: {
		width: Dimensions.get('window').width / 2,
		height: 88,
	},
	sld_like_part_right: {
		flexDirection: 'column',
		height: 120,
		width: Dimensions.get('window').width * 1 - 140,
	},
	sld_like_part_title: {
		fontSize: 16,
		color: '#181818',
		height: 42,
		lineHeight: 21,
		paddingRight: 15,
	},
	sld_like_part_chuildtitle: {
		marginTop: 5,
		fontSize: 13,
		color: '#747474',
		height: 36,
		lineHeight: 18,
		paddingRight: 15,

	},
	sld_like_part_price: {
		fontSize: 18,
		color: '#ba1418',
		position: 'relative',
		bottom: -10,
	},
	sld_like_part_list: {
		flexDirection: 'row',
		width: Dimensions.get('window').width,
		marginRight: 15,
	},
	sld_like_part_img: {
		width: 120,
		height: 120,
		marginRight: 15,
	},
	sld_home_view_more: {
		fontSize: 12,
		color: '#787878',
		alignItems: 'center',
		paddingBottom: 25,
		paddingTop: 25,
	},
	sld_home_xianshi_time_bg: {
		width: 25,
		height: 25,
		lineHeight: 25,
		color: '#fff',
		fontSize: 12,
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		textAlign: 'center',

	},
	container: {
		flex: 1,
		backgroundColor: '#fafafa',
	},
	item: {
		flexDirection: 'row',
	},
	leftimage: {
		width: 50,
		height: 50,
	},
	label_service_left: {
		fontSize: 14,
		color: '#333',
	},
	sld_mem_top_bg: {
		width: Dimensions.get('window').width,
		height: 180,
		backgroundColor: '#2c2c2c'
	},

	sld_center_combine: {
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingTop: 20,
		paddingBottom: 20,
	},
	sld_home_heika_img: {
		// 设置宽度
		width: Dimensions.get('window').width,
		// 设置高度
		height: 110,
		// 设置图片填充模式
		resizeMode: 'cover'
	},
	topic: {
		width: Dimensions.get('window').width,
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingBottom: 10,
		marginBottom: 10,
	},

	topicHead: {
		fontSize: 17,
		color: '#333',
		padding: 15,
		marginTop: 10
	},
	topicItem: {
		width: pxToDp(210),
		marginLeft: pxToDp(30),
	},
	topicImg: {
		width: pxToDp(210),
		height: pxToDp(210),
	},

	gradeImg:
		{
			width: pxToDp(30),
			height: pxToDp(30),
			marginRight:pxToDp(40),
			justifyContent:'center'
		},

	topicContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems:'center',
		marginTop: 10,
	},
	topicTitle: {
		fontSize: 15,
		color: '#333',
		width: 105,
		marginTop: 5
	},
	topicDesc: {
		fontSize: 18,
		color: '#ba1418',
		marginTop: 4,
		fontWeight: '400'
	},
	goods_recommond: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	menber_rade: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	sld_rec_stylesld_rec_style: {
		height: 49,
		lineHeight: 49,
		color: '#bfbfbf',
		letterSpacing: 2,
		fontWeight: '400',
		marginTop: 8
	},
	sld_xianshi_time_bg: {
		width: 25,
		height: 25,
	},
	sld_xianshi_wrap: {
		position: 'relative',
		marginBottom: 15,
		marginTop: 13,
	},
	sld_home_xianshi_tip: {
		paddingLeft: 4,
		paddingRight: 4,
		color: '#999',
		marginTop: 14,
	},
	sld_rec_style: {
		height: 49,
		lineHeight: 49,
		color: '#bfbfbf',
		letterSpacing: 2,
		fontWeight: '400',
		marginTop: 8
	},
	sld_single_left: {
		fontSize: pxToDp(28),
		color: '#353535',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',

	},
	sld_single_right: {
		color: '#a4a4a4',
		flexDirection: 'row',
		alignItems: 'center',
	},
	sld_single_right_text: {
		fontSize: 12,
		color: '#848689',
	},
	sld_single_line: {
		width: Dimensions.get('window').width,
		backgroundColor: '#fff',
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: 15,
		paddingRight: 15,
		justifyContent: 'space-between',
	},
	sld_single_right_icon: {
		marginLeft: 0,
		marginRight: 0,
		height: 11,
		width: 11,
		opacity: 0.5
	},
	sld_single_left_view: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	sld_single_left_text: {
		marginLeft: 15,
		width: Dimensions.get('window').width * 1 - 90,
		overflow: 'hidden',
		paddingTop: 15,
		paddingBottom: 6,
	},
	sld_single_left_text_detail: {
		fontSize: 16,
		color: '#333',
		marginRight: 40,
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
	title: {
		fontSize: 18,
		color: '#333',
	},
	navBarButton: {
		alignItems: 'center',
	},
	statusBar: {
		height: Platform.OS === 'ios' ? (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896) ? 44 : 20 : 0,
	},
	cart_count_view: {
		position: 'absolute',
		top: pxToDp(10),
		left: pxToDp(70),
		backgroundColor: '#fff',
		minWidth: pxToDp(22),
		height: pxToDp(22),
		borderRadius: pxToDp(11),
		borderWidth: pxToDp(2),
		borderColor: '#E1251B',
		paddingHorizontal: pxToDp(5),
		alignItems: 'center',
		justifyContent: 'center'
	},
	cart_count_text: {
		color: '#E1251B',
		fontSize: pxToDp(18),
	},
	webView: {
		backgroundColor: "#0000",
		marginTop: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
		left: 0,
		right: 0,
		bottom: 0
	},
	ven_desc: {color: '#888', fontSize: pxToDp(28), fontWeight: '300'},
	ven_desc_num: {color: '#f23030', fontSize: pxToDp(28), fontWeight: '400'},
	presale: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20),
		height: pxToDp(128),
	},
	pre_btn:{
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(26),
		backgroundColor: '#744EFF'
	},
	preBuy:{
		flex: 1,
		backgroundColor: '#FE011D',
		justifyContent: 'center',
		alignItems: 'center'
	},
	pin_ladder:{
		height: pxToDp(110),
		paddingHorizontal: pxToDp(20)
	},
	bw:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	center:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	pin_txt:{
		color: 'rgba(255,255,255,0.9)',
		fontSize: pxToDp(24)
	},
	pin_r_txt:{
		color: '#5F4A08',
		fontSize: pxToDp(24)
	},
	pin_pro_w:{
		width: pxToDp(220),
		height: pxToDp(14),
		borderRadius: pxToDp(7),
		overflow: 'hidden',
		backgroundColor: '#fff',
		marginVertical: pxToDp(10)
	},
	pin_pro:{
		width: 0,
		height: pxToDp(14),
		borderRadius: pxToDp(7),
		backgroundColor: '#ED6307'
	},
	pin_btn:{
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ED6307'
	},

	disable_btn:{
		flex: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ccc'
	},

	pin_jt:{
		backgroundColor: '#fff',
		paddingVertical: pxToDp(30)
	},
	pin_ladder_pro:{
		height: pxToDp(200),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	jtt_img:{
		width: pxToDp(19),
		height: pxToDp(31),
		marginHorizontal: pxToDp(20),
	},
	jtt_item:{
		marginHorizontal: pxToDp(30),
	},
	jtt_item_top:{
		height: pxToDp(76),
		paddingHorizontal: pxToDp(25),
		borderRadius: pxToDp(38),
		alignItems: 'center',
		marginBottom: pxToDp(15)
	},
	jtt_on:{
		borderWidth: pxToDp(3),
		borderStyle: 'solid',
		borderColor: '#ED6307',
	},
	jtt_txt:{
		textAlign: 'center',
		color: '#9C9C9C',
		fontSize: pxToDp(24)
	},
	jtt_item_b:{
		alignItems: 'center'
	},
	jtt_line:{
		alignItems: 'center'
	},
	jtt_dot:{
		width: pxToDp(40),
		height: pxToDp(40),
		borderRadius: pxToDp(20),
		textAlign: 'center',
		color: '#fff',
		lineHeight: pxToDp(40),
	},
	jtt_pro_l:{
		position: 'absolute',
		top: pxToDp(17),
		right: pxToDp(40),
		width: pxToDp(95),
		height: pxToDp(6),
		backgroundColor: '#D1D1D1',
	},
	jtt_pro_r:{
		position: 'absolute',
		top: pxToDp(17),
		left: pxToDp(40),
		width: pxToDp(95),
		height: pxToDp(6),
		backgroundColor: '#D1D1D1',
	},
	jtt_pro:{
		width: 0,
		height: pxToDp(6),
		backgroundColor: '#ED6307'
	},
	share_hb:{
		position: 'absolute',
		top: 0,
		left: 0,
		width: width,
		height: height,
		backgroundColor: 'rgba(0, 0, 0, 0.45)',
		zIndex: 9999
	},
	img_show:{
		flex: 1,
		width: width,
		alignItems: 'center',
		justifyContent: 'center'
	},
	hb:{
		borderRadius: pxToDp(20),
		overflow: 'hidden',
		width: width*0.72,
	},
	hb_img:{
		width: width*0.72,
	},
	share_mode:{
		width: width,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	share_item:{
		alignItems: 'center',
	},
	share_item_img:{
		width: pxToDp(105),
		height: pxToDp(105)
	},
	share_item_txt:{
		color: '#fff',
		fontSize: pxToDp(24),
		marginTop: pxToDp(20)
	},
	share_close:{
		// position: 'absolute',
		// bottom: pxToDp(50),
		// left: 0,
		alignItems: 'center',
		justifyContent: 'center',
		width: width,
		height: pxToDp(146),
	},
	share_close_w:{
		padding: pxToDp(30)
	},
	share_close_img:{
		width: pxToDp(25),
		height: pxToDp(25)
	},
	pb:{
		height: pxToDp(310),
		width: width,
	},
	sld_red_show:{
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: pxToDp(15)
	},
	red_bg:{
		flex: 1,
		maxWidth: pxToDp(180),
		height: pxToDp(42),
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: pxToDp(10)
	}
});

export {
	styles,
	NAV_BAR_HEIGHT_IOS,
	NAV_BAR_HEIGHT_ANDROID,
	STATUS_BAR_HEIGHT
};
