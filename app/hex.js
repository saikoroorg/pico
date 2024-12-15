const title = "Hexshogi"; // Title.

const sprites = { // Sprite table.
	"O": picoStringCode6("0qq,2c302h29608e2690eb,4d64894i948k4dk4ik,4aa4ba4ca4da4ea4fa4ga4db4dc4ad4bd4cd4dd4ed4fd4gd4de4df4ff4dg4gg49h4ah4bh4ch4dh4eh4fh4gh4hh"),//49908e3cc028"),//0qq3c002q39308n3660ek3390kh30i0q64aa4ba4ca4da4ea4fa4ga4db4dc4ad4bd4cd4dd4ed4fd4gd4de4df4ff4dg4gg49h4ah4bh4ch4dh4eh4fh4gh4hh"),//0qq3c002q39308n3660ek3390kh30i0q64aa4ba4ca4da4ea4fa4ga4db4dc4ad4bd4cd4dd4ed4fd4gd4de4df4ff4dg4gg49h4ah4bh4ch4dh4eh4fh4gh4hh"),//3c002q39308n3660ek3390kh30i0q64aa4ba4ca4da4ea4fa4ga4db4dc4ad4bd4cd4dd4ed4fd4gd4de4df4ff4dg4gg49h4ah4bh4ch4dh4eh4fh4gh4hh"),//0ii38001h36205f34409d3260db30c0h3466059388015"),//099340331341351322332342352362313323433443453363373314324434344454364374315325435345455365375306316326436346456366376386307317327437447457367377387318328338348358368378"),
	"I": picoStringCode6("0qq,2c302h29608e2690eb,4d6,4da4bb4db4eb4fb4bc4dc4ad4bd4cd4dd4ed4fd4gd4be4de4fe4af4df4ef4gf4dg4bh4ch"),//4c902e"),//0qq3c002q39308n3660ek3390kh30i0q64da4bb4db4eb4fb4bc4dc4ad4bd4cd4dd4ed4fd4gd4be4de4fe4af4df4ef4gf4dg4bh4ch"),//0qq3c002q39308n3660ek3390kh30i0q64da4bb4db4eb4fb4bc4dc4ad4bd4cd4dd4ed4fd4gd4be4de4fe4af4df4ef4gf4dg4bh4ch"),//3c002q39308n3660ek3390kh30i0q64da4bb4db4eb4fb4bc4dc4ad4bd4cd4dd4ed4fd4gd4be4de4fe4af4df4ef4gf4dg4bh4ch"),//0ii38001h36205f34409d3260db30c0h3486019"),//099340331341351322332342352362313323333443353363373314324334444354364374315325335445355365375306316326336446356366376386307317327337447357367377387318328338348358368378"),
	"X": picoStringCode6("0qq,2c302h29608e2690eb,4d64894i948k4ik,4ba4da4ea4fa4ab4bb4cb4db4gb4ac4bc4cc4dc4ec4fc4gc49d4bd4dd4ed4fd4gd4ae4be4ce4de4ee4ge4af4bf4cf4df4ff4bg4dg4fg4gg4ah4bh4ch4dh4eh4hh"),//08e38c0623ci062"),//0qq3c002q39308n3660ek3390kh30i0q64ba4da4ea4fa4ab4bb4cb4db4gb4ac4bc4cc4dc4ec4fc4gc49d4bd4dd4ed4fd4gd4ae4be4ce4de4ee4ge4af4bf4cf4df4ff4bg4dg4fg4gg4ah4bh4ch4dh4eh4hh"),//0qq3c002q39308n3660ek3390kh30i0q64ba4da4ea4fa4ab4bb4cb4db4gb4ac4bc4cc4dc4ec4fc4gc49d4bd4dd4ed4fd4gd4ae4be4ce4de4ee4ge4af4bf4cf4df4ff4bg4dg4fg4gg4ah4bh4ch4dh4eh4hh"),//3c002q39308n3660ek3390kh30i0q64ba4da4ea4fa4ab4bb4cb4db4gb4ac4bc4cc4dc4ec4fc4gc49d4bd4dd4ed4fd4gd4ae4be4ce4de4ee4ge4af4bf4cf4df4ff4bg4dg4fg4gg4ah4bh4ch4dh4eh4hh"),//0ii38001h36205f34409d3260db30c0h346605936803138c031"),//099340331341351322332342352362313323433443453363373314324334344454364374315325435445455365375306316326436346356366376386307317327437447457367377387318328338348358368378"),
	"Y": picoStringCode6("0qq,2c302h29608e2690eb,4d64894i94dk,4d94ca4ea4bb4fb4ac4bc4cc4dc4ec4fc4gc49d4dd4hd4be4ce4de4ee4fe4af4df4gf4bg4dg4fg4ah4bh4ch4dh4eh4fh4gh"),//49908e38c06238i062"),//0qq3c002q39308n3660ek3390kh30i0q64d94ca4ea4bb4fb4ac4bc4cc4dc4ec4fc4gc49d4dd4hd4be4ce4de4ee4fe4af4df4gf4bg4dg4fg4ah4bh4ch4dh4eh4fh4gh"),//0qq3c002q39308n3660ek3390kh30i0q64d94ca4ea4bb4fb4ac4bc4cc4dc4ec4fc4gc49d4dd4hd4be4ce4de4ee4fe4af4df4gf4bg4dg4fg4ah4bh4ch4dh4eh4fh4gh"),//3c002q39308n3660ek3390kh30i0q64d94ca4ea4bb4fb4ac4bc4cc4dc4ec4fc4gc49d4dd4hd4be4ce4de4ee4fe4af4df4gf4bg4dg4fg4ah4bh4ch4dh4eh4fh4gh"),//0ii38001h36205f34409d3260db30c0h346605936803136c031"),//099340331341351322332342352362313323433443453363373314324334344454364374315325435445455365375306316326336346456366376386307317327437447457367377387318328338348358368378"),
	"o": picoStringCode6("0qq,2c302h29608e2690eb,469022,199022,1f9022,4i9022,4cf025"),//0ii38001h36205f34409d3260db30c0h34480111680111a80114c801148c013"),//099340331027322046313065306081"),//099340331341351322332342352362313323333343353363373314424134344154464374315325335345355365375306316326336446356366376386307317327337447357367377387318328338348358368378"),
	"i": picoStringCode6("0qq,2c302h29608e2690eb,469022,199022,1f9022,4i9022,4cf025"),//0qq3c002q39308n3660ek3390kh30i0q646c02219c0221fc0224ic0224ci026"),//0ii38001h36205f34409d3260db30c0h34480111680111a80114c801148c013"),//099340331027322046313065306081"),//099340331341351322332342352362313323333343353363373314424134344154464374315325335345355365375306316326336446356366376386307317327337447357367377387318328338348358368378"),
	"x": picoStringCode6("0qq,2c302h29608e2690eb,469022,199022,1f9022,4i9022,4cf025"),//0qq3c002q39308n3660ek3390kh30i0q646c02219c0221fc0224ic0224ci026"),//0ii38001h36205f34409d3260db30c0h34480111680111a80114c801148c013"),//099340331027322046313065306081"),//099340331341351322332342352362313323333343353363373314424134344154464374315325335345355365375306316326336446356366376386307317327337447357367377387318328338348358368378"),
	"y": picoStringCode6("0qq,2c302h29608e2690eb,469022,199022,1f9022,4i9022,4cf025"),//0qq3c002q39308n3660ek3390kh30i0q646c02219c0221fc0224ic0224ci026"),//0ii38001h36205f34409d3260db30c0h34480111680111a80114c801148c013"),//099340331027322046313065306081"),//099340331341351322332342352362313323333343353363373314424134344154464374315325335345355365375306316326336446356366376386307317327337447357367377387318328338348358368378"),

	"P": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4d9"),//0qq4da4bb4db4eb4fb4bc4dc4ad4bd4cd4dd4ed4fd4gd4be4de4fe4af4df4ef4gf4dg4bh4ch"),//099441422442452462423443414424434444454464474425445465416446456476447428438"),
	"L": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4d9001"),//0qq4d94e94ba4ca4da4ab4bb4cb4db4eb4fb4gb4cc4dc4ec4ad4bd4dd4fd4gd49e4be4ce4de4ee4fe4he4bf4cf4df4ef4ff4bg4fg4bh4ch4dh4eh4fh"),//099440450421431441412422432442452462472433443453414424444464474405425435445455465485426436446456466427467428438448458468"),
	"N": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4b84f8"),//0qq4ba4fa4ab4bb4cb4eb4fb4gb4bc4fc4ad4bd4dd4ed4fd4gd4hd4ae4be4ce4fe49f4bf4cf4ef4ff4gf49g4bg4fg4bh4dh4eh4fh4gh4hh"),//099421461412422432452462472423463414424444454464474484415425435465406426436456466476407427467428448458468478488"),
	"S": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4a94d94g9,4ah4gh"),//0qq4ba4da4ea4fa4ab4bb4cb4db4gb4ac4bc4cc4dc4ec4fc4gc49d4bd4dd4ed4fd4gd4ae4be4ce4de4ee4ge4af4bf4cf4df4ff4bg4dg4fg4gg4ah4bh4ch4dh4eh4hh"),//099421441451461412422432442472413423433443453463473404424444454464474415425435445455475416426436446466427447467477418428438448458488"),
	"G": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4a94d94g9,4ad4gd,4dh"),//0qq4d94ca4ea4bb4fb4ac4bc4cc4dc4ec4fc4gc49d4dd4hd4be4ce4de4ee4fe4af4df4gf4bg4dg4fg4ah4bh4ch4dh4eh4fh4gh"),//099440431451422462413423433443453463473404444484425435445455465416446476427447467418428438448458468478"),
	"B": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4aa4ga,4994h9,4ag4gg,49h4hh"),//0qq4d94e94ca4ea4ab4bb4cb4db4eb4fb4gb4ac4dc4gc4ad4bd4cd4dd4ed4fd4gd4ae4de4ge4af4bf4cf4df4ef4ff4gf4ag4gg49h4fh4gh"),//099440450431451412422432442452462472413443473414424434444454464474415445475416426436446456466476417477408468478"),
	"R": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4d9001,49d010,4gd010,4dg001"),//0qq4ba4ca4da4ea4cb4eb4gb49c4ac4cc4ec4hc4ad4cd4fd4gd49e4ae4be4ce4de4ee4he4af4cf4ef4gf4ag4cg4eg4hg49h4ch4fh4gh4hh"),//099421431441451432452472403413433453483414434464474405415425435445455485416436456476417437457487408438468478488"),
	"K": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4a94d94g9,4ad4gd,4ah4dh4gh"),//0qq4aa4ba4ca4da4ea4fa4ga4db4dc4ad4bd4cd4dd4ed4fd4gd4de4df4ff4dg4gg49h4ah4bh4ch4dh4eh4fh4gh4hh"),//099411421431441451461471442443414424434444454464474445446466447477408418428438448458468478488"),
	"p": picoStringCode6("0qq,2c302h29608e2690eb,6cb0246bc042,6a96d96g9,6ad6gd,6dh"),//0qq6cb6cc6cd6ed6fd6ce6de6bf6bg6ch6dh6eh6fh"),//099632633634654664635645626627638648658668"),
	"l": picoStringCode6("0qq,2c302h29608e2690eb,6cb0246bc042,6a96d96g9,6ad6gd,6dh,1da"),//0qq6da6bb6cb6db6eb6fb6cc6dc6ec6bd6dd6fd6ae6de6ge6bf6cf6df6ef6ff6bg6fg6bh6ch6dh6eh6fh"),//099641622632642652662633643653624644664615645675626636646656666627667628638648658668"),
	"n": picoStringCode6("0qq,2c302h29608e2690eb,6cb0246bc042,6a96d96g9,6ad6gd,6dh,1b81f8"),//0qq6da6cb6db6eb6dc6ad6bd6cd6dd6ed6fd6gd6de6bf6cf6df6ef6ff6dg6bh6ch6dh6eh6fh"),//099641632642652643614624634644654664674645626636646656666647628638648658668"),
	"s": picoStringCode6("0qq,2c302h29608e2690eb,6cb0246bc042,6a96d96g9,6ad6gd,6dh,1ah1gh"),//0qq6d96ca6ea6bb6fb6ac6bc6cc6dc6ec6fc6gc69d6dd6hd6be6ce6de6ee6fe6bf6cf6df6ef6ff6dg6ah6bh6ch6dh6eh6fh6gh"),//099640631651622662613623633643653663673604644684625635645655665626636646656666647618628638648658668678"),
	"b": picoStringCode6("0qq,2c302h29608e2690eb,6cb0246bc042,6aa6ga,6996h9,6ag6gg,69h6hh,6d9,6ad6gd,6dh"),//0qq6ba6ca6da6ea6fa6bb6db6bc6cc6dc6ec6fc6bd6cd6dd6ed6fd6be6de6bf6cf6df6ef6ff6gf6hf69g6hg69h6bh6dh6fh6hh"),//099621631641651661622642623633643653663624634644654664625645626636646656666676686607687608628648668688"),
	"r": picoStringCode6("0qq,2c302h29608e2690eb,6cb0246bc042,6d9001,69d010,6gd010,6dg001,6a96g9,6ah6gh"),//0qq6d96ba6ca6da6ea6fa6cb6eb6ac6bc6cc6dc6ec6fc6gc6bd6dd6fd6be6ce6de6ee6fe6bf6df6ff6bg6cg6dg6eg6fg6hg6dh6eh6fh6gh6hh"),//099640621631641651661632652613623633643653663673624644664625635645655665626646666627637647657667687648658668678688"),
	"k": picoStringCode6("0qq,2c302h29608e2690eb,4cb0244bc042,4a94d84g9,4ad4gd,4dh"),//0qq4aa4ba4ca4da4ea4fa4ga4db4dc4ad4bd4cd4dd4ed4fd4gd4de4df4dg49h4ah4bh4ch4dh4eh4fh4gh4hh"),//099411421431441451461471442443414424434444454464474445446447408418428438448458468478488"),

	"#": picoStringCode6("0qq,1550gg0660ee"),//0ww25d0l527b0h92990dd2b709h"),//0ww 11d0t513b0p91590ld1770hh1950dl 23f0p225d0l527b0h92990dd2b709h//0vv14c0m61590kc1770gg1950ck05d0k406a0ia0880ee0a60ai"),//0vv13d0o415b0k81790gc1970cg1b508k05d0k407b0g80990cc0b708g"),//0jj1220ee0330cc"), 1380ka
	":": picoStringCode6("0qq,1da1dc1de1dg"),//0qq1da1dc1de1dg"),//0jj19719819919a19b"),//0jj19619819a19c"),//
	"/": picoStringCode6("0qq,1ao1cm1ek1gi"),//0jj17h18g19f1ae1bd"),//0jj16i18g1ae1cc"),//
	"¥": picoStringCode6("0qq,1ai1ck1em1go"),//0jj17d18e19f1ag1bh"),//0jj16c18e1ag1ci"),//
	"|": picoStringCode6("0qq,1a21c41e61g8"),//0jj1711821931a41b5"),//0jj1601821a41c6"),//
	"?": picoStringCode6("0qq,1a81c61e41g2"),//0jj1751841931a21b1"),//0jj1661841a21c0"),//
	".": picoStringCode6("066"),
	"*": picoStringCode6("066"),
};
const colors = picoStringCode8("111555333222444,0i9p060n4f0i000");//111555333222444000");

