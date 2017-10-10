var rating = (function(){
	//策略模式
	var strage = {
		entire: function(){
			return 1;
		},
		half: function(){
			return 2;
		},
		quarter: function(){
			return 4;
		}
	}

	var Rating = function(el, options){
		this.el = el;
		this.opt = Object.assign({}, Rating.DEFAULT, options);
		if(!strage[this.opt.mode]){
			strage[this.opt.mode] = "entire";
		}
		this.rate = strage[this.opt.mode]();

		this.opt.total *= this.rate;
		this.opt.num *= this.rate;
		this.starWidth = 16 / this.rate;
		this.displayWidth = this.opt.num * this.starWidth;
	}
	Rating.DEFAULT = {
		mode: 'quarter',
		total: 5,
		num: 2,
		readOnly: false,
		select: function(){},
		chosen: function(){}
	}
	Rating.prototype.init = function(){
		this.buildHTML();
		this.setCss();
		if(!this.opt.readOnly){
			this.bindEvent();
		}
	}
	Rating.prototype.buildHTML = function(){
		var html = '<div class="rating-display" id="rating-display"></div><ul class="rating-mask" id="rating-mask">';
		for(var i = 0, len = this.opt.total; i < len; i++){
			html += '<li class="rating-item"></li>';
		}
		html += '</ul>';
		this.el.innerHTML = html;
	}
	Rating.prototype.setCss = function(){
		//设置容器宽度
		this.el.style.width = this.opt.total * this.starWidth + "px";
		//设置展示区默认宽度
		this.display = document.getElementById("rating-display");
		this.display.style.width = this.displayWidth + "px";
		//设置每颗星星宽度
		this.stars = this.el.getElementsByTagName('li');
		for(var i = 0, len = this.stars.length; i < len; i++){
			this.stars[i].style.width = this.starWidth + "px";
		}
	}
	Rating.prototype.bindEvent = function(){
		var self = this;
		this.el.addEventListener('mouseover', function(event){
			var target = event.target;
			if(target.nodeName.toLowerCase() === 'li'){
				self.opt.num = self.getIndex(self.stars, target) + 1;
				self.display.style.width = self.opt.num * self.starWidth + "px"; 
				(typeof self.opt.select === "function") && self.opt.select.call(target, self.opt.num, self.stars.length);
			}		
		}, false);
		this.el.addEventListener("click", function(event){
			var target = event.target;
			if(target.nodeName.toLowerCase() === 'li'){
				self.opt.num = self.getIndex(self.stars, target) + 1;
				self.displayWidth = self.opt.num * self.starWidth;
				(typeof self.opt.chosen === "function") && self.opt.chosen.call(target, self.opt.num, self.stars.length);
			}
		}, false);
		this.el.addEventListener("mouseout", function(){
			self.display.style.width = self.displayWidth + "px";
		}, false);
	}
	Rating.prototype.getIndex = function(item, target){
		for(var i = 0, len = item.length; i < len; i++){
			if(item[i] == target){
				return i;
			}
		}
	}

	var init = function(el, options){
		new Rating(el, options).init();
	}

	return {
		init: init
	}
})();