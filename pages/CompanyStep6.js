/*
 * 入驻申请
 * @slodon
 * */
import React , { Component } from 'react';
import {
	View ,
	Image ,
	Text ,
	TouchableOpacity ,
	ScrollView ,
	DeviceEventEmitter
} from 'react-native';
import ImagePicker from "react-native-image-crop-picker";
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import styles from './stylejs/companyReg'
import StorageUtil from '../util/StorageUtil';
import {I18n} from './../lang/index'

export default class CompanyStep6 extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title : I18n.t('CompanyStep6.title') ,
			apply_t : props.navigation.state.params.apply_t ,//1是企业
			is_supplier : props.navigation.state.params.is_supplier ,
			reapply : props.navigation.state.params.reapply ,
			time:props.navigation.state.params.time ,//1为初次提交，2为失败之后重新提交
			paying_money_certificate_explain : '' ,//备注
			paying_money_certificate: '' ,//上传支付凭证
			paying_money_certificate_base64 : '' ,//上传支付凭证 ,用于展示
		}
	}

	componentDidMount () {
		const {reapply} =this.state
		//取缓存数据
		StorageUtil.get('company_reg6', (error, object) => {
			if (!error && object) {
				this.setState({
					...JSON.parse(object),reapply:reapply
				});
			}
		});
		// 编辑详情监听
		this.lister = DeviceEventEmitter.addListener ( 'companyedit' , ( e ) => {
			switch ( e.key ) {
				case 'bank_address':
					this.setState ( {
						bank_address : e.area_info.join ( ' ' ) ,
						bank_address_ids : e.area_id
					} )
					break;
				case 'settlement_bank_address':
					this.setState ( {
						settlement_bank_address : e.area_info.join ( ' ' ) ,
						settlement_bank_address_ids : e.area_id
					} )
					break;
				default:
					this.setState ( {
						[ e.key ] : e.val
					} )
			}
		} )
	}

	componentWillUnmount () {
		this.lister.remove ();
	}

	// 上传图片
	uploadImg = ( name ) => {
		ImagePicker.openPicker ( {
			// width : pxToDp ( 200 ) ,
			// height : pxToDp ( 200 ) ,
			// cropping : true
		} ).then ( image => {
			let path = image.path;
			let filename = path.substring ( path.lastIndexOf ( '/' ) + 1 , path.length );
			if ( !key ) {
				this.props.navigation.navigate ( 'Login' );
			} else {
				let formData = new FormData ();
				let file = {
					uri : image.path ,
					type : 'multipart/form-data' ,
					name : filename ,
					'size' : image.size ,
					tmp_name : image.filename
				};
				formData.append ( 'upimg' , file );
				formData.append ( 'name' , 'upimg' );
				formData.append ( 'key' , key );
				let url = AppSldUrl + '/index.php?app=enterin&mod=uploadPic';
				fetch ( url , {
					method : 'POST' ,
					mode : 'cors' ,
					credentials : 'include' ,
					headers : {} ,
					body : formData
				} )
					.then ( response => response.json () )
					.then ( result => {
						this.setState ( {
							[ name ] : result.datas.name ,
							[ name + '_base64' ] : result.datas.img_url ,
						} )
					} )
					.catch ( error => {
						ViewUtils.sldErrorToastTip(error);
					} )
			}
		} ).catch ( error => {
			ViewUtils.sldErrorToastTip(error);
		} );
	}


	//提交事件
	submit = () => {
		let {
			apply_t ,
			is_supplier ,
			reapply ,
			paying_money_certificate_explain,
			paying_money_certificate,
			paying_money_certificate_base64
		} = this.state;

			if ( paying_money_certificate == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep6.title1') );
				return false;
			}

		let data = {
			paying_money_certificate_explain : paying_money_certificate_explain ,//银行开户名
			paying_money_certificate : paying_money_certificate ,//公司银行账号
		}

		//提交数据
		RequestData.postSldData ( AppSldUrl + '/index.php?app=enterin&mod=paySave&key=' + key + '&apply_t=' + apply_t + '&is_supplier=' + is_supplier + '&reapply=' + reapply, data ).then ( res => {
			if(res.datas.state == 200){
				let storage_data = data;
				storage_data.paying_money_certificate_base64 = paying_money_certificate_base64;
				StorageUtil.set('company_reg6', JSON.stringify(storage_data), ()=>{
				});
				//跳转到状态审核页面
				this.props.navigation.pop(1);
				DeviceEventEmitter.emit('updateState', {
					state: 306,
					tip_message: I18n.t('CompanyStep6.title2'),
				})
				this.props.navigation.navigate('CompanyStep5',{state:res.datas.state,tip_message:res.datas.msg,
					reapply:1,
					is_supplier:0,
					apply_t:1,})
			} else {
				ViewUtils.sldToastTip ( res.datas.msg );
			}

		} ).catch ( err => {
		} )


	}

	render () {
		const { title  } = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				{/*{ViewUtils.setSldAndroidStatusBar(true,'#fff','default',true,true)}*/}
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>

				<ScrollView>


					<View style={ styles.form }>

						<View style={ { paddingLeft : pxToDp ( 30 ) } }>
							<View
								style={ styles.form_item_img }
							>
								<Text style={ styles.label }>*{I18n.t('CompanyStep6.title')} </Text>
								<TouchableOpacity
									style={ styles.form_item_img_upload }
									activeOpacity={ 1 }
									onPress={ () => this.uploadImg ( 'paying_money_certificate' ) }
								>
									{ this.state.paying_money_certificate != '' && <Image
										source={ { uri : this.state.paying_money_certificate_base64 } }
										resizeMode={ 'contain' }
										style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
									/> }
									{ this.state.paying_money_certificate == '' && <Image
										resizeMode={ 'contain' }
										style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
										source={ require ( '../assets/images/upload.png' ) }
									/> }
								</TouchableOpacity>
							</View>
							<TouchableOpacity
								style={ styles.form_item }
								activeOpacity={ 1 }
								onPress={ () => {
									this.props.navigation.navigate ( 'CompanyEdit' , {
										title : I18n.t('CompanyStep6.remark') ,
										type : 'text' ,
										key : 'paying_money_certificate_explain',
										oldData:this.state.paying_money_certificate_explain,
									} )
								} }
							>
								<Text style={ styles.label }>{I18n.t('CompanyStep6.remark')}</Text>
								<View style={ styles.con }>
									<Text style={ styles.con_txt }>{ this.state.paying_money_certificate_explain }</Text>
									<Image
										style={ styles.more }
										source={ require ( '../assets/images/sld_jiantou.png' ) }
										resizeMode={ 'contain' }
									/>
								</View>
							</TouchableOpacity>

						</View>


					</View>

					<View style={ { height : pxToDp ( 180 ) } }></View>
				</ScrollView>

				<TouchableOpacity
					style={ styles.btn }
					activeOpacity={ 1 }
					onPress={ () => {
						this.submit ()
					} }
				>
					<Text style={ { color : '#fff' , fontSize : pxToDp ( 30 ) } }>{I18n.t('CompanyStep6.submit')}</Text>
				</TouchableOpacity>
			</View>
		)
	}
}
