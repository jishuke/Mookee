/*
* 历史账号页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,TouchableOpacity,
} from 'react-native';
import CountEmitter from "../util/CountEmitter";
import StorageUtil from "../util/StorageUtil";
import pxToDp from '../util/pxToDp';
import SldHeader from '../component/SldHeader';
import SldFlatList from '../component/SldFlatList';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import ViewUtils from '../util/ViewUtils';
// 导入Dimensions库
var Dimensions = require('Dimensions');
const {width,height} = Dimensions.get('window');
const pageSize = 10;
import {I18n} from './../lang/index'
import Utils from "../util/Utils";
export default class TiXianHistoryAccount extends Component {

    constructor(props){
        super(props);
        this.state={
	        title:I18n.t('TiXianHistoryAccount.title'),
	        refresh:false,
	        data:[],//历史账号列表
	        pn:1,//当前页面
	        hasmore:true,//是否还有数据
	        show_gotop:false,
	        is_request:false,
	        flag:0
        }
    }
    componentWillMount() {
	    if(key){
		    this.getTXHistoryList();//获取历史账号数据
	    }else{
		    ViewUtils.navDetailPage(this.props.navigation,'Login');
	    }
    }

	getTXHistoryList = (type=0) => {
		let {pn,data,hasmore,refresh} = this.state;
		if(type==1){
			pn = 1;
		}
		RequestData.getSldData(AppSldUrl + "/index.php?app=cash&mod=getCashAccountList&key="+key+'&currentPage='+pn+"&pageSize="+ pageSize)
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


	分割线组件
	separatorComponent = () => {
		return (
			<View style={GlobalStyles.line} />
		);
	}

	selTXAccount = (item) => {
		let seltxaccount = {};
		seltxaccount.tixian_method = (item.account_type==2?item.account_bank_name:item.account_type_name);
		seltxaccount.tixian_acount = item.account_user;
		seltxaccount.tixian_id = item.id;
		StorageUtil.set('seltxaccount', seltxaccount, ()=>{
			//更新选中的历史账号
			CountEmitter.emit('updateSelAccount');
			this.props.navigation.pop(1);
		});
	}

	renderCell = (item) => {
		return (

				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						this.selTXAccount(item);
					}}
					style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',width:width,height:pxToDp(120),backgroundColor:"#fff",paddingLeft:pxToDp(30)}}>
						{ item.account_type==1&&ViewUtils.getSldImg ( 40 , 40 , require ( '../assets/images/alipay.png' ) ) }
						{ item.account_type==2&&ViewUtils.getSldImg ( 40 , 40 , require ( '../assets/images/yinlian.png' ) ) }
						{ item.account_type==3&&ViewUtils.getSldImg ( 40 , 40 , require ( '../assets/images/wechat.png' ) ) }
						<View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start'}}>
					{ViewUtils.sldText(item.account_type==2?item.account_bank_name:item.account_type_name,'#605F60',28,'300',30,0,0)}
					{ViewUtils.sldText(Utils.formatAccount(item.account_user),'#605F60',28,'300',30,10,0)}
						</View>

				</TouchableOpacity>
		);
	}
	//下拉重新加载
	refresh = () => {
		this.getTXHistoryList(1);//获取充值列表数据
	}

	分页
	getNewData = () => {
		const {hasmore} = this.state;
		if (hasmore) {
			this.getTXHistoryList();//获取充值列表数据
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
	    const {title,data,refresh,show_gotop} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>
	            <SldFlatList
		            data={data}
		            refresh_state={refresh}
		            show_gotop={show_gotop}
		            refresh={() =>this.refresh()}
		            keyExtractor={() =>this.keyExtractor()}
		            handleScroll={(event) =>this.handleScroll(event)}
		            getNewData={() =>this.getNewData()}
		            separatorComponent={() =>this.separatorComponent()}
		            renderCell={(item) =>this.renderCell(item)}
	            />
            </View>
        )
    }
}
