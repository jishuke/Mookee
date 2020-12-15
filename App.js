/**
 * React Native App
 * 入口文件
 */


import React, {Component} from 'react';
import {
	Platform,
	StyleSheet,
	DeviceInfo,
	BackHandler,
	ToastAndroid,
	Linking,
    Dimensions,
    NativeModules
} from 'react-native';
import {StackNavigator, TabNavigator, TabBarBottom} from 'react-navigation';
import * as WeChat from 'react-native-wechat'
import CodePush from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen';

WeChat.registerApp('wx4de4ad3e29a14d52');

import "./util/SetGlobal";
import './util/Storage';
import StorageUtil from "./util/StorageUtil";
import HomeScreenNew from "./screen/HomeScreenNew";
import NewScreen from "./screen/NewScreen";
import HomeRightGoodsSearch from "./screen/HomeRightGoodsSearch";
import GoodsSearchScreen from "./screen/GoodsSearchScreen";
import CatScreen from "./screen/CatScreen";
import RequestData from "./RequestData";
// 种草社区  -----start
import Manage from "./screen/community/Manage";
import Likes from "./screen/community/Likes";
import Comment from "./screen/community/Comment";
import CommunityDetail from "./screen/community/CommunityDetail";

// 学院
import AcademyListScreen from "./screen/academy/AcademyListScreen";
import AcademyDetailScreen from "./screen/academy/AcademyDetailScreen";

// 发布
import Release from "./screen/community/Release";
// 添加相关商品
import AddRelatedGoods from './screen/community/AddRelatedGoods';
import CommentDetail from './screen/community/CommentDetail';
// 种草社区 -----end
import CartScreen from "./screen/CartScreen";
import MyScreen from "./screen/MyScreen";
import Login from "./pages/Login";
import GoodsBundling from "./pages/GoodsBundling";
import GoodsSuit from "./pages/GoodsSuit";
import TuanGou from "./pages/TuanGou";
import XianShiZheKou from "./pages/XianShiZheKou";
import SearchPage from "./pages/SearchPage";
import MyTeam from "./pages/MyTeam";
import PinTuanOrder from "./pages/PinTuanOrder";
import PTOrderDetail from "./pages/PTOrderDetail";
import PinTuanHome from "./pages/PinTuanHome";
import FenXiaoIncome from "./pages/FenXiaoIncome";
import RegisterMemByThird from "./pages/RegisterMemByThird";
import VendorInstro from "./pages/VendorInstro";
import WebviewPage from "./pages/WebviewPage";
import AccountMoney from "./pages/AccountMoney";
import Welcome from "./pages/Welcome";
import TeamDetail from "./pages/TeamDetail";
import Vendor from "./pages/Vendor";
import ForgetPwd from "./pages/ForgetPwd";
import CollectGoods from "./pages/CollectGoods";
import HelpCenter from "./pages/HelpCenter";
import MyVoucher from "./pages/MyVoucher";
import GetVoucher from "./pages/GetVoucher";
import AddressList from "./pages/AddressList";
import Special from "./pages/Special";
import PointLog from "./pages/PointLog";
import FootPrint from "./pages/FootPrint";
import AddNewAddress from "./pages/AddNewAddress";
import EditAddress from "./pages/EditAddress";
import TeamList from "./pages/TeamList";
import OrderGoodsEvaluate from "./pages/OrderGoodsEvaluate";
import OrderList from "./pages/OrderList";
import ReturnRefundSend from "./pages/ReturnRefundSend";
import ReturnRefundList from "./pages/ReturnRefundList";
import ReturnRefundDetail from "./pages/ReturnRefundDetail";
import InviteFriend from "./pages/InviteFriend";
import HelpCenterCat from "./pages/HelpCenterCat";
import HelpCenterDetasil from "./pages/HelpCenterDetasil";
import MyMessage from "./pages/MyMessage";
import OrderRefund from "./pages/OrderRefund";
import MyMessageDetail from "./pages/MyMessageDetail";
import AccountSetting from "./pages/AccountSetting";
import Register from "./pages/Register";
import OrderDetail from "./pages/OrderDetail";
import BindAccount from "./pages/BindAccount";
import ViewOrderExpress from "./pages/ViewOrderExpress";
import OrderEvaluate from "./pages/OrderEvaluate";
import FeedBack from "./pages/FeedBack";
import MemberInfo from "./pages/MemberInfo";
import ChangePasswd from "./pages/ChangePasswd";
import SecondCat from "./pages/SecondCat";
import GoodsDetailNew from "./pages/GoodsDetailNew";
import EvaluateList from "./pages/EvaluateList";
import ConfirmOrder from "./pages/ConfirmOrder";
import PaymentType from "./pages/PaymentType";
import BlackCardScreen from "./pages/BlackCardScreen";
import BlackCardScreen2 from "./pages/BlackCardScreen2";
import FlashSaleScreen from "./pages/FlashSaleScreen";
import GoodsSearchList from "./pages/GoodsSearchList";
import StartApply from "./pages/StartApply";
import SelTypeIsSupply from "./pages/SelTypeIsSupply";
import SelTypeIsPerson from "./pages/SelTypeIsPerson";
import RechargeList from "./pages/RechargeList";
import SaoMa from "./pages/SaoMa";
import TiXianList from "./pages/TiXianList";
import TiXianDetail from "./pages/TiXianDetail";
import ApplyTiXian from "./pages/ApplyTiXian";
import SelTXMethod from "./pages/SelTXMethod";
import SelReChargeMethod from "./pages/SelReChargeMethod";
import Recharge from "./pages/Recharge";
import AddTiXianAccount from "./pages/AddTiXianAccount";
import TiXianHistoryAccount from "./pages/TiXianHistoryAccount";
import VendorLists from "./pages/VendorLists";
import ChatScteen from "./pages/ChatScteen";
import ChatRecGoods from "./pages/ChatRecGoods";
import SldRegisterProtocol from "./pages/SldRegisterProtocol";
import SeleAddress from "./pages/SeleAddress";
import SelInvoice from "./pages/SelInvoice";
import SldVideoPage from "./component/SldVideoPage";

