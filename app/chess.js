const title = "Chess"; // Title.

const sprites = { // Sprite table.
	"P": picoStringCode6("077222232242223233243324334344"),
	"R": picoStringCode6("077211231251212222232242252213223233243253324334344315325335345355"),
	"N": picoStringCode6("077211221231241212222232242252233243324334344315325335345355"),
	"B": picoStringCode6("077230221231241212222232242252223233243324334344315325335345355"),
	"Q": picoStringCode6("077210230250221231241212222232242252223233243324334344315325335345355"),
	"K": picoStringCode6("077210220230240250211221231241251212222232242252223233243324334344315325335345355"),
	"p": picoSpriteFlip(picoStringCode6("077422432442423433443324334344"),1,1),
	"r": picoSpriteFlip(picoStringCode6("077411431451412422432442452413423433443453324334344315325335345355"),1,1),
	"n": picoSpriteFlip(picoStringCode6("077411421431441412422432442452433443324334344315325335345355"),1,1),
	"b": picoSpriteFlip(picoStringCode6("077430421431441412422432442452423433443324334344315325335345355"),1,1),
	"q": picoSpriteFlip(picoStringCode6("077410430450421431441412422432442452423433443324334344315325335345355"),1,1),
	"k": picoSpriteFlip(picoStringCode6("077410420430440450411421431441451412422432442452423433443324334344315325335345355"),1,1),
	"#": picoStringCode6("077111121131141151112122132142152113123133143153114124134144154115125135145155"),
	".": picoStringCode6("077"),
	"*": picoStringCode6("077"),
};
const colors = picoStringCode8("111555333222444000");

const board = 
	"            "+
	"            "+
	"   # # # #  "+
	"  # # # #   "+
	"   # # # #  "+
	"  # # # #   "+
	"   # # # #  "+
	"  # # # #   "+
	"   # # # #  "+
	"  # # # #   "+
	"            "+
	"            ";
var pieces = [
	"            "+
	"            "+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  PPPPPPPP.."+
	"  RNBQKBNR.."+
	"  ........  "+
	"  ........  ", // Upright pieces.
	"            "+
	"            "+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  pppppppp.."+
	"  rnbkqbnr.."+
	"  ........  "+
	"  ........  ", // Reverse pieces.
];
const faces = {
	"P":"P","R":"R","N":"N","B":"B","Q":"Q","K":"K",
	"p":"p","r":"r","n":"n","b":"b","q":"q","k":"k",
};
const movable = ".", holding = "*", nothing = " ";
const width = 12, height = 12, inside = 8, offset = 1;
const grid = 6, margin = 0, scale = 2, scale2 = 5, yflip = 1;
const icons = [
	picoStringCode6("077211231251212222232242252213223233243253324334344315325335345355"),
	picoStringCode6("077411431451412422432442452413423433443453324334344315325335345355"),
];

// Global variables.
var hands = [null,null], indexes = [-1,-1], indexes0 = [-1, -1]; // Hand pieces and indexes of the piece table.
var landscape = -1; // 0 if portrait mode, 1 if landscape mode, and -1 if uninitialized.
var reverse = 0; // 0 if upright board, 1 if reverse board.
var movelogs = [], undologs = []; // Move,unmove logs.

