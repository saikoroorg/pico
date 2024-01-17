picoTitle("Pico"); // Title.

// Data and settings.
const dots = [ // Dotted design pixels.
	[0,7,7, 9,3,3],
	[0,7,7, 9,1,5, 9,5,1],
	[0,7,7, 9,3,3, 9,1,5, 9,5,1],
	[0,7,7, 9,1,1, 9,1,5, 9,5,1, 9,5,5],
	[0,7,7, 9,3,3, 9,1,1, 9,1,5, 9,5,1, 9,5,5],
	[0,7,7, 9,1,1, 9,1,3, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
];
var colors = [255,255,255, 0,0,0]; // Colors.
const kcents = [-1.0,
	-0.9,-0.7,-0.5, -0.4,-0.2, 0.0, 0.2, // 1:Do,2:Re,3:Mi, 4:Fa,5:So,6:La,7:Ti
	 0.3, 0.5, 0.7,  0.8, 1.0, 1.2, 1.4,
	 1.5, 1.7, 1.9,  2.0, 2.2];

// Global variables.
var count = 1; // Count of dice.
var maximum = 6; // Maximum of dice faces.
var playing = 0; // Rolling count.
var result = 0; // Result.

// Action button.
async function appAction() {
}

// Select button.
async function appSelect(x) {
}

// Load.
async function appLoad() {
}

var posx = [], posy = []; // Rolling position.
var angle = 0; // Rolling angle.
var scale = 0; // Rolling scale.
var randoms = []; // Result number.
var number = 0; // Rolled number.

// Main.
async function appMain() {

	// Initialize.
	if (playing <= 0) {

		// Sprite lines and rows.
		const colMax = 5;//picoSqrt(count - 1) + 1;
		let row = picoDiv(count - 1, colMax) + 1; // Row count.
		let col = picoDiv(count - 1, row) + 1; // Column count.
		let colMod = picoMod(count - 1, col) + 1; // Extra column count.

		const size = 200;
		for (let i = 0; i < count; i++) {
			let x = picoMod(i, col) + 1, y = picoDiv(i, col) + 1;
			if (y < row) {
				posx[i] = (x / (col + 1) - 0.5) * size;
				posy[i] = (y / (row + 1) - 0.5) * size;
			} else {
				posx[i] = (x / (colMod + 1) - 0.5) * size;
				posy[i] = (y / (row + 1) - 0.5) * size;
			}
			//console.log("" + x + "," + y + " -> " + posx[i] + "," + posy[i]);
		}

		// Sprite scale.
		let c0 = count < 1 ? 1 : count < col ? count : row >= col ? row : col;
		scale = 20 / (c0 + 1);

		// Rolling dice.
		result = 0;

		// Reset playing count.
		playing = 1;
	}

	// Update rolling dice.
	if (result > 0) {

		// Restart to roll dice.
		if (picoMotion()) {
			result = 0;
			playing = -1;
		}

	} else {

		// Hold to playing dice.
		if (picoMotion()) {
			playing = 1;

		// Timeout and show result.
		} else if (playing > 60) {
			result = picoSeed(); // Set result seed.
			for (let i = 0; i < count; i++) {
				randoms[i] = picoRandom(maximum);
			}
			angle = 0;
			playing = 1;
			number++;

			// Number matched beeps on show result.
			const timing = count <= 2 ? 0.2 : 0.5/count;
			for (let i = 0; i < count; i++) {
				let k = randoms[i] < 10 ? randoms[i] : randoms[i] - 10;
				let j = k >= 0 && k < kcents.length ? k : 0;
				picoBeep(kcents[j], timing/2, timing * i);
			}
		}
	}

	// Update angle.
	if (result <= 0) {
		angle = picoMod(angle + 20, 360);
		for (let i = 0; i < count; i++) {
			randoms[i] = picoMod(picoTime(), maximum);
		}
	}

	// Clear screen.
	picoClear();

	// Draw number sprite.
	let n = result <= 0 ? number : number - 1;
	picoChar(n, 0, 0, -80);

	let s = playing < 5 ? scale * (0.8 + 0.04 * playing) : scale;

	picoColor(colors);
	for (let i = 0; i < count; i++) {
		picoSprite(dots[randoms[i]], 0, posx[i], posy[i], angle, s);
	}

	// Update animation if rolling.
	if (result == 0 || playing < 5) {
		picoFlush();
	}

	// Increment playing count.
	playing++;
};
