const title = "Edit"; // Title.
var colors = [255,255,255, 191,191,191, 127,127,127, 63,63,63, 191,191,127, 231,0,95, 0,119,239, 0,151,63, 167,0,0, 143,0,119, 0,0,0]; // Colors.
var bgcolor = 0; // Original design bg color.
const maxwidth = 60, maxheight = 60; // Canvas max size.
var width = 7, height = 7; // Canvas size.
var xoffset = picoDiv(maxwidth - width, 2); // Pixels x-index offset.
var yoffset = picoDiv(maxheight - height, 2); // Pixels y-index offset.
const maxanime = 20; // Frame max size.
var anime = 1; // Frame count.
var frame = 0; // Anime frame index.
var buffers = []; // Pixels buffers.
var animeflag = 0; // Anime editing flag.
var playing = 0; // Playing count.
var pixels = []; // Canvas pixels.
var canvas = ""; // Canvas pixels by text format.
var depth = 3;//colors.length/3; // Color count.
const coffset = 36; // Color offset.
const maxcolor = 10;//26; // Color max count.
var colorflag = 0; // Color editing flag.

// Update icon image.
async function appUpdate(force = true) {

	// Update buffer.
	if (force || buffers[frame]) {
		////console.log("Update" + frame + ": " + buffers[frame]);

		// Store canvas pixels to buffers.
		buffers[frame] = [0, width, height];
		for (let j = yoffset; j < yoffset + height; j++) {
			for (let i = xoffset; i < xoffset + width; i++) {
				if (pixels[j][i]) {
					let k = buffers[frame].length;
					buffers[frame][k] = pixels[j][i];
					buffers[frame][k+1] = i - xoffset;
					buffers[frame][k+2] = j - yoffset;
				}
			}
		}
		if (buffers[frame].length <= 3) {
			buffers[frame] = null;
		}
	}

	// Update icon image.
	if (buffers[frame]) {
		let data = await picoSpriteData(buffers[frame], bgcolor);
		picoLabel("action", null, data);
	} else {
		picoLabel("action", "*");
	}

	// Update select button.
	//if (animeflag) {
	//	picoLabel("select", "" + anime);
	//} else {
		picoLabel("select", "*" + width);
	//}
	picoLabel("minus", "-");
	picoLabel("plus", "+");
}

// Action button.
async function appAction() {
	picoResetParams();

	// Create num code to share url.
	let k = 0;
	for (let p = 0; p < anime; p++) {
		if (buffers[p]) {
			picoSetCode6(buffers[p], k);
		} else {
			picoSetCode6([0,7,7], k);
		}
		k++;
	}
	if (k == 0) {
		picoSetCode6([0,7,7], k);
		k++
	}
	if (((colors[0] == 255 && colors[1] == 255 && colors[2] == 255) ||
		(colors[0] == 0 && colors[1] == 0 && colors[2] == 0))) {
		picoSetCode8(colors.slice(0,(depth+1)*3), k);
	}

	// Back or share.
	if (!await picoReturnApp()) {
		picoShareApp();
	}
}

// Select button.
function appSelect(x) {

	// Change menu mode.
	if (x == 0) {
		animeflag = animeflag ? 0 : 1;
	//	colorflag = 0;
		appUpdate(false);

	// Change color depth.
	//} else if (colorflag) {
	//	depth = depth + x < 1 ? 1 : depth + x >= maxcolor ? maxcolor : depth + x;

	// Change canvas frame.
	/*} else if (animeflag) {
		anime = anime + x < 1 ? 1 : anime + x >= maxanime ? maxanime : anime + x;
		appUpdate();

		// Remove reduced frame after update icons.
		if (frame > anime - 1) {
			frame = anime - 1;
			playing = -1; // Restart.
		}
	//*/

	// Change canvas size.
	} else {
		width = width + x < 3 ? 3 : width + x > maxwidth ? maxwidth : width + x;
		height = height + x < 3 ? 3 : height + x > maxheight ? maxheight : height + x;
//		xoffset = picoDiv(maxwidth - width, 2);
//		yoffset = picoDiv(maxheight - height, 2);
		xoffset += x>0 ? (picoMod(width,2)?-1:0) : x<0 ? (!picoMod(width,2)?1:0) : 0;
		if (xoffset < 0) {
			xoffset = 0;
		} else if (xoffset > maxwidth-width) {
			xoffset = maxwidth-width;
		}
		yoffset += x>0 ? (picoMod(height,2)?-1:0) : x<0 ? (!picoMod(height,2)?1:0) : 0;
		if (yoffset < 0) {
			yoffset = 0;
		} else if (yoffset > maxheight-height) {
			yoffset = maxheight-height;
		}
			//console.log("Size: " + width + "x" + height + " + " + xoffset + "," + yoffset);
		//playing = -1; // Restart.
		appUpdate(false);
	}

	picoBeep(1.2, 0.1);	
	picoFlush();
}

