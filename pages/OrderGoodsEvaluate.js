/*
* 订单商品评价页面
* @slodon
* */
import React, {Component} from 'react';
import {
	Dimensions,
	View, Image, Text,
	TouchableOpacity,
	StyleSheet, TextInput, ScrollView, Alert, DeviceEventEmitter
} from 'react-native';
import ImagePicker from "react-native-image-crop-picker";
import pxToDp from "../util/pxToDp";
import GlobalStyles from '../assets/styles/GlobalStyles';
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
const {width,height} = Dimensions.get('window');
import {I18n} from './../lang/index'
export default class OrderGoodsEvaluate extends Component {

    constructor(props){

        super(props);
        this.state={
        	score:5,//当前评分
	        content:'',//评价内容
	        xinxins:[0,1,2,3,4],
            sldOrderId:this.props.navigation.state.params.orderid,//订单id
            gid:this.props.navigation.state.params.gid,
            title:'订单商品评价',
	        order_goods_info:'',//存放订单信息
	        uploadImgs:[],//已经上传的图片
	        seleType:'img',// 上传的类型，img为图片  video为视频
	        imgServe:[],//存放要传服务器的图片名字
	        goods_anony: 0
        }
    }

    componentDidMount() {
        this.getOrderGoodsInfo();
    }

  //获取订单商品详情
	getOrderGoodsInfo = () =>{
    	const {sldOrderId,gid} = this.state;
 		RequestData.getSldData(AppSldUrl + '/index.php?app=userorder&mod=getOrderGoodsDetail&key='+key+'&order_id='+sldOrderId+"&gid="+gid)
			.then(result => {
				if (result.datas.error) {
					ViewUtils.sldToastTip(result.datas.error);
				} else {
					this.setState({
						order_goods_info: result.datas.order_goods_info,
					});
				}
			})
			.catch(error => {
				ViewUtils.sldToastTip(error);
			})
  }
	//多图上传
	uploadImg() {
		let {uploadImgs,imgServe} = this.state;
		let has_lenght = typeof (uploadImgs.length)!='undefined'?uploadImgs.length:0;

		console.log('多图上传:', key);

		ImagePicker.openPicker({
			mediaType:'photo',
			multiple:true
		}).then(image => {
			let get_length = typeof (image.length)!='undefined'?image.length:0;
		//	console.log(' 多图上传 ==选图 回来请求:', image.length);
			if(has_lenght + get_length > 5){
				ViewUtils.sldToastTip(I18n.t('TeamList.text1'));
			}else{
				//let path = image[0].path;
				//let filename = path.substring(path.lastIndexOf('/') + 1, path.length);
				let formData = new FormData();
				//let file = {'uri': image[0].path, 'type': 'multipart/form-data', 'name': filename,'size': image[0].size,'tmp_name':image[0].filename};
				if(image.length > 0){
					for(let i=0;i<image.length;i++){
					//console.log(' 多图上传 ==path:', image[i].path);
					formData.append('file',{'uri': image[i].path, 'type': 'multipart/form-data', 'name': image[i].path.substring(image[i].path.lastIndexOf('/') + 1, image[i].path.length),'size': image[i].size,'tmp_name':image[i].filename} );
					// formData.append('key', key);
					formData.append('key', "key"+i);
			     	}
				}
				//这里还有个单独写的请求
				let url = AppSldUrl+'/index.php?app=sns_album&mod=file_upload';
				fetch(url,{
					method:'POST',
					mode: 'np-cors',
					credentials: 'include',
					headers: {
						'TOKEN': key || ''
					},
					body: formData
				})
					.then(response=>response.json())
					.then(result=>{
						//console.log('这里还有个单独写的请求:', result);
						//console.log('这里还有个单独写的请求 name:', result.datas.file_name);
						if(result.code != 200){
							this.refs.toast.show(I18n.t('TeamList.text2'));
						}else{

							uploadImgs.push("http://cdn.mookee.net/data/upload/mall/member/292/"+result.datas.file_name);
							/*for(let i in image){
								uploadImgs.push(""+image[i]);
								console.log('多图上传22:',JSON.parse(image[i].toString()))
							}*/

							//重组数据
							imgServe.push(result.datas.file_name);
							this.setState({
								uploadImgs:uploadImgs,
								imgServe:imgServe
							});
							//console.log('多图上传33:',uploadImgs.toString());
							//console.log('多图上传44:',imgServe.toString())
						}
					})
					.catch(error=>{
						//上传出错
						this.refs.toast.show(error);
					})
			}
		});
	}
	//删除图片事件
	delImg = (index) => {
		let {uploadImgs,imgServe} = this.state;
		let newData = [];
		let newImgServer=[];
		for(let i=0;i<uploadImgs.length;i++){
			if(i!=index){
				newData.push(uploadImgs[i]);
				newImgServer.push(imgServe[i]);
			}
		}
		this.setState({
			uploadImgs:newData,
			imgServe:newImgServer
		});
	}

