import React,{Component} from 'react';
import {View,ScrollView,Text,TouchableOpacity,Image,ImageBackground,StyleSheet,Dimensions} from 'react-native';
import pxToDp from '../util/pxToDp';
import RequestData from '../RequestData';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';

const {width} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class MemberGrade extends Component{
	constructor(props){
		super(props);
		this.state={
			title: I18n.t('MemberGrade.title'),
			grade_list: [],
			member_info: '',
			prev: '',
			next: '',
			nowval: '',
			nextval: ''
		}
	}

	componentDidMount(){
		this.getGradeInfo();
	}

	getGradeInfo(){
		RequestData.getSldData(AppSldUrl+'/index.php?app=usercenter&mod=member_grade&key='+key).then(res=>{
			if(res.status==200){
				let grade_list = res.data.grade_list;
				let member_info = res.data.member_info;
				let prev, next;
				let nowval = parseInt(member_info.member_growthvalue);
				for (let i = 0; i < grade_list.length; i++) {
					var el = grade_list[i];
					if (el.grade_name == member_info.grade_name) {
						if (i > 0) {
							prev = grade_list[i - 1]
							if (i < grade_list.length - 1) {
								next = grade_list[i + 1]
							} else {
								next = ''
							}
						} else {
							prev = '';
							next = grade_list[1]
						}
					}
				}
				let nextval='';
				if (next) {
					nextval = parseInt(next.grade_value);
				}
				this.setState({
					grade_list: grade_list,
					member_info: member_info,
					prev: prev,
					next,
					nowval,
					nextval
				})
			}
		})
	}

	render(){
		const {grade_list,member_info,prev,next,nowval,nextval,title} = this.state;

		return <View style={GlobalStyles.sld_container}>
			<SldHeader title={title} left_icon={require('../assets/images/goback.png')}
			           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
			<View style={GlobalStyles.line}/>

			<ScrollView>
				<View style={styles.bg_top}></View>

				<ImageBackground
					style={ styles.sld_mem_top_bg }
					source={ require("../assets/images/grade_bg.png") }
					resizeMode={'stretch'}
				>
					<Text style={styles.grade_txt}>{I18n.t('MemberGrade.title')}{member_info?member_info.grade_name:''}</Text>
					<View style={styles.pro}>
						{prev!='' &&  <View style={styles.level_l}>
							<Image style={styles.level_img} source={{uri: prev.grade_img}} resizeMode={'contain'}></Image>
						</View>}

						{member_info != '' && <View style={styles.center}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={()=>{
									this.props.navigation.navigate('Experience')
								}}
							>
								<View style={styles.cen_top}>
									<Image style={styles.avator} source={{uri: member_info.member_avatar}} resizeMode={'contain'}></Image>
									<Image style={styles.c_g_img} source={{uri: member_info.grade_img}} resizeMode={'contain'}></Image>
								</View>
							</TouchableOpacity>

							<View style={styles.now_exe}>
								<Text style={styles.w_txt}>{I18n.t('MemberGrade.EXP')}</Text>
								<Text style={styles.now_num}>{member_info.member_growthvalue}</Text>
							</View>
						</View>}

						{next!='' && <View style={styles.level_r}>
							<Image style={styles.level_img} source={{uri: next.grade_img}} resizeMode={'contain'}></Image>
							<Text style={styles.w_txt}>{I18n.t('MemberGrade.Yet_to_come')}</Text>
							<Text style={styles.w_txt}>{I18n.t('MemberGrade.short')}{nextval - nowval}{I18n.t('MemberGrade.value')}</Text>
						</View>}
					</View>
				</ImageBackground>

				<Image style={styles.link} resizeMode={'contain'} source={require('../assets/images/grade_bg2.png')}></Image>

				<View style={styles.grade_list}>
					<ImageBackground
						source={require('../assets/images/grade_jd.png')}
						resizeMode="cover"
						style={styles.list_top}
					>
						<Text style={styles.list_top_txt}>{I18n.t('MemberGrade.my')}</Text>
						<Text style={styles.list_tip}>{I18n.t('MemberGrade.schedule')}</Text>
					</ImageBackground>

					{grade_list.length>0 && <View style={styles.list}>
						<View style={styles.item}>
							<Text style={styles.item_t}>{I18n.t('MemberGrade.title')}</Text>
							<Text style={styles.item_t}>{I18n.t('MemberGrade.product')}</Text>
							<Text style={styles.item_t}>{I18n.t('MemberGrade.discounts')}</Text>
						</View>

						{grade_list.map(el=><View style={styles.item} key={el.id}>
							<Text style={styles.item_txt}>{el.grade_name}</Text>
							<Text style={styles.item_txt}>{el.grade_value}</Text>
							<Text style={styles.item_txt}>{(el.grade_discount==100 || el.grade_discount==0)?I18n.t('MemberGrade.nodiscounts'):I18n.t('MemberGrade.buyhas')+(el.grade_discount/10)+I18n.t('ConfirmOrder.break')}</Text>
						</View>)}
					</View>}
				</View>
			</ScrollView>

		</View>
	}
}

