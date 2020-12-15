/**
 * vip --- 选择商品
 * */
import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
} from 'react-native';
import SldFlatList from "../../component/SldFlatList";
import NavigationBar from "../../component/NavigationBar";
import I18n from "react-native-i18n";
import LoadingWait from "../../component/LoadingWait";
import pxToDp from "../../util/pxToDp";
import ViewUtils from "../../util/ViewUtils";
import {getVIPInfo, getVIPProductDetail} from "../../api/pushHandApi";

const {width,height,scale} = Dimensions.get('window');
if(width==375&&height==812){
    ios_type = scale==3?44:60
}else if(width==414&&height==896){
    ios_type = 60
}
const NAV_BAR_HEIGHT_IOS = ios_type==''?35:ios_type;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = Platform.OS=='ios'?(ios_type==''?35:ios_type):0;

export default class VIPSelectGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            listData: [],
            show_gotop: false,
            showLoading: false,
            pageNum: 1,
            hasMore: true,
            showAlert: false, //商品规格弹框
            selectedGid: null, //选择的商品id
        }
    }

    componentDidMount() {
        this._loadData()
    }

    //导航返回按钮
    leftButton() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image style={{ width: pxToDp(36), height: pxToDp(36), marginLeft: pxToDp(40) }} source={require('../../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    };

    //列表数据加载
    _loadData() {
        let { showLoading, listData, pageNum, hasMore } = this.state
        if (showLoading) {
            return;
        }
        this.setState({showLoading: true})
        getVIPInfo().then(res => {
            if (res.code === 200) {
                console.log('vip商品赠送--vip商品列表页:', JSON.stringify(res))
                const data = res.datas.goods_list;
                let list = [];
                if (pageNum === 1) {
                    list = data;
                } else {
                    list = listData.concat(data)
                }

                if (res.hasMore) {
                    pageNum++;
                } else {
                    hasMore = false;
                }

                this.setState({
                    showLoading: false,
                    listData: list,
                    pageNum,
                    hasMore
                })
            }
        }).catch(err => {
            console.log('vip商品赠送请求失败--vip商品列表页:', err)
            this.setState({showLoading: false})
        })
    }

    //列表Cell
    _renderCell(item) {
        const { width } = Dimensions.get('window')
        const { showAlert } = this.state
        return (
            <View style={styles.cell}>
                {/*商品图片*/}
                <Image style={{marginLeft: 16, width: width*0.3, height: width*0.3}} resizeMode={'contain'} source={{uri: item.goods_image_url}}/>
                <View style={{flex:1, marginLeft: 8, marginRight: 19, height: width*0.3}}>
                    <View style={{marginHorizontal: 0, height: width*0.1}}>
                        {/*商品标题*/}
                        <Text style={{flex:1, fontSize: 15, color: '#442E20'}} numberOfLines={2}>
                            {item.goods_name}
                        </Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        {/*选择商品规格*/}
                        <TouchableOpacity
                            style={{flexDirection: 'row', alignItems: 'center', marginTop: width*0.03, height: 20, backgroundColor: '#EEEEEE', borderRadius: 3.0}}
                            activeOpacity={1.0}
                            onPress={() => {
                                this.setState({
                                    selectedGid: item.gid,
                                    showAlert: !showAlert
                                })
                            }}
                        >
                            <Text style={{marginLeft: 5, fontsize: 10, color: '#A8A8A8'}} numberOfLines={1}>{I18n.t('VIPSelectGoods.btnTitle')}</Text>
                            <Image style={{marginLeft: 13, marginRight: 5, width: 8, height: 5}} resizeMode={'contain'} source={require('../../assets/images/down_arrow.png')}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                    </View>
                    {/*选择/详情*/}
                    <ImageBackground
                        style={{flexDirection: 'row', marginLeft: width*0.07, width: width*0.41, height: width*0.07}}
                        source={require('../../assets/images/vip_select_product_segment.png')}
                        resizeMode={'stretch'}
                    >
                        {/*选择*/}
                        <TouchableOpacity
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            activeOpacity={1.0}
                            onPress={() => {
                                this.setState({
                                    selectedGid: item.gid,
                                    showAlert: !showAlert
                                })
                            }}
                        >
                            <Text style={{fontsize: 13, color: '#9F6D49', textAlign: 'center'}}>{I18n.t('VIPSelectGoods.select')}</Text>
                        </TouchableOpacity>
                        {/*详情*/}
                        <TouchableOpacity
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                            activeOpacity={1.0}
                            onPress={() => {
                            //    跳转到vip商品详情
                                this.props.navigation.navigate('GoodsDetailNew', {gid: item.gid, fromVip: true})
                            }}
                        >
                            <Text style={{fontsize: 13, color: '#9F6D49', textAlign: 'center'}}>{I18n.t('VIPSelectGoods.detail')}</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </View>
        )
    }

    getNewData = () => {
        if(this.state.hasMore){
            this._loadData();
        }
    }

    refresh = () => {
        this.setState({
            pageNum: 1,
            hasMore: true
        },() => {
            this._loadData();
        });
    }

    handleScroll = (event) => {
        let offset_y = event.nativeEvent.contentOffset.y;
        let {show_gotop} = this.state;
        if(!show_gotop && offset_y > 100){
            show_gotop = true
        }
        if(show_gotop && offset_y < 100){
            show_gotop = false
        }
        this.setState({
            show_gotop: show_gotop,
        });
    }

    keyExtractor = (item, index) => {
        return index
    }

    separatorComponent = () => {
        return <View/>
    }

    render() {
        const { listData, refresh, show_gotop, showLoading, showAlert, selectedGid } = this.state;
        return (
            <View style={styles.container}>
                {/*导航*/}
                <NavigationBar
                    ref={ref => this.nav = ref}
                    statusBar={{barStyle: "dark-content"}}
                    leftButton={this.leftButton()}
                    title={I18n.t('VIPSelectGoods.title')} //选择商品
                    title_color={'#442E20'}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                {
                    listData && listData.length ?
                        <View style={{flex: 1, marginTop: 12}}>
                            <SldFlatList
                                data={ listData }
                                refresh_state={ refresh }
                                show_gotop={ show_gotop }
                                refresh={ () => this.refresh () }
                                keyExtractor={ () => this.keyExtractor () }
                                handleScroll={ ( event ) => this.handleScroll ( event ) }
                                getNewData={ () => this.getNewData () }
                                separatorComponent={ () => this.separatorComponent () }
                                renderCell={ ( item ) => this._renderCell ( item ) }
                            />
                        </View>
                        :
                        //空视图
                        <View style={{marginTop: pxToDp(200)}}>{ViewUtils.noData()}</View>
                }
                {/*Loading*/}
                {
                    showLoading ? <LoadingWait loadingText={I18n.t('loading')} cancel={() => {}}/> : null
                }
                {/*商品弹框*/}
                {
                    showAlert ?
                        <ProductAlert
                            params={{key: '', team_id: '', gid: selectedGid}}
                            hide={() => this.setState({showAlert: false})}
                            navigation={this.props.navigation}
                        /> : null
                }
            </View>
        )
    }
}

// 商品规格弹框
class ProductAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            selectedSkuIndex: 0,
        }
    }

    componentDidMount() {
        this._loadProductDetailData(this.props.params)
    }

    //商品详情数据加载
    _loadProductDetailData(params) {
        getVIPProductDetail(params).then(res => {
            console.log('商品详情数据加载:', JSON.stringify(res))
            let skuType = [];
            let gids = [];
            if (res.code === 200) {
                const spec = res.datas.goods_info.spec_value;
                if (spec) {
                    let specValue = '';
                    for (let key in spec) {
                        specValue = spec[key];
                        break;
                    }

                    for (let key in specValue) {
                        skuType.push(specValue[key]);
                    }
                    // console.log('商品详情数据加载11111111111:', JSON.stringify(skuType))
                }

                const specList = res.datas.spec_list
                for (let key in specList) {
                    gids.push(specList[key]);
                }

                let skus = [];
                if (skuType.length === gids.length) {
                    for (let i = 0; i<skuType.length; i++) {
                        skus.push({
                            skuType: skuType[i],
                            gid: gids[i]
                        })
                    }
                }

                this.setState({
                    data: {
                        gid: params.gid,
                        skus: skus,
                        name: res.datas.goods_info.goods_name,
                        img: res.datas.goods_image || null
                    }
                })
            }
        }).catch(err => {
            console.log('商品详情数据加载失败:', err)
        })
    }

    render () {
        const { width } = Dimensions.get('window');
        const { hide, navigation } = this.props
        const { data, selectedSkuIndex } = this.state

        return (
            <View style={styles.popView}>
                {/*点击空白弹回*/}
                <TouchableOpacity
                    style={{flex: 1}}
                    activeOpacity={1.0}
                    onPress={() => hide()}
                />
                <View style={{width: width, height: width*1.2}}>
                    <View style={{height: 45}}/>
                    <View style={{flex: 1, backgroundColor: '#fff'}}>
                        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 15,
                                paddingVertical: 15
                            }}>
                                {/*图片*/}
                                <Image style={{width: width*0.256, height: width*0.256}} source={data && data.img ? {uri: data.img} : require('../../assets/images/default_icon_124.png')}/>
                                {/*商品标题*/}
                                <Text style={{flex:1, marginLeft: 10, fontsize: 14, color: '#333333', lineHeight:22}} numberOfLines={2}>{data && data.name || ''}</Text>
                            </View>
                            <View style={styles.line}/>
                            {/*规格*/}
                            <Text style={{marginTop: 15, marginLeft: 15}}>{I18n.t('VIPSelectGoods.sku')}</Text>
                            <View style={{marginTop: 15, marginHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap'}}>
                                {
                                    data && data.skus.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                activeOpacity={1.0}
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginTop: 8,
                                                    marginLeft: index === 0 ? 0 : 15,
                                                    height: 32,
                                                    borderRadius: 5.0,
                                                    borderWidth: 1.0,
                                                    borderColor: selectedSkuIndex === index ? '#dd923d' : '#aaaaaa'
                                                }}
                                                onPress={() => {
                                                    if (selectedSkuIndex !== index) {
                                                        this.setState({selectedSkuIndex: index});
                                                        this._loadProductDetailData({key: '', team_id: '', gid: item.gid})
                                                    }
                                                }}
                                            >
                                                <Text style={{marginHorizontal:10, fontsize: 13, color: selectedSkuIndex === index ? '#dd923d' : '#aaaaaa'}}>{item.skuType}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            {/*数量*/}
                            <Text style={{marginTop: 25, marginLeft: 15}}>{I18n.t('VIPSelectGoods.num')}</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: 15,
                                    marginVertical: 15,
                                    width: 108,
                                    height: 30,
                                    borderRadius: 3.0,
                                    borderWidth: 1.0,
                                    borderColor: '#aaaaaa'
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRightWidth: 1.0,
                                        borderRightColor: '#aaaaaa',
                                        width: 28
                                    }}
                                >
                                    <Text style={{fontsize: 11, color: '#aaaaaa'}}>-</Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontsize: 11, color: '#aaaaaa'}}>1</Text>
                                </View>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderLeftWidth: 1.0,
                                        borderLeftColor: '#aaaaaa',
                                        width: 28
                                    }}
                                >
                                    <Text style={{fontsize: 11, color: '#aaaaaa'}}>+</Text>
                                </View>
                            </View>
                        </ScrollView>
                        {/*确认按钮*/}
                        <TouchableOpacity
                            style={{
                                marginHorizontal: 26,
                                marginBottom: 16,
                                height: 39
                            }}
                            activeOpacity={1.0}
                            onPress={() => {
                                if (data) {
                                    console.log('啊啊啊啊啊啊啊啊:', data)
                                    navigation.state.params.refreshCallBack({
                                        gid: data.gid,
                                        image: data.img,
                                        title: data.name
                                    })
                                    navigation.goBack()
                                }
                            }}
                        >
                            <ImageBackground
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                                source={require('../../assets/images/vip_select_list_define.png')}
                                resizeMode={'stretch'}
                            >
                                <Text style={{fontsize: 18, color: '#4D2828'}}>{I18n.t('VIPSelectGoods.confirm')}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        {/*退出按钮*/}
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'absolute',
                                top: -35,
                                right: 15,
                                width: 25,
                                height: 25
                            }}
                            activeOpacity={1.0}
                            onPress={() => hide()}
                        >
                            <Image style={{flex: 1}} source={require('../../assets/images/pushHand/vip_back.png')} resizeMode={'contain'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(249,245,249)'
    },
    cell: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 20,
        height: Dimensions.get('window').width*0.38,
        backgroundColor: '#fff',
        borderRadius: 5.0
    },
    popView: {
        justifyContent: 'flex-end',
        position: 'absolute',
        top: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS + STATUS_BAR_HEIGHT : NAV_BAR_HEIGHT_ANDROID,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    line: {
        marginLeft: 15,
        height: 0.5,
        backgroundColor: 'gray'
    }
})
