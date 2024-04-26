const title = "Bank"; // Title.

// Player.
const playerMax = 8; // Maximum player count.
var playerCount = 2; // Player count.
var playerIndex = 0; // Current player index.
var touchIndex = -1; // Touching player index.
var touchCount = 0; // Touching count.
var touchState = ""; // Touch holding state.

// Score.
const scoreMax = 9999; // Maximum score.
var scoreCount = 0; // Initial score.

// Button.
const buttonMax = playerMax + 1; // Maximum button count.
const buttonWidth = 8, buttonHeight = 6; // Button touchable sizes.
const dealerSprite0 = [0,19,19, 0,3,6,0,12,6, 0,5,4,0,8,10]; // Dealer sprite.
const dealerSprite1 = [0,19,19, 0,3,6,0,12,6, 0,5,4,0,8,10, 1,7,12,0,4,0]; // Dealer with cursor sprite.
const dealerColor = 2; // Cneter number color.
const dealerScale = 4; // Dealer scale.
const dealerScaleL = 4; // Dealer scale on landscape mode.
const playerSprite0 = [0,19,19, 4,3,6,0,12,6, 4,5,4,0,8,8]; // Player sprite.
const playerSprite1 = [0,19,19, 4,3,6,0,12,6, 4,5,4,0,8,8, 4,7,1,0,4,0]; // Player with cursor sprite.
const playerColor = 0; // Player number color.
const playerScale = 10; // Player base scale.
const playerScaleL = 8; // Player base scale on landscape mode.
const numberScale = 0.5; // Button number scale.
const playerPosY1 = 64, playerPosY2 = 80; // Player position Y on portrait mode.
const playerPosLX = 48; // Player position X on landscape mode.
const dealerPosLY = 32; // Dealer position Y on landscape mode.
const playerPosLY1 = 24, playerPosLY2 = 32; // Player position Y on landscape mode.
const playerGridX = 128; // Player position grid base width.
const playerGridLX = 192; // Player position grid base width on landscape mode.
var buttonCount = 3; // Player count.

// Button class.
Button = class {
	constructor() {
		this.scale = 1; // Sprite scale.
		this.angle = 0; // Sprite angle.
		this.posx = 0; // Sprite position X.
		this.posy = 0; // Sprite position Y.
		this.width = buttonWidth; // Button touchable width.
		this.height = buttonHeight; // Button touchable height.
		this.score = 0; // Score count for each player.
	}
};
var buttons = []; // Button.