import TabBarItem from "./screen/widget/TabBarItem";
import MineCouponListPage from "./pages/voucher/coupon/MineCouponListPage";
import ChooseCouponPage from "./pages/voucher/chooseCoupon/ChooseCouponPage";
import RecipientsCouponPage from "./pages/voucher/recipientsCoupon/RecipientsCouponPage";

/*联到家 start*/
import UserCenter from './ldj/pages/UserCenter'
import LdjStore from './ldj/pages/LdjStore'
import LdjStoreDetail from './ldj/pages/LdjStoreDetail'
import LdjGoodsDetail from './ldj/pages/LdjGoodsDetail'
import LdjSearch from './ldj/pages/LdjSearch'
import LdjStoreSearch from './ldj/pages/LdjStoreSearch'
import LdjOrderList from './ldj/pages/LdjOrderList'
import SldMainNoNetWork from './pages/SldNoNetWork'

import LdjHome from './ldj/pages/LdjHome'
import LdjCart from './ldj/pages/LdjCart'
import SldNoNetWork from './ldj/pages/SldNoNetWork'
import LdjSelAddress from './ldj/pages/LdjSelAddress'
import LdjLocation from './ldj/pages/LdjLocation'
import LdjPay from './ldj/pages/LdjPay'
import LdjPaySuccess from './ldj/pages/LdjPaySuccess'
import LdjAddressList from './ldj/pages/LdjAddressList'
import LdjAddNewAddress from './ldj/pages/LdjAddNewAddress'
import LdjConfirmOrder from './ldj/pages/LdjConfirmOrder'
import LdjOrderDetail from './ldj/pages/LdjOrderDetail'
import LdjGlobalSearch from './ldj/pages/LdjGlobalSearch'
import LdjSetting from './ldj/pages/LdjSetting'

/*联到家 end*/

/*积分商城 start*/

import PointsHome from './points/pages/PointsHome';
import PointsCart from './points/pages/PointsCart';
import PointsOrder from './points/pages/PointsOrder';
import PointsUser from './points/pages/PointsUser';
import PointsConfirmOrder from './points/pages/PointsConfirmOrder';
import PointsOrderDetail from './points/pages/PointsOrderDetail';
import PointsGoodsDetail from './points/pages/PointsGoodsDetail';
import PointsList from './points/pages/PointsList';

