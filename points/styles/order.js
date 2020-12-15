import {Dimensions, StyleSheet} from "react-native";
import pxToDp from "../../util/pxToDp";

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
	font32:{
		color: '#181818',
		fontSize: pxToDp(30)
	},
	address:{
		width: width,
		marginTop: pxToDp(20),
	},
	address_info:{
		backgroundColor: '#FFFCEF',
		height: pxToDp(202),
		padding: pxToDp(30),
	},
	addr_left:{

	},
	name:{
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: pxToDp(10)
	},
	goods_list:{
		marginTop: pxToDp(20),
		backgroundColor: '#fff',
	},
	goods_item:{
		flexDirection: 'row',
		alignItems: 'center',
		padding: pxToDp(30),
		borderStyle: 'solid',
		borderBottomWidth: pxToDp(0.6),
		borderBottomColor: '#DADADA'
	},
	goods_img:{
		width: pxToDp(140),
		height: pxToDp(140),
		borderStyle: 'solid',
		borderWidth: pxToDp(0.6),
		borderColor: '#F6F6F6',
		marginRight: pxToDp(30)
	},
	goods_info:{
		flex: 1,
		height: pxToDp(140)
	},
	bw:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	total:{
		marginTop: pxToDp(20),
		backgroundColor: '#fff',
		paddingLeft: pxToDp(30),
	},
	order_info:{
		paddingVertical: pxToDp(20),
		paddingRight: pxToDp(30),
		borderBottomColor: '#CDCDCD',
		borderBottomWidth: pxToDp(0.6),
		borderStyle: 'solid',
	},
	price:{
		height: pxToDp(110),
		alignItems: 'flex-end',
		paddingHorizontal: pxToDp(30),
		justifyContent: 'center'
	},
	price_txt:{
		color: '#C31C1C',
		fontSize: pxToDp(32)
	},
	footer:{
		height: pxToDp(98),
		borderTopWidth: pxToDp(0.6),
		borderTopColor: '#CDCDCD',
		borderStyle: 'solid',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	submit:{
		width: pxToDp(290),
		height: pxToDp(98),
		backgroundColor: '#E74310',
		alignItems: 'center',
		justifyContent: 'center'
	},
	footer_txt:{
		fontSize: pxToDp(30),
		color: '#181818',
		paddingLeft: pxToDp(30)
	},
	add_address:{
		height: pxToDp(142),
		alignItems: 'center',
		justifyContent: 'center'
	},
	add_btn:{
		width: pxToDp(609),
		height: pxToDp(60),
		borderRadius: pxToDp(30),
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#666',
		textAlign: 'center',
		lineHeight: pxToDp(60),
		fontSize: pxToDp(28),
		color: '#666'
	},
	order_state:{
		flexDirection: 'row',
		height: pxToDp(180),
		marginTop: pxToDp(20),
		backgroundColor: '#CAE6F4',
		paddingHorizontal: pxToDp(56),
		paddingVertical: pxToDp(30),
	},
	state_img:{
		marginRight: pxToDp(45)
	},
	state_txt:{
		fontSize: pxToDp(26),
		color: '#333333'
	},
	btns:{
		height: pxToDp(120),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: '#fff'
	},
	btn:{
		width: pxToDp(190),
		height: pxToDp(72),
		backgroundColor: '#fff',
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#707070',
		borderRadius: pxToDp(4),
		marginRight: pxToDp(30),
		alignItems: 'center',
		justifyContent: 'center'
	},
	red_btn:{
		backgroundColor: '#E74310',
		borderColor: '#E74310'
	},
	btn_txt:{
		fontSize: pxToDp(30),
		color: '#181818',
	},
	red_btn_txt:{
		color: '#fff'
	}
})