var rating = (function(){
	//继承
	var extend = function(subClass, supClass){
		var F = function(){};
		F.prototype = supClass.prototype;
		subClass.prototype = new F();
		subClass.prototype.contructor = subClass;
	}

	//点亮
	var Light = function(el, options){
		this.el = el;
		this.item = this.el.getElementsByTagName("img");
		this.len = this.item.length;
		this.add = 1;
		this.opt = options;
	}
	Light.prototype.init = function(){
		this.lightOn(this.opt.num);
		if(!this.opt.readOnly){
			this.bindEvent();
		}		
	}
	Light.prototype.lightOn = function(num){
		num = parseInt(num);
		for(var i = 0, len = this.item.length; i < len; i++){
			if(i < num){
				this.item[i].src = "images/star_on.png";
			}else{
				this.item[i].src = "images/star_off.png";
			}
		}
	}
	Light.prototype.bindEvent = function(){
		var self = this;
		this.el.addEventListener(this.selectEvent, function(event){
			var target = event.target;
			if(target.nodeName.toLowerCase() === 'img'){
				var index = self.getIndex(self.item, target);
				self.select(event, target);
				index += self.add
				self.lightOn(index);
				(typeof self.opt.select === "function") && self.opt.select.call(target, index, self.len);
			}		
		}, false);
		this.el.addEventListener("click", function(event){
			var target = event.target;
			if(target.nodeName.toLowerCase() === 'img'){
				var index = self.getIndex(self.item, target);
				index += self.add
				self.opt.num = index;
				(typeof self.opt.chosen === "function") && self.opt.chosen.call(target, index, self.len);
			}
		}, false);
		this.el.addEventListener("mouseout", function(){
			self.lightOn(self.opt.num);
		}, false);
	}
	Light.prototype.getIndex = function(item, target){
		for(var i = 0, len = this.item.length; i < len; i++){
			if(this.item[i] == target){
				return i;
			}
		}
	}
	Light.prototype.select = function(){
		console.log("子类必须重写");
	}

	//点亮整颗
	var LightEntire = function(el, options){
		Light.call(this, el, options);
		this.selectEvent = "mouseover";
	}
	extend(LightEntire, Light);
	LightEntire.prototype.lightOn = function(num){
		Light.prototype.lightOn.call(this, num);
	}
	LightEntire.prototype.select = function(){
		this.add = 1;
	}

	//点亮半颗
	var LightHalf = function(el, options){
		Light.call(this, el, options);
		this.selectEvent = "mousemove";
		this.halfWidth = (getComputedStyle(this.item[0]).width).replace(/px/g, "");
	}
	extend(LightHalf, Light);
	LightHalf.prototype.lightOn = function(num){
		var count = parseInt(num)
			isHalf = count !== num;

		Light.prototype.lightOn.call(this, count);

		if(isHalf){
			this.item[count].src = "images/star_half.png";
		}
	}
	LightHalf.prototype.select = function(event, target){
		if(event.pageX - target.offsetLeft < Number(this.halfWidth)/2){
			this.add = 0.5;
		}else{
			this.add = 1;
		}
	}

	//默认参数
	var defaults = {
		num: 0,
		readOnly: false,
		select: function(){},
		chosen: function(){}
	};

	var mode = {
		LightEntire: LightEntire,
		LightHalf: LightHalf
	};

	var init = function(el, options){
		options = Object.assign({}, defaults, options);
		//如果传入其他字符串，默认是点亮整颗
		if(!mode[options.mode]){
			options.mode = "LightEntire";
		}
		new mode[options.mode](el, options).init();
	}
	return {
		init: init
	}
})();