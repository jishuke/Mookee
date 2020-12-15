/*
 * 首页-猜你喜欢
 * @slodon
 * */

import React, {Component} from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import {guessLikeAllCatgorylList, guessLikeCatgoryList} from "../api/homeApi";
import PriceUtil from "../util/PriceUtil";
import SegmentedBar from "../component/SegmentedBar";
import {I18n, LANGUAGE_MIANWEN} from '../lang'
import * as _ from 'lodash';

export default class HomeGuessLike extends Component {
    constructor(props) {
        super(props)
        // console.log('猜你喜欢属性:', JSON.stringify(props))
        this.state = {
            currentCategoryId: '',
            activeIndex: 0
        }
    }

    componentWillReceiveProps(nextProps){
        const { language, userKey } = this.props
        if (language !== nextProps.language || userKey !== nextProps.userKey) {
            this.setState({
                currentCategoryId: '',
                activeIndex: 0
            })
        }
    }

    render() {
        const { navigation, data, language, userKey } = this.props
        const { currentCategoryId, activeIndex } = this.state
        const { width, height } = Dimensions.get('window')
        // const tabBarHeight = Platform.OS === 'ios' ? (height === 812 || height === 896) ? 83 : 49 : 50
        // console.log('猜你喜欢属性render:', JSON.stringify(this.props))
        return (
            <View style={{backgroundColor: '#fff'}}>
                <LikeTitleBar
                    d_category={data}
                    activeIndex={activeIndex}
                    onChange={(index) => {
                        console.log(`选中第${index}个标题`)
                        if (currentCategoryId === data[index].id) {
                            return
                        }

                        if (index === 0) {
                            this.setState({
                                currentCategoryId: '',
                                activeIndex: 0
                            })
                        } else {
                            this.setState({
                                currentCategoryId: data[index].id,
                                activeIndex: index
                            })
                        }
                        this.scrollView.scrollTo({x: width*index, y: 0, animated: true})
                        // this.forceUpdate()
                    }}
                />
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    horizontal={true}
                    bounces={false}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    onContentSizeChange={(contentWidth, contentHeight) => {

                    }}
                    onMomentumScrollEnd={(event) => {
                        this.setState({
                            activeIndex: Math.ceil(event.nativeEvent.contentOffset.x/width)
                        })
                        // this.forceUpdate()
                    }}
                >
                    {
                        data.map((item, index) => {
                            return (
                                <LikeFlatList
                                    key={index}
                                    index={index}
                                    id={item.id}
                                    activeIndex={activeIndex}
                                    navigation={navigation}
                                    language={language}
                                    userKey={userKey}
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}

//猜你喜欢滚动标题
class LikeTitleBar extends Component {
    render() {
        const { width, height } = Dimensions.get('window')
        const { d_category, onChange, activeIndex, language } = this.props
        return (
            <View style={{height: 46}}>
                <SegmentedBar
                    style={{paddingHorizontal: 10}}
                    justifyItem={'scrollable'}
                    indicatorType={'itemWidth'}
                    indicatorLineColor={'#EE2915'}
                    indicatorLineWidth={2}
                    activeIndex={activeIndex}
                    onChange={(index) => onChange(index)}
                >
                    {
                        d_category.map((item, index) => {
                            return (
                                <SegmentedBar.Item
                                    key={index}
                                    title={item.category_name}
                                    titleStyle={{fontSize: language === LANGUAGE_MIANWEN ? 14 : 15, fontWeight: 'bold', color: '#333333'}}
                                    activeTitleStyle={{fontSize: language === LANGUAGE_MIANWEN ? 15 : 16, fontWeight: 'bold', color: '#EE2915'}}
                                />
                            )
                        })
                    }
                </SegmentedBar>
            </View>
        )
    }
}

//猜你喜欢FlatList
class LikeFlatList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pn: 1,
            show_gotop: false,
            hasmore: true,//是否还有数据
            refresh: false,
            flag: 0,
            data: []
        }

        this.loadMoreDataThrottled = _.throttle(this.getNewData, 1000, {trailing: false});
    }

    componentWillReceiveProps(nextProps) {
        let { index, language, userKey } = this.props
        let { data } = this.state

        if (language !== nextProps.language || userKey !== nextProps.userKey) {
            data = []
            this.setState({data})
        }

        if (index === nextProps.activeIndex && data.length === 0) {
            // console.log('item---属性改变:',  nextProps.language, ', ', nextProps.userKey)
            if (index === 0) {
                this.loadGuessAllLikeListData({pn: 1, rows: 10, lang_type: nextProps.language})
            } else {
                this.loadGuessLikeListData({category_id: nextProps.id, pn: 1, rows: 10, lang_type: nextProps.language})
            }
        }
    }

    componentDidMount() {
        const { index, id, language } = this.props
        // console.log('flatliet---Id:', id)
        // console.log('item语言:', language)

        if (index === 0) {
            this.loadGuessAllLikeListData({pn: 1, rows: 10, lang_type: language})
        }
    }

    componentWillUnmount() {
        this.loadMoreDataThrottled.cancel();
    }

    //猜你喜欢全部商品列表
    loadGuessAllLikeListData(params) {
        let { pn, data, refresh } = this.state
        if (refresh) {
            return
        }
        this.setState({refresh: true}, () => {
            guessLikeAllCatgorylList(params).then(res => {
                // console.log('猜你喜欢全部商品列表:', res)
                this.setState({refresh: false})
                if (res.state === 200) {
                    if (pn > 1) {
                        if (res.data) {
                            data = data.concat(res.data)
                        }
                    } else {
                        data = res.data
                    }
                    this.setState({
                        data,
                        pn: pn+1
                    })
                }
            }).catch(err => {
                this.setState({refresh: false})
            })
        })
    }

    //猜你喜欢分类商品列表
    loadGuessLikeListData(params) {
        let { refresh } = this.state
        if (refresh) {
            return
        }

        this.setState({refresh: true}, () => {
            guessLikeCatgoryList(params).then(res => {
                this.setState({refresh: false})
                if (res.state === 200) {
                    // console.log('猜你喜欢分类商品列表:', res)
                    this.setState({
                        data: res.data,
                    })
                }
            }).catch(err => {
                this.setState({refresh: false})
            })
        })
    }

    getNewData = () => {
        // console.log('刷新列表数据')
        const { index, activeIndex, language } = this.props
        const { pn } = this.state

        if (index === activeIndex) {
            if (index === 0) {
                this.loadGuessAllLikeListData({pn, rows: 10, lang_type: language})
            } else {
                this.loadGuessLikeListData({pn, rows: 10, lang_type: language})
            }
        }
    }

    renderCell = (item, index) => {
        const { navigation, language } = this.props
        const { width, height } = Dimensions.get('window')

        // console.log('猜你喜欢--商品:', item)

        let activeType = ''
        let activeColor = ''
        if (item.group_flag) {
            //团购
            activeType = I18n.t('TuanGou.Groupbuy')
            activeColor = '#FF9702'
        }
        else if (item.xianshi_flag) {
            //限时
            activeType = I18n.t('HomeScreenNew.limitTime')
            activeColor = '#FE2C46'
        }
        else if (item.pin_flag) {
            //拼团
            activeType = I18n.t('GoodsSearchList.PinTuanOrder')
            activeColor = '#FF00FF'
        }

        return (
            <View style={{
                width: width/2-14,
                height: width*0.75-10,
                marginLeft: index%2 ? 4 : 10,
                marginRight: index%2 ? 10 : 4,
                marginVertical: 5,
                backgroundColor: '#fff',
                borderRadius: 9.0,
                shadowColor: '#D9D9D9',
                shadowOffset:{width:0,height:0},
                shadowOpacity: 1.0,
                shadowRadius: 3.0,
                elevation: 3.0,
            }}>
                <TouchableOpacity
                    style={{flex: 1, borderRadius: 9.0, overflow: 'hidden'}}
                    activeOpacity={0.8}
                    onPress={() => {
                        navigation.navigate('GoodsDetailNew', {gid: item.gid})
                    }}
                >
                    {/*商品图片*/}
                    <Image style={{width: '100%', height: width*0.36}} source={item.goods_image_url ? {uri: item.goods_image_url} : require('../assets/images/default_icon_124.png')} resizeMode={'cover'}/>
                    <View style={{flex: 1, paddingHorizontal: 8}}>
                        {/*商品名称*/}
                        <Text style={{marginTop: 12, fontSize: 14, color: '#333', fontWeight: '500'}} numberOfLines={2}>{item.goods_name || ''}</Text>
                        {/*商品描述*/}
                        <Text style={{marginTop: 11, fontSize: 13, color: '#666', fontWeight: '500'}} numberOfLines={1}>{item.goods_jingle || ''}</Text>
                        {/*佣金*/}
                        <View style={{flexDirection: 'row'}}>
                            <View style={{marginTop: 11,justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAEDDA', borderRadius: 2.0}}>
                                <Text style={{marginHorizontal: 5, fontSize: 10, color: '#FAA500'}}>{`${I18n.t('HomeScreenNew.commission')}: ${PriceUtil.formatPrice(item.push_price || '')}Ks`}</Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        {/*价格*/}
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 17, color: '#FF0A1B', fontWeight: 'bold'}}>{`Ks${PriceUtil.formatPrice(item.show_price || '')}`}</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: 14, color: '#999', fontWeight: 'bold', textDecorationLine: 'line-through'}}>{`Ks${PriceUtil.formatPrice(item.goods_marketprice || '')}`}</Text>
                            </View>
                        </View>
                    </View>
                    {
                        item.group_flag || item.xianshi_flag || item.pin_flag ?
                            <View style={{
                                flexDirection: 'row',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 17,
                                    backgroundColor: activeColor,
                                    borderBottomRightRadius: 10.0
                                }}>
                                    <Text style={{marginHorizontal: 5, fontSize: language === LANGUAGE_MIANWEN ? 9 : 10, color: '#fff', textAlign: 'center'}}>{activeType}</Text>
                                </View>
                                <View style={{flex: 1}}/>
                            </View> : null
                    }
                </TouchableOpacity>
            </View>
        );
    }

    render () {
        const { data, show_gotop, hasmore, flag, refresh, pn } = this.state
        const { index } = this.props
        const { width, height } = Dimensions.get('window')
        // console.log('商品render：', data)
        return (
            <View style={{marginTop: 10, width, flex: 1}}>
                <FlatList
                    style={{flex: 1}}
                    listKey={'Like' + index}
                    ref={ref => this.flatList = ref}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={1}
                    numColumns={2}
                    extraData={this.state}
                    data={data}
                    onRefresh={() => {}}
                    refreshing={refresh}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={this.loadMoreDataThrottled}
                    renderItem={({item, index}) => this.renderCell(item, index)}
                    ListHeaderComponent={
                        <View>
                            {
                                refresh && !data.length ? <ActivityIndicator size={'small'} color={'#666'} /> : null
                            }
                        </View>
                    }
                    ListFooterComponent={
                        <View>
                            {
                            refresh && data.length ? <ActivityIndicator size={'small'} color={'#666'} /> : null
                            }
                        </View>
                    }
                />
            </View>
        )
    }
}
