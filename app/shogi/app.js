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
	"@": picoStringCode6("0dd1000cc022088"),
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
};
const backs = {
	"p":"P","l":"L","n":"N","s":"S","b":"B","r":"R",
};
const movable = ".", holding = "*", nothing = " ";
const width = 13, height = 13, inside = 9, offset = 1;
const grid = 12, margin = 6, scale = 1, scale2 = 2.5, yflip = 0;
const trans = [[-1,1+9,1,0],[1,0,-1,1+9]]; // Playlog transform matrixes.

// Global variables.
var hands = [null,null], indexes = [-1,-1]; // Hand pieces and indexes of the piece table.
var landscape = -1; // 0 if portrait mode, 1 if landscape mode, and -1 if uninitialized.
var reverse = 0; // 0 if upright board, 1 if reverse board.

// Playlog class.
Playlog = class {

	// constructor.
	constructor() {
		this.clear();
	}

	// Clear log.
	clear() {
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
					if (m[j+1] <= inside && m[j+2] <= inside) {
						c[j+1] = m[j+1] * trans[p0][0] + trans[p0][1];
						c[j+2] = m[j+2] * trans[p0][2] + trans[p0][3];
					} else if (m[j+1] > inside) {
						c[j+1] = m[j+2];
						c[j+2] = m[j+1];
					} else {
						c[j+1] = m[j+1];
						c[j+2] = m[j+2];
					}
				}
				console.log("LoadCode" + k + ": " + m + " -> " + c);
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
						if (c[j+1] <= inside && c[j+2] <= inside) {
							m[j+1] = (c[j+1] - trans[p0][1]) * trans[p0][0];
							m[j+2] = (c[j+2] - trans[p0][3]) * trans[p0][2];
						} else if ((c[j+1] > inside && !landscape) || (c[j+2] > inside && landscape)) {
							m[j+1] = c[j+2];
							m[j+2] = c[j+1];
						} else {
							m[j+1] = c[j+1];
							m[j+2] = c[j+2];
						}
					}
				}
				console.log("StoreCode" + k + ": " + c + " -> " + m);
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
			//for (let k = 0; k <= m.length - 6; k+=3) {
			for (let k = m.length-6; k >= 0; k-=3) {
				// W3 moves X2Y2 to X3Y3, so W3 unmoves X3Y3 to X2Y2 and remove U3.
				let x2 = m[k+1] + offset;
				let y2 = m[k+2] + offset;
				let l2 = x2 + y2*width;
				let p2 = picoCode6Char(m[k+3]);
				let x3 = m[k+4] + offset;
				let y3 = m[k+5] + offset;
				let l3 = x3 + y3*width;
				//m[k+3] = picoCharCode6(pieces[p0][l3]); // Change log for flip face.
				// Delete U3.
				console.log("Undo/Delete:" + p0 + " " + l3 + "(" + x3 + "," + y3 + ")");
				if (l3 != l2) {
					pieces[p0] = pieces[p0].slice(0,l3) + movable + pieces[p0].slice(l3+1);
				}
				// Change piece side on last move.
				if (m.length >= 9 && k >= m.length - 6 && l2 != l3) {
					let p0x = p0 ? 0 : 1;
					let l2x = pieces[p0x].length-1-l2; // Transform positions for enemy pieces.
					console.log("Undo/Unmove on enemy side:" + p0x + " " + l2x); // @todo; bugs on flipped.
					pieces[p0x] = pieces[p0x].slice(0,l2x) + p2 + pieces[p0x].slice(l2x+1);
				} else {
					// Unmove W3.
					console.log("Undo/Unmove:" + p0 + " " + l2 + "(" + x2 + "," + y2 + ") <- " + p2 + " " + l3 + "(" + x3 + "," + y3 + ")");
					pieces[p0] = pieces[p0].slice(0,l2) + p2 + pieces[p0].slice(l2+1);
				}
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
				//if (k == 0) {
				//	m[k+3] = picoCharCode6(pieces[p0][l1]); // Change log for flip face.
				//}
				let p2 = picoCode6Char(m[k+3]);
				let x2 = m[k+4] + offset;
				let y2 = m[k+5] + offset;
				let l2 = x2 + y2*width;
				if (x2 > inside || y2 > inside) {
					// Auto flip on outside piece.
					if (backs[p2] && backs[p2] != p2) {
						p2 = backs[p2];
					}
				}
				// Move P2.
				console.log("Redo/Move:" + p0 + " " + p2 + " " + l2 + "(" + x2 + "," + y2 + ")");
				pieces[p0] = pieces[p0].slice(0,l2) + p2 + pieces[p0].slice(l2+1);
				// Change piece side on last move.
				if (m.length >= 9 && k >= m.length - 6 && l1 != l2) {
					let p0x = p0 ? 0 : 1;
					let l1x = pieces[p0x].length-1-l1; // Transform positions for enemy pieces.
					console.log("Redo/Delete on enemy side:" + p0x + " " + l1x + "(" + x1 + "," + y1 + ") -> " + p2 + " " + l2 + "(" + x2 + "," + y2 + ")");
					if (l1x != l2) {
						pieces[p0x] = pieces[p0x].slice(0,l1x) + movable + pieces[p0x].slice(l1x+1);
					}
				} else {
					//m[k+3] = picoCharCode6(pieces[p0][l1]); // Update flip face for undo.
					// Delete U1.
					console.log("Redo/Delete:" + p0 + " " + l1 + "(" + x1 + "," + y1 + ") -> " + p2 + " " + l2 + "(" + x2 + "," + y2 + ")");
					if (l1 != l2) {
						pieces[p0] = pieces[p0].slice(0,l1) + movable + pieces[p0].slice(l1+1);
					}
				}
			}
			this.moves.push(m);
			return true;
		}
		return false;
	}

	// Add log.
	_add(p0, i0, piece, i1, target1=null, i2=0, target2=null) {
		console.log("Add log:" + this.moves.length +
			" " + p0 + " " + i0 + " " + piece + " " + i1 + " " + target1 + " " + i2 + " " + target2);
		let m = [p0];
		m[1] = picoMod(i0,width) - offset;
		m[2] = picoDiv(i0,width) - offset;
		m[3] = picoCharCode6(piece);
		m[4] = picoMod(i1,width) - offset;
		m[5] = picoDiv(i1,width) - offset;
		if (target1 && target2) {
			m[6] = picoCharCode6(target1);
			m[7] = picoMod(i1,width) - offset;
			m[8] = picoDiv(i1,width) - offset;
			m[9] = picoCharCode6(target2);
			m[10] = picoMod(i2,width) - offset;
			m[11] = picoDiv(i2,width) - offset;
		} else if (target1) {
			m[6] = picoCharCode6(target1);
			m[7] = picoMod(i2,width) - offset;
			m[8] = picoDiv(i2,width) - offset;
		}
		this.moves.push(m);
		console.log("Added " + this.moves.length + ": " + m);
	}

	// Add flip piece log.
	addFlip(p0, i0, piece, after) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			let x0 = m[1] + offset;
			let y0 = m[2] + offset;
			let l0 = x0 + y0*width;
			let x1 = m[4] + offset;
			let y1 = m[5] + offset;
			let l1 = x1 + y1*width;
			let x2 = m[7] + offset;
			let y2 = m[8] + offset;
			let l2 = x2 + y2*width;
			// Log formats.
			// Move:      P0 X0Y0 P1 X1Y1 (P1 moves XY0 -> XY1 by player P0)
			// MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1 (P1 moves XY0 -> XY1 and flips P1 -> Q2 by player P0)
			// Catch:     P0 X0Y0 P1 X1Y1 E2 X2Y2 (P1 moves XY0 -> XY1 and catches E2(enemy) XY1 -> XY2 by player P0)
			// CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3 (P1 moves XY0 -> XY1=XY2, flips P1 -> Q2 and catches E3(enemy) XY1=XY2 -> XY3 by player P0)
			//             0  1 2  3  4 5  6  7 8  9 1011
			if (m[0] == p0 && l1 == i0 && m[6] && m[4] == m[7] && m[5] == m[8]) {
				let p1 = picoCode6Char(m[3]);
				let p2 = picoCode6Char(m[6]);
				if (piece == p2 && after == p1) {
					if (m[9]) {
						// Cancel flip.
						this.moves.push(m.slice(0,5).concat(m.slice(9)));
						console.log("Canceled flip " + this.moves.length + ":" + m);
					} else {
						// Remove flip log.
						console.log("Removed flip " + this.moves.length + ":" + m);
					}
				} else {
					// Modify MoveFlip or CatchFlip.
					m[3] = piece;
					m[6] = after;
					this.moves.push(m);
					console.log("Modified flip " + this.moves.length + ":" + m);
				}
			} else if (m[0] == p0 && l1 == i0 && m[6]) {
				let target = picoCode6Char(m[6]);
				// Modify Catch.
				this._add(p0, l0, piece, l1, after, l2, target);
				console.log("Modified catch to flip " + this.moves.length + ":" + p0 + " " + i0 + " " + piece + " " + after + " " + l2 + " " + target);
			} else if (m[0] == p0 && l1 == i0 && !m[6]) {
				// Modify Move.
				this._add(p0, l0, piece, l1, after, l1);
				console.log("Modified move to flip " + this.moves.length + ":" + p0 + " " + i0 + " " + piece + " " + after + " " + l1);
			} else {
				// Not modify.
				this.moves.push(m);
				// New flip piece.
				if (piece != after) {
					this._add(p0, i0, piece, i0, after, i0);
					console.log("New flip piece:" + p0 + " " + i0 + " " + piece + " " + after);
				}
			}
		} else {
			// First flip piece.
			if (piece != after) {
				this._add(p0, i0, piece, i0, after, i0);
				console.log("First flip piece:" + p0 + " " + i0 + " " + piece + " " + after);
			}
		}
	}

	// Add move piece log.
	addMove(p0, i0, piece, i1) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			// Log formats.
			// Move:      P0 X0Y0 P1 X1Y1 (P1 moves XY0 -> XY1 by player P0)
			// MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1 (P1 moves XY0 -> XY1 and flips P1 -> Q2 by player P0)
			// Catch:     P0 X0Y0 P1 X1Y1 E2 X2Y2 (P1 moves XY0 -> XY1 and catches E2(enemy) XY1 -> XY2 by player P0)
			// CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3 (P1 moves XY0 -> XY1=XY2, flips P1 -> Q2 and catches E3(enemy) XY1=XY2 -> XY3 by player P0)
			//             0  1 2  3  4 5  6  7 8  9 1011
			if (m[0] == p0 && !m[9] && !(m[4] != m[7] && m[5] != m[8])) {
				// Modify Move or MoveFlip.
				m[4] = m[7] = picoMod(i1,width) - offset;
				m[5] = m[8] = picoDiv(i1,width) - offset;
				this.moves.push(m);
				console.log("Modified move " + this.moves.length + ":" + m);
			} else {
				// Not modify.
				this.moves.push(m);
				// New move piece.
				if (i1 != i0) {
					this._add(p0, i0, piece, i1);
					console.log("New move piece:" + p0 + " " + i0 + " " + piece + "->" + i1);
				}
			}
		} else {
			// First move piece.
			if (i1 != i0) {
				this._add(p0, i0, piece, i1);
				console.log("First move piece:" + p0 + " " + i0 + " " + piece + "->" + i1);
			}
		}
	}


	// Add catch target log.
	addCatch(p0, i0, piece, i1, target, i2) {
		this.undos = [];
		let m = this.moves.pop();
		if (m) {
			// Log formats.
			// Move:      P0 X0Y0 P1 X1Y1 (P1 moves XY0 -> XY1 by player P0)
			// MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1 (P1 moves XY0 -> XY1 and flips P1 -> Q2 by player P0)
			// Catch:     P0 X0Y0 P1 X1Y1 E2 X2Y2 (P1 moves XY0 -> XY1 and catches E2(enemy) XY1 -> XY2 by player P0)
			// CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3 (P1 moves XY0 -> XY1=XY2, flips P1 -> Q2 and catches E3(enemy) XY1=XY2 -> XY3 by player P0)
			//             0  1 2  3  4 5  6  7 8  9 1011
			if (m[0] == p0 && m[6] && m[4] == m[7] && m[5] == m[8]) {
				// Modify MoveFlip.
				let z2 = picoCode6Char(m[6]);
				this._add(p0, i0, piece, i1, z2, i2, target);
				console.log("Modified " + this.moves.length + ":" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
			} else if (m[0] == p0 && !m[6]) {
				// Modify Move.
				this._add(p0, i0, piece, i1, target, i2);
				console.log("Modified " + this.moves.length + ":" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
			} else {
				// Not modify.
				this.moves.push(m);
				// New catch target.
				this._add(p0, i0, piece, i1, target, i2);
				console.log("Not modify and new catch piece:" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
			}
		} else {
			// First catch target.
			this._add(p0, i0, piece, i1, target, i2);
			console.log("First catch target:" + p0 + " " + i0 + " " + piece + "->" + i1 + " " + target + "->" + i2);
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

	// Clear logs.
	} else {
		playlog.clear();
		picoLabel("select", ""+playlog.count());
	}

	/*// Reverse board.
	} else {
		reverse = reverse ? 0 : 1;
		if (yflip) {
			for (let chars in sprites) {
				picoCharSprite(chars, picoSpriteFlip(sprites[chars],reverse,reverse));
			}
		}
		picoFlush();
	}*/
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
				let x1 = picoMod(i,width) - offset;
				let y1 = picoDiv(i,width) - offset;
				code6[l] = picoCharCode6(pieces[j][i]);
				if (x1 <= inside && y1 <= inside) {
					code6[l+1] = x1 * trans[j][0] + trans[j][1];
					code6[l+2] = y1 * trans[j][2] + trans[j][3];
				} else if (x1 > inside) {
					code6[l+1] = y1;
					code6[l+2] = x1;
				} else {
					code6[l+1] = x1;
					code6[l+2] = y1;
				}
				console.log("Store " + j + ": " + x1 + " " + y1 + "<-" + pieces[j][i]);
			}
		}
		if (hands[j]) {
			let l = code6.length;
			let x1 = picoMod(indexes[j],width) - offset;
			let y1 = picoDiv(indexes[j],width) - offset;
			code6[l] = picoCharCode6(hands[j]);
			if (x1 <= inside && y1 <= inside) {
				code6[l+1] = x1 * trans[j][0] + trans[j][1];
				code6[l+2] = y1 * trans[j][2] + trans[j][3];
			} else if (x1 > inside) {
				code6[l+1] = y1;
				code6[l+2] = x1;
			} else {
				code6[l+1] = x1;
				code6[l+2] = y1;
			}
			console.log("Store " + l + ": " + x1 + " " + y1 + "<-" + hands[j]);
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
				for (let char in backs) {
					pieces[j] = pieces[j].replaceAll(char, movable);
				}
				for (let k = 0; k < params.length; k+=3) {
					let x, x1 = params[k+1];
					let y, y1 = params[k+2];
					let target = value[k];
					if (x1 <= inside && y1 <= inside) {
						x = (x1 - trans[j][1]) * trans[j][0] + offset;
						y = (y1 - trans[j][3]) * trans[j][2] + offset;
					} else {
						if ((x1 > inside && !landscape) || (y1 > inside && landscape)) {
							x = y1 + offset;
							y = x1 + offset;
						} else {
							x = x1 + offset;
							y = y1 + offset;
						}
						// Auto flip on outside piece.
						if (backs[target] && backs[target] != target) {
							target = backs[target];
						}
					}
					let l =	x + y*width;
					console.log("Load " + j + ": " + x + " " + y + "->" + target);
					if (l >= 0 && l < pieces[j].length) {
						if (pieces[j][l] == movable) {
							pieces[j] = pieces[j].slice(0,l) + target + pieces[j].slice(l+1);
						} else if (hands[j] == null) {
							hands[j] = target;
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
		for (let i = 0; i < playlog.moves.length; i++) {
			for (let j = 0; j < playlog.moves[i].length; j+=3) {
				if ((playlog.moves[i][j+1] > inside && !landscape) || (playlog.moves[i][j+2] > inside && landscape)) {
					let t = playlog.moves[i][j+1];;
					playlog.moves[i][j+1] = playlog.moves[i][j+2];
					playlog.moves[i][j+2] = t;
				}
			}
		}
		for (let i = 0; i < playlog.undos.length; i++) {
			for (let j = 0; j < playlog.undos[i].length; j+=3) {
				if ((playlog.undos[i][j+1] > inside && !landscape) || (playlog.undos[i][j+2] > inside && landscape)) {
					let t = playlog.undos[i][j+1];;
					playlog.undos[i][j+1] = playlog.undos[i][j+2];
					playlog.undos[i][j+2] = t;
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
								// Auto flip on outside piece.
								if (backs[target] && backs[target] != target) {
									target = backs[target];
								}
								pieces[j] = pieces[j].slice(0,l) + target + pieces[j].slice(l+1);
								target = null;
								break;
							}
						}
						// Switch holding pieces with target pieces.
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
						hands[j] = target;
					// Drop and flip holding piece.
					} else if (pieces[j][i] == holding) {
						console.log("Drop and flip holding piece:" + j + " " + pieces[j][i]);
						if (faces[hands[j]] && faces[hands[j]] != hands[j]) {
							// Add flip playlog.
							playlog.addFlip(j, indexes0[j], hands[j], faces[hands[j]]);
							hands[j] = faces[hands[j]];
							picoLabel("select", ""+playlog.count());
						} else if (backs[hands[j]] && backs[hands[j]] != hands[j]) {
							// Add flip playlog.
							playlog.addFlip(j, indexes0[j], hands[j], backs[hands[j]]);
							hands[j] = backs[hands[j]];
							picoLabel("select", ""+playlog.count());
						}
						// Move and flip holding pieces.
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
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
