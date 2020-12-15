/*
 * 评价页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Image,
	Text,Modal,
} from 'react-native';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import RequestData from '../RequestData';
import pxToDp from '../util/pxToDp'
import SldFlatList from '../component/SldFlatList';
import SldRate from '../component/SldRate'
import LoadingWait from '../component/LoadingWait';
import ImageViewer from 'react-native-image-zoom-viewer';
import {I18n} from './../lang/index'

let pn = 1;
let hasmore = true;

export default class MyVoucher extends Component{

	constructor(props){

		super(props);
		this.state = {
			title: I18n.t('EvaluateList.Allevaluation'),
			gid: '',
			type: '',
			isLoading: 0,
			comment: [],
			info: '',
			refresh: false,
			show_gotop: false,
			modalVisible: false,//是否展示图片预览框 默认不展示
			images:[],
			index:0,
		};

		this.navData = [
			{
				name: I18n.t('EvaluateList.Allevaluation'),
				type: ''
			},
			{
				name: I18n.t('EvaluateList.goodreputation'),
				type: 'good'
			},
			{
				name: I18n.t('EvaluateList.mediumreview'),
				type: 'normal'
			},
			{
				name: I18n.t('EvaluateList.negativecomment'),
				type: 'bad'
			},
		]
	}

	componentDidMount(){
		let params = this.props.navigation.state;
		if(params.params != 'undefined'){
			this.setState({
				gid: params.params.gid,
			}, () => {
				this.getEvalList();
			});
		}
	}

	// 获取评价列表
	getEvalList(){
		let {type, gid} = this.state;
		RequestData.getSldData(AppSldUrl + '/index.php?app=goods&mod=getGoodsDetailComments&gid=' + gid + '&pn=' + pn + '&page=10&type=' + type).then(res => {
			if(res.code == 200){
				this.setState({
					comment: res.datas.comment,
					info: res.datas
				})
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

	separatorComponent = () => {
		return (
			<View style={ GlobalStyles.space_shi_separate }/>
		);
	}

	refresh = () => {
		this.getEvalList()
	}

	getNewData = () => {

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

	//点击预览大图事件
	previewImg = (imgs,index) => {
		let {images} = this.state;
		images = [];
		imgs.map((val)=>{
			images.push({
				url:val
			});
		})
		this.setState({
			modalVisible: true,
			images,
			index:index,
		})
	}

	renderCell = item => {
		return (
			<View style={ styles.item }>
				<View style={ styles.item_top }>
					<View style={ styles.user }>
						<Image
							source={ item.member_logo ? {uri: item.member_logo} : {uri: 'http:' + item.cct_user_avatar} }
							style={ {width: pxToDp(70), height: pxToDp(70), marginRight: pxToDp(20)} }
							defaultSource={require('../assets/images/default_icon_124.png')}
						/>
						<Text style={ {color: '#333', fontSize: pxToDp(24)} }>{ item.geval_frommembername }</Text>
					</View>
					<Text style={ {color: '#bbb', fontSize: pxToDp(24)} }>{ item.wap_gevel_addtime }</Text>
				</View>
				<View style={ styles.item_bottom }>
					<SldRate
						score={ item.geval_scores }
						disable={ true }
						size={ 26 }
					/>
					<Text style={ {
						color: '#333',
						fontSize: pxToDp(24),
						paddingTop: pxToDp(10)
					} }>{ item.geval_content }</Text>

					{ typeof (item.geval_images) != 'undefined' && <View style={ styles.bw }>
						{ item.geval_images.map((el,index) => <TouchableOpacity
							activeOpacity={ 1 }
							onPress={ () => {
								this.previewImg(item.geval_images,index)
							} }
							key={index}
							style={ styles.img_wrap }>
							<Image
								style={ {width: pxToDp(120), height: pxToDp(120)} }
								resizeMode={ 'contain' }
								source={ {uri: el} }
								defaultSource={require('../assets/images/default_icon_124.png')}
							/>
						</TouchableOpacity>) }
					</View> }

				</View>
			</View>
		)
	}

	render(){
		const {type, title, isLoading, comment, refresh, show_gotop,modalVisible,images,index} = this.state;
		return (
			<View style={ GlobalStyles.sld_container }>
				<SldHeader title={ title } left_icon={ require('../assets/images/goback.png') }
				           left_event={ () => ViewUtils.sldHeaderLeftEvent(this.props.navigation) }/>
				<View style={ GlobalStyles.line }/>

				<View style={ styles.nav }>
					{ this.navData.map(el => <TouchableOpacity
						style={ [ styles.nav_item, {backgroundColor: (type == el.type ? '#f15353' : '#AAA')} ] }
						activeOpacity={ 1 }
						onPress={ () => {
							this.setState({
								type: el.type,
								comment: [],
								isLoading: 0
							}, () => {
								this.getEvalList();
							})
						} }
					>
						<Text style={ {color: '#fff', fontSize: pxToDp(26)} }>{ el.name }</Text>
					</TouchableOpacity>) }
				</View>

				{ comment.length > 0 && <SldFlatList
					data={ comment }
					refresh_state={ refresh }
					show_gotop={ show_gotop }
					refresh={ () => this.refresh() }
					keyExtractor={ () => this.keyExtractor() }
					handleScroll={ (event) => this.handleScroll(event) }
					getNewData={ () => this.getNewData() }
					separatorComponent={ () => this.separatorComponent() }
					renderCell={ (item) => this.renderCell(item) }
				/> }

				{ comment.length == 0 && isLoading == 1 &&
				<View style={ {flex: 1, alignItems: 'center', justifyContent: 'center'} }>
					{ ViewUtils.noData(I18n.t('EvaluateList.text1'), require('../assets/images/mcc_011_w.png'), I18n.t('EvaluateList.text2')) }
				</View> }

				{ isLoading == 0 && <LoadingWait/> }
				<Modal
					visible={modalVisible}
					transparent={true}>
					<ImageViewer
						imageUrls={images}
						index={index}
						onClick={()=>this.setState({modalVisible: false})}
						onSwipeDown={()=>this.setState({modalVisible: false})}
						backgroundColor={'rgba(221,221,221,0.6)'}
					/>
				</Modal>

			</View>
		)
	}
}
const STATUS_BAR_HEIGHT = 30;
const styles = StyleSheet.create({
	bw: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	img_wrap: {
		width: pxToDp(120),
		height: pxToDp(120),
		marginRight: pxToDp(20),
		marginBottom: pxToDp(20)
	},
	user: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	item: {
		backgroundColor: '#fff',
		marginBottom: pxToDp(20),
	},
	item_top: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: pxToDp(100),
		paddingHorizontal: pxToDp(20),
		borderBottomWidth: pxToDp(1),
		borderBottomColor: '#e9e9e9',
		borderStyle: 'solid'
	},
	item_bottom: {
		paddingTop: pxToDp(20),
		paddingBottom: pxToDp(50),
		paddingHorizontal: pxToDp(20),
	},
	container: {
		flex: 1,
		backgroundColor: '#fafafa',
	},
	nav_item: {
		paddingHorizontal: pxToDp(20),
		height: pxToDp(60),
		borderRadius: pxToDp(10),
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: pxToDp(20),
	},
	nav: {
		paddingVertical: pxToDp(20),
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#eee',
	},
	close:{
		position:'absolute',
		top:pxToDp(15),
		right:pxToDp(15),
		zIndex:2,
		width:pxToDp(50),
		height:pxToDp(50),
		backgroundColor:'#fff',
		borderRadius: pxToDp(25),
	},
});
