package com.slodonapp;

import android.app.Activity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.kbzbank.payment.KBZPay;
import com.kbzbank.payment.sdk.callback.CallbackResultActivity;


public class PayModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;
    private static Activity ma;
    public PayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }
    public static void initKbz(Activity activity){
        ma = activity;
    }
    @Override
    public String getName() {
        return "KBZPayModule";
    }

    @ReactMethod
    public void startPay(final String orderInfo,final String signType,final String sign,final String  appScheme) {
        CallbackResultActivity.initCallBack(context);
        KBZPay.startPay(ma, orderInfo, sign, signType);
    }

    public static void sendEvent(int resultCode) {
        if (resultCode == KBZPay.COMPLETED) {
            WritableMap params = Arguments.createMap();
            params.putInt("code", resultCode);
            context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("kbzPayCallback", params);
        }
    }
}
