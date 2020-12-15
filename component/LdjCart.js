import React, {Component, Fragment} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image, Dimensions
} from 'react-native';
import pxToDp from "../util/pxToDp";
import LinearGradient from 'react-native-linear-gradient';
import {I18n} from './../lang/index'
import PriceUtil from '../util/PriceUtil'

const {
    deviceHeight: deviceHeight,
    deviceWidth: deviceWidth
} = Dimensions.get('window');


export default class LdjCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list ? props.list : [],
            total: props.total || 0,
            error: props.error || 0,
            delivery: props.delivery || 0,
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            list: nextProps.list,
            total: nextProps.total,
            error: nextProps.error,
            delivery: nextProps.delivery
        })
    }

    showModal = () => {
        this.props.showModal()
    }

    render() {
        const {list, error, delivery, total} = this.state;
        let imgSrc = (error==1)?(require('../ldj/images/carterr.png')):
            (list.length>0?(require('../ldj/images/cart.png')):(require('../ldj/images/carterr.png')));
        return (
            <Fragment>
                <View style={styles.wrap}>
                    <View style={styles.cart_info}>
                        <Text style={{
                            color: '#FF2847',
                            fontSize: pxToDp(36),
                        }}>ks{PriceUtil.formatPrice(total)}</Text>
                    </View>


                    {error == 1 && <Text style={[styles.cart_btn, {
                        backgroundColor: '#B1B1B1'
                    }]}>
                        {I18n.t('com_LdjCart.take_break')}
                    </Text>}

                    {error != 1 && list.length == 0 && <Text style={[styles.cart_btn, {
                        backgroundColor: '#B1B1B1'
                    }]}>
                        {delivery}{I18n.t('com_LdjCart.Yuan_up_send')}
                    </Text>}

                    {error != 1 && list.length > 0 && delivery*1 > total*1 && <Text style={[styles.cart_btn, {
                        backgroundColor: '#B1B1B1'
                    }]}>
                        {I18n.t('com_LdjCart.difference')}{delivery - total}{I18n.t('com_LdjCart.Yuan_up_send')}
                    </Text>}

                    {error != 1 && list.length > 0 && delivery*1 <= total*1 && <TouchableOpacity
                        activeOpacity={1}
                        onPress={()=>this.props.submit()}
                    >
                        <Text style={ [ styles.cart_btn, {
                            backgroundColor: '#5EB319'
                        } ] }>
                            {I18n.t('CartScreen.checkout')}
                        </Text>
                    </TouchableOpacity>}

                </View>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.showModal()}
                    style={styles.cart_left}
                >
                    <Image
                        style={{
                            width: pxToDp(90),
                            height: pxToDp(90),
                        }}
                        resizeMode={'contain'}
                        source={imgSrc}
                    />
                    <LinearGradient
                        style={{
                            position: 'absolute',
                            top: pxToDp(0),
                            right: pxToDp(0),
                            width: pxToDp(38),
                            height: pxToDp(38),
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: pxToDp(19),
                        }}
                        colors={['#FF2626', '#FF9D46']}
                    >
                        <Text style={{color: '#fff', fontSize: pxToDp(22)}}>{list.length ? list.length : 0}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Fragment>
        )
    }
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    cart_left: {
        position: 'absolute',
        left: pxToDp(20),
        bottom: pxToDp(20),
        width: pxToDp(90),
        zIndex: 999
    },
    cart_info: {
        flex: 1,
        height: pxToDp(98),
        marginLeft: pxToDp(150),
        justifyContent: 'center',
    },
    cart_btn: {
        width: pxToDp(250),
        height: pxToDp(98),
        textAlign: 'center',
        lineHeight: pxToDp(98),
        color: '#fff',
        fontSize: pxToDp(32)
    }
})