// Select button.
async function appSelect(x) {

	// Unmove by move logs.
	if (x < 0) {
		let moves = movelogs.pop();
		if (moves) {
			let p1 = moves[0];
			for (let k = moves.length-6; k >= 0; k-=3) {
				// A moves 022 to 011,
				// so A unmoves 011 to 022 and remove 011.
				let p2 = p1;
				let x2 = moves[k+1] + offset;
				let y2 = moves[k+2] + offset;
				let l2 = x2 + y2*width;
				let z = picoCode6Char(moves[k+3]);
				let x1 = moves[k+4] + offset;
				let y1 = moves[k+5] + offset;
				let l1 = x1 + y1*width;
				// Change piece side when inside to outside changes.
				if (x2 <= inside + offset && y2 <= inside + offset &&
					(x1 > inside + offset || y1 > inside + offset)) {
					p2 = p2 ? 0 : 1;
					l2 = pieces[p2].length-1-l2; // Transform positions for enemy pieces.
				}
				pieces[p2] = pieces[p2].slice(0,l2) + z + pieces[p2].slice(l2+1);
				if (l1 != l2) {
					pieces[p1] = pieces[p1].slice(0,l1) + movable + pieces[p1].slice(l1+1);
				}
			}
			undologs.push(moves);
			picoLabel("select", ""+movelogs.length);
			picoFlush();
		}

	// Remove by undo logs.
	} else if (x > 0) {
		let moves = undologs.pop();
		if (moves) {
			let p2 = moves[0];
			for (let k = 0; k <= moves.length - 6; k+=3) {
				// A moves 011 to 022,
				let x1 = moves[k+1] + offset;
				let y1 = moves[k+2] + offset;
				let l1 = x1 + y1*width;
				let z = picoCode6Char(moves[k+3]);
				let p1 = p2;
				let x2 = moves[k+4] + offset;
				let y2 = moves[k+5] + offset;
				let l2 = x2 + y2*width;
				// Change piece side when inside to outside changes.
				if (x1 <= inside + offset && y1 <= inside + offset &&
					(x2 > inside + offset || y2 > inside + offset)) {
					p1 = p1 ? 0 : 1;
					l1 = pieces[p1].length-1-l1; // Transform positions for enemy pieces.
				}
				pieces[p2] = pieces[p2].slice(0,l2) + z + pieces[p2].slice(l2+1);
				if (l1 != l2) {
					pieces[p1] = pieces[p1].slice(0,l1) + movable + pieces[p1].slice(l1+1);
				}
			}
			movelogs.push(moves);
			picoLabel("select", ""+movelogs.length);
			picoFlush();
		}

	// Reverse board.
	} else if (icons) {
		reverse = reverse ? 0 : 1;
		if (yflip) {
			for (let chars in sprites) {
				picoCharSprite(chars, picoSpriteFlip(sprites[chars],reverse,reverse));
			}
		}
		//let data = await picoSpriteData(icons[reverse]);
		//picoLabel("select", null, data);
		picoFlush();
	}
}

// Action button.
async function appAction() {
	// Share board with pieces.
	picoResetParams();
	for (let j = 0; j < pieces.length; j++) {
		let code6 = [];
		for (let i = 0; i < pieces[j].length; i++) {
			if (pieces[j][i] != movable && pieces[j][i] != holding && pieces[j][i] != nothing) {
				let l = code6.length;
				code6[l] = picoCharCode6(pieces[j][i]);
				code6[l+1] = picoMod(i,width) - offset;
				code6[l+2] = picoDiv(i,width) - offset;
			}
		}
		if (hands[j]) {
			let l = code6.length;
			code6[l] = picoCharCode6(hands[j]);
			code6[l+1] = picoMod(indexes[j],width) - offset;
			code6[l+2] = picoDiv(indexes[j],width) - offset;
		}
		picoSetCode6(code6, j);
	}
	if (movelogs.length > 0) {
		let moveparams = [];
		for (let k = 0; k < movelogs.length; k++) {
			moveparams = moveparams.concat(movelogs[k]);
		}
		picoSetCode6(moveparams, pieces.length);
	}
	picoShareApp();
}

// Load.
async function appLoad() {
	picoTitle(title);
	for (let chars in sprites) {
		picoCharSprite(chars, sprites[chars]);
	}
	picoCharLeading(grid,grid);
	picoColor(colors);

	// Load query params.
	for (let j = 0; j < pieces.length; j++) {
		let value = picoString(j);
		if (value) {
			// Load piece positions by parameters 0 and 1.
			if (value[0] != "0") {
				let params = picoCode6(j);
				for (let char in faces) {
					pieces[j] = pieces[j].replaceAll(char, movable);
				}
				for (let k = 0; k < params.length; k+=3) {
					let x = params[k+1] + offset;
					let y = params[k+2] + offset;
					let l =	x + y*width;
					if (l >= 0 && l < pieces[j].length) {
						if (pieces[j][l] == movable) {
							pieces[j] = pieces[j].slice(0,l) + value[k] + pieces[j].slice(l+1);
						} else if (hands[j] == null) {
							hands[j] = value[k];
							indexes[j] = l;
						}
					}
				}
			}
		}
	}
	{
		// Load move logs by parameters 2.
		let j = pieces.length;
		let value = picoString(j);
		if (value) {
			let params = picoCode6(j), l = params.length;
			for (let k = params.length-1; k >=0; k--) {
				if (params[k] < pieces.length) {
					let p = params.slice(k, l);
					movelogs.unshift(p);
					l = k;
				}
			}
		}
	}

	/*if (icons) {
		let data = await picoSpriteData(icons[reverse]);
		picoLabel("select", null, data);
	}*/
	picoLabel("select", ""+movelogs.length);
	picoLabel("action", "&");
	picoLabel("minus", "-");
	picoLabel("plus", "+");
	appResize();
}

