# petrus-page-slide
页面换屏切换

### 说明
页面满屏滚动插件，支持手机端。
IE9以下浏览器使用jQuery动画，其他浏览器使用CSS3动画。

### 调用
```html
<link href="src/p-page-slide.css" rel="stylesheet">
<script type="text/javascript" src="src/lib/jquery.mousewheel.js"></script>
<script type="text/javascript" src="src/p-page-slide.js"></script>
```

### 使用方法
```javascript
var touch = pFastCorres({
    animStyle: 'default',   // 播放动画样式，默认为default, default、track、cover，IE9以下浏览器只支持default
    autoplay: false,    // 是否自动播放
    selector: '元素选择器',    // 与jQuery元素选择器使用方法一致
    hoverClass: 'hover样式',  // 可不填  
    bubble: false,  // 是否吞噬触摸事件，默认为false
    // 回调， 如果没有可以不填写
    callbacks: {
        init: null,     // 初始化
		begain: null,   // 播放开始
		end: null,      // 播放结束
		outBegain: null,    // 上一屏播放开始
		outEnd: null    // 上一屏播放结束
    }
});
```

### 回调
```javascript
// 获取滚屏数
getPagesNum();
// 显示下一屏
showNext();
// 显示指定屏
showPage(idx);
// 获取当前播放屏
getIdx();
// 设置是否允许播放
setValid(b);
getAllow();
```

### github
[完整代码下载: https://github.com/pyrinelaw/petrus-slide]

[示例: https://github.com/pyrinelaw/petrus-slide]


------
感谢阅读此份文稿
如需引用，请注明出处
更多插件请访问： https://github.com/pyrinelaw
作者：Petrus.Law
