const title = "Voxel"; // Title.
const callto = "app/edit.js"; // Call script.
const backto = "app/voxel.js"; // Back script.
const maxdepth = 40; // Maximum of depth.
const adddepth = 1; // Additions of depth.
const depth0 = 4; // Initial depth.
var depth = 4; // Depth.
var motionx = 0, motiony = 0; // Touch motion.
const motion = 4, defaultx = -4, defaulty = 4; // Default position.
var playing = 0; // Playing count.
const colors = picoStringCode8("111333222444302023032332555000");
const pixels = [
	picoStringCode6("066A21A31A41A22A32A42A23A33A43A26A36A46"),
	picoStringCode6("066A20A30A40A11A21A31A41A51A12A22A32A42A52A13A23A33A43A53A24A34A44A16A26A36A46A56"),
	picoStringCode6("066A20A30A40A11A21A31A41A51A12A22A32A42A52A13A23A33A43A53A24A34A44A25A35A45A16A26A36A46A56"),
	picoStringCode6("066A20A30A40A11A21A31A41A51A12A22A32A42A52A13A23A33A43A53A24A34A44A15A25A35A45A55A16A26A36A46A56"),
	picoStringCode6("066A20A30A40A11A21A31A41A51A12A22A32A42A52A13A23A33A43A53A24A34A44A25A35A45A16A26A36A46A56"),
	picoStringCode6("066A20A30A40A11B21A31B41A51A12A22A32A42A52A13B23B33B43A53A24A34A44A16A26A36A46A56"),
	picoStringCode6("066A32A26A36A46"),
];
const extraCharSprites = { // Extra char sprite table.
	"↑": picoStringCode6("066931922932942913933953934935"),
	"↓": picoStringCode6("066931932913933953924934944935"),
	"→": picoStringCode6("066931942913923933943953944935"),
	"←": picoStringCode6("066931922913923933943953924935"),
	"＠": picoStringCode6("088941932942952923943963944915945975916976917927937947957967977"),
};

