package com.shareridenew;

import android.app.Activity;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NativeModuleManager extends ReactContextBaseJavaModule {

    NativeModuleManager(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "NativeModuleManager";
    }
    @ReactMethod
    public void exitApp() {
        Log.i("exit11 ","exit app");
        System.exit(0);
    }


}