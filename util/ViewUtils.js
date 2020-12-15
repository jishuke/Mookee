/*
* 封装的方法
* @by slodon
* */
'use strict'

import React, {Fragment} from 'react';
import {
	Image,
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions,
	TouchableWithoutFeedback, Linking, Platform, StatusBar, Alert
} from 'react-native';
import RequestData from "../RequestData";
import GlobalStyles from "../assets/styles/GlobalStyles";
import pxToDp from "./pxToDp";
import Toast from '@remobile/react-native-toast';
import CountEmitter from './CountEmitter';
import {I18n} from './../lang/index'

const scrWidth = Dimensions.get('window').width;
const scrHeight = Dimensions.get('window').height;
let keys = Object.keys || function(obj) {
	obj = Object(obj)
	var arr = []
	for (var a in obj) arr.push(a)
	return arr
}
let invert = function(obj) {
	obj = Object(obj)
	var result = {}
	for (var a in obj) result[obj[a]] = a
	return result
}
let entityMap = {
	escape: {
		'&': '&',
		'<': '<',
		'>': '>',
		'"': '"',
	}
}
entityMap.unescape = invert(entityMap.escape)
let entityReg = {
	escape: RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'),
	unescape: RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g')
}

export default class ViewUtils {
	/**
	 * 对计算结果格式化  能相对精确一点
	 */
	static formatFloat (f, digit) {
		const m = Math.pow(10, digit);
		return Math.round(f * m, 10) / m;
	}
	// 将HTML转义为实体
	static sld_escape(html) {
		if ( typeof html !== 'string' ) return ''
		return html.replace ( entityReg.escape , function ( match ) {
			return entityMap.escape[ match ]
		} )
	}

	static sld_unescape(str) {
		if ( typeof str !== 'string' ) return ''
		return str.replace ( entityReg.unescape , function ( match ) {
			return entityMap.unescape[ match ]
		} )
	}

	/*
	 * 获取积分商城的首页装修数据
	 * */
	static getPointDiyData(navigation){
		console.info(333);
		if(diy_data_info_points.length==0){
			RequestData.getSldData ( AppSldUrl + '/index.php?app=index&sld_addons=points')
				.then ( result => {
					if ( !result.datas.error ) {
						diy_data_info_points = result.datas.tmp_data;
						navigation.replace('PointsTab');
					}
				} )
				.catch ( error => {
				} )
		}else{
			navigation.replace('PointsTab');
		}
	}


	/*
	 * 获取联到家首页装修数据
	 * */
	static getLdjDiyData(navigation){
		if(diy_data_info_ldj.length==0){
			RequestData.getSldData ( AppSldUrl + '/index.php?app=index&mod=index_data&sld_addons=ldj')
				.then ( result => {
					if ( !result.datas.error ) {
						diy_data_info_ldj = result.datas.tmp_data;
						navigation.replace('SldLdjTab');
					}
				} )
				.catch ( error => {
				} )
		}else{
			navigation.replace('SldLdjTab');
		}
	}

	/*
	 * 领取优惠券
	 * */
	static getSldVoucher(navigation,type,value,title=''){
		if(key){
			//登录直接领取就可以了
			RequestData.getSldData ( AppSldUrl + '/index.php?app=red&mod=send_red&sld_addons=red&key='+key+'&red_id='+value)
				.then ( result => {
					if ( result.datas == 1 ) {
						this.sldToastTip ( '领取成功' );//领取成功
					}else{
						this.sldToastTip (result.datas);//领取失败
					}
				} )
				.catch ( error => {
				} )
		}else{
			//非登录状态的话提示登录
			Alert.alert(
				'',
				'您需要登录才可以领取？',
				[
					{text: '确定', onPress: (() => {navigation.navigate('Login')})},
					{text: '取消', onPress: (() => {}), style: 'cancle'}
				]
			);
		}
	}


	/**
	 * 返回两点之间的距离
	 */
	static getStoreDistance (origin,destination){
		let distance = 0;
		RequestData.getSldData("https://restapi.amap.com/v3/direction/walking?parameters&key="+sld_web_key+'&origin=' +origin + '&destination=' + destination)
			.then(result =>{
				if(result.status == 1){
					let dis = result.route.paths[0].distance;
					distance = (dis/1000).toFixed(2);
				}else{
					distance = 0;
				}
				return distance;
			})
			.catch(error =>{
				ViewUtils.sldErrorToastTip(error);
			})
	}


	/**
	 * 根据经纬度获取位置信息——高德
	 */
	static async sldGetLocationName (lon,lat){
		let location = {};
		await RequestData.getSldData("https://restapi.amap.com/v3/geocode/regeo?parameters&key="+sld_web_key+'&location=' +lon+','+lat)
			.then(result =>{
				if(result.status == 1){
					location.longitude = lon;
					location.latitude = lat;
					location.street = result.regeocode.addressComponent.streetNumber.street;//街道名称
					location.adCode = result.regeocode.addressComponent.adcode;
				}
				ldj_location = location;
			})
			.catch(error =>{
				ViewUtils.sldErrorToastTip(error);
			})
	}

	/**
	 * 只返回订单的时分秒
	 */
	static initOrderSendTime (start,end){
		if(start!=undefined&&end!=undefined){
			return start.split(' ')[1]+'-'+end.split(' ')[1]
		}else{
			return '';
		}
	}

