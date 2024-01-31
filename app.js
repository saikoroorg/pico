//picoTitle(""); // Title.

// Data and settings.
const colors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0]; // 5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000
const labels = ["bros", "clock", "dice", "kuku", "edit"];

// Main.
async function appMain() {
	const square = 19, grid = 45;
	let column = picoSqrt(labels.length - 1) + 1;
	let row = picoDiv(labels.length - 1, column) + 1;
	picoColor(colors);
	for (let i = 0; i < labels.length; i++) {
		let x = (picoMod(i, column) - (column - 1) / 2) * grid;
		let y = (picoDiv(i, column) - (row - 1) / 2) * grid;
		let s = picoMotion(x, y, square, square) ? 0.8 : 1;
		if (picoAction(x, y, square, square)) {
			picoSwitch("app/" + labels[i] + ".js");
		}
		picoRect([-square,-square,square*2-1,square*2-1], 3, x,y, 0,s);
		picoChar(labels[i], 0, x,y, 0,2*s);
	}
}
