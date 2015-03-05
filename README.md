Dynamic Image
===

JavaScript library to enable dynamic change of image source based on `<img>` element width change.

A usage scenario is to only load scaled down versions of large photos on devices with small screens, to save time and bandwidth.

For a small width area a small image is loaded, such as e.g.:

![Small image](./photos/scaled_100.jpg "Image scaled to a width of 100 pixels")

For a wider area a larger image is loaded, such as e.g.:

![Large image](./photos/scaled_300.jpg "Image scaled to a width of 300 pixels")

See file [example_usage.htm](example_usage.htm) for example usage. In the example, image updates are triggered by using `window.onresize`. Only browser window width enlargements will trigger an update to the image element, to avoid unnecessary image reload and bandwidth use.
