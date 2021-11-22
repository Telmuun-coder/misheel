package com.parking;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.mid.glwrapper.IGL;
import com.mid.glwrapper.imgprocessing.IImgProcessing;
import com.mid.glwrapper.page.IPage;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Hashtable;

import javax.annotation.Nonnull;

import static android.graphics.Color.BLACK;
import static android.graphics.Color.WHITE;

public class Generator extends ReactContextBaseJavaModule implements LifecycleEventListener {

    private static IGL gl;
    int FONT_BIG = 20;
    int FONT_NORMAL = 24;
    int FONT_SMALL = 16;
    int FONT_LARGE = 32;


    private static ReactApplicationContext reactContext;

    Generator(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        Generator.reactContext = reactContext;
        Generator.reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {

    }

    @NonNull
    @Override
    public String getName() {
        return "Generator";
    }

    @ReactMethod
    public void init(String data, Promise promise) {
        gl = MainApplication.getGl();

        Bitmap bmp = generateBitmap(data);


        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();

        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);

        Log.e("DARARARAR: ", encoded);

        Intent intent;
        intent = getCurrentActivity().getPackageManager().getLaunchIntentForPackage("mn.mid.edc");
        if (intent != null) {
            intent.setAction("mn.mid.edc.ACTION_AMOUNT");
            intent.setFlags(0);
            intent.putExtra("printBitmap", encoded);
            getCurrentActivity().startActivityForResult(intent, 100);
        } else {
            intent = getCurrentActivity().getPackageManager().getLaunchIntentForPackage("com.mid.app");

            if (intent != null) {
                intent.setAction("com.mid.app.ACTION_AMOUNT");
                intent.setFlags(0);
                intent.putExtra("printBitmap", encoded);
                getCurrentActivity().startActivityForResult(intent, 100);
            } else Log.e("launch", "null");

        }


    }

    public Bitmap generateBitmap(String data) {
        IPage page = generatePage();

        page.addLine()
                .addUnit(page.createUnit()
                        .setText("ULAANBAATAR, MONGOLIA")
                        .setFontSize(FONT_SMALL)
                        .setWeight(3.0f)
                        .setGravity(Gravity.CENTER_HORIZONTAL));
        page.addLine().adjustTopSpace(20);


        try {
            JSONObject print = new JSONObject(data);

            if (print.has("ebarimt")) {

                JSONObject ebarimt = new JSONObject(print.getString("ebarimt"));

                if (ebarimt.getString("billId") != null && !ebarimt.getString("billId").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("ДДТД: " + ebarimt.getString("billId"))
                                    .setFontSize(16)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }

                if (ebarimt.getString("date") != null && !ebarimt.getString("date").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("ОГНОО: " + ebarimt.getString("date"))
                                    .setFontSize(16)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }


                if (ebarimt.getString("registerNo") != null && !ebarimt.getString("registerNo").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Регистер: " + ebarimt.getString("registerNo"))
                                    .setFontSize(16)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }

                if (ebarimt.getString("time") != null && !ebarimt.getString("time").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Хугацаа: " + ebarimt.getString("time"))
                                    .setFontSize(16)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }


                page.addLine().addUnit(page.createUnit()
                        .setText(MainApplication.getApp().getString(R.string.receipt_sign_line))
                        .setGravity(Gravity.CENTER));

                if (ebarimt.getString("amount") != null && !ebarimt.getString("amount").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Дүн: " + ebarimt.getString("amount"))
                                    .setFontSize(20)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }

                if (ebarimt.getString("tax") != null && !ebarimt.getString("tax").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("НӨАТ: " + ebarimt.getString("tax"))
                                    .setFontSize(20)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }

                page.addLine().addUnit(page.createUnit()
                        .setText(MainApplication.getApp().getString(R.string.receipt_sign_line))
                        .setGravity(Gravity.CENTER));


                if (ebarimt.getString("lottery") != null && !ebarimt.getString("lottery").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Сугалааны дугаар: " + ebarimt.getString("lottery"))
                                    .setFontSize(20)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.CENTER_HORIZONTAL));

                    page.addLine().adjustTopSpace(5);
                }


                if (ebarimt.getString("qrData") != null && !ebarimt.getString("qrData").isEmpty()) {
                    page.addLine().addUnit(page.createUnit()
                            .setBitmap(createQRImage(ebarimt.getString("qrData"), 360))
                            .setGravity(Gravity.CENTER));
                }


                if (print.has("tbarimt")) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine().addUnit(page.createUnit()
                            .setText(MainApplication.getApp().getString(R.string.receipt_sign_line))
                            .setGravity(Gravity.CENTER));

                    page.addLine().adjustTopSpace(10);

                    JSONObject tbarimt = new JSONObject(print.getString("tbarimt"));

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Төлбөр төлсөн баримт")
                                    .setFontSize(FONT_NORMAL)
                                    .setWeight(3.0f)
                                    .setGravity(Gravity.CENTER_HORIZONTAL));


                    if (tbarimt.getString("plateNumber") != null && !tbarimt.getString("plateNumber").isEmpty()) {

                        page.addLine().adjustTopSpace(10);

                        page.addLine()
                                .addUnit(page.createUnit()
                                        .setText("Улсын дугаар: " + tbarimt.getString("plateNumber"))
                                        .setFontSize(20)
                                        .setWeight(1.0f)
                                        .setGravity(Gravity.FILL));

                        page.addLine().adjustTopSpace(5);
                    }


