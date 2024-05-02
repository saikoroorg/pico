/* PICO Daemon module */

//************************************************************/

// Namespace.
var pico = pico || {};

// Worker class.
pico.Worker = class {
	static script = "./index.js"; // This script file.
	static manifest = "./app.json"; // Manifest file.

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		this.replacing = {}; // Replacing table by manifest json.
		this.cacheKey = null; // Cache key.
		this.cacheName = null; // Cache key without version.

		// Script for worker.
		if (self && self.registration) {
			self.addEventListener("install", (event) => {
				this.onInstall(event);
			}); // Install.
			self.addEventListener("activate", (event) => {
				this.onActivate(event);
			}); // Activate.
			self.addEventListener("fetch", (event) => {
				this.onFetch(event);
			}); // Fetch.

		// Script for client to register worker.
		} else {
			window.addEventListener("load", async () => {
				await this.onLoad()
			}); // Load.
		}
	}

	// On installing worker event.
	onInstall(event) {
		console.log("Install worker: " + pico.Worker.script);
		event.waitUntil(this.install());
	}

	// On activating worker event.
	onActivate(event) {
		console.log("Activate worker: " + pico.Worker.script);
		event.waitUntil(this.activate());
	}

	// On fetching network request event.
	onFetch(event) {
		console.log("Fetch by worker: " + event.request.url);
		event.respondWith(this.fetch(event.request.url));
	}

	// On load event.
	async onLoad() {
		try {

			// Register worker.
			if (pico.Worker.script) {
				if (navigator.serviceWorker) {
					console.log("Register worker: " + pico.Worker.script);
					await navigator.serviceWorker.register(pico.Worker.script);
				} else {
					console.log("No worker.");
				}
			}
		} catch (error) {
			console.error(error.name, error.message);
		}
	}

	// Get file from cache or fetch.
	_cacheOrFetch(url, cacheKey, replacing) {
		return new Promise((resolve, reject) => {
			if (cacheKey) {

				// Get cached file.
				console.log("Get cached file: " + url + " from " + cacheKey);
				self.caches.open(cacheKey).then((cache) => {
					cache.match(url, {ignoreSearch: true}).then((result) => {

						// Resolves by cached response.
						console.log("Resolves by cached response: " + url + " -> " + result.status + " " + result.statusText);
						resolve(result);
					}).catch((error) => {

						// Not found cached file.
						console.log("Not found cached file: " + url);
						this._fetchAndCache(url, cacheKey, replacing).then((result) => {

							// Resolves by fetched response.
							console.log("Resolves by fetched response: " + url + " -> " + result.status + " " + result.statusText);
							resolve(result);
						});
					});
				});

			} else {

				// No cache.
				console.log("No cache: " + url);
				fetch(url).then((result) => {

					// Resolves by fetched response.
					console.log("Resolves by fetched response: " + url + " -> " + result.status + " " + result.statusText);
					resolve(result);
				}).catch((error) => {
					console.log("Failed to fetch: " + url);
					console.error(error.name, error.message);
					reject();
				});
			}
		}); // end of new Promise.
	}

	// Fetch and cache.
	_fetchAndCache(url, cacheKey, replacing) {
		return fetch(url, {cache: "no-store"}).then((result) => {

			// Cache the fetched file.
			console.log("Fetched file: " + url + " -> " + result.status + " " + result.statusText);
			if (result.ok) {

				// Replace fetched html file.
				let contentType = result.headers.get("Content-Type");
				if (contentType && contentType.match("text/html")) {
					return new Promise((resolve, reject) => {
						result.text().then((text) => {
							console.log("Fetched html file: " + text.replace(/\s+/g, " ").substr(-1000));

							// Replace string by manifest.
							for (let key in replacing) {
								console.log("Replacing: " + key + " -> " + replacing[key]);
								let reg1 = new RegExp("(<.*id=\"" + key + "\".*>).*(<\/.*>)");
								text = text.replace(reg1, "$1" + replacing[key] + "$2");
								let reg2 = new RegExp("(<" + key + ".*>).*(<\/" + key + ".*>)");
								text = text.replace(reg2, "$1" + replacing[key] + "$2");
							}
							let reg0 = new RegExp("\/index.html");
							text = text.replace(reg0, "\/");
							console.log("Replaced file: " + text.replace(/\s+/g, " ").substr(-1000));

							// Replaced responce.
							let options = {status: result.status,
								 statusText: result.statusText,
								 headers: result.headers};
							result = new Response(text, options);

							// Cache the replaced file.
							if (cacheKey) {
								console.log("Cache the replaced file: " + url + " to " + cacheKey + " -> " + result.status + " " + result.statusText);
								self.caches.open(cacheKey).then((cache) => {
									cache.put(url, result.clone());
								});
							}

							// Resolves by replaced response.
							console.log("Resolves by replaced response: " + url + " -> " + result.status + " " + result.statusText);
							resolve(result.clone());
						});
					}); // end of new Promise.

				} else {
					if (cacheKey) {
						console.log("Cache the fetched file: " + url + " to " + cacheKey + " -> " + result.status + " " + result.statusText);
						self.caches.open(cacheKey).then((cache) => {
							cache.put(url, result.clone());
						}).catch((error) => {
							console.log("Failed to cache: " + url);
						});
					}
				}
			}

			// Returns fetched response.
			console.log("Returns fetched response. -> " + result.status + " " + result.statusText);
			return result.clone();
		}).catch((error) => {
			// Failed but resolves to continue worker.
			console.log("Failed to fetch: " + url);
			console.error(error.name, error.message);
			return new Response(); // Return dummy response.
		});
	}

	// Prefetch all content files to renew.
	_renew() {
		return new Promise((resolve, reject) => {
			console.log("Renew worker.");

			// Fetch new manifest file.
			let url = pico.Worker.manifest;
			console.log("Fetch new manifest: " + url);
			return fetch(url, {cache: "no-store"}).then((result) => {

				// Check countent type.
				let contentType = result.headers.get("Content-Type");
				if (!contentType.match("application/json")) {
					console.log("Failed to parse manifest file.");
					reject();
					return;
				}

				// Parse manifest json.
				result.clone().json().then((manifest) => {
					console.log("Parsed new manifest json: " + JSON.stringify(manifest));
					let cacheKey = manifest.name + "/" + manifest.version;
					let replacing = this._replacing(manifest);

					// Not found new version.
					if (cacheKey == this.cacheKey) {
						console.log("Not found new version: " + cacheKey);
						resolve(result.clone());

					// Found new version.
					} else {
						console.log("Found new version: " + cacheKey + " old: " + this.cacheKey);

						// Prefetch and cache all content files.
						console.log("Prefetch all content files.");
						Promise.all(manifest.contents.map((content) => {
							return this._fetchAndCache(content, cacheKey, replacing);
						})).then(() => { // end of Promise.all.

							// Cache new manifest.
							cacheKey = "*";
							console.log("Cache new manifest: " + url + " to " + cacheKey + " -> " + result.status + " " + result.statusText);
							self.caches.open(cacheKey).then((cache) => {
								cache.put(url, result.clone());

								// Resolves.
								console.log("Renew worker completed.");
								resolve(result.clone());
							});
						});
					}
				});
			}).catch((error) => {
				console.log("Failed to parse manifest file.");
				console.error(error.name, error.message);
				reject();
			});
		}); // end of new Promise.
	}

	// Check new manifest file.
	_check() {
		return new Promise((resolve, reject) => {
			console.log("Check new maniefst file.");

			// Fetch new manifest file.
			let url = pico.Worker.manifest;
			console.log("Fetch new manifest: " + url);
			return fetch(url, {cache: "no-store"}).then((result) => {

				// Check countent type.
				let contentType = result.headers.get("Content-Type");
				if (!contentType.match("application/json")) {
					console.log("Failed to parse manifest file.");
					reject();
					return;
				}

				// Parse manifest json.
				result.clone().json().then((manifest) => {
					console.log("Parsed new manifest json: " + JSON.stringify(manifest));
					let cacheKey = manifest.name + "/" + manifest.version;
					let replacing = this._replacing(manifest);

					// Not found new version.
					if (cacheKey == this.cacheKey) {
						console.log("Not found new version: " + cacheKey);
						resolve(result.clone());

					// Found new version.
					} else {
						console.log("Found new version: " + cacheKey + " old: " + this.cacheKey);
						reject();
					}
				});
			}).catch((error) => {
				console.log("Failed to fetch manifest file.");
				console.error(error.name, error.message);
				reject();
			});
		}); // end of new Promise.
	}

	// Replacing table.
	_replacing(manifest) {
		let replacing = {};
		if (manifest.version) {
			replacing.version = manifest.version.substr(-4);
		}
		if (manifest.author) {
			replacing.author = manifest.author;
		}
		console.log("Created replacing table: " + JSON.stringify(replacing));
		return replacing;
	}

	// Set manifest file to start worker.
	_start(result) {
		if (this.cacheKey) {
			console.log("Worker already started.");
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			console.log("Start worker.");

			// Get cached manifest file.
			let url = pico.Worker.manifest, cacheKey = "*";
			console.log("Get cached manifest file: " + url + " from " + cacheKey);
			self.caches.open(cacheKey).then((cache) => {
				cache.match(url, {ignoreSearch: true}).then((result) => {
					console.log("Found manifest file: " + url + " from " + cacheKey);

					// Check result.
					if (!result) {
						console.log("Failed to get manifest file.");
						reject();
						return;
					}

					// Check countent type.
					let contentType = result.headers.get("Content-Type");
					if (!contentType.match("application/json")) {
						console.log("Failed to parse manifest file.");
						reject();
						return;
					}

					// Parse manifest json.
					result.clone().json().then((manifest) => {
						console.log("Parsed manifest json: " + JSON.stringify(manifest));

						// Set version and cache key.
						this.cacheKey = manifest.name + "/" + manifest.version;
						this.cacheName = manifest.name;
						console.log("Set version: " + this.cacheKey);

						// Set replacing table.
						this.replacing = this._replacing(manifest);

						// Resolves.
						console.log("Start worker completed.");
						resolve(result.clone());
					});
				});
			}).catch((error) => {
				console.log("Failed to parse manifest file.");
				console.error(error.name, error.message);
				reject();
			});
		}); // end of new Promise.
	}
	
	// Get manifest file from cache or fetch on installing worker.
	install() {
		return new Promise((resolve) => {

			// Check manifest file to use cache.
			this._check().then((result) => {
				console.log("Worker already installed.");
				resolve(result);
			}).catch((error) => {
				console.log("Reinstall worker.");

				// Refetch manifest file.
				let url = pico.Worker.manifest, cacheKey = "*", replacing = null;
				console.log("Refetch manifest file: " + url);
				this._fetchAndCache(url, cacheKey, replacing).then((result) => {

					// Resolves.
					console.log("Install worker completed.");
					resolve(result);

					// Prefetch all content files on background for this install.
					this._renew();
				}).catch((error) => {

					// Failed but resolves to continue worker.
					console.log("Failed to install worker.");
					resolve();
				});
			});
		}); // end of new Promise.
	}

	// Delete old cache files when the cache version updated on activating worker.
	activate() {
		return new Promise((resolve) => {

			// Read manifest file to use cache.
			this._start().then(() => {

				// Check cache name.
				if (!this.cacheName) {
					console.log("Failed to get manifest file.");
					reject();
					return;
				}

				// Delete all cache files.
				console.log("Delete all cache files: " + this.cacheName);
				self.caches.keys().then((keys) => {
					Promise.all(keys.map((key) => {
						if (!key.indexOf(this.cacheName) && key != this.cacheKey) {
							console.log("Delete old cache: " + key);
							return self.caches.delete(key);
						}
					})).then(() => { // end of Promise.all.

						// Resolves.
						console.log("Delete all cache files completed.");
						resolve();
					});
				});
			}).catch((error) => {

				// Failed but resolves to continue worker.
				console.log("Failed to activate worker.");
				resolve();
			});
		}); // end of new Promise.
	}

	// Get cache or fetch files called by app.
	fetch(url) {
		return new Promise((resolve) => {

			// Read manifest file to use cache.
			this._start().then(() => {

				// Get cache or fetch and return response.
				console.log("Get cache or fetch: " + url);
				this._cacheOrFetch(url, this.cacheKey, this.replacing).then((result) => {

					// Resolves.
					console.log("Fetch by worker completed: " + url + " -> " + result.status + " " + result.statusText);
					resolve(result);

					// Prefetch all content files on background for next install.
					this._renew();
				}).catch((error) => {

					// Failed but resolves to continue worker.
					console.log("Failed to fetch by worker: " + url);
					resolve(fetch(url)); // Simple fetch.
				});
			}).catch((error) => {

				// Failed but resolves to continue worker.
				console.log("Failed to activate worker.");
				resolve();
			});
		}); // end of new Promise.
	}
};

// Master worker.
pico.worker = new pico.Worker();
