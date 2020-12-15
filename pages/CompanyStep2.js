/*
 * 入驻申请-店铺及联系人信息
 * @slodon
 * */
import React, {Component, Fragment} from 'react';
import {
	View ,
	Image ,
	Text ,
	TouchableOpacity ,
	ScrollView ,
	DeviceEventEmitter , Dimensions,Platform
} from 'react-native';
import pxToDp from "../util/pxToDp";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import styles from './stylejs/companyReg'
import DatePicker from 'react-native-datepicker';
import RequestData from "../RequestData";
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modalbox';
import StorageUtil from '../util/StorageUtil';
const {width,height} = Dimensions.get('window')
import {I18n} from './../lang/index'
export default class CompanyStep2 extends Component {

	constructor ( props ) {
		super ( props );
		this.state = {
			title : I18n.t('CompanyStep2.title') ,
			flag : false ,
			type : props.navigation.state.params.type ,
			apply_t : props.navigation.state.params!=undefined&&props.navigation.state.params.apply_t!=undefined?props.navigation.state.params.apply_t:0 ,
			reapply : props.navigation.state.params!=undefined&&props.navigation.state.params.reapply != undefined ? props.navigation.state.params.reapply : 0 ,
			is_supplier : props.navigation.state.params.is_supplier  != undefined ? props.navigation.state.params.is_supplier : 0 ,
			company_name : '' ,   // 公司名称（个人入驻：店铺名称）
			company_address : '' ,   // 公司所在地（个人入驻：所在地）
			company_address_detail : '' , // 详细地址（个人入驻：详细地址）
			//  company_phone : '' ,   // 公司电话
			// company_employee_count : '' ,   // 员工总数
			contacts_name : '' ,   // 联系人姓名（个人入驻：联系人姓名）
			contacts_phone : '' ,   // 公司电话（个人入驻：联系人电话）
			contacts_email : '' ,    // 联系人邮箱（个人入驻：电子邮箱）
			business_sphere : '' ,//法定经营范围（个人入驻：姓名）
			business_licence_number : '' ,//统一社会信用代码（个人入驻：身份证号）
			area_id : [] ,     // 公司所在地id
			// company_registered_capital : '' ,  // 注册资金
			legal_person_name : '' ,  //法人姓名
			legal_licence_number : '' ,//法人身份证号
			// legal_licence_start : '' ,//证件有效期开始时间
			// legal_licence_end : '' ,//证件有效期结束时间
			// business_licence_address : '' ,//营业执照所在地
			// business_licence_address_ids : [] ,     // 地址id
			business_licence_start : '' ,//营业执照有效期开始时间
			business_licence_end : '' ,//营业执照有效期结束时间
			// organization_code : '' ,//组织机构代码证
			legal_licence_zheng_electronic : '' ,//法人证件电子版(正面)
			legal_licence_zheng_electronic_base64 : '' ,//法人证件电子版(正面)，用于展示（个人入驻：身份证扫描件）
			legal_licence_fan_electronic : '' ,//法人证件电子版（反面）
			legal_licence_fan_electronic_base64 : '' ,//法人证件电子版（反面），用于展示
			business_licence_number_electronic : '' ,//营业执照电子版（个人入驻：身份证扫描件）
			business_licence_number_electronic_base64 : '' ,//营业执照电子版，用于展示
			// organization_code_electronic : '' ,//组织机构代码证电子版
			// organization_code_electronic_base64 : '' ,//组织机构代码证电子版，用于展示
			// general_taxpayer : '' ,//一般纳税人证明
			// general_taxpayer_base64 : '' ,//一般纳税人证明，用于展示
			vendor_add_img1 : '' ,//补充认证图片一
			vendor_add_img1_base64 : '' ,//补充认证图片一，用于展示
			vendor_add_img2 : '' ,//补充认证图片二
			vendor_add_img2_base64 : '' ,//补充认证图片二，用于展示
			vendor_add_img3 : '' ,//补充认证图片三
			vendor_add_img3_base64 : '' ,//补充认证图片三，用于展示

		}
	}

