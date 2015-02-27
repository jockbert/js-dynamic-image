// Dynamic Image version 1.0

function delayedCall(fn, ms) {
	fn = fn || function() {};
	ms = ms || 500;

	var isBlocked = false;

	function clearBlock() {
		isBlocked = false;
		fn();
	}

	return function() {
		if(!isBlocked) {
			isBlocked = true;
			window.setTimeout(clearBlock, ms);
		}
	};
}


function DynamicImage(elemId, delay, widths, srcs) {
	widths = widths || [];
	srcs = srcs || [];
	delay = delay || 500;

	var currentWidth = -1;

	this.setWidthAlternatives = function(ws, ss){
		widths = ws;
		srcs = ss;
		currentWidth = -1;
		this.delayedUpdate();
	}

	this.update = function(){
		var elem = document.getElementById(elemId);
		var elemWidth = elem.offsetWidth;
	
		var src = srcs[0];
		var width = widths[0];
		for(var i = 1; i < widths.length  && widths[i-1] < elemWidth; ++i) {
			src = srcs[i];
			width = widths[i]
		} 

		if(width > currentWidth) {
			elem.src = src;
			currentWidth = width;
			// console.log("dynamic image, view=" + elemWidth + " img=" + width);
		}
	}

	this.delayedUpdate = delayedCall(this.update, delay);
}
