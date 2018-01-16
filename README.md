"leftSlideDelete" 
# 左滑删除按钮插件
## 调用方法
```
        var slideEle = $("#header").slideEle({ //绑定插件所需要的作用域
            parentBox: $("ul"),//被编辑标签的直接父元素标签
            slideBars: $("li"),//需要滑动删除、编辑的标签组
            alterTag: $(".t"),//需要修改内容的标签，必须单独用一个标签包裹
            tagWidth: 80,//右侧按钮宽度,默认80
            editBtn: true,//是否需要编辑按钮 true/false
        });
```


### Demo地址
[demo](https://wgliuGit.github.io/leftSlideDelete/左滑删除按钮插件/demo.html)
