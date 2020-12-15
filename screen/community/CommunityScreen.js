/**
 * 种草社区
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
	FlatList,
} from "react-native";
import pxToDp from "../../util/pxToDp";
import NavigationBar from '../../component/NavigationBar';
import CommunityItem from './CommunityItem'
import { getExperienceList } from '../../api/communityApi'
import {I18n} from "../../lang";

export default class CommunityScreen extends Component{
    constructor(props){
		super(props);
		this.state = {
			list: null,
		}
		this.didfocus = null;
		this.page = 1;
		this.size = 10;
		this.total = 0;
	}

	componentDidMount() {
		this._getList();
		const _this = this;
		// this.listener =DeviceEventEmitter.addListener('updateCommunity',function(param){
		// 	_this.page = 1;
		// 	_this._getList();
		// 	console.log('_____this.listener');
		// 	//  use param do something
		// });
		this.didfocus = this.props.navigation.addListener(
			'didFocus',
			payload => {
				_this.page = 1;
				_this._getList();
			}
		);
	}

	componentWillUnmount() {
		// this.listener.remove();
		this.didfocus && this.didfocus.remove();
	}

	_getList() {

		// if(key) {
			console.log('-__getList___-', key);
			getExperienceList({
				key: key,
				type: 1,
				page: this.page,
				size: this.size
			}).then(res => {

				// if(res.state == 255) {

				// }
				if(res.state == 200) {
					console.log('res__list;;', res.data.list);
					console.log('pagination---', res.data.pagination);
					const pagination = res.data.pagination;
					this.total = pagination.total;
					if(pagination.current == 1) {
						this.setState({
							list: res.data.list || [],

						});
						this.page = pagination.current;
					} else {
						const list = this.state.list || [];
						Array.prototype.push.apply(list, res.data.list);
						this.setState({
							list,
						});
					}
				}

			})
		// } else {
		// 	this.props.navigation.navigate('Login');
		// }

	}

	rightButton() {
		return (
			<TouchableOpacity onPress={() => {
				this.props.navigation.navigate('Manage')
			}}>
				<Image resizeMode="contain" style={{width: pxToDp(36), height: pxToDp(36), marginRight: pxToDp(40)}} source={require('../../assets/images/communityPage/manage.png')} />
			</TouchableOpacity>
		);
	}

	_onEndReached() {
		const pageTotal = Math.ceil(this.total / this.size);
		if(this.page < pageTotal) {
			this.page++;
			this._getList();
		}

	}

	render() {
		return (
			<View style={{flex: 1, position: 'relative', backgroundColor: '#f7f7f7'}}>
				<NavigationBar
					statusBar={{barStyle: "dark-content"}}
					// rightButton={this.rightButton()}
                    title={I18n.t('Community.title')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
				{
					this.state.list != null && key &&
					<FlatList
						data={this.state.list}
						onEndReachedThreshold={0.95}
						onEndReached={(info) => {
							console.log('info--', info)
							this._onEndReached()
						}}
						ListEmptyComponent = {() => {
							return (
								<View style={styles.no_data}>
									<Text style={{color: '#909090'}}>{I18n.t('PointsCart.no_data')}</Text>
								</View>
							);
						}}
						renderItem = {({item, index, separators}) => {
							return <CommunityItem key={index} {...this.props} listItem={item} />;
						}}
					/>
				}

				{
					<TouchableOpacity onPress={() => {
						if(key) {
							this.props.navigation.navigate('Release')
						} else {
							this.props.navigation.navigate('Login');
						}

					}} style={styles.add_box}>
						<Image style={styles.add_icon} source={require('../../assets/images/communityPage/add.png')} />
					</TouchableOpacity>
				}

			</View>
		);
	}
}

// const styles = StyleSheet.create({
const styles = StyleSheet.create({
	add_box: {
		position: 'absolute',
		bottom: pxToDp(100),
		right: pxToDp(20),
		zIndex: 100
	},
	add_icon: {
		width: pxToDp(70),
		height: pxToDp(70)
	},
	no_data: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingTop: pxToDp(40),
		paddingBottom: pxToDp(40)
	}
});
