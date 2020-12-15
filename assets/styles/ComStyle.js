/**
 * common文件的样式
 * @flow
 */
import {
	Dimensions, DeviceInfo
} from 'react-native'
import pxToDp from "../../util/pxToDp";

const {height, width} = Dimensions.get('window');
const STATUS_BAR_HEIGHT = DeviceInfo.isIPhoneX_deprecated ? 35 : 20;
module.exports = {
	/*Login.js ----start*/
	lg_contain: {flex: 1, backgroundColor: '#fff'},
	lg_main_view: {flexDirection: 'column', alignItems: 'center', paddingTop: pxToDp(150)},
	lg_title: {
		color: main_color,
		fontSize: pxToDp(34),
		marginTop: pxToDp(27),
		marginBottom: pxToDp(93)
	},
	lg_item_view: {
		flexDirection: 'row',
		width: pxToDp(651),
		height: pxToDp(100),
		justifyContent: 'flex-start',
		alignItems: 'center',
		borderBottomWidth: 0.5,
		borderColor: '#EDEDED',
		marginTop: pxToDp(20)
	},
	lg_item_context: {color: '#666', fontSize: pxToDp(28)},
	lg_item_input: {color: '#666', flex: 1, padding: 0, marginLeft: pxToDp(32)},
	lg_btn_view: {
		marginTop: pxToDp(97),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	lg_btn_text: { fontSize: pxToDp(34), color: '#fff'},
	lg_btn_bg: {width: pxToDp(600), height: pxToDp(88)},
	login_bot_view:{marginTop:pxToDp(50)},
	login_bot_tip:{fontSize:pxToDp(24),color:'#ADADAD',fontWeight:'300',marginBottom: pxToDp(20)},

	/*Login.js ----end*/

	/*ConfirmOrder.js---start*/
	cfo_empty_view: {
		width: '90%',
		height: pxToDp(70),
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: "#E5E5E5",
		borderWidth: 0.7,
		borderRadius: pxToDp(4),
		marginLeft: '5%',
	},
	cfo_empty_text: {
		color: '#9C9C9C',
		fontSize: pxToDp(26),
		fontWeight: '400',
	},
	invoice_view: {
		flexDirection: 'row',
		justifyContent: "space-between",
		alignItems: 'center',
		width: '100%',
		height: pxToDp(90),
		backgroundColor: "#fff",
		padding: 10
	},
	inv_left_text: {
		color: '#333333',
		fontSize: pxToDp(26),
		fontWeight: '400',
	},
	inv_left_view: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	point_part:{
		backgroundColor:'#fff',
		padding:10,
		flexDirection:'column',
		justifyContent:'center',
		alignItems: 'flex-start',
	},
	inp_point_view:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems: 'center',
		height:pxToDp(90),
		width:'100%',
	},
	inp_point_view_l:{
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems: 'center',
	},
	inp_point_view_ltext:{
		color: '#333333',
		fontSize: pxToDp(26),
		fontWeight: '400',
		marginRight: 5,
	},
	inp_point_view_l_com:{
		color: '#333333',
		fontSize: pxToDp(23),
		fontWeight: '300',
	},
	inp_point_view_l_spe:{
		color: '#f23030',
		fontSize: pxToDp(23),
		fontWeight: '300',
	},
	point_input:{
		width:pxToDp(140),
		height:pxToDp(52),
		padding:0,
		paddingHorizontal:5,
		borderWidth:0.7,
		borderColor:'#ddd',
		marginHorizontal: 3,
	},
	/*ConfirmOrder.js---end*/

	/*SelPayOnOrOff.js---start*/
	com_btn: {
		paddingLeft: pxToDp(35),
		paddingRight: pxToDp(35),
		paddingTop: pxToDp(17),
		paddingBottom: pxToDp(17),
		borderColor: '#BFBFBF',
		borderWidth: 0.7,
		borderRadius: pxToDp(4)
	},
	com_btn_text: {
		fontSize: pxToDp(24),
		fontWeight: '400'
	},
	sele_pay_method_view: {
		backgroundColor: "#fff",
		width: '100%',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: pxToDp(35),
		paddingBottom: pxToDp(35),
		height: pxToDp(187),
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	/*SelPayOnOrOff.js---end*/

	/*SldNoNetWork.js---start*/
	net_container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	net_text: {
		fontSize: pxToDp(24),
		color: '#828282',
		fontWeight: '400',
		marginTop: pxToDp(67)
	},
	net_refresh_view: {
		width: pxToDp(183),
		height: pxToDp(65),
		borderColor: '#C3C3C3',
		borderWidth: 0.7,
		borderRadius: pxToDp(65),
		marginTop: pxToDp(40)
	},
	net_refresh_text: {
		fontSize: pxToDp(24),
		color: '#828282',
		fontWeight: '400'
	},
	/*SldNoNetWork.js---end*/

	/*SelInvoice.js---start*/
	sele_invoice_item:{
		paddingHorizontal:pxToDp(20),
		width:'100%',
		height:pxToDp(90),
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		borderBottomWidth:0.7,
		borderColor:'#E9E9E9',
		backgroundColor:"#fff",
	},
	sele_invoice_left:{
		flex:1,
		flexDirection:"row",
		justifyContent:'flex-start',
		alignItems:"center"
	},
	sel_inv_left_text:{
		color:'#333333',
		fontWeight:'300',
		fontSize:pxToDp(24),
		marginLeft:pxToDp(20),
	},
	sld_invoice_del:{
		width:pxToDp(90),
		height:pxToDp(90),
		flexDirection:"row",
		justifyContent:'center',
		alignItems:'center',
	},
	sel_invoice_modal_bg:{
		position:"absolute",
		top:0,
		left:0,
		right:0,
		bottom:0,
		zIndex:2,
		backgroundColor:'rgba(0,0,0,.6)',
	},
	sel_invoice_modal_con_view:{
		width:'100%',
		height:width,
		backgroundColor:'#fff',
		marginTop:height-width,
	},
	wrapper_part_line_input:{
		flex:1,
		color:'#333',
		fontSize:pxToDp(22),
		height:pxToDp(50),
		fontWeight:'300',
		paddingVertical:0,
		paddingHorizontal:pxToDp(20),
	},
	sel_invoice_detail_empty:{
		width:'100%',
		height:pxToDp(40),
		backgroundColor:'#fff'
	},
	sel_invoice_type:{
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	sel_invoice_type_text:{
		color: '#333333',
		fontSize: pxToDp(26),
		fontWeight: '400'
	},
	sel_inv_detail_item:{
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: width,
		padding: pxToDp(30)
	},
	sel_inv_detail_item_text:{
		color: '#333',
		fontSize: pxToDp(28),
		fontWeight: '300',
		lineHeight: pxToDp(40)
	},
	sel_inv_detail_item_line:{
		height: 0.5,
		backgroundColor: '#e5e5e5',
		width: width,
		marginLeft: pxToDp(20)
	},
	sel_inv_input_view:{
		width:'100%',
		height:pxToDp(90),
		backgroundColor:'#fff',
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
		paddingHorizontal:pxToDp(20),
		borderBottomWidth:0.7,
		borderColor:'#E9E9E9'
	},
	sel_inv_input_view_text:{
		color:'#333333',
		fontSize:pxToDp(24),
		fontWeight:'300'
	},
	sel_inv_detail_con_view:{
		width: pxToDp(720),
		height: pxToDp(100),
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: pxToDp(20)
	},
	/*SelInvoice.js---end*/

	other_type:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: pxToDp(50)
	}
};
