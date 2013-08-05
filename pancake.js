/*
*
* By Noah Veltman (@veltman)
* https://github.com/veltman/pancakejs/
* For flattening CANVAS or SVG out to PNGs on the fly
* Uses canvg to convert SVG (https://code.google.com/p/canvg/)
* Has no other dependencies that I know of, but may not play nicely
* with sub-IE9 browser tech.  And by "may not" I mean "definitely won't."
*
* Create an instance by passing the ID or element of an SVG or Canvas, like:
* var flapjack = Pancake("svgId");
*
* flapjack.element is an img element you can append
* flapjack.src is the img src, you can use it for, e.g., background-image instead
* You can also access flapjack.width and flapjack.height, but those may be unreliable
* Calling flapjack.replace([element or element ID]) will replace that DOM element with
* the resulting image
*
* If you're passing <canvas> elements only, this file is all you need.
*
* If you're passing <svg> elements, you need to include canvg.  You can use a hosted version:
*
*   <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/rgbcolor.js"></script> 
*   <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/StackBlur.js"></script>
*   <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/canvg.js"></script> 
*
* Or you can include it all as a single file using pancake.stack.js.
*
*/

/* Constructor
	If an ID, get element by ID	
*/

function Pancake(el,format) {

	if (el) {
		
		// Keep the scope the way we want it
		if (window === this) {
			return new Pancake(el,format);
		}

		//Try to get the element by ID
		if (typeof el === "string") {
			el = document.getElementById(el);		
		}

		if (el) {			

			if (el.tagName.toLowerCase() === "svg") {				

				//Create a blank canvas, use canvg to populate it with SVG contents				
				this.canvas = document.createElement("canvas");

				//Probably need a more robust width/height function
				this.canvas.width = this.width = el.scrollWidth;
				this.canvas.height = this.height = el.scrollHeight;

				var tmp = document.createElement("div");
				tmp.appendChild(el.cloneNode(true));

				canvg(this.canvas, tmp.innerHTML,{ ignoreMouse: true, ignoreAnimation: true });				
			}

			if (el.tagName.toLowerCase() === "canvas") {

				//Clone the canvas that was passed
				this.canvas = el.cloneNode(true);
				this.width = this.canvas.width;
				this.height = this.canvas.height;
			}

			if (this.canvas) {				
				//If we have a result, create an image object;
				this.format = (typeof format === "string" && format.match(/^(image\/)?(png|webp|jpe?g)$/i)) ? format.toLowerCase().replace("jpg","jpeg") : "image/png";
				if (!this.format.match(/^image\//)) this.format = "image/"+this.format;				
				this.src = this.canvas.toDataURL(this.format);
				this.element = document.createElement("img");

				this.element.src = this.src;

				if (this.height) this.element.height = this.height;
				if (this.width) this.element.width = this.width;
				
				//Can probably delete the temporary canvas now
				delete this.canvas;
			} else {
				throw "Supplied element must be a <canvas> or <svg> element.";
				return {};
			}
		}		
		
		return this;

	} else {
		//Didn't find anything
		throw "No valid element or element ID supplied.";
		return {};
	}
}

/*
*
* replace([element or elementId])
* ===============================
* Replaces the supplied element (or element by id) with the flat image.
* Allows you to replace the SVG or CANVAS element that generated the image.
* You can also replace other elements, but be careful.  The image size may
* not match what it's replacing.
*
*/

Pancake.prototype = {
	replace: function(el) {
		if (typeof el === "string") {
			el = document.getElementById(el);		
		}

		if (el && this.element) {
			el.parentNode.insertBefore(this.element, el.nextSibling);
			el.parentNode.removeChild(el);
			return true;
		}
		
		//Didn't find anything
		throw "No valid element or element ID supplied.";
		return false;
	}
};