	flag = false;//是否是第一次获取定位

	componentDidMount () {
		const {reapply,apply_t,is_supplier} = this.state

		//取缓存数据
		StorageUtil.get('company_reg2', (error, object) => {
			if (!error && object) {
				this.setState({
					...JSON.parse(object),reapply:reapply
				});
			}
		});
		let apply_info = {
			apply_t:apply_t,
			is_supplier:is_supplier,
		};
		StorageUtil.get('apply_info', (error, object) => {
			if (!error && object) {
				let tmp_data = JSON.parse(object);
				if(is_supplier!=tmp_data.is_supplier){
					StorageUtil.delete('company_reg2');
					StorageUtil.delete('company_reg3');
					StorageUtil.delete('company_reg4');
					StorageUtil.set('apply_info', JSON.stringify(apply_info));//将申请类型存缓存
				}
			}else{
				StorageUtil.set('apply_info', JSON.stringify(apply_info));//将申请类型存缓存
			}
		});
		// 编辑详情监听
		this.lister = DeviceEventEmitter.addListener ( 'companyedit' , ( e ) => {
			switch ( e.key ) {
				case 'company_address':
					this.setState ( {
						company_address : e.area_info ,
						area_id : e.area_ids
					} )
					break;
				// case 'business_licence_address':
				// 	this.setState ( {
				// 		business_licence_address : e.area_info ,
				// 		business_licence_address_ids :  e.area_ids
				// 	} )
				// 	break;
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
			console.log(image);
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



	_renderItem = ( { item } ) =>
		<Text style={ styles.logText }>{ item.time } { item.event }: { item.data }</Text>


	// 提交
	submit = () => {
		let {
			company_name ,
			company_address ,
			company_address_detail ,
			// company_phone ,
			// company_employee_count ,
			contacts_name ,
			contacts_phone ,
			contacts_email ,
			business_sphere ,
			business_licence_number ,
			area_id ,
			// company_registered_capital ,
			legal_person_name ,
			legal_licence_number ,
			// legal_licence_start ,
			// legal_licence_end ,
			// business_licence_address ,
			// business_licence_address_ids ,
			business_licence_start ,
			business_licence_end ,
			// organization_code ,
			legal_licence_zheng_electronic ,
			legal_licence_zheng_electronic_base64,
			legal_licence_fan_electronic ,
			legal_licence_fan_electronic_base64,
			business_licence_number_electronic ,
			business_licence_number_electronic_base64,
			// organization_code_electronic ,
			// organization_code_electronic_base64,
			// general_taxpayer ,
			vendor_add_img1 ,
			vendor_add_img1_base64,
			vendor_add_img2 ,
			vendor_add_img2_base64,
			vendor_add_img3 ,
			vendor_add_img3_base64,
			apply_t ,
			is_supplier ,
			reapply ,
		} = this.state;
		//检测必填项
		if(apply_t == 0){
			//个人入驻
			if ( company_name == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep2.text2')  );
				return false;
			}
			if ( area_id == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text3') );
				return false;
			}
			if ( company_address_detail == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text4') );
				return false;
			}
			if ( contacts_name == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text4') );
				return false;
			}
			if ( contacts_phone == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text5') );
				return false;
			}
			if ( contacts_email == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep2.text6')  );
				return false;
			}
			if ( business_sphere == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep2.text7')  );
				return false;
			}
			if ( business_licence_number == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text8') );
				return false;
			}
			if ( business_licence_number_electronic == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep2.text9')  );
				return false;
			}
		}else{
			//企业入驻
			if ( company_name == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text10') );
				return false;
			}
			if ( area_id == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text11') );
				return false;
			}
			if ( company_address_detail == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text12') );
				return false;
			}
			// if ( company_phone == '' ) {
			// 	ViewUtils.sldToastTip ( '公司电话必填' );
			// 	return false;
			// }
			// if ( company_employee_count == '' ) {
			// 	ViewUtils.sldToastTip ( '员工总数必填' );
			// 	return false;
			// }
			// if ( company_registered_capital == '' ) {
			// 	ViewUtils.sldToastTip ( '注册资金必填' );
			// 	return false;
			// }
			if ( contacts_name == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text4') );
				return false;
			}
			if ( contacts_phone == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text5') );
				return false;
			}
			if ( contacts_email == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text6') );
				return false;
			}
			if ( legal_person_name == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep2.text16')  );
				return false;
			}
			if ( legal_licence_number == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text17'));
				return false;
			}
			// if ( legal_licence_start == '' ) {
			// 	ViewUtils.sldToastTip ( '证件有效期开始时间必填' );
			// 	return false;
			// }
			// if ( legal_licence_end == '' ) {
			// 	ViewUtils.sldToastTip ( '证件有效期结束时间必填' );
			// 	return false;
			// }
			if ( legal_licence_zheng_electronic == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text20') );
				return false;
			}
			if ( legal_licence_fan_electronic == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text21') );
				return false;
			}
			if ( business_licence_number == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text22') );
				return false;
			}
			// if ( business_licence_address_ids == '' ) {
			// 	ViewUtils.sldToastTip (I18n.t('CompanyStep2.text23') );
			// 	return false;
			// }
			if ( business_licence_start == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep2.text24') );
				return false;
			}
			if ( business_licence_end == '' ) {
				ViewUtils.sldToastTip ( I18n.t('CompanyStep2.text25'));
				return false;
			}
			// if ( business_sphere == '' ) {
			// 	ViewUtils.sldToastTip ( I18n.t('SelTypeIsSupply.text1')'法定经营范围不可为空' );
			// 	return false;
			// }
			if ( business_licence_number_electronic == '' ) {
				ViewUtils.sldToastTip (I18n.t('CompanyStep2.text32')  );
				return false;
			}

		}

		let data = {};

		if(apply_t == 0){
			//个人入驻
			data={
				company_name : company_name ,   // 店铺名称
				company_address_ids : area_id,   // 所在地
				company_address : company_address ,   // 所在地
				company_address_detail : company_address_detail , // 详细地址
				contacts_name : contacts_name ,   // 联系人姓名
				contacts_phone : contacts_phone ,   // 联系人电话
				contacts_email : contacts_email ,    // 电子邮箱
				business_sphere : business_sphere ,  //姓名
				business_licence_number : business_licence_number ,//身份证号
				business_licence_number_electronic : business_licence_number_electronic ,//身份证扫描件
			}
		}else{
			//企业入驻
			data={
				company_name : company_name ,   // 公司名称
				company_address_ids : area_id,   // 公司所在地
				company_address : company_address ,   // 公司所在地
				company_address_detail : company_address_detail , // 详细地址
				// company_phone : company_phone ,   // 公司电话
				// company_employee_count : company_employee_count ,   // 员工总数
				contacts_name : contacts_name ,   // 联系人姓名
				contacts_phone : contacts_phone ,   // 公司电话
				contacts_email : contacts_email ,    // 联系人邮箱
				// business_sphere : business_sphere ,//法定经营范围
				business_licence_number : business_licence_number ,//统一社会信用代码
				// company_registered_capital : company_registered_capital ,  // 注册资金
				legal_person_name : legal_person_name ,  //法人姓名
				legal_licence_number : legal_licence_number ,//法人身份证号
				// legal_licence_start : legal_licence_start ,//证件有效期开始时间
				// legal_licence_end : legal_licence_end ,//证件有效期结束时间
				// business_licence_address : business_licence_address ,//营业执照所在地
				// business_licence_address_ids : business_licence_address_ids ,     // 地址id
				business_licence_start : business_licence_start ,     // 营业执照有效期开始时间
				business_licence_end : business_licence_end ,     // 营业执照有效期结束时间
				// organization_code : organization_code ,//组织机构代码证
				legal_licence_zheng_electronic : legal_licence_zheng_electronic ,//法人证件电子版(正面)
				legal_licence_fan_electronic : legal_licence_fan_electronic ,//法人证件电子版（反面）
				business_licence_number_electronic : business_licence_number_electronic ,//营业执照电子版
				// organization_code_electronic : organization_code_electronic ,//组织机构代码证电子版
				// general_taxpayer : general_taxpayer ,//一般纳税人证明
				vendor_add_img1 : vendor_add_img1 ,//补充认证图片一
				vendor_add_img2 : vendor_add_img2 ,//补充认证图片二
				vendor_add_img3 : vendor_add_img3 ,//补充认证图片三
			}
		}

		//提交数据
		RequestData.postSldData ( AppSldUrl + '/index.php?app=enterin&mod=step1&key=' + key + '&apply_t=' + apply_t + '&is_supplier=' + is_supplier + '&reapply=' + reapply , data ).then ( res => {
			if ( res.code == 200 ) {
				console.info(3333);
				console.info(res);
				if ( res.datas.state == 200 ) {
					//将数据存缓存
					let storage_data = data;
					storage_data.legal_licence_zheng_electronic_base64 = legal_licence_zheng_electronic_base64;
					storage_data.legal_licence_fan_electronic_base64 = legal_licence_fan_electronic_base64;
					storage_data.business_licence_number_electronic_base64 = business_licence_number_electronic_base64;
					// storage_data.organization_code_electronic_base64 = organization_code_electronic_base64;
					storage_data.vendor_add_img1_base64 = vendor_add_img1_base64;
					storage_data.vendor_add_img2_base64 = vendor_add_img2_base64;
					storage_data.vendor_add_img3_base64 = vendor_add_img3_base64;
					storage_data.area_id = area_id;
					StorageUtil.set('company_reg2', JSON.stringify(storage_data), ()=>{
					});
					this.props.navigation.navigate ( 'CompanyStep3' , {
						apply_t : apply_t ,
						is_supplier : is_supplier ,
						reapply : reapply
					} )
				} else {
					ViewUtils.sldToastTip ( res.datas.msg );
				}

			}
		} ).catch ( err => {
		} )

	}


	render () {
		const { title ,apply_t} = this.state;
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
							style={ [ styles.tip_txt , { fontSize : pxToDp ( 22 ) } ] }>{I18n.t('CompanyStep2.text27')}</Text>
					</View>
					{apply_t==1&&
					<Fragment>

						<View style={ styles.form }>

							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{I18n.t('CompanyStep2.text28')}</Text>
							</View>
							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep2.company_name') ,
											type : 'text' ,
											key : 'company_name',
											oldData:this.state.company_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.company_name')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_name }</Text>
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
											title : I18n.t('CompanyStep2.company_Local') ,
											type : 'address' ,
											key : 'company_address'
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.company_Local')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_address }</Text>
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
											title : I18n.t('CompanyStep2.Company_Address') ,
											type : 'text' ,
											key : 'company_address_detail',
											oldData:this.state.company_address_detail,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.Company_Address')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_address_detail }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								{/* <TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : '公司电话' ,
											type : 'number' ,
											key : 'company_phone',
											oldData:this.state.company_phone,
										} )
									} }
								>
									<Text style={ styles.label }>*公司电话</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_phone }</Text>
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
											title : '员工总数' ,
											type : 'number' ,
											key : 'company_employee_count',
											oldData:this.state.company_employee_count,
										} )
									} }
								>
									<Text style={ styles.label }>*员工总数</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_employee_count }人</Text>
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
											title : '注册资金' ,
											type : 'number' ,
											key : 'company_registered_capital',
											oldData:this.state.company_registered_capital,
										} )
									} }
								>
									<Text style={ styles.label }>*注册资金</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_registered_capital }万元</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity> */}

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title :I18n.t('CompanyStep2.contact_name'),
											type : 'text' ,
											key : 'contacts_name',
											oldData:this.state.contacts_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.contact_name')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.contacts_name }</Text>
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
											title : I18n.t('CompanyStep2.contact_number') ,
											type : 'number' ,
											key : 'contacts_phone',
											oldData:this.state.contacts_phone,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.contact_number')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.contacts_phone }</Text>
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
											title :I18n.t('CompanyStep2.email_address'),
											type : 'text' ,
											key : 'contacts_email',
											oldData:this.state.contacts_email,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.email_address')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.contacts_email }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

							</View>
						</View>

						<View style={ styles.form }>

							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{I18n.t('CompanyStep2.text29')}</Text>
							</View>

							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep2.person_name') ,
											type : 'text' ,
											key : 'legal_person_name',
											oldData:this.state.legal_person_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.person_name')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.legal_person_name }</Text>
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
											title : I18n.t('CompanyStep2.Corporate_id_number'),
											type : 'text' ,
											key : 'legal_licence_number',
											oldData:this.state.legal_licence_number,

										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.Corporate_id_number')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.legal_licence_number }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								{/* <TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
								>
									<Text style={ styles.label }>*证件有效期开始时间</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.legal_licence_start }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
									<DatePicker
										style={ {
											position : 'absolute' ,
											top : 0 ,
											left : 0 ,
											width : '100%' ,
											height : pxToDp ( 120 )
										} }
										date={ this.state.legal_licence_start }
										mode="date"
										format="YYYY-MM-DD"
										confirmBtnText="确认"
										cancelBtnText="取消"
										showIcon={ false }
										customStyles={ {
											dateText : {
												marginLeft : 36 ,

											}
										} }
										hideText={ true }
										onDateChange={ ( date ) => {
											this.setState ( { legal_licence_start : date } );
										} }
									/>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
								>
									<Text style={ styles.label }>*证件有效期结束时间</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.legal_licence_end }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
									<DatePicker
										style={ {
											position : 'absolute' ,
											top : 0 ,
											left : 0 ,
											width : '100%' ,
											height : pxToDp ( 120 )
										} }
										date={ this.state.legal_licence_end }
										mode="date"
										format="YYYY-MM-DD"
										confirmBtnText="确认"
										cancelBtnText="取消"
										showIcon={ false }
										customStyles={ {
											dateText : {
												marginLeft : 36 ,
											}
										} }
										hideText={ true }
										onDateChange={ ( date ) => {
											this.setState ( { legal_licence_end : date } );
										} }
									/>
								</TouchableOpacity> */}

								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.certificate_just')}</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'legal_licence_zheng_electronic' ) }
									>
										{ this.state.legal_licence_zheng_electronic_base64 != '' && <Image
											source={ { uri : this.state.legal_licence_zheng_electronic_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.legal_licence_zheng_electronic_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.certificate_against')}</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'legal_licence_fan_electronic' ) }
									>
										{ this.state.legal_licence_fan_electronic_base64 != '' && <Image
											source={ { uri : this.state.legal_licence_fan_electronic_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.legal_licence_fan_electronic_base64 == '' && <Image
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
								<Text style={ styles.form_title_txt }>{I18n.t('CompanyStep2.transcript')}</Text>
							</View>

							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep2.credit_code') ,
											type : 'text' ,
											key : 'business_licence_number',
											oldData:this.state.business_licence_number,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.credit_code')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.business_licence_number }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

								{/* <TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : '营业执照所在地' ,
											type : 'address' ,
											key : 'business_licence_address'
										} )
									} }
								>
									<Text style={ styles.label }>*营业执照所在地</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.business_licence_address }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity> */}
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.business_license_start')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.business_licence_start }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
									<DatePicker
										style={ {
											position : 'absolute' ,
											top : 0 ,
											left : 0 ,
											width : '100%' ,
											height : pxToDp ( 120 )
										} }
										date={ this.state.business_licence_start }
										mode="date"
										format="YYYY-MM-DD"
										confirmBtnText={I18n.t('ok')}
										cancelBtnText={I18n.t('cancel')}
										showIcon={ false }
										customStyles={ {
											dateText : {
												marginLeft : 36 ,

											}
										} }
										hideText={ true }
										onDateChange={ ( date ) => {
											this.setState ( { business_licence_start : date } );
										} }
									/>
								</TouchableOpacity>

								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.business_license_end')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.business_licence_end }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
									<DatePicker
										style={ {
											position : 'absolute' ,
											top : 0 ,
											left : 0 ,
											width : '100%' ,
											height : pxToDp ( 120 )
										} }
										date={ this.state.business_licence_end }
										mode="date"
										format="YYYY-MM-DD"
										confirmBtnText={I18n.t('ok')}
										cancelBtnText={I18n.t('cancel')}
										showIcon={ false }
										customStyles={ {
											dateText : {
												marginLeft : 36 ,
											}
										} }
										hideText={ true }
										onDateChange={ ( date ) => {
											this.setState ( { business_licence_end : date } );
										} }
									/>
								</TouchableOpacity>

								{/* <TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : '法定经营范围' ,
											type : 'text' ,
											key : 'business_sphere',
											oldData:this.state.business_sphere,

										} )
									} }
								>
									<Text style={ styles.label }>*法定经营范围</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.business_sphere }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity> */}

								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.electronic_editio')}</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'business_licence_number_electronic' ) }
									>
										{ this.state.business_licence_number_electronic_base64 != '' && <Image
											source={ { uri : this.state.business_licence_number_electronic_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.business_licence_number_electronic_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

							</View>

						</View>
{/*
						<View style={ styles.form }>

							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>组织机构代码证</Text>
							</View>

							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : '组织机构代码证' ,
											type : 'text' ,
											key : 'organization_code',
											oldData:this.state.organization_code,
										} )
									} }
								>
									<Text style={ styles.label }>组织机构代码证</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.organization_code }</Text>
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
									<Text style={ styles.label }>组织机构代码证电子版</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'organization_code_electronic' ) }
									>
										{ this.state.organization_code_electronic_base64 != '' && <Image
											source={ { uri : this.state.organization_code_electronic_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.organization_code_electronic_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

							</View>

						</View> */}

						{/* <View style={ styles.form }>

							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>一般纳税人证明</Text>
							</View>

							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>一般纳税人证明</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'general_taxpayer' ) }
									>
										{ this.state.general_taxpayer_base64 != '' && <Image
											source={ { uri : this.state.general_taxpayer_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.general_taxpayer_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

							</View>

						</View> */}

						<View style={ styles.form }>

							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{I18n.t('CompanyStep2.Supplementary_certification')}</Text>
							</View>

							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>{I18n.t('CompanyStep2.Supplementary_certification1')}</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'vendor_add_img1' ) }
									>
										{ this.state.vendor_add_img1_base64 != '' && <Image
											source={ { uri : this.state.vendor_add_img1_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.vendor_add_img1_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>{I18n.t('CompanyStep2.Supplementary_certification2')}</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'vendor_add_img2' ) }
									>
										{ this.state.vendor_add_img2_base64 != '' && <Image
											source={ { uri : this.state.vendor_add_img2_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.vendor_add_img2_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

								<View
									style={ styles.form_item_img }
								>
									<Text style={ styles.label }>{I18n.t('CompanyStep2.Supplementary_certification3')}</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'vendor_add_img3' ) }
									>
										{ this.state.vendor_add_img3_base64 != '' && <Image
											source={ { uri : this.state.vendor_add_img3_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.vendor_add_img3_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>
							</View>

						</View>
					</Fragment>
					}

					{apply_t==0&&
					<Fragment>
						<View style={ styles.form }>
							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{I18n.t('CompanyStep2.text31')}</Text>
							</View>
							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep2.name_of_shop'),
											type : 'text' ,
											key : 'company_name',
											oldData:this.state.company_name,
										} )
									} }
								>
									<Text  style={ styles.label }>*{I18n.t('CompanyStep2.name_of_shop')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_name }</Text>
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
											title : I18n.t('CompanyStep2.location') ,
											type : 'address' ,
											key : 'company_address',
											oldData:this.state.company_address,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.location')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_address }</Text>
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
											title :I18n.t('CompanyStep2.detailed_address') ,
											type : 'text' ,
											key : 'company_address_detail',
											oldData:this.state.company_address_detail,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.detailed_address')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.company_address_detail }</Text>
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
											title :I18n.t('CompanyStep2.contact_name'),
											type : 'text' ,
											key : 'contacts_name',
											oldData:this.state.contacts_name,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.contact_name')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.contacts_name }</Text>
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
											title : I18n.t('CompanyStep2.contact_number'),
											type : 'number' ,
											key : 'contacts_phone',
											oldData:this.state.contacts_phone,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.contact_number')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.contacts_phone }</Text>
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
											title : I18n.t('CompanyStep2.email_address') ,
											type : 'text' ,
											key : 'contacts_email',
											oldData:this.state.contacts_email,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.email_address')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.contacts_email }</Text>
										<Image
											style={ styles.more }
											source={ require ( '../assets/images/sld_jiantou.png' ) }
											resizeMode={ 'contain' }
										/>
									</View>
								</TouchableOpacity>

							</View>
						</View>
						<View style={ styles.form }>

							<View style={ styles.form_title }>
								<Text style={ styles.form_title_txt }>{I18n.t('CompanyStep2.Id_information')}</Text>
							</View>

							<View style={ { paddingLeft : pxToDp ( 30 ) } }>
								<TouchableOpacity
									style={ styles.form_item }
									activeOpacity={ 1 }
									onPress={ () => {
										this.props.navigation.navigate ( 'CompanyEdit' , {
											title : I18n.t('CompanyStep2.name') ,
											type : 'text' ,
											key : 'business_sphere',
											oldData:this.state.business_sphere,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.name')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.business_sphere }</Text>
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
											title : I18n.t('CompanyStep2.ID_number') ,
											type : 'text' ,
											key : 'business_licence_number',
											oldData:this.state.business_licence_number,
										} )
									} }
								>
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.ID_number')}</Text>
									<View style={ styles.con }>
										<Text numberOfLines={1} ellipsizeMode={'tail'} style={ styles.con_txt }>{ this.state.business_licence_number }</Text>
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
									<Text style={ styles.label }>*{I18n.t('CompanyStep2.scanning_copy')}</Text>
									<TouchableOpacity
										style={ styles.form_item_img_upload }
										activeOpacity={ 1 }
										onPress={ () => this.uploadImg ( 'business_licence_number_electronic' ) }
									>
										{ this.state.business_licence_number_electronic_base64 != '' && <Image
											source={ { uri : this.state.business_licence_number_electronic_base64 } }
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 140 ) , height : pxToDp ( 140 ) } }
										/> }
										{ this.state.business_licence_number_electronic_base64 == '' && <Image
											resizeMode={ 'contain' }
											style={ { width : pxToDp ( 80 ) , height : pxToDp ( 80 ) } }
											source={ require ( '../assets/images/upload.png' ) }
										/> }
									</TouchableOpacity>
								</View>

							</View>

						</View>
					</Fragment>
					}

					<View style={ { height : pxToDp ( 180 ) } }></View>

				</ScrollView>

				<TouchableOpacity
					style={ styles.btn }
					activeOpacity={ 1 }
					onPress={ () => this.submit () }
				>
					<Text style={ { color : '#fff' , fontSize : pxToDp ( 30 ) } }>{I18n.t('CompanyStep2.next_step')}</Text>
				</TouchableOpacity>

				<Modal
					backdropPressToClose={true}
					entry='bottom'
					position='bottom'
					coverScreen={true}
					swipeToClose={false}
					style={{
						 height: height,
						width: width,
					}}
					ref={"map_view"}>
					<TouchableOpacity
						activeOpacity={1}
						style={{position:'absolute',top:Platform.OS === 'ios' ? 50 : 20,right:15,zIndex:999,width:pxToDp(50),height:pxToDp(50),padding:pxToDp(10),backgroundColor:'#fff',}}
						onPress={()=>this.refs.map_view.close()}
					>
						<Image style={{width:pxToDp(30),height:pxToDp(30),marginRight:pxToDp(15)}} source={require("../assets/images/sld_close_modal.png")}/>
					</TouchableOpacity>
				</Modal>
			</View>
		)
	}
}
