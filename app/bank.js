const title = "Bank"; // Title.
const countMax = 999 * 60; // Maximum count.
const bonusMax = 99; // Maximum bonus time count.

// Screen.
const screenMax = 2; // Maximum screen count.
const screenWidth = 200, screenHeight = 50; // Screen sizes.

// Screen class.
Screen = class {
	constructor() {
		this.centerx = 0; // Center position X.
		this.centery = 0; // Center position Y.
		this.width = screenWidth;
		this.height = screenHeight;
	}
};
var screens = []; // Screen.

// Player.
const playerMax = 8; // Maximum player count.
var playerCount = 2; // Player count.
var playerIndex = 0; // Current player index.
var playerCountMin2 = 2; // Player count for hourglass mode.

// Player class.
Player = class {
	constructor() {
		this.count = 10 * 60; // Time count for each player.
		this.current = 0; // Current time count.
		this.consumed = 0; // Consumed time count.
		this.starting = false; // Start flag.
		this.number = ""; // Display count.
		this.score = 0; // Score count for each player.
	}
};
var players = []; // Player.

// Clock.
const clockMax = playerMax + 1; // Maximum clock count.
var clockCount = 2; // Clock count.
const clockRects0 = [0,17,17, 0,1,4,0,14,6, 0,3,2,0,10,10]; // Clock base sprite.
const clockRects2 = [0,17,17, 2,1,4,0,14,6, 2,3,2,0,10,10]; // Clock base sprite.
const clockRects3 = [0,17,17, 3,1,4,0,14,6, 3,3,2,0,10,10]; // Clock base sprite.
const clockScale = 6; // Clock base scale.
const numberScale = 0.5; // Clock number scale.
const bonusScale = 0.25; // Clock adiitional/bonus number scale.
const clockPosX = 50; // Clock position X on landscape mode.
const clockPosY = 50; // Clock position Y on portrait mode.
const clockGridX = 125; // Clock position grid base width for 3+ players.
const clockGridY = [-15, 15]; // Clock position grid base height for 3+ players.

// Clock class.
Clock = class {
	constructor() {
		this.scale = 1; // Sprite scale.
		this.angle = 0; // Sprite angle.
		this.centerx = 0; // Center position X.
		this.centery = 0; // Center position Y.
	}
};
var clocks = []; // Clock.

// Global variables.
var state = "waiting"; // Playing state.
var playing = -1; // Playing count.
var count = 10 * 60; // Time count.
var addition = 0; // Additional time count.
var bonus = 0; // Bonus time count.

var counting = false; // Counting up/down flag.
var touching = 0; // Touching count.

var startTime = 0; // Start time.
var landscape = false; // landscape mode.

// Update buttons.
async function appUpdate() {
	if (state == "playing") {
		picoTitle();
		picoLabel("select");
		picoLabel("minus");
		picoLabel("plus");
	} else {
		picoTitle(title);
		if (addition > 0) {
			picoLabel("select", "-" + addition);
		} else if (bonus > 0) {
			picoLabel("select", "+" + bonus);
		} else if (bonus < 0) {
			picoLabel("select", "*");
		} else {
			picoLabel("select", "#");
		}
		picoLabel("minus", "-");
		picoLabel("plus", "+");
	}
}

// Action button.
async function appAction() {
}

