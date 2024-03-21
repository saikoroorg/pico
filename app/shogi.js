const title = "Shogi"; // Title.

const sprites = { // Sprite table.
	"P": picoStringCode6("099441422442452462423443414424434444454464474425445465416446456476447428438"),
	"L": picoStringCode6("099440450421431441412422432442452462472433443453414424444464474405425435445455465485426436446456466427467428438448458468"),
	"N": picoStringCode6("099421461412422432452462472423463414424444454464474484415425435465406426436456466476407427467428448458468478488"),
	"S": picoStringCode6("099421441451461412422432442472413423433443453463473404424444454464474415425435445455475416426436446466427447467477418428438448458488"),
	"G": picoStringCode6("099440431451422462413423433443453463473404444484425435445455465416446476427447467418428438448458468478"),
	"B": picoStringCode6("099440450431451412422432442452462472413443473414424434444454464474415445475416426436446456466476417477408468478"),
	"R": picoStringCode6("099421431441451432452472403413433453483414434464474405415425435445455485416436456476417437457487408438468478488"),
	"K": picoStringCode6("099411421431441451461471442443414424434444454464474445446466447477408418428438448458468478488"),
	"p": picoStringCode6("099632633634654664635645626627638648658668"),
	"l": picoStringCode6("099641622632642652662633643653624644664615645675626636646656666627667628638648658668"),
	"n": picoStringCode6("099641632642652643614624634644654664674645626636646656666647628638648658668"),
	"s": picoStringCode6("099640631651622662613623633643653663673604644684625635645655665626636646656666647618628638648658668678"),
	"b": picoStringCode6("099621631641651661622642623633643653663624634644654664625645626636646656666676686607687608628648668688"),
	"r": picoStringCode6("099640621631641651661632652613623633643653663673624644664625635645655665626646666627637647657667687648658668678688"),
	"k": picoStringCode6("099411421431441451461471442443414424434444454464474445446447408418428438448458468478488"),
	"#": picoStringCode6("0dd1000cc0110aa"),
	".": picoStringCode6("099"),
	"*": picoStringCode6("099"),
	"@": picoStringCode6("0dd1000cc"),
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
	"  LNSGKGSNL.."+
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
	"  LNSGkGSNL.."+
	"  .........  "+
	"  .........  ", // Reverse pieces.
];
const faces = {
	"P":"p","L":"l","N":"n","S":"s","B":"b","R":"r","G":"G","K":"K","k":"k",
	"p":"P","l":"L","n":"N","s":"S","b":"B","r":"R",
};
const movable = ".", holding = "*", nothing = " ";
const width = 13, height = 13, inside = 9, offset = 1;
const grid = 12, margin = 6, scale = 1, scale2 = 2.5, yflip = 0;
const icons = [
	picoStringCode6("099441422432442452462423433443453463424434444454464415425435445455465475416426436446456466476417427437447457467477"),
	picoStringCode6("099441422432452462423463424464415475416476417427437447457467477"),
];

// Global variables.
var hands = [null,null], indexes = [-1,-1]; // Hand pieces and indexes of the piece table.
var landscape = -1; // 0 if portrait mode, 1 if landscape mode, and -1 if uninitialized.
var reverse = 0; // 0 if upright board, 1 if reverse board.

