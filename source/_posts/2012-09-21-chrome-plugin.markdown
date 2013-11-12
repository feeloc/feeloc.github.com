---
layout: post
title: "chrome插件"
date: 2012-09-21 00:50
comments: true
categories: javascript chrome
---
{% img http://feeloc.cn/downloads/images/2012-09-21/1.png%}
>前阵子遇到一些繁琐的操作，需要在页面上重复填写表单，需要将数据从一个地方粘贴到表单里，数据量非常之大，此等重复劳动的工作哪是一个程序员该做的事情，
>想到了用chrome插件去帮我实现这些操作，chrome插件其实就是压缩在一起的一组文件，包括HTML，CSS，Javascript脚本，图片文件，还有其它任何需要的文件。
>应用（扩展）本质上来说就是web页面，它们可以使用所有的浏览器提供的API，从XMLHttpRequest到JSON到HTML5全都有。
<!-- more -->
chrome extension有三种形式，下面着重第二种（即弹出气泡形式）去讲解一下插件的开发过程，抛砖引玉吧。
##一、图标形插件##
*	这个gmail提醒应用使用了browser action，它在工具栏上增加一个图标
{% img http://img.qihoo.com/images/2008/360chrome/img/open/gmail.png 700 '图标形插件' %}
##二、气泡形插件##
*	这个新闻阅读应用也使用了browser action，当点击时会弹出一个气泡窗口
{% img http://feeloc.cn/downloads/images/2012-10-09/1.png 700 '气泡形插件' %}
##三、脚本形插件##
*	这个地图应用使用了page action和content script（注入到页面内执行的脚本）
{% img http://img.qihoo.com/images/2008/360chrome/img/open/rss.png 700 '气泡形插件' %}
##三、插件开发过程##
*	标准插件结构
{% img http://feeloc.cn/downloads/images/2012-10-09/2.png 700 '插件目录结构' %}
	*	首先是manifest.json
{% codeblock 配置文件-manifest.json %}
{  
  "name": "****",
  "version": "0.1",
  "manifest_version": 2,	//这是chrome新版插件必须要加上的
  "description": "****",
  "permissions": ["tabs", "http://*/*", "https://*/*"],	//对该 类型的全部注入脚本 
  "browser_action": {
    "default_icon": "images/icon.png" ,	//小图标
    "default_title": "***",
    "default_popup": "popup.html"	//弹出的气泡页面
  }
} 
{% endcodeblock %}
	*	在该插件中弹出的页面是一个非常简单的，包含一个文本框，一个checkbox，和一个按钮，`注意：不需要包含完整的html结构`
{% codeblock 弹出窗口-popup.html %}
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<style>
.content{width: 300px;padding: 10px;}
#excel{width: 300px;}
</style>
<script src="javascript/background.js"></script>
<div class="content">
	<textarea id="excel" rows="30"></textarea>
	<div class="submit">
		<input type="button" id="laogong" value="爽一下" />
		<input type="checkbox" id="paixu" />给我排
	</div>
</div>
{% endcodeblock %}
	*	从弹出窗口的页面可以看出引入了一个js文件，这个js文件是整个插件的入口，定义了需要注入到页面的脚本 代码，还有页面上的交互事件，就是些chrome提供的接口和原生js操作
{% codeblock background.js %}
function click() {
	chrome.tabs.getSelected(null, function(tab) {
		var port = chrome.tabs.connect(tab.id, {
			name : "excel"
		});
		port.postMessage({
			excel : document.getElementById('excel').value,
			paixu : document.getElementById('paixu').checked
		});
	});
	// window.close();
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('laogong').addEventListener('click', click);
	chrome.tabs.executeScript(null, {
		file : "javascript/function.js"
	});
});
{% endcodeblock %}
	*	从backgrond.js中可以看出向页面中注入了function.js文件，该文件中包含详细的用户交互过程，主要是插件和网站页面间的交互。
{% codeblock background.js %}
chrome.extension.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(msg) {
		var lines = msg.excel.replace(/(^\s*)|(\s*$)/g,"").split('\n');
		……省略若干代码……
});
{% endcodeblock %}
	*	该 插件主要涉及的就是插件向页面发送数据，但用户点击了按钮，插件就会用刚才创建的通道，传送两个灵气给页面上注入的js文件，该 js文件实现了一个监听器，该 监听器收到 消息后就可以像在页面上写js代码一样方便操作了
*	了解了这些，加上配合chrome extension，再加上大家丰富的想像力就可以 写出各种有用的方便我们工作生活的插件了，比如火车票定标插件，比如360的夺宝岛插件……