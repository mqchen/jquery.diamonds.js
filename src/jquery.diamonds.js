(function($, window, document, undefined) {
    'use strict';
    
    var Diamonds = function(customOptions) {
        this.options = {
            wrapElement : null,
            itemSelector : ".item",
            size : 250,
            gap : 0.5,
            autoRedraw : true,
            hideIncompleteRow : false,
            scrollbarWidth : null,
            minDiamondsPerRow : 2,
            itemWrap : $('<div class="diamond-box-wrap"><div class="diamond-box"><div class="diamond-box-inner"></div></div></div>'),
            rowWrap : $('<div class="diamond-row-wrap"></div>'),
            rowUpperWrap : $('<div class="diamond-row-upper"></div>'),
            rowLowerWrap : $('<div class="diamond-row-lower"></div>'),
            diamondWrap : $('<div class="diamonds"></div>'),
            overrideCss : '.diamonds-{{guid}} .diamond-box-wrap { width: {{size}}px; height: {{size}}px; } .diamonds-{{guid}} .diamond-box { border-width: {{gap}}px }'
        };
        this.setOptions(customOptions, false);
        
        this.itemElements = $(this.options.itemSelector, this.options.wrapElement);
        
        this.guid = this._createGuid();

        // Create override css
        this.styleElement = this._createOverrideCss();
        
        // Initial draw
        this.draw();
        
        // Auto redraw
        this.startAutoRedraw();
    };

    Diamonds.prototype._createGuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
    };
    
    Diamonds.prototype.destroy = function() {
        this._removeOverrideCss();
        this.stopAutoRedraw();
        this._emptyElement(this.options.wrapElement);
        this.options.wrapElement.append(this.itemElements);
        this.options.wrapElement.removeData("diamonds");
    };
    
    Diamonds.prototype._createOverrideCss = function() {
        var css = this.options.overrideCss;
        var data = {
            "size" : this.options.size,
            "gap" : this.options.gap,
            "guid" : this.guid
        }
        for(var key in data) {
            if(data.hasOwnProperty(key)) {
                css = css.replace(new RegExp("{{" + key + "}}", 'g'), data[key]);
            }
        }
        
        var style = $('<style type="text/css"></style>');
        style.html(css);
        
        $("head").append(style);
        return style;
    };
    
    Diamonds.prototype._removeOverrideCss = function() {
        if(this.styleElement) this.styleElement.remove();
    };

    Diamonds.prototype._updateOverrideCss = function() {
        this._removeOverrideCss();
        this._createOverrideCss();
    };
    
    Diamonds.prototype.stopAutoRedraw = function() {
        window.clearInterval(this.redrawer);
    };
    
    Diamonds.prototype.startAutoRedraw = function() {
        this.stopAutoRedraw(); // Stop previous
        var lastWidth = this.options.wrapElement.width();
        if(this.options.autoRedraw) {
            this.redrawer = window.setInterval(function() {
                var curWidth = this.options.wrapElement.width();
                if(curWidth !== lastWidth) {
                    lastWidth = curWidth;
                    this.draw();
                }
            }.bind(this), 50);
        }
    };
    
    Diamonds.prototype.setOptions = function(customOptions, redraw) {
        redraw = redraw === undefined ? true : redraw;
        if(customOptions !== null && typeof customOptions === "object") {
            $.extend(true, this.options, customOptions);
            
            if(redraw) {
                this._updateOverrideCss();
                this.draw();
            }
        }
    };

    Diamonds.prototype._getScrollbarWidth = function() {
        if(isNaN(this.options.scrollbarWidth) && this.options.scrollbarWidth >= 0) return this.scrollbarWidth;
        var $inner = $('<div style="width: 100%; height:200px;">test</div>'),
            $outer = $('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
            inner = $inner[0],
            outer = $outer[0];
         
        $('body').append(outer);
        var width1 = inner.offsetWidth;
        $outer.css('overflow', 'scroll');
        var width2 = outer.clientWidth;
        $outer.remove();

        return this.scrollbarWidth = (width1 - width2);
    };
    
    Diamonds.prototype._emptyElement = function(element) {
        $("*", element).detach();
    };
    
    Diamonds.prototype._groupIntoRows = function(items, maxDiamondsPerRow, hideIncompleteRow) {
        // Max number of diamonds per row
        maxDiamondsPerRow = Math.max(this.options.minDiamondsPerRow, maxDiamondsPerRow);
        
        // Draw rows
        var rows = new Array();
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            // Append or create new row?
            var max = rows.length % 2 === 0 ? maxDiamondsPerRow - 1 : maxDiamondsPerRow;
            if(!rows.hasOwnProperty(rows.length - 1) || rows[rows.length - 1].length == max) {
                rows.push(new Array());
            }
            rows[rows.length - 1].push(item);
        }
        
        // Hide incomplete rows
        if(hideIncompleteRow) {
            if(rows.hasOwnProperty(rows.length - 1) && rows[rows.length - 1].length < rows.length % 2 === 0 ? maxDiamondsPerRow - 1 : maxDiamondsPerRow) {
                rows.pop();
            }
        }
        
        return rows;
    };
    
    Diamonds.prototype._renderHtml = function(rows) {
        var wrap = this.options.diamondWrap.clone();
        wrap.addClass("diamonds-" + this.guid);
        for(var i = 0; i < rows.length; i += 2) {
            var row = this.options.rowWrap.clone();
            var upper = this.options.rowUpperWrap.clone();
            var lower = this.options.rowLowerWrap.clone();
            row.append(upper).append(lower);
            wrap.append(row);
            
            for(var j = 0; j < rows[i].length; j++) {
                upper.append(rows[i][j]);
                $(rows[i][j]).wrap(this.options.itemWrap);
            }
            if(!rows.hasOwnProperty(i + 1)) break;
            for(var j = 0; j < rows[i + 1].length; j++) {
                lower.append(rows[i + 1][j]);
                $(rows[i + 1][j]).wrap(this.options.itemWrap);
            }
        }

        wrap.css("min-width", this.options.minDiamondsPerRow * this.options.size);

        return wrap;
    };
    
    Diamonds.prototype.draw = function() {
        this._emptyElement(this.options.wrapElement);

        var width = this.options.wrapElement.innerWidth() - this._getScrollbarWidth();
        
        var rows = this._groupIntoRows(this.itemElements,
            Math.floor(width / this.options.size),
            this.options.hideIncompleteRow);
        
        var html = this._renderHtml(rows);

        this.options.wrapElement.append(html);
    };
    
    
    // jQuery stuff
    $.fn.diamonds = function(method) {
        
        // Initialize
        if(method === undefined || $.isPlainObject(method)) {
            method = method || {};
            method.wrapElement = this;
            this.data("diamonds", new Diamonds(method));
            return this;
        }
        
        // Call method
        var inst = this.data("diamonds");
        if(inst == null) throw new Error("Diamonds not initialized on this element.");
        
        if(Diamonds.prototype.hasOwnProperty(method)) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            var ret = Diamonds.prototype[method].apply(inst, args);
            return ret === undefined ? this : ret;
        }
    };
})(jQuery, window, document);