                    if (tbarimt.getString("amount") != null && !tbarimt.getString("amount").isEmpty()) {

                        page.addLine().adjustTopSpace(10);

                        page.addLine()
                                .addUnit(page.createUnit()
                                        .setText("Мөнгөн дүн: " + tbarimt.getString("amount"))
                                        .setFontSize(20)
                                        .setWeight(1.0f)
                                        .setGravity(Gravity.FILL));

                        page.addLine().adjustTopSpace(5);
                    }


                    if (tbarimt.getString("qrData") != null && !tbarimt.getString("qrData").isEmpty()) {
                        page.addLine().addUnit(page.createUnit()
                                .setBitmap(createQRImage(tbarimt.getString("qrData"), 360))
                                .setGravity(Gravity.CENTER));
                    }

                }

            } else {

                final String NEW_DATE_FORMAT = "yyyy-MM-dd";
                final String NEW_TIME_FORMAT = "hh:mm:ss";
                String newDate = "", newTime = "";

                try {
                    SimpleDateFormat sdf = new SimpleDateFormat();
                    Date d = new Date();
                    sdf.applyPattern(NEW_DATE_FORMAT);
                    newDate = sdf.format(d);
                    sdf.applyPattern(NEW_TIME_FORMAT);
                    newTime = sdf.format(d);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("ОГНОО : " + newDate)
                                    .setFontSize(FONT_SMALL)
                                    .setWeight(3.0f)
                                    .setGravity(Gravity.LEFT))

                            .addUnit(page.createUnit()
                                    .setText("ЦАГ : " + newTime)
                                    .setFontSize(FONT_SMALL)
                                    .setWeight(3.0f)
                                    .setGravity(Gravity.RIGHT));

                    page.addLine().adjustTopSpace(5);

                } catch (Exception e){
                    e.printStackTrace();
                }

                if (print.getString("merchantId") != null && !print.getString("merchantId").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Merchant ID: " + print.getString("merchantId"))
                                    .setFontSize(16)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }

                if (print.getString("merchantName") != null && !print.getString("merchantName").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Merchant Name: " + print.getString("merchantName"))
                                    .setFontSize(16)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.FILL));

                    page.addLine().adjustTopSpace(5);
                }


                page.addLine().adjustTopSpace(10);
                page.addLine()
                        .addUnit(page.createUnit()
                                .setText("Хөнгөлөлтийн хуудас")
                                .setFontSize(FONT_NORMAL)
                                .setWeight(8.0f)
                                .setGravity(Gravity.CENTER_HORIZONTAL));
                page.addLine().adjustTopSpace(10);


                if (print.getString("qrValue") != null && !print.getString("qrValue").isEmpty()) {
                    page.addLine().addUnit(page.createUnit()
                            .setBitmap(createQRImage(print.getString("qrValue"), 360))
                            .setGravity(Gravity.CENTER));
                }

                if (print.getString("discount") != null && !print.getString("discount").isEmpty()) {

                    page.addLine().adjustTopSpace(10);

                    page.addLine()
                            .addUnit(page.createUnit()
                                    .setText("Хөнгөлөлтийн дүн: " + print.getString("discount"))
                                    .setFontSize(FONT_NORMAL)
                                    .setWeight(1.0f)
                                    .setGravity(Gravity.CENTER_HORIZONTAL));

                    page.addLine().adjustTopSpace(5);
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        page.addLine().adjustTopSpace(80);

        IImgProcessing imgProcessing = MainApplication.getGl().getImgProcessing();
        return imgProcessing.pageToBitmap(page, 384);

    }

    public static Bitmap createQRImage(String content, int size) {

        Bitmap logoBitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        if (logoBitmap == null) {
            return null;
        }

        int logoSize = logoBitmap.getWidth();
        int logoHaleSize = logoSize >= size ? size/10 : size/5;
        Matrix m = new Matrix();
        float s = (float) logoHaleSize / logoSize;
        m.setScale(s, s);

//        Bitmap newLogoBitmap = Bitmap.createBitmap(logoBitmap, 0, 0, logoSize,
//                logoSize, m, false);
//        int newLogoWidth = newLogoBitmap.getWidth();
//        int newLogoHeight = newLogoBitmap.getHeight();
        Hashtable<EncodeHintType, Object> hints = new Hashtable<EncodeHintType, Object>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        BitMatrix matrix = null;
        try {
            matrix = new MultiFormatWriter().encode(content, BarcodeFormat.QR_CODE, size, size, hints);
        } catch (WriterException e) {
            Log.e("log", "", e);
            return null;
        }

        int width = matrix.getWidth();
        int height = matrix.getHeight();
        int halfW = width / 2;
        int halfH = height / 2;

        int[] pixels = new int[width * height];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
//                if (x > halfW - newLogoWidth / 2&& x < halfW + newLogoWidth / 2
//                        && y > halfH - newLogoHeight / 2 && y < halfH + newLogoHeight / 2) {
//                    pixels[y * width + x] = newLogoBitmap.getPixel(
//                            x - halfW + newLogoWidth / 2, y - halfH + newLogoHeight / 2);
//                } else {
                pixels[y * width + x] = matrix.get(x, y) ? BLACK : WHITE;
                //}
            }
        }

        Bitmap bitmap = Bitmap.createBitmap(width, height,
                Bitmap.Config.ARGB_8888);

        bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
        return bitmap;
    }

    public static IPage generatePage() {
        IPage page = gl.getImgProcessing().createPage();
        page.adjustLineSpace(-9);
        //page.setTypeFace(Typeface.createFromAsset(FinancialApplication.getApp().getAssets(), Constants.FONT_NAME));
        return page;
    }
}
