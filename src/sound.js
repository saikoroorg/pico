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
async function picoPulse(pattern=0, length=0.1, pitches=[0], volumes=[1]) {
	try {
		await pico.sound.playPulse(pattern, length, pitches, volumes);
	} catch (error) {
		console.error(error);
	}
}

// Play triangle melody.
// pattern = 0 or 15 (8bit original parameter)
// pitches = -4.8(A0:27.3Hz) .. 8.4(A11:55.9kHz)
async function picoTriangle(pattern=0, length=0.1, pitches=[0], volumes=[1]) {
	try {
		await pico.sound.playTriangle(pattern, length, pitches, volumes);
	} catch (error) {
		console.error(error);
	}
}

// Play noise melody.
// pattern = 0 or 1, 6 (8bit original parameter)
// pitches = -7.9(D-3), -6.7(D-2), -5.5(D-1), -5.0(G-1), -4.3(D0), -3.8(G0), -3.1(D1),
//           -2.5?(F1#?), -2.3(A2#), -0.7(D3), -0.2(G3), 0.5(D4), 1.7(D5), 2.9(D6), 4.1(D7), 5.3(D8)
async function picoNoise(pattern=0, length=0.1, pitches=[0], volumes=[1]) {
	try {
		await pico.sound.playNoise(pattern, length, pitches, volumes);
	} catch (error) {
		console.error(error);
	}
}

// Set timbre pallete.
async function picoTimbre(timbres=null, scales=null, offset=0) {
	pico.sound.timbre(timbres, scales, offset);
}