// Select button.
async function appSelect(x) {

	// Change count.
	if (x != 0) {

		// Change count of total time.
		if (state == "waiting") {
			if ((x > 0 && count + x <= 999 * 60) || (x < 0 && count + x > 0)) {
				count = picoDiv(count + x * 60, 60) * 60;
				playing = -1; // Restart.
				picoBeep(1.2, 0.1);
				appUpdate();

			} else {
				picoBeep(-1.2, 0.1);
			}

		// Change count of each player time.
		} else if (state == "pausing") {
			let c = players[playerIndex].count > 0 ? players[playerIndex].current : 0;
			if ((x > 0 && c + x <= 999 * 60) || (x < 0 && c + x > 0)) {
				players[playerIndex].count = players[playerIndex].current = picoDiv(c + x * 60, 60) * 60;
				picoBeep(1.2, 0.1);

			} else {
				picoBeep(-1.2, 0.1);
			}
		} else {
			picoBeep(-1.2, 0.1);
		}

	// Change option.
	} else {

		if (state == "waiting" || state == "pausing") {
			if (bonus == 0 && addition < 10) {
				addition = 10; // -10s additional time (Byoyomi)
			} else if (bonus == 0 && addition < 30) {
				addition = 30; // -30s additional time (Byoyomi)
			} else if (bonus == 0) {
				addition = 0;
				bonus = -1; // +?s opposite time (Hourglass)
			} else if (bonus < 5) {
				addition = 0;
				bonus = 5; // +5s bonus time (Fischer)
			} else if (bonus < 10) {
				addition = 0;
				bonus = 10; // +10s bonus time (Fischer)
			} else {
				addition = 0;
				bonus = 0;
			}
			picoBeep(1.2, 0.1);
			appResize();
			appUpdate();
		} else {
			picoBeep(-1.2, 0.1);
		}
	}
}

// Load.
async function appLoad() {
	picoTitle(title);

	// Create screens.
	for (let i = 0; i < screenMax; i++) {
		screens[i] = new Screen();
	}

	// Create players.
	for (let j = 0; j < playerMax; j++) {
		players[j] = new Player();
	}

	// Create clocks.
	for (let k = 0; k < clockMax; k++) {
		clocks[k] = new Clock();
	}

	// Load query params.
	let value = picoString();
	if (value) {
		let numbers = picoNumbers();

		// Additional time mode. (Byoyomi)
		if (value.match(/a/i)) {
			count = numbers[0] < 0 ? 0 : numbers[0] * 60 < countMax ? numbers[0] * 60 : countMax;
			addition = numbers[1] < 0 ? 0 : numbers[1] < bonusMax ? numbers[1] : bonusMax;
			bonus = 0;
			playerCount = numbers[2] <= 0 ? 2 : numbers[2] < playerMax ? numbers[2] : playerMax;

		// Bonus time mode. (Fischer) / Hourglass mode.
		} else if (value.match(/b/i)) {
			count = numbers[0] < 0 ? 0 : numbers[0] * 60 < countMax ? numbers[0] * 60 : countMax;
			addition = 0
			bonus = numbers[1] <= 0 ? -1 : numbers[1] < bonusMax ? numbers[1] : bonusMax;
			playerCount = numbers[2] <= 0 ? 2 : numbers[2] < playerMax ? numbers[2] : playerMax;

		// Simple multi players mode. (Kiremake)
		} else if (value.match(/x/i)) {
			count = numbers[0] < 0 ? 0 : numbers[0] * 60 < countMax ? numbers[0] * 60 : countMax;
			addition = 0
			bonus = 0;
			playerCount = numbers[1] <= 0 ? 2 : numbers[1] < playerMax ? numbers[1] : playerMax;

		// Simple 2 players mode. (Kiremake)
		} else if (numbers[0] > 0) {
			count = numbers[0] < 0 ? 0 : numbers[0] * 60 < countMax ? numbers[0] * 60 : countMax;
			addition = 0
			bonus = 0;
			playerCount = 2;
		}
	}
	playerCountMin2 = playerCount > 2 ? playerCount : 2; // Minimum 2 players for hourglass mode.
	clockCount = playerCount <= 2 ? playerCount : playerCount + 1; // Add playing button on 3+ players mode.

	state = "waiting";
	appResize(); // Initialize positions.
	appUpdate(); // Initialize buttons.
}

