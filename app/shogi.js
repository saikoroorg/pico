const title = "Shogi"; // Title.

const sprites = { // Sprite table.
	"歩": picoStringCode6("099941922942952962923943914924934944954964974925945965916946956976947928938"),
	"香": picoStringCode6("099940950921931941912922932942952962972933943953914924944964974905925935945955965985926936946956966927967928938948958968"),
	"桂": picoStringCode6("099921961912922932952962972923963914924944954964974984915925935965906926936956966976907927967928948958968978988"),
	"銀": picoStringCode6("099921941951961912922932942972913923933943953963973904924944954964974915925935945955975916926936946966927947967977918928938948958988"),
	"金": picoStringCode6("099940931951922962913923933943953963973904944984925935945955965916946976927947967918928938948958968978"),
	"玉": picoStringCode6("099922932942952962943944925935945955965946976947987918928938948958968978"),
	"角": picoStringCode6("099940950931951912922932942952962972913943973914924934944954964974915945975916926936946956966976917977908968978"),
	"飛": picoStringCode6("099921931941951932952972903913933953983914934964974905915925935945955985916936956976917937957987908938968978988"),
	"と": picoStringCode6("099733734754745736737747757"),
	"杏": picoStringCode6("099741722732742752762733743753724744764715745775726736746756766727767728738748758768"),
	"圭": picoStringCode6("099741732742752743714724734744754764774745726736746756766747728738748758768"),
	"全": picoStringCode6("099740731751722762713723733743753763773704744784725735745755765726736746756766747718728738748758768778"),
	"馬": picoStringCode6("099721731741751761722742723733743753763724734744754764725745726736746756766776786707787708728748768788"),
	"竜": picoStringCode6("099740721731741751761732752713723733743753763773724744764725735745755765726746766727737747757767787748758768778788"),
	"王": picoStringCode6("099922932942952962943944925935945955965946947918928938948958968978"),
	"将": picoStringCode6("099520570521551561581502522532542582513523533553573514524544564574525535545555565575585516526546576507527557577528568578"),
	"棋": picoStringCode6("099520540570521541551561571581502512522532542572523533543553563573514524534544554564574515525545575506526536546556566576586507527547577528538588"),
	"▲": picoStringCode6("099541522532542552562523533543553563524534544554564515525535545555565575516526536546556566576517527537547557567577"),
	"△": picoStringCode6("099541522532552562523563524564515575516576517527537547557567577"),
	"▼": picoStringCode6("099958977967957947937976966956946936975965955945935984974964954944934924983973963953943933923982972962952942932922"),
	"▽": picoStringCode6("099358377367347337376336375335384324383323382372362352342332322"),
	"□": picoStringCode6("0bb1000aa011088"),
	"■": picoStringCode6("099000088"),
	"・": picoStringCode6("077"),
	"×": picoStringCode6("077"),
};
const colors = picoStringCode8("1115553332224440000i9p060n4000");

const board = 
	"　■■■■■■■■■■■　"+
	"　　　　　　　　　　　　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　□□□□□□□□□　　"+
	"　　　　　　　　　　　　　"+
	"　■■■■■■■■■■■　";
var pieces = [
	"　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　歩歩歩歩歩歩歩歩歩　・"+
	"　　・角・・・・・飛・　・"+
	"　　香桂銀金玉金銀桂香　・"+
	"　　　　　　　　　　　　・"+
	"　・・・・・・・・・・・・",
	"　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　・・・・・・・・・　・"+
	"　　歩歩歩歩歩歩歩歩歩　・"+
	"　　・角・・・・・飛・　・"+
	"　　香桂銀金王金銀桂香　・"+
	"　　　　　　　　　　　　・"+
	"　・・・・・・・・・・・・",
];
const flips = {
	"歩": "と", "と": "歩",
	"香": "杏", "杏": "香",
	"桂": "圭", "圭": "桂",
	"銀": "全", "全": "銀",
	"角": "馬", "馬": "角",
	"飛": "竜", "竜": "飛",
	"金": "金", "玉": "玉", "王": "王",
};
const movable = "・", holding = "×", nothing = "　";
const width = 13, height = 13, inside = 9;
const grid = 10, margin = 4, scale = 1.5, scale2 = 2.5;

var hands = [null,null], indexes = [-1,-1];

// Load.
async function appLoad() {
	await picoTitle(title);

	for (let chars in sprites) {
		picoCharSprite(chars, sprites[chars]);
	}
	picoCharLeading(grid,grid);
	picoColor(colors);
}

// Main.
async function appMain() {
	for (let j = 0; j < pieces.length; j++) {
		for (let i = 0; i < pieces[j].length; i++) {
			let x = (picoMod(i,width) - (width/2 - 0.5)) * grid * scale;
			let y = (picoDiv(i,width) - (height/2 - 0.5)) * grid * scale;
			if (j == 1) { // Transform positions for enemy pieces.
				x = -x;
				y = -y;
			}
			if (picoAction(x,y, grid-margin,grid-margin)) {
				// Dropping pieces.
				if (hands[j]) {
					// Drop and switch with enemy piece.
					if (pieces[j?0:1][pieces[j].length-1-i] != movable && pieces[j?0:1][pieces[j].length-1-i] != nothing) {
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
						hands[j] = pieces[j?0:1][pieces[j].length-1-i];
						pieces[j?0:1] = pieces[j?0:1].slice(0,pieces[j].length-1-i) + movable + pieces[j?0:1].slice(pieces[j].length-1-i+1);
					// Drop and flip holding piece.
					} else if (pieces[j][i] == holding && flips[hands[j]]) {
						pieces[j] = pieces[j].slice(0,i) + flips[hands[j]] + pieces[j].slice(i+1);
						hands[j] = null;
					// Drop and switch with another piece.
					} else if (pieces[j][i] != movable) {
						let drop = hands[j];
						hands[j] = pieces[j][i];
						pieces[j] = pieces[j].slice(0,i) + drop + pieces[j].slice(i+1);
						indexes[j] = i;
					// Drop to vacant square.
					} else if (pieces[j][i] == movable) {
						pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
						hands[j] = null;
					}
				}
			} else if (picoMotion(x,y, grid-margin,grid-margin)) {
				// Move holding pieces to vacant square.
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
					indexes[j] = -1;
				// Hold pieces.
				} else if (!hands[j] && !hands[j?0:1] && pieces[j][i] != movable && pieces[j][i] != holding && pieces[j][i] != nothing) {
					hands[j] = pieces[j][i];
					indexes[j] = i;
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

	picoClear();
	picoRect(0, 0,0, grid*(inside+0.5),grid*(inside+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	for (let j = 0; j < pieces.length; j++) {
		picoText(pieces[j], -1, 0,0, grid*width,grid*height, j?180:0,scale);
	}
	for (let j = 0; j < pieces.length; j++) {
		if (hands[j]) {
			let x = (picoMod(indexes[j],width) - (width/2 - 0.5)) * grid * scale;
			let y = (picoDiv(indexes[j],width) - (height/2 - 0.5)) * grid * scale;
			if (j == 1) { // Transform positions for enemy pieces.
				x = -x;
				y = -y;
			}
			picoChar("■", -1, x,y, j?180:0,scale);
			picoChar(hands[j], -1, x,y, j?180:0,scale2);
		}
	}
}
