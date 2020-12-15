/*
 * 我的优惠券页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, ScrollView, StyleSheet, Image, Text, TouchableOpacity, Dimensions
} from 'react-native';
import CountEmitter from "../util/CountEmitter";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from "../util/pxToDp";
import SldRed from '../component/SldRed'
import LoadingWait from '../component/LoadingWait'
import {I18n, LANGUAGE_CHINESE} from '../lang/index'
import StorageUtil from "../util/StorageUtil";
const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');

const page = 10;
let pn = 1;
let hasmore = true;

export default class MyVoucher extends Component{

	constructor(props){

		super(props);
		this.state = {
			title: I18n.t('MyVoucher.title'),
			red_status: 'not_used',
			redList: [],
			isLoading: 0,
			language: 1,
			memberId: ''
		}
	}

	componentDidMount(){
		StorageUtil.get('memberId', (err, res) => {
            if (!err && res) {
                this.getRedList(res.memberId);
                this.setState({
                    memberId: res.memberId
                });
            }
        });

        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                });
            }
        });

		//监听领取优惠券事件
		CountEmitter.addListener('gainvoucher', () => {
			pn = 1;
			hasmore = true;
			this.getRedList();
		});
	}

	componentWillUnmount(){
		//卸载监听
		CountEmitter.removeListener('gainvoucher', () => {});
	}

	//
	getRedList(memberId_param){
		this.setState({
			isLoading: 0
		})
		const {red_status, memberId, language} = this.state;
		// console.log('用户id:', memberId)
		const member_id = memberId_param || memberId
		const url = `/index.php?app=red&mod=red_list&sld_addons=red&page=${page}&pn=${pn}&key=${key}&red_status=${red_status}&member_id=${member_id}&lang_type=${language}`
		RequestData.getSldData(AppSldUrl + url).then(res => {
			this.setState({
				isLoading: 1
			});
			if(pn == 1){
				this.setState({
					redList: res.datas.red
				})
			}else{
				let redList = this.state.redList;
				this.setState({
					redList: redList.concat(res.datas.red)
				})
			}
			if(res.hasmore == false){
				hasmore = false;
			}else{
				pn++;
			}
		}).catch(err => {
			ViewUtils.sldErrorToastTip(error);
			this.setState({
				isLoading: 1
			})
		})
	}

	change = (type) => {
		let {red_status} = this.state;
		if(red_status == type) return;
		this.setState((prevState, props) => {
			return {
				red_status: type
			}
		}, () => {
			pn = 1;
			hasmore = true;
			this.getRedList();
		})
	}

	getMore = (e) => {
		let scrollH = e.nativeEvent.contentSize.height;
		let ch = e.nativeEvent.layoutMeasurement.height;
		let y = e.nativeEvent.contentOffset.y;
		if((ch + y) > scrollH - 50){
			if(hasmore){
				this.getRedList();
			}
		}
	}

	render(){
		const {title, redList, isLoading, red_status, language} = this.state;
		console.log('当前语言:', language)

        const nav = [
            {
                name: I18n.t('MyVoucher.text1'),
                type: 'not_used',
            },
            {
                name: I18n.t('MyVoucher.text2'),
                type: 'used'
            },
            {
                name: I18n.t('MyVoucher.text3'),
                type: 'expired'
            }
        ]

		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ GlobalStyles.line }/>
				<View style={ styles.nav }>
					{
						nav.map(el => <TouchableOpacity
							onPress={ () => this.change(el.type) }
						>
							<View style={ [ styles.nav_item, (red_status == el.type ? (styles.nav_on) : '') ] }>
								<Text style={ {
									fontSize: pxToDp(30),
									color: (red_status == el.type ? '#FF1F1F' : '#333')
								} }>{ el.name }</Text>
							</View>
						</TouchableOpacity>)
					}
				</View>
				{/*<View style={styles.wrap}>

				 </View>*/ }

				<ScrollView
					style={ {flex: 1} }
					onScroll={ e => this.getMore(e) }
				>
					{ redList.length > 0 && redList.map(el => <SldRed
						key={ el.id }
						info={ el }
						type={ red_status != 'not_used' ? 1 : 0 }
						use={ () => {
							this.props.navigation.navigate('GoodsSearchList', {keyword: '', catid: '',redID:el.redinfo_id})
						} }
					/>) }

					{ redList.length == 0 && isLoading == 1 && <View style={ styles.err }>
						<Image style={ {width: pxToDp(200), height: pxToDp(200)} }
						       source={ require('../assets/images/nothave.png') }/>
						<Text style={ {marginTop: pxToDp(30), fontSize: pxToDp(30), color: '#696969'} }>{I18n.t('MyVoucher.text4')}</Text>
					</View> }
				</ScrollView>

				{ isLoading == 0 && <LoadingWait loadingText={I18n.t('loading')} cancel={ () => {
				} }/> }

				{/*<TouchableOpacity*/}
				{/*	style={ styles.add }*/}
				{/*	onPress={ () => {*/}
				{/*		this.props.navigation.navigate('GetVoucher');*/}
				{/*	} }*/}
				{/*>*/}
				{/*	<Image style={ {width: pxToDp(39), height: pxToDp(32), marginRight: pxToDp(20)} }*/}
				{/*	       source={ require('../assets/images/ling.png') }/>*/}
				{/*	<Text style={ {fontSize: pxToDp(34), color: '#E74310', fontWeight: '300'} }>{I18n.t('MyVoucher.text5')} >></Text>*/}
				{/*</TouchableOpacity>*/}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrap: {
		width: deviceWidth,
		flex: 1,
		alignItems: 'center',
	},
	err: {
		marginTop: pxToDp(200),
		alignItems: 'center',
	},
	nav: {
		width: deviceWidth,
		height: pxToDp(90),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		backgroundColor: '#fff',
		borderBottomColor: '#DADADA',
		borderBottomWidth: pxToDp(1),
		borderStyle: 'solid'
	},
	nav_item: {
		flex: 1,
		marginHorizontal: pxToDp(30),
		alignItems: 'center',
		justifyContent: 'center',
	},
	nav_on: {
		borderBottomWidth: pxToDp(3),
		borderBottomColor: '#FF1F1F',
		borderStyle: 'solid',
	},
	item: {
		marginBottom: pxToDp(30)
	},
	add: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: pxToDp(30),
		height: pxToDp(110),
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#E74310',
		borderRadius: pxToDp(8),
		marginBottom: pxToDp(60),
	}
})
