/*
* 定义的常量
* @by slodon
* */


    //global.AppSldDomain = 'https://md.mookee.net/'; //线上
     global.AppSldDomain = 'https://testmd.phplty.com/'; //测试
    // global.AppSldDomain = 'https://www.phplty.com/'; //晋呈

    global.AppSldWebView = AppSldDomain + 'appview/';// 站网址
    global.AppSldUrl = AppSldDomain+'cmobile';//接口访问的固定地址
    global.ImgUrl = AppSldDomain + '/cwap';
    global.key = '';
    global.currentSceneTop = '';//当前页面路由
    global.diy_data_info = [];//商城首页装修数据
    global.diy_data_info_ldj = [];//联到家首页装修数据
	global.diy_data_info_points = [];//积分商城首页装修数据
    global.module_set = {};//获取商城的模块开启状态
    global.authInfo = {};//三方授权登录获取的信息
    global.main_color = '#e00c1a';
    global.main_ldj_color = '#5EB319';
    global.border_color = '#ebebeb';
    global.font_weight = '300';
    global.main_title_color = '#242424';
    global.androidIsFS = 0;//android是否全面屏，0为否，1为是
    global.height_com_head = 0;//屏幕高度减去公共头部高度
    global.cur_user_info = {};//登陆的用户信息
	global.ldj_location= {};
    global.ChatSldDomain = 'https://sldim.slodon.cn/';//聊天的接口域名
	global.CitySite = {};
	global.ios_type = 0;//ios类型，0: 正常适配，1x/xr/xs/xsmax 适配
    global.pushHandInfo = {getInfo:false} //推手信息
    global.language = 1;
    //地图信息
	global.sld_gd_android_key = '2f6b184cf775efbbc6f8e36b60e25303';//高德地图的android key
	global.sld_gd_ios_key = '7947517400b58f96d7786369a2c91c26'; //高德地图的ios key
	global.sld_web_key = '47000f5551c5a45588a4c3e7ed78df6a'; //高德地图的web服务 key

	//通用样式
	global.fontSize_34 = 34;
	global.fontSize_32 = 32;
	global.fontSize_30 = 30;
	global.fontSize_28 = 28;
	global.fontSize_26 = 26;
	global.fontSize_24 = 24;
	global.fontSize_22 = 22;
	global.fontSize_20 = 20;
	global.fontSize_18 = 18;
	global.fontSize_16 = 16;

	global.fweight_300 = 300;
	global.fweight_400 = 400;
	global.fweight_600 = 600;

/** copyright *** slodon *** version-v7.2.9 *** date-2019-09-21 ***PHP版本v7.2.9，对应node_moudlev7.2.9**/







