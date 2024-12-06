const title = "Edit"; // Title.
var colors = [ // Colors.
	// 0:White(111), 1:LightGray(333), 2:Gray(222), 3:DarkGray(444),
	255,255,255, 191,191,191, 127,127,127, 63,63,63,
	// 4:Red(p06), 5:Blue(0i9), 6:Green(0n4),
	231,0,95, 0,119,239,  0,151,63, 
	// 7:Gold(332), 8:Silver(555), 9:Black(000),
	191,191,127, 223,223,223, 0,0,0];
var bgcolor = 0; // Original design bg color.
const maxwidth = 60, maxheight = 60; // Canvas max size.
var width = 7, height = 7; // Canvas size.
var xoffset = picoDiv(maxwidth - width, 2); // Pixels x-index offset.
var yoffset = picoDiv(maxheight - height, 2); // Pixels y-index offset.
const maxanime = 20; // Frame max size.
var anime = 1; // Frame count.
var frame = 0; // Anime frame index.
var buffers = []; // Pixels buffers.
var clipboard = [0,7,7]; // Clipboard buffers.
var playing = 0; // Playing count.
var testing = 0; // Testing count.
var pixels = []; // Canvas pixels.
var canvas = ""; // Canvas pixels by text format.
var depth = 3;//colors.length/3; // Color count.
const coffset = 36; // Color offset.
const maxcolor = 10;//26; // Color max count.
var animeflag = 0; // Anime editing flag. // 0:pixelediting, 1:animeediting, 2:framecopying.
var colorflag = 0; // Color editing flag. // 0:pixelediting, 1:colorediting.

