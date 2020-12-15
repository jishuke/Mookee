/*
 * 搜索页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View, Text, TextInput,
	StyleSheet,
	Platform,
	ScrollView,
	Image,
	StatusBar,
	TouchableOpacity,
	DeviceInfo,
    DeviceEventEmitter
} from 'react-native';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import pxToDp from "../util/pxToDp";
import RequestData from "../RequestData";
import CountEmitter from '../util/CountEmitter';
import {I18n} from './../lang/index'
// 导入Dimensions库
var Dimensions = require('Dimensions');
const STATUS_BAR_HEIGHT = 20;
export default class SearchPage extends Component{
	constructor(props){
		super(props);
		this.state = {
			sldHistoryData: [],
			sldHotData: [],
		}
	}

	componentWillMount(){
		this.initInfo();

		//监听更新历史缓存
		CountEmitter.addListener('updateSearchHistory', () => {
			this.initInfo();
		});
	}

	componentWillUnmount(){
		//卸载监听
		CountEmitter.removeListener('updateSearchHistory', () => {});
	}

	initInfo = () => {
		//初始化历史搜索记录(读取本地缓存)
		this.getHistoryData();
		//初始化热门搜索记录
		this.getHotSearchData();
	}

	getHistoryData = () => {
		storage
			.load({
				key: "hisSldSearch",
				autoSync: false,
				syncInBackground: true
			})
			.then(ret => {
				//缓存存在
				this.setState({
					sldHistoryData: ret ? ret.split(',') : []
				});
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
				this.setState({
					sldHistoryData: []
				});
			});
	}

	getHotSearchData = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=index&mod=search_key_list')
			.then(result => {
				if(result.datas.error){
					ViewUtils.sldToastTip(result.datas.error);
				}else{
					this.setState({
						sldHotData: result.datas.list,
					});
				}
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	onChange = (value) => {
		this.setState({value});
	};

	//搜索按钮事件
	handleSldSearch = (e) => {
		let val = e.nativeEvent.text.replace(/(^\s*)|(\s*$)/g, "");
		if(val && val != ' '){
			// CountEmitter.emit('updateSearchCon');
			this.searchSldWord(val);
		}else{
			ViewUtils.sldToastTip(I18n.t('SearchPage.text1'));
		}
	}

	//搜索事件
	searchSldWord = (keyword) => {
        DeviceEventEmitter.emit('search_page', {keyword: keyword, source: 'SearchPage'})
		this.props.navigation.navigate('GoodsSearchList', {keyword: keyword, source: 'SearchPage'});
	}

	//清空历史记录
	clearSldHistory = () => {
		storage.remove({
			key: 'hisSldSearch'
		});
		this.setState({
			sldHistoryData: []
		});
	}

	render(){
		const {sldHistoryData, sldHotData} = this.state;
		return (
			<View style={ styles.container }>
				<View style={ [ styles.homeSldSearchWrap, {
					paddingTop: Platform.OS === 'ios' ? (ios_type != '' ? ios_type : STATUS_BAR_HEIGHT) : 10,
					height: Platform.OS === 'ios' ? (ios_type != '' ? ios_type + 35 : pxToDp(130)) : 55,
				} ] }>
					<View>
						<View style={ styles.homesearchcons }>
							<Image style={ styles.homeSearchimg } source={ require('../assets/images/search.png') }/>
							<TextInput
								style={ [ {
									color: '#666',
									fontSize: pxToDp(24),
									width: pxToDp(550),
									padding: 0,
									height: pxToDp(60)
								}, GlobalStyles.sld_global_font ] }
								underlineColorAndroid={ 'transparent' }
								autoCapitalize='none'
								autoFocus={ true }
								returnKeyType='search'
								keyboardType='default'
								enablesReturnKeyAutomatically={ true }
								onSubmitEditing={ (event) => this.handleSldSearch(event) }
								placeholder={I18n.t('SearchPage.text1')}>
							</TextInput>
						</View>
					</View>

					<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
						this.props.navigation.goBack();
					} }>
						<View style={ styles.cancelBack }>
							<Text style={ [ GlobalStyles.sld_global_font, styles.cancelBackText ] }>{I18n.t('SearchPage.cancel')}</Text>
						</View>
					</TouchableOpacity>

				</View>
				<View style={ GlobalStyles.line }/>
				<ScrollView>
					<View>
						{ sldHistoryData.length > 0 && (
							<View style={ styles.sldSeaTitle }>
								<Text style={ [ GlobalStyles.sld_global_font, styles.sldSeaTitleLeft ] }>{I18n.t('SearchPage.historyrecord')}</Text>
								<TouchableOpacity activeOpacity={ 1 } onPress={ () => {
									this.clearSldHistory();
								} }>
									<Image style={ styles.sldSeaTitleRight }
									       source={ require('../assets/images/his_del.png') }/>
								</TouchableOpacity>
							</View>
						) }
						<View style={ styles.detialView }>
							{ sldHistoryData.length > 0 && (
								sldHistoryData.map((item, index) => {
									return (<TouchableOpacity key={ index } activeOpacity={ 1 } onPress={ () => {
											this.searchSldWord(item);
										} }>
											<View style={ styles.detailWrap }>
												<Text
													style={ [ styles.detailText, GlobalStyles.sld_global_font ] }
												>
													{ item }
												</Text>
											</View>
										</TouchableOpacity>
									)
								})
							)
							}

						</View>
					</View>

					<View>
						<View style={ styles.sldSeaTitle }>
							<Text style={ [ GlobalStyles.sld_global_font, styles.sldSeaTitleLeft ] }>{I18n.t('SearchPage.searches')}</Text>
						</View>
						<View style={ styles.detialView }>
							{
								sldHotData.length > 0 &&
                                sldHotData.map((item, index) => {
                                    return (<TouchableOpacity key={ index } activeOpacity={ 1 } onPress={ () => {
                                            this.searchSldWord(item);
                                        } }>
                                            <View style={ styles.detailWrap }><Text
                                                style={ [ styles.detailText, GlobalStyles.sld_global_font ] }>{ item }</Text></View>
                                        </TouchableOpacity>
                                    )
                                })
							}
						</View>
					</View>
				</ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: StatusBar.currentHeight
	},
	homeSearchimg: {
		width: pxToDp(30),
		height: pxToDp(30),
		marginLeft: pxToDp(15),
		marginRight: pxToDp(15)
	},
	homesearchcons: {
		flexDirection: 'row',
		backgroundColor: '#F5F5F5',
		width: pxToDp(600),
		height: pxToDp(60),
		borderRadius: pxToDp(30),
		justifyContent: 'flex-start',
		alignItems: 'center',
		overflow: 'hidden'
	},
	homeSldSearchWrap: {
		paddingTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? (STATUS_BAR_HEIGHT + 16) : STATUS_BAR_HEIGHT) : 10,
		height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? pxToDp(150) : pxToDp(120)) : pxToDp(80),
		flexDirection: 'row', paddingBottom: pxToDp(10),
		backgroundColor: '#fff',
		paddingLeft: pxToDp(30),
		alignItems: 'center',
	},
	cancelBack: {
		width: pxToDp(110),
		flexDirection: 'row',
		justifyContent: 'center',
		height: pxToDp(60),
		alignItems: 'center',
	},
	cancelBackText: {
		color: '#666',
		fontSize: pxToDp(24),
	},
	sldSeaTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: pxToDp(40),
		marginBottom: pxToDp(20),
		marginLeft: pxToDp(30),
		width: Dimensions.get('window').width * 1 - pxToDp(60),
	},
	sldSeaTitleLeft: {
		color: '#2D2D2D',
		fontSize: pxToDp(28),
	},
	sldSeaTitleRight: {
		width: pxToDp(48),
		height: pxToDp(48),
	},
	detialView: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: pxToDp(30),
		width: Dimensions.get('window').width * 1 - pxToDp(60),
	},
	detailWrap: {
		height: pxToDp(50),
		borderRadius: pxToDp(25),
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: pxToDp(20),
		paddingHorizontal: pxToDp(18),
		marginBottom: pxToDp(20),
		backgroundColor: '#F5F5F5'
	},
	detailText: {
		color: '#2D2D2D',
		fontSize: pxToDp(24),
	},
	newline: {
		marginLeft: pxToDp(30),
		width: Dimensions.get('window').width * 1,
		borderColor: '#ebebeb',
		marginTop: 29,
		borderWidth: 0.5,
	},

});
