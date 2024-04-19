const title = "Bank"; // Title.

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
var playerCount = 1; // Player count.
var playerIndex = 0; // Current player index.
var playerCountMin2 = 2; // Player count for hourglass mode.

// Player class.
Player = class {
	constructor() {
		this.score = 0; // Score count for each player.
	}
};
var players = []; // Player.

// Button.
const buttonMax = playerMax + 1; // Maximum button count.
var buttonCount = 2; // Button count.
const buttonWidth = 8, buttonHeight = 6; // Button sizes.
const buttonBallSprite = [0,15,15, 0,1,4,0,12,6, 0,3,2,0,8,10]; // Button ball sprite.
const buttonRectSprite = [0,15,15, 0,2,2,0,10,10]; // Button ball sprite.
const buttonScale = 6; // Button base scale.
const numberScale = 0.5; // Button number scale.
const buttonPosX = 50; // Button position X on landscape mode.
const buttonPosY = 50; // Button position Y on portrait mode.
const buttonGridX = 125; // Button position grid base width for 3+ players.
const buttonGridY = [-15, 15]; // Button position grid base height for 3+ players.

// Button class.
Button = class {
	constructor() {
		this.scale = 1; // Sprite scale.
		this.angle = 0; // Sprite angle.
		this.centerx = 0; // Center position X.
		this.centery = 0; // Center position Y.
		this.width = buttonWidth;
		this.height = buttonHeight;
		this.touching = 0; // Touching count.
	}
};
var buttons = []; // Button.

// Global variables.
var state = ""; // Playing state.
var playing = -1; // Playing count.
var count = 0; // Time count.

var landscape = false; // landscape mode.

// Update buttons.
async function appUpdate() {
	picoLabel("select", "" + playerCount);
	picoLabel("minus", "-");
	picoLabel("plus", "+");
}

// Action button.
async function appAction() {
}

