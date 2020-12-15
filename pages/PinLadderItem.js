import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
	Image
} from 'react-native';
import pxToDp from "../util/pxToDp";
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import DiyPage from "../component/DiyPage";
import SldFlatList from '../component/SldFlatList';

const scrWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import {I18n} from './../lang/index'

export default class PinLadderItem extends Component{
	constructor(props){
		super(props);
		this.state = {
			diy_data: props.diy_data,//存放所有的装修改数据
			showWait: false,
			refresh: false,
			data: [],//
			pn: 1,//当前页面
			hasmore: true,//是否还有数据
			show_gotop: false,
			is_request: false,
			flag: 0,
			CatList: [],    // 预售分类
			PresaleList: [],   // 预售列表
			class_id: props.catid,    // 当前预售分类id
			isLoading: true,
		}
	}


	componentDidMount(){
		this.initData();
	}

	initData(){
		this.getPresaleList();
	}

	// 获取预售列表
	getPresaleList(){
		let {class_id, pn} = this.state;
		RequestData.getSldData(AppSldUrl + `/index.php?app=index&mod=data&sld_addons=pin_ladder&tid=${ class_id }&page=10&pn=${ pn }`).then(res => {
			if(res.code == 200){
				let {hasmore, PresaleList} = this.state;
				if(pn == 1){
					PresaleList = res.datas.goods;
				}else{
					PresaleList = PresaleList.concat(res.datas.goods);
				}

				if(res.hasmore){
					pn++;
				}else{
					hasmore = false;
				}
				this.setState({
					pn: pn,
					hasmore: hasmore,
					PresaleList: PresaleList
				})
			}
			this.setState({
				isLoading: false
			})
		}).catch(error => {
			this.setState({
				isLoading: false
			})
			ViewUtils.sldErrorToastTip(error);
		})
	}

