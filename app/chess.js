const title = "Chess"; // Title.

const sprites = { // Sprite table.
	"p": picoStringsCode6("077423433443424434444325335345"),
	"r": picoStringsCode6("077412432452413423433443453414424434444454325335345316326336346356"),
	"n": picoStringsCode6("077412422432442413423433443453434444325335345316326336346356"),
	"b": picoStringsCode6("077431422432442413423433443453424434444325335345316326336346356"),
	"q": picoStringsCode6("077411431451422432442413423433443453424434444325335345316326336346356"),
	"k": picoStringsCode6("077430411421431441451412422432442452413423433443453424434444325335345316326336346356"),
	"P": picoStringsCode6("077223233243224234244325335345"),
	"R": picoStringsCode6("077212232252213223233243253214224234244254325335345316326336346356"),
	"N": picoStringsCode6("077212222232242213223233243253234244325335345316326336346356"),
	"B": picoStringsCode6("077231222232242213223233243253224234244325335345316326336346356"),
	"Q": picoStringsCode6("077211231251222232242213223233243253224234244325335345316326336346356"),
	"K": picoStringsCode6("077230211221231241251212222232242252213223233243253224234244325335345316326336346356"),
	".": picoStringsCode6("077211221231241251212252213253214254215225235245255"),
};

var board = 
	".........."+
	"          "+
	" rnbqkbnr "+
	" pppppppp "+
	" ........ "+
	" ........ "+
	" ........ "+
	" ........ "+
	" PPPPPPPP "+
	" RNBQKBNR "+
	"          "+
	"..........";
var piece = null, px = -1, py = -1;

const grid = 8, scale = 2;
var playing = 0; // Playing count.

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
	for (let i = 0; i < board.length; i++) {
		let x = (picoMod(i,10) - 4.5) * grid * scale;
		let y = (picoDiv(i,10) - 5.5) * grid * scale;
		if (picoAction(x,y, grid,grid)) {
			if (piece && board[i] == ".") {
				board = board.slice(0,i) + piece + board.slice(i+1);
				piece = null;
			}
		} else if (picoMotion(x,y, grid,grid)) {
			if (piece && board[i] == ".") {
				px = x;
				py = y;
			} else if (!piece && board[i] != "." && board[i] != " ") {
				piece = board[i];
				px = x;
				py = y;
				board = board.slice(0,i) + "." + board.slice(i+1);
			}
		}
	}

	picoClear();
	picoRect(0, 0,0, grid*8.5,grid*8.5, 0,scale);
	picoText(board, -1, 0,0, grid*10,grid*12, 0,scale);
	if (piece) {
		picoChar(piece, -1, px,py, 0,scale*2);
	}
}