// Resize.
async function appResize() {
	landscape = picoWideScreen();

	// Reset layouts for 1 screen.
	if (playerCount <= 1) {
		screens[0].centerx = screens[1].centerx = 0;
		screens[0].centery = screens[1].centery = 0;
		screens[0].width = screens[1].width = screenWidth;
		screens[0].height = screens[1].height = screenHeight;

		// 1 Screen for solo player.
		for (let j = 0; j < 1; j++) {
			clocks[j].centerx = clocks[j].centery = 0;
			clocks[j].scale = clockScale;
			clocks[j].angle = 0;
		}

	// Reset layouts for 2 screens.
	} else {

		// Set sprite positions and scale for landscape mode.
		if (landscape) {
			screens[0].centerx = clockPosX;
			screens[1].centerx = -clockPosX;
			screens[0].centery = screens[1].centery = 0;
			screens[0].width = screens[1].width = screenHeight;
			screens[0].height = screens[1].height = screenWidth;

		// Set sprite positions and scale for portrait mode.
		} else {
			screens[0].centery = clockPosY;
			screens[1].centery = -clockPosY;
			screens[0].centerx = screens[1].centerx = 0;
			screens[0].width = screens[1].width = screenWidth;
			screens[0].height = screens[1].height = screenHeight;
		}

		// 2 Screens for 2 players.
		if (playerCount <= 2) {
			for (let j = 0; j < 2; j++) {
				clocks[j].centerx = clocks[j].centery = 0;
				clocks[j].scale = clockScale;
				clocks[j].angle = 0;
			}

			// Upsidedown for portrait mode.
			if (!landscape) {
				clocks[1].angle = 180;
			}

		// 2 Screens for 3+ players.
		} else {
			clocks[0].centerx = clocks[0].centery = 0;
			clocks[0].scale = clockScale;
			clocks[0].angle = 0;

			if (playerCount <= 4) {
				for (let j = 0; j < playerCount; j++) {
					clocks[j + 1].centerx = clockGridX * (j - playerCount/2 + 0.5) / (playerCount + 1);
					clocks[j + 1].centery = 0;
					clocks[j + 1].scale = clockScale / playerCount;
					clocks[j + 1].angle = 0;
				}
			} else {
				let playerCount2 = picoDiv(playerCount, 2);
				let playerCount1 = playerCount - playerCount2;
				for (let j = 0; j < playerCount1; j++) {
					clocks[j + 1].centerx = clockGridX * (j - playerCount1/2 + 0.5) / (playerCount1 + 1);
					clocks[j + 1].centery = clockGridY[0];
					clocks[j + 1].scale = clockScale / playerCount1;
					clocks[j + 1].angle = 0;
				}
				for (let j = playerCount1; j < playerCount; j++) {
					clocks[j + 1].centerx = clockGridX * (j - playerCount2/2 - playerCount1 + 0.5) / (playerCount2 + 1);
					clocks[j + 1].centery = clockGridY[1];
					clocks[j + 1].scale = clockScale / playerCount1;
					clocks[j + 1].angle = 0;
				}
			}
		}
	}

	picoFlush();
}

// Main.
async function appMain() {

	// Initialize.
	if (playing < 0) {
		console.log("Initialize playing states.");

		// Reset playing states.
		state = "waiting";
		counting = false;

		// Reset player states.
		playerIndex = -1;
		for (let j = 0; j < playerCountMin2; j++) {
			players[j].count = players[j].current = count;
			players[j].consumed = 0;
			players[j].starting = false;
			players[j].score = 0;
		}

		// Start clock.
		startTime = picoTime();

		// Reset playing count.
		playing = 1;
	}

	// Read input.
	let actions = [
		picoAction(screens[0].centerx, screens[0].centery, screens[0].width, screens[0].height),
		picoAction(screens[1].centerx, screens[1].centery, screens[1].width, screens[1].height)];
	let motions = [
		picoMotion(screens[0].centerx, screens[0].centery, screens[0].width, screens[0].height),
		picoMotion(screens[1].centerx, screens[1].centery, screens[1].width, screens[1].height)];

	for (let k = 0; k < clockMax; k++) {
		if (playerCount <= 2) {
			if (k < clockCount) {
				if (actions[k]) {
					players[k].score += 1;
				}

				// Draw wallet.
				let x = clocks[k].centerx + screens[k].centerx;
				let y = clocks[k].centery + screens[k].centery;
				await picoSprite(clockRects0, -1, x, y, clocks[k].angle, clocks[k].scale);

				// Draw number.
				await picoChar(players[k].score, -1, x, y, clocks[k].angle, clocks[k].scale*numberScale);
			}
		}
	}

	// Update animation if playing.
	if (state != "waiting" || playing < 5) {
		picoFlush();
	}

	// Increment playing count.
	playing++;
};
