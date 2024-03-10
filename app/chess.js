const title = "Chess"; // Title.

const sprites = { // Sprite table.
	"p": picoStringCode6("099433443453434444454335345355"),
	"r": picoStringCode6("099422442462423433443453463424434444454464335345355326336346356366"),
	"n": picoStringCode6("099422432442452423433443453463444454335345355326336346356366"),
	"b": picoStringCode6("099441432442452423433443453463434444454335345355326336346356366"),
	"q": picoStringCode6("099421441461432442452423433443453463434444454335345355326336346356366"),
	"k": picoStringCode6("099440421431441451461422432442452462423433443453463434444454335345355326336346356366"),
	"P": picoStringCode6("099233243253234244254335345355"),
	"R": picoStringCode6("099222242262223233243253263224234244254264335345355326336346356366"),
	"N": picoStringCode6("099222232242252223233243253263244254335345355326336346356366"),
	"B": picoStringCode6("099241232242252223233243253263234244254335345355326336346356366"),
	"Q": picoStringCode6("099221241261232242252223233243253263234244254335345355326336346356366"),
	"K": picoStringCode6("099240221231241251261222232242252262223233243253263234244254335345355326336346356366"),
	".": picoStringCode6("077"),
	"x": picoStringCode6("077"),
	"#": picoStringCode6("077111121131141151112122132142152113123133143153114124134144154115125135145155"),
	"@": picoStringCode6("077011044"),
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

const width = 12, height = 12, square = 8;
const grid = 6, scale = 2.5;

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
		if (picoAction(x,y, grid,grid)) {
			if (hand) {
				let drop = hand;
				if (pieces[i] != ".") {
					hand = pieces[i];
					index = i;
				} else  {
					hand = null;
					index = -1;
				}
				pieces = pieces.slice(0,i) + drop + pieces.slice(i+1);
			}
			pieces = pieces.replace("x", ".");
		} else if (picoMotion(x,y, grid,grid)) {
			if (hand && pieces[i] != " ") {
				index = i;
				pieces = pieces.replace("x", ".");
			} else if (!hand && pieces[i] != "." && pieces[i] != " ") {
				hand = pieces[i];
				index = i;
				pieces = pieces.slice(0,i) + "x" + pieces.slice(i+1);
			}
		}
	}
	if (hand && pieces[index] == "." && picoAction()) {
		pieces = pieces.slice(0,index) + hand + pieces.slice(index+1);
		hand = null;
	}

	picoClear();
	picoRect(0, 0,0, grid*(square+0.5),grid*(square+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	picoText(pieces, -1, 0,0, grid*width,grid*height, 0,scale);
	if (hand) {
		let x = (picoMod(index,width) - (width/2 - 0.5)) * grid * scale;
		let y = (picoDiv(index,width) - (height/2 - 0.5)) * grid * scale;
		picoChar(hand, -1, x,y, 0,scale*2);
	}
}