/*积分商城 end*/

/*商户入驻 start*/
import CompanyReg from "./pages/CompanyReg";
import CompanyStep1 from "./pages/CompanyStep1";
import CompanyStep11 from "./pages/CompanyStep11";
import CompanyStep2 from "./pages/CompanyStep2";
import CompanyStep3 from "./pages/CompanyStep3";
import CompanyStep4 from "./pages/CompanyStep4";
import CompanyStep5 from "./pages/CompanyStep5";
import CompanyEdit from "./pages/CompanyEdit";
import CompanyStep6 from "./pages/CompanyStep6";
import CitySite from "./pages/CitySite";
/*商户入驻 end*/

/*预售 start*/
import Presale from './pages/Presale';
import PresaleConfirm from './pages/PresaleConfirm';
import PreSalePay from './pages/PreSalePay';
import PreSaleOrder from './pages/PreSaleOrder';
import PreSaleOrderDetail from './pages/PreSaleOrderDetail';
/*预售 end*/

/*阶梯团 start*/
import PinLadderOrder from './pages/PinLadderOrder';
import PinLadderOrderDetail from './pages/PinLadderOrderDetail';
import PinLadder from './pages/PinLadder';
import PinLadderConfirm from './pages/PinLadderConfirm';
/*阶梯团 end*/

import ConfirmVoucher from './pages/ConfirmVoucher'
import SelPayOnOrOff from './pages/SelPayOnOrOff'


import MemberGrade from './pages/MemberGrade'
import Experience from './pages/Experience'
import ExperienceRule from './pages/ExperienceRule'

import PerfectInfo from './pages/PerfectInfo'
import GoodsFilter from './pages/GoodsFilter'

import LanguageSettings from './pages/languageSettings/LanguageSettings'
import ChangePayPassword from './pages/ChangePayPassword'

/**
 * ==============
 * 推手
 * ===================
 * */
import JoinVip from './pages/pushHand/JoinVip'
import Settlement from './pages/pushHand/Settlement'
import PaySuccess from './screen/PaySuccess';
import PushHandTeam from './pages/pushHand/PushHandTeam'
import MyReward from './pages/pushHand/MyReward'
import VipGoods from './pages/pushHand/VipGoods'
import ShareJoinVip from './pages/pushHand/ShareJoinVip';
import VIPSelectGoods from './pages/pushHand/VIPSelectGoods';
import { LANGUAGE_CHINESE} from "./lang";
import ServiceScreen from "./pages/ServiceScreen";
import GoodShareScreen from "./pages/GoodShareScreen";
import SetLoginPassword from './pages/SetLoginPassword';

//热更新key
const deploymentKey = Platform.select({
	ios: '4SNwoZphr59CVoLy1yL6NjoZfk304ksvOXqog',
	android: 'fhd3snRROsKUMsIgHdrExKzMbNeE4ksvOXqog',
});

let iOSToolModule = NativeModules.ToolModule;

const lightContentScenes = [ 'Home', 'Mine' ]
const {width, height,scale} = Dimensions.get('window');
if(width === 375 && height === 812){
	ios_type = scale == 3 ? 44:60
}
else if(width === 414 && height === 896){
	ios_type = 60
}

androidIsFS = height / width > 2 ? 1 : 0;//android是否全面屏
height_com_head = height - (Platform.OS === 'ios' ? (DeviceInfo.isIPhoneX_deprecated ? 79 : 64) : 75);
let lastBackPressed = 0;

function getCurrentRouteName(navigationState : any){
	if(!navigationState){
		return null
	}
	const route = navigationState.routes[ navigationState.index ]
	// dive into nested navigators
	if(route.routes){
		return getCurrentRouteName(route)
	}
	return route.routeName
}

const prefix = Platform.OS === 'android' ? 'mookee://mookee/' : 'mookee://';

class App extends Component{
	constructor(props){
		super(props);
		//检测是否有key
		StorageUtil.get('key', (error, object) => {
			if(!error && object){
				key = object
			}
		});

		StorageUtil.get('cur_user_info', (error, object) => {
			if(!error && object){
				cur_user_info = JSON.parse(object);
			}
		});

		this.state = {
			isCheck: '0', //是否审核
			shouldLink: true,
			version: ''
		}
	}

