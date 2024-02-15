picoTitle("Kuku"); // Title.

// Data and settings.
const kcents = [
	     -0.7,-0.5, -0.4,-0.2, 0.0, 0.2, //        0,    1:Mi, 2:Fa, 3:So, 4:La, 5:Ti
	 0.3, 0.5, 0.7,  0.8, 1.0, 1.2, 1.4, //  6:Do, 7:Re, 8:Mi, 9:Fa,10:So,11:La,12:Ti
	 1.5, 1.7, 1.9,  2.0, 2.2, 2.4, 2.6, // 13:Do,14:Re,15:Mi,16:Fa,17:So,18:La,19:Ti, 20:Do
	 2.7];

// Global variables.
var state = ""; // Playing state.
var playing = 0; // Playing count.
var number = 1; // Probrem number.
const maxnumber = 20; // Maximum number for one play.
const levels = [ // Parameters for each level.
	["",0], // Custom level.
	["+",5], ["+",10], ["+",20], // Add/Sub levels.
	["*",5,5], ["*",9,9], ["*",12,12], ["*",9,16], ["*",19,19], // Mul levels.
	["*",19,91], ["*",99,99]]; // Extra levels.
var level = 5; // Level index.
var extra = 0; // Enable extra levels.
const maxextra = 2; // Maximum extra levels.
var seed = 0; // Random seed.

// Label text.
function appLabelText(p0, p1, p2) {
	if (p2 != null) {
		return p0 + p2;
	} else {
		return p0 + p1;
	}
}

// Probrem text.
function appProbremText(p0, p1, p2) {
	if (p2 != null) {
		return (p1 < 10 ? p1 + " " : p1) + p0 + (p2 < 10 ? " " + p2 : p2);
	} else {
		return p0 + p1;
	}
}

// Result text.
function appResultText(t) {
	let f = picoMod(picoDiv(t, 10), 100); // Fractional part.
	let i = picoDiv(t, 1000); // Integer part.
	return "" + i + "." + (f < 10 ? "0" : "") + f;
}

// Probrem and answer.
var probrem1 = 0; // Number to the left.
var probrem2 = 0; // Number to the right.
var operator = "*"; // Probrem type.
var answer = 0; // Answer number.
var correct = 0; // Correct choice of answer.
var choices = [0, 0, 0]; // Choices of answer.
var choose = -1; // Answer you chose.
var angle = 0; // Angle of number.
var scale = 6; // Scale of number.
const square = 54; // Width of base square.
var startTime = 0; // Start time of the problem.
var resultTime = 0; // Result time of the problem.
const clearTime = 60 * 1000; // Clear time of the problem.

