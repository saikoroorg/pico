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

const board = 
	" @@@@@@@@@@ "+
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
	" @@@@@@@@@@ ";
var pieces = 
	"............"+
	".          ."+
	". rnbqkbnr ."+
	". pppppppp ."+
	". ........ ."+
	". ........ ."+
	". ........ ."+
	". ........ ."+
	". PPPPPPPP ."+
	". RNBQKBNR ."+
	".          ."+
	"............";
const movable = ".", holding = "*", nothing = " ";
const width = 12, height = 12, inside = 8;
const grid = 6, margin = 0, scale = 2.5, scale2 = 5;

var hand = null, index = -1;

// Load.
async function appLoad() {
	await picoTitle(title);

	for (let chars in sprites) {
		picoCharSprite(chars, sprites[chars]);
	}
	picoCharLeading(grid,grid);
}

// Main.
async function appMain() {
	for (let i = 0; i < pieces.length; i++) {
		let x = (picoMod(i,width) - (width/2 - 0.5)) * grid * scale;
		let y = (picoDiv(i,width) - (height/2 - 0.5)) * grid * scale;
		if (picoAction(x,y, grid-margin,grid-margin)) {
			// Dropping pieces.
			if (hand) {
				let drop = hand;
				// Drop and switch with another piece.
				if (pieces[i] != movable) {
					hand = pieces[i];
					index = i;
				// Drop to vacant square.
				} else {
					hand = null;
					index = -1;
				}
				pieces = pieces.slice(0,i) + drop + pieces.slice(i+1);
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
	}

	picoClear();
	picoRect(0, 0,0, grid*(inside+0.5),grid*(inside+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	picoText(pieces, -1, 0,0, grid*width,grid*height, 0,scale);
	if (hand) {
		let x = (picoMod(index,width) - (width/2 - 0.5)) * grid * scale;
		let y = (picoDiv(index,width) - (height/2 - 0.5)) * grid * scale;
		picoChar(hand, -1, x,y, 0,scale2);
	}
}
