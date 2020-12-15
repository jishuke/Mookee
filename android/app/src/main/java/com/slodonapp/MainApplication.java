package com.slodonapp;

import android.app.Application;
import android.os.Handler;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.beefe.picker.PickerViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.remobile.marqueeLabel.RCTMarqueeLabelPackage;
import com.remobile.toast.RCTToastPackage;
import com.rnfs.RNFSPackage;
import com.theweflex.react.WeChatPackage;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;
import com.yunpeng.alipay.AlipayPackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.reactnative.camera.RNCameraPackage;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import com.bridge.RNReactPackage;

import fr.greweb.reactnativeviewshot.RNViewShotPackage;

public class MainApplication extends Application implements ReactApplication {

    private static final String TAG = MainApplication.class.getName();
    private Handler handler;

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNI18nPackage(),
                    //new JPushPackage(),
                    new RNFSPackage(),
                    new RNExitAppPackage(),
                    new PickerViewPackage(),
                    new RNCameraPackage(),
                    new ReactVideoPackage(),
                    new SplashScreenReactPackage(),
                    new RCTToastPackage(),
                    new PickerPackage(),
                    new RCTMarqueeLabelPackage(),
                    new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG, "http://161.117.183.5:3000/"),
                    new AlipayPackage(),
                    new LinearGradientPackage(),
                    new ShouYouShowInfoPackage(),
                    new DplusReactPackage(),
                    new OrientationPackage(),
                    new WeChatPackage(),
                    new PayReactPackage(),
                    new RNPermissionsPackage(),
                    new RNViewShotPackage(),
                    new RNReactPackage(),
                    new RNCWebViewPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        PlatformConfig.setWeixin("wx4de4ad3e29a14d52", "f164e63252eec90f07a0ea3a9b47906b");
        PlatformConfig.setQQZone("1106784958", "N0XxtDzAjwaiJfGT");
        PlatformConfig.setSinaWeibo("3110784434 ", "31ed549fcc716b3847c986de8850a5ad", "");
        PlatformConfig.setTwitter("123123123", "123123123213");
        RNUMConfigure.init(this, "5b2e039df43e487d58000020", "Umeng", UMConfigure.DEVICE_TYPE_PHONE, "5a8f657ada97d4a7e36742abea82830b");
        initUpush();
        closeAndroidPDialog(); //解决 Android P 启动提示 detected problems with api
    }

    private void initUpush() {
        handler = new Handler(getMainLooper());

        //sdk开启通知声音
        // sdk关闭通知声音
        //		mPushAgent.setNotificationPlaySound(MsgConstant.NOTIFICATION_PLAY_SDK_DISABLE);
        // 通知声音由服务端控制
        //		mPushAgent.setNotificationPlaySound(MsgConstant.NOTIFICATION_PLAY_SERVER);

        //		mPushAgent.setNotificationPlayLights(MsgConstant.NOTIFICATION_PLAY_SDK_DISABLE);
        //		mPushAgent.setNotificationPlayVibrate(MsgConstant.NOTIFICATION_PLAY_SDK_DISABLE);


        //使用自定义的NotificationHandler，来结合友盟统计处理消息通知，参考http://bbs.umeng.com/thread-11112-1-1.html
        //CustomNotificationHandler notificationClickHandler = new CustomNotificationHandler();


    }

    private void closeAndroidPDialog() {
        try {
            Class aClass = Class.forName("android.content.pm.PackageParser$Package");
            Constructor declaredConstructor = aClass.getDeclaredConstructor(String.class);
            declaredConstructor.setAccessible(true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            Class cls = Class.forName("android.app.ActivityThread");
            Method declaredMethod = cls.getDeclaredMethod("currentActivityThread");
            declaredMethod.setAccessible(true);
            Object activityThread = declaredMethod.invoke(null);
            Field mHiddenApiWarningShown = cls.getDeclaredField("mHiddenApiWarningShown");
            mHiddenApiWarningShown.setAccessible(true);
            mHiddenApiWarningShown.setBoolean(activityThread, true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
