/* PICO module */

// Namespace.
var pico = pico || {};
pico.name = "pico"; // Update by package.json.
pico.version = "0.9.41009a"; // Update by package.json.

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

// Resize image.
async function picoResize(width=0, height=0) {
	try {
		await pico.image.resize(width, height);
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
function picoSpriteFlip(cells=[-1,0,0], x=0, y=0, a=0) {
	try {
		return pico.image.spriteFlip(cells, x, y, a);
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
async function picoSpriteData(cells=[-1,0,0], bgcolor=-1, scale=10) {
	try {
		return await pico.image.offscreen.spriteData(cells, bgcolor, scale, pico.image);
	} catch (error) {
		console.error(error);
	}
}

// Get screen data file.
async function picoScreenFile(watermark=null, fgcolor=-1, bgcolor=-1, name=null) {
	try {
		return await pico.image.screenFile(watermark, fgcolor, bgcolor, name);
	} catch (error) {
		console.error(error);
	}
}

// Clone screen image.
async function picoScreenImage() {
	try {
		return await pico.image.cloneImage();
	} catch (error) {
		console.error(error);
	}
}

// Load image file.
async function picoLoad(url, timeout=10000) {
	try {
		return await pico.image.loadImage(url, timeout);
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
function picoImageFile(image, name=null) {
	try {
		return image._file(name);
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Image class.
pico.Image = class {
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
		"!": [-1,0,-2,0,0,2,-1,0,2],
		"*": [-1,-1,-1,-1,-1,1,-1,0,0,-1,1,-1,-1,1,1],
		"&": [-1,-1,0,0,0,1,-1,0,-1,-1,1,0,0,0,1,-1,-1,1,0,2,0],
		"%": [-1,-1,-1,0,2,0,-1,-1,-1,0,0,1,-1,0,1,-1,1,-1,0,0,1],
		"$": [-1,-1,0,-1,0,-1,-1,0,1,-1,1,0],
		"#": [-1,-1,-1,0,2,0,-1,-1,-1,0,0,2,-1,-1,1,0,2,0,-1,1,-1,0,0,2],
		"_": [],
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

	// Resize image.
	resize(width=0, height=0) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._resize(width, height);
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
			this._reset(x, y, angle, scale);
			this._draw(c, -(width-1)/2, -(height-1)/2, width-1, height-1);
		}); // end of lock.
	}

	// Draw char as string or number to image.
	drawChar(char, c=-1, x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			this._reset(x, y, angle, scale);
			let length = char.length;
			if (length >= 2) {
				this._move(-(length-1)/2 * this.leading, 0);
			}
			for (let i = 0; i < length; i++) {
				this._char(char.charCodeAt(i), c);
				this._move(this.leading, 0);
			}
		}); // end of lock.
	}

	// Draw multiple lines of text to image.
	drawText(text, c=-1, x=0, y=0, width=0, height=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			this._text(text, c, x, y, width, height, angle, scale);
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
			this._resize(width * scale, height * scale);
			await this._ready();
			this._text(text, c, 0, 0, width, height, 0, scale);
			return this._data();
		}); // end of offscreenlock.
	}

	// Flip splite.
	spriteFlip(cells=[-1,0,0], x=0, y=0, a=0) {
		if (!x && !y && !a) {
			return cells;
		}
		let flipped = [];
		let i = 0, w = 1, h = 1;
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
				if (a) {
					flipped[i+1] = y ? cells[i+2] : h-1-cells[i+2];
					flipped[i+2] = x ? w-1-cells[i+1] : cells[i+1];
				} else {
					flipped[i+1] = x ? w-1-cells[i+1] : cells[i+1];
					flipped[i+2] = y ? h-1-cells[i+2] : cells[i+2];
				}
			} else {
				if (a) {
					flipped[i+1] = y ? cells[i+2] : h-cells[i+2];
					flipped[i+2] = x ? w-cells[i+1] : cells[i+1];
					flipped[i+3] = cells[i+3];
					flipped[i+4] = y ? cells[i+5] : -cells[i+5]-2;
					flipped[i+5] = x ? -cells[i+4]-2 : cells[i+4];
				} else {
					flipped[i+1] = x ? w-cells[i+1] : cells[i+1];
					flipped[i+2] = y ? h-cells[i+2] : cells[i+2];
					flipped[i+3] = cells[i+3];
					flipped[i+4] = x ? -cells[i+4]-2 : cells[i+4];
					flipped[i+5] = y ? -cells[i+5]-2 : cells[i+5];
				}
				i += 3;
			}
		}
		return flipped;
	}

	// Draw sprite to image.
	drawSprite(cells=[-1,0,0], bgcolor=-1, x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			this._reset(x, y, angle, scale);
			this._sprite(cells, -1, bgcolor);
		}); // end of lock.
	}

	// Draw offscreen and get sprite image data.
	spriteData(cells=[-1,0,0], bgcolor=-1, scale=10, parent=null) {
		return navigator.locks.request(this.lock, async (lock) => {
			if (parent) {
				await navigator.locks.request(parent.lock, async (parentlock) => {
					this.colors = parent.colors.concat();
				}); // end of lock.
			}
			let size = this._spriteSize(cells);
			this._resize(size * scale, size * scale);
			await this._ready();
			this._reset(0, 0, 0, scale);
			this._sprite(cells, -1, bgcolor);
			return this._data();
		}); // end of lock.
	}

	// Draw bg/watermark and get screen data file.
	async screenFile(watermark=null, fgcolor=-1, bgcolor=-1, name=null) {
		return navigator.locks.request(this.offscreen.lock, async (offscreenlock) => {
			await navigator.locks.request(this.lock, async (lock) => {
				if (!watermark && bgcolor < 0) {
					return pico.image._file(name);
				}
				this.offscreen._copy(this);
			}); // end of lock.
			await this.offscreen._ready();
			this.offscreen._reset(0, 0, 0, 1);
			if (bgcolor >= 0) {
				this.offscreen._draw(bgcolor,
					-this.offscreen.canvas[0].width/2, -this.offscreen.canvas[0].height/2,
					this.offscreen.canvas[0].width, this.offscreen.canvas[0].height);
			}
			await this.offscreen._image(pico.image);
			if (watermark && watermark.length >= 2) {
				let w = this.offscreen.leading;
				let h = this.offscreen.vleading;
				let x = this.offscreen.canvas[0].width/pico.Image.ratio/2 - (w * (watermark.length + 1) / 2);
				let y = this.offscreen.canvas[0].height/pico.Image.ratio/2 - h;
				this.offscreen._move(x, y);
				if (watermark.length >= 2) {
					this.offscreen._move(-(watermark.length-1)/2 * w, 0);
				}
				for (let i = 0; i < watermark.length; i++) {
					this.offscreen._char(watermark.charCodeAt(i), fgcolor);
					this.offscreen._move(w, 0);
				}
			}
			return pico.image.offscreen._file(name);
		}); // end of lock.
	}

	// Clone image.
	cloneImage() {
		return navigator.locks.request(this.lock, async (lock) => {
			let image = new pico.Image("");
			return image._copy(this);
		}); // end of lock.
	}

	// Load image file and get image.
	loadImage(url, timeout=10000) {
		return new Promise(async (resolve) => {
			let image = new pico.Image("");
			let loader = new Image();
			//loader.crossOrigin = "anonymous";
			loader.addEventListener("load", async () => {
				navigator.locks.request(image.lock, async (imagelock) => {
					if (timeout > 0) {
						for (let i = 0; i < 2; i++) {
							image.canvas[i].width = loader.width;// * pico.Image.ratio;
							image.canvas[i].height = loader.height;// * pico.Image.ratio;
						}
					  image.context.drawImage(loader, 0,0);/*
					  	0, 0, loader.width, loader.height,
					  	0, 0, image.canvas[0].width, image.canvas[0].height);*/
					  //loader.style.display = "none";
					  //document.body.appendChild(loader);
						////console.log("Loaded: " + url);
						timeout = 0;
						resolve(image);
					}
				}); // end of lock.
			}); // Loaded.
			setTimeout(() => {
				navigator.locks.request(image.lock, async (imagelock) => {
					if (timeout > 0) {
						////console.log("Load timed out: " + url);
						loader.src = null; // Load cancel.
						timeout = 0;
						resolve();
					}
				}); // end of lock.
			}, timeout);
			loader.src = url; // Set url after onload event handler to avoid onload hook timing bug.
		});
	}

	// Draw other image to this image.
	drawImage(image, x=0, y=0, angle=0, scale=1, width=0, height=0, frame=0, yframe=-1) {
		return navigator.locks.request(this.lock, async (lock) => {
			await this._ready();
			this._reset(x, y, angle, scale);
			await navigator.locks.request(image.lock, async (imagelock) => {
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
		this.colors = Object.assign([], pico.Image.colors); // Master image color. 
		this.leading = pico.Image.leading; // Char leading.
		this.vleading = pico.Image.vleading; // Line leading (vertical).
		this.sprites = Object.assign([], pico.Image.csprites); // Char sprites.
		this.aliases = Object.assign([], pico.Image.caliases); // Char aliases.

		// Setup canvas.
		this._setup(parent, width, height);

		// Create offscreen image class.
		if (parent) {
			this.offscreen = new pico.Image("");
		}
	}

	// Resize canvas.
	_resize(width=0, height=0) {
		////console.log("Resize.");
		for (let i = 0; i < 2; i++) {
			this.canvas[i].width = (width ? width : pico.Image.width) * pico.Image.ratio;
			this.canvas[i].height = (width ? height : pico.Image.height) * pico.Image.ratio;
		}
	}

	// Setup canvas.
	_setup(parent=null, width=0, height=0) {
		return new Promise((resolve) => {

			// Create canvas.
			if (this.context == null) {
				////console.log("Create canvas.");
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
			////console.log("Flip.");
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
			////console.log("Clear.");
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

	// Copy image.
	_copy(original) {
		this._resize(
			original.canvas[0].width/pico.Image.ratio,
			original.canvas[0].height/pico.Image.ratio);
		this.colors = Object.assign([], original.colors);
		this.leading = original.leading;
		this.vleading = original.vleading;
		this.sprites = Object.assign({}, original.sprites);
		this.aliases = Object.assign({}, original.aliases);
		this._image(original);
		return this;
	}

	// Ready to draw.
	_ready() {
		if (this.context == null) {
			////console.log("No context.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Reset image transform (scale, rotate, move).
	_reset(x=0, y=0, angle=0, scale=1, vscale=0) {
		//////console.log("Reset transform matrix.");
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this._move(x, y);
		this._rotate(angle);
		this._scale(scale, vscale);
	}

	// Scale image.
	_scale(scale=1, vscale=0) {
		//////console.log("Scale: " + scale + "," + vscale);
		if (scale != 1) {
			this.context.translate(this.canvas[0].width / 2, this.canvas[0].height / 2);
			this.context.scale(scale, vscale > 0 ? vscale : scale);
			this.context.translate(-this.canvas[0].width / 2, -this.canvas[0].height / 2);
		}
	}

	// Rotate image.
	_rotate(angle=0) {
		//////console.log("Rotate: " + angle);
		if (angle) {
			this.context.translate(this.canvas[0].width / 2, this.canvas[0].height / 2);
			this.context.rotate(angle * Math.PI / 180);
			this.context.translate(-this.canvas[0].width / 2, -this.canvas[0].height / 2);
		}
	}

	// Move image.
	_move(x, y) {
		//////console.log("Move: " + x + "," + y);
		if (x || y) {
			this.context.translate(pico.Image.ratio * x, pico.Image.ratio * y);
		}
	}

	// Draw pixel to image.
	_draw(c=-1, x=0, y=0, dx=0, dy=0) {
		////console.log("Draw: " + c + "," + x + "+" + dx + "," + y + "+" + dy);
		const u = pico.Image.ratio, cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		//////console.log("Center: " + cx + "," + cy + " / " + u);
		let k = c >= 0 && c < this.colors.length/3 ? c : this.colors.length/3 - 1;
		let r = this.colors[k*3], g = this.colors[k*3+1], b = this.colors[k*3+2];
		//////console.log("Color: " + r + "," + g + "," + b);
		this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
		this.context.fillRect(cx + u * x, cy + u * y, u * (dx + 1), u * (dy + 1));
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
		return this._sprite(sprite, c, -1);
	}

	// Draw multiple lines of text.
	_text(text, c=-1, x=0, y=0, width=0, height=0, angle=0, scale=1) {
		const u = pico.Image.ratio;
		const ux = this.leading, uy = this.vleading;
		let mx = width > 0 ? width / ux - 1 : this.canvas[0].width / (ux * u * scale) - 1;
		let my = height > 0 ? height / uy - 1 : this.canvas[0].height / (uy * u * scale) - 1;
		//////console.log("Textarea: " + mx + "," + my + " / " + ux + "," + uy);
		this._reset(x, y, angle, scale);
		this._move((-ux * mx) / 2 , (-uy * my) / 2);
		for (let i = 0, ix = 0, iy = 0; i < text.length && iy <= my; i++) {
			let char = text.charCodeAt(i);
			//////console.log("Char="+char + " ix="+ix + "/"+mx + " iy="+iy + "/"+my);
			if (char == "\r".charCodeAt(0) || char == "\n".charCodeAt(0)) {
				this._move(-ux * ix, uy);
				ix = 0;
				iy++;
			} else if (ix > mx) {
				this._move(-ux * ix, uy);
				ix = 0;
				iy++;
				i--;
			} else {
				this._char(char, c);
				this._move(ux, 0);
				ix++;
			}
		}
	}

	// Draw sprite to image.
	_sprite(cells=[-1,0,0], fgcolor=-1, bgcolor=-1) {
		////console.log("Sprite: " + cells.join(","));
		let i = 0, x0 = 0, y0 = 0;
		if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
			x0 = -(cells[1] - 1) / 2;
			y0 = -(cells[2] - 1) / 2;
			i += 3;
		}
		if (bgcolor >= 0 && x0 < 0 && y0 < 0) {
			this._draw(bgcolor, x0, y0, x0*-2, y0*-2);
		}
		for (; i < cells.length; i += 3) {
			let c = fgcolor >= 0 ? fgcolor : cells[i];
			if (cells[i+3] == 0) {
				////console.log("SpriteDraw: " + c + "," + cells[i+1]+ "+" + cells[i+4] + "," + cells[i+2] + "+" + cells[i+5]);
				this._draw(c, cells[i+1] + x0, cells[i+2] + y0, cells[i+4], cells[i+5]);
				i += 3;
			} else {
				////console.log("SpriteDraw: " + c + "," + cells[i+1] + "," + cells[i+2]);
				this._draw(c, cells[i+1] + x0, cells[i+2] + y0);
			}
		}
	}

	// Get sprite size.
	_spriteSize(cells=[-1,0,0]) {
		if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
			return (cells[1] > cells[2] ? cells[1] : cells[2]);
		}
		return 0;
	}

	// Draw other image to this image.
	_image(image, sx=0, sy=0, width=0, height=0) {
		const u = 0;//pico.Image.ratio * 4;
		const cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		//////console.log("Center: " + cx + "," + cy);
		return new Promise((resolve) => {
			if (width > 0) {
				height = (height > 0 ? height : width);
				let cx = (this.canvas[0].width - width) / 2;
				let cy = (this.canvas[0].height - height) / 2;
				////console.log("DrawImage: " + cx + "," + cy + " " + sx + "," + sy + " " + width + "," + height);
				this.context.drawImage(image.canvas[image.primary], sx, sy, width, height, cx, cy, width, height);
			} else {
				let cx = (this.canvas[0].width - image.canvas[0].width) / 2;
				let cy = (this.canvas[0].height - image.canvas[0].height) / 2;
				////console.log("DrawImage: " + cx + "," + cy + " " + image.canvas[0].width + "," + image.canvas[0].height);
				this.context.drawImage(image.canvas[image.primary], cx, cy);
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
	_file(name=null) {
		const decoded = atob(this.canvas[this.primary].toDataURL("image/png").replace(/^.*,/, ""));
		const buffers = new Uint8Array(decoded.length);
		for (let i = 0; i < decoded.length; i++) {
			buffers[i] = decoded.charCodeAt(i);
		}
		try {
			const blob = new Blob([buffers.buffer], {type: "image/png"});
			const file = new File([blob], name ? name : "image.png", {type: blob.type});
			////console.log("Image data file: " + file.size);
			return file;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
};

// Master image.
pico.image = new pico.Image(pico.Image.parent);

/* PICO Param module */

// Random.
function picoRandom(max, seed=0) {
	return pico.param.random(max, seed);
}

// Random seed.
function picoSeed() {
	return pico.param.seed();
}

// Time.
function picoTime() {
	return Date.now();
}

// Date (yymmddhhmmss).
function picoDate() {
	let date = new Date();
	let year = ("" + date.getYear()).slice(-2);
	let mon = ("0" + (date.getMonth() + 1)).slice(-2);
	let day = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let min = ("0" + date.getMinutes()).slice(-2);
	let sec = ("0" + date.getSeconds()).slice(-2);
	return parseInt(year + mon + day + hour + min + sec, 10);
}

// Reload with param.
async function picoReload(url=null) {
	try {
		await pico.param.reload(url);
	} catch (error) {
		console.error(error);
	}
}

// Share params.
async function picoShare(url=null, files=null) {
	try {
		await pico.param.share(url, files);
	} catch (error) {
		console.error(error);
	}
}

// Get text file.
function picoTextFile(text, name=null, type=null) {
	try {
		return pico.param.textFile(text, name, type);
	} catch (error) {
		console.error(error);
	}
}

// Get all params by one string.
function picoParams() {
	return pico.param.params();
}

// Reset all params.
function picoResetParams() {
	pico.param.resetParams();
}

// Get all param keys.
function picoKeys() {
	return pico.param.keys();
}

// Get param as string.
function picoString(key=0) {
	return pico.param.string(key);
}

// Set param as string.
function picoSetString(str, key=0) {
	return pico.param.setString(str, key);
}

// Get param as numbers.
function picoNumbers(key=0) {
	return pico.param.numbers(key);
}

// Get param as one number.
function picoNumber(key=0) {
	let n = pico.param.numbers(key);
	return n.length > 0 ? n[0] : 0;
}

// Set param as numbers.
function picoSetNumbers(numbers, key=0, separator=".") {
	return pico.param.setNumbers(numbers, key, separator);
}

// Get param as 6bit code.
function picoCode6(key=0) {
	return pico.param.code6(key);
}

// Set param as 6bit code.
function picoSetCode6(code6, key=0) {
	return pico.param.setCode6(code6, key);
}

// Get param as 8bit compatible 6bit code.
function picoCode8(key=0) {
	return pico.param.code8(key);
}

// Set param as 8bit compatible 6bit code.
function picoSetCode8(code8, key=0) {
	return pico.param.setCode8(code8, key);
}

// Get 6bit code by string.
function picoStringCode6(str) {
	return pico.param._stringCode(str);
}

// Get 8bit code by string.
function picoStringCode8(str) {
	return pico.param._expandCode(pico.param._stringCode(str));
}

// Get 6bit code (1 number) by char.
function picoCharCode6(char) {
	let code = picoStringCode6(char);
	return code[0];
}

// Get 8bit code (1 number) by char.
function picoCharCode8(char) {
	let code = picoStringCode8(char);
	return code[0];
}

// Get char by 6bit code (1 number).
function picoCode6Char(code6) {
	return pico.param._code2str([code6])[0];
}

// Get char by 8bit code (1 number).
function picoCode8Char(code8) {
	const compression = 2;
	let code6 = this._compressCode([code8], compression)
	return pico.param._code2str(code6)[0];
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Param class.
pico.Param = class {

	// Get random count.
	random(max, seed=0) {
		if (seed > 0) {
			this.rand = seed;
		}
		if (max > 0) {

			// Xorshift algorythm.
			this.rand = this.rand ^ (this.rand << 13);
			this.rand = this.rand ^ (this.rand >>> 17);
			this.rand = this.rand ^ (this.rand << 5);
			return Math.abs(this.rand % max);

			// LCG algorythm.
			// this.rand = (this.rand * 9301 + 49297) % 233280;
			// let rand = this.rand / 233280;
			// return Math.round(rand * max);
		}
		return 0;
	}

	// Get random seed.
	seed() {
		return this.rand >>> 0;
	}

	// Reload with param.
	async reload(url=null) {
		await this._reload(url);
	}

	// Share param.
	async share(url=null, files=null) {
		await this._share(url, files);
	}

	// Get text file.
	textFile(text, name=null, type=null) {
		try {
			const blob = new Blob([text], {type: type ? type : "text/plain"});
			const file = new File([blob], name ? name : "text.txt", {type: type});
			//console.log("Text file: " + file.size);
			return file;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	// Get all params by one string.
	params() {
		return this._serialize();
	}

	// Reset all params.
	resetParams() {
		this._reset();
	}

	// Get all param keys.
	keys() {
		return this._keys();
	}

	// Get param as string.
	string(key=0) {
		return this._string(key);
	}

	// Set param as string.
	setString(str, key=0) {
		this._setString(str, key);
	}

	// Get param as numbers.
	numbers(key=0) {
		return this._numbers(key);
	}

	// Set param as numbers.
	setNumbers(numbers, key=0) {
		this._setNumbers(numbers, key);
	}

	// Get param as 6bit code.
	code6(key=0) {
		return this._stringCode(this._string(key));
	}

	// Set param as 6bit code.
	setCode6(code6, key=0) {
		this._setString(this._code2str(code6), key);
	}

	// Get param as 8bit compatible 6bit code.
	code8(key=0) {
		let code6 = this.code6(key)
		return this._expandCode(code6);
	}

	// Set param as 8bit compatible 6bit code.
	setCode8(code8, key=0) {
		const compression = 2;
		let code6 = this._compressCode(code8, compression)
		this.setCode6(code6, key);
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		this.context = [];
		this.rand = Date.now(); // Random seed.

		// Setup now.
		this._setup();

		// Setup after load event.
		//window.addEventListener("load", () => {
		//	this._setup();
		//});
	}

	// Setup param.
	_setup() {

		// Load query.
		let query = window.location.search;
		if (query != null && query != "") {
			//console.log("Load query: " + query);
			let text = query.slice(1);
			this._deserialize(text);
		}
	}

	// Reset param.
	_reset() {
		this.context = {};
	}

	// Reload with param.
	_reload(url=null) {
		return new Promise(async (resolve) => {
			let text = this._serialize();
			if (text != null) {
				if (url) {
					let separator = url && url.indexOf("?") < 0 ? "?" : "&";
					let query = text ? separator + text : "";
					//console.log("Jump: " + query);
					window.location.href = url + query;
				} else {
					//console.log("Reload: " + text);
					window.location.search = text;
				}
			}
			return resolve();
		}); // end of new Promise.
	}

	// Share param.
	_share(url=null, files=null) {
		return new Promise(async (resolve) => {
			let text = this._serialize();
			if (text != null) {
				let data = {};
				if (url) {
					let separator = url && url.indexOf("?") < 0 ? "?" : "";
					let query = text ? separator + text : "";
					//console.log("Share query: " + query);
					data.url = url + query;
				} else if (!files) {
					let query = text ? "?" + text : "";
					//console.log("Flush query: " + query);
					window.history.replaceState(null, "", query);
					data.url = window.location.href.replace(/[\?\#].*$/, "") + query;
				}
				if (files) {
					data.files = files;
				}
				if (navigator.canShare) {
					//console.log("Sharing: " + JSON.stringify(data));
					if (navigator.canShare(data) && navigator.share) {
						await navigator.share(data).then(() => {
							//console.log("Successful share");
						}).catch((error) => {
							//console.log("Error sharing:" + error);
						});
					} else {
						//console.log("Not supported file");
					}
				} else {
					//console.log("Not supported share");
				}
			}
			return resolve();
		}); // end of new Promise.
	}

	// Ready to start param.
	_ready() {
		return Promise.resolve();
	}

	// Check the value string contains char.
	_contains(key=0, chars="") {
		if (this.context[key]) {
			if (chars.length <= 0) {
				return true;
			}
			for (let i = 0; i < chars.length; i++) {
				if (this.context[key].includes(chars[i])) {
					return true;
				}
			}
		}
		return false;
	}

	// Get all param keys.
	_keys() {
		return Object.keys(this.context);
	}
	
	// Get value by string.
	_string(key=0) {
		return this.context[key];
	}

	// Set value by string.
	_setString(str, key=0) {
		this.context[key] = str;
	}

	// Get value by integer numbers.
	_numbers(key=0, separator=/\D/) {
		let results = [];
		if (this.context[key]) {
			let q = this.context[key].split(/[^-\d]/);
			for (var i = 0; i < q.length; i++) {
				if (q[i]) {
					results[i] = parseInt(q[i], 10);
				} else if (i < q.length - 1) {
					results[i] = 0;
				}
			}
		}
		return results;
	}

	// Set value by integer numbers.
	_setNumbers(numbers, key=0, separator=".") {
		this.context[key] = numbers.join(separator);
	}

	// Get number 6bit array: 0-9 a-z(10-35) A-Z(36-61) .(62) -(63)
	_stringCode(str) {
		let results = [];
		if (str) {
			for (let i = 0; i < str.length; i++) {
				let c = str.charCodeAt(i);
				if ("0".charCodeAt(0) <= c && c <= "9".charCodeAt(0)) {
					results.push(c - "0".charCodeAt(0));
				} else if ("a".charCodeAt(0) <= c && c <= "z".charCodeAt(0)) {
					results.push(c - "a".charCodeAt(0) + 10);
				} else if ("A".charCodeAt(0) <= c && c <= "Z".charCodeAt(0)) {
					results.push(c - "A".charCodeAt(0) + 36);
				} else if (c == ".".charCodeAt(0)) {
					results.push(62);
				} else if (c == "-".charCodeAt(0)) {
					results.push(63);
				}
			}
		}
		return results;
	}

	// Set number 6bit array: 0-9 a-z(10-35) A-Z(36-61) .(62) -(63)
	_code2str(code6) {
		let result = "";
		for (let i = 0; i < code6.length; i++) {
			if (0 <= code6[i] && code6[i] < 10) {
				result += code6[i];
			} else if (10 <= code6[i] && code6[i] < 36) {
				result += String.fromCharCode("a".charCodeAt(0) + code6[i] - 10);
			} else if (36 <= code6[i] && code6[i] < 62) {
				result += String.fromCharCode("A".charCodeAt(0) + code6[i] - 36);
			} else if (code6[i] == 62) {
				result += ".";
			} else if (code6[i] == 63) {
				result += "-";
			}
		}
		return result;
	}

	// Expand code to 8bit code.
	_expandCode(code) {
		const maxbit = 8, maxmask = (1 << maxbit) - 1;
		let results = [];
		for (let i = 0; i < code.length; i++) {
			let r = 0, x = code[i];
			// Expand 8bit compatible 6bit code to 6bit code.
			let b = maxbit, a = (x - 1) & maxmask; // Minus 1 to reserve 0.
			while (b--) { // Bit reverse.
				r <<= 1;
				r |= (a & 1);
				a >>= 1;
			}
			r = r ^ maxmask; // Bit flip.
			//console.log("Expand: " + ("00000000"+x.toString(2)).slice(-8) + " -> " + ("00000000"+r.toString(2)).slice(-8));
			results[i] = r;
		}
		return results;
	}

	// Compress code to 8bit compatible X (8 - compression) bit code.
	// Requires 6 (compression >= 2) bit when encode with ASCII code only.
	_compressCode(code, compression=2) {
		const maxbit = 8, maxmask = (1 << maxbit) - 1;
		let results = [];
		for (let i = 0; i < code.length; i++) {
			let r = 0, x = code[i];
			// Compress 6bit code to 8bit compatible 6bit code.
			let b = maxbit - compression, a = x ^ maxmask; // Bit flip.
			a = a >> compression; // Compress.
			while (b--) { // Bit reverse.
				r <<= 1;
				r |= (a & 1);
				a >>= 1;
			}
			r = (r + 1) % (1 << (maxbit - compression)); // Plus 1 to reserve 0.
			//console.log("Compress: " + ("00000000"+x.toString(2)).slice(-8) + " -> " + ("00000000"+r.toString(2)).slice(-8));
			results[i] = r;
		}
		return results;
	}

	// Percent encode/decode table.
	static percents = {"%":"%25","&":"%26","?":"%3F",/*"/":"%2F",*/};

	// Deserialize context to parameters.
	_deserialize(context) {
		this.context = [];
		if (context.includes('&')) {
			context.split('&').forEach((q) => {
				if (q.includes('=')) {
					let key = q.substr(0, q.indexOf('='));
					let value = q.substr(q.indexOf('=') + 1);
					// Percent decode.
					for (let p in pico.Param.percents) {
						value = value.replaceAll(pico.Param.percents[p], p);
					}
					this.context[key] = value;
				} else if (q.includes('+')) {
					let qs = q.split('+');
					for (var i = 0; i < qs.length; i++) {
						this.context[i] = qs[i];
					}
				} else {
					this.context[0] = q;
				}
			});
		} else if (context.includes('=')) {
			let key = context.substr(0, context.indexOf('='));
			let value = context.substr(context.indexOf('=') + 1);
			// Percent decode.
			for (let p in pico.Param.percents) {
				value = value.replaceAll(pico.Param.percents[p], p);
			}
			this.context[key] = value;
		} else if (context.includes('+')) {
			this.context = context.split('+');
		} else {
			this.context[0] = context;
		}
	}

	// Serialize parameters to context.
	_serialize() {
		let param0 = "", params = [];
		for (let key in this.context) {
			if (key != null && this.context[key] != null && this.context[key] != "") {
				if (isNaN(key)) {
					let value = "" + this.context[key];
					// Percent encode.
					for (let p in pico.Param.percents) {
						value = value.replaceAll(p, pico.Param.percents[p]);
					}
					params.push(key + "=" + value);
				} else if (param0.length > 0) {
					param0 = param0 + "+" + this.context[key];
				} else {
					param0 = this.context[key];
				}
			}
		}
		if (param0.length > 0) {
			params.unshift(param0);
		}
		return params.join("&");
	}
};

// Master param.
pico.param = new pico.Param();

/* PICO Sound module */

// Wait.
async function picoWait(t=1000) {
	try {
		await pico.sound.wait(t);
	} catch (error) {
		console.error(error);
	}
}

// Beep.
async function picoBeep(kcent=0, length=0.1, delay=0) {
	try {
		await pico.sound.beep(kcent, length, delay);
	} catch (error) {
		console.error(error);
	}
}

// Stop sound.
async function picoStop() {
	try {
		await pico.sound.stop();
	} catch (error) {
		console.error(error);
	}
}

// Play pulse melody.
// pattern=0.125,0.25,0.5 (8bit original parameter)
async function picoPulse(kcents=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playPulse(kcents, length, pattern, repeat);
	} catch (error) {
		console.error(error);
	}
}

// Play triangle melody.
// pattern=16 (8bit original parameter)
async function picoTriangle(kcents=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playTriangle(kcents, length, pattern, repeat);
	} catch (error) {
		console.error(error);
	}
}

// Play noise sound.
// pattern=1,6 (8bit original parameter)
async function picoNoise(length=0.1, pattern=0, delay=0) {
	try {
		await pico.sound.playNoise(length, pattern, delay);
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Sound class.
pico.Sound = class {
	static volume = 0.1; // Master volume.
	static frequency = 440; // Master frequency.

	// Wait.
	wait(t=1000) {
		return new Promise(r => setTimeout(r, t));
	}

	// Beep.
	beep(kcent=0, length=0.1, delay=0) {
		const type = "square"; // Beep sound type: "sine", "square", "sawtooth", "triangle"
		return this._play(type, [kcent], length, delay);
	}

	// Stop sound.
	stop() {
		return this._stop();
	}

	// Play pulse melody.
	playPulse(kcents=[0], length=0.1, pattern=0, repeat=1) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < repeat || repeat <= 0; i++) {
				for (let j = 0; j < kcents.length; j++) {
					//console.log("Pulse melody: " + i + "/" + repeat + ":" + j + "/" + kcents.length);
					await this._pulse(kcents[j], length, pattern);
					if (this.stopped) {
						//console.log("Pulse melody End.");
						resolve();
					}
				}
			}
		}); // end of new Promise.
	}

	// Play triangle melody.
	playTriangle(kcents=[0], length=0.1, pattern=0, repeat=1) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < repeat || repeat <= 0; i++) {
				for (let j = 0; j < kcents.length; j++) {
					//console.log("Triangle melody: " + i + "/" + repeat + ":" + j + "/" + kcents.length);
					await this._triangle(kcents[j], length, pattern);
					if (this.stopped) {
						//console.log("Triangle melody End.");
						resolve();
					}
				}
			}
		}); // end of new Promise.
	}

	// Play noise.
	playNoise(length=0.1, pattern=0, delay=0) {
		return this._noise(length, pattern, delay);
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		//this.lock = "picoSoundLock" + Date.now(); // Lock object identifier.
		this.context = null; // Audio context.
		this.oscillator = null; // Oscillator node.
		this.master = null; // Master volume node.
		this.started = false; // Oscillator start flag.
		this.stopped = false; // Oscillator stop flag.
		this.endTime = 0; // End time count.

		// Setup after click event for audio permission.
		document.addEventListener("click", () => {
			this._setup();
		});

		// Setup after visibility changed to visible.
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") {
				this._setup();
			}
		});
	}

	// Setup sound.
	_setup() {
		return new Promise((resolve) => {

			// Create audio.
			if (this.context == null) {
				//console.log("Create audio.");
				this.context = new window.AudioContext();
				this.master = this.context.createGain();
				//this.master.gain.value = pico.Sound.volume;
				this.master.connect(this.context.destination);
				this.oscillator = this.context.createOscillator();
				this.oscillator.frequency.setValueAtTime(pico.Sound.frequency, this.context.currentTime);

				// Close audio.
				this.oscillator.onended = () => {
					//console.log("Close audio.");
					this.master.gain.value = 0;
					this.master.disconnect(this.context.destination);
					this.context.close();
					this.context = this.oscillator = this.master = null;
					this.started = this.stopped = false;
					this.endTime = 0;
				};
			}
			return Promise.resolve();
		}); // end of new Promise.
	}

	// Stop sound.
	_stop() {
		if (this.context == null) {
			//console.log("No audio.");
			return Promise.reject();
		} else if (!this.started) {
			//console.log("Not started.");
			return Promise.resolve();
		}

		// Stop audio.
		let restTime = this.endTime - Date.now();
		//console.log("Stop: " + restTime);
		if (restTime >= 0) {
			//console.log("Disconnect.")
			this.master.gain.value = 0;
			//this.oscillator.disconnect(this.master);
			this.stopped = true; // Wait for end on start function.
		}
		return Promise.resolve();
	}

	// Ready to start sound.
	_ready() {
		if (this.context == null) {
			//console.log("No audio.");
			return Promise.reject();
		//} else if (!this.started) {
		//	//console.log("Not started.");
		//	return Promise.resolve();
		}
		return Promise.resolve();
/*
		// Wait for previous end audio.
		return new Promise((resolve) => {
			let restTime = this.endTime - Date.now();
			if (restTime > 0) {
				//console.log("Wait for previous end: " + restTime);
				setTimeout(resolve, restTime);
			} else {
				//console.log("Ready: " + restTime);
				resolve();
			}
		}); // end of new Promise.
*/
	}

	// Play sound.
	_play(type=null, kcents=[0], length=0.1, delay=0, volume=1) {
		if (this.context == null) {
			//console.log("No audio.");
			return Promise.reject();
		} else if (this.endTime < 0 || this.endTime > Date.now() + delay * 1000) {
			//console.log("Not end previous sound.");
			return Promise.resolve();
		}

		// Wait for ready to play.
		return this._ready().then(() => {
			return new Promise((resolve) => {

				// Wait to play.
				//console.log("Wait to play: " + Date.now() + " -> " + this.endTime);
				//let endTime = Date.now() + length * 1000 + delay * 1000;
				//this.endTime = endTime > this.endTime ? endTime : this.endTime;
				this.endTime = Date.now() + length * 1000 + delay * 1000;
				this.stopped = false;
				setTimeout(() => {

					// Play sound.
					//console.log("Play: " + kcents + " x " + length * kcents.length + " + " + delay);
					if (type) {

						// Connect.
						let startTime = Date.now();
						//console.log("Connect: " + startTime);
						this.oscillator.type = type;
						for (let i = 0; i < kcents.length; i++) {
							this.oscillator.detune.setValueAtTime(kcents[i] * 1000, this.context.currentTime + length * i);
						}
						this.oscillator.connect(this.master);

						// Set volume and start audio.
						this.master.gain.value = pico.Sound.volume * volume;
						if (!this.started) {
							//console.log("Start audio.");
							this.oscillator.start();
							this.started = true;
						}

						// Wait to end.
						setTimeout(() => {
							/*if (this.stopped) { // Stopped on stop function.
								//console.log("Stopped.");
								//this.endTime = 0;
							} else {*/
								// End.
								//console.log("End: " + kcents + " x " + length * kcents.length);
								//if (type) {
								//	//console.log("EndTime: " + Date.now() + " -> " + this.endTime);
									this.master.gain.value = 0;

									// Disconnect.
									if (Date.now() >= this.endTime) {
										//console.log("Disconnect: " + startTime);
										this.oscillator.disconnect(this.master);
										//this.endTime = 0;
									}
								//}
							//}
							resolve();
						}, length * kcents.length * 1000);

					} else {

						// Play customized sound.
						this.master.gain.value = pico.Sound.volume * volume;

						// Wait to end.
						setTimeout(() => {
							//if (this.stopped) { // Stopped on stop function.
							//	//console.log("Stopped.");
							//} else {
								// End.
								//console.log("End: " + kcents + " x " + length * kcents.length);
								this.master.gain.value = 0;
							//}
							resolve();
						}, length * kcents.length * 1000);
					}
				}, delay * 1000);
			}); // end of new Promise.
		});
	}

	// Start pulse sound.
	_pulse(kcent=0, length=0.1, pattern=0, volume=1) {
		if (this.context == null) {
			//console.log("No audio.");
			return Promise.reject();
		}
		//console.log("Pulse" + pattern + ": " + kcent + " x " + length);

		// 8bit original argorithm and parameter: pattern=0.125,0.25,0.5
		if (pattern > 0) {

			// Create pulse filters.
			let frequency = !kcent ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (kcent * 1000 / 1200));
			let pulseFilters = [];
			pulseFilters[0] = this.context.createGain();
			pulseFilters[0].gain.value = -1;
			pulseFilters[1] = this.context.createDelay();
			pulseFilters[1].delayTime.value = (1.0 - pattern) / frequency;

			// Connect pulse filters to master volume.
			this.oscillator.connect(pulseFilters[0]).connect(pulseFilters[1]).connect(this.master);
			setTimeout(() => {
				//console.log("Disconnect pulse filters.");
				this.oscillator.disconnect(pulseFilters[0]);
				pulseFilters[0].disconnect(pulseFilters[1]);
				pulseFilters[0] = null;
				pulseFilters[1].disconnect(this.master);
				pulseFilters[1] = null;
			}, length * 1000);

			// Start.
			const type = "sawtooth";
			return this._play(type, [kcent], length, 0, volume);

		// Simple square sound.
		} else {
			const type = "square";
			return this._play(type, [kcent], length, 0, volume);
		}
	}

	// Start triangle sound.
	_triangle(kcent=0, length=0.1, pattern=0, volume=1) {
		if (this.context == null) {
			//console.log("No audio.");
			return Promise.reject();
		}
		//console.log("Triangle" + pattern + ": " + kcent + " x " + length);

		// 8bit original argorithm and parameter: pattern=16
		if (pattern > 0) {

			// Create triangle buffers.
			let triangleBuffer = null;
			triangleBuffer = this.context.createBuffer(1, this.context.sampleRate * length, this.context.sampleRate);

			// 8bit original pseudo triangle argorithm.
			let frequency = !kcent ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (kcent * 1000 / 1200));
			let triangleCycle = 2 * Math.PI, value = 0;
			let buffering = triangleBuffer.getChannelData(0);
			for (let i = 0; i < triangleBuffer.length; i++) {
				let k = (triangleCycle * frequency * i / this.context.sampleRate) % triangleCycle;
				//buffering[i] = Math.sin(k);
				if (k < triangleCycle / 2) {
					if (k < triangleCycle / 4) { // 0 -> 1.
						value = k / (triangleCycle / 4);
					} else { // 1 -> 0.
						value = -k / (triangleCycle / 4) + 2;
					}
					buffering[i] = Math.floor(value * pattern) / pattern;
				} else {
					if (k < triangleCycle * 3 / 4) { // 0 -> -1.
						value = -k / (triangleCycle / 4) + 2;
					} else { // -1 -> 0.
						value = k / (triangleCycle / 4) - 4;
					}
					buffering[i] = Math.ceil(value * pattern) / pattern;
				}
				//if (!Math.floor(i % 100)) {
				//	//console.log("buffering" + i + ": " + value + " -> " + buffering[i]);
				//}
			}

			// Connect triangle generator to master volume.
			let triangleGenerator = null;
			triangleGenerator = this.context.createBufferSource();
			triangleGenerator.buffer = triangleBuffer;
			triangleGenerator.connect(this.master);
			triangleGenerator.start();
			setTimeout(() => {
				//console.log("Disconnect triangle generator.");
				triangleGenerator.disconnect(this.master);
				triangleGenerator = null;
				triangleBuffer = null;
			}, length * 1000);

			// Start.
			const type = null;
			return this._play(type, [0], length, 0, volume);

		// Simple triangle sound.
		} else {
			const type = "triangle";
			return this._play(type, [kcent], length, 0, volume);
		}
	}

	// Start noise sound.
	_noise(length=0.1, pattern=0, delay=0, volume=1) {
		if (this.context == null) {
			//console.log("No audio.");
			return Promise.reject();
		}/* else if (this.endTime < 0 || this.endTime > Date.now() + delay * 1000) {
			//console.log("Not end previous sound.");
			return Promise.resolve();
		}*/
		//console.log("Noise" + pattern + ": " + length + " + " + delay);
		setTimeout(() => {

			// Create noise buffers.
			let noiseBuffer = null;
			noiseBuffer = this.context.createBuffer(2, this.context.sampleRate * length, this.context.sampleRate);

			// 8bit original argorithm and parameter: pattern=1,6
			if (pattern > 0) {
				let reg = 0x8000;
				for (let j = 0; j < noiseBuffer.numberOfChannels; j++) {
					let buffering = noiseBuffer.getChannelData(j);
					for (let i = 0; i < noiseBuffer.length; i++) {
						reg >>= 1;
						reg |= ((reg ^ (reg >> pattern)) & 1) << 15;
						buffering[i] = reg & 1;
					}
				}

			// Random noise sound.
			} else {
				for (let j = 0; j < noiseBuffer.numberOfChannels; j++) {
					let buffering = noiseBuffer.getChannelData(j);
					for (let i = 0; i < noiseBuffer.length; i++) {
						buffering[i] = Math.random() * 2 - 1;
					}
				}
			}

			// Connect noise generator to master volume.
			let noiseGenerator = null;
			noiseGenerator = this.context.createBufferSource();
			noiseGenerator.buffer = noiseBuffer;
			noiseGenerator.connect(this.master);
			noiseGenerator.start();
			setTimeout(() => {
				//console.log("Disconnect noise generator.");
				noiseGenerator.disconnect(this.master);
				noiseGenerator = null;
				noiseBuffer = null;
			}, length * 1000);

			// Start.
			const type = null;
			return this._play(type, [0], length, 0, volume);

		}, delay * 1000);
	}
};

// Master sound.
pico.sound = new pico.Sound();

/* PICO Touch module */

// Read touch event.
async function picoRead(t=-1) {
	try {
		return await pico.touch.read(t);
	} catch (error) {
		console.error(error);
	}
}

// Flush touch event.
function picoFlush() {
	pico.touch.flush();
}

// Check touch motion.
function picoMotion(x, y, r=0, h=0) {
	return pico.touch.motion(x, y, r, h);
}

// Check touch action.
function picoAction(x, y, r=0, h=0) {
	return pico.touch.action(x, y, r, h);
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Touch class.
pico.Touch = class {
	static count = 0; // Object count.
	static width = 200; // Touch width.
	static height = 200; // Touch height.
	static unit = 4; // Unit size. (Requires multiple of 2 for center pixel)
	static parent = "picoTouch"; // Parent element class.

	// Read touch event.
	read(t=10) {
			if (t >= 0) {
				//console.log("Wait timeout: " + t);
				return new Promise(r => setTimeout(r, t)).then(() => {
					return navigator.locks.request(this.lock, async (lock) => {
						return this._read();
					}); // end of lock.
				}); // end of new Promise.

			// Wait until input.
			} else {
				//console.log("Wait until input.");
				return new Promise((resolve) => {
					const timer = setInterval(() => {
						if (this.flushing) {
							clearInterval(timer);
							this.flushing = false;
							return navigator.locks.request(this.lock, async (lock) => {
								this._read();
								resolve();
							}); // end of lock.
						} else {
								if (pico.touch.allscreen._motion() || pico.touch.allscreen._action()) {
									clearInterval(timer);
									this.flushing = false;
									return navigator.locks.request(this.lock, async (lock) => {
										this._read();
										resolve();
									}); // end of lock.
								}
						}
						pico.touch.allscreen._read();
					}, 10); // end of setInterval.
				}); // end of new Promise.
			}
	}

	// Flush touch event.
	flush() {
		this.flushing = true;
	}

	// Check touch motion.
	motion(x=0, y=0, r=0, h=0) {
		return this._motion(x, y, r, h);
	}

	// Check touch action.
	action(x=0, y=0, r=0, h=0) {
		return this._action(x, y, r, h);
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor(parent=null) {
		pico.Touch.count++;
		this.lock = "picoTouchLock" + pico.Touch.count + Date.now(); // Lock object identifier.
		this.panel = null; // Touch panel element.
		this.touching = [[], []]; // Double buffered touching states.
		this.primary = 0; // Primary touching index.
		this.flushing = false; // Flushing flag.

		this._setup(parent);

		// Create allscreen touch class.
		if (parent) {
			this.allscreen = new pico.Touch("");
		}
	}

	// Setup touch panel.
	_setup(parent=null) {
		return new Promise((resolve) => {

			// Create touch panel.
			if (this.panel == null) {
				//console.log("Select touch panel.");
				if (parent && document.getElementsByClassName(parent)[0]) {
					this.panel = document.getElementsByClassName(parent)[0];
				} else {
					this.panel = document.body;
				}

				// Add mouse/touch event listener.
				this.panel.addEventListener("mousedown", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					let x = (evt.pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
					let y = (evt.pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
					navigator.locks.request(this.lock, async (lock) => {
						this._eventTouchCancel(-1);
						this._eventTouchDown(-1, x, y);
					}); // end of lock.
				});
				this.panel.addEventListener("mousemove", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					let x = (evt.pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
					let y = (evt.pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
					navigator.locks.request(this.lock, async (lock) => {
						this._eventTouchMove(-1, x, y);
					}); // end of lock.
				});
				document.addEventListener("mouseup", () => {
					navigator.locks.request(this.lock, async (lock) => {
						this._eventTouchUp(-1);
					}); // end of lock.
				});
				this.panel.addEventListener("touchstart", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							let x = (evt.changedTouches[i].pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
							let y = (evt.changedTouches[i].pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
							this._eventTouchDown(evt.changedTouches[i].identifier, x, y);
						}
					}); // end of lock.
				});
				this.panel.addEventListener("touchmove", (evt) => {
					evt.preventDefault(); // Lock scroll.
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							let x = (evt.changedTouches[i].pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
							let y = (evt.changedTouches[i].pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
							this._eventTouchMove(evt.changedTouches[i].identifier, x, y);
						}
					}); // end of lock.
				}, {passive: false});
				this.panel.addEventListener("touchend", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							this._eventTouchUp(evt.changedTouches[i].identifier);
						}
					}); // end of lock.
				});
				this.panel.addEventListener("touchcancel", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							this._eventTouchCancel(evt.changedTouches[i].identifier);
						}
					}); // end of lock.
				});
			}
			return resolve();
		}); // end of new Promise.
	}

	// Ready to touch.
	_ready() {
		if (this.panel == null) {
			//console.log("No panel.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Touch down event handler.
	_eventTouchDown(w, x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w && this.touching[0][i].motion) {
				this.touching[0][i] = {w:w, x:x, y:y, motion:1};
				//console.log("Touch down: " + i + ":" + JSON.stringify(this.touching[0][i]));
				return;
			}
		}
		let i = this.touching[0].length;
		this.touching[0][i] = {w:w, x:x, y:y, motion:1};
		//console.log("Touch down: " + i + ":" + JSON.stringify(this.touching[0][i]));
	}

	// Touch move event handler.
	_eventTouchMove(w, x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w && this.touching[0][i].motion) {
				this.touching[0][i].motion = 1;
				this.touching[0][i].x = x;
				this.touching[0][i].y = y;
				////console.log("Touch move: " + i + ":" + JSON.stringify(this.touching[0][i]));
				break;
			}
		}
	}

	// Touch up event handler.
	_eventTouchUp(w) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w) {
				this.touching[0][i].motion = 0;
				this.touching[0][i].action = -1;
				//console.log("Touch up: " + i + ":" + JSON.stringify(this.touching[0][i]));
				break;
			}
		}
	}

	// Touch cancel event handler.
	_eventTouchCancel(w) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w) {
				this.touching[0][i].motion = -1;
				//console.log("Touch cancel: " + i + ":" + JSON.stringify(this.touching[0][i]));
				break;
			}
		}
	}

	// Read action event.
	_read() {

		// Update new touching state.
		let touching0 = [], touching1 = [];
		for (let i = 0; i < this.touching[0].length; i++) {

			// Touch up trigger.
			if (this.touching[0][i].action < 0) {
				for (let j = 0; j < this.touching[1].length; j++) {
					if (this.touching[1][j].w == this.touching[0][i].w) {
						//console.log("Up: " + j + ":" + JSON.stringify(this.touching[0][i]));
						touching1[touching1.length] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, action:1};
						break;
					}
				}

			// Touch holding.
			} else if (this.touching[0][i].motion > 0 && this.touching[0][i].motion <= 100) {
				this.touching[0][i].motion++; // Time limit for exceptional movement.
				touching0[touching0.length] = this.touching[0][i];

				// Check down trigger.
				let trigger = true;
				for (let j = 0; j < this.touching[1].length; j++) {
					if (this.touching[1][j].w == this.touching[0][i].w) {
						//console.log("Holding: " + j);// + ":" + JSON.stringify(this.touching[0][i]));
						touching1[touching1.length] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, motion:this.touching[0][i].motion};

						trigger = false;;
						break;
					}
				}

				// Touch down trigger.
				if (trigger) {
					//console.log("Down: " + i + ":" + JSON.stringify(this.touching[0][i]));
					touching1[touching1.length] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, motion:1};
				}
			}
		}
		this.touching[0] = touching0; // Touching state for write.
		this.touching[1] = touching1; // Touching state for read.
		this.primary = 1; // Read from touching state 1.
	}

	// Check touch motion.
	_motion(x, y, r=0, h=0) {
		const cx = pico.Touch.width / 2, cy = pico.Touch.height / 2;
		for (let i = 0; i < this.touching[this.primary].length; i++) {
			if (this.touching[this.primary][i].motion > 0) {
				if (r <= 0) {
					return i + 1;
				} else if (h <= 0) {
					let x2 = Math.pow(cx + x - this.touching[this.primary][i].x, 2);
					let y2 = Math.pow(cy + y - this.touching[this.primary][i].y, 2);
					////console.log("Motion: " + x2 + "," + y2 + "<=" + (r*r));
					if (x2 + y2 <= r * r) {
						return i + 1;
					}
				} else {
					let x1 = cx + x - this.touching[this.primary][i].x;
					let y1 = cy + y - this.touching[this.primary][i].y;
					if (x1 >= -r && x1 <= r && y1 >= -h && y1 <= h) {
						return i + 1;
					}
				}
			}
		}
		return 0;
	}

	// Check touch action.
	_action(x, y, r=0, h=0) {
		const cx = pico.Touch.width / 2, cy = pico.Touch.height / 2;
		for (let i = 0; i < this.touching[this.primary].length; i++) {
			if (this.touching[this.primary][i].action > 0) {
				if (r <= 0) {
					return i + 1;
				} else if (h <= 0) {
					let x2 = Math.pow(cx + x - this.touching[this.primary][i].x, 2);
					let y2 = Math.pow(cy + y - this.touching[this.primary][i].y, 2);
					////console.log("Action: " + x2 + "," + y2 + "<=" + (r*r));
					if (x2 + y2 <= r * r) {
						return i + 1;
					}
				} else {
					let x1 = cx + x - this.touching[this.primary][i].x;
					let y1 = cy + y - this.touching[this.primary][i].y;
					if (x1 >= -r && x1 <= r && y1 >= -h && y1 <= h) {
						return i + 1;
					}
				}
			}
		}
		return 0;
	}
};

// Master touch.
pico.touch = new pico.Touch(pico.Touch.parent);

