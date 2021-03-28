package com.parking;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.Intent;
import android.util.Log;
import java.util.Map;
import java.util.HashMap;

public class PrintDiscount extends ReactContextBaseJavaModule {
    PrintDiscount(ReactApplicationContext context) {
        super(context);
    }


    @ReactMethod
    public void callPrinter(String value) {
        Intent intent = getReactApplicationContext().getPackageManager().getLaunchIntentForPackage("mn.mid.edc");
        if (intent != null) {
            intent.setAction("mn.mid.edc.ACTION_AMOUNT");
            intent.setFlags(0);
            intent.putExtra("printParkingMid", value);
            intent.putExtra("type", "activity");
            getCurrentActivity().startActivityForResult(intent, 100);
        } else Log.e("launch", "null");

        Log.d("PrintDiscount", "Printing value: " + value);
    }

    @ReactMethod
    public void printBarimt(String value) {

        Intent intent = getReactApplicationContext().getPackageManager().getLaunchIntentForPackage("mn.mid.edc");
        if (intent != null) {
            intent.setAction("mn.mid.edc.ACTION_AMOUNT");
            intent.setFlags(0);
            intent.putExtra("printParkingMid", value);
            intent.putExtra("type", "activity");
            getCurrentActivity().startActivityForResult(intent, 100);
        } else Log.e("launch", "null");

        Log.d("Print", "Printing ebarimt: " + value);
    }

    @NonNull
    @Override
    public String getName() {
        return "PrintDiscount";
    }
}