// Play melody.
async function picoMelody(melody=[0], speed=150) {
	try {
		await pico.sound.playMelody(melody, speed);
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Sound class.
pico.Sound = class {
	static frequency = 440; // Base frequency.
	static maxvolume = 0.05; // Max volume.
	static scales = [0,2,3,5,7,8,10];//, 1,4,6,9,11]; // 0:La,1:Ti,2:Do,3:Re,4:Mi,5:Fa,6:So, // 7:La+,8:Do+,9:Re+,10:Fa+,11:So+
	static timbres = [3,0,0]; // 3(pulse),0,0, // 1(noise),1,0, 2(triangle),15,0, 3(pulse),1,0, 3(pulse),7,0

	// Wait.
	wait(t=1000) {
		return new Promise(r => setTimeout(r, t));
	}

	// Beep.
	beep(kcent=0, length=0.1, delay=0) {
		// Beep sound type in ["sine", "square", "sawtooth", "triangle"]
		return new Promise((resolve) => {
			console.log("Delay: " + delay);
			setTimeout(() => {
				console.log("Beep: " + kcent + " x " + length);
				this._play("square", length, [kcent*10]).then(() => {
					resolve();
				});
			}, delay * 1000);
		}); // end of new Promise.
	}

	// Stop sound.
	stop() {
		return this._stop();
	}

	// Play pulse melody.
	playPulse(pattern=0, length=0.1, pitches=[0], volumes=[1]) {
		return new Promise(async (resolve) => {
			let imax = pitches.length > volumes.length ? pitches.length : volumes.length;
			for (let i = 0; i < imax; i++) {
				console.log("Pulse " + (i+1) + "/" + imax + ": " + pitches[i] + "," + volumes[i]);
				await this._pulse(pattern, length, pitches[i], volumes[i]);
				if (this.stopped) {
					console.log("Pulse End.");
					resolve();
				}
			}
		}); // end of new Promise.
	}

	// Play triangle melody.
	playTriangle(pattern=0, length=0.1, pitches=[0], volumes=[1]) {
		return new Promise(async (resolve) => {
			let imax = pitches.length > volumes.length ? pitches.length : volumes.length;
			for (let i = 0; i < imax; i++) {
				console.log("Triangle " + (i+1) + "/" + imax + ": " + pitches[i] + "," + volumes[i]);
				await this._triangle(pattern, length, pitches[i], volumes[i]);
				if (this.stopped) {
					console.log("Triangle End.");
					resolve();
				}
			}
		}); // end of new Promise.
	}

	// Play noise melody.
	playNoise(pattern=0, length=0.1, pitches=[0], volumes=[1]) {
		return new Promise(async (resolve) => {
			let imax = pitches.length > volumes.length ? pitches.length : volumes.length;
			for (let i = 0; i < imax; i++) {
				console.log("Noise " + (i+1) + "/" + imax + ": " + pitches[i] + "," + volumes[i]);
				await this._noise(pattern, length, pitches[i], volumes[i]);
				if (this.stopped) {
					console.log("Noise End.");
					resolve();
				}
			}
		}); // end of new Promise.
	}

	// Set timbre pallete.
	timbre(timbres=null, scales=null, offset=0) {
		if (timbres && timbres.length > 0) {
			this.timbres = timbres.concat();
			if (scales && scales.length > 0) {
				this.scales = scales.concat();
			}
			if (offset > 0) {
				this.offset = offset;
			}
		} else {
			this.timbres = pico.Sound.timbres.concat();
		}
	}

	// Play melody.
	playMelody(melody=[0], speed=150) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < melody.length/3; i++) {
				let m0 = melody[i*3], m1 = melody[i*3+1], m2 = melody[i*3+2];
				let pattern0 = 0, pattern1 = 0; // Melody pattern;
				let pitch = (m1 - 4) * 12; // 4=Base pitch index, 12=Pitch difference on 1 octave.
				let length = 60 / speed * m2 / 6; // 60=1 minute, 6=Base note length.
				for (let j = 0; j < 4; j++) {
					let k1 = m0 - this.offset - (this.scales.length+1)*j;
					if (k1 == this.scales.length) { // Rest.
						break;
					} else if (k1 >= 0 && k1 < this.scales.length) {
						pattern0 = this.timbres[j*3];
						pattern1 = this.timbres[j*3+1];
						pitch = pitch + this.scales[k1]; // Scale up/down by 1 octave.
						break;
					}
				}
				console.log("Melody " + (i+1) + "/" + (melody.length/3) + ": " +
					pitch + " x " + length + " " + m0 + " " + m1 + " " + m2 + " - " + pattern0 + " " + pattern1);
				if (pattern0 == 1) {
					console.log("Noise " + pattern1 + ": " + pitch + " x " + length);
					await this._noise(pattern1, length, pitch);
				} else if (pattern0 == 2) {
					console.log("Triangle " + pattern1 + ": " + pitch + " x " + length);
					await this._triangle(pattern1, length, pitch);
				} else if (pattern0 == 3) {
					console.log("Pulse " + pattern1 + ": " + pitch + " x " + length);
					await this._pulse(pattern1, length, pitch);
				} else {
					await this.wait(length * 1000);
				}
				if (this.stopped) {
					//console.log("Melody End.");
					//resolve();
				}
			}
			console.log("Melody End.");
			resolve();
		}); // end of new Promise.
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		//this.lock = "picoSoundLock" + Date.now(); // Lock object identifier.
		this.context = null; // Audio context.
		this.oscillator = null; // Oscillator node.
		this.master = null; // Master volume node.
		this.started = false; // Oscillator start flag.
		this.stopped = true; // Oscillator stop flag.
		this.endTime = 0; // End time count.
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
				this.oscillator = this.context.createOscillator();
				this.oscillator.frequency.setValueAtTime(pico.Sound.frequency, this.context.currentTime);

				// Close audio.
				this.oscillator.onended = () => {
					console.log("Close audio.");
					this.master.gain.value = 0;
					this.master.disconnect(this.context.destination);
					this.context.close();
					this.context = this.oscillator = this.master = null;
					this.started = false;
					this.stopped = true;
					this.endTime = 0;
				};
			}
			return Promise.resolve();
		}); // end of new Promise.
	}

	// Stop sound.
	_stop() {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		} else if (!this.started) {
			console.log("Not started.");
			return Promise.resolve();
		}

		// Stop audio.
		let restTime = this.endTime - this.context.currentTime;//Date.now();
		console.log("Stop: " + restTime);
		if (restTime >= 0) {
			this.master.gain.value = 0;
			if (!this.stopped) {
				console.log("Disconnect.")
				this.oscillator.disconnect(this.master);
				this.stopped = true; // Wait for end on start function.
			}
		}
		return Promise.resolve();
	}

	// Ready to start sound.
	_ready() {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		//} else if (!this.started) {
		//	console.log("Not started.");
		//	return Promise.resolve();
		}
		return Promise.resolve();
