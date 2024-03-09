const title = "Chess"; // Title.

const sprites = { // Sprite table.
	"P": picoStringsCode6("077923933943924934944725735745"),
	"R": picoStringsCode6("077912932952913923933943953914924934944954725735745716726736746756"),
	"N": picoStringsCode6("077912922932942913923933943953934944725735745716726736746756"),
	"B": picoStringsCode6("077931922932942913923933943953924934944725735745716726736746756"),
	"Q": picoStringsCode6("077911931951922932942913923933943953924934944725735745716726736746756"),
	"K": picoStringsCode6("077930911921931941951912922932942952913923933943953924934944725735745716726736746756"),
	"p": picoStringsCode6("077223233243224234244325335345"),
	"r": picoStringsCode6("077212232252213223233243253214224234244254325335345316326336346356"),
	"n": picoStringsCode6("077212222232242213223233243253234244325335345316326336346356"),
	"b": picoStringsCode6("077231222232242213223233243253224234244325335345316326336346356"),
	"q": picoStringsCode6("077211231251222232242213223233243253224234244325335345316326336346356"),
	"k": picoStringsCode6("077230211221231241251212222232242252213223233243253224234244325335345316326336346356"),
	".": picoStringsCode6("077211221231241251212252213253214254215225235245255"),
};

var board = 
	".........."+
	"          "+
	" rnbkqbnr "+
	" pppppppp "+
	" ........ "+
	" ........ "+
	" ........ "+
	" ........ "+
	" PPPPPPPP "+
	" RNBKQBNR "+
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
