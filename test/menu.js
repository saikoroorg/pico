const title = "1234567.890"; // Title.
const dots = [ // Dotted design pixels.
	[0,7,7, 3,3,3, 3,1,1, 3,1,3, 3,3,1, 3,3,5, 3,1,5, 3,5,1, 3,5,3, 3,5,5],
	[0,7,7, 0,0,0,0,6,6, 9,3,3],
	[0,7,7, 0,0,0,0,6,6, 9,1,5, 9,5,1],
	[0,7,7, 0,0,0,0,6,6, 9,3,3, 9,1,5, 9,5,1],
	[0,7,7, 0,0,0,0,6,6, 9,1,1, 9,1,5, 9,5,1, 9,5,5],
	[0,7,7, 0,0,0,0,6,6, 9,3,3, 9,1,1, 9,1,5, 9,5,1, 9,5,5],
	[0,7,7, 0,0,0,0,6,6, 9,1,1, 9,1,3, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
	[0,7,7, 0,0,0,0,6,6, 9,3,3, 9,1,1, 9,1,3, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
	[0,7,7, 0,0,0,0,6,6, 9,1,1, 9,1,3, 9,3,1, 9,3,5, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
	[0,7,7, 0,0,0,0,6,6, 9,3,3, 9,1,1, 9,1,3, 9,3,1, 9,3,5, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
];
const devitems = [ // Menu items for dev.
	["dice", "app/dice.svg", "app/dice.js"],
	["clock", "app/clock.svg", "app/clock.js"],
	["bank", "app/bank.svg", "app/bank.js"],
	["kuku", "app/kuku.svg", "app/kuku.js"],
	["chess", "app/chess.svg", "app/chess.js"],
	["shogi", "app/shogi.svg", "app/shogi.js"],
//*/
	["voxel", "app/voxel.svg", "app/voxel.js"],
	["bros", "app/bros.svg", "app/bros.js"],
	["edit", "app/edit.svg", "app/edit.js"],
	["text", "test/text.svg", "test/text.js"],
	["hex", "test/hex.svg", "test/hex.js"],
	["demo", "test/demo.svg", "test/demo.js"],
//*/
];
const devreturl = null; // Return url for dev.
var items = [ // Menu items.
	["dice", "dice/icon.svg", "dice/"],
	["clock", "clock/icon.svg", "clock/"],
	["bank", "bank/icon.svg", "bank/"],
	["kuku", "kuku/icon.svg", "kuku/"],
	["chess", "chess/icon.svg", "chess/"],
	["shogi", "shogi/icon.svg", "shogi/"],
];
var returl = ".."; // Return url.
var images = []; // Menu images.
var state = "demo"; // Playing state.
var playing = 0; // Playing count.
var index = 0; // Sprite index.
var angle = 0; // Rolling angle.
var scale = 1; // Rolling scale.

// Update buttons.
async function appUpdate() {
	if (state != "demo") {
		picoTitle(title, true); // No label.
		picoSpriteData(dots[index], -1).then((image) => {
			picoLabel("action", null, image); // Lazy loading.
		});
	} else {
		picoTitle(title, true, true); // No label and header.
		picoLabel("action", null);
	}
	picoFlush();
}

// Action button.
async function appAction() {
	if (state != "demo") {
		state = "demo";
		playing = -1; // Reroll.
	} else {
		state = "menu";
		playing = 0;
	}
	appUpdate(); // Update buttons.
}

// Load.
async function appLoad() {
	if (picoDevMode()) {
		items = devitems;
		returl = devreturl;
	}

	// Load images.
	for (let i = 0; i < items.length; i++) {
		if (items[i][1]) {
			picoLoad(items[i][1]).then((image) => {
				images[i] = image; // Lazy loading.
				picoFlush();
			});
		}
	}

	// Skip demo on continuous start.
	let keys = picoKeys();
	if (keys.length > 0) {
		state = "menu";
	}

	appResize(); // Initialize positions.
	appUpdate(); // Initialize buttons.
}

var landscape = false; // landscape mode.

// Resize.
async function appResize() {
	landscape = picoWideScreen();
	picoFlush();
}

// Main.
async function appMain() {

	// Bg.
	const bgcolor = 1, bgscale = 1;
	picoRect(bgcolor, 0,0, landscape?200:140,landscape?140:200, 0,bgscale);

	// Dice.
	if (state == "demo") {
		const maximum = 6, dicescale = 8, diceoffset = -12;
		if (playing > 60 && picoAction()) {
			state = "menu";
			//playing = -1; // Reroll.
			appUpdate(); // Show menu.
			return;
		} else if (picoMotion()) {
			if (playing <= 60) {
				playing = 0;
			}
			scale = 0.8;
		} else {
			scale = 1;
		}
		if (playing <= 60) {
			angle = picoMod(angle + 20, 360);
			index = picoRandom(maximum) + 1;
			picoFlush(); // Update animation without input.
		} else {
			angle = 0;
		}
		picoSprite(dots[index], 0, 0,diceoffset, angle,dicescale*scale);
	}

	// Logo.
	if (state == "demo") {
		const logocolor = 5, logoscale = 2.5, logooffset = 38;
		picoChar(title, logocolor, 0,logooffset, 0,logoscale);
	}

	// Menu.
	if (state == "menu") {
		// 300(Image size) * 0.4(Image scale) / 4(Pixel ratio) = 30(Pixel size)
		const itemcolor = 2, itemscale = 1.5, imagescale = 0.4;
		const itemwidth = 30, itemvgrid = 44, itemhgrid = 44;
		const itemoffset = -4, textoffset = 16;
		let xcount = items.length < 6 ? 3 : !landscape ? 3 : picoSqrt(items.length - 1) + 1;
		let ycount = picoDiv(items.length - 1, xcount) + 1;
		for (let i = 0; i < items.length; i++) {
			let x = (picoMod(i, xcount) - (xcount - 1) / 2) * itemvgrid;
			let y = (picoDiv(i, xcount) - (ycount - 1) / 2) * itemhgrid;
			let s = picoMotion(x,y, itemwidth/2,itemwidth/2) ? 0.9 : 1;
			if (picoAction(x,y, itemwidth/2,itemwidth/2)) {
				if (items[i][2]) {
					picoSwitchApp(items[i][2], returl);
				}
			}
			picoRect(itemcolor, x,y+itemoffset, itemwidth,itemwidth, 0,s);
			if (images[i]) {
				picoImage(images[i], x,y+itemoffset, 0,imagescale*s)
				picoChar(items[i][0], 2, x,y+textoffset, 0,itemscale);
			} else {
				if (items[i][0].length <= 5) {
					picoChar(items[i][0], 0, x,y+textoffset, 0,itemscale*s);
				} else if (items[i][0].length <= 8) {
					picoText(items[i][0], 0, x,y+textoffset,4*4,6*2, 0,itemscale*s);
				} else {
					picoText(items[i][0], 0, x,y+textoffset,4*4,6*3, 0,itemscale*s);
				}
			}
		}
	}

	playing++;
}
