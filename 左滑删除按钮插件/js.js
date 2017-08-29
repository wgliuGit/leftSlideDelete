(function ($) {
    // 插件定义
    $.fn.slideEle = function (_aoConfig) {
        // 默认参数
        var defaults = {
            parentBox: "",//被编辑标签的直接父元素标签
            slideBars: "",//需要滑动删除、编辑的标签组
            alterTag: "",//需要修改内容的标签，必须单独用一个标签包裹
            tagWidth: 80,//右侧按钮宽度
        };
        var pm = this
        pm.oConfig = $.extend(defaults, _aoConfig);
        var slideDel = function () {
            var current = {
                sx: null,//触摸X坐标
                sy: null,//触摸Y坐标
                mx: null,//移动X坐标
                my: null,//移动Y坐标
                ex: null,//离开X坐标
                ey: null,//离开Y坐标
                swipeX: null,//判断左右滑动
                swipeY: null,//判断上下滑动
                expansion: null,//上一个被操作元素
            }
            var closeTimer;
            defaults.parentBox.css({ "position": "relative", "overflow": "hidden" });
            defaults.slideBars.css({ "position": "relative", "left": "0" });
            var divSpring = $('<div class="divSpring" style="position: fixed;display:none; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, .8); z-index: 99999;"><div class="divSpringBox" style="position: absolute;width: 90%;height: 260px;background: #fff;left: 5%;top: 50%;margin-top: -130px;"><div class="divSpringTitle" style="width: 100%;height: 30px;background: #666;"></div><input type="text" class="iptAlter" placeholder="请输入内容" style="width: 96%;margin: 0 2%;height: 40px;margin-top: 20px;border: 0;border-bottom: 1px solid #333;outline:none;font-size: 14px;"><div class="divSpringBtnBox" style="position: absolute;bottom: 0;height: 52px;line-height: 52px;width: 100%;text-align: center;font-size: 18px;"><a href="javascript:;" class="divSpringAbtn divSpringNo" style="display: inline-block;width: 50%;background: #d81313;height: 100%;text-decoration: none;color: #fff;">取 消</a><a href="javascript:;" class="divSpringAbtn divSpringYes" style="display: inline-block;width: 50%;background: #1f80d6;height: 100%;text-decoration: none;color: #fff;">确 定</a></div></div></div>').appendTo("body");
            defaults.slideBars.each(function (i) {
                var $this = $(this);
                $("<a class='spnbtn spnEdit' style='position: absolute;background: #ffbe00;width:" + defaults.tagWidth + "px;height: 100%;right: -" + defaults.tagWidth + "px; z-index: 99999;'>编辑</a><a class='spnbtn spnDel' style='position: absolute;background: #f60000;width: " + defaults.tagWidth + "px;height: 100%;right: -" + defaults.tagWidth * 2 + "px; z-index: 99999;'>删除</a>").appendTo($this);
                $this.find(".spnDel").on("click",function (e) {
                    //删除
                    $(this).parent().remove();
                    console.log($this)
                    return false;
                });
                $this.find(".spnEdit").on("click",function (e) {
                    //编辑
                    var iptAlter = $(".divSpring .iptAlter")
                    divSpring.show();
                    $(".divSpring .divSpringYes").on("click", function (e) {
                        //弹出框点击确定
                        $($this.find(defaults.alterTag)).html(iptAlter.val().trim());
                        divSpring.hide();
                        rightSlide($this)
                        iptAlter.val("");
                        return false;
                    });
                    $(".divSpring .divSpringNo").on("click", function (e) {
                        //弹出框点击取消
                        divSpring.hide();
                        iptAlter.val("");
                        return false;
                    });
                });
                $this.on("touchstart", function (e) {
                    current.sx = e.originalEvent.targetTouches[0].pageX;
                    current.sy = e.originalEvent.targetTouches[0].pageY;
                    current.swipeX = true;
                    current.swipeY = true;
                    if (current.expansion) { //判断是否展开，如果展开则收起
                        if (current.expansion.index() == $this.index()) {
                            if ($this.offset().left <= -120) {
                                leftSlide($this)
                            }
                        } else {
                            rightSlide(current.expansion)
                        }
                    }
                });
                $this.on('touchmove', function (e) {
                    current.mx = e.originalEvent.targetTouches[0].pageX;
                    current.my = e.originalEvent.targetTouches[0].pageY;
                    // 左右滑动
                    if (current.swipeX && Math.abs(current.mx - current.sx) - Math.abs(current.my - current.sy) > 0) {
                        var x = current.mx - current.sx;
                        var xl = $this.offset().left
                        if (x < -(defaults.tagWidth*2)) {
                            x = -(defaults.tagWidth*2)
                        }
                        if (x > 0) {
                            x = 0
                        }
                        if (xl <= -(defaults.tagWidth*2)) {
                            if ((current.mx - current.sx) < 0) {
                                x = -(defaults.tagWidth*2)
                            }
                        }
                        $this.css({ "position": "relative", "left": x + "px" });
                    }
                });
                $this.on('touchend', function (e) {
                    current.ex = e.originalEvent.changedTouches[0].pageX;
                    current.ey = e.originalEvent.changedTouches[0].pageY;
                    // 左右滑动
                    if (current.swipeX && Math.abs(current.mx - current.sx) - Math.abs(current.my - current.sy) > 0) {
                        e.stopPropagation();
                        if ((current.ex - current.sx) < 0) {
                            //往左滑
                            if ((current.ex - current.sx) > -defaults.tagWidth) { //右滑
                                if (!!current.expansion) {
                                    if (current.expansion.index() == $this.index()) {
                                        if ((current.ex - current.sx) > -10) {
                                            return false;
                                        }
                                    }
                                }
                                rightSlide($this);
                            }
                            if ((current.ex - current.sx) < -defaults.tagWidth) { //左滑
                                leftSlide($this);
                                current.expansion = $this;
                            }
                        } else if ((current.ex - current.sx) > 0) {
                            //往右滑
                            rightSlide($this);
                        }
                        current.swipeY = false;
                    }
                    // 上下滑动
                    if (current.swipeY && Math.abs(current.mx - current.sx) - Math.abs(current.my - current.sy) < 0) {
                        rightSlide($this);
                        current.swipeX = false;
                    }
                });
                function leftSlide(dom) {
                    dom.css({ "-webkit-transition": " all 0.3s ease-out", "transition": "all 0.3s ease-out", "position": "relative", "left": "-" + defaults.tagWidth * 2 + "px" });
                }
                function rightSlide(dom) {
                    dom.css({ "-webkit-transition": " all 0.3s ease-out", "transition": "all 0.3s ease-out", "position": "relative", "left": "0" });
                }
            });
        }()
        return this;
    };
    // 插件结束
})(jQuery);