// Playlog class.
Playlog = class {

	// constructor.
	constructor() {
		this.moves = [];
		this.undos = [];
	}

	// Log count.
	count() {
		return this.moves.length;
	}

	// Get last moved index.
	last() {
		let m = this.moves[this.moves.length-1];
		let p1 = m[0];
		let x2 = m[4] + offset;
		let y2 = m[5] + offset;
		let l2 = x2 + y2*width;
		return p1 ? pieces[p1].length-1-l2 : l2;
	}

	// Get log code.
	code6() {
		let code6 = [];
		for (let k = 0; k < this.moves.length; k++) {
			code6 = code6.concat(this.moves[k]);
		}
		return code6;
	}

	// Set log by code.
	setCode6(code6) {
		this.moves = [];
		this.undos = [];
		let l = code6.length;
		for (let k = code6.length; k >=0; k-=3) {
			if (code6[k] < pieces.length) {
				let p = code6.slice(k, l);
				this.moves.unshift(p);
				l = k;
			}
		}
	}

	// Undo move.
	undo() {
		let m = this.moves.pop();
		if (m) {
			let p0 = m[0];
			for (let k = m.length-6; k >= 0; k-=3) {
				// A moves 022 to 033,
				// so A unmoves 033 to 022 and remove 033.
				let p2 = p0;
				let x2 = m[k+1] + offset;
				let y2 = m[k+2] + offset;
				let l2 = x2 + y2*width;
				let z = picoCode6Char(m[k+3]);
				let x3 = m[k+4] + offset;
				let y3 = m[k+5] + offset;
				let l3 = x3 + y3*width;
				// Change piece side when inside(022) to outside(033) changes.
				if (x2 <= inside + offset && y2 <= inside + offset &&
					(x3 > inside + offset || y3 > inside + offset)) {
					p2 = p2 ? 0 : 1;
					l2 = pieces[p2].length-1-l2; // Transform positions for enemy pieces.
				}
				pieces[p2] = pieces[p2].slice(0,l2) + z + pieces[p2].slice(l2+1);
				m[k+3] = picoCharCode6(pieces[p2][l3]); // Update flip face for redo.
				if (l3 != l2) {
					pieces[p0] = pieces[p0].slice(0,l3) + movable + pieces[p0].slice(l3+1);
				}
			}
			this.undos.push(m);
			return true;
		}
		return false;
	}

	// Redo move.
	redo() {
		let m = this.undos.pop();
		if (m) {
			let p0 = m[0];
			for (let k = 0; k <= m.length - 6; k+=3) {
				// A moves 011 to 022,
				let x1 = m[k+1] + offset;
				let y1 = m[k+2] + offset;
				let l1 = x1 + y1*width;
				let z = picoCode6Char(m[k+3]);
				let p1 = p0;
				let x2 = m[k+4] + offset;
				let y2 = m[k+5] + offset;
				let l2 = x2 + y2*width;
				// Change piece side when inside(011) to outside(033) changes.
				if (x1 <= inside + offset && y1 <= inside + offset &&
					(x2 > inside + offset || y2 > inside + offset)) {
					p1 = p1 ? 0 : 1;
					l1 = pieces[p1].length-1-l1; // Transform positions for enemy pieces.
				}
				pieces[p0] = pieces[p0].slice(0,l2) + z + pieces[p0].slice(l2+1);
				m[k+3] = picoCharCode6(pieces[p1][l1]); // Update flip face for undo.
				if (l1 != l2) {
					pieces[p1] = pieces[p1].slice(0,l1) + movable + pieces[p1].slice(l1+1);
				}
			}
			this.moves.push(m);
			return true;
		}
		return false;
	}

	// Add log.
	_add(p0, i0, piece, i1, target=null, i2=0) {
		let m = [p0];
		m[1] = picoMod(i0,width) - offset;
		m[2] = picoDiv(i0,width) - offset;
		m[3] = picoCharCode6(piece);
		m[4] = picoMod(i1,width) - offset;
		m[5] = picoDiv(i1,width) - offset;
		if (target) {
			m[6] = picoCharCode6(target);
			m[7] = picoMod(i2,width) - offset;
			m[8] = picoDiv(i2,width) - offset;
		}
		this.moves.push(m);
	}

	// Add flip piece log.
	addFlip(p0, i0, piece) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			let x0 = m[1] + offset;
			let y0 = m[2] + offset;
			let l0 = x0 + y0*width;
			let z = picoCode6Char(m[3]);
			let x1 = m[4] + offset;
			let y1 = m[5] + offset;
			let l1 = x1 + y1*width;
			if (l0 != l1 && (l0 == i0 || l1 == i0)) {
				// Modify move.
				this.moves.push(m);
				console.log("Modify move.");
			} else if (l0 == l1) {
				// Cancel flip.
				console.log("Cancel flip.");
			} else {
				// Not modify.
				this.moves.push(m);
				// New flip piece.
				this._add(p0, i0, piece, i0);
				console.log("Not modify and new flip piece.");
			}
		} else {
			// New flip piece.
			this._add(p0, i0, piece, i0);
				console.log("New flip piece.");
		}
	}

	// Add move piece log.
	addMove(p0, i0, piece, i1) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			if (m.length >= 9) {
				// Not modify for catching.
				this.moves.push(m);
				if (i1 != i0) {
					// New move piece.
					this._add(p0, i0, piece, i1);
					console.log("Not modify and new move piece.");
				}
			} else {
				let x0 = m[1] + offset;
				let y0 = m[2] + offset;
				let l0 = x0 + y0*width;
				let z = picoCode6Char(m[3]);
				let x1 = m[4] + offset;
				let y1 = m[5] + offset;
				let l1 = x1 + y1*width;
				if (i0 == l1 && i1 != l0) { // l0->l1(i0)->i1
					// Change move.
					console.log("Change move.");
					this._add(p0, l0, z, i1);
				} else if (i0 == l1 && i1 == l0 && z == piece) { // l0->l1->l0(i1)
					// Cancel move.
					console.log("Cancel move.");
				} else {
					// Not modify.
					this.moves.push(m);
					if (i1 != i0) {
						// New move piece.
						this._add(p0, i0, piece, i1);
						console.log("Not modify and new move piece.");
					}
				}
			}
		} else if (i1 != i0) {
			// New move piece.
			this._add(p0, i0, piece, i1);
			console.log("New move piece.");
		}
	}


	// Add catch target log.
	addCatch(p0, i0, piece, i1, target, i2) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			if (m.length >= 9) {
				// Not modify for catching.
				this.moves.push(m);
				if (i1 != i0) {
					// New move piece.
					this._add(p0, i0, piece, i1, target, i2);
					console.log("Not modify and new move piece.");
				}
			} else {
				let x0 = m[1] + offset;
				let y0 = m[2] + offset;
				let l0 = x0 + y0*width;
				let z = picoCode6Char(m[3]);
				let x1 = m[4] + offset;
				let y1 = m[5] + offset;
				let l1 = x1 + y1*width;
				if (i0 == l1) { // l0->l1(i0)->i1
					// Change move.
					console.log("Change move.");
					this._add(p0, l0, z, i1, target, i2);
				} else if (i1 != i0) {
					// Not modify and new catch target.
					this.moves.push(m);
					this._add(p0, i0, piece, i1, target, i2);
					console.log("Not modify and new move piece.");
				}
			}
		} else {
			// New catch target.
			this._add(p0, i0, piece, i1, target, i2);
			console.log("New catch target.");
		}
	}
};

