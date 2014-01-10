'use strict';

var assert = buster.assert;


var shouldFitDiamondsPerRow = function(html, num, skipLastRow) {
	skipLastRow = !!skipLastRow;
	// Every upper row should have 4 and every lower row should have 3, except for maybe the last row
	var run = false;
	$(".diamond-row-wrap" + (skipLastRow ? "" : ":not(:last-child)"), html).each(
		function(index, row) {
			var upper = $(".diamond-row-upper", row);
			var lower = $(".diamond-row-lower", row);
			assert.equals($(".diamond-box", upper).length, num);
			assert.equals($(".diamond-box", lower).length, num - 1);
			run = true;
		}
	);
	assert(run, "Did not find any rows");
}

buster.testCase("Diamonds test", {

	"js:" : {
		"setUp" : function() {
			this.testHtml = $('<div class="wrapper"></div>');
			this.itemsCount = 100;
			for(var i = 0; i < this.itemsCount; i++) {
				this.testHtml.append($('<a href="#" class="item">Item</a>'));
			}

			$("body").append(this.testHtml);
		},

		"tearDown" : function() {
			$("head style").remove();
			if($(this.testHtml).data("diamonds")) {
				$(this.testHtml).diamonds("destroy");
			}
			$("body > *").remove();
		},


		"should be able to initialize" : function() {
			$(this.testHtml).diamonds();
			assert.isObject($(this.testHtml).data("diamonds"));
			assert($(".diamonds", this.testHtml));
		},

		"should throw error when attempting to run on un-initialized element" : function() {
			assert.exception(function() {
				$(this.testHtml).diamonds("draw");
			}.bind(this), "Error");
		},

		"should set custom options" : function() {
			$(this.testHtml).diamonds({
				size: 400
			});
			var d = $(this.testHtml).data("diamonds");

			assert.equals(d.options.size, 400);

			$(this.testHtml).diamonds("setOptions", {
				size: 500
			});

			assert.equals(d.options.size, 500);
		},

		"should group into rows correctly" : function() {
			var size = 200;
			$(this.testHtml).css("width", size * 4);
			$(this.testHtml).diamonds({
				"size": size
			});
			// Every upper row should have 4 and every lower row should have 3, except for maybe the last row
			shouldFitDiamondsPerRow(this.testHtml, 4);
		},

		"should wrap items in correct html" : function() {
			$(this.testHtml).diamonds();

			$(".item", this.testHtml).each(function(index, item) {
				assert.className($(item).parent().get(0), "diamond-box-inner");
				assert.className($(item).parent().parent().get(0), "diamond-box");
				assert.className($(item).parent().parent().parent().get(0), "diamond-box-wrap");
			});
		},

		"should auto resize" : function() {
			var size = 200;
			$(this.testHtml).css("width", size * 5);
			$(this.testHtml).diamonds({
				"size": size,
				"autoRedraw": true
			});
			shouldFitDiamondsPerRow(this.testHtml, 5);

			$(this.testHtml).css("width", size * 10);

			// Wait for redraw
			setTimeout(function() {
				shouldFitDiamondsPerRow(this.testHtml, 10);
			}, 100);
		},

		"should skip incomplete row" : function() {
			var size = 200;
			$(this.testHtml).css("width", size * 4); // 4 + 3 = 7 diamonds per row
			$(this.testHtml).diamonds({
				"size": size,
				"hideIncompleteRow": true
			});

			// No incomplete rows
			shouldFitDiamondsPerRow(this.testHtml, 4, false);
		},

	},

/*
	"css" : {

		"inner diamond should have equal size to wrap, and box should fit exactly inside wrap" : function() {
			//$("head").append($("<link rel='stylesheet' type='text/css' />").attr("href", "diamonds.css"));
			$.when($.get("diamonds.css")).done(function(response) {
                $('<style type="text/css" />').html(response).appendTo($('head'));

	            console.debug($("head style"));

				var size = 200;
				$(this.testHtml).css("width", size * 4); // 4 + 3 = 7 diamonds per row
				$(this.testHtml).diamonds({
					"size": size
				});

				$(".diamond-box-wrap", this.testHtml).each(function(index, wrap) {
					wrap = $(wrap);
					var box = $($(".diamond-box", wrap));
					var inner = $($(".diamond-box-inner", box));

					assert.equals(wrap.width(), size);
					assert.equals(wrap.height(), size);

					assert.equals(box.width(), size);
					assert.equals(box.height(), size);
				});

            }).fail(function() {
            	assertions.fail();
            });			
		}
	}*/
});