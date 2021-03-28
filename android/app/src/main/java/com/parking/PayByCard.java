package com.parking;

import android.app.Activity;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import static android.content.Context.CONNECTIVITY_SERVICE;


public class PayByCard extends ReactContextBaseJavaModule implements ActivityEventListener {
    final ReactApplicationContext reactApplicationContext;
    Promise promise;

    PayByCard(ReactApplicationContext context) {
        super(context);
        this.reactApplicationContext = context;
        this.reactApplicationContext.addActivityEventListener(this);
    }
    @ReactMethod
    public void pay(String value, Promise promise) {
        this.promise = promise;
        Intent intent = getCurrentActivity().getPackageManager().getLaunchIntentForPackage("mn.mid.edc");
        if (intent != null) {
            intent.setAction("mn.mid.edc.ACTION_AMOUNT");
            intent.setFlags(0);
            intent.putExtra("amount", value);
            intent.putExtra("type", "activity");
            getCurrentActivity().startActivityForResult(intent, 100);
        } else Log.e("launch", "null");
    }

    @ReactMethod
    public void doData(Promise promise) {
        this.promise = promise;
        // Add any NetworkCapabilities.NET_CAPABILITY_...
        int[] capabilities = new int[]{ NetworkCapabilities.NET_CAPABILITY_INTERNET };
        // Add any NetworkCapabilities.TRANSPORT_...
        int[] transportTypes = new int[]{ NetworkCapabilities.TRANSPORT_CELLULAR };
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            alwaysPreferNetworksWith(capabilities, transportTypes,this.promise);
        }

    }

    @ReactMethod
    public void doWifi(Promise promise) {
        this.promise = promise;
        // Add any NetworkCapabilities.NET_CAPABILITY_...
        int[] capabilities = new int[]{NetworkCapabilities.NET_CAPABILITY_INTERNET};
        // Add any NetworkCapabilities.TRANSPORT_...
        int[] transportTypes = new int[]{NetworkCapabilities.TRANSPORT_WIFI};
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            alwaysPreferNetworksWith(capabilities, transportTypes,this.promise);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public static void alwaysPreferNetworksWith(@NonNull int[] capabilities, @NonNull int[] transportTypes, Promise promise) {

        NetworkRequest.Builder request = new NetworkRequest.Builder();

        // add capabilities
        for (int cap: capabilities) {
            request.addCapability(cap);
        }

        // add transport types
        for (int trans: transportTypes) {
            request.addTransportType(trans);
        }

        final ConnectivityManager connectivityManager = (ConnectivityManager) MainApplication.getApp().getSystemService(CONNECTIVITY_SERVICE);

        connectivityManager.registerNetworkCallback(request.build(), new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                WritableMap map = Arguments.createMap();
                boolean result;
                try {
                    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                        result = ConnectivityManager.setProcessDefaultNetwork(network);
                        map.putString("return ni:", String.valueOf(result));
                        promise.resolve(map);
                    } else {
                        result = connectivityManager.bindProcessToNetwork(network);
                        map.putString("return ni:", String.valueOf(result));
                        promise.resolve(map);
                    }
                } catch (IllegalStateException e) {
                    Log.e("payByCellular", "ConnectivityManager.NetworkCallback.onAvailable: ", e);
                }
            }
        });
    }


    @NonNull
    @Override
    public String getName() {
        return "PayByCard";
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if(resultCode == 200){
            WritableMap map = Arguments.createMap();
            map.putString("code", data.getExtras().getString("code"));
            map.putString("rrn", data.getExtras().getString("rrn"));
            map.putString("invoice", data.getExtras().getString("invoice"));
            map.putString("description", data.getExtras().getString("description"));
            this.promise.resolve(map);
        }else{
            Log.e("error", "Aldaa ch garsan baij medne and mine.");
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
