/*
 * 入驻申请页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View ,
	StyleSheet ,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import {I18n} from './../lang/index'

var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');
export default class SelTypeIsSupply extends Component {

	constructor(props){

		super(props);
		this.state={
			title:I18n.t('CompanyStep11.title'),
		}
	}
	componentWillMount() {

	}

	onClick = (type) => {
		alert(type);
	}



	render() {
		const {title} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
				<View style={GlobalStyles.line}/>
				<View style={GlobalStyles.space_shi_separate} />

				{ViewUtils.getSldApplyVenTypeItem(()=>this.onClick('lingshou'),require('../assets/images/sld_sel_ven_type_lingshou.png'),I18n.t('CompanyStep11.Entered_retailer'),I18n.t('CompanyStep11.text1'))}
				<View style={GlobalStyles.space_shi_separate} />
				{ViewUtils.getSldApplyVenTypeItem(()=>this.onClick('lingshou'),require('../assets/images/sld_sel_ven_type_supply.png'),I18n.t('CompanyStep11.enterprises'),I18n.t('CompanyStep11.text2'))}


			</View>
		)
	}
}
const styles = StyleSheet.create({
		backgroud_image:{
		width:width,
		height:height_com_head,
	},
});