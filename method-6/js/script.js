var rating = (function(){
	var Rating = function(el, options){
		this.el = el;
		this.opt = Object.assign({}, Rating.DEFAULT, options);
		this.starWidth = 16;
		this.displayWidth = this.opt.num * this.starWidth;
		this.mousemoveFn = this.mousemove.bind(this);
		this.clickFn = this.click.bind(this);
		this.mouseleaveFn = this.mouseleave.bind(this);
	}
	Rating.DEFAULT = {
		total: 5,
		num: 2,
		readOnly: false,
		select: function(){},
		chosen: function(){}
	}
	Rating.prototype.init = function(){
		this.setCss();
		if(!this.opt.readOnly){
			this.bindEvent();
		}
	}
	Rating.prototype.setCss = function(){
		//设置容器宽度
		this.elWidth = this.opt.total * this.starWidth
		this.el.style.width = this.elWidth + "px";
		//设置展示区默认宽度
		this.display = document.getElementById("rating-display");
		this.display.style.width = this.displayWidth + "px";
		//获取容器距离左侧距离
		this.elLeft = this.el.offsetLeft;
	}
	Rating.prototype.bindEvent = function(){
		this.el.addEventListener('mousemove', this.mousemoveFn, false);
		this.el.addEventListener("click", this.clickFn, false);
		this.el.addEventListener("mouseleave", this.mouseleaveFn, false);
	},
	Rating.prototype.mousemove = function(event){
		var dis = event.pageX - this.elLeft;
			this.display.style.width = dis + "px";
		(typeof this.opt.select === "function") && this.opt.select.call(this.el, dis, this.elWidth);	
	},
	Rating.prototype.click = function(event){
		this.displayWidth = event.pageX - this.elLeft;
		(typeof this.opt.chosen === "function") && this.opt.chosen.call(this.el, this.displayWidth, this.elWidth);
	},
	Rating.prototype.mouseleave = function(){
		this.display.style.width = this.displayWidth + "px";
	},
	Rating.prototype.unbindEvent = function(){
		this.el.removeEventListener('mousemove', this.mousemoveFn, false);
		this.el.removeEventListener("click", this.clickFn, false);
		this.el.removeEventListener("mouseleave", this.mouseleaveFn, false);
	}

	var init = function(el, options){
		if(!el.rateFn){
			el.rateFn = new Rating(el, typeof options === 'object' && options);
			el.rateFn.init();
		}
		if(typeof options === 'string'){
			el.rateFn[options]();
		}
	}

	return {
		init: init
	}
})();