	setScore = (index) => {
		this.setState({
			score:index
		});
	}

	handleSldVal = (val) => {
		this.setState({
			content:val
		});
	}

	handleSldSubmit = () => {
		const {imgServe,sldOrderId,order_goods_info,content,score,goods_anony} = this.state;
		const _this = this;
		RequestData.postSldData(AppSldUrl+'/index.php?app=userorder&mod=wapGoodsComments',{'key':key,'evaluate_comment':content,'images':imgServe.join(','),'gid':order_goods_info.gid,'order_id':sldOrderId,'evaluate_score':score*1+1,goods_anony:goods_anony})
			.then(result=>{
				ViewUtils.sldToastTip(result.datas.msg);
				if(result.datas.state == 'success'){
					//通知更新
					DeviceEventEmitter.emit('updateEvaluate');
					DeviceEventEmitter.emit('orderList');
					DeviceEventEmitter.emit('userCenter');
					setTimeout(function(){
						_this.props.navigation.pop(1)
					},2000);
				}
			})
			.catch(error=>{
				ViewUtils.sldToastTip(error);
			})
	}

	//返回之前先确认
	goBack = () => {
		Alert.alert(
			'',
			I18n.t('TeamList.text3'),
			[
				{text:I18n.t('TeamList.text4'),onPress:(()=>{}),style:'cancle'},
				{text:I18n.t('TeamList.text5'),onPress:(()=>{this.props.navigation.goBack()})}
			]
		);
	}

	toggle = ()=>{
    	let goods_anony = this.state.goods_anony;
		this.setState({
		    goods_anony: goods_anony?0:1
	    })
	}

    render() {
        const {title,order_goods_info,uploadImgs,xinxins,score,goods_anony} = this.state;
        return (
            <View style={GlobalStyles.sld_container}>
	            <SldHeader title={title} left_icon={require('../assets/images/goback.png')} left_event={() =>this.goBack()} right_type='text' right_text={I18n.t('TeamList.issue')} right_event={() => this.handleSldSubmit()} right_style={{paddingRight:15,color:main_color,fontWeight:'400'}} right_icon={require('../assets/images/share.png')} />

	            <View style={GlobalStyles.line}/>
	            <ScrollView>
	            <View style={GlobalStyles.space_shi_separate}/>
	            <View style={{flexDirection:'row',width:width,paddingLeft:15,backgroundColor:'#fff'}}>
		            <Image style={{width:pxToDp(140),height:pxToDp(140),marginRight:16}} resizeMode={'contain'} source={{uri:order_goods_info.goods_image}}/>
		            <Text style={{color:'#181818',fontSize:pxToDp(30),fontWeight:'300',paddingTop:10,width:width-46-pxToDp(140)}} numberOfLines={1}>{order_goods_info.goods_name}</Text>
	            </View>

	            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginLeft:15,height:40}}>
		            <Text style={{fontWeight:'300',color:"#333",fontSize:pxToDp(30),marginRight:8}}>{I18n.t('TeamList.grade')}</Text>

		            {
                        xinxins.map((item, index) => {
                            return (
                                <TouchableOpacity
									key={index}
                                    activeOpacity={1}
                                    onPress={()=>this.setScore(index)}
                                >
                                    <Image style={{width:pxToDp(40),height:pxToDp(40),marginRight:8}} resizeMode={'contain'} source={index>score?require('../assets/images/xinxin_gray.png'):require('../assets/images/xinxin_light.png')}/>
                                </TouchableOpacity>
                            )
                        })
		            }

	            </View>


