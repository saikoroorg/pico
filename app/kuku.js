picoTitle("Kuku"); // Title.

// Data and settings.
var colors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0]; // 5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000
const kcents = [-1.0,
	-0.9,-0.7,-0.5, -0.4,-0.2, 0.0, 0.2, // 1:Do,2:Re,3:Mi, 4:Fa,5:So,6:La,7:Ti
	 0.3, 0.5, 0.7,  0.8, 1.0, 1.2, 1.4,
	 1.5, 1.7, 1.9,  2.0, 2.2, 2.4];

// Global variables.
var playing = 0; // Playing count.
var number = 1;
const numberMax = 20;
var levels = ["+1", "-2", "+10", "x5", "x9", "x12", "x16", "x19"];
var samples = ["1 + 1", "2 - 2", "10+10", "5 * 5", "9 * 9", "12*12", "16* 9", "19*19"];
var level = 4;
var state = "";
var seed = 0; // Random seed.

// Probrem and answer.
var probrem1 = 0;
var probrem2 = 0;
var operator = "*";
var answer = 0;
var correct = 0;
var choices = [0, 0, 0];
var choose = -1;
var angle = 0;
var scale = 8, scale2 = 24;
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

// Action button.
async function appAction() {
	await picoShareScreen();
}

// Load.
async function appLoad() {

	// Update select button.
	picoLabel("select", "" + levels[level]);
	picoLabel("minus", "-");
	picoLabel("plus", "+");
}

// Title loop.
async function appTitle() {

	// Initialize.
	if (playing <= 0) {

		// Disable share button.
		picoLabel("action");

		// Reset playing count.
		playing = 1;
	}

	// Draw probrem sample.
	await picoChar(samples[level], -1, 0,0, 0,8);

	// Wait for input.
	if (picoAction()) {
		state = "probrem";
		playing = 0;
		startTime = picoTime();
	}
}

