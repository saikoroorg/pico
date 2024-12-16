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
// kcents = -3.6(A1:54.6Hz) .. 7.0(G9:12.4kHz)
// pattern = 0 or 0.125, 0.25, 0.5 (8bit original parameter)
async function picoPulse(kcents=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playPulse(kcents, length, pattern, repeat);
	} catch (error) {
		console.error(error);
	}
}

// Play triangle melody.
// kcents = -4.8(A0:27.3Hz) .. 8.4(A11:55.9kHz)
// pattern = 0 or 16 (8bit original parameter)
async function picoTriangle(kcents=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playTriangle(kcents, length, pattern, repeat);
	} catch (error) {
		console.error(error);
	}
}

// Play noise melody.
// kcents = -7.9(D-3), -6.7(D-2), -5.5(D-1), -5.0(G-1), -4.3(D0), -3.8(G0), -3.1(D1),
//          -1.5(F2#), -2.3(A2#), -0.7(D3), -0.2(G3), 0.5(D4), 1.7(D5), 2.9(D6), 4.1(D7), 5.3(D8)
// pattern = 0 or 1, 6 (8bit original parameter)
async function picoNoise(kcents=[0], length=0.1, pattern=0, repeat=1) {
	try {
		await pico.sound.playNoise(kcents, length, pattern, repeat);
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
	playNoise(kcents=[0], length=0.1, pattern=0, repeat=1) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < repeat || repeat <= 0; i++) {
				for (let j = 0; j < kcents.length; j++) {
					//console.log("Noise melody: " + i + "/" + repeat + ":" + j + "/" + kcents.length);
					await this._noise(kcents[j], length, pattern);
					if (this.stopped) {
						//console.log("Noise melody End.");
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
				console.log("Create audio.");
				this.context = new window.AudioContext();
				this.master = this.context.createGain();
				//this.master.gain.value = pico.Sound.volume;
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
			console.log("No audio.");
			return Promise.reject();
		} else if (!this.started) {
			console.log("Not started.");
			return Promise.resolve();
		}

		// Stop audio.
		let restTime = this.endTime - Date.now();
		console.log("Stop: " + restTime);
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
				setTimeout(resolve, restTime);
			} else {
				console.log("Ready: " + restTime);
				resolve();
			}
		}); // end of new Promise.
*/
	}

	// Play sound.
	_play(type=null, kcents=[0], length=0.1, delay=0, volume=1) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		} else if (this.endTime < 0 || this.endTime > Date.now() + delay * 1000) {
			console.log("Not end previous sound.");
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
					console.log("Play: " + kcents + " x " + length * kcents.length + " + " + delay);
					if (type) {

						// Connect.
						let startTime = Date.now();
						console.log("Connect: " + startTime);
						this.oscillator.type = type;
						for (let i = 0; i < kcents.length; i++) {
							this.oscillator.detune.setValueAtTime(kcents[i] * 1000, this.context.currentTime + length * i);
						}
						this.oscillator.connect(this.master);

						// Set volume and start audio.
						this.master.gain.value = pico.Sound.volume * volume;
						if (!this.started) {
							console.log("Start audio.");
							this.oscillator.start();
							this.started = true;
						}

						// Wait to end.
						setTimeout(() => {
							/*if (this.stopped) { // Stopped on stop function.
								console.log("Stopped.");
								//this.endTime = 0;
							} else {*/
								// End.
								console.log("End: " + kcents + " x " + length * kcents.length);
								//if (type) {
								//	console.log("EndTime: " + Date.now() + " -> " + this.endTime);
									this.master.gain.value = 0;

									// Disconnect.
									if (Date.now() >= this.endTime) {
										console.log("Disconnect: " + startTime);
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
							//	console.log("Stopped.");
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
			console.log("No audio.");
			return Promise.reject();
		}

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
				console.log("Disconnect pulse filters.");
				this.oscillator.disconnect(pulseFilters[0]);
				pulseFilters[0].disconnect(pulseFilters[1]);
				pulseFilters[0] = null;
				pulseFilters[1].disconnect(this.master);
				pulseFilters[1] = null;
			}, length * 1000);

			console.log("Start pulse sound " + pattern + ": " + kcent + "=" + frequency + " x " + length);

			// Start.
			const type = "sawtooth";
			return this._play(type, [kcent], length, 0, volume);

		// Simple square sound.
		} else {

			console.log("Start pulse sound " + pattern + ": " + kcent + " x " + length);

			// Start.
			const type = "square";
			return this._play(type, [kcent], length, 0, volume);
		}
	}

	// Start triangle sound.
	_triangle(kcent=0, length=0.1, pattern=0, volume=1) {
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
				//	console.log("buffering" + i + ": " + value + " -> " + buffering[i]);
				//}
			}

			// Connect triangle generator to master volume.
			let triangleGenerator = null;
			triangleGenerator = this.context.createBufferSource();
			triangleGenerator.buffer = triangleBuffer;
			triangleGenerator.connect(this.master);
			triangleGenerator.start();
			setTimeout(() => {
				console.log("Disconnect triangle generator.");
				triangleGenerator.disconnect(this.master);
				triangleGenerator = null;
				triangleBuffer = null;
			}, length * 1000);

			console.log("Start triangle sound " + pattern + ": " + kcent + "=" + frequency + " x " + length);

			// Start.
			const type = null;
			return this._play(type, [0], length, 0, volume);

		// Simple triangle sound.
		} else {

			console.log("Start triangle sound " + pattern + ": " + kcent + " x " + length);

			// Start.
			const type = "triangle";
			return this._play(type, [kcent], length, 0, volume);
		}
	}

	// Start noise sound.
	_noise(kcent=0, length=0.1, pattern=0, volume=0.5, delay=0) {
		if (this.context == null) {
			console.log("No audio.");
			return Promise.reject();
		}

		//setTimeout(() => {

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

			// Create noise generator.
			let noiseGenerator = null;
			noiseGenerator = this.context.createBufferSource();
			noiseGenerator.buffer = noiseBuffer;
			noiseGenerator.detune.setValueAtTime(kcent * 1000, this.context.currentTime);

			// Connect noise generator to master volume.
			noiseGenerator.connect(this.master);
			noiseGenerator.start();
			setTimeout(() => {
				//console.log("Disconnect noise generator.");
				noiseGenerator.disconnect(this.master);
				noiseGenerator = null;
				noiseBuffer = null;
			}, length * 1000);

			console.log("Start noise sound " + pattern + ": " + kcent + " x " + length);

			// Start.
			const type = null;
			return this._play(type, [0], length, 0, volume);

		//}, delay * 1000);
	}
};

// Master sound.
pico.sound = new pico.Sound();

