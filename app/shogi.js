const title = "Shogi"; // Title.

const sprites = { // Sprite table.
	"P": picoStringCode6("099941922942952962923943914924934944954964974925945965916946956976947928938"),
	"L": picoStringCode6("099940950921931941912922932942952962972933943953914924944964974905925935945955965985926936946956966927967928938948958968"),
	"N": picoStringCode6("099921961912922932952962972923963914924944954964974984915925935965906926936956966976907927967928948958968978988"),
	"S": picoStringCode6("099921941951961912922932942972913923933943953963973904924944954964974915925935945955975916926936946966927947967977918928938948958988"),
	"G": picoStringCode6("099940931951922962913923933943953963973904944984925935945955965916946976927947967918928938948958968978"),
	"Q": picoStringCode6("099911921931941951961971942943914924934944954964974945946966947977908918928938948958968978988"),
	"K": picoStringCode6("099911921931941951961971942943914924934944954964974945946947908918928938948958968978988"),
	"B": picoStringCode6("099940950931951912922932942952962972913943973914924934944954964974915945975916926936946956966976917977908968978"),
	"R": picoStringCode6("099921931941951932952972903913933953983914934964974905915925935945955985916936956976917937957987908938968978988"),
	"p": picoStringCode6("099632633634654664635645626627638648658668"),
	"l": picoStringCode6("099641622632642652662633643653624644664615645675626636646656666627667628638648658668"),
	"n": picoStringCode6("099641632642652643614624634644654664674645626636646656666647628638648658668"),
	"s": picoStringCode6("099640631651622662613623633643653663673604644684625635645655665626636646656666647618628638648658668678"),
	"b": picoStringCode6("099621631641651661622642623633643653663624634644654664625645626636646656666676686607687608628648668688"),
	"r": picoStringCode6("099640621631641651661632652613623633643653663673624644664625635645655665626646666627637647657667687648658668678688"),
	"■": picoStringCode6("099921951961922942972903923933953973914924944964925935945955965975985916926946966907927957967928968"),
	"□": picoStringCode6("099921941961912922932942952962972923943953963914924934944954964915925935945965906926936946956966976986907927947967928938978"),
	"▲": picoStringCode6("099941922932942952962923933943953963924934944954964915925935945955965975916926936946956966976917927937947957967977"),
	"△": picoStringCode6("099941922932952962923963924964915975916976917927937947957967977"),
	"▼": picoStringCode6("099911921931941951961971912922932942952962972913923933943953963973924934944954964925935945955965926936946956966947"),
	"▽": picoStringCode6("099911921931941951961971912972913973924964925965926936956966947"),
	"#": picoStringCode6("0dd1000cc0110aa"),
	"@": picoStringCode6("0bb0000aa"),
	".": picoStringCode6("099"),
	"*": picoStringCode6("099"),
};
const colors = picoStringCode8("1115553332224440i9p060n4f0i000");

const board = 
	"             "+
	"             "+
	"  #########  "+
	"  #########  "+
	"  #########  "+
	"  #########  "+
	"  #########  "+
	"  #########  "+
	"  #########  "+
	"  #########  "+
	"  #########  "+
	"             "+
	"             ";
var pieces = [
	"             "+
	"             "+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  PPPPPPPPP.."+
	"  .B.....R..."+
	"  LNSGQGSNL.."+
	"  .........  "+
	"  .........  ", // Upright pieces.
	"             "+
	"             "+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  ..........."+
	"  PPPPPPPPP.."+
	"  .B.....R..."+
	"  LNSGKGSNL.."+
	"  .........  "+
	"  .........  ", // Reverse pieces.
];
const faces = {
	"P":"p","L":"l","N":"n","S":"s","B":"b","R":"r","G":"G","Q":"Q","K":"K",
	"p":"P","l":"L","n":"N","s":"S","b":"B","r":"R",
};
const movable = ".", holding = "*", nothing = " ";
const width = 13, height = 13, inside = 9, offset = 1;
const grid = 12, margin = 4, scale = 1, scale2 = 2.5;

// Global variables.
var hands = [null,null], indexes = [-1,-1];
var landscape = false; // landscape mode.

// Action button.
async function appAction() {
	picoResetParams();

	// Share board with pieces.
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
	picoShareApp(); // Share.
}

// Load.
async function appLoad() {
	picoTitle(title);
	for (let chars in sprites) {
		picoCharSprite(chars, sprites[chars]);
	}
	picoColor(colors);
	picoCharLeading(grid,grid);

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

	picoLabel("action", "&");
	appResize();
}

// Resize.
async function appResize() {
	let r = picoWideScreen();
	if (landscape != r) { // Replace pieces on the outside of the board.
		landscape = r;
		for (let j = 0; j < pieces.length; j++) {
			for (let k = 0; k < width*(height-inside)/2; k++) {
				let l0 = pieces[j].length-1-k;
				let l1 = picoDiv(pieces[j].length-1-k,width)+picoMod(pieces[j].length-1-k,width)*width;
				let piece0 = pieces[j][l0], piece1 = pieces[j][l1];
				if (piece0 != movable || piece1 != movable) {
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
			if (j == 1) { // Transform positions for enemy pieces.
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

	picoClear();
	picoRect(0, 0,0, grid*(inside+0.5),grid*(inside+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	for (let j = 0; j < pieces.length; j++) {
		picoText(pieces[j], -1, 0,0, grid*width,grid*height, j?180:0,scale);
	}
	for (let j = 0; j < pieces.length; j++) {
		if (hands[j]) {
			let x = (picoMod(indexes[j],width) - (width-1)/2) * grid * scale;
			let y = (picoDiv(indexes[j],width) - (height-1)/2) * grid * scale;
			if (j == 1) { // Transform positions for enemy pieces.
				x = -x;
				y = -y;
			}
			picoChar(hands[j], -1, x,y, j?180:0,scale2);
		}
	}
}
