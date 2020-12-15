/*
 * 专题页面
 * @slodon
 * */
import React, {Component} from 'react';
import {View,ScrollView} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import DiyPage from "../component/DiyPage";
import ViewUtils from '../util/ViewUtils';

var Dimensions = require('Dimensions');
const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;

import {I18n} from './../lang/index'

export default class Special extends Component {

	constructor(props){

		super(props);
		this.state = {
			diy_data:[],//存放所有的装修改数据
			topicid:props.navigation.state.params.topicid != undefined?props.navigation.state.params.topicid:'',
			title:props.navigation.state.params.title != undefined?props.navigation.state.params.title:I18n.t('Special.title'),//页面标题
		}
	}
	componentWillMount() {
		this.getInitData();//获取专题页数据
	}

	getInitData = () => {
		this.getDiyTitle();
		this.getDiyData();
	}

	//获取页面标题
	getDiyTitle = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=topic_title&topic_id='+this.state.topicid)
			.then(result => {
				if (result.datas.error) {
					ViewUtils.sldToastTip(result.datas.error);
				} else {
					this.setState({
						title: result.datas.title,
					});
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	//获取装修数据
	getDiyData = () => {
		RequestData.getSldData ( AppSldUrl + '/index.php?app=index&mod=topic&topic_id='+this.state.topicid)
			.then ( result => {
				if ( result.datas.error ) {
				} else {
					let datainfo = result.datas;
					if(datainfo.length > 0){
						for(let i=0;i<datainfo.length;i++){
							if(datainfo[i]['type'] == 'lunbo'){
								let new_image_info = ViewUtils.handleIMage(datainfo[i]['width'],datainfo[i]['height']);
								datainfo[i]['width'] = new_image_info.width;
								datainfo[i]['height'] = new_image_info.height;
							}else if(datainfo[i]['type'] == 'dapei'){
								let new_image_info = ViewUtils.handleIMage(datainfo[i]['width'],datainfo[i]['height']);
								datainfo[i]['width'] = new_image_info.width;
								datainfo[i]['height'] = new_image_info.height;
							}else if(datainfo[i]['type'] == 'tupianzuhe'){
								if(datainfo[i]['sele_style'] == 0){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height']);
										datainfo[i]['data'][j]['width'] = new_image_info.width;
										datainfo[i]['data'][j]['height'] = new_image_info.height;
									}
								}else if(datainfo[i]['sele_style'] == 1){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height'],scrWidth*1-20);
										datainfo[i]['data'][j]['width'] = new_image_info.width;
										datainfo[i]['data'][j]['height'] = new_image_info.height;
									}
								}else if(datainfo[i]['sele_style'] == 2){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height'],Math.floor((scrWidth*1-30)/2));
										datainfo[i]['data'][j]['width'] = new_image_info.width;
										datainfo[i]['data'][j]['height'] =  new_image_info.height;
									}
								}else if(datainfo[i]['sele_style'] == 3){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										let new_image_info = ViewUtils.handleIMage(datainfo[i]['data'][j]['width'],datainfo[i]['data'][j]['height'],Math.floor((scrWidth*1-40)/3));
										datainfo[i]['data'][j]['width'] = new_image_info.width;
										datainfo[i]['data'][j]['height'] = new_image_info.height;
									}
								}else if(datainfo[i]['sele_style'] == 4){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										if(j==0){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
											datainfo[i]['data'][j]['height'] = Math.floor(datainfo[i]['data'][j]['width']*16/15);
										}else if(j==1||j==2){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
											datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/4);
										}
									}
								}else if(datainfo[i]['sele_style'] == 5){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										if(j==0||j==3){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/3);
											datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
										}else if(j==1||j==2){
											datainfo[i]['data'][j]['width'] = scrWidth*1-30-Math.floor((scrWidth*1-30)/3);
											datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/3);
										}
									}
								}else if(datainfo[i]['sele_style'] == 6){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										if(j==0||j==3){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
											datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-30)/4);
										}else if(j==1||j==2){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-30)/2);
											datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
										}
									}
								}else if(datainfo[i]['sele_style'] == 7){
									let new_data = datainfo[i]['data'];
									for(let j=0;j<new_data.length;j++){
										if(j==4){
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-40)/3);
											datainfo[i]['data'][j]['height'] = Math.floor((scrWidth*1-40)/10*7);
										}else {
											datainfo[i]['data'][j]['width'] = Math.floor((scrWidth*1-40)/3);
											datainfo[i]['data'][j]['height'] = datainfo[i]['data'][j]['width'];
										}
									}
								}
							}
						}
						this.setState ( {
							diy_data : datainfo
						} );
					}
				}
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}

	render() {
		let {title,diy_data} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
				<View style={GlobalStyles.line}/>
				<ScrollView>
					{diy_data.length>0&&
					diy_data.map((item, index) => {
						return (<DiyPage  key={index}  navigation={this.props.navigation} data={item}  />)
					})
					}
				</ScrollView>

			</View>
		)
	}
}
