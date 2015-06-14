Dynamic Image
===

JavaScript library to enable dynamic resolution change and delayed load until image is in browser view port. The change of image resolution is based on `<img>` element width change.

A usage scenario is to only load scaled down versions of large photos on devices with small screens, to save time and bandwidth. Another usage scenario is to delay the loading of images until visible in browser view port.

For a small width area a small image is loaded, such as e.g. 100 pixels wide version:

![Small image](./photos/scaled_100.jpg "Image scaled to a width of 100 pixels")

For a wider area a larger image is loaded, such as e.g. 300 pixels wide version:

![Large image](./photos/scaled_300.jpg "Image scaled to a width of 300 pixels")

See file [example_usage.htm](example_usage.htm) for example usage. See source file [dynamicImage.js](dynamicImage.js) for further details.