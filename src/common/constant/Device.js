/*
 * 设备类型，屏幕尺寸
 * @by cwl
 * */

import {Dimensions} from "react-native";

export default class Device {

	static height = Dimensions.get('window').height;
	static width = Dimensions.get('window').width;

}
