/*
 * 确定订单页面
 * @slodon
 * */
import React, {Component, Fragment} from 'react';
import {
	View, Image, Text, TouchableOpacity, DeviceEventEmitter, ScrollView, Dimensions,TextInput
} from 'react-native';
import RequestData from "../RequestData";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
import ComStyle from "../assets/styles/ComStyle";
import {I18n} from './../lang/index'

const {height, width} = Dimensions.get('window');
export default class SelInvoice extends Component{

	constructor(props){
		super(props);
		this.state = {
			title: I18n.t('SelInvoice.title'),//页面标题
			invoice_list: [],
			invoice_need:props.navigation.state.params.invoice_id != undefined&&props.navigation.state.params.invoice_id!='' ? 'need' : '',
			invoice_con: [],//发票内容明细
			show_add_info: false,//是否新增发票内容
			add_invoice_type: 'person',//发票类型，默认个人
			sele_invoice_con: '',//新增发票内容
			inv_id: props.navigation.state.params.invoice_id != undefined ? props.navigation.state.params.invoice_id : '',
			show_invoice_detial: false,
			inv_title:'',//发票类型为单位的情况下，单位名称
			inv_title_shuihao:'',//发票类型为单位的情况下，单位税号
		}
	}

	pay_info = [ {
		pay_code: '',
		pay_name: I18n.t('SelInvoice.dont'),
	}, {
		pay_code: 'need',
		pay_name: I18n.t('SelInvoice.need'),
	} ];

	invoice_type = [ {
		key: 'person',
		val: I18n.t('SelInvoice.person'),
	}, {
		key: 'company',
		val: I18n.t('SelInvoice.company'),
	} , {
		key: 'value_added',
		val: I18n.t('SelInvoice.value_added'),
	} ];

	//增值税发票内容
	value_added_data = [{
		key: 'inv_company',
		label: I18n.t('SelInvoice.titlinv_companye'),
	},{
		key: 'inv_code',
		label: I18n.t('SelInvoice.inv_code'),
	},{
		key: 'inv_reg_addr',
		label: I18n.t('SelInvoice.inv_reg_addr'),
	},{
		key: 'inv_reg_phone',
		label: I18n.t('SelInvoice.inv_reg_phone'),
	},{
		key: 'inv_reg_bname',
		label: I18n.t('SelInvoice.inv_reg_bname'),
	},{
		key: 'inv_reg_baccount',
		label: I18n.t('SelInvoice.inv_reg_baccount'),
	},{
		key: 'inv_rec_name',
		label: I18n.t('SelInvoice.inv_rec_name'),
	},{
		key: 'inv_rec_mobphone',
		label: I18n.t('SelInvoice.inv_rec_mobphone'),
	},{
		key: 'inv_goto_addr',
		label: I18n.t('SelInvoice.inv_goto_addr'),
	},];

	componentWillMount(){
		this.getInvoiceList();
		this.getInvoiceCon();
	}

	getInvoiceList = () =>{
		RequestData.postSldData(AppSldUrl + '/index.php?app=invoice&mod=invoice_list', {
			key: key
		}).then(res =>{
			this.setState({
				invoice_list: res.datas.invoice_list
			});
		}).catch(err =>{
			ViewUtils.sldErrorToastTip(error);
		})
	}
	//获取发票明细
	getInvoiceCon = () =>{
		RequestData.postSldData(AppSldUrl + '/index.php?app=invoice&mod=invoice_content_list', {
			key: key
		}).then(res =>{
			this.setState({
				invoice_con: res.datas.invoice_content_list,
				sele_invoice_con: res.datas.invoice_content_list[ 0 ],
			});
		}).catch(err =>{
			ViewUtils.sldErrorToastTip(error);
		})
	}


	//删除发票历史
	del_invoice = (inv_id) =>{
		let {invoice_list} = this.state;
		RequestData.postSldData(AppSldUrl + '/index.php?app=invoice&mod=invoice_del', {
			key: key,
			inv_id: inv_id
		}).then(res =>{
			if(res.datas == 1){
				invoice_list = invoice_list.filter((item, index) => item.inv_id != inv_id);
				this.setState({invoice_list});
			}else{
				ViewUtils.sldToastTip(res.datas.error);
			}
		}).catch(err =>{
			ViewUtils.sldErrorToastTip(err);
		})
	}

