Pancake.js
=========

A mini-library for easily flattening SVG and Canvas elements into images on the fly.  For SVG elements, it relies on [canvg](https://code.google.com/p/canvg/) for the heavy lifting.

# When to use #

If you're drawing dynamic SVG or Canvas graphics, but you want to replace them with flat images in the browser.  This can also be done with server-side scripts or manually using things like [SVG Crowbar](http://nytimes.github.io/svg-crowbar/), but sometimes you want to cut out the middleman, y'know?

# How to use #

## Flavors ##

If you're only converting Canvas elements, there are no dependencies.  Just include the small JavaScript file:

    <script type="text/javascript" src="pancake.min.js"></script>

If you're converting SVG elements, you need to include the canvg library too.  You can use the hosted version:

    <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/rgbcolor.js"></script> 
	<script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/StackBlur.js"></script>
	<script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/canvg.js"></script> 
	<script type="text/javascript" src="pancake.min.js"></script> 

You can also use `pancake.stack.js` or `pancake.stack.min.js`, which combines them into a single file for the lazy:

	<script type="text/javascript" src="pancake.stack.min.js"></script> 	

## Making a pancake ##

To create a flat image based on an SVG or Canvas element, just call the constructor and pass either the element itself or the ID of the element.

	//Passing the element itself
	var flapjack = Pancake(svgElement);

	//Passing the element's ID
	var flapjack = Pancake("map");

You can also pass an optional image format.  If you don't pass one, it will default to PNG.

	//Make it a JPG instead of a PNG
	var flapjack = Pancake("map","jpg");
	
	//This works too.  We're not that picky
	var flapjack = Pancake("map","image/jpeg");
    
You can also pass any custom `<img>` attributes you want.

	//Pass in a special class and an alt for the image
	//You'll get back <img class="imageClass" alt="this is an image!" ... >
	var flapjack = Pancake("map",{class: "imageClass", alt: "this is an image!"});
	
	//Pass in specific height/width
	//You'll get back <img height="400" width="200" ... >
	var flapjack = Pancake("map",{height: 400, width: 200});

### Serving a pancake ###

Once you've created a pancake, access its `src` or `element` property to actually serve it to a user.  The `src` is a [data URI](https://developer.mozilla.org/en-US/docs/data_URIs); you can use it like you would any image URL.

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

To trigger a download of the image, use the `.download()` method.  It accepts an optional filename for the download.

	var flapjack = Pancake("pieChart"); //Generate the image	
	flapjack.download("blueberry.png"); //User will be prompted to download blueberry.png

## Reference ##

### Constructor ###

**Pancake([element],[format],[attributes])**

Returns a pancaked image and some other handy properties.

*element* can be a DOM element (either `<svg>` or `<canvas>`) or an element ID (like "myChartId").  Required.

*format* is an optional image format.  Accepted values are: `png`, `image/png`, `webp`, `image/webp`, `jpg`, `jpeg`, `image/jpg`, `image/jpeg`.  The default is `png`.  

*attributes* is an optional list of extra attributes to give the resulting `<img>` element.  You can pass any number of attributes, like `class`, `id`, `style`, `alt`, etc.  Must be an object of the form `{attributeName: attributeValue, attributeName: attributeValue}`.  You can pass the image format in this object instead of as a separate argument if you feel like it.

    var p = Pancake("mySvg");
    var pJPG = Pancake("mySvg","jpg");
    var pAlsoJPG = Pancake("mySvg",{format: "jpg"});
    var pWithClass = Pancake("mySvg",{class: "syrupy"});
    var pJPGWithClass = Pancake("mySvg","jpg",{class: "syrupy"});
    var p50x50 = Pancake("mySvg","jpg",{height: 50, width: 50});    

### Properties of a pancake ###

**p.src**

The [data URI](https://developer.mozilla.org/en-US/docs/data_URIs) for a pancaked image.  This can be used just like an image URL.  Put it in the `src` of an existing image, or make it the `href` of a link, or set it as a background image.

**p.element**

An `<img>` element you can manipulate and/or add to the page.  Includes any custom attributes you passed to the constructor.  Treat it like any other element.

**p.format**

The format of the pancaked image.  Either `png`,`jpg`,`webp`.

**p.width and p.height**

The width and height of the pancaked image.  Probably not reliable.

### Methods of a pancake ###

**p.replace([elementToReplace])**

Replace the element on the page with the pancaked image.  *elementToReplace* can be either an element or the ID of an element.  It can be a `<div>`, another `<img>`, the original `<svg>` that created the image, or any other kind of element.  Be careful replacing something with unknown dimensions, though, it could mess up your layout.

**p.download([filename])**

Triggers a download of the original pancaked image.  If *filename* is supplied, that will be the default filename of the download.  Otherwise, it will guess a reasonable filename using the ID of the original `<svg>` or `<canvas>` element.  If there is no ID, it will default to `image.png`, `image.jpg`, or `image.webp` (depending on the format).

## To Dos ##

* Smarter width/height detection - although it's unclear if this even matters.
* The download() method works by creating an `<a>` element with the data URI as the `href` attribute, inserting it, and simulating a click.  This is not the most cross-browser-friendly thing.
* Not well set up for creating multiple copies of the same image using the .element property, would need to be done with .src instead
* Look into provided a nice download URL for the image itself, not just a download link (so far doesn't seem possible)
* Haven't tested this that much.  Should test it on more browsers and with unusual inputs.

## Other Resources ##

* [canvg](https://code.google.com/p/canvg/), for converting canvas elements to SVG
* [SVG Crowbar](http://nytimes.github.io/svg-crowbar/), for saving out an in-browser SVG as a .svg file with associated styles
* [Grumpicon](http://www.grumpicon.com/), for converting SVGs into fallback images, also available as a [command line utility](https://github.com/filamentgroup/grunticon).

## Questions/Comments/Suggestions ##
Noah Veltman  
Web: http://noahveltman.com  
Twitter: [@veltman](http://twitter.com/veltman)  
Email: [noah@noahveltman.com](mailto:noah@noahveltman.com)  