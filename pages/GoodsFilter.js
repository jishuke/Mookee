/*
 * 帮助中心列表页面
 * @slodon
 * */
import React, {Component} from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	TextInput,
	DeviceInfo,
	DeviceEventEmitter
} from 'react-native';
import SldHeader from '../component/SldHeader';
import GlobalStyles from '../assets/styles/GlobalStyles';
import ViewUtils from '../util/ViewUtils';
import pxToDp from '../util/pxToDp';
import RequestData from "../RequestData";
import Modal from 'react-native-modalbox';
import {I18n} from './../lang/index'
const {width, height} = Dimensions.get('window');


export default class GoodsFilter extends Component {

	constructor(props) {
		super(props);
		this.state = {
			title: I18n.t('GoodsFilter.title'),
			price_from: typeof (props.navigation.state.params.price_from) != 'undefined' ? props.navigation.state.params.price_from : '',
			price_to: typeof (props.navigation.state.params.price_to) != 'undefined' ? props.navigation.state.params.price_to : '',
			area_id: typeof (props.navigation.state.params.area_id) != 'undefined' ? props.navigation.state.params.area_id : '',
			area: typeof (props.navigation.state.params.area) != 'undefined' ? props.navigation.state.params.area : '',
			own_shop: typeof (props.navigation.state.params.own_shop) != 'undefined' ? props.navigation.state.params.own_shop : '',
			area_list: [],
			showArea: false
		}
	}

	componentDidMount() {
		this.getArea();
	}

	getArea(){
		RequestData.getSldData(AppSldUrl+'/index.php?app=index&mod=search_adv').then(res=>{
			if(res.code==200){
				this.setState({
					area_list: res.datas.area_list
				})
			}
		})
	}

	isOwShop = ()=>{
		let {own_shop} = this.state;
		this.setState({
			own_shop: own_shop? 0 : 1
		})
	}

	selArea = ()=>{
		this.refs.area.open()
	}

	selectArea = (id,area)=>{
		this.setState({
			area_id: id,
			area: area
		},()=>{
			this.refs.area.close()
		})
	}

	reset = ()=>{
		this.setState({
			price_from: '',
			price_to: '',
			area_id: '',
			area: '',
			own_shop: '',
		})
	}

	confirm = ()=>{
		const {price_from,price_to,area_id,area,own_shop} = this.state;
		if (Number(price_to) < Number(price_from)) {
			ViewUtils.sldToastTip(I18n.t('GoodsFilter.text3'));
			return;
		}
		DeviceEventEmitter.emit('filter',{price_from,price_to,area_id,area,own_shop});
		this.props.navigation.goBack();
	}

	render() {
		const {title,price_from,price_to,area,own_shop,showArea} = this.state;
		return (
			<View style={GlobalStyles.sld_container}>
				<SldHeader title={title} left_icon={require('../assets/images/goback.png')}
				           left_event={() => ViewUtils.sldHeaderLeftEvent(this.props.navigation)}/>

				<ScrollView style={{flex: 1}} keyboardDismissMode={'on-drag'}>
					<View style={styles.filter_item}>
						<Text style={styles.title}>{I18n.t('GoodsFilter.price_range')}</Text>
						<View style={styles.con}>
							<TextInput
								underlineColorAndroid={'transparent'}
								style={[styles.input, {width: 100, fontSize: 11}]}
								keyboardType={'numeric'}
								value={price_from}
								maxLength={8}
								placeholder={I18n.t('GoodsFilter.minimum_price')}
								onChangeText={text => {
									if (text) {
                                        let reg = /^[0-9]*$/
										if (reg.test(text)) {
                                            this.setState({
                                                price_from: text
                                            })
										}
									} else {
                                        this.setState({
                                            price_from: ''
                                        })
									}
								}}
							/>
							<View style={styles.line} />
							<TextInput
								underlineColorAndroid={'transparent'}
								style={[styles.input, {width: 100, fontSize: 11}]}
								keyboardType={'numeric'}
								value={price_to}
								maxLength={8}
								placeholder={I18n.t('GoodsFilter.top_price')}
								onChangeText={text=>{
                                    if (text) {
                                        let reg = /^[0-9]*$/
                                        if (reg.test(text)) {
                                            this.setState({
                                                price_from: text
                                            })
                                        }
                                    } else {
                                        this.setState({
                                            price_from: ''
                                        })
                                    }
								}}
							/>
						</View>
					</View>

					<View style={styles.filter_item}>
						<Text style={styles.title}>{I18n.t('GoodsFilter.place_dispatch')} <Text style={styles.tip}>{I18n.t('GoodsFilter.text1')}</Text></Text>
						<View style={styles.con}>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.input}
								keyboardType={'numeric'}
								onPress={()=>this.selArea()}
							>
								<Text style={styles.txt}>{area?area:I18n.t('GoodsFilter.text2')}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.filter_item}>
						<Text style={styles.title}>{I18n.t('GoodsFilter.shop_type')}</Text>
						<View style={styles.con}>
							<TouchableOpacity
								activeOpacity={1}
								style={[styles.input,own_shop==1?styles.sel:'']}
								onPress={()=>this.isOwShop()}
							>
								<Text style={[styles.txt,own_shop==1?styles.sel_txt:'']}>{I18n.t('GoodsFilter.Proprietary_stores')}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>