	//新增发票历史
	add_invoice = () =>{
		let {inv_title,inv_title_shuihao,add_invoice_type,sele_invoice_con,invoice_need,inv_state,inv_company,inv_code,inv_reg_addr,inv_reg_phone,inv_reg_bname,inv_reg_baccount,inv_rec_name,inv_rec_mobphone,inv_rec_province,inv_goto_addr} = this.state;
		console.info(888);
		console.info(this.state);
		if(invoice_need == 'need'){
			let inv = {};
			inv.key = key;
			inv.inv_state = 1;
			inv.inv_title_select = add_invoice_type;//发票类型
			inv.inv_title = inv_title;//单位名称
			inv.inv_code = inv_title_shuihao;//单位税号
			inv.inv_content = sele_invoice_con;//发票内容
			//单位发票
			if(inv.inv_title_select == 'company'){
				if(inv.inv_title == ''||inv.inv_code == ''){
					ViewUtils.sldToastTip(I18n.t('SelInvoice.text1'));
					return false;
				}
			}
			//增值税发票
			if(inv.inv_title_select == 'value_added'){
				inv.inv_state = 2;
				inv.inv_company = inv_company;
				inv.inv_code = inv_code;
				inv.inv_reg_addr = inv_reg_addr;
				inv.inv_reg_phone = inv_reg_phone;
				inv.inv_reg_bname = inv_reg_bname;
				inv.inv_reg_baccount = inv_reg_baccount;
				inv.inv_rec_name = inv_rec_name;
				inv.inv_rec_mobphone = inv_rec_mobphone;
				inv.inv_rec_province = inv.inv_title;
				inv.inv_goto_addr = inv_goto_addr;
				if(inv_company == ''|| inv_code == ''|| inv_reg_addr == ''|| inv_reg_phone == ''|| inv_reg_bname == ''|| inv_reg_baccount == ''|| inv_rec_name == ''|| inv_rec_mobphone == ''|| inv_goto_addr == ''){
					ViewUtils.sldToastTip(I18n.t('SelInvoice.text1'));
					return false;
				}else{
					if(!ViewUtils.sldCheckMobile(inv.inv_rec_mobphone)){
						ViewUtils.sldToastTip(I18n.t('SelInvoice.text2'));
						return false;
					}
				}
			}
			RequestData.postSldData(AppSldUrl + '/index.php?app=invoice&mod=invoice_add',inv).then(res =>{
				if (res.datas.inv_id > 0) {
					let invoice_info = '';
					if(inv.inv_title_select != 'value_added'){
						invoice_info = inv.inv_title + " " + inv.inv_content
					}else{
						invoice_info = I18n.t('SelInvoice.invoice') + inv.inv_company
					}
					DeviceEventEmitter.emit('updateInvoice', {inv_id: res.datas.inv_id, invoice_info: invoice_info});
					this.props.navigation.goBack();
				}else{
					ViewUtils.sldToastTip(res.datas.error);
				}
			}).catch(err =>{
				ViewUtils.sldErrorToastTip(err);
			})
		}else{
			DeviceEventEmitter.emit('updateInvoice', {inv_id: '', invoice_info: ''});
			this.props.navigation.goBack();
		}

	}

	sele_method = (code) => {
		this.setState({
			invoice_need:code
		});
	}

	//选择发票
	sele_inoice = (inv_id, invoice_info) =>{
		//通知上一页更新数据并返回
		DeviceEventEmitter.emit('updateInvoice', {inv_id: inv_id, invoice_info: invoice_info});
		this.props.navigation.goBack();
	}

	//选择新增发票
	sele_add_invoice = () =>{
		this.setState({
			inv_id: '',
			show_add_info: true,
		});
	}