// Touching flags and states.
var bgindex = 0; // Background color index.
var pixeltouching = 0; // -1:invalid, 0:untouched, 1:touching.
var pixeltouchmoving = 0; // Pixel touching on view mode.
var colortouching = 0; // -1:invalid, 0:untouched, 1:touching.
var colorholding = 0; // 0:untouched, 1+:touching.
var colorselecting = depth; // Touching color index.
//var colorselected = -1; // Previous touched color index.
var frametouching = 0; // -1:invalid, 0:untouched, 1:touching.
var framechanging = 0; // 0:not changed, 1:changing.
var frameselecting = -1; // Selecting frame index.
var landscape = false; // landscape mode.
var pixeltouchposx = -1; // Position x of touch starting for frame moving.
var pixeltouchposy = -1; // Position y of touch starting for frame moving.
const blockwidth = 7; // Width of 1 pixel block.

// Resize.
async function appResize() {
	landscape = picoWideScreen();
	picoFlush();
}

// Load.
async function appLoad() {
	picoTitle(title);

	// Initialize sprites.
	let char0 = "0" + (blockwidth-1) + (blockwidth-1), char1 = "00" + "0" + (blockwidth-2) + (blockwidth-2);
	for (let i = 0; i < maxcolor; i++) {
		picoCharSprite(picoCode6Char(coffset+i), picoStringCode6(char0 + picoCode6Char(i) + char1));
	}

	// Initialize pixels on max size.
	for (let j = 0; j < maxheight; j++) {
		pixels[j] = [];
		for (let i = 0; i < maxwidth; i++) {
			pixels[j][i] = 0;
		}
	}

	// Load query params.
	let keys = picoKeys(), framecount = 0;
	for (let k = 0; k < keys.length; k++) {
		let value = picoString(k);
		if (value) {
			////console.log("Param" + k + ": " + keys[k] + " -> " + picoString(k));


			// Load colors.
			if ((value[0] == "1" && value[1] == "1" && value[2] == "1")) {
				let code8 = picoCode8(keys[k]);
				code8 = code8.slice(0,maxcolor*3);
				colors = code8.concat(colors.slice(code8.length));
				depth = picoDiv(code8.length,3)-1;
				colorselecting = depth;
				bgcolor = 0;
				console.log("Load color: " + colors + " " + depth);

			// Load colors with transparent color.
			} else if ((value[0] == "0" && value[1] == "0" && value[2] == "0") ) {
				let code8 = picoCode8(keys[k]);
				code8 = code8.slice(0,maxcolor*3);
				colors = code8.concat(colors.slice(code8.length));
				depth = picoDiv(code8.length,3)-1;
				colorselecting = depth;
				bgcolor = -1;
				console.log("Load color: " + colors + " " + depth);

			// Load pixels.
			} else if (value[0] == "0" && value[1] != "0" && value[2] != "0") {
				buffers[framecount] = picoCode6(keys[k]);
				frame = framecount;
				anime = framecount + 1;
				if (anime >= 2) {
					animeflag = 1;
				}
				////console.log("Load buffer" + keys[k] + ": " + buffers[framecount]);
				framecount++;
			}
		}
	}

	appResize();
}

