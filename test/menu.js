const title = "1234567.890"; // Title.
const dots = [ // Dotted design pixels.
	[0,7,7],
	[0,7,7, 5,3,3],
	[0,7,7, 4,1,5, 4,5,1],
	[0,7,7, 6,3,3, 6,1,5, 6,5,1],
	[0,7,7, 8,1,1, 8,1,5, 8,5,1, 8,5,5],
	[0,7,7, 7,3,3, 7,1,1, 7,1,5, 7,5,1, 7,5,5],
	[0,7,7, 9,1,1, 9,1,3, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
	[0,7,7, 2,3,3, 2,1,1, 2,1,3, 2,1,5, 2,5,1, 2,5,3, 2,5,5],
	[0,7,7, 1,1,1, 1,1,3, 1,3,1, 1,3,5, 1,1,5, 1,5,1, 1,5,3, 1,5,5],
	[0,7,7, 3,3,3, 3,1,1, 3,1,3, 3,3,1, 3,3,5, 3,1,5, 3,5,1, 3,5,3, 3,5,5],
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
var playing = 0; // Playing count.
const mincount = 3; // Minumum item count.
var count = 0; // Item count.
var angle = 0; // Rolling angle.
var scale = 1; // Rolling scale.

// Select button.
async function appSelect() {
	if (count == mincount) {
		picoTitle(title); // Title.
		picoSpriteData(dots[random], -1).then((image) => {
			picoLabel("select", null, image); // Lazy loading.
		});//*/
		count = items.length;
	} else {
		picoTitle(title, true); // No title label.
		picoSpriteData(dots[9], -1).then((image) => {
			picoLabel("select", null, image); // Lazy loading.
		});
		playing = -1; // Reroll.
		count = mincount;
	}
	picoFlush();
}

// Load.
async function appLoad() {
	if (picoDevMode()) {
		items = devitems;
		returl = devreturl;
	}
	for (let i = 0; i < items.length; i++) {
		if (items[i][1]) {
			picoLoad(items[i][1]).then((image) => {
				images[i] = image; // Lazy loading.
				picoFlush();
			});
		}
	}

	appResize(); // Initialize positions.
	appSelect(); // Initialize select button.
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
	//const bgcolor = 1;
	//picoRect(bgcolor, 0,0, 200,200, 0,1);

	// Dice.
	if (count <= mincount) {
		const maximum = 6;
		const dicescale = 8, dotswidth = 32;
		const diceoffset = -36;
		if (picoAction(0,diceoffset, dotswidth,dotswidth)) {
			playing = -1; // Reroll.
		} else if (picoMotion(0,diceoffset, dotswidth,dotswidth)) {
			if (playing <= 60) {
				playing = 0;
			}
			scale = 0.8;
		} else {
			scale = 1;
		}
		if (playing <= 60) {
			angle = picoMod(angle + 20, 360);
			random = picoRandom(maximum) + 1;
			picoFlush(); // Update animation without input.
		} else {
			angle = 0;
		}
		picoSprite(dots[random], 0, 0,diceoffset, angle,dicescale*scale);
	}

	// Logo.
	if (count <= mincount) {
		const logocolor = 5, logooffset = 16, logoscale = 2.5;
		picoChar(title, logocolor, 0,logooffset, 0,logoscale);
	}

	// Menu.
	const itemcolor = 2, itemscale = 2;
	const itemwidth = 38, itemgrid = 42, imagescale = 0.5;
	const itemoffset = count <= mincount ? 52 : 0;
	let xcount = count < 6 ? 3 : !landscape ? 3 : picoSqrt(count - 1) + 1;
	let ycount = picoDiv(count - 1, xcount) + 1;
	for (let i = 0; i < count; i++) {
		let x = (picoMod(i, xcount) - (xcount - 1) / 2) * itemgrid;
		let y = (picoDiv(i, xcount) - (ycount - 1) / 2) * itemgrid + itemoffset;
		let s = picoMotion(x,y, itemwidth/2,itemwidth/2) ? 0.9 : 1;
		if (picoAction(x,y, itemwidth/2,itemwidth/2)) {
			if (items[i][2]) {
				picoSwitchApp(items[i][2], returl);
			}
		}
		picoRect(itemcolor, x,y, itemwidth,itemwidth, 0,s);
		if (images[i]) {
			picoImage(images[i], x,y, 0,imagescale*s)
			picoChar(items[i][0], 2, x,y+itemwidth/2+8, 0,itemscale);
		} else if (items[i][0].length <= 5) {
			picoChar(items[i][0], 0, x,y, 0,itemscale*s);
		} else if (items[i][0].length <= 8) {
			picoText(items[i][0], 0, x,y,4*4,6*2, 0,itemscale*s);
		} else {
			picoText(items[i][0], 0, x,y,4*4,6*3, 0,itemscale*s);
		}
	}

	playing++;
}
