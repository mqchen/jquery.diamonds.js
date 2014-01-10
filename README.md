## diamonds.js

Tired of straight grids where everything is vertically and horizontally aligned? Why not tilt everything by 45 degrees? This jQuery plugin lets you easily do just that!

## Features

- Auto resizes
- No images, all css
- AMD aware plugin
- Test coverage!

## Demo

[See the demo page](http://mqchen.github.io/jquery.diamonds.js/) or checkout `/demo/demo.html` in this repo.

## Usage

Add this to your `<head>`
	
	<link rel="stylesheet" type="text/css" href="diamonds.css" />

Add this right before your closing `</body>`
	
	<script type="text/javascript" src="jquery.diamonds.js"></script>

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

### size

Size of diamonds in pixels. Both width and height. Only squares allowed.

### gap

Pixels between each square. The size of the squares will be reduced by this gap.

### itemSelector

The css selector to use to select diamonds-items.  
Default: `.item`

### hideIncompleteRow

Hide last row if there are not enough items to fill it completely.  
Default: `false`

### autoRedraw

Auto redraw diamonds when it detects resizing.  
Default: `true`

## Methods

### *Intialize*

	$(".diamondswrap").diamonds({
	    size: 250, // Size of the squares
	    gap: 1 // Pixels between squares
	});

*Note*: Calling any other method before diamonds has been initialized will cause an error to be thrown.

### draw

Manually trigger a redraw. 

	$(".diamondswrap").diamonds("draw");

### setOptions

Change options after initialize

	$(".diamondswrap").diamonds("setOptions", {
	    hideIncompleteRow: true
	});

*Note*: Changing options will trigger a redraw since `size`, `gap`, or `hideIncompleteRow` might have changed..

### destroy

Destroy diamonds and return everything to how it was.

	$(".diamondswrap").diamonds("destroy");

## Events

All events are prefixed with `diamonds:`. Which means that this is how you listen to a diamonds event:
	
	$(...).on("diamonds:beforeDraw", function() { ... })

Some events are also called with arguments. One such event is `beforeSetOptions`. This is how you catch the arguments.

	$(...).on("diamonds:beforeSetOptions", function(event, newOptions) {
		newOptions.gap = 10; // Always set the gap to 10
	});

Some events can also abort the method by calling `.preventDefault`, for example if you want to prevent all drawing.

	$(...).on("diamonds:beforeDraw", function(event) {
		e.preventDefault(); // Stops the draw method
	});

As a rule of thumb, all events starting with `before` or `on` can abort the method.



Events                     | Arguments          | Can abort method
---------------------------|--------------------|-----------------------------
beforeInit                 |                    | yes
afterInit                  |                    | no
beforeStopAutoRedraw       |                    | yes
afterStopAutoRedraw        |                    | no
beforeStartAutoRedraw      |                    | yes
onAutoResize               | `{ before: ... , current: ... }`  | yes
afterStartAutoRedraw       |                    | no
beforeSetOptions           | new options        | yes
afterSetOptions            | new options        | no
beforeDraw                 |                    | yes
afterDraw                  |                    | no
beforeDestroy              |                    | yes
afterDestroy               |                    | no