// Voxel class.
Voxel = class {
	static scale = [1,1,1];
	static normals = [
		[1,0,0],[1,0,0],
		[-1,0,0],[-1,0,0],
		[0,1,0],[0,1,0],
		[0,-1,0],[0,-1,0],
		[0,0,1],[0,0,1],
		[0,0,-1],[0,0,-1],
	];
	static vertexes = [
		[[1,0,1],[1,0,0],[1,1,1]],[[1,1,0],[1,1,1],[1,0,0]],
		[[0,0,0],[0,0,1],[0,1,0]],[[0,1,1],[0,1,0],[0,0,1]],
		[[0,1,1],[1,1,1],[0,1,0]],[[1,1,0],[0,1,0],[1,1,1]],
		[[1,0,1],[0,0,1],[1,0,0]],[[0,0,0],[1,0,0],[0,0,1]],
		[[0,0,1],[1,0,1],[0,1,1]],[[1,1,1],[0,1,1],[1,0,1]],
		[[1,0,0],[0,0,0],[1,1,0]],[[0,1,0],[1,1,0],[0,0,0]],
	];

	// Constructor.
	constructor() {
		this.colors = [];
		this.pixels = [];
	}

	// Rotate.
	rotate(x,y) {
		let newsize = 0;
		for (let i=0; i<this.pixels.length; i++) {
			let size = picoSpriteSize(this.pixels[i]);
			if (newsize < size) {
				newsize = size;
			}
		}
		let newpixels = [];
		for (let i=0; i<newsize; i++) {
			newpixels[i] = [0,newsize-1,newsize-1];
		}

		// Rotate by axis x.
		// new = [old.x, -old.z*x, old.y*x]
		if (x) {
			for (let i=0; i<this.pixels.length; i++) {
				for (let j=1; j<this.pixels[i].length/3; j++) {
					let y = x < 0 ? i : (newsize-1-i);
					let z = x < 0 ? (newsize-1-this.pixels[i][j*3+2]) : this.pixels[i][j*3+2];
					let n = newpixels[z].length;
					newpixels[z][n+0] = this.pixels[i][j*3+0];
					newpixels[z][n+1] = this.pixels[i][j*3+1];
					newpixels[z][n+2] = y;
				}
			}
			this.pixels = newpixels;

		// Rotate by axis y.
		// new = [old.z*-y, old.y, old.x*y]
		} else if (y) {
			for (let i=0; i<this.pixels.length; i++) {
				for (let j=1; j<this.pixels[i].length/3; j++) {
					let x = y < 0 ? i : (newsize-1-i);
					let z = y < 0 ? (newsize-1-this.pixels[i][j*3+1]) : this.pixels[i][j*3+1];
					let n = newpixels[z].length;
					newpixels[z][n+0] = this.pixels[i][j*3+0];
					newpixels[z][n+1] = x;
					newpixels[z][n+2] = this.pixels[i][j*3+2];
				}
			}
			this.pixels = newpixels;
		}
	}

	// Get normal string.
	normalString(v) {
		return v.join(" ");
	}

	// Get vertex string.
	vertexString(v1, v0, s) {
		let v=[(v1[0]+v0[0])*s[0], (v1[1]+v0[1])*s[1], (v1[2]+v0[2])*s[2]];
		return v.join(" ");
	}

	// Get vec.
	stlPolygon(v) {
		let poly = "";
		for (let i=0; i<Voxel.normals.length; i++) {
			poly += "\tfacet normal " + this.normalString(Voxel.normals[i]) + "\n";
			poly += "\t\touter loop\n"
			for (let j=0; j<Voxel.vertexes[i].length; j++) {
				poly += "\t\t\tvertex " + this.vertexString(v, Voxel.vertexes[i][j], Voxel.scale) + "\n";
			}
			poly += "\t\tendloop\n"
			poly += "\tendfacet\n"
		}
		return poly;
	}

	// Get stl file.
	stlFile(c) {
		let text = "solid voxel\n";
		for (let i=0; i<this.pixels.length; i++) {
			let x0 = -4.5, y0 = -4.5, z0 = -this.pixels.length / 2;
			for (let j=0; j<this.pixels[i].length; j++) {
				if (this.pixels[i][j*3+0] == 0) {
					x0 = -(this.pixels[i][j*3+1]+1) / 2;
					y0 = -(this.pixels[i][j*3+2]+1) / 2;
				} else if (this.pixels[i][j*3+0] == c) {
					let x = x0 + this.pixels[i][j*3+1];
					let y = -this.pixels[i][j*3+2];
					let z = z0 + i;
					text += this.stlPolygon([x,y,z]);
				}
			}
		}
		text += "endsolid\n";
		return picoTextFile(text, "voxel" + c + ".stl", "model/stl");
	}
};
var voxel = new Voxel();

// Action button.
async function appAction() {

	// Enter to edit mode.
	picoResetParams();

	// Enter to edit mode with custom design.
	let key = 0;
	for (; key < voxel.pixels.length; key++) {
		if (voxel.pixels[key].length > 0) {
			picoSetCode6(voxel.pixels[key], key);
		}
	}
	if (voxel.colors.length > 0) {
		picoSetCode8(voxel.colors, key);
	}

	// Enter to edit mode.
	picoSwitchApp(callto, backto, title);

	// Share screen.
	//picoShareScreen(); // Start sharing screen.
}

// Select button.
async function appSelect(x) {
	if (x) {
		depth = depth + (x*adddepth) < 0 ? 0 : depth + (x*adddepth) < maxdepth ? depth + (x*adddepth) : maxdepth;
	let data = await picoSpriteData(extraCharSprites["＠"], -1);
	picoLabel("select", null, data);
		picoFlush();
	} else {

		// Share voxle stl file.
		let files = [];
		for (let i = 1; i < voxel.colors.length/3; i++) {
			files.push(voxel.stlFile(i));
		}
		picoShare(null, files);
	}
}

