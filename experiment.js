/*
* @module NsLib_GUI
*/

// UI types set
const UItyp_undefined = 0,
	UItyp_checkbox = 1;
	UItyp_simplebutton = 2;

// RM var types
const RMvar = 1,
	RMswitch = 2,
	RMstring = 3,
	RMpicture = 4;

// Set RM Var addresses
// DIS project
//

const RM_MousePointer = {
	x: 51, // v[51]
	y: 52, // v[52]
}

// RM information var addresses - if these elements become directly accessible through RM2k3 Object later, this part will be removed
const adr_RMresolutionX = 1001,
	adr_RMresolutionY = 1002;


// DIS object
var DIS = DIS || {};


DIS.conf = {

	// resolution
	resolution: {
		width: getv(adr_RMresolutionX), // DIS only
		height: getv(adr_RMresolutionY), // DIS only
	},
}

// DIS functions around string system
DIS.string = {

	// return string
	getQstr: function(id) {
		const RMstr_Qstr_Head = 20000; // QuickString array starts from this number in DIS
		var string = gett(RMstr_Qstr_Head + id);
		return string;
	},

	getMapStr: function(id) { // ?
		// coming soon
	}

}


let mousePointer = {
	x: 0,
	y: 0,
}


/*
* @class Ns_GUI_Manager
*
*
*/


// Ns_GUI_Manager is a global object which regulates all GUI system in your game
let Ns_GUI_Manager = {
	scene: 0,
	mousePointer: mousePointer,
	presentations: [],

	reset_presentation: function() {
		delete this.presentations;
		this.presentations = [];
	},


	controlUpdate: function() { 
		this.mousePointer.x = getv(RM_MousePointer.x);
		this.mousePointer.y = getv(RM_MousePointer.y);
	},
	

	// try
	run_presentations: function() {

		this.controlUpdate() // get mouse states
		for (let PRESEN of this.presentations) {

			// insert draw function?

			if(PRESEN.is_controllable) { //if the presentation is controllable
				PRESEN.proc() // then run all UI objects in the presentation
			}

		}
	},


}


// Presentation
// this should be let in init process of the game.
const Ns_Presentation = {
	is_controllable: true, // while this property is true, keep
	picidstart: 1,
	UI_objects: [],

        reset: function() {
		delete this.UI_objects; // remove all objects in the UI manager
		this.UI_objects = []; // set new empty array
	},

	// run all UI objects
	proc: function() {
		for (let part of this.checkboxes) {
		    part.UIfunc()
		}
	},

}

class UIobject {
	
}

// simple checkbox 
function createCheckbox(targ_type,targ_address,text) {
    return {
	UI_objtype: UItyp_checkbox, // int
	checked: false, // bool? maybe you should adjust it later
	target_type: targ_type, // RMvar or RMswitch
	target_address: targ_address, // v[n]
	text: text, // How should
	toggle: function() {
		this.checked = !this.checked; // toggle!
		console.log(`Checkbox '${this.text}' is now: ${this.checked ? "checked" : "unchecked"}`);
	},
	
	draw: function(){},
	UIfunc: function(){
		
		

	},
    };
}


// test
{
	var faggot = createCheckbox(RMvar, 114514,"YOU ARE RETARDO");
	console.log(faggot.checked);
	faggot.toggle();
	faggot.toggle();
}

