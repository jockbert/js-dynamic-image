// Dynamic Image version 2.0

function delayedCall(fn, ms) {
    fn = fn || function () {};
    ms = ms || 500;

    var isBlocked = false;

    function clearBlock() {
        isBlocked = false;
        fn();
    }

    return function () {
        if (!isBlocked) {
            isBlocked = true;
            window.setTimeout(clearBlock, ms);
        }
    };
}


function DynamicImage(elemId, delay, widths, srcs, aspectRatio) {
    widths = widths || [];
    srcs = srcs || [];
    delay = delay || 500; // half a second delay as default
    aspectRatio = aspectRatio || 1.78; // ratio 16/9

    var elem = document.getElementById(elemId),
        currentWidth = -1,
        image = this,
        win = window; // minification optimization

    function isElementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        return (
            top < (win.pageYOffset + win.innerHeight) &&
            left < (win.pageXOffset + win.innerWidth) &&
            (top + height) > win.pageYOffset &&
            (left + width) > win.pageXOffset
        );
    }

    this.setWidthAlternatives = function (ws, ss, aRatio) {
        widths = ws;
        srcs = ss;
        aspectRatio = aRatio || aspectRatio;
        currentWidth = -1;
        this.delayedUpdate();
    };

    function updateHeight(elem) {
        if (isNotLoadedYet()) updateHeightBasedOnWidth(elem);
        else updateHeightDefault(elem);
    }

    function updateHeightBasedOnWidth(elem) {
        var height = Math.round(elem.offsetWidth / aspectRatio);
        elem.style.height = '' + height + 'px';
    }

    function updateHeightDefault(elem) {
        elem.style.height = '100%';
    }

    function isNotLoadedYet() {
        return currentWidth == -1;
    }

    this.update = function () {
        updateHeight(elem);
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
        }
    };

    this.delayedUpdate = delayedCall(this.update, delay);


    this.selfRegister = function () {
        var nestedOnresize = win.onresize;
        var nestedOnscroll = win.onscroll;

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
    elem.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAAA1BMVEWgoKAG03+7AAAACklEQVQI12MAAgAABAABINItbwAAAABJRU5ErkJggg==";
    updateHeightBasedOnWidth(elem);
}