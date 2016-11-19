/*!
 * uploadar v0.1
 * https://github.com/ablozhou/uploadar
 *
 * Copyright (c) 2016-2018 Andy Zhou
 * Released under the MIT license
 *
 * Date: 2016-11-19
 *  
 */

function getCroppedCanvasUrl(item, croppedSize) {
    var croppedCanvas = item.cropper("getCroppedCanvas", croppedSize);
    var croppedCanvasUrl = croppedCanvas.toDataURL(window.originFileType); // Base64
    // var croppedBlob = dataURLtoBlob(croppedCanvasUrl);
    // croppedBlob.name = originFileName; // add Blob name

    return croppedCanvasUrl;

};

function uploadFile() {
    upurl = '/uploadar_server_php/index.php';

    // Canvas 长宽比应与之前规定的裁剪比例一致
    // 否则生成的图片会有失真
    var size_lg = {
        width: 200,
        height: 200
    }
    var size_md = {
        width: 120,
        height: 120
    }
    var size_sm = {
        width: 48,
        height: 48
    }

    var formData = new FormData();

    var croppedCanvasUrlLg = getCroppedCanvasUrl(jQuery('#preview'), size_lg);
    formData.append('picbig', croppedCanvasUrlLg);
    var croppedCanvasUrlMd = getCroppedCanvasUrl(jQuery('#preview'), size_md);
    formData.append('picmid', croppedCanvasUrlMd);
    var croppedCanvasUrlSm = getCroppedCanvasUrl(jQuery('#preview'), size_sm);
    formData.append('picsmall', croppedCanvasUrlSm);

    $.ajax({
        url: upurl,
        type: 'POST',
        data: formData,
        dataType: 'json',
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function() {
            console.log('before send');
        },
        complete: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('complete send');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(textStatus);
        },
        success: function(data, textStatus) {
            console.log(data);
            console.log(textStatus);

        }

    }).done(function(ret) {
        if (ret.error && ret.error < 0) {

            alert("Upload image error! code:" + ret.error);

        } else {
            alert("Upload image success.");
        }
        console.log(ret);

    });

    return false;
};
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function($) {

    'use strict';

    var console = window.console || {
        log: function() {}
    };
    var URL = window.URL || window.webkitURL;

    var prvimage = $('#preview');

    var options = {
        aspectRatio: 1 / 1,
        preview: '.img-preview',
        crop: function(e) {
            console.log("crop x,y,height,width,rotate,scaleX,scaleY:" + Math.round(e.x) + "," + Math.round(e.y) + "," + Math.round(e.height) + "," + Math.round(e.width) + "\n" + e.rotate + "," + e.scaleX + "," + e.scaleY);
        }
    };
    var originalImageURL = prvimage.attr('src');
    var uploadedImageURL;

    // Cropper
    prvimage.on({
        'build.cropper': function(e) {
            console.log(e.type);
        },
        'built.cropper': function(e) {
            console.log(e.type);
        },
        'cropstart.cropper': function(e) {
            console.log(e.type, e.action);
        },
        'cropmove.cropper': function(e) {
            console.log(e.type, e.action);
        },
        'cropend.cropper': function(e) {
            console.log(e.type, e.action);
        },
        'crop.cropper': function(e) {
            console.log(e.type, e.x, e.y, e.width, e.height, e.rotate,
                e.scaleX, e.scaleY);
        },
        'zoom.cropper': function(e) {
            console.log(e.type, e.ratio);
        }
    }).cropper(options);
    // Import image
    var inputimage = $('#filedata');

    if (URL) {
        inputimage.change(function() {
            var files = this.files;
            var file;

            if (!prvimage.data('cropper')) {
                return;
            }

            if (files && files.length) {
                file = files[0];
                window.originFileType = file.type; // 暂存图片类型
                window.originFileName = file.name; // 暂存图片名称

                if (/^image\/\w+$/.test(file.type)) {
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }

                    uploadedImageURL = URL.createObjectURL(file);
                    prvimage.cropper('destroy').attr('src', uploadedImageURL)
                        .cropper(options);

                } else {
                    window.alert('请选择图片文件.');
                }
            }
        });
    } else {
        inputimage.prop('disabled', true).parent().addClass('disabled');
    }

});
