const title = "Voxel"; // Title.
const editjs = "app/edit.js"; // Editor script.
const maxdepth = 40; // Maximum of depth.
const adddepth = 1; // Additions of depth.
const depth0 = 4; // Initial depth.
var count = 1; // Count of dice.
var depth = 4; // Depth.
var maximum = 6; // Maximum of dice faces.
var maxmaximum = 20; // Maximum of numbered dice.
var playing = 0; // Playing count.
const colors = picoStringCode8("111333222444000");
const pixels = [
	picoStringCode6("077121131141122132142123133143126136146"),
	picoStringCode6("077120130140111121131141151112122132142152113123133143153124134144116126136146156"),
	picoStringCode6("077120130140111121131141151112122132142152113123133143153124134144125135145116126136146156"),
	picoStringCode6("077120130140111121131141151112122132142152113123133143153124134144115125135145155116126136146156"),
	picoStringCode6("077120130140111121131141151112122132142152113123133143153124134144125135145116126136146156"),
	picoStringCode6("077120130140111221131241151112122132142152113223233243153124134144116126136146156"),
	picoStringCode6("077132126136146"),
];
const extraCharSprites = { // Extra char sprite table.
	"↑": picoStringCode6("077931922932942913933953934935"),
	"→": picoStringCode6("077931942913923933943953944935"),
};

// Voxel class.
Voxel = class {
	static scale = [1,1,1];
	static normals = [
		[1,0,0],[-1,0,0],
		[0,1,0],[0,-1,0],
		[0,0,1],[0,0,-1],
	];
	static vertexes = [
		[[1,0,1],[1,0,0],[1,1,1],[1,1,0],[1,1,1],[1,0,0]],
		[[0,0,0],[0,0,1],[0,1,0],[0,1,1],[0,1,0],[0,0,1]],
		[[0,1,1],[1,1,1],[0,1,0],[1,1,0],[0,1,0],[1,1,1]],
		[[1,0,1],[0,0,1],[1,0,0],[0,0,0],[1,0,0],[0,0,1]],
		[[0,0,1],[1,0,1],[0,1,1],[1,1,1],[0,1,1],[1,0,1]],
		[[1,0,0],[0,0,0],[1,1,0],[0,1,0],[1,1,0],[0,0,0]],
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
			newpixels[i] = [0,newsize,newsize];
		}

		// Rotate by axis x.
		// new = [old.x, -old.z*x, old.y*x]
		if (x) {
			for (let i=0; i<this.pixels.length; i++) {
				for (let j=1; j<this.pixels[i].length/3; j++) {
					let y = (this.pixels.length-1-i) * x;
					let z = this.pixels[i][j*3+2] * x;
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
					let x = (this.pixels.length-1-i) * y;
					let z = this.pixels[i][j*3+1] * y;
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
					x0 = -this.pixels[i][j*3+1] / 2;
					y0 = -this.pixels[i][j*3+2] / 2;
				} else if (this.pixels[i][j*3+0] == c) {
					let x = x0 + this.pixels[i][j*3+1];
					let y = -this.pixels[i][j*3+2];
					let z = z0 + i;
					text += this.stlPolygon([x,y,z]);
				}
			}
		}
		text += "endsolid\n";
		return picoTextFile(text, "voxel" + c + ".stl");
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
	picoSwitchApp(editjs); // Open editor.

	// Share screen.
	//picoShareScreen(); // Start sharing screen.
}

// Select button.
async function appSelect(x) {
	if (x) {
		//depth = depth + (x*adddepth) < 0 ? 0 : depth + (x*adddepth) < maxdepth ? depth + (x*adddepth) : maxdepth;
		//picoLabel("select", depth>0?""+depth:"&");
		voxel.rotate(x<0?1:0, x>0?1:0);
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
			} else if (value[0] == "0" && value[1] != "0" && value[2] != "0") {
				voxel.pixels[voxel.pixels.length] = picoCode6(keys[k]);
				maxmaximum = maximum = voxel.pixels.length;
				custom = true;
			}
		}
	}
	voxel.colors = voxel.colors.length>0 ? voxel.colors : colors;
	voxel.pixels = voxel.pixels.length>0 ? voxel.pixels : pixels;
	picoColor(voxel.colors);

	picoLabel("action", "*");
	picoLabel("select", "&");
	picoLabel("minus", null, await picoSpriteData(extraCharSprites["↑"]));
	picoLabel("plus", null, await picoSpriteData(extraCharSprites["→"]));
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

	// Update rolling dice.
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

	// Draw customizing dice.
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

	// Draw rolling dice.
	} else {

		// Draw icon.
		let s1 = 10;
		if (picoAction()) {
			depth = 0;
			playing = -1;
			//picoLabel("select", depth>0?""+depth:"&");
			picoBeep(1.2, 0.1);
		} else if (picoMotion()) {
			s1 = 8;
		}

		// Draw original design sprite.
		let x0 = voxel.pixels.length*depth/2, y0 = -voxel.pixels.length*depth/2;
		for (let i = 0; i < voxel.pixels.length; i++) {
			let x = x0-i*depth, y = y0+i*depth;
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
