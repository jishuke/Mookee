package com.slodonapp;

import android.content.SharedPreferences;
import android.os.RemoteException;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class SYShowInfo extends ReactContextBaseJavaModule {

    ReactApplicationContext aContext;

    public SYShowInfo(ReactApplicationContext reactContext) {
        super(reactContext);
        aContext=reactContext;
    }

    @Override
    public String getName() {
        return "SYSHoWInfo";
    }



    @ReactMethod
    public void getCache(String type, String val1) throws RemoteException {
        //获取缓存
        Log.e("读取","读取缓存");
        SharedPreferences settings = aContext.getSharedPreferences("fanrunqi", 0);
        Log.e("读取","执行打印功能");
        Log.e("读取","网页传递值为：title=" + settings.getString("title","a") + ",content=" + settings.getString("content","b"));
        sendEvent("aaaaaaa");
        sendEvent(settings.getString("title","a"));

    }



    @ReactMethod
    public void setCache() throws RemoteException {
        //清空缓存
        Log.e("清空缓存","清空缓存");
        SharedPreferences settings = aContext.getSharedPreferences("fanrunqi", 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.clear();
        // 提交本次编辑
        editor.commit();

    }

    public void sendEvent(String aMessage) {
        Log.e("发送","准备发送");
        aContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("AndroidToRNMessage", aMessage);
    }


}