// Resize.
async function appResize() {
	let r = picoWideScreen();
	if (landscape != r) {
		landscape = r;
		// Replace pieces on the outside of the board.
		for (let j = 0; j < pieces.length; j++) {
			for (let k = 0; k < width*(height-inside)/2; k++) {
				let l0 = pieces[j].length-1-k;
				let l1 = picoDiv(pieces[j].length-1-k,width)+picoMod(pieces[j].length-1-k,width)*width;
				let piece0 = pieces[j][l0], piece1 = pieces[j][l1];
				if ((landscape && piece0 != movable) || (!landscape && piece1 != movable)) {
					pieces[j] = pieces[j].slice(0,l0) + piece1 + pieces[j].slice(l0+1);
					pieces[j] = pieces[j].slice(0,l1) + piece0 + pieces[j].slice(l1+1);
				}
			}
		}
		picoFlush();
	}
}

// Main.
async function appMain() {
	for (let j = 0; j < pieces.length; j++) {
		for (let i = 0; i < pieces[j].length; i++) {
			let x = (picoMod(i,width) - (width-1)/2) * grid * scale;
			let y = (picoDiv(i,width) - (height-1)/2) * grid * scale;
			if (j ^ reverse) { // Transform positions for enemy pieces.
				x = -x;
				y = -y;
			}
			if (picoAction(x,y, grid-margin,grid-margin)) {
				// Dropping pieces.
				if (hands[j]) {
					// Drop and catch target pieces.
					if (pieces[j?0:1][pieces[j].length-1-i] != movable && pieces[j?0:1][pieces[j].length-1-i] != nothing) {
						let target = pieces[j?0:1][pieces[j].length-1-i];
						pieces[j?0:1] = pieces[j?0:1].slice(0,pieces[j].length-1-i) + movable + pieces[j?0:1].slice(pieces[j].length-1-i+1);
						for (let k = 0; k < width*(height-inside)/2; k++) {
							let l0 = pieces[j].length-1-k;
							let l1 = picoDiv(pieces[j].length-1-k,width)+picoMod(pieces[j].length-1-k,width)*width;
							let l = landscape ? l1 : l0;
							// Add move and catch logs.
							if (pieces[j][l] == movable) {
								undologs = [];
								let moves = [j];
								moves[1] = picoMod(indexes0[j],width) - offset;
								moves[2] = picoDiv(indexes0[j],width) - offset;
								moves[3] = picoCharCode6(hands[j]);
								moves[4] = picoMod(indexes[j],width) - offset;
								moves[5] = picoDiv(indexes[j],width) - offset;
								moves[6] = picoCharCode6(target);
								moves[7] = picoMod(l,width) - offset;
								moves[8] = picoDiv(l,width) - offset;
								movelogs.push(moves);
								picoLabel("select", ""+movelogs.length);
								pieces[j] = pieces[j].slice(0,l) + target + pieces[j].slice(l+1);
								target = null;
								break;
							}
						}
						// Switch holding pieces with target pieces if full.
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
						hands[j] = target;
					// Drop and flip holding piece.
					} else if (pieces[j][i] == holding && faces[hands[j]]) {
						// Modify move logs.
						undologs = [];
						let moves = movelogs.pop();
						if (moves) {
							let x1 = moves[1] + offset;
							let y1 = moves[2] + offset;
							let l1 = x1 + y1*width;
							let x2 = moves[4] + offset;
							let y2 = moves[5] + offset;
							let l2 = x2 + y2*width;
							if (l1 == indexes[j] || l2 == indexes[j]) {
								moves[3] = picoCharCode6(hands[j]);
							} else {
								movelogs.push(moves);
								moves = null;
							}
						}
						// Add flip logs.
						if (!moves) {
							moves = [j];
							moves[3] = picoCharCode6(hands[j]);
							moves[1] = moves[4] = picoMod(indexes[j],width) - offset;
							moves[2] = moves[5] = picoDiv(indexes[j],width) - offset;
						}
						movelogs.push(moves);
						picoLabel("select", ""+movelogs.length);
						pieces[j] = pieces[j].slice(0,i) + faces[hands[j]] + pieces[j].slice(i+1);
						hands[j] = null;
					// Drop to empty square.
					} else if (pieces[j][i] == movable) {
						// Modify move logs.
						undologs = [];
						let moves = movelogs.pop();
						if (moves) {
							let x2 = moves[4] + offset;
							let y2 = moves[5] + offset;
							let l2 = x2 + y2*width;
							if (l2 == indexes0[j]) {
								moves[4] = picoMod(indexes[j],width) - offset;
								moves[5] = picoDiv(indexes[j],width) - offset;
							} else if (indexes[j] != indexes0[j]) {
								movelogs.push(moves);
								moves = null;
							}
						}
						// Add move logs.
						if (!moves) {
							moves = [j];
							moves[1] = picoMod(indexes0[j],width) - offset;
							moves[2] = picoDiv(indexes0[j],width) - offset;
							moves[3] = picoCharCode6(hands[j]);
							moves[4] = picoMod(indexes[j],width) - offset;
							moves[5] = picoDiv(indexes[j],width) - offset;
						}
						movelogs.push(moves);
						picoLabel("select", ""+movelogs.length);
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
						hands[j] = null;
					}
				}
			} else if (picoMotion(x,y, grid-margin,grid-margin)) {
				// Move holding pieces to empty square.
				if (hands[j] && pieces[j][i] != nothing && pieces[j][i] != holding) {
					if (pieces[j][indexes[j]] == holding) { // Reset holding square.
						pieces[j] = pieces[j].slice(0,indexes[j]) + movable + pieces[j].slice(indexes[j]+1);
					}
					indexes[j] = i;
				// Reverse holding pieces on enemy square.
				} else if (hands[j] &&
					pieces[j?0:1][pieces[j].length-1-i] == movable && 
					(picoMod(i,width) < (width-inside)/2 || picoMod(i,width) > width-(width-inside)/2 ||
					 picoDiv(i,width) < (height-inside)/2 || picoDiv(i,width) > height-(height-inside)/2)) {
					hands[j?0:1] = hands[j];
					indexes[j?0:1] = indexes[j];
					hands[j] = null;
				// Hold pieces.
				} else if (!hands[j] && !hands[j?0:1] && pieces[j][i] != movable && pieces[j][i] != holding && pieces[j][i] != nothing) {
					hands[j] = pieces[j][i];
					indexes[j] = indexes0[j] = i;
					pieces[j] = pieces[j].slice(0,i) + holding + pieces[j].slice(i+1);
				}
			}
		}
		// Cancel holding pieces.
		if (hands[j] && pieces[j][indexes[j]] == movable && picoAction()) {
			pieces[j] = pieces[j].slice(0,indexes[j]) + hands[j] + pieces[j].slice(indexes[j]+1);
			hands[j] = null;
		}
	}

	// Draw board with pieces.
	picoClear();
	picoRect(0, 0,0, grid*(inside+0.5),grid*(inside+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	for (let j = 0; j < pieces.length; j++) {
		picoText(pieces[j], -1, 0,0, grid*width,grid*height, j^reverse?180:0,scale);
	}
	for (let j = 0; j < pieces.length; j++) {
		if (hands[j]) {
			let x = (picoMod(indexes[j],width) - (width-1)/2) * grid * scale;
			let y = (picoDiv(indexes[j],width) - (height-1)/2) * grid * scale;
			if (j ^ reverse) { // Transform positions for enemy pieces.
				x = -x;
				y = -y;
			}
			picoChar(hands[j], -1, x,y, j^reverse?180:0,scale2);
		}
	}
}
