var jframe = {
    /**
     * 传obj,name获取样式
     * 传obj.name,value设置样式
     * 不能获取background之类的复合样式
     * @param obj   操作样式的元素
     * @param name  操作的CSS
     * @param value 设置CSS的值
     * @return {*}
     */
    css: function (obj, name, value) {
        if (arguments.length == 2) {
            if (obj.currentStyle) {
                return obj.currentStyle[name];
            } else {
                return getComputedStyle(obj, false)[name];
            }
        } else {
            if (name == 'opacity') {
                if (obj.currentStyle) {
                    obj.style['filter'] = 'alpha(opacity:' + value * 100 + ')';
                }
            }
            obj.style[name] = value;
        }
    },
    /**
     * 事件绑定
     * IE是attachEvent
     * DOM是addEventListener
     * @param {Object} obj    需要绑定事件的对象
     * @param {Object} ev    需要绑定的事件
     * @param {Object} fn    绑定的事件函数
     */
    addEvent: function (obj, ev, fn) {
        if (obj.attachEvent) {
            obj.attachEvent('on' + ev, fn);
        } else {
            obj.addEventListener(ev, fn, false);
        }
    },
    /**
     * 解除事件绑定
     * IE是detachEvent
     * DOM是removeElementListener
     * @param {Object} obj    需要去除绑定事件的对象
     * @param {Object} ev    需要去除绑定的事件
     * @param {Object} fn    去除绑定的事件函数
     */
    removeEvent: function (obj, ev, fn) {
        if (obj.detachEvent) {
            obj.detachEvent('on' + ev, fn);
        } else {
            obj.removeEventListener(ev, fn, false);
        }
    },
    /**
     * ajax函数
     * @param {Object} url    提交的地址
     * @param {Object} data 提交的数据
     * @param {Object} successFn 成功的回调函数
     * @param {Object} errorFn    失败的回调函数
     */
    ajax: function (url, method, dataType, data, successFn, errorFn) {
        var oAjax;
        if (window.XMLHttpRequest) {
            oAjax = new XMLHttpRequest();
        } else {
            oAjax = new ActiveObject('Microsoft.XMLHTTP');
        }
        oAjax.open(method, url, true);
        oAjax.send();
        oAjax.onreadystatechange = function () {
            if (oAjax.readyState == 4) {
                if (oAjax.status == 200) {
                    if (typeof successFn == 'function') {
                        if (dataType == 'json') {
                            successFn(eval('(' + oAjax.responseText + ')'));
                        } else {
                            successFn(oAjax.responseText);
                        }
                    }
                } else {
                    if (typeof successFn == 'function') {
                        errorFn(oAjax.status);
                    }
                }
            }
        }
    },
    /**
     *  获取元素的第一个子元素
     * @param target
     * @return {*}
     */
    getFirstChild: function (oParent) {
        if (oParent.firstElementChild) {
            return oParent.firstElementChild;
        } else {
            return oParent.firstChild;
        }
    },
    /**
     * 根据class获取元素
     * @param oParent
     * @param sClassName
     * @return {Array}
     */
    getElementsByClass: function (oParent, sClassName) {
        var aElements = [];
        var oElements = oParent.getElementsByTagName('*');
        for (var i = 0; i < oElements.length; i++) {
            if (oElements[i].className.match(new RegExp("(^| )" + sClassName + "( |$)"))) {
                aElements.push(oElements[i]);
            }
        }
        return aElements;
    }
};
