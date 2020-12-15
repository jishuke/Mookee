import React,{Component} from 'react';
import {View, Text, Image, ImageBackground, Dimensions, TouchableOpacity, Platform} from 'react-native';
import pxToDp from '../util/pxToDp';
import RequestData from '../RequestData';
import ViewUtils from '../util/ViewUtils';
import GlobalStyles from '../assets/styles/GlobalStyles';
import SldFlatList from '../component/SldFlatList';
import SldComStatusBar from "../component/SldComStatusBar";
import styles from './stylejs/experience';

const {width, height} = Dimensions.get('window');
import {I18n} from './../lang/index'

export default class Experience extends Component{
	constructor(props){
		super(props);
		this.state={
			title: I18n.t('Experience.title'),
			pn: 1,
			hasmore: true,
			show_gotop: false,
			refresh: false,
			isLoading: 0,
			exeList: [],
			ruleList: [],
			showRule: false,
			growthvalue: '--'
		}
	}

	componentDidMount(){
		this.getList()
		this.getRule()
	}

	getList(){
		let {pn} = this.state;
		RequestData.postSldData(AppSldUrl+'/index.php?app=growth_grade&mod=growth_list&page=10&pn='+pn,{
			key
		}).then(res=>{
			if(res.state==200){
				let list = [];
				if(pn==1){
					list = res.data;
				}else{
					let {exeList} = this.state;
					list = exeList.concat(res.data)
				}
				this.setState({
					exeList: list
				})
			}
			if(res.hasmore){
				this.setState({
					pn: pn+1
				})
			}else{
				this.setState({
					hasmore: false
				})
			}
			this.setState({
				isLoading: 1
			})
		}).catch(err=>{
			this.setState({
				isLoading: 1
			})
		})
	}

	getRule(){
		RequestData.postSldData(AppSldUrl+'/index.php?app=growth_grade&mod=growth_rule',{
			key
		}).then(res=>{
			if(res.state==200){
				this.setState({
					ruleList: res.data,
					growthvalue: res.growthvalue
				})
			}
		})
	}

	refresh = () => {
		this.setState({
			pn: 1,
			hasmore: true
		},()=>{
			this.getList();
		})
	}

	getNewData = () => {
		if(this.state.hasmore){
			this.getList()
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

	separatorComponent = () => {
		return (
			<View/>
		);
	}

	render(){
		const {title,exeList,refresh,show_gotop,isLoading,ruleList,showRule,growthvalue} = this.state;
		return <View style={GlobalStyles.sld_container}>
			<SldComStatusBar nav={ this.props.navigation } barStyle={ 'dark-content' }/>
			{ViewUtils.getEmptyPosition(Platform.OS === 'ios'?'#fff':main_ldj_color,pxToDp(0))}

			<ImageBackground
				style={styles.exp_top}
				source={require('../assets/images/exp_bg.png')}
				resizeMode={'cover'}
			>
				<View style={styles.header}>
					<TouchableOpacity
						activeOpacity={1}
						style={{
							padding: pxToDp(20)
						}}
						onPress={()=>{
							ViewUtils.sldHeaderLeftEvent(this.props.navigation)
						}}
					>
						<Image
							style={{
								width: pxToDp(44),
								height: pxToDp(68),
								tintColor: '#fff'
							}}
							resizeMode={'contain'}
							source={require('../assets/images/goback.png')}
						/>
					</TouchableOpacity>

					<Text style={{color: '#fff',fontSize: pxToDp(34),fontWeight: '600'}}>{title}</Text>
					<View></View>
				</View>

				<View style={styles.exp_top_num}>
					<Image
						style={styles.exp_top_img}
						source={require('../assets/images/exp_bg2.png')}
						resizeMode={'contain'}
					/>
					<Text style={[styles.exp_top_txt,{color: '#fff',fontSize: pxToDp(44)}]}>{growthvalue}</Text>
				</View>

				<TouchableOpacity
					activeOpacity={1}
					style={styles.exp_rule}
					onPress={()=>{
						this.setState({
							showRule: true
						})
					}}
				>
					<Image
						style={{
							width: pxToDp(23),
							height: pxToDp(32),
							marginRight: pxToDp(10)
						}}
						source={require('../assets/images/exp_rule.png')}
					/>
					<Text style={{color: '#fff',fontSize: pxToDp(24)}}>{I18n.t('Experience.rule')}</Text>
				</TouchableOpacity>

			</ImageBackground>

			{exeList.length>0 && <SldFlatList
				data={ exeList }
				refresh_state={ refresh }
				show_gotop={ show_gotop }
				refresh={ () => this.refresh() }
				keyExtractor={ () => this.keyExtractor() }
				handleScroll={ (event) => this.handleScroll(event) }
				getNewData={ () => this.getNewData() }
				separatorComponent={ () => this.separatorComponent() }
				renderCell={ (item) => <View key={item.growth_id} style={styles.item}>
					<View style={styles.bw}>
						<Text style={[styles.txt,{color: '#2D2D2D'}]}>{item.growth_stage_str?item.growth_stage_str:''}</Text>
						<Text style={styles.bw_r}>+{item.growth_points}</Text>
					</View>
					<Text style={styles.txt}>{item.growth_desc}</Text>
					<Text style={styles.time}>{item.growth_addtime_str}</Text>
				</View> }
			/>}

			{
				isLoading==1 && exeList.length==0 && <View style={styles.empty}>
					<Image style={{width: pxToDp(135),height: pxToDp(135)}} source={require('../assets/images/exeEmpty.png')} resizeMode={'contain'}/>
					<Text style={{color: '#999999',fontSize: pxToDp(24),marginTop: pxToDp(20)}}>{I18n.t('Experience.empirical_value')}~</Text>

					<TouchableOpacity
						activeOpacity={1}
						style={styles.btn}
						onPress={()=>{
							this.props.navigation.navigate('Tab')
						}}
					>
						<Text style={{color: '#333333',fontSize: pxToDp(24)}}>{I18n.t('Experience.home')}</Text>
					</TouchableOpacity>
				</View>
			}

			{showRule && <View style={styles.exp_rule_list}>

				<View style={styles.exp_rule_main}>
					<Text style={styles.exp_title}>{I18n.t('Experience.Detailed_rules')}</Text>
					<View style={styles.exp_item}>
						{ruleList.map((el,index)=><Text
							key={el}
							style={{
								color: '#666666',
								fontSize: pxToDp(30),
								lineHeight: pxToDp(45)
							}}
						>{index+1}、{el}</Text>)}
					</View>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.exp_btn}
						onPress={()=>{
							this.setState({
								showRule: false
							})
						}}
					>
						<Text style={{color: '#E1251B',fontSize: pxToDp(34)}}>{I18n.t('Experience.I_see')}</Text>
					</TouchableOpacity>
				</View>

			</View>}

		</View>
	}
}
