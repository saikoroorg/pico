const title = "Bank"; // Title.

// Player.
const playerMax = 8; // Maximum player count.
var playerCount = 2; // Player count.
var playerIndex = 0; // Current player index.
//var playerCountMin2 = 2; // Player count for hourglass mode.

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
const buttonBall0Sprite = [0,15,15, 1,1,2,0,12,10]; // Button ball sprite.
const buttonBall1Sprite = [0,15,15, 1,1,2,0,12,10]; // Button ball sprite.
const buttonRect0Sprite = [0,15,15, -1,1,4,0,12,6, -1,3,2,0,8,8]; // Button ball sprite.
const buttonRect1Sprite = [0,19,19, -1,3,6,0,12,6, -1,5,4,0,8,8, 3,7,0,0,4,0, 3,8,1,0,2,0, 3,9,2,0,0,0]; // Button ball sprite.
const buttonScale = 6; // Button base scale.
const numberScale = 0.5; // Button number scale.
const buttonPosX = 50; // Button position X on landscape mode.
const buttonPosY = 50; // Button position Y on portrait mode.
const buttonGridX = 125; // Button position grid base width for 3+ players.
const buttonGridY = [-15, 15]; // Button position grid base height for 3+ players.
var buttonCount = 3; // Button count.

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
		if ((x > 0 && playerCount + x <= playerMax) || (x < 0 && playerCount + x >= 0)) {
			playerCount = playerCount + x;
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

	state = "waiting";
	appResize(); // Initialize positions.
	appUpdate(); // Initialize buttons.
}

