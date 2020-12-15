/*
* 入驻申请
* @slodon
* */
import React , { Component , Fragment } from 'react';
import {
	View ,
	Image ,
	Text ,
	TouchableOpacity ,
	ScrollView , DeviceEventEmitter
} from 'react-native';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import styles from './stylejs/companyReg'
import {I18n} from './../lang/index'

export default class CompanyStep5 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: I18n.t('CompanyStep2.title'),
            state:(typeof(props.navigation.state.params)!= 'undefined' &&typeof (props.navigation.state.params.state)!='undefined')?props.navigation.state.params.state:'',
	          reapply : typeof ( props.navigation.state.params.reapply ) != 'undefined' ? props.navigation.state.params.reapply : 0 ,
	        is_supplier : typeof ( props.navigation.state.params.is_supplier ) != 'undefined' ? props.navigation.state.params.is_supplier : 0 ,
	        apply_t : typeof ( props.navigation.state.params.apply_t ) != 'undefined' ? props.navigation.state.params.apply_t : 1 ,
            tip_message:(typeof(props.navigation.state.params)!= 'undefined' &&typeof (props.navigation.state.params.tip_message)!='undefined')?props.navigation.state.params.tip_message:'入驻申请已经提交，请等待管理员审核',//页面提示内容
	        join_detail:{},//审核页面信息
        }
    }

    componentDidMount() {
        let {state,tip_message} = this.state;
        if(state == 301||state == 305){
            this.getInitData();
        }
	    this.lister = DeviceEventEmitter.addListener ( 'updateState' , ( e ) => {
		    this.setState ( e )
	    } )
    }

	componentWillUnmount () {
		this.lister.remove ();
	}



	//获取页面初始数据
	getInitData = () => {
        let {reapply} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=enterin&mod=getApplyInfo&key=' + key+'&reapply='+reapply).then(res => {
			if(res.code == 200){
				console.info(666);
				console.info(res);
			    if(res.datas.data){
			        this.setState({
                join_detail:res.datas.data
              })
          }
      }
		})
	}
    render() {
        const {title,state,tip_message,join_detail,reapply,is_supplier,apply_t} = this.state;
        console.log('join_detail---', join_detail);
        return (
            <View style={GlobalStyles.sld_container}>
	            {/*{ViewUtils.setSldAndroidStatusBar(true,'#fff','default',true,true)}*/}
                <SldHeader title={title} left_icon={require('../assets/images/goback.png')}
                           left_event={() => this.props.navigation.navigate('MyScreen')}/>
                <View style={GlobalStyles.line}/>

                <ScrollView
                    style={{backgroundColor: '#fff'}}
                >
                    <View style={[styles.status,{
                        backgroundColor: (state=='302'||state=='303')?'#E76767':'#FFF0C9'
                    }]}>
                        <Image
                            style={{width: pxToDp(53),height: pxToDp(53)}}
                            source={(state=='302'||state=='303')?require('../assets/images/sld_icon55_fail.png'):require('../assets/images/sld_icon55.png')}
                            resizeMode={'contain'}
                        />
                        <Text style={[styles.status_txt,{color: (state=='302'||state=='303')?'#fff':'#887D5A'}]}>{ViewUtils.sld_unescape(tip_message)}</Text>
                    </View>
                  {(state == 301||state == 305)&&typeof (join_detail.joinin_year)!='undefined'&&
                    <Fragment>
                    <View style={styles.cat}>
                        <View style={[styles.form_title,{borderBottomColor: 'transparent'}]}>
                            <Text style={styles.form_title_txt}>{I18n.t('CompanyStep5.Paid_list')}</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.rates')}</Text>
                                </View>
                                <View style={[styles.td,styles.td_q]}>
                                    <Text style={styles.td_q_txt}>{join_detail.sg_info.sg_price ? join_detail.sg_info.sg_price : ''}</Text>
                                </View>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.Opening_hours')}</Text>
                                </View>
                                <View style={[styles.td,styles.td_q]}>
                                    <Text style={styles.td_q_txt}>{join_detail.joinin_year ? join_detail.joinin_year : ''} 年</Text>
                                </View>
                            </View>
                            <View style={styles.tr}>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.Store_Category')}</Text>
                                </View>
                                <View style={[styles.td,styles.td_q]}>
                                    <Text style={styles.td_q_txt}>{join_detail.sc_name ? join_detail.sc_name : ''}</Text>
                                </View>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.amount_payable')}</Text>
                                </View>
                                <View style={[styles.td,styles.td_q]}>
                                    <Text style={styles.td_q_txt}>{join_detail.paying_amount ? ViewUtils.formatFloat(join_detail.paying_amount,2) : ''}元</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cat}>
                        <View style={[styles.form_title,{borderBottomColor: 'transparent'}]}>
                            <Text style={styles.form_title_txt}>{I18n.t('CompanyStep5.Business_category')}</Text>
                        </View>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.EPMI')}</Text>
                                </View>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.secondary_category')}</Text>
                                </View>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.Level_categories')}</Text>
                                </View>
                                <View style={[styles.td,styles.td_s]}>
                                    <Text style={styles.td_s_txt}>{I18n.t('CompanyStep5.commission_rate')}</Text>
                                </View>
                            </View>
                          {typeof(join_detail.store_class_names)!='undefined'&&join_detail.store_class_names.map((item,index)=>{
	                         return <View key={index} style={styles.tr}>
		                          <View style={[styles.td,styles.td_q]}>
			                          <Text style={styles.td_q_txt}>{item.split(',')[0]?item.split(',')[0]:''}</Text>
		                          </View>
		                          <View style={[styles.td,styles.td_q]}>
			                          <Text style={styles.td_q_txt}>{item.split(',')[1]?item.split(',')[1]:''}</Text>
		                          </View>
		                          <View style={[styles.td,styles.td_q]}>
			                          <Text style={styles.td_q_txt}>{item.split(',')[2]?item.split(',')[2]:''}</Text>
		                          </View>
		                          <View style={[styles.td,styles.td_q]}>
                                            <Text
                                                style={styles.td_q_txt}>{(join_detail.store_class_commis_rates[index] ==''||typeof (join_detail.store_class_commis_rates[index]) =='undefined') ?'待定':join_detail.store_class_commis_rates[index]+'%'}</Text>
		                          </View>
	                          </View>
                          })}

                        </View>
                    </View></Fragment>}

                </ScrollView>

              {state == 305&&<TouchableOpacity
	              style={styles.status_btn}
	              activeOpacity={1}
	              onPress={() => {
		              this.props.navigation.navigate('CompanyStep6',{time:1,reapply:reapply,is_supplier:is_supplier,apply_t:apply_t});
	              }}
              >
	              <Text style={{color: '#fff', fontSize: pxToDp(30)}}>{I18n.t('CompanyStep5.Upload_payment_voucher')}</Text>
              </TouchableOpacity>}
	            {state == 303&&<TouchableOpacity
		            style={styles.status_btn}
		            activeOpacity={1}
		            onPress={() => {
			            this.props.navigation.navigate('CompanyStep6',{time:2,reapply:reapply,is_supplier:is_supplier,apply_t:apply_t});
		            }}
	            >
		            <Text style={{color: '#fff', fontSize: pxToDp(30)}}>{I18n.t('CompanyStep5.Upload_payment_voucher')}</Text>
	            </TouchableOpacity>}
	            {state == 302&&<TouchableOpacity
		            style={styles.status_btn}
		            activeOpacity={1}
		            onPress={() => {
			            this.props.navigation.navigate('CompanyStep1',{reapply:1});
		            }}
	            >
		            <Text style={{color: '#fff', fontSize: pxToDp(30)}}>{I18n.t('CompanyStep5.reapply')}</Text>
	            </TouchableOpacity>}


            </View>
        )
    }
}
