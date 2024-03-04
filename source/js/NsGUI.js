/**
 * Java Script GUI system for RPG Maker 2003MP
 * @module NsGUI.js
 *
 */

/**
 * @todo ピクチャ制御とクリック回りのラッパだけ作ってあげれば、あとは何とかなるのでは？
 *
 *
 */

const NsGUI = (function(){
	let module = {};

	class Ns_Picture {
		constructor(picid,pdata,pos) {
			this.picid = picid;
			this.pos = pos;
		};
	};

	module.mouse = (function(){
		const pos = [0,0]; // [x,y]
		
		// [state,pressTime,lastPressTime]
		const LMB = [0,0,0];
		const RMB = [0,0,0];
		const MB3 = [0,0,0];
		const MB4 = [0,0,0];
		const MB5 = [0,0,0];
		const wheelUp = [0,0,0];
		const wheelDown = [0,0,0];

		return {
			refresh(){
				let st = module.wrappers.getMouseState()

			},
			

		};
	})();

	module.wrappers = {

		/**
		 * get mouse 
		 *
		 */
		getMouseState(){
			let state = [
				[0,0], // [x,y]
				0, // LMB trig
				0, // RMB trig
				0, // MB3 trig
				0, // MB4 trig
				0, // MB5 trig
				0, // wheelUp
				0, // wheelDown
				];
			return state;
		},


		drawPic(pid,pinfo){

		},

		drawStrPic(pid,strpinfo){

		},

		movePic(pid,pinfo){

		},

		erasePic(pid){
		}

	};


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

		};

		// run all UI objects
		proc = function() {
			let rendering_order_string = ""; // give this string to RM UI rendering manager cev.

			for (let part of this.UI_components) {
				rendering_order_string += part.render() + ";";
				part.UIcheck();
			};

			// store rendering order string
			this.UI_RenderingOrder2RMcev = rendering_order_string;



		};

		add = function(component) {
			this.UI_components.push(component); // push to components array
			this.alloc_pid += component.set_to_presen(this.alloc_pid); // the presentation allocates pid to the object and its children
		};

	};



	// Fundamental class for every UI objects.
	// An UI object usually has one RMpicture, when the object is pushed to the presentation.components array, its pid is set.
	class UI_object {
		// x, y
		constructor(x,y) {
			this.UI_objtype = UIOBJ_undefined;
			this.pid = 0;
			this.pos = [x,y];
			this.children = [];
			this.RGBS = [100,100,100,100]; // array
			this.transparency = 0; // 0 to 100
		}


		setpic = function(picture_file) {
			this.picture = picture_file;
			this.UI_objtype = UIOBJ_simplesprite;
		}

		settxt = function(string) {
			this.text = string;
			this.UI_objtype = UIOBJ_strpic;
		}


		render = function() {
			// override me if you want.
			// initial UIobj render method is quite simple.

			let ORDER = ""; // init

			if (this.picCmd == PICCMD_Refresh) { // renew picture 
				if (this.picture != NULL) { // call show picture cmd
					ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.picture},${this.x},${this.y}`;

				} else if (this.text != NULL) { // show string picture cmd
					ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.text},${this.x},${this.y}`;

				}
			}

			this.picCmd == PICCMD_Keep;
			return ORDER;

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

		overlap = function() {
			// override me

		}


		addChild = function(childobj) {
			this.children.push(childobj); // push to components array
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

	};

	// simple check box that toggles RMswitch or even RMvar.
	// (you may think this would do bit flag management, but sadly this code doesn't work for it yet.)
	class Simple_Checkbox extends UI_object {
		constructor(x,y,targ_type,targ_address) {
			super(x,y);
			this.UI_objtype = UIOBJ_checkbox;
			this.targTyp = targ_type; // RMvar or RMswitch
			this.targAddr = targ_address; // RM v[n]
			this.flag = Boolean(getRM(targ_type,targ_address));
			this.setCheckMark(this.flag);

			this.picCmd = PICCMD_Refresh;
		}

		setCheckMark = function(flag) {
			this.txt = (flag == !flag) ? " x" : " " 
		}

		Lclick = function() {
			// toggle check box flag
			// use RMset
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
			// // debug
			let ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.txt},${this.x},${this.y}`;
			this.picCmd = PICCMD_Keep; // reset picCmd
			return ORDER;
		}


	};

	class SimpleButton extends UI_object {
		constructor(x,y) {
			super(x,y);
			this.UI_objtype = UIOBJ_checkbox;
			this.picCmd = PICCMD_Refresh;
		}

		Lclick = function() {

		}

		UIcheck = function() {
			// check hit box
		}

		render = function() {
			// checkbox,pid,picCmd,text
			// // debug
			let ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.txt},${this.x},${this.y}`;
			this.picCmd = PICCMD_Keep; // reset picCmd
			return ORDER;
		}

	};

	class Radiobutton extends UI_object {
		constructor(x,y,targ_address) {
			super(x,y)
			this.UI_objtype = UIOBJ_radiobutton;
			this.targAddr = targ_address; // RM v[n]
			this.selected = getv(targ_address); // RM v[n]
			this.picCmd = PICCMD_Refresh;
		}


		addStrpic = function(relX,relY,text) { // set relative position to Parent Radiobutton object
			// make a quite simple string picture and add it as a child
			let childstr = new UI_object(relX + this.x,relY + this.y); 
			childstr.settxt(text);
			this.addChild(childstr);
		}

		addButton = function(relX,relY,setnum) {
			// make a simple button that turns on  and add it as a child
			let childbut = new UI_object(relX + this.x,relY + this.y); 
			this.addChild(childbut);
		}

		Lclick = function() {

		}

		UIcheck = function() {
			// check hit box
		}

		render = function() {
			// checkbox,pid,picCmd,text
			// // debug
			let ORDER = "";
			for (let child of this.children) {
				child.picCmd = this.picCmd;
				ORDER += child.picCmd.render();
			};

			this.picCmd = PICCMD_Keep; // reset picCmd
			return ORDER;
		}


	};

	/*
	 *
	 */
	// NsGUImgr is an object which regulates GUI system in your game
	let NsGUImgr = module.NsGUImgr = {

		scene: 0,
		presentations: [],

		resetPresens: function() {
			delete this.presentations;
			this.presentations = [];
		},



		// try
		// this one will be called in RM cev loop per 1f, and give orders to other parallel cev manager, I mean UIrendering and ScaleScript commands. 
		runPresen: function() {

			let UIorderstr = "";

			module.mouse.refresh() // refresh mouse state
			for (let PRESEN of this.presentations) {

				if(PRESEN.is_controllable) { //if the presentation is controllable
					PRESEN.proc() // then run all UI objects in the presentation

					// order strings..

					UIorderstr += PRESEN.UI_RenderingOrder2RMcev;
					SSCmdOrderstr += PRESEN.UI_ScaleCmdOrder2RMcev;

				}

			}

			// give render order string to RPGMaker to execute cmds
			sett(adr_RMstr_UIorder,UIorderstr);

			//sets(adr_RMbool_RUN_RENDER,1); // call render manager
		},


	};





	return module;

})();

