const title = "Shogi"; // Title.

const sprites = { // Sprite table.
	"歩": picoStringCode6("099941922942952962923943914924934944954964974925945965916946956976947928938"),
	"香": picoStringCode6("099940950921931941912922932942952962972933943953914924944964974905925935945955965985926936946956966927967928938948958968"),
	"桂": picoStringCode6("099921961912922932952962972923963914924944954964974984915925935965906926936956966976907927967928948958968978988"),
	"銀": picoStringCode6("099921941951961912922932942972913923933943953963973904924944954964974915925935945955975916926936946966927947967977918928938948958988"),
	"金": picoStringCode6("099940931951922962913923933943953963973904944984925935945955965916946976927947967918928938948958968978"),
	"玉": picoStringCode6("099910920930940950960970941942943914924934944954964974945946966947977908918928938948958968978988"),
	"角": picoStringCode6("099940950931951912922932942952962972913943973914924934944954964974915945975916926936946956966976917977908968978"),
	"飛": picoStringCode6("099921931941951932952972903913933953983914934964974905915925935945955985916936956976917937957987908938968978988"),
	"と": picoStringCode6("099631632643653634625626666637647657"),
	"杏": picoStringCode6("099641622632642652662633643653624644664615645675626636646656666627667628638648658668"),
	"圭": picoStringCode6("099641632642652643614624634644654664674645626636646656666647628638648658668"),
	"全": picoStringCode6("099640631651622662613623633643653663673604644684625635645655665626636646656666647618628638648658668678"),
	"馬": picoStringCode6("099621631641651661622642623633643653663624634644654664625645626636646656666676686607687608628648668688"),
	"竜": picoStringCode6("099640621631641651661632652613623633643653663673624644664625635645655665626646666627637647657667687648658668678688"),
	"王": picoStringCode6("099910920930940950960970941942943914924934944954964974945946947908918928938948958968978988"),
	"将": picoStringCode6("099920970921951961981902922932942982913923933953973914924944964974925935945955965975985916926946156976907927957977928968978"),
	"棋": picoStringCode6("099920940970921941951961971981902912922932942972923933943953963973914924934944954964974915925945975906926936946956966976986907927947977928938988"),
	"△": picoStringCode6("099341322332352362323363324364315375316376317327337347357367377"),
	"▲": picoStringCode6("099941922932942952962923933943953963924934944954964915925935945955965975916926936946956966976917927937947957967977"),
	"▽": picoStringCode6("099358377367347337376336375335384324383323382372362352342332322"),
	"▼": picoStringCode6("099958977967957947937976966956946936975965955945935984974964954944934924983973963953943933923982972962952942932922"),
	"□": picoStringCode6("0bb1000aa011088"),
	"■": picoStringCode6("099000088"),
	"・": picoStringCode6("099"),
	"×": picoStringCode6("099"),
};
const colors = picoStringCode8("1115553332224440i9p060n4f0i000");

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
const faces = {
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
const grid = 10, margin = 4, scale = 1.5, scale2 = 2;

var hand = null, index = -1, angle = 0;

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
	if (hand) {
		for (let i = 0; i < pieces[0].length; i++) {
			let x = (picoMod(i,width) - (width/2 - 0.5)) * grid * scale;
			let y = (picoDiv(i,width) - (height/2 - 0.5)) * grid * scale;
			let index0 = angle?pieces[0].length-1-i:i;
			let index1 = angle?i:pieces[0].length-1-i;
			let piece0 = pieces[angle?1:0][index0];
			let piece1 = pieces[angle?0:1][index1];

			if (picoAction(x,y, grid-margin,grid-margin)) {
				// Drop and switch with enemy piece.
				if (piece1 != movable && piece1 != nothing) {
					pieces[angle?1:0] = pieces[angle?1:0].slice(0,index0) + hand + pieces[angle?1:0].slice(index0+1);
					hand = piece1;
					index = index0;
					pieces[angle?0:1] = pieces[angle?0:1].slice(0,index1) + movable + pieces[angle?0:1].slice(index1+1);
				// Drop and flip holding piece.
				} else if (piece0 == holding && faces[hand]) {
					pieces[angle?1:0] = pieces[angle?1:0].slice(0,index0) + faces[hand] + pieces[angle?1:0].slice(index0+1);
					hand = null;
					index = -1;
				// Drop and switch with another piece.
				} else if (piece0 != movable) {
					pieces[angle?1:0] = pieces[angle?1:0].slice(0,index0) + hand + pieces[angle?1:0].slice(index0+1);
					hand = piece0;
					index = index0;
				// Drop to vacant square.
				} else if (piece0 == movable) {
					pieces[angle?1:0] = pieces[angle?1:0].slice(0,index0) + hand + pieces[angle?1:0].slice(index0+1);
					hand = null;
					index = -1;
				}
				break;
			} else if (picoMotion(x,y, grid-margin,grid-margin)) {
				// Move holding pieces to vacant square.
				if (piece0 != nothing && piece0 != holding) {
					if (pieces[angle?1:0][index] == holding) { // Reset holding square.
						pieces[angle?1:0] = pieces[angle?1:0].slice(0,i) + movable + pieces[angle?1:0].slice(i+1);
					}
					index = i;
				// Reverse holding pieces on enemy square.
				} else if (piece1 == movable && 
					(picoMod(i,width) < (width-inside)/2 || picoMod(i,width) > width-(width-inside)/2 ||
					 picoDiv(i,width) < (height-inside)/2 || picoDiv(i,width) > height-(height-inside)/2)) {
					angle = angle ? 0 : 180;
				}
				break;
			}
		}
		// Cancel holding pieces.
		if (index >= 0 && pieces[angle?1:0][index] == movable && picoAction()) {
			pieces[angle?1:0] = pieces[angle?1:0].slice(0,index) + hand + pieces[angle?1:0].slice(index+1);
			hand = null;
			index = -1;
		}
	} else {
		for (let i = 0; i < pieces[0].length; i++) {
			let x = (picoMod(i,width) - (width/2 - 0.5)) * grid * scale;
			let y = (picoDiv(i,width) - (height/2 - 0.5)) * grid * scale;
			// Hold pieces.
			if (picoMotion(x,y, grid-margin,grid-margin)) {
				let targets = [pieces[0][i], pieces[1][pieces[0].length-1-i]];
				for (let j = 0; j < targets.length; j++) {
					if (targets[j] != movable && targets[j] != holding && targets[j] != nothing) {
						hand = targets[j];
						index = j ? pieces[0].length-1-i : i;
						angle = j ? 180 : 0;
						pieces[j] = pieces[j].slice(0,index) + holding + pieces[j].slice(index+1);
					}
				}
				break;
			}
		}
	}

	picoClear();
	picoRect(0, 0,0, grid*(inside+0.5),grid*(inside+0.5), 0,scale);
	picoText(board, -1, 0,0, grid*width,grid*height, 0,scale);
	for (let j = 0; j < pieces.length; j++) {
		picoText(pieces[j], -1, 0,0, grid*width,grid*height, j?180:0,scale);
	}
	if (hand) {
		let x = (picoMod(index,width) - (width/2 - 0.5)) * grid * scale;
		let y = (picoDiv(index,width) - (height/2 - 0.5)) * grid * scale;
		picoChar(hand, -1, x,y, angle,scale2);
	}
}
