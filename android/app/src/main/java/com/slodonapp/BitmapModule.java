package com.slodonapp;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class BitmapModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;
    private Matrix qrMatrix, bgMatrix;
    private Bitmap qrBitmap = null;
    private volatile int mCurrentImg = 0;
    private static final int totalImg = 15;
    private Paint paint;
    private int padding = 10;
    private String qrCode = "";
    private Handler mHandler = new Handler(Looper.getMainLooper()) {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);

            if (msg.what == 1000) {
                for (int i = 0; i < totalImg; i++) {
                    Log.e("xxxx", qrCode);
                    if(i<10){
                        compoundPoster(qrBitmap, "Invite code "+qrCode.replace("邀请码",""), i);
                    }else{
                        compoundPoster(qrBitmap, "邀请码 "+qrCode.replace("邀请码",""), i);
                    }
                }
            } else if (msg.what == 1001) {
                addCount();
            } else if (msg.what == 1002) {
                Log.e("BitmapModule", "发送事件");
                sendEvent();
            }
        }
    };

    public BitmapModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        qrMatrix = new Matrix();
        qrMatrix.setScale(1.1f, 1.1f);

        bgMatrix = new Matrix();
        bgMatrix.setScale(0.8f, 0.8f);
        paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setTextSize(24f);
    }

    @Override
    public String getName() {
        return "BitMapModule";
    }

    @ReactMethod
    public void qrCodeUrl(final String qrcodeUrl, final String codeStr) {
        Log.e("BitmapModule", "开始下载");
        this.qrCode = codeStr;
        this.mCurrentImg = 0;
        new Thread(new Runnable() {
            @Override
            public void run() {
                URL url;
                HttpURLConnection connection = null;
                Bitmap bitmap = null;
                try {
                    url = new URL(qrcodeUrl);
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setConnectTimeout(6000); //超时设置
                    connection.setDoInput(true);
                    connection.setUseCaches(false); //设置不使用缓存
                    InputStream inputStream = connection.getInputStream();
                    bitmap = BitmapFactory.decodeStream(inputStream);
                    inputStream.close();
                    Log.e("BitmapModule", "下载完成");
                    qrBitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), qrMatrix, true);
                    mHandler.sendEmptyMessage(1000);

                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (connection != null) {
                        connection.disconnect();
                    }
                }
            }
        }).start();
    }

    private synchronized void addCount() {
        this.mCurrentImg++;
        Log.e("BitmapModule", "currentImg: " + this.mCurrentImg + "totalImg: " + totalImg);
        if (this.mCurrentImg == totalImg) {
            Log.e("BitmapModule", "存储结束");
            mHandler.sendEmptyMessage(1002);
        }
    }

    private void compoundPoster(final Bitmap bitmap,final String inviteCode, final int type) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                Bitmap bgBitmap = getPosterBg(type);
                int bgWidth = (int) (bgBitmap.getWidth() * 0.8);
                int bgHeight = (int) (bgBitmap.getHeight() * 0.8);
                Bitmap bitmapCanvas = Bitmap.createBitmap(bgWidth, bgHeight, bgBitmap.getConfig());
                Canvas canvas = new Canvas(bitmapCanvas);
                canvas.drawBitmap(bgBitmap, bgMatrix, null);
                //Log.e("BitmapModule", "width: " + bitmap.getWidth() + "height: " + bitmap.getHeight());
                paint.setColor(Color.WHITE);
               // canvas.drawText("Invitation Code", (bgWidth - paint.measureText("Invitation Code")) / 2f, bgHeight / 3f * 2 + bitmap.getHeight() + 20 , paint);
                paint.setTextAlign(Paint.Align.CENTER);
                paint.setTextSize(40);
                canvas.drawText(inviteCode, bgWidth >> 1, bgHeight * 0.873f+6, paint);
                //canvas.drawBitmap(bitmap, (bgWidth - bitmap.getWidth()) / 2f, bgHeight * 0.674f, null);
                int size = (int)(bgWidth * 0.2867);
                paint.setColor(Color.YELLOW);
                int x1 = (int)((bgWidth - size) / 2f);
                int y1 = (int)(bgHeight * 0.6699f);
                //canvas.drawRect(new Rect(x1, y1, x1 + size, y1 + size), paint);
                canvas.drawBitmap(bitmap, new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight()), new Rect(x1, y1, x1 + size, y1 + size), null);
                saveBitmap(bitmapCanvas, type, true);
                saveBitmap(bitmapCanvas, type, false);

                mHandler.sendEmptyMessage(1001);
            }
        }).start();
    }

    private void saveBitmap(Bitmap bitmap, int type, boolean isSmall) {
        File f;
        if (isSmall) {
            f = new File(context.getFilesDir() + "/newImage_small_" + type + ".png");
        } else {
            f = new File(context.getFilesDir() + "/newImage_big_" + type + ".png");
        }
        Log.e("BitmapModule", "开始存储" + f.getAbsolutePath());
        if (f.exists()) {
            f.delete();
        }

        try {
            FileOutputStream out = new FileOutputStream(f);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private float measureTextHeight(Paint paint){
        float height = 0f;
        if(null == paint){
            return height;
        }
        Paint.FontMetrics fontMetrics = paint.getFontMetrics();
        height = fontMetrics.descent - fontMetrics.ascent;
        return height;
    }

    private Bitmap getPosterBg(int type) {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize = 2;
        switch (type) {
            case 0:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg1, options);
            case 1:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg2, options);
            case 2:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg3, options);
            case 3:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg4, options);
            case 4:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg5, options);
            case 5:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg6, options);
            case 6:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg7, options);
            case 7:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg8, options);
            case 8:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg9, options);
            case 9:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg10, options);
            case 10:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg11, options);
            case 11:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg12, options);
            case 12:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg13, options);
            case 13:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg14, options);
            case 14:
            default:
                return BitmapFactory.decodeResource(context.getResources(), R.drawable.poster_bg15, options);
        }
    }

    public static void sendEvent() {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("QrCodeImageReminder", null);
    }
}
