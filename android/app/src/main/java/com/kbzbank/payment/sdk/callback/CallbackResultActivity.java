package com.kbzbank.payment.sdk.callback;

import android.content.Intent;

import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.kbzbank.payment.KBZPay;

import java.util.HashMap;
import java.util.Map;

public class CallbackResultActivity extends AppCompatActivity {


    private static ReactApplicationContext context_callback;

    public static void initCallBack(ReactApplicationContext context){
        context_callback = context;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        int result = intent.getIntExtra(KBZPay.EXTRA_RESULT, 0);
        WritableMap map = Arguments.createMap();
        if (result == KBZPay.COMPLETED) {
            Log.d("KBZPay", "pay success!");
            map.putString("code","0");
            map.putString("msg","pay success!");
            context_callback.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("kbzPayCallback",map);
        } else {
            String failMsg = intent.getStringExtra(KBZPay.EXTRA_FAIL_MSG);
            Log.d("KBZPay", "pay fail, fail reason = " + failMsg);
            map.putString("code","1");
            map.putString("msg",failMsg);
            context_callback.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("kbzPayCallback",map);
        }
        CallbackResultActivity.this.finish();
    }
}
