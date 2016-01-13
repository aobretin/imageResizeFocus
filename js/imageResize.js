/**
@title ImageResize
@description simple image resize plugin, an alternative 
to the 4 points image focus plugins
@author Obretin Alexandru
@mail aobretin@optaros.com
@dependency jQuery
*/

(function($) {
	$.fn.extend({
		imageFocusResize: function(options) {
			// we declare the defaults here... for now only one option 
			// ( DEFAULT_FOCUS_WIDTH, which is the fallback if the user 
			// dosen't specify the area to be covered ) 
			var defaults = {
				DEFAULT_FOCUS_WIDTH: 1000
			}

			var options = $.extend(defaults, options);
			return this.each(function() {
			var opt = options,
				obj = $(this);

				var imageDataPosition = null, // will hold the user specified side area
					imageDataWidth = null, // will hold the user specified cover area
					originalImageSize = null, // will hold the native image size
					originalImageWidth = 0, // will hold the image original image width
					originalImageHeight = 0, // will hold the image original image height
					originalImageRatio = 1; // will hold the image original image ratio

					// the init function that only runs once
					function init() {
						var splitData, theImage;

						if (checkIfData()) {
							splitData = obj.data('focus').split(' '); // get the data-focus info and separate the 2 options
							imageDataPosition = splitData[0]; // hold the side the user wants to focus on
							imageDataWidth = checkForNumber(splitData[1]); // hold the area to be covered
							originalImageWidth = obj.innerWidth(); // hold the original image width
							originalImageHeight = obj.innerHeight(); // hold the original image height
							originalImageRatio = originalImageWidth / originalImageHeight; // hold the original image ratio

							// we get the native image width with this little tricke found on
							// http://stackoverflow.com/questions/1093137/can-javascript-access-native-image-size
							theImage = new Image();
							theImage.src = obj.attr('src');

							originalImageSize = theImage.width;
						}

						// we call the resize image on both init and resize
						resizeImage();

						$(window).on('resize', function() {
							resizeImage();
						});
					};

					// function that checks if the provided area is a number if not returns and outputs a console msg
					function checkForNumber(number) {
						var parsedNumber = parseInt(number);

						if (isNaN(parsedNumber)) {
							var errorImage = obj.attr('src').split('/'),
								errorMsg = 'Image named ' + errorImage[errorImage.length - 1] + ' has incorrect/missing area number!!! \nDefault value - ' + opt.DEFAULT_FOCUS_WIDTH + ' - will be applied!!!'
							console.log(errorMsg);
							return;
						}
						return parsedNumber;
					};

					// this function checkIfData return true if the image has the data-focus attr
					function checkIfData() {
						if (obj.data('focus')) return true;
					};

					// resizeImage that triggers on init and resize only if window with is beneath 768
					function resizeImage() {
						if (checkIfData()) {
							if ($(window).innerWidth() <= 768) {
								obj.parent().css('overflow', 'hidden');
								obj.css('max-width', 'none');

								chooseResizeSize(obj, imageDataPosition, imageDataWidth);
							} else {
								obj.css({
									maxWidth: '100%',
									width: 'auto',
									height: 'auto',
									margin: 0
								});
							}
						}
					};

					// function where the magic happens, it takes 3 params
					//@img the image object
					//@side the side to focus on
					//@size of the focus area
					function chooseResizeSize(img, side, size) {
						size = size || opt.DEFAULT_FOCUS_WIDTH;

						var selectedPercentage, imageHeight, imageWidth;

						// calculate how much percentage is the selected area from the image
						selectedPercentage = (size / originalImageSize) * 100;
						// calculate the image height
						imageHeight = $(window).innerWidth() * 100 / selectedPercentage * originalImageHeight / originalImageWidth;
						// calculate the image width
						imageWidth = originalImageRatio * imageHeight;

						switch(side) {
							case 'left':
								img.css({
									width: imageWidth,
									height: imageHeight
								});
								break;
							case 'center':
								img.css({
									width: imageWidth,
									height: imageHeight,
									marginLeft: -((imageWidth - $(window).innerWidth()) / 2)
								});
								break;
							case 'right':
								img.css({
									width: imageWidth,
									height: imageHeight,
									marginLeft: -(imageWidth - $(window).innerWidth())
								});
								break;
							default:
								img.css({
									maxWidth: '100%',
									width: 'auto',
									height: 'auto',
									margin: 0
								});
						}
					};
				// start the plugin
				init();
			});
		}
	});
}(jQuery));