/**
 * 屏幕滚屏组件
 * @authors Petrus.Law (Petrus.law@outlook.com)
 * @github http://www.github.com/pyrinelaw
 * @date    2015-08-05 14:24:55
 * @version 0.0.1
 */

(function(){

	var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
	var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));

	/**
	 * 获取滑动方向获取首次触摸点位置
	 */
	var getFirstTouchEventPos = function(e, orientation) {

		var touches = e.touches,
			orientation = orientation || 'y',
			changedTouches = e.changedTouches,
			touchVo = null;

		if(changedTouches && changedTouches.length > 0) {
			touchVo = changedTouches[0];
		}
		else if(touches && touches.length > 0) {
			touchVo = touches[0];
		}

		if(touchVo){
			return touchVo['client'+orientation.toLocaleUpperCase()] || touchVo['page'+orientation.toLocaleUpperCase()];
		}

		return NaN;
	}

	// 默认设置
	var defaultOptions = {
		orientation: 'y',		// 滑动方向
		$el: null,				// 容器
		speed: 800,				// 滑屏速度(毫秒)，目前只针对ie
		delayTime: 500,			// 延迟时间，鼠标滚轮滚动后多少毫秒内不能再次滚动
		touchStatu: false,		// 触摸状态
		isAlignCenter: false,	// 是否需要居中显示
		// 回调
		callbacks:{
			init: null,			// 初始化完成
			begain: null,		// 滑动开始
			end: null,			// 滑动结束
			outBegain: null,	// 开始消失
			outEnd: null		// 已经消失 
		}
	}

	/**
	 * 滑动开始前重设数据
	 */
	var resetOptions = {
		valid: true,	// 是否生效
		allow: true,	// 是否允许滑动触摸
		isDelayTime: false,	// 鼠标滚轮滚动等待时间
		startPos: NaN,	// 滑动开始点
		movePos: NaN,	// 滑动移动触摸点
		endPos: NaN,		// 滑动结束触摸点
		triggerType: null	// 触发类型，滚轮触发，滑动触发
	}

	/**
	 * 动作选项
	 */
	var actionOptions = {
		prevIdx: NaN,	// 前一显示page下标
		nextIdx: NaN,	// 下一显示page下标
		idx: 0          // 当前显示page下标
	}

	var Attrs = {

		/**
		 * 初始化
		 */
		initialize: function() {
			var options = this.options,
				$el = options.$el,
				orientation = options.orientation;

			$el.addClass('petrus-slide-container');

			// 保存子元素，供后续使用
			options.$pages = [];

			var $pages = $el.children();

			options.$pages = $pages;

			this.initializePages();

			this.setSize();

			if(options.callbacks.init){
				options.callbacks.init();
			}

			return true;
		},

		initializePages: function(){
			var options = this.options,
				$el = options.$el,
				$pages = options.$pages,
				idx = options.idx;

			$pages.addClass('petrus-slide-page');
			// $pages.addClass('petrus-slide-top-transition');
			$pages.eq(idx).css({
				left: 0,
				top: 0
			}).addClass('active').siblings().addClass('petrus-slide-hide');

			for(var i=0; i<$pages.length; i++){
				var $page = $($pages[i]);
				var $content = $page.children();

				var $table = $('<div class="petrus-slide-table"></div>');
				$page.append($table);

				var $cell = $('<div></div>');
				$table.append($cell);

				$cell.append($content);

				// 需要居中显示
				if(options.isAlignCenter) $cell.addClass('petrus-slide-table-cell');
				
			}
		},

		getSize: function(){
			return {
				w: $(window).width(),
				h: $(window).height()
			}
		},

		/**
		 * 获取下一个动作下下标
		 */
		getNextIdx: function(isUp) {
			var options = this.options,
				$pages = options.$pages,
				len = $pages.length;
				idx = options.idx,
				scope = 1;	// 跨度

			var nextIdx = idx;

			if(isUp) scope = -1;

			nextIdx += scope;

			if(nextIdx == -1) {
				nextIdx = len-1;
			} else if(nextIdx >= len) {
				nextIdx = 0;
			}

			return nextIdx;
		},

		getPagesNum: function(){
			var _this = this;
				options = this.options,
				$pages = options.$pages;

			return $pages.length;
		},

		showNext: function(isUp){
			this.showPage(this.getNextIdx(isUp));
		},

		showPage: function(nextIdx){

			var _this = this;
				options = this.options,
				$pages = options.$pages,
				idx = options.idx,
				allow = options.allow,
				nextIdx = nextIdx == undefined ? this.getNextIdx() : nextIdx;

			if(!allow || idx == nextIdx){
				return false;
			}

			var $page = $pages.eq(idx),
				$nextPage = $pages.eq(nextIdx),
				size = this.getSize();
				// isUp = idx > nextIdx ? true : false;

			options.allow = false;


			// begain: null,		// 滑动开始
			// end: null,			// 滑动结束
			// outBegain: null,	// 开始消失
			// outEnd: null		// 已经消失 

			if(options.callbacks.begain){
				options.callbacks.begain.call(null, nextIdx, idx);
			}
			if(options.callbacks.outBegain){
				options.callbacks.outBegain.call(null, idx, nextIdx);
			}

			var isUp = nextIdx > idx ? true : false;

			var top = isUp ? size.h : -size.h;

			var prevTop = isUp ? -size.h : size.h;

			$page.animate({
				top: prevTop
			}, options.speed, function(){
				$page.addClass('petrus-slide-hide');
				if(options.callbacks.outEnd){
					options.callbacks.outEnd.call(null, idx, nextIdx);
				}
			});

			$nextPage.removeClass('petrus-slide-hide').css({
				top: top
			});
			
			$nextPage.animate({
				top: 0
			}, options.speed, function(){
				options.idx = nextIdx;
				if(options.callbacks.end){
					options.callbacks.end.call(null, nextIdx, idx);
				}
				$nextPage.addClass('active').siblings().removeClass('active');
				if(!isTouchDevice) {
					// 一屏翻完后50毫秒后才允许进行翻屏处理
					// 部分浏览器对于鼠标滚轮处理太灵敏
					setTimeout(function(){
						options.allow = true;
					}, 50);
				} else {
					options.allow = true;
				}
				
			});

			// $nextPage.animate({
			// 	top: 0
			// }, { duration: options.speed, easing: 'easeOutQuad', complete: function(){
			// 	if(options.callbacks.end){
			// 		options.callbacks.end.call(null, nextIdx, idx);
			// 	}
			// 	options.allow = true;
			// 	options.idx = nextIdx;
			// }});
		},

		getIdx: function(){
			return this.options.idx;
		},

		setValid: function(statu){
			// console.warn('setValid: '+statu);
			this.options.valid = statu;
		},

		setSize: function(){
			var options = this.options,
				$el = options.$el,
				$pages = options.$pages,
				size = this.getSize();

			$el.width(size.w);
			$el.height(size.h);
			$pages.width(size.w);
			$pages.height(size.h);
		},

		slideStart: function(e){
			var options = this.options;

			if(options.touchStatu) return; 	// 当前触摸生效

			var pos = NaN,
				$pages = options.$pages;

			if(e == null) return;	

			pos = getFirstTouchEventPos(e);

			options.startPos = pos;

			options.touchStatu = true;

		},

		slideMove: function(e){
			var options = this.options;

			if(!options.touchStatu){
				return;
			} 

			pos = getFirstTouchEventPos(e);

			if(!pos){
				return;
			} 

			options.movePos = pos;
		},

		slideEnd: function(e){

			var isElec = true;	// 触摸是否生效
			var options = this.options;

			var touches = e.touches,
			orientation = orientation || 'y',
			changedTouches = e.changedTouches;

			// // 多指触摸最后指头移开才生效，Opera下有误
			// if( (changedTouches && changedTouches['1']) || (touches && touches.length > 0) ) {
			// 	isElec = false;
			// 	return;
			// }

			if(!options.touchStatu) return;

			var pos = getFirstTouchEventPos(e);

			if(!pos) {
				options.endPos = options.movePos || options.startPos;
			} else {
				options.endPos = pos;
			}

			var isUp = false;
			var dis = options.endPos - options.startPos;

			var isTrigger = true;	// 是否触发

			if(dis > 0) isUp = true;

			// 当位于第一屏与最后一屏的时候继续不能继续向上或者向下滚动
			if((options.idx == 0 && isUp) || (options.idx == options.$pages.length-1 && !isUp)) isTrigger = false;

			// 滑动距离若少于整个屏幕的10%,则不触发
			// 这样做主要是为了防止点击屏幕上的链接或者按钮触发
			if(Math.abs(dis) < this.getSize().h*0.1) isTrigger = false;

			if(isTrigger) this.showNext(isUp);

			// console.warn(options.startPos);
			// console.warn(options.movePos);
			// console.warn(options.endPos);

			options.touchStatu = false;
		},

		getAllow: function(){
			return this.options.allow;
		}
		
	}

	var slide = function(settings){

		settings = settings || {};

		var options = this.options = {};

		$.extend(true, options, resetOptions, actionOptions, defaultOptions, settings);

		this.options = options;

		var $el = this.$el = options.$el,
			idx = options.idx = 0;
		
		$.extend(true, this, Attrs);
		
		// 初始化
		var initResult = this.initialize();
		
		if(!initResult) return;		// 初始化失败

		var _this = this;

		$(window).resize(function() {
		  	_this.setSize();
		});

		if(!isTouchDevice) {
			$el.mousewheel(function(event, delta, deltaX, deltaY) {
				if(!options.valid) return;

			   	// 当前正在等待时间中
			   	if(options.isDelayTime) return;

			   	if(deltaY == 0) return;

			   	var isUp = deltaY > 0 ? true : false;

			   	// 当位于第一屏与最后一屏的时候继续不能继续向上或者向下滚动
			   	if((options.idx == 0 && isUp) || (options.idx == options.$pages.length-1 && !isUp)) return;

			   	_this.showNext.call(_this, isUp);
			   	
			   	options.isDelayTime = true;
			   	
			   	window.setTimeout(function(){
			   		options.isDelayTime = false;
			   	}, (options.speed + options.delayTime));

			   	return false;
			});
		} else {
			// // 在容器中注册触摸时间
			$el[0].addEventListener('touchstart', function(e) {
				if(!options.allow || !options.valid) return;

				// if(e.stopPropagation) e.stopPropagation();
				// if(e.preventDefault) e.preventDefault();
				
				_this.slideStart(e);
			}, false);

			// 触摸移动与触摸结束点可以位于网页任何位置
			$el[0].addEventListener('touchmove', function(e) {

				_this.slideMove(e);

				// 在chrome的浏览器中会下拉刷新，所以需要取消关联事件
				// if(e.stopPropagation) e.stopPropagation();
				if(e.preventDefault) e.preventDefault();
			}, false);

			$el[0].addEventListener('touchend', function(e) {
				_this.slideEnd(e);
 		
 				// if(e.stopPropagation) e.stopPropagation();
 				// if(e.preventDefault) e.preventDefault();
			}, false);

			$el[0].addEventListener('touchcancel', function(e) {
				_this.slideEnd(e);

				// if(e.stopPropagation) e.stopPropagation();
				if(e.preventDefault) e.preventDefault();
 				
			}, false);

			// touchcancel
		}
		
		return this;
	}

	var petrus_slide = function(settings){

		var $slide = new slide(settings);

		return {
			getPagesNum: function(){
				return $slide.getPagesNum();
			},	
			showNext: function(isUp){
				$slide.showNext(isUp);
			},
			showPage: function(nextIdx){
				$slide.showPage(nextIdx);
			},
			getIdx: function(){
				return $slide.getIdx();
			},
			setValid: function(statu){
				$slide.setValid(statu);
			},
			getAllow: function(){
				return $slide.getAllow();
			}
		}

	}

	$.fn.petrus_slide = function(settings){
		settings = settings || {};

		settings.$el = $(this);

		return petrus_slide(settings);
	}

})()
