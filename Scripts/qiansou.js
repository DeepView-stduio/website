function pic1Click() {
    $("#file1").click();
}

function pic2Click() {
    $("#file2").click();
}

function face2face() {
    $("#face2faceValue").val("照片相似度比对中,请稍候......");
    var image1 = $("#pic1").attr("src").split(",");
    var image2 = $("#pic2").attr("src").split(",");
    var faceimage1 = image1[1];
    var faceimage2 = image2[1];
    $.ajax({
        type: 'post',
        dataType: "text",
        url: "http://106.14.15.104:9999/Compare2Image.aspx",
        data: { "faceimage1": faceimage1, "faceimage2": faceimage2 },
        success: function (message) {
            var sim = Math.round(message * 10000) / 100.00 + "%";
            $("#face2faceValue").val("相似度：" + sim + "   //越接近100%两张人脸越相似");
        }, error: function () {
            $("#face2faceValue").val("请求参数错误!");
        }
    });
}

function change(picId, filecl) {

    upfilechange(picId, filecl, "");
}

function facepint_fileClick(parameters) {
    $("#facepint_file").click();
}

function facepintchange(picId, fileId) {
    $("#txt_facepoint").val("> 特征点计算中，请稍候......");
    upfilechange(picId, fileId, "facepoint");
}

function getfacepoint(base64) {
    if (base64 != null) {
        var faceimage = base64.split(",")[1];
        if (faceimage.length > 10) {

            $.ajax({
                type: 'post',
                dataType: "json",
                url: "../api/faceangle",
                data: { "faceimage": faceimage },
                success: function (message) {
                    if (message.result) {
                        $("#txt_facepoint").val(" > 特征点计算成功......\t\n"
                            + "\t\n人脸质量：" + changeTwoDecimal(message.score)
                            + "\t\n    俯仰角：" + changeTwoDecimal(message.faceposemodel.pitch)
                            + "\t\n    滚转角：" + changeTwoDecimal(message.faceposemodel.roll)
                            + "\t\n    偏航角：" + changeTwoDecimal(message.faceposemodel.yaw));
                    } else {
                        $("#txt_facepoint").val(" > 特征点计算失败......\t\n\t\n"
                            + "异常信息：" + message.errorinfo);
                    }

                }, error: function (error) {
                    $("#txt_facepoint").val(error + "请求参数错误!");
                }
            });
        }
    }
}

function getpoints(parameters) {
    if (parameters != null) {
        var point = "";
        for (var i = 0; i < parameters.length; i++) {
            point += "{\"x\":" + parameters[i].x + ",\"y\":" + parameters[i].y + "},";
        }
        point = "[" + point + "]";
        return point;
    } else {
        return "Nan";
    }

}

function faceage_fileClick(parameters) {
    $("#faceage_file").click();
}

function faceagechange(picId, fileId) {
    $("#txt_faceage").val("> 年龄性别预测计算中，请稍候......");
    upfilechange(picId, fileId, "faceage");
}

function getfaceage(base64) {
    if (base64 != null) {
        var faceimage = base64.split(",")[1];
        $.ajax({
            type: 'post',
            dataType: "json",
            url: "../api/facegenderage",
            data: { "faceimage": faceimage },
            success: function (message) {
                if (message.result) {
                    $("#txt_faceage").val(" > 年龄性别预测成功......\t\n\t\n"
                        + "检测到" + message.facecount + "张人脸\t\n"
                        + getages(message.facerects, message.faceattributes));
                } else {
                    $("#txt_faceage").val("年龄性别预测失败....."
                        + "\t\n\t\n异常信息：" + message.errorinfo);
                }


            }, error: function (error) {
                $("#txt_faceage").val("请求参数错误！");
            }
        });
    }
}

function getages(facerects, faceattributes) {
    if (facerects != null && faceattributes) {
        var faces = "";
        for (var i = 0; i < facerects.length; i++) {
            var sex = "未知";
            if (faceattributes[i].gender == -1) {
                sex = "男";
            }
            else if (faceattributes[i].gender == 1) {
                sex = "女";
            }
            faces += "人脸" + (i + 1) + "：" + sex + parseInt(faceattributes[i].age) + "岁 \t\n";
        }
        return faces;
    } else {
        return "Nan";
    }

}


function changeTwoDecimal(num) {
    var re = /([0-9]+.[0-9]{2})[0-9]*/;
    return num.toString().replace(re, "$1");
}


