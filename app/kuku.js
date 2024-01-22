picoTitle("Kuku"); // Title.

// Data and settings.
var colors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0]; // 5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000

// Global variables.
var playing = 0; // Playing count.
var number = 1;
const numberMax = 20;
var level = 0;
var levels = ["x9", "x12", "x16", "x19", "+0", "+10", "+20"];
var samples = ["9 * 9", "12*12", "16*16", "19*19", "1 + 1", "1 - 1", "9 + 9"];
var state = "";

// Probrem and answer.
var probrem1 = 0;
var probrem2 = 0;
var operator = "*";
var answer = 0;
var angle = 0;
var scale = 24;
var startTime = 0;
var totalTime = 0;

// Select button.
async function appSelect(x) {
	if (x) {
		level = picoMod(level + x + levels.length, levels.length);
		picoLabel("select", levels[level]);
	}

	// Restart.
	state = "";
	playing = -1;
	number = 1;

	picoBeep(1.2, 0.1);
}

// Load.
async function appLoad() {

	// Update select button.
	picoLabel("select", "" + levels[level]);
	picoLabel("minus", "-");
	picoLabel("plus", "+");

	// Load pallete data.
	picoColor(colors);
}

// Menu loop.
async function appMenu() {

	// Initialize.
	if (playing <= 0) {
	}

	await picoClear();

	// Draw probrem sample.
	await picoChar(samples[level], -1, 0,0, 0,8);

	// Wait for input.
	if (picoAction()) {
		state = "probrem";
		playing = 0;
		startTime = picoTime();
	} else {
		
		// Increment playing count.
		playing++;
	}
}

// Probrem loop.
async function appProbrem() {

	// Initialize.
	if (playing <= 0) {
		angle = 0;

		// Add up to 10.
		if (levels[level] == "+0") {
			operator = "+";
			if (picoRandom(2)) {
				probrem1 = picoRandom(4) + 1;
				probrem2 = picoRandom(5 - probrem1) + 1;
			} else {
				probrem1 = picoRandom(9) + 1;
				probrem2 = picoRandom(10 - probrem1) + 1;
			}
			answer = probrem1 + probrem2;
			scale = 24;

		// Add/Sub up to 10.
		} else if (levels[level] == "+10") {
			operator = picoRandom(2) ? "+" : "-";
			if (operator == "+") {
				probrem1 = picoRandom(9) + 1;
				probrem2 = picoRandom(10 - probrem1) + 1;
				answer = probrem1 + probrem2;
			} else {
				probrem1 = picoRandom(10) + 1;
				probrem2 = picoRandom(probrem1) + 1;
				answer = probrem1 - probrem2;
			}
			scale = 24;

		// Add/Sub up to 20.
		} else if (levels[level] == "+20") {
			operator = picoRandom(2) ? "+" : "-";
			if (operator == "+") {
				probrem1 = picoRandom(19) + 1;
				probrem2 = picoRandom(20 - probrem1) + 1;
				answer = probrem1 + probrem2;
			} else {
				probrem1 = picoRandom(20) + 1;
				probrem2 = picoRandom(probrem1) + 1;
				answer = probrem1 - probrem2;
			}
			scale = 24;

		// Mul 11x1 to 12x12.
		} else if (levels[level] == "x12") {
			operator = "*";
			probrem1 = picoRandom(9) + 11;
			probrem2 = picoRandom(12) + 1;
			answer = probrem1 * probrem2;
			scale = 34;

		// Mul 11x1 to 16x16.
		} else if (levels[level] == "x16") {
			operator = "*";
			probrem1 = picoRandom(9) + 11;
			probrem2 = picoRandom(16) + 1;
			answer = probrem1 * probrem2;
			scale = 34;

		// Mul 11x1 to 19x19.
		} else if (levels[level] == "x19") {
			operator = "*";
			probrem1 = picoRandom(9) + 11;
			probrem2 = picoRandom(19) + 1;
			answer = probrem1 * probrem2;
			scale = 34;

		// Mul 1x1 to 9x9.
		} else {
			operator = "*";
			probrem1 = picoRandom(9) + 1;
			probrem2 = picoRandom(9) + 1;
			answer = probrem1 * probrem2;
			scale = 24;
		}

		// Spacer.
		if (probrem1 < 10) {
			probrem1 = "" + probrem1 + " ";
		}
		if (probrem2 < 10) {
			probrem2 = " " + probrem2 + "";
		}

		// Reset playing count.
		playing = 1;
	}

	await picoClear();

	// Draw number.
	await picoChar("" + number + "/" + numberMax, 3, 0,-85, 0,2);

	// Draw probrem.
	await picoChar("" + probrem1 + operator + probrem2, -1, 0,-50, 0,8);

	// Roll and update animation.
	if (playing <= 36) {
		angle = (angle + 20) % 360;
		picoFlush();
	}

	// Draw answer.
	await picoRect([-1,-1,2,2], 3, 0,35, angle,scale);
	await picoChar("?", 0, 0,35, 0,8);

	// Wait for input.
	if (picoAction()) {
		state = "answer";
		playing = 0;
	} else {
		
		// Increment playing count.
		playing++;
	}
}

// Answer loop.
async function appAnswer() {

	// Initialize.
	if (playing <= 0) {

	}

	await picoClear();

	// Draw number.
	await picoChar("" + number + "/" + numberMax, 3, 0,-85, 0,2);

	// Draw probrem.
	await picoChar("" + probrem1 + operator + probrem2, 3, 0,-50, 0,8);

	// Draw answer.
	await picoRect([-1,-1,2,2], 0, 0,35, 0,scale);
	await picoChar("" + answer, -1, 0,35, 0,8);

	// Wait for input.
	if (picoAction()) {
		number++;
		if (number > numberMax) {
			state = "result";
		} else {
			state = "probrem";
		}
		playing = 0;
	} else {
		
		// Increment playing count.
		playing++;
	}
}

// Result loop.
async function appResult() {

	// Initialize.
	if (playing <= 0) {

		// Total time.
		let t = picoTime() - startTime;
		if (t > 1000000) {
			t = 999999;
		}
		let f = picoMod(t, 1000); // Fractional part.
		let i = picoDiv(t, 1000); // Integer part.
		totalTime = "" + i + "." + (f < 10 ? "00" : f < 100 ? "0" : "") + f;
	}

	await picoClear();

	// Draw probrem sample.
	await picoChar(samples[level], -1, 0,-85, 0,2);

	// Draw result.
	await picoChar("" + totalTime, -1, 0,0, 0,6);

	// Wait for input.
	if (picoAction() && playing > 36) {

		// Restart.
		state = "";
		playing = 0;
		number = 1;
	} else {

		// Increment playing count.
		playing++;
	}
}

// Main.
async function appMain() {
	if (state == "probrem") {
		await appProbrem();

	} else if (state == "answer") {
		await appAnswer();

	} else if (state == "result") {
		await appResult();

	} else {
		await appMenu();
	}
}
