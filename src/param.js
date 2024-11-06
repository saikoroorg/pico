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

// Reset all params.
function picoReset() {
	pico.param.reset();
}

// Get all param keys.
function picoKeys() {
	return pico.param.keys();
}

// Get param as string.
function picoParam(key=0) {
	return pico.param.param(key);
}

// Set param as string.
function picoSetParam(str, key=0) {
	pico.param.setParam(str, key);
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
	pico.param.setNumbers(numbers, key, separator);
}

// Get code by string.
function picoTextCode(str, bitlength=6) {
	return pico.param.textCode(str, bitlength);
}

// Get string by code.
function picoCodeText(code, bitlength=6) {
	return pico.param.codeText(code, bitlength);
}

// Get code as one number by char.
function picoCharCode(char, bitlength=6) {
	return pico.param.textCode(char, bitlength)[0];
}

// Get char by code as one number.
function picoCodeChar(number, bitlength=6) {
	return pico.param.codeText([number], bitlength)[0];
}


//obsolete: Get all params by one string.
function picoParams() {
	return pico.param._serialize();
}
//obsolete: Reset all params.
function picoResetParams() {
	picoReset();
}
//obsolete: Get param as string.
function picoString(key=0) {
	return picoParam(key);
}
//obsolete: Set param as string.
function picoSetString(str, key=0) {
	picoSetParam(str, key);
}
//obsolete: Get param as 6bit code.
function picoCode6(key=0) {
	return picoTextCode(picoParam(key));
}
//obsolete: Set param as 6bit code.
function picoSetCode6(code6, key=0) {
	picoSetParam(picoCodeText(code6), key);
}
//obsolete: Get param as 8bit compatible 6bit code.
function picoCode8(key=0) {
	return picoTextCode(picoParam(key), 8);
}
//obsolete: Set param as 8bit compatible 6bit code.
function picoSetCode8(code8, key=0) {
	picoSetParam(picoCodeText(code8, 8), key);
}
//obsolete: Get 6bit code by string.
function picoStringCode6(str) {
	return picoTextCode(str);
}
//obsolete: Get 8bit compatible 6bit code by string.
function picoStringCode8(str) {
	return picoTextCode(str, 8);
}
//obsolete: Get string by 6bit code.
function picoCode6String(code6) {
	return picoCodeText(code6);
}
//obsolete: Get string by 8bit compatible 6bit code.
function picoCode8String(code8) {
	return picoCodeText(code8, 8);
}
//obsolete: Get 6bit code (1 number) by char.
function picoCharCode6(char) {
	return picoCharCode(char);
}
//obsolete: Get 8bit compatible 6bit code (1 number) by char.
function picoCharCode8(char) {
	return picoCharCode(char, 8);
}
//obsolete: Get char by 6bit code (1 number).
function picoCode6Char(code6) {
	return picoCodeChar(code6);
}
//obsolete: Get char by 8bit compatible 6bit code (1 number).
function picoCode8Char(code8) {
	return picoCodeChar(code8, 8);
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

	// Reset all params.
	reset() {
		this._reset();
	}

	// Get all param keys.
	keys() {
		return this._keys();
	}

	// Get param as string.
	param(key=0) {
		return this._string(key);
	}

	// Set param as string.
	setParam(str, key=0) {
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

	// Get code by string.
	textCode(str, bitlength=6) {
		const basebitlength = 6;
		let code = this._stringCode(str);
		if (bitlength > basebitlength) {
			code = this._expandCode(code, bitlength);
		}
		return code;
	}

	// Get string by code.
	codeText(code, bitlength=6) {
		const basebitlength = 6;
		if (bitlength > basebitlength) {
			code = this._compressCode(code, bitlength)
		}
		return this._codeString(code);
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
	_codeString(code6) {
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

	// Expand 6 bit code to X(bitlength) bit code.
	_expandCode(code6, bitlength=8) {
		const bitmask = (1 << bitlength) - 1;
		let results = [];
		for (let i = 0; i < code6.length; i++) {
			let r = 0, x = code6[i];
			// Expand X bit compatible 6 bit code to X bit code.
			let b = bitlength, a = (x - 1) & bitmask; // Minus 1 to reserve 0.
			while (b--) { // Bit reverse.
				r <<= 1;
				r |= (a & 1);
				a >>= 1;
			}
			r = r ^ bitmask; // Bit flip.
			////console.log("Expand: " + ("00000000"+x.toString(2)).slice(-bitlength) + " -> " + ("00000000"+r.toString(2)).slice(-bitlength));
			results[i] = r;
		}
		return results;
	}

	// Compress code to X(bitlength) bit compatible 6 bit code for encode with ASCII code only.
	_compressCode(code, bitlength=8) {
		const basebitlength = 6;
		const compression = bitlength - basebitlength;
		const bitmask = (1 << bitlength) - 1;
		let results = [];
		for (let i = 0; i < code.length; i++) {
			let r = 0, x = code[i];
			// Compress X bit code to X bit compatible 6 bit code.
			let b = bitlength - compression, a = x ^ bitmask; // Bit flip.
			a = a >> compression; // Compress.
			while (b--) { // Bit reverse.
				r <<= 1;
				r |= (a & 1);
				a >>= 1;
			}
			r = (r + 1) % (1 << (bitlength - compression)); // Plus 1 to reserve 0.
			////console.log("Compress: " + ("00000000"+x.toString(2)).slice(-bitlength) + " -> " + ("00000000"+r.toString(2)).slice(-bitlength));
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

