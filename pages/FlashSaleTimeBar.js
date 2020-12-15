import React, {Component} from 'react';
import {View, Text, FlatList, Dimensions, TouchableWithoutFeedback} from 'react-native';

const itemWidth = Dimensions.get('window').width / 3;


export default class FlashSaleTimeBar extends Component {
    constructor(props) {
        super(props);

    }

    _pressItem(item,index) {
        if (this.props.position !== index){
            this.props.clickTimeBarItem(item.time,index);
        }

    }

    _renderItem(item, index) {

        let itemStyle = this.props.position ===  index?{backgroundColor: '#eaaa6c',}:{backgroundColor:'white'};

        let textStyle = item.flag === 0 ? {color: '#ff9427', fontSize: 20} : {color: 'black', fontSize: 20};
        return (
            <TouchableWithoutFeedback onPress={() => this._pressItem(item,index)}>
                <View style={[{width:itemWidth,alignItems:'center',paddingTop:20,paddingBottom:25,paddingLeft:10,paddingRight:10},itemStyle]}>
                    <Text style={textStyle}>{item.time}</Text>,
                    <Text style={textStyle}>{item.label}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }


    render() {
        return (
            <View>

                <FlatList
                    data={this.props.timebarData}
                    renderItem={({item, index}) => this._renderItem(item, index)}
                    keyExtractor={item => item.time}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>


        );
    }
}
