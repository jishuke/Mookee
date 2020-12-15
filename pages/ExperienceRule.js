import React,{Component} from 'react';
import {View,Text,StyleSheet,Dimensions,ScrollView} from 'react-native';
import pxToDp from '../util/pxToDp';
import RequestData from '../RequestData';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';

const {width, height} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class Experience extends Component{
	constructor(props){
		super(props);
		this.state={
			title: I18n.t('ExperienceRule.title'),
			list: []
		}
	}

	componentDidMount(){
		this.getRule()
	}

	getRule(){
		RequestData.postSldData(AppSldUrl+'/index.php?app=growth_grade&mod=growth_rule',{
			key
		}).then(res=>{
			if(res.state==200){
				this.setState({
					list: res.data
				})
			}
		})
	}

	render(){
		const {title,list} = this.state;

		return <View style={GlobalStyles.sld_container}>
			<SldHeader
				title={title}
				left_icon={require('../assets/images/goback.png')}
				left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}
			/>
			<ScrollView style={{paddingTop: pxToDp(30)}}>
				{list.length>0 && list.map((el,index)=><View key={index} style={styles.item}>
					<Text style={styles.item_txt}>{index+1}、{el}</Text>
				</View>)}
			</ScrollView>
		</View>
	}
}

const styles = StyleSheet.create({
	item:{
		paddingBottom: pxToDp(40),
		paddingHorizontal: pxToDp(30)
	},
	item_txt:{
		color: '#333333',
		fontSize: pxToDp(26),
	}
})
