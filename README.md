"leftSlideDelete" 

## 调用方法
```
var slideEle = $("#header").slideEle({
            parentBox: $("ul"),//被编辑标签的直接父元素标签
            slideBars: $("li"),//需要滑动删除、编辑的标签组
            alterTag: $(".t"),//需要修改内容的标签，必须单独用一个标签包裹
            tagWidth: 100,//右侧按钮宽度,默认80
        });
```
