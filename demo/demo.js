$(document).ready(function() {
	// Get photos from Flickr
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	{
		format: "json",
		tagmode: "any",
		tags: "abstract"
	}).done(function(data) {
		var wrap = $("#flickrItems");
		$.each(data.items, function(index, item) {
			$("<a />").attr("href", item.link).addClass("item").css("background-image", "url(" + item.media.m + ")").appendTo(wrap);
		});
	}).always(function() {
		initDiamonds($("#diamondsControls"), $("#flickrItems"));
		initControls($("#diamondsControls"), $("#flickrItems"));
	});


	var initDiamonds = function(form, wrap) {
		var opt = {
			debugEnabled : true
		};
		$("[name]", form).each(function(index, input) {
			var $input = $(input);
			var val = $input.val();
			if($input.hasClass("int")) {
				val = parseInt(val);
			}
			if($input.hasClass("bool")) {
				val = val.toLowerCase() === "true";
			}
			opt[$input.attr("name")] = val;
		});

		if(!$(wrap).data("diamonds")) {
			$(wrap).diamonds(opt);
		}
		else {
			$(wrap).diamonds("setOptions", opt);
			$(wrap).diamonds("draw");
		}
	};

	var initControls = function(form, wrap) {
		$("[name]", form).each(function(index, input) {
			$(input).on("change", function(e) {
				initDiamonds(form, wrap);
			});
		});				
	}
});