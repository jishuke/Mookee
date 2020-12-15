/**
 * 种草社区 --添加相关商品
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
    FlatList
} from "react-native";
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import { getLinkGoodsList } from '../../api/communityApi';
import fun from '../../assets/styles/FunctionStyle'
import PriceUtil from '../../util/PriceUtil'
import {I18n} from "../../lang";

export default class AddRelatedGoods extends Component{
    constructor(props) {
        super(props);
        this.state = {
            size: 10,
            page: 1,
            goodsId: '',
            goods: []
        };
        this.goodsInfo = null;
    }

    componentDidMount() {
        this._getList();
    }

    _getList() {
        getLinkGoodsList({
            page: this.state.page,
            size: this.state.size,
            key,
        }).then(res => {
            this.setState({
                goods: res.datas.goods_list
            });
        })
    }
    leftButton() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.goBack();
            }}>
                <Image style={{ width: pxToDp(36), height: pxToDp(36), marginLeft: pxToDp(40) }} source={require('../../assets/images/goback.png')} />
            </TouchableOpacity>
        );
    }
    rightButton() {
        return (
            <TouchableOpacity onPress={this.done.bind(this)}>
                <Text style={{fontSize: pxToDp(30), color: '#DE2C22', marginRight: pxToDp(40)}}>{I18n.t('AddRelatedGoods.wc')}</Text>
            </TouchableOpacity>
        );
    }

    done() {
        console.log('done');
        if(!this.state.goodsId) return;
        this.props.navigation.navigate('Release', {
            goods: this.goodsInfo
        });
    }

    render() {
        return (
            <View style={styles.constainer}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
					rightButton={this.rightButton()}
                    title={I18n.t('AddRelatedGoods.title')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />
                <FlatList
                    data={this.state.goods}
                    ListEmptyComponent = {() => {
                        return <View style={[{height: pxToDp(300)}, fun.f_center, fun.f_bg_white]}>
                            <Text style={[fun.f_c_90, fun.f_fs28]}>{I18n.t('PointsCart.no_data')}</Text>
                        </View>
                    }}
                    renderItem = {({item, index, separators}) => {
                        return (
                            <View key={index} style={styles.item}>
                                <View style={styles.item_left}>
                                    <Image source={require('../../assets/images/communityPage/img1.png')} style={styles.goods_cover} />
                                    <View style={styles.goods_info}>
                                        <Text style={styles.goods_name} numberOfLines={1} ellipsizeMode="tail">{item.goods_name}</Text>
                                        <Text style={{fontSize: pxToDp(20), color: '#DE2C22'}}>ks{PriceUtil.formatPrice(item.show_price)}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        goodsId: item.gid
                                    });
                                    this.goodsInfo = item;
                                }}>
                                    <Image style={styles.check_icon}
                                    source={this.state.goodsId == item.gid ? require('../../assets/images/communityPage/check_red.png') : require('../../assets/images/communityPage/check_gray.png')} />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    constainer: {
        flex: 1
    },
    item:{
        backgroundColor: '#fff',
        paddingTop: pxToDp(20),
        paddingBottom: pxToDp(20),
        paddingLeft: pxToDp(40),
        paddingRight: pxToDp(40),
        marginBottom: pxToDp(10),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    item_left: {
        width: pxToDp(520),
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'row',
        padding: pxToDp(20),
        borderRadius: pxToDp(8)
    },
    goods_cover: {
        width: pxToDp(120),
        height: pxToDp(80),
        marginRight: pxToDp(26),
        flexShrink: 0,
    },
    goods_info: {
        flex: 1
    },
    goods_name: {
        fontSize: pxToDp(24),
        marginBottom: pxToDp(12),
        color: '#242424'
    },
    check_icon: {
        width: pxToDp(40),
        height: pxToDp(40)
    }
});
