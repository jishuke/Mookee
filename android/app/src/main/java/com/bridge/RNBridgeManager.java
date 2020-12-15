package com.bridge;

import com.facebook.react.bridge.Callback;

import com.facebook.react.bridge.ReactApplicationContext;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.uimanager.IllegalViewOperationException;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageInfo;

import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;

import static com.umeng.socialize.utils.ContextUtil.getPackageName;

public class RNBridgeManager extends ReactContextBaseJavaModule {

    public RNBridgeManager(ReactApplicationContext reactContext) {

        super(reactContext);

    }

//    重写getName方法声明Module类名称,在RN调用时用到
    @Override
    public String getName() {
        return "BridgeManager";
    }

//    声明的方法，外界调用
    @ReactMethod
    public void getAppVersion(Callback successCallback) {
        try {
            PackageInfo info = getPackageInfo();
            if(info != null){
                successCallback.invoke(info.versionCode);
            }else {
                successCallback.invoke("");
            }
        } catch (IllegalViewOperationException e){

        }
    }

//    获取 APP 信息
    private PackageInfo getPackageInfo(){
        PackageManager manager = getReactApplicationContext().getPackageManager();
        PackageInfo info = null;
        try{
            info = manager.getPackageInfo(getReactApplicationContext().getPackageName(),0);
            return info;
        }catch (Exception e){
            e.printStackTrace();
        }finally {

            return info;
        }
    }

    @ReactMethod
    public void rateNow() {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse("market://details?id=" + getPackageName()));
               // intent.setData(Uri.parse("market://details?id=com.facebook.katana"));
                intent.setPackage("com.android.vending");//这里对应的是谷歌商店，跳转别的商店改成对应的即可
                if (intent.resolveActivity(getReactApplicationContext().getPackageManager()) != null) {
                    getReactApplicationContext().startActivity(intent);
                } else {//没有应用市场，通过浏览器跳转到Google Play
                    Intent intent2 = new Intent(Intent.ACTION_VIEW);
                    intent2.setData(Uri.parse("https://play.google.com/store/apps/details?id=" + getPackageName())); // com.facebook.katana
                    if (intent2.resolveActivity(getReactApplicationContext().getPackageManager()) != null) {
                        getReactApplicationContext().startActivity(intent2);
                    } else {
                        //没有Google Play 也没有浏览器
                    }
                }
            } catch (ActivityNotFoundException activityNotFoundException1) {
                Log.e("tag", "GoogleMarket Intent not found");
            }
        }
   // 原文链接：https://blog.csdn.net/qq_35008279/article/details/83010799
}