// Global variables.
var state = ""; // Playing state.
var playing = -1; // Playing count.

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
			playerCount = playerCount + x
			// Change count but do not adjust index. Therefore, the index may deviate from the original number.
			//playerIndex = buttons[0].score > 0 ? picoMod(buttons[0].score, playerCount) + 1 : 0;
			buttonCount = playerCount + 1;
			//playing = -1; // Restart.
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
			scoreCount = numbers[0] < 0 ? 0 : numbers[0] < scoreMax ? numbers[0] : scoreMax;
			playerCount = numbers[1] <= 0 ? 2 : numbers[1] < playerMax ? numbers[1] : playerMax;

		// 2 players mode.
		} else if (numbers[0] > 0) {
			scoreCount = numbers[0] < 0 ? 0 : numbers[0] < scoreMax ? numbers[0] : scoreMax;
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
	let playerCount2 = picoDiv(playerCount+1, 2);

	// Reset layouts on landscape mode.
	if (landscape) {

		// Center button.
		buttons[0].posx = 0;
		buttons[0].posy = -dealerPosLY;
		buttons[0].scale = dealerScaleL;
		buttons[0].angle = 0;
		buttons[0].width = buttonWidth * dealerScale;
		buttons[0].height = buttonHeight * dealerScale;

		// Player.
		for (let j = 1; j <= playerCount; j++) {
			buttons[j].posx = playerGridLX * (j-1 - (playerCount-1)/2) / playerCount;
			buttons[j].posy = playerCount <= 2 || (j > 1 && j < playerCount) ? playerPosLY2 : playerPosLY1;
			buttons[j].scale = playerScaleL / (playerCount2+1);
			buttons[j].angle = 0;
			buttons[j].width = buttonWidth * playerScaleL / (playerCount2+1);
			buttons[j].height = buttonHeight * playerScaleL / (playerCount2+1);
		}

	// Reset layouts on portrait mode.
	} else {

		// Center button.
		buttons[0].posx = 0;
		buttons[0].posy = 0;
		buttons[0].scale = dealerScale;
		buttons[0].angle = 0;
		buttons[0].width = buttonWidth * dealerScale;
		buttons[0].height = buttonHeight * dealerScale;

		// Lower player buttons.
		for (let j = 1; j <= playerCount2; j++) {
			buttons[j].posx = playerGridX * (j-1 - (playerCount2-1)/2) / playerCount2;
			buttons[j].posy = j > 1 && j < playerCount2 ? playerPosY2 : playerPosY1;
			buttons[j].scale = playerScale / (playerCount2+1);
			buttons[j].angle = 0;
			buttons[j].width = buttonWidth * playerScale / (playerCount2+1);
			buttons[j].height = buttonHeight * playerScale / (playerCount2+1);
		}

		// Upper player buttons.
		let playerCount1 = playerCount - playerCount2;
		for (let j = playerCount2+1; j <= playerCount; j++) {
			buttons[j].posx = playerGridX * (playerCount-j - (playerCount1-1)/2) / playerCount1;
			buttons[j].posy = j > playerCount2+1 && j < playerCount ? -playerPosY2 : -playerPosY1;
			buttons[j].scale = playerScale / (playerCount2+1);
			buttons[j].angle = 180; // Upsidedown on upper players for portrait mode.
			buttons[j].width = buttonWidth * playerScale / (playerCount2+1);
			buttons[j].height = buttonHeight * playerScale / (playerCount2+1);
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
		playerIndex = 0;
		buttons[0].score = 0;
		for (let k = 1; k < buttonMax; k++) {
			buttons[k].score = scoreCount;
		}

		// Reset playing count.
		playing = 1;
	}

	// Update buttons.
	for (let k = 0; k < buttonCount; k++) {
		let s = 1;
		let x = buttons[k].posx, y = buttons[k].posy;
		let w = buttons[k].width, h = buttons[k].height;

		// Score++.
		if (touchIndex == k && picoAction(x,y,w,h)) {
			if (touchCount >= 0) {
				buttons[k].score = buttons[k].score+1 < scoreMax ? buttons[k].score+1 : scoreMax;
				touchState = "";
				touchCount = 0;
				if (k == 0) {
					playerIndex = playerIndex + 1 <= playerCount ? playerIndex + 1 : 1;
				}
			}

		// Score--.
		} else if (touchIndex == k && picoAction()) {
			if (touchCount > -60) {
				buttons[k].score = buttons[k].score-1 > -scoreMax ? buttons[k].score-1 : -scoreMax;
				touchState = "";
				touchCount = 0;
				if (k == 0) {
					if (buttons[k].score <= 0) {
						buttons[k].score = 0;
						playerIndex = 0;
					} else {
						playerIndex = playerIndex - 1 >= 1 ? playerIndex - 1 : playerCount;
					}
				}
			}

		// Holding.
		} else if ((touchIndex < 0 || touchIndex == k) && picoMotion(x,y,w,h)) {
			touchIndex = k;
			touchState = "";
			if (touchCount >= 60) {
				buttons[k].score = 0;
				touchCount = -1;
				if (k == 0) {
					playerIndex = 0;
				}
			} else if (touchCount >= 0) {
				touchCount++;
				s = 0.8;
			}

		// Swiping.
		} else if (touchIndex == k && picoMotion()) {
			if (touchCount > -60) {
				touchState = "-";
				if (k == 0) {
					if (buttons[k].score <= 0) {
						touchState = "";
					}
				}
				s = 0.6;
				if (touchCount >= 0) {
					touchCount = -1;
				} else {
					touchCount--;
				}
			} else {
				touchState = "";
			}
		}

		// Draw buttons.
		if (k == 0) {
			let a = buttons[k].angle + (playerCount >= 2 && !landscape && playerIndex > picoDiv(playerCount+1,2) ? 180 : 0);
			let sprite = buttons[k].score > 0 ? dealerSprite1 : dealerSprite0;
			let number = buttons[k].score;
			if (touchIndex == k && touchState) {
				number = " " + number + touchState;
			}
			await picoSprite(sprite, -1, x, y, a, buttons[k].scale*s);
			await picoChar(number, dealerColor, x, y, a, buttons[k].scale*numberScale*s);
		} else {
			let sprite = (k == playerIndex && playerCount > (landscape?1:2)) ? playerSprite1 : playerSprite0;
			let number = buttons[k].score > 0 ? "+" + buttons[k].score : buttons[k].score;
			if (touchIndex == k && touchState) {
				number = " " + number + touchState;
			}
			await picoSprite(sprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);
			await picoChar(number, playerColor, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
		}
	}

	// Reset touching state.
	if (picoAction()) {
		touchIndex = -1;
		touchState = "";
		touchCount = 0;
	}

	// Increment playing count.
	playing++;
};