const board = 
	"             "+
	"             "+
	"     /#¥     "+
	"   /#¥:/#¥   "+
	"  #¥:/#¥:/#  "+
	"  :/#¥:/#¥:  "+
	"  # : # : #  "+
	"  :|#?:|#?:  "+
	"  #?:|#?:|#  "+
	"   |#?:|#?   "+
	"     |#?     "+
	"             "+
	"             ";
var pieces = [
	"             "+
	"             "+
	"      .     ."+
	"    .   .  . "+
	"  .   .   . ."+
	"    .   .  . "+
	"  .   .   . ."+
	"    .   .  . "+
	"  .   .   . ."+
	"    Y   X  . "+
	"      O     ."+
	"   . . . .   "+
	"  . . I I I  ", // Upright pieces.
	"             "+
	"             "+
	"      .     ."+
	"    .   .  . "+
	"  .   .   . ."+
	"    .   .  . "+
	"  .   .   . ."+
	"    .   .  . "+
	"  .   .   . ."+
	"    Y   X  . "+
	"      O     ."+
	"   . . . .   "+
	"  . . I I I  ", // Reverse pieces.
];
const faces = {
	"O":"o","I":"i","X":"x","Y":"y",
	"P":"p","L":"l","N":"n","S":"s","B":"b","R":"r","G":"G","K":"K","k":"k",
};
const backs = {
	"o":"O","i":"I","x":"X","y":"Y",
	"p":"P","l":"L","n":"N","s":"S","b":"B","r":"R",
};
const movable = ".", holding = "*", nothing = " ";
const width = 13, height = 13, inside = 9.5, offset = 1;
const grid = 15, margin = 6, scale = 0.75, scale2 = 1.25, yflip = 0;
const trans = [[-1,1+9,1,0],[1,0,-1,1+9]]; // Playlog transform matrixes.