/*
		// Wait for previous end audio.
		return new Promise((resolve) => {
			let restTime = this.endTime - Date.now();
			if (restTime > 0) {
				console.log("Wait for previous end: " + restTime);
//				setTimeout(resolve, restTime);
			} else {
				console.log("Ready: " + restTime);
				resolve();
			}
		}); // end of new Promise.
*/
	}

	// Start sound.
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

				// Start audio.
				if (!this.started) {
					//console.log("Start audio.");
					this.oscillator.start();
					this.started = true;
				}

				// Wait to play end.
				let startTime = this.context.currentTime;//Date.now();
				let endTime = this.context.currentTime+length;//startTime + length*1000;
				this.endTime = endTime > this.endTime ? endTime : this.endTime;
				//this.endTime = Date.now() + length;
				//console.log("Wait to play end: " + startTime + " -> " + this.endTime);
				this.stopped = false;

				// Wait to end.
				setTimeout(() => {
					//if (this.stopped) { // Stopped on stop function.
					//	console.log("Stopped.");
					//} else {
						// End.
						//console.log("End: " + this.endTime);
						this.endTime = 0;
						resolve();
					//}
				}, length*1000);
			}); // end of new Promise.
		});
	}

	// Play sound.
	_play(type=null, length=0.1, pitches=null, volumes=null) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
	//	} else if (this.endTime < 0 || this.endTime > Date.now()) {
	//		console.log("Not end previous sound.");
	//		return Promise.resolve();
		}

		// Wait for ready to play.
		return this._ready().then(async () => {

			// Play sound.
			//console.log("Play " + type + ": " + pitches + " x " + length);
			if (type) {

				// Connect.
				this.oscillator.type = type;
				if (pitches && pitches.length >= 2) {
					for (let i = 0; i < pitches.length; i++) {
						let p = pitches[i] ? pitches[i] * 100 : 0;
						let t = this.context.currentTime + length * i/pitches.length;
						//console.log("Set pitch: " + p + " at " + t);
						this.oscillator.detune.setValueAtTime(p, t);
					}
				} else {
					let p = pitches && pitches[0] ? pitches[0] * 100 : 0;
					//console.log("Set pitch: " + p);
					this.oscillator.detune.value = p;
				}
				//console.log("Connect oscillator.");
				this.oscillator.connect(this.master);

				// Start sound.
				await this._start(length, volumes).then(() => {

					if (!this.stopped) {
						//console.log("Disconnect oscillator.")
						this.oscillator.disconnect(this.master);
						this.stopped = true; // Wait for end on start function.
					}
				});
			}
		});
	}

	// Start pulse sound.
	_pulse(pattern=0, length=0.1, pitch=0, volume=1) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// 8bit original argorithm and parameter: pattern=1(0.5),3(0.25),7(0.125)
		if (pattern > 0) {

			// Create pulse filters.
			let frequency = !pitch ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (pitch * 100 / 1200));
			let pulseFilters = [];
			pulseFilters[0] = this.context.createGain();
			pulseFilters[0].gain.value = -1;
			pulseFilters[1] = this.context.createDelay();
			//console.log("Set pitch: " + pitch + "=" + frequency);
			pulseFilters[1].delayTime.value = (1.0 - 1/(pattern+1)) / frequency;

			// Connect pulse filters to master volume.
			//console.log("Connect pulse filters.");
			this.oscillator.connect(pulseFilters[0]).connect(pulseFilters[1]).connect(this.master);

			// Start pulse sound.
			//console.log("Start pulse sound " + pattern + ": " + pitch + "=" + frequency + " x " + length);
			return this._play("sawtooth", length, [pitch], [volume]).then(() => {

				//console.log("Disconnect pulse filters.");
				this.oscillator.disconnect(pulseFilters[0]);
				pulseFilters[0].disconnect(pulseFilters[1]);
				pulseFilters[0] = null;
				pulseFilters[1].disconnect(this.master);
				pulseFilters[1] = null;
			});

		// Simple square sound.
		} else {

			// Start square sound.
			//console.log("Start square sound " + pattern + ": " + pitch + " x " + length);
			return this._play("square", length, [pitch], [volume]);
		}
	}

	// Start triangle sound.
	_triangle(pattern=0, length=0.1, pitch=0, volume=1) {
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
			let frequency = !pitch ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (pitch * 100 / 1200));
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
			return this._start(length, [volume]).then(() => {

				// Disconnect triangle generator.
				//console.log("Disconnect triangle generator.");
				triangleGenerator.disconnect(this.master);
				triangleGenerator = null;
				triangleBuffer = null;
			});

		// Simple triangle sound.
		} else {

			// Start triangle sound.
			//console.log("Start triangle sound " + pattern + ": " + pitch + " x " + length);
			return this._play("triangle", length, [pitch], [volume]);
		}
	}

	// Start noise sound.
	_noise(pattern=0, length=0.1, pitch=0, volume=1) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// Create noise buffers.
		//console.log("Create noise buffers.");
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
		return this._start(length, [volume]).then(() => {

			// Disconnect noise generator.
			//console.log("Disconnect noise generator.");
			noiseGenerator.disconnect(this.master);
			noiseGenerator = null;
			noiseBuffer = null;
		});
	}
};

// Master sound.
pico.sound = new pico.Sound();

