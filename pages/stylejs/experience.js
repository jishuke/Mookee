import {StyleSheet,Dimensions} from "react-native";
import pxToDp from "../../util/pxToDp";
const {width,height} = Dimensions.get('window');

export default StyleSheet.create({
	right_btn:{
		paddingHorizontal: pxToDp(15),
		height: pxToDp(32),
		backgroundColor: '#FF3B3B',
		color: '#fff',
		fontSize: pxToDp(20),
		lineHeight: pxToDp(32),
		borderRadius: pxToDp(16),
		marginRight: pxToDp(30)
	},
	empty: {
		alignItems: 'center',
		marginTop: height/4,
	},
	btn:{
		width: pxToDp(160),
		height: pxToDp(40),
		borderWidth: pxToDp(0.8),
		borderColor: '#333333',
		borderStyle: 'solid',
		marginTop: pxToDp(64),
		borderRadius: pxToDp(20),
		alignItems: 'center',
		justifyContent: 'center'
	},
	item:{
		backgroundColor: '#fff',
		borderBottomWidth: pxToDp(0.8),
		borderStyle: 'solid',
		borderColor: '#e2e2e2',
		paddingHorizontal: pxToDp(30),
		paddingVertical: pxToDp(20)
	},
	bw: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		lineHeight: pxToDp(45),
		marginBottom: pxToDp(10)
	},
	txt:{
		color: '#949494',
		fontSize: pxToDp(28),
		lineHeight: pxToDp(36),
	},
	time:{
		color: '#949494',
		fontSize: pxToDp(24),
		marginTop: pxToDp(15)
	},
	bw_r:{
		color: '#FF3B3B',
		fontSize: pxToDp(30),
		fontWeight: '600'
	},
	exp_top:{
		width: width,
		height: pxToDp(400)
	},
	header:{
		height: pxToDp(90),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	header_r:{
		width: pxToDp(84)
	},
	exp_top_num:{
		width: width,
		height: pxToDp(163),
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: pxToDp(30)
	},
	exp_top_img:{
		position: 'absolute',
		top: 0,
		width: pxToDp(163),
		height: pxToDp(163),
		left: (width - pxToDp(163))/2,
		zIndex: 11,
	},
	exp_top_txt:{
		position: 'absolute',
		top: 0,
		left: 0,
		width: width,
		height: pxToDp(163),
		textAlign: 'center',
		lineHeight: pxToDp(163),
		zIndex: 22,
	},
	exp_rule:{
		position: 'absolute',
		top: pxToDp(120),
		right: pxToDp(0),
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		width: pxToDp(120),
		height: pxToDp(48),
		borderTopLeftRadius: pxToDp(24),
		borderBottomLeftRadius: pxToDp(24),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 999,
	},
	exp_rule_list:{
		position: 'absolute',
		top: 0,
		left: 0,
		width: width,
		height: height,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 999,
	},
	exp_rule_main:{
		width: pxToDp(500),
		backgroundColor: '#fff',
		borderRadius: pxToDp(6)
	},
	exp_title:{
		paddingTop: pxToDp(55),
		textAlign: 'center',
		color: '#2D2D2D',
		fontSize: pxToDp(34),
	},
	exp_item:{
		paddingVertical: pxToDp(45),
		paddingHorizontal: pxToDp(42)
	},
	exp_btn:{
		height: pxToDp(92),
		alignItems: 'center',
		justifyContent: 'center',
		borderTopWidth: pxToDp(1),
		borderColor: 'rgba(0,0,0,0.1)'
	}
});