// Probrem loop.
async function appProbrem() {

	// Initialize.
	if (playing <= 0) {

		// Random seed.
		seed = picoDate();
		picoRandom(0, seed);

		if (level <= 2) {

			// Add up to 10.
			if (level == 0) {
				operator = "+";
				if (picoRandom(2)) { // Add up to 5.
					answer = picoRandom(3) + 2; // Over 2.
				} else { // Add up to 10.
					answer = picoRandom(8) + 2; // Over 2.
				}
				probrem1 = picoRandom(answer - 1) + 1; // Not 0.
				probrem2 = answer - probrem1;

			// Add/Sub up to 10.
			} else if (level == 1) {
				operator = picoRandom(2) ? "+" : "-";
				if (operator == "+") { // Add up to 10.
					answer = picoRandom(10);
					probrem1 = picoRandom(answer);
					probrem2 = answer - probrem1;
				} else { // Sub up to 10.
					probrem1 = picoRandom(9) + 1; // Not 0.
					probrem2 = picoRandom(probrem1 + 1);
					answer = probrem1 - probrem2;
				}

			// Add/Sub up to 20.
			} else if (level == 2) {
				operator = picoRandom(2) ? "+" : "-";
				if (operator == "+") { // Add up to 20.
					answer = picoRandom(20);
					probrem1 = picoRandom(answer);
					probrem2 = answer - probrem1;
				} else { // Sub up to 20.
					probrem1 = picoRandom(19) + 1; // Not 0.
					probrem2 = picoRandom(probrem1 + 1);
					answer = probrem1 - probrem2;
				}
			}
			scale = 6, scale2 = 18;

			// Generate wrong answer.
			correct = answer > 2 ? picoRandom(3) : answer > 1 ? picoRandom(2) : 0;
			if (correct == 0) {
				choices = [answer, answer+1, answer+2];
			} else if (correct == 1) {
				choices = [answer-1, answer, answer+1];
			} else if (correct == 2) {
				choices = [answer-2, answer-1, answer];
			}

		} else if (level <= 4) {

			// Mul 1x1 to 5x5.
			if (level == 3) {
				probrem1 = picoRandom(5) + 1;
				probrem2 = picoRandom(5) + 1;

			// Mul 1x1 to 9x9.
			} else if (level == 4) {
				probrem1 = picoRandom(9) + 1;
				probrem2 = picoRandom(9) + 1;
			}
			operator = "*";
			answer = probrem1 * probrem2;
			scale = 6, scale2 = 18;

			// Generate wrong answer.
			correct = answer >= probrem1*2 ? picoRandom(3) : answer >= probrem1 ? picoRandom(2) : 0;
			if (correct == 0) {
				choices = [answer, probrem1 * (probrem2+1), probrem1 * (probrem2+2)];
			} else if (correct == 1) {
				choices = [probrem1 * (probrem2-1), answer, probrem1 * (probrem2+1)];
			} else if (correct == 2) {
				choices = [probrem1 * (probrem2-2), probrem1 * (probrem2-1), answer];
			}

		} else {

			// Mul 2x2 to 12x12.
			if (level == 5) {
				probrem1 = picoRandom(11) + 2;
				probrem2 = picoRandom(11) + 2;

			// Mul 11x2 to 16x9.
			} else if (level == 6) {
				probrem1 = picoRandom(6) + 11;
				probrem2 = picoRandom(8) + 2;

			// Mul 11x2 to 19x19.
			} else if (level == 7) {
				probrem1 = picoRandom(9) + 11;
				probrem2 = picoRandom(18) + 2;
			}
			operator = "*";
			answer = probrem1 * probrem2;
			scale = 4, scale2 = 16;

			// Generate wrong answer.
			correct = answer >= 20 ? picoRandom(3) : answer >= 10 ? picoRandom(2) : 0;
			if (correct == 0) {
				choices = [answer, answer+10, answer+20];
			} else if (correct == 1) {
				choices = [answer-10, answer, answer+10];
			} else if (correct == 2) {
				choices = [answer-20, answer-10, answer];
			}
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
		angle = 0;
		choose = -1;
	}

	// Roll and update animation.
	if (playing <= 36) {
		angle = (angle + 20) % 360;
		picoFlush();
		playing++;
	}

	// Draw number.
	await picoChar("" + number + "/" + numberMax, 0, 0,-85, 0,2);

	// Draw probrem.
	await picoChar("" + probrem1 + operator + probrem2, -1, 0,-50, 0,scale);

	// Draw answer.
	for (let i = 0; i < 3; i++) {
		let x = (i-1)*60, y = 35;
		let s = picoMotion(x, y, scale2, scale2) ? 0.8 : 1;

		// Choose answer.
		if (picoAction(x, y, scale2, scale2)) {
			choose = i;
			state = "answer";
			playing = 0;
		}
		await picoRect([-1,-1,2,2], 3, x,y, angle,scale2 * s);
		await picoChar("" + choices[i], 0, x,y, 0,scale * s);
	}
}

// Answer loop.
async function appAnswer() {

	// Initialize.
	if (playing <= 0) {

		// Correct sound.
		if (choose == correct) {
			picoBeep(kcents[number], 0.1);

		// Wrong sound.
		} else {
			picoBeep(-1.2, 0.1);
		}

		// Reset playing count.
		playing = 1;
		angle = 0;
	}

	// Draw number.
	await picoChar("" + number + "/" + numberMax, 0, 0,-85, 0,2);

	// Draw probrem.
	await picoChar("" + probrem1 + operator + probrem2, -1, 0,-50, 0,scale);

	// Draw choose answer.
	if (choose != correct) {
		let i = choose;
		let x = (i-1)*60, y = 35;
		await picoChar("*", -1, x,y, 0,scale);
	}

	// Draw correct answer.
	let i = correct;
	let x = (i-1)*60, y = 35;
	let s = picoMotion(x, y, scale2, scale2) ? 0.8 : 1;
	if (picoAction(x, y, scale2, scale2)) {

		// Go next probrem or show result.
		if (choose == correct) {
			number++;
			if (number > numberMax) {
				state = "result";
			} else {
				state = "probrem";
			}

		// Retry this probrem.
		} else {
			state = "probrem";
		}

		choose = -1;
		playing = 0;
	}
	await picoRect([-1,-1,2,2], 0, x,y, 0,scale2 * s);
	await picoChar("" + choices[i], -1, x,y, 0,scale * s);
}

// Result loop.
async function appResult() {

	// Initialize.
	if (playing <= 0) {

		// Total time.
		let t = picoDiv(picoTime() - startTime, 10);
		if (t > 100000) {
			t = 99999;
		}
		let f = picoMod(t, 100); // Fractional part.
		let i = picoDiv(t, 100); // Integer part.
		totalTime = "" + i + "." + (f < 10 ? "0" : "") + f;

		// Enable share button.
		picoLabel("action", "^");

		// Reset playing count.
		playing = 1;
	}

	// Draw probrem sample.
	await picoChar(samples[level], -1, 0,-85, 0,2);
	await picoChar(seed, 0, 0,-75, 0,1);

	// Draw result.
	await picoChar(totalTime, -1, 0,0, 0,8);

	// Wait result.
	if (playing <= 72) {
		picoFlush();
		playing++;

	// Wait for input.
	} else if (picoAction()) {

		// Restart.
		state = "";
		playing = 0;
		number = 1;
	}
}

// Main.
async function appMain() {
	picoColor(colors);

	if (state == "probrem") {
		await appProbrem();

	} else if (state == "answer") {
		await appAnswer();

	} else if (state == "result") {
		await appResult();

	} else {
		await appTitle();
	}
}
