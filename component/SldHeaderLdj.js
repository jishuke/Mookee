import GlobalStyles from "../assets/styles/GlobalStyles";
import React, {Component} from 'react';
import {
  View,Image,TouchableOpacity,Text
} from "react-native";
import NavigationBar from './NavigationBar';

/*
 * 封装的头部
 *@params left_icon  左侧图标
 *@params left_event  左侧图标事件
 *@params right_type  右侧类型：text：文字，icon：图标
 *@params right_event  右侧事件
 *@params right_text  右侧文字
 *@params right_cion  右侧图标
 *
 * @slodon
 * */
export default class SldHeaderLdj extends Component {

    constructor(props){
        super(props);
	    this.state = {

	    }
    }

    componentDidMount() {

    }

	componentWillReceiveProps(props){

	}

	renSldLeftButton = () => {
		return <TouchableOpacity
			activeOpacity={1}
			onPress={()=>{
				this.props.left_event();
			}}>
			<View style={GlobalStyles.topBackBtn}>
				<Image resizeMode={'contain'} style={this.props.left_icon_style} source={this.props.left_icon}></Image>
			</View>
		</TouchableOpacity>;
	}


	renSldRightButton = () => {
		return <TouchableOpacity
			activeOpacity={1}
			onPress={()=>{
				this.props.right_event();
			}}>
			{this.props.right_type == 'text'&&(
				<Text style={this.props.right_style}>{this.props.right_text}</Text>
			)}

			{this.props.right_type == 'icon'&&(
				<View style={GlobalStyles.topBackBtn}>
					<Image style={GlobalStyles.topBackRightBtnImg} source={this.props.right_icon}></Image>
				</View>
			)}
		</TouchableOpacity>;
	}


    render() {
        return (
	        <NavigationBar
		        statusBar={{barStyle: 'default'}}
		        leftButton={this.renSldLeftButton()}
			      rightButton={typeof (this.props.right_type)!='undefined'?this.renSldRightButton():''}
		        title={this.props.title}
		        title_color = {this.props.title_color}
		        popEnabled={false}
		        style={this.props.bg_style}
	        />
        )
    }
}


