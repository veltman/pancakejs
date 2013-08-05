Pancake.js
=========

A mini-library for easily flattening SVG and Canvas elements into images on the fly.  For SVG elements, it relies on [canvg](https://code.google.com/p/canvg/) for the heavy lifting.

## When to use ##

If you're drawing dynamic SVG graphics, but you want to replace them with flat images in the browser in some situations.

## How to use ##

### Flavors ###

If you're only converting Canvas elements, there are no dependencies.  Just include the small JavaScript file:

    <script type="text/javascript" src="pancake.min.js"></script>

If you're converting SVG elements, you need to include the canvg library too.  You can use the hosted version:

	<script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/rgbcolor.js"></script> 
	<script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/StackBlur.js"></script>
	<script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/canvg.js"></script> 
	<script type="text/javascript" src="pancake.min.js"></script> 

You can also use `pancake.stack.js` or `pancake.stack.min.js`, which combines them into a single file for the lazy:

	<script type="text/javascript" src="pancake.stack.min.js"></script> 	

### Making a pancake ###

To create a flat image based on an SVG or Canvas element, just call the constructor and pass either the element itself or the ID of the element.

	//Passing the element itself
	var flapjack = Pancake(svgElement);

	//Passing the element's ID
	var flapjack = Pancake("map");

You can also pass an optional image format.  If you don't pass one, it will default to PNG.  Other options are WebP and JPG.

	//Make it a JPG instead of a PNG
	var flapjack = Pancake("map","jpg");
	
	//So does this.  We're not that picky
	var flapjack = Pancake("map","image/jpeg");
    
    //Any of these values will work: png, image/png, webp, image/webp, jpg, jpeg, image/jpg, image/jpeg

### Serving a pancake ###

Once you've created a pancake, access its `src` and `element` properties to actually serve it to a user.  The `src` is a [data URI](https://developer.mozilla.org/en-US/docs/data_URIs); you can use it like you would a filename in an `<img>` tag.

	var flapjack = Pancake(someSortofSVG);

	//Use the .element property to get the image as a new <img> element
	gallery.append(flapjack.element);

	//Use the .src property if you just want the image src
	//Useful if you want to change an existing image element	
	existingImage.src = flapjack.src;

	//Also useful for things like using it as a background image instead
	myDiv.style.backgroundImage = "url("+flapjack.src+"")";

	//You can also access the .width and .height properties, but they may not be reliable
	flapjack.height; //e.g. 480
	flapjack.width; //e.g. 320

If you want to replace a DOM element, use the `.replace()` method.  Like the constructor, this takes either a document element or the ID of the element.  This is useful if, say, you've drawn an SVG and then you want to replace the SVG with the image version.

	<svg id="myChart">...</svg>

	var flapjack = Pancake("myChart"); //Generate the image
	flapjack.replace("myChart"); //Replace the SVG with the image

	//You can pass the element too
	var el = document.getElementById("myChart");
	var flapjack = Pancake(el);
	flapjack.replace(el);

## To Dos ##

* Currently doesn't have very smart width/height detection, although it's unclear if this causes problems.
* Haven't tested this much at all.  Should test it on more browsers and with unusual inputs.

## Questions/Comments/Suggestions ##
Noah Veltman  
Web: http://noahveltman.com  
Twitter: [@veltman](http://twitter.com/veltman)  
Email: [noah@noahveltman.com](mailto:noah@noahveltman.com)  

