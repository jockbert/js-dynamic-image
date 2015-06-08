// Dynamic Image version 2.6

function DynamicImage(parentId, elemWidth, delay, widths, srcs, aspectRatio) {
    elemWidth = elemWidth || '100%';
    delay = delay || 500; // half a second delay as default
    widths = widths || [];
    srcs = srcs || [];
    aspectRatio = aspectRatio || 1.8; // ratio 16/9

    var elem = document.createElement('img'),
        currentWidth = -1,
        image = this, // Minification optimization and reference clarification.
        win = window; // Minification optimization.

    image.setSources = function (ws, ss, aRatio) {
        widths = ws;
        srcs = ss;
        aspectRatio = aRatio || aspectRatio;
        currentWidth = -1;
        delayedUpdateFn();
    };

    image.setSource = function (source, aRatio) {
        srcs = [source];
        widths = [1000000]; // just a very large width.
        aspectRatio = aRatio || aspectRatio;
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

    function initialization() {
        var parent = document.getElementById(parentId);
        if (parent) {
            parent.appendChild(elem);
        }
        elem.style.width = elemWidth;
        elem.src = "data:image/gif;base64,R0lGODlhAQABAIABAKCgoP///yH5BAEKAAEALAAAAAABAAEAAAICRAEAOw==";
        elem.addEventListener("resize", delayedUpdateFn);
        updateHeight();

    }

    initialization();
}