// Global variables.
var hands = [null,null], indexes = [-1,-1]; // Hand pieces and indexes of the piece table.
var landscape = -1; // 0 if portrait mode, 1 if landscape mode, and -1 if uninitialized.
var angle = 0; // The angle of the board, 0 if upright board, 180 if reverse board.

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

	// Add flip piece log.
	addFlip(p0, i0, piece, after) {
		this.undos = [];
		let m = this.moves.pop();
		// For each log format.
		if (m) {
			let x1 = m[4] + offset;
			let y1 = m[5] + offset;
			let l1 = x1 + y1*width;

			// P1 moves from XY0 to XY1 by player P0.
			// * Move:      P0 X0Y0 P1 X1Y1
			//    v          0  1 2  3  4 5  6  7 8
			// * MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1
			if (m[0] == p0 && l1 == i0 && !m[6]) {
				// Modify move log.
				m[3] = picoCharCode6(piece);
				m[7] = m[4];
				m[8] = m[5];
				m[6] = picoCharCode6(after);
				this.moves.push(m);
				console.log("Modify move log to flip " + this.moves.length + ":" + m);

			// P1 on XY0 flips P1 to Q2 by player P0.
			// * Flip:      P0 X0Y0 P1 X0Y0 Q2 X0Y0
			//               0  1 2  3  4 5  6  7 8
			} else if (m[0] == p0 && l1 == i0 && !m[9] && m[1] == m[4] && m[2] == m[5] && m[4] == m[7] && m[5] == m[8]) {
				let p1 = picoCode6Char(m[3]);
				let p2 = picoCode6Char(m[6]);
				if (piece == p2 && after == p1) {
					// Remove flip log.
					console.log("Removed flip log " + this.moves.length + ":" + m);
				} else {
					// Modify flip log to different flip.
					m[3] = picoCharCode6(piece);
					m[6] = picoCharCode6(after);
					this.moves.push(m);
					console.log("Modify flip log " + this.moves.length + ":" + m);
				}

			// P1 moves from XY0 to XY1 and flips P1 to Q2 by player P0.
			// * MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1
			//               0  1 2  3  4 5  6  7 8
			} else if (m[0] == p0 && l1 == i0 && !m[9] && (m[1] != m[4] || m[2] != m[5]) && m[4] == m[7] && m[5] == m[8]) {
				// Modify flip on move log.
				m[3] = picoCharCode6(piece);
				m[6] = picoCharCode6(after);
				this.moves.push(m);
				console.log("Modify flip on move log " + this.moves.length + ":" + m);

			// P1 moves from XY0 to XY1=XY2
			// and catched enemy E3 on XY1 moves to XY3 by player P0.
			// * Catch:     P0 X0Y0 P1 X1Y1 E2 X2Y2
			//    v          0  1 2  3  4 5  6  7 8  9 1011
			// * CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3
			} else if (m[0] == p0 && l1 == i0 && !m[9] && (m[4] != m[7] || m[5] != m[8]) ) {
				// Modify catch log.
				m[3] = picoCharCode6(piece);
				m[9] = m[6];
				m[10] = m[7];
				m[11] = m[8];
				m[6] = picoCharCode6(after);
				m[7] = m[4];
				m[8] = m[5];
				this.moves.push(m);
				console.log("Modify catch log to flip " + this.moves.length + ":" + m);

			// P1 moves from XY0 to XY1=XY2, flips P1 to Q2
			// and catched enemy E3 on XY1 moves to XY3 by player P0.
			// * CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3
			//               0  1 2  3  4 5  6  7 8  9 1011
			} else if (m[0] == p0 && l1 == i0 && m[9] && m[4] == m[7] && m[5] == m[8]) {
				let p1 = picoCode6Char(m[3]);
				let p2 = picoCode6Char(m[6]);
				if (piece == p2 && after == p1) {
					// Cancel flip on catch log.
					m.splice(6, 3);
					this.moves.push(m);
					console.log("Cancel flip on catch log " + this.moves.length + ":" + m);
				} else {
					// Modify catch log to different flip.
					m[3] = picoCharCode6(piece);
					m[6] = picoCharCode6(after);
					this.moves.push(m);
					console.log("Modify catch log " + this.moves.length + ":" + m);
				}

			} else {
				// Not modify.
				this.moves.push(m);
				// New flip piece.
				if (piece != after) {
					m = [p0];
					m[1] = m[4] = m[7] = picoMod(i0,width) - offset;
					m[2] = m[5] = m[8] = picoDiv(i0,width) - offset;
					m[3] = picoCharCode6(piece);
					m[6] = picoCharCode6(after);
					this.moves.push(m);
					console.log("New flip log " + this.moves.length + ":" + m);
				}
			}

		} else {
			// First flip piece.
			if (piece != after) {
				m = [p0];
				m[1] = m[4] = m[7] = picoMod(i0,width) - offset;
				m[2] = m[5] = m[8] = picoDiv(i0,width) - offset;
				m[3] = picoCharCode6(piece);
				m[6] = picoCharCode6(after);
				this.moves.push(m);
				console.log("First flip log " + this.moves.length + ":" + m);
			}
		}
	}

	// Add move piece log.
	addMove(p0, i0, piece, i1) {
		this.undos = [];
		let m = this.moves.pop();
		// For each log format.
		if (m) {
			let x1 = m[4] + offset;
			let y1 = m[5] + offset;
			let l1 = x1 + y1*width;

			// P1 moves from XY0 to XY1 by player P0.
			// * Move:      P0 X0Y0 P1 X1Y1
			//               0  1 2  3  4 5  6  7 8
			// 
			// P1 on XY0 flips P1 to Q2 by player P0.
			// * Flip:      P0 X0Y0 P1 X0Y0 Q2 X0Y0
			//    v          0  1 2  3  4 5  6  7 8
			// * MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1
			// 
			// P1 moves from XY0 to XY1 and flips P1 to Q2 by player P0.
			// * MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1
			//               0  1 2  3  4 5  6  7 8
			if (m[0] == p0 && l1 == i0 && (!m[6] || (!m[9] && m[4] == m[7] && m[5] == m[8]))) {
				// Modify move log.
				m[4] = m[7] = picoMod(i1,width) - offset;
				m[5] = m[8] = picoDiv(i1,width) - offset;
				this.moves.push(m);
				console.log("Modify move log " + this.moves.length + ":" + m);

			// P1 moves from XY0 to XY1=XY2
			// and catched enemy E3 on XY1 moves to XY3 by player P0.
			// * Catch:     P0 X0Y0 P1 X1Y1 E2 X2Y2
			//               0  1 2  3  4 5  6  7 8
			// 
			// P1 moves from XY0 to XY1=XY2, flips P1 to Q2
			// and catched enemy E3 on XY1 moves to XY3 by player P0.
			// * CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3
			//               0  1 2  3  4 5  6  7 8  9 1011
			} else {
				// Not modify log.
				this.moves.push(m);
				// New move piece.
				if (i1 != i0) {
					m = [p0];
					m[1] = picoMod(i0,width) - offset;
					m[2] = picoDiv(i0,width) - offset;
					m[3] = picoCharCode6(piece);
					m[4] = picoMod(i1,width) - offset;
					m[5] = picoDiv(i1,width) - offset;
					this.moves.push(m);
					console.log("New move log " + this.moves.length + ":" + m);
				}
			}
		} else {
			// First move piece.
			if (i1 != i0) {
				m = [p0];
				m[1] = picoMod(i0,width) - offset;
				m[2] = picoDiv(i0,width) - offset;
				m[3] = picoCharCode6(piece);
				m[4] = picoMod(i1,width) - offset;
				m[5] = picoDiv(i1,width) - offset;
				this.moves.push(m);
				console.log("First move log " + this.moves.length + ":" + m);
			}
		}
	}


	// Add catch target log.
	addCatch(p0, i0, piece, i1, target, i2) {
		this.undos = [];
		let m = this.moves.pop();
		// For each log format.
		if (m) {
			let x1 = m[4] + offset;
			let y1 = m[5] + offset;
			let l1 = x1 + y1*width;

			// Move:      P0 X0Y0 P1 X1Y1
			//  v          0  1 2  3  4 5  6  7 8
			// Catch:     P0 X0Y0 P1 X1Y1 E2 X2Y2
			// P1 moves from XY0 to XY1 by player P0.
			if (m[0] == p0 && l1 == i0 && !m[6]) {
				// Modify move log.
				m[4] = picoMod(i1,width) - offset;
				m[5] = picoDiv(i1,width) - offset;
				m[6] = picoCharCode6(target);
				m[7] = picoMod(i2,width) - offset;
				m[8] = picoDiv(i2,width) - offset;
				this.moves.push(m);
				console.log("Modify move log to add catch " + this.moves.length + ":" + m);

			// Flip:      P0 X0Y0 P1 X0Y0 Q2 X0Y0
			//  v          0  1 2  3  4 5  6  7 8  9 1011
			// CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3
			// P1 on XY0 flips P1 -> Q2 by player P0.
			// 
			// MoveFlip:  P0 X0Y0 P1 X1Y1 Q2 X1Y1
			//  v          0  1 2  3  4 5  6  7 8  9 1011
			// CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3
			// P1 moves from XY0 to XY1 and flips P1 to Q2 by player P0.
			} else if (m[0] == p0 && l1 == i0 && !m[9] && m[4] == m[7] && m[5] == m[8]) {
				// Modify flip log.
				m[4] = m[7] = picoMod(i1,width) - offset;
				m[5] = m[8] = picoDiv(i1,width) - offset;
				m[9] = picoCharCode6(target);
				m[10] = picoMod(i2,width) - offset;
				m[11] = picoDiv(i2,width) - offset;
				this.moves.push(m);
				console.log("Modify flip log to add catch " + this.moves.length + ":" + m);

			// Catch:     P0 X0Y0 P1 X1Y1 E2 X2Y2
			//             0  1 2  3  4 5  6  7 8
			// P1 moves from XY0 to XY1=XY2
			// and catched enemy E3 on XY1 moves to XY3 by player P0.
			// 
			// CatchFlip: P0 X0Y0 P1 X1Y1 Q2 X1Y1 E3 X3Y3
			//             0  1 2  3  4 5  6  7 8  9 1011
			// P1 moves from XY0 to XY1=XY2, flips P1 -> Q2
			// and catched enemy E3 on XY1 moves to XY3 by player P0.
			} else {
				// Not modify catch log.
				this.moves.push(m);
				// New catch target.
				m = [p0];
				m[1] = picoMod(i0,width) - offset;
				m[2] = picoDiv(i0,width) - offset;
				m[3] = picoCharCode6(piece);
				m[4] = picoMod(i1,width) - offset;
				m[5] = picoDiv(i1,width) - offset;
				m[6] = picoCharCode6(target);
				m[7] = picoMod(i2,width) - offset;
				m[8] = picoDiv(i2,width) - offset;
				this.moves.push(m);
				console.log("New catch log " + this.moves.length + ":" + m);
			}
		} else {
			// First catch target.
			m = [p0];
			m[1] = picoMod(i0,width) - offset;
			m[2] = picoDiv(i0,width) - offset;
			m[3] = picoCharCode6(piece);
			m[4] = picoMod(i1,width) - offset;
			m[5] = picoDiv(i1,width) - offset;
			m[6] = picoCharCode6(target);
			m[7] = picoMod(i2,width) - offset;
			m[8] = picoDiv(i2,width) - offset;
			this.moves.push(m);
			console.log("First catch log " + this.moves.length + ":" + m);
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
