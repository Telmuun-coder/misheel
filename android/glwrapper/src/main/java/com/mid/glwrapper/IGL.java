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
package com.mid.glwrapper;

import com.mid.glwrapper.convert.IConvert;
import com.mid.glwrapper.imgprocessing.IImgProcessing;
import com.mid.glwrapper.packer.IPacker;
import com.mid.glwrapper.comm.ICommHelper;

public interface IGL {
    ICommHelper getCommHelper();

    IConvert getConvert();

    IPacker getPacker();

    IImgProcessing getImgProcessing();
}