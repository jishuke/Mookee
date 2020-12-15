import LinearGradient from "react-native-linear-gradient";
import SldComStatusBar from "../../component/SldComStatusBar";
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Image, ScrollView, Alert, Platform, DeviceEventEmitter
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import pxToDp from "../../util/pxToDp";
import store from '../styles/store';
import RequestData from "../../RequestData";
import SldFlatList from "../../component/SldFlatList";
import LdjCart from "../../component/LdjCart";
import Modal from "react-native-modalbox";
import LdjGoods from "../../component/LdjGoods";
import PriceUtil from '../../util/PriceUtil'

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');

let pn = 1;
let hasmore = true;

export default class LdjStoreSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '店内搜索',
            keyword: props.navigation.state.params.keyword | '',
            vid: props.navigation.state.params.vid | '',
            isLoading: 0,
            goods_list: [],
            dian_info: '',
            cart_list: '',
            selectAll: true,    // 全选
            selectNum: 0,     // 选中的数量
            refresh: false,
            show_gotop: false
        }
    }

    componentDidMount() {
        this.setState({
            keyword: this.props.navigation.state.params.keyword
        },()=>{
            this.searchGoods();
        });
        this.getStoreInfo();
        this.lister = DeviceEventEmitter.addListener('updateStoreCart', () => {
            this.searchGoods();
            this.getStoreInfo();
        });
    }

    componentWillUnmount() {
        this.lister.remove();
    }

    // 获取店铺详情
    getStoreInfo() {
        let {vid} = this.state;
        RequestData.getSldData(AppSldUrl + '/index.php?app=dian&mod=index&sld_addons=ldj&key=' + key + '&dian_id=' + vid).then(res => {
            if (res.status == 200) {
                let selectNum = 0;
                res.cart_list.list.forEach(el => {
                    if (el.error != 0) {
                        el.select = false
                    } else {
                        el.select = true;
                        selectNum++;
                    }
                })
                this.setState({
                    dian_info: res.dian_info,
                    cart_list: res.cart_list,
                    selectNum: selectNum
                })
            }
        })
    }

    // 搜索商品
    searchGoods() {
        let {keyword,vid} = this.state;
        let url = AppSldUrl + '/index.php?app=goods&mod=goods_list&sld_addons=ldj&type=2&vid=' + vid + '&keyworld=' + keyword;
        if (key) {
            url += '&key=' + key
        }
        url += '&page=10&pn=' + pn;
        RequestData.getSldData(url).then(res => {
            if (res.status == 200) {
                this.setState({
                    goods_list: res.goods_list.list
                })
                if (res.goods_list.ismore.hasmore) {
                    pn++;
                } else {
                    hasmore = false;
                }
            } else {
                hasmore = false;
            }
            this.setState({
                isLoading: 1
            })
        }).catch(err => {
            this.setState({
                isLoading: 1
            })
        })
    }

    // 商品增减
    change = (gid, num) => {
        if (!key) {
            this.props.navigation.navigate('Login');
            return;
        }
        let {vid} = this.state;
        RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=editcart&sld_addons=ldj', {
            gid,
            dian_id: vid,
            quantity: num,
            key
        }).then(res => {
            if (res.status == 200) {
                DeviceEventEmitter.emit('cartUpdate');
                this.updateCart(res.cart_list)
            } else {
                ViewUtils.sldToastTip(res.msg);
            }
        })
    }

    // 更新购物车
    updateCart(res) {
        let {cart_list, goods_list} = this.state;
        res.list.forEach(el => {
            if (el.error != 0) {
                el.select = false
            } else {
                el.select = true
            }
        });
        let selectArr = [];
        cart_list.list.map(el => {
            if (!el.select) {
                selectArr.push(el.gid);
            }
        });
        if (selectArr.length > 0) {
            res.list.forEach(el => {
                if (selectArr.indexOf(el.gid) > -1) {
                    el.select = false
                }
            })
        }
        cart_list.list = res.list;
        goods_list.forEach(el => el.cart_num = 0);
        for (let i = 0; i < cart_list.list.length; i++) {
            let item = cart_list.list[i];
            for (let j = 0; j < goods_list.length; j++) {
                if (goods_list[j].gid == item.gid) {
                    goods_list[j].cart_num = item.goods_num;
                    break;
                }
            }
        }
        let selectNum = 0;
        cart_list.list.map(el => {
            if (el.select) {
                selectNum++;
            }
        });

        if (cart_list.list.length == 0) {
            this.setState({
                isShowModal: false
            })
        }
        this.setState({
            cart_list: cart_list,
            goods_list: goods_list,
            selectNum: selectNum
        }, () => {
            this.calcPrice()
        })
    }

    // 计算价格
    calcPrice() {
        let {cart_list} = this.state;
        let total = 0;
        cart_list.list.map(el => {
            if (el.error == 0 && el.goods_num > 0 && el.select) {
                total = parseFloat(total) + el.goods_num * 1 * el.goods_price;
            }
        })
        cart_list.all_money = total.toFixed(2);
        this.setState({
            cart_list: cart_list
        })
    }

    // 购物选中商品
    select = (type, gid) => {
        let {selectAll, cart_list} = this.state;
        let newSelectAll;
        let selectNum = 0;
        if (type == 'cart') {
            cart_list.list.forEach(el => el.select = !selectAll);
            newSelectAll = !selectAll;
        } else {
            cart_list.list.forEach(el => {
                if (el.gid == gid) {
                    el.select = !el.select
                }
            })
            newSelectAll = this.checkSelectAll(cart_list);
        }
        cart_list.list.map(el => {
            if (el.select) {
                selectNum++;
            }
        })
        this.setState({
            selectAll: newSelectAll,
            cart_list: cart_list,
            selectNum: selectNum
        }, () => {
            this.calcPrice()
        })
    }

    checkSelectAll(cart_list) {
        let flag = true;
        for (let i = 0; i < cart_list.list.length; i++) {
            if (!cart_list.list[i].select) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    //  选中的cart_id
    select_cart_id() {
        let {cart_list} = this.state;
        let arr = [];
        cart_list.list.map(el => {
            if (el.select) {
                arr.push(el.cart_id)
            }
        })
        return arr;
    }

    // 删除购物车
    delCart = () => {
        Alert.alert('提示', '确定删除选中商品', [
            {
                text: '取消',
                onPress: () => {

                },
                style: 'cancel'
            },
            {
                text: '确定',
                onPress: () => {
                    let cart_ids = this.select_cart_id();
                    if (cart_ids.length == 0) {
                        ViewUtils.sldToastTip('请选择要删除的商品');
                        return;
                    }
                    RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=deletecart&sld_addons=ldj', {
                        key,
                        type: 1,
                        cart_ids: cart_ids.join(',')
                    }).then(res => {
                        if (res.status == 200) {
                            this.updateCart(res.cart_list)
                        } else {
                            ViewUtils.sldToastTip(res.msg);
                        }
                    }).catch(err => {
                    })
                }
            }
        ])
    }

    // 删除失效商品
    delerrCart = () => {
        let {cart_list} = this.state;
        let arr= [];
        cart_list.list.map(el => {
            if(el.error==1){
                arr.push(el.cart_id)
            }
        })
        RequestData.postSldData(AppSldUrl + '/index.php?app=cart&mod=deletecart&sld_addons=ldj', {
            key,
            type: 1,
            cart_ids: arr.join(',')
        }).then(res => {
            if(res.status == 200){
                this.updateCart(res.cart_list)
            }else{
                ViewUtils.sldToastTip(res.msg);
            }
        }).catch(error => {
            ViewUtils.sldErrorToastTip(error);
        })
    }


    // 结算
    submit = () => {
        let {vid,cart_list} = this.state;
        let cart_ids = this.select_cart_id();
        let delivery_type = cart_list.list[0].delivery_type;
        let showType;
        if(delivery_type.length == 2){
            showType = 'all';
        }else if(delivery_type.length == 1 && delivery_type.indexOf('门店配送') > -1){
            showType = 'store';
        }else if(delivery_type.length == 1 && delivery_type.indexOf('上门自提') > -1){
            showType = 'self';
        }else{
            return;
        }
        this.props.navigation.navigate('LdjConfirmOrder', {
            cart_id: cart_ids.join(','),
            dian_id: vid,
            showType: showType
        });
    }

    refresh = () => {
        pn = 1;
        hasmore = true;
        this.searchGoods();
    }

    keyExtractor = (item, index) => {
        return index
    }

    handleScroll = (event) => {
        let offset_y = event.nativeEvent.contentOffset.y;
        let {show_gotop} = this.state;
        if (!show_gotop && offset_y > 100) {
            show_gotop = true
        }
        if (show_gotop && offset_y < 100) {
            show_gotop = false
        }
        this.setState({
            show_gotop: show_gotop,
        });

    }

    getNewData = () => {
        if (hasmore) {
            this.searchGoods();
        }
    }

    separatorComponent = () => {
        return (
            <View style={GlobalStyles.space_shi_separate}/>
        );
    }


    render() {
        const {goods_list, isLoading, dian_info, cart_list} = this.state;
        const delivery = dian_info.ldj_delivery_order_Price;
        const error = dian_info.error;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
                { ViewUtils.getEmptyPosition('#fff', pxToDp(0)) }
                <TouchableOpacity
                    style={store.ssearch}
                    onPress={() => {
                        this.props.navigation.navigate('LdjSearch', {type: 1})
                    }}
                >
                    <Text style={{color: '#333',fontSize: pxToDp(28)}}>{this.state.keyword != '' ? this.state.keyword : '请输入商品名'}</Text>
                    <Image
                        style={{
                            width: pxToDp(27),
                            height: pxToDp(27)
                        }}
                        resizeMode={'contain'}
                        source={require('../images/search.png')}
                    />
                </TouchableOpacity>

                {goods_list.length > 0 && <View style={{paddingHorizontal: pxToDp(30),flex: 1}}>
                    <SldFlatList
                        data={goods_list}
                        refresh_state={this.state.refresh}
                        show_gotop={this.state.show_gotop}
                        refresh={() => this.refresh()}
                        keyExtractor={() => this.keyExtractor()}
                        handleScroll={(event) => this.handleScroll(event)}
                        getNewData={() => this.getNewData()}
                        separatorComponent={() => this.separatorComponent()}
                        renderCell={(item) => <LdjGoods
                            info={item}
                            goodsDetail={(gid) => {
                                const {vid} = this.state;
                                this.props.navigation.navigate('LdjGoodsDetail', {gid: gid, vid: vid})
                            }}
                            onChange={(gid, num) => this.change(gid, num)}
                        />}
                    />
                </View>}

                {goods_list.length == 0 && isLoading == 1 && <View
                    style={{flex: 1, justifyContent: 'center',alignItems: 'center',width: deviceWidth}}
                >
                    <Image
                        style={{width: pxToDp(163), height: pxToDp(99), marginBottom: 70}}
                        source={require('../images/searchnull.png')}
                        resizeMode={'contain'}
                    />
                    <Text style={{color: '#999', fontSize: pxToDp(24)}}>没有找到该商品</Text>
                </View>}

                {isLoading == 0 && goods_list.length == 0 &&
                <View style={ {flex: 1, justifyContent: 'center', alignItems: 'center'} }>
                    { ViewUtils.SldEmptyTip(require('../images/empty_sld_com.png'), '加载中...') }
                </View> }

                {/*底部购物车 start*/}
                <View style={{height: pxToDp(98)}}>
                    {cart_list != '' && <LdjCart
                        list={ cart_list.list }
                        total={ cart_list.all_money }
                        error={ error }
                        delivery={ delivery }
                        submit={ () => this.submit() }
                        showModal={ () => {
                            if(cart_list.list.length > 0){
                                this.setState({
                                    isShowModal: true
                                })
                            }
                        } }
                    />}
                </View>
                {/*底部购物车 end*/}


                {/*购物车弹出层 start*/}
                { cart_list != '' && this.state.isShowModal==true && <TouchableOpacity
                    activeOpacity={1}
                    style={ store.modalStyle }
                    onPress={()=>{
                        this.setState({
                            isShowModal: false
                        })
                    }}
                >
                    <View style={ store.modal_top }>
                        <Image
                            style={ {width: pxToDp(90), height: pxToDp(90)} }
                            resizeMode={ 'contain' }
                            source={ (error == 1) ? (require('../images/carterr.png')) :
                                (cart_list.list.length > 0 ? (require('../images/cart.png')) : (require('../images/carterr.png'))) }
                        />
                        <LinearGradient
                            style={ {
                                position: 'absolute',
                                top: pxToDp(0),
                                left: pxToDp(60),
                                width: pxToDp(38),
                                height: pxToDp(38),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: pxToDp(19),
                            } }
                            colors={ [ '#FF2626', '#FF9D46' ] }
                        >
                            <Text style={ {
                                color: '#fff',
                                fontSize: pxToDp(22)
                            } }>{ cart_list.list.length ? cart_list.list.length : 0 }</Text>
                        </LinearGradient>
                    </View>
                    <TouchableOpacity
                        style={ store.modal_bottom }
                        activeOpacity={1}
                        onPress={()=>{}}
                    >
                        <View style={ store.clearAll }>
                            <View style={ store.row }>
                                <TouchableOpacity
                                    onPress={ () => this.select('cart') }
                                >
                                    <Image
                                        style={ {width: pxToDp(40), height: pxToDp(40)} }
                                        resizeMode={ 'contain' }
                                        source={ this.state.selectAll == true ? require('../images/select.png') : require('../images/noselect.png') }
                                    />
                                </TouchableOpacity>

                                <Text style={ {
                                    marginLeft: pxToDp(20),
                                    fontSize: pxToDp(32),
                                    color: '#333'
                                } }>
                                    全选
                                    <Text style={ {
                                        color: '#999',
                                        fontSize: pxToDp(22)
                                    } }>已选{ this.state.selectNum }件</Text>
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={ () => this.delCart() }
                            >
                                <Text style={ {color: '#666', fontSize: pxToDp(22)} }>清空购物车</Text>
                            </TouchableOpacity>
                        </View>

                        {/*正常商品*/ }
                        <ScrollView
                            style={ store.cart_scr }
                        >
                            { cart_list != '' && cart_list.list.length > 0 && cart_list.list.map(el => {
                                if(el.error == 0){
                                    return (<TouchableOpacity activeOpacity={1} style={ [ store.row, store.cart_goods ] }>
                                        <TouchableOpacity
                                            style={ {paddingHorizontal: pxToDp(20)} }
                                            onPress={ () => this.select('goods', el.gid) }
                                        >
                                            <Image
                                                style={ {width: pxToDp(40), height: pxToDp(40)} }
                                                resizeMode={ 'contain' }
                                                source={ el.select == true ? require('../images/select.png') : require('../images/noselect.png') }
                                            />
                                        </TouchableOpacity>
                                        <View style={ [ store.row, {flex: 1,} ] }>
                                            <Image
                                                style={ {
                                                    width: pxToDp(120),
                                                    height: pxToDp(120),
                                                    borderRadius: pxToDp(6)
                                                } }
                                                resizeMode={ 'contain' }
                                                source={ {uri: el.goods_image} }
                                            />
                                            <View style={ {
                                                marginLeft: pxToDp(20),
                                                flex: 1
                                            } }>
                                                <Text
                                                    ellipsizeMode={ 'tail' }
                                                    numberOfLines={ 2 }
                                                    style={ {
                                                        color: '#333333',
                                                        fontSize: pxToDp(28)
                                                    } }
                                                >{ el.goods_name }</Text>

                                                <View style={ store.row_between }>
                                                    <Text style={ {
                                                        color: '#FF0902',
                                                        fontSize: pxToDp(32)
                                                    } }>ks{PriceUtil.formatPrice( el.goods_price )}</Text>

                                                    <View
                                                        style={ {
                                                            flexDirection: 'row',
                                                            alignItems: 'center'
                                                        } }
                                                    >
                                                        <TouchableOpacity
                                                            onPress={ () => {
                                                                this.change(el.gid, el.goods_num * 1 - 1)
                                                            } }
                                                        >
                                                            <Image
                                                                style={ store.img_btn }
                                                                resizeMode={ 'contain' }
                                                                source={ require('../images/reduce.png') }
                                                            />
                                                        </TouchableOpacity>
                                                        <Text style={ {
                                                            width: pxToDp(55),
                                                            fontSize: pxToDp(32),
                                                            color: '#333',
                                                            textAlign: 'center'
                                                        } }>{ el.goods_num }</Text>
                                                        <TouchableOpacity
                                                            onPress={ () => {
                                                                this.change(el.gid, el.goods_num * 1 + 1)
                                                            } }
                                                        >
                                                            <Image
                                                                style={ store.img_btn }
                                                                resizeMode={ 'contain' }
                                                                source={ require('../images/add.png') }
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>)
                                }
                            }) }
                        </ScrollView>

                        {cart_list != '' && cart_list.list.length > 0 && cart_list.list.filter(el=>el.error!=0).length>0 && <View style={ store.clearAll }>
                            <View style={ store.row }>
                                <Text style={ {
                                    marginLeft: pxToDp(20),
                                    fontSize: pxToDp(28),
                                    color: '#333'
                                } }>
                                    全选
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={ () => this.delerrCart() }
                            >
                                <Text style={ {color: '#666', fontSize: pxToDp(22)} }>清空失效商品</Text>
                            </TouchableOpacity>
                        </View>}

                        {/*失效商品*/ }
                        <ScrollView
                            style={ store.cart_scr }
                        >
                            { cart_list != '' && cart_list.list.length > 0 && cart_list.list.map(el => {
                                if(el.error != 0){
                                    return (<TouchableOpacity activeOpacity={1} style={ [ store.row, store.cart_goods ] }>
                                        <TouchableOpacity
                                            style={ {paddingHorizontal: pxToDp(20)} }
                                        >
                                            <Image
                                                style={ {width: pxToDp(40), height: pxToDp(40)} }
                                                resizeMode={ 'contain' }
                                                source={ require('../images/unselect.png') }
                                            />
                                        </TouchableOpacity>
                                        <View style={ [ store.row, {flex: 1} ] }>
                                            <Image
                                                style={ {
                                                    width: pxToDp(120),
                                                    height: pxToDp(120),
                                                    borderRadius: pxToDp(6)
                                                } }
                                                resizeMode={ 'contain' }
                                                source={ {uri: el.goods_image} }
                                            />
                                            <View style={ {
                                                position: 'relative',
                                                top: 0,
                                                left: 0,
                                                width: pxToDp(120),
                                                height: pxToDp(120),
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            } }>
                                                <Text
                                                    style={ {
                                                        color: '#fff',
                                                        fontSize: pxToDp(32)
                                                    } }>{ el.errorinfo }</Text>
                                            </View>
                                            <View style={ {
                                                marginLeft: pxToDp(20),
                                                flex: 1
                                            } }>
                                                <Text
                                                    ellipsizeMode={ 'tail' }
                                                    numberOfLines={ 2 }
                                                    style={ {
                                                        color: '#333333',
                                                        fontSize: pxToDp(28)
                                                    } }
                                                >{ el.goods_name }</Text>

                                                <View style={ store.row_between }>
                                                    <Text style={ {
                                                        color: '#FF0902',
                                                        fontSize: pxToDp(32)
                                                    } }>ks{PriceUtil.formatPrice( el.goods_price )}</Text>

                                                    <View
                                                        style={ {
                                                            flexDirection: 'row',
                                                            alignItems: 'center'
                                                        } }
                                                    >
                                                        <TouchableOpacity
                                                        >
                                                            <Image
                                                                style={ store.img_btn }
                                                                resizeMode={ 'contain' }
                                                                source={ require('../images/reduce.png') }
                                                            />
                                                        </TouchableOpacity>
                                                        <Text style={ {
                                                            width: pxToDp(55),
                                                            fontSize: pxToDp(32),
                                                            color: '#333',
                                                            textAlign: 'center'
                                                        } }>{ el.goods_num }</Text>
                                                        <TouchableOpacity
                                                        >
                                                            <Image
                                                                style={ store.img_btn }
                                                                resizeMode={ 'contain' }
                                                                source={ require('../images/add.png') }
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>)
                                }
                            }) }
                        </ScrollView>

                        { cart_list != '' && <View style={ [ store.row_between, {height: pxToDp(98)} ] }>
                            <Text style={ {
                                color: '#FF2847',
                                fontSize: pxToDp(36),
                                paddingLeft: pxToDp(30)
                            } }>ks{PriceUtil.formatPrice( cart_list.all_money )}</Text>

                            { error == 1 && <Text style={ [ store.cart_btn, {
                                backgroundColor: '#B1B1B1'
                            } ] }>
                                休息中
                            </Text> }

                            { error != 1 && cart_list.list.length == 0 && <Text style={ [ store.cart_btn, {
                                backgroundColor: '#B1B1B1'
                            } ] }>
                                { delivery }元起送
                            </Text> }

                            { error != 1 && cart_list.list.length > 0 && delivery * 1 > cart_list.all_money * 1 &&
                            <Text style={ [ store.cart_btn, {
                                backgroundColor: '#B1B1B1'
                            } ] }>
                                差{ delivery - cart_list.all_money }元起送
                            </Text> }

                            { error != 1 && cart_list.list.length > 0 && delivery * 1 <= cart_list.all_money * 1 &&
                            <TouchableOpacity
                                activeOpacity={ 1 }
                                onPress={ () => this.submit() }
                            >
                                <Text style={ [ store.cart_btn, {
                                    backgroundColor: '#5EB319'
                                } ] }>
                                    去结算
                                </Text>
                            </TouchableOpacity> }

                        </View> }
                    </TouchableOpacity>
                </TouchableOpacity> }

            </View>
        )
    }
}
