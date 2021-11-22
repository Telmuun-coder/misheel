/*
 * ============================================================================
 * COPYRIGHT
 *              Pax CORPORATION PROPRIETARY INFORMATION
 *   This software is supplied under the terms of a license agreement or
 *   nondisclosure agreement with Pax Corporation and may not be copied
 *   or disclosed except in accordance with the terms in that agreement.
 *      Copyright (C) 2017 - ? Pax Corporation. All rights reserved.
 * Module Date: 2017-5-23
 * Module Author: Kim.L
 * Description:
 *
 * ============================================================================
 */
package com.mid.glwrapper.impl;

import android.content.Context;

import com.mid.glwrapper.convert.IConvert;
import com.mid.glwrapper.imgprocessing.IImgProcessing;
import com.mid.glwrapper.packer.IPacker;
import com.mid.glwrapper.IGL;
import com.mid.glwrapper.comm.ICommHelper;

public class GL implements IGL {

    private CommHelperImp comm;
    private PackerImp packer;
    private ConverterImp converter;
    private ImgProcessingImp imgProcessing;

    private static GL instance = null;

    private GL(Context context) {
        comm = new CommHelperImp(context);
        packer = new PackerImp(context);
        converter = new ConverterImp();
        imgProcessing = new ImgProcessingImp(context);
    }

    public static GL getInstance(Context context) {
        if (instance == null) {
            instance = new GL(context);
        }
        return instance;
    }

    @Override
    public ICommHelper getCommHelper() {
        return comm;
    }

    @Override
    public IConvert getConvert() {
        return converter;
    }

    @Override
    public IPacker getPacker() {
        return packer;
    }

    @Override
    public IImgProcessing getImgProcessing() {
        return imgProcessing;
    }
}
