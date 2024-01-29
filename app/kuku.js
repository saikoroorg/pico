picoTitle("Kuku"); // Title.

// Data and settings.
var colors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0]; // 5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000
const kcents = [-1.0,
	-0.9,-0.7,-0.5, -0.4,-0.2, 0.0, 0.2, // 1:Do,2:Re,3:Mi, 4:Fa,5:So,6:La,7:Ti
	 0.3, 0.5, 0.7,  0.8, 1.0, 1.2, 1.4,
	 1.5, 1.7, 1.9,  2.0, 2.2, 2.4];

// Global variables.
var state = ""; // Playing state.
var playing = 0; // Playing count.
var number = 1; // Probrem number.
const maxnumber = 20; // Maximum number for one play.
const levels = [ // Parameters for each level.
	["",0], // Custom level.
	["+",5], ["+",10], ["+",20], // Add/Sub levels.
	["x",5,5], ["x",9,9], ["x",12,12], ["x",16,9], ["x",19,19], // Mul levels.
	["x",90,9], ["x",99,99]]; // Extra levels.
var level = 5; // Level index.
var extra = 0; // Enable extra levels.
const maxextra = 2; // Maximum extra levels.
var seed = 0; // Random seed.

// Probrem text.
function appProbremText(p0, p1, p2) {
	if (p2 != null) {
		return (p1 < 10 ? p1 + " " : p1) + (p0 == "x" ? "*" : p0) + (p2 < 10 ? " " + p2 : p2);
	} else {
		return p0 + p1;
	}
}

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
	if (level <= 0) {
		picoBeep(-1.2, 0.1);
	} else if (x) {
		let maxlevel = levels.length-1 - maxextra + extra;
		level = picoMod(level-1 + x + maxlevel, maxlevel) + 1;
		picoLabel("select", appProbremText(levels[level][0], levels[level][1]));
		picoBeep(1.2, 0.1);

		// Unlock extra levels.
		/*if (x > 0 && level == 1) {
			extra = extra + 1 < maxextra ? extra + 1 : maxextra;
		}*/
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

	// Load query levels.
	let keys = picoKeys();
	for (let k = 0; k < keys.length; k++) {
		let value = picoStrings(k);
		if (value) {
			let numbers = picoNumbers(keys[k]);
			if (value.match(/x/i)) {
				levels[0][0] = "x"; // Mul probrem.
				levels[0][1] = numbers[0];
				levels[0][2] = numbers[1];
				seed = numbers[2];
			} else {
				levels[0][0] = "+"; // Add/Sub probrem.
				levels[0][1] = numbers[0];
				levels[0][2] = null;
				seed = numbers[1];
			}
			picoRandom(0, seed);
			level = 0; // Custom level.
		}
	}

	// Update select button.
	picoLabel("select", appProbremText(levels[level][0], levels[level][1]));
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

	// Draw probrem title.
	let probrem = appProbremText(levels[level][0], levels[level][1], levels[level][2]);
	await picoChar(probrem, -1, 0,0, 0,8);

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

		// Add/Sub probrem.
		if (levels[level][0] != "x") {
			if (levels[level][1] < 10) {
				let n = levels[level][1] > 0 ? levels[level][1] : 1;
				operator = "+";
				if (picoRandom(2)) { // Add probrem (half size).
					answer = picoRandom(n - 2) + 2; // Half size over 2.
				} else { // Add probrem.
					answer = picoRandom(10 - 2) + 2; // Over 2.
				}
				probrem1 = picoRandom(answer - 1) + 1; // Not 0.
				probrem2 = answer - probrem1;
			} else {
				if (picoRandom(2)) { // Sub probrem.
					operator = "-";
					probrem1 = picoRandom(levels[level][1]);
					probrem2 = picoRandom(probrem1 + 1);
					answer = probrem1 - probrem2;
				} else { // Add probrem.
					operator = "+";
					answer = picoRandom(levels[level][1]);
					probrem1 = picoRandom(answer);
					probrem2 = answer - probrem1;
				}
			}

			// Add/Sub probrem (under 99).
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

		// Mul probrem (under 12x12).
		} else if (levels[level][1] <= 12 && levels[level][2] <= 12) {
			probrem1 = picoRandom(levels[level][1]) + 1;
			probrem2 = picoRandom(levels[level][2]) + 1;
			operator = "*";
			answer = probrem1 * probrem2;

			// Mul probrem (under 99).
			if (levels[level][1] * levels[level][2] <= 99) {
				scale = 6, scale2 = 18;

			// Mul probrem (over 100).
			} else {
				scale = 4, scale2 = 17;
			}

			// Generate wrong answer.
			correct = answer >= probrem1*2 ? picoRandom(3) : answer >= probrem1 ? picoRandom(2) : 0;
			if (correct == 0) {
				choices = [answer, probrem1 * (probrem2+1), probrem1 * (probrem2+2)];
			} else if (correct == 1) {
				choices = [probrem1 * (probrem2-1), answer, probrem1 * (probrem2+1)];
			} else if (correct == 2) {
				choices = [probrem1 * (probrem2-2), probrem1 * (probrem2-1), answer];
			}

		// Mul probrem (over 12).
		} else {
			probrem1 = picoRandom(levels[level][1]-10) + 11; // Over 11.
			probrem2 = picoRandom(levels[level][2]-1) + 2;
			operator = "*";
			answer = probrem1 * probrem2;

			// Mul probrem (under 999).
			if (levels[level][1] * levels[level][2] <= 999) {
				scale = 4, scale2 = 17;

			// Mul probrem (over 1000).
			} else {
				scale = 3, scale2 = 17;
			}

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
	await picoChar("" + number + "/" + maxnumber, 0, 0,-85, 0,2);

	// Draw probrem.
	let probrem = appProbremText(operator, probrem1, probrem2);
	await picoChar(probrem, -1, 0,-50, 0,scale);

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
	await picoChar("" + number + "/" + maxnumber, 0, 0,-85, 0,2);

	// Draw probrem.
	let probrem = appProbremText(operator, probrem1, probrem2);
	await picoChar(probrem, -1, 0,-50, 0,scale);

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
			if (number > maxnumber) {
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

		// Unlock extra levels.
		let maxlevel = levels.length-1 - maxextra + extra;
		if (level == maxlevel) {
			extra = extra + 1 < maxextra ? extra + 1 : maxextra;
		}

		// Reset playing count.
		playing = 1;
	}

	// Draw probrem title.
	let probrem = appProbremText(levels[level][0], levels[level][1], levels[level][2]);
	await picoChar(probrem, -1, 0,-85, 0,2);
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
