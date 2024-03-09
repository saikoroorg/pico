const title = "Chess"; // Title.

const sprites = { // Sprite table.
	"p": picoStringCode6("077423433443424434444325335345"),
	"r": picoStringCode6("077412432452413423433443453414424434444454325335345316326336346356"),
	"n": picoStringCode6("077412422432442413423433443453434444325335345316326336346356"),
	"b": picoStringCode6("077431422432442413423433443453424434444325335345316326336346356"),
	"q": picoStringCode6("077411431451422432442413423433443453424434444325335345316326336346356"),
	"k": picoStringCode6("077430411421431441451412422432442452413423433443453424434444325335345316326336346356"),
	"P": picoStringCode6("077223233243224234244325335345"),
	"R": picoStringCode6("077212232252213223233243253214224234244254325335345316326336346356"),
	"N": picoStringCode6("077212222232242213223233243253234244325335345316326336346356"),
	"B": picoStringCode6("077231222232242213223233243253224234244325335345316326336346356"),
	"Q": picoStringCode6("077211231251222232242213223233243253224234244325335345316326336346356"),
	"K": picoStringCode6("077230211221231241251212222232242252213223233243253224234244325335345316326336346356"),
	".": picoStringCode6("077211221231241251212252213253214254215225235245255"),
	"x": picoStringCode6("077111121131141151112152113153114154115125135145155"),
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

const width = 10, height = 12, square = 8;
const grid = 6, scale = 2.5;

var piece = null, index = -1;

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
		let x = (picoMod(i,width) - (width/2 - 0.5)) * grid * scale;
		let y = (picoDiv(i,width) - (height/2 - 0.5)) * grid * scale;
		if (picoAction(x,y, grid,grid)) {
			if (piece && board[i] == ".") {
				board = board.slice(0,i) + piece + board.slice(i+1);
				piece = null;
			}
			board = board.replace("x", ".");
		} else if (picoMotion(x,y, grid,grid)) {
			if (piece && board[i] == ".") {
				index = i;
				board = board.replace("x", ".");
			} else if (!piece && board[i] != "." && board[i] != " ") {
				piece = board[i];
				index = i;
				board = board.slice(0,i) + "x" + board.slice(i+1);
			}
		}
	}

	picoClear();
	picoRect(0, 0,0, grid*(square+0.5),grid*(square+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	if (piece) {
		let x = (picoMod(index,width) - (width/2 - 0.5)) * grid * scale;
		let y = (picoDiv(index,width) - (height/2 - 0.5)) * grid * scale;
		picoChar(piece, -1, x,y, 0,scale*2);
	}
}
