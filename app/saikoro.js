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
const path = "../", file = "/index.html";
const labels = ["dice", "clock", "kuku"];

// Global variables.
var state = "";
var playing = 0;
var angle = 0;
var scale = 1;

// Select button.
async function appSelect(x) {
	state = !state ? "menu" : "";
	playing = 0;
	picoFlush();
}

// Load.
async function appLoad() {
	let data = await picoSpriteData(dots[5]);
	picoLabel("select", null, data);
}

// Menu.
async function appMenu() {
	const square = 42, number = 2, grid = 45;
	let column = picoSqrt(labels.length - 1) + 1;
	column = column >= 3 ? column : 3;
	let row = picoDiv(labels.length - 1, column) + 1;
	for (let i = 0; i < labels.length; i++) {
		let x = (picoMod(i, column) - (column - 1) / 2) * grid;
		let y = (picoDiv(i, column) - (row - 1) / 2) * grid;
		let s = picoMotion(x,y, square/2, square/2) ? 0.8 : 1;
		if (picoAction(x,y, square/2, square/2)) {
			picoResetParams();
			picoReload(path + labels[i] + file);
		}
		picoRect(3, x,y, square,square, 0,s);
		picoChar(labels[i], 0, x,y, 0,number*s);
	}
}

// Title.
async function appTitle() {
	const square = 42, rect = 12, maximum = 6;
	if (picoMotion()) {
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
		if (picoAction()) {
			state = "menu";
		}
	}
	picoSprite(dots[random], 0, 0,0, angle,rect*scale);
	playing++;
}

// Main.
async function appMain() {
	if (state == "menu") {
		appMenu();
	} else {
		appTitle();
	}
}
