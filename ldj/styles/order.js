import {StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";

const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
	header:{
		height: pxToDp(80),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: main_ldj_color
	},
	nav_wrap:{
		paddingHorizontal: pxToDp(230),
		paddingVertical: pxToDp(30),
		backgroundColor: main_ldj_color,
	},
	nav:{
		height: pxToDp(46),
		borderRadius: pxToDp(23),
		overflow: 'hidden',
	},
	nav_item:{
		position: 'absolute',
		top: 0,
		alignItems: 'center',
		justifyContent: 'center',
		width: pxToDp(160),
		height: pxToDp(46),
		borderRadius: pxToDp(23)
	},
	addNewAddr:{
		backgroundColor: main_ldj_color,
		paddingHorizontal: pxToDp(230),
		paddingBottom: pxToDp(30),
	},
	add_btn:{
		height: pxToDp(54),
		borderRadius: pxToDp(27),
		borderWidth: pxToDp(1),
		borderColor: '#fff',
		borderStyle: 'solid',
		textAlign: 'center',
		lineHeight: pxToDp(54),
		color: '#fff',
		fontSize: pxToDp(fontSize_28)
	},
	time:{
		height: pxToDp(80),
		backgroundColor: '#fff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20)
	},
	addr:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20),
		paddingBottom: pxToDp(19),
		backgroundColor: main_ldj_color
	},
	addr_info:{
		flex: 1,
		paddingHorizontal: pxToDp(20)
	},
	footer:{
		height: pxToDp(98),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
	},
	confirm_btn:{
		width: pxToDp(250),
		height: pxToDp(98),
		backgroundColor: main_ldj_color,
		alignItems: 'center',
		justifyContent: 'center',
	},
	goods_list:{
		marginTop: pxToDp(20),
		marginHorizontal: pxToDp(20),
		backgroundColor: '#fff',
		borderColor: '#ECECEC',
		borderWidth: pxToDp(1),
		borderStyle: 'solid',
	},
	store_name:{
		height: pxToDp(70),
		textAlign: 'center',
		lineHeight: pxToDp(70),
		borderStyle: 'solid',
		borderBottomColor: '#F1F1F1',
		borderBottomWidth: pxToDp(1),
		fontSize: pxToDp(fontSize_30),
		color: '#333'
	},
	goods_item:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: pxToDp(15),
	},
	img:{
		width: pxToDp(103),
		height: pxToDp(103),
		borderRadius: pxToDp(8),
		overflow: 'hidden'
	},
	goods_detail:{
		flex: 1,
		paddingLeft: pxToDp(20),
	},
	price:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	more:{
		height: pxToDp(46),
		borderRadius: pxToDp(4),
		backgroundColor: '#F1F1F1',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: pxToDp(30)
	},
	order_p:{
		height: pxToDp(100),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	order_p_txt:{
		color: '#333',
		fontSize: pxToDp(fontSize_26)
	},
	bz:{
		marginVertical: pxToDp(30),
		alignItems: 'center',
	},
	ps:{
		marginHorizontal: pxToDp(20),
		height: pxToDp(56),
		backgroundColor: '#FBF2C2',
		borderRadius: pxToDp(4),
		paddingLeft: pxToDp(15),
		color: '#9B5A37',
		lineHeight: pxToDp(56),
		fontSize: pxToDp(fontSize_26),
		marginBottom: pxToDp(30)
	},
	bzInput:{
		height: pxToDp(272),
		backgroundColor: '#F6F6F6',
		textAlignVertical: 'top',
		fontSize: pxToDp(fontSize_28)
	},
	bzk_wrap:{
		position: 'absolute',
		left: 0,
		top: 0,
		width: width,
		height: height,
		backgroundColor: 'rgba(0,0,0,0.5)',
		zIndex: 99,
		alignItems: 'center',
		justifyContent: 'center',
	},
	bzk:{
		width: pxToDp(546),
		height: pxToDp(378),
		backgroundColor: '#fff',
		borderRadius: pxToDp(8),
		paddingHorizontal: pxToDp(20),
	},
	bz_title:{
		height: pxToDp(87),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	aitem:{
		height: pxToDp(89),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20),
		backgroundColor: '#fff'
	},
	phoneInput: {
		height: pxToDp(80),
		backgroundColor: '#F6F6F6',
		fontSize: pxToDp(fontSize_28)
	},
	detail_top_bg:{
		width:'100%',
		height:pxToDp(189),
		backgroundColor:'#5EB319',
	},
	detail_top_part:{
		width:pxToDp(710),
		height:pxToDp(234),
		left:pxToDp(20),
		top:0,
		backgroundColor:'#fff',
		position:'absolute',
		zIndex:2,
		borderRadius:pxToDp(4),
		borderWidth:0.7,
		borderColor:'#F3F3F3',
		flexDirection:'column',
		justifyContent:"center",
		alignItems:'center',
	},
	top_detial__title_View:{
		flexDirection:'row'
	},
	top_detail_title:{
		color:'#333333',
		fontSize:pxToDp(fontSize_34),
		fontWeight:'400',
		marginRight:pxToDp(12),
	},
	order_send_state:{
		color:"#999999",
		fontSize:pxToDp(fontSize_22),
		fontWeight:'300',
		lineHeight:pxToDp(58),
	},
	detail_ope_can_wrap:{
		borderWidth:0.7,
		borderColor:'#999',
		borderRadius:pxToDp(4),
	},
	detail_ope_can_text:{
		color:'#333',
		fontSize:pxToDp(fontSize_22),
		fontWeight:'300',
		paddingVertical:pxToDp(10),
		paddingHorizontal:pxToDp(17),
	},
	order_detail_p:{
		height: pxToDp(60),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	order_p_detail_txt:{
		color: '#333',
		fontSize: pxToDp(fontSize_24),
		fontWeight:'400',
	},
	order_detail_p_total:{
		height: pxToDp(111),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		borderTopWidth:0.7,
		borderColor:'#F1F1F1',
	},
	order_detail_p_total_l:{
		color:'#333',
		fontSize:pxToDp(fontSize_24),
		fontWeight:'400',
	},
	order_detail_p_total_c:{
		color:'#000',
		fontSize:pxToDp(fontSize_24),
		fontWeight:'400',
	},
	order_detail_p_total_r:{
		color:'#000',
		fontSize:pxToDp(42),
		fontWeight:'400',
	},
	detail_goods_list:{
		marginTop: pxToDp(20),
		paddingHorizontal: pxToDp(20),
		backgroundColor: '#fff',
	},
	detail_store_info:{
		width:'100%',
		height:pxToDp(84),
		paddingHorizontal:pxToDp(20),
		flexDirection:'row',
		justifyContent:"space-between",
		alignItems:'center',
	},
	detial_store_l:{
		flexDirection:'row',
		justifyContent:"flex-start",
		alignItems:'center',
	},
	detial_store_r:{
		flexDirection:'row',
		justifyContent:"flex-end",
		alignItems:'center',
	},
	detial_store_l_text:{
		color:'#333',
		fontSize:pxToDp(fontSize_28),
		fontWeight:"400",
		marginRight:pxToDp(20),
	},
	detial_store_r_text:{
		color:'#FF9501',
		fontSize:pxToDp(fontSize_24),
		fontWeight:"400",
		marginLeft:pxToDp(10),
	},
	detail_send_info:{
		width:pxToDp(710),
		height:pxToDp(120),
		borderWidth:0.7,
		borderColor:'#FCFCFC',
		borderRadius:pxToDp(4),
		paddingHorizontal:pxToDp(20),
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center'
	},
	send_info_lview:{
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
	},
	send_info_lview_text:{
		flexDirection:'column',
		justifyContent:'flex-start',
		alignItems:'center'
	},
	send_info_l_text:{
		color:'#333333',
		fontWeight:'300',
		fontSize:pxToDp(fontSize_22),
		marginBottom:pxToDp(10),
		marginLeft:pxToDp(30),
	},
	self_get:{
		width:pxToDp(710),
		height:pxToDp(120),
		borderWidth:0.7,
		borderColor:'#FCFCFC',
		borderRadius:pxToDp(4),
		paddingHorizontal:pxToDp(20),
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center'
	},
	self_get_lview:{
		backgroundColor:'#FF1414',
		borderRadius:pxToDp(4),
	},
	self_get_ltext:{
		color:'#fff',
		fontSize:pxToDp(fontSize_18),
		fontWeight:'300',
		paddingVertical:pxToDp(4),
		paddingHorizontal:pxToDp(8),
	},
	self_get_rview:{
		flexDirection:'row',
		justifyContent:'flex-start',
		marginLeft:pxToDp(150),
	},
	self_get_rtext:{
		color:'#666666',
		fontSize:pxToDp(22),
		fontWeight:'300'
	},
	detail_opr_btn_view:{
		flexDirection:'row',
		justifyContent:'center',
	},
	detail_map_view:{
		width:width,
		height:pxToDp(659),
	},
	order_text_greeen:{
		color:"#5EB319",
		fontSize:pxToDp(fontSize_20),
		fontWeight:"300",
	},
	map_maker_view:{
		backgroundColor: 'rgba(0,0,0,0.6)',
		borderRadius: pxToDp(8),
		elevation: 4,
	},
	map_maker_text:{
		color:'#fff',
		fontWeight:'300',
		paddingVertical:pxToDp(16),
		paddingHorizontal:pxToDp(20),
		fontSize:pxToDp(fontSize_22)
	},
	confirm_order_map:{
		width:width,
		height:pxToDp(340)
	},
	confirm_order_dian_address_v:{
		width:'100%',
		height:pxToDp(72),
		flexDirection:'row',
		justifyContent:"center",
		alignItems:'center',
	},
	confirm_order_dian_address:{
		color:'#333333',
		fontSize:pxToDp(fontSize_30),
		fontWeight:'400',
	},
	timeModal:{
		top: height/2,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},
	modalHeader:{
		height: pxToDp(90),
		paddingHorizontal: pxToDp(20),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: pxToDp(0.7),
		borderStyle: 'solid',
		borderBottomColor: '#EDEDED',
		backgroundColor: '#fff'
	},
	day:{
		height: pxToDp(104),
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: '#EDEDED',
		borderBottomWidth: pxToDp(1),
		borderStyle: 'solid'
	},
	txt28:{
		color: '#333333',
		fontSize: pxToDp(fontSize_28)
	},
	time_main:{
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff'
	},
	time_left:{
		width: pxToDp(194),
		height: '100%',
		backgroundColor: '#F2F2F2',
	},
	time_right:{
		flex: 1,
		backgroundColor: '#fff'
	},
	time_modal:{
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		zIndex: 9999,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'flex-end'
	}
})