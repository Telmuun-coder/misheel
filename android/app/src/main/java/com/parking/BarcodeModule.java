package com.parking;

import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.pax.dal.IScanner;
import com.pax.dal.entity.EScannerType;
import com.topwise.cloudpos.aidl.camera.AidlCameraScanCode;
import com.topwise.cloudpos.aidl.camera.AidlCameraScanCodeListener;
import com.topwise.cloudpos.data.AidlScanParam;

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

    public class BarcodeScannerTop {

        AidlCameraScanCode aidlCameraScanCode;
        Promise promise;
        String barcode;
        boolean isCancelled = false;

        BarcodeScannerTop (Promise promise) {
            this.promise = promise;
        }

        void start() {
            aidlCameraScanCode = DeviceTopUsdkServiceManager.getInstance().getCameraManager();
            Bundle bundle = new Bundle();
            bundle.putSerializable(AidlScanParam.SCAN_CODE, new AidlScanParam(0, 10));
            try {
                aidlCameraScanCode.scanCode(bundle, new AidlCameraScanCodeListener.Stub() {

                    @Override
                    public void onResult(String s) throws RemoteException {
                        aidlCameraScanCode.stopScan();
                        barcodeScannerTop.barcode = s;
                    }

                    @Override
                    public void onCancel() throws RemoteException {
                        aidlCameraScanCode.stopScan();
                        isCancelled = true;
                    }

                    @Override
                    public void onError(int i) throws RemoteException {
                        Log.d("here", "scan onFail(), errorCode = " + i);
                        aidlCameraScanCode.stopScan();
                    }

                    @Override
                    public void onTimeout() throws RemoteException {
                        aidlCameraScanCode.stopScan();
                    }
                });
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }

        void handlePromise() {
            if (barcode != null) {
                promise.resolve(barcodeScannerTop.barcode);
            } else {
                if (isCancelled) {
                    promise.reject("CANCELLED", "Хэрэглэгч цуцаллаа.");
                } else {
                    promise.reject("UNKNOWN_ERROR", "Баркод уншихад алдаа гарлаа.");
                }
            }
        }


    }


    private BarcodeScanner barcodeScanner;
    private BarcodeScannerTop barcodeScannerTop;

    private static ReactApplicationContext reactContext;

    boolean isPaxDevice = true;

    BarcodeModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        BarcodeModule.reactContext = reactContext;
        BarcodeModule.reactContext.addLifecycleEventListener(this);
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
            if (DeviceTopUsdkServiceManager.getInstance().getSystemService() != null) {
                isPaxDevice = false;
                promise.resolve(null);
            } else {
                promise.reject("NOT_PAX_DEVICE", "PAX төхөөрөмж биш байна.");
            }
        }
    }

    @ReactMethod
    public void scan(Promise promise) {
        Log.e("here", isPaxDevice + "");
        if (isPaxDevice) {
            barcodeScanner = new BarcodeScanner(promise);
            barcodeScanner.start();
        } else {
            barcodeScannerTop = new BarcodeScannerTop(promise);
            barcodeScannerTop.start();
        }
    }

    @Override
    public void onHostResume() {
        if (barcodeScanner != null) {
            barcodeScanner.handlePromise();
            barcodeScanner = null;
        } else if (barcodeScannerTop != null) {
            barcodeScannerTop.handlePromise();
            barcodeScannerTop = null;
        }
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
    }
}