// Select button.
async function appSelect(x) {

	// Change count.
	if (x != 0) {

		// Change count of player.
		if ((x > 0 && playerCount + x <= playerMax) || (x < 0 && playerCount + x > 0)) {
			playerCount = playerCount + x;
			playing = -1; // Restart.
			picoBeep(1.2, 0.1);
			appResize();
			appUpdate();

		} else {
			picoBeep(-1.2, 0.1);
		}

	} else {
		picoBeep(-1.2, 0.1);
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

	// Create buttons.
	for (let k = 0; k < buttonMax; k++) {
		buttons[k] = new Button();
	}

	// Load query params.
	let value = picoString();
	if (value) {
		let numbers = picoNumbers();

		// Simple multi players mode.
		if (value.match(/x/i)) {
			count = numbers[0] < 0 ? 0 : numbers[0] * 60 < countMax ? numbers[0] * 60 : countMax;
			playerCount = numbers[1] <= 0 ? 2 : numbers[1] < playerMax ? numbers[1] : playerMax;

		// Simple 2 players mode.
		} else if (numbers[0] > 0) {
			count = numbers[0] < 0 ? 0 : numbers[0] * 60 < countMax ? numbers[0] * 60 : countMax;
			playerCount = 2;
		}
	}
	playerCountMin2 = playerCount > 2 ? playerCount : 2; // Minimum 2 players for hourglass mode.
	buttonCount = playerCount <= 2 ? playerCount : playerCount + 1; // Add playing button on 3+ players mode.

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
			buttons[j].centerx = buttons[j].centery = 0;
			buttons[j].scale = buttonScale;
			buttons[j].angle = 0;
			buttons[j].width = buttonWidth * buttonScale;
			buttons[j].height = buttonHeight * buttonScale;
		}

	// Reset layouts for 2 screens.
	} else {

		// Set sprite positions and scale for landscape mode.
		if (landscape) {
			screens[0].centerx = buttonPosX;
			screens[1].centerx = -buttonPosX;
			screens[0].centery = screens[1].centery = 0;
			screens[0].width = screens[1].width = screenHeight;
			screens[0].height = screens[1].height = screenWidth;

		// Set sprite positions and scale for portrait mode.
		} else {
			screens[0].centery = buttonPosY;
			screens[1].centery = -buttonPosY;
			screens[0].centerx = screens[1].centerx = 0;
			screens[0].width = screens[1].width = screenWidth;
			screens[0].height = screens[1].height = screenHeight;
		}

		// 2 Screens for 2 players.
		if (playerCount <= 2) {
			for (let j = 0; j < 2; j++) {
				buttons[j].centerx = buttons[j].centery = 0;
				buttons[j].scale = buttonScale;
				buttons[j].angle = 0;
				buttons[j].width = buttonWidth * buttonScale;
				buttons[j].height = buttonHeight * buttonScale;
			}

			// Upsidedown for portrait mode.
			if (!landscape) {
				buttons[1].angle = 180;
			}

		// 2 Screens for 3+ players.
		} else {
			buttons[0].centerx = buttons[0].centery = 0;
			buttons[0].scale = buttonScale;
			buttons[0].angle = 0;

			if (playerCount <= 4) {
				for (let j = 0; j < playerCount; j++) {
					buttons[j + 1].centerx = buttonGridX * (j - playerCount/2 + 0.5) / (playerCount + 1);
					buttons[j + 1].centery = 0;
					buttons[j + 1].scale = buttonScale / playerCount;
					buttons[j + 1].angle = 0;
					buttons[j + 1].width = buttonWidth * buttonScale / playerCount;
					buttons[j + 1].height = buttonHeight * buttonScale / playerCount;
				}
			} else {
				let playerCount2 = picoDiv(playerCount, 2);
				let playerCount1 = playerCount - playerCount2;
				for (let j = 0; j < playerCount1; j++) {
					buttons[j + 1].centerx = buttonGridX * (j - playerCount1/2 + 0.5) / (playerCount1 + 1);
					buttons[j + 1].centery = buttonGridY[0];
					buttons[j + 1].scale = buttonScale / playerCount1;
					buttons[j + 1].angle = 0;
					buttons[j + 1].width = buttonWidth * buttonScale / playerCount1;
					buttons[j + 1].height = buttonHeight * buttonScale / playerCount1;
				}
				for (let j = playerCount1; j < playerCount; j++) {
					buttons[j + 1].centerx = buttonGridX * (j - playerCount2/2 - playerCount1 + 0.5) / (playerCount2 + 1);
					buttons[j + 1].centery = buttonGridY[1];
					buttons[j + 1].scale = buttonScale / playerCount1;
					buttons[j + 1].angle = 0;
					buttons[j + 1].width = buttonWidth * buttonScale / playerCount1;
					buttons[j + 1].height = buttonHeight * buttonScale / playerCount1;
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

		// Reset player states.
		playerIndex = 0;
		for (let j = 0; j < playerCountMin2; j++) {
			players[j].score = 0;
		}

		// Reset playing count.
		playing = 1;
	}

	for (let k = playerCount; k >= 0; k--) {

		// 2 players.
		if (playerCount <= 2) {
			if (k < playerCount) {
				let i = k, s = 1;
				let x = buttons[k].centerx + screens[i].centerx;
				let y = buttons[k].centery + screens[i].centery;
				let w = buttons[k].width, h = buttons[k].height;

				if (picoAction(x,y,w,h) && buttons[k].touching >= 0) {
					players[k].score += 1;
					buttons[k].touching = 0;
					//console.log("action " + k + ":" + buttons[k].touching);
				} else if (picoMotion(x,y,w,h)) {
					if (buttons[k].touching >= 60) {
						players[k].score = 0;
						buttons[k].touching = -1;
						//console.log("hold " + k + ":" + buttons[k].touching);
					} else if (buttons[k].touching >= 0) {
						buttons[k].touching++;
						//console.log("touch " + k + ":" + buttons[k].touching);
						s = 0.8;
					} else {
						//console.log("holding " + k + ":" + buttons[k].touching);
					}
				} else {
					//console.log("none " + k + ":" + buttons[k].touching);
					buttons[k].touching = 0;
				}

				// Draw buttons.
				await picoSprite(buttonRectSprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);

				// Draw number.
				await picoChar(players[k].score, -1, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
			}

		// 3+ players.
		} else {
			if (k > 0) {
				let i = 1, s = 1;
				let x = buttons[k].centerx + screens[i].centerx;
				let y = buttons[k].centery + screens[i].centery;
				let w = buttons[k].width, h = buttons[k].height;

				if (picoAction(x,y,w,h) && buttons[k].touching >= 0) {
					playerIndex = k-1;//picoMod(playerIndex+1, playerCount);
					buttons[k].touching = 0;
					picoFlush();
					//console.log("action " + k + ":" + buttons[k].touching);
				} else if (picoMotion(x,y,w,h)) {
					if (buttons[k].touching >= 60) {
						buttons[k].touching = -1;
						//console.log("hold " + k + ":" + buttons[k].touching);
					} else if (buttons[k].touching >= 0) {
						buttons[k].touching++;
						//console.log("touch " + k + ":" + buttons[k].touching);
						s = 0.8;
					} else {
						//console.log("holding " + k + ":" + buttons[k].touching);
					}
				} else {
					//console.log("none " + k + ":" + buttons[k].touching);
					buttons[k].touching = 0;
				}

				// Draw buttons.
				let r = k-1==playerIndex ? buttonRectSprite : buttonBallSprite;
				await picoSprite(r, -1, x, y, buttons[k].angle, buttons[k].scale*s);

				// Draw number.
				await picoChar(players[k-1].score, -1, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
			} else if (playerIndex >= 0) {
				let i = 0, s = 1;
				let x = buttons[k].centerx + screens[i].centerx;
				let y = buttons[k].centery + screens[i].centery;
				let w = buttons[k].width, h = buttons[k].height;

				if (picoAction(x,y,w,h) && buttons[k].touching >= 0) {
					players[playerIndex].score += 1;
					buttons[k].touching = 0;
					picoFlush();
					//console.log("action " + k + ":" + buttons[k].touching);
				} else if (picoMotion(x,y,w,h)) {
					if (buttons[k].touching >= 60) {
						players[playerIndex].score = 0;
						buttons[k].touching = -1;
						//console.log("hold " + k + ":" + buttons[k].touching);
					} else if (buttons[k].touching >= 0) {
						buttons[k].touching++;
						//console.log("touch " + k + ":" + buttons[k].touching);
						s = 0.8;
					} else {
						//console.log("holding " + k + ":" + buttons[k].touching);
					}
				} else {
					//console.log("none " + k + ":" + buttons[k].touching);
					buttons[k].touching = 0;
				}

				// Draw buttons.
				await picoSprite(buttonRectSprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);

				// Draw number.
				await picoChar(players[playerIndex].score, -1, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
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
