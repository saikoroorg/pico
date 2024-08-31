const title = "Chess"; // Title.

const sprites = { // Sprite table.
	"P": picoStringCode6("077222232242223233243324334344"),
	"R": picoStringCode6("077211231251212222232242252213223233243253324334344315325335345355"),
	"N": picoStringCode6("077211221231241212222232242252233243324334344315325335345355"),
	"B": picoStringCode6("077230221231241212222232242252223233243324334344315325335345355"),
	"Q": picoStringCode6("077210230250221231241212222232242252223233243324334344315325335345355"),
	"K": picoStringCode6("077210220230240250211221231241251212222232242252223233243324334344315325335345355"),
	"p": picoStringCode6("077444434424443433423342332322"),
	"r": picoStringCode6("077455435415454444434424414453443433423413342332322351341331321311"),
	"n": picoStringCode6("077455445435425454444434424414433423342332322351341331321311"),
	"b": picoStringCode6("077436445435425454444434424414443433423342332322351341331321311"),
	"q": picoStringCode6("077456436416445435425454444434424414443433423342332322351341331321311"),
	"k": picoStringCode6("077456446436426416455445435425415454444434424414443433423342332322351341331321311"),
	"#": picoStringCode6("077111121131141151112122132142152113123133143153114124134144154115125135145155"),
	".": picoStringCode6("077"),
	"*": picoStringCode6("077"),
	"@": picoStringCode6("077100066"),
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
var pieces = [
	"            "+
	"            "+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  PPPPPPPP.."+
	"  RNBQKBNR.."+
	"  ........  "+
	"  ........  ", // Upright pieces.
	"            "+
	"            "+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  .........."+
	"  pppppppp.."+
	"  rnbkqbnr.."+
	"  ........  "+
	"  ........  ", // Reverse pieces.
];
const faces = {
	"P":"P","R":"R","N":"N","B":"B","Q":"Q","K":"K",
	"p":"p","r":"r","n":"n","b":"b","q":"q","k":"k",
};
const movable = ".", holding = "*", nothing = " ";
const width = 12, height = 12, inside = 8, offset = 1;
const grid = 6, margin = 0, scale = 2, scale2 = 5, yflip = 1;
const trans = [[1,0,-1,1+8],[-1,1+8,1,0]]; // Playlog transform matrixes.

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
			let m = this.moves[k];
			let p0 = m[0];
			// Transform to logcode.
			let c = [p0 + 1];
			if (p0 < pieces.length) {
				for (let j = 0; j < m.length; j+=3) {
					if (j >= 3) {
						c[j] = m[j];
					}
					if (m[j+1] > inside) {
						c[j+1] = m[j+2];
						c[j+2] = m[j+1];
					} else if (m[j+2] <= inside) {
						c[j+1] = m[j+1] * trans[p0][0] + trans[p0][1];
						c[j+2] = m[j+2] * trans[p0][2] + trans[p0][3];
					} else {
						c[j+1] = m[j+1];
						c[j+2] = m[j+2];
					}
				}
				console.log("GetCode" + k + ": " + m + " -> " + c);
				code6 = code6.concat(c);
			}
		}
		console.log("Moves:" + this.moves + " -> Code:" + code6);
		return code6;
	}

	// Set log by code.
	setCode6(code6) {
		this.moves = [];
		this.undos = [];
		let l = code6.length;
		for (let k = code6.length-3; k >=0; k-=3) {
			let p0 = code6[k] - 1;
			if (p0 < pieces.length) {
				let c = code6.slice(k, l);
				// Transform from logcode.
				let m = [p0];
				if (p0 < pieces.length) {
					for (let j = 0; j < c.length; j+=3) {
						if (j >= 3) {
							m[j] = c[j];
						}
						if (c[j+1] > inside) {
							m[j+1] = c[j+1];
							m[j+2] = c[j+2];
						} else if (c[j+2] <= inside) {
							m[j+1] = (c[j+1] - trans[p0][1]) * trans[p0][0];
							m[j+2] = (c[j+2] - trans[p0][3]) * trans[p0][2];
						} else {
							m[j+1] = c[j+1];
							m[j+2] = c[j+2];
						}
					}
				}
				console.log("SetCode" + k + ": " + c + " -> " + m);
				this.moves.unshift(m);
				l = k;
			}
		}
		console.log("Code:" + code6 + " -> Moves:" + this.moves);
	}

	// Undo move.
	undo() {
		let m = this.moves.pop();
		if (m) {
			// ????U2??U3 + P0 X1Y1 W1 X2Y2 W3 X3Y3
			// Undo1: W1 X1Y1 <- X2Y2: W1??W3????
			// Undo2: W3 X2Y2 <- X3Y3: ????W3????
			console.log("Undo:" + m);

			let p0 = m[0];
			for (let k = 0; k <= m.length - 6; k+=3) {
			//for (let k = m.length-6; k >= 0; k-=3) {
				// W3 moves X2Y2 to X3Y3, so W3 unmoves X3Y3 to X2Y2 and remove U3.
				let x2 = m[k+1] + offset;
				let y2 = m[k+2] + offset;
				let l2 = x2 + y2*width;
				let p2 = picoCode6Char(m[k+3]);
				let x3 = m[k+4] + offset;
				let y3 = m[k+5] + offset;
				let l3 = x3 + y3*width;
				m[k+3] = picoCharCode6(pieces[p0][l3]); // Change log for flip face.
				// Delete U3.
				console.log("Delete U3:" + p0 + " " + l3 + "(" + x3 + "," + y3);
				if (l3 != l2) {
					pieces[p0] = pieces[p0].slice(0,l3) + movable + pieces[p0].slice(l3+1);
				}
				// Change piece side on last move.
				if (k >= 3) {
					p0 = p0 ? 0 : 1;
					l2 = pieces[p0].length-1-l2; // Transform positions for enemy pieces.
				}
				// Unmove W3.
				console.log("Unmove W3:" + p0 + " " + l2 + "(" + x2 + "," + y2 + " <- " + p2 + " " + l3 + "(" + x3 + "," + y3);
				pieces[p0] = pieces[p0].slice(0,l2) + p2 + pieces[p0].slice(l2+1);
				//if (k == 0) {
				//	m[k+3] = picoCharCode6(pieces[p0][l3]); // Update flip face for redo.
				//}
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
			// Log: U1??U2???? ++ P0 X1Y1 W1 X2Y2 W3 X3Y3
			// Redo1: W1 X1Y1 -> X2Y2: ????W1??W3
			// Redo2: W3 X2Y2 -> X3Y3: U1??????W3
			console.log("Redo:" + m);

			let p0 = m[0];
			for (let k = 0; k <= m.length - 6; k+=3) {
			//for (let k = m.length-6; k >= 0; k-=3) {
				// W1 moves X1Y1 to X2Y2,
				let x1 = m[k+1] + offset;
				let y1 = m[k+2] + offset;
				let l1 = x1 + y1*width;
				let p2 = picoCode6Char(m[k+3]);
				let x2 = m[k+4] + offset;
				let y2 = m[k+5] + offset;
				let l2 = x2 + y2*width;
				if (k == 0) {
					m[k+3] = picoCharCode6(pieces[p0][l1]); // Change log for flip face.
				}
				// Move P2.
				console.log("Move P2:" + p0 + " " + p2 + " " + l2 + "(" + x2 + "," + y2);
				pieces[p0] = pieces[p0].slice(0,l2) + p2 + pieces[p0].slice(l2+1);
				// Change piece side on last move.
				if (k >= 3) {
					p0 = p0 ? 0 : 1;
					l1 = pieces[p0].length-1-l1; // Transform positions for enemy pieces.
				}
				//m[k+3] = picoCharCode6(pieces[p0][l1]); // Update flip face for undo.
				// Delete U1.
				console.log("Delete U1:" + p0 + " " + l1 + "(" + x1 + "," + y1 + " -> " + p2 + " " + l2 + "(" + x2 + "," + y2);
				if (l1 != l2) {
					pieces[p0] = pieces[p0].slice(0,l1) + movable + pieces[p0].slice(l1+1);
				}
			}
			this.moves.push(m);
			return true;
		}
		return false;
	}

	// Add log.
	_add(p0, i0, piece, i1, target=null, i2=0) {
		console.log("Add log:" + this.moves.length +
			" " + p0 + " " + i0 + " " + piece + " " + i1 + " " + target + " " + i2);
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
		console.log("Added:" + this.moves.length);
	}

	// Add flip piece log.
	addFlip(p0, i0, piece) {
		this.undos = [];
		let m = this.moves.pop();
		if (m && m[0] == p0) {
			let x0 = m[1] + offset;
			let y0 = m[2] + offset;
			let l0 = x0 + y0*width;
			let z = picoCode6Char(m[3]);
			let x1 = m[4] + offset;
			let y1 = m[5] + offset;
			let l1 = x1 + y1*width;
			if (m[0] == p0 && l0 != l1 && (l0 == i0 || l1 == i0)) {
				// Modify move.
				this.moves.push(m);
				console.log("Modify flip:" + p0 + " " + i0 + " " + piece);
			} else if (m[0] == p0 && i0 == l0 && l0 == l1) {
				// Cancel flip.
				console.log("Cancel flip:" + p0 + " " + i0 + " " + piece);
			} else {
				// Not modify.
				this.moves.push(m);
				// New flip piece.
				this._add(p0, i0, piece, i0);
				console.log("Not modify and new flip piece:" + p0 + " " + i0 + " " + piece);
			}
		} else {
			// New flip piece.
			this._add(p0, i0, piece, i0);
				console.log("New flip piece:" + p0 + " " + i0 + " " + piece);
		}
	}

	// Add move piece log.
	addMove(p0, i0, piece, i1) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			if (m[0] == p0 && m.length >= 9) {
				// Not modify for catching.
				this.moves.push(m);
				if (i1 != i0) {
					// New move piece.
					this._add(p0, i0, piece, i1);
					console.log("Not modify for catching and new move piece:" + p0 + " " + i0 + " " + piece + "->" + i1);
				}
			} else {
				let x0 = m[1] + offset;
				let y0 = m[2] + offset;
				let l0 = x0 + y0*width;
				let z = picoCode6Char(m[3]);
				let x1 = m[4] + offset;
				let y1 = m[5] + offset;
				let l1 = x1 + y1*width;
				if (m[0] == p0 && i0 == l1 && i1 != l0) { // l0->l1(i0)->i1
					// Change move.
					console.log("Change move:" + p0 + " " + l0 + "->" + l1 + " " + z + "->" + i1);
					this._add(p0, l0, z, i1);
				} else if (m[0] == p0 && i0 == l1 && i1 == l0 && z == piece) { // l0->l1->l0(i1)
					// Cancel move.
					console.log("Cancel move:" + p0 + " " + l0 + "->" + l1 + " " + z + "->" + i1);
				} else {
					// Not modify.
					this.moves.push(m);
					if (i1 != i0) {
						// New move piece.
						this._add(p0, i0, piece, i1);
						console.log("Not modify and new move piece:" + p0 + " " + i0 + " " + piece + "->" + i1);
					}
				}
			}
		} else if (i1 != i0) {
			// New move piece.
			this._add(p0, i0, piece, i1);
			console.log("New move piece:" + p0 + " " + i0 + " " + piece + "->" + i1);
		}
	}


	// Add catch target log.
	addCatch(p0, i0, piece, i1, target, i2) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			if (m[0] == p0 && m.length >= 9) {
				// Not modify for catching.
				this.moves.push(m);
				if (i1 != i0) {
					// New catch piece.
					this._add(p0, i0, piece, i1, target, i2);
					console.log("Not modify for catching and new catch target:" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
				}
			} else {
				let x0 = m[1] + offset;
				let y0 = m[2] + offset;
				let l0 = x0 + y0*width;
				let z = picoCode6Char(m[3]);
				let x1 = m[4] + offset;
				let y1 = m[5] + offset;
				let l1 = x1 + y1*width;
				if (m[0] == p0 && i0 == l1) { // l0->l1(i0)->i1
					// Change catch target.
					console.log("Change catch target:" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
					this._add(p0, l0, z, i1, target, i2);
				} else if (m[0] != p0 || i1 != i0) {
					// Not modify and new catch target.
					this.moves.push(m);
					this._add(p0, i0, piece, i1, target, i2);
					console.log("Not modify and new catch piece:" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
				}
			}
		} else {
			// New catch target.
			this._add(p0, i0, piece, i1, target, i2);
			console.log("New catch target:" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
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
	let data = await picoSpriteData(picoStringCode6("099941932942952923943963944915945975916976917927937947957967977"), -1);
	picoLabel("action", null, data);
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
						console.log("Drop and catch target pieces:" + j + " " + pieces[j][i]);
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
					} else if (pieces[j][i] == holding && faces[hands[j]]) {
						console.log("Drop and flip holding piece:" + j + " " + pieces[j][i]);
						if (faces[hands[j]] != hands[j]) {
							// Add flip playlog.
							playlog.addFlip(j, indexes0[j], hands[j]);
							picoLabel("select", ""+playlog.count());
						}
						// Move and flip holding pieces.
						pieces[j] = pieces[j].slice(0,i) + faces[hands[j]] + pieces[j].slice(i+1);
						hands[j] = null;
					// Drop on enemy square and reverse holding pieces.
					} else if (pieces[j?0:1][pieces[j].length-1-i] == movable && 
						(picoMod(i,width) < (width-inside)/2 || picoMod(i,width) > width-(width-inside)/2 ||
						 picoDiv(i,width) < (height-inside)/2 || picoDiv(i,width) > height-(height-inside)/2)) {
						console.log("Reverse holding pieces on enemy square:" + j + " " + pieces[j][i]);
						// Add move playlog.
						let l0 = pieces[j].length-1-indexes0[j];
						let l1 = pieces[j].length-1-indexes[j];
						playlog.addCatch(j?0:1, l0, movable, l0, hands[j], l1);
						picoLabel("select", ""+playlog.count());
						// Move and flip holding pieces.
						pieces[j?0:1] = pieces[j?0:1].slice(0,pieces[j].length-1-i) + hands[j] + pieces[j?0:1].slice(pieces[j].length-1-i+1);
						hands[j] = null;
					// Drop to empty square.
					} else if (pieces[j][i] == movable) {
						console.log("Drop to empty square:" + j + " " + pieces[j][i]);
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
					console.log("Move holding pieces to empty square:" + j + " " + pieces[j][i]);
					if (pieces[j][indexes[j]] == holding) { // Reset holding square.
						pieces[j] = pieces[j].slice(0,indexes[j]) + movable + pieces[j].slice(indexes[j]+1);
					}
					indexes[j] = i;
				// Move holding pieces on enemy square.
				} else if (pieces[j?0:1][pieces[j].length-1-i] == movable && 
					(picoMod(i,width) < (width-inside)/2 || picoMod(i,width) > width-(width-inside)/2 ||
					 picoDiv(i,width) < (height-inside)/2 || picoDiv(i,width) > height-(height-inside)/2)) {
					console.log("Reverse holding pieces on enemy square:" + j + " " + pieces[j][i]);
					indexes[j] = i;
				// Hold pieces.
				} else if (!hands[j] && !hands[j?0:1] && pieces[j][i] != movable && pieces[j][i] != holding && pieces[j][i] != nothing) {
					console.log("Hold pieces:" + j + " " + pieces[j][i]);
					hands[j] = pieces[j][i];
					indexes[j] = indexes0[j] = i;
					pieces[j] = pieces[j].slice(0,i) + holding + pieces[j].slice(i+1);
				}
			}
		}
		// Cancel holding pieces.
		if (hands[j] && pieces[j][indexes[j]] == movable && picoAction()) {
			console.log("Cancel holding pieces:" + j + " " + indexes[j]);
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