	componentDidMount(){
		//热更新
        CodePush.sync({
            updateDialog: false,
            installMode: CodePush.InstallMode.IMMEDIATE,
            mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
            deploymentKey: deploymentKey,
        });

		BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
		SplashScreen.hide();// 关闭启动屏幕

        StorageUtil.get('language', (error, object) => {
            if (!error && object) {
                global.language = object
            } else {
                global.language = LANGUAGE_CHINESE
            }
        })

		this.getVersion()

		//唤醒app
        Linking.getInitialURL().then(async url => {
            let deepLinkURL = Platform.OS === 'android' ? 'mookee://mookee/shareVip' : 'mookee://shareVip';
        	if (!url || url !== deepLinkURL) {
                return
			}

            // alert('启动唤醒:'+ url);
            // console.log('启动唤醒:', url)
            Linking.openURL(event.url).catch(err => console.error('An error occurred', err));
        });

		//mookee://mookee/shareVip?gid=12&&pushCode=123456
        Linking.addEventListener('url', event => {
        	let deepLinkURL =  Platform.OS === 'android' ? 'mookee://mookee/shareVip' : 'mookee://shareVip';
            if(!event.url || event.url !== deepLinkURL){
            	return
            }

            // alert('后台唤醒---' + event.url)
            // console.log('后台唤醒:', event.url)
            Linking.openURL(event.url).catch(err => console.error('An error occurred', err));
        })
	}

	componentWillUnmount() {
		BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
        Linking.removeEventListener('url')
	}

    //获取版本号
    getVersion() {
		if (Platform.OS === 'ios') {
            iOSToolModule.getAppVersion((error,event) => {
                if(error){
                    console.log(error)
                }else{
                	// console.log('当前版本号:', event)
                    //苹果审核  http://md.mookee.net/cmobile/index.php?app=login&mod=test
                    RequestData.postSldData(
                        AppSldUrl + `/index.php?app=login&mod=test&version=${event}`
                    ).then(result => {
                        if(result.code == 200) {
                            let isCheck =  result.datas ? result.datas : '0'
                            // console.log('是否审核:', isCheck)
                            //关闭审核，可以打开这行代码
                            // isCheck = '1'
                            this.setState({
                                isCheck: isCheck
                            })
                        }
					}).catch(error => {
                            // ViewUtils.sldToastTip(error);
                        })
                }
            })
        } else {

		}
    }

	//安卓返回键关闭APP
	onBackAndroid = () => {
		if(currentSceneTop == 'HomeScreenNew'){//判读是否处于聚焦状态
			if(lastBackPressed&&Date.now()-lastBackPressed  <=2000 ){
				lastBackPressed = 0;
				BackHandler.exitApp();//直接退出APP
			}else{
				lastBackPressed = Date.now();
				ToastAndroid.showWithGravity('再按一次退出应用', ToastAndroid.SHORT, ToastAndroid.CENTER);
				return true;
			}
		}
	};

	render(){
		return (
            <Navigator
                uriPrefix={prefix}
                onNavigationStateChange={
                    (prevState, currentState) => {
                        let currentScene = getCurrentRouteName(currentState)
                        let previousScene = getCurrentRouteName(prevState)
                        // console.log('当前页面:', currentScene, '之前页面', previousScene)
                        console.log('当前页面:', currentState)

                        if(previousScene !== currentScene){
                            if(lightContentScenes.indexOf(currentScene) >= 0){
                                currentSceneTop = currentScene;
                                previousSceneTop = previousScene;
                            }else{
                                currentSceneTop = currentScene;
                                previousSceneTop = previousScene;
                            }

                        }
                    }
                }
            />
		);
	}


}


