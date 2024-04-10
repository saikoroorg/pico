const title = "Hex"; // Title.

const sprites = { // Sprite table.
	"P": picoStringCode6("077222232242223233243324334344"),
	"R": picoStringCode6("077211231251212222232242252213223233243253324334344315325335345355"),
	"N": picoStringCode6("077211221231241212222232242252233243324334344315325335345355"),
	"B": picoStringCode6("077230221231241212222232242252223233243324334344315325335345355"),
	"Q": picoStringCode6("077210230250221231241212222232242252223233243324334344315325335345355"),
	"K": picoStringCode6("077210220230240250211221231241251212222232242252223233243324334344315325335345355"),
	"p": picoStringCode6("077444434424443433423342332322"),
	"r": picoStringCode6("077444434424443433423342332322"),
	"n": picoStringCode6("077444434424443433423342332322"),
	"b": picoStringCode6("077444434424443433423342332322"),
	"q": picoStringCode6("077444434424443433423342332322"),
	"k": picoStringCode6("077444434424443433423342332322"),
	"#": picoStringCode6("0bb951941961932972923983914994915995916996927987938978949969959"),
	".": picoStringCode6("077"),
	"*": picoStringCode6("077"),
};
const colors = picoStringCode8("111555333222444000");

const board = 
	"           "+
	"           "+
	"           "+
	"   # # #   "+
	"  # # # #  "+
	" # # # # # "+
	"  # # # #  "+
	"   # # #   "+
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
const hgrid = 4, vgrid = 6, margin = 0, scale = 3, scale2 = 5, yflip = 1;
const icons = [
	picoStringCode6("077211231251212222232242252213223233243253324334344315325335345355"),
	picoStringCode6("077411431451412422432442452413423433443453324334344315325335345355"),
];

// Global variables.
var hands = [null,null], indexes = [-1,-1]; // Hand pieces and indexes of the piece table.
var landscape = -1; // 0 if portrait mode, 1 if landscape mode, and -1 if uninitialized.
var reverse = 0; // 0 if upright board, 1 if reverse board.

// Shuffle pieces.
function appShuffle() {
	let faces = "", codes = [];
	for (let j = 0; j < pieces.length; j++) {
		let code6 = [];
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
		let code6 = [];
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

		/*
		// Shuffle pieces.
		let faces = "", codes = [];
		for (let j = 0; j < pieces.length; j++) {
			let code6 = [];
			for (let i = 0; i < pieces[j].length; i++) {
				if (pieces[j][i] != movable && pieces[j][i] != holding && pieces[j][i] != nothing) {
					let l = code6.length;
					faces += pieces[j][i];
					code6[l+1] = picoMod(i,width) - offset;
					code6[l+2] = picoDiv(i,width) - offset;
				}
			}
			if (hands[j]) {
				let l = code6.length;
				faces += hands[j];
				code6[l+1] = picoMod(indexes[j],width) - offset;
				code6[l+2] = picoDiv(indexes[j],width) - offset;
			}
			codes[j] = code6;
		}
		for (let j = 0; j < codes.length; j++) {
			for (let i = 0; i < codes[j].length; i+=3) {
				let k = picoRandom(faces.length);
				let face = faces.charAt(k);
				faces = faces.slice(0,k) + faces.slice(k+1);
				codes[j][i] = picoStringCode6(face)[0];
			}
			picoSetCode6(codes[j], j);
		}
		picoReload();
		*/

		//reverse = reverse ? 0 : 1;
		//if (yflip) {
		//	for (let chars in sprites) {
		//		picoCharSprite(chars, picoSpriteFlip(sprites[chars],reverse,reverse));
		//	}
		//}
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
		let data = await picoSpriteData(icons[reverse]);
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
			let x = (picoMod(i,width) - (width-1)/2) * hgrid * scale;
			let y = (picoDiv(i,width) - (height-1)/2) * vgrid * scale;
			if (j ^ reverse) { // Transform positions for enemy pieces.
				x = -x;
				y = -y;
			}
			if (picoAction(x,y, hgrid-margin,vgrid-margin)) {
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
			} else if (picoMotion(x,y, hgrid-margin,vgrid-margin)) {
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
	picoText(board, -1, 0,0, hgrid*width,vgrid*height, 0,scale);
	for (let j = 0; j < pieces.length; j++) {
		picoText(pieces[j], -1, 0,0, hgrid*width,vgrid*height, j^reverse?180:0,scale);
	}
	for (let j = 0; j < pieces.length; j++) {
		if (hands[j]) {
			let x = (picoMod(indexes[j],width) - (width-1)/2) * hgrid * scale;
			let y = (picoDiv(indexes[j],width) - (height-1)/2) * vgrid * scale;
			if (j ^ reverse) { // Transform positions for enemy pieces.
				x = -x;
				y = -y;
			}
			picoChar(hands[j], -1, x,y, j^reverse?180:0,scale2);
		}
	}
}
