/**
* BOOT LOADING scene
* this script is read immediately after game booted, before init process begins.
* But do not write any game config scripts, this is basically just to set first loading screen.
*/	

// failsafe
let scene = scene || {};

scene = {
	name: "first_boot",
	text: "NOW LOADING!",
	loadsprite: "",
	
	
}

