# petrusSlide

标签（空格分隔）： 插件

### 说明
页面满屏滚动插件，支持手机端。
IE9以下浏览器使用jQuery动画，其他浏览器使用CSS3动画。

### 引入
```html
<link href="src/petrus-slide.css" rel="stylesheet">
<script type="text/javascript" src="src/lib/jquery.mousewheel.js"></script>
<script type="text/javascript" src="src/petrus-slide.js"></script>
```
如果是IE9以下浏览器勿引入petrus-slide.js文件,应引入petrus-slide-ie.js
```html
<script type="text/javascript" src="src/petrus-slide-ie.js"></script>
```

### 使用
```javascript
var $slide = petrus_slide({
    orientation: 'y',		// 滑动方向
	$el: null,				// 容器
	perspective: NaN, 		// 视距
	speed: 800,				// 滑屏速度(毫秒)，目前只针对ie
	delayTime: 500,			// 延迟时间，鼠标滚轮滚动后多少毫秒内不能再次滚动
	touchStatu: false,		// 触摸状态设置标识
	isAlignCenter: false,	// 是否需要居中显示
	// 回调方法,部分方法会提供idx参数与preIdx参数
	callbacks:{
		init: null,			// 初始化完成
		begain: null,		// 滑动开始
		end: null,			// 滑动结束
		outBegain: null,	// 开始消失
		outEnd: null		// 已经消失 
	}
});
```

### 提供
```javascript
// 获取滚屏数
getPagesNum();
// 显示下一屏，isNext设置为false，则反向显示
showNext(isNext);
// 显示指定屏
showPage(idx);
// 获取当前播放屏
getIdx();
设置触摸标识
setValid(statu);
// 设置是否允许播放
getAllow(statu);
```

### github
[完整代码下载: https://github.com/pyrinelaw/petrus-slide](https://github.com/pyrinelaw/petrus-slide)

[示例: https://pyrinelaw.github.io/petrus-slide](https://pyrinelaw.github.io/petrus-slide)

------
感谢阅读此份文稿
如需使用，请注明出处
作者：Petrus.Law
