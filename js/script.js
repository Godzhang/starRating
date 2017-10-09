var rating = (function(){
	function lightOn(item, num){
		for(var i = 0, len = item.length; i < len; i++){
			if(i < num){
				item[i].style['background-position'] = "0 -16px";
			}else{
				item[i].style['background-position'] = "0 0";
			}
		}
	}

	function getIndex(item, target){
		for(var i = 0, len = item.length; i < len; i++){
			if(item[i] == target){
				return i;
			}
		}
	}

	var init = function(el, num){
		var list = el,
			item = list.getElementsByTagName('li');

		lightOn(item, num);

		list.addEventListener("mouseover", function(event){
			var target = event.target;
			if(target.nodeName.toLowerCase() === 'li'){
				var index = getIndex(item, target);
				lightOn(item, index+1);
			}		
		}, false);
		list.addEventListener("click", function(event){
			var target = event.target;
			if(target.nodeName.toLowerCase() === 'li'){
				var index = getIndex(item, target);
				num = index+1;
			}
		}, false);
		list.addEventListener("mouseout", function(){
			lightOn(item, num);
		}, false);
	}
	return {
		init: init
	}
})();