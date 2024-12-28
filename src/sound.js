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
// pattern = 0 or 1(0.125), 3(0.25), 7(0.5) (8bit original parameter)
// pitches = -3.6(A1:54.6Hz) .. 7.0(G9:12.4kHz)
async function picoPulse(pattern=0, length=0.1, pitch=0, volumes=[1], pitches=null) {
	try {
		await pico.sound.playPulse(pattern, length, pitch, volumes, pitches);
	} catch (error) {
		console.error(error);
	}
}

// Play triangle melody.
// pattern = 0 or 15 (8bit original parameter)
// pitches = -4.8(A0:27.3Hz) .. 8.4(A11:55.9kHz)
async function picoTriangle(pattern=0, length=0.1, pitch=0, volumes=[1], pitches=null) {
	try {
		await pico.sound.playTriangle(pattern, length, pitch, volumes, pitches);
	} catch (error) {
		console.error(error);
	}
}

// Play noise melody.
// pattern = 0 or 1, 6 (8bit original parameter)
// pitches = -7.9(D-3), -6.7(D-2), -5.5(D-1), -5.0(G-1), -4.3(D0), -3.8(G0), -3.1(D1),
//           -2.5?(F1#?), -2.3(A2#), -0.7(D3), -0.2(G3), 0.5(D4), 1.7(D5), 2.9(D6), 4.1(D7), 5.3(D8)
async function picoNoise(pattern=0, length=0.1, pitch=0, volumes=[1], pitches=null) {
	try {
		await pico.sound.playNoise(pattern, length, pitch, volumes, pitches);
	} catch (error) {
		console.error(error);
	}
}

// Set timbre pallete.
async function picoTimbre(timbres=null, scales=null, offset=0) {
	pico.sound.timbre(timbres, scales, offset);
}

