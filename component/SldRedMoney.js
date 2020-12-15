/*
 * @slodon
 * */
import React, {Component,Fragment} from 'react';
import {
	View, Text, StyleSheet, Image, TouchableOpacity, Dimensions
} from 'react-native';
import pxToDp from "../util/pxToDp";
import StorageUtil from '../util/StorageUtil';
import LinearGradient from "react-native-linear-gradient";

const {
	deviceHeight: deviceHeight,
	deviceWidth: deviceWidth
} = Dimensions.get('window');

export default class SldRedMoney extends Component {

	constructor(props) {

		super(props);
		this.state = {
			red_money: '',
			red_img: '',
			refresh: props.redMoneyRefresh
		}
	}

	componentDidMount() {
		this.getStorageData();
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.redMoneyRefresh!=this.state.refresh){
			this.getStorageData();
		}
	}

	getStorageData(){
		let {redMoneyRefresh} = this.props;
		this.setState({
				refresh: redMoneyRefresh
		})
		StorageUtil.get('red_money',(err,res)=>{
			if(res){
				this.setState({
					red_money: res
				})
			}else{
				this.setState({
					red_money: ''
				})
			}
		})
		StorageUtil.get('red_img',(err,res)=>{
			if(res){
				this.setState({
					red_img: res
				})
			}else{
				this.setState({
					red_img: ''
				})
			}
		})
	}

	componentWillUnmount() {
		StorageUtil.delete('red_money');
		StorageUtil.delete('red_img');
	}

	close(){
		this.setState({
			red_money: ''
		},()=>{
			StorageUtil.delete('red_money')
		})
	}

	go = () => {
		this.setState({
			red_money: ''
		})

        this.props.navigation.navigate('MyVoucher');
	}

	render() {
		const {red_money,red_img} = this.state;
		const { width } = Dimensions.get('window')
		console.log('新人优惠券图片:', red_img)
		return (
			<Fragment>
				{
					red_money!='' &&
                    <View style={styles.red_money}>
                        <View style={styles.red_main}>
                            <View style={styles.main_img}>
                                <Image
                                    resizeMode={'contain'}
									// source={red_img ? {uri:red_img} : require('../assets/images/firshShowBac.png')}
                                    source={require('../assets/images/firshShowBac.png')}
                                    style={{width: pxToDp(592),height: pxToDp(574)}}
                                    defaultSource={require('../assets/images/default_icon_400.png')}
                                />
                                <LinearGradient
                                    style={{
                                    	position: 'absolute',
										left: 33,
										bottom: 50,
										width: 230,
										height: 40,
										borderRadius: 20.0
									}}
                                    start={{x: 0.0, y: 0.5}} end={{x: 1.0, y: 0.5}}
                                    locations={[0, 1]}
                                    colors={['rgb(223,192,136)', 'rgb(245,218,182)']}
								>
									<TouchableOpacity
										style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                        activeOpacity={1}
                                        onPress={() => this.close()}
									>
										<Text style={{fontsize: 17, color: 'gbb(82,59,27)', textAlign: 'center'}}>OK</Text>
									</TouchableOpacity>
								</LinearGradient>
                            </View>
                        </View>
                    </View>
				}
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	red_money:{
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: deviceWidth,
		height: deviceHeight,
		backgroundColor: 'rgba(0,0,0,.3)',
		alignItems: 'center',
		justifyContent: 'center'
	},
	red_main:{

	},
	close:{
		position: 'absolute',
		top: pxToDp(-56),
		right: pxToDp(22),
		width: pxToDp(56),
		height: pxToDp(56)
	},
	main_img:{
		width: pxToDp(592),
		height: pxToDp(574)
	}
})
