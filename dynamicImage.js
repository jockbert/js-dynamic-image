// Dynamic Image version 2.10

function DynamicImage(elemWidth, delay, widths, srcs) {
    delay = delay || 500; // half a second delay as default
    widths = widths || [];
    srcs = srcs || [];

    var elem = document.createElement('img'),
        currentWidth = -1,
        image = this, // Minification optimization and reference clarification.
        win = window, // Minification optimization.

        elemHeightFn = constantFn('100%');

    image.setSources = function (ws, ss) {
        widths = ws;
        srcs = ss;
        initialization();
    };

    image.setSource = function (source) {
        srcs = [source];
        widths = [1000000]; // just a very large width.
        initialization();
    };

    function isGrayPlaceholderImage() {
        return currentWidth == -1;
    }

    function constantFn(constant) {
        return function () {
            return constant;
        };
    }

    function setChanged(object, parameter, value) {
        if (object[parameter] != value)
            object[parameter] = value;
    }

    function updateHeight() {
        setChanged(elem.style, "height", elemHeightFn());
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

    function initialization() {
        currentWidth = -1;
        elem.src = "data:image/gif;base64,R0lGODlhAQABAIABAKCgoP///yH5BAEKAAEALAAAAAABAAEAAAICRAEAOw==";
        update();
    }

    initialization();

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

    image.resizeImageEvent = delayedCall(function () {
        update();
        var lastWidth = widths[widths.length - 1];
        var isLargestImage = currentWidth == lastWidth;
        if (isLargestImage)
            win.removeEventListener("resize", image.resizeImageEvent);
    }, delay);

    image.loadImageEvent = delayedCall(function () {
        update();
        if (!isGrayPlaceholderImage())
            win.removeEventListener("scroll", image.loadImageEvent);
    }, delay);

    /** Registers resizeImageEvent and loadImageEvent to events
    window.resize and window.scroll respectively. */
    image.register = function () {
        win.addEventListener("resize", image.resizeImageEvent);
        win.addEventListener("scroll", image.loadImageEvent);
    };

    function returnImage(innerFn) {
        return function (argument) {
            innerFn(argument);
            return image;
        };
    }

    image.appendTo = returnImage(
        function (parentId) {
            var parent = document.getElementById(parentId);
            if (parent) {
                parent.appendChild(elem);
            }
        }
    );

    image.width = returnImage(
        function (width) {
            setChanged(elem.style,"width", width);
            update();
        }
    );

    image.height = returnImage(
        function (height) {
            elemHeightFn = constantFn(height);
            update();
        }
    );

    image.heightAsPixelRatioOfWidth = returnImage(
        function (ratio) {
            elemHeightFn = function () {
                var height = Math.round(elem.offsetWidth * ratio);
                return height + 'px';
            };
            update();
        }
    );
}
