/*
* 入驻申请
* @slodon
* */
import React , { Component , Fragment } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    DeviceEventEmitter
    ,DeviceInfo,
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ComStyle from "../assets/styles/ComStyle";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import styles from './stylejs/companyReg';
import RequestData from '../RequestData'
import Modal from 'react-native-modalbox';
import RPicker from 'react-native-picker';
import LoadingWait from "../component/LoadingWait";
import SldHeader from '../component/SldHeader';
var Dimensions = require('Dimensions');
import {I18n} from './../lang/index'
var {
	height: deviceHeight,
	width: deviceWidth
} = Dimensions.get('window');


const navData = [
    {
        name:I18n.t('CompanyEdit.province'),
        type: 'province'
    },
    {
        name: I18n.t('CompanyEdit.city'),
        type: 'city'
    },
    {
        name:I18n.t('CompanyEdit.area'),
        type: 'area'
    },
]

const joinin_year = [
    {
        name: I18n.t('CompanyEdit.one_year'),
        id: 1
    },
    {
        name: I18n.t('CompanyEdit.years'),
        id: 2
    }
]


const publish_video = [
	{
		name: I18n.t('CompanyEdit.want'),
		id: 1
	},
	{
		name: I18n.t('CompanyEdit.do_without'),
		id: 0
	}
]