// Play melody.
async function picoMelody(melody=[-1,0,0]) {
	try {
		await pico.sound.playMelody(melody);
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Sound class.
pico.Sound = class {
	static count = 0; // Object count.
	static frequency = 440; // Base frequency.
	static maxvolume = 0.1; // Max volume.
	static timbres = [48,0,0]; // Default timbres [Noise(16,17,22)/Triangle(32,47)/Pulse(48,49,51,55), Pitch(0,1..), Volume(0,1..)/Fadeout(16,17..)]
	static scales = [0,2,3,5,7,8,10];//, 1,4,6,9,11]; // Default scales [0:La,1:Ti,2:Do,3:Re,4:Mi,5:Fa,6:So, 7:La+,8:Do+,9:Re+,10:Fa+,11:So+]
	static volumes = [1,0.6]; // Default volumes.

	// Wait.
	wait(t=1000) {
		return new Promise(r => setTimeout(r, t));
	}

	// Beep.
	beep(kcent=0, length=0.1, delay=0) {
		// Beep sound type in ["sine", "square", "sawtooth", "triangle"]
//		return navigator.locks.request(this.lock, async (lock) => {
		return new Promise(async (resolve) => {
			//console.log("Delay: " + delay);
			await setTimeout(async () => {
				console.log("Beep: " + kcent + " x " + length);
				await this._play("square", length, [kcent*10]);
			}, delay * 1000);
			resolve();
		}); // end of new Promise.
//		}); // end of lock.
	}

	// Stop sound.
	stop() {
		return this._stop();
	}

	// Play pulse sound.
	playPulse(pattern=0, length=0.1, pitch=0, volumes=[1], pitches=null) {
//		return navigator.locks.request(this.lock, async (lock) => {
		return new Promise(async (resolve) => {
			if (!pitches) {
				console.log("Pulse: " + pattern + ", " + pitch + ", " + volumes);
				await this._pulse(pattern, length, pitch, volumes);
			} else {
				let imax = pitches.length > volumes.length ? pitches.length : volumes.length;
				for (let i = 0; i < imax; i++) {
					console.log("Pulse " + (i+1) + "/" + imax + ": " + pattern + ", " + pitches[i] + ", " + volumes[i]);
					await this._pulse(pattern, length/imax, pitch+pitches[i], [volumes[i]]);
					if (this.stopped) {
						console.log("Pulse stopped.");
						break;
					}
				}
			}
			console.log("Pulse end.");
			resolve();
		}); // end of new Promise.
//		}); // end of lock.
	}

	// Play triangle sound.
	playTriangle(pattern=0, length=0.1, pitch=0, volumes=[1], pitches=null) {
//		return navigator.locks.request(this.lock, async (lock) => {
		return new Promise(async (resolve) => {
			if (!pitches) {
				console.log("Triangle: " + pattern + ", " + pitch + ", " + volumes);
				await this._triangle(pattern, length, pitch, volumes);
			} else {
				let imax = pitches.length > volumes.length ? pitches.length : volumes.length;
				for (let i = 0; i < imax; i++) {
					console.log("Triangle " + (i+1) + "/" + imax + ": " + pattern + ", " + pitches[i] + ", " + volumes[i]);
					await this._triangle(pattern, length/imax, pitch+pitches[i], [volumes[i]]);
					if (this.stopped) {
						console.log("Triangle stopped.");
						break;
					}
				}
			}
			console.log("Triangle end.");
			resolve();
		}); // end of new Promise.
//		}); // end of lock.
	}

	// Play noise sound.
	playNoise(pattern=0, length=0.1, pitch=0, volumes=[1], pitches=null) {
//		return navigator.locks.request(this.lock, async (lock) => {
		return new Promise(async (resolve) => {
			if (!pitches) {
				console.log("Noise: " + pattern + ", " + pitch + ", " + volumes);
				await this._noise(pattern, length, pitch, volumes);
			} else {
				let imax = pitches.length > volumes.length ? pitches.length : volumes.length;
				for (let i = 0; i < imax; i++) {
					console.log("Noise " + (i+1) + "/" + imax + ": " + pattern + ", " + pitches[i] + ", " + volumes[i]);
					await this._noise(pattern, length/imax, pitch+pitches[i], [volumes[i]]);
					if (this.stopped) {
						console.log("Noise stopped.");
						break;
					}
				}
			}
			console.log("Noise end.");
			resolve();
		}); // end of new Promise.
//		}); // end of lock.
	}

	// Set timbre pallete.
	timbre(timbres=null, scales=null, offset=0) {
//		return navigator.locks.request(this.lock, async (lock) => {
		return new Promise(async (resolve) => {
			if (timbres && timbres.length > 0) {
				this.offset = offset;
				this.timbres.length = offset*3;
				this.timbres = this.timbres.concat(timbres);
				if (scales && scales.length > 0) {
					this.scales = scales.concat();
				}
			} else { // Reset timbres.
				this.offset = offset;
				this.timbres = pico.Sound.timbres.concat();
				this.scales = pico.Sound.scales.concat();
			}
			resolve();
		}); // end of new Promise.
//		}); // end of lock.
	}

	// Play melody.
	playMelody(melody=[-1,0,0]) {
//		return navigator.locks.request(this.lock, async (lock) => {
		return new Promise(async (resolve) => {
			let j = 0, speed = 0;
			if (melody[0] == 0 && melody[1] >= 0 && melody[2] >= 0) {
				speed = melody[1] * 10;
				j += 1;
			}
			for (; j < melody.length/3; j++) {
				let m0 = melody[j*3], m1 = melody[j*3+1], m2 = melody[j*3+2];
				let pattern0 = 0, pattern1 = 0; // Melody pattern;
				let pitch = (m1 - 4) * 12; // 4=Base pitch index, 12=Pitch difference on 1 octave.
				let pctrl = 0, fctrl = 0, vctrl = 1; // Pitch, Fade, Volume control.
				let length = 60 / speed * m2 / 6; // 60=1 minute, 6=Base note length.
				for (let i = 0; i < 4; i++) { // Seek matched tone in timbres.
					let k1 = (m0 < this.offset ? m0 : m0 - this.offset) - (this.scales.length+1)*i;
					if (k1 == this.scales.length) { // Rest.
						break;
					} else if (k1 >= 0 && k1 < this.scales.length) {
						let j1 = m0 < this.offset ? i : i + this.offset;
						pattern0 = Math.floor(this.timbres[j1*3] / 16); // Upper bits.
						pattern1 = Math.floor(this.timbres[j1*3] % 16); // Lower bits.
						pitch = pitch + this.scales[k1]; // Scale up/down by 1 octave.
						pctrl = -this.timbres[j1*3+1];
						fctrl = Math.floor(this.timbres[j1*3+2] / 16); // Upper bits.
						vctrl = 1 - Math.floor(this.timbres[j1*3+2] % 16)/16; // Lower bits.
						break;
					}
				}

				// Volume pattern.
				let p = pitch + pctrl, v = [vctrl];
				if (fctrl > 0) {
					let imax = m2 * 2;
					for (let i = 0; i < imax; i++) {
						let u = vctrl - fctrl*i/16;
						v[i] = u > 0 ? u : 0;
					}
				}

				console.log("Melody " + j + "/" + (melody.length/3) + ": " +
					pitch + " x " + length + " " + m0 + " " + m1 + " " + m2 + " - " + pattern0 + " " + pattern1 + " - " + p + " " + v);
				if (pattern0 == 1) {
					//console.log("Noise " + pattern1 + ": " + p + "," + v);
					await this._noise(pattern1, length, p, v);
				} else if (pattern0 == 2) {
					//console.log("Triangle " + pattern1 + ": " + p + "," + v);
					await this._triangle(pattern1, length, p, v);
				} else if (pattern0 == 3) {
					//console.log("Pulse " + pattern1 + ": " + p + "," + v);
					await this._pulse(pattern1, length, p, v);
				} else {
					await this.wait(length * 1000);
				}
			}
			//console.log("Melody end.");
			resolve();
		}); // end of new Promise.
//		}); // end of lock.
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		pico.Sound.count++;
		this.lock = "picoSoundLock" + pico.Sound.count + Date.now(); // Lock object identifier.
		this.context = null; // Audio context.
		this.master = null; // Master volume node.
		this.stopped = false; // Stop flag.
		this.offset = 0; // Timbres index offset.
		this.timbres = Object.assign([], pico.Sound.timbres); // Master timbres.
		this.scales = Object.assign([], pico.Sound.scales); // Master scales.

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
				console.log("Create audio.");
				this.context = new window.AudioContext();
				this.master = this.context.createGain();
				//this.master.gain.value = pico.Sound.maxvolume;
				this.master.connect(this.context.destination);
			}
			return Promise.resolve();
		}); // end of new Promise.
	}

	// Stop sound.
	_stop() {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// Stop audio.
		console.log("Stop audio.");
		this.master.disconnect(this.context.destination);
		this.master = null;
		this.master = this.context.createGain(); // Recreate master volume.
		//this.master.gain.value = pico.Sound.maxvolume;
		this.master.connect(this.context.destination);
		this.stopped = true; // Wait for end on each function.
		return Promise.resolve();
	}

	// Ready to start sound.
	_ready() {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Start sound and control volumes.
	_start(length, volumes=null) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// Wait for ready to play.
		return this._ready().then(() => {
			return new Promise((resolve) => {
				if (volumes && volumes.length >= 2) {
					for (let i = 0; i < volumes.length; i++) {
						let v = volumes[i] < 1 ? volumes[i] * pico.Sound.maxvolume : pico.Sound.maxvolume;
						let t = this.context.currentTime + length * i/volumes.length;
						//console.log("Set volume: " + v + " at " + t);
						this.master.gain.setValueAtTime(v, t);
					}
				} else {
					let v = volumes && volumes[0] < 1 ? volumes[0] * pico.Sound.maxvolume : pico.Sound.maxvolume;
					//console.log("Set volume: " + v);
					this.master.gain.value = v;
				}
				//this.master.gain.setValueAtTime(0, this.context.currentTime + length);

				// Wait to end.
				this.stopped = false;
				setTimeout(() => {
					resolve();
				}, length*1000);
			}); // end of new Promise.
		});
	}

	// Play sound.
	_play(type=null, length=0.1, pitches=null, volumes=null) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// Wait for ready to play.
		return this._ready().then(async () => {

			// Play sound.
			//console.log("Play " + type + ": " + pitches + " x " + length);
			if (type) {

				// Create oscillator.
				let oscillator = this.context.createOscillator();
				oscillator.frequency.value = pico.Sound.frequency;

				// Setup oscillator.
				oscillator.type = type;
				if (pitches && pitches.length >= 2) {
					for (let i = 0; i < pitches.length; i++) {
						let p = pitches[i] ? pitches[i] * 100 : 0;
						let t = this.context.currentTime + length * i/pitches.length;
						//console.log("Set pitch: " + p + " at " + t);
						oscillator.detune.setValueAtTime(p, t);
					}
				} else {
					let p = pitches && pitches[0] ? pitches[0] * 100 : 0;
					//console.log("Set pitch: " + p);
					oscillator.detune.value = p;
				}

				// Connect oscillator.
				//console.log("Connect oscillator.");
				oscillator.connect(this.master);
				oscillator.start();

				// Start sound.
				await this._start(length, volumes).then(() => {
					if (!this.stopped) {
						oscillator.disconnect(this.master);
					}
					oscillator = null;
				});
			}
		});
	}

	// Start pulse sound.
	_pulse(pattern=0, length=0.1, pitch=0, volumes=[1]) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// 8bit original argorithm and parameter: pattern=1(0.5),3(0.25),7(0.125)
		if (pattern > 0) {

			// Create oscillator.
			//console.log("Create oscillator: " + pitch * 100);
			let oscillator = this.context.createOscillator();
			oscillator.type = "sawtooth";
			oscillator.detune.value = pitch * 100;
			oscillator.frequency.value = pico.Sound.frequency;

			// Create pulse filters.
			let frequency = pico.Sound.frequency * (pitch ? 2 ** (pitch * 100 / 1200) : 1);
			//console.log("Create pulse filters " + pattern + ": " + pitch + "=" + frequency);
			let pulseFilters = [];
			pulseFilters[0] = this.context.createGain();
			pulseFilters[0].gain.value = -1;
			pulseFilters[1] = this.context.createDelay();
			pulseFilters[1].delayTime.value = (1.0 - 1/(pattern+1)) / frequency;

			// Connect pulse filters to master volume.
			//console.log("Connect pulse filters.");
			oscillator.connect(pulseFilters[0]).connect(pulseFilters[1]).connect(this.master);
			oscillator.connect(this.master);
			oscillator.start();

			// Start pulse sound.
			//console.log("Start pulse sound " + pattern + ": " + pitch + "=" + frequency + " x " + length);
			return this._start(length, volumes).then(() => {

				if (!this.stopped) {
					oscillator.disconnect(this.master);
					pulseFilters[1].disconnect(this.master);
					pulseFilters[0].disconnect(pulseFilters[1]);
					oscillator.disconnect(pulseFilters[0]);
				}
				pulseFilters[1] = null;
				pulseFilters[0] = null;
				oscillator = null;
			});

		// Simple square sound.
		} else {

			// Start square sound.
			console.log("Start square sound " + pattern + ": " + pitch + " x " + length);
			return this._play("square", length, [pitch], volumes);
		}
	}

	// Start triangle sound.
	_triangle(pattern=0, length=0.1, pitch=0, volumes=[1]) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// 8bit original argorithm and parameter: pattern=15
		if (pattern > 0) {

			// Create triangle buffers.
			let triangleBuffer = null;
			triangleBuffer = this.context.createBuffer(1, this.context.sampleRate * length, this.context.sampleRate);

			// 8bit original pseudo triangle argorithm.
			let frequency = pico.Sound.frequency * (pitch ? 2 ** (pitch * 100 / 1200) : 1);
			let triangleCycle = 2 * Math.PI, value = 0;
			//console.log("Create triangle buffers " + pattern + ": " + pitch + "=" + frequency);
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
					buffering[i] = Math.floor(value * (pattern+1)) / (pattern+1);
				} else {
					if (k < triangleCycle * 3 / 4) { // 0 -> -1.
						value = -k / (triangleCycle / 4) + 2;
					} else { // -1 -> 0.
						value = k / (triangleCycle / 4) - 4;
					}
					buffering[i] = Math.ceil(value * (pattern+1)) / (pattern+1);
				}
				//if (!Math.floor(i % 100)) {
				//	console.log("buffering" + i + ": " + value + " -> " + buffering[i]);
				//}
			}

			// Connect triangle generator to master volume.
			//console.log("Connect triangle generator.");
			let triangleGenerator = null;
			triangleGenerator = this.context.createBufferSource();
			triangleGenerator.buffer = triangleBuffer;
			triangleGenerator.connect(this.master);
			triangleGenerator.start();

			// Start pseudo triangle sound.
			//console.log("Start pseudo triangle sound " + pattern + ": " + pitch + "=" + frequency + " x " + length);
			return this._start(length, volumes).then(() => {

				// Disconnect triangle generator.
				//console.log("Disconnect triangle generator.");
				if (!this.stopped) {
					triangleGenerator.disconnect(this.master);
				}
				triangleGenerator = null;
				triangleBuffer = null;
			});

		// Simple triangle sound.
		} else {

			// Start triangle sound.
			//console.log("Start triangle sound " + pattern + ": " + pitch + " x " + length);
			return this._play("triangle", length, [pitch], volumes);
		}
	}

	// Start noise sound.
	_noise(pattern=0, length=0.1, pitch=0, volumes=[1]) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// Create noise buffers.
		//console.log("Create noise buffers " + pattern + ".");
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

		// Create noise generator.
		//console.log("Connect noise generator.");
		let noiseGenerator = null;
		noiseGenerator = this.context.createBufferSource();
		noiseGenerator.buffer = noiseBuffer;
		noiseGenerator.detune.setValueAtTime(pitch * 100, this.context.currentTime);

		// Connect noise generator to master volume.
		noiseGenerator.connect(this.master);
		noiseGenerator.start();

		// Start noise sound.
		//console.log("Start noise sound " + pattern + ": " + pitch + " x " + length);
		return this._start(length, volumes).then(() => {

			// Disconnect noise generator.
			//console.log("Disconnect noise generator.");
			if (!this.stopped) {
				noiseGenerator.disconnect(this.master);
			}
			noiseGenerator = null;
			noiseBuffer = null;
		});
	}
};

// Master sound.
pico.sound = new pico.Sound();

