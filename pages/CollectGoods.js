/*
 * 收藏商品列表页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	ScrollView,
	FlatList,
	Image, StatusBar,
	TouchableOpacity, TouchableWithoutFeedback, DeviceInfo
} from 'react-native';
import CountEmitter from "../util/CountEmitter";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from "../util/pxToDp";

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
import {I18n, LANGUAGE_CHINESE, LANGUAGE_ENGLISH, LANGUAGE_MIANWEN} from './../lang/index'
import PriceUtil from '../util/PriceUtil'
import StorageUtil from "../util/StorageUtil";

var Dimensions = require('Dimensions');
const rows = 10;
let pn = 1;
let hasmore = true;
export default class CollectGoods extends Component{
	constructor(props){
		super(props);
		this.state = {
			refresh_webview: 0,//是否刷新页面，0为不刷新，1为刷新
			collectLists: [],
			sldtoken: '',
			pn: 1,
			ishasmore: false,
			refresh: false,
			showLikePart: false,
			showLikePartData: [],//猜你喜欢的数据
			currentBody: '1',
			collectStoreList: [],
			refresh2: false,
			language: 0
		}
	}

	componentWillMount(){
		if(key){
			//获取收藏的数据
			this.initPage(key, 1);
			this.getRecommnd();
			this.getCollectStore();
		}else{
			//没有找到的情况下应该跳转到登录页
			this.props.navigation.navigate('Login');
		}

	}

	componentDidMount(){
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                });
            }
        });

		this.props.navigation.addListener("willFocus", payload => {
			if(key){
				this.initPage(key, 1);
			}
		});
		//更新页面
		CountEmitter.addListener('updateOrderDetailList', () => {
			const {refresh_webview} = this.state;
			this.setState({
				refresh_webview: refresh_webview + 1,
			});
		});
	}

	getRecommnd = () => {
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getRecGoodsList&key=' + key)
			.then(result => {
				if(result.code == 200){
					this.setState({
						showLikePartData: result.datas.goods_list
					});
				}
			})
			.catch(error => {
			})
	}

	initPage = (key, curpage, type = 0) => {
		RequestData.postSldData(AppSldUrl + '/index.php?app=userfollow&mod=favorites_list', {
			key: key,
			rows: rows,
			pn: curpage
		})
			.then(result => {
				if(result.datas.error){
					ViewUtils.sldToastTip(result.datas.error);
				}else{
					let pn = this.state.pn;
					let ishasmore = this.state.ishasmore;
					if(result.hasmore){
						pn = pn + 1;
					}
					ishasmore = result.hasmore;
					if(result.datas.favorites_list.length == 0){
						this.setState({showLikePart: true});

					}else{
						let collectLists = this.state.collectLists;

						if(type == 'reset' || curpage == 1){
							collectLists = result.datas.favorites_list;
						}else{
							collectLists = collectLists.concat(result.datas.favorites_list);
						}

						this.setState({
							collectLists: collectLists,
							pn: pn,
							ishasmore: ishasmore,
							showLikePart: false
						});
					}
				}
			})
			.catch(error => {
				ViewUtils.sldToastTip(error);
			})
	}
	cancelCollect = (gid) => {
		RequestData.postSldData(AppSldUrl + '/index.php?app=userfollow&mod=favorites_del', {
			fav_id: gid,
			key: key
		})
			.then(result => {
				if(result.datas.error){
					ViewUtils.sldToastTip(result.datas.error);
				}else{
					ViewUtils.sldToastTip(I18n.t('CollectGoods.text1'));
					//重新组装数据
					let olddata = this.state.collectLists;
					let newdata = [];
					for(let i = 0; i < olddata.length; i++){
						if(olddata[ i ].gid != gid){
							newdata.push(olddata[ i ]);
						}
					}

					if(newdata.length == 0){
						this.setState({showLikePart: true});
						// this.getShowLikeList();
					}

					this.setState({
						collectLists: newdata,
					});
				}
			})
			.catch(error => {
				ViewUtils.sldToastTip(error);
			})

	}

	//头部组件
	headerComponet = () => {
		return (
			<Image style={ {width: 100, height: 100} } source={ require('../assets/images/logo.png') }/>
		);
	}
	//flatlist分隔组件
	separatorComponent = () => {
		return (
			<View style={ styles.newline }/>
		);
	}
	//下拉刷新
	onRefresh = () => {
		this.setState({
			refresh: true,
		});
		this.initPage(key, 1, 'reset');
		this.setState({
			refresh: false,
		});
	}
	//上拉加载
	getNewData = () => {
		const {pn, ishasmore} = this.state;
		if(ishasmore){
			this.initPage(key, pn);
		}
	}
	//进入商品详情页
	goGoodsDetail = (gid) => {
		this.props.navigation.navigate('GoodsDetailNew', {'gid': gid});
	}


	//切换事件
	changePage = (type) => {
		this.setState({
			currentBody: type,
		});

	}

	handleMessage = (datajson) => {
		ViewUtils.goDetailPageNew(this.props.navigation, datajson);
	}

	getCollectStore(){
		RequestData.postSldData(AppSldUrl + '/index.php?app=vendorfollow&mod=flist', {
			key
		}).then(res => {
			if(res.code == 200){
				this.setState({
					collectStoreList: res.datas.favorites_list
				})
			}
		})
	}

	refresh2 = () => {
		this.getCollectStore();
	}

	delVendor = (vid) => {
		RequestData.postSldData(AppSldUrl + '/index.php?app=vendorfollow&mod=fdel', {
			vid, key
		}).then(res => {
			if(res.code == 200){
				ViewUtils.sldToastTip(I18n.t('CollectGoods.text2'));
				let {collectStoreList} = this.state;
				for(let i = 0; i < collectStoreList.length; i++){
					if(collectStoreList[i].vid==vid){
						collectStoreList.splice(i,1);
						break;
					}
				}
				this.setState({
					collectStoreList
				})
			}else{
				ViewUtils.sldToastTip(res.msg)
			}
		})
	}

	//店铺item
	renderItem = (item) => {
		const { language } = this.state
		return (
            <View style={ styles.store_item }>
                <TouchableOpacity
					style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
                    activeOpacity={ 1 }
                    onPress={() => {
                        this.props.navigation.navigate('Vendor', {vid: item.vid})
                    }}
				>
                    <Image
                        style={{marginLeft: 15, width: pxToDp(96), height: pxToDp(96)}}
                        resizeMode={ 'contain' }
                        source={{uri: item.store_avatar_url}}
                    />
                    <View style={{marginLeft:10, flex: 1, height: '100%'}}>
                        <Text style={{color: '#333', fontSize: pxToDp(32)}}>{ item.store_name }</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
							<View style={{flex: 1}}>
                                <Text
									style={[styles.info_txt_s, {fontSize: language === LANGUAGE_MIANWEN ? 10 : 12}]}
									numberOfLines={1}
								>
                                    {I18n.t('CollectGoods.people')}：{item.store_collect}
								</Text>
							</View>
							<View style={{marginLeft: 8}}>
                                <Text
									style={[styles.info_txt_s, {fontSize: language === LANGUAGE_MIANWEN ? 10 : 12}]}
									numberOfLines={1}
								>
                                    {I18n.t('CollectGoods.soldout')}：{item.goods_count}
								</Text>
							</View>
                        </View>
                    </View>
                </TouchableOpacity>
				{/*删除按钮*/}
                <TouchableOpacity
                    style={styles.del_btn}
                    activeOpacity={ 1 }
                    onPress={ () => this.delVendor(item.vid) }
                >
                    <Image
                        source={ require('../assets/images/del.png') }
                        style={ {width: pxToDp(30), height: pxToDp(30), tintColor: '#999'} }
                        resizeMode={ 'contain' }
                    />
                </TouchableOpacity>
            </View>
		)
	}

	render(){
		const {currentBody, showLikePartData, refresh_webview, language} = this.state;
		return (
			<View style={ styles.container }>
				<View style={ [ {backgroundColor: '#fff'} ] }>
					<View style={ styles.statusBar }>
						<StatusBar style={ {barStyle: 'default'} }/>
					</View>
					<View style={ styles.navBar }>
						<View style={ styles.navBarButton }>
							{
								ViewUtils.renSldLeftButton(this.props.navigation, require('../assets/images/goback.png'))
							}
						</View>
						<View style={ [ styles.navBarTitleContainer, this.props.titleLayoutStyle ] }>
							<View style={ [styles.goods_title_wrap, {width: language === LANGUAGE_MIANWEN ? 240 : 180}] }>
								{/*商品收藏*/}
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={() => {
										this.changePage('1');
									}}>
									<View style={ [ styles.sld_goods_title_common, currentBody == '1' ? styles.goods_title_cur_goods : '', {width: language === LANGUAGE_MIANWEN ? 120 : 90} ] }>
										<Text style={{color: currentBody == '1' ? '#fff' : '#333', fontSize: language === LANGUAGE_MIANWEN ? 10 : 14}}>{I18n.t('CollectGoods.collect')}</Text>
									</View>
								</TouchableOpacity>
								{/*店铺收藏*/}
								<TouchableOpacity
									activeOpacity={ 1 }
									onPress={() => {
										this.changePage('2');
									}}>
									<View
										style={[ styles.sld_goods_title_common, currentBody == '2' ? styles.goods_title_cur_detail : '', {width: language === LANGUAGE_MIANWEN ? 120 : 90}]}>
										<Text style={{color: currentBody == '2' ? '#fff' : '#333', fontSize: language === LANGUAGE_MIANWEN ? 10 : 14}}>{I18n.t('CollectGoods.shop')}</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				<View style={ GlobalStyles.line }/>
				{
					currentBody == 1 &&
                    <View>
						<FlatList
                            style={ {marginTop: pxToDp(20)} }
                            onRefresh={ () => this.onRefresh() }
                            refreshing={ this.state.refresh }
                            onEndReachedThreshold={ 0.3 }
                            onEndReached={ () => this.getNewData() }
                            ItemSeparatorComponent={ () => this.separatorComponent() }
                            data={ this.state.collectLists }
                            renderItem={({item}) =>
                                <View style={ [ styles.topic ] }>
                                    <View style={ styles.sld_like_part_list }>
                                        <TouchableWithoutFeedback
                                            onPress={() => this.goGoodsDetail(item.gid)}>
                                            <Image style={ styles.sld_like_part_img } source={{uri: item.goods_image_url}}/>
                                        </TouchableWithoutFeedback>
                                        <View style={ styles.sld_like_part_right }>
                                            <TouchableWithoutFeedback
                                                onPress={ () => this.goGoodsDetail(item.gid) }>
                                                <Text ellipsizeMode='tail' numberOfLines={1} style={[ styles.sld_like_part_title, GlobalStyles.sld_global_font ]}>{item.goods_name}</Text>
                                            </TouchableWithoutFeedback>
                                            <TouchableWithoutFeedback
                                                onPress={ () => this.goGoodsDetail(item.gid) }>
                                                <Text ellipsizeMode='tail' numberOfLines={1} style={[ styles.sld_like_part_chuildtitle, GlobalStyles.sld_global_font ]}/>
                                            </TouchableWithoutFeedback>
                                            <View style={ styles.sldcanclepart }>
                                                <TouchableWithoutFeedback
                                                    onPress={ () => this.goGoodsDetail(item.gid) }>
                                                    <Text style={ styles.sld_like_part_price }>ks{PriceUtil.formatPrice( item.show_price * 1 )}</Text>
                                                </TouchableWithoutFeedback>
                                                <TouchableWithoutFeedback
                                                    onPress={ () => this.cancelCollect(item.gid) }>
                                                    <Text style={ [ styles.sld_like_part_cancle_col, GlobalStyles.sld_global_font ] }>{I18n.t('CollectGoods.nocollect')}</Text>
                                                </TouchableWithoutFeedback>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            }
                        />
                        <ScrollView style={ {display: this.state.showLikePart ? 'flex' : 'none'} }>
                            <View style={ [ styles.emptypart ] }>
                                <Image style={ {width: pxToDp(100), height: pxToDp(100), marginTop: pxToDp(100)} }
                                       source={ require('../assets/images/emptysldcollect.png') }/>
                                <Text
                                    style={ [ {color: '#999'}, {marginTop: pxToDp(20)}, {marginBottom: pxToDp(100)}, GlobalStyles.sld_global_font ] }>{I18n.t('CollectGoods.text3')}</Text>
                            </View>
                            <View style={ {
                                height: pxToDp(80),
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                paddingLeft: 15,
                            } }>
                                <Text style={ {color: '#333', fontSize: pxToDp(30)} }>{I18n.t('CollectGoods.hot')}</Text>
							</View>
                            <View style={ GlobalStyles.line }/>
                            <View
								style={{
                                    flexDirection: "row",
                                    flexWrap: 'wrap',
                                    display: this.state.showLikePart ? 'flex' : 'none',
                                    backgroundColor: '#fff',
                                    paddingBottom: pxToDp(140)
								}}
							>
                                {
                                	showLikePartData.map((item, index) => {
                                        return (
                                            <TouchableOpacity key={ index } activeOpacity={ 1 }
                                                              style={ styles.sld_zero_part_list }
                                                              onPress={ () => this.goGoodsDetail(item.gid) }>
                                                <Image style={ styles.sld_zero_part_img } source={ {uri: item.goods_img_url} }/>
                                                <Text ellipsizeMode='tail' numberOfLines={ 2 }
                                                      style={ [ styles.sld_zero_part_title, GlobalStyles.sld_global_font ] }>{ item.goods_name }</Text>

                                                <View style={ {
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: "flex-end",
                                                } }>
                                                    <Text style={ styles.sld_zero_part_price }>ks{PriceUtil.formatPrice( item.show_price )}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
									})
                                }
                            </View>
                        </ScrollView>
                        <View style={ GlobalStyles.iphoneXbottomheight }/>
                    </View>
				}
				{
					currentBody == 2 &&
                    <View style={ {flex: 1} }>
                        {
                            this.state.collectStoreList.length > 0 &&
							<FlatList
                                data={ this.state.collectStoreList }
                                refreshing={ this.state.refresh }
                                extraData={ this.state }
                                onRefresh={ () => this.refresh2() }
                                renderItem={ ({item}) => this.renderItem(item) }
                            />
						}
                        {
                            this.state.collectStoreList.length == 0 &&
                            <View style={ {flex: 1, justifyContent: 'center'} }>
                                {
                                	ViewUtils.noData2({
                                    title: I18n.t('CollectGoods.text4'),
                                    tip: I18n.t('CollectGoods.text5'),
                                    btnTxt:I18n.t('CollectGoods.text6') ,
                                    imgSrc: require('../assets/images/store_w.png'),
                                    callback: () => {
                                        this.props.navigation.navigate('HomeScreenNew');
                                    }
                                })}
                            </View>
						}
                    </View>
				}
			</View>
		)
	}
}
const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
	store_item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: pxToDp(20),
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#e2e2e2',
		borderStyle: 'solid',
		paddingHorizontal: pxToDp(30)
	},
	img: {
		width: pxToDp(96),
		height: pxToDp(96),
		marginRight: pxToDp(30)
	},
	store_info: {
		flex: 1,
		height: pxToDp(96),
		justifyContent: 'space-between'
	},
	info_txt: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	info_txt_s: {
		color: '#333',
	},
	del_btn: {
		width: 50,
        height: 48,
		alignItems: 'center',
		justifyContent: 'center',
	},
	goods_title_cur_goods: {backgroundColor: '#7f7f7f', borderBottomLeftRadius: 4, borderTopLeftRadius: 4},
	goods_title_cur_detail: {backgroundColor: '#7f7f7f', borderBottomRightRadius: 4, borderTopRightRadius: 4},
	goods_title_wrap: {
		height: pxToDp(58),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#7f7f7f',
		borderRadius: 4,
		borderWidth: 0.5
	},
	current_title_text: {color: '#fff', fontSize: 15},
	sld_goods_title_common: {
		height: pxToDp(58),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	navBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
	},
	navBarTitleContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		left: 40,
		top: 0,
		right: 40,
		bottom: 0,
	},
	title: {
		fontSize: 18,
		color: '#333',
	},
	navBarButton: {
		alignItems: 'center',
	},
	statusBar: {
		height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 30 : 20) : 0,
	},
	newline: {
		height: 0.5,
		marginLeft: pxToDp(30),
		marginRight: pxToDp(30),
		width: Dimensions.get('window').width * 1 - pxToDp(60),
		borderColor: '#ebebeb',
	},
	sld_home_searchbar: {
		marginTop: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
	},
	sld_home_search: {
		width: pxToDp(400),
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sldtabbartext: {
		fontSize: pxToDp(34),
		fontWeight: '200',
		color: '#181818',
	},
	sldlineStyle: {
		height: 1,
		backgroundColor: '#000',
	},
	sld_like_part_right: {
		flexDirection: 'column',
		width: Dimensions.get('window').width * 1 - pxToDp(240),
	},
	sld_like_part_title: {
		fontSize: pxToDp(30),
		color: '#333',
		height: pxToDp(42),
		lineHeight: pxToDp(42),
		paddingRight: pxToDp(30),
	},
	sld_like_part_chuildtitle: {
		marginTop: pxToDp(10),
		fontSize: pxToDp(26),
		color: '#666',
		height: pxToDp(36),
		lineHeight: pxToDp(36),

	},
	sld_like_part_price: {
		fontSize: pxToDp(36),
		color: '#ba1418',
		position: 'relative',
		bottom: -pxToDp(30),
	},
	sld_like_part_cancle_col: {
		borderRadius: 4,
		borderWidth: 0.5,
		borderColor: '#707070',
		color: '#333',
		width: pxToDp(160),
		height: pxToDp(64),
		lineHeight: pxToDp(64),
		textAlign: 'center',
		marginRight: pxToDp(20),
		fontSize: pxToDp(28),
		marginTop: pxToDp(20),
	},
	sld_like_part_list: {
		flexDirection: 'row',
		width: Dimensions.get('window').width,
		paddingRight: pxToDp(30),
		backgroundColor: '#fff',
		paddingTop: pxToDp(30),
	},
	sld_like_part_img: {
		width: pxToDp(180),
		height: pxToDp(180),
		marginRight: pxToDp(20),
		marginLeft: pxToDp(20),
	},

	container: {
		flex: 1,
		backgroundColor: '#fafafa',
		marginTop: StatusBar.currentHeight
	},
	item: {
		flexDirection: 'row',
	},
	sldcanclepart: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	emptypart: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	topic: {
		width: Dimensions.get('window').width,
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingBottom: pxToDp(30),
	},

	topicHead: {
		fontSize: pxToDp(34),
		color: '#181818',
		padding: pxToDp(32),
		paddingLeft: 0,
	},
	topicItem: {
		width: pxToDp(210),
		marginLeft: pxToDp(30),
	},
	topicImg: {
		width: pxToDp(210),
		height: pxToDp(210),
		borderColor: 'red',
		borderRadius: 2,
	},
	topicContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: pxToDp(20),
	},
	topicTitle: {
		fontSize: pxToDp(30),
		color: '#141414',
		width: pxToDp(210),
		marginTop: pxToDp(34),
	},
	topicDesc: {
		fontSize: pxToDp(30),
		color: '#ba1418',
		marginTop: pxToDp(24),
	},
	goods_recommond: {
		flexDirection: 'row',
		justifyContent: 'center',
		fontSize: pxToDp(34),
		color: '#181818',
		height: pxToDp(100),
		lineHeight: pxToDp(100),
	},
	sld_zero_part_img: {
		width: (Dimensions.get('window').width * 1 - 45) / 2,
		height: (Dimensions.get('window').width * 1 - 45) / 2,
	},
	sld_zero_part_last: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	sld_zero_part_title: {
		width: (Dimensions.get('window').width * 1 - 45) / 2,
		fontSize: pxToDp(30),
		height: pxToDp(110),
		lineHeight: pxToDp(55),
		color: '#333',
	},
	sld_zero_part_chuildtitle: {
		width: pxToDp(280),
		fontSize: pxToDp(26),
		color: '#967d56',
		overflow: 'hidden',
		height: pxToDp(30),
		lineHeight: pxToDp(30),
		marginTop: pxToDp(10),
	},
	sld_zero_part_price: {
		color: '#ba1418',
		fontSize: pxToDp(36),
	},
	sld_zero_part_list: {
		width: (Dimensions.get('window').width * 1 - 45) / 2,
		flexDirection: 'column',
		marginLeft: 15,
		marginTop: 15,
		marginBottom: 15,
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
		height: pxToDp(176),
	},
	sld_rec_style: {
		height: pxToDp(134),
		lineHeight: pxToDp(134),
		color: '#999',
	},
});
