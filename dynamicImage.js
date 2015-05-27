// Dynamic Image version 2.1

function DynamicImage(elemId, delay, widths, srcs, aspectRatio) {
    widths = widths || [];
    srcs = srcs || [];
    delay = delay || 500; // half a second delay as default
    aspectRatio = aspectRatio || 1.8; // ratio 16/9

    var elem = document.getElementById(elemId),
        currentWidth = -1,
        image = this, // Minification optimization and reference clarification.
        win = window; // Minification optimization.

    image.setWidthAlternatives = function (ws, ss, aRatio) {
        widths = ws;
        srcs = ss;
        aspectRatio = aRatio || aspectRatio;
        currentWidth = -1;
        image.delayedUpdate();
    };

    function updateHeight() {
        if (currentWidth == -1) updateHeightBasedOnWidth();
        else updateHeightDefault();
    }

    function updateHeightBasedOnWidth() {
        var height = Math.round(elem.offsetWidth / aspectRatio);
        elem.style.height = '' + height + 'px';
    }

    function updateHeightDefault() {
        elem.style.height = '100%';
    }
    
    function isElementInViewport(el) {
        var top = el.offsetTop,
            left = el.offsetLeft,
            width = el.offsetWidth,
            height = el.offsetHeight,
            pageXOffset = win.pageXOffset, // Minification optimization.
            pageYOffset = win.pageYOffset; // Minification optimization.

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (pageYOffset + win.innerHeight) &&
            left < (pageXOffset + win.innerWidth) &&
            (top + height) > pageYOffset &&
            (left + width) > pageXOffset
        );
    }

    image.update = function () {
        updateHeight();
        if (!isElementInViewport(elem)) return;

        var elemWidth = elem.offsetWidth;
        if (currentWidth >= elemWidth) return;

        var src = srcs[0];
        var width = widths[0];

        for (var i = 1; i < widths.length && widths[i - 1] < elemWidth; ++i) {
            src = srcs[i];
            width = widths[i];
        }

        if (width > currentWidth) {
            console.log("source change to " + src);
            elem.src = src;
            currentWidth = width;
        }
    };

    function delayedCall(fn, ms) {
        var isBlocked = false;

        function clearBlock() {
            isBlocked = false;
            fn();
        }

        return function () {
            if (!isBlocked) {
                isBlocked = true;
                win.setTimeout(clearBlock, ms);
            }
        };
    }

    image.delayedUpdate = delayedCall(image.update, delay);

    image.selfRegister = function () {
        var nestedOnresize = win.onresize,
            nestedOnscroll = win.onscroll;

        win.onresize = function () {
            if (nestedOnresize) nestedOnresize();
            image.delayedUpdate();
        };
        win.onscroll = function () {
            if (nestedOnscroll) nestedOnscroll();
            image.delayedUpdate();
        };
    };

    // --- creation preparations ----
    elem.style.width = '100%';
    // gif version
    elem.src="data:image/gif;base64,R0lGODlhAQABAIABAKCgoP///yH5BAEKAAEALAAAAAABAAEAAAICRAEAOw==";
    //png version 
    // elem.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEWgoKAG03+7AAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==";
    updateHeightBasedOnWidth();
}