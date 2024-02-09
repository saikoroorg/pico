//picoTitle("demo"); // Title.

// Data and settings.
const colors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0]; // 5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000
const square = 34; // Square size.
const number = 2; // Number size.

var playing = 0; // Playing count.
var angle = 0; // Rolling angle.
var scale = 1; // Rolling scale.
var random = 1; // Random.

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
		picoFlush(); // Update animation.
	} else {
		angle = 0;
	}
	picoColor(colors);
	picoRect(3, x,y, angle, square*scale);
	picoChar(random, 0, x,y, angle, number*scale);
	playing++;
}