	/**
	 * 返回订单详情item数据——一行字
	 */
	static ldj_Order_dtail_item(text,showSperator=true){
		return <Fragment>
			<View style={{width:'100%',height:pxToDp(105),backgroundColor:"#fff",paddingHorizontal:pxToDp(20),flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
				<Text style={{color:'#333',fontSize:pxToDp(fontSize_24),fontWeight:'300'}}>{text}</Text>
			</View>
			{showSperator&&<View style={GlobalStyles.left_10_line}/>}
		</Fragment>
	}
	/**
	 * 返回订单详情item数据——左侧一行字+左侧2行字
	 */
	static ldj_Order_dtail_item_ltext_ltext_2(ltext,showSperator=true,rtext1,rtext2){
		return <Fragment>
			<View style={{width:'100%',height:pxToDp(138),backgroundColor:"#fff",paddingHorizontal:pxToDp(20),flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',paddingTop:pxToDp(39)}}>
				<Text style={{color:'#333',fontSize:pxToDp(fontSize_24),fontWeight:'300'}}>{ltext}</Text>
				<View style={{flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start'}}>
					<Text style={{color:'#333',fontSize:pxToDp(fontSize_24),fontWeight:'300'}}>
						{rtext1}
					</Text>
					<Text style={{color:'#333',fontSize:pxToDp(fontSize_24),fontWeight:'300'}}>
						{rtext2}
					</Text>
				</View>
			</View>
			{showSperator&&<View style={GlobalStyles.left_10_line}/>}
		</Fragment>
	}
	/**
	 * 返回订单详情item数据——左侧字，右侧功能按钮
	 */
	static ldj_Order_dtail_item_ltext_tbtn(lefttext,showSperator=true,callBack,righttext){
		return <Fragment>
			<View style={{width:'100%',height:pxToDp(105),backgroundColor:"#fff",paddingHorizontal:pxToDp(20),flexDirection:'row',justifyContent:'space-between',alignItems:'center',}}>
				<Text style={{color:'#333',fontSize:pxToDp(fontSize_24),fontWeight:'300'}}>{lefttext}</Text>
				<TouchableOpacity
					activeOpacity={1}
					onPress={callBack}
					style={{borderWidth:0.7,borderColor:'#E3E3E3',borderRadius:pxToDp(4)}}
				>
					<Text style={{color:'#333',fontSize:pxToDp(fontSize_24),fontWeight:'300',paddingHorizontal:pxToDp(28),paddingVertical:pxToDp(10)}}>{righttext}</Text>
				</TouchableOpacity>
			</View>
			{showSperator&&<View style={GlobalStyles.left_10_line}/>}
		</Fragment>
	}
	/**
	 * 返回订单详情item数据——左侧字+左侧功能按钮
	 */
	static ldj_Order_dtail_item_ltext_lbtn(lefttext,showSperator=true,leftbtntext){
		return <Fragment>
			<View style={{width:'100%',height:pxToDp(105),backgroundColor:"#fff",paddingHorizontal:pxToDp(20),flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}}>
				<Text style={{color:'#333',fontSize:pxToDp(fontSize_24),fontWeight:'300'}}>{lefttext}</Text>
				<View
					style={{borderWidth:0.7,borderColor:'#03A9F3',borderRadius:pxToDp(4)}}
				>
					<Text style={{color:'#03A9F3',fontSize:pxToDp(fontSize_16),fontWeight:'300',paddingHorizontal:pxToDp(8),paddingVertical:pxToDp(4)}}>{leftbtntext}</Text>
				</View>
			</View>
			{showSperator&&<View style={GlobalStyles.left_10_line}/>}
		</Fragment>
	}
	/**
	 * 初始化定位
	 */
	static initLocationMust(){
		// Geolocation.init({
		// 	ios: sld_gd_ios_key,
		// 	android: sld_gd_android_key
		// })
		// this.sldLocationSetOption();
		// this.checkLocationPermission();
	}

	/**
	 * 定位设置
	 */
	// static sldLocationSetOption(){
	// 	Geolocation.setOptions({
	// 		interval: 10000,
	// 		distanceFilter: 1000,
	// 		reGeocode: true
	// 	})
	// }


	/**
	 * 验证定位权限
	 */
	//  static checkLocationPermission(){
	//  	if(Platform.OS == 'ios'){
	// 	    Geolocation.start()
	//     }else{
	// 	    const ischeck = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
	// 	    ischeck.then(res =>{
	// 		    const granted = PermissionsAndroid.request(
	// 			    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	// 			    {
	// 				    title: '申请定位',
	// 				    message:
	// 					    '获取您的当前位置信息需要您的定位权限',
	// 			    },
	// 		    );
	// 		    granted.then(res =>{
	// 			    if(res == 'never_ask_again'){
	// 				    this.sldToastTip('获取您的当前位置信息需要您的定位权限，请到设置里打开');
	// 			    }
	// 			    Geolocation.start()
	// 		    }).catch(err =>{
	// 			    this.sldToastTip('定位权限获取失败');
	// 		    })
	// 	    }).catch(err =>{
	// 	    })
	//     }
	// }


	/**
	 * 返回占位
	 * @param color 背景色
	 * @param height 占位高度
	 * @return bool
	 */
	static getEmptyPosition(color,height){
		return <View style={{backgroundColor:color,width:scrWidth,height:height}}/>
	}

	/**
	 * 判断数据是否是空对象
	 * @param data 传入的数据
	 * @return bool
	 */
	static isEmptyObject(data){
		if(Object.getOwnPropertyNames(data).length ===0){
			return true;//空对象
		}else{
			return false;//非空对象
		}
	}


    /**
     * 倒计时
     * @param enddate 传入的时间
     * @return bool
     */
    static getLeftTimerData(enddate){
        var timer_data = {};

        var leftTime = (new Date(enddate)) - new Date(); //计算剩余的毫秒数

        var hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算总小时
        var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

        hours = this.checkTime(hours);
        minutes = this.checkTime(minutes);
        seconds = this.checkTime(seconds);
        if (hours >= 0 || minutes >= 0 || seconds >= 0){
            timer_data.hours = hours;
            timer_data.minutes = minutes;
            timer_data.seconds = seconds;
        }

        return timer_data;
    }
    static checkTime(i) { //将0-9的数字前面加上0，例1变为01
        if (i < 10) {
            i = "0" + i*1;
        }
        if(i<=0){
	        i = "00";
        }
        return i;
    }

	/**
	 * 单独返回时分秒
	 * @param enddate 传入的时间，type 为返回的类型
	 * @return bool
	 */
	static getDetailTime(enddate,type){
		var timer_data = {};

		var leftTime = (new Date(enddate)) - new Date(); //计算剩余的毫秒数

		var hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算总小时
		var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
		var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

		hours = this.checkTime(hours);
		minutes = this.checkTime(minutes);
		seconds = this.checkTime(seconds);

		let reval = '00';
		if(type == 'hour'){
			reval = this.checkTime(hours)>99?99:this.checkTime(hours);
		}
		if(type == 'minutes'){
			reval = this.checkTime(minutes);
		}
		if(type == 'seconds'){
			reval = this.checkTime(seconds);
		}

		if(reval == 0){
			reval = '00';
		}
		return reval;
	}

    /**
     * 跳转检测
     * @param pagename 页面名称
     * @return bool
     */
    //暂未封装
    /**
     * 个人中心页面 图标和文字的组合，图标在上，文字在下
     * @param callBack 单击item的回调
     * @param lefttext 左侧文本
     * @param righttext 右侧文本
     * @param righticon 右侧图标
     * @param height 单行的高度
     * @return {XML}
     */
    static getSldCombineIconText(callBack, topicon, bottomtext) {
        return (
            <TouchableOpacity
	            activeOpacity={1}
                onPress={callBack}>
                <View style={[styles.sld_combine_icon_text]}>
                    <Image source={topicon}
                           style={styles.sld_combine_icon_text_icon}/>
                    <Text style={[styles.sld_combine_icon_text_text,GlobalStyles.sld_global_font]}>{bottomtext}</Text>
                </View>
            </TouchableOpacity>
        )
    }

	static getSldCombineIconTextNew(callBack, topicon, bottomtext) {
		return (
			<TouchableOpacity
				activeOpacity={1}
				style={{width:scrWidth/4}}
				onPress={callBack}>
				<View style={[styles.sld_combine_icon_text]}>
					<Image source={topicon}
					       style={styles.sld_combine_icon_text_icon}/>
					<Text style={[styles.sld_combine_icon_text_text,GlobalStyles.sld_global_font]}>{bottomtext}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	/**
	 * 商户入驻，选择入驻类型组件封装
	 * @param callBack 单击item的回调
	 * @param lefticon 左侧图标
	 * @param ctoptext 中间上部分文本
	 * @param cbottomtext 中间下部分文本
	 * @return {XML}
	 */
	static getSldApplyVenTypeItem(callBack, lefticon, ctoptext, cbottomtext) {
		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={callBack}
				style={{flexDirection:'row',alignItems:'flex-start',width:scrWidth,padding:pxToDp(30),backgroundColor:'#fff'}}>
				{ this.getSldImg ( 80 , 80 , lefticon ) }
				<View style={{flexDirection:'column',flex:1,paddingLeft:pxToDp(40),paddingRight:pxToDp(40),}}>
					<Text style={{color:'#181818',fontSize:pxToDp(30),fontWeight:'400'}}>{ctoptext}</Text>
					<Text style={{color:'#666',fontSize:pxToDp(24),fontWeight:'300',marginTop:pxToDp(24)}}>{cbottomtext}</Text>
				</View>
				<View style={{height:pxToDp(80),width:pxToDp(14),flexDirection:'column',justifyContent:'center'}}>
					{ this.getSldImg ( 14 , 23 , require ( '../assets/images/sld_apply_ven_rarrow.png' ) ) }
				</View>
			</TouchableOpacity>
		)
	}

    /**
	 * 个人中心页面 图标和文字的组合，图标在上，文字在下
	 * @param callBack 单击item的回调
	 * @param lefttext 左侧文本
	 * @param righttext 右侧文本
	 * @param righticon 右侧图标
	 * @param height 单行的高度
	 * @return {XML}
	 */
    static getSldCombineIconTextNew(callBack, topicon, bottomtext,num = 0) {
        return (
            <TouchableWithoutFeedback
                onPress={callBack}>
                <View style={[styles.sld_combine_icon_text,{padding:pxToDp(5)}]}>
                    <Image source={topicon}
                           style={[styles.sld_combine_icon_text_icon,{marginTop:pxToDp(4)}]}/>
                    <Text style={[styles.sld_combine_icon_text_text,GlobalStyles.sld_global_font]}>{bottomtext}</Text>
                    {num>0&&(
                        <View style={[styles.sld_order_count_view,{borderColor:main_color}]}>
                            <Text style={styles.sld_order_count_text}>{num>99?'99+':num}</Text>
                        </View>
                    )}

                </View>
            </TouchableWithoutFeedback>
        )
    }
    /**
     * 商品详情页分享
     * @param callBack 单击item的回调
     * @param lefttext 左侧文本
     * @param righttext 右侧文本
     * @param righticon 右侧图标
     * @param height 单行的高度
     * @return {XML}
     */
    static getSldCombineIconShare(callBack, topicon, bottomtext) {
        return (
            <TouchableWithoutFeedback
                onPress={callBack}>
                <View style={[styles.sld_combine_icon_text]}>
                    <Image source={topicon}
                           style={styles.sld_combine_icon_text_icon_share}/>
                    <Text style={[styles.sld_combine_icon_text_text_share,GlobalStyles.sld_global_font]}>{bottomtext}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    /**
     * 个人中心金额部分布局
     * @return {XML}
     */
    static getSldSingleMoney(callBack, toptext, bottomtext,color) {
        return (
            <TouchableWithoutFeedback
                onPress={callBack}>
                <View style={[styles.sld_combine_icon_text]}>
                    <View style={{flexDirection:'row',justifyContent:'center',alignItems:'baseline'}}>
                        <Text style={[GlobalStyles.sld_global_font,{color:color,fontSize:pxToDp(36)}]}>{toptext}</Text>
                        <Text style={[GlobalStyles.sld_global_font,{color:color,fontSize:pxToDp(20),paddingBottom:pxToDp(8)}]}>元</Text>
                    </View>
                    <Text style={[styles.sld_combine_icon_text_text_share,GlobalStyles.sld_global_font,{fontSize:pxToDp(26),color:'#353535'}]}>{bottomtext}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
	/**
	 * 个人中心页面 单行样式封装--专门用于商品详情页
	 * @param callBack 单击item的回调
	 * @param lefttext 左侧文本
	 * @param righttext 右侧文本
	 * @param righticon 右侧图标
	 * @param height 单行的高度
	 * @return {XML}
	 */
	static getSldSingleItemGoodsToVen(callBack,lefticon, lefttext, righttext, righticon, height) {
		return (
			<TouchableWithoutFeedback
				onPress={callBack}>
				<View style={[styles.sld_single_line,{height:height}]}>
					<View style={{flexDirection:"row",justifyContent:'flex-start',alignItems:'center'}}>
						<Image resizeMode={'contain'} source={lefticon}
						       style={styles.sld_single_left_icon}/>
					<Text style={[styles.sld_single_left,GlobalStyles.sld_global_font]}>{lefttext}</Text>
					</View>
					<View style={styles.sld_single_right}>
						<Text style={[styles.sld_single_right_text,GlobalStyles.sld_global_font]}>{righttext}</Text>
						<Image source={righticon}
						       style={styles.sld_single_right_icon}/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
    /**
     * 个人中心页面 单行样式封装
     * @param callBack 单击item的回调
     * @param lefttext 左侧文本
     * @param righttext 右侧文本
     * @param righticon 右侧图标
     * @param height 单行的高度
     * @return {XML}
     */
    static getSldSingleItem(callBack, lefttext, righttext, righticon, height) {
        return (
            <TouchableWithoutFeedback
                onPress={callBack}>
                <View style={[styles.sld_single_line,{height:height}]}>
                    <Text style={[styles.sld_single_left,GlobalStyles.sld_global_font]}>{lefttext}</Text>
                    <View style={styles.sld_single_right}>
                        <Text style={[styles.sld_single_right_text,GlobalStyles.sld_global_font]}>{righttext}</Text>
                        <Image source={righticon}
                               style={styles.sld_single_right_icon}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    /**
     * 个人中心页面 单行样式封装
     * @param callBack 单击item的回调
     * @param lefttextone 左侧文本一
     * @param lefttexttwo 左侧文本二
     * @param righticon 右侧图标
     * @param height 单行的高度
     * @return {XML}
     */
    static getSldSingleLeftItem(callBack, lefttextone, lefttexttwo, righticon, height) {
        return (
            <TouchableWithoutFeedback
                onPress={callBack}>
                <View style={[styles.sld_single_line,{height:height}]}>
                    <View style={styles.sld_single_left_view}>
                    <Text style={[styles.sld_single_left,GlobalStyles.sld_global_font]}>{lefttextone}</Text>
                    <Text style={[styles.sld_single_left_text,GlobalStyles.sld_global_font]}>{lefttexttwo}</Text>
                </View>
                    <View style={styles.sld_single_right}>
                        <Image source={righticon}
                               style={styles.sld_single_right_icon}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

	/**
	 * 封装的全局toast提示
	 */
	static sldToastTip(content) {
		Toast.showShortCenter(content.toString());
	}

	/**
	 * fetch请求错误
	 */
	static sldErrorToastTip(content) {
		// this.sldToastTip('网络错误，请稍后重试');
		console.info(content);//需要调试的时候将这个打开
		// this.sldToastTip(content);
	}


    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param icon 左侧图标
     * @param text 显示的文本
     * @param tintStyle 图标着色
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
        return (
            <TouchableWithoutFeedback
                onPress={callBack}>
                <View style={[styles.setting_item_container]}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        {icon ?
                            <Image source={icon} resizeMode='stretch'
                                   style={[{opacity: 1, width: 16, height: 16, marginRight: 10,}, tintStyle]}/> :
                            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>
                        }
                        <Text>{text}</Text>
                    </View>
                    <Image source={expandableIco ? expandableIco : require('../assets/images/arrow_right.png')}
                           style={[{

                           }, tintStyle]}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }


    static getLeftButton(callBack) {
        return <TouchableOpacity
            activeOpacity={1}
            style={{padding: 8}}
            onPress={callBack}>
            <Image
                style={{width: 26, height: 26,}}
                source={require('../assets/images/sld_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    }

    static getRightButton(title, callBack) {
        return <TouchableOpacity
            activeOpacity={1}
            style={{alignItems: 'center',}}
            onPress={callBack}>
            <View style={{marginRight: 10}}>
                <Text style={{fontSize: 20, color: '#FFFFFF',}}>{title}</Text>
            </View>
        </TouchableOpacity>
    }

    /**
     * 获取更多按钮
     * @param callBack
     * @returns {XML}
     */
    static getMoreButton(callBack) {
        return <TouchableWithoutFeedback
            underlayColor={'transparent'}
            ref="moreMenuButton"
            style={{padding: 5}}
            onPress={callBack}
        >
            <View style={{paddingRight: 8}}>
                <Image
                    style={{width: 24, height: 24,}}
                    source={require('../assets/images/sld_more_vert_white_48pt.png')}
                />
            </View>
        </TouchableWithoutFeedback>
    }

    /**
     * 获取分享按钮
     * @param callBack
     * @returns {XML}
     */
    static getShareButton(callBack) {
        return <TouchableWithoutFeedback
            underlayColor={'transparent'}
            onPress={callBack}
        >
            <Image
                style={{width: 20, height: 20,opacity:0.9,marginRight:10,tintColor:'white'}}
                source={require('../assets/images/sld_share.png')}/>
        </TouchableWithoutFeedback>
    }



	/**
	 * 打电话功能
	 * @param tel 传入的电话值
	 * @return 直接调起打电话的功能
	 */
	 static callTel(tel){
		    return Linking.openURL('tel:'+tel);
  }

	/**
	 * 进入商品详情页
	 * @param navigation,gid  navigation路由属性,商品gid
   * 结果：直接跳转到商品详情页
	 */
	static goGoodsDetail(navigation,gid){
		    navigation.navigate('GoodsDetailNew', {'gid': gid});
	}
	/**
	 * 进入店铺
	 * @param navigation,vid  navigation路由属性,vid 店铺id
	 * 结果：直接跳转到商品详情页
	 */
	static goComVendor(navigation,vid){
		navigation.navigate('Vendor',{'vid':vid});
	}
	/**
	 * 按分类id进入商品列表
	 * @param navigation,catid  navigation路由属性,catid 分类id
	 * 结果：直接跳转到商品详情页
	 */
	static goGoodsListCat(navigation,catid){
		navigation.navigate('GoodsSearchList',{'catid':catid});
	}

	/**
	 * 直接跳对应的页面
	 * @param navigation,tab  navigation路由属性,tab 页面名称
	 * 结果：直接跳转到商品详情页
	 */
	static goComTab(navigation,tab){
		navigation.navigate(tab);
	}

	/**
	 * 返回flatlist的空组件
	 * @param
	 * height flatlist的页面高度, image 空图标 ，content 数据为空的提示内容
	 * image 图片，默认为返回箭头
	 * 结果：<xml>
	 */
	static renSldFlatEmpty(height,image,content){
		return <View style={{width:scrWidth,justifyContent:'center',alignItems:'center',height:scrHeight-80}}>
			<Image style={{width: pxToDp(100), height: pxToDp(100)}}
			       source={require('../assets/images/emptysldcollect.png')}/>
			<Text
				style={[{color: '#999'}, {marginTop: pxToDp(20)}, {marginBottom: pxToDp(100)}, GlobalStyles.sld_global_font]}>{content}</Text>
		</View>;
	}

	/**
	 * 空页面
	 * @param
	 * image 空图标 ，content 数据为空的提示内容
	 * 结果：<xml>
	 */
	static SldEmptyTip(image,content){
		return <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
			<Image style={{width: pxToDp(100), height: pxToDp(100)}}
			       source={image}/>
			<Text
				style={[{color: '#999'}, {marginTop: pxToDp(20)}, {marginBottom: pxToDp(100)}, GlobalStyles.sld_global_font]}>{content}</Text>
		</View>;
	}

	/**
	 * 图片跳转具体的页面
	 * @param navigation,type,value,title   type页面类型：
	 * 结果：直接跳转到对应的页面
	 */
	static goDetailPage(navigation,type,value,title=''){
		if(type){
			switch ( type ) {
				case "keyword":
					navigation.navigate('GoodsSearchList', {'keyword': value});
					break;
				case "special":
					//如果当前页面是专题页，跳转没反应 改为替换
					if(currentSceneTop == 'Special'){
						navigation.replace('Special', {'topicid': value, 'title': title});
					}else{
						navigation.navigate('Special', {'topicid': value, 'title': title});
					}
					break;
				case "goods":
					this.goGoodsDetail(navigation,value);
					break;
				case "vendor":
					this.goComVendor(navigation,value);
					break;
				case "goodscat":
					navigation.navigate('GoodsSearchList', {'gid': value});
					break;
				case "vendorlist":
					navigation.navigate('VendorLists');
					break;
				case "shopstreet":
					navigation.navigate('VendorLists');
					break;
				case "goodslist":
					navigation.navigate('GoodsSearchList', {'keyword': value});
					break;
				case "voucherlist":
					this.goComTab(navigation,'GetVoucher');
					break;
				case "fenlei":
					navigation.navigate('CatScreenPage');
					break;
				case "cart":
					navigation.navigate('CartScreenPage');
					break;
				case "usercenter":
					navigation.navigate('MyScreenPage');
					break;
				case "pin_index":
					navigation.navigate('PinTuanHome');
					break;
				case "tuan_index":
					navigation.navigate('TuanGou');
					break;
				case "xianshi_index":
					navigation.navigate('XianShiZheKou');
					break;
				case "points_shop":
					//跳转积分商城
					this.getPointDiyData(navigation);
					break;
				case "ldj":
					//跳转联到家
					this.getLdjDiyData(navigation);
					break;
				case "presale_home":
					//预售
					navigation.navigate('Presale');
					break;
				case "ladder_home":
					//跳转阶梯团
					navigation.navigate('PinLadder');
					break;
					//装修改版新增
				case "category":
					//跳转分类页
					navigation.navigate('GoodsSearchList',{'catid':value});
					break;
				case "promote":
					if(value == 'cwap_tuan'){
						navigation.navigate('TuanGou');
					}else if(value == 'cwap_discount'){
						navigation.navigate('XianShiZheKou');
					}else if(value == 'pin_index'){
						navigation.navigate('PinTuanHome');
					}else  if(value == 'presale'){
						navigation.navigate('Presale');
					}
					break;
				case "keywords":
					navigation.navigate('GoodsSearchList', {'keyword': value});
					break;
				case "shop":
					this.goComVendor(navigation,value);
					break;
				case "checkin":
					if(key){
						this.goComTab(navigation,'SignLogin');
					}else{
						navigation.navigate('Login');
					}
					break;
				case "pointscenter":
					//跳转积分商城
					this.getPointDiyData(navigation);
					break;
				case "points":
					//跳转积分中心
					if(key){
						navigation.navigate('PointLog');
					}else{
						navigation.navigate('Login');
					}
					break;
				case "getcoupon":
					this.goComTab(navigation,'GetVoucher');
					break;
				case "o2o":
					//跳转联到家
					this.getLdjDiyData(navigation);
					break;
				case "coupon":
					//领取优惠券
					this.getSldVoucher(navigation,type,value,title='');
					break;
				default:
					break;
			}
		}
	}

	static handleIMage = (width,height,fix_width=scrWidth) => {
		let data_array = [];
		let screen_width = fix_width;
		if(width>screen_width){
			let true_height = Math.floor(screen_width*height/width);
			data_array['width'] = screen_width;
			data_array['height'] = true_height;
		}else{
			data_array['width'] = width;
			data_array['height'] = height;
		}
		return data_array;
	}

	/**
	 * 自定义装修：轮播 搭配 数组充组
	 * @param navigation,gid  navigation路由属性,商品gid
	 * 结果：返回在原数据基础上增加图片宽度和高度的数据
	 */
	static build_lunbpo_dapei(data){

		if(data['type'] == 'lunbo'){
			let new_data = data['data'];
			Image.getSize(new_data[0]['img'],(width,height) =>{
				let new_image_info = this.handleIMage(width,height);
				data['width'] = new_image_info.width;
				data['height'] = new_image_info.height;
			});
		}else if(data['type'] == 'dapei'){
			let new_data = data;
			let image_info = Image.prefetch(new_data.dapei_img);
			Image.getSize(new_data.dapei_img,(width,height) =>{
				let new_image_info = this.handleIMage(width,height);
				data['width'] = new_image_info.width;
				data['height'] = new_image_info.height;
			});
		}
		return data;
	}
	/**
	 * 打电话功能
	 * @param
	 * tel 手机号
	 * 直接触发打电话事件
	 */
	static callMe(tel) {
		return Linking.openURL('tel:'+tel);
	}

	/**
	 * 头部左侧图标 返回上一级页面
	 * @param
	 * navigation props里面的navigation
	 * image 图片，默认为返回箭头
	 * 结果：直接跳转到对应的页面
	 */
	static renSldLeftButton(navigation,image=require('../assets/images/goback.png')){
		return <TouchableOpacity
			activeOpacity={1}
			onPress={()=>{
				navigation.goBack();
			}}>
			<View style={GlobalStyles.topBackBtn}>
				<Image style={GlobalStyles.topBackBtnImg} source={image}></Image>
			</View>
		</TouchableOpacity>;
	}


	/**
	 *  返回上一级页面
	 * @param
	 * navigation props里面的navigation
	 * 结果：直接跳转到对应的页面
	 */
	static sldHeaderLeftEvent(navigation){
		navigation.goBack();
	}


	/**
	 * 跳转具体的页面
	 * @param navigation,data   json对象
	 * 结果：直接跳转到对应的页面
	 */
	static goDetailPageNew(navigation,data){

		switch ( data.type ) {
			case "goback_pop1_emit_update_order_detail_list":
				CountEmitter.emit('updateOrderDetailList');
				navigation.pop(1);//返回上一页并将当前页面出栈,并事件通知订单列表页和订单详情页
				break;
			case "goback_pop1":
				navigation.pop(1);//返回上一页并将当前页面出栈
				break;
			case "goReturnRefundListColseCur":
				navigation.replace('ReturnRefundList');//到退款退货列表页并关闭当前页
				break;
			case "goaddresslist":
				navigation.pop(1);
				break;
			case "gologin":
				navigation.navigate("Login",{'tag':'cart'});
				break;
			case "Login":
				navigation.navigate("Login");
				break;
			case "gotoPay":
				navigation.navigate("ConfirmOrder", {
					if_cart: 1,
					cart_id: data.value
				});
				break;
			case "GoodsSearchList":
				navigation.navigate('GoodsSearchList',{source:'guangguang'});
				break;
			case "add":
				navigation.navigate('AddNewAddress');
				break;
			case "edit":
				navigation.navigate('EditAddress',{'address_id':data.value});
				break;
			case "goSelePayMethod":
				navigation.replace('PaymentType',{'order_sn':data.value,'tag':'order'});
				break;
			case "tip":
				this.sldToastTip(data.tipmsg);
				break;
			case "goConfirm":
				navigation.navigate('ForgetPwdNext',{'tel':data.tel,'smscode':data.smscode});
				break;
			case "HomeScreenNew":
				navigation.replace("Tab")
				break;
			case "goHome":
				navigation.navigate('HomeScreenNew');
				break;
			case "goLogin":
				navigation.navigate('Login');
				break;
			case "goMessageDetail":
				navigation.navigate('MyMessageDetail',{'messagetip':data.value});
				break;
			case "goOrderDetail":
				navigation.navigate('OrderDetail',{'orderid':data.value});
				break;
			case "goMyScreen":
				navigation.navigate('MyScreen');
				break;
			case "goRefundOrderDetail":
				navigation.navigate('ReturnRefundDetail',{'refund_id':data.value});
				break;
			case "goVoucher":
				navigation.navigate('GetVoucher');
				break;
			case "vieworderexpress":
				navigation.navigate('ViewOrderExpress',{'orderid':data.value});
				break;
			case "gogoodsdetail":
				navigation.navigate('GoodsDetailNew', {'gid': data.value});
				break;
			case "GoodsDetailNewPinTeam":
				navigation.navigate('GoodsDetailNew', {'gid': data.gid,'teamid':data.teamid});
				break;
			case "ordertuikuan":
				navigation.navigate('OrderRefund',{'order_id':data.value});
				break;
			case "goodstuikuan":
				navigation.navigate('OrderGoodsRefund',{'order_id':data.value,'order_goods_id':data.order_goods_id});
				break;
			case "tuikuanlist":
				navigation.navigate('ReturnRefundList');
				break;
			case "goodstuihuo":
				navigation.navigate('OrderGoodsReturn',{'order_id':data.value,'order_goods_id':data.order_goods_id});
				break;
			case "goorderlist":
				navigation.navigate('OrderList');
				break;
			case "GoodsDetailNew":
				navigation.navigate('GoodsDetailNew',{'gid':data.value});
				break;
			case "VendorInstro":
				navigation.navigate('VendorInstro',{'vid':data.value});
				break;
			case "call":
				if(data.value==''||data.value==null){
					this.sldToastTip('该商家还没有填写联系电话');
				}else{
					this.callMe(data.value);
				}
				break;
			case "gorefunddetail":
				navigation.navigate('ReturnRefundDetail', {'refund_id': data.value});
				break;
			case "goorderderail":
				navigation.popToTop();
				break;
			case "gogoodsderail":
				navigation.navigate('GoodsDetailNew', {'gid': data.value});
				break;
			case "goorderdetail":
				navigation.navigate('OrderDetail',{'orderid':data.value});
				break;
			case "Vendor":
				navigation.navigate('Vendor',{'vid':data.value});
				break;
			case "evaluateordershop":
				navigation.navigate('OrderEvaluate',{'orderid':data.value});
				break;
			case "gobuy":
				navigation.navigate('PaymentType',{'order_sn':data.value});
				break;
			case "gohome":
				navigation.navigate('HomeScreenNew');
				break;
			case "goback":
				navigation.popToTop();
				break;
			case "goevashop":
				navigation.pop(1);
				break;
			case "evagoods":
				navigation.navigate('OrderGoodsEvaluate',{'orderid':data.order_id,gid:data.gid});
				break;
			case "sendgoods":
				navigation.navigate('ReturnRefundSend',{'refund_id':data.value});
				break;
				//团队列表
			case "viewfenxiaoteam":
				navigation.navigate('TeamList',{'type':data.value});
				break;
				//拼团订单详情
			case "PTOrderDetail":
				navigation.navigate('PTOrderDetail',{'id':data.value});
				break;
			default:
				navigation.navigate(data.type);
				break;
		}
	}

	/*
	 * 返回图片
	 * @param width 图片宽
	 * @param height 图片高
	 * @param img  图片
	 * @return {XML}
	 * */
	static getSldImg(width,height,img){
		return (
			<Image style={{width:pxToDp(width),height:pxToDp(height)}}
			       resizeMode={'contain'}
			       source={img}/>
		)
	}

	/*
	* 验证是否为空，避免空造成的闪退
	* */
	static isEmpty(str) {
		return str === null || str === '' || str === undefined;
	}

	/**
	 * 常规的页面跳转
	 * @param navigation 路由导航
	 * @param 字符串 type 页面类型：
	 * @param 对象 value 页面值：
	 * 结果：直接跳转到对应的页面
	 */
	static navDetailPage(navigation,type='',value=''){
		if(type){
			switch ( type ) {
				case "Login":
					navigation.navigate('Login');
					break;
				default:
					navigation.navigate(type);
					break;
			}
		}
	}

	/**
	 * 封装的按钮
	 * @param callBack 按钮的点击事件
	 * @param width 按钮的宽带
	 * @param height 按钮的高度
	 * @param bgColor 按钮背景铯
	 * @param bradius 按钮的圆角
	 * @param textFontSize 按钮文本大小
	 * @param textColor 按钮文本颜色
	 * @param text 按钮文本
	 * @param ml 距离左侧距离
	 * @param mt 距离上侧距离
	 * @param mr 距离右侧距离
	 * @param mb 距离下部距离
	 * @return {XML}
	 */
	static sldButton(callBack, width, height,bgColor,bradius,textFontSize,textColor,text,ml=0,mt=0,mr=0,mb=0) {
		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={callBack}
				style={[{width:width==1?scrWidth:pxToDp(width),height:pxToDp(height),backgroundColor:bgColor,borderRadius:pxToDp(bradius),marginLeft:pxToDp(ml),marginTop:pxToDp(mt),marginRight:pxToDp(mr),marginBottom:pxToDp(mb)},GlobalStyles.flex_common_row]}>
				<Text style={{fontSize:pxToDp(textFontSize),color:textColor}}>{text}</Text>
			</TouchableOpacity>
		)}

	/**
	 * 封装的按钮 可以设置是否可以点击
	 * @param callBack 按钮的点击事件
	 * @param width 按钮的宽带
	 * @param height 按钮的高度
	 * @param bgColor 按钮背景铯
	 * @param bradius 按钮的圆角
	 * @param textFontSize 按钮文本大小
	 * @param textColor 按钮文本颜色
	 * @param text 按钮文本
	 * @param ml 距离左侧距离
	 * @param mt 距离上侧距离
	 * @param mr 距离右侧距离
	 * @param mb 距离下部距离
	 * @param canClick 是否可以点击
	 * @return {XML}
	 */
	static sldButtonSetClick(callBack, width, height,bgColor,bradius,textFontSize,textColor,text,canClick=true,ml=0,mt=0,mr=0,mb=0) {
		return (
			<TouchableOpacity
				activeOpacity={1}
				onPress={callBack}
				disable={canClick}
				style={[{width:width==1?scrWidth:pxToDp(width),height:pxToDp(height),backgroundColor:bgColor,borderRadius:pxToDp(bradius),marginLeft:pxToDp(ml),marginTop:pxToDp(mt),marginRight:pxToDp(mr),marginBottom:pxToDp(mb)},GlobalStyles.flex_common_row]}>
				<Text style={{fontSize:pxToDp(textFontSize),color:textColor}}>{text}</Text>
			</TouchableOpacity>
		)}


	/**
	 * 封装的文本
	 * @param text 文本
	 * @param textColor 文本颜色
	 * @param textFontSize 文本大小
	 * @param textFontWeight 文字粗细
	 * @param marginleft 距离左侧距离
	 * @param margintop 距离上侧距离
	 * @param marginright 距离右侧距离
	 * @param marginbottom 距离下部距离
	 * @return {XML}
	 */
	static sldText(text, textColor, textFontSize,textFontWeight='300',marginleft=0,margintop=0,marginright=0,marginbottom=0) {
		return (
			<Text style={{color:textColor,fontSize:pxToDp(textFontSize),fontWeight:textFontWeight,marginLeft:pxToDp(marginleft),marginTop:pxToDp(margintop),marginRight:pxToDp(marginright),marginBottom:pxToDp(marginbottom)}}>{text}</Text>
		)}
	/**
	 * 封装的文本，2个颜色
	 * @param textpre 前面文本
	 * @param textafter 后面文本
	 * @param textColorpre 前面文本颜色
	 * @param textColorafter 后面文本颜色
	 * @param textFontSize 文本大小
	 * @param textFontWeight 文字粗细
	 * @param marginleft 距离左侧距离
	 * @param margintop 距离上侧距离
	 * @param marginright 距离右侧距离
	 * @param marginbottom 距离下部距离
	 * @return {XML}
	 */
	static sldTextColor(textpre,textafter, textColorpre,textColorafter, textFontSize,textFontWeight='300',marginleft=0,margintop=0,marginright=0,marginbottom=0) {
		return (
			<View style={{flexDirection:'row',justifyContent:'flex-start',marginLeft:pxToDp(marginleft),marginTop:pxToDp(margintop),marginRight:pxToDp(marginright),marginBottom:pxToDp(marginbottom)}}>
				<Text style={{color:textColorpre,fontSize:pxToDp(textFontSize),fontWeight:textFontWeight}}>{textpre}</Text>
				<Text style={{color:textColorafter,fontSize:pxToDp(textFontSize),fontWeight:textFontWeight}}>{textafter}</Text>
			</View>
		)}
	/**
	 * 封装的文本，2个颜色_显示在一行的两端
	 * @param textpre 前面文本
	 * @param textafter 后面文本
	 * @param textColorpre 前面文本颜色
	 * @param textColorafter 后面文本颜色
	 * @param textFontSize 文本大小
	 * @param textFontWeight 文字粗细
	 * @param marginleft 距离左侧距离
	 * @param margintop 距离上侧距离
	 * @param marginright 距离右侧距离
	 * @param marginbottom 距离下部距离
	 * @return {XML}
	 */
	static sldTextColorBetween(textpre,textafter, textColorpre,textColorafter, textFontSize,textFontWeight='300',marginleft=0,margintop=0,marginright=0,marginbottom=0,bgcolor='#fff',bgwidth=750,bgheight=100) {
		return (
			<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:pxToDp(marginleft),paddingTop:pxToDp(margintop),paddingRight:pxToDp(marginright),paddingBottom:pxToDp(marginbottom),backgroundColor:bgcolor,width:bgwidth==1?scrWidth:pxToDp(bgwidth),height:pxToDp(bgheight)}}>
				<Text style={{color:textColorpre,fontSize:pxToDp(textFontSize),fontWeight:textFontWeight}}>{textpre}</Text>
				<Text style={{color:textColorafter,fontSize:pxToDp(textFontSize),fontWeight:textFontWeight}}>{textafter}</Text>
			</View>
		)}

	/**
	 * 获取路径中的参数，路径传参决定
	 * @param url 传入的路径
	 * @param name  要匹配的参数
	 * @return value 返回的匹配到的参数
	 */
	static GetQueryString(url,name) {
		let reg = new RegExp("(^|&)"+ name +"=([^(?|&)]*)(&|$)");
		let r = url.match(reg);
		if (r!=null) return decodeURIComponent(r[2]); return "";
	}

	/**
	 * 扫码的路由跳转
	 * @param url 传入的路径
	 * @param navigation
	 * 结果：直接替换到相应的页面
	 */
	static match_saoma_url(url,navigation) {
		let value = this.GetQueryString(url,'gid');
		if(value > 0){
			navigation.replace('GoodsDetailNew', {'gid': value})
		}
	}

	/**
	 * adnroid状态栏
	 * @return {XML}
	 */
	static setSldAndroidStatusBar(hidden=false,backgroundColor='transparent',barStyle='dark-content',animated=true,  translucent=false) {
		return (
			Platform.OS != 'ios'&&(
				<StatusBar
					animated={animated} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden
					hidden={hidden}  //是否隐藏状态栏。
					backgroundColor={backgroundColor} //状态栏的背景色
					translucent={translucent}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。
					barStyle={barStyle} // enum('default', 'light-content', 'dark-content')
				/>
			))
	}

//格式化时间
	static formatChatTime(timestamp) {
		return this.format(new Date(timestamp * 1000), 'MM月dd日 hh:mm');
	}

	static format(date, fmt) {
		var o = {
			"M+": date.getMonth() + 1,                 //月份
			"d+": date.getDate(),                    //日
			"h+": date.getHours(),                   //小时
			"m+": date.getMinutes(),                 //分
			"s+": date.getSeconds(),                 //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds()             //毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}

	// 暂无数据1
	static noData(text=I18n.t('no_data'),imgSrc=require('../assets/images/order_w.png'),tip=''){
		return (
			<View style={styles.noDate}>
				<View style={styles.noDataImg}>
					<Image style={{width: pxToDp(80),height: pxToDp(80)}} source={imgSrc}/>
				</View>
				<Text style={{fontSize: pxToDp(24),marginTop: pxToDp(30),color: '#000'}}>{text}</Text>
				{tip!='' && <Text style={{fontSize: pxToDp(20),color: '#999',marginTop: pxToDp(10)}}>{tip}</Text>}
			</View>
		)
	}

	// 暂无数据2
	static noData2({title,tip,btnTxt,imgSrc,callback}){
		return (
			<View style={styles.err}>
				<View style={styles.img}>
					<Image style={{width: pxToDp(90), height: pxToDp(90)}}
						   source={imgSrc}></Image>
				</View>
				<Text style={{marginTop: pxToDp(20), color: '#333', fontSize: pxToDp(30)}}>{title}</Text>
				<Text style={{marginTop: pxToDp(10), color: '#999', fontSize: pxToDp(26)}}>{tip}</Text>
				<TouchableOpacity
					onPress={() => callback()}
				>
					<View style={styles.add}><Text
						style={{color: '#666', fontSize: pxToDp(24)}}>{btnTxt}</Text></View>
				</TouchableOpacity>
			</View>
		)
	}

	/*积分商城商品详情*/
	static goPointsGoodsDetail(navigation,gid){
		navigation.navigate('PointsGoodsDetail', {'gid': gid});
	}


	/*
	* 验证手机号
	* @param s 验证的字符串
	* */
	static sldCheckMobile(s){
		let regu =/^1[34578]\d{9}$/;
		let re = new RegExp(regu);
		if (re.test(s)) {
			return true;
		}else{
			return false;
		}
	}

	/**
	 * 判断是否是非负数
	 */
	static isRealNum (val){
		const reg = /^[0-9]+$/;
		return reg.test(val)
	}

	/**
	 * 判断用户是否登录，未登录的提示框提醒，确定跳转登录页，否则不处理
	 */
	static checkLoginAndTip(navigation){
		if(key){
			return true;
		}else{
			Alert.alert(
				'',
				'您需要登录才可以操作？',
				[
					{text: '确定', onPress: (() => {navigation.navigate('Login')})},
					{text: '取消', onPress: (() => {}), style: 'cancle'}
				]
			);
			return false;
		}
	}

}

const styles = StyleSheet.create({
	err: {
		alignItems: 'center',
	},
	img: {
		width: pxToDp(150),
		height: pxToDp(150),
		borderRadius: pxToDp(75),
		backgroundColor: '#ddd',
		alignItems: 'center',
		justifyContent: 'center',
	},
	add: {
		width: pxToDp(160),
		height: pxToDp(70),
		backgroundColor: '#fff',
		borderStyle: 'solid',
		borderWidth: pxToDp(1),
		borderColor: '#e3e5e9',
		borderRadius: pxToDp(4),
		marginTop: pxToDp(5),
		justifyContent: 'center',
		alignItems: 'center',
	},
	noDate:{
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: pxToDp(50),
	},
	noDataImg:{
		width: pxToDp(150),
		height: pxToDp(150),
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#DDD',
		borderRadius: pxToDp(150/2),
	},

    sld_single_left_view:{
        flexDirection:'row',
        justifyContent:'center',
    },
    sld_single_left_text:{
        marginLeft:15,
        fontSize:pxToDp(28),
        color:'#333',
    },
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    sld_single_left:{
        fontSize:pxToDp(32),
        color:'#353535',
    },
    sld_single_right:{
        color:'#a4a4a4',
        flexDirection:'row',
        alignItems:'center',
    },
    sld_single_right_text:{
        fontSize:pxToDp(24),
        color:'#848689',
    },
    sld_single_line:{
        width:Dimensions.get('window').width,
        backgroundColor:'#fff',
        alignItems:'center',
        flexDirection:'row',
        paddingLeft:15,
        paddingRight:15,
        justifyContent:'space-between',
    },
    sld_single_right_icon:{
        height: pxToDp(22),
        width: pxToDp(22),
        alignSelf: 'center',
        opacity: 0.5
    },
    sld_combine_icon_text:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
    },
    sld_combine_icon_text_icon:{
        flex:1,
        width:pxToDp(60),
        height:pxToDp(60),

    },
    sld_combine_icon_text_icon_share:{
        width:pxToDp(70),
        height:pxToDp(70),
    },
    sld_combine_icon_text_text:{
        flex:1,
        fontSize:pxToDp(26),
        color:'#333',
        marginTop:14,
    },
    sld_combine_icon_text_text_share:{
        fontSize:pxToDp(22),
        color:'#666',
        marginTop:pxToDp(20),
    },
    sld_order_count_view:{position:'absolute',right:pxToDp(28),width:pxToDp(40),height:pxToDp(40),borderRadius:pxToDp(40),flexDirection:'row',justifyContent:'center',alignItems:'center',borderWidth:1,backgroundColor:'#fff'},
    sld_order_count_text:{color:main_color,fontSize:pxToDp(20)},
	sld_single_left_icon:{
    	width:pxToDp(60),
		height:pxToDp(60),
		marginRight:pxToDp(10),
	},




})