// Load.
async function appLoad() {
	pico.Param.debug = true;
	picoTitle(title);

	// Load query params.
	let keys = picoKeys();
	for (let k = 0; k < keys.length; k++) {
		let value = picoString(k);
		if (value) {
			console.log("Param" + k + ": " + keys[k] + " -> " + picoString(k));

			// Load colors.
			if ((value[0] == "0" && value[1] == "0" && value[2] == "0") ||
				(value[0] == "1" && value[1] == "1" && value[2] == "1")) {
				voxel.colors = picoCode8(keys[k]);

			// Load pixels.
			} else if (value[0] == "0") {
				voxel.pixels[voxel.pixels.length] = picoCode6(keys[k]);
				custom = true;
			}
		}
	}
	voxel.colors = voxel.colors.length>0 ? voxel.colors : colors;
	voxel.pixels = voxel.pixels.length>0 ? voxel.pixels : pixels;
	picoColor(voxel.colors, 35);

	picoLabel("action", "*");
	let data = await picoSpriteData(extraCharSprites["＠"], -1);
	picoLabel("select", null, data);
//	picoLabel("minus", "-");
//	picoLabel("plus", "+");
}

var angle = 0; // Rolling angle.
var scale = 9; // Rolling scale.

// Main.
async function appMain() {

	// Initialize.
	if (playing <= 0) {
		result = 0;

		// Reset playing count.
		playing = 1;
	}

	// Update voxels.
	if (depth <= 0) {
		if (result > 0) {

			// Restart.
			if (picoMotion()) {
				playing = -1;
			}

		} else {

			// Holding.
			if (picoMotion()) {
				playing = 1;
			}
		}
	}

	// Draw voxels.
	if (depth <= 0) {

		// Draw icon.
		let s1 = 10;
		if (picoAction()) {
			depth = depth0;
			playing = -1;
			//picoLabel("select", depth>0?""+depth:"&");
			picoBeep(1.2, 0.1);
		} else if (picoMotion()) {
			s1 = 8;
		}

		// Draw original design sprite.
		for (let i = 0; i < voxel.pixels.length; i++) {
			picoSprite(voxel.pixels[i], -1, 0,0, angle, s1);
		}

	// Draw rolling voxels.
	} else {

		// Draw icon.
		let s1 = 10;
		if (picoAction()) {
			//depth = 0;
			if (picoAction(-60,0,30,30)) {
				voxel.rotate(0, 1);
			} else if (picoAction(60,0,30,30)) {
				voxel.rotate(0, -1);
			} else if (picoAction(0,-60,30,30)) {
				voxel.rotate(1, 0);
			} else if (picoAction(0,60,30,30)) {
				voxel.rotate(-1, 0);
			}

			playing = -1;
			//picoLabel("select", depth>0?""+depth:"&");
			picoBeep(1.2, 0.1);
		} else if (picoMotion()) {
			if (picoMotion(-60,0,30,30)) {
				motionx = -motion;
				motiony = 0;
			} else if (picoMotion(60,0,30,30)) {
				motionx = motion;
				motiony = 0;
			} else if (picoMotion(0,-60,30,30)) {
				motionx = 0;
				motiony = -motion;
			} else if (picoMotion(0,60,30,30)) {
				motionx = 0;
				motiony = motion;
			} else {
				motionx = motiony = 0;
				s1 = 8;
			}
		} else {
			motionx = motiony = 0;
		}

		// Draw arrow sprites.
		picoSprite(extraCharSprites["←"], -1, -60,0, 0, motionx<0?1:2);
		picoSprite(extraCharSprites["→"], -1, 60,0, 0, motionx>0?1:2);
		picoSprite(extraCharSprites["↑"], -1, 0,-60, 0, motiony<0?1:2);
		picoSprite(extraCharSprites["↓"], -1, 0,60, 0, motiony>0?1:2);

		// Draw voxel sprites.
		for (let i = 0; i < voxel.pixels.length; i++) {
			let x = (-voxel.pixels.length/2+i)*(motionx+defaultx), y = (-voxel.pixels.length/2+i)*(motiony+defaulty);
			picoSprite(voxel.pixels[i], -1, x,y, angle, s1);
		}
	}

	// Update animation if rolling.
	if (result == 0 || playing < 5) {
		picoFlush();
	}

	// Increment playing count.
	playing++;
};
