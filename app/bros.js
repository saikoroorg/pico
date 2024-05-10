const title = "Bros"; // Title.
const editjs = "app/edit.js"; // Editor script.
const returl = "index.html?s=app/bros.js"; // Return url.
var levels = [ // Level data.
	[], //"Extra"
	[0,7,7,1,0,0,2,6,6], //"Bros",
	[0,7,7,1,0,0,2,6,6,4,6,0,4,0,6], //"Block",
	[0,7,7,1,0,0,2,6,6,4,1,1], //"Pole",
	[0,7,7,1,0,0,2,6,6,4,5,1,4,5,2,4,5,3,4,5,4,4,1,5,4,2,5,4,3,5,4,4,5,4,5,5], //"Wall",
	[0,7,7,1,2,2,2,4,4,4,2,3,4,2,4,4,3,4], //"Boomerang",
	[0,7,7,1,0,6,2,6,6,4,3,2], //"Cracker",
	[0,7,7,1,0,0,2,4,4,4,2,2,4,3,2,4,5,2,4,6,2,4,2,3,4,6,3,4,2,4,4,6,4,4,2,5,4,6,5,4,2,6,4,3,6,4,4,6,4,5,6,4,6,6], //"Room",
	[0,7,7,1,0,0,2,4,4,4,1,1,4,5,1,4,5,2,4,5,3,4,5,4,4,1,5,4,2,5,4,3,5,4,4,5,4,5,5], //"Inside",
	[0,7,7,1,1,1,2,5,1,4,3,3], //"Belly",
	[0,7,7,1,1,3,2,5,3,4,3,5], //"Baby",
	[0,7,7,1,2,3,2,4,3,4,0,0,4,6,0,4,0,3,4,6,3,4,0,6,4,3,6,4,6,6], //"Urchin",
	[0,7,7,1,2,3,2,4,3,4,0,0,4,6,0,4,0,5,4,3,5,4,6,5,4,0,6,4,3,6,4,6,6], //"Shaggy",
	[0,7,7,1,2,6,2,4,6,4,0,0,4,6,0,4,0,5,4,6,5,4,0,6,4,1,6,4,5,6,4,6,6], //"Crab",
	[0,7,7,1,0,0,2,6,6,4,1,2,4,5,2], //"Asymmetry",
	[0,7,7,1,1,1,2,5,1], //"Eyes",
	[0,7,7,1,1,1,2,5,1,4,2,3,4,3,3,4,4,3], //"Raise",
	[0,7,7,1,2,2,2,4,2,4,3,2,4,2,3,4,4,3,4,2,6,4,4,6], //"Horseshoe",
	[0,7,7,1,2,2,2,4,2,4,2,4,4,3,4,4,4,4], //"Face",
	[0,7,7,1,1,1,2,5,1,4,1,3,4,2,3,4,3,3,4,4,3,4,5,3], //"Teeth",
	[0,7,7,1,1,1,2,5,1,4,1,4,4,5,4,4,1,5,4,2,5,4,3,5,4,4,5,4,5,5], //"Smile",
	[0,7,7,1,1,2,2,5,2,4,1,1,4,5,1,4,1,5,4,5,5], //"Mask",
	[0,7,7,1,3,2,2,2,3,4,2,0,4,0,2,4,2,2], //"Scissor",
	[0,7,7,1,6,4,2,4,6,4,3,0,4,3,2,4,4,2,4,0,3,4,2,3,4,3,3,4,4,3,4,2,4,4,3,4,4,4,4], //"Turtle",
	[0,7,7,1,2,1,2,1,2,4,2,2,4,4,2,4,2,4,4,4,4], //"Cross",
	[0,7,7,1,1,1,2,5,5,4,3,1,4,3,2,4,1,3,4,2,3,4,3,3], //"Sling",
	[0,7,7,3,1,5,4,1,3,4,3,5], //"Unite",
	[0,7,7,1,1,5,2,5,1,4,2,1,4,1,2,4,2,2], //"Balance",
	[0,7,7,3,3,2,4,3,4], //"Jump",
	[0,7,7,3,3,3,4,3,4], //"Ignition",
	[0,7,7,1,1,1,2,5,1,4,1,2,4,2,2,4,4,2,4,5,2,4,2,4,4,4,4], //"Duel",
	[0,7,7,1,2,3,2,4,3,4,1,1,4,2,1,4,3,1,4,1,2,4,2,2,4,1,3], //"Salute",
	[0,7,7,1,2,0,2,6,4,4,3,0,4,4,0,4,5,0,4,6,0,4,4,1,4,5,1,4,6,1,4,5,2,4,6,2,4,6,3], //"Stairs",
	[0,7,7,1,2,2,2,4,2,4,0,0,4,6,0,4,0,1,4,2,1,4,4,1,4,6,1,4,0,2,4,6,2,4,0,3,4,2,3,4,4,3,4,6,3,4,0,4,4,2,4,4,4,4,4,6,4,4,0,5,4,6,5,4,0,6,4,6,6], //"River",
	[0,7,7,3,0,6,4,3,0,4,1,1,4,5,1,4,0,3,4,2,3,4,4,3,4,6,3,4,1,5,4,3,5,4,5,5,4,3,6], //"Firework",
	[0,7,7,3,3,3,4,2,0,4,3,0,4,4,0,4,2,1,4,4,1,4,4,2,4,3,5], //"Question",
	[0,7,7,3,2,3,4,0,0,4,1,0,4,2,0,4,3,0,4,0,1,4,1,1,4,0,2,4,0,3,4,0,4,4,0,5,4,1,5,4,0,6,4,1,6,4,2,6,4,3,6], //"Crescent",
	[0,7,7,1,1,2,2,2,1,4,1,1,4,4,1,4,5,1,4,1,4,4,1,5,4,5,5], //"Umbrella",
	[0,7,7,1,3,2,2,3,0,4,0,0,4,1,0,4,2,0,4,4,0,4,5,0,4,6,0,4,1,2,4,5,2,4,1,5,4,5,5], //"Throne",
	[0,7,7,1,2,2,2,4,2,4,1,1,4,5,1,4,2,3,4,4,3], //"Fountain",
	[0,7,7,1,2,3,2,4,3,4,3,1], //"Triangle",
	[0,7,7,1,2,5,2,4,5,4,1,4,4,5,4,4,1,5,4,5,5], //"Devil",
	[0,7,7,1,1,4,2,2,5,4,3,1,4,5,1,4,3,3,4,0,5,4,1,5,4,0,6,4,1,6], //"Meteorite",
	[0,7,7,1,1,4,2,5,4,4,2,3,4,3,3,4,4,3], //"Sunset",
	[0,7,7,1,1,2,2,3,2,4,5,1,4,5,2,4,5,3], //"Password",
	[0,7,7,1,1,5,2,5,5,4,1,1,4,2,1,4,3,1,4,4,1,4,5,1,4,1,2,4,5,2,4,1,3,4,5,3], //"Bridge",
	[0,7,7,3,3,2,4,3,0], //"Drop",
	[0,7,7,1,1,5,2,3,5,4,5,0,4,6,0,4,6,1,4,0,5,4,0,6], //"Trick",
	[0,7,7,1,2,4,2,4,4,4,0,0,4,1,0,4,4,0,4,5,0,4,6,0,4,0,1,4,5,1,4,6,1,4,6,2], //"Mountain",
	[0,7,7,1,2,2,2,4,2,4,3,4,4,2,5,4,3,5,4,4,5], //"Boss",
];
const colors = [255,255,255, 231,0,91, 0,115,239, 143,0,119, 0,63,23]; // Color data.
var level = 1; // Playing level.
var maxlevel = 1; // Cleared level.
var playing = 0; // Playing count.
var blocking = -1; // Blocking count.
const maxsize = 20; // Max field size.
var width = 7, height = 7; // Field size.
var grid = 24, margin = 2, primary = 0;
var pixels = [[],[],[],[],[],[],[]];
var players = [[], []];

