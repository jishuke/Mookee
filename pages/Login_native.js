/*
* 个人中心页面
* @slodon
* */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  TextInput
} from "react-native";
import SldHeader from '../component/SldHeader';
import ViewUtils from '../util/ViewUtils';
import RequestData from '../RequestData';
import GlobalStyles from "../assets/styles/GlobalStyles";
import pxToDp from "../util/pxToDp";
import ShareUtil from '../util/ShareUtil';
import {I18n} from './../lang/index'

// 导入Dimensions库
var Dimensions = require('Dimensions');
export default class Login extends Component {

    constructor(props){
        super(props);
        this.state={
            username:'',
            sldpass:'',
        };
    }

    componentWillMount() {
    }

    handleSldPass(text,type){
        if(type == 'passwd'){
            this.setState({
                sldpass:text,
            });
        }else{
            this.setState({
                username:text,
            });
        }

    }
    //微博授权登录
    pressWeibo(){
        ShareUtil.auth(1,(code,result,message)=>{
            // alert(message+result.uid);
        });
    }
    //登录事件
    handleSldLogin(){
        if(this.state.username == '' || this.state.sldpass == ''){
	        ViewUtils.sldToastTip(I18n.t('Login.text3'));
            return false;
        }else{
            RequestData.postSldData(AppSldUrl+'/index.php?app=login&mod=index',{username:this.state.username,password:this.state.sldpass,client:(Platform.OS === 'ios') ? 'ios' : 'android'})
                .then(result=>{

                    if(result.datas.error){
                        //登陆失败的情况下
	                    ViewUtils.sldToastTip(result.datas.error);
                    }else{
                        //登陆成功的情况下
	                    ViewUtils.sldToastTip(I18n.t('Login.text4'));
                        let sldLoginInfo = result.datas;
                        storage.save({
                            key: 'sldlogininfo',  // 注意:请不要在key中使用_下划线符号!
                            data: {
                                sldtoken: sldLoginInfo.key,
                                sldusername: sldLoginInfo.username,
                                slduserid: sldLoginInfo.member_id,
                            }

                        });
                        storage.save({
                            key: 'key',  // 注意:请不要在key中使用_下划线符号!
                            data: sldLoginInfo.key,
                        });

                        key = sldLoginInfo.key;
                        if(typeof (this.props.navigation.state.params)!='undefined'&&typeof (this.props.navigation.state.params.tag) != 'undefined'&&this.props.navigation.state.params.tag == 'cart'){
                            this.props.navigation.replace('CartScreen');
                        }else{
                            this.props.navigation.goBack();

                        }
                    }
                })
                .catch(error=>{
	                ViewUtils.sldToastTip(error);
                })
        }
    }
    render() {
        return (
            <View style={styles.container}>
	            <SldHeader title={I18n.t('loginPage.login')} left_icon={require('../assets/images/goback.png')} left_event={() =>ViewUtils.sldHeaderLeftEvent(this.props.navigation)} />
                <View style={GlobalStyles.line}/>

                <View style={{width:Dimensions.get('window').width * 1 - 60,height:pxToDp(Dimensions.get('window').height),flexDirection:'column',alignItems:'center',marginLeft:30}}>
                    <View style={{flexDirection:'row',justifyContent:'center',marginTop:pxToDp(98),marginBottom:pxToDp(50)}}>
                        <Image resizeMode={'contain'} style={{width:pxToDp(308),height:pxToDp(122)}} source={require('../assets/images/loginlogo.png')}/>
                    </View>
                    <View style={{height:22,flexDirection:'row',
                        width:Dimensions.get('window').width * 1 - 60,
                        marginTop:pxToDp(70)}}>
                        <TextInput
                            style={[{color:'#666',width:Dimensions.get('window').width * 1 - 60,borderBottomWidth:0.5,borderColor:'#666',padding:0
                            }, GlobalStyles.sld_global_font]}
                            underlineColorAndroid='#fff'
                            autoCapitalize='none'
                            onChangeText={(text) =>this.handleSldPass(text,'username')}
                            placeholder={I18n.t('Login.text7')}
                        />


                    </View>
                    <View style={{
                        height:22,flexDirection:'row',
                        width:Dimensions.get('window').width * 1 - 60,
                        marginTop:pxToDp(70)
                    }}>
                        <TextInput
                        style={[{borderBottomWidth:0.5,color:'#666',width:Dimensions.get('window').width * 1 - 60,borderColor:'#666',padding:0}, GlobalStyles.sld_global_font]}
                        autoCapitalize='none'
                        underlineColorAndroid='#fff'

                        secureTextEntry={true}
                        onChangeText={(text) => this.handleSldPass(text,'passwd')}
                        placeholder={I18n.t('Login.text8')}
                    />

                    </View>
                    <View style={{flexDirection:'row',width:Dimensions.get('window').width * 1 - 60,justifyContent:'flex-start'}}>
                    {/*<Text style={[{color:'#cf8135',fontSize:pxToDp(28),marginTop:pxToDp(20)}, GlobalStyles.sld_global_font]}>{I18n.t('Login.forgetpassword')}?</Text>*/}
                    </View>
                    <View>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.sldLoginButton}
                            onPress={()=>this.handleSldLogin()}
                        >
                            <Text style={{color:'#fff',fontWeight:'300',fontSize:pxToDp(34)}}> {I18n.t('Login.login')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.register_passwd}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={()=>{
                                this.props.navigation.navigate('Register');
                            }}>
                            <Text style={[styles.clear, GlobalStyles.sld_global_font]}>{I18n.t('Register.phoneregister')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={()=>{
                                this.props.navigation.navigate('ForgetPwd');
                            }}>
                            <Text style={[styles.clear, GlobalStyles.sld_global_font]}>{I18n.t('Login.forgetpassword')}</Text>
                        </TouchableOpacity>
                    </View>



                    {/*<TouchableOpacity style={{marginTop:20}}onPress={()=>this.pressWeibo()}>
                        <Image style={{width:50,height:50}} source={require('../assets/images/blog.png')}/>
                    </TouchableOpacity>*/}

                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    clear:{
        color:'#333',
        fontSize:pxToDp(28),
        paddingTop:15,
        paddingBottom:15,paddingRight:15
    },
    container: {
        flex: 1,
        backgroundColor:'#fff',
    },
    sldLoginButton:{
        alignItems: 'center',
        backgroundColor: '#e64410',
        padding: 12,
        borderRadius:4,
        marginTop:30,
        width:Dimensions.get('window').width * 1 - 60
    },
    sldLoginLine:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:5
    },
    sldLoginInput:{
        height: 40,
        borderBottomWidth:1,
        borderColor:'#e3e5e9',
        width:270,
    },
    sldLoginImg:{
        height: 20,
        width:20,
        marginRight:10
    },
    sldLoginRegister:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:8
    },
    sldLoginRegisterText:{
        color:'#999'
    },
    register_passwd:{
        flexDirection:'row',
    },

});
