picoTitle("Pico", "."); // Title.

// Data and settings.
const labels = ["bros", "clock", "demo", "dice", "edit", "kuku"];

// Main.
async function appMain() {
	const square = 42, number = 2, grid = 45;
	let column = picoSqrt(labels.length - 1) + 1;
	let row = picoDiv(labels.length - 1, column) + 1;
	for (let i = 0; i < labels.length; i++) {
		let x = (picoMod(i, column) - (column - 1) / 2) * grid;
		let y = (picoDiv(i, column) - (row - 1) / 2) * grid;
		let s = picoMotion(x, y, square/2, square/2) ? 0.8 : 1;
		if (picoAction(x, y, square/2, square/2)) {
			picoSwitch("app/" + labels[i] + ".js");
		}
		picoRect(3, x,y, square,square, 0,s);
		picoChar(labels[i], 0, x,y, 0,number*s);
	}
}
