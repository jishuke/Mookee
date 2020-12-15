/*
* 自适应方法
* @by slodon
* */
import {Dimensions, Platform} from 'react-native';

const dim = Dimensions.get('window');

function isIPhoneX() {
    return (Platform.OS === 'ios' && dim.height === 812);
}

function isIPhoneXR() {
    return (Platform.OS === 'ios' && dim.height === 896);
}

function isIPhoneXSeries() {
    return isIPhoneX() || isIPhoneXR();
}

const IOS_SAFE_TOP_HEIGHT = isIPhoneXSeries() ? 44 : 20;

export {
    IOS_SAFE_TOP_HEIGHT,
    isIPhoneX,
    isIPhoneXR,
    isIPhoneXSeries,
}
