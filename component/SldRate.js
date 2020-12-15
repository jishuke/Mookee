import React, {Component} from 'react';
import {
    View, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import pxToDp from "../util/pxToDp";

export default class SldRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: props.score != null ? Math.floor(props.score*1) : 5,
            disable: props.disable != null ? props.disable : false,
            max: props.max != null ? props.max : 5,
            size: props.size != null ? props.size : 40
        }
    }

    change = (score) => {
        let {disable} = this.state;
        if (disable) return;
        this.setState({
            score: score+1
        }, () => {
            this.props.change(score+1)
        })
    }

    render() {
        let {score, max,size} = this.state;
        let imgArr = [];
        for (let i = 0; i < max; i++) {
            if (score > i) {
                imgArr.push(require('../assets/images/xinxin_light.png'))
            } else {
                imgArr.push(require('../assets/images/xinxin_gray.png'))
            }
        }
        return (
            <View style={[styles.wrap, {width: pxToDp(max * (size*1+8))}]}>
                {imgArr.length > 0 && imgArr.map((el, index) => <TouchableOpacity
                    key={index}
                    activeOpacity={1}
                    onPress={() => this.change(index)}
                >
                    <Image
                        style={{width: pxToDp(size), height: pxToDp(size), marginRight: pxToDp(8)}}
                        resizeMode={'contain'}
                        source={el}
                    />
                </TouchableOpacity>)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: pxToDp(50)
    }
})
