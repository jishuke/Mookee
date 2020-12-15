import SldComStatusBar from "../../component/SldComStatusBar";
import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image, Platform
} from 'react-native';
import ViewUtils from '../../util/ViewUtils';
import GlobalStyles from '../../assets/styles/GlobalStyles';
import RequestData from '../../RequestData';
import pxToDp from "../../util/pxToDp";

export default class LdjStoreDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: '',
            vid: props.navigation.state.params.vid
        }
    }

    componentDidMount() {
        this.getStoreDetail();
    }

    // 获取店铺详细信息
    getStoreDetail() {
        let {vid} = this.state;
        RequestData.postSldData(AppSldUrl + '/index.php?app=dian&mod=dian_info_function&sld_addons=ldj', {
            dian_id: vid
        }).then(res => {
            if (res.status == 200) {
                this.setState({
                    info: res.data
                })
            }
        }).catch(error=>{
            ViewUtils.sldErrorToastTip(error);
        })
    }

    render() {
        const {info} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
                <SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
                { ViewUtils.getEmptyPosition(Platform.OS === 'ios' ? '#fff' : main_ldj_color, pxToDp(0)) }
                <View style={styles.search}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            width: pxToDp(80),
                            height: pxToDp(80),
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={()=>{
                            this.props.navigation.pop()
                        }}
                    >
                        <Image
                            style={{width: pxToDp(16), height: pxToDp(24), marginRight: pxToDp(25)}}
                            resizeMode={'contain'}
                            source={require('../images/back.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.searchwrap}
                        activeOpacity={1}
                        onPress={()=>{
                            this.props.navigation.navigate('LdjSearch', {type: 2, vid: this.state.vid})
                        }}
                    >
                        <Text style={{color: '#BABABA', fontSize: pxToDp(28)}}>搜索本店商品</Text>
                        <Image
                            resizeMode={'contain'}
                            source={require('../images/search.png')}
                            style={{
                                width: pxToDp(27),
                                height: pxToDp(27),
                                marginLeft: pxToDp(10),
                                tintColor: '#BABABA'
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.name}>
                    <Image
                        resizeMode={'contain'}
                        style={{width: pxToDp(120), height: pxToDp(120)}}
                        source={{uri: info.dian_logo}}
                    />
                    <View style={styles.info}>
                        <Text style={{color: '#333', fontSize: pxToDp(32)}}>{info != '' ? info.dian_name : ''}</Text>
                        <Text style={{
                            color: '#999',
                            fontSize: pxToDp(22),
                            marginTop: pxToDp(26)
                        }}>月销{info != '' ? info.month_sales : '--'}</Text>
                    </View>
                </View>

                <View style={styles.gg}>
                    <Text style={{
                        color: '#F33E37',
                        borderRadius: pxToDp(4),
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: pxToDp(54),
                        height: pxToDp(30),
                        lineHeight: pxToDp(30),
                        fontSize: pxToDp(fontSize_20),
                        marginRight: pxToDp(20),
                        borderStyle: 'solid',
                        borderColor: '#F33E37',
                        textAlign: 'center',
                        borderWidth: pxToDp(0.7)
                    }}>公告</Text>
                    <Text style={{
                        color: '#999',
                        fontSize: pxToDp(24)
                    }}>{info != '' ? (info.ldj_notice ? info.ldj_notice : '暂无公告') : '--'}</Text>
                </View>

                <View style={styles.peis}>
                    <Text style={{
                        color: '#333',
                        fontSize: pxToDp(30),
                        marginBottom: pxToDp(28)
                    }}>配送信息</Text>
                    <Text style={{
                        color: '#666',
                        fontSize: pxToDp(24)
                    }}>{info != '' ? info.freight : '--'}</Text>
                </View>

                <View style={styles.store_info}>
                    <View style={styles.title}><Text style={{color: '#333', fontSize: pxToDp(30)}}>商家信息</Text></View>
                    {info != '' && <Text style={{
                        color: '#333',
                        fontSize: pxToDp(26),
                        paddingVertical: pxToDp(20)
                    }}>商家电话：{info.dian_phone}</Text>}
                    {info != '' && <Text style={{
                        color: '#333',
                        fontSize: pxToDp(26),
                        paddingVertical: pxToDp(20)
                    }}>地址：{info.dian_address}</Text>}
                    {info != '' && <Text style={{
                        color: '#333',
                        fontSize: pxToDp(26),
                        paddingVertical: pxToDp(20)
                    }}>营业时间：{info.businessTime}</Text>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    store_info: {
        marginTop: pxToDp(20),
        paddingLeft: pxToDp(30),
        backgroundColor: '#fff'
    },
    title: {
        height: pxToDp(100),
        borderBottomWidth: pxToDp(1),
        borderBottomColor: '#EDEDED',
        borderStyle: 'solid',
        justifyContent: 'center',
    },
    peis: {
        padding: pxToDp(30),
        marginTop: pxToDp(20),
        backgroundColor: '#fff'
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        height: pxToDp(84),
        paddingHorizontal: pxToDp(20),
        backgroundColor: '#5EB319'
    },
    searchwrap: {
        flex: 1,
        height: pxToDp(56),
        borderRadius: pxToDp(6),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    name: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: pxToDp(20),
    },
    info: {
        marginLeft: pxToDp(22),
        flex: 1,
    },
    gg: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: pxToDp(30),
        borderTopWidth: pxToDp(1),
        borderTopColor: '#EAEAEA',
        borderStyle: 'solid',
        height: pxToDp(70),
        backgroundColor: '#fff'
    }
})
