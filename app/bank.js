const title = "Bank"; // Title.

// Player.
const playerMax = 8; // Maximum player count.
var playerCount = 2; // Player count.
var playerIndex = 0; // Current player index.

// Player class.
Player = class {
	constructor() {
		this.score = 0; // Score count for each player.
	}
};
var players = []; // Player.

// Button.
const buttonMax = playerMax + 1; // Maximum button count.
const buttonWidth = 8, buttonHeight = 6; // Button sizes.
const centerButton1Sprite = [0,19,19, 0,3,6,0,12,6, 0,5,4,0,8,10]; // Cneter button sprite for solo/3+ players.
const centerButton2Sprite = [0,19,19, 0,3,6,0,12,6, 0,5,4,0,8,10, 1,7,12,0,4,0]; // Cneter button sprite for 2 players.
const centerButtonColor = 2; // Cneter number color.
const centerButtonScale = 4; // Cneter button scale.
const playerButton1Sprite = [0,19,19, 4,3,6,0,12,6, 4,5,4,0,8,8]; // Player button sprite for solo player.
const playerButton2Sprite = [0,19,19, 4,3,6,0,12,6, 4,5,4,0,8,8]; // Player button sprite for 2 players.
const playerButton3Sprite = [0,19,19, 4,3,6,0,12,6, 4,5,4,0,8,8, 4,7,1,0,4,0]; // Player button sprite for 3+ players.
const playerButtonColor = 0; // Player button number color.
const playerButtonScale = 12; // Player button base scale.
const playerButtonScaleL = 16; // Player button base scale on landscape mode.
const numberScale = 0.5; // Player button number scale.
const buttonPos = 48; // Player button position for solo player.
const buttonPosY1 = 64; // Player button position Y on portrait mode.
const buttonPosY2 = 80; // Player button position Y on portrait mode.
const buttonPosLX = 48; // Player button position X on landscape mode.
const buttonPosLY0 = 32; // Cneter button position Y on landscape mode.
const buttonPosLY1 = 32; // Player button position Y on landscape mode.
const buttonPosLY2 = 48; // Player button position Y on landscape mode.
const buttonGridX = 128; // Player button position grid base width for 3+ players.
const buttonGridLX = 192; // Player button position grid base width for 3+ players on landscape mode.
const buttonGridY = [-15, 15]; // Player button position grid base height for 3+ players.
var buttonCount = 3; // Player button count.

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
		this.score = 0; // Score count for each player.
		this.scoreplus = 0; // Score additional count.
	}
};
var buttons = []; // Button.

// Global variables.
var state = ""; // Playing state.
var playing = -1; // Playing count.
var score = 0; // Initial score.
const scoreMax = 9999; // Maximum score.

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
		if ((x > 0 && playerCount + x <= playerMax) || (x < 0 && playerCount + x >= 0)) {
			playerCount = playerCount + x;
			//playerIndex = buttons[0].score > 0 ? picoMod(buttons[0].score, playerCount) + 1 : 0;
			buttonCount = playerCount + 1; // Add playing button on 3+ players mode.
			playing = -1; // Restart.
			picoBeep(1.2, 0.1);
			appResize();
			appUpdate();

		} else {
			picoBeep(-1.2, 0.1);
		}

	} else {
		playing = -1; // Restart.
		picoBeep(1.2, 0.1);
	}
}

// Load.
async function appLoad() {
	picoTitle(title);

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

		// Multi players mode.
		if (value.match(/x/i)) {
			score = numbers[0] < 0 ? 0 : numbers[0] < scoreMax ? numbers[0] : scoreMax;
			playerCount = numbers[1] <= 0 ? 2 : numbers[1] < playerMax ? numbers[1] : playerMax;

		// 2 players mode.
		} else if (numbers[0] > 0) {
			score = numbers[0] < 0 ? 0 : numbers[0] < scoreMax ? numbers[0] : scoreMax;
			playerCount = 2;
		}
	}
	buttonCount = playerCount + 1;

	state = "";
	appResize(); // Initialize positions.
	appUpdate(); // Initialize buttons.
}