// Resize.
async function appResize() {
	landscape = picoWideScreen();

	// Reset layouts for 1 screen for solo player.
	if (buttonCount <= 1) {
		for (let j = 0; j < 1; j++) {
			buttons[j].centerx = buttons[j].centery = 0;
			buttons[j].scale = buttonScale;
			buttons[j].angle = 0;
			buttons[j].width = buttonWidth * buttonScale;
			buttons[j].height = buttonHeight * buttonScale;
		}

	// Reset layouts for 2 screens for solo player.
	} else if (buttonCount <= 2) {
		let centerx = [landscape ? -buttonPosX : 0, landscape ? buttonPosX : 0];
		let centery = [landscape ? 0 : -buttonPosY, landscape ? 0 : buttonPosY];

		for (let j = 0; j < buttonCount; j++) {
			buttons[j].centerx = centerx[j];
			buttons[j].centery = centery[j];
			buttons[j].scale = !j ? buttonScale : buttonScale;
			buttons[j].angle = 0;
			buttons[j].width = buttonWidth * buttonScale;
			buttons[j].height = buttonHeight * buttonScale;
		}

	// 2 Screens for 2 players.
	} else if (buttonCount <= 3) {
		let centerx = [0, landscape ? buttonPosX*1.5 : 0, landscape ? -buttonPosX*1.5 : 0];
		let centery = [0, landscape ? 0 : buttonPosY*1.5, landscape ? 0 : -buttonPosY*1.5];

		for (let j = 0; j < buttonCount; j++) {
			buttons[j].centerx = centerx[j];
			buttons[j].centery = centery[j];
			buttons[j].scale = !j ? buttonScale : buttonScale;
			if (landscape) {
				buttons[j].angle = 0;
			} else {
				buttons[j].angle = j>=2 ? 180 : 0; // Upsidedown for portrait mode.
			}
			buttons[j].width = buttonWidth * buttonScale;
			buttons[j].height = buttonHeight * buttonScale;
		}

	// 2 Screens for 3+ players.
	} else {
		let centerx = [landscape ? -buttonPosX : 0, landscape ? buttonPosX : 0];
		let centery = [landscape ? 0 : -buttonPosY, landscape ? 0 : buttonPosY];

		buttons[0].centerx = centerx[0];
		buttons[0].centery = centery[0];
		buttons[0].scale = buttonScale;
		buttons[0].angle = 0;
		buttons[0].width = buttonWidth * buttonScale;
		buttons[0].height = buttonHeight * buttonScale;

		if (playerCount <= 4) {
			for (let j = 1; j <= playerCount; j++) {
				buttons[j].centerx = centerx[1] + buttonGridX * (j-1 - playerCount/2 + 0.5) / (playerCount + 1);
				buttons[j].centery = centery[1];
				buttons[j].scale = buttonScale / playerCount;
				buttons[j].angle = 0;
				buttons[j].width = buttonWidth * buttonScale / playerCount;
				buttons[j].height = buttonHeight * buttonScale / playerCount;
			}
		} else {
			let playerCount2 = picoDiv(playerCount, 2);
			let playerCount1 = playerCount - playerCount2;
			for (let j = 1; j <= playerCount1; j++) {
				buttons[j].centerx = centerx[1] + buttonGridX * (j-1 - playerCount1/2 + 0.5) / (playerCount1 + 1);
				buttons[j].centery = centery[1] + buttonGridY[0];
				buttons[j].scale = buttonScale / playerCount1;
				buttons[j].angle = 0;
				buttons[j].width = buttonWidth * buttonScale / playerCount1;
				buttons[j].height = buttonHeight * buttonScale / playerCount1;
			}
			for (let j = playerCount1+1; j <= playerCount; j++) {
				buttons[j].centerx = centerx[1] + buttonGridX * (j-1 - playerCount2/2 - playerCount1 + 0.5) / (playerCount2 + 1);
				buttons[j].centery = centery[1] + buttonGridY[1];
				buttons[j].scale = buttonScale / playerCount1;
				buttons[j].angle = 0;
				buttons[j].width = buttonWidth * buttonScale / playerCount1;
				buttons[j].height = buttonHeight * buttonScale / playerCount1;
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

		//playerCountMin2 = playerCount > 2 ? playerCount : 2; // Minimum 2 players for hourglass mode.
		//buttonCount = playerCount + 1; // Add playing button on 3+ players mode.

		// Reset playing states.
		state = "waiting";

		// Reset player states.
		playerIndex = 0;

		buttons[0].score = 0;
		for (let j = 0; j < playerCount; j++) {
			players[j].score = 0;
			buttons[j + 1].score = 0;
		}

		// Reset playing count.
		playing = 1;
	}

	for (let k = 0; k < buttonCount; k++) {

		// 2 players.
		//if (playerCount <= 2) {
		//	if (k < playerCount) {
				let i = k, s = 1;
				let x = buttons[k].centerx, y = buttons[k].centery;
				let w = buttons[k].width, h = buttons[k].height;

				if (picoAction(x,y,w,h) && buttons[k].touching >= 0) {
					buttons[k].score += 1;
					buttons[k].touching = 0;
					if (k == 0) {
						playerIndex = picoMod(playerIndex, playerCount) + 1;
					}
				} else if (picoMotion(x,y,w,h)) {
					if (buttons[k].touching >= 60) {
						buttons[k].score = 0;
						buttons[k].touching = -1;
						if (k == 0) {
							playerIndex = 0;
						}
					} else if (buttons[k].touching >= 0) {
						buttons[k].touching++;
						s = 0.8;
					} else {
					}
				} else {
					buttons[k].touching = 0;
				}

				// Draw buttons.
				if (k == 0) {
					if (playerCount == 2) {
						let a = buttons[k].angle + picoMod(playerIndex+1,2)*180;
						await picoSprite(playerIndex?buttonBall1Sprite:buttonBall0Sprite, -1, x, y, a, buttons[k].scale*s);
						await picoChar(buttons[k].score, 3, x, y, a, buttons[k].scale*numberScale*s);
					} else {
						await picoSprite(buttonBall0Sprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);
						await picoChar(buttons[k].score, 3, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
					}
				} else {
					if (k == playerIndex) {
						await picoSprite(buttonRect1Sprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);
						await picoChar(buttons[k].score, 0, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
					} else {
						await picoSprite(buttonRect0Sprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);
						await picoChar(buttons[k].score, 0, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
					}
				}
		//	}

		// 3+ players.
		/*} else {
			if (k > 0) {
				let i = 1, s = 1;
				let x = buttons[k].centerx, y = buttons[k].centery;
				let w = buttons[k].width, h = buttons[k].height;

				if (picoAction(x,y,w,h) && buttons[k].touching >= 0) {
					playerIndex = k-1;//picoMod(playerIndex+1, playerCount);
					buttons[k].touching = 0;
					picoFlush();
				} else if (picoMotion(x,y,w,h)) {
					if (buttons[k].touching >= 60) {
						buttons[k].touching = -1;
					} else if (buttons[k].touching >= 0) {
						buttons[k].touching++;
						s = 0.8;
					} else {
					}
				} else {
					buttons[k].touching = 0;
				}

				// Draw buttons.
				let r = k-1==playerIndex ? buttonRectSprite : buttonBallSprite;
				await picoSprite(r, -1, x, y, buttons[k].angle, buttons[k].scale*s);

				// Draw number.
				await picoChar(players[k-1].score, -1, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
			} else if (playerIndex >= 0) {
				let i = 0, s = 1;
				let x = buttons[k].centerx, y = buttons[k].centery;
				let w = buttons[k].width, h = buttons[k].height;

				if (picoAction(x,y,w,h) && buttons[k].touching >= 0) {
					players[playerIndex].score += 1;
					buttons[k].touching = 0;
					picoFlush();
				} else if (picoMotion(x,y,w,h)) {
					if (buttons[k].touching >= 60) {
						players[playerIndex].score = 0;
						buttons[k].touching = -1;
					} else if (buttons[k].touching >= 0) {
						buttons[k].touching++;
						s = 0.8;
					} else {
					}
				} else {
					buttons[k].touching = 0;
				}

				// Draw buttons.
				await picoSprite(buttonRectSprite, -1, x, y, buttons[k].angle, buttons[k].scale*s);

				// Draw number.
				await picoChar(players[playerIndex].score, -1, x, y, buttons[k].angle, buttons[k].scale*numberScale*s);
			}
		}*/
	}

	// Increment playing count.
	playing++;
};
