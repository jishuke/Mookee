import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TouchableHighlight} from 'react-native';
//即将开始抢购 的列表item  组件


export default class FlashSaleItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: this.props.itemData,
            isFavorite: this.props.isFavorite,
        }

    }

    _clickFavoriteButton() {
        this.props.isFavorite = !this.state.isFavorite;
        this.setState({
            isFavorite: !this.state.isFavorite,
        });


        this.props.onFavorite()

    }

    _getProgressBarAndTips() {

        if (this.props.isStarting) {
            //TODO
            //在这里计算已抢购件数和总数之间的关系,设置在相应的组件上
            return (
                <View style={{borderRadius: 10, backgroundColor: '#ffd5aa', width: 180, height: 15}}>
                    <View style={{
                        borderRadius: 10,
                        backgroundColor: '#ff9528',
                        position: 'absolute',
                        width: 100,
                        height: 15
                    }}/>
                    <Text style={{paddingLeft: 10, fontSize: 14}}>已抢27件</Text>
                    <Text style={{color: '#fe9021', position: 'absolute', right: 0, bottom: 0, fontSize: 14}}>19%</Text>

                </View>
            );

        } else {
            return (
                <Text style={styles.tips}>限量1000件|今天2:00开抢</Text>
            );
        }

    }
    _pressBuyBtn(){
        this.props.pressBuyBtn();

    }

    //返回关注按钮或立即抢购按钮，根据是否正在抢购中isStarting
    _getFavoriteBtnOrQGBtn() {
        if (this.props.isStarting) {
            return (
                <TouchableWithoutFeedback onPress={this._pressBuyBtn.bind(this)}>
                    <View style={{
                        backgroundColor: '#ff9427',
                        borderRadius: 5,
                        width: 80,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop:5,
                        paddingBottom:5
                    }}>
                        <Text style={{color: 'white'}}>立即抢</Text>
                    </View>
                </TouchableWithoutFeedback>
            );


        } else {
            if (this.state.isFavorite) {
                return (
                    <View style={{
                        backgroundColor: '#ff9427',
                        borderRadius: 5,
                        width: 80,
                        alignItems: 'center',
                        paddingBottom: 5,
                        paddingTop: 5
                    }}>
                        <Text style={{color: 'white'}}>已关注</Text>
                    </View>
                );

            } else {
                return (
                    <TouchableWithoutFeedback onPress={this._clickFavoriteButton.bind(this)}>
                        <View style={{
                            backgroundColor: '#ff9427',
                            borderRadius: 5,
                            width: 80,
                            alignItems: 'center',
                            paddingBottom: 5,
                            paddingTop: 5,
                            flexDirection: 'row',
                            justifyContent: 'center'

                        }}>
                            <Image style={{width: 15, height: 14}} source={require('./favorite.png')}/>
                            <Text style={{
                                color: 'white',
                                marginLeft: 9
                            }}>关注</Text>
                        </View>

                    </TouchableWithoutFeedback>
                );

            }
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={{width: 100, height: 100}} source={require('./goods.jpg')}/>
                <View style={{marginLeft: 6, flex: 1}}>
                    <View style={{marginRight: 15}}>
                        <Text numberOfLines={2} ellipsizeMode='tail'
                              style={{color: '#181818'}}>{this.state.dataSource.goodsSummary}</Text>
                        <Text style={{color: '#747474', marginTop: 10,marginBottom:10}}>{this.state.dataSource.recommend}</Text>
                        {this._getProgressBarAndTips()}
                        <View style={{flexDirection: 'row', justifyContent: 'space-between',marginTop:10}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text
                                    style={{color: '#ba1418', fontSize: 20}}>{this.state.dataSource.presentPrice}</Text>
                                <Text style={{
                                    textDecorationLine: 'line-through',
                                    marginLeft: 10,
                                    color:'#747474'
                                }}>{this.state.dataSource.originalPrice}</Text>
                            </View>
                            {this._getFavoriteBtnOrQGBtn()}
                        </View>
                    </View>
                    <View style={{flex: 1, height: 1, backgroundColor: '#747474', marginTop: 15}}/>
                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingTop: 15,
        paddingLeft: 15,


    },
    tips: {
        fontSize: 15,
        color: '#ff9427'
    }
});

