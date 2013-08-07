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
*
* Calling flapjack.replace([element or element ID]) will replace that DOM element with
* the resulting image
*
* Calling flapjack.download([filename]) will initiate a download of the image for the user
* If you don't supply a filename, it will try to generate a sensible default.
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
	el is the SVG/Canvas basis for the image.  It can be an element, or an element ID
	format is an optional image format, like "jpg" or "png"
	attributes is an object with attributes to set on the image.
		{class: "map", alt: "This is a map!"} will produce <img class="map" alt="This is a map!"...>
*/

function Pancake(el,format,attributes) {

	if (el) {
		
		// Keep the scope the way we want it
		if (window === this) {
			return new Pancake(el,format,attributes);
		}
		
		//They didn't pass a format, but they did pass attributes
		if (typeof format === "object") {
			attributes = format;
			format = "";	
		}

		//They didn't pass attributes
		if (typeof attributes !== "object") {
			attributes = {};
		}

		//If they passed format as an option rather than a separate arg, fix that
		if (attributes.format) {
			format = attributes.format;
			delete attributes.format;
		}

		//Try to get the element by ID
		if (typeof el === "string") {

			//Set the ID
			this.id = el;

			//Get the element
			el = document.getElementById(el);
		}

		if (el) {						

			//Try to set the ID based on the element ID
			if (!this.id && typeof el.id === "string" && el.id.length) this.id = el.id;

			if (el.tagName.toLowerCase() === "svg") {				

				//Create a blank canvas, use canvg to populate it with SVG contents				
				this.canvas = document.createElement("canvas");

				//Probably need a more robust width/height function
				this.canvas.width = this.width = el.scrollWidth;
				this.canvas.height = this.height = el.scrollHeight;

				//Create a temporary container for getting the SVG outerHTML
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
				this.format = (typeof format === "string" && format.match(/^(image\/)?(png|webp|jpe?g)$/i)) ? format.toLowerCase().replace(/^image\//,"").replace("jpeg","jpg") : "png";
				this.src = this.canvas.toDataURL("image/"+this.format.replace("jpg","jpeg"));
				this.element = document.createElement("img");

				this.element.src = this.src;

				if (this.height) this.element.height = this.height;
				if (this.width) this.element.width = this.width;
				
				for (var attr in attributes) {
					if (attr.toLowerCase() != "src") this.element.setAttribute(attr,String(attributes[attr]));
				}

				//Can probably delete the temporary canvas now
				delete this.canvas;
			} else {
				//Not a valid element
				throw "Supplied element must be a <canvas> or <svg> element.";
				return false;
			}
		}		
		
		return this;

	} else {
		//Didn't find anything
		throw "No valid element or element ID supplied.";
		return false;
	}
}

Pancake.prototype = {

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
	replace: function(el) {
		if (typeof el === "string") {
			el = document.getElementById(el);		
		}

		if (el && this.element) {
			el.parentNode.insertBefore(this.element, el.nextSibling);
			el.parentNode.removeChild(el);
		} else {
			//Didn't find anything
			throw "No valid element or element ID supplied.";	
		}
		
		return this;
	},

/*
*
* download([filename])
* ===============================
* Attempts to initiate a download of the image by creating a dummy link and
* simulating a click.  Uses the HTML5 download property to give it a filename.
* filename can be supplied as an argument.  With no argument, it will try to use
* the element ID of the SVG/Canvas that generated the image as the filename.  If
* no ID is available, it will just be image.png, image.jpg, or image.webp. 
* This isn't too cross-browser compatible, but seems to work on modernish ones.
*
*/	
	download: function(fn) {		
		if (typeof fn !== "string" || !fn.length) {
			if (this.id) {
				fn = this.id+"."+this.format;
			} else {
				fn = "image."+this.format;
			}
		}

		var a = document.createElement("a");
		a.href = this.src;
		a.setAttribute("download",fn);

		document.body.appendChild(a);

		if (typeof a.click === 'function') {
			a.click();
		} else {
			var e = document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);			
		}

		document.body.removeChild(a);

		return this;
	}	
};