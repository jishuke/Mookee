/*
* 个人中心页面
* @slodon
* */
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    Dimensions
} from 'react-native';
import GlobalStyles from '../assets/styles/GlobalStyles';
import TabNavigator from 'react-native-tab-navigator';
import FoundScreen from "../screen/FoundScreen";
import CartScreen from "../screen/CartScreen";
import MyScreen from "../screen/MyScreen";
import SecondCat from "../pages/SecondCat";
import PaymentType from "../pages/PaymentType";
import {I18n} from './../lang/index'
export default class NewScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab:'home'
        }
    }

    componentDidMount() {

    }
    clear = () => {
        this.setState({value: ''});
    };
    _renderTab(Component, selectedTab, title, renderIcon) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                selectedTitleStyle={{color:'#db7b19'}}
                title={title}
                titleStyle={[styles.sldtitletext,GlobalStyles.sld_global_font]}
                renderIcon={() => <Image style={styles.sld_bottom_nav} source={renderIcon}/>}
                renderSelectedIcon={() => <Image  style={[styles.sld_bottom_nav,{tintColor:'#db7b19'}]} source={renderIcon} />}
                onPress={() => this.setState({ selectedTab: selectedTab })}>
                <Component data={this.props}/>
            </TabNavigator.Item>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator style={styles.sld_common_bottom}>
                    {this._renderTab(PaymentType,'home',I18n.t('NewScreen.home'),require('../assets/images/home.png'))}
                    {this._renderTab(SecondCat,'category',I18n.t('NewScreen.category'),require('../assets/images/category.png'))}
                    {this._renderTab(FoundScreen,'found',I18n.t('NewScreen.found'),require('../assets/images/found.png'))}
                    {this._renderTab(CartScreen,'cart',I18n.t('NewScreen.cart'),require('../assets/images/cart.png'))}
                    {this._renderTab(MyScreen,'slodon',I18n.t('NewScreen.slodon'),require('../assets/images/center.png'))}
                </TabNavigator>
            </View>
        )
    }
}


