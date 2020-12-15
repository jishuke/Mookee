/*
* 提现列表页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
	ImageBackground,
	TouchableOpacity,
	Text
} from 'react-native';
import pxToDp from '../util/pxToDp';
import SldHeader from '../component/SldHeader';
import SldFlatList from '../component/SldFlatList';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import ViewUtils from '../util/ViewUtils';
import CountEmitter from '../util/CountEmitter';

// 导入Dimensions库
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');
const pageSize = 10;
import {I18n} from './../lang/index'
export default class TiXianList extends Component {

    constructor(props){
        super(props);
        this.state={
	        title:I18n.t('TiXianList.title'),
	        ava_predeposite:'',//用户可用余额
	        refresh:false,
	        data:[],//充值列表
	        pn:1,//当前页面
	        hasmore:true,//是否还有数据
	        show_gotop:false,
	        is_request:false,
	        flag:0
        }
    }
    componentWillMount() {
	    if(key){
		    this.getHeaderCon();//获取头部组件事件
		    this.getTiXianList();//获取列表数据
	    }else{
		    ViewUtils.navDetailPage(this.props.navigation,'Login');
	    }
	    //监听更新历史缓存
	    CountEmitter.addListener('updateTiXianList', () => {
		    this.getHeaderCon();//获取头部组件事件
		    this.getTiXianList(1);//获取列表数据
	    });
    }
	componentWillUnmount() {
		//卸载监听
		CountEmitter.removeListener('updateTiXianList', ()=>{});
	}

	//获取用户余额
	getHeaderCon = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=usercenter&mod=getMyAvailable&key='+key)
			.then(result => {
				this.setState({
					ava_predeposite:result.datas.predepoit
				});
			})
			.catch(error => {
				ViewUtils.sldErrorToastTip(error);
			})
	}

	getTiXianList = (type=0) => {
		let {pn,data,hasmore,refresh} = this.state;
		if(type==1){
			pn = 1;
		}
		RequestData.getSldData(AppSldUrl + "/index.php?app=cash&mod=getCashApplyLogList&key="+key+'&currentPage='+pn+"&pageSize="+ pageSize)
			.then(result => {
				if(result.state!=200){
					this.setState({
						refresh:false,
						flag:1,
					});
				}else{
					if(refresh){
						refresh = false;
					}
					if(pn == 1){
						data = result.data.list;
					}else{
						data = data.concat(result.data.list);
					}
					if(pn*pageSize < result.data.pagination.total){
						pn = pn+1;
						hasmore = true;
					}else{
						hasmore = false;
					}
					this.setState({
						pn:pn,
						data:data,
						hasmore:hasmore,
						refresh:refresh,
						flag:1,
					});
				}

			})
			.catch(error => {
				this.setState({
					refresh:false,
					flag:1,
				});
				ViewUtils.sldErrorToastTip(error);
			})
	}


	separatorComponent = () => {
		return (
			<View style={GlobalStyles.space_shi_separate} />
		);
	}

	//查看提现记录详情
	goTiXianDetail = (pdc_id) => {
    	this.props.navigation.navigate('TiXianDetail',{id:pdc_id});
	}

	renderCell = (item) => {
		return (
			<View style={{width:width,flexDirection:'column',alignItems:'center'}}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						this.goTiXianDetail(item.pdc_id);
					}}
					style={{width:pxToDp(710),backgroundColor:'#fff',borderRadius:pxToDp(8),padding:pxToDp(16),flexDirection:"row",justifyContent:'space-between',alignItems:'center',paddingRight:pxToDp(30)}}>
					<View style={{flexDirection:'column',alignItems:'flex-start'}}>
					{ViewUtils.sldText(I18n.t('TiXianList.pdc_sn')+'：'+item.pdc_sn,'#605F60',28,'300',0,15,0)}
					{ViewUtils.sldText(I18n.t('TiXianList.pdc_add_time_str')+'：'+item.pdc_add_time_str,'#605F60',28,'300',0,15,0)}
					{ViewUtils.sldText(I18n.t('TiXianList.pdc_amount')+'：'+item.pdc_amount*1+'('+I18n.t('TiXianList.pdc_payment_fee')+'：'+item.pdc_payment_fee+')','#605F60',28,'300',0,15,0)}
					{ViewUtils.sldTextColor(I18n.t('TiXianList.pdc_payment_state_desc')+'：',item.pdc_payment_state_desc,'#605F60',item.pdc_payment_state==0?'#F1951C':(item.pdc_payment_state==1?'#4B920C':'#F82E5A'),28,'300',0,15,0,15)}
					</View>
					{ ViewUtils.getSldImg ( 40 , 40 , require ( '../assets/images/sld_tx_r_arrow.png' ) ) }
				</TouchableOpacity>
			</View>
		);
	}
	//下拉重新加载
	refresh = () => {
		this.getHeaderCon();//获取头部组件事件
		this.getTiXianList(1);//获取充值列表数据
	}

	getNewData = () => {
		const {hasmore} = this.state;
		if (hasmore) {
			this.getTiXianList();//获取充值列表数据
		}
	}

	handleScroll = (event) => {
		let offset_y = event.nativeEvent.contentOffset.y;
		let {show_gotop} = this.state;
		if(!show_gotop&&offset_y > 100){
			show_gotop = true
		}
		if(show_gotop&&offset_y < 100){
			show_gotop = false
		}
		this.setState({
			show_gotop:show_gotop,
		});

	}

	keyExtractor = (item,index) => {
		return index
	}

    render() {
	    const {title,data,refresh,show_gotop,flag} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader
					title={title}
					left_icon={require('../assets/images/goback.png')}
					left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}
				/>
                <View style={GlobalStyles.line}/>
	            <ImageBackground
					style={{width:width,height:pxToDp(140),flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:pxToDp(20)}}
					source={require("../assets/images/sld_cz_list_bg.png")}
					resizeMode="stretch"
				>
                    {/*提现*/}
                    <View style={{width:'100%',paddingLeft:15,paddingRight:15,flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 21,
                                marginLeft: 8,
								paddingHorizontal: 6,
                                height: 28,
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                borderRadius: 5.0
                            }}
                            activeOpacity={1.0}
                            onPress={() => {
                                this.props.navigation.navigate('ApplyTiXian')
                            }}
                        >
                            <Text style={{fontsize: 14, color: '#c7900d', textAlign: 'center'}}>{I18n.t('TiXianList.deposit')}</Text>
                        </TouchableOpacity>
                        <View style={{alignItems:'flex-end'}}>
                            {ViewUtils.sldText(I18n.t('TiXianList.balanceofmy'),'#fff',27)}
                            {ViewUtils.sldText(this.state.ava_predeposite,'#fff',42,'500',0,13)}
                        </View>
                    </View>
				</ImageBackground>
                <SldFlatList
                    data={data}
                    refresh_state={refresh}
                    show_gotop={show_gotop}
                    refresh={() => this.refresh()}
                    keyExtractor={() => this.keyExtractor()}
                    handleScroll={(event) => this.handleScroll(event)}
                    getNewData={() => this.getNewData()}
                    separatorComponent={() => this.separatorComponent()}
                    renderCell={(item) => this.renderCell(item)}
                />
	            {
	            	flag == 1 && data.length == 0 && ViewUtils.SldEmptyTip(require('../assets/images/emptysldcollect.png'),I18n.t('TiXianList.text1'))
	            }
            </View>
        )
    }
}
