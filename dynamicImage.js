// Dynamic Image version 2.3

function DynamicImage(elemId, delay, widths, srcs, aspectRatio) {
    widths = widths || [];
    srcs = srcs || [];
    delay = delay || 500; // half a second delay as default
    aspectRatio = aspectRatio || 1.8; // ratio 16/9

    var elem = document.getElementById(elemId),
        currentWidth = -1,
        image = this, // Minification optimization and reference clarification.
        win = window; // Minification optimization.

    image.setWidths = function (ws, ss, aRatio) {
        widths = ws;
        srcs = ss;
        aspectRatio = aRatio || aspectRatio;
        currentWidth = -1;
        delayedUpdateFn();
    };

    function updateHeight() {
        var height = currentWidth == -1 ? Math.round(elem.offsetWidth / aspectRatio) + 'px' : '100%';
        if (elem.style.height != height) {
            elem.style.height = height;
        }
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

    function update() {
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
            elem.src = src;
            currentWidth = width;
            updateHeight();
        }
    }

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

    var delayedUpdateFn = delayedCall(update, delay);

    image.delayedUpdate = delayedUpdateFn;

    image.register = function () {

        function callOldAndUpdate(oldFn) {
            return function () {
                if (oldFn) oldFn();
                delayedUpdateFn();
            };
        }

        win.onresize = callOldAndUpdate(win.onresize);
        win.onscroll = callOldAndUpdate(win.onscroll);
    };
  

    // --- creation preparations ----
    elem.style.width = '100%';
    elem.src = "data:image/gif;base64,R0lGODlhAQABAIABAKCgoP///yH5BAEKAAEALAAAAAABAAEAAAICRAEAOw==";
    updateHeight();
}