## diamonds.js

Tired of straight grids where everything is vertically and horizontally aligned? Why not tilt everything by 45 degrees? This jQuery plugin lets you easily do just that!

## Demo

See `/demo/demo.html` in this repo.

## Usage

Add this to your `<head>`
	
	<link rel="stylesheet" type="text/css" href="diamonds.css" />

*Note*: The path may change depending on where you put the css file.

html

	<div class="diamondswrap">
	    <a href="#" class="item">Hello world</a>
	    <a href="#" class="item">Hello</a>
	    <a href="#" class="item">Hello</a>
	    ... many more items!
    </div>

js

	$(".diamondswrap").diamonds({
	    size: 250, // Size of the squares
	    gap: 1 // Pixels between squares
	});

## Options

**size**

Size of diamonds in pixels. Both width and height. Only squares allowed.

**gap**

Pixels between each square. The size of the squares will be reduced by this gap.

**itemSelector**

The css selector to use to select diamonds-items.  
Default: `.item`

**hideIncompleteRow**

Hide last row if there are not enough items to fill it completely.  
Default: `false`

**autoRedraw**

Auto redraw diamonds when it detects resizing.  
Default: `true`

## Methods

**Intialize**

	$(".diamondswrap").diamonds({
	    size: 250, // Size of the squares
	    gap: 1 // Pixels between squares
	});

*Note*: Calling any other method before diamonds has been initialized will cause an error to be thrown.

**draw**

Manually trigger a redraw. 

	$(".diamondswrap").diamonds("draw");

**setOptions**

Change options after initialize

	$(".diamondswrap").diamonds("setOptions", {
	    hideIncompleteRow: true
	});

*Note*: Changing options will trigger a redraw since `size`, `gap`, or `hideIncompleteRow` might have changed..

**destroy**

Destroy diamonds and return everything to how it was.

	$(".diamondswrap").diamonds("destroy");