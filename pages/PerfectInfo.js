import React,{Component} from 'react';
import {View,Text,StyleSheet,Dimensions,TextInput,TouchableOpacity} from 'react-native';
import pxToDp from '../util/pxToDp';
import RequestData from '../RequestData';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';

const {width} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class PerfectInfo extends Component{
	constructor(props){
		super(props);
		this.state={
			title: I18n.t('PerfectInfo.enter_nickname'),
			nickname: props.navigation.state.params.nickname || '',
			time_txt:I18n.t('loginPage.getCode') ,
		}
	}

	canClick = true

	submit = () => {
		if (!this.canClick) {
			return
		}
		this.canClick = false

		const { nickname } = this.state;
		const { navigation } = this.props
		if(!nickname){
			ViewUtils.sldToastTip(I18n.t('PerfectInfo.text3'));
			return
		}

        RequestData.postSldData(AppSldUrl + '/index.php?app=usercenter&mod=editUserInfo', {member_nickname: nickname})
            .then(result => {
            	console.log('昵称修改:', result)
                this.canClick = true
                if (result.datas.state == 'failuer') {
                    //用户信息修改失败
                    ViewUtils.sldToastTip(result.datas.error);
                } else {
                    //用户信息修改成功
                    navigation.state.params.callBack(nickname)
                    ViewUtils.sldToastTip(I18n.t('MemberInfo.text1'));
                    setTimeout(() => {
						navigation.goBack()
					}, 800)
                }
            })
            .catch(error => {
                this.canClick = true
                ViewUtils.sldToastTip(error);
            })
	}

	render(){
		const { nickname } = this.state;
		console.log('发反反复复方法：', nickname)

		return (
            <View style={GlobalStyles.sld_container}>
                <SldHeader
                    title={I18n.t('PerfectInfo.wanshanxinxi')}
                    left_icon={require('../assets/images/goback.png')}
                    left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}
                />
				<View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder={I18n.t('PerfectInfo.qingshurunicheng')}
                        underlineColorAndroid={'transparent'}
                        onChangeText={text => this.setState({nickname: text})}
                        value={nickname}
                        maxLength={20}
						autoFocus={true}
                    />
				</View>
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={1}
                    onPress={()=>this.submit()}
                >
                    <Text style={{color: '#fff',fontSize: 15, textAlign: 'center'}}>{I18n.t('ok')}</Text>
                </TouchableOpacity>
            </View>
		)
	}
}

const styles = StyleSheet.create({
	img:{
		marginTop: pxToDp(40),
		width: pxToDp(140),
		height: pxToDp(140),
		borderRadius: pxToDp(70),
		overflow: 'hidden',
		marginBottom: pxToDp(40)
	},
	txt:{
		color: '#3C3C3C',
		fontSize: pxToDp(28),
		marginBottom: pxToDp(40)
	},
	form:{
		width: width,
		backgroundColor: '#fff',
		marginTop: 20,
		paddingHorizontal: 15,
		height: 44
	},
	form_item:{
		flexDirection: 'row',
		alignItems: 'center',
		height: pxToDp(110),
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#ddd'
	},
	f_txt:{
		color: '#CCCCCC',
		fontSize: pxToDp(26)
	},
	label:{
		width: pxToDp(140),
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		flex: 1,
		paddingVertical: 0,
		height: pxToDp(90),
		paddingRight: pxToDp(10)
	},
	code:{
		minWidth: pxToDp(180),
		paddingHorizontal: pxToDp(20),
		height: pxToDp(50),
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: pxToDp(1),
		borderColor: '#FF2F43',
		borderRadius: pxToDp(4)
	},
	btn:{
		height: pxToDp(80),
		borderRadius: pxToDp(40),
		backgroundColor: '#FF2F43',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: pxToDp(150),
		marginHorizontal: 20
	}
})