const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
    homeSearchimg: {
        width: 15,
        height: 15,
        marginTop: 7,
        marginRight: 2,
        marginLeft: 88
    },
    homeSearchcon: {
        width: 400,
        height: 60,
        flexDirection: 'row',
    },
    homesearchcons: {
        flexDirection: 'row', backgroundColor: '#ebebeb', height: 30,

        borderRadius: 4,
    },
    homenotice: {
        width: 114,
    },
    homenoticeimg: {
        width: 22,
        height: 22,
    },
    sld_home_searchbar: {
        marginTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    },
    sld_home_search: {
        width: 200,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sldtabbartext: {
        fontSize: 17,
        fontWeight: '200',
        color: '#181818',
    },
    sldlineStyle: {
        height: 1,
        backgroundColor: '#000',
    },
    sld_wrap_lunbo: {
        width: Dimensions.get('window').width,
        height: 250,
        backgroundColor: '#fff',
        paddingTop: 8,
    },
    sld_home_banner: {
        height: 193,
        width: Dimensions.get('window').width * 1 - 30,
        marginLeft: 15,
    },

    paginationStyle: {
        bottom: 6,
    },
    dotStyle: {
        width: 8,
        height: 8,
        backgroundColor: '#a0a0a0',
        borderRadius: 4,
        marginTop: 11,
        marginBottom: 5,
        marginRight: 5,
    },
    activeDotStyle: {
        width: 8,
        height: 8,
        backgroundColor: '#d57812',
        borderRadius: 4,
    },
    sld_zero_part_img: {
        width: 165,
        height: 165,
    },
    sld_zero_part_last: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sld_zero_part_title: {
        width: 165,
        fontSize: 16,
        color: '#181818',
    },
    sld_zero_part_chuildtitle: {
        width: 140,
        fontSize: 13,
        color: '#967d56',
        overflow: 'hidden',
        height: 15,
        lineHeight: 15,
        marginTop: 5,
    },
    sld_zero_part_price: {
        color: '#ba1418',
        fontSize: 17,
        marginTop: 10,
    },
    sld_zero_part_list: {
        width: 165,
        flexDirection: 'column',
        marginLeft: 15,
    },
    sld_two_img: {
        flexDirection: 'row',
    },
    sld_home_zero_list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sld_home_two_img: {
        width: Dimensions.get('window').width / 2,
        height: 88,
    },
    sld_like_part_right: {
        flexDirection: 'column',
        height: 120,
        width: Dimensions.get('window').width * 1 - 140,
    },
    sld_like_part_title: {
        fontSize: 16,
        color: '#181818',
        height: 42,
        lineHeight: 21,
        paddingRight: 15,
    },
    sld_like_part_chuildtitle: {
        marginTop: 5,
        fontSize: 13,
        color: '#747474',
        height: 36,
        lineHeight: 18,
        paddingRight: 15,

    },
    sld_like_part_price: {
        fontSize: 18,
        color: '#ba1418',
        position: 'relative',
        bottom: -10,
    },
    sld_like_part_list: {
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        marginRight: 15,
    },
    sld_like_part_img: {
        width: 120,
        height: 120,
        marginRight: 15,
    },
    sld_home_view_more: {
        fontSize: 12,
        color: '#787878',
        alignItems: 'center',
        paddingBottom: 25,
        paddingTop: 25,
    },
    sld_home_xianshi_time_bg: {
        width: 25,
        height: 25,
        lineHeight: 25,
        color: '#fff',
        fontSize: 12,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    item: {
        flexDirection: 'row',
    },
    leftimage: {
        width: 50,
        height: 50,
    },
    sld_mem_top_bg: {
        width: Dimensions.get('window').width,
        height: 180,
        backgroundColor: '#2c2c2c'
    },

    sld_center_combine: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 20,
        paddingBottom: 20,
    },
    sld_home_heika_img: {
        // 设置宽度
        width: Dimensions.get('window').width,
        // 设置高度
        height: 110,
        // 设置图片填充模式
        resizeMode: 'cover'
    },
    topic: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingBottom: 10,
        marginBottom: 10,
    },

    topicHead: {
        fontSize: 17,
        color: '#181818',
        padding: 16,
        paddingLeft: 0,
    },
    topicItem: {
        width: 105,
        marginLeft: 15,
    },
    topicImg: {
        width: 105,
        height: 105,
        borderColor: 'red',
        borderRadius: 2,
    },
    topicContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    topicTitle: {
        fontSize: 15,
        color: '#141414',
        width: 105,
        marginTop: 17,
    },
    topicDesc: {
        fontSize: 15,
        color: '#ba1418',
        marginTop: 12,
    },
    goods_recommond: {
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 17,
        color: '#181818',
        height: 50,
        lineHeight: 50,
    },
    sld_rec_style: {
        height: 67,
        lineHeight: 67,
        color: '#999',
    },
    sld_xianshi_time_bg: {
        width: 25,
        height: 25,
    },
    sld_xianshi_wrap: {
        position: 'relative',
        marginBottom: 15,
        marginTop: 13,
    },
    sld_home_xianshi_tip: {
        paddingLeft: 4,
        paddingRight: 4,
        color: '#999',
        marginTop: 14,
    },
    homeSldLogo: {
        width: 22,
        height: 22,
    },
    homeSldSearchWrap: {
        paddingTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
        height: 60,
        flexDirection: 'row', paddingBottom: 5,
        backgroundColor: '#fff',
    },
    homelogoimg: {
        width: 30,
        height: 30,
    },
    homelogo: {
        width: 65,
        paddingLeft: 17,

    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    sld_bottom_nav:{
        width:22,
        height:22,
        marginBottom:0,
        marginTop:0,
        paddingBottom:0,
        paddingTop:0,
    },
    sld_common_bottom:{
        height:55,
    },
    sldtitletext:{
        paddingTop:0,
        color:'#303030',
        fontSize:12,
    }
});
