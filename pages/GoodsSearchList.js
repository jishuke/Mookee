/*
 * 二级分类页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	FlatList,
	Image,
	TouchableOpacity,
	DeviceInfo,
	StatusBar,
	DeviceEventEmitter,
} from 'react-native';
import ViewUtils from "../util/ViewUtils";
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from "../RequestData";
import pxToDp from "../util/pxToDp";
import CountEmitter from '../util/CountEmitter';
import LinearGradient from 'react-native-linear-gradient';
import {I18n, LANGUAGE_CHINESE} from './../lang/index'
import PriceUtil from '../util/PriceUtil'
import StorageUtil from "../util/StorageUtil";

var Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class GoodsSearchList extends Component{
	constructor(props){
		super(props);
		const { params } = props.navigation.state
		this.state = {
			showLikePartData: [],//猜你喜欢的数据
			goods_list: [],//相应分类下的商品列表
			keyword: params && params.keyword || '',//搜索关键词
			gc_id: params && params.catid || '',//分类id
			red_id: params && params.redID || '',//优惠券id
			selectIndex: 5,//当前选中的序号
			showPricePanel: false,//是否展示价格选择面板
			flag: false,//当flag为true时加载数据
			pn: 1,//当前页
			page: 8,//每页数量
			hasmore: true,//是否还有数据
			refresh: false,//是否刷新
			show_gotop: false,
			source: params && params.source || '',
			price_from: '',      // 价格区间
			price_to: '',
			area_id: '',      // 地址id
			order: '',        // 1： 升序   2：降序
			order_key: '',   // 筛选条件
			own_shop: '',   // 是否自营
			showType: 'list',   // 商品列表展示方式
			area: '',
			hasFilter: false,
			language: 1
		}
	}

	componentWillMount(){
        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                this.setState({
                    language: object
                });
                this.getSearchLists(null, object);
            } else {
                this.setState({
                    language: LANGUAGE_CHINESE
                });
                this.getSearchLists(null, LANGUAGE_CHINESE);
            }
        });

		this.lister = DeviceEventEmitter.addListener('filter', (e) => {
			let hasFilter = false;
			for(let i in e){
				if(e[ i ] || e[ i ] === 0){
					hasFilter = true;
				}
			}
			this.setState({
				...e,
				hasFilter,
				pn: 1,
				hasmore: true,
			}, () => {
                StorageUtil.get('language', (error, object) => {
                    if (!error && object) {
                        this.setState({
                            language: object
                        });
                        this.getSearchLists(null, object);
                    } else {
                        this.setState({
                            language: LANGUAGE_CHINESE
                        });
                        this.getSearchLists(null, LANGUAGE_CHINESE);
                    }
                });
			})
		})

		this.lister2 = DeviceEventEmitter.addListener('search_page', e => {
			if (e) {
                this.setState({
                    keyword: e.keyword,
                    source: e.source
                })
                StorageUtil.get('language', (error, object) => {
                    if (!error && object) {
                        this.setState({
                            language: object
                        });
                        this.getSearchLists(e.keyword, object);
                    } else {
                        this.setState({
                            language: LANGUAGE_CHINESE
                        });
                        this.getSearchLists(e.keyword, LANGUAGE_CHINESE);
                    }
                });
			}
		})
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

		if(this.state.keyword != ''){
			this.setHistoryData(this.state.keyword);
		}
	}

	componentWillUnmount() {
		this.lister.remove()
		this.lister2.remove()
	}

	setHistoryData = (keyword) => {
		storage.load({
			key: "hisSldSearch",
			autoSync: false,
			syncInBackground: true
		})
			.then(ret => {
				//缓存存在
				//关键词转数组
				var his_search_array = ret ? ret.split(',') : [];
				his_search_array.unshift(keyword);

				// 最多取30条，不重复且不为空的数据
				his_search_array = his_search_array.reduce(function(a, b){
					(a.length <= 30 && b && a.indexOf(b) == -1) ? a.push(b) : null;
					return a;
				}, []);

				storage.save({
					key: 'hisSldSearch',  // 注意:请不要在key中使用_下划线符号!
					data: his_search_array.join(','),
				});
			})
			.catch(err => {
				storage.save({
					key: 'hisSldSearch',  // 注意:请不要在key中使用_下划线符号!
					data: keyword,
				});
			});
	}


	//根据条件查询商品
	getSearchLists = (keyword_search, language) => {
		//获取查询条件
		let {
			keyword,
			gc_id,
			pn,
			page,
			red_id,
			price_from,
			price_to,
			area_id,
			order,
			order_key,
			own_shop,
		} = this.state;

		if (keyword_search) {
			keyword = keyword_search
			pn = 1
		}

		let params = {keyword, gc_id, pn, page, red_id, price_from, price_to, area_id, order, order_key, own_shop};

		let url = AppSldUrl + '/index.php?app=goods&mod=goods_list';

		for(let i in params){
			if(params[ i ]){
				url += `&${ i }=${ params[ i ] }`
			}
		}
		if(CitySite.bid != undefined && CitySite.bid > 0){
			url += '&bid=' + CitySite.bid;
		}
		url += '&lang_type=' + language;

		RequestData.getSldData(url)
			.then(result => {
				// console.log('搜索结果；', result)
				if(result.datas.error){
					ViewUtils.sldToastTip(result.datas.error);
					this.setState({
						refresh: false,
						flag: true,
					});
				} else{
					let {goods_list, refresh, hasmore} = this.state;
					if(refresh){
						refresh = false;
					}
					if(pn == 1){
						goods_list = result.datas.goods_list;
					}else{
						goods_list = goods_list.concat(result.datas.goods_list);
					}
					if(pn < result.page_total){
						pn = pn + 1;
						hasmore = true;
					}else{
						hasmore = false;
					}
					this.setState({
						goods_list: goods_list,
						pn: pn,
						hasmore: hasmore,
						refresh: refresh,
						flag: true,
					});
				}
			})
			.catch(error => {
				ViewUtils.sldToastTip(error);
				this.setState({
					refresh: false,
					flag: true,
				});
			})
	}

	//进入商品详情页
	goGoodsDetail = (gid) => {
		this.props.navigation.navigate('GoodsDetailNew', {'gid': gid});
	}

	//设置当前选中的类别序号,如果是价格，则要展示筛选面板，否则的话 要关闭筛选面板
	selectFilter = (index, key, sortOrder) => {
		let {showPricePanel} = this.state;
		if(showPricePanel){
			this.setState({
				showPricePanel: false
			})
		}
		if(index == 1){  // 综合
			this.setState({
				showPricePanel: !showPricePanel,
			})
		}else if(index == 3){   // 价格
			let {order} = this.state;
			this.setState({
				pn: 1,
				hasmore: true,
				order: order == 1 ? 2 : 1,
				order_key: 3,
				selectIndex: index,
			}, () => {
                StorageUtil.get('language', (error, object) => {
                    if (!error && object) {
                        this.setState({
                            language: object
                        });
                        this.getSearchLists(null, object);
                    } else {
                        this.setState({
                            language: LANGUAGE_CHINESE
                        });
                        this.getSearchLists(null, LANGUAGE_CHINESE);
                    }
                });
			});
		}else if(index == 4){   // 筛选
			let {
				price_from,
				price_to,
				area_id,
				area,
				own_shop
			} = this.state;
			let params = {price_from, price_to, area_id, area, own_shop};
			this.props.navigation.navigate('GoodsFilter', params)
		}else{    // 其他
			this.setState({
				pn: 1,
				hasmore: true,
				order: sortOrder,
				order_key: key,
				selectIndex: index,
			}, () => {
                StorageUtil.get('language', (error, object) => {
                    if (!error && object) {
                        this.setState({
                            language: object
                        });
                        this.getSearchLists(null, object);
                    } else {
                        this.setState({
                            language: LANGUAGE_CHINESE
                        });
                        this.getSearchLists(null, LANGUAGE_CHINESE);
                    }
                });
			})
		}

	}

	//下拉刷新
	onRefresh = () => {
		this.setState({
			refresh: true,
			pn: 1
		}, () => {
            StorageUtil.get('language', (error, object) => {
                if (!error && object) {
                    this.setState({
                        language: object
                    });
                    this.getSearchLists(null, object);
                } else {
                    this.setState({
                        language: LANGUAGE_CHINESE
                    });
                    this.getSearchLists(null, LANGUAGE_CHINESE);
                }
            });
		});
	}

	//上拉加载
	getNewData = () => {
		const {hasmore} = this.state;
		if(hasmore){
            StorageUtil.get('language', (error, object) => {
                if (!error && object) {
                    this.setState({
                        language: object
                    });
                    this.getSearchLists(null, object);
                } else {
                    this.setState({
                        language: LANGUAGE_CHINESE
                    });
                    this.getSearchLists(null, LANGUAGE_CHINESE);
                }
            });
		}
	}

	//尾部组件
	footerView = () => {
		const {goods_list, pn, hasmore} = this.state;
		let content = <View/>;

		if(goods_list.length > 0 || pn > 1){
			content = hasmore ?
                <View style={ styles.flatlist_footer_view }>
                    <Text style={ styles.flatlist_footer_text }>loading…</Text>
                </View> : <View style={ styles.flatlist_footer_view }>
                    <View style={ styles.footer_line }/>
                    <Image
                        style={ {
                            width: pxToDp(30),
                            height: pxToDp(30),
                            marginHorizontal: pxToDp(10)
                        } }
                        resizeMode={ 'contain' }
                        source={ require('../assets/images/footer_n.png') }
                    />
                    <Text style={ {color: '#949494', fontSize: pxToDp(22), marginRight: pxToDp(10)} }>{I18n.t('com_PinTuan.di_line')}</Text>
                    <View style={ styles.footer_line }/>
                </View>
		}
		return content;
	}

	//渲染数据
	renderListCell = (item) => {
		console.warn('ww:goodSearchList', item);

		return <TouchableOpacity
			activeOpacity={ 1 }
			style={ styles.goods_show_list }
			onPress={ () => this.goGoodsDetail(item.gid) }
		>
			<View style={ styles.show_list_img }>
				<Image style={ styles.show_list_img_i } resizeMode={ 'contain' }
				       source={ {uri: item.goods_image_url} }
							 defaultSource={require('../assets/images/default_icon_400.png')}
				/>
			</View>

			<View style={ styles.show_list_info }>
				<Text
					style={ styles.goods_name }
					ellipsizeMode='tail'
					numberOfLines={ 2 }
				>
					{ item.goods_name }
				</Text>

				<Text
					style={ styles.jingle }
					ellipsizeMode='tail'
					numberOfLines={ 1 }
				>
					{ item.goods_jingle }
				</Text>

				<View style={ styles.price_wrap }>
					<Text style={ {color: '#E1251B', fontSize: pxToDp(24), marginRight: pxToDp(20)} }>
						Ks<Text style={ {fontSize: pxToDp(36)} }>{PriceUtil.formatPrice(item.show_price)}</Text>
					</Text>
				</View>

				<View style={ styles.goods_type }>

					{ item.promotion_type != undefined && item.promotion_type == 'pin_tuan' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FF6000', '#FF9C00' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PinTuanOrder')}</Text>
					</LinearGradient> }

					{ item.promotion_type != undefined && item.promotion_type == 'pin_ladder_tuan' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FC1C1C', '#FF5539' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PinLadderOrder')}</Text>
					</LinearGradient> }


					{ item.promotion_type != undefined && item.promotion_type == 'tuan' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FF2A00', '#FF0042' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.grouppurchase')}</Text>
					</LinearGradient> }


					{ item.promotion_type != undefined && item.promotion_type == 'xianshi' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FF6C00', '#FFC053' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PROMOTION')}</Text>
					</LinearGradient> }

					{ item.promotion_type != undefined && item.promotion_type == 'p_mbuy' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#6A4DFF', '#6269FE' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PhoneExclusive')}</Text>
					</LinearGradient> }
				</View>
				{ item.is_push_goods === '1' &&
					<View style={styles.goods_push_info}>
						<View style={styles.goods_push_info_inner}>
							<Text style={styles.goods_push_info_text}>{I18n.t('GoodsSearchList.earn')}Ks {PriceUtil.formatPrice(item.push_price)}</Text>
						</View>
					</View>
				}


				<View style={ styles.goods_store }>
					<Text style={ styles.store_txt }>{ item.store_name }</Text>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.go_store }
						onPress={ () => this.props.navigation.navigate('Vendor', {'vid': item.vid}) }
					>
						<Text style={ {color: '#2D2D2D', fontSize: pxToDp(22)} }>{I18n.t('GoodsSearchList.Gostore')}</Text>
						<Image
							source={ require('../assets/images/arrow_right_b.png') }
							style={ {
								width: pxToDp(11),
								height: pxToDp(18),
								marginLeft: pxToDp(6)
							} }
							resizeMode={ 'contain' }
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	}

	renderGridCell = (item) => {
		return <TouchableOpacity
			activeOpacity={ 1 }
			style={ styles.goods_show_grid }
			onPress={ () => this.goGoodsDetail(item.gid) }
		>
			<View style={ styles.show_list_img2 }>
				<Image style={ styles.show_list_img2 } resizeMode={ 'contain' } source={ {uri: item.goods_image_url} } defaultSource={require('../assets/images/default_icon_400.png')}/>
			</View>

			<View style={ styles.show_grid_info }>
				<Text
					style={ styles.goods_name }
					ellipsizeMode='tail'
					numberOfLines={ 2 }
				>
					{ item.goods_name }
				</Text>

				<Text
					style={ styles.jingle }
					ellipsizeMode='tail'
					numberOfLines={ 1 }
				>
					{ item.goods_jingle }
				</Text>

				<View style={ styles.price_wrap }>
					<Text style={ {color: '#E1251B', fontSize: pxToDp(24), marginRight: pxToDp(20)} }>Ks <Text
						style={ {fontSize: pxToDp(36)} }>{PriceUtil.formatPrice(item.show_price)}</Text></Text>
					{/*<Text style={ {color: '#949494', fontSize: pxToDp(22)} }>{ item.goods_salenum }{I18n.t('GoodsSearchList.payment')}</Text>*/}
				</View>

				<View style={ styles.goods_type }>

					{ item.promotion_type != undefined && item.promotion_type == 'pin_tuan' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FF6000', '#FF9C00' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PinTuanOrder')}</Text>
					</LinearGradient> }

					{ item.promotion_type != undefined && item.promotion_type == 'pin_ladder_tuan' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FC1C1C', '#FF5539' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PinLadderOrder')}</Text>
					</LinearGradient> }


					{ item.promotion_type != undefined && item.promotion_type == 'tuan' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FF2A00', '#FF0042' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.grouppurchase')}</Text>
					</LinearGradient> }


					{ item.promotion_type != undefined && item.promotion_type == 'xianshi' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#FF6C00', '#FFC053' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PROMOTION')}</Text>
					</LinearGradient> }

					{ item.promotion_type != undefined && item.promotion_type == 'p_mbuy' &&
					<LinearGradient
						style={ styles.goods_type_item }
						colors={ [ '#6A4DFF', '#6269FE' ] }
					>
						<Text style={ styles.goods_type_txt }>{I18n.t('GoodsSearchList.PhoneExclusive')}</Text>
					</LinearGradient> }
				</View>

				<View style={ styles.goods_store }>
					<Text
						style={ [ styles.store_txt, {width: pxToDp(180)} ] }
						numberOfLines={ 1 }
						ellipsizeMode={ 'tail' }
					>{ item.store_name }</Text>
					<TouchableOpacity
						activeOpacity={ 1 }
						style={ styles.go_store }
						onPress={ () => this.props.navigation.navigate('Vendor', {'vid': item.vid}) }
					>
						<Text style={ {color: '#2D2D2D', fontSize: pxToDp(22)} }>{I18n.t('GoodsSearchList.Gostore')}</Text>
						<Image
							source={ require('../assets/images/arrow_right_b.png') }
							style={ {
								width: pxToDp(11),
								height: pxToDp(18),
								marginLeft: pxToDp(6)
							} }
							resizeMode={ 'contain' }
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	}

	keyExtractor = (item, index) => {
		return index
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

	// 切换展示方式
	toggleShowType = () => {
		let {showType} = this.state;
		this.setState({
			showType: showType == 'list' ? 'grid' : 'list'
		})
	}

	// 数据空
	renderEmpty = () => {
		return <View style={ {flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: pxToDp(160),zIndex: 1} }>
			<Image
				style={ {
					width: pxToDp(332),
					height: pxToDp(192),
				} }
				resizeMode={ 'contain' }
				source={ require('../assets/images/goods_empty.png') }
			/>
			<Text style={ {color: '#949494', fontSize: pxToDp(24)} }>{I18n.t('GoodsSearchList.text1')}</Text>
		</View>
	}


	render(){
		let {goods_list, keyword, showPricePanel, selectIndex, flag, show_gotop, refresh, source, order, showType} = this.state;
		return (
			<View style={[GlobalStyles.sld_container, {paddingTop: StatusBar.currentHeight}]}>

				<View style={ [ styles.homeSldSearchWrap, {
					paddingTop: Platform.OS === 'ios' ? (ios_type != '' ? ios_type + 5 : STATUS_BAR_HEIGHT) : 10,
					height: Platform.OS === 'ios' ? (ios_type != '' ? ios_type + 35 : pxToDp(120)) : 40,
				} ] }>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => {
							console.log('从吃吃吃吃吃吃吃吃吃吃：', keyword)
                            if(keyword != ''){
                                CountEmitter.emit('updateSearchHistory');
                                this.props.navigation.pop(1);
                            }else{
                                this.props.navigation.goBack();
                            }
						}}
					>
						<View style={ styles.cancelBack }>
							<Image style={ styles.homelogoimg } source={ require('../assets/images/goback.png') }/>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => {
                            if(source == 'CatScreen'){
                                this.props.navigation.replace('SearchPage');
                            }else{
                                this.props.navigation.navigate('SearchPage');
                            }
						}}
					>
						<View>
							<View style={ styles.homesearchcons }>
								<Image style={ styles.homeSearchimg }
								       source={ require('../assets/images/search.png') }/>
								<Text
									style={ [ GlobalStyles.sld_global_font, styles.cancelBackText ] }>{ keyword }</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>

				<View style={ styles.searchCondition }>
					<View style={ styles.sc_left }>

						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.filter_item }
							onPress={ () => this.selectFilter(1) }
						>
							<Text
								style={ [ styles.filter_txt, (selectIndex == 1 || selectIndex > 4) ? {color: '#E1251B'} : {} ] }>{I18n.t('GoodsSearchList.synthesize')}</Text>
							<Image
								style={ [ styles.filter_img, (selectIndex == 1 || selectIndex > 4) ? {tintColor: '#E1251B'} : {} ] }
								resizeMode={ 'contain' }
								source={ require('../assets/images/filter_down.png') }
							/>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.filter_item }
							onPress={ () => this.selectFilter(2, 1, 2) }
						>
							<Text
								style={ [ styles.filter_txt, (selectIndex == 2) ? {color: '#E1251B'} : {} ] }>{I18n.t('GoodsSearchList.salesvolume')}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.filter_item }
							onPress={ () => this.selectFilter(3) }
						>
							<Text
								style={ [ styles.filter_txt, (selectIndex == 3) ? {color: '#E1251B'} : {} ] }>{I18n.t('GoodsSearchList.price')}</Text>
							<View>
								<Image
									style={ [ styles.filter_img, {marginBottom: pxToDp(4)}, (selectIndex == 3 && order == 1) ? {tintColor: '#E1251B'} : {} ] }
									resizeMode={ 'contain' }
									source={ require('../assets/images/filter_up.png') }
								/>
								<Image
									style={ [ styles.filter_img, (selectIndex == 3 && order == 2) ? {tintColor: '#E1251B'} : {} ] }
									resizeMode={ 'contain' }
									source={ require('../assets/images/filter_down.png') }
								/>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.filter_item }
							onPress={ () => this.selectFilter(4) }
						>
							<Text
								style={ [ styles.filter_txt, (this.state.hasFilter) ? {color: '#E1251B'} : {} ] }>{I18n.t('GoodsSearchList.filter')}</Text>
							<Image
								style={ [ styles.filter_img2, (this.state.hasFilter) ? {tintColor: '#E1251B'} : {} ] }
								resizeMode={ 'contain' }
								source={ require('../assets/images/filter.png') }
							/>
						</TouchableOpacity>

					</View>
					<View style={ styles.sc_right }>
						<View style={ styles.sc_left_line }/>
						<TouchableOpacity
							activeOpacity={ 1 }
							style={ styles.sc_right_img }
							onPress={ () => this.toggleShowType() }
						>
							<Image
								style={ {width: pxToDp(48), height: pxToDp(48)} }
								resizeMode={ 'contain' }
								source={ showType == 'list' ? require('../assets/images/goods_list.png') : require('../assets/images/goods_grid.png') }
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={ GlobalStyles.line }/>

				<View style={ {
					flexDirection: 'row',
					flexWrap: 'wrap',
					justifyContent: 'flex-start',
					flex: 1,
					paddingTop: pxToDp(20)
				} }>

					{ flag && showType == 'list' && (
						<FlatList
							horizontal={ false }
							numColumns={ 1 }
							ref={ 'flatlist' }
							ListEmptyComponent={ this.renderEmpty() }
							ListFooterComponent={ () => this.footerView() }
							onRefresh={ () => this.onRefresh() }
							refreshing={ refresh }
							keyExtractor={ (item, index) => this.keyExtractor(item, index) }
							onScroll={ (event) => this.handleScroll(event) }
							onEndReachedThreshold={ 0.3 }
							onEndReached={ () => this.getNewData() }
							data={ goods_list }
							renderItem={ ({item}) => this.renderListCell(item) }
						/>
					) }
					{ flag && showType == 'grid' && (
						<FlatList
							horizontal={ false }
							numColumns={ 2 }
							ref={ 'flatlist' }
							ListEmptyComponent={ this.renderEmpty() }
							ListFooterComponent={ () => this.footerView() }
							onRefresh={ () => this.onRefresh() }
							refreshing={ refresh }
							keyExtractor={ (item, index) => this.keyExtractor(item, index) }
							onScroll={ (event) => this.handleScroll(event) }
							onEndReachedThreshold={ 0.3 }
							onEndReached={ () => this.getNewData() }
							data={ goods_list }
							renderItem={ ({item}) => this.renderGridCell(item) }
						/>
					) }
				</View>
				{
					show_gotop &&
                    <TouchableOpacity
                        activeOpacity={ 1 } onPress={ () => {
                        this.refs.flatlist.scrollToIndex({animated: true, index: 0});
                    } }
                        style={ {
                            position: 'absolute',
                            zIndex: 2,
                            right: pxToDp(40),
                            bottom: DeviceInfo.isIPhoneX_deprecated ? (pxToDp(60) + 35) : pxToDp(60)
                        } }>
                        <Image style={ {width: pxToDp(114), height: pxToDp(114)} } resizeMode={ 'contain' }
                               source={ require('../assets/images/sld_gotop.png') }/>
                    </TouchableOpacity>
				}
				<View style={ GlobalStyles.iphoneXbottomheight }/>
				{
                    showPricePanel == true &&
                    <View style={[ styles.filter_zh] }>
                        <View style={ [styles.zh_con] }>
                            <TouchableOpacity
                                style={ styles.zh_item }
                                activeOpacity={ 1 }
                                onPress={ () => this.selectFilter(5, '', '') }
                            >
                                <Text style={ [ styles.zh_txt, (selectIndex == 5) ? {color: '#E1251B'} : {} ] }>{I18n.t('GoodsSearchList.comprehensive')}</Text>
                                {
                                    selectIndex == 5 &&
									<Image
                                        style={ styles.zh_img }
                                        resizeMode={ 'contain' }
                                        source={ require('../assets/images/filter_sel.png') }
                                    />
								}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={ styles.zh_item }
                                activeOpacity={ 1 }
                                onPress={ () => this.selectFilter(6, 2, 2) }
                            >
                                <Text style={ [ styles.zh_txt, (selectIndex == 6) ? {color: '#E1251B'} : {} ] }>{I18n.t('GoodsSearchList.Hightolow')}</Text>
                                {
                                    selectIndex == 6 &&
                                    <Image
                                        style={ styles.zh_img }
                                        resizeMode={ 'contain' }
                                        source={ require('../assets/images/filter_sel.png') }
                                    />
								}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={ styles.zh_item }
                                activeOpacity={ 1 }
                                onPress={ () => this.selectFilter(7, 2, 1) }
                            >
                                <Text style={ [ styles.zh_txt, (selectIndex == 7) ? {color: '#E1251B'} : {} ] }>{I18n.t('GoodsSearchList.lowtohigh')}</Text>
                                {
                                    selectIndex == 7 &&
									<Image
                                        style={ styles.zh_img }
                                        resizeMode={ 'contain' }
                                        source={ require('../assets/images/filter_sel.png') }
                                    />
								}
                            </TouchableOpacity>
                        </View>
                    </View>
				}
			</View>
		)
	}
}
const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
	mask: {
		flex: 1,
		position: 'absolute',
		width: width,
		height: height,
		top: (Platform.OS === 'ios' ? 60 : 40) + pxToDp(60) + 7,
		zIndex: 998,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#000',
		opacity: 0.6
	},
	flotation: {
		flex: 1,
		position: 'absolute',
		width: width,
		height: height,
		top: (Platform.OS === 'ios' ? 60 : 40) + pxToDp(60) + 7,
		zIndex: 999,
		left: 0
	},
	sld_promotion_bg: {
		borderRadius: 2,
		backgroundColor: '#000',
		height: 15,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 2,
		marginLeft: 5
	},
	sld_promotion_view: {flexDirection: 'row', alignItems: 'flex-end'},
	sld_promotion_tag: {color: "#fff", fontSize: 10, margin: 2},
	tabBarUnderline: {
		backgroundColor: '#E67F11',
		height: 2,
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
	sld_like_part_right: {
		flexDirection: 'column',
		width: Dimensions.get('window').width * 1 - 120,
	},
	sld_like_part_title: {
		fontSize: 16,
		color: '#333',
		height: 21,
		lineHeight: 21,
		paddingRight: 15,
		marginTop: 10
	},
	sld_like_part_chuildtitle: {
		marginTop: 5,
		fontSize: 13,
		color: '#666',
		height: 18,
		lineHeight: 18,
		paddingRight: 15,

	},
	sld_like_part_price: {
		fontSize: 18,
		color: '#ba1418',
		position: 'relative',
		bottom: -10,
	},
	sld_like_part_cancle_col: {
		borderRadius: 4,
		borderWidth: 0.5,
		borderColor: '#e5e5e5',
		color: '#666',
		width: 70,
		textAlign: 'center',
		marginTop: 14,
		marginRight: 10,
		fontSize: 12,
	},
	sld_like_part_list: {
		flexDirection: 'row',
		width: Dimensions.get('window').width,
		paddingRight: 15,
		backgroundColor: '#fff',
		paddingTop: 10,
		paddingBottom: 10,
		justifyContent: 'flex-start',
	},
	sld_like_part_img: {
		width: 90,
		height: 90,
		marginRight: 10,
		marginLeft: 10,
	},


	item: {
		flexDirection: 'row',
	},
	topic: {
		width: Dimensions.get('window').width,
		alignItems: 'center',
		justifyContent: 'flex-start',
		backgroundColor: '#fff',
		marginBottom: pxToDp(200),
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
		color: '#333',
		height: 50,
		lineHeight: 50,
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
		fontSize: pxToDp(26),
		height: pxToDp(55),
		lineHeight: pxToDp(55),
		color: '#333',
	},
	sld_zero_part_chuildtitle: {
		width: (Dimensions.get('window').width * 1 - 45) / 2 - 20,
		fontSize: 13,
		color: '#E67F11',
		overflow: 'hidden',
		height: 28,
	},
	sld_zero_part_price: {
		color: '#ba1418',
		fontSize: pxToDp(28),
	},
	sld_zero_part_list: {
		width: (Dimensions.get('window').width * 1 - 45) / 2,
		flexDirection: 'column',
		marginLeft: 15,
		marginTop: 15,
		marginBottom: 15,

	},
	sld_home_zero_list: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',

	},
	homeSearchimg: {
		width: pxToDp(30),
		height: pxToDp(30),
		marginLeft: pxToDp(15),
		marginRight: pxToDp(15)
	},
	homesearchcons: {
		flexDirection: 'row',
		backgroundColor: '#F5F5F5',
		width: pxToDp(630),
		height: pxToDp(60),
		borderRadius: pxToDp(30),
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	homeSldSearchWrap: {
		paddingTop: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? (STATUS_BAR_HEIGHT + 10) : STATUS_BAR_HEIGHT) : 10,
		height: Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? pxToDp(140) : pxToDp(120)) : 40,
		flexDirection: 'row', paddingBottom: 5,
		paddingLeft: pxToDp(30),
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	homelogoimg: {
		width: 22,
		height: 22,
	},
	cancelBack: {
		width: pxToDp(60),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		height: pxToDp(60),
		alignItems: 'center',
	},
	searchCondition: {
		height: pxToDp(84),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		paddingHorizontal: pxToDp(20)
	},
	searchConditionDetail: {
		fontSize: pxToDp(30),
		paddingTop: pxToDp(15),
		paddingBottom: pxToDp(15),

	},
	flatlist_footer_view: {
		width: width,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: pxToDp(90)
	},
	flatlist_footer_text: {fontSize: pxToDp(22), color: '#949494'},
	sc_left: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around'
	},

	filter_item: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	filter_txt: {
		color: '#2D2D2D',
		fontSize: pxToDp(26),
		textAlign: 'center',
	},
	filter_img: {
		width: pxToDp(16),
		height: pxToDp(10),
		marginLeft: pxToDp(10),
		tintColor: '#2D2D2D'
	},
	filter_img2: {
		width: pxToDp(36),
		height: pxToDp(36)
	},

	sc_right: {
		width: pxToDp(83),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	sc_left_line: {
		width: pxToDp(1),
		height: pxToDp(36),
		backgroundColor: '#e5e5e5'
	},
	sc_right_img: {
		width: pxToDp(48),
		height: pxToDp(48)
	},
	filter_zh: {
		position: 'absolute',
		top: (Platform.OS === 'ios' ? 60 : 40) + pxToDp(60) + 7,
		left: 0,
		width: width,
		height: height,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		zIndex: 1
	},
	zh_con: {
		width: width,
		backgroundColor: '#F8F8F8',
		paddingVertical: pxToDp(20),
		paddingLeft: pxToDp(36),
		paddingRight: pxToDp(25),
		borderBottomLeftRadius: pxToDp(14),
		borderBottomRightRadius: pxToDp(14),
	},
	zh_item: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(60)
	},
	zh_txt: {
		color: '#2D2D2D',
		fontSize: pxToDp(28)
	},
	zh_img: {
		width: pxToDp(25),
		height: pxToDp(16)
	},
	goods_show_list: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: pxToDp(20),
		paddingTop: pxToDp(20),
		backgroundColor: '#fff'
	},
	show_list_img: {
		width: pxToDp(290),
		height: pxToDp(290),
		borderRadius: pxToDp(14),
		overflow: 'hidden',
	},
	show_list_img_i: {
		width: pxToDp(290),
		height: pxToDp(290),
	},
	show_list_info: {
		flex: 1,
		height: pxToDp(290),
		paddingLeft: pxToDp(20),
		justifyContent: 'space-between',
	},
	goods_name: {
		color: '#2D2D2D',
		fontSize: pxToDp(26),
		lineHeight: pxToDp(39)
	},
	jingle: {
		color: '#949494',
		fontSize: pxToDp(24),
		marginTop: pxToDp(6)
	},
	price_wrap: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: pxToDp(30)
	},
	goods_type: {
		flexDirection: 'row',
		alignItems: 'center',
		// height: pxToDp(30),
		marginTop: pxToDp(10)
	},
	goods_type_item: {
		alignItems: 'center',
		justifyContent: 'center',
		height: pxToDp(30),
		paddingHorizontal: pxToDp(10),
		borderRadius: pxToDp(15),
		marginRight: pxToDp(10)
	},
	goods_type_txt: {
		color: '#fff',
		fontSize: pxToDp(22)
	},
	goods_push_info: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	goods_push_info_inner:{
		paddingHorizontal: pxToDp(16),
		borderRadius: pxToDp(6),
		backgroundColor: '#fbe9c8',
		height: pxToDp(32),
		flexDirection:'row',
		alignItems:'center',
	},
	goods_push_info_text: {
		backgroundColor: 'transparent',
		color: '#906433',
		fontSize: pxToDp(22),
	},
	goods_store: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	store_txt: {
		color: '#666666',
		fontSize: pxToDp(22),
		marginRight: pxToDp(20)
	},
	go_store: {
		flexDirection: 'row',
		color: '#2D2D2D',
		fontSize: pxToDp(22),
		alignItems: 'center'
	},
	goods_show_grid: {
		width: pxToDp(345),
		borderRadius: pxToDp(14),
		backgroundColor: '#fff',
		marginLeft: (width - pxToDp(690)) / 3,
		marginBottom: pxToDp(20),
		overflow: 'hidden'
	},
	show_list_img2: {
		width: pxToDp(345),
		height: pxToDp(345),
	},
	show_grid_info: {
		paddingHorizontal: pxToDp(20),
		paddingTop: pxToDp(10),
		paddingBottom: pxToDp(20)
	},
	footer_line: {
		width: pxToDp(160),
		height: pxToDp(1),
		backgroundColor: '#999',
	}
});
