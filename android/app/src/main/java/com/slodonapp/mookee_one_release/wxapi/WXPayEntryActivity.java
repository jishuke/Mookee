package com.slodonapp.mookee_one_release.wxapi;

import android.app.Activity;
import android.os.Bundle;


public class WXPayEntryActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //WeChatModule.handleIntent(getIntent());
        finish();
    }
}
