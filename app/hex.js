const title = "Hex"; // Title.

const sprites = { // Sprite table.
	"P": [3,-1,-2,0,2,4, 3,-2,-1,0,4,2, -1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,1,-2,0,0,4,-1,-1,2,0,2,0],//0
	"R": [2,-1,-2,0,2,4, 2,-2,-1,0,4,2, -1,0,-2,0,0,4],//1
	"N": [2,-1,-2,0,2,4, 2,-2,-1,0,4,2, -1,0,-2,0,0,4],//1
	"B": [2,-1,-2,0,2,4, 2,-2,-1,0,4,2, -1,0,-2,0,0,4],//1
	"Q": [2,-1,-2,0,2,4, 2,-2,-1,0,4,2, -1,-1,-2,0,2,0,-1,1,-2,0,0,2,-1,-1,0,0,2,0,-1,-1,0,0,0,2,-1,-1,2,0,2,0],//2
	"K": [2,-1,-2,0,2,4, 2,-2,-1,0,4,2, -1,-1,-2,0,2,0,-1,1,-2,0,0,4,-1,-1,0,0,2,0,-1,-1,2,0,2,0],//3
	"p": picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	"r": picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	"n": picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	"b": picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	"q": picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	"k": picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	"#": picoStringCode6("0bb951941961932972923983914994915995916996927987938978949969959"),
	"+": picoStringCode6("0bb951941961932972923983914994915995916996927987938978949969959954945955965956"),
	"@": picoStringCode6("0bb951941961932972923983914994915995916996927987938978949969959944964955946966"),
	".": picoStringCode6("077"),
	"*": picoStringCode6("077"),
};
const colors = picoStringCode8("111555333222444000");

const board = 
	"           "+
	"           "+
	"           "+
	"   + # +   "+
	"  # # # #  "+
	" + # @ # + "+
	"  # # # #  "+
	"   + # +   "+
	"           "+
	"           "+
	"           ";
var pieces = [
	"           "+
	"           "+
	" ......... "+
	" ..p...r.. "+
	" ......... "+
	" n.......b "+
	" ......... "+
	" ..q...k.. "+
	" ......... "+
	" .......   "+
	" .......   ", // Upright pieces.
	"           "+
	"           "+
	" ......... "+
	" ......... "+
	" ......... "+
	" ......... "+
	" ......... "+
	" ......... "+
	" ......... "+
	" .......   "+
	" .......   ", // Reverse pieces.
];
const faces = {
	"P":"p","R":"r","N":"n","B":"b","Q":"q","K":"k",
	"p":"P","r":"R","n":"N","b":"B","q":"Q","k":"K",
};
const movable = ".", holding = "*", nothing = " ";
const width = 11, height = 11, inside = 9, offset = 1;
const hgrid = 4, vgrid = 8, margin = 0, scale = 3, scale2 = 5;
const icons = [
	picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
];

// Global variables.
var hands = [null,null], indexes = [-1,-1]; // Hand pieces and indexes of the piece table.
var landscape = -1; // 0 if portrait mode, 1 if landscape mode, and -1 if uninitialized.
var angle = 90; // The angle of the board, 0 if upright board, 180 if reverse board.

// Shuffle pieces.
function appShuffle() {
	let faces = "";
	for (let j = 0; j < pieces.length; j++) {
		for (let i = 0; i < pieces[j].length; i++) {
			if (pieces[j][i] != movable && pieces[j][i] != holding && pieces[j][i] != nothing) {
				faces += pieces[j][i];
			}
		}
		if (hands[j]) {
			faces += hands[j];
		}
	}
	for (let j = 0; j < pieces.length; j++) {
		for (let i = 0; i < pieces[j].length; i++) {
			if (pieces[j][i] != movable && pieces[j][i] != holding && pieces[j][i] != nothing) {
				let k = picoRandom(faces.length);
				pieces[j] = pieces[j].slice(0,i) + faces[k] + pieces[j].slice(i+1);
				faces = faces.slice(0,k) + faces.slice(k+1);
			}
		}
		if (hands[j]) {
			let k = picoRandom(faces.length);
			hands[j] = faces[k];
			faces = faces.slice(0,k) + faces.slice(k+1);
		}
	}
}

// Select button.
async function appSelect() {
	if (icons) {
		appShuffle();
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
				code6[l] = picoStringCode6(pieces[j][i])[0];
				code6[l+1] = picoMod(i,width) - offset;
				code6[l+2] = picoDiv(i,width) - offset;
			}
		}
		if (hands[j]) {
			let l = code6.length;
			code6[l] = picoStringCode6(hands[j])[0];
			code6[l+1] = picoMod(indexes[j],width) - offset;
			code6[l+2] = picoDiv(indexes[j],width) - offset;
		}
		picoSetCode6(code6, j);
	}
	picoShareApp();
}

// Load.
async function appLoad() {
	picoTitle(title);
	for (let chars in sprites) {
		picoCharSprite(chars, sprites[chars]);
	}
	picoCharLeading(hgrid,vgrid);
	picoColor(colors);

	// Initialize pieces.
	appShuffle();

	// Load query params.
	for (let j = 0; j < pieces.length; j++) {
		let value = picoString(j);
		if (value) {
			if (value[j] != "0") {
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

	if (icons) {
		let data = await picoSpriteData(icons[picoDiv(angle,180)]);
		picoLabel("select", null, data);
	}
	picoLabel("action", "&");
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
			let xy = picoSpriteFlip([-1,
				(picoMod(i,width) - (width-1)/2) * hgrid * scale,
				(picoDiv(i,width) - (height-1)/2) * vgrid * scale],
				angle>90,angle>90,angle%180);
			let w = angle==90 ? vgrid-margin : hgrid-margin;
			let h = angle==90 ? hgrid-margin : vgrid-margin;
			if (picoAction(xy[1],xy[2],w,h)) {
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
							if (pieces[j][l] == movable) {
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
						pieces[j] = pieces[j].slice(0,i) + faces[hands[j]] + pieces[j].slice(i+1);
						hands[j] = null;
					// Drop to empty square.
					} else if (pieces[j][i] == movable) {
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
						hands[j] = null;
					}
				}
			} else if (picoMotion(xy[1],xy[2],w,h)) {
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
					indexes[j] = i;
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
	//picoRect(0, 0,0, hgrid*(inside+0.5),vgrid*(inside+0.5), 0,scale);
	picoText(board, -1, 0,0, hgrid*width,vgrid*height, angle,scale);
	for (let j = 0; j < pieces.length; j++) {
		picoText(pieces[j], -1, 0,0, hgrid*width,vgrid*height, angle+j*180,scale);
	}
	for (let j = 0; j < pieces.length; j++) {
		if (hands[j]) {
			let a = angle+j*180;
			let xy = picoSpriteFlip([-1,
				(picoMod(indexes[j],width) - (width-1)/2) * hgrid * scale,
				(picoDiv(indexes[j],width) - (height-1)/2) * vgrid * scale], a>90,a>90,a%180);
			picoChar(hands[j], -1, xy[1],xy[2], a,scale2);
		}
	}
}