// Select button.
async function appSelect(x) {
	if (level <= 0) {
		picoBeep(-1.2, 0.1);
	} else if (x) {

		// Change level.
		let maxlevel = levels.length-1 - maxextra + extra;
		level = picoMod(level-1 + x + maxlevel, maxlevel) + 1;
		picoLabel("select", appLabelText(levels[level][0], levels[level][1], levels[level][2]));
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
	seed = 0;
}

// Action button.
async function appAction() {
	picoShareScreen();
}

// Load.
async function appLoad() {

	// Load query levels.
	let keys = picoKeys();
	for (let k = 0; k < keys.length; k++) {
		let value = picoStrings(k);
		if (value) {
			let numbers = picoNumbers(keys[k]);
			let date = picoDate();
			if (value.match(/x/i)) {
				levels[0][0] = "*"; // Mul probrem.
				levels[0][1] = numbers[0];
				levels[0][2] = numbers[1];
				seed = numbers[2] < date ? numbers[2] : 0;
			} else {
				levels[0][0] = "+"; // Add/Sub probrem.
				levels[0][1] = numbers[0];
				levels[0][2] = null;
				seed = numbers[1] < date ? numbers[1] : 0;
			}
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
	picoChar(probrem, -1, 0,0, 0,8);
	if (seed) {
		picoChar(seed, 0, 0,-75, 0,1);
	}

	// Wait for input.
	if (picoAction()) {

		// Set random seed.
		if (!seed) {
			seed = picoDate();
		}
		picoRandom(0, seed);

		// Start probrem.
		state = "probrem";
		playing = 0;
		startTime = picoTime();
	}
}

// Probrem loop.
async function appProbrem() {

	// Initialize.
	if (playing <= 0) {

		// Add/Sub probrem.
		if (levels[level][0] != "*") {
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
			scale = 6;

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
				scale = 6;

			// Mul probrem (over 100).
			} else {
				scale = 4;
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

		// Mul probrem (over 12x12).
		} else {
			probrem1 = picoRandom(levels[level][1]-10) + 11; // Over 11.
			probrem2 = picoRandom(levels[level][2]-1) + 2;
			operator = "*";
			answer = probrem1 * probrem2;

			// Mul probrem (under 999).
			if (levels[level][1] * levels[level][2] <= 999) {
				scale = 4;

			// Mul probrem (over 1000).
			} else {
				scale = 3;
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
	picoChar("" + number + "/" + maxnumber, 0, 0,-85, 0,2);

	// Draw probrem.
	let probrem = appProbremText(operator, probrem1, probrem2);
	picoChar(probrem, -1, 0,-50, 0,scale);

	// Draw answer.
	for (let i = 0; i < 3; i++) {
		let x = (i-1)*60, y = 35;
		let s = picoMotion(x, y, square/2, square/2) ? 0.8 : 1;

		// Choose answer.
		if (picoAction(x, y, square/2, square/2)) {
			choose = i;
			state = "answer";
			playing = 0;
		}
		picoRect(3, x,y,square,square, angle,s);
		picoChar("" + choices[i], 0, x,y, 0,scale*s);
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
	picoChar("" + number + "/" + maxnumber, 0, 0,-85, 0,2);

	// Draw probrem.
	let probrem = appProbremText(operator, probrem1, probrem2);
	picoChar(probrem, -1, 0,-50, 0,scale);

	// Draw choose answer.
	if (choose != correct) {
		let i = choose;
		let x = (i-1)*60, y = 35;
		picoChar("*", -1, x,y, 0,scale);
	}

	// Draw correct answer.
	let i = correct;
	let x = (i-1)*60, y = 35;
	let s = picoMotion(x, y, square/2, square/2) ? 0.8 : 1;
	if (picoAction(x, y, square/2, square/2)) {

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
	picoRect(0, x,y,square,square, angle,s);
	picoChar("" + choices[i], -1, x,y, 0,scale*s);
}

// Result loop.
async function appResult() {

	// Initialize.
	if (playing <= 0) {

		// Result time.
		resultTime = picoTime() - startTime;
		if (resultTime > 1000000) {
			resultTime = 999999;
		}

		// Enable share button.
		picoLabel("action", "^");

		// Reset playing count.
		playing = 1;
	}

	// Draw probrem title.
	let probrem = appProbremText(levels[level][0], levels[level][1], levels[level][2]);
	picoChar(probrem, -1, 0,-85, 0,2);
	picoChar(seed, 0, 0,-75, 0,1);

	// Draw result.
	let result = appResultText(resultTime);
	picoChar(result, -1, 0,0, 0,8);

	// Wait result.
	if (playing <= 72) {
		picoFlush();
		playing++;

	// Wait for input.
	} else if (picoAction()) {

		// Clear time.
		if (level > 0 && resultTime <= clearTime) {

			// Unlock extra levels.
			let maxlevel = levels.length-1 - maxextra + extra;
			if (level == maxlevel) {
				extra = extra + 1 < maxextra ? extra + 1 : maxextra;
				maxlevel = levels.length-1 - maxextra + extra;
			}

			// Go next level.
			level = level + 1 < maxlevel ? level + 1 : maxlevel;
			picoLabel("select", appProbremText(levels[level][0], levels[level][1]));

			// Play clear sound.
			picoBeep(2.7, 0.1);
			picoBeep(2.7, 0.1, 0.2);
		} else {

			// Play sound.
			picoBeep(1.2, 0.1);
		}

		// Restart.
		state = "";
		playing = 0;
		number = 1;
		seed = 0;
	}
}

// Main.
async function appMain() {
	if (state == "probrem") {
		appProbrem();

	} else if (state == "answer") {
		appAnswer();

	} else if (state == "result") {
		appResult();

	} else {
		appTitle();
	}
}
