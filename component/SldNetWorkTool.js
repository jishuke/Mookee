import React,{
	NetInfo,
	Platform
} from 'react-native';

const NOT_NETWORK = "I18n.t('SldNoNetWork.text1')";
const TAG_NETWORK_CHANGE = "NetworkChange";

/***
 * 检查网络链接状态
 * @param callback
 */
const checkNetworkState = (callback) =>{
	NetInfo.isConnected.fetch().done(
		(isConnected) => {
			callback(isConnected);
		}
	);
}

/***
 * 检查网络链接状态
 * @param callback
 */
const checkNetWork = (callback) =>{
	if (Platform.OS === 'ios') {
		NetInfo.isConnected.addEventListener('change', (isConnected)=>{
			console.log('isConnected:',isConnected);
			callback(isConnected);
		});
	} else {
		NetInfo.isConnected.fetch().then(isConnected => {
			console.log('isConnected:',isConnected);
			callback(isConnected);
		})
	}
}

/***
 * 移除网络状态变化监听
 * @param tag
 * @param handler
 */
const removeEventListener = (tag,handler) => {
	NetInfo.isConnected.removeEventListener(tag, handler);
}

/***
 * 添加网络状态变化监听
 * @param tag
 * @param handler
 */
const addEventListener = (tag,handler)=>{
	NetInfo.isConnected.addEventListener(tag, handler);
}

export default{
	checkNetworkState,
	addEventListener,
	removeEventListener,
	checkNetWork,
	NOT_NETWORK,
	TAG_NETWORK_CHANGE
}
