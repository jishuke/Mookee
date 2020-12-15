import {StyleSheet,Dimensions} from "react-native";
import pxToDp from "../../util/pxToDp";

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
	home_top: {
	    width:width,
        height: pxToDp(196),
        backgroundColor: main_ldj_color,
        padding:pxToDp(20),
        paddingTop:pxToDp(60),
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
    },
	home_top_wrap:{
	    flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
	home_location:{
	    marginLeft:pxToDp(15),
        marginRight:pxToDp(15),
        color:'#fff',
        fontSize:pxToDp(fontSize_30),
        fontWeight:'400',
    },
	search_view:{
	    flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        height:pxToDp(56),
        backgroundColor:'#fff',
        borderRadius:pxToDp(6),
        paddingHorizontal:pxToDp(20),
        marginTop:pxToDp(20)
    },
	home_search_text:{
        color:'#BABABA',
        fontSize:pxToDp(fontSize_26),
        fontWeight:'300',
    },
	sld_home_stile_view:{
	    width:width,
        height:pxToDp(102),
        borderBottomWidth:0.5,
        borderColor:'#EDEDED',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingHorizontal:pxToDp(20),
		backgroundColor:'#fff',
    },
	sld_home_store_title:{
        color:'#333333',
        fontSize:pxToDp(fontSize_32),
    },
	sld_img_view:{
		width:pxToDp(140),
		height:pxToDp(140),
		borderColor:'#D7D7D7',
		borderWidth:0.7,
		borderRadius:pxToDp(6),
		overflow:'hidden',
	},
	sld_home_store_item_img:{
		width:pxToDp(140),
		height:pxToDp(140),
		borderRadius:pxToDp(6),
	},
	store_item_view:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		width:width,
		height:pxToDp(200),
		paddingHorizontal:pxToDp(20),
		paddingVertical:pxToDp(30),
		backgroundColor:"#fff",
		position:'relative',
	},
	sld_store_item_con:{
		flex:1,
		flexDirection:'column',
		justifyContent:'space-around',
		alignItems:'flex-start',
		paddingLeft:pxToDp(30),
		height:pxToDp(140)
	},
	store_name:{
		color:'#333333',
		fontWeight:'400',
		fontSize:pxToDp(fontSize_32),
	},
	com_flex_between:{
		width:'100%',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'flex-end',
	},
	text_tip:{
		color:'#999999',
		fontSize:pxToDp(fontSize_18),
		fontWeight:'300',
	},
	store_express_method:{
		flexDirection:'row',
		justifyContent:'flex-end'
	},
	sld_express_text:{
		fontSize:pxToDp(fontSize_16),
		color:'#999999',
		fontWeight:'300',
	},
	sld_express_view:{
		borderWidth:0.7,
		borderRadius:pxToDp(4),
		width:pxToDp(86),
		height:pxToDp(24),
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center'
	},
	sld_num_tip_view:{
		backgroundColor:'#FF0902',
		width:pxToDp(38),
		height:pxToDp(38),
		borderRadius:pxToDp(19),
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		position:'absolute',
		top:pxToDp(25),
		left:pxToDp(130),
		zIndex:2
	},
	sld_num_tip_text:{
		fontWeight:'300',
		color:'#fff',
		fontSize:pxToDp(fontSize_24),
	},
	store_stop_tip_view:{
		backgroundColor:'#000',
		opacity:0.5,
		width:pxToDp(140),
		height:pxToDp(140),
		top:pxToDp(30),
		left:pxToDp(20),
		position:'absolute',
		borderRadius:pxToDp(6),
		zIndex:2,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center'
	},
	store_stop_tip_text:{
		color:'#fff',
		fontSize:pxToDp(fontSize_20),
		fontWeight:'500',
	},
	sld_express_con_view:{
		flexDirection:'column',
		alignItems:'flex-start',
	},
	left_icon_wrap:{
		marginRight:pxToDp(10),
		width:pxToDp(32),
		height:pxToDp(24),
		flexDirection:'row',
		justifyContent:'flex-start',
	},
	home_top_location_view:{
		flexDirection:'row',
		alignItems:'center',
	},
	/*LdjSelAddress —— start*/
	sele_search_view:{
		width:width,
		height:pxToDp(70),
		backgroundColor:'#fff',
		flexDirection:'row',
		justifyContent:'center',
	},
	sele_search_wrap:{
		width:pxToDp(689),
		height:pxToDp(56),
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
		borderColor:'#DADADA',
		borderWidth:0.7,
		borderRadius:pxToDp(4),
		paddingHorizontal:pxToDp(20)
	},
	sele_location_view:{
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center',
		backgroundColor:'#fff',
		width:width,
		height:pxToDp(84),
		marginTop:10,
		paddingHorizontal:pxToDp(30),
	},
	sele_location_left:{
		flexDirection:'row',
		justifyContent:'flex-start'
	},
	sele_location_text:{
		color:'#5EB318',
		marginLeft:pxToDp(13),
		fontSize:pxToDp(fontSize_24),
		fontWeight:'400',
	},
	address_title:{
		color:"#333333",
		fontWeight:'400',
		fontSize:pxToDp(fontSize_26),
		paddingLeft:pxToDp(30),
		paddingVertical:pxToDp(24),
	},
	address_item:{
		width:width,
		height:pxToDp(145),
		backgroundColor:'#fff',
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'flex-start',
		paddingHorizontal:pxToDp(30),
		paddingVertical:pxToDp(30)
	},
	sld_del_view:{
		flex:1,
		flexDirection:'row',
		justifyContent:'flex-end',
		alignItems:'flex-start'
	},
	sele_address_name:{
		color:'#666666',
		fontSize:pxToDp(fontSize_26),
		fontWeight:'300',
		width:pxToDp(100),
		flexDirection:'row',
		justifyContent:'flex-start',
		overflow:'hidden'

	},
	address_item_center:{
		flexDirection:'column',
		justifyContent:'space-between',
		alignItems:'flex-start',
	},
	address_tel:{
		color:'#666666',
		fontWeight:'300',
		fontSize:pxToDp(fontSize_26),
	},
	address:{
		color:'#333333',
		fontWeight:'400',
		fontSize:pxToDp(fontSize_26),
		marginTop:pxToDp(15),
	},
	com_login_tip_view:{
		width:pxToDp(165),
		height:pxToDp(49),
		backgroundColor:main_ldj_color,
		borderRadius:pxToDp(24),
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
		marginTop:pxToDp(35)
	},
	com_login_tip_text:{
		color:'#fff',
		fontSize:pxToDp(fontSize_22),
		fontWeight:'300'

	},
	login_tip_view:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
		flexDirection:'column',
		marginTop:-pxToDp(150),
	},
	login_tip_img:{
		width: pxToDp(100),
		height: pxToDp(100)
	},
	sel_add_address_view:{
		width:'100%',
		height:pxToDp(98),
		backgroundColor:main_ldj_color,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center',
	},
	sel_add_address_text:{
		color:'#FFFFFF',
		fontSize:pxToDp(fontSize_30),
		fontWeight:'400',
	},
	/*LdjSelAddress —— end*/

	/*LdjLocation —— start*/
	location_top_search:{
		width:width,
		paddingHorizontal:pxToDp(30),backgroundColor:'#fff',
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center",
		height:pxToDp(90)
	},
	sld_back_icon:{
		width:pxToDp(60),
		height:pxToDp(56),
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
	},
	location_search_view:{
		width:pxToDp(645),
		height:pxToDp(56),
		borderWidth:0.7,
		borderColor:'#DADADA',
		borderRadius:pxToDp(4),
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'center',
		paddingHorizontal:pxToDp(24)
	},
	search_input:{
		flex:1,
		paddingVertical:0,
		height:pxToDp(29),
		marginLeft:pxToDp(15)
	},
	location_map_veiw:{
		width:width,
		height:pxToDp(340),
	},
	poi_item_view:{
		width:'100%',
		height:pxToDp(130),
		backgroundColor:'#fff',
		flexDirection:'row',
		justifyContent:'flex-start',
		alignItems:'flex-start',
		padding:pxToDp(30),
		borderBottomWidth:0.7,
		borderColor:'#DADADA',
	},
	poi_item_right:{
		flexDirection:"column",
		flex:1,
		justifyContent:'space-between',
		alignItems:'flex-start',
		marginLeft:pxToDp(20)
	},
	poi_name:{
		color:'#333333',
		fontWeight:'400',
		fontSize:pxToDp(fontSize_26),
	},
	poi_address:{
		color:'#999999',
		fontWeight:'300',
		fontSize:pxToDp(fontSize_22),
		marginTop:pxToDp(10),
	},
	/*LdjLocation —— end*/
})
