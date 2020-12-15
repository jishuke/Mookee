import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';
import pxToDp from "../util/pxToDp";
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

export default class UserCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info || '',
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            info: nextProps.info
        })
    }

    change = (gid,type) => {
        let {info} = this.state;
        let num;
        if(type=='reduce'){
            if(info.cart_num<=0){
                return;
            }else{
                num = info.cart_num*1-1
            }
        }else{
            num = info.cart_num*1+1
        }
        this.props.onChange(gid,num)
    }

    render() {
        const {info} = this.state;
        return (
            <View style={styles.wrap}>
                <TouchableOpacity
                    style={styles.img}
                    activeOpacity={1}
                    onPress={() => {
                        this.props.goodsDetail(info.gid);
                    }}
                >
                    {info != '' &&
                    <Image
                        style={{width: pxToDp(150), height: pxToDp(150), overflow: 'hidden'}}
                        resizeMode={'contain'}
                        source={{uri: info.goods_image}}
                        defaultSource={require('../assets/images/default_icon_124.png')}
                    />}
                </TouchableOpacity>

                <View style={styles.info}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            this.props.goodsDetail(info.gid);
                        }}
                    >
                        <Text
                            style={{
                                color: '#333333',
                                fontSize: pxToDp(28),
                                lineHeight: pxToDp(32),
                                marginBottom: pxToDp(15)
                            }}
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                        >{info != '' ? info.goods_name : '---'}</Text>
                    </TouchableOpacity>

                    <Text style={{
                        color: '#666', fontSize: pxToDp(20), marginBottom: pxToDp(15)
                    }}>{I18n.t('com_LdjGoods.month_sales')}{info != '' ? info.month_sales : '--'}{I18n.t('com_LdjGoods.piece')}</Text>

                    <Text style={{
                        color: '#FF1515',
                        fontSize: pxToDp(28)
                    }}>Ks{info != '' ? PriceUtil.formatPrice(info.goods_price) : '--'}</Text>
                </View>

                <View style={styles.edit}>

                    {info != '' && info.cart_num != 0 &&
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.edit_btn}
                        onPress={() => this.change(info.gid,'reduce')}
                    >
                        <Image
                            source={require('../ldj/images/reduce.png')}
                            style={{width: pxToDp(44), height: pxToDp(44)}}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>}

                    {info != '' && info.cart_num != 0 && <View
                        style={{
                            width: pxToDp(55),
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Text style={{color: '#333', fontSize: pxToDp(32)}}>{info.cart_num}</Text>
                    </View>}

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.edit_btn}
                        onPress={() => this.change(info.gid,'add')}
                    >
                        <Image
                            source={require('../ldj/images/add.png')}
                            style={{width: pxToDp(44), height: pxToDp(44)}}
                            resizeMode={'contain'}
                        />
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: pxToDp(40),
        borderTopColor: '#EAEAEA',
        borderTopWidth: pxToDp(1),
        borderStyle: 'solid'
    },
    img: {
        width: pxToDp(150),
        height: pxToDp(150),
        overflow: 'hidden'
    },
    info: {
        marginLeft: pxToDp(30),
        flex: 1,
    },
    edit: {
        position: 'absolute',
        bottom: pxToDp(20),
        right: pxToDp(0),
        flexDirection: 'row',
        alignItems: 'center'
    }
})