	render(){
		const {title, invoice_list, inv_id, show_add_info, add_invoice_type, invoice_con, show_invoice_detial, sele_invoice_con,invoice_need} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				                           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) } right_type='text' right_event={() =>this.add_invoice()} right_text={I18n.t('PerfectInfo.confirm')} right_style={{ marginRight:15,
					color:'#333',
					fontSize:pxToDp(28)}}/>


				<View style={ GlobalStyles.line }/>
				<View style={ ComStyle.sele_pay_method_view }>
					<Text style={ {color: '#333333', fontSize: pxToDp(26), fontWeight: '400'} }>{I18n.t('SelInvoice.text3')}</Text>
					<View style={ {flexDirection: 'row', width: '100%', justifyContent: 'flex-start'} }>
						{ this.pay_info.map((item, index) =>{
							return <TouchableOpacity
								key={ index }
								activeOpacity={ 1 }
								style={ [ ComStyle.com_btn, {
									backgroundColor: invoice_need == item.pay_code ? '#F23030' : "#fff",
									marginRight: index == 0 ? 20 : 0
								} ] }
								onPress={ () => this.sele_method(item.pay_code) }
							>
								<Text
									style={ [ ComStyle.com_btn_text, {color: invoice_need == item.pay_code ? '#fff' : "#666"} ] }>{ item.pay_name }</Text>
							</TouchableOpacity>
						}) }


					</View>

				</View>

				<View style={ GlobalStyles.space_shi_separate }/>
				{invoice_need == 'need'&&
				<ScrollView>
					{ invoice_list.length > 0 && invoice_list.map((item, index) =>{
						return <View style={ ComStyle.sele_invoice_item }>
							<TouchableOpacity
								key={ item.inv_id }
								activeOpacity={ 1 }
								style={ ComStyle.sele_invoice_left }
								onPress={ () => this.sele_inoice(item.inv_id, item.inv_state != 'zhuanpiao' ? item.inv_title + " " + item.inv_content : item.inv_company) }
							>
								{ ViewUtils.getSldImg(30, 30, item.inv_id == inv_id ? require('../assets/images/sld_invoice_seled.png') : require('../assets/images/sld_invoice_sel.png')) }
								<Text
									style={ ComStyle.sel_inv_left_text }>{ item.inv_state == 1 ? '['+I18n.t('SelInvoice.Definitive')+']' + item.inv_title + " " + item.inv_content : '['+I18n.t('SelInvoice.invoice')+'] ' + item.inv_company }</Text>
							</TouchableOpacity>

							<TouchableOpacity
								key={ index }
								activeOpacity={ 1 }
								style={ ComStyle.sld_invoice_del }
								onPress={ () => this.del_invoice(item.inv_id) }
							>
								{ ViewUtils.getSldImg(23, 23, require('../assets/images/sld_invoice_del.png')) }
							</TouchableOpacity>

						</View>
					}) }
					{ invoice_list.length < 10 &&
					<View style={ ComStyle.sele_invoice_item }>
						<TouchableOpacity
							key={ 'add' }
							activeOpacity={ 1 }
							style={ ComStyle.sele_invoice_left }
							onPress={ () => this.sele_add_invoice() }
						>
							{ ViewUtils.getSldImg(30, 30, show_add_info ? require('../assets/images/sld_invoice_seled.png') : require('../assets/images/sld_invoice_sel.png')) }
							<Text style={ ComStyle.sel_inv_left_text }>{I18n.t('SelInvoice.Invoicecontent')}</Text>
						</TouchableOpacity>

					</View> }

					{ show_add_info &&
					<Fragment>
						<View style={ ComStyle.sele_pay_method_view }>
							<View style={ComStyle.sel_invoice_type}>
								<Text style={ ComStyle.sel_invoice_type_text }>{I18n.t('SelInvoice.sel_invoice_type_text')}</Text>
								{ this.invoice_type.map((item, index) =>{
									return <TouchableOpacity
										key={ item.key }
										activeOpacity={ 1 }
										style={ [ ComStyle.com_btn, {
											backgroundColor: add_invoice_type == item.key ? '#F23030' : "#fff",
											marginRight: 20,
											marginLeft: index == 0 ? 20 : 0
										} ] }
										onPress={ () => this.setState({
											add_invoice_type: item.key
										}) }
									>
										<Text
											style={ [ ComStyle.com_btn_text, {color: add_invoice_type == item.key ? '#fff' : "#666"} ] }>{ item.val }</Text>
									</TouchableOpacity>
								}) }
							</View>

						</View>
						{add_invoice_type == 'company'&&
						<Fragment>
							<View style={ComStyle.sel_inv_input_view}>
								<Text style={ComStyle.sel_inv_input_view_text}>{I18n.t('SelInvoice.sel_inv_input_view_text')}</Text>
								<TextInput
									style={[ComStyle.wrapper_part_line_input, GlobalStyles.sld_global_font]}
									underlineColorAndroid={'transparent'}
									autoCapitalize='none'
									clearButtonMode={'always'}
									enablesReturnKeyAutomatically={true}
									onChangeText={(text) =>this.setState({inv_title:text})}
									placeholder={I18n.t('SelInvoice.text4')}
								></TextInput>
							</View>
							<View style={ComStyle.sel_inv_input_view}>
								<Text style={ComStyle.sel_inv_input_view_text}>{I18n.t('SelInvoice.sel_inv_input_view_text1')}</Text>
								<TextInput
									style={[ComStyle.wrapper_part_line_input, GlobalStyles.sld_global_font]}
									underlineColorAndroid={'transparent'}
									autoCapitalize='none'
									clearButtonMode={'always'}
									enablesReturnKeyAutomatically={true}
									onChangeText={(text) =>this.setState({inv_title_shuihao:text})}
									placeholder={I18n.t('SelInvoice.text5')}
								></TextInput>
							</View>
						</Fragment>
						}


						{add_invoice_type == 'value_added'&&this.value_added_data.map((item)=>{
							return  <View key={item.key} style={ComStyle.sel_inv_input_view}>
								<Text style={ComStyle.sel_inv_input_view_text}>{item.label}</Text>
								<TextInput
									style={[ComStyle.wrapper_part_line_input, GlobalStyles.sld_global_font]}
									underlineColorAndroid={'transparent'}
									autoCapitalize='none'
									clearButtonMode={'always'}
									enablesReturnKeyAutomatically={true}
									onChangeText={(text) =>this.setState({[item.key]:text})}
									placeholder={I18n.t('SelInvoice.pleaseinput')+`${item.label}`}
								></TextInput>
							</View>
						})
						}

						<TouchableOpacity activeOpacity={ 1 }
						                  style={ComStyle.sel_inv_detail_con_view}
						                  onPress={ () =>{
							                  this.setState({show_invoice_detial: true});
						                  } }>
							<Text style={ {color: '#333333', fontSize: pxToDp(24), fontWeight: '300'} }>{I18n.t('SelInvoice.invoicecontent1')}</Text>
							<View style={ {flexDirection: 'row', justifyContent: 'flex-end'} }>
								<Text style={ {
									color: '#999999',
									fontSize: pxToDp(22),
									fontWeight: '300'
								} }>{ sele_invoice_con != '' ? sele_invoice_con : I18n.t('SelInvoice.text6') } </Text>
								<Image resizeMode={ 'contain' } style={ {width: pxToDp(14), height: pxToDp(28)} }
								       source={ require("../assets/images/sld_arrow_right.png") }/>
							</View>
						</TouchableOpacity>
					</Fragment>
					}
				</ScrollView>
				}

				{ show_invoice_detial &&
				<View style={ ComStyle.sel_invoice_modal_bg }>
					<View style={ ComStyle.sel_invoice_modal_con_view }>
						<ScrollView>
							{ invoice_con.length > 0 && invoice_con.map((item, index) =>{
								return <Fragment>
									<TouchableOpacity
										key={ index }
										activeOpacity={ 1 } onPress={ () =>{
										this.setState({
											sele_invoice_con: item,
											show_invoice_detial: false,
										});
									} }
										style={ComStyle.sel_inv_detail_item}>
										<Text style={ComStyle.sel_inv_detail_item_text}>{ item }</Text>
									</TouchableOpacity>
									<View style={ComStyle.sel_inv_detail_item_line}/>
								</Fragment>
							}) }
							<View style={ComStyle.sel_invoice_detail_empty}/>
						</ScrollView>
					</View>
				</View>
				}
			</View>
		)
	}
}