// Resize.
async function appResize() {
	landscape = picoWideScreen();

	// Reset layouts on landscape mode.
	if (landscape) {
		buttons[0].centerx = 0;
		buttons[0].centery = -buttonPosLY0;
		buttons[0].scale = centerButtonScale;
		buttons[0].angle = 0;
		buttons[0].width = buttonWidth * centerButtonScale;
		buttons[0].height = buttonHeight * centerButtonScale;

		for (let j = 1; j <= playerCount; j++) {
			buttons[j].centerx = buttonGridLX * (j-1 - (playerCount-1)/2) / playerCount;
			buttons[j].centery = j > 1 && j < playerCount ? buttonPosLY2 : buttonPosLY1;
			buttons[j].scale = playerButtonScaleL / (playerCount+1);
			buttons[j].angle = 0;
			buttons[j].width = buttonWidth * playerButtonScaleL / (playerCount+1);
			buttons[j].height = buttonHeight * playerButtonScaleL / (playerCount+1);
		}

	// Reset layouts on portrait mode.
	} else {
		buttons[0].centerx = 0;
		buttons[0].centery = 0;
		buttons[0].scale = centerButtonScale;
		buttons[0].angle = 0;
		buttons[0].width = buttonWidth * centerButtonScale;
		buttons[0].height = buttonHeight * centerButtonScale;

		let playerCount2 = picoDiv(playerCount+1, 2);
		for (let j = 1; j <= playerCount2; j++) {
			buttons[j].centerx = buttonGridX * (j-1 - (playerCount2-1)/2) / playerCount2;
			buttons[j].centery = j > 1 && j < playerCount2 ? buttonPosY2 : buttonPosY1;
			buttons[j].scale = playerButtonScale / (playerCount2+1);
			buttons[j].angle = 0;
			buttons[j].width = buttonWidth * playerButtonScale / (playerCount2+1);
			buttons[j].height = buttonHeight * playerButtonScale / (playerCount2+1);
		}
		let playerCount1 = playerCount - playerCount2;
		for (let j = playerCount2+1; j <= playerCount; j++) {
			buttons[j].centerx = buttonGridX * (playerCount-j - (playerCount1-1)/2) / playerCount1;
			buttons[j].centery = j > playerCount2+1 && j < playerCount ? -buttonPosY2 : -buttonPosY1;
			buttons[j].scale = playerButtonScale / (playerCount2+1);
			buttons[j].angle = 180; // Upsidedown for portrait mode.
			buttons[j].width = buttonWidth * playerButtonScale / (playerCount2+1);
			buttons[j].height = buttonHeight * playerButtonScale / (playerCount2+1);
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
		state = "";

		for (let k = 0; k < playerCount; k++) {
			players[k].score = score;
		}

		buttons[0].score = 0;
		for (let k = 1; k < buttonCount; k++) {
			buttons[k].score = score;
		}

		// Reset playing count.
		playing = 1;
	}

	for (let k = 0; k < buttonCount; k++) {
		let s = 1;
		let x = buttons[k].centerx, y = buttons[k].centery;
		let w = buttons[k].width, h = buttons[k].height;

		// Score++.
		if (buttons[k].touching >= 0 && picoAction(x,y,w,h)) {
			buttons[k].score = buttons[k].score+1 < scoreMax ? buttons[k].score+1 : scoreMax;
			buttons[k].scoreplus = 0;
			buttons[k].touching = 0;
			if (k == 0) {
				playerIndex = playerIndex + 1 <= playerCount ? playerIndex + 1 : 1;
				//playerIndex = buttons[k].score > 0 ? picoMod(buttons[k].score, playerCount) + 1 : 0;
			}

		// Score--.
		} else if (buttons[k].touching > 0 && picoAction()) {
			buttons[k].score = buttons[k].score-1 > -scoreMax ? buttons[k].score-1 : -scoreMax;
			buttons[k].scoreplus = 0;
			buttons[k].touching = 0;
			if (k == 0) {
				if (buttons[k].score <= 0) {
					buttons[k].score = 0;
					playerIndex = 0;
				} else {
					playerIndex = playerIndex - 1 >= 1 ? playerIndex - 1 : playerCount;
					//playerIndex = buttons[k].score > 0 ? picoMod(buttons[k].score, playerCount) + 1 : 0;
				}
			}

		// Holding.
		} else if (picoMotion(x,y,w,h)) {
			buttons[k].scoreplus = 0;
			if (buttons[k].touching >= 60) {
				buttons[k].score = 0;
				buttons[k].touching = -1;
				if (k == 0) {
					playerIndex = 0;
				}
			} else if (buttons[k].touching >= 0) {
				buttons[k].touching++;
				s = 0.8;
			}

		// Swiping.
		} else if (buttons[k].touching > 0 && picoMotion()) {
			buttons[k].scoreplus = -1;
			if (k == 0) {
				if (buttons[k].score <= 0) {
					buttons[k].scoreplus = 0;
				}
			}
			s = 0.6;

		// Do nothing.
		} else {
			buttons[k].scoreplus = 0;
			buttons[k].touching = 0;
		}

		// Draw buttons.
		if (k == 0) {
			let a = buttons[k].angle + (playerCount >= 2 && !landscape && playerIndex > picoDiv(playerCount+1,2) ? 180 : 0);
			let sprite = buttons[k].score > 0 ? centerButton2Sprite : centerButton1Sprite;
			let number = buttons[k].score;
			if (buttons[k].scoreplus) {
				number = "  " + number + buttons[k].scoreplus;
			}
			await picoSprite(sprite, -1, x, y, a, buttons[k].scale*s);
			await picoChar(number, centerButtonColor, x, y, a, buttons[k].scale*numberScale*s);
		} else {
			let sprite = k == playerIndex ? (playerCount <= 2 ? playerButton2Sprite : playerButton3Sprite) : playerButton1Sprite;
			let number = buttons[k].score > 0 ? "+" + buttons[k].score : buttons[k].score;
			if (buttons[k].scoreplus) {
				number = "  " + number + buttons[k].scoreplus;
			}
			await picoSprite(sprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);
			await picoChar(number, playerButtonColor, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
		}
	}

	// Increment playing count.
	playing++;
};
