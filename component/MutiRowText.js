/**
 * Created by YASIN on 2017/8/21.
 * 字数超过自指定行数后显示更多
 */
import React, {Component}from 'react';
import {
    Text,
    StyleSheet,
}from 'react-native';

import pxToDp from "../util/pxToDp";
export default class MutiRowText extends Component {

    static defaultProps = {
        allowFontScaling: false,
    }
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            numLines: null,
            maxHeight: null,
            opacity: 0,
        };
    }

    shouldComponentUpdate(newProps, newState) {
        return this.state.numLines !== newProps.numLines;
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.numLines !== nextProps.numLines) {
            this.setState({
                numLines: nextProps.numLines
            });
        }
    }

    render() {
        return (
            <Text
                style={[styles.text,this.props.style,{opacity:this.state.opacity}]}
                allowFontScaling={this.props.allowFontScaling}
                numberOfLines={this.state.numLines}
                onLayout={(event)=>{
                    let height = event.nativeEvent.layout.height;
                    console.log('height::', height);
                    //第一次测量view的最大高度
                    if(this.state.maxHeight===null&&this.props.numLines){
                        this.state.maxHeight=height;
                        this.setState({
                            numLines:this.props.numLines,
                            opacity:1,
                        });
                    //第二次当测量的最大高度>设置行数后的高度的时候，回调需要换行。
                    }else if(this.props.numLines){
                        if(this.state.maxHeight>height){
                            if(this.props.onMutiCallBack){this.props.onMutiCallBack()}
                        }
                    }
                }}
            >
                {this.props.children}
            </Text>
        );
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: pxToDp(28),
        color: "#666",
    }
});