	            <View style={styles.wrapper_part}>
		            <TextInput
			            multiline={true}
			            style={[styles.wrapper_part_multi_input, GlobalStyles.sld_global_font]}
			            underlineColorAndroid={'transparent'}
			            autoCapitalize='none'
			            returnKeyType='done'
			            keyboardType='default'
			            enablesReturnKeyAutomatically={true}
			            placeholderTextColor='#999'
			            onChangeText={(text) =>this.handleSldVal(text)}
			            placeholder={I18n.t('TeamList.text6')}
		            />

		            <TouchableOpacity
			            style={styles.nm}
			            onPress={()=>this.toggle()}
			            activeOpacity={1}
		            >
			            <Image style={{width: pxToDp(40),height: pxToDp(40)}} resizeMode={'contain'} source={goods_anony==1?require('../assets/images/paysele.png'):require('../assets/images/paynosele.png')} />
			            <Text style={styles.nmtxt}>{I18n.t('TeamList.text7')}</Text>
		            </TouchableOpacity>
	            </View>



	            <View style={[styles.wrapper_part,{marginTop:15}]}>
		            <Text style={[GlobalStyles.sld_global_font,styles.wrapper_part_text]}>{I18n.t('TeamList.blueprint')}</Text>
	            </View>
	            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
		            {
		            	typeof (uploadImgs.length)!='undefined' &&
                        uploadImgs.map((item, index) => {
                            return (
                                <View key={index}>
                                    <Image resizeMode='contain' style={styles.upload_bg} source={{uri:item}}/>
                                    <TouchableOpacity
										activeOpacity={1}
										style={styles.upload_img_del_shi}
										onPress={() => this.delImg(index)}
									>
                                        <Image
											resizeMode='contain'
											style={styles.upload_img_del}
											source={require('../assets/images/upload_img_del.png')}
										/>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
		            }
		            <TouchableOpacity
						activeOpacity={1}
						onPress={() => this.uploadImg()}
					>
			            <Image resizeMode='contain' style={styles.upload_bg} source={require('../assets/images/uploadbg.png')}/>
		            </TouchableOpacity>
	            </View>
	            </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	wrapper_part:{
		flexDirection:'row',width:width,padding:15,paddingBottom:0,paddingTop:0,alignItems: 'center',justifyContent: 'space-between'
	},
	wrapper_part_text:{
		fontSize:pxToDp(28),color:'#242424',width:width-130
	},
	wrapper_part_multi_input:{
		color:'#666',fontSize:pxToDp(24),width: width-130,padding:pxToDp(20),height:pxToDp(150),
		borderWidth:0.5,borderColor:'#c3c3c3',
		flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',textAlignVertical:'top',
		backgroundColor:'#f5f5f5',
	},

	button_style:{
		width:pxToDp(230),height:pxToDp(84),borderRadius:pxToDp(10),flexDirection:'row',justifyContent:'center',alignItems:'center',padding:15,backgroundColor:main_color,marginLeft:15,marginTop:15
	},
	button_text:{
		fontSize:pxToDp(28),color:'#fff'
	},
	upload_bg:{
		width:(width-60)/3,height:(width-60)/3,marginLeft:15,marginTop:15,borderColor:'#d5d5d5',borderWidth:0.5
	},
	upload_img_del_shi:{
		position:'absolute',top:pxToDp(40),right:pxToDp(10)
	},
	upload_img_del:{
		width:pxToDp(42),height:pxToDp(42)
	},
	sele_goods_wrap:{flexDirection:'row',padding:15,justifyContent:'space-between',alignItems:'center'},
	sele_goods_title:{color:'#242424',fontWeight:'300',fontSize:pxToDp(28)},
	sele_goods_content:{color:'#242424',fontWeight:'300',fontSize:pxToDp(24),maxWidth:pxToDp(500),overflow:'hidden'},
	sldLoginButton:{
		alignItems: 'center',
		backgroundColor: main_color,
		padding: 12,
		borderRadius:4,
		marginTop:30,
		width:Dimensions.get('window').width * 1 - 30,
		marginLeft:15
	},
	nm:{
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: pxToDp(30)
	},
	nmtxt:{
		color: '#666',
		fontSize: pxToDp(26),
		marginTop: pxToDp(15)
	}
});
