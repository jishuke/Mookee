import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import Dimensions from 'Dimensions';
import FlashSaleItem from './FlashSaleItem';
import FlashSaleTimeBar from "./FlashSaleTimeBar";

const customData={
    itemDatas:[
        {
            id: "1",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤 纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:true

        }, {
            id: "2",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:false

        }, {
            id: "3",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型紧致肌肤纪梵希时光无痕修复轻盈乳霜爽型紧致肌肤纪梵希时光无痕修复轻盈乳霜爽型紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:true

        }, {
            id: "4",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:true

        }, {
            id: "5",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:true

        }, {
            id: "6",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:true

        }, {
            id: "7",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:true

        }, {
            id: "8",
            imageUrl: '',
            goodsSummary: '纪梵希时光无痕修复轻盈乳霜爽型 紧致肌肤',
            recommend: '[推荐] 陶瓷趣味马克杯',
            originalPrice: 'ks120',
            presentPrice: 'ks10',
            isFavorite:true

        }


    ],
    timebarData:[

        {
            time: '1:00',
            label: '正在抢购中',
            flag: 0
        }, {
            time: '2:00',
            label: '即将开抢',
            flag: 1

        },
        {
            time: '3:00',
            label: '即将开抢',
            flag: 1
        },
        {
            time: '4:00',
            label: '即将开抢',
            flag: 1
        },
        {
            time: '5:00',
            label: '即将开抢',
            flag: 1
        },
        {
            time: '6:00',
            label: '即将开抢',
            flag: 1
        },
        {
            time: '7:00',
            label: '即将开抢',
            flag: 1
        }
    ]

};

export default class FlashSaleScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageUrl: '',
            refreshing: false,
            showFoot: 0,
            timeBarLocation:0
        }
    }

    componentDidMount() {
        //初次加载组件时，在这里访问网络获取数据
    }
    //关注某件商品，可能需要商品id参数 请求服务器
    _onFavorite(){
        // alert('请求服务器')
    }
    //点击了立即抢购按钮
    _pressBugBtn(){
        // alert("点击了立即抢购")

    }
    _renderItem(itemData) {
        return (
            <FlashSaleItem itemData={itemData} isStarting={false} isFavorite={itemData.isFavorite} onFavorite={this._onFavorite.bind(this)} pressBuyBtn={this._pressBugBtn.bind(this)}/>
        );
    }
    clickTimeBarItem(time,index){
        // alert('在这里根据选中的日期 ，请求服务器获取数据后更新列表'+time)
       //TODO
        //在这里根据选中的日期 ，请求服务器获取数据后更新列表
        this.setState({
            timeBarLocation:index
        })
    }
    //添加flatlist的头部
    renderHeader() {
        return (
            <View>
                <Image style={styles.topImage} source={require('./aa.jpg')}/>
                <FlashSaleTimeBar  position={this.state.timeBarLocation} clickTimeBarItem={this.clickTimeBarItem.bind(this)} timebarData={customData.timebarData}/>
                <View style={{flex:1,height:1,backgroundColor:'gray'}}/>
            </View>
        );
    }
    //添加footer
    renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 24, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );

        }

    }

    onRefresh() {


    }

    loadMore() {
        setTimeout(() => {
            this.setState({
                showFoot: 0
            })

        }, 3000)

    }

    render() {

        return (
            <View>
                <FlatList
                    style={styles.list}
                    data={customData.itemDatas}
                    renderItem={({item}) => this._renderItem(item)}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh.bind(this)}

                    onEndReached={this.loadMore.bind(this)}
                    onEndReachedThreshold={1}

                />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    list:{
        backgroundColor:'white'
    },
    topImage: {
        width: Dimensions.get('window').width,
        height: 100
    },
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    }

});
