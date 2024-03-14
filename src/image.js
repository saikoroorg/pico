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
		await pico.image.color(colors);
	} catch (error) {
		console.error(error);
	}
}

// Set char leading
async function picoCharLeading(leading, vleading) {
	try {
		await pico.image.charLeading(leading, vleading);
	} catch (error) {
		console.error(error);
	}
}

// Set extra char sprite.
async function picoCharSprite(chars, sprite) {
	try {
		await pico.image.charSprite(chars, sprite);
	} catch (error) {
		console.error(error);
	}
}

// Draw rect.
async function picoRect(c=-1, x=0, y=0, width=1, height=1, angle=0, scale=1) {
	try {
		await pico.image.drawRect(c, x, y, width, height, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw char as string or number.
async function picoChar(char, c=-1, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawChar("" + char, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw multiple lines of text.
async function picoText(text, c=-1, x=0, y=0, width=0, height=0, angle=0, scale=1) {
	try {
		await pico.image.drawText("" + text, c, x, y, width, height, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Get multiple lines of text image data.
async function picoTextData(text, c=-1, width=0, height=0, scale=1) {
	try {
		return await pico.image.offscreen.textData("" + text, c, width, height, scale, pico.image);
	} catch (error) {
		console.error(error);
	}
}

// Draw sprite.
async function picoSprite(cells=[-1,0,0], bgcolor=-1, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawSprite(cells, bgcolor, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Flip sprite.
function picoSpriteFlip(cells=[-1,0,0], x=0, y=0) {
	try {
		return pico.image.spriteFlip(cells, x, y);
	} catch (error) {
		console.error(error);
	}
}

// Get sprite size.
function picoSpriteSize(cells=[-1,0,0]) {
	try {
		return pico.image._spriteSize(cells);
	} catch (error) {
		console.error(error);
	}
}

// Get sprite image data.
async function picoSpriteData(cells=[-1,0,0], scale=10) {
	try {
		return await pico.image.offscreen.spriteData(cells, scale, pico.image);
	} catch (error) {
		console.error(error);
	}
}

// Get screen data file.
async function picoScreenFile(watermark=null, fgcolor=-1, bgcolor=-1) {
	try {
		return await pico.image.screenFile(watermark, fgcolor, bgcolor);
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
async function picoImage(image, x=0, y=0, angle=0, scale=1, width=0, height=0, frame=0, yframe=-1) {
	try {
		await pico.image.drawImage(image, x, y, angle, scale, width, height, frame, yframe);
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
	static count = 0; // Object count.
	static width = 200; // Image width. (-width/2 .. width/2)
	static height = 200; // Image height. (-height/2 .. height/2)
	static ratio = 4; // Pixel ratio.
	static parent = "picoImage"; // Parent element id.

	// Default image color. (5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000)
	static colors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0];

	// Default char leading.
	static leading = 4; // Default char leading.
	static vleading = 6; // Default line leading (vertical).

	// Default char sprite.
	static csprites = { // Char sprite table.
		"0": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,1,-2,0,0,4,-1,-1,2,0,2,0],
		"1": [-1,0,-2,0,0,4],
		"2": [-1,-1,-2,0,2,0,-1,1,-2,0,0,2,-1,-1,0,0,2,0,-1,-1,0,0,0,2,-1,-1,2,0,2,0],
		"3": [-1,-1,-2,0,2,0,-1,1,-2,0,0,4,-1,-1,0,0,2,0,-1,-1,2,0,2,0],
		"4": [-1,-1,-2,0,0,2,-1,1,-2,0,0,4,-1,-1,0,0,2,0],
		"5": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,2,-1,-1,0,0,2,0,-1,1,0,0,0,2,-1,-1,2,0,2,0],
		"6": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,-1,0,0,2,0,-1,1,0,0,0,2,-1,-1,2,0,2,0],
		"7": [-1,-1,-2,0,2,0,-1,1,-2,0,0,4],
		"8": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,1,-2,0,0,4,-1,-1,0,0,2,0,-1,-1,2,0,2,0],
		"9": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,2,-1,1,-2,0,0,4,-1,-1,0,0,2,0,-1,-1,2,0,2,0],
		"A": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,1,-2,0,0,4,-1,-1,0,0,2,0],
		"B": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,1,-2,0,0,1,-1,-1,0,0,1,0,-1,1,1,0,0,1,-1,-1,2,0,2,0],
		"C": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,-1,2,0,2,0],
		"D": [-1,-1,-2,0,1,0,-1,-1,-2,0,0,4,-1,1,-1,0,0,2,-1,-1,2,0,1,0],
		"E": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,-1,0,0,2,0,-1,-1,2,0,2,0],
		"F": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,-1,0,0,2,0],
		"G": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,-1,2,0,2,0,-1,1,0,0,0,1],
		"H": [-1,-1,-2,0,0,4,-1,1,-2,0,0,4,-1,-1,0,0,2,0],
		"I": [-1,-1,-2,0,2,0,-1,0,-2,0,0,4,-1,-1,2,0,2,0],
		"J": [-1,-1,1,0,0,1,-1,1,-2,0,0,4,-1,-1,2,0,2,0],
		"K": [-1,-1,-2,0,0,4,-1,-1,0,0,1,0,-1,1,-2,0,0,1,-1,1,1,0,0,1],
		"L": [-1,-1,-2,0,0,4,-1,-1,2,0,2,0],
		"M": [-1,-1,-2,0,0,4,-1,0,-1,0,0,1,-1,1,-2,0,0,4],
		"N": [-1,-1,-2,0,0,4,-1,-1,-2,0,2,0,-1,1,-2,0,0,4],
		"O": [-1,-1,-2,0,2,1,-1,-1,-1,0,0,3,-1,1,-1,0,0,3,-1,-1,2,0,2,0],
		"P": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,1,-2,0,0,2,-1,-1,0,0,2,0],
		"Q": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,3,-1,1,-2,0,0,2,-1,-1,1,0,1,0,-1,1,2],
		"R": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,4,-1,1,-2,0,0,1,-1,-1,0,0,1,0,-1,1,1,0,0,1],
		"S": [-1,-1,-2,0,2,0,-1,-1,-2,0,0,1,-1,0,0,-1,1,1,0,0,1,-1,-1,2,0,2,0],
		"T": [-1,-1,-2,0,2,0,-1,0,-2,0,0,4],
		"U": [-1,-1,-2,0,0,4,-1,1,-2,0,0,4,-1,-1,2,0,2,0],
		"V": [-1,-1,-2,0,0,3,-1,1,-2,0,0,3,-1,0,2],
		"W": [-1,-1,-2,0,0,4,-1,0,0,0,0,1,-1,1,-2,0,0,4],
		"X": [-1,-1,-2,0,0,1,-1,-1,1,0,0,1,-1,0,0,-1,1,-2,0,0,1,-1,1,1,0,0,1],
		"Y": [-1,-1,-2,0,0,1,-1,0,0,0,0,2,-1,1,-2,0,0,1],
		"Z": [-1,-1,-2,0,2,0,-1,1,-2,0,0,1,-1,0,0,-1,-1,1,0,0,1,-1,-1,2,0,2,0],
		".": [-1,0,2],
		"-": [-1,-1,0,0,2,0],
		"/": [-1,-1,2,-1,0,-1,0,0,2,-1,1,-2],
		":": [-1,0,-1,-1,0,1],
		"+": [-1,-1,0,0,2,0,-1,0,-1,0,0,2],
		"=": [-1,-1,-1,0,2,0,-1,-1,1,0,2,0],
		"?": [-1,-1,-2,0,2,0,-1,1,-2,0,0,1,-1,0,0,-1,0,2],
		"*": [-1,-1,-1,-1,-1,1,-1,0,0,-1,1,-1,-1,1,1],
		"&": [-1,-1,0,0,0,1,-1,0,-1,-1,1,0,0,0,1,-1,-1,1,0,2,0],
		"%": [-1,-1,-1,0,2,0,-1,-1,-1,0,0,1,-1,0,1,-1,1,-1,0,0,1],
		"$": [-1,-1,0,-1,0,-1,-1,0,1,-1,1,0],
		"#": [-1,-1,-1,0,2,0,-1,-1,-1,0,0,2,-1,-1,1,0,2,0,-1,1,-1,0,0,2],
	};
	static caliases = { // Char sprite alias table.
		"a":"A", "b":"B", "c":"C", "d":"D", "e":"E", "f":"F", "g":"G",
		"h":"H", "i":"I", "j":"J", "k":"K", "l":"L", "m":"M", "n":"N",
		"o":"O", "p":"P", "q":"Q", "r":"R", "s":"S", "t":"T", "u":"U",
		"v":"V", "w":"W", "x":"X", "y":"Y", "z":"Z",};

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
			if (colors && colors.length > 0) {
				this.colors = colors.concat();
			} else {
				this.colors = pico.Image.colors.concat();
			}
		}); // end of lock.
	}

	// Set char leading.
	charLeading(leading, vleading) {
		return navigator.locks.request(this.lock, async (lock) => {
			this.leading = leading;
			this.vleading = vleading;
		}); // end of lock.
	}

	// Set extra char sprite.
	charSprite(chars, sprite) {
		return navigator.locks.request(this.lock, async (lock) => {
			if (chars[0] && sprite) {
				this.sprites[chars[0]] = sprite;
				if (this.aliases[chars[0]]) {
					this.aliases[chars[0]] = null;
				}
			}
			for (let i = 1; i < chars.length; i++) {
				this.aliases[chars[i]] = chars[0];
				if (this.sprites[chars[i]]) {
					this.sprites[chars[i]] = null;
				}
			}
		}); // end of lock.
	}

	// Draw rect to image.
	drawRect(c=-1, x=0, y=0, width=1, height=1, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			await this._reset(x, y, angle, scale);
			await this._draw(c, -(width-1)/2, -(height-1)/2, width-1, height-1);
		}); // end of lock.
	}

	// Draw char as string or number to image.
	drawChar(char, c=-1, x=0, y=0, angle=0, scale=1) {
		const w = this.leading;
		return navigator.locks.request(this.lock, async (lock) => {
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
		}); // end of lock.
	}

	// Draw multiple lines of text to image.
	drawText(text, c=-1, x=0, y=0, width=0, height=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			await this._text(text, c, x, y, width, height, angle, scale);
		}); // end of lock.
	}

	// Draw offscreen and get multiple lines of text image data.
	textData(text, c=-1, width=0, height=0, scale=1, parent=null) {
		return navigator.locks.request(this.lock, async (lock) => {
			if (parent) {
				await navigator.locks.request(parent.lock, async (parentlock) => {
					this.colors = Object.assign([],parent.colors);
					this.leading = parent.leading;
					this.vleading = parent.vleading;
					this.sprites = Object.assign({}, parent.sprites);
					this.aliases = Object.assign({}, parent.aliases);
				}); // end of lock.
			}
			if (!width || !height) {
				text = text.replaceAll("\r\n");
				width = this.leading*text.length;
				height = this.vleading;
			}
			await this._resize(width * scale, height * scale);
			await this._ready();
			await this._text(text, c, 0, 0, width, height, 0, scale);
			return this._data();
		}); // end of offscreenlock.
	}

	// Flip splite.
	spriteFlip(cells=[-1,0,0], x=0, y=0) {
		let flipped = [];
		let i = 0, w = 0, h = 0;
		if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
			w = cells[1];
			h = cells[2];
			flipped[0] = cells[0];
			flipped[1] = cells[1];
			flipped[2] = cells[2];
			i += 3;
		}
		for (; i < cells.length; i += 3) {
			flipped[i+0] = cells[i];
			if (cells[i+3] != 0) {
				flipped[i+1] = x ? w-1-cells[i+1] : cells[i+1];
				flipped[i+2] = y ? h-1-cells[i+2] : cells[i+2];
			} else {
				flipped[i+1] = x ? w-cells[i+1] : cells[i+1];
				flipped[i+2] = y ? h-cells[i+2] : cells[i+2];
				flipped[i+3] = cells[i+3];
				flipped[i+4] = x ? -cells[i+4]-2 : cells[i+4];
				flipped[i+5] = y ? -cells[i+5]-2 : cells[i+5];
				i += 3;
			}
		}
		return flipped;
	}

	// Draw sprite to image.
	drawSprite(cells=[-1,0,0], bgcolor=-1, x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			await this._reset(x, y, angle, scale);
			await this._sprite(cells, -1, bgcolor);
		}); // end of lock.
	}

	// Draw offscreen and get sprite image data.
	spriteData(cells=[-1,0,0], scale=10, parent=null) {
		return navigator.locks.request(this.lock, async (lock) => {
			if (parent) {
				await navigator.locks.request(parent.lock, async (parentlock) => {
					this.colors = parent.colors.concat();
				}); // end of lock.
			}
			let size = this._spriteSize(cells);
			await this._resize(size * scale, size * scale);
			await this._ready();
			await this._reset(0, 0, 0, scale);
			await this._sprite(cells, -1, 0);
			return this._data();
		}); // end of lock.
	}

	// Draw bg/watermark and get screen data file.
	async screenFile(watermark=null, fgcolor=-1, bgcolor=-1) {
		if (!watermark && bgcolor < 0) {
			return await pico.image._file();
		}
		return navigator.locks.request(this.offscreen.lock, async (offscreenlock) => {
			await navigator.locks.request(this.lock, async (lock) => {
				this.offscreen.colors = Object.assign([], this.colors);
				this.offscreen.leading = this.leading;
				this.offscreen.vleading = this.vleading;
				this.offscreen.sprites = Object.assign({}, this.sprites);
				this.offscreen.aliases = Object.assign({}, this.aliases);
			}); // end of lock.
			await this.offscreen._resize(
				pico.image.canvas[0].width/pico.Image.ratio,
				pico.image.canvas[0].height/pico.Image.ratio);
			await this.offscreen._ready();
			await this.offscreen._reset(0, 0, 0, 1);
			if (bgcolor >= 0) {
				await this.offscreen._draw(bgcolor,
					-pico.Image.width/2, -pico.Image.height/2,
					pico.Image.width, pico.Image.height);
			}
			await this.offscreen._image(pico.image);
			if (watermark && watermark.length >= 2) {
				await this.offscreen._char(watermark, fgcolor);
			}
			return pico.image.offscreen._file();
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
	drawImage(image, x=0, y=0, angle=0, scale=1, width=0, height=0, frame=0, yframe=-1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			await this._reset(x, y, angle, scale);
			if (width > 0 && yframe < 0) {
				let nx = image.canvas[0].width / width;
				if (frame < 0) {
					let sx = image.canvas[0].width - (Math.floor((-frame - 1) % nx) + 1) * width;
					let sy = image.canvas[0].height - (Math.floor((-frame - 1) / nx) + 1) * height;
					await this._image(image, sx, sy, width, height);
				} else {
					let sx = Math.floor(frame % nx) * width;
					let sy = Math.floor(frame / nx) * height;
					await this._image(image, sx, sy, width, height);
				}
			} else {
				let sx = frame * width;
				let sy = yframe * height;
				await this._image(image, sx, sy, width, height);
			}
		}); // end of lock.
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor(parent=null, width=0, height=0) {
		pico.Image.count++;
		this.lock = "picoImageLock" + pico.Image.count + Date.now(); // Lock object identifier.
		this.canvas = []; // Double buffered canvas elements.
		this.primary = 0; // Primary canvas index.
		this.context = null; // Canvas 2d context.
		this.colors = pico.Image.colors.concat(); // Master image color. 
		this.leading = pico.Image.leading; // Char leading.
		this.vleading = pico.Image.vleading; // Line leading (vertical).
		this.sprites = pico.Image.csprites; // Char sprites.
		this.aliases = pico.Image.caliases; // Char aliases.

		// Setup canvas.
		this._setup(parent, width, height);

		// Create offscreen image class.
		if (parent) {
			this.offscreen = new pico.Image("");
		}
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
	_reset(x=0, y=0, angle=0, scale=1, vscale=0) {
		//this._debug("Reset transform matrix.");
		return new Promise(async (resolve) => {
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			await this._move(x, y);
			await this._rotate(angle);
			await this._scale(scale, vscale);
			resolve();
		}); // end of new Promise.
	}

	// Scale image.
	_scale(scale=1, vscale=0) {
		//this._debug("Scale: " + scale + "," + vscale);
		return new Promise((resolve) => {
			if (scale != 1) {
				this.context.translate(this.canvas[0].width / 2, this.canvas[0].height / 2);
				this.context.scale(scale, vscale > 0 ? vscale : scale);
				this.context.translate(-this.canvas[0].width / 2, -this.canvas[0].height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Rotate image.
	_rotate(angle=0) {
		//this._debug("Rotate: " + angle);
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
		//this._debug("Move: " + x + "," + y);
		return new Promise((resolve) => {
			if (x || y) {
				this.context.translate(pico.Image.ratio * x, pico.Image.ratio * y);
			}
			resolve();
		}); // end of new Promise.
	}

	// Draw pixel to image.
	_draw(c=-1, x=0, y=0, dx=0, dy=0) {
		this._debug("Draw: " + c + "," + x + "+" + dx + "," + y + "+" + dy);
		const u = pico.Image.ratio, cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		////this._debug("Center: " + cx + "," + cy + " / " + u);
		return new Promise((resolve) => {
			let k = c >= 0 && c < this.colors.length/3 ? c : this.colors.length/3 - 1;
			let r = this.colors[k*3], g = this.colors[k*3+1], b = this.colors[k*3+2];
			////this._debug("Color: " + r + "," + g + "," + b);
			this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			this.context.fillRect(cx + u * x, cy + u * y, u * (dx + 1), u * (dy + 1));
			resolve();
		}); // end of new Promise.
	}

	// Draw char as string or number to image.
	_char(char, c=-1) {
		let sprite = [];
		let charStr = String.fromCharCode(char);
		if (this.aliases[charStr]) {
			charStr = this.aliases[charStr];
		}
		if (this.sprites[charStr]) {
			sprite = this.sprites[charStr];
		}
		return new Promise(async (resolve) => {
			await this._sprite(sprite, c, -1);
			resolve();
		}); // end of new Promise.
	}

	// Draw multiple lines of text.
	_text(text, c=-1, x=0, y=0, width=0, height=0, angle=0, scale=1) {
		const u = pico.Image.ratio;
		const ux = this.leading, uy = this.vleading;
		let mx = width > 0 ? width / ux - 1 : this.canvas[0].width / (ux * u * scale) - 1;
		let my = height > 0 ? height / uy - 1 : this.canvas[0].height / (uy * u * scale) - 1;
		//this._debug("Textarea: " + mx + "," + my + " / " + ux + "," + uy);
		return new Promise(async (resolve) => {
			await this._reset(x, y, angle, scale);
			await this._move((-ux * mx) / 2 , (-uy * my) / 2);
			for (let i = 0, ix = 0, iy = 0; i < text.length && iy <= my; i++) {
				let char = text.charCodeAt(i);
				//this._debug("Char="+char + " ix="+ix + "/"+mx + " iy="+iy + "/"+my);
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
	_sprite(cells=[-1,0,0], fgcolor=-1, bgcolor=-1) {
		this._debug("Sprite: " + cells.join(","));
		return new Promise(async (resolve) => {
			let i = 0, x0 = 0, y0 = 0;
			if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
				x0 = -(cells[1] - 1) / 2;
				y0 = -(cells[2] - 1) / 2;
				i += 3;
			}
			if (bgcolor >= 0 && x0 < 0 && y0 < 0) {
				await this._draw(bgcolor, x0, y0, x0*-2, y0*-2);
			}
			for (; i < cells.length; i += 3) {
				let c = fgcolor >= 0 ? fgcolor : cells[i];
				if (cells[i+3] == 0) {
					this._debug("SpriteDraw: " + c + "," + cells[i+1]+ "+" + cells[i+4] + "," + cells[i+2] + "+" + cells[i+5]);
					await this._draw(c, cells[i+1] + x0, cells[i+2] + y0, cells[i+4], cells[i+5]);
					i += 3;
				} else {
					this._debug("SpriteDraw: " + c + "," + cells[i+1] + "," + cells[i+2]);
					await this._draw(c, cells[i+1] + x0, cells[i+2] + y0);
				}
			}
			resolve();
		}); // end of new Promise.
	}

	// Get sprite size.
	_spriteSize(cells=[-1,0,0]) {
		if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
			return (cells[1] > cells[2] ? cells[1] : cells[2]);
		}
		return 0;
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
	_image(image, sx=0, sy=0, width=0, height=0) {
		const u = 0;//pico.Image.ratio * 4;
		const cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		//this._debug("Center: " + cx + "," + cy);
		return new Promise((resolve) => {
			if (width > 0) {
				height = (height > 0 ? height : width);
				let cx = (this.canvas[0].width - width) / 2;
				let cy = (this.canvas[0].height - height) / 2;
				this._debug("DrawImage: " + cx + "," + cy + " " + sx + "," + sy + " " + width + "," + height);
				this.context.drawImage(image.canvas[0], sx, sy, width, height, cx, cy, width, height);
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

