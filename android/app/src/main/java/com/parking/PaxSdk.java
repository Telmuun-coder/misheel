package com.parking;

import android.content.Context;
import android.util.Log;

import com.pax.dal.IDAL;
import com.pax.neptunelite.api.NeptuneLiteUser;

public class PaxSdk {
    private static final String TAG = "PaxSdk";
    private IDAL dal;

    PaxSdk(Context context) {
        try {
            dal = NeptuneLiteUser.getInstance().getDal(context);
        } catch (Exception e) {
            Log.w(TAG, e);
        }
    }

    public IDAL getDal() {
        return dal;
    }

}
