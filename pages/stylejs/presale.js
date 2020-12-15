import {StyleSheet,Dimensions} from "react-native";
import pxToDp from "../../util/pxToDp";

const {width} = Dimensions.get('window');

export default StyleSheet.create({
	addr: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(188),
		paddingHorizontal: pxToDp(30),
		paddingVertical: pxToDp(20),
		backgroundColor: '#fff'
	},
	addr_l: {
		marginBottom: pxToDp(20),
	},
	addr_r:{
		flexDirection: 'row',
		alignItems: 'center',
	},
	txt_w: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: pxToDp(30)
	},
	txt: {
		color: '#353535',
		fontSize: pxToDp(28)
	},
	addr_empty:{
		height: pxToDp(188),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	addAddr:{
		width: pxToDp(400),
		height: pxToDp(60),
		borderRadius: pxToDp(30),
		borderColor: '#EEE',
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		lineHeight: pxToDp(58),
		textAlign: 'center',
		fontSize: pxToDp(26)
	},
	m20:{
		marginTop: pxToDp(20),
		backgroundColor: "#fff",
		paddingHorizontal: pxToDp(20)
	},
	title:{
		height: pxToDp(90),
		lineHeight: pxToDp(90),
		color: '#353535',
		fontSize: pxToDp(32),
	},
	goods:{
		flexDirection: 'row',
		borderTopWidth: pxToDp(1),
		borderTopColor: '#E8E8E8',
		borderStyle: 'solid',
		paddingVertical: pxToDp(30)
	},
	name:{
		color: '#353535',
		fontSize: pxToDp(28),
		lineHeight: pxToDp(32),
	},
	price:{
		color: '#FE011D',
		fontSize: pxToDp(30),
	},
	old_price:{
		flexDirection: 'row',
		alignItems: 'center',
	},
	goods_info:{
		flex: 1,
		minHeight: pxToDp(200),
		justifyContent: 'space-between'
	},
	m_item:{
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(90),
		justifyContent: 'space-between',
		borderStyle: 'solid',
		borderTopColor: '#E8E8E8',
		borderTopWidth: pxToDp(1)
	},
	m_left:{
		color: '#353535',
		fontSize: pxToDp(30)
	},
	m_right:{
		flexDirection: 'row',
		alignItems: 'center'
	},
	input:{
		height: pxToDp(180),
		lineHeight: pxToDp(60),
		textAlignVertical: 'top',
		fontSize: pxToDp(24)
	},
	xy:{
		height: pxToDp(90),
		flexDirection: 'row',
		alignItems: 'center'
	},
	foot:{
		height: pxToDp(98),
		flexDirection: 'row',
		backgroundColor: '#fff',
	},
	foot_l:{
		flex: 1,
		textAlign: 'center',
		lineHeight: pxToDp(98),
		color: '#F01313',
		fontSize: pxToDp(30)
	},
	submit_btn:{
		width: pxToDp(252),
		height: pxToDp(98),
		backgroundColor: '#FE011D',
		alignItems: 'center',
		justifyContent: 'center'
	},
	payList:{
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(130),
		borderStyle: 'solid',
		borderTopWidth: pxToDp(1),
		borderTopColor: '#E8E8E8',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(20)
	},
	pay_l:{
		flexDirection: 'row',
		alignItems: 'center',
	},
	pay_txt:{
		color: '#808080',
		fontSize: pxToDp(24),
	},
	pay_btn:{
		height: pxToDp(100),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FC8800'
	},
	num:{
		color: '#666666',
		fontSize: pxToDp(24)
	},
	preSaleNav:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		height: pxToDp(80),
		backgroundColor: '#FF0A50',
	},
	preSaleItem:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	on:{
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#fff',
		borderStyle: 'solid'
	},
	preSaleOrder:{
		margin: pxToDp(20),
		backgroundColor: '#fff',
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#eee',
		borderRadius: pxToDp(25)
	},
	pre_top:{
		height: pxToDp(80),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: pxToDp(30),
	},
	pre_vendor:{
		flexDirection: 'row',
		alignItems: 'center',
	},
	pre_order_b:{
		alignItems: 'flex-end',
		paddingHorizontal: pxToDp(20)
	},
	addr2:{
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(188),
		paddingHorizontal: pxToDp(30),
		paddingVertical: pxToDp(20),
		backgroundColor: '#fff'
	},
	jd_item:{

	},
	jd_title:{
		color: '#FF0031',
		fontSize: pxToDp(30),
		paddingLeft: pxToDp(20),
		borderLeftWidth: pxToDp(2),
		borderLeftColor: '#FF0031',
		borderStyle: 'solid',
		marginVertical: pxToDp(26)
	},
	jd_price:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(100)
	},
	jd_tip: {
		color: '#999999',
		fontSize: pxToDp(24)
	},
	order_btn:{
		width: pxToDp(250),
		height: pxToDp(98),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FE011D'
	},
	goods_info2:{
		flex: 1,
	},
	pin_price:{
		marginTop: pxToDp(20),
		flexDirection: 'row'
	},
	preSaleNav2:{
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(80),
	},
	preSaleItem2:{
		width: width/5,
		lineHeight: pxToDp(80)
	},
	on2:{
		borderBottomWidth: pxToDp(2),
		borderBottomColor: '#EE1B21',
		borderStyle: 'solid',
		color: '#EE1B21'
	},
	pinnum:{
		color: '#353535',
		fontSize: pxToDp(28)
	},
	spec:{
		flexDirection: 'row',
		alignItems: 'center',
	},
	pin_item:{
		height: pxToDp(90),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	flex: {
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(90)
	},
	pin_jd_title:{
		color: '#353535',
		fontSize: pxToDp(30),
		marginRight: pxToDp(65)
	},
	pin_jd_tip:{
		fontSize: pxToDp(28)
	},
	disable_btn:{
		backgroundColor: '#ccc'
	},
	pin_foot_txt:{
		flex: 1,
		textAlign: 'center',
		lineHeight: pxToDp(98),
		color: '#F01313',
		fontSize: pxToDp(30)
	},
	tabBarUnderline: {
		backgroundColor: '#EEEEEE',
		height: 2,
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
	jtt_time:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: pxToDp(30),
	},
	jtt_time_line:{
		width: pxToDp(116),
		height: pxToDp(1),
		backgroundColor: '#E1E1E1'
	},
	jtt_time_txt:{
		color: '#5D5D5D',
		fontSize: pxToDp(18),
		backgroundColor: '#E6E6E6',
		paddingHorizontal: pxToDp(10),
		borderRadius: pxToDp(4),
		lineHeight: pxToDp(24)
	},
	sld_pay_list_item:{width:width,height:pxToDp(120),paddingLeft:15,paddingRight:15,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',backgroundColor:'#fff',borderColor:'#e5e5e5',borderBottomWidth:0.5},
	sld_item_text:{fontWeight:'300',fontSize: pxToDp(28),color: "#333",marginLeft: pxToDp(50)},
	sld_item_sele_view:{flexDirection: "row", alignItems: "center", justifyContent: "flex-end",flex:1},

	container: {
		backgroundColor: 'transparent',
		position: 'relative',
		flex: 1
	},
	wrapper_part_text:{
		fontSize:pxToDp(28),color:'#333',fontWeight:'400',marginRight:pxToDp(24)
	},
	wrapper_part_multi_input:{
		color:'#666',fontSize:pxToDp(24),width: pxToDp(410),height:pxToDp(80),
		borderWidth:0.5,borderColor:'#b5b5b5',
		flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:pxToDp(30),paddingTop:pxToDp(10),paddingRight:pxToDp(20)
	},
	sld_submit_button:{ position: "absolute", bottom: 0, left: 0, right: 0, height: pxToDp(100), flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: '#ED6307' },
	sld_submit_button_text:{ color: "#fff", fontSize: pxToDp(38) },
	sld_yue_modal:{
		backgroundColor: "#fff", height: 180,
		position: "absolute", left: 0, right: 0,zIndex:10,
		width: width,
	},
	sld_yue_modal_main:{flexDirection:'column',width:width,paddingLeft:15,paddingTop:15,paddingRight:15,position:'relative'},
	sld_yue_modal_close_wrap:{position:'absolute',zIndex:2,width:pxToDp(40),height:pxToDp(40),top:pxToDp(10),right:pxToDp(10)},
	sld_yue_modal_close_img:{width:pxToDp(40),height:pxToDp(40)},
	sld_pay_item_center_up_text:{ fontSize: pxToDp(28), color: "#989898", marginLeft: 25 },
	sld_pay_item_center_down_text:{ fontSize: pxToDp(24), color: "#a9a9a9", marginLeft: 25 },
})
