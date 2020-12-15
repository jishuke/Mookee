/*
 * APP 升级相关接口
 * @by slodon
 * */

import React from 'react';
import {Alert, NativeModules, Platform} from "react-native";
import LogUtil from "../util/LogUtil";
import RequestData from "../RequestData";
import ViewUtils from "../util/ViewUtils";
import {I18n} from './../lang/index'


let iosNewVersion = '';
let iosCurrentVersion = '';
let androidNewVersion = '';
let androidCurrentVersion = '';
let iosDownloadUrl = '';
let androidDownloadUrl = '';

export default class UpgradeUtil{

	static checkIsUpdate(){
		if(Platform.OS === 'ios'){
			return this.compareVersion(iosNewVersion, iosCurrentVersion);
		}else{
			//return this.compareVersion(androidNewVersion, androidCurrentVersion);
		}
	}

	static compareVersion(reqV, curV){
		let arr1 = reqV.split('.');
		let arr2 = curV.split('.');
		//将两个版本号拆成数字
		let minL = Math.min(arr1.length, arr2.length);
		let pos = 0;        //当前比较位
		let diff = 0;        //当前为位比较是否相等

		//逐个比较如果当前位相等则继续比较下一位
		while(pos < minL){
			diff = parseInt(arr1[ pos ]) - parseInt(arr2[ pos ]);
			if(diff != 0){
				break;
			}
			pos++;
		}

		if(diff > 0){
			LogUtil.log('新版本')
			return true;
		}
		return false;
	}

	static updateApp(showTip){

		if(Platform.OS === 'ios'){
			NativeModules.iosupgrade.getAppVersion((error, Version) => {
				if(error){
					console.log(error)
				}else{
					iosCurrentVersion = Version;
				}
			})
		}else{
			/*RNAndroidAutoUpdate.getVersionName((versionCode) => {
				androidCurrentVersion = versionCode;
			});*/
		}

		// this.GetAPPOnlineVersion(showTip);
	}


	static GetAPPOnlineVersion(showTip){

		RequestData.getSldData(AppSldUrl + `/index.php?app=index&mod=getAppVersion`).then(res => {
			LogUtil.log(res);
			if(res.state == 200){
				iosNewVersion = res.data.app_ios_version,
					androidNewVersion = res.data.app_android_version,
					iosDownloadUrl = res.data.app_ios_download,
					androidDownloadUrl = res.data.app_android_download
				if(this.checkIsUpdate() == true){
					//this.downloadAPP();
				}else{
					if(showTip == true)
					{
						ViewUtils.sldToastTip(I18n.t('hud.update'));
					}

				}
			}else{
				if(showTip == true){
					ViewUtils.sldToastTip("获取版本失败");
				}
			}
		})
	}


	static downloadAPP(){
		Alert.alert(
			'',
			'有新版本，是否需要更新？',
			[
				{
					text: '取消', onPress: (() => {
					}), style: 'cancle'
				},
				{
					text: '确定', onPress: (() => {
						if(Platform.OS === 'ios'){
							ViewUtils.sldToastTip("正在打开APP商店");
							NativeModules.iosupgrade.openAPPStore(osDownloadUrl);

						}else{
							ViewUtils.sldToastTip("更新包正在下载中,完成后开始安装");
						//	RNAndroidAutoUpdate.goToDownloadApk(androidDownloadUrl);
						}

					})
				}

			]
		);
	}
}


