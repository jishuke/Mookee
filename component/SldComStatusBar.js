import GlobalStyles from "../assets/styles/GlobalStyles";
import React, {Component, Fragment} from 'react';
import {
	View, Image, StatusBar, TouchableOpacity,
} from "react-native";
import SldNetWorkTool from './SldNetWorkTool';

/*
 * 封装的公共的状态栏，并检测网络状态
 *
 * @slodon
 * */
export default class SldComStatusBar extends Component{

	constructor(props){
		super(props);
	}

	componentDidMount(){
		if(this.props.nav != undefined){
			SldNetWorkTool.checkNetworkState((isConnected) =>{
				if(!isConnected){
					this.props.nav.navigate('SldNoNetWork');
				}
			});
		}
	}

	renSldLeftButton = () =>{
		return <TouchableOpacity
			activeOpacity={ 1 }
			onPress={ () =>{
				this.props.left_event();
			} }>
			<View style={ GlobalStyles.topBackBtn }>
				<Image style={ GlobalStyles.topBackBtnImg } source={ this.props.left_icon }></Image>
			</View>
		</TouchableOpacity>;
	}

	render(){
		const barStyle = this.props.barStyle != undefined ? this.props.barStyle : 'dark-content'
		const color = this.props.color != undefined ? this.props.color : '#ffffff'
		return (
			<Fragment>
			<StatusBar translucent={ false } hidden={false} backgroundColor={color} barStyle={ barStyle }/>
			</Fragment>
		)
	}
}

