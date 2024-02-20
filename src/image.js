/* PICO Image module */

// Mod.
function picoMod(a, b) {
	if (a >= 0 && b >= 0 || a <= 0 && b <= 0) {
		return Math.floor(a % b);
	} else {
		return Math.ceil(a % b);
	}
}

// Div.
function picoDiv(a, b) {
	if (a >= 0 && b >= 0 || a <= 0 && b <= 0) {
		return Math.floor(a / b);
	} else {
		return Math.ceil(a / b);
	}
}

// Square root.
function picoSqrt(x) {
	return Math.floor(Math.sqrt(x));
}

// Wait and flip image.
async function picoFlip(t=10) {
	try {
		await pico.image.flip(t);
	} catch (error) {
		console.error(error);
	}
}

// Clear image.
async function picoClear() {
	try {
		await pico.image.clear();
	} catch (error) {
		console.error(error);
	}
}

// Set image color pallete.
async function picoColor(colors=null) {
	try {
		pico.image.color(colors);
	} catch (error) {
		console.error(error);
	}
}

// Draw rect.
async function picoRect(c=0, x=0, y=0, width=1, height=1, angle=0, scale=1) {
	try {
		await pico.image.drawRect(c, x, y, width, height, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw char as string or number.
async function picoChar(char, c=0, x=0, y=0, angle=0, scale=1, cw=0) {
	try {
		await pico.image.drawChar("" + char, c, x, y, angle, scale, cw);
	} catch (error) {
		console.error(error);
	}
}

// Draw multiple lines of text.
async function picoText(text, c=0, x=0, y=0, width=0, height=0, angle=0, scale=1, cw=0, ch=0) {
	try {
		await pico.image.drawText("" + text, c, x, y, width, height, angle, scale, cw, ch);
	} catch (error) {
		console.error(error);
	}
}

// Get multiple lines of text image data.
async function picoTextData(text, color=null, x=0, y=0, width=0, height=0, angle=0, scale=1, cw=0, ch=0) {
	try {
		return await pico.image.textData("" + text, color, x, y, width, height, angle, scale, cw, ch);
	} catch (error) {
		console.error(error);
	}
}

// Draw sprite.
async function picoSprite(cells=[0,9,9,1,0,0], c=-1, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawSprite(cells, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Get sprite size.
function picoSpriteSize(cells=[0,9,9,1,0,0]) {
	try {
		return pico.image._spriteSize(cells);
	} catch (error) {
		console.error(error);
	}
}

// Get sprite image data.
async function picoSpriteData(cells=[0,9,9,1,0,0], colors=null, scale=10) {
	try {
		return await pico.image.spriteData(cells, colors, scale);
	} catch (error) {
		console.error(error);
	}
}

// Get screen data file.
async function picoScreenFile(bgcolors=null, watermark=null, cw=0, ch=0) {
	try {
		return await pico.image.screenFile(bgcolors, watermark, cw, ch);
	} catch (error) {
		console.error(error);
	}
}

// Load image file.
async function picoLoad(url) {
	try {
		return await pico.image.loadImage(url);
	} catch (error) {
		console.error(error);
	}
}

// Draw image data.
async function picoImage(image, x=0, y=0, angle=0, scale=1, frame=0, width=0, height=0) {
	try {
		await pico.image.drawImage(image, x, y, angle, scale, frame, width, height);
	} catch (error) {
		console.error(error);
	}
}

// Get image size.
function picoImageSize(image) {
	try {
		return image._size();
	} catch (error) {
		console.error(error);
	}
}

// Get image file.
function picoImageFile(image) {
	try {
		return image._file();
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Image class.
pico.Image = class {
	static debug = false; // Debug print.
	static width = 200; // Image width. (-width/2 .. width/2)
	static height = 200; // Image height. (-height/2 .. height/2)
	static ratio = 4; // Pixel ratio.
	static parent = "picoImage"; // Parent element id.

	static charWidth = 4;
	static charHeight = 6;

	static markChars = "./?!:-+=<>_^*#";
	static markShapes = [
		[0,2,0,0], // .
		[-1,2,0,0, 0,-1,0,2, 1,-2,0,0], // /
		[-1,-2,2,0, 1,-2,0,1, 0,0,0,0, 0,2,0,0], // ?
		[0,-2,0,2, 0,2,0,0], // !
		[0,-1,0,0, 0,1,0,0], // :
		[-1,0,2,0], // -
		[-1,0,2,0, 0,-1,0,2], // +
		[-1,-1,2,0, -1,1,2,0], // =
		[-1,0,0,0, 0,-1,0,0, 0,1,0,0, 1,-2,0,0, 1,2,0,0], // <
		[-1,-2,0,0, -1,2,0,0, 0,-1,0,0, 0,1,0,0, 1,0,0,0], // >
		[-1,1,0,0, 0,2,0,0, 1,1,0,0], // _
		[-1,-1,0,0, 0,-2,0,0, 1,-1,0,0], // ^
		[-1,-1,0,0, -1,1,0,0, 0,0,0,0, 1,-1,0,0, 1,1,0,0], // *
		[-1,-1,2,0, -1,-1,0,2, 1,-1,0,2, -1,1,2,0], // #
	];

	static numberShapes = [
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,4, -1,2,2,0], // 0
		[0,-2,0,4], // 1
		[-1,-2,2,0, 1,-2,0,2, -1,0,2,0, -1,0,0,2, -1,2,2,0], // 2
		[-1,-2,2,0, 1,-2,0,4, -1,0,2,0, -1,2,2,0], // 3
		[-1,-2,0,2, 1,-2,0,4, -1,0,2,0], // 4
		[-1,-2,2,0, -1,-2,0,2, -1,0,2,0, 1,0,0,2, -1,2,2,0], // 5
		[-1,-2,2,0, -1,-2,0,4, -1,0,2,0, 1,0,0,2, -1,2,2,0], // 6
		[-1,-2,2,0, 1,-2,0,4], // 7
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,4, -1,0,2,0, -1,2,2,0], // 8
		[-1,-2,2,0, -1,-2,0,2, 1,-2,0,4, -1,0,2,0, -1,2,2,0], // 9
	];

	static alphabetShapes = [
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,4, -1,0,2,0], // A
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,1, -1,0,1,0, 1,1,0,1, -1,2,2,0], // B
		[-1,-2,2,0, -1,-2,0,4, -1,2,2,0], // C
		[-1,-2,1,0, -1,-2,0,4, 1,-1,0,2, -1,2,1,0], // D
		[-1,-2,2,0, -1,-2,0,4, -1,0,2,0, -1,2,2,0], // E
		[-1,-2,2,0, -1,-2,0,4, -1,0,2,0], // F
		[-1,-2,2,0, -1,-2,0,4, -1,2,2,0, 1,0,0,1], // G
		[-1,-2,0,4, 1,-2,0,4, -1,0,2,0], // H
		[-1,-2,2,0, 0,-2,0,4, -1,2,2,0], // I
		[-1,1,0,1, 1,-2,0,4, -1,2,2,0], // J
		[-1,-2,0,4, -1,0,1,0, 1,-2,0,1, 1,1,0,1], // K
		[-1,-2,0,4, -1,2,2,0], // L
		[-1,-2,0,4, 0,-1,0,1, 1,-2,0,4], // M
		[-1,-2,0,4, -1,-2,2,0, 1,-2,0,4], // N
		[-1,-2,2,1, -1,-1,0,3, 1,-1,0,3, -1,2,2,0], // O
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,2, -1,0,2,0], // P
		[-1,-2,2,0, -1,-2,0,3, 1,-2,0,2, -1,1,1,0, 1,2,0,0], // Q
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,1, -1,0,1,0, 1,1,0,1], // R
		[-1,-2,2,0, -1,-2,0,1, 0,0,0,0, 1,1,0,1, -1,2,2,0], // S
		[-1,-2,2,0, 0,-2,0,4], // T
		[-1,-2,0,4, 1,-2,0,4, -1,2,2,0], // U
		[-1,-2,0,3, 1,-2,0,3, 0,2,0,0], // V
		[-1,-2,0,4, 0,0,0,1, 1,-2,0,4], // W
		[-1,-2,0,1, -1,1,0,1, 0,0,0,0, 1,-2,0,1, 1,1,0,1], // X
		[-1,-2,0,1, 0,0,0,2, 1,-2,0,1], // Y
		[-1,-2,2,0, 1,-2,0,1, 0,0,0,0, -1,1,0,1, -1,2,2,0], // Z
	];

	static katakanaShapes = [
		[-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,2,0,0,0,0,1,0,0,1,1,0,0,-1,2,0,0], // ァ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,0,-1,0,0,2,-1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,-1,2,0,0], // ア
		[0,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,-1,1,0,0,0,1,0,0,0,2,0,0], // ィ
		[2,-2,0,0,0,-1,0,0,1,-1,0,0,-1,0,0,0,0,0,0,0,-2,1,0,0,0,1,0,0,0,2,0,0], // イ
		[0,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // ゥ
		[0,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,2,0,0,0,1,1,0,0,0,2,0,0], // ウ
		[-1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ェ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // エ
		[1,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,1,2,0,0], // ォ
		[1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,1,0,0,0,-1,1,0,0,1,1,0,0,-2,2,0,0,1,2,0,0], // オ
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,2,0,0,0,-1,1,0,0,2,1,0,0,-2,2,0,0,1,2,0,0,2,2,0,0], // カ
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,2,0,0,0,-1,1,0,0,2,1,0,0,-2,2,0,0,1,2,0,0,2,2,0,0], // ガ
		[0,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,-2,1,0,0,-1,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,0,2,0,0], // キ
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,-2,1,0,0,-1,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,0,2,0,0], // ギ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,-1,-1,0,0,2,-1,0,0,-2,0,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ク
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,2,-1,0,0,-2,0,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // グ
		[-1,-2,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ケ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ゲ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,2,-1,0,0,2,0,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // コ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,2,-1,0,0,2,0,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ゴ
		[-1,-2,0,0,1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,1,1,0,0,0,2,0,0], // サ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,1,1,0,0,0,2,0,0], // ザ
		[-2,-2,0,0,-1,-2,0,0,2,-1,0,0,-2,0,0,0,-1,0,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // シ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,2,-1,0,0,-2,0,0,0,-1,0,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ジ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,2,-1,0,0,1,0,0,0,0,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,2,2,0,0], // ス
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,2,-1,0,0,1,0,0,0,0,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,2,2,0,0], // ズ
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,2,0,0,0,-1,1,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // セ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,2,0,0,0,-1,1,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ゼ
		[-2,-2,0,0,2,-2,0,0,-2,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,1,1,0,0,0,2,0,0], // ソ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,1,1,0,0,0,2,0,0], // ゾ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,-1,-1,0,0,2,-1,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // タ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,2,-1,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ダ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,0,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,-1,2,0,0], // チ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,0,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,-1,2,0,0], // ヂ
		[-2,0,0,0,0,0,0,0,2,0,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // ッ
		[-2,-2,0,0,0,-2,0,0,2,-2,0,0,-2,-1,0,0,0,-1,0,0,2,-1,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ツ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,0,-1,0,0,2,-1,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ヅ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,-1,2,0,0], // テ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,-1,2,0,0], // デ
		[-1,-2,0,0,-1,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-1,1,0,0,2,1,0,0,-1,2,0,0], // ト
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-1,1,0,0,2,1,0,0,-1,2,0,0], // ド
		[0,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,0,1,0,0,-1,2,0,0], // ナ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ニ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,2,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,2,2,0,0], // ヌ
		[0,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,1,0,0,0,-1,1,0,0,0,1,0,0,1,1,0,0,-2,2,0,0,0,2,0,0,2,2,0,0], // ネ
		[2,-2,0,0,2,-1,0,0,1,0,0,0,0,1,0,0,-2,2,0,0,-1,2,0,0], // ノ
		[0,-2,0,0,1,-1,0,0,-1,0,0,0,2,0,0,0,-2,1,0,0,2,1,0,0,-2,2,0,0,2,2,0,0], // ハ
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,1,-1,0,0,-1,0,0,0,2,0,0,0,-2,1,0,0,2,1,0,0,-2,2,0,0,2,2,0,0], // バ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,1,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-1,0,0,0,2,0,0,0,-2,1,0,0,2,1,0,0,-2,2,0,0,2,2,0,0], // パ
		[-2,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,-2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ヒ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,-2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ビ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,-2,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-2,0,0,0,-2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ピ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,2,-1,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // フ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,2,-1,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ブ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // プ
		[-1,-1,0,0,0,-1,0,0,-2,0,0,0,1,0,0,0,2,1,0,0], // ヘ
		[2,-3,0,0,4,-3,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,-2,0,0,0,1,0,0,0,2,1,0,0], // ベ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-2,0,0,0,1,0,0,0,2,1,0,0], // ペ
		[0,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,2,2,0,0], // ホ
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,2,2,0,0], // ボ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,0,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,2,2,0,0], // ポ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,0,1,0,0,1,2,0,0], // マ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-1,2,0,0,0,2,0,0,1,2,0,0], // ミ
		[0,-2,0,0,-1,-1,0,0,-1,0,0,0,1,0,0,0,-2,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,2,2,0,0], // ム
		[1,-2,0,0,-1,-1,0,0,1,-1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0], // メ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,-1,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-1,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // モ
		[-1,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,2,1,0,0,0,2,0,0], // ャ
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,2,0,0,0,0,1,0,0,0,2,0,0], // ヤ
		[-1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ュ
		[-1,-1,0,0,0,-1,0,0,1,-1,0,0,1,0,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ユ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,1,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0], // ョ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,2,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ヨ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,2,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0], // ラ
		[-1,-2,0,0,1,-2,0,0,-1,-1,0,0,1,-1,0,0,-1,0,0,0,1,0,0,0,1,1,0,0,0,2,0,0], // リ
		[-1,-2,0,0,1,-2,0,0,-1,-1,0,0,1,-1,0,0,-1,0,0,0,1,0,0,0,-1,1,0,0,1,1,0,0,-2,2,0,0,1,2,0,0,2,2,0,0], // ル
		[-2,-2,0,0,-2,-1,0,0,-2,0,0,0,2,0,0,0,-2,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0], // レ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,-2,-1,0,0,2,-1,0,0,-2,0,0,0,2,0,0,0,-2,1,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ロ
		[], // ヮ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,-2,-1,0,0,2,-1,0,0,2,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ワ
		[], // ヰ
		[], // ヱ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,2,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0], // ヲ
		[-2,-2,0,0,-1,-2,0,0,2,-2,0,0,2,-1,0,0,2,0,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0], // ン
	];

	static hiraganaShapes = [
		[], // ぁ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,-1,-1,0,0,2,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-2,1,0,0,-1,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,2,2,0,0], // あ
		[], // ぃ
		[-2,-2,0,0,-2,-1,0,0,2,-1,0,0,-2,0,0,0,2,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-1,2,0,0], // い
		[], // ぅ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,-2,0,0,0,2,0,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // う
		[], // ぇ
		[-1,-2,0,0,0,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,0,0,0,0,-1,1,0,0,0,1,0,0,-2,2,0,0,1,2,0,0,2,2,0,0], // え
		[], // ぉ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,2,-2,0,0,-1,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,2,2,0,0], // お
		[-1,-2,0,0,1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,-2,1,0,0,1,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // か
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,-2,1,0,0,1,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // が
		[0,-2,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // き
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ぎ
		[1,-2,0,0,-1,-1,0,0,0,-1,0,0,-2,0,0,0,-1,1,0,0,0,1,0,0,1,2,0,0], // く
		[2,-3,0,0,4,-3,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,-2,0,0,0,-1,1,0,0,0,1,0,0,1,2,0,0], // ぐ
		[-2,-2,0,0,1,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,1,1,0,0,0,2,0,0], // け
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,1,1,0,0,0,2,0,0], // げ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,1,-1,0,0,-2,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // こ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,1,-1,0,0,-2,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ご
		[0,-2,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,1,0,0,0,-2,1,0,0,-1,2,0,0,0,2,0,0], // さ
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,1,0,0,0,-2,1,0,0,-1,2,0,0,0,2,0,0], // ざ
		[-1,-2,0,0,-1,-1,0,0,-1,0,0,0,-1,1,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // し
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,-1,0,0,0,-1,1,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // じ
		[0,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,0,1,0,0,1,1,0,0,1,2,0,0], // す
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,0,1,0,0,1,1,0,0,1,2,0,0], // ず
		[-1,-2,0,0,1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,-1,1,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // せ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,1,0,0,0,-1,1,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ぜ
		[-1,-2,0,0,1,-2,0,0,-1,-1,0,0,0,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,1,2,0,0], // そ
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,1,0,0,1,2,0,0], // ぞ
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,-1,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // た
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,-1,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // だ
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-1,1,0,0,2,1,0,0,1,2,0,0], // ち
		[2,-3,0,0,4,-3,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-1,1,0,0,2,1,0,0,1,2,0,0], // ぢ
		[-1,0,0,0,0,0,0,0,1,0,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // っ
		[-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,0,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // つ
		[2,-3,0,0,4,-3,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,0,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // づ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,1,-1,0,0,0,0,0,0,0,1,0,0,1,2,0,0,2,2,0,0], // て
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,1,-1,0,0,0,0,0,0,0,1,0,0,1,2,0,0,2,2,0,0], // で
		[-2,-2,0,0,1,-2,0,0,2,-2,0,0,-1,-1,0,0,0,-1,0,0,-1,0,0,0,-2,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // と
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,-1,0,0,0,-2,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // ど
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // な
		[-2,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,-2,-1,0,0,-2,0,0,0,-2,1,0,0,0,1,0,0,-2,2,0,0,1,2,0,0,2,2,0,0], // に
		[-1,-2,0,0,1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,-2,1,0,0,-1,1,0,0,1,1,0,0,2,1,0,0,1,2,0,0,2,2,0,0], // ぬ
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-1,0,0,0,2,0,0,0,-2,1,0,0,-1,1,0,0,1,1,0,0,2,1,0,0,-1,2,0,0,1,2,0,0,2,2,0,0], // ね
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-2,-1,0,0,0,-1,0,0,2,-1,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,-2,1,0,0,-1,1,0,0,2,1,0,0,1,2,0,0], // の
		[-2,-2,0,0,1,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // は
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // ば
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,-2,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // ぱ
		[-2,-2,0,0,-1,-2,0,0,-1,-1,0,0,1,-1,0,0,-2,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ひ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,1,-1,0,0,-2,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // び
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,-2,-2,0,0,-1,-2,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,1,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-2,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // ぴ
		[0,-2,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-1,2,0,0,0,2,0,0], // ふ
		[2,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-1,2,0,0,0,2,0,0], // ぶ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,0,-2,0,0,2,-2,0,0,4,-2,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-1,2,0,0,0,2,0,0], // ぷ
		[-1,-1,0,0,0,-1,0,0,-2,0,0,0,1,0,0,0,2,1,0,0], // へ
		[2,-3,0,0,4,-3,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,-2,0,0,0,1,0,0,0,2,1,0,0], // べ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,2,-2,0,0,4,-2,0,0,-1,-1,0,0,0,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-2,0,0,0,1,0,0,0,2,1,0,0], // ぺ
		[-2,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // ほ
		[2,-3,0,0,4,-3,0,0,-2,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // ぼ
		[2,-3,0,0,3,-3,0,0,4,-3,0,0,-2,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,4,-2,0,0,-2,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,3,-1,0,0,4,-1,0,0,-2,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // ぽ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,2,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,-2,1,0,0,-1,1,0,0,0,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,2,2,0,0], // ま
		[-2,-2,0,0,-1,-2,0,0,-1,-1,0,0,1,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,-1,1,0,0,1,1,0,0,1,2,0,0], // み
		[-1,-2,0,0,1,-2,0,0,-2,-1,0,0,-1,-1,0,0,2,-1,0,0,-1,0,0,0,-2,1,0,0,-1,1,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,1,2,0,0,2,2,0,0], // む
		[-1,-2,0,0,1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,-2,1,0,0,-1,1,0,0,0,1,0,0,2,1,0,0,1,2,0,0], // め
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,-1,0,0,0,0,0,0,0,-2,1,0,0,-1,1,0,0,2,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0], // も
		[-1,-1,0,0,1,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,-1,1,0,0,2,1,0,0,-1,2,0,0], // ゃ
		[-2,-2,0,0,0,-2,0,0,1,-2,0,0,-1,-1,0,0,2,-1,0,0,-2,0,0,0,-1,0,0,0,1,0,0,0,2,0,0,0,-1,1,0,0,0,2,0,0], // や
		[0,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,2,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // ゅ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,2,-1,0,0,-2,0,0,0,0,0,0,0,2,0,0,0,-2,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,0,2,0,0], // ゆ
		[0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,-2,1,0,0,-1,1,0,0,0,1,0,0,1,1,0,0,2,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0], // ょ
		[0,-2,0,0,0,-1,0,0,1,-1,0,0,2,-1,0,0,0,0,0,0,-2,1,0,0,-1,1,0,0,0,1,0,0,1,1,0,0,-2,2,0,0,-1,2,0,0,0,2,0,0,2,2,0,0], // よ
		[0,-2,0,0,1,-2,0,0,-2,-1,0,0,-2,0,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-2,1,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // ら
		[-2,-2,0,0,1,-2,0,0,-2,-1,0,0,1,-1,0,0,-2,0,0,0,-1,0,0,0,1,0,0,0,1,1,0,0,-1,2,0,0,0,2,0,0], // り
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,-1,-1,0,0,0,-1,0,0,-2,0,0,0,1,0,0,0,2,0,0,0,-1,1,0,0,0,1,0,0,2,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0], // る
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,-1,0,0,0,1,0,0,0,-2,1,0,0,-1,1,0,0,1,1,0,0,-1,2,0,0,1,2,0,0,2,2,0,0], // れ
		[-1,-2,0,0,0,-2,0,0,1,-2,0,0,0,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-2,1,0,0,2,1,0,0,0,2,0,0,1,2,0,0], // ろ
		[], // ゎ
		[-1,-2,0,0,-2,-1,0,0,-1,-1,0,0,0,-1,0,0,1,-1,0,0,-1,0,0,0,2,0,0,0,-2,1,0,0,-1,1,0,0,2,1,0,0,-1,2,0,0,1,2,0,0], // わ
		[], // ゐ
		[], // ゑ
		[-2,-2,0,0,-1,-2,0,0,0,-2,0,0,1,-2,0,0,-1,-1,0,0,-1,0,0,0,0,0,0,0,1,0,0,0,-2,1,0,0,0,1,0,0,-1,2,0,0,0,2,0,0,1,2,0,0], // を
		[-2,-2,0,0,-2,-1,0,0,-2,0,0,0,-1,0,0,0,-2,1,0,0,0,1,0,0,2,1,0,0,-2,2,0,0,0,2,0,0,1,2,0,0], // ん
	];

	// Master image color. (5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000)
	static colors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0];

	// Wait and flip image.
	flip(t=10) {
		return new Promise(r => setTimeout(r, t)).then(() => {
			return navigator.locks.request(this.lock, async (lock) => {
				return this._flip();
			}); // end of lock.
		});
	}

	// Clear image.
	clear() {
		return navigator.locks.request(this.lock, async (lock) => {
			return this._clear();
		}); // end of lock.
	}

	// Set image color pallete.
	color(colors=null) {
		return navigator.locks.request(this.lock, async (lock) => {
			this._color(colors);
		}); // end of lock.
	}

	// Draw rect to image.
	drawRect(c=0, x=0, y=0, width=1, height=1, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				await this._draw(c, -(width-1)/2, -(height-1)/2, width-1, height-1);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw char as string or number to image.
	drawChar(char, c=0, x=0, y=0, angle=0, scale=1, cw=0) {
		const w = cw > 0 ? cw : pico.Image.charWidth;
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				let length = char.length;
				if (length >= 2) {
					await this._move(-(length-1)/2 * w, 0);
				}
				for (let i = 0; i < length; i++) {
					await this._char(char.charCodeAt(i), c);
					await this._move(w, 0);
				}
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw multiple lines of text to image.
	drawText(text, c=0, x=0, y=0, width=0, height=0, angle=0, scale=1, cw=1, ch=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._text(text, c, x, y, width, height, angle, scale, cw, ch);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw offscreen and get multiple lines of text image data.
	textData(text, color=null, x=0, y=0, width=0, height=0, angle=0, scale=1, cw=1, ch=1) {
		return navigator.locks.request(pico.image.offscreen.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await pico.image.offscreen._resize(width * scale, height * scale);
				await pico.image.offscreen._ready();
				await pico.image.offscreen._color(color);
				await pico.image.offscreen._text(text, -1, x, y, width, height, angle, scale, cw, ch);
				resolve(pico.image.offscreen._data());
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw sprite to image.
	drawSprite(cells=[0,9,9,1,0,0], c=-1, x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				await this._sprite(cells, c);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw offscreen and get sprite image data.
	spriteData(cells=[0,9,9,1,0,0], colors=null, scale=10) {
		return navigator.locks.request(pico.image.offscreen.lock, async (lock) => {
			return new Promise(async (resolve) => {
				let size = pico.image.offscreen._spriteSize(cells);
				await pico.image.offscreen._resize(size * scale, size * scale);
				await pico.image.offscreen._ready();
				await pico.image.offscreen._reset(0, 0, 0, scale);
				await pico.image.offscreen._color(colors);
				await pico.image.offscreen._sprite(cells, 0);
				resolve(pico.image.offscreen._data());
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw bg/watermark and get screen data file.
	async screenFile(bgcolors=null,  watermark=null, cw=0, ch=0) {
		if (!bgcolors && !watermark) {
			return await pico.image._file();
		}
		return navigator.locks.request(pico.image.offscreen.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await pico.image.offscreen._resize(
					pico.image.canvas[0].width/pico.Image.ratio,
					pico.image.canvas[0].height/pico.Image.ratio);
				await pico.image.offscreen._ready();
				await pico.image.offscreen._reset(0, 0, 0, 1);
				if (bgcolors) {
					await pico.image.offscreen._color(bgcolors);
					await pico.image.offscreen._draw(0, -pico.Image.width/2, -pico.Image.height/2, pico.Image.width, pico.Image.height);
				}
				await pico.image.offscreen._image(pico.image);
				if (watermark && watermark.length >= 2) {
					const w = cw > 0 ? cw : pico.Image.charWidth;
					const h = ch > 0 ? ch : pico.Image.charHeight;
					let x = pico.Image.width/2 - (w * (watermark.length + 1) / 2);
					let y = pico.Image.height/2 - h;
					await pico.image.offscreen._move(x, y);
					await pico.image.offscreen._move(-(watermark.length-1)/2 * w, 0);
					for (let i = 0; i < watermark.length; i++) {
						await pico.image.offscreen._char(watermark.charCodeAt(i), -1);
						await pico.image.offscreen._move(w, 0);
					}
				}
				resolve(pico.image.offscreen._file());
			}); // end of new Promise.
		}); // end of lock.
	}

	// Load image file and get image.
	loadImage(url) {
		return new Promise(async (resolve) => {
			let image = new pico.Image("");
			resolve(image._load(url));
		}); // end of new Promise.
	}

	// Draw other image to this image.
	drawImage(image, x=0, y=0, angle=0, scale=1, frame=0, width=0, height=0) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				await this._image(image, frame, width, height);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor(parent=null, width=0, height=0) {
		this.lock = "picoImageLock" + Date.now(); // Lock object identifier.
		this.canvas = []; // Double buffered canvas elements.
		this.primary = 0; // Primary canvas index.
		this.context = null; // Canvas 2d context.
		this.colors = pico.Image.colors; // Master image color. 

		// Setup canvas.
		this._setup(parent, width, height);
	}

	// Debug print.
	_debug(text) {
		if (pico.Image.debug) {
			console.log(text);
		}
	}

	// Resize canvas.
	_resize(width=0, height=0) {
		return this._ready().then(() => {
			this._debug("Flip.");
			return new Promise((resolve) => {
				for (let i = 0; i < 2; i++) {
					this.canvas[i].width = (width ? width : pico.Image.width) * pico.Image.ratio;
					this.canvas[i].height = (width ? height : pico.Image.height) * pico.Image.ratio;
				}
				resolve();
			}); // end of new Promise.
		});
	}

	// Setup canvas.
	_setup(parent=null, width=0, height=0) {
		return new Promise((resolve) => {

			// Create canvas.
			if (this.context == null) {
				this._debug("Create canvas.");
				for (let i = 0; i < 2; i++) {
					this.canvas[i] = document.createElement("canvas");
					this.canvas[i].width = (width ? width : pico.Image.width) * pico.Image.ratio;
					this.canvas[i].height = (width ? height : pico.Image.height) * pico.Image.ratio;
					this.canvas[i].style.width = "100%";
					// Fix to square canvas. // this.canvas[i].style.height = "100%";
					this.canvas[i].style.imageRendering = "pixelated";
					this.canvas[i].style.display = i == this.primary ? "flex" : "none";
					if (parent) {
						if (document.getElementsByClassName(parent)[0]) {
							document.getElementsByClassName(parent)[0].appendChild(this.canvas[i]);
						} else {
							document.body.appendChild(this.canvas[i]);
						}
					}
				}
				this.context = this.canvas[this.primary].getContext("2d");
			}
			return resolve();
		}); // end of new Promise.
	}

	// Flip image.
	_flip() {
		return this._ready().then(() => {
			this._debug("Flip.");
			return new Promise((resolve) => {
				for (let i = 0; i < 2; i++) {
					this.canvas[i].style.display = i == this.primary ? "flex" : "none";
				}
				this.primary = this.primary != 0 ? 0 : 1;
				this.context = this.canvas[this.primary].getContext("2d");
				resolve();
			}); // end of new Promise.
		});
	}

	// Clear image.
	_clear() {
		return this._ready().then(() => {
			this._debug("Clear.");
			return new Promise((resolve) => {

				// Clear image.
				this.context.setTransform(1, 0, 0, 1, 0, 0);
				this.context.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

				// Clip by canvas rect.
				//this.context.rect(0, 0, pico.Image.width, pico.Image.height);
				//this.context.clip();

				resolve();
			}); // end of new Promise.
		});
	}

	// Ready to draw.
	_ready() {
		if (this.context == null) {
			this._debug("No context.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Reset image transform (scale, rotate, move).
	_reset(x=0, y=0, angle=0, scale=1, hscale=0) {
		this._debug("Reset transform matrix.");
		return new Promise(async (resolve) => {
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			await this._move(x, y);
			await this._rotate(angle);
			await this._scale(scale, hscale);
			resolve();
		}); // end of new Promise.
	}

	// Scale image.
	_scale(scale=1, hscale=0) {
		this._debug("Scale: " + scale + "," + hscale);
		return new Promise((resolve) => {
			if (scale != 1) {
				this.context.translate(this.canvas[0].width / 2, this.canvas[0].height / 2);
				this.context.scale(scale, hscale > 0 ? hscale : scale);
				this.context.translate(-this.canvas[0].width / 2, -this.canvas[0].height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Rotate image.
	_rotate(angle=0) {
		this._debug("Rotate: " + angle);
		return new Promise((resolve) => {
			if (angle) {
				this.context.translate(this.canvas[0].width / 2, this.canvas[0].height / 2);
				this.context.rotate(angle * Math.PI / 180);
				this.context.translate(-this.canvas[0].width / 2, -this.canvas[0].height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Move image.
	_move(x, y) {
		this._debug("Move: " + x + "," + y);
		return new Promise((resolve) => {
			if (x || y) {
				this.context.translate(pico.Image.ratio * x, pico.Image.ratio * y);
			}
			resolve();
		}); // end of new Promise.
	}

	// Set image color pallete.
	_color(colors=null) {
		this.colors = colors && colors.length > 0 ? colors : pico.Image.colors;
	}

	// Draw pixel to image.
	_draw(c=0, x=0, y=0, dx=0, dy=0) {
		//this._debug("Draw: " + c + "," + x + "+" + dx + "," + y + "+" + dy);
		const u = pico.Image.ratio, cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		//this._debug("Center: " + cx + "," + cy + " / " + u);
		return new Promise((resolve) => {
			let k = c >= 0 && c < this.colors.length/3 ? c : this.colors.length/3 - 1;
			let r = this.colors[k*3], g = this.colors[k*3+1], b = this.colors[k*3+2];
			//this._debug("Color: " + r + "," + g + "," + b);
			this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			this.context.fillRect(cx + u * x, cy + u * y, u * (dx + 1), u * (dy + 1));
			resolve();
		}); // end of new Promise.
	}

	// Draw char as string or number to image.
	_char(char, c=0) {
		let rects = [];
		if (char >= "0".charCodeAt(0) && char <= "9".charCodeAt(0)) {
			let a = char - "0".charCodeAt(0);
			rects = pico.Image.numberShapes[a];
		} else if (char >= "a".charCodeAt(0) && char <= "z".charCodeAt(0)) {
			let a = char - "a".charCodeAt(0);
			rects = pico.Image.alphabetShapes[a];
		} else if (char >= "A".charCodeAt(0) && char <= "Z".charCodeAt(0)) {
			let a = char - "A".charCodeAt(0);
			rects = pico.Image.alphabetShapes[a];
		} else if (char >= "ァ".charCodeAt(0) && char <= "ン".charCodeAt(0)) {
			let a = char - "ァ".charCodeAt(0);
			rects = pico.Image.katakanaShapes[a];
		} else if (char >= "ぁ".charCodeAt(0) && char <= "ん".charCodeAt(0)) {
			let a = char - "ぁ".charCodeAt(0);
			rects = pico.Image.hiraganaShapes[a];
		} else {
			let a = pico.Image.markChars.indexOf(String.fromCharCode(char));
			if (a >= 0 && a < pico.Image.markShapes.length) {
				rects = pico.Image.markShapes[a];
			}
		}
		return new Promise(async (resolve) => {
			for (let i = 0; i < rects.length; i += 4) {
				await this._draw(c, rects[i], rects[i+1], rects[i+2], rects[i+3]);
			}
			resolve();
		}); // end of new Promise.
	}

	// Draw multiple lines of text.
	_text(text, c=0, x=0, y=0, width=0, height=0, angle=0, scale=1, cw=0, ch=0) {
		const u = pico.Image.ratio;
		const ux = cw > 0 ? cw : pico.Image.charWidth;
		const uy = ch > 0 ? ch : pico.Image.charHeight;
		let mx = width > 0 ? width / ux - 1 : this.canvas[0].width / (ux * u * scale) - 1;
		let my = height > 0 ? height / uy - 1 : this.canvas[0].height / (uy * u * scale) - 1;
		this._debug("Textarea: " + mx + "," + my + " / " + ux + "," + uy);
		return new Promise(async (resolve) => {
			await this._reset(x, y, angle, scale);
			await this._move((-ux * mx) / 2 , (-uy * my) / 2);
			for (let i = 0, ix = 0, iy = 0; i < text.length && iy <= my; i++) {
				let char = text.charCodeAt(i);
				this._debug("Char="+char + " ix="+ix + "/"+mx + " iy="+iy + "/"+my);
				if (char == "\r".charCodeAt(0) || char == "\n".charCodeAt(0)) {
					await this._move(-ux * ix, uy);
					ix = 0;
					iy++;
				} else if (ix > mx) {
					await this._move(-ux * ix, uy);
					ix = 0;
					iy++;
					i--;
				} else {
					await this._char(char, c);
					await this._move(ux, 0);
					ix++;
				}
			}
			resolve();
		}); // end of new Promise.
	}

	// Draw sprite to image.
	_sprite(cells=[0,9,9,1,0,0], c=-1) {
		return new Promise(async (resolve) => {
			let x0 = 0, y0 = 0;
			if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
				x0 = -(cells[1] - 1) / 2;
				y0 = -(cells[2] - 1) / 2;
			}
			if (c >= 0 && x0 < 0 && y0 < 0) {
				await this._draw(c, x0, y0, x0*-2, y0*-2);
			}
			for (let i = 3; i < cells.length; i += 3) {
				if (cells[i+3] == 0) {
					await this._draw(cells[i], cells[i+1] + x0, cells[i+2] + y0, cells[i+4], cells[i+5]);
					i += 3;
				} else {
					await this._draw(cells[i], cells[i+1] + x0, cells[i+2] + y0);
				}
			}
			resolve();
		}); // end of new Promise.
	}

	// Get sprite size.
	_spriteSize(cells=[0,9,9,1,0,0]) {
		if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
			return (cells[1] > cells[2] ? cells[1] : cells[2]);
		}
		return 1;
	}

	// Load image from data url.
	_load(url) {
		return new Promise(async (resolve) => {
			let image = new Image();
			//image.crossOrigin = "anonymous";
			image.onload = () => {
				for (let i = 0; i < 2; i++) {
					this.canvas[i].width = image.width;// * pico.Image.ratio;
					this.canvas[i].height = image.height;// * pico.Image.ratio;
				}
			  this.context.drawImage(image, 0,0);/*
			  	0, 0, image.width, image.height,
			  	0, 0, this.canvas[0].width, this.canvas[0].height);*/
			  //image.style.display = "none";
			  //document.body.appendChild(image);
				resolve(this);
			};
			image.src = url; // To avoid onload hook timing bug.
		});
	}

	// Draw other image to this image.
	_image(image, frame=0, width=0, height=0) {
		const u = 0;//pico.Image.ratio * 4;
		const cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		this._debug("Center: " + cx + "," + cy);
		return new Promise((resolve) => {
			if (width > 0) {
				height = (height > 0 ? height : width);
				let cx = (this.canvas[0].width - width) / 2;
				let cy = (this.canvas[0].height - height) / 2;
				let nx = image.canvas[0].width / width;
				let x = Math.floor(frame % nx) * width;
				let y = Math.floor(frame / nx) * height;
				this._debug("DrawImage: " + cx + "," + cy + " " + x + "," + y + " " + width + "," + height);
				this.context.drawImage(image.canvas[0], x, y, width, height, cx, cy, width, height);
			} else {
				let cx = (this.canvas[0].width - image.canvas[0].width) / 2;
				let cy = (this.canvas[0].height - image.canvas[0].height) / 2;
				this._debug("DrawImage: " + cx + "," + cy + " " + image.canvas[0].width + "," + image.canvas[0].height);
				this.context.drawImage(image.canvas[0], cx, cy);
			}
			resolve();
		}); // end of new Promise.
	}

	// Get image size.
	_size() {
		if (this.canvas[0].width > 0 && this.canvas[0].height > 0) {
			if (this.canvas[0].width > this.canvas[0].height) {
				return this.canvas[0].width;
			} else {
				return this.canvas[0].height;
			}
		}
		return 0;
	}

	// Get image data url.
	_data() {
		return this.canvas[this.primary].toDataURL("image/png");
	}

	// Get image data file.
	_file() {
		const decoded = atob(this.canvas[this.primary].toDataURL("image/png").replace(/^.*,/, ""));
		const buffers = new Uint8Array(decoded.length);
		for (let i = 0; i < decoded.length; i++) {
			buffers[i] = decoded.charCodeAt(i);
		}
		try {
			const blob = new Blob([buffers.buffer], {type: "image/png"});
			const imageFile = new File([blob], "image.png", {type: "image/png"});
			this._debug("Image data: " + imageFile.size);
			return imageFile;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
};

// Master image.
pico.image = new pico.Image(pico.Image.parent);

// Create offscreen image class.
pico.image.offscreen = new pico.Image("");