const Tab = TabNavigator(
	{
		HomeScreenNew: {
			screen: HomeScreenNew,
            // path: 'shareVip/:shareInfo',
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '',
				header: null,
				gesturesEnabled: false,
                showLabel:false,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Home'}
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/tabbar/nav1_n.png') }
						selectedImage={require('./assets/images/tabbar/nav1_s.png')}
					/>
				)
			}),
		},
		CatScreen: {
			screen: CatScreen,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '',
				header: null,
                showLabel:false,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Categories'}
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/tabbar/nav2_n.png') }
						selectedImage={require('./assets/images/tabbar/nav2_s.png')}
					/>
				),
			}),
		},

		AcademyListScreen: {
			screen: AcademyListScreen,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '',
				header: null,
                showLabel:false,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Academy'}
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/tabbar/nav3_n.png') }
						selectedImage={require('./assets/images/tabbar/nav3_s.png')}
					/>
				)
			}),
		},

		CartScreen: {
			screen: CartScreen,
			navigationOptions: ({navigation}) => ({
				header: null,
				tabBarLabel: '',
                showLabel:false,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Cart'}
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/tabbar/nav4_n.png') }
						selectedImage={require('./assets/images/tabbar/nav4_s.png')}
					/>
				)
			}),
		},

		MyScreen: {
			screen: MyScreen,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '',
				header: null,
                showLabel:false,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Account'}
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/tabbar/nav5_n.png') }
						selectedImage={require('./assets/images/tabbar/nav5_s.png')}
					/>
				),
			}),
		},
	},
	{
		tabBarComponent: TabBarBottom,
		tabBarPosition: 'bottom',
		lazy: false,
		animationEnabled: false,
		swipeEnabled: false,
		tabBarVisible: false,
        showLabel: false,
		tabBarOptions: {
			activeTintColor: main_color,
			inactiveTintColor: '#999',
			style: {
			    backgroundColor: '#ffffff',
                height: Platform.OS === 'ios' && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 896) ? 83 : 49,
            },
			tabBarVisible: false,
            showLabel: false,
		},
	},
)


const SldLdjTab = TabNavigator(
	{
		LdjHome: {
			screen: LdjHome,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '首页',
				header: null,
				gesturesEnabled: false,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Home'}
						focused={ focused }
						normalImage={ require('./assets/images/sld_ldj_home.png') }
						selectedImage={ require('./assets/images/sld_ldj_home_sel.png') }
					/>
				)
			}),
		},
		LdjCart: {
			screen: LdjCart,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '购物车',
				header: null,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Cart'}
						focused={ focused }
						normalImage={ require('./assets/images/sld_ldj_cart.png') }
						selectedImage={ require('./assets/images/sld_ldj_cart_sel.png') }
					/>
				)
			}),
		},
		LdjOrderList: {
			screen: LdjOrderList,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '订单',
				header: null,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						focused={ focused }
						normalImage={ require('./assets/images/sld_ldj_order.png') }
						selectedImage={ require('./assets/images/sld_ldj_order_sel.png') }
					/>
				)
			}),
		},
		UserCenter: {
			screen: UserCenter,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '个人中心',
				header: null,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						titleKey={'tabbar.Account'}
						focused={ focused }
						normalImage={ require('./assets/images/sld_ldj_usercenter.png') }
						selectedImage={ require('./assets/images/sld_ldj_usercenter_sel.png') }
					/>
				)
			}),
		},


	},
	{
		tabBarComponent: TabBarBottom,
		tabBarPosition: 'bottom',
		lazy: true,
		animationEnabled: false,
		swipeEnabled: false,
		tabBarVisible: false,
		tabBarOptions: {
			activeTintColor: main_ldj_color,
			inactiveTintColor: '#999',
			style: {backgroundColor: '#ffffff'},
			tabBarVisible: false,
		},
	}
)

// points
const PointsTab = TabNavigator(
	{
		PointsHome: {
			screen: PointsHome,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '首页',
				header: null,
				gesturesEnabled: false,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/pointshome.png') }
					/>
				)
			}),
		},

		PointsCart: {
			screen: PointsCart,
			navigationOptions: ({navigation}) => ({
				header: null,
				tabBarLabel: '购物车',
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/pointscart.png') }
					/>
				)
			}),
		},

		PointsOrder: {
			screen: PointsOrder,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '订单',
				header: null,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/pointsorder.png') }
					/>
				),

			}),
		},

		PointsUser: {
			screen: PointsUser,
			navigationOptions: ({navigation}) => ({
				tabBarLabel: '我的',
				header: null,
				tabBarIcon: ({focused, tintColor}) => (
					<TabBarItem
						tintColor={ tintColor }
						focused={ focused }
						normalImage={ require('./assets/images/pointsuser.png') }
					/>
				),

			}),
		},

	},
	{
		tabBarComponent: TabBarBottom,
		tabBarPosition: 'bottom',
		lazy: true,
		animationEnabled: false,
		swipeEnabled: false,
		tabBarVisible: false,
		tabBarOptions: {
			activeTintColor: main_color,
			inactiveTintColor: '#999',
			style: {backgroundColor: '#ffffff'},
			tabBarVisible: false,
		},
	}
)


