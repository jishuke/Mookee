/*
* 入驻申请
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    DeviceEventEmitter
} from 'react-native';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import styles from './stylejs/companyReg'
import StorageUtil from '../util/StorageUtil';
import {I18n} from './../lang/index'

export default class CompanyStep4 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('CompanyStep4.title'),
            seller_name: '',//商家帐号
            store_name: '',//店铺名称
            sg_id: '',//店铺等级id
            sg_name: '',//店铺等级名称
            joinin_year: '',//开店时长
            sc_id: '',//店铺分类id
            sc_name: '',//店铺分类名称
          store_class_ids:'',//经营类目id
          store_class_names:'',//经营类目名称
          chooseCat:[],//选中的经营类目
	        apply_t : props.navigation.state.params!=undefined&&props.navigation.state.params.apply_t!=undefined?props.navigation.state.params.apply_t:0 ,
	        reapply : props.navigation.state.params!=undefined&&typeof ( props.navigation.state.params.reapply ) != 'undefined' ? props.navigation.state.params.reapply : 0 ,
	        is_supplier : props.navigation.state.params!=undefined&&typeof ( props.navigation.state.params.is_supplier ) != 'undefined' ? props.navigation.state.params.is_supplier : 0 ,
        }
    }

    componentDidMount() {
	    const {reapply} = this.state
	    //取缓存数据
	    StorageUtil.get('company_reg4', (error, object) => {
		    if (!error && object) {
			    this.setState({
				    ...JSON.parse(object),reapply:reapply
			    });
		    }
	    });
        // 编辑详情监听
        this.lister = DeviceEventEmitter.addListener('companyedit', (e) => {
            switch (e.key) {
                case 'company_address':
                    this.setState({
                        company_address: e.area_info.join(' '),
                        area_id: e.area_id
                    })
                    break;
                case 'business_licence_address':
                    this.setState({
                        business_licence_address: e.area_info.join(' '),
                        business_licence_address_ids: e.area_id
                    })
                    break;
	            case 'sg_name':
		            this.setState({
			            sg_name: e.name,
			            sg_id: e.val
		            })
		            break;
		          case 'sc_name':
		            this.setState({
			            sc_id: e.val,
			            sc_name: e.name,
		            })
		            break;
		            case 'joinin_year':
		            this.setState({
			            joinin_year: e.name,
		            })
		            break;
	            case 'cat':
		              let {store_class_ids,store_class_names} = this.state;
		              let store_class_ids_array = [];
		              let store_class_names_array = [];
		              let i = 0
		              for( i in e.val){
		                let tmp_id = [];
		                let tmp_name = [];
				            for(let j in e.val[i]){
					            tmp_id.push(e.val[i][j].id);
					            tmp_name.push(e.val[i][j].name);
				            }
			              tmp_id = tmp_id.join('|')
			              tmp_name = tmp_name.join(',');
			              store_class_ids_array.push(tmp_id);
			              store_class_names_array.push(tmp_name);
			            }
			            store_class_ids = store_class_ids_array.join(',')
			            store_class_names = store_class_names_array.join('|')
                        console.info('store_class_ids:'+store_class_ids+'   store_class_names:'+store_class_names)
			            this.setState({
				            chooseCat: e.val,
				            store_class_ids:store_class_ids,
				            store_class_names:store_class_names
			            })

		            break;
                default:
                    this.setState({
                        [e.key]: e.val
                    })
            }
        })
    }

    componentWillUnmount() {
        this.lister.remove();
    }

    //提交事件
	submit = () => {
		let {
			title,
				seller_name,
			store_name,
			sg_id,
			sg_name,
			joinin_year,
			sc_id,
			sc_name,
			store_class_ids,
			store_class_names,
			chooseCat,
			is_supplier,
			reapply,
			apply_t,
		} = this.state;

		if ( seller_name == '' ) {
			ViewUtils.sldToastTip ( I18n.t('CompanyStep4.text1'));
			return false;
		}
		if ( store_name == '' ) {
			ViewUtils.sldToastTip ( I18n.t('CompanyStep4.text2') );
			return false;
		}
		if ( sg_id == '' ) {
			ViewUtils.sldToastTip ( I18n.t('CompanyStep4.text3'));
			return false;
		}
		if ( sc_id == '' ) {
			ViewUtils.sldToastTip (I18n.t('CompanyStep4.text4') );
			return false;
		}
		if ( store_class_ids == '' ) {
			ViewUtils.sldToastTip ( I18n.t('CompanyStep4.text5') );
			return false;
		}

		let data = {
			seller_name: seller_name,//商家帐号
			store_name: store_name,//店铺名称
			sg_id: sg_id,//店铺等级id
			sg_name: sg_name,//店铺等级名称
			joinin_year: joinin_year,//开店时长
			sc_id: sc_id,//店铺分类id
			sc_name: sc_name,//店铺分类名称
			store_class_ids:store_class_ids,//经营类目id
			store_class_names:store_class_names,//经营类目名称
		}

		//提交数据
		RequestData.postSldData ( AppSldUrl + '/index.php?app=enterin&mod=step3&key=' + key + '&apply_t=' + apply_t + '&is_supplier=' + is_supplier + '&reapply=' + reapply, data ).then ( res => {
			if(res.datas.state == 200){
				//将数据存缓存
				let storage_data = data;
				storage_data.chooseCat = chooseCat;
				StorageUtil.set('company_reg4', JSON.stringify(storage_data), ()=>{
				});
				//跳转到状态审核页面
				if(reapply == 1){
					//通知更新页面
					DeviceEventEmitter.emit('updateState', {tip_message: I18n.t('CompanyStep4.text6'),state:res.datas.state});
				}
				this.props.navigation.navigate('CompanyStep5',{state:res.datas.state,tip_message:I18n.t('CompanyStep4.text6'),
					reapply:reapply,
					is_supplier:is_supplier,
					apply_t:apply_t,})
			} else {
				ViewUtils.sldToastTip ( res.datas.msg );
			}

		} ).catch ( err => {
		} )

  }


    render() {
        const {title} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	           {/*{ViewUtils.setSldAndroidStatusBar(true,'#fff','default',true,true)}*/}
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>
                <View style={GlobalStyles.line}/>

                <ScrollView>
                    <View style={styles.form}>
                        <View style={{paddingLeft: pxToDp(30)}}>
                            <TouchableOpacity
                                style={styles.form_item}
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.navigation.navigate('CompanyEdit', {
                                        title: I18n.t('CompanyStep4.Merchant_account'),
                                        type: 'text',
                                        key: 'seller_name',
	                                    oldData:this.state.seller_name,
                                    })
                                }}
                            >
                                <Text style={styles.label}>*{I18n.t('CompanyStep4.Merchant_account')}</Text>
                                <View style={styles.con}>
                                    <Text style={styles.con_txt}>{this.state.seller_name}</Text>
                                    <Image
                                        style={styles.more}
                                        source={require('../assets/images/sld_jiantou.png')}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.form_item}
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.navigation.navigate('CompanyEdit', {
                                        title: I18n.t('CompanyStep2.name_of_shop'),
                                        type: 'text',
                                        key: 'store_name',
	                                    oldData:this.state.store_name,
                                    })
                                }}
                            >
                                <Text style={styles.label}>*{I18n.t('CompanyStep2.name_of_shop')}</Text>
                                <View style={styles.con}>
                                    <Text style={styles.con_txt}>{this.state.store_name}</Text>
                                    <Image
                                        style={styles.more}
                                        source={require('../assets/images/sld_jiantou.png')}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.form_item}
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.navigation.navigate('CompanyEdit', {
                                        title: I18n.t('SelTypeIsSupply.Gold'),
                                        type: 'modal_single_select',
                                        key: 'sg_name'
                                    })
                                }}
                            >
                                <Text style={styles.label}>*{I18n.t('CompanyStep4.Gold')}</Text>
                                <View style={styles.con}>
                                    <Text style={styles.con_txt}>{this.state.sg_name}</Text>
                                    <Image
                                        style={styles.more}
                                        source={require('../assets/images/sld_jiantou.png')}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.form_item}
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.navigation.navigate('CompanyEdit', {
                                        title: I18n.t('SelTypeIsSupply.Opening_hours'),
                                        type: 'modal_single_select',
                                        key: 'joinin_year'
                                    })
                                }}
                            >
                                <Text style={styles.label}>{I18n.t('CompanyStep4.Opening_hours')}</Text>
                                <View style={styles.con}>
                                    <Text style={styles.con_txt}>{this.state.joinin_year}</Text>
                                    <Image
                                        style={styles.more}
                                        source={require('../assets/images/sld_jiantou.png')}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.form_item}
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.navigation.navigate('CompanyEdit', {
                                        title: I18n.t('CompanyStep4.Store_Category'),
                                        type: 'modal_single_select',
                                        key: 'sc_name'
                                    })
                                }}
                            >
                                <Text style={styles.label}>*{I18n.t('CompanyStep4.Store_Category')}</Text>
                                <View style={styles.con}>
                                    <Text style={styles.con_txt}>{this.state.sc_name}</Text>
                                    <Image
                                        style={styles.more}
                                        source={require('../assets/images/sld_jiantou.png')}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.form_item}
                                activeOpacity={1}
                                onPress={() => {
                                    this.props.navigation.navigate('CompanyEdit', {
                                        title: I18n.t('CompanyStep4.Business_category'),
                                        type: 'table',
                                        key: 'cat'
                                    })
                                }}
                            >
                                <Text style={styles.label}>*{I18n.t('CompanyStep4.Business_category')}</Text>
                                <View style={styles.con}>
                                    <Text style={styles.con_txt}></Text>
                                    <Image
                                        style={styles.more}
                                        source={require('../assets/images/sld_jiantou.png')}
                                        resizeMode={'contain'}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
	                {this.state.chooseCat.length > 0 &&
	                <View style={styles.table}>
		                <View style={styles.tr}>
			                <View style={[styles.td, styles.td_s]}>
				                <Text style={styles.td_s_txt}>{I18n.t('CompanyStep4.EPMI')}</Text>
			                </View>
			                <View style={[styles.td, styles.td_s]}>
				                <Text style={styles.td_s_txt}>{I18n.t('CompanyStep4.secondary_category')}</Text>
			                </View>
			                <View style={[styles.td, styles.td_s]}>
				                <Text style={styles.td_s_txt}>{I18n.t('CompanyStep4.Level_categories')}</Text>
			                </View>
		                </View>

                    {this.state.chooseCat.map((el,index) => {return <View style={styles.tr}>
			                {el.map(item => <View style={[styles.td, styles.td_q]}>
				                <Text style={styles.td_q_txt}>{item.name}</Text>
			                </View>)}
		                </View>})}
	                </View>}
                    <View style={{height: pxToDp(180)}}></View>


                </ScrollView>
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={1}
                    onPress={() => {
                        this.submit();
                    }}
                >
                    <Text style={{color: '#fff', fontSize: pxToDp(30)}}>{I18n.t('CompanyStep4.submit_applications')}</Text>
                </TouchableOpacity>

            </View>
        )
    }
}