// Action button.
async function appAction() {
	picoResetParams();

	// Share cleared level.
	if (level >= 1 && level < levels.length) {
		let password = picoRandom(1000000, level);
		picoSetString("" + level + "@" + password, 0);
		return 1; // Return 1 to share.

	// Share or edit custom level.
	} else {
		picoSetCode6(levels[level], 0);
		if (blocking == 0) {
			picoShareApp(); // Share.
		} else {
			picoSetCode8(colors, 1);
			picoSwitchApp(editjs, returl); // Open editor.
		}
	}
}

// Select button.
async function appSelect(x) {

	// Change level.
	if (x) {
		if (level + x <= maxlevel && level + x >= 0) {
			level = level + x < levels.length ? level + x : 0;
			blocking = -1;
			playing = -1; // Restart.
			picoBeep(1.2, 0.1);

			// Update select button.
			picoLabel("select", "" + level);

		} else {
			picoBeep(0, 0.1);
		}

	// Restart level.
	} else {
		blocking = -1;
		playing = -1; // Restart.
		picoBeep(1.2, 0.1);
	}

	// Update edit button.
	if (level == 0) {
		picoLabel("action", "*");
	} else {
		picoLabel("action");
	}
}

// Load.
async function appLoad() {
	picoTitle(title);

	// Load query params.
	let value = picoString();
	if (value) {

		// Load extra level.
		if (value[0] == "0") {
			levels[0] = picoCode6();
			level = 0;
			picoLabel("action", "*");

		// Load playing level.
		} else {
			let numbers = picoNumbers();
			if (numbers[0] >= 0 && numbers[0] < levels.length &&
			picoRandom(1000000, numbers[0]) == numbers[1]) {
				maxlevel = numbers[0] + 1;
				level = numbers[0];
			}
		}
	}

	// Update select button.
	picoLabel("select", "" + level);
	picoLabel("minus", "-");
	picoLabel("plus", "+");

	// Load pallete data.
	picoColor(colors);
}

