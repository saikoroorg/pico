/* PICO Param module */

// Flush params.
async function picoFlush(share=false) {
	await pico.param.flush(share);
}

// Get all params by one strings.
function picoParams() {
	return pico.param.params();
}

// Get param as strings.
function picoStrings(key=0) {
	return pico.param.strings(key);
}

// Set param as strings.
function picoSetStrings(strings, key=0) {
	return pico.param.setStrings(strings, key);
}

// Get param as numbers.
function picoNumbers(key=0) {
	return pico.param.numbers(key);
}

// Set param as numbers.
function picoSetNumbers(numbers, key=0) {
	return pico.param.setNumbers(numbers, key);
}

// Get param as number 6bit(0-63) array.
function picoNumcode(key=0) {
	return pico.param.numcode(key);
}

// Set param as number 6bit(0-63) array.
function picoSetNumcode(numcode, key=0) {
	return pico.param.setNumcode(numcode, key);
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Param class.
pico.Param = class {

	// Flush param.
	async flush(share=false) {
		await this._flush(share);
	}

	// Get all params by one strings.
	params() {
		return this._serialize();
	}

	// Get param as strings.
	strings(key=0) {
		return this._strings(key);
	}

	// Set param as strings.
	_setStrings(strings, key=0) {
		this.__setStrings(strings, key);
	}

	// Get param as numbers.
	numbers(key=0) {
		return this._numbers(key);
	}

	// Set param as numbers.
	setNumbers(numbers, key=0) {
		this._setNumbers(numbers, key);
	}

	// Get param as number 6bit(0-63) array.
	numcode(key=0) {
		return this._numcode(key);
	}

	// Set param as number 6bit(0-63) array.
	setNumcode(numcode, key=0) {
		this._setNumcode(numcode, key);
	}
	
	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		//this.lock = "picoParamLock" + Date.now(); // Lock object identifier.
		this.context = {};

		// Setup now.
		this._setup();

		// Setup after load event.
		//window.addEventListener("load", () => {
		//	this._setup();
		//});
	}

	// Setup param.
	_setup() {
		return new Promise((resolve) => {

			// Loadd query.
			let query = window.location.search;
			if (query != null && query != "") {
				console.log("Load query: " + query);
				let text = query.slice(1);
				this._deserialize(text);
			}
			return Promise.resolve();
		}); // end of new Promise.
	}

	// Flush param.
	_flush(share=false) {
		return new Promise((resolve) => {
			let text = this._serialize();
			if (text != null) {
				let query = "?" + text;
				console.log("Flush query: " + query);
				window.history.replaceState(null, "", query);
				// window.location.search = query;
				if (share) {
					let url = window.location.href.replace(/[\?\#].*$/, '') + query;
					console.log("Share: " + url);
					if (navigator.share) {
						navigator.share({url: url});
					}
				}
			}
			return Promise.resolve();
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

	// Get value by strings.
	_strings(key=0) {
		return this.context[key];
	}

	// Set value by strings.
	_setStrings(strings, key=0) {
		this.context[key] = strings;
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

	// Get number 6bit(0-63) array: 0-9 a-z(10-35) A-Z(36-61) .(62) -(63)
	_numcode(key=0) {
		let results = [];
		if (this.context[key]) {
			for (let i = 0; i < this.context[key].length; i++) {
				let c = this.context[key].charCodeAt(i);
				if ("0".charCodeAt(0) <= c && c <= "9".charCodeAt(0)) {
					results[i] = c - "0".charCodeAt(0);
				} else if ("a".charCodeAt(0) <= c && c <= "z".charCodeAt(0)) {
					results[i] = c - "a".charCodeAt(0) + 10;
				} else if ("A".charCodeAt(0) <= c && c <= "Z".charCodeAt(0)) {
					results[i] = c - "A".charCodeAt(0) + 36;
				} else if (c == ".".charCodeAt(0)) {
					results[i] = 62;
				} else if (c == "-".charCodeAt(0)) {
					results[i] = 63;
				}
			}
		}
		return results;
	}

	// Set number 6bit(0-63) array: 0-9 a-z(10-35) A-Z(36-61) .(62) -(63)
	_setNumcode(numcode, key=0) {
		this.context[key] = "";
		for (let i = 0; i < numcode.length; i++) {
			if (0 <= numcode[i]  && numcode[i] < 10) {
				this.context[key] += numcode[i];
			} else if (10 <= numcode[i] && numcode[i] < 36) {
				this.context[key] += String.fromCharCode("a".charCodeAt(0) + numcode[i] - 10);
			} else if (36 <= numcode[i] && numcode[i] < 62) {
				this.context[key] += String.fromCharCode("A".charCodeAt(0) + numcode[i] - 10);
			} else if (numcode[i] == 62) {
				this.context[key] += ".";
			} else if (numcode[i] == 63) {
				this.context[key] += "-";
			}
		}
	}
	
	// Deserialize context to parameters.
	_deserialize(context) {
		this.context = {};
		if (context.includes('&')) {
			context.split('&').forEach((q) => {
				if (q.includes('=')) {
					let keyvalue = q.split('=');
					if (keyvalue[0] != null && keyvalue[1] != null) {
						this.context[keyvalue[0]] = keyvalue[1];
					}
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
			let keyvalue = context.split('=');
			if (keyvalue[0] != null && keyvalue[1] != null) {
				this.context[keyvalue[0]] = keyvalue[1];
			}
		} else if (context.includes('+')) {
			this.context = context.split('+');
		} else {
			this.context[0] = context;
		}
	}

	// Serialize parameters to context.
	_serialize() {
		let params = [];
		for (let key in this.context) {
			if (key != null && this.context[key] != null) {
				params.push(key + "=" + this.context[key]);
			}
		}
		if (params.length == 1 && this.context[0]) {
			return this.context[0];
		}
		return params.join("&");
	}

};

// Master param.
pico.param = new pico.Param();
