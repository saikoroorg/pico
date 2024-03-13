const title = "Chess"; // Title.

const sprites = { // Sprite table.
	"p": picoStringCode6("077422432442423433443324334344"),
	"r": picoStringCode6("077411431451412422432442452413423433443453324334344315325335345355"),
	"n": picoStringCode6("077411421431441412422432442452433443324334344315325335345355"),
	"b": picoStringCode6("077430421431441412422432442452423433443324334344315325335345355"),
	"q": picoStringCode6("077410430450421431441412422432442452423433443324334344315325335345355"),
	"k": picoStringCode6("077410420430440450411421431441451412422432442452423433443324334344315325335345355"),
	"P": picoStringCode6("077222232242223233243324334344"),
	"R": picoStringCode6("077211231251212222232242252213223233243253324334344315325335345355"),
	"N": picoStringCode6("077211221231241212222232242252233243324334344315325335345355"),
	"B": picoStringCode6("077230221231241212222232242252223233243324334344315325335345355"),
	"Q": picoStringCode6("077210230250221231241212222232242252223233243324334344315325335345355"),
	"K": picoStringCode6("077210220230240250211221231241251212222232242252223233243324334344315325335345355"),
	"#": picoStringCode6("077111121131141151112122132142152113123133143153114124134144154115125135145155"),
	"@": picoStringCode6("077011044"),
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
var pieces = 
	"  ........  "+
	"  ........  "+
	"..rnbqkbnr.."+
	"..pppppppp.."+
	"............"+
	"............"+
	"............"+
	"............"+
	"..PPPPPPPP.."+
	"..RNBQKBNR.."+
	"  ........  "+
	"  ........  ";
const sides = {
	"P":0,"R":0,"N":0,"B":0,"Q":0,"K":0,
	"p":1,"r":1,"n":1,"b":1,"q":1,"k":1,
};
const movable = ".", holding = "*", nothing = " ";
const width = 12, height = 12, inside = 8;
const grid = 6, margin = 0, scale = 2, scale2 = 5;

var hand = null, index = -1;
var landscape = false; // landscape mode.

// Load.
async function appLoad() {
	await picoTitle(title);
	for (let chars in sprites) {
		picoCharSprite(chars, sprites[chars]);
	}
	picoCharLeading(grid,grid);
	picoColor(colors);
	appResize();
}

// Resize.
async function appResize() {
	let r = picoWideScreen();
	if (landscape != r) { // Replace pieces on the outside of the board.
		landscape = r;
		for (let k = 0; k < width*(height-inside)/2; k++) {
			let l0 = pieces.length-1-k;
			let l1 = picoDiv(pieces.length-1-k,width)+picoMod(pieces.length-1-k,width)*width;
			let piece0 = pieces[l0], piece1 = pieces[l1];
			if (piece0 != movable || piece1 != movable) {
				pieces = pieces.slice(0,l0) + piece1 + pieces.slice(l0+1);
				pieces = pieces.slice(0,l1) + piece0 + pieces.slice(l1+1);
			}
		}
		picoFlush();
	}
}

// Main.
async function appMain() {
	for (let i = 0; i < pieces.length; i++) {
		let x = (picoMod(i,width) - (width-1)/2) * grid * scale;
		let y = (picoDiv(i,width) - (height-1)/2) * grid * scale;
		if (picoAction(x,y, grid-margin,grid-margin)) {
			// Dropping pieces.
			if (hand) {
				if (pieces[i] != movable) {
					// Drop and remove enemy pieces.
					if (sides[hand] != sides[pieces[i]]) {
						let enemy = pieces[i];
						pieces = pieces.slice(0,i) + movable + pieces.slice(i+1);
						for (let k = 0; k < width*(height-inside)/2; k++) {
							let l0 = pieces.length-1-k;
							let l1 = picoDiv(pieces.length-1-k,width)+picoMod(pieces.length-1-k,width)*width;
							let l = sides[hand] ? pieces.length-1-(landscape ? l1 : l0) : (landscape ? l1 : l0);
							if (pieces[l] == movable) {
								pieces = pieces.slice(0,l) + enemy + pieces.slice(l+1);
								enemy = null;
								break;
							}
						}
						// Switch holding pieces with enemy pieces if full.
						pieces = pieces.slice(0,i) + hand + pieces.slice(i+1);
						hand = enemy;
					}
				// Drop to empty square.
				} else {
					pieces = pieces.slice(0,i) + hand + pieces.slice(i+1);
					hand = null;
					index = -1;
				}
			}
		} else if (picoMotion(x,y, grid-margin,grid-margin)) {
			// Move holding pieces.
			if (hand && pieces[i] != nothing) {
				if (pieces[index] == holding) { // Reset holding square.
					pieces = pieces.slice(0,index) + movable + pieces.slice(index+1);
				}
				index = i;
				pieces = pieces.replace(holding, movable);
			// Hold pieces.
			} else if (pieces[i] != movable && pieces[i] != holding && pieces[i] != nothing) {
				hand = pieces[i];
				index = i;
				pieces = pieces.slice(0,i) + holding + pieces.slice(i+1);
			}
		}
	}
	// Cancel holding pieces.
	if (hand && pieces[index] == movable && picoAction()) {
		pieces = pieces.slice(0,index) + hand + pieces.slice(index+1);
		hand = null;
		index = -1;
	}

	picoClear();
	picoRect(0, 0,0, grid*(inside+0.5),grid*(inside+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	picoText(pieces, -1, 0,0, grid*width,grid*height, 0,scale);
	if (hand) {
		let x = (picoMod(index,width) - (width-1)/2) * grid * scale;
		let y = (picoDiv(index,width) - (height-1)/2) * grid * scale;
		picoChar(hand, -1, x,y, 0,scale2);
	}
}
