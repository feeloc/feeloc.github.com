---
layout: post
title: "元素任意路径运动"
date: 2013-05-21 18:58
comments: true
categories: javascript path 运动
---
{% img http://www.feeloc.cn/downloads/images/2013-05-21/path.jpg 800 %}
>元素运动很常见，这次总结一些运动轨迹，其实就是复习下各种数学公式，先从圆形运动开始全文。
<!-- more -->
##一、圆形运动##
*   圆形运动比较简单，就是圆心，弧度，正弦，余弦，复习下概念
    *   弧度，`弧度是角的度量单位`，弧长等于半径的弧，其所对的圆心角为1弧度。(即两条射线从圆心向圆周射出，形成一个夹角和夹角正对的一段弧。当这段弧长正好等于圆的半径时，两条射线的夹角的弧度为1)。
    *   根据定义，一周的弧度数为2πr/r=2π，360°角=2π弧度，因此，1弧度约为57.3°，即57°17’44.806”，`1°为π/180弧度`，近似值为0.01745弧度，周角为2π弧度，平角（即180°角）为π弧度，直角为π/2弧度。
    *   `弧长=n2πr/360` （在这里n就是角度数，即圆心角n所对应的弧长。）
    *   正弦值：弦值是在直角三角形中,对边的长比上斜边的长的值。
    *   `Math.sin(x)` : X 必需。一个以弧度表示的角。将角度乘以 0.017453293 （2PI/360）即可转换为弧度。
    *   余弦值:是指直角三角形锐角邻边与斜边的比值。
    *   `Math.sin(x)` : X 必需。一个以弧度表示的角。将角度乘以 0.017453293 （2PI/360）即可转换为弧度。
*   静态圆形元素
{% codeblock main.js %}
//中心点横坐标
var dotLeft = ($('.select-content').width() - $('.select-dot').width()) / 2;
//中心点纵坐标
var dotTop = ($('.select-content').height() - $('.select-dot').height()) / 2;
//半径
var radius = 105;
//每一个BOX对应的角度;
var avd = 360 / $('.select-box').length;
//每一个BOX对应的弧度;
var ahd = avd * Math.PI / 180;
//设置圆的中心点的位置
$(".select-dot").css({'left': dotLeft, 'top': dotTop});
$(".select-box").each(function (index, element) {
    $(this).css({"left": Math.sin((36 * Math.PI / 180 + ahd * index)) * radius + dotLeft, "top": Math.cos((36 * Math.PI / 180 + ahd * index)) * radius + dotTop});
    $(this).attr('index', index);
});
{% endcodeblock %}
*   增加运动
{% codeblock main.js %}
$('.select-box').click(function () {
    var $root = $(this);
    var iCurrent = parseInt($root.attr('index'));
    var iBig = $('.select-box').index($root);
    var time = 600;
    $('.select-box').each(function (index, element) {
        var path;
        var oldIndex = parseInt($(this).attr('index'));
        if (iCurrent == 2) {
            time = 100;
        } else {
            time = 600;
        }
        $(this).attr('index', oldIndex + (2 - iCurrent));
        path = new $.path.arc({
            center: [dotLeft, dotTop],
            radius: radius,
            start: 36 + oldIndex * avd,
            end: 36 + (oldIndex + (2 - iCurrent)) * avd,
            dir: 1
        });
        $(this).stop().animate({path: path}, 500);
    });
});
{% endcodeblock %}
<iframe src="http://www.feeloc.cn/demo/move/move.html" width="800px" height="370px"></iframe>