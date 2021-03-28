package com.parking;

import android.util.Log;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.pax.dal.IScanner;
import com.pax.dal.entity.EScannerType;

import javax.annotation.Nonnull;

public class BarcodeModule extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private class BarcodeScanner implements IScanner.IScanListener {
        Promise promise;
        IScanner scanner;
        String barcode;
        boolean isCancelled = false;

        BarcodeScanner(Promise promise) {
            this.promise = promise;
        }

        void start() {
            scanner = MainApplication.getPaxSdk().getDal().getScanner(EScannerType.REAR);
            if (scanner.open()) {
                scanner.start(this);
            }
        }

        void handlePromise() {
            if (barcode != null) {
                if(barcodeScanner.barcode.startsWith("\000026"))
                    promise.resolve(barcodeScanner.barcode.replace("\000026", ""));
                else
                    promise.resolve(barcodeScanner.barcode);
            } else {
                if (isCancelled) {
                    promise.reject("CANCELLED", "Хэрэглэгч цуцаллаа.");
                } else {
                    promise.reject("UNKNOWN_ERROR", "Баркод уншихад алдаа гарлаа.");
                }
            }
        }

        @Override
        public void onRead(String barcode) {
            scanner.close();
            this.barcode = barcode;

        }

        @Override
        public void onCancel() {
            isCancelled = true;
        }

        @Override
        public void onFinish() {
        }
    }

    private BarcodeScanner barcodeScanner;

    private static ReactApplicationContext reactContext;

    BarcodeModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        com.parking.BarcodeModule.reactContext = reactContext;
        com.parking.BarcodeModule.reactContext.addLifecycleEventListener(this);
    }

    @Nonnull
    @Override
    public String getName() {
        return "BarcodeModule";
    }

    @ReactMethod
    public void init(Promise promise) {
        if (MainApplication.getPaxSdk().getDal() != null) {
            promise.resolve(null);
        } else {
            promise.reject("NOT_PAX_DEVICE", "PAX төхөөрөмж биш байна.");
        }
    }

    @ReactMethod
    public void scan(Promise promise) {
        barcodeScanner = new BarcodeScanner(promise);
        barcodeScanner.start();
    }

    @Override
    public void onHostResume() {
        if (barcodeScanner != null) {
            barcodeScanner.handlePromise();
            barcodeScanner = null;
        }
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
    }
}
