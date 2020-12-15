import SldComStatusBar from "../../component/SldComStatusBar";
import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	Image,
	TextInput, Alert, Platform
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import pxToDp from "../../util/pxToDp";
import StorageUtil from "../../util/StorageUtil";
import RequestData from "../../RequestData";

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class LdjSearch extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: '搜索',
			searchList: [],
			keyword: '',
			type: props.navigation.state.params != undefined ? props.navigation.state.params.type : 1,   // 搜索类型 1：全局
			                                                                                             // 2：店内
			vid: props.navigation.state.params != undefined ? props.navigation.state.params.vid : '',
		}
	}

	componentDidMount(){
		this.getSearchList();
	}

	// 获取本地搜索记录
	getSearchList(){
		StorageUtil.get('searchlist', (error, object) => {
			if(!error && object){
				this.setState({
					searchList: object
				})
			}
		});
	}

	// 添加记录
	setSearchList(val){
		let {searchList} = this.state;
		searchList.unshift(val);
		searchList = searchList.filter((el, index) => searchList.indexOf(el) == index);
		while(searchList.length > 30){
			searchList.pop();
		}
		StorageUtil.set('searchlist', searchList)
	}

	search = (val) => {
		let {keyword, type} = this.state;
		let k = val ? val : keyword;
		if(!val){
			if(!keyword.trim()){
				ViewUtils.sldToastTip('请输入您要搜索的内容');
				return;
			}
		}
		this.setSearchList(k);
		this.getSearchList();
		if(type == 2){
			let {vid} = this.state;
			this.props.navigation.navigate('LdjStoreSearch', {keyword: k, vid: vid})
		}else{
			this.props.navigation.navigate('LdjGlobalSearch', {keyword: k})
		}
	}

	clearStorage = () => {
		Alert.alert('提示', '清除搜索记录', [
			{
				text: '取消',
				onPress: () => {

				},
				style: 'cancel'
			},
			{
				text: '确定',
				onPress: () => {
					StorageUtil.delete('LdjStoreSearch');
					this.setState({
						searchList: []
					})
				}
			}
		])
	}

	render(){
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
				{ ViewUtils.getEmptyPosition('#fff', pxToDp(0)) }
				<View style={ styles.search }>
					<View style={ styles.input }>
						<Image
							style={ {width: pxToDp(27), height: pxToDp(27), marginHorizontal: pxToDp(20)} }
							resizeMode={ 'contain' }
							source={ require('../images/search.png') }
						/>
						<TextInput
							style={ {
								fontSize: pxToDp(26),
								flex: 1,
								height: pxToDp(66),
								alignItems: 'center',
								justifyContent: 'center',
								padding: 0,
							} }
							placeholder={ '搜索附近商家、商品' }
							underlineColorAndroid={ 'transparent' }
							onSubmitEditing={ () => this.search() }
							onChangeText={ text => {
								this.setState({
									keyword: text
								})
							} }
						/>
					</View>

					{this.state.keyword=='' ? <TouchableOpacity
						style={ {padding: pxToDp(20)} }
						activeOpacity={ 1 }
						onPress={ () => {
							this.props.navigation.pop();
						} }
					>
						<Text style={ {color: '#333', fontSize: pxToDp(30)} }>取消</Text>
					</TouchableOpacity> : <TouchableOpacity
						style={ {padding: pxToDp(20)} }
						activeOpacity={ 1 }
						onPress={ () => this.search() }
					>
						<Text style={ {color: '#333', fontSize: pxToDp(30)} }>搜索</Text>
					</TouchableOpacity>}

				</View>

				<View style={ styles.main }>
					<View style={ styles.title }>
						<Text style={ {fontSize: pxToDp(32), fontWeight: '600'} }>历史搜索</Text>
						<TouchableOpacity
							style={ {padding: pxToDp(20)} }
							activeOpacity={ 1 }
							onPress={ () => this.clearStorage() }
						>
							<Text style={ {fontSize: pxToDp(28)} }>清除搜索历史</Text>
						</TouchableOpacity>
					</View>

					<View style={ styles.search_list }>
						{ this.state.searchList.length > 0 && this.state.searchList.map(el => <TouchableOpacity
							style={ {
								height: pxToDp(54),
								paddingHorizontal: pxToDp(20),
								alignItems: 'center',
								backgroundColor: '#eee',
								justifyContent: 'center',
								borderRadius: pxToDp(4),
								margin: pxToDp(20)
							} }
							activeOpacity={1}
							onPress={ () => this.search(el) }
						>
							<Text style={ {color: '#666', fontSize: pxToDp(26)} }>{ el }</Text>
						</TouchableOpacity>) }
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: '#fff',
	},
	title: {
		paddingHorizontal: pxToDp(20),
		height: pxToDp(110),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	search_list: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: pxToDp(50),
		paddingVertical: pxToDp(30),
		flexWrap: 'nowrap'
	},
	search: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: pxToDp(86),
		backgroundColor: '#fff'
	},
	input: {
		width: pxToDp(599),
		height: pxToDp(66),
		backgroundColor: '#F4F4F4',
		borderRadius: pxToDp(6),
		flexDirection: 'row',
		alignItems: 'center',
	}
})