export default class CompanyEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
	        isLoading:false,
            title: props.navigation.state.params.title || '',
            type: props.navigation.state.params.type || '',     // text: 普通文本，number：数字，address: 地址，picker: 选择器
            key: props.navigation.state.params.key || '',
	        oldData: props.navigation.state.params.oldData || '',  //原有数据传入方便编辑
            inputVal: props.navigation.state.params.oldData || '',  //原有数据传入方便编辑,
            now: 1,
            areaList: [],
            area_info: [],
            area_id: [],
            grade: [],
            categoryList: [],
            checkVal: '',
            checkname: '',
            chooseCat: [],
            catList: [],
            venCatId:'',//店铺分类ID
            venCatName:'',//店铺分类名称
	          show_ven_yun_type_modal:false,//是否展示实体门店店铺类型的选择框
	          addrInfo:[],//三级地址
	         initAddrInfo:'', //地址选择展示的地址数据
	          cartInfo:'', //经营类目选择展示的数据
        }

    }

    componentDidMount() {
        let {type, key} = this.state;
        if (type == 'address') {
            this.getAddressList()
        }
        if (key == 'sg_name') {
            this.getComGrade();
        }
        if (key == 'sc_name') {
            this.getVendorCategoryList();
        }
        if (key == 'cat') {
            this.getAllGcList();
        }

    }

    // 获取经营类目
    getAllGcList() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=enterin&mod=getAllGcList&key=' + key).then(res => {
            this.setState({
                catList: res.datas.data
            })
            this.catInit(res.datas.data)
        })
    }

	addrInit(addr){
    	console.info(666);
    	console.info(addr);
		let p = [];
		let len = addr.length;
		for(let i = 0; i < len; i++){
			let city = [];
			for(let j = 0; j < addr[ i ][ 'city' ].length; j++){
				let area = [];
				for(let k = 0; k < addr[ i ][ 'city' ][ j ][ 'area' ].length; k++){
					area.push(addr[ i ][ 'city' ][ j ][ 'area' ][ k ][ 'area_name' ])
				}
				let data_area = {};
				data_area[ addr[ i ][ 'city' ][ j ][ 'area_name' ] ] = area;
				city.push(data_area);
			}
			let data = {};
			data[ addr[ i ][ 'area_name' ] ] = city;
			p.push(data)
		}
		console.info(p);
		this.setState({
			initAddrInfo: p,
			isLoading: false
		})
	}

	showArea = () => {
		let {initAddrInfo, addrInfo,catList,key} = this.state;
		RPicker.init({
			pickerData: initAddrInfo,
			pickerConfirmBtnText: I18n.t('ok'),
			pickerCancelBtnText:I18n.t('cancel') ,
			pickerTitleText: I18n.t('AddNewAddress.select'),
			pickerBg: [ 255, 255, 255, 1 ],
			onPickerConfirm: data => {
				let province, city, area;
				for(let i = 0; i < addrInfo.length; i++){
					if(addrInfo[ i ][ 'area_name' ] == data[ 0 ]){
						province = addrInfo[ i ].area_id;
						let cityinfo = addrInfo[ i ].city;
						for(let j = 0; j < cityinfo.length; j++){
							if(cityinfo[ j ][ 'area_name' ] == data[ 1 ]){
								city = cityinfo[ j ].area_id;
								let earainfo = cityinfo[ j ].area;
								for(let k = 0; k < earainfo.length; k++){
									if(earainfo[ k ][ 'area_name' ] == data[ 2 ]){
										area = earainfo[ k ].area_id;
										break;
									}
								}
								break;
							}
						}
						break;
					}
				}
				if(key == 'cat'){
					let {chooseCat} = this.state;
					let arr = [];
					if(!Array.isArray(chooseCat)){
						chooseCat = []
					}
					data.map((el, index) => {
						if (el) {
							arr.push({
								name: el,
								id: index == 0 ? province : (index == 1) ? city : area
							})
						}
					})
					chooseCat.push(arr)
					this.setState({
						chooseCat: chooseCat
					})
				}else{
					this.setState({
						province, city, area, area_info: data.join(' '),area_ids:province+'|'+city+'|'+ area
					})
				}
			},
			onPickerCancel: data => {
			}
		});
		RPicker.show();
	}

    showCategoryList = () => {
        let {cartInfo, catList} = this.state;
        RPicker.init({
            pickerData: cartInfo,
            pickerConfirmBtnText:I18n.t('ok') ,
            pickerCancelBtnText:I18n.t('cancel'),
            pickerTitleText: I18n.t('CompanyEdit.Select_category'),
            pickerBg: [ 255, 255, 255, 1 ],
            onPickerConfirm: data => {
                let province, city, area;
                for(let i = 0; catList&&i < catList.length; i++){
                    if(catList[ i ][ 'gc_name' ] == data[ 0 ]){
                        province = catList[ i ].gc_id;
                        let cityinfo = catList[ i ].childs;
                        for(let j = 0; cityinfo&&j < cityinfo.length; j++){
                            if(cityinfo[ j ][ 'gc_name' ] == data[ 1 ]){
                                city = cityinfo[ j ].gc_id;
                                let areainfo = cityinfo[ j ].childs;
                                if(areainfo!=undefined&&areainfo.length!=undefined){
	                                for(let k = 0; k < areainfo.length; k++){
		                                if(areainfo[ k ][ 'gc_name' ] == data[ 2 ]){
			                                area = areainfo[ k ].gc_id;
			                                break;
		                                }
	                                }
                                }
	                            break;

                            }
                        }
                        break;
                    }
                }
                let {chooseCat} = this.state;
                let arr = [];
                if(!Array.isArray(chooseCat)){
                    chooseCat = []
                }
                data.map((el, index) => {
                    if (el) {
                        arr.push({
                            name: el,
                            id: index == 0 ? province : (index == 1) ? city : area
                        })
                    }
                })
                chooseCat.push(arr)
                this.setState({
                    chooseCat: chooseCat
                })

            },
            onPickerCancel: data => {
            }
        });
        RPicker.show();
    }

    // 获取店铺等级
    getComGrade() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=enterin&mod=getGradeList&key=' + key).then(res => {
            if (res.code == 200) {
                let grade = [];
                let data = res.datas.data;
                for (let i in data) {
                    grade.push(data[i]);
                }
                console.info(234);
                console.info(grade);
                this.setState({
	                grade:grade,
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }

    // 获取店铺分类
    getVendorCategoryList() {
        RequestData.getSldData(AppSldUrl + '/index.php?app=enterin&mod=getVendorCategoryList&key=' + key).then(res => {
            if (res.code == 200) {
                this.setState({
                    categoryList: res.datas.data
                })
            }
        })
    }

	catInit(addr){
		let p = [];
		let len = addr.length;
		for(let i = 0; i < len; i++){
			let city = [];
			if(addr[ i ][ 'childs' ]){
				for(let j = 0; j < addr[ i ][ 'childs' ].length; j++){
					let area = [];
					if(addr[ i ][ 'childs' ][ j ][ 'childs' ]){
						for(let k = 0; k < addr[ i ][ 'childs' ][ j ][ 'childs' ].length; k++){
							area.push(addr[ i ][ 'childs' ][ j ][ 'childs' ][ k ][ 'gc_name' ])
						}
					}else{
						//area.push('3');
						area.push(' ');
					}
					let data_area = {};
					data_area[ addr[ i ][ 'childs' ][ j ][ 'gc_name' ] ] = area;
					city.push(data_area);
				}
			}else{
				let area = [];
				let data_area = {};
				area.push(' ');
				data_area[' '] = area;
				city.push(data_area);
			}
			let data = {};
			data[ addr[ i ][ 'gc_name' ] ] = city;
			p.push(data)
		}

		this.setState({
			cartInfo: p
		})
	}

    cur_now = '' ;//当前地址操作级别

    getAddressList() {
	    this.setState({isLoading: true})
	    RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=area_list&key='+key).then(res => {
		    this.setState({
			    addrInfo: res
		    })
		    this.addrInit(res);
	    }).catch(err => {
		    this.setState({isLoading: false})
	    })
    }

    confirm = () => {
        let {inputVal, title, type, key} = this.state;
	    if(type == 'modal_single_select'&&(key=='sg_name'||key=='joinin_year'||key=='sc_name'||key == 'video')){
		    let {venCatId, venCatName} = this.state;
		    if (venCatName=='') {
			    ViewUtils.sldToastTip(I18n.t('CompanyEdit.select_data'))
			    return;
		    }
		    DeviceEventEmitter.emit('companyedit', {
			    key: key,
			    val: venCatId,
			    name: venCatName
		    })
		    this.props.navigation.pop();
		    if(key != 'is_yun'&&key != 'video'){
			    this.refs.exchange.close();
		    }
		    return;
	    }
	    if (type == 'table') {
		    let {chooseCat} = this.state;
		    if (chooseCat.length==0) {
			    ViewUtils.sldToastTip(I18n.t('CompanyEdit.select_data'))
			    return;
		    }
		    DeviceEventEmitter.emit('companyedit', {
			    key: key,
			    val: chooseCat,
			    name: chooseCat
		    })
		    this.props.navigation.pop();
		    return;
	    }


	    if (type != 'address' && !inputVal) {
            ViewUtils.sldToastTip(I18n.t('SelInvoice.pleaseinput') + title);
            return;
        }
        if (key.indexOf('phone') > -1) {
        	if (!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(inputVal))) {
	            if(!(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(inputVal)))
	            {
		            ViewUtils.sldToastTip(I18n.t('CompanyEdit.text1'));
		            return;
	            }

            }
        }
        if (type == 'address') {
            let {area_info, area_id,area_ids} = this.state;
            if (area_info < '') {
                ViewUtils.sldToastTip(I18n.t('AddNewAddress.text4'));
                return;
            }
            DeviceEventEmitter.emit('companyedit', {
                key: key,
                area_info: area_info,
                area_ids: area_ids
            })
	        RPicker.hide();
            this.props.navigation.pop();
            return;
        }

        if (type == 'picker') {
            let {checkVal, checkname} = this.state;
            if (!checkVal) {
                ViewUtils.sldToastTip(I18n.t('CompanyEdit.select_data'))
                return;
            }
            DeviceEventEmitter.emit('companyedit', {
                key: key,
                val: checkVal,
                name: checkname
            })
	        RPicker.hide();
            this.props.navigation.pop();
            return;
        }

        DeviceEventEmitter.emit('companyedit', {
            key: key,
            val: inputVal
        })
	    RPicker.hide();
        this.props.navigation.pop();
    }

    //店铺分类,开店时长选择事件
	  seleVenModalSingle = (item,type='') => {
        let {key} = this.state;
        if(type == 'sg_name'){
	        this.setState({
		        venCatId:item.sg_id,//店铺分类ID
		        venCatName:item.sg_name,//店铺分类名称
	        },()=>{
		        this.refs.exchange.close();
	        });
        }else if(type == 'joinin_year'){
	        this.setState({
		        venCatId:item.name,//店铺分类ID
		        venCatName:item.id,//店铺分类名称
	        },()=>{
		        this.refs.exchange.close();
	        });
        }else if(type == 'sc_name'){
	        this.setState({
		        venCatId:item.sc_id,//店铺分类ID
		        venCatName:item.sc_name.replace(/&nbsp;/ig, ""),//店铺分类名称
	        },()=>{
		        this.refs.exchange.close();
	        });
        }else if(type == 'video'){
	        this.setState({
		        venCatId:item.id,//是否需要发布视频ID
		        venCatName:item.name,//是否需要发布视频名称
	        });
        }

      }

    render() {
        const {title, type, areaList, grade, categoryList,venCatName,key,area_info} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader   />
                <View style={styles.navigateBar}>
                    <TouchableOpacity
                        style={styles.n_left}
                        activeOpacity={1}
                        onPress={() => {
	                        RPicker.hide();
                            this.props.navigation.pop();
                        }}
                    >
                        <Text style={{color: '#FF4444', fontSize: pxToDp(26)}}>{I18n.t('cancel')}</Text>
                    </TouchableOpacity>

                    <Text style={{color: '#181818', fontSize: pxToDp(28)}}>{title}</Text>

                    <TouchableOpacity
                        style={styles.n_left}
                        activeOpacity={1}
                        onPress={() => this.confirm()}
                    >
                        <Text style={{color: '#4AA600', fontSize: pxToDp(26)}}>{I18n.t('ok')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={GlobalStyles.line}/>
	            {this.state.isLoading && <LoadingWait loadingText={I18n.t('loading')} cancel={() => {
	            }}/>}
                {(type == 'text' || type == 'number') && <View style={styles.inputWrap}>
                    <TextInput
                        style={styles.input}
                        placeholder={I18n.t('SelInvoice.pleaseinput') + title}
                        keyboardType={(type == 'number') ? 'numeric' : 'default'}
                        underlineColorAndroid={'transparent'}
                        defaultValue={this.state.oldData}
                        onChangeText={text => {
                            this.setState({
                                inputVal: text
                            })
                        }}
                    />
                </View>}

                {type == 'address' && <TouchableOpacity
	                style={ styles.item_address }
	                activeOpacity={ 1 }
	                onPress={ () => this.showArea() }
                >
	                <Text style={ {
		                flex: 1,
		                color: (area_info == '' ? '#999' : '#333'),
		                fontSize: pxToDp(28)
	                } }>{ area_info == '' ? I18n.t('AddNewAddress.text4') : area_info }</Text>
                </TouchableOpacity>}
	            {type == 'picker' && this.state.key == 'sc_name' && <View style={styles.pickerWrap}>
		            <View style={styles.inputWrap}>
			            <Text
				            style={styles.input}>{this.state.checkname ? this.state.checkname : (I18n.t('CompanyEdit.text') + title)}</Text>
			            {categoryList.length > 0 && <Picker
				            style={styles.picker}
				            selectedValue={this.state.checkname}
				            onValueChange={(itemValue) => {
					            let choose = categoryList.filter(item => item.sc_id == itemValue);
					            this.setState({
						            checkVal: itemValue,
						            checkname: choose[0].sc_name
					            })
				            }}
			            >
				            {categoryList.map(el =>
					            <Picker.Item
						            key={el.sc_id}
						            label={el.sc_name}
						            value={el.sc_id}
					            />
				            )}
			            </Picker>}
		            </View></View>}

                {type == 'modal_single_select' && (this.state.key == 'sg_name'||this.state.key == 'joinin_year') &&
                  <Fragment>
                    <TouchableOpacity
	                    activeOpacity={ 1 }
                      onPress={ () => {
	                      this.refs.exchange.open();
                    } }s
                      style={styles.inputWrap}>
                      <Text style={styles.input}>
                          {this.state.venCatName ? this.state.venCatName : (I18n.t('CompanyEdit.text')+title)}
                      </Text>
                    </TouchableOpacity>
                <Modal
	                backdropPressToClose={true}
	                entry='bottom'
	                position='bottom'
	                coverScreen={true}
	                swipeToClose={false}
	                style={{
		                backgroundColor: "#fff", height: pxToDp(400),
		                position: "absolute", left: 0, right: 0,zIndex:100,
		                width: deviceWidth,
		                paddingBottom:DeviceInfo.isIPhoneX_deprecated?30:0,
	                }}
	                ref={"exchange"}>
	                <ScrollView>
		                {key == 'sg_name'&&typeof (grade.length)!='undefined'&&grade.length>0&&
		                grade.map((item,index)=>{
			                return  <Fragment key={item.sg_id}>
				                <TouchableOpacity
					                activeOpacity={ 1 } onPress={ () => {
					                    this.seleVenModalSingle(item,'sg_name')
				                } }
					                style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',width:deviceWidth,padding:pxToDp(30)}}>
					                <View style={{flex:1,marginRight:pxToDp(100),flexDirection:'row',justifyContent:'flex-start'}}>
						                <Text style={{color:'#333',fontSize:pxToDp(28),fontWeight:'300',lineHeight:pxToDp(40)}}>{item.sg_name}</Text>
					                </View>
				                </TouchableOpacity>
				                <View style={{height: 0.5,backgroundColor: '#e5e5e5',width:deviceWidth,marginLeft:pxToDp(20)}}/>
			                </Fragment>
		                })
		                }
		                {key == 'joinin_year'&&typeof (joinin_year.length)!='undefined'&&joinin_year.length>0&&
		                joinin_year.map((item,index)=>{
			                return  <Fragment key={item.id}>
				                <TouchableOpacity
					                activeOpacity={ 1 } onPress={ () => {
					                this.seleVenModalSingle(item,'joinin_year')
				                } }
					                style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',width:deviceWidth,padding:pxToDp(30)}}>
					                <View style={{flex:1,marginRight:pxToDp(100),flexDirection:'row',justifyContent:'flex-start'}}>
						                <Text style={{color:'#333',fontSize:pxToDp(28),fontWeight:'300',lineHeight:pxToDp(40)}}>{item.name}</Text>
					                </View>
				                </TouchableOpacity>
				                <View style={{height: 0.5,backgroundColor: '#e5e5e5',width:deviceWidth,marginLeft:pxToDp(20)}}/>
			                </Fragment>
		                })
		                }

	                </ScrollView>
                </Modal></Fragment>}



	            {type == 'modal_single_select' && this.state.key == 'sc_name' &&
	            <Fragment>
		            <TouchableOpacity
			            activeOpacity={ 1 }
			            onPress={ () => {
				            this.refs.exchange.open();
			            } }s
			            style={styles.inputWrap}>
			            <Text style={styles.input}>
				            {this.state.venCatName ? this.state.venCatName : (I18n.t('CompanyEdit.text')+title)}
			            </Text>
		            </TouchableOpacity>
		            <Modal
			            backdropPressToClose={true}
			            entry='bottom'
			            position='bottom'
			            coverScreen={true}
			            swipeToClose={false}
			            style={{
				            backgroundColor: "#fff", height: pxToDp(400),
				            position: "absolute", left: 0, right: 0,
				            width: deviceWidth,
				            paddingBottom:DeviceInfo.isIPhoneX_deprecated?30:0,
			            }}
			            ref={"exchange"}>
			            <ScrollView>
				            {categoryList.length>0&&categoryList.map((item,index)=>{
					            return  <Fragment key={item.sc_id}>
						            <TouchableOpacity
							            activeOpacity={ 1 } onPress={ () => {
							            this.seleVenModalSingle(item,'sc_name')
						            } }
							            style={{flexDirection:'row',justifyContent:'flex-end',alignItems:'center',width:deviceWidth,padding:pxToDp(30)}}>
							            <View style={{flex:1,marginRight:pxToDp(100),flexDirection:'row',justifyContent:'flex-start'}}>
								            <Text style={{color:'#333',fontSize:pxToDp(28),fontWeight:'300',lineHeight:pxToDp(40)}}>{item.sc_name.replace(/&nbsp;/ig, "")}</Text>
							            </View>
						            </TouchableOpacity>
						            <View style={{height: 0.5,backgroundColor: '#e5e5e5',width:deviceWidth,marginLeft:pxToDp(20)}}/>
					            </Fragment>
				            })}
			            </ScrollView>
		            </Modal></Fragment>}

	            {type == 'modal_single_select' && this.state.key == 'video' &&
	            <Fragment>
		            <TouchableOpacity
			            activeOpacity={ 1 }
			            onPress={ () => {
				            this.setState({
					            show_ven_yun_type_modal:true
				            });
			            } }s
			            style={styles.inputWrap}>
			            <Text style={styles.input}>
				            {this.state.venCatName ? this.state.venCatName : (I18n.t('CompanyEdit.text')+title)}
			            </Text>
		            </TouchableOpacity>
		            { this.state.show_ven_yun_type_modal &&
		            <View style={ ComStyle.sel_invoice_modal_bg }>
			            <View style={ ComStyle.sel_invoice_modal_con_view }>
				            <ScrollView>
					            { publish_video.length > 0 && publish_video.map((item, index) =>{
						            return <Fragment>
							            <TouchableOpacity
								            key={ index }
								            activeOpacity={ 1 } onPress={ () =>{
								            this.seleVenModalSingle(item,'video')
								            this.setState({
									            show_ven_yun_type_modal: false,
								            });
							            } }
								            style={ComStyle.sel_inv_detail_item}>
								            <Text style={ComStyle.sel_inv_detail_item_text}>{item.name} </Text>
							            </TouchableOpacity>
							            <View style={ComStyle.sel_inv_detail_item_line}/>
						            </Fragment>
					            }) }
					            <View style={ComStyle.sel_invoice_detail_empty}/>
				            </ScrollView>
			            </View>
		            </View>
		            }
	            </Fragment>}

                {type == 'table' && <ScrollView>

                    <View style={styles.cat}>
                        <View style={[styles.form_title, {borderBottomColor: 'transparent'}]}>
                            <Text style={styles.form_title_txt}>{I18n.t('CompanyEdit.Business_category_List')}</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <View style={[styles.td, styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyEdit.EPMI')}</Text>
                                </View>
                                <View style={[styles.td, styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyEdit.secondary_category')}</Text>
                                </View>
                                <View style={[styles.td, styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyEdit.Level_categories')}</Text>
                                </View>
                                <View style={[styles.td, styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyEdit.operation')}</Text>
                                </View>
                            </View>


                            {this.state.chooseCat.length > 0 && this.state.chooseCat.map((el,index) => {return <View style={styles.tr}>
                                {el.map(item => <View style={[styles.td, styles.td_q]}>
                                    <Text style={styles.td_q_txt}>{item.name}</Text>
                                </View>)}
                                <TouchableOpacity
                                    style={[styles.td, styles.td_q]}
                                    onPress={()=>{
                                        let {chooseCat} = this.state;
                                        chooseCat.splice(index,1)
                                        this.setState({
                                            chooseCat: chooseCat
                                        })
                                    }}
                                >
                                    <Text style={styles.td_q_txt}>{I18n.t('CompanyEdit.delete')}</Text>
                                </TouchableOpacity>
                            </View>})}
                        </View>

                        <TouchableOpacity
                            style={styles.cat_name}
                            onPress={() => this.showCategoryList()}
                        >
                            <Text style={{color: '#999', fontSize: pxToDp(28)}}>{I18n.t('CompanyEdit.Business_category')}</Text>
                        </TouchableOpacity>



                    </View>
                </ScrollView>}


            </View>
        )
    }
}