// Main.
async function appMain() {

	// Initialize.
	if (playing <= 0) {

		// Load pixels to canvas.
		if (frameselecting != frame) {
			frameselecting = frame;
			if (frameselecting >= 0 && buffers[frame]) {
				for (let j = 0; j < maxheight; j++) {
					pixels[j] = [];
					for (let i = 0; i < maxwidth; i++) {
						pixels[j][i] = 0;
					}
				}
				if (buffers[frame][0] == 0) {
					width = buffers[frame][0 + 1] >= 0 && buffers[frame][0 + 1] <= maxwidth ? buffers[frame][0 + 1] : 7;
					height = buffers[frame][0 + 2] >= 0 && buffers[frame][0 + 2] <= maxheight ? buffers[frame][0 + 2] : 7;
					xoffset = picoDiv(maxwidth - width, 2);
					yoffset = picoDiv(maxheight - height, 2);
				}
				for (let n = 3; n < buffers[frame].length; n += 3) {
					if (buffers[frame][n + 3] == 0) {
						let imax = buffers[frame][n + 1] + buffers[frame][n + 4] + xoffset;
						let jmax = buffers[frame][n + 2] + buffers[frame][n + 5] + yoffset;
						//console.log("Put pixel: " + "->" + imax + "," + jmax);
						for (let i = buffers[frame][n + 1] + xoffset; i <= imax; i++) {
							for (let j = buffers[frame][n + 2] + yoffset; j <= jmax; j++) {
								//console.log("Put pixel: " + i + "," + j);
								if (i >= xoffset && i < xoffset + width && j >= yoffset && j < yoffset + height) {
									pixels[j][i] = buffers[frame][n];
								}
							}
						}
						n += 3;
					} else {
						let i = buffers[frame][n + 1] + xoffset;
						let j = buffers[frame][n + 2] + yoffset;
						if (i >= xoffset && i < xoffset + width && j >= yoffset && j < yoffset + height) {
							pixels[j][i] = buffers[frame][n];
						}
					}
				}
			} else {
				for (let j = 0; j < maxheight; j++) {
					pixels[j] = [];
					for (let i = 0; i < maxwidth; i++) {
						pixels[j][i] = 0;
					}
				}
			}
			console.log("Load pixel: " + pixels);
		}
		appUpdate();

		// Reset playing count.
		playing = 1;
	}

	// Positions.
	let pixelswidth = animeflag ? 112 : landscape ? 112 : 140; // Size of pixels.
	let pixelsposx = 0, pixelsposy = landscape ? -12 : -14; // Positions of pixels.
	let pixelscount = width < height ? width : height; // Line/Row count of pixels.
	let pixelsgrid = pixelswidth / pixelscount; // Grid length of each pixels.
	let pixelsmargin = pixelsgrid/7; // Margin length of each pixels.
	let pixelcolor = 1; // Background of pixels color.

	let colorsposx = 0, colorsposy= landscape ? 60 : 82; // Positions of colors/coloreditor.
	let colorsgrid = landscape ? 16 : 14; // Grid length of each colors.
	let colorswidth = (colorflag ? maxcolor : depth) * colorsgrid, colorsheight = 20; // Color selector width and height.

	let bgcolorwidth = landscape ? 180 : 150, bgcolorheight = 24; // Background of color selector width and height.
	let bgcolorwidth2 = bgcolorwidth+2, bgcolorheight2 = bgcolorheight+2; // Background color selector width and height for touching.
	let colorbutton1x = bgcolorwidth2/2-8, colorbutton1y = colorsposy; // Color selector plus button position.
	let colorbutton2x = -bgcolorwidth2/2+8, colorbutton2y = colorsposy; // Color selector minus button position.
	let colorbuttonwidth = 8, colorbuttonheight = bgcolorheight/2; // Color selector button width and height.
	let colorbuttoncolor = 1; // Color selector button color.

	let bgpixelsposx = 0, bgpixelsposy = pixelsposy; // Positions of pixel frame.
	let bgpixelwidth = landscape ? 180 : 150, bgpixelheight = landscape ? 120 : 150; // Background of pixel frame width and height.
	let bgpixelcolor = 1; // Background of pixel frame color.

	let framebutton1x = pixelswidth/2+12, framebutton1y = pixelsposy; // Frame selector plus button position.
	let framebutton2x = -pixelswidth/2-12, framebutton2y = pixelsposy; // Frame selector minus button position.
	let framebuttonwidth = 8, framebuttonheight = pixelswidth/2; // Frame selector button width and height.
	let framebuttoncolor = 2; // Frame selector button color.

	let framesposx = 0, framesposy = landscape ? 60 : 82; // Offset of animeeditor.
	let bgframewidth = landscape ? 180 : 150, bgframeheight = 24; // Background of frame selector width and height.
	let bgframecolor = 2; // Background of frame selector color.

	// Draw background.
	picoColor();
	/*/
	if (landscape) {
		picoRect(-1, 0, 0, 200, 160);
	} else {
		picoRect(-1, 0, 0, 160, 200);
	}//*/
	//picoRect(1, pixelsposx, pixelsposy, pixelswidth, pixelswidth);

	// Pixel editer mode.
	if (!animeflag) {

		// Release touching background.
		if (colortouching >= 0 && picoAction() &&
			!picoAction(bgpixelsposx, bgpixelsposy, bgpixelwidth/2, bgpixelheight/2) &&
			!picoAction(colorsposx, colorsposy, colorswidth/2, colorsheight/2) &&
			!picoAction(colorbutton1x, colorbutton1y, colorbuttonwidth, colorbuttonheight) &&
			!picoAction(colorbutton2x, colorbutton2y, colorbuttonwidth, colorbuttonheight)) {
			console.log("Release touching background.");
			colortouching = 0;

			if (!colorflag) {
				//colorselected = colorselecting;
				picoBeep(0, 0.1);

			// Back to pixel mode.
			} else {
				console.log("Back to pixel mode.");
				colorflag = 0;
				colorselected = -1;
				picoFlush(); // Update after action event.
				picoBeep(1.2, 0.1);
			}

			// Touching.
			picoRect(bgcolor, colorsposx, colorsposy, bgcolorwidth2, bgcolorheight2);

		// Touching background.
		} else if (colortouching >= 0 && picoMotion() &&
			!picoMotion(bgpixelsposx, bgpixelsposy, bgpixelwidth/2, bgpixelheight/2) &&
			!picoMotion(colorsposx, colorsposy, colorswidth/2, colorsheight/2) &&
			!picoMotion(colorbutton1x, colorbutton1y, colorbuttonwidth, colorbuttonheight) &&
			!picoMotion(colorbutton2x, colorbutton2y, colorbuttonwidth, colorbuttonheight)) {
			frametouching = -1;
			pixeltouching = -1;
			colortouching = 1;

			if (!colorflag) {
				// Start to touching background.
				if (colortouching == 0) {
					console.log("Touching background.");
					colorselecting = 0;
					colorholding = 0;

				// Hovering from another color.
				} else if (colorselecting != 0) {
					console.log("Touching another background.");
					colorselecting = 0;
					colorholding = 0;
					//colorselected = -2;

				// Continue touching background.
				} else {
					console.log("Continue touching background.");//:" + colorselected);
					colorholding++;

					// Change background color.
					if (colorholding >= 60) {
						console.log("Change background color.");
						let c = colors[0];
						colors[0] = colors[1] = colors[2] = c > 0 ? 0 : 255;
						bgindex = colors[0] != 0 ? 0 : -1;
						bgcolor = colors[0] != 0 ? 0 : -1;
						appUpdate(); // Update thumbnail.
						picoBeep(1.2, 0.1);
						colortouching = -1;
						colorholding = 0;
					}
				}
			}

			// Touching.
			picoRect(bgcolor, colorsposx, colorsposy, bgcolorwidth2, bgcolorheight2);

		} else {
			// Draw background of color selector.
			picoRect(bgcolor, colorsposx, colorsposy, bgcolorwidth, bgcolorheight);
			//picoRect(3, colorsposx, colorsposy, colorswidth, colorsheight);
		}

		// Draw background of pixels.
		if (!picoAction(pixelsposx, pixelsposy, pixelswidth/2, pixelswidth/2) &&
			picoAction(bgpixelsposx, bgpixelsposy, bgpixelwidth/2, bgpixelheight/2)) {
			animeflag = 1;
			picoRect(bgpixelcolor, bgpixelsposx, bgpixelsposy, bgpixelwidth, bgpixelheight);
		} else if (!picoMotion(pixelsposx, pixelsposy, pixelswidth/2, pixelswidth/2) &&
			picoMotion(bgpixelsposx, bgpixelsposy, bgpixelwidth/2, bgpixelheight/2)) {
			picoRect(bgpixelcolor, bgpixelsposx, bgpixelsposy, bgpixelwidth, bgpixelheight);
		} else {
			picoRect(pixelcolor, bgpixelsposx, bgpixelsposy, bgpixelwidth, bgpixelheight);
		}

		// Touching color buttons.
		if (!colorflag) {
			const char1 = "+", char2 = "-", scale = 2;
			if (depth + 1 < maxcolor) {
				// Release touching color plus button.
				if (colortouching >= 0 && picoAction(colorbutton1x, colorbutton1y, colorbuttonwidth, colorbuttonheight)) {
					console.log("Release touching color plus button.");
					colortouching = 0;
					depth += 1;
					colorselecting = depth;
					picoChar(char1, colorbuttoncolor, colorbutton1x, colorbutton1y, 0, scale*0.9);

				// Touching color plus button.
				} else if (colortouching >= 0 && picoMotion(colorbutton1x, colorbutton1y, colorbuttonwidth, colorbuttonheight)) {
					frametouching = -1;
					pixeltouching = -1;
					colortouching = 1;
					picoChar(char1, colorbuttoncolor, colorbutton1x, colorbutton1y, 0, scale*0.9);

				// Color plus button.
				} else {
					picoChar(char1, colorbuttoncolor, colorbutton1x, colorbutton1y, 0, scale);
				}
			}
			if (depth - 1 > 0) {
				// Release touching color minus button.
				if (colortouching >= 0 && picoAction(colorbutton2x, colorbutton2y, colorbuttonwidth, colorbuttonheight)) {
					console.log("Release touching color minus button.");
					colortouching = 0;
					depth -= 1;
					colorselecting = colorselecting<depth ? colorselecting : depth;
					picoChar(char2, colorbuttoncolor, colorbutton2x, colorbutton2y, 0, scale*0.9);

				// Touching color minus button.
				} else if (colortouching >= 0 && picoMotion(colorbutton2x, colorbutton2y, colorbuttonwidth, colorbuttonheight)) {
					frametouching = -1;
					pixeltouching = -1;
					colortouching = 1;
					picoChar(char2, colorbuttoncolor, colorbutton2x, colorbutton2y, 0, scale*0.9);

				// Color minus button.
				} else {
					picoChar(char2, colorbuttoncolor, colorbutton2x, colorbutton2y, 0, scale);
				}
			}
		}

	// Frame viewer mode.
	} else {

		// Draw background of pixels.
		if (picoMotion(pixelsposx, pixelsposy, pixelswidth/2, pixelswidth/2)) {
			picoRect(bgpixelcolor, bgpixelsposx, bgpixelsposy, bgpixelwidth, bgpixelheight);
		} else {
			picoRect(bgpixelcolor, bgpixelsposx, bgpixelsposy, bgpixelwidth, bgpixelheight);
		}

		// Touching frame buttons.
		{
			const char0 = "&", char1 = "+", char2 = "-", angle1 = 90, angle2 = -90, scale = 2, scale1 = 1;
			if (frame + 1 < maxanime) {
				let char = char0, s = scale, a = angle1;
				// Release touching frame plus button.
				if (frametouching >= 0 && picoAction(framebutton1x, framebutton1y, framebuttonwidth, framebuttonheight)) {
					console.log("Release touching frame plus button.");
					frametouching = 0;
					if (frame + 1 < anime) {
						frame = frame + 1;
					} else {
						anime = anime + 1;
						frame = anime - 1;
						char = char1;
					}
					playing = -1; // Reset pixels from buffer.
					s = scale1;

				// Touching frame plus button.
				} else if (frametouching >= 0 && picoMotion(framebutton1x, framebutton1y, framebuttonwidth, framebuttonheight)) {
					pixeltouching = -1;
					colortouching = -1;
					frametouching = 1;
					if (frame + 1 >= anime) {
						char = char1;
						a = 0;
					}
					s = scale1;

				} else {
					if (frame + 1 >= anime) {
						char = char1;
						a = 0;
					}
				}
				picoChar(char, framebuttoncolor, framebutton1x, framebutton1y, a, s);
			}
			if (frame >= 2 || anime >= 2) {
				let char = char0, s = scale, a = angle2;
				// Release touching frame minus button.
				if (frametouching >= 0 && picoAction(framebutton2x, framebutton2y, framebuttonwidth, framebuttonheight)) {
					console.log("Release touching frame minus button.");
					frametouching = 0;
					if (frame >= 1) {
						frame = frame - 1;
						playing = -1; // Reset pixels from buffer.
					} else if (anime >= 2) {
						anime = anime - 1;
						if (frame <= 0) {
							char = char2;
							a = 0;
						}
					}
					s = scale1;

				// Touching frame minus button.
				} else if (frametouching >= 0 && picoMotion(framebutton2x, framebutton2y, framebuttonwidth, framebuttonheight)) {
					pixeltouching = -1;
					colortouching = -1;
					frametouching = 1;
					if (frame <= 0) {
						char = char2;
						a = 0;
					}
					s = scale1;

				} else {
					if (frame <= 0) {
						char = char2;
						a = 0;
					}
				}
				picoChar(char, framebuttoncolor, framebutton2x, framebutton2y, a, s);
			}
		}

		// Draw background of frame selector.
		picoRect(bgframecolor, framesposx, framesposy, bgframewidth, bgframeheight);
	}

	// Set colors data.
	picoColor(colors.slice(0,(depth+1)*3));

	// Draw pixels.
	{
		let pixeltouchmovex = 0, pixeltouchmovey = 0; // Touch position difference for frame moving.

		// Clear canvas.
		canvas = "";

		// Update canvas.
		for (let j = yoffset; j < yoffset + height; j++) {
			let y = (j - yoffset - (height - 1) / 2) * pixelsgrid + pixelsposy;
			for (let i = xoffset; i < xoffset + width; i++) {
				let x = (i - xoffset - (width - 1) / 2) * pixelsgrid + pixelsposx;

				// Update canvas on viewer mode.
				if (animeflag) {
					if (pixeltouching >= 0 && picoMotion(x, y, pixelsgrid/2+1)) {
						let j0 = j - yoffset, i0 = i - xoffset;
						//console.log("Touch animes" + 
						//	pixeltouching + " " + xoffset + "," + yoffset + ":" + 
						//	pixeltouchposx + "," + pixeltouchposy+"->"+i0+","+j0);
						if (pixeltouching > 0 && (pixeltouchposx != i0 || pixeltouchposy != j0)) {
							pixeltouchmovex += pixeltouchposx - i0;
							pixeltouchmovey += pixeltouchposy - j0;
							//console.log("Moving:" + pixeltouchmovex + "," + pixeltouchmovey);
						}
						pixeltouchposx = i0;
						pixeltouchposy = j0;

						console.log("Touch pixels.");
						pixeltouching = 1; // Touch pixels.
						frametouching = -1;
						colortouching = -1;
					}

					canvas += picoCode6Char(coffset+pixels[j][i]);

				// Update canvas on editer mode.
				} else {
					if (pixeltouching >= 0 && picoMotion(x, y, pixelsgrid/2)) {
						console.log("Touch pixels.");
						pixeltouching = 1; // Touch pixels.
						frametouching = -1;
						colortouching = -1;

						// Put pixel.
						if (pixels[j][i] != colorselecting) {
							pixels[j][i] = colorselecting;
						}

						// Cancel color editing.
						if (colorflag) {
							console.log("Cancel color editing.");
							colorflag = 0;
							//colorselected = -1;
							picoFlush();
						}

						picoRect(pixels[j][i], x, y, pixelsgrid, pixelsgrid);
						canvas += " ";
					} else {
						canvas += picoCode6Char(coffset+pixels[j][i]);
					}
				}
			}
		}

		// Update offset.
		if (pixeltouchmovex || pixeltouchmovey) {
			pixeltouchmoving = 1;
			xoffset += pixeltouchmovex;
			if (xoffset < 0) {
				xoffset = 0;
			} else if (xoffset > maxwidth-width) {
				xoffset = maxwidth-width;
			}
			yoffset += pixeltouchmovey;
			if (yoffset < 0) {
				yoffset = 0;
			} else if (yoffset > maxheight-height) {
				yoffset = maxheight-height;
			}
			appUpdate(false);
		}

		let l = blockwidth;
		if (animeflag) {
			// Switch view to edit.
			if (!pixeltouchmoving && picoAction(pixelsposx, pixelsposy, pixelswidth/2, pixelswidth/2)) {
				//animeflag = 0;

			} else {
				// Touching on view mode.
				if (picoMotion(pixelsposx, pixelsposy, pixelswidth/2, pixelswidth/2)) {

				// No touching on view mode.
				} else {
					l = blockwidth - 1;
				}
			}
		}

		// Draw canvas.
		let s = pixelsgrid / l;
		let w = (pixelswidth + 1) / s;
		picoCharLeading(l, l);
		picoText(canvas, -1, pixelsposx+0.5, pixelsposy+0.5, w,w, 0,s);
	}

	// Draw animes.
	if (animeflag) {
		let size = anime > 7 ? anime : 7;
		let grid = pixelswidth / size;
		let margin = size <= 9 ? 2 : 1;
		let w1 = grid - margin - 1; // Width.
		let w2 = grid - 1; // Width for selecting.
		let w3 = grid + margin; // Width for holding.
		let w4 = grid - margin*2; // Width for copyed.
		let scale = w4 / 4;

		for (let i = 0; i < anime; i++) {
			let x = pixelsposx + (i - (anime-1)/2) * grid;
			let sprite = buffers[i] ? buffers[i] : [0, 7, 7];
			let w0 = grid/2;// * 7 / picoSpriteSize(sprite); // Width for toucharea.

			// Release touching frame.
			if (frametouching >= 0 && picoAction(x, framesposy, w0, w0)) {
				console.log("Release touching frame.");
				frametouching = 0;

				// Switch view to edit.
				if (!framechanging) {
					animeflag = 0;
				}

				// Paste and release.
				/*if (frame != i) {
					console.log("Paste and release.");
					if (buffers[frame]) {
						sprite = buffers[frame];
					}
					frameselecting = frame = i;
					appUpdate(); // Paste pixels to buffers.
					picoBeep(1.2, 0.1);
				}*/

				// Release holding frame.
				picoSprite(sprite, 0, x, framesposy, 0, w3 / picoSpriteSize(sprite)); // Selecting frame.

			// Touching frame.
			} else if (frametouching >= 0 && picoMotion(x, framesposy, w0, w0)) {
				pixeltouching = -1;
				colortouching = -1;

				// Start to touching frame.
				//if (frametouching == 0) {
					console.log("Touching frame.");
					frametouching = 1;
					if (frame != i) {
						frame = i;
						framechanging = 1;
						playing = -1; // Reset pixels from buffer.
					}
					
				// Hovering to another frame.
				/*} else if (frameselecting != i) {
					console.log("Touching another frame.");
					if (buffers[frame]) {
						sprite = buffers[frame];
					}*/
				//}

				// Cancel color editing.
				if (colorflag) {
					console.log("Cancel color editing.");
					colorflag = 0;
					//colorselected = -1;
				}

				// Touch holding frame.
				picoSprite(sprite, 0, x, framesposy, 0, w3 / picoSpriteSize(sprite)); // Touching frame.

			// Not touching but selecting color.
			} else if (frameselecting == i) {

				// Touch holding frame.
				//if (frametouching >= 1) {
				//	picoSprite(sprite, 0, x, framesposy, 0, w4 / picoSpriteSize(sprite)); // Copyed frame.
				//} else 
				if (anime >= 2) {
					picoSprite(sprite, 0, x, framesposy, 0, w2 / picoSpriteSize(sprite)); // Selecting frame.
				} else {
					picoSprite(sprite, 0, x, framesposy, 0, w1 / picoSpriteSize(sprite)); // Only one frame.
				}

			// Other frames.
			} else {
				picoSprite(sprite, 0, x, framesposy, 0, w1 / picoSpriteSize(sprite)); // Unselecting frames.
			}
		}
	}

	// Draw colors.
	if (!animeflag && !colorflag) {
		const scale = 4;

		for (let i = 1; i <= depth; i++) {
			let x = colorsposx + (i - (depth+1)/2) * colorsgrid; // Margins for each color.

			// Release touching color.
			if (colortouching >= 0 && picoAction(x, colorsposy, colorsgrid/2, colorsheight/2)) {
				console.log("Release touching color.");
				colortouching = 0;
				//colorselected = colorselecting;
				picoBeep(0, 0.1);
				picoChar(picoCode6Char(coffset+i), -1, x, colorsposy, 0, scale*0.5);

			// Touching color.
			} else if (colortouching >= 0 && picoMotion(x, colorsposy, colorsgrid/2, colorsheight/2)) {
				frametouching = -1;
				pixeltouching = -1;

				// Start to touching another color.
				if (colortouching == 0) {
					console.log("Touching color.");
					colortouching = 1;
					colorholding = 0;
					colorselecting = i;

				// Hovering to another color.
				} else if (colorselecting != i) {
					console.log("Touching another color.");
					colorselecting = i;
					colorholding = 0;
					//colorselected = -2;

				// Continue touching color.
				} else {
					console.log("Continue touching color.");//:" + colorselected);
					colorholding++;

					// Enter color edit mode.
					if (colorholding >= 30) {
						console.log("Enter color edit mode.");//:" + colorselected);
						colorflag = 1;
						picoBeep(1.2, 0.1);
						colortouching = -1;
						colorholding = 0;
					}
				}
				picoChar(picoCode6Char(coffset+i), -1, x, colorsposy, 0, scale*0.45);

			} else {

				// Not touching but selecting color.
				if (colorselecting == i) {
					picoChar(picoCode6Char(coffset+i), -1, x, colorsposy, 0, scale*0.5);

				// Other colors.
				} else {
					picoChar("-", i, x, colorsposy, 0, scale);
				}
			}
		}
	}

	// Draw color editor.
	if (!animeflag && colorflag) {
		const compression = 2, maxcompresed = (1 << (8 - compression));
		const scale = 4;

		// Draw buttons and color numbers.
		if (colorselecting) {
			for (let i = 0; i < 3; i++) {
				let c = colors[colorselecting * 3 + i];

				// Decrease color number.
				if (c > 0) {
					let x = colorsposx + (i*3+1 - 10/2) * colorsgrid; // Margins for each color number.
					let s = scale;
					if (colortouching >= 0 && picoAction(x, colorsposy+4, 8, 4)) {
						c = (c + 1) >> compression; // Bit shift for compressed decrease.
						c = c - 1 > 0 ? c - 1 : 0; // Decrease.
						c = (c << compression) - 1; // Bit unshift.
						c = c > 0 ? c : 0;
					} else if (colortouching >= 0 && picoMotion(x, colorsposy+4, 8, 4)) {
						s = scale * 0.9;
					}

					// Draw decrease button.
					picoChar("&", colorselecting, x, colorsposy+4, 180, s);
				}

				// Increase color number.
				if (c < 255) {
					let x = colorsposx + (i*3+1 - 10/2) * colorsgrid; // Margins for each color number.
					let s = scale;
					if (colortouching >= 0 && picoAction(x, colorsposy-4, 8, 4)) {
						c = (c + 1) >> compression; // Bit shift for compressed increase.
						c = c + 1 < maxcompresed ? c + 1 : maxcompresed; // Increase.
						c = (c << compression) - 1; // Bit unshift.
					} else if (colortouching >= 0 && picoMotion(x, colorsposy-4, 8, 4)) {
						s = scale * 0.9;
					}
					colors[colorselecting * 3 + i] = c;

					// Draw increase button.
					picoChar("&", colorselecting, x, colorsposy-4, 0, s);
				}

				// Convert range 0-255 to 0-100.
				let c99 = picoDiv(colors[colorselecting * 3 + i] * 99, 255);
				let c00 = c99 >= 99 ? "100" : c99 >= 9 ? " " + (c99 + 1) : c99 >= 1 ? " 0" + (c99 + 1) : " 00";

				// Draw color numbers.
				let x = colorsposx + (i*3+2 - 10/2) * colorsgrid; // Margins for each color number.
				let s = scale;
				picoCharLeading(colorsgrid/scale,colorsgrid/scale);
				picoChar(c00, colorselecting, x, colorsposy, 0, s);
			}
		}
	}

	// Set touching state to avoid touching another area continuously.
	if (picoAction()) {
		console.log("Reset touching state.");
		if (pixeltouching > 0) {
			appUpdate();
		}
		pixeltouching = 0;
		pixeltouchmoving = 0;
		colortouching = 0;
		frametouching = 0;
		framechanging = 0;
		pixeltouchposx = 0;
		pixeltouchposy = 0;
	}

	// Increment playing count.
	playing++;
}