const Navigator = StackNavigator(
	{
		Welcome: {
			screen: Welcome,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		},
		AcademyDetailScreen: {
			screen: AcademyDetailScreen,
			navigationOptions: {
				header: null
			}
		},
		StartApply: {
			screen: StartApply,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		TuanGou: {
			screen: TuanGou,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		GoodsSuit: {
			screen: GoodsSuit,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		},
		GoodsBundling: {
			screen: GoodsBundling,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		XianShiZheKou: {
			screen: XianShiZheKou,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PinTuanHome: {
			screen: PinTuanHome,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},

		Tab: {
			screen: Tab,
			navigationOptions: {
				tabBarVisible: false,
				header: null,
				gesturesEnabled: false,
			}
		},

		SldLdjTab: {
			screen: SldLdjTab,
			navigationOptions: {
				tabBarVisible: false,
				header: null,
				gesturesEnabled: false
			}
		},
		PointsTab: {
			screen: PointsTab,
			navigationOptions: {
				tabBarVisible: false,
				header: null,
				gesturesEnabled: false
			}
		},
		Login: {
			screen: Login,
			navigationOptions: {
				tabBarVisible: false,
				header: null,
				gesturesEnabled: false
			}
		},

		CartScreenPage: {
			screen: CartScreen,
			navigationOptions: {
				header: null
			}
		},
		CatScreenPage: {
			screen: CatScreen,
			navigationOptions: {
				header: null
			}
		},
		MyScreenPage: {
			screen: MyScreen,
			navigationOptions: {
				header: null
			}
		},
		WebviewPage: {
			screen: WebviewPage,
			navigationOptions: {
				header: null
			}
		},


		NewScreen: {
			screen: NewScreen,
			navigationOptions: {
				header: null
			}
		},
		SearchPage: {
			screen: SearchPage,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},
		ChatRecGoods: {
			screen: ChatRecGoods,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},
		Vendor: {
			screen: Vendor,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},
		AccountMoney: {
			screen: AccountMoney,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},
		ChatScteen: {
			screen: ChatScteen,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},
		RegisterMemByThird: {
			screen: RegisterMemByThird,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},
		FenXiaoIncome: {
			screen: FenXiaoIncome,
			navigationOptions: {
				header: null
			},
			mode: 'modal',
			headerMode: 'float',
		},
		CollectGoods: {
			screen: CollectGoods,
			navigationOptions: {
				header: null,
				tabBarVisible: false
			},
			mode: "modal"
		},
		SelTypeIsPerson: {
			screen: SelTypeIsPerson,
			navigationOptions: {
				header: null,
				tabBarVisible: false
			},
			mode: "modal"
		},
		TeamList: {
			screen: TeamList,
			navigationOptions: {
				header: null,
				tabBarVisible: false
			},
			mode: "modal"
		},
		SelTypeIsSupply: {
			screen: SelTypeIsSupply,
			navigationOptions: {
				header: null,
				tabBarVisible: false
			},
			mode: "modal"
		},
		TeamDetail: {
			screen: TeamDetail,
			navigationOptions: {
				header: null,
				tabBarVisible: false
			},
			mode: "modal"
		},
		HelpCenter: {
			screen: HelpCenter,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		MyVoucher: {
			screen: MyVoucher,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		GetVoucher: {
			screen: GetVoucher,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SeleAddress: {
			screen: SeleAddress,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		AddressList: {
			screen: AddressList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Special: {
			screen: Special,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		OrderRefund: {
			screen: OrderRefund,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		VendorInstro: {
			screen: VendorInstro,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SaoMa: {
			screen: SaoMa,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PointLog: {
			screen: PointLog,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		MemberInfo: {
			screen: MemberInfo,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		VendorLists: {
			screen: VendorLists,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Register: {
			screen: Register,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		FootPrint: {
			screen: FootPrint,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PinTuanOrder: {
			screen: PinTuanOrder,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PTOrderDetail: {
			screen: PTOrderDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		OrderList: {
			screen: OrderList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		InviteFriend: {
			screen: InviteFriend,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		HelpCenterDetasil: {
			screen: HelpCenterDetasil,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		OrderGoodsEvaluate: {
			screen: OrderGoodsEvaluate,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		MyMessage: {
			screen: MyMessage,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ChangePasswd: {
			screen: ChangePasswd,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		AddNewAddress: {
			screen: AddNewAddress,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		EditAddress: {
			screen: EditAddress,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		AccountSetting: {
			screen: AccountSetting,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
        SetLoginPassword: {
            screen: SetLoginPassword,
            navigationOptions: {
                header: null
            },
            mode: "modal"
        },
        ChangePayPassword: {
            screen: ChangePayPassword,
            navigationOptions: {
                header: null
            },
            mode: "modal"
		},
		LanguageSettings: {
			screen: LanguageSettings,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		MyTeam: {
			screen: MyTeam,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		MyMessageDetail: {
			screen: MyMessageDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		OrderDetail: {
			screen: OrderDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		BindAccount: {
			screen: BindAccount,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ViewOrderExpress: {
			screen: ViewOrderExpress,
			navigationOptions: {
				header: null
			}
		},
		OrderEvaluate: {
			screen: OrderEvaluate,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		FeedBack: {
			screen: FeedBack,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SecondCat: {
			screen: SecondCat,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},

		GoodsDetailNew: {
			screen: GoodsDetailNew,
            path: 'shareVip/:gid/:refeCode',
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		EvaluateList: {
			screen: EvaluateList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ConfirmOrder: {
			screen: ConfirmOrder,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PaymentType: {
			screen: PaymentType,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		BlackCardScreen: {
			screen: BlackCardScreen,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		BlackCardScree2: {
			screen: BlackCardScreen2,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		FlashSaleScreen: {
			screen: FlashSaleScreen,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		HelpCenterCat: {
			screen: HelpCenterCat,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ReturnRefundList: {
			screen: ReturnRefundList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ReturnRefundDetail: {
			screen: ReturnRefundDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ReturnRefundSend: {
			screen: ReturnRefundSend,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ForgetPwd: {
			screen: ForgetPwd,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		RechargeList: {
			screen: RechargeList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		HomeRightGoodsSearch: {
			screen: HomeRightGoodsSearch,
			mode: "modal"
		},
		GoodsSearchScreen: {
			screen: GoodsSearchScreen,
			mode: "modal"
		},
		ChooseCouponPage: {
			screen: ChooseCouponPage,
			mode: "modal"
		},
		MineCouponListPage: {
			screen: MineCouponListPage,
			mode: "modal"
		},
		RecipientsCouponPage: {
			screen: RecipientsCouponPage,
			mode: "modal"
		},
		GoodsSearchList: {
			screen: GoodsSearchList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		TiXianList: {
			screen: TiXianList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		TiXianDetail: {
			screen: TiXianDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ApplyTiXian: {
			screen: ApplyTiXian,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SelTXMethod: {
			screen: SelTXMethod,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SelReChargeMethod: {
			screen: SelReChargeMethod,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Recharge: {
			screen: Recharge,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SelInvoice: {
			screen: SelInvoice,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		AddTiXianAccount: {
			screen: AddTiXianAccount,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		TiXianHistoryAccount: {
			screen: TiXianHistoryAccount,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SldRegisterProtocol: {
			screen: SldRegisterProtocol,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		// ldj
		UserCenter: {
			screen: UserCenter,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjStore: {
			screen: LdjStore,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjStoreDetail: {
			screen: LdjStoreDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjGoodsDetail: {
			screen: LdjGoodsDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjSearch: {
			screen: LdjSearch,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjStoreSearch: {
			screen: LdjStoreSearch,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SldNoNetWork: {
			screen: SldNoNetWork,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SldMainNoNetWork: {
			screen: SldMainNoNetWork,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjOrderList: {
			screen: LdjOrderList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjSelAddress: {
			screen: LdjSelAddress,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjLocation: {
			screen: LdjLocation,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjPay: {
			screen: LdjPay,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjPaySuccess: {
			screen: LdjPaySuccess,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjAddressList: {
			screen: LdjAddressList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjAddNewAddress: {
			screen: LdjAddNewAddress,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjConfirmOrder: {
			screen: LdjConfirmOrder,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjOrderDetail: {
			screen: LdjOrderDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjGlobalSearch: {
			screen: LdjGlobalSearch,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		LdjSetting: {
			screen: LdjSetting,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		// points
		PointsConfirmOrder: {
			screen: PointsConfirmOrder,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PointsOrderDetail: {
			screen: PointsOrderDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PointsGoodsDetail: {
			screen: PointsGoodsDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyReg: {
			screen: CompanyReg,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyStep1: {
			screen: CompanyStep1,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyStep11: {
			screen: CompanyStep11,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyStep6: {
			screen: CompanyStep6,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CitySite:{
			screen: CitySite,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyStep2: {
			screen: CompanyStep2,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyStep3: {
			screen: CompanyStep3,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyStep4: {
			screen: CompanyStep4,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyStep5: {
			screen: CompanyStep5,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CompanyEdit: {
			screen: CompanyEdit,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Presale: {
			screen: Presale,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PresaleConfirm: {
			screen: PresaleConfirm,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PreSalePay: {
			screen: PreSalePay,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PreSaleOrder: {
			screen: PreSaleOrder,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PreSaleOrderDetail: {
			screen: PreSaleOrderDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PinLadderOrder: {
			screen: PinLadderOrder,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PinLadderOrderDetail: {
			screen: PinLadderOrderDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PinLadder: {
			screen: PinLadder,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PinLadderConfirm:{
			screen: PinLadderConfirm,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SelPayOnOrOff:{
			screen: SelPayOnOrOff,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ConfirmVoucher:{
			screen: ConfirmVoucher,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		SldVideoPage:{
			screen: SldVideoPage,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		MemberGrade:{
			screen: MemberGrade,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Experience:{
			screen: Experience,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		ExperienceRule:{
			screen: ExperienceRule,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PointsList:{
			screen: PointsList,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PerfectInfo:{
			screen: PerfectInfo,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		GoodsFilter:{
			screen: GoodsFilter,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Manage: {
			screen: Manage,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Likes: {
			screen: Likes,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Comment: {
			screen: Comment,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		Release: {
			screen: Release,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		AddRelatedGoods: {
			screen: AddRelatedGoods,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CommunityDetail: {
			screen: CommunityDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		CommentDetail: {
			screen: CommentDetail,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		JoinVip: {
			screen: JoinVip,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
        ShareJoinVip: {
            screen: ShareJoinVip,
            navigationOptions: {
                header: null
            },
            mode: "modal"
        },
		Settlement: {
			screen: Settlement,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PaySuccess: {
			screen: PaySuccess,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		PushHandTeam: {
			screen: PushHandTeam,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		MyReward: {
			screen: MyReward,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
		VipGoods: {
			screen: VipGoods,
			navigationOptions: {
				header: null
			},
			mode: "modal"
		},
        VIPSelectGoods: {
            screen: VIPSelectGoods,
            navigationOptions: {
                header: null
            },
            mode: "modal"
		},
		ServiceScreen: {
			screen: ServiceScreen,
			navigationOptions: {
				header: null
			},
			mode: 'modal'
		},
		GoodShareScreen: {
			screen: GoodShareScreen,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		},
	},
	{
		navigationOptions: {
			// headerStyle: { backgroundColor: color.primary }
			headerBackTitle: null,
			headerTintColor: "#333333",
			showIcon: true,
		}
	}
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	mainpage: {
		flex: 1,
		backgroundColor: 'yellow',
	},
	mainpage1: {
		flex: 1,
		backgroundColor: '#f5f5f5',
	},
	mainpage2: {
		flex: 1,
		backgroundColor: 'blue',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	sld_bottom_nav: {
		width: 22,
		height: 22,
		marginBottom: 0,
		marginTop: 0,
		paddingBottom: 0,
		paddingTop: 0,
	},
	sld_common_bottom: {
		height: 55,
	},
	sldtitletext: {
		paddingTop: 0,
		color: '#303030',
		fontSize: 12,
	}
});

export default CodePush(App)
