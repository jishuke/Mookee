/*
 * 入驻申请
 * @slodon
 * */
import React, {Component, Fragment} from 'react';
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

export default class CompanyStep3 extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title :I18n.t('CompanyStep3.title') ,
			account : '' ,
			name : '' ,
			apply_t : props.navigation.state.params!=undefined&&props.navigation.state.params.apply_t!=undefined?props.navigation.state.params.apply_t:0 ,
			reapply : props.navigation.state.params!=undefined&&props.navigation.state.params.reapply  != undefined ? props.navigation.state.params.reapply : 0 ,
			is_supplier : props.navigation.state.params!=undefined&&props.navigation.state.params.is_supplier  != undefined ? props.navigation.state.params.is_supplier : 0 ,
			bank_account_name : '' ,//银行开户名
			bank_account_number : '' ,//公司银行账号
			bank_name : '' ,//开户银行支行名称
			bank_code : '' ,//支行联行号
			bank_address : '' ,//开户银行所在地
			bank_address_ids : '' ,//开户银行所在地id
			bank_licence_electronic : '' ,//开户银行许可证电子版
			bank_licence_electronic_base64 : '' ,//开户银行许可证电子版,用于展示
			settlement_bank_account_name:'',//结算账号——银行开户名
			settlement_bank_account_number:'',//结算账号——公司银行账号
			settlement_bank_name:'',//结算账号——开户银行支行名称
			settlement_bank_code:'',//结算账号——支行联行号
			settlement_bank_address:'',//结算账号——开户银行所在地

			tax_registration_certificate:'',//税务登记证——税务登记证号
			taxpayer_id:'',//税务登记证——纳税人识别号
			tax_registration_certificate_electronic:'',//税务登记证——税务登记证号电子版
			tax_registration_certificate_electronic_base64:'',//税务登记证——税务登记证号电子版——用于展示


		}
	}

	componentDidMount () {
		const {reapply} = this.state
		//取缓存数据
		StorageUtil.get('company_reg3', (error, object) => {
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
						bank_address : e.area_info,
						bank_address_ids :  e.area_ids
					} )
					break;
				case 'settlement_bank_address':
					this.setState ( {
						settlement_bank_address : e.area_info,
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
						//上传出错
					} )
			}
		} ).catch ( err => {
		} );
	}


	//提交事件
	submit = () => {
		let {
			apply_t ,
			is_supplier ,
			reapply ,
			bank_account_name ,
			bank_account_number ,
			bank_name ,
			bank_code ,
			bank_address ,
			bank_address_ids,
			bank_licence_electronic ,
			bank_licence_electronic_base64,
			settlement_bank_account_name,
			settlement_bank_account_number,
			settlement_bank_name,
			settlement_bank_code,
			settlement_bank_address,
			tax_registration_certificate,
			taxpayer_id,
			tax_registration_certificate_electronic,
			tax_registration_certificate_electronic_base64,
		} = this.state;

		if(apply_t == 0){
			//个人入驻
			if ( settlement_bank_account_name == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep3.text1') );
				return false;
			}
			if ( settlement_bank_account_number == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text2') );
				return false;
			}
		}else{
			//企业入驻
			if ( bank_account_name == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text3'));
				return false;
			}
			if ( bank_account_number == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text4'));
				return false;
			}
			if ( bank_name == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep3.text5')  );
				return false;
			}
			if ( bank_code == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep3.text6') );
				return false;
			}
			if ( bank_address == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text7') );
				return false;
			}
			if ( bank_licence_electronic == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text8') );
				return false;
			}

			if ( settlement_bank_account_name == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text10'));
				return false;
			}
			if ( settlement_bank_account_number == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text11'));
				return false;
			}
			if ( settlement_bank_name == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text12'));
				return false;
			}
			if ( settlement_bank_code == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text13') );
				return false;
			}
			if ( settlement_bank_address == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep3.text14') );
				return false;
			}
		}

		let data = {};
		if(apply_t == 0){
			//个人入驻
			data = {
				settlement_bank_account_name : settlement_bank_account_name ,//个体商户——银行开户名
				settlement_bank_account_number : settlement_bank_account_number ,//个体商户——公司银行账号
			}
		}else{
			//企业入驻
			data = {
				bank_account_name : bank_account_name ,//银行开户名
				bank_account_number : bank_account_number ,//公司银行账号
				bank_name : bank_name ,//开户银行支行名称
				bank_code : bank_code ,//支行联行号
				bank_address : bank_address ,//开户银行所在地
				bank_licence_electronic : bank_licence_electronic ,//开户银行许可证电子版
				settlement_bank_account_name : settlement_bank_account_name ,//个体商户——银行开户名
				settlement_bank_account_number : settlement_bank_account_number ,//个体商户——公司银行账号
				settlement_bank_address : settlement_bank_address ,//个体商户——开户银行所在地
				settlement_bank_name : settlement_bank_name ,
				settlement_bank_code : settlement_bank_code ,
				tax_registration_certificate:tax_registration_certificate,//税务登记证——税务登记证号
				taxpayer_id:taxpayer_id,//税务登记证——纳税人识别号
				tax_registration_certificate_electronic:tax_registration_certificate_electronic,//税务登记证——税务登记证号电子版
			}
		}


		//提交数据
		RequestData.postSldData ( AppSldUrl + '/index.php?app=enterin&mod=step2&key=' + key + '&apply_t=' + apply_t + '&is_supplier=' + is_supplier + '&reapply=' + reapply, data ).then ( res => {
			if ( res.code == 200 ) {
				//将数据存缓存
				let storage_data = data;
				storage_data.bank_address_ids = bank_address_ids;
				storage_data.bank_licence_electronic_base64 = bank_licence_electronic_base64;
				// storage_data.tax_registration_certificate_electronic_base64 = tax_registration_certificate_electronic_base64;
				StorageUtil.set('company_reg3', JSON.stringify(storage_data), ()=>{
				});
				if ( res.datas.state == 200 ) {
					this.props.navigation.navigate ( 'CompanyStep4' , {
						apply_t : apply_t ,
						is_supplier : is_supplier ,
						reapply : reapply,
					} )
				} else {
					ViewUtils.sldToastTip ( res.datas.msg );
				}

			}
		} ).catch ( err => {
		} )


	}

	render () {
		const { title,apply_t  } = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				{/*{ViewUtils.setSldAndroidStatusBar(true,'#fff','default',true,true)}*/}
				<SldHeader title={ title } left_icon={ require ( '../assets/images/goback.png' ) }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent ( this.props.navigation ) }/>
				<View style={ GlobalStyles.line }/>

				<ScrollView>
					<View style={ styles.tip }>
						<Text
							style={ [ styles.tip_txt , { fontSize : pxToDp ( 28 ) , paddingBottom : pxToDp ( 10 ) } ] }>{I18n.t('CompanyStep2.announcements')}</Text>
						<Text
							style={ [ styles.tip_txt , { fontSize : pxToDp ( 22 ) } ] }>{I18n.t('CompanyStep3.text9')}</Text>
					</View>
					{apply_t == 1&&
					<Fragment>
						<View style={ styles.form }>
							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{ I18n.t('CompanyStep3.Bank_information')}</Text>
							</View>


							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Bank_account_name'),
											type : 'text' ,
											key : 'bank_account_name',
											oldData:this.state.bank_account_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Bank_account_name')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.bank_account_name }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Company_bank_account'),
											type : 'text' ,
											key : 'bank_account_number',
											oldData:this.state.bank_account_number,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Company_bank_account')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.bank_account_number }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>


								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Name_of_bank_branch'),
											type : 'text' ,
											key : 'bank_name',
											oldData:this.state.bank_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Name_of_bank_branch')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.bank_name }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title :I18n.t('CompanyStep3.Branch_bank_number') ,
											type : 'text' ,
											key : 'bank_code',
											oldData:this.state.bank_code,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Branch_bank_number')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.bank_code }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.deposit_bank') ,
											type : 'address' ,
											key : 'bank_address'
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.deposit_bank')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.bank_address }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.tielectronic_editiontle')} </Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'bank_licence_electronic' ) }
									>
										{ this.state.bank_licence_electronic != '' && <Image
											source={ { uri : this.state.bank_licence_electronic_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.bank_licence_electronic == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

							</View>



						</View>

						<View style={ styles.form }>
							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{ I18n.t('CompanyStep3.Account_information')}</Text>
							</View>


							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Bank_account_name') ,
											type : 'text' ,
											key : 'settlement_bank_account_name',
											oldData:this.state.settlement_bank_account_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Bank_account_name')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.settlement_bank_account_name }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Company_bank_account'),
											type : 'text' ,
											key : 'settlement_bank_account_number',
											oldData:this.state.settlement_bank_account_number,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Company_bank_account')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.settlement_bank_account_number }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>


								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title :I18n.t('CompanyStep3.Name_of_bank_branch') ,
											type : 'text' ,
											key : 'settlement_bank_name',
											oldData:this.state.settlement_bank_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Name_of_bank_branch')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.settlement_bank_name }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Branch_bank_number'),
											type : 'text' ,
											key : 'settlement_bank_code',
											oldData:this.state.settlement_bank_code,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Branch_bank_number')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.settlement_bank_code }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.deposit_bank') ,
											type : 'address' ,
											key : 'settlement_bank_address'
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.deposit_bank')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.settlement_bank_address }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

							</View>



						</View>

						{/*<View style={ styles.form }>
							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{ '税务登记证'}</Text>
							</View>


							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : '税务登记证号' ,
											type : 'text' ,
											key : 'tax_registration_certificate',
											oldData:this.state.tax_registration_certificate,
										} )
									} }
								>
									<Text style={ styles.label }>税务登记证号</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.tax_registration_certificate }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : '纳税人识别号' ,
											type : 'text' ,
											key : 'taxpayer_id',
											oldData:this.state.taxpayer_id,
										} )
									} }
								>
									<Text style={ styles.label }>纳税人识别号</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.taxpayer_id }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>税务登记证号电子版 </Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'tax_registration_certificate_electronic' ) }
									>
										{ this.state.tax_registration_certificate_electronic != '' && <Image
											source={ { uri : this.state.tax_registration_certificate_electronic_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.tax_registration_certificate_electronic_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

							</View>



						</View>*/}
					</Fragment>
					}

					{apply_t == 0&&
					<Fragment>
						<View style={ styles.form }>
							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{I18n.t('CompanyStep3.Account_information') }</Text>
							</View>


							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Name_of_alipay') ,
											type : 'text' ,
											key : 'settlement_bank_account_name',
											oldData:this.state.settlement_bank_account_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Name_of_alipay')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.settlement_bank_account_name }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep3.Alipay_account'),
											type : 'text' ,
											key : 'settlement_bank_account_number',
											oldData:this.state.settlement_bank_account_number,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep3.Alipay_account')}</Text>
									<View style={ styles.con }>
										<Text style={ styles.con_txt }>{ this.state.settlement_bank_account_number }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

							</View>



						</View>
					</Fragment>
					}


					<View style={ { height : pxToDp ( 180 ) } }></View>
				</ScrollView>

				<TouchableOpacity
					style={ styles.btn }
					activeOpacity={ 1 }
					onPress={ () => {
						this.submit ()
					} }
				>
					<Text style={ { color : '#fff' , fontSize : pxToDp ( 30 ) } }>{I18n.t('CompanyStep3.next_step')}</Text>
				</TouchableOpacity>
			</View>
		)
	}
}
