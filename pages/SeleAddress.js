/*
 * 确定订单页面
 * @slodon
 * */
import React , { Component  } from 'react';
import {
	View , Image , Text , TouchableOpacity,DeviceEventEmitter
} from 'react-native';
import RequestData from "../RequestData";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import {I18n} from './../lang/index'

export default class SeleAddress extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title : I18n.t('SeleAddress.title') ,//页面标题
			address_list : [] ,
			cur_address_id : props.navigation.state.params.cur_address_id ,
		}
	}

	componentWillMount() {
		this.getAddressList();
		this.emitter = DeviceEventEmitter.addListener ('updateSeleAddressList', res => {
			if (res && res.defAddressId) {
				this.setState({
                    cur_address_id: res.defAddressId
				})
			}
            this.getAddressList(res.defAddressId);//获取会员的收货地址列表
        } );
	}

	// 页面卸载时，删除事件监听
	componentWillUnmount () {
		this.emitter.remove ()
	}

	//获取所有收货地址
	getAddressList = (defAddressId) => {
		RequestData.postSldData (AppSldUrl + '/index.php?app=address&mod=address_list', {key}).then(result => {
				if ( result.datas.address_list == null ) {
					return false
				} else {
					const addrList = result.datas.address_list
					if (defAddressId) {
                        DeviceEventEmitter.emit('updateAddress', {address_info: addrList[addrList.length-1]});
					}
					this.setState ( {
						address_list :addrList
					} );
				}
			} )
			.catch ( error => {
				ViewUtils.sldErrorToastTip(error);
			} )
	}

	//选择地址
	sele_address = (item) => {
		//通知上一页更新数据并返回
		DeviceEventEmitter.emit('updateAddress', {address_info: item});
		this.props.navigation.goBack();

	}

	right_event = () => {
		this.props.navigation.navigate('AddNewAddress',{source:'updateSeleAddressList'});
	}


	render () {
		const { title , address_list ,cur_address_id} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) } right_type='text' right_event={() =>this.right_event()} right_text={I18n.t('SeleAddress.add')} right_style={{marginRight:15,color:'#333',fontSize:14}}/>
				<View style={ GlobalStyles.line }/>

				<View style={ { flexDirection : 'column' , width : '100%' , justifyContent : 'flex-start',flex:1 } }>
					{address_list.length>0 && address_list.map ( ( item , index ) => {
						return <TouchableOpacity
							key={index}
							activeOpacity={ 1 }
							style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',paddingLeft:10,paddingRight:10,backgroundColor:'#fff',height:pxToDp(131),borderBottomWidth:0.5,borderColor:'#E9E9E9'}}
							onPress={ () => this.sele_address(item) }
						>
							{cur_address_id == item.address_id&&
								<Image style={{width:pxToDp(28),height:pxToDp(20),marginRight:pxToDp(40),}} resizeMode={'contain'} source={require('../assets/images/sele_address_icon.png')}/>}
							<View>
								<Text style={{color:'#333333',fontSize:pxToDp(26),fontWeight:"400"}}>{item.true_name} {item.mob_phone}</Text>
								<Text numberOfLines={1} style={{color:'#999',fontSize:pxToDp(24),fontWeight:"400",marginTop:pxToDp(19)}}>{item.area_info} {item.address}</Text>
							</View>

						</TouchableOpacity>
					} ) }
				</View>
			</View>
		)
	}
}