// Main.
async function appMain() {

	// Initialize.
	if (playing <= 0) {

		// Init level data.
		width = 7, height = 7;
		pixels = [[],[],[],[],[],[],[]];
		players = [[], []];
		if (levels[level]) {
			for (let k = 0; k < levels[level].length / 3; k++) {
				let w = levels[level][k * 3];
				let x = levels[level][k * 3 + 1];
				let y = levels[level][k * 3 + 2];
				if (w == 0) {
					width = x >= 0 && x <= maxsize ? x : 7;
					height = y >= 0 && y <= maxsize ? y : 7;
					grid = 168 / width;
					margin = width <= 9 ? 2 : 1;
					players = [[0, 0], [width - 1, height - 1]];
					for (let j = 0; j < height; j++) {
						pixels[j] = [];
						for (let i = 0; i < width; i++) {
							pixels[j][i] = 0;
						}
					}
					blocking = width * height;
				} else if (w >= 1 && w <= 4 && x >= 0 && x < width && y >= 0 && y < height) {
					if (w >= 1 && w <= 2) {
						if (pixels[players[w - 1][1]][players[w - 1][0]] >= 3) {
							pixels[players[w - 1][1]][players[w - 1][0]] -= w;
						} else {
							pixels[players[w - 1][1]][players[w - 1][0]] = 0;
						}
						players[w - 1] = [x, y];
					} else if (w == 3) {
						pixels[players[0][1]][players[0][0]] = 0;
						pixels[players[1][1]][players[1][0]] = 0;
						players[0] = [x, y];
						players[1] = [x, y];
					}
					pixels[y][x] = w;
					blocking -= 1;
				}
			}
		}

		// Reset playing count.
		playing = 1;
	}

	// Move player.
	for (let j = 0; j < height; j++) {
		let y = (j - (height - 1) / 2) * grid;
		for (let i = 0; i < width; i++) {
			let x = (i - (width - 1) / 2) * grid;

			// Touch blank cell to move player.
			if (pixels[j][i] == 0) {
				if (picoMotion(x, y, grid/2, grid/2)) {
					// Check cell next to player.
					let next = [false, false];
					for (let k = 0; k < 2; k++) {
						let dx = i - players[k][0], dy = j - players[k][1];
						if (dx * dy == 0 && (dx + dy == -1 || dx + dy == 1)) {
							next[k] = true;
						}
					}
					// Check facing cell between 2 players.
					let dx = players[0][0] - players[1][0], dy = players[0][1] - players[1][1];
					let next2 = dx * dy == 0 && (dx + dy == 2 || dx + dy == -2) ? true : false;
					// P1 and P2 move into same cell.
					if (next[0] && next[1] && next2) {
						pixels[j][i] = 3;
						players[0] = players[1] = [i, j];
						blocking -= 1;
					} else {
						// Move primary player first.
						for (let k = 0; k < 2; k++) {
							let k1 = primary == 0 ? k : k ? 0 : 1, k2 = k1 ? 0 : 1;
							// Player A moves forward and another player B moves backward.
							if (next[k1]) {
								pixels[j][i] = k1 == 0 ? 1 : 2;
								let i2 = players[k2][0] + players[k1][0] - i;
								let j2 = players[k2][1] + players[k1][1] - j;
								if (i2 >= 0 && i2 < width && j2 >= 0 && j2 < height) {
									if (pixels[j2][i2] == 0) {
										pixels[j2][i2] = k2 == 0 ? 1 : 2;
										players[k2] = [i2, j2];
										blocking -= 1;
									}
								}
								players[k1] = [i, j];
								blocking -= 1;
								break; // Only one player moves forward.
							}
						}
					}
				}

				// Clear level.
				if (blocking == 0) {
					//players = [[], []];
					maxlevel = level + 1;

					// Play clear sound.
					picoBeep(2.7, 0.1);
					picoBeep(2.7, 0.1, 0.2);

					// Update action button to share.
					picoLabel("action", "&");
				}
			}
		}
	}

	// Draw player.
	for (let j = 0; j < height; j++) {
		let y = (j - (height - 1) / 2) * grid;
		for (let i = 0; i < width; i++) {
			let x = (i - (width - 1) / 2) * grid;
			let expand = false;

			// Touch color cell to update primary player.
			if (pixels[j][i] != 0) {
				if (picoMotion(x, y, (grid+margin)/2, (grid+margin)/2)) {
					if (pixels[j][i] == 1) {
						primary = 0;
					} else if (pixels[j][i] == 2) {
						primary = 1;
					}

				// Set scale for touching or not touching player.
				} else {
					for (let k = 0; k < 2; k++) {
						if (i == players[k][0] && j == players[k][1]) {
							expand = true;
							break;
						}
					}
				}
			}

			// Draw cell.
			if (expand) {
				picoRect(pixels[j][i], x, y, grid+margin+1, grid+margin+1);
			} else {
				picoRect(pixels[j][i], x, y, grid-margin-1, grid-margin-1);
			}
		}
	}

	// Increment playing count.
	if (blocking > 0) {
		playing++;

	// Wait for input.
	} else if (picoAction()) {
		if (playing <= 1) {

			// Go next level.
			level = level + 1 < maxlevel ? level + 1 : maxlevel;
			picoLabel("select", "" + level);

			// Restart.
			playing = 0;

		// Wait for touch off.
		} else {
			playing = 1;
		}
	}
}
