package com.slodonapp;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Base64;
import android.view.KeyEvent;
import android.content.Intent;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // here

import com.umeng.facebook.FacebookSdk;
import com.umeng.socialize.UMShareAPI;


//import android.support.annotation.Nullable;
import android.util.Log;
import android.net.Uri;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SlodonApp";
    }



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
        ShareModule.initSocialSDK(this);
        PayModule.initKbz(this);
        FacebookSdk.sdkInitialize(getApplicationContext());
        //获取唤醒app的参数
        //获取网页传递过来的参数
        Intent mgetvalue = getIntent();
        String maction = mgetvalue.getAction();
        if (Intent.ACTION_VIEW.equals(maction )) {
            Uri uri = mgetvalue.getData();
            Log.e("uri",uri.toString());
            if (uri != null) {
                String title = uri.getQueryParameter("title");
                String content = uri.getQueryParameter("content");
                Log.e("打印","执行打印功能");
                Log.e("打印"+title,"网页传递值为：title=" + title + ",content=" + content);
                //Use 0 or MODE_PRIVATE for the default operation
                SharedPreferences settings = getSharedPreferences("fanrunqi", 0);
                SharedPreferences.Editor editor = settings.edit();
                editor.putString("title", title);
                editor.putString("content", content);
                // 提交本次编辑
                editor.commit();
                //从缓存读取
                Log.e("读取","执行打印功能");
                Log.e("读取","网页传递值为：title=" + settings.getString("title","a") + ",content=" + settings.getString("content","b"));
                String titles = settings.getString("title","a");
                // sendEvent(getReactInstanceManager().getCurrentReactContext(),titles);
            }
        }

        //UmengTool.getSignature(MainActivity.this); // 获取签名 keyHash

        // Add code to print out the key hash
        try {
            PackageInfo info = getPackageManager().getPackageInfo(
                    "com.slodonapp.mookee_one_release",
                    PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException e) {

        } catch (NoSuchAlgorithmException e) {

        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        UMShareAPI.get(this).onActivityResult(requestCode, resultCode, data);
    }

    public void sendEvent(ReactContext reactContext,String aMessage) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("AndroidToRNMessage", aMessage);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (BuildConfig.DEBUG) {
            if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
                if (null != getReactInstanceManager().getDevSupportManager()) {
                    getReactInstanceManager().getDevSupportManager().showDevOptionsDialog();
                    return true;
                }
            }
        }
        return super.onKeyDown(keyCode, event);
    }
}
