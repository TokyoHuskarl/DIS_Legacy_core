/*
* @module NsLib_GUI
*/

const DEBUG = 1;

// in order not to cause error when you test on Node.js
var setv = setv || function(){};
var getv = getv || function(){};
var sett = sett || function(){};
var gett = gett || function(){};
var sets = sets || function(){};
var gets = gets || function(){};


function deblog(text) {
	if (DEBUG == 1) {
		console.log(text);
	}
}



// UI types set
const UItyp_undefined = 0,
	UItyp_checkbox = 1,
	UItyp_simplebutton = 2;

// UI render order
const PICCMD_Keep = 0,
	PICCMD_Refresh = 1,
	PICCMD_Erase = 2,
	PICCMD_Genstr = 3;

// RM var types
const RMvar = 1,
	RMswitch = 2,
	RMstring = 3,
	RMpicture = 4;

function getRM(typ,add) {
	
	if (typ == RMvar) {
		return getv(add)
	} else if (typ == RMswitch) {
		return gets(add)
	} else if (typ = RMstring) {
		return gett(add)
	}

}


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

// addresses for RM t[]..
const adr_RMstr_UIorder = 731; // -> NsLib_GUI_functions.tpc -> Str_UI_ORDER


// addresses for RM t[]..
const adr_RMbool_RUN_RENDER = 131; // -> NsLib_GUI_functions.tpc -> Str_UI_ORDER



// DIS object only
var DIS = DIS || {};

DIS.log = {
	
	// ??
	RMaddr_ShLog: 782, // same as Shell Log address 
	
	
	pushLog: function(text) { // test
		sett(gett(this.RMaddr_ShLog) + "\n" + text)
	},
	
	
	
}

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
* @class NsGUImgr
*
*
*/
// NsGUImgr is a global object which regulates all GUI system in your game
let NsGUImgr = {

	scene: 0,
	mousePointer: mousePointer,
	presentations: [],

	resetPresens: function() {
		delete this.presentations;
		this.presentations = [];
	},


	// get mouse status
	controlUpdate: function() { 
		this.mousePointer.x = getv(RM_MousePointer.x);
		this.mousePointer.y = getv(RM_MousePointer.y);
	},
	

	// try
	// this one will be called in RM cev loop per 1f, and give orders to other parallel cev manager, I mean UIrendering and ScaleScript commands. 
	runPresen: function() {

		let UIorderstr = "";
		let SSCmdOrderstr = "";

		this.controlUpdate() // get mouse vars
		for (let PRESEN of this.presentations) {
			
			if(PRESEN.is_controllable) { //if the presentation is controllable
				PRESEN.proc() // then run all UI objects in the presentation
				
				// order strings..

				UIorderstr += PRESEN.UI_RenderingOrder2RMcev;
				SSCmdOrderstr += PRESEN.UI_ScaleCmdOrder2RMcev;

			}
			
		}

		// give render order string to RPGMaker to execute cmds
		deblog(UIorderstr);
		sett(adr_RMstr_UIorder,UIorderstr);

		//sets(adr_RMbool_RUN_RENDER,1); // call render manager
	},


}



// Presentation
// this should be let in init process of the game.
class Ns_Presentation {
	
	constructor(pid) {
		this.is_controllable = true; // while this property is true, keep running proc function
		this.picidstart = pid; // {int} starts from this RMpid
		this.alloc_pid = pid; // begins from picidstart
		this.UI_components = []; // blank array where you push components
		this.UI_RenderingOrder2RMcev = "";
		this.UI_ScaleCmdOrder2RMcev = "";

	}

	// run all UI objects
	proc = function() {
		let rendering_order_string = ""; // give this string to RM UI rendering manager cev.
		
		for (let part of this.UI_components) {
				rendering_order_string += part.render() + ";";
				part.UIcheck();
		};

		// store rendering order string
		this.UI_RenderingOrder2RMcev = rendering_order_string

		
		
	}

	add = function(component){
		this.UI_components.push(component); // push to components array
		this.alloc_pid += component.set_to_presen(this.alloc_pid); // the presentation allocates pid to the object and its children
	}

}


// Fundamental class for every UI objects.
// An UI object usually has one RMpicture, its pid is set when it is pushed to the presentation.components array.
class UI_object {
	// x, y
	constructor(x,y) {
		this.UI_objtype = UItyp_undefined;
		this.pid = 0;
		this.x = x;
		this.y = y;
		this.children = [];
		this.RGBS = [100,100,100,100]; // array
		this.transparency = 0; // 0 to 100
	}

	setpic = function(picture_file) {
		this.picture = picture_file
	}

	settxt = function(string) {
		this.text = string;
	}


	render = function() {
		// override me if you want.
		let order_to_TPC = -1; // 
		
		if (this.picture != NULL) { // show picture cmd
			

		} else if (this.text != NULL) { // show string picture cmd


		}

		return order_to_TPC;
		
	}

	UIcheck = function() {
		// override me
			
	}

	L_click = function() {
		// override me
			
	}

	R_click = function() {
		// override me
			
	}

	set_to_presen = function(allocpid) {
		// count up how many picutre IDs this UI object needs
		let picture_amount = 1;
		this.pid = allocpid;
		
		for (let child of this.children) {
			if (child instanceof UI_object) { // if this UIobj has child obj, then allocate pic id to the child at the same time 
				picture_amount += child.set_to_presen(allocpid + picture_amount); // ACHTUNG! you should carefully check if this proc is working correctly 
			}
		}
		
		return picture_amount; // pew pew
	}

}

// simple check box that toggles RMswitch or even RMvar.
// (you may think this would do bit flag management, but sadly this code doesn't work for it yet.)
class Simple_Checkbox extends UI_object {
	constructor(x,y,targ_type,targ_address) {
		super(x,y)
		this.UI_objtype = UItyp_checkbox;
		this.targTyp = targ_type; // RMvar or RMswitch
		this.targAddr = targ_address; // RM v[n]
		this.flag = Boolean(getRM(targ_type,targ_address));
		this.setCheckMark(this.flag);
		
		this.picCmd = PICCMD_Refresh;
	}

	setCheckMark = function(flag) {
		if (flag = !flag) {
			this.txt = " x";
		} else {
			this.txt = " ";
		}
	}

	Lclick = function() {
		// toggle check box flag
		if (this.targTyp == RMswitch) {
			sets(this.targAddr,this.flag)
		} else if (this.targTyp == RMvar) {
			setv(this.targAddr,this.flag) // is this even needed?
		}

		this.setCheckMark(this.flag);

		
		this.picCmd = PICCMD_Genstr;
		
	}

	UIcheck = function() {
		// check hit box
	}

	render = function() {
		// checkbox,pid,picCmd,text
		//this.picCmd = PICCMD_Refresh; // debug
		let ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.txt},${this.x},${this.y}`;
		return ORDER;
	}

	
}





// init load
{
	deblog("aaa")

}