	handleData = (datainfo) => {
		for(let i = 0; i < datainfo.length; i++){
			if(datainfo[ i ][ 'type' ] == 'lunbo'){
				let new_data = datainfo[ i ][ 'data' ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
				this.setState({
					diy_data: datainfo
				});

			}else if(datainfo[ i ][ 'type' ] == 'dapei'){
				let new_data = datainfo[ i ];
				let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'width' ], datainfo[ i ][ 'height' ]);
				datainfo[ i ][ 'width' ] = new_image_info.width;
				datainfo[ i ][ 'height' ] = new_image_info.height;
				this.setState({
					diy_data: datainfo
				});
			}else if(datainfo[ i ][ 'type' ] == 'tupianzuhe'){
				if(datainfo[ i ][ 'sele_style' ] == 0){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ]);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 1){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], scrWidth * 1 - 20);
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 2){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 30) / 2));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 3){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						let new_image_info = ViewUtils.handleIMage(datainfo[ i ][ 'data' ][ j ][ 'width' ], datainfo[ i ][ 'data' ][ j ][ 'height' ], Math.floor((scrWidth * 1 - 40) / 3));
						datainfo[ i ][ 'data' ][ j ][ 'width' ] = new_image_info.width;
						datainfo[ i ][ 'data' ][ j ][ 'height' ] = new_image_info.height;
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 4){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor(datainfo[ i ][ 'data' ][ j ][ 'width' ] * 16 / 15);
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 4);
						}

						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 5){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0 || j == 3){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = scrWidth * 1 - 30 - Math.floor((scrWidth * 1 - 30) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 3);
						}
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 6){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 0 || j == 3){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 30) / 4);
						}else if(j == 1 || j == 2){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 30) / 2);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}
						this.setState({
							diy_data: datainfo
						});
					}
				}else if(datainfo[ i ][ 'sele_style' ] == 7){
					let new_data = datainfo[ i ][ 'data' ];
					for(let j = 0; j < new_data.length; j++){
						if(j == 4){
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 40) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = Math.floor((scrWidth * 1 - 40) / 10 * 7);
						}else{
							datainfo[ i ][ 'data' ][ j ][ 'width' ] = Math.floor((scrWidth * 1 - 40) / 3);
							datainfo[ i ][ 'data' ][ j ][ 'height' ] = datainfo[ i ][ 'data' ][ j ][ 'width' ];
						}
						this.setState({
							diy_data: datainfo
						});
					}
				}
			}else{
				this.setState({
					diy_data: datainfo
				});
			}

		}
	}

	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.line }/>
		);
	}

	detail = (gid) => {
		this.props.navigation.navigate('GoodsDetailNew', {gid: gid})
	}

	renderCell = (item) => {
		return (
			<TouchableOpacity
				style={ styles.goods_item }
				activeOpacity={ 1 }
			>
				<View style={ styles.imgWrap }>
					<Image
						style={ styles.img }
						source={ {uri: item.sld_pic} }
						resizeMode={ 'contain' }
					>
					</Image>
				</View>
				<Text style={styles.name}>
					{ ViewUtils.getSldImg ( 300 , 80 , require ( '../assets/images/jttlogo.png' ) ) }&nbsp;&nbsp;
					{item.goods_name}
				</Text>

				<View style={ styles.bw }>
					<View style={ styles.ac }>
						<Text style={ {color: '#EE1B21', fontSize: pxToDp(32)} }>Ks
							<Text style={ {fontSize: pxToDp(50)} }>{ item.goods_price }</Text></Text>
						<Text style={ {marginLeft: pxToDp(30)} }>{I18n.t('PinTuanOrder.spell')}{ item.sales }{I18n.t('TuanGou.Piece')}</Text>
					</View>
					<TouchableOpacity
						style={ styles.btn }
						activeOpacity={ 1 }
						onPress={ () => this.detail(item.gid) }
					>
						<Text style={ {color: '#FFFFFF', fontSize: pxToDp(28)} }>{I18n.t('com_PinTuan.In_group')} ></Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		)
	}
	//下拉重新加载
	refresh = () => {
		this.setState({
			pn: 1,
			hasmore: true
		}, () => {
			this.getPresaleList();
		})
	}

	getNewData = () => {
		const {hasmore} = this.state;
		if(hasmore){
			this.getPresaleList();
		}
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

	render(){
		const {PresaleList, refresh, show_gotop, diy_data} = this.state;
		return (
			<ScrollView style={{flex: 1}}>
				{
					diy_data.length > 0 &&
					diy_data.map((item, index) => {
						return (<DiyPage key={ index } navigation={ this.props.navigation } data={ item }/>)
					})
				}
				{PresaleList.length>0 && <SldFlatList
					data={ PresaleList }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderCell(item) }
				/>}

				{PresaleList.length==0 && !this.state.isLoading && <View style={{height: height-pxToDp(200) ,alignItems: 'center',justifyContent: 'center'}}>
					<Image
						style={{width: pxToDp(243),height: pxToDp(243)}}
						resizeMode={'contain'}
						source={require('../assets/images/jttempty.png')}
					/>
					<Text style={{color:'#999999',fontSize: pxToDp(28),marginTop: pxToDp(40)}}>{I18n.t('LdjStore.text3')}</Text>
				</View>}

			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	goods_item: {
		flex: 1,
		backgroundColor: '#fff',
		padding: pxToDp(20),
		marginHorizontal: pxToDp(10),
		marginTop: pxToDp(10)
	},
	imgWrap: {
		width: '100%',
		height: pxToDp(340),
		marginBottom: pxToDp(20)
	},
	img: {
		width: '100%',
		height: pxToDp(340),
	},
	goods_info: {
		width: pxToDp(450),
		justifyContent: 'space-between',
	},
	name: {
		color: '#000',
		fontSize: pxToDp(30),
		lineHeight: pxToDp(36)
	},
	info: {
		width: pxToDp(450),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	btn: {
		alignItems: 'center',
		justifyContent: 'center',
		width: pxToDp(172),
		height: pxToDp(64),
		borderRadius: pxToDp(32),
		backgroundColor: '#ED6307'
	},
	btn_txt: {
		color: '#fff',
		fontSize: pxToDp(24),
	},
	price: {
		color: '#FE011D',
		fontSize: pxToDp(26),
		marginBottom: pxToDp(5)
	},
	old_price_txt: {
		color: '#999999',
		fontSize: pxToDp(20)
	},
	old_price: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	info_r: {
		width: pxToDp(142),
		height: pxToDp(50),
	},
	pin_goods: {
		flexDirection: 'row',
	},
	bw: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	ac: {
		flexDirection: 'row',
		alignItems: 'center'
	}
})