// Update icon image.
async function appUpdate(force = true) {

	// Update buffer.
	if (force || buffers[frame]) {
		//console.log("Update" + frame + ": " + buffers[frame]);

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

	// Frame viewer mode.
	/*if (animeflag) {
		if (testing) {
			if (buffers[frame]) {
				let data = await picoSpriteData(buffers[frame], bgcolor);
				picoLabel("action", null, data);
			} else {
				picoLabel("action", "-");
			}
		} else {
			picoLabel("action", "%");
		}*/

	// Pixel editor mode.
	//} else {

		// Update icon image.
		if (buffers[frame]) {
			let data = await picoSpriteData(buffers[frame], bgcolor);
			picoLabel("action", null, data);
		} else if (anime >= 2) {
			let data = await picoSpriteData([0,7,7], bgcolor);
			picoLabel("action", null, data);
		} else {
			picoLabel("action", "*");
		}
	//}

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

	// Frame viewer mode.
	/*if (animeflag) {
		if (anime >= 2) {
			if (!testing) {
				console.log("Start testing:" + anime);
				testing = 1;
				appUpdate();
				picoBeep(1.2, 0.1);
			} else {
				console.log("End testing:" + anime);
				testing = 0;
				appUpdate();
				picoBeep(1.2, 0.1);
				picoBeep(1.2, 0.1, 0.2);
			}
		} else {
			picoBeep(-1.2, 0.1);
			picoBeep(-1.2, 0.1, 0.2);
		}*/

	// Pixel editor mode.
	//} else {
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
	//}
}

// Select button.
function appSelect(x) {

	// End testing.
	if (testing) {
		console.log("End testing:" + anime);
		testing = 0;
		appUpdate();
		picoBeep(1.2, 0.1);
		picoBeep(1.2, 0.1, 0.2);

	// Start animeeditor mode.
	} else if (x == 0) {
		console.log("Switch animeeditor mode.");
		if (!animeflag) {
			animeflag = 1;
			picoBeep(1.2, 0.1);
		} else {
			animeflag = 0;
			picoBeep(0, 0.1);
		}
		appUpdate();

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
	console.log("Change canvas size.");
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
		picoBeep(1.2, 0.1);	
	}

	picoFlush();
}

// Touching flags and states.
var bgindex = 0; // Background color index.
var pixeltouching = 0; // -1:invalid, 0:untouched, 1+:touching.
var pixeltouchmoving = 0; // Pixel touching on view mode.
var pixeltouchmoved = 0; // Pixel touch moved on view mode.
var colortouching = 0; // -1:invalid, 0:untouched, 1:touching.
var colorholding = 0; // 0:untouched, 1+:touching.
var colorselecting = depth; // Touching color index.
var frametouching = 0; // -1:invalid, 0:untouched, 1:touching.
var frameholding = 0; // 0:untouched, 1+:holding count.
var frameselecting = -1; // Selecting frame index.
var animetouching = 0; // -1:invalid, 0:untouched, 1:touching.
var animetouchmoved = 0; // Anime touch moved on view mode.
var animeholding = 0; // 0:untouched, 1+:touching.
var animetouchmovey = 0; // Direction y of touch moving on view mode.
var landscape = false; // landscape mode.
var pixeltouchposx = -1; // Position x of touch starting for frame moving.
var pixeltouchposy = -1; // Position y of touch starting for frame moving.
const blockwidth = 4; // Width of block sprite.

// Resize.
async function appResize() {
	landscape = picoWideScreen();
	picoFlush();
}

// Load.
async function appLoad() {
	picoTitle(title);

	// Initialize sprites.
	let char0 = "0" + picoCodeChar(blockwidth) + picoCodeChar(blockwidth);
	let char1 = "00" + "0" + picoCodeChar(blockwidth-1) + picoCodeChar(blockwidth-1);
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
				anime = framecount + 1;
				frame = 0;
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
			//console.log("Load pixels to canvas.");
			frameselecting = frame;
			let newpixels = buffers[frame];
			if (frameselecting >= 0 && newpixels) {
				for (let j = 0; j < maxheight; j++) {
					pixels[j] = [];
					for (let i = 0; i < maxwidth; i++) {
						pixels[j][i] = 0;
					}
				}
				if (newpixels[0] == 0) {
					width = newpixels[0 + 1] >= 0 && newpixels[0 + 1] <= maxwidth ? newpixels[0 + 1] : 7;
					height = newpixels[0 + 2] >= 0 && newpixels[0 + 2] <= maxheight ? newpixels[0 + 2] : 7;
					xoffset = picoDiv(maxwidth - width, 2);
					yoffset = picoDiv(maxheight - height, 2);
				}
				for (let n = 3; n < newpixels.length; n += 3) {
					if (newpixels[n + 3] == 0) {
						let imax = newpixels[n + 1] + newpixels[n + 4] + xoffset;
						let jmax = newpixels[n + 2] + newpixels[n + 5] + yoffset;
						//console.log("Put pixel: " + "->" + imax + "," + jmax);
						for (let i = newpixels[n + 1] + xoffset; i <= imax; i++) {
							for (let j = newpixels[n + 2] + yoffset; j <= jmax; j++) {
								//console.log("Put pixel: " + i + "," + j);
								if (i >= xoffset && i < xoffset + width && j >= yoffset && j < yoffset + height) {
									pixels[j][i] = newpixels[n];
								}
							}
						}
						n += 3;
					} else {
						let i = newpixels[n + 1] + xoffset;
						let j = newpixels[n + 2] + yoffset;
						if (i >= xoffset && i < xoffset + width && j >= yoffset && j < yoffset + height) {
							pixels[j][i] = newpixels[n];
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
			//console.log("Load pixel: " + pixels);
			appUpdate();
		}

		// Reset playing count.
		playing = 1;
	}

	// Layouts.
	let animesposx = 0, animesposy = landscape ? -68 : -86; // Offset of animeeditor.
	let bganimewidth = landscape ? 160 : 140, bganimeheight = landscape ? 18 : 20; // Background of animeeditor width and height.
	let bganimecolor = 4; // Background of animeeditor color.

	let pixelwidth = (animeflag ? (blockwidth-1) : blockwidth) * 5; // Width of basepixels, that is proportional to blockwidth-1:blockwidth.
	let pixelcount = landscape ? 6 : 7; // Count of basepixels.
	let pixelswidth = pixelwidth * pixelcount; // Size of pixels. L:90(15*6),120(20*6) / P:115(15*7),140(20*7)

	let pixelsposx = 0, pixelsposy = landscape ? (animeflag ? -4 : -12) : (animeflag ? -6 : -12); // Positions of pixels.
	let pixelscount = width < height ? width : height; // Line/Row count of pixels.
	let pixelsgrid = pixelswidth / pixelscount; // Grid length of each pixels.
	let bgpixelwidth = pixelswidth+2, bgpixelheight = pixelswidth+2; // Background of pixels width and height.
	let bgpixelcolor = 3; // Background of pixels color.

	let framesposx = 0, framesposy = landscape ? -4 : -6; // Offset of frameeditor.
	let bgframewidth = landscape ? 90 : 115; // Background of frameeditor width.
	let bgbuttoncolor = 3; // Background of buttons color.

	let colorsposx = 0, colorsposy = landscape ? 64 : 80; // Offset of coloreditor.
	let colorswidth = (colorflag ? 9 : depth) * (landscape ? 14 : 12), colorsheight = colorflag ? 20 : 16; // Coloreditor width and height.
	let bgcolorwidth = landscape ? 160 : 140, bgcolorheight = landscape ? 24 : 32; // Background of coloreditor width and height.
	let bgcolorwidth2 = bgcolorwidth+2, bgcolorheight2 = bgcolorheight+2; // Background coloreditor width and height for touching.

	// Buttons.
	const animebutton0char = "*", animebutton1char = "+", animebutton2char = "-"; // Animeeditor button chars.
	let animebuttoncolor = bgcolor, animebuttonscale0 = 2, animebuttonscale1 = 1.5; // Animeeditor button color and scales.
	let animebuttonwidth = landscape ? 20 : 8, animebuttonheight = bganimeheight; // Animeeditor button width and height.
	let animebutton1x = bganimewidth/2 + animebuttonwidth/2, animebutton1y = animesposy; // Animeeditor plus button position.
	let animebutton2x = -bganimewidth/2 - animebuttonwidth/2, animebutton2y = animesposy; // Animeeditor minus button position.

	const arrowbutton0char = "$", arrowbutton1char = "&", arrowbutton2char = "%"; // Anime arrow button chars.
	const arrowbuttonxchar = "&", arrowbuttonxangle = 90; // Anime testing button char and angle.
	let arrowbuttoncolor = bgcolor, arrowbuttonscale0 = 1, arrowbuttonscale1 = 0.75; // Anime arrow button color and scales.
	let /*arrowbuttonwidth = landscape ? 24 : 10,*/ arrowbuttonheight = 10; // Anime arrow button width and height.
	let arrowbutton1x = 0, arrowbutton1y = -10, arrowbutton1y0 = -3, arrowbutton1y1 = -5; // Anime up-arrow button offset.
	let arrowbutton2x = 0, arrowbutton2y = +10, arrowbutton2y0 = +3, arrowbutton2y1 = +5; // Anime down-arrow button offset.

	const framebutton0char = "*", framebuttonchar = "&", framebutton1angle = 90, framebutton2angle = -90; // Frameeditor button char and angles.
	let framebuttoncolor = bgcolor, framebuttonscale0 = 2, framebuttonscale1 = 1.5; // Frameeditor button color and scales.
	let framebuttonwidth = landscape ? 55 : 20, framebuttonheight = landscape ? 104 : 132; // Frameeditor button width and height.
	let framebutton1x = bgframewidth/2 + framebuttonwidth/2, framebutton1y = framesposy; // Frameeditor next button position.
	let framebutton2x = -bgframewidth/2 - framebuttonwidth/2, framebutton2y = framesposy; // Frameeditor prev button position.

	const colorbutton0char = "*", colorbutton1char = "+", colorbutton2char = "-"; // Coloreditor button chars.
	let colorbuttoncolor = bgcolor, colorbuttonscale0 = 2, colorbuttonscale1 = 1.5; // Coloreditor button color and scales.
	let colorbuttonwidth = landscape ? 20 : 8, colorbuttonheight = bgcolorheight; // Coloreditor button width and height.
	let colorbutton1x = bgcolorwidth/2 + colorbuttonwidth/2, colorbutton1y = colorsposy; // Coloreditor plus button position.
	let colorbutton2x = -bgcolorwidth/2 - colorbuttonwidth/2, colorbutton2y = colorsposy; // Coloreditor minus button position.

	const numberscale0 = 4, numberscale1 = 3; // Color number scales.
	let numberlength = 9, numbergrids = 2.5, numberoffset = 2; // Color number potisions.
	let numberwidth = 8, numberheight = 16; // Color number width and height.

	const incdecbutton0char = "*", incdecbutton1char = "+", incdecbutton2char = "-"; // Color inc/dec button char.
	const incdecbuttonscale0 = 3, incdecbuttonscale1 = 2; // Color inc/dec button scales.
	const incdecbutton1angle = 0, incdecbutton1x = numberwidth, incdecbutton1y = 0; // Color inc/dec button angle and offset.
	const incdecbutton2angle = 0, incdecbutton2x = -numberwidth, incdecbutton2y = 0; // Color inc/dec button angle and offset.

	// Reset color.
	picoColor();

	/*// Draw background.
	//picoRect(4, 0, 0, 200, 200);
	if (landscape) {
		picoRect(4, 0, 0, 200, 140);
	} else {
		picoRect(4, 0, 0, 160, 200);
	}//*/

	// Pixel editor mode.
	if (!animeflag) {

		// Touch frame of pixels.
		if (!testing && frametouching >= 0 &&
			!picoMotion(pixelsposx, pixelsposy, pixelswidth/2, pixelswidth/2) &&
			(picoMotion(animesposx, animesposy, bganimewidth/2, bganimeheight/2) ||
			 picoMotion(framebutton1x, framebutton1y, framebuttonwidth/2, framebuttonheight/2) ||
			 picoMotion(framebutton2x, framebutton2y, framebuttonwidth/2, framebuttonheight/2))) {
			console.log("Touch outside of pixels.");
			animetouching = -1;
			pixeltouching = -1;
			colortouching = -1;
			frametouching = 1; // Touch frame.
			if (!animeflag) {
				animeflag = 1;
				appUpdate(true);
				picoBeep(1.2, 0.1);
			}
		/*// Draw background of pixels.
			picoRect(bgpixelcolor, pixelsposx, pixelsposy, bgpixelwidth, bgpixelheight);
		} else {
			picoRect(bgpixelcolor, pixelsposx, pixelsposy, bgpixelwidth, bgpixelheight);
		//*/
		}
	}

	/*// Draw background area.

	// Draw background of anime buttons.
	picoRect(bgbuttoncolor, animebutton1x, animebutton1y, animebuttonwidth, animebuttonheight);
	picoRect(bgbuttoncolor, animebutton2x, animebutton2y, animebuttonwidth, animebuttonheight);

	// Draw background of animeeditor.
	picoRect(bganimecolor, animesposx, animesposy, bganimewidth, bganimeheight);

	// Draw background of frame buttons.
	picoRect(bgbuttoncolor, framebutton1x, framebutton1y, framebuttonwidth, framebuttonheight);
	picoRect(bgbuttoncolor, framebutton2x, framebutton2y, framebuttonwidth, framebuttonheight);
	//*/

	/*// Draw background of color buttons.
	picoRect(bgbuttoncolor, colorbutton1x, colorbutton1y, colorbuttonwidth, colorbuttonheight);
	picoRect(bgbuttoncolor, colorbutton2x, colorbutton2y, colorbuttonwidth, colorbuttonheight);
	//*/

	//if (!animeflag) 
	{

		// Release touching background color.
		if (colortouching >= 0 &&
			picoAction(colorsposx, colorsposy, bgcolorwidth/2, bgcolorheight/2) &&
			!picoAction(colorsposx, colorsposy, colorswidth/2, colorsheight/2)) {
			console.log("Release touching background.");
			colortouching = 0;

			// Cancel animeeditor mode.
			if (!colorflag) {
				if (!testing && animeflag) {
					animeflag = 0;
					appUpdate(true);
				}
				picoBeep(0, 0.1);

			// Back to pixel mode.
			} else {
				console.log("Back to pixel mode.");
				colorflag = 0;
				picoFlush(); // Update after action event.
				picoBeep(1.2, 0.1);
			}

			// Touching.
			picoRect(bgcolor, colorsposx, colorsposy, bgcolorwidth2, bgcolorheight2);

		// Touching background color.
		} else if (colortouching >= 0 &&
			picoMotion(colorsposx, colorsposy, bgcolorwidth/2, bgcolorheight/2) &&
			!picoMotion(colorsposx, colorsposy, colorswidth/2, colorsheight/2)) {
			frametouching = -1;
			animetouching = -1;
			pixeltouching = -1;
			colortouching = 1; // Touch colors.

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

				// Continue touching background.
				} else {
					console.log("Continue touching background.");// + colorholding);
					colorholding++;

					// Change back/foreground color.
					if (colorholding >= 60) {
						console.log("Change back/foreground color.");
						let c = colors[0];
						if (c > 0) {
							colors[0] = colors[1] = colors[2] = 0;
							colors[colors.length-3] = colors[colors.length-2] = colors[colors.length-1] = 255;
						} else {
							colors[0] = colors[1] = colors[2] = 255;
							colors[colors.length-3] = colors[colors.length-2] = colors[colors.length-1] = 0;
						}
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
			// Cancel holding coloreditor.
			if (!picoMotion(colorsposx, colorsposy, colorswidth/2, colorsheight/2)) {
				colorholding = 0;
			}

			// Draw background of coloreditor.
			picoRect(bgcolor, colorsposx, colorsposy, bgcolorwidth, bgcolorheight);
		}

		// Touching color buttons.
		if (!colorflag) {
			// Release touching color plus button.
			let c1 = depth + 1 < maxcolor ? colorbutton1char : colorbutton0char;
			if (colortouching >= 0 &&
				picoAction(colorbutton1x, colorbutton1y, colorbuttonwidth/2, colorbuttonheight/2)) {
				console.log("Release touching color plus button.");
				colortouching = 0;
				if (depth + 1 < maxcolor) {
					depth += 1;
					colorselecting = depth;
				/*if (animeflag) {
					animeflag = 0;
					appUpdate(true);
					picoBeep(1.2, 0.1);
				}*/
					picoBeep(1.2, 0.1);
				} else {
					picoBeep(-1.2, 0.1);
				}
				picoChar(c1, colorbuttoncolor, colorbutton1x, colorbutton1y, 0, colorbuttonscale1);

			// Touching color plus button.
			} else if (colortouching >= 0 &&
				picoMotion(colorbutton1x, colorbutton1y, colorbuttonwidth/2, colorbuttonheight/2)) {
				frametouching = -1;
				animetouching = -1;
				pixeltouching = -1;
				colortouching = 1;
				picoChar(c1, colorbuttoncolor, colorbutton1x, colorbutton1y, 0, colorbuttonscale1);

			// Color plus button. show only animeeditor mode.
			} else if (animeflag) {
				//Hidden button.
				//picoChar(c1, colorbuttoncolor, colorbutton1x, colorbutton1y, 0, colorbuttonscale0);
			}

			// Release touching color minus button.
			let c2 = depth - 1 > 0 ? colorbutton2char : colorbutton0char;
			if (colortouching >= 0 &&
				picoAction(colorbutton2x, colorbutton2y, colorbuttonwidth/2, colorbuttonheight/2)) {
				console.log("Release touching color minus button.");
				colortouching = 0;
				if (depth - 1 > 0) {
					depth -= 1;
					colorselecting = colorselecting<depth ? colorselecting : depth;
				/*if (animeflag) {
					animeflag = 0;
					appUpdate(true);
					picoBeep(1.2, 0.1);
				}*/
					picoBeep(1.2, 0.1);
				} else {
					picoBeep(-1.2, 0.1);
				}
				picoChar(c2, colorbuttoncolor, colorbutton2x, colorbutton2y, 0, colorbuttonscale1);

			// Touching color minus button.
			} else if (colortouching >= 0 &&
				picoMotion(colorbutton2x, colorbutton2y, colorbuttonwidth/2, colorbuttonheight/2)) {
				frametouching = -1;
				animetouching = -1;
				pixeltouching = -1;
				colortouching = 1;
				picoChar(c2, colorbuttoncolor, colorbutton2x, colorbutton2y, 0, colorbuttonscale1);

			// Color minus button. show only animeeditor mode.
			} else if (animeflag) {
				//Hidden button.
				//picoChar(c2, colorbuttoncolor, colorbutton2x, colorbutton2y, 0, colorbuttonscale0);
			}
		}
	}

	// Frame viewer mode.
	if (animeflag) {

		// Touching anime buttons.
		{
			// Touching anime plus button.
			let c1 = anime + 1 <= maxanime ? animebutton1char : animebutton0char;
			if (!testing && animetouching >= 0 &&
				picoAction(animebutton1x, animebutton1y, animebuttonwidth/2, animebuttonheight/2)) {
				console.log("Release touching anime plus botton.");
				picoChar(c1, animebuttoncolor, animebutton1x, animebutton1y, 0, animebuttonscale1);
				animetouching = 0;
				if (anime + 1 <= maxanime) {
					anime = anime + 1;
					picoBeep(1.2, 0.1);
				} else {
					picoBeep(-1.2, 0.1);
				}
				//playing = -1; // Reset pixels from buffer.
			} else if (!testing && animetouching >= 0 &&
				picoMotion(animebutton1x, animebutton1y, animebuttonwidth/2, animebuttonheight/2)) {
				console.log("Touch anime plus botton.");
				pixeltouching = -1;
				colortouching = -1;
				frametouching = -1;
				animetouching = 1; // Touch anime.
				//picoRect(bgframecolor, animebutton1x, animebutton1y, animebuttonwidth, animebuttonheight);
				picoChar(c1, animebuttoncolor, animebutton1x, animebutton1y, 0, animebuttonscale1);
			} else {
				//Hidden button.
				//picoChar(animebutton1char, animebuttoncolor, animebutton1x, animebutton1y, 0, animebuttonscale0);
			}

			// Touching anime minus button.
			let c2 = anime - 1 > 0 ? animebutton2char : animebutton0char;
			if (!testing && animetouching >= 0 &&
				picoAction(animebutton2x, animebutton2y, animebuttonwidth/2, animebuttonheight/2)) {
				console.log("Release touching anime minus botton.");
				picoChar(c2, animebuttoncolor, animebutton2x, animebutton2y, 0, animebuttonscale1);
				animetouching = 0;
				if (anime - 1 > 0) {
					anime = anime - 1;
					if (frame >= anime) {
						frame = anime - 1;
						playing = -1; // Reset pixels from buffer.
					}
					picoBeep(1.2, 0.1);
				} else {
					picoBeep(-1.2, 0.1);
				}
				//playing = -1; // Reset pixels from buffer.
			} else if (!testing && animetouching >= 0 &&
				picoMotion(animebutton2x, animebutton2y, animebuttonwidth/2, animebuttonheight/2)) {
				console.log("Touch anime minus botton.");
				pixeltouching = -1;
				colortouching = -1;
				frametouching = -1;
				animetouching = 1; // Touch anime.
				//picoRect(bgframecolor, animebutton2x, animebutton2y, animebuttonwidth, animebuttonheight);
				picoChar(c2, animebuttoncolor, animebutton2x, animebutton2y, 0, animebuttonscale1);
			} else {
				//Hidden button.
				//picoChar(animebutton2char, animebuttoncolor, animebutton2x, animebutton2y, 0, animebuttonscale0);
			}
		}

		// Draw background of coloreditor.
		picoRect(bgcolor, colorsposx, colorsposy, bgcolorwidth, bgcolorheight);

		// Touching frame buttons.
		{
			// Release touching frame plus button.
			let c1 = frame + 1 < anime ? framebuttonchar : framebutton0char;
			if (!testing && frametouching >= 0 &&
				picoAction(framebutton1x, framebutton1y, framebuttonwidth/2, framebuttonheight/2)) {
				console.log("Release touching frame plus button.");
				frametouching = 0;
				if (frame + 1 < anime) {
					frame = frame + 1;
					playing = -1; // Reset pixels from buffer.
					picoBeep(1.2, 0.1);
				} else {
					picoBeep(-1.2, 0.1);
				}
				picoChar(c1, framebuttoncolor, framebutton1x, framebutton1y, framebutton1angle, framebuttonscale1);

			// Touching frame plus button.
			} else if (!testing && frametouching >= 0 &&
				picoMotion(framebutton1x, framebutton1y, framebuttonwidth/2, framebuttonheight/2)) {
				frametouching = 1;
				pixeltouching = -1;
				colortouching = -1;
				animetouching = -1;
				picoChar(c1, framebuttoncolor, framebutton1x, framebutton1y, framebutton1angle, framebuttonscale1);

			} else {
			// Frame plus button. show only touching.
			//	picoChar(c1, framebuttoncolor, framebutton1x, framebutton1y, framebutton1angle, framebuttonscale0);
			}

			// Release touching frame minus button.
			let c2 = frame >= 1 ? framebuttonchar : framebutton0char;
			if (!testing && frametouching >= 0 &&
				picoAction(framebutton2x, framebutton2y, framebuttonwidth/2, framebuttonheight/2)) {
				console.log("Release touching frame minus button.");
				frametouching = 0;
				if (frame >= 1) {
					frame = frame - 1;
					playing = -1; // Reset pixels from buffer.
					picoBeep(1.2, 0.1);
				} else {
					picoBeep(-1.2, 0.1);
				}
				picoChar(c2, framebuttoncolor, framebutton2x, framebutton2y, framebutton2angle, framebuttonscale1);

			// Touching frame minus button.
			} else if (!testing && frametouching >= 0 &&
				picoMotion(framebutton2x, framebutton2y, framebuttonwidth/2, framebuttonheight/2)) {
				frametouching = 1;
				pixeltouching = -1;
				colortouching = -1;
				animetouching = -1;
				picoChar(c2, framebuttoncolor, framebutton2x, framebutton2y, framebutton2angle, framebuttonscale1);

			} else {
			// Frame minus button. show only touching.
			//	picoChar(c2, framebuttoncolor, framebutton2x, framebutton2y, framebutton2angle, framebuttonscale0);
			}
		}
	}

	let animemargin = landscape ? (anime <= 7 ? 2 : 1.5) : (anime <= 7 ? 2 : 1.5); // Frame margin.
	let animegrid = landscape ? (160 / (anime > 10 ? anime : 10)) : (140 / (anime > 7 ? anime : 7)); // Grid length of each frames.

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
					let j0 = j - yoffset, i0 = i - xoffset;
					// Start testing on tapping within 15 msec.
					if (pixeltouching >= 0 && pixeltouching < 15 && !pixeltouchmoved && picoAction(x, y, pixelsgrid/2+1)) {
						if (animeflag && !testing) {
							console.log("Start testing:" + anime);
							testing = 1;
							appUpdate();
							picoBeep(1.2, 0.1);
						}

					} else if (pixeltouching >= 0 && picoMotion(x, y, pixelsgrid/2+1)) {
						if (animeflag && testing) {
							console.log("End testing:" + anime);
							testing = 0;
							pixeltouchmoved = 1;
							appUpdate();
							picoBeep(1.2, 0.1);
							picoBeep(1.2, 0.1, 0.2);

						} else {
							//console.log("Touch animes" + 
							//	pixeltouching + " " + xoffset + "," + yoffset + ":" + 
							//	pixeltouchposx + "," + pixeltouchposy+"->"+i0+","+j0);
							if (pixeltouching > 0 && !testing && (pixeltouchposx != i0 || pixeltouchposy != j0)) {
								pixeltouchmoved = 1;
								if (animeflag == 1) {
									pixeltouchmovex += pixeltouchposx - i0;
									pixeltouchmovey += pixeltouchposy - j0;
								//console.log("Moving:" + pixeltouchmovex + "," + pixeltouchmovey);
								}
							}
							pixeltouchposx = i0;
							pixeltouchposy = j0;

							console.log("Touch pixels.");
							pixeltouching++; // Touching pixels.
							frametouching = -1;
							animetouching = -1;
							colortouching = -1;
						}
					}

					// Touching down-arrow on view mode.
					if (animetouchmovey < 0) {
						canvas += picoCode6Char(coffset);
					} else {
						canvas += picoCode6Char(coffset+pixels[j][i]);
					}

				// Update canvas on editor mode.
				} else {
					if (!testing && pixeltouching >= 0 && picoMotion(x, y, pixelsgrid/2)) {
						console.log("Touch pixels.");
						pixeltouching = 1; // Touch pixels.
						frametouching = -1;
						animetouching = -1;
						colortouching = -1;

						// Put pixel.
						if (pixels[j][i] != colorselecting) {
							pixels[j][i] = colorselecting;
						}

						// Cancel color editing.
						if (colorflag) {
							console.log("Cancel color editing.");
							colorflag = 0;
							picoFlush();
						}

						picoRect(pixels[j][i], x+0.5, y+0.5, pixelsgrid, pixelsgrid);
						canvas += " ";
					} else {
						canvas += picoCode6Char(coffset+pixels[j][i]);
					}
				}
			}
		}

		// Update offset.
		// Ignore touch-moving within 10 msec.
		if (pixeltouching >= 10 && (pixeltouchmovex || pixeltouchmovey)) {
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

		// View mode.
		if (animeflag) {
			//console.log("Touching frame.");

			// Touching moving pixels on view mode.
			if (pixeltouching > 0) {
				l = blockwidth + 1;

			// Touching up-arrow on view mode.
			} else if (animetouchmovey > 0) {
				l = blockwidth + 1;

			// Touching down-arrow on view mode.
			} else if (animetouchmovey < 0) {
				l = blockwidth + 1;
			}

		// Edit mode.
		} else {
			//frameholding = 0;
			l = blockwidth + 1;
		}

		// Draw canvas.
		let w = l * pixelscount, s = pixelswidth / w;
		picoCharLeading(l, l);
		picoText(canvas, -1, pixelsposx+0.5, pixelsposy+0.5, w,w, 0,s);
	}

	// Draw animes.
	if (animeflag) {
		let arrowbuttonwidth = animegrid - animemargin;
		for (let i = 0; i < anime; i++) {
			let x = (i - (anime - 1) / 2) * animegrid + animesposx;
			let y = animesposy;
			let arrowscale = (animegrid - animemargin) / 9; // Arrow scale.

			// Clipboard mode.
			if (frametouching > 0 && !animetouchmoved && i == frame) {

				// Release touching up-arrow.
				if (picoAction(x+arrowbutton1x, y+arrowbutton1y, arrowbuttonwidth/2, arrowbuttonheight/2)) {
					console.log("Release touching up-arrow.");
					frametouching = 0;
					animetouching = -1;
					pixeltouching = -1;
					colortouching = -1;

					// Copy to clipboard.
					console.log("Copy to clipboard.");
					clipboard = buffers[frame] ? buffers[frame] : [0,7,7];
					pixeltouchmoved = 1;
					playing = -1; // Reset pixels from buffer.

					let text = await picoClipboard(picoCode6String(clipboard));
					if (text) {
						console.log("Copy to clipboard:" + text);
						picoBeep(1.2, 0.1);
						picoBeep(1.2, 0.1, 0.2);
					} else {
						console.log("No data on buffer.");
						picoBeep(-1.2, 0.1);
						picoBeep(-1.2, 0.1, 0.2);
					}

					picoChar(arrowbutton1char, 0, x+arrowbutton1x, y+arrowbutton1y1, 0, arrowscale*arrowbuttonscale1);

				// Touching up-arrow.
				} else if (picoMotion(x+arrowbutton1x, y+arrowbutton1y, arrowbuttonwidth/2, arrowbuttonheight/2)) {
					//console.log("Touching up-arrow.");
					animetouchmovey = 1;
					picoChar(arrowbutton1char, 0, x+arrowbutton1x, y+arrowbutton1y1, 0, arrowscale*arrowbuttonscale1);

				// Release touching down-arrow.
				} else if (picoAction(x+arrowbutton2x, y+arrowbutton2y, arrowbuttonwidth/2, arrowbuttonheight/2)) {
					console.log("Release touching down-arrow.");
					frametouching = 1;
					animetouching = -1;
					pixeltouching = -1;
					colortouching = -1;

					// Load from clipboard.
					let text = await picoClipboard();
					if (text && text[0] == "0" && text[1] != "0" && text[2] != "0") {
						console.log("Load from clipboard:" + text);
						clipboard = picoStringCode6(text);
					}

					// Paste from clipboard.
					console.log("Paste from clipboard.");
					buffers[frame] = clipboard;
					frameselecting = -1;
					playing = -1; // Reset pixels from buffer.
					picoBeep(0, 0.1);

					picoChar(arrowbutton2char, 0, x+arrowbutton2x, y+arrowbutton2y1, 0, arrowscale*arrowbuttonscale1);

				// Touching down-arrow.
				} else if (picoMotion(x+arrowbutton2x, y+arrowbutton2y, arrowbuttonwidth/2, arrowbuttonheight/2)) {
					//console.log("Touching down-arrow.");
					animetouchmovey = -1;
					picoChar(arrowbutton2char, 0, x+arrowbutton2x, y+arrowbutton2y1, 0, arrowscale*arrowbuttonscale1);

				// Touching arrows center.
				} else if (picoMotion(x, y, arrowbuttonwidth/2, arrowbuttonheight/2)) {
					console.log("Touching arrows center.");
					animetouchmovey = 0;
					picoChar(arrowbutton1char, 0, x+arrowbutton1x, y+arrowbutton1y0, 0, arrowscale*arrowbuttonscale1);
					picoChar(arrowbutton2char, 0, x+arrowbutton2x, y+arrowbutton2y0, 0, arrowscale*arrowbuttonscale1);

				// Not touching arrows.
				} else {
					//console.log("Not touching arrows.");
					if (frametouching) {
						animetouchmovey = 0;
						animetouchmoved = 1;
					}
					picoChar(arrowbutton0char, 0, x, y, 0, arrowscale*arrowbuttonscale0);
				}

			// View mode.
			} else {

				// Release touching frame.
				if (frametouching >= 0 && picoAction(x, y, animegrid/2, animegrid/2)) {
					console.log("Release touching frame.");
					frametouching = 0;
					animetouchmovey = 0;
					animetouchmoved = 0;

					// Release holding frame.
					picoChar("$", 0, x, y, 0, arrowscale*arrowbuttonscale1);

				// Touching frame.
				} else if (frametouching >= 0 && picoMotion(x, y, animegrid/2, animegrid/2)) {
					//console.log("Touching frame:" + frametouching);

					if (testing) {
						console.log("End testing:" + anime);
						testing = 0;
						appUpdate();
						picoBeep(1.2, 0.1);
						picoBeep(1.2, 0.1, 0.2);

					// Start to touching frame.
					} else if (frametouching == 0) {
						console.log("Start to touching frame: " + frame + " " + i);
						if (frame != i) {
							frame = i;
							playing = -1; // Reset pixels from buffer.
							animetouchmovey = 0;
							animetouchmoved = 1;
						}

					// Hovering to another frame.
					} else if (frameselecting != i) {
						console.log("Touching another frame: " + frame + " " + i);
						if (frame != i) {
							frame = i;
							playing = -1; // Reset pixels from buffer.
							animetouchmovey = 0;
							animetouchmoved = 1;
						}
					}

					frametouching = 1;
					animetouching = -1;
					pixeltouching = -1;
					colortouching = -1;

					// Touch holding frame.
					picoChar("$", 0, x, y, 0, arrowscale*arrowbuttonscale1);

				// Not touching but selecting frame.
				} else if (frameselecting == i) {

					// Touching pixels to prepare testing.
					if (testing || (pixeltouching > 0 && pixeltouching < 15 && !pixeltouchmoved)) {
						picoChar(arrowbuttonxchar, 0, x, y, arrowbuttonxangle, arrowscale*arrowbuttonscale0);

					} else {
						picoChar(arrowbutton0char, 0, x, y, 0, arrowscale*arrowbuttonscale0);
					}

				// Other frames.
				} else {
					let sprite = buffers[i] ? buffers[i] : [0, 7, 7];
					let animewidth = picoSpriteSize(sprite); // Width of 1 frame block.
					let animescale = (animegrid - animemargin) / animewidth; // Anime scale.
					picoSprite(sprite, 0, x, y, 0, animescale); // Unselecting frames.
				}
			}
		}
	}

	let colorsgrid = colorflag ? 14 : landscape ? 14 : 12; // Grid length of each colors.
	let colorsscale0 = colorflag ? 4 : landscape ? 4 : 3.5; // Scale of colors.
	let colorsscale1 = colorsscale0 / blockwidth * 3.5; // Scale of colors touching.
	let colorsscale2 = colorsscale0 / blockwidth * 3; // Scale of colors selected.

	// Draw colors.
	if (!colorflag) {

		for (let i = 1; i <= depth; i++) {
			let x = colorsposx + (i - (depth+1)/2) * colorsgrid; // Margins for each color.

			// Release touching color.
			if (colortouching >= 0 && picoAction(x, colorsposy, colorsgrid/2, colorsheight/2)) {
				console.log("Release touching color.");
				colortouching = 0;
				if (animeflag) {
					animeflag = 0;
					testing = 0;
					appUpdate(true);
				}
				picoBeep(0, 0.1);
				picoChar(picoCode6Char(coffset+i), -1, x, colorsposy, 0, colorsscale2);

			// Touching color.
			} else if (colortouching >= 0 && picoMotion(x, colorsposy, colorsgrid/2, colorsheight/2)) {
				frametouching = -1;
				animetouching = -1;
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

				// Continue touching color.
				} else {
					console.log("Continue touching color.");
					colorholding++;

					// Enter color edit mode.
					if (colorholding >= 60) {
						console.log("Enter color edit mode.");
						colorflag = 1;
						picoBeep(1.2, 0.1);
						colortouching = -1;
						colorholding = 0;
					}
				}
				picoChar(picoCode6Char(coffset+i), -1, x, colorsposy, 0, colorsscale1);

			} else {

				// Not touching but selecting color.
				if (colorselecting == i) {
					picoChar(picoCode6Char(coffset+i), -1, x, colorsposy, 0, colorsscale2);

				// Other colors.
				} else {
					picoChar("-", i, x, colorsposy, 0, colorsscale0);
				}
			}
		}
	}

	// Draw coloreditor.
	if (colorflag) {
		const compression = 2, maxcompresed = (1 << (8 - compression));

		// Draw buttons and color numbers.
		if (colorselecting) {
			for (let i = 0; i < 3; i++) {
				let x = colorsposx + (i*numbergrids+numberoffset - numberlength/2) * colorsgrid; // Margins for each color number.

				// Increase color number.
				{
					let c = colors[colorselecting * 3 + i];
					let c1 = c < 255 ? incdecbutton1char : incdecbutton0char;
					if (colortouching >= 0 && picoAction(x+incdecbutton1x, colorsposy+incdecbutton1y, numberwidth/2, numberheight/2)) {
						if (c < 255) {
							c = (c + 1) >> compression; // Bit shift for compressed increase.
							c = c + 1 < maxcompresed ? c + 1 : maxcompresed; // Increase.
							c = (c << compression) - 1; // Bit unshift.
							colors[colorselecting * 3 + i] = c;
							picoBeep(1.2, 0.1);
						} else {
							picoBeep(-1.2, 0.1);
						}

						// Draw increase button.
						picoChar(c1, colorselecting, x+incdecbutton1x*2, colorsposy+incdecbutton1y, incdecbutton1angle, incdecbuttonscale1);
					} else if (colortouching >= 0 && picoMotion(x+incdecbutton1x, colorsposy+incdecbutton1y, numberwidth/2, numberheight/2)) {
						// Draw increase button.
						picoChar(c1, colorselecting, x+incdecbutton1x*2, colorsposy+incdecbutton1y, incdecbutton1angle, incdecbuttonscale1);
					} else {
						// Hidden increase button.
						//picoChar(c1, colorselecting, x+incdecbutton1x*2, colorsposy+incdecbutton1y, incdecbutton1angle, incdecbuttonscale0);
					}
				}

				// Decrease color number.
				{
					let c = colors[colorselecting * 3 + i];
					let c2 = c > 0 ? incdecbutton2char : incdecbutton0char;
					if (colortouching >= 0 && picoAction(x+incdecbutton2x, colorsposy+incdecbutton2y, 8, 8)) {
						if (c > 0) {
							c = (c + 1) >> compression; // Bit shift for compressed decrease.
							c = c - 1 > 0 ? c - 1 : 0; // Decrease.
							c = (c << compression) - 1; // Bit unshift.
							c = c > 0 ? c : 0;
							colors[colorselecting * 3 + i] = c;
							picoBeep(1.2, 0.1);
						} else {
							picoBeep(-1.2, 0.1);
						}

						// Draw decrease button.
						picoChar(c2, colorselecting, x+incdecbutton2x*2, colorsposy+incdecbutton2y, incdecbutton2angle, incdecbuttonscale1);
					} else if (colortouching >= 0 && picoMotion(x+incdecbutton2x, colorsposy+incdecbutton2y, numberwidth/2, numberheight/2)) {
						// Draw decrease button.
						picoChar(c2, colorselecting, x+incdecbutton2x*2, colorsposy+incdecbutton2y, incdecbutton2angle, incdecbuttonscale1);
					} else {
						// Hidden decrease button.
						//picoChar(c2, colorselecting, x+incdecbutton2x*2, colorsposy+incdecbutton2y, incdecbutton2angle, incdecbuttonscale0);
					}
				}

				// Convert range 0-255 to 0-99.
				let c99 = picoDiv(colors[colorselecting * 3 + i] * 99, 255);
				let s99 = c99 >= 99 ? "99" : c99 >= 9 ? "" + (c99 + 1) : c99 >= 1 ? "0" + (c99 + 1) : "00";

				// Draw color numbers.
				let l = colorsgrid / numberscale0; // Char leading for each color number.
				picoCharLeading(l, l);
				picoChar(s99, colorselecting, x, colorsposy, 0, numberscale0);
			}
		}
	}

	// Set touching state to avoid touching another area continuously.
	if (picoAction()) {
		console.log("Reset touching state.");
		if (pixeltouching > 0) {
			/*if (animeflag) {
				animeflag = 0;
			}*/
			appUpdate();
		}
		frametouching = 0;
		frameholding = 0;
		pixeltouching = 0;
		pixeltouchmoving = 0;
		pixeltouchmoved = 0;
		colortouching = 0;
		animetouching = 0;
		animeholding = 0;
		animetouchmovey = 0;
		animetouchmoved = 0;
		pixeltouchposx = 0;
		pixeltouchposy = 0;
	}

	// Increment testing count.
	if (testing > 0) {
		testing++;
		if (!picoMod(testing,10)) {
			frame = frame + 1 < anime ? frame + 1 : 0;
			playing = -1; // Reset pixels from buffer.
		}
		picoFlush();
	}

	// Increment playing count.
	playing++;
}
