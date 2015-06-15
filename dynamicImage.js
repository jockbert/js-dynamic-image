// Dynamic Image version 3.3

function DynamicImage(delay) {
    delay = delay || 500; // half a second delay as default

    var elem = document.createElement('img'),
        currentWidth = -1,
        image = this, // Minification optimization and reference clarification.
        win = window, // Minification optimization.

        elemHeightFn = constantFn('100%'),
        srcs = [];

    // ------------ Generic Helpers -----------------

    /* Generate a function that returns a constant value. */
    function constantFn(constant) {
        return function () {
            return constant;
        };
    }

    /* Delays a function call and blocks consecutive calls during delay. */
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

    /* Set object parameter value only if it leads to a change of value. */
    function setIfChanged(object, parameter, value) {
        if (object[parameter] != value)
            object[parameter] = value;
    }

    /* Determines whether DOM element is in browser viewport. */
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

    /* Register a event listener function and a predicate for when to unregister. */
    function addListener(obj, eventType, eventFn, unregPred) {
        unregPred = unregPred || constantFn(false);

        function wrappedFn() {
            eventFn();
            if (unregPred())
                obj.removeEventListener(eventType, wrappedFn);
        }

        obj.addEventListener(eventType, wrappedFn);
    }

    // ------------ Inner Workings -----------------

    function updateHeight() {
        setIfChanged(elem.style, "height", elemHeightFn());
    }

    function update() {
        updateHeight();
        if (!isElementInViewport(elem)) return;

        var elemWidth = elem.offsetWidth;
        if (currentWidth >= elemWidth) return;

        var srcObj = srcs[0];

        for (var i = 1; i < srcs.length && srcs[i - 1].width < elemWidth; ++i)
            srcObj = srcs[i];

        if (srcObj.width > currentWidth) {
            elem.src = srcObj.src;
            currentWidth = srcObj.width;
            updateHeight();
        }
    }

    function initialization() {
        currentWidth = -1;
        elem.src = "data:image/gif;base64,R0lGODlhAQABAIABAKCgoP///yH5BAEKAAEALAAAAAABAAEAAAICRAEAOw==";
        update();
    }

    function isLargestImage() {
        var lastWidth = srcs[srcs.length - 1].width;
        return currentWidth == lastWidth;
    }

    function isImageLoaded() {
        return currentWidth != -1;
    }

    /** Registers resizeImageEvent and loadImageEvent to events
    window.resize and window.scroll respectively. */
    function registerToWindow() {
        var delayedUpdate = delayedCall(update, delay);
        addListener(win, "scroll", delayedUpdate, isImageLoaded);
        addListener(win, "resize", delayedUpdate, isLargestImage);
    }

    function returnImage(innerFn) {
        return function (argument) {
            innerFn(argument);
            return image;
        };
    }

    registerToWindow();
    initialization();

    // ------------ Public interface -----------------

    /* Append this element to other DOM element with id 'parentId'. */
    image.appendTo = returnImage(function (parentId) {
        var parent = document.getElementById(parentId);
        if (parent) parent.appendChild(elem);
    });

    /* Set width of image as a CSS-width. */
    image.width = returnImage(function (width) {
        setIfChanged(elem.style, "width", width);
    });

    /* Set height of image as a CSS-height. */
    image.height = returnImage(function (height) {
        elemHeightFn = constantFn(height);
    });

    /* Set height of image as a ratio of the actual pixel
    width of the image. The height is updated via event triggered JS. */
    image.heightAsPixelRatioOfWidth = returnImage(function (ratio) {
        elemHeightFn = function () {
            var height = Math.round(elem.offsetWidth * ratio);
            return height + 'px';
        };
    });

    /* Trigger an update of the image. This can change height and the
    currently used image resource among other things. */
    image.update = returnImage(update);

    /* Set a list of sources to use. Each list element should be
    an object of the format {width: <pixels>, src: <url>} . */
    image.sources = returnImage(function (ss) {
        srcs = ss;
        initialization();
    });

    /* Set a singel image source to use. */
    image.singleSource = returnImage(function (source) {
        srcs = [{
            width: 100000, // just a very large width.
            src: source
        }];
        initialization();
    });

    /* Return the image HTML element manipulated by DynamicImage. */
    image.getElement = function() {
        return elem;
    };
}
