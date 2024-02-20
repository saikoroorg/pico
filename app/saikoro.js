picoTitle("Saikoro.org"); // Title.

// Data and settings.
const dots = [ // Dotted design pixels.
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
const items0 = [ // Menu items for dev.
	["dice", "app/dice.svg", null, "app/dice.js"],
	["clock", "app/clock.svg", null, "app/clock.js"],
	["kuku", "app/kuku.svg", null, "app/kuku.js"],
	["bros", "app/bros.svg", null, "app/bros.js"],
	["edit", "app/edit.svg", null, "app/edit.js"],
	["demo", "app/demo.svg", null, "app/demo.js"],
];
var items = [ // Menu items for web.
	["dice", "dice/icon.svg", "dice/"],
	["clock", "clock/icon.svg", "clock/"],
	["kuku", "kuku/icon.svg", "kuku/"],
];
var images = []; // Menu images.

// Global variables.
var playing = 0;
var angle = 0;
var scale = 1;

// Load.
async function appLoad() {
	if (pico.app.ver < 0) {
		items = items0;
	}
	for (let i = 0; i < items.length; i++) {
		if (items[i][1]) {
			picoLoad(items[i][1]).then((result) => {
				images[i] = result; // Lazy loading.
				picoFlush();
			});
		}
	}
}

// Main.
async function appMain() {

	// Dice.
	const x = 0, rect = 8, maximum = 6;
	let y = items.length > 3 ? -55 : -40;
	if (picoMotion(x,y, rect*4,rect*4)) {
		if (playing <= 60) {
			playing = 0;
		}
		scale = 0.8;
	} else {
		scale = 1;
	}
	if (playing <= 60) {
		angle = picoMod(angle + 20, 360);
		random = picoRandom(maximum);
		picoFlush(); // Update animation without input.
	} else {
		angle = 0;
		if (picoAction(x,y, rect*4,rect*4)) {
			playing = -1; // Reroll.
		}
	}
	picoSprite(dots[random], 0, x,y, angle,rect*scale);

	// Menu.
	const square = 42, title0 = 2, title1 = 2, image0 = 0.5, grid = 50, offset = 36;
	let column = picoSqrt(items.length - 1) + 1;
	column = column >= 3 ? column : 3;
	let row = picoDiv(items.length - 1, column) + 1;
	for (let i = 0; i < items.length; i++) {
		let x = (picoMod(i, column) - (column - 1) / 2) * grid;
		let y = (picoDiv(i, column) - (row - 1) / 2) * grid + offset;
		let s = picoMotion(x,y, square/2,square/2) ? 0.9 : 1;
		if (picoAction(x,y, square/2,square/2)) {
			if (items[i][2]) { // Jump to url.
				picoResetParams();
				if (pico.app.ver > 0) {
					picoSetStrings(pico.app.path, "u");
				}
				picoReload(items[i][2]);
			} else if (items[i][3]) { // Switch script.
				picoResetParams();
				picoSwitch(items[i][3], false);
			}
		}
		picoRect(2, x,y, square,square, 0,s);
		if (images[i]) {
			picoImage(images[i], x,y, 0,image0*s)
			picoChar(items[i][0], 2, x,y+square/2+8, 0,title0);
		} else if (items[i][0].length <= 5) {
			picoChar(items[i][0], 0, x,y, 0,title1*s);
		} else if (items[i][0].length <= 8) {
			picoText(items[i][0], 0, x,y,4*4,6*2, 0,title1*s);
		} else {
			picoText(items[i][0], 0, x,y,4*4,6*3, 0,title1*s);
		}
	}

	playing++;
}
