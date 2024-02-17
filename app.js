async function appLoad() {
	picoResetParams();
	picoSetStrings(-1, "v"); // Dev mode.
	picoSwitch("app/saikoro.js", false);
}
