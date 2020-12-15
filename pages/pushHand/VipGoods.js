/**
 * 推手 --- vip专区
 * */
import React, {Component} from "react";
import {
	View,
	Image,
	TouchableOpacity,
	Text,
	StyleSheet,
    ScrollView,
    FlatList,
    ImageBackground,
} from "react-native";
import fun from '../../assets/styles/FunctionStyle';
import NavigationBar from '../../component/NavigationBar';
import pxToDp from "../../util/pxToDp";
import {getGoodType,getGoodList} from "./../../api/pushHandApi"
import {I18n} from './../../lang/index'

const GoodsItem = (props) => {
    const {goods_image_url,zhuan_money,show_price,goods_name,gid} = props.goods
    console.log(goods_image_url,'goods_image_url')
    return (
        <TouchableOpacity style={[{width: pxToDp(326)}]} onPress={()=>{props.jump(gid)}}>
            <ImageBackground style={[{width: pxToDp(326), height: pxToDp(326), borderRadius: pxToDp(20), position: 'relative'}]} resizeMode="cover" source={{uri:goods_image_url}}>
                <View style={[{
                    height: pxToDp(40),
                    borderRadius: pxToDp(20),
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    paddingLeft: pxToDp(40),
                    paddingRight: pxToDp(40),
                    }, fun.f_bg_red]}>
                    <Text style={[fun.f_c_white, fun.f_fs30, {lineHeight: pxToDp(40)}]}>{I18n.t('FlashSaleScreen.text8')}{zhuan_money}</Text>
                </View>
            </ImageBackground>
            <View style={{paddingTop: pxToDp(20), paddingBottom: pxToDp(20)}}>
                <Text style={[fun.f_fs30, fun.f_c_24]} numberOfLines={1}>{goods_name}</Text>
                <Text style={[fun.f_fs28, fun.f_c_red, {marginTop: pxToDp(20)}]} numberOfLines={1}>Ks {show_price}</Text>
            </View>
        </TouchableOpacity>
    );
}
let pn = 1;
let hasmore = true;
let typeId = 1
let ifLabel = false
const TabItem = (props) => {
    return (
        <TouchableOpacity style={[fun.f_center, {height: pxToDp(88), paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}]} onPress={props._onPress}>
            <Text style={[fun.f_fs30, fun.f_c_24]}>{props.name}</Text>
        </TouchableOpacity>
    )
}

export default class VipGoods extends Component{
    constructor(props) {
        super(props);
        this.state = {
            goodsList: null,
            tabList : null
        };
        this.jumpToDetail = this.jumpToDetail.bind(this)
        this.tabChange = this.tabChange.bind(this)
    }
    componentDidMount() {
        this.getGoodsType()
    }
    jumpToDetail (id) {
        this.props.navigation.navigate('GoodsDetailNew', {'gid': id});
    }
    getGoodsType () {
        getGoodType({
            key : key
        }).then(res => {
            console.log(res)
            if(res.code === 200){
                this.setState({
                    tabList: res.datas
                })
                let item = res.datas[0]
                this.tabChange(item)
            }
        })
    }
    tabChange (item) {
        typeId = item.gc_id ? item.gc_id : item.id
        ifLabel = item.type ? true : false
        this.getGoodsList()
    }
    getGoodsList () {
        const params = {
            key : key,
            page : 10,
            pn : pn,
            gc_id : typeId
        }
        if(ifLabel){
            params.type = 'label'
        }
        getGoodList(params).then(res => {
            console.log(res,'res')
            if(res.code === 200) {
                if(pn === 1) {
                    list = [...res.datas.goods_list]
                    this.setState({
                        goodsList:res.datas.goods_list
                    })
                } else {
                    let {goodsList} = this.state;
                    this.setState({
                        goodsList:[...goodsList,...res.datas.goods_list]
                    })
                }
                if(res.hasmore){
                    console.log(I18n.t('FlashSaleScreen.text7'))
                    pn++;
                }else{
                    hasmore = false;
                }

            } else {

            }

        }).catch(res => {
            console.log(res,I18n.t('FlashSaleScreen.text6'))
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

    render() {
        const {tabList,goodsList} = this.state
        return (
            <View style={[fun.f_flex1, fun.f_bg_white]}>
                <NavigationBar
					statusBar={{barStyle: "dark-content"}}
					leftButton={this.leftButton()}
                    title={I18n.t('FlashSaleScreen.text5')}
                    popEnabled={false}
                    style={{backgroundColor: "#fff"}}
                />

                <FlatList data={goodsList}
                    numColumns={2}
                    // onEndReachedThreshold={0.3}
                    ListHeaderComponent = {() => {
                        return (
                            <View style={{paddingLeft: pxToDp(20), paddingRight: pxToDp(20)}}>
                                <ScrollView style={{width: '100%', height: pxToDp(88)}} horizontal={true}>
                                    <View style={[fun.f_row_center]}>
                                        {
                                            tabList && tabList.map(item => {
                                                return <TabItem _onPress={() => {this.tabChange(item)}} name={item.gc_name ? item.gc_name : item.push_label_name} />
                                            })
                                        }

                                    </View>
                                </ScrollView>
                            </View>
                        );
                    }}
                    ListEmptyComponent = {() => {
                        return (
                            <View>
                                <Text>{I18n.t('FlashSaleScreen.text4')}</Text>
                            </View>
                        );
                    }}
                    renderItem = {({item, index, separators}) => {
                        return (
                            <View style={[{width: '50%' }, index % 2 == 0 ? styles.item_left : styles.item_right]}>
                                <GoodsItem key={index} goods={item} jump={this.jumpToDetail}/>
                            </View>
                        );
                    }}
                    onEndReached = {() => {
                        if(hasmore){
                            console.log('加载更多')
                            this.getGoodsList()
                        } else {
                            console.log('no more')
                        }
                    }}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    item_left: {
        paddingLeft: pxToDp(40),
    },
    item_right: {
        paddingRight: pxToDp(40),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});
