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
	"と": picoStringCode6("099533534554545536537547557"),
	"杏": picoStringCode6("099541522532542552562533543553524544564515545575526536546556566527567528538548558568"),
	"圭": picoStringCode6("099541532542552543514524534544554564574545526536546556566547528538548558568"),
	"全": picoStringCode6("099540531551522562513523533543553563573504544584525535545555565526536546556566547518528538548558568578"),
	"馬": picoStringCode6("099521531541551561522542523533543553563524534544554564525545526536546556566576586507587508528548568588"),
	"竜": picoStringCode6("099540521531541551561532552513523533543553563573524544564525535545555565526546566527537547557567587548558568578588"),
	"・": picoStringCode6("077"),
	"×": picoStringCode6("077"),
	"□": picoStringCode6("0bb3003103203303403503603703803903a03013a13023a23033a33043a43053a53063a63073a73083a83093a930a31a32a33a34a35a36a37a38a39a3aa"),
	"■": picoStringCode6("077300310320330340350360301311321331341351361302312322332342352362303313323333343353363304314324334344354364305315325335345355365306316326336346356366"),
};
const colors = [255,255,255, 159,255,247, 255,223,175, 191,191,191, 0,119,239, 231,0,95, 0,151,63, 143,0,119, 167,0,0, 0,63,23]; // 10 colors from the 5 bits.

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
	"　　　　　　　　　　　　・"+
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
	"　　　　　　　　　　　　・"+
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
];
const width = 13, height = 13, square = 9;
const grid = 10, scale = 1.5, scale2 = 2;
const movable = "・", picked = "×", space = "　";
const flips = {
	"歩": "と", "と": "歩",
	"香": "杏", "杏": "香",
	"桂": "圭", "圭": "桂",
	"銀": "全", "全": "銀",
	"金": "金", "金": "金",
	"玉": "玉", "玉": "玉",
	"角": "馬", "馬": "角",
	"飛": "竜", "竜": "飛",
};

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
			if (j == 1) {
				x = -x;
				y = -y;
			}
			if (picoAction(x,y, grid,grid)) {
				if (hands[j] &&
					pieces[j?0:1][pieces[j].length-1-i] != movable &&
					pieces[j?0:1][pieces[j].length-1-i] != space) {
					pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
					hands[j] = pieces[j?0:1][pieces[j].length-1-i];
					indexes[j] = i;
					pieces[j?0:1] = pieces[j?0:1].slice(0,pieces[j].length-1-i) + movable + pieces[j?0:1].slice(pieces[j].length-1-i+1);
				} else if (hands[j] && pieces[j][i] == movable) {
					pieces[j] = pieces[j].slice(0,i) + hands[j] + pieces[j].slice(i+1);
					hands[j] = null;
				} else if (hands[j] && pieces[j?0:1][pieces[j].length-1-i] == movable) {
					pieces[j?0:1] = pieces[j?0:1].slice(0,pieces[j].length-1-i) + hands[j] + pieces[j?0:1].slice(pieces[j].length-1-i+1);
					hands[j] = null;
				} else if (hands[j] && pieces[j][i] == picked) {
					pieces[j] = pieces[j].slice(0,i) + flips[hands[j]] + pieces[j].slice(i+1);
					hands[j] = null;
				}
				pieces[j] = pieces[j].replace(picked, movable);
			} else if (picoMotion(x,y, grid,grid)) {
				if (hands[j] && pieces[j][i] == movable) {
					indexes[j] = i;
					pieces[j] = pieces[j].replace(picked, movable);
				} else if (hands[j] && pieces[j?0:1][pieces[j].length-1-i] == movable) {
					indexes[j] = i;
					pieces[j] = pieces[j].replace(picked, movable);
				} else if (!hands[j] && !hands[j?0:1] &&
					pieces[j][i] != movable &&
					pieces[j][i] != space) {
					hands[j] = pieces[j][i];
					indexes[j] = i;
					pieces[j] = pieces[j].slice(0,i) + picked + pieces[j].slice(i+1);
				}
			}
		}
		if (hands[j] && pieces[j][indexes[j]] == movable && picoAction()) {
			pieces[j] = pieces[j].slice(0,indexes[j]) + hands[j] + pieces[j].slice(indexes[j]+1);
			hands[j] = null;
		}
	}

	picoClear();
	picoRect(0, 0,0, grid*(square+0.5),grid*(square+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	for (let j = 0; j < pieces.length; j++) {
		picoText(pieces[j], -1, 0,0, grid*width,grid*height, !j?0:180,scale);
		if (hands[j]) {
			let x = (picoMod(indexes[j],width) - (width/2 - 0.5)) * grid * scale;
			let y = (picoDiv(indexes[j],width) - (height/2 - 0.5)) * grid * scale;
			if (j == 1) {
				x = -x;
				y = -y;
			}
			picoChar(hands[j], -1, x,y, !j?0:180,scale2);
		}
	}
}
