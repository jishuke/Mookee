/*
* 封装的webview页面
* @slodon
* */
import React, {Component} from 'react';
import {
	View ,
	StyleSheet , Dimensions , Text
} from "react-native";
import ViewUtils from "../util/ViewUtils";
import GlobalStyles from '../assets/styles/GlobalStyles';
import pxToDp from "../util/pxToDp";
const {height} = Dimensions.get('window');
export default class TimeCountDown extends Component {

    constructor(props){
      super(props);
	    this.state = {
		    time:props.enddate,//时间，时间戳,13位，如果是10位的话传过来之前需要*1000
		    bgColor:typeof (props.bgColor)=='undefined'?'#D94279':props.bgColor,//背景色
		    time_color:typeof (props.time_color)=='undefined'?'#fff':props.time_color,//时间颜色
		    time_size:typeof (props.time_size)=='undefined'?24:props.time_size,//时间的字体大小
				bg_width:typeof (props.bg_width)=='undefined'?40:props.bg_width,//背景的宽度
				bg_height:typeof (props.bg_height)=='undefined'?36:props.bg_height,//背景的高度
		    seg_color:typeof (props.seg_color)=='undefined'?'#fff':props.seg_color,//分隔的颜色
		    seg_con:typeof (props.seg_con)=='undefined'?':':props.seg_con,//分隔符的内容
		    seg_size:typeof (props.seg_size)=='undefined'?30:props.seg_size,//分隔符的字体大小
		    seg_width:typeof (props.seg_width)=='undefined'?5:props.seg_width,//分隔符的字体大小
		    hour: '00',
		    minutes: '00',
		    seconds: '00',
	    }
    }

    componentDidMount() {
	  //  console.info("开始倒计时")
	    this.timer = setInterval(() => {
            this.clock();
		},1000);

    }
    // TODo caowanli
    componentWillUnmount()
    {
	  //  console.info("关闭倒计时")
	    if(typeof (this.timer) != 'undefined'){
		    clearInterval(this.timer)
	    }
    }

	clock = () => {
        const {time} = this.state;
        let leftTime = (new Date(time)) - new Date(); //计算剩余的毫秒数
        let hours = parseInt(leftTime / 1000 / 60 / 60, 10); //计算总小时
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
        if(leftTime==0){
            hours = '00';
            minutes = '00';
            seconds = '00';
        }else if(leftTime < 0){
            hours = '';
            minutes = '';
            seconds = '';
        }else{
            hours = ViewUtils.checkTime(hours);
            minutes = ViewUtils.checkTime(minutes);
            seconds = ViewUtils.checkTime(seconds);
        }

        this.setState({
            hour: hours,
            minutes:minutes,
            seconds:seconds,
        });
    }


    render() {
	    const {hour,minutes,seconds,bgColor,time_color,time_size,bg_width,bg_height,seg_color,seg_con,seg_size,seg_width} = this.state;
        return (
			hour != '' &&
            <View style={{flexDirection:'row',}}>
                <View style={[{width:pxToDp(bg_width),height:pxToDp(bg_height),backgroundColor:bgColor},GlobalStyles.flex_common_row]}>
                    <Text style={{color:time_color,fontSize:pxToDp(time_size),fontWeight:'300'}}>{hour}</Text>
                </View>
                <Text style={{color:seg_color,fontSize:pxToDp(seg_size),paddingLeft:pxToDp(seg_width),paddingRight:pxToDp(seg_width),}}>:</Text>
                <View style={[{width:pxToDp(bg_width),height:pxToDp(bg_height),backgroundColor:bgColor},GlobalStyles.flex_common_row]}>
                    <Text style={{color:time_color,fontSize:pxToDp(time_size),fontWeight:'300'}}>{minutes}</Text>
                </View>
                <Text style={{color:seg_color,fontSize:pxToDp(seg_size),paddingLeft:pxToDp(seg_width),paddingRight:pxToDp(seg_width),}}>:</Text>
                <View style={[{width:pxToDp(bg_width),height:pxToDp(bg_height),backgroundColor:bgColor},GlobalStyles.flex_common_row]}>
                    <Text style={{color:time_color,fontSize:pxToDp(time_size),fontWeight:'300'}}>{seconds}</Text>
                </View>
            </View>
        )
    }
}
