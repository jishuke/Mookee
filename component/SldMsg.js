import React, {Component} from 'react';
import {
	View, StyleSheet, Text, TouchableOpacity
} from 'react-native';
import pxToDp from "../util/pxToDp";
import {I18n} from './../lang/index'

export default class SldMsg extends Component{
	constructor(props){
		super(props);
		this.state = {
			info: props.dataSource,
			showMore: false
		}
	}

	go = (type,param)=>{
		this.props.detail(type,param);
	}

	toggle = ()=>{
		this.setState({
			showMore: true
		})
	}

	render(){
		const {info,showMore} = this.state;
		return (
			<View>
				<View style={ styles.center }>
					<Text style={ styles.date }>{ info.message_date }</Text>
				</View>

				<View style={ styles.wrap }>
					<View style={ styles.msg_top }>
						<Text style={ styles.title }>{ info.message_title }</Text>
						<Text
							style={ [ styles.status_txt, info.is_read ? '' : 'b' ] }>{ info.is_read ? I18n.t('com_SldMsg.read') : I18n.t('com_SldMsg.unread') }</Text>
					</View>

					<View style={ styles.msg_con }>
						<Text
							style={ styles.msg_txt }
							ellipsizeMode={ 'tail' }
						>{ info.message_body }</Text>

						{ info.redirect_type != 'sys' && <View style={ styles.link }>
							<TouchableOpacity
								activeOpacity={ 1 }
								onPress={()=>this.go(info.redirect_type,info.redirect_param)}
							>
								<Text style={{color: '#777',fontSize: pxToDp(28)}}>{I18n.t('com_SldMsg.view_more')}>></Text>
							</TouchableOpacity>
						</View> }

					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	link:{
		alignItems: 'flex-end',
		justifyContent: 'center',
		height: pxToDp(60)
	},
	msg_txt:{
		color: '#777777',
		fontSize: pxToDp(28),
		lineHeight: pxToDp(40)
	},
	msg_con:{
		paddingBottom: pxToDp(15)
	},
	b:{
		color: '#2E95FF'
	},
	status_txt:{
		fontSize: pxToDp(20),
		color: '#BBBBBB'
	},
	title:{
		fontSize: pxToDp(30),
		color: '#181818',
	},
	msg_top:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(80),
	},
	wrap: {
		borderRadius: pxToDp(16),
		backgroundColor: '#fff',
		marginHorizontal: pxToDp(30),
		paddingHorizontal: pxToDp(25)
	},
	center:{
		alignItems: 'center',
		justifyContent: 'center',
	},
	date:{
		marginVertical: pxToDp(25),
		backgroundColor: '#BBBBBB',
		textAlign: 'center',
		paddingHorizontal: pxToDp(20),
		borderRadius: pxToDp(4),
		fontSize: pxToDp(22),
		height: pxToDp(43),
		lineHeight: pxToDp(43),
		color: '#fff'
	},

})
