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
async function picoBeep(kcent=0, length=0.1, delay=0, pitches=null, volumes=null) {
	try {
		await pico.sound.beep(kcent, length, delay, pitches, volumes);
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
// pitches = -3.6(A1:54.6Hz) .. 7.0(G9:12.4kHz)
// pattern = 0 or 0.125, 0.25, 0.5 (8bit original parameter)
async function picoPulse(pitches=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playPulse(pitches, length, pattern, repeat);
	} catch (error) {
		console.error(error);
	}
}

// Play triangle melody.
// pitches = -4.8(A0:27.3Hz) .. 8.4(A11:55.9kHz)
// pattern = 0 or 16 (8bit original parameter)
async function picoTriangle(pitches=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playTriangle(pitches, length, pattern, repeat);
	} catch (error) {
		console.error(error);
	}
}

// Play noise melody.
// pitches = -7.9(D-3), -6.7(D-2), -5.5(D-1), -5.0(G-1), -4.3(D0), -3.8(G0), -3.1(D1),
//           -2.5?(F1#?), -2.3(A2#), -0.7(D3), -0.2(G3), 0.5(D4), 1.7(D5), 2.9(D6), 4.1(D7), 5.3(D8)
// pattern = 0 or 1, 6 (8bit original parameter)
async function picoNoise(pitches=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playNoise(pitches, length, pattern, repeat);
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

	// Wait.
	wait(t=1000) {
		return new Promise(r => setTimeout(r, t));
	}

	// Beep.
	beep(kcent=0, length=0.1, delay=0, pitches=null, volumes=null) {
		// Beep sound type in ["sine", "square", "sawtooth", "triangle"]
		return new Promise((resolve) => {
			console.log("Delay: " + delay);
			setTimeout(() => {
				console.log("Start beep sound: " + pitches + " x " + length);
				this._play("square", length, pitches ? pitches : [kcent], volumes).then(() => {
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
	playPulse(pitches=[0], length=0.1, pattern=0, repeat=1) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < repeat || repeat <= 0; i++) {
				for (let j = 0; j < pitches.length; j++) {
					console.log("Pulse melody: " + (i+1) + "/" + repeat + " " + (j+1) + "/" + pitches.length);
					await this._pulse(pattern, length, pitches[j]);
					if (this.stopped) {
						console.log("Pulse melody End.");
						resolve();
					}
				}
			}
		}); // end of new Promise.
	}

	// Play triangle melody.
	playTriangle(pitches=[0], length=0.1, pattern=0, repeat=1) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < repeat || repeat <= 0; i++) {
				for (let j = 0; j < pitches.length; j++) {
					console.log("Triangle melody: " + (i+1) + "/" + repeat + " " + (j+1) + "/" + pitches.length);
					await this._triangle(pattern, length, pitches[j]);
					if (this.stopped) {
						console.log("Triangle melody End.");
						resolve();
					}
				}
			}
		}); // end of new Promise.
	}

	// Play noise melody.
	playNoise(pitches=[0], length=0.1, pattern=0, repeat=1) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < repeat || repeat <= 0; i++) {
				for (let j = 0; j < pitches.length; j++) {
					console.log("Noise melody: " + (i+1) + "/" + repeat + " " + (j+1) + "/" + pitches.length);
					await this._noise(pattern, length, pitches[j]);
					if (this.stopped) {
						console.log("Noise melody End.");
						resolve();
					}
				}
			}
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
				if (volumes) {
					for (let i = 0; i < volumes.length; i++) {
						let v = volumes[i] < 1 ? volumes[i] * pico.Sound.maxvolume : pico.Sound.maxvolume;
						console.log("Set volume: " + v + " at " + (this.context.currentTime + length * i/volumes.length));
						this.master.gain.setValueAtTime(v, this.context.currentTime + length * i/volumes.length);
					}
				} else {
					let v = pico.Sound.maxvolume;
					console.log("Set volume: " + v);
					this.master.gain.value = v;
				}
				//this.master.gain.setValueAtTime(0, this.context.currentTime + length);

				// Start audio.
				if (!this.started) {
					console.log("Start audio.");
					this.oscillator.start();
					this.started = true;
				}

				// Wait to play end.
				let startTime = this.context.currentTime;//Date.now();
				let endTime = this.context.currentTime+length;//startTime + length*1000;
				this.endTime = endTime > this.endTime ? endTime : this.endTime;
				//this.endTime = Date.now() + length;
				console.log("Wait to play end: " + startTime + " -> " + this.endTime);
				this.stopped = false;

				// Wait to end.
				setTimeout(() => {
					//if (this.stopped) { // Stopped on stop function.
					//	console.log("Stopped.");
					//} else {
						// End.
						console.log("End: " + this.endTime);
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
			console.log("Play " + type + ": " + pitches + " x " + length);
			if (type) {

				// Connect.
				this.oscillator.type = type;
				if (pitches) {
					for (let i = 0; i < pitches.length; i++) {
						console.log("Set pitch: " + pitches[i] + " at " + (this.context.currentTime + length * i/pitches.length));
						this.oscillator.detune.setValueAtTime(pitches[i] * 1000, this.context.currentTime + length * i/pitches.length);
					}
				}
				console.log("Connect oscillator.");
				this.oscillator.connect(this.master);

				// Start sound.
				await this._start(length, volumes).then(() => {

					if (!this.stopped) {
						console.log("Disconnect oscillator.")
						this.oscillator.disconnect(this.master);
						this.stopped = true; // Wait for end on start function.
					}
				});
			}
		});
	}

	// Start pulse sound.
	_pulse(pattern=0, length=0.1, pitch=0, volumes=null) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// 8bit original argorithm and parameter: pattern=0.125,0.25,0.5
		if (pattern > 0) {

			// Create pulse filters.
			let frequency = !pitch ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (pitch * 1000 / 1200));
			let pulseFilters = [];
			pulseFilters[0] = this.context.createGain();
			pulseFilters[0].gain.value = -1;
			pulseFilters[1] = this.context.createDelay();
			console.log("Set pitch: " + pitch + "=" + frequency);
			pulseFilters[1].delayTime.value = (1.0 - pattern) / frequency;

			// Connect pulse filters to master volume.
			console.log("Connect pulse filters.");
			this.oscillator.connect(pulseFilters[0]).connect(pulseFilters[1]).connect(this.master);

			// Start pulse sound.
			console.log("Start pulse sound " + pattern + ": " + pitch + "=" + frequency + " x " + length);
			return this._play("sawtooth", length, [pitch], volumes).then(() => {

				console.log("Disconnect pulse filters.");
				this.oscillator.disconnect(pulseFilters[0]);
				pulseFilters[0].disconnect(pulseFilters[1]);
				pulseFilters[0] = null;
				pulseFilters[1].disconnect(this.master);
				pulseFilters[1] = null;
			});

		// Simple square sound.
		} else {

			// Start square sound.
			console.log("Start square sound " + pattern + ": " + pitch + " x " + length);
			return this._play("square", length, [pitch], volumes);
		}
	}

	// Start triangle sound.
	_triangle(pattern=0, length=0.1, pitch=0, volumes=null) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// 8bit original argorithm and parameter: pattern=16
		if (pattern > 0) {

			// Create triangle buffers.
			let triangleBuffer = null;
			triangleBuffer = this.context.createBuffer(1, this.context.sampleRate * length, this.context.sampleRate);

			// 8bit original pseudo triangle argorithm.
			let frequency = !pitch ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (pitch * 1000 / 1200));
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
				//	console.log("buffering" + i + ": " + value + " -> " + buffering[i]);
				//}
			}

			// Connect triangle generator to master volume.
			console.log("Connect triangle generator.");
			let triangleGenerator = null;
			triangleGenerator = this.context.createBufferSource();
			triangleGenerator.buffer = triangleBuffer;
			triangleGenerator.connect(this.master);
			triangleGenerator.start();

			// Start pseudo triangle sound.
			console.log("Start pseudo triangle sound " + pattern + ": " + pitch + "=" + frequency + " x " + length);
			return this._start(length, volumes).then(() => {

				// Disconnect triangle generator.
				console.log("Disconnect triangle generator.");
				triangleGenerator.disconnect(this.master);
				triangleGenerator = null;
				triangleBuffer = null;
			});

		// Simple triangle sound.
		} else {

			// Start triangle sound.
			console.log("Start triangle sound " + pattern + ": " + pitch + " x " + length);
			return this._play("triangle", length, [pitch], volumes);
		}
	}

	// Start noise sound.
	_noise(pattern=0, length=0.1, pitch=0, volumes=null) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		// Create noise buffers.
		console.log("Create noise buffers.");
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
		console.log("Connect noise generator.");
		let noiseGenerator = null;
		noiseGenerator = this.context.createBufferSource();
		noiseGenerator.buffer = noiseBuffer;
		noiseGenerator.detune.setValueAtTime(pitch * 1000, this.context.currentTime);

		// Connect noise generator to master volume.
		noiseGenerator.connect(this.master);
		noiseGenerator.start();

		// Start noise sound.
		console.log("Start noise sound " + pattern + ": " + pitch + " x " + length);
		return this._start(length, volumes).then(() => {

			// Disconnect noise generator.
			console.log("Disconnect noise generator.");
			noiseGenerator.disconnect(this.master);
			noiseGenerator = null;
			noiseBuffer = null;
		});
	}
};

// Master sound.
pico.sound = new pico.Sound();

