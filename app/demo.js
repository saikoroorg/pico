const title = "Demo"; // Title.
const square = 34; // Square base scale.
const number = 2; // Number base scale.
var playing = 0; // Playing count.
var angle = 0; // Rolling angle.
var scale = 1; // Rolling scale.
var random = 1; // Random number.

// Load.
async function appLoad() {
	await picoWait(5000); // Dummy loading wait.
	picoTitle(title);
}

// Main.
async function appMain() {
	let x = 0, y = 0;
	if (picoMotion(x,y, square/2,square/2)) {
		playing = 0;
		scale = 0.8;
	} else {
		scale = 1;
	}
	if (playing <= 60) {
		angle = picoMod(angle + 20, 360);
		random = picoRandom(10000);
		picoFlush(); // Update animation without input.
	} else {
		angle = 0;
	}
	picoRect(3, x,y,square,square, angle,scale);
	picoChar(random, 0, x,y, angle,number*scale);
	playing++;
}