				<View style={styles.footer}>
					<TouchableOpacity
						activeOpacity={1}
						style={[styles.btn,styles.reset]}
						onPress={()=>this.reset()}
					>
						<Text style={styles.reset_txt}>{I18n.t('GoodsFilter.reset')}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={1}
						style={[styles.btn,styles.confirm]}
						onPress={()=>this.confirm()}
					>
						<Text style={styles.confirm_txt}>{I18n.t('ok')}</Text>
					</TouchableOpacity>
				</View>

				<Modal
					backdropPressToClose={ true }
					entry='bottom'
					position='bottom'
					coverScreen={ true }
					swipeToClose={ false }
					ref={ "area" }
					style={ {
						backgroundColor: "#fff",
						height: height/2,
						position: "absolute",
						left: 0,
						right: 0,
						width: width,
						paddingBottom: DeviceInfo.isIPhoneX_deprecated ? 30 : 0,
					} }>
					<View style={ {
						height: 60,
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 15,
					} }>
						<Text style={ [ {fontSize: pxToDp(26), color: '#333',}, GlobalStyles.sld_global_font ] }>{I18n.t('GoodsFilter.text2')}</Text>
					</View>
					<View style={ GlobalStyles.line }/>
					{ this.state.area_list.length > 0 &&
					<ScrollView showsVerticalScrollIndicator={ false }>
						{ this.state.area_list.map(el => <TouchableOpacity
							activeOpacity={1}
							style={{paddingHorizontal: pxToDp(30)}}
							onPress={()=>this.selectArea(el.area_id,el.area_name)}
						>
							<Text style={{color: '#2D2D2D',fontSize: pxToDp(26),lineHeight: pxToDp(80)}}>{el.area_name}</Text>
						</TouchableOpacity>) }
					</ScrollView>
					}
				</Modal>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	input: {
		paddingHorizontal: pxToDp(20),
		height: pxToDp(50),
		backgroundColor: '#F5F5F5',
		fontSize: 12,
		borderRadius: pxToDp(25),
		textAlign: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 0
	},
	filter_item:{
		marginTop: pxToDp(20),
		backgroundColor: '#fff',
		paddingHorizontal: pxToDp(30),
		paddingBottom: pxToDp(20)
	},
	title:{
		height: pxToDp(90),
		lineHeight: pxToDp(90),
		color: '#2D2D2D',
		fontSize: pxToDp(28)
	},
	tip:{
		color: '#949494',
		fontSize: pxToDp(24),
		marginLeft: pxToDp(10)
	},
	txt:{
		color: '#2D2D2D',
		fontSize: pxToDp(28)
	},
	footer:{
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		height: pxToDp(99),
		backgroundColor: '#fff',
		paddingHorizontal: pxToDp(30)
	},
	btn:{
		height: pxToDp(50),
		paddingHorizontal: pxToDp(50),
		borderRadius: pxToDp(25),
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: pxToDp(20)
	},
	reset:{
		borderWidth: pxToDp(1),
		borderColor: '#FC1C1C',
	},
	reset_txt:{
		color: '#FC1C1C',
		fontSize: pxToDp(26)
	},
	confirm:{
		backgroundColor: '#FC1C1C',
	},
	confirm_txt:{
		color: '#fff',
		fontSize: pxToDp(26)
	},
	sel:{
		backgroundColor: '#FC1C1C'
	},
	sel_txt:{
		color: '#fff'
	},
	con:{
		flexDirection: 'row',
		alignItems: 'center'
	},
	line:{
		width: pxToDp(25),
		height: pxToDp(3),
		marginHorizontal: pxToDp(40),
		backgroundColor: '#2D2D2D'
	}
})