const styles = StyleSheet.create({
	bg_top:{
		width: width,
		height: pxToDp(260),
		backgroundColor: '#000',
		borderBottomLeftRadius: pxToDp(130),
		borderBottomRightRadius: pxToDp(130)
	},
	sld_mem_top_bg:{
		position: 'absolute',
		top: pxToDp(30),
		left: pxToDp(20),
		width: width-pxToDp(40),
		height: pxToDp(340),
		zIndex: 2,
	},
	grade_txt:{
		paddingTop: pxToDp(60),
		paddingBottom: pxToDp(30),
		textAlign: 'center',
		fontSize: pxToDp(32),
		color: '#fff'
	},
	level_l:{
		position: 'absolute',
		top: pxToDp(10),
		left: pxToDp(60),
	},
	level_r:{
		position: 'absolute',
		top: pxToDp(10),
		right: pxToDp(60),
	},
	level_img:{
		width: pxToDp(50),
		height: pxToDp(50),
	},
	center:{
		position: 'absolute',
		top: 0,
		left: width/2 - pxToDp(160),
		width: pxToDp(300),
		alignItems: "center",
	},
	cen_top:{

	},
	avator:{
		width: pxToDp(86),
		height: pxToDp(86),
		borderRadius: pxToDp(43),
		borderStyle: 'solid',
		borderWidth: pxToDp(4),
		borderColor: '#BFBFBF'
	},
	c_g_img:{
		position: 'absolute',
		left: pxToDp(66),
		top: pxToDp(66),
		width: pxToDp(42),
		height: pxToDp(42),
	},
	w_txt:{
		marginTop: pxToDp(20),
		fontSize: pxToDp(20),
		color: '#fff',
	},
	now_num:{
		fontSize: pxToDp(18),
		textAlign: 'center',
		color: '#fff'
	},
	link: {
		width: width - pxToDp(40),
		height: pxToDp(127),
		marginTop: pxToDp(150),
		marginHorizontal: pxToDp(20),
	},
	grade_list:{
		marginTop: pxToDp(40),
		marginHorizontal: pxToDp(20),
		marginBottom: pxToDp(20)
	},
	list_top:{
		width: width-pxToDp(40),
		height: pxToDp(98),
	},
	list_top_txt:{
		textAlign: 'center',
		color: '#333333',
		fontSize: pxToDp(30),
		marginTop: pxToDp(20),
		marginBottom: pxToDp(5),
	},
	list_tip:{
		textAlign: 'center',
		color: '#CFA770',
		fontSize: pxToDp(18)
	},
	list:{
		borderLeftWidth: pxToDp(0.8),
		borderRightWidth: pxToDp(0.8),
		borderColor: '#F7DFD1',
		borderStyle: 'dashed'
	},
	item:{
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: pxToDp(10),
		minHeight: pxToDp(80),
		borderBottomWidth: pxToDp(0.8),
		borderColor: '#C6A16D',
		borderStyle: 'dashed',
	},
	item_t:{
		flex: 1,
		color: '#C6A16D',
		fontSize: pxToDp(26),
		textAlign: 'center',
		fontWeight: 'bold',
	},
	item_txt:{
		flex: 1,
		color: '#C6A16D',
		fontSize: pxToDp(26),
		textAlign: 'center',
	}
})