// Global variables.
var hands = [null,null], indexes = [-1,-1], indexes0 = [-1, -1]; // Hand pieces and indexes of the piece table.
var landscape = -1; // 0 if portrait mode, 1 if landscape mode, and -1 if uninitialized.
var reverse = 0; // 0 if upright board, 1 if reverse board.

var playlog = new Playlog(); // Playlog.

// Select button.
async function appSelect(x) {

	// Undo move.
	if (x < 0) {
		if (playlog.undo()) {
			picoLabel("select", ""+playlog.count());
			picoFlush();
		}

	// Redo move.
	} else if (x > 0) {
		if (playlog.redo()) {
			picoLabel("select", ""+playlog.count());
			picoFlush();
		}

	// Reverse board.
	} else {
		reverse = reverse ? 0 : 1;
		if (yflip) {
			for (let chars in sprites) {
				picoCharSprite(chars, picoSpriteFlip(sprites[chars],reverse,reverse));
			}
		}
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
	if (playlog.count()) {
		picoSetCode6(playlog.code6(), pieces.length);
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
		// Load move playlog by parameters 2.
		let j = pieces.length;
		let value = picoString(j);
		if (value) {
			playlog.setCode6(picoCode6(j));
		}
	}

	picoLabel("select", ""+playlog.count());
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
						// Catch target pieces.
						let target = pieces[j?0:1][pieces[j].length-1-i];
						pieces[j?0:1] = pieces[j?0:1].slice(0,pieces[j].length-1-i) + movable + pieces[j?0:1].slice(pieces[j].length-1-i+1);
						for (let k = 0; k < width*(height-inside)/2; k++) {
							let l0 = pieces[j].length-1-k;
							let l1 = picoDiv(pieces[j].length-1-k,width)+picoMod(pieces[j].length-1-k,width)*width;
							let l = landscape ? l1 : l0;
							// Add move and catch playlog.
							if (pieces[j][l] == movable) {
								playlog.addCatch(j, indexes0[j], hands[j], indexes[j], target, l);
								picoLabel("select", ""+playlog.count());
								pieces[j] = pieces[j].slice(0,l) + target + pieces[j].slice(l+1);
								target = null;
								break;
							}
						}
						// Switch holding pieces with target pieces.
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
						hands[j] = target;
					// Drop and flip holding piece.
					} else if (pieces[j][i] == holding && faces[hands[j]] != hands[j]) {
						// Add flip playlog.
						playlog.addFlip(j, indexes0[j], hands[j]);
						picoLabel("select", ""+playlog.count());
						// Move and flip holding pieces.
						pieces[j] = pieces[j].slice(0,i) + faces[hands[j]] + pieces[j].slice(i+1);
						hands[j] = null;
					// Drop to empty square.
					} else if (pieces[j][i] == movable) {
						// Add move playlog.
						playlog.addMove(j, indexes0[j], hands[j], indexes[j]);
						picoLabel("select", ""+playlog.count());
						// Move holding pieces.
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
	if (playlog.count()) {
		let l = playlog.last();
		let x = (picoMod(l,width) - (width-1)/2) * grid * scale;
		let y = (picoDiv(l,width) - (height-1)/2) * grid * scale;
		picoChar("@", -1, x,y, 0,scale);
